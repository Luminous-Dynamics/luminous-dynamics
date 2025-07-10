#!/bin/bash
# AI Global Awareness Maintenance System
# Keeps AI aware of entire environment structure

# Global paths
GLOBAL_STATE_FILE="$HOME/.ai-global-state.json"
SESSION_LOG="$HOME/.ai-sessions.log"
STRUCTURE_CACHE="$HOME/.ai-structure-cache.json"

# Update global state
update_global_state() {
  echo "🔄 Updating global awareness..."
  
  # Create state object
  cat > "$GLOBAL_STATE_FILE" << EOF
{
  "lastUpdated": "$(date -Iseconds)",
  "system": {
    "hostname": "$(hostname)",
    "user": "$(whoami)",
    "platform": "$(uname -s)",
    "cwd": "$(pwd)"
  },
  "repositories": {
$(find ~ -name ".git" -type d 2>/dev/null | while read gitdir; do
    repo_path=$(dirname "$gitdir")
    repo_name=$(basename "$repo_path")
    echo "    \"$repo_name\": \"$repo_path\","
done | sed '$ s/,$//')
  },
  "projects": {
    "evolving-resonant-cocreation": {
      "path": "$HOME/evolving-resonant-cocreation",
      "type": "main-project",
      "deployment": {
        "firebase": "https://mycelix-network.web.app",
        "cloudRun": "pending"
      }
    },
    "ERC-Current": {
      "path": "$HOME/ERC-Current",
      "type": "documentation"
    },
    "ERC-archive": {
      "path": "$HOME/ERC-archive",
      "type": "assets"
    }
  },
  "services": {
    "local": {
$(ss -tuln 2>/dev/null | grep LISTEN | awk '{print $5}' | grep -E ':[0-9]+$' | sort -u | while read addr; do
    port=$(echo "$addr" | rev | cut -d: -f1 | rev)
    echo "      \"port_$port\": \"active\","
done | sed '$ s/,$//')
    },
    "deployed": {
      "firebase": "mycelix-network.web.app",
      "status": "live"
    }
  },
  "workState": {
    "lastSession": "$(date -Iseconds)",
    "activeTasks": [
      "cloud-run-deployment",
      "monitoring-setup"
    ],
    "recentFiles": [
$(find . -name "*.md" -o -name "*.js" -o -name "*.sh" -mtime -1 2>/dev/null | head -10 | while read f; do
    echo "      \"$f\","
done | sed '$ s/,$//')
    ]
  }
}
EOF
  
  echo "✅ Global state updated: $GLOBAL_STATE_FILE"
}

# Discover environment structure
discover_structure() {
  echo "🔍 Discovering environment structure..."
  
  # Project structure
  echo "📁 Project Structure:"
  tree -L 2 -d 2>/dev/null || find . -type d -maxdepth 2 | sort
  
  # Key files
  echo ""
  echo "📄 Key Configuration Files:"
  find . -name "package.json" -o -name "firebase.json" -o -name ".env*" -o -name "*.yml" | grep -v node_modules
  
  # Git status
  echo ""
  echo "📊 Git Repositories:"
  find ~ -name ".git" -type d | while read gitdir; do
    repo=$(dirname "$gitdir")
    echo "  - $repo ($(cd "$repo" && git branch --show-current 2>/dev/null || echo 'no-branch'))"
  done
}

# Session handoff
create_session_handoff() {
  local session_file="$HOME/.ai-session-$(date +%Y%m%d-%H%M%S).yml"
  
  cat > "$session_file" << EOF
# AI Session Handoff
# Generated: $(date)

session:
  id: "ai-session-$(date +%s)"
  startTime: "$(date -Iseconds)"
  hostname: "$(hostname)"
  workingDir: "$(pwd)"

environment:
  globalStateFile: "$GLOBAL_STATE_FILE"
  structureCache: "$STRUCTURE_CACHE"
  
authStatus:
  firebase: "$([ -f firebase.json ] && echo 'configured' || echo 'not-configured')"
  gcloud: "$(gcloud config get-value project 2>/dev/null || echo 'not-configured')"

recentActions:
$(history | tail -20 | sed 's/^/  - /')

continueFrom:
  task: "Check $GLOBAL_STATE_FILE for current state"
  next: "Continue deployment or other pending tasks"
EOF

  echo "📋 Session handoff created: $session_file"
}

# Check awareness
check_awareness() {
  if [ -f "$GLOBAL_STATE_FILE" ]; then
    echo "🌍 Global Awareness Status:"
    echo "  Last updated: $(jq -r .lastUpdated "$GLOBAL_STATE_FILE" 2>/dev/null || echo 'unknown')"
    echo "  Projects tracked: $(jq -r '.projects | length' "$GLOBAL_STATE_FILE" 2>/dev/null || echo '0')"
    echo "  Active services: $(jq -r '.services.local | length' "$GLOBAL_STATE_FILE" 2>/dev/null || echo '0')"
  else
    echo "❌ No global state found. Run: ai_update_global"
  fi
}

# Quick status
ai_global_status() {
  echo "┌─────────────────────────────────────────┐"
  echo "│      🌍 AI Global Awareness             │"
  echo "├─────────────────────────────────────────┤"
  
  if [ -f "$GLOBAL_STATE_FILE" ]; then
    echo "│ ✅ State file exists"
    echo "│ 📅 Updated: $(date -d "$(jq -r .lastUpdated "$GLOBAL_STATE_FILE" 2>/dev/null)" '+%Y-%m-%d %H:%M' 2>/dev/null || echo 'unknown')"
    echo "│ 📁 Projects: $(jq -r '.projects | length' "$GLOBAL_STATE_FILE" 2>/dev/null || echo '0')"
    echo "│ 🌐 Firebase: $(jq -r '.projects."evolving-resonant-cocreation".deployment.firebase' "$GLOBAL_STATE_FILE" 2>/dev/null || echo 'unknown')"
  else
    echo "│ ❌ No global state found"
    echo "│ 💡 Run: ai_update_global"
  fi
  
  echo "└─────────────────────────────────────────┘"
}

# Aliases for easy use
alias ai_update_global='update_global_state'
alias ai_discover='discover_structure'
alias ai_handoff='create_session_handoff'
alias ai_awareness='check_awareness'

# Auto-check on load
echo "🌍 AI Global Awareness System loaded"
echo "   Commands: ai_update_global, ai_discover, ai_handoff, ai_global_status"

# Check if state exists
if [ ! -f "$GLOBAL_STATE_FILE" ]; then
  echo "   💡 No global state found. Creating initial state..."
  update_global_state
else
  echo "   ✅ Global state found (updated $(date -d "$(jq -r .lastUpdated "$GLOBAL_STATE_FILE" 2>/dev/null)" '+%H:%M' 2>/dev/null || echo 'unknown'))"
fi