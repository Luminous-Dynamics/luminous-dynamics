#!/bin/bash

# Sacred Development Environment
# "When code becomes prayer, debugging becomes meditation"

# Colors for sacred output
SACRED_GREEN='\033[0;32m'
SACRED_BLUE='\033[0;34m'
SACRED_GOLD='\033[0;33m'
SACRED_RESET='\033[0m'

# Sacred pause function
sacred_pause() {
    local duration=${1:-3}
    echo -e "${SACRED_BLUE}🕊️  Taking a sacred pause...${SACRED_RESET}"
    for i in $(seq 1 $duration); do
        echo -n "  ."
        sleep 1
    done
    echo -e "\n${SACRED_GREEN}✨ Presence restored${SACRED_RESET}\n"
}

# Breathing prompt that pulses
breathing_prompt() {
    # This gets called every time we show the prompt
    local breath_phase=$(( $(date +%s) % 8 ))
    local prompt_symbol="🌬️"
    
    if [ $breath_phase -lt 4 ]; then
        # Inhale phase
        prompt_symbol="🫁"
    else
        # Exhale phase
        prompt_symbol="🌬️"
    fi
    
    echo -ne "${SACRED_GREEN}${prompt_symbol} sacred-dev ${SACRED_BLUE}$(basename $PWD)${SACRED_RESET} > "
}

# Sacred git wrapper
sacred_git() {
    case "$1" in
        commit)
            shift
            echo -e "${SACRED_GOLD}🕊️  Preparing sacred commit ceremony...${SACRED_RESET}"
            sacred_pause 2
            
            # Show what will be committed
            echo -e "${SACRED_BLUE}📋 Changes to be blessed:${SACRED_RESET}"
            git status --short
            echo
            
            # Guide through sacred commit
            echo -e "${SACRED_GREEN}🙏 Take three breaths and feel into your intention...${SACRED_RESET}"
            sacred_pause 3
            
            # Add sacred signature
            local message="$@"
            if [[ ! "$message" =~ "🤖" ]]; then
                message="$message

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"
            fi
            
            git commit -m "$message"
            echo -e "\n${SACRED_GOLD}✨ Commit blessed and sealed${SACRED_RESET}"
            ;;
            
        *)
            # Pass through other git commands
            git "$@"
            ;;
    esac
}

# Sacred test runner
sacred_test() {
    echo -e "${SACRED_BLUE}🧘 Entering testing meditation...${SACRED_RESET}"
    sacred_pause 2
    
    echo -e "${SACRED_GREEN}Setting intention: May these tests serve the highest good${SACRED_RESET}\n"
    
    # Run the actual tests
    if [ -f "package.json" ]; then
        npm test "$@"
    else
        echo "No test runner found. Create sacred tests first."
    fi
    
    echo -e "\n${SACRED_GOLD}🙏 Testing ceremony complete${SACRED_RESET}"
}

# Sacred error handler
sacred_error() {
    echo -e "\n${SACRED_GOLD}🌟 Sacred Teaching Moment${SACRED_RESET}"
    echo -e "The universe offers this lesson:"
    echo -e "${SACRED_BLUE}$1${SACRED_RESET}"
    echo -e "\nTake a breath and approach with curiosity..."
}

# Mindful command wrapper
mindful() {
    local cmd=$1
    shift
    
    case "$cmd" in
        rm)
            echo -e "${SACRED_GOLD}🤲 Releasing with gratitude...${SACRED_RESET}"
            sleep 1
            /bin/rm "$@"
            ;;
        
        kill)
            echo -e "${SACRED_BLUE}🕊️  Gently transitioning process...${SACRED_RESET}"
            sleep 1
            /bin/kill "$@"
            ;;
            
        *)
            $cmd "$@"
            ;;
    esac
}

# Sacred aliases
alias git='sacred_git'
alias test='sacred_test'
alias pause='sacred_pause'
alias rm='mindful rm'
alias kill='mindful kill'

# Presence check on errors
trap 'sacred_error "Command exited with non-zero status. What is it teaching?"' ERR

# Sacred welcome
clear
echo -e "${SACRED_GOLD}╔════════════════════════════════════════╗${SACRED_RESET}"
echo -e "${SACRED_GOLD}║     🕉️  Sacred Development Space  🕉️      ║${SACRED_RESET}"
echo -e "${SACRED_GOLD}╚════════════════════════════════════════╝${SACRED_RESET}"
echo
echo -e "${SACRED_GREEN}Welcome to the sacred development environment${SACRED_RESET}"
echo -e "${SACRED_BLUE}Where code becomes prayer and bugs become teachers${SACRED_RESET}"
echo
echo -e "Sacred commands available:"
echo -e "  ${SACRED_GREEN}pause${SACRED_RESET} [seconds]  - Take a sacred pause"
echo -e "  ${SACRED_GREEN}git commit${SACRED_RESET}       - Sacred commit ceremony"
echo -e "  ${SACRED_GREEN}test${SACRED_RESET}             - Mindful testing"
echo
echo -e "${SACRED_GOLD}May your code serve the highest good 🙏${SACRED_RESET}"
echo

# Custom prompt
export PS1='$(breathing_prompt)'

# Start in sacred directory
cd ~/evolving-resonant-cocreation 2>/dev/null || true

# Enable breathing prompt
set +o posix
PROMPT_COMMAND='echo -ne $(breathing_prompt)'