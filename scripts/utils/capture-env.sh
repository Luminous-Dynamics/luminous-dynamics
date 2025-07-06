#!/bin/bash

# Capture full environment data for any path/context

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
  else
    # Local path environment
    echo "TYPE: LOCAL"
    echo "PATH: $path"
    echo "ABSOLUTE: $(realpath -m $path 2>/dev/null || echo $path)"
    echo "EXISTS: $([ -e "$path" ] && echo "yes" || echo "no")"
    
    if [ -e "$path" ]; then
      echo "IS_FILE: $([ -f "$path" ] && echo "yes" || echo "no")"
      echo "IS_DIR: $([ -d "$path" ] && echo "yes" || echo "no")"
      echo "PERMISSIONS: $(stat -c %a "$path" 2>/dev/null)"
      echo "OWNER: $(stat -c %U:%G "$path" 2>/dev/null)"
      echo "SIZE: $(stat -c %s "$path" 2>/dev/null)"
      echo "MODIFIED: $(stat -c %Y "$path" 2>/dev/null)"
      
      # Git info if in repo
      if git -C "$path" rev-parse --git-dir &>/dev/null; then
        echo "GIT_REPO: yes"
        echo "GIT_BRANCH: $(git -C "$path" branch --show-current 2>/dev/null)"
        echo "GIT_COMMIT: $(git -C "$path" rev-parse --short HEAD 2>/dev/null)"
        echo "GIT_STATUS: $(git -C "$path" status --porcelain | wc -l) changes"
      else
        echo "GIT_REPO: no"
      fi
    fi
    
    # System info
    echo "SYSTEM: $(uname -s)"
    echo "HOSTNAME: $(hostname)"
    echo "USER: $(whoami)"
    echo "PWD: $(pwd)"
    echo "SHELL: $SHELL"
  fi
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
  echo "TIMEZONE: $(date +%Z)"
  echo "UPTIME: $(uptime -p)"
  echo "LOAD: $(uptime | grep -oP 'load average: \K.*')"
  echo "MEMORY: $(free -h | grep Mem | awk '{print $3 "/" $2}')"
  echo "DISK: $(df -h . | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')"
  
  # Process context
  echo "PROCESS_ID: $$"
  echo "PARENT_PID: $PPID"
  echo "SESSION_ID: $(ps -p $$ -o sid= | tr -d ' ')"
  
  # Network context (if relevant)
  if command -v ip &>/dev/null; then
    echo "IP_ADDRESSES: $(ip -br addr | grep UP | awk '{print $3}' | tr '\n' ' ')"
  fi
  
  # Docker context (if in container)
  if [ -f /.dockerenv ]; then
    echo "CONTAINER: yes"
    echo "CONTAINER_ID: $(cat /proc/self/cgroup | grep -oP '(?<=docker/)[a-f0-9]+' | head -1)"
  else
    echo "CONTAINER: no"
  fi
  
  # WSL context
  if grep -qi microsoft /proc/version; then
    echo "WSL: yes"
    echo "WSL_DISTRO: $WSL_DISTRO_NAME"
    echo "WSL_VERSION: $(wsl.exe --version | head -1 2>/dev/null || echo 'unknown')"
  else
    echo "WSL: no"
  fi
}

# Store in database with full env
store_with_env() {
  local living="$1"
  local working="$2"
  local message="$3"
  
  local env_data=$(capture_full_env "$living" "$working" | base64 -w0)
  
  sqlite3 /home/tstoltz/evolving-resonant-cocreation/the-weave/core/data/message-tracking.db "
    CREATE TABLE IF NOT EXISTS messages_with_env (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER DEFAULT (strftime('%s', 'now')),
      living_path TEXT NOT NULL,
      working_path TEXT NOT NULL,
      message TEXT NOT NULL,
      env_data_base64 TEXT,
      agent_name TEXT DEFAULT 'claude'
    );
    
    INSERT INTO messages_with_env (living_path, working_path, message, env_data_base64)
    VALUES ('$living', '$working', '$message', '$env_data');
  "
  
  echo "✓ Message tracked with full environment"
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
  *)
    echo "Usage:"
    echo "  $0 env <living_path> <working_path>  # Show full env"
    echo "  $0 store <living_path> <working_path> <message>  # Store with env"
    echo "  $0 decode <message_id>  # Decode stored env"
    ;;
esac