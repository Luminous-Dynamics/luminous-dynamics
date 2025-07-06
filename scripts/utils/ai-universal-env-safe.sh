#!/bin/bash
# Universal AI Environment with Graceful Failback
# Safe for ANY terminal, ANY AI, ANY situation

# Safe command checking
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Failback JSON generator (works even with basic shell)
ai_env_basic() {
    echo "{"
    echo "  \"status\": \"basic-mode\","
    echo "  \"hostname\": \"$(hostname 2>/dev/null || echo 'unknown')\","
    echo "  \"path\": \"$(pwd 2>/dev/null || echo 'unknown')\","
    echo "  \"user\": \"$(whoami 2>/dev/null || echo 'unknown')\""
    echo "}"
}

# Safe environment check with failbacks
ai_env_check_safe() {
    # Try full version first
    if command_exists jq && command_exists git; then
        ai_env_check 2>/dev/null || ai_env_basic
    else
        # Failback to basic
        ai_env_basic
    fi
}

# Safe status with error handling
ai_status_safe() {
    {
        echo "┌─────────────────────────────────────┐"
        echo "│   🤖 Universal AI Environment       │"
        echo "├─────────────────────────────────────┤"
        echo "│ Location: $(hostname 2>/dev/null || echo 'unknown')"
        echo "│ Project: ${PWD##*/}"
        echo "│ Status: $([ -d .git ] && echo 'git-enabled' || echo 'no-git')"
        echo "│ AI Type: ${AI_TYPE:-universal}"
        echo "└─────────────────────────────────────┘"
    } 2>/dev/null || {
        # Ultra-safe failback
        echo "[AI_ENV] Basic mode - limited features available"
        echo "[AI_ENV] Working directory: $(pwd)"
    }
}

# Test critical commands on load
check_environment() {
    local warnings=()
    
    # Check critical commands
    command_exists git || warnings+=("git not found - version control limited")
    command_exists node || warnings+=("node not found - can't run JS tools")
    command_exists npx || warnings+=("npx not found - Firebase deployment limited")
    command_exists gcloud || warnings+=("gcloud not found - Cloud Run deployment unavailable")
    
    # Check critical files
    [ -f ".ai-environment.yml" ] || warnings+=("config file missing - using defaults")
    [ -f "firebase.json" ] || warnings+=("Firebase config missing")
    
    # Report warnings
    if [ ${#warnings[@]} -gt 0 ]; then
        echo "[AI_ENV] ⚠️  Warnings detected:"
        for warning in "${warnings[@]}"; do
            echo "  - $warning"
        done
        echo "[AI_ENV] ✅ Failback mode active - basic features available"
    else
        echo "[AI_ENV] ✅ Full environment loaded successfully"
    fi
}

# Deployment check with failbacks
ai_deploy_check_safe() {
    echo "[DEPLOY_CHECK]"
    
    # Check Firebase
    if command_exists npx && [ -f "firebase.json" ]; then
        echo "  Firebase: READY (token auth available)"
    else
        echo "  Firebase: UNAVAILABLE (missing tools/config)"
        echo "  Failback: Manual deployment required"
    fi
    
    # Check Cloud Run
    if command_exists gcloud; then
        echo "  Cloud Run: READY (requires auth)"
    else
        echo "  Cloud Run: UNAVAILABLE (gcloud not installed)"
        echo "  Failback: Use Cloud Console UI"
    fi
    
    # Check Docker
    if command_exists docker; then
        echo "  Docker: READY"
    else
        echo "  Docker: UNAVAILABLE"
        echo "  Failback: Use Cloud Build"
    fi
}

# Safe action wrapper with error handling
ai_action_safe() {
    local action_type=${1:-"UNKNOWN"}
    local description=${2:-"No description"}
    
    {
        echo "[${action_type}] ${description}"
        echo "  Time: $(date '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo 'unknown')"
        echo "  User: $(whoami 2>/dev/null || echo 'unknown')"
        echo "  Dir: $(pwd 2>/dev/null || echo 'unknown')"
    } 2>/dev/null || {
        # Ultra-minimal failback
        echo "[$1] $2"
    }
}

# Error recovery helper
ai_recover() {
    echo "[AI_RECOVERY] Attempting to restore environment..."
    
    # Try to restore PATH
    export PATH="$PATH:/usr/local/bin:/usr/bin:/bin"
    
    # Check what we have
    echo "[AI_RECOVERY] Available tools:"
    command_exists bash && echo "  ✓ bash"
    command_exists python3 && echo "  ✓ python3"
    command_exists curl && echo "  ✓ curl"
    command_exists wget && echo "  ✓ wget"
    
    echo "[AI_RECOVERY] Failback options:"
    echo "  - Use web console for deployments"
    echo "  - Copy files manually"
    echo "  - Run basic shell commands"
}

# Create aliases for safe versions
alias ai_env_check='ai_env_check_safe'
alias ai_status='ai_status_safe'
alias ai_deploy_check='ai_deploy_check_safe'
alias ai_action='ai_action_safe'

# Run environment check on load
check_environment

# Export for other scripts
export -f command_exists
export -f ai_env_basic
export -f ai_recover