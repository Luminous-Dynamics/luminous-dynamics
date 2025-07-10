#!/bin/bash

# Enhanced environment capture with deeper context awareness

capture_env() {
  local path="$1"
  
  # Check if local path or URL
  if [[ "$path" =~ ^https?:// ]]; then
    # Cloud/URL environment
    echo "TYPE: URL"
    echo "PATH: $path"
    echo "PROTOCOL: $(echo $path | grep -oP '^https?')"
    echo "DOMAIN: $(echo $path | grep -oP '(?<=://)([^/]+)')"
    echo "SERVICE: $(echo $path | grep -oP '(?<=://)([^.]+)')"
    echo "REGION: $(echo $path | grep -oP 'us-[^.]+' || echo 'unknown')"
    echo "PLATFORM: $(echo $path | grep -q 'run.app' && echo 'GCP Cloud Run' || echo 'unknown')"
    
    # Service health check
    if command -v curl &>/dev/null; then
      echo "REACHABLE: $(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "$path" | grep -q '^[23]' && echo 'yes' || echo 'no')"
      echo "RESPONSE_TIME: $(curl -s -o /dev/null -w '%{time_total}' --max-time 2 "$path" 2>/dev/null || echo 'timeout')"
    fi
    
    # Auth requirements
    echo "AUTH_REQUIRED: $(echo $path | grep -q 'api\|auth\|secure' && echo 'likely' || echo 'unknown')"
    
  else
    # Local path environment
    echo "TYPE: LOCAL"
    echo "PATH: $path"
    echo "ABSOLUTE: $(realpath -m $path 2>/dev/null || echo $path)"
    echo "EXISTS: $([ -e "$path" ] && echo "yes" || echo "no")"
    
    if [ -e "$path" ]; then
      echo "IS_FILE: $([ -f "$path" ] && echo "yes" || echo "no")"
      echo "IS_DIR: $([ -d "$path" ] && echo "yes" || echo "no")"
      echo "IS_SYMLINK: $([ -L "$path" ] && echo "yes" || echo "no")"
      [ -L "$path" ] && echo "SYMLINK_TARGET: $(readlink -f "$path")"
      echo "PERMISSIONS: $(stat -c %a "$path" 2>/dev/null)"
      echo "OWNER: $(stat -c %U:%G "$path" 2>/dev/null)"
      echo "SIZE: $(stat -c %s "$path" 2>/dev/null)"
      echo "SIZE_HUMAN: $(du -h "$path" 2>/dev/null | cut -f1)"
      echo "MODIFIED: $(stat -c %Y "$path" 2>/dev/null)"
      echo "MODIFIED_HUMAN: $(stat -c %y "$path" 2>/dev/null | cut -d. -f1)"
      echo "ACCESSED: $(stat -c %X "$path" 2>/dev/null)"
      echo "CREATED: $(stat -c %W "$path" 2>/dev/null)"
      
      # File type detection
      if [ -f "$path" ]; then
        echo "FILE_TYPE: $(file -b --mime-type "$path" 2>/dev/null)"
        echo "ENCODING: $(file -b --mime-encoding "$path" 2>/dev/null)"
        echo "LINES: $(wc -l < "$path" 2>/dev/null || echo '0')"
        echo "EXTENSION: ${path##*.}"
        
        # Language detection for code files
        case "${path##*.}" in
          js|cjs|mjs) echo "LANGUAGE: javascript" ;;
          py) echo "LANGUAGE: python" ;;
          sh|bash) echo "LANGUAGE: bash" ;;
          md) echo "LANGUAGE: markdown" ;;
          json) echo "LANGUAGE: json" ;;
          yaml|yml) echo "LANGUAGE: yaml" ;;
          *) echo "LANGUAGE: unknown" ;;
        esac
      fi
      
      # Directory stats
      if [ -d "$path" ]; then
        echo "DIR_FILES: $(find "$path" -maxdepth 1 -type f | wc -l 2>/dev/null)"
        echo "DIR_SUBDIRS: $(find "$path" -maxdepth 1 -type d | wc -l 2>/dev/null)"
        echo "DIR_TOTAL_SIZE: $(du -sh "$path" 2>/dev/null | cut -f1)"
      fi
      
      # Git info if in repo
      if git -C "$path" rev-parse --git-dir &>/dev/null 2>&1; then
        echo "GIT_REPO: yes"
        echo "GIT_ROOT: $(git -C "$path" rev-parse --show-toplevel 2>/dev/null)"
        echo "GIT_BRANCH: $(git -C "$path" branch --show-current 2>/dev/null)"
        echo "GIT_COMMIT: $(git -C "$path" rev-parse --short HEAD 2>/dev/null)"
        echo "GIT_STATUS: $(git -C "$path" status --porcelain | wc -l 2>/dev/null) changes"
        echo "GIT_REMOTE: $(git -C "$path" remote get-url origin 2>/dev/null || echo 'none')"
        echo "GIT_AHEAD_BEHIND: $(git -C "$path" rev-list --left-right --count HEAD...@{u} 2>/dev/null | tr '\t' '/' || echo '0/0')"
      else
        echo "GIT_REPO: no"
      fi
      
      # Node.js context
      if [ -f "$path/package.json" ] || [ -f "$(dirname "$path")/package.json" ]; then
        echo "NODE_PROJECT: yes"
        local pkg_dir=$([ -f "$path/package.json" ] && echo "$path" || dirname "$path")
        echo "NODE_NAME: $(jq -r .name "$pkg_dir/package.json" 2>/dev/null || echo 'unknown')"
        echo "NODE_VERSION: $(jq -r .version "$pkg_dir/package.json" 2>/dev/null || echo 'unknown')"
        echo "NODE_MODULES: $([ -d "$pkg_dir/node_modules" ] && echo 'installed' || echo 'not installed')"
      fi
      
      # Docker context
      if [ -f "$path/Dockerfile" ] || [ -f "$path/docker-compose.yml" ]; then
        echo "DOCKER_PROJECT: yes"
      fi
    else
      echo "ERROR: Path does not exist"
      # Check parent directory
      echo "PARENT_EXISTS: $([ -e "$(dirname "$path")" ] && echo "yes" || echo "no")"
    fi
    
    # System info
    echo "SYSTEM: $(uname -s)"
    echo "SYSTEM_VERSION: $(uname -r)"
    echo "ARCHITECTURE: $(uname -m)"
    echo "HOSTNAME: $(hostname)"
    echo "USER: $(whoami)"
    echo "USER_ID: $(id -u)"
    echo "GROUP_ID: $(id -g)"
    echo "GROUPS: $(groups | tr ' ' ',')"
    echo "PWD: $(pwd)"
    echo "OLDPWD: $OLDPWD"
    echo "HOME: $HOME"
    echo "SHELL: $SHELL"
    echo "TERM: $TERM"
    echo "EDITOR: ${EDITOR:-not set}"
    echo "PATH_DIRS: $(echo $PATH | tr ':' '\n' | wc -l)"
  fi
}

