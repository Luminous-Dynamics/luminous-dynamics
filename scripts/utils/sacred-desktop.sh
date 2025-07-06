#!/bin/bash

# 🌟 Sacred Desktop AI - Terminal Edition
# Always-on-top terminal window with AI assistance

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
WINDOW_TITLE="Sacred AI"
DEFAULT_MODEL="llama3.2:3b"

# Function to create floating terminal
create_floating_terminal() {
    # For WSL, we'll use Windows Terminal with special settings
    if command -v wt.exe &> /dev/null; then
        # Windows Terminal command
        wt.exe -w 0 new-tab --title "$WINDOW_TITLE" --suppressApplicationTitle \
            --size 80,30 --position 100,100 \
            bash -c "cd $PWD && ./sacred-desktop.sh run; exec bash" &
    elif command -v gnome-terminal &> /dev/null; then
        # GNOME Terminal
        gnome-terminal --title="$WINDOW_TITLE" \
            --geometry=80x30+100+100 \
            -- bash -c "./sacred-desktop.sh run; exec bash" &
    elif command -v xterm &> /dev/null; then
        # XTerm fallback
        xterm -title "$WINDOW_TITLE" \
            -geometry 80x30+100+100 \
            -e "./sacred-desktop.sh run; exec bash" &
    else
        echo "No suitable terminal found. Running in current terminal."
        ./sacred-desktop.sh run
    fi
}

# Main UI function
sacred_desktop_ui() {
    clear
    
    # Header
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                    🌟 SACRED AI DESKTOP ASSISTANT 🌟                 ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Model: $DEFAULT_MODEL | Commands: /help /model /clear /exit${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Chat interface
run_chat() {
    sacred_desktop_ui
    
    # History file
    HISTORY_FILE="$HOME/.sacred_ai_history"
    touch "$HISTORY_FILE"
    
    # Load history
    if [ -f "$HISTORY_FILE" ]; then
        history -r "$HISTORY_FILE"
    fi
    
    while true; do
        # Prompt with colors
        echo -ne "${GREEN}You: ${NC}"
        read -e -r input
        
        # Save to history
        history -s "$input"
        history -w "$HISTORY_FILE"
        
        # Handle commands
        case "$input" in
            /exit|/quit)
                echo -e "${PURPLE}Sacred blessings on your journey! 🙏${NC}"
                break
                ;;
            /clear)
                sacred_desktop_ui
                continue
                ;;
            /help)
                show_help
                continue
                ;;
            /model*)
                handle_model_command "$input"
                continue
                ;;
            /sacred)
                echo -ne "${GREEN}You: ${NC}"
                read -e -p "From a sacred perspective, " sacred_input
                input="From a sacred perspective, $sacred_input"
                ;;
            /code)
                echo -ne "${GREEN}You: ${NC}"
                read -e -p "Help me code: " code_input
                input="Help me code: $code_input"
                ;;
            /wisdom)
                input="Share brief sacred wisdom for $(date +%A). Include a centering thought and 30-second practice."
                ;;
            /glyph)
                echo -ne "${GREEN}You: ${NC}"
                read -e -p "Guide me through the practice of " glyph_input
                input="Guide me through the sacred practice of $glyph_input"
                ;;
            "")
                continue
                ;;
        esac
        
        # Show AI response
        echo -ne "${BLUE}AI: ${NC}"
        
        # Stream response with typing effect
        response=$(ollama run "$DEFAULT_MODEL" "$input" 2>/dev/null)
        
        # Simple typing effect
        echo "$response" | while IFS= read -r line; do
            echo "$line"
            sleep 0.05
        done
        
        echo ""
    done
}

# Show help
show_help() {
    echo -e "${YELLOW}Sacred AI Commands:${NC}"
    echo "  /help      - Show this help"
    echo "  /sacred    - Sacred perspective mode"
    echo "  /code      - Programming assistance"
    echo "  /wisdom    - Daily sacred wisdom"
    echo "  /glyph     - Sacred practice guidance"
    echo "  /model     - Change AI model"
    echo "  /clear     - Clear screen"
    echo "  /exit      - Exit assistant"
    echo ""
    echo -e "${YELLOW}Shortcuts:${NC}"
    echo "  ↑/↓        - Navigate history"
    echo "  Tab        - Auto-complete"
    echo "  Ctrl+C     - Cancel current"
    echo "  Ctrl+D     - Exit"
    echo ""
}

# Handle model commands
handle_model_command() {
    local cmd="$1"
    
    if [ "$cmd" = "/model" ]; then
        echo "Current model: $DEFAULT_MODEL"
        echo "Available models:"
        ollama list | tail -n +2 | awk '{print "  " $1}'
    else
        local new_model="${cmd#/model }"
        DEFAULT_MODEL="$new_model"
        echo -e "${GREEN}✓ Switched to model: $DEFAULT_MODEL${NC}"
    fi
}

# Create desktop launcher
create_launcher() {
    cat > ~/Desktop/sacred-ai.sh << 'EOF'
#!/bin/bash
cd ~/evolving-resonant-cocreation
./sacred-desktop.sh launch
EOF
    chmod +x ~/Desktop/sacred-ai.sh
    
    echo -e "${GREEN}✅ Desktop launcher created: ~/Desktop/sacred-ai.sh${NC}"
}

# Main script logic
case "${1:-}" in
    run)
        run_chat
        ;;
    launch)
        create_floating_terminal
        ;;
    install)
        create_launcher
        echo -e "${PURPLE}✨ Sacred Desktop AI installed!${NC}"
        echo "Launch with: ./sacred-desktop.sh launch"
        echo "Or double-click the desktop icon"
        ;;
    *)
        # Default: run in current terminal
        echo -e "${PURPLE}🌟 Sacred Desktop AI${NC}"
        echo ""
        echo "Usage:"
        echo "  ./sacred-desktop.sh         - Run in this terminal"
        echo "  ./sacred-desktop.sh launch  - Open floating window"
        echo "  ./sacred-desktop.sh install - Create desktop launcher"
        echo ""
        echo "Starting in 3 seconds... (Ctrl+C to cancel)"
        sleep 3
        run_chat
        ;;
esac