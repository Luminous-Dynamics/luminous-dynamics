#!/bin/bash
# Universal AI Messaging with Domain/Environment Awareness

# Message format with full context
ai_message() {
    local msg_type="${1:-INFO}"
    local message="$2"
    local domain="${3:-$(pwd)}"
    
    # Build context
    local env_context=$(cat << EOF
{
  "timestamp": "$(date -Iseconds)",
  "type": "${msg_type}",
  "message": "${message}",
  "context": {
    "domain": "${domain}",
    "environment": {
      "type": "$([ -f /.dockerenv ] && echo 'docker' || echo 'local')",
      "hostname": "$(hostname)",
      "user": "$(whoami)",
      "pwd": "$(pwd)",
      "isWSL": $(grep -q Microsoft /proc/version 2>/dev/null && echo "true" || echo "false")
    },
    "project": {
      "name": "${PWD##*/}",
      "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'none')",
      "hasFirebase": $([ -f firebase.json ] && echo "true" || echo "false"),
      "hasDocker": $([ -f Dockerfile ] && echo "true" || echo "false")
    },
    "deployment": {
      "target": "$([ -f firebase.json ] && jq -r '.hosting.public' firebase.json 2>/dev/null || echo 'none')",
      "firebase": "$([ -f .firebaserc ] && jq -r '.projects.default' .firebaserc 2>/dev/null || echo 'none')",
      "live": "https://mycelix-network.web.app"
    }
  }
}
EOF
)
    
    # Output formatted message
    echo "$env_context" | jq . 2>/dev/null || echo "[${msg_type}] ${message} @ ${domain}"
}

# Domain-aware action logging
ai_action_domain() {
    local action="$1"
    local domain="$2"
    local target="$3"
    
    case "$domain" in
        "LOCAL")
            echo "[🖥️  LOCAL:${action}] on $(hostname):$(pwd)"
            ;;
        "FIREBASE")
            echo "[🔥 FIREBASE:${action}] → https://mycelix-network.web.app"
            ;;
        "CLOUDRUN")
            echo "[☁️  CLOUDRUN:${action}] → ${target:-pending}"
            ;;
        "DOCKER")
            echo "[🐳 DOCKER:${action}] container: ${target:-local}"
            ;;
        *)
            echo "[🌐 ${domain}:${action}] ${target}"
            ;;
    esac
}

# Enhanced deployment messages
ai_deploy_message() {
    local service="$1"
    local from_env="LOCAL:$(hostname):$(pwd)"
    local to_env=""
    
    case "$service" in
        "firebase")
            to_env="FIREBASE:mycelix-network.web.app"
            ;;
        "cloudrun")
            to_env="CLOUDRUN:us-central1:sacred-council-api"
            ;;
        "docker")
            to_env="DOCKER:gcr.io/mycelix-network/sacred-council"
            ;;
    esac
    
    ai_message "DEPLOY" "Deploying from ${from_env} to ${to_env}" "$service"
}

# Cross-environment awareness
ai_env_sync() {
    echo "🔄 Syncing environment awareness..."
    
    # Local environment
    echo "📍 LOCAL Environment:"
    echo "  Host: $(hostname)"
    echo "  Path: $(pwd)"
    echo "  Git: $(git remote -v 2>/dev/null | head -1 || echo 'no git')"
    
    # Firebase environment
    if [ -f firebase.json ]; then
        echo ""
        echo "🔥 FIREBASE Environment:"
        echo "  Project: $(jq -r '.projects.default' .firebaserc 2>/dev/null || echo 'none')"
        echo "  URL: https://$(jq -r '.projects.default' .firebaserc 2>/dev/null || echo 'none').web.app"
        echo "  Public: $(jq -r '.hosting.public' firebase.json 2>/dev/null)"
    fi
    
    # Cloud Run environment
    if command -v gcloud >/dev/null 2>&1; then
        echo ""
        echo "☁️  CLOUD RUN Environment:"
        echo "  Project: $(gcloud config get-value project 2>/dev/null || echo 'none')"
        echo "  Region: $(gcloud config get-value run/region 2>/dev/null || echo 'us-central1')"
        echo "  Services: $(gcloud run services list --format='value(name)' 2>/dev/null | tr '\n' ' ' || echo 'none')"
    fi
    
    # Docker environment
    if [ -f Dockerfile ] || [ -f docker-compose.yml ]; then
        echo ""
        echo "🐳 DOCKER Environment:"
        echo "  Dockerfiles: $(find . -name "Dockerfile*" | wc -l)"
        echo "  Compose files: $(find . -name "docker-compose*.yml" | wc -l)"
        echo "  Running: $(docker ps --format 'table {{.Names}}' 2>/dev/null | tail -n +2 | tr '\n' ' ' || echo 'docker not running')"
    fi
}

# Message routing based on environment
ai_route_message() {
    local target="$1"
    local message="$2"
    
    case "$target" in
        "local")
            echo "[LOCAL→LOCAL] $message"
            # Could write to local file/socket
            ;;
        "firebase")
            echo "[LOCAL→FIREBASE] $message"
            # Could use Firebase SDK
            ;;
        "cloudrun")
            echo "[LOCAL→CLOUDRUN] $message"
            # Could use gcloud logging
            ;;
        "all")
            echo "[LOCAL→BROADCAST] $message"
            # Send to all environments
            ;;
    esac
}

# WebSocket message with environment context
ai_websocket_message() {
    local ws_url="${1:-ws://localhost:3333}"
    local message="$2"
    
    local ws_message=$(cat << EOF
{
  "type": "ai:message",
  "source": {
    "environment": "LOCAL",
    "hostname": "$(hostname)",
    "path": "$(pwd)",
    "user": "$(whoami)"
  },
  "target": {
    "environment": "WEBSOCKET",
    "url": "${ws_url}"
  },
  "message": "${message}",
  "timestamp": "$(date -Iseconds)"
}
EOF
)
    
    echo "$ws_message" | jq . 2>/dev/null
}

# Create unified message log
ai_log_message() {
    local log_file="$HOME/.ai-messages.jsonl"
    local msg_json="$1"
    
    echo "$msg_json" >> "$log_file"
    echo "📝 Message logged to: $log_file"
}

# Aliases
alias ai_msg='ai_message'
alias ai_deploy_msg='ai_deploy_message'
alias ai_sync='ai_env_sync'
alias ai_route='ai_route_message'
alias ai_ws='ai_websocket_message'

echo "🌐 Universal Messaging System loaded"
echo "   Commands: ai_msg, ai_deploy_msg, ai_sync, ai_route, ai_ws"
echo "   All messages include domain/environment context!"