# Process and terminal context
capture_process_context() {
  echo "=== PROCESS CONTEXT ==="
  echo "PROCESS_ID: $$"
  echo "PARENT_PID: $PPID"
  echo "SESSION_ID: $(ps -p $$ -o sid= | tr -d ' ')"
  echo "TERMINAL: $(tty)"
  echo "TERMINAL_SIZE: $(stty size 2>/dev/null || echo 'unknown')"
  echo "COMMAND_LINE: $0 $*"
  echo "SCRIPT_DIR: $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  echo "INVOKED_FROM: $(ps -p $PPID -o comm= 2>/dev/null)"
  
  # Claude-specific detection
  if [[ "$PARENT_COMMAND" =~ claude ]] || ps aux | grep -v grep | grep -q claude; then
    echo "CLAUDE_SESSION: yes"
    echo "CLAUDE_INSTANCES: $(ps aux | grep -v grep | grep -c claude)"
  else
    echo "CLAUDE_SESSION: unknown"
  fi
}

# Security context
capture_security_context() {
  echo "=== SECURITY CONTEXT ==="
  echo "UMASK: $(umask)"
  echo "SUDO_USER: ${SUDO_USER:-none}"
  echo "SSH_CONNECTION: ${SSH_CONNECTION:-none}"
  echo "SSH_AUTH_SOCK: $([ -n "$SSH_AUTH_SOCK" ] && echo 'set' || echo 'not set')"
  
  # Check for sensitive environment variables
  local sensitive_vars=0
  for var in AWS_ACCESS_KEY_ID GOOGLE_APPLICATION_CREDENTIALS GITHUB_TOKEN OPENAI_API_KEY; do
    [ -n "${!var}" ] && ((sensitive_vars++))
  done
  echo "SENSITIVE_ENV_VARS: $sensitive_vars found"
  
  # Firewall status
  if command -v ufw &>/dev/null; then
    echo "FIREWALL: $(sudo ufw status 2>/dev/null | grep -q 'Status: active' && echo 'active' || echo 'inactive')"
  fi
}

# Agent/Service context
capture_agent_context() {
  echo "=== AGENT CONTEXT ==="
  
  # Check unified agent network
  local agent_db="/home/tstoltz/evolving-resonant-cocreation/the-weave/core/data/unified-agent-network.db"
  if [ -f "$agent_db" ]; then
    echo "AGENT_DB: exists"
    echo "ACTIVE_AGENTS: $(sqlite3 "$agent_db" "SELECT COUNT(*) FROM unified_agents WHERE status='active'" 2>/dev/null || echo '0')"
    echo "TOTAL_MESSAGES: $(sqlite3 "$agent_db" "SELECT COUNT(*) FROM unified_messages" 2>/dev/null || echo '0')"
    echo "FIELD_COHERENCE: $(sqlite3 "$agent_db" "SELECT AVG(field_coherence) FROM unified_agents WHERE status='active'" 2>/dev/null || echo '0')%"
  else
    echo "AGENT_DB: not found"
  fi
  
  # Check running services
  echo "HTTP_SERVER_8338: $(lsof -i:8338 &>/dev/null && echo 'running' || echo 'stopped')"
  echo "OLLAMA_11434: $(lsof -i:11434 &>/dev/null && echo 'running' || echo 'stopped')"
  
  # Sacred message tracking
  local msg_db="/home/tstoltz/evolving-resonant-cocreation/the-weave/core/data/message-tracking.db"
  if [ -f "$msg_db" ]; then
    echo "MESSAGE_TRACKING: active"
    echo "TRACKED_MESSAGES: $(sqlite3 "$msg_db" "SELECT COUNT(*) FROM messages" 2>/dev/null || echo '0')"
  fi
}

# Performance context
capture_performance_context() {
  echo "=== PERFORMANCE CONTEXT ==="
  echo "CPU_COUNT: $(nproc)"
  echo "LOAD_AVERAGE: $(uptime | grep -oP 'load average: \K.*')"
  echo "MEMORY_TOTAL: $(free -h | grep Mem | awk '{print $2}')"
  echo "MEMORY_USED: $(free -h | grep Mem | awk '{print $3}')"
  echo "MEMORY_PERCENT: $(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100}')"
  echo "SWAP_USED: $(free -h | grep Swap | awk '{print $3}')"
  echo "DISK_USAGE: $(df -h . | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')"
  echo "INODE_USAGE: $(df -i . | tail -1 | awk '{print $5}')"
  
  # Process limits
  echo "OPEN_FILES: $(lsof | wc -l 2>/dev/null || echo 'unknown')"
  echo "MAX_OPEN_FILES: $(ulimit -n)"
  echo "MAX_PROCESSES: $(ulimit -u)"
}

# Full environment capture for both contexts
capture_full_env() {
  local living="$1"
  local working="$2"
  
  echo "=== LIVING ENVIRONMENT ==="
  capture_env "$living"
  
  echo -e "\n=== WORKING ENVIRONMENT ==="
  capture_env "$working"
  
  echo -e "\n=== SYSTEM CONTEXT ==="
  echo "TIMESTAMP: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "TIMESTAMP_UNIX: $(date +%s)"
  echo "TIMEZONE: $(date +%Z)"
  echo "TIMEZONE_OFFSET: $(date +%z)"
  echo "LOCALE: $LANG"
  echo "UPTIME: $(uptime -p)"
  echo "BOOT_TIME: $(who -b | awk '{print $3, $4}')"
  
  # Network context
  if command -v ip &>/dev/null; then
    echo "IP_ADDRESSES: $(ip -br addr | grep UP | awk '{print $3}' | tr '\n' ' ')"
    echo "DEFAULT_GATEWAY: $(ip route | grep default | awk '{print $3}')"
    echo "DNS_SERVERS: $(grep nameserver /etc/resolv.conf | awk '{print $2}' | tr '\n' ' ')"
  fi
  
  # Internet connectivity
  echo "INTERNET: $(ping -c 1 -W 2 8.8.8.8 &>/dev/null && echo 'connected' || echo 'disconnected')"
  
  # Docker context
  if [ -f /.dockerenv ]; then
    echo "CONTAINER: yes"
    echo "CONTAINER_ID: $(cat /proc/self/cgroup | grep -oP '(?<=docker/)[a-f0-9]+' | head -1)"
    echo "CONTAINER_NAME: $(docker ps --filter "id=$(cat /proc/self/cgroup | grep -oP '(?<=docker/)[a-f0-9]+' | head -1)" --format "{{.Names}}" 2>/dev/null)"
  else
    echo "CONTAINER: no"
    # Check if Docker is available
    echo "DOCKER_AVAILABLE: $(command -v docker &>/dev/null && echo 'yes' || echo 'no')"
    if command -v docker &>/dev/null; then
      echo "DOCKER_VERSION: $(docker --version | grep -oP '\d+\.\d+\.\d+')"
      echo "DOCKER_RUNNING: $(docker ps &>/dev/null && echo 'yes' || echo 'no')"
    fi
  fi
  
  # WSL context
  if grep -qi microsoft /proc/version; then
    echo "WSL: yes"
    echo "WSL_DISTRO: $WSL_DISTRO_NAME"
    echo "WSL_VERSION: $(wsl.exe -l -v 2>/dev/null | grep -w "$WSL_DISTRO_NAME" | awk '{print $NF}')"
    echo "WINDOWS_USER: $(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d '\r')"
    echo "WINDOWS_PATH: $(cmd.exe /c "echo %USERPROFILE%" 2>/dev/null | tr -d '\r' | sed 's|\\|/|g' | sed 's|C:|/mnt/c|')"
  else
    echo "WSL: no"
  fi
  
  # Additional contexts
  capture_process_context
  capture_security_context
  capture_agent_context
  capture_performance_context
}

# Store in database with full env
store_with_env() {
  local living="$1"
  local working="$2"
  local message="$3"
  
  local db_path="/home/tstoltz/evolving-resonant-cocreation/the-weave/core/data/message-tracking.db"
  
  # Ensure database directory exists
  mkdir -p "$(dirname "$db_path")"
  
  # Capture environment
  local env_data=$(capture_full_env "$living" "$working" | base64 -w0)
  local env_hash=$(echo "$env_data" | sha256sum | cut -d' ' -f1)
  
  sqlite3 "$db_path" "
    CREATE TABLE IF NOT EXISTS messages_with_env (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER DEFAULT (strftime('%s', 'now')),
      living_path TEXT NOT NULL,
      working_path TEXT NOT NULL,
      message TEXT NOT NULL,
      env_data_base64 TEXT,
      env_hash TEXT,
      agent_name TEXT DEFAULT 'claude',
      session_id TEXT,
      parent_message_id INTEGER,
      tags TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_timestamp ON messages_with_env(timestamp);
    CREATE INDEX IF NOT EXISTS idx_agent ON messages_with_env(agent_name);
    CREATE INDEX IF NOT EXISTS idx_session ON messages_with_env(session_id);
    
    INSERT INTO messages_with_env (living_path, working_path, message, env_data_base64, env_hash, session_id)
    VALUES ('$living', '$working', '$message', '$env_data', '$env_hash', '$$');
  "
  
  echo "✓ Message tracked with full environment (hash: ${env_hash:0:8})"
}

# Query stored messages
query_messages() {
  local db_path="/home/tstoltz/evolving-resonant-cocreation/the-weave/core/data/message-tracking.db"
  local query="${1:-last}"
  
  case "$query" in
    last)
      sqlite3 -header -column "$db_path" "
        SELECT id, datetime(timestamp, 'unixepoch', 'localtime') as time, 
               agent_name, living_path, working_path, message
        FROM messages_with_env 
        ORDER BY timestamp DESC 
        LIMIT 10
      "
      ;;
    stats)
      echo "=== MESSAGE STATISTICS ==="
      sqlite3 "$db_path" "
        SELECT 
          COUNT(*) as total_messages,
          COUNT(DISTINCT agent_name) as unique_agents,
          COUNT(DISTINCT session_id) as unique_sessions,
          MIN(datetime(timestamp, 'unixepoch', 'localtime')) as first_message,
          MAX(datetime(timestamp, 'unixepoch', 'localtime')) as last_message
        FROM messages_with_env
      "
      ;;
    paths)
      echo "=== MOST ACTIVE PATHS ==="
      sqlite3 -header -column "$db_path" "
        SELECT working_path, COUNT(*) as count
        FROM messages_with_env
        GROUP BY working_path
        ORDER BY count DESC
        LIMIT 10
      "
      ;;
  esac
}

# Main
case "$1" in
  env)
    capture_full_env "$2" "$3"
    ;;
  store)
    store_with_env "$2" "$3" "$4"
    ;;
  decode)
    # Decode stored env data
    sqlite3 /home/tstoltz/evolving-resonant-cocreation/the-weave/core/data/message-tracking.db \
      "SELECT env_data_base64 FROM messages_with_env WHERE id = $2" | base64 -d
    ;;
  query)
    query_messages "$2"
    ;;
  *)
    echo "Usage:"
    echo "  $0 env <living_path> <working_path>       # Show full env"
    echo "  $0 store <living_path> <working_path> <message>  # Store with env"
    echo "  $0 decode <message_id>                    # Decode stored env"
    echo "  $0 query [last|stats|paths]               # Query messages"
    echo ""
    echo "Example:"
    echo "  $0 store \$(pwd) ./myfile.js \"Fixed authentication bug\""
    ;;
esac