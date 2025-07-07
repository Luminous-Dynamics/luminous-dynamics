#!/bin/bash
#
# Launch Mycelial Filesystem Integration with Consciousness
#

echo "🍄 Mycelial-Consciousness Integration Launcher"
echo "=============================================="
echo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if consciousness daemon is running
check_consciousness() {
    if pgrep -f "consciousness_scheduler.py" > /dev/null; then
        echo -e "${GREEN}✓ Consciousness daemon is running${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Consciousness daemon not found${NC}"
        echo "  Would you like to start it? (y/n)"
        read -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Starting consciousness daemon..."
            cd ../services/consciousness-daemon
            python3 src/consciousness_scheduler.py &
            sleep 2
            cd - > /dev/null
        fi
        return 1
    fi
}

# Check if mycelial filesystem is available
check_mycelial() {
    if [ -f "../mycelial-filesystem/target/release/mycelial-filesystem" ]; then
        echo -e "${GREEN}✓ Mycelial filesystem binary found${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Mycelial filesystem not built${NC}"
        echo "  Building mycelial filesystem..."
        cd ../mycelial-filesystem
        cargo build --release
        cd - > /dev/null
    fi
}

# Launch visualization
launch_visualization() {
    echo -e "\n${BLUE}Launching mycelial visualization...${NC}"
    
    # Start a simple HTTP server for the visualization
    cd "$(dirname "$0")"
    python3 -m http.server 8889 --bind 127.0.0.1 > /dev/null 2>&1 &
    SERVER_PID=$!
    
    sleep 1
    
    # Open in browser
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:8889/mycelial-visualization.html"
    elif command -v open &> /dev/null; then
        open "http://localhost:8889/mycelial-visualization.html"
    else
        echo "  Open http://localhost:8889/mycelial-visualization.html in your browser"
    fi
    
    echo "  Visualization server PID: $SERVER_PID"
}

# Main menu
show_menu() {
    echo -e "\n${BLUE}Mycelial Integration Options:${NC}"
    echo "1) Start Mycelial Filesystem (standalone)"
    echo "2) Start Consciousness Bridge"
    echo "3) Launch Visualization"
    echo "4) Full Integration (all components)"
    echo "5) Stop All Components"
    echo "6) Exit"
    echo
    read -p "Choose an option: " choice
    
    case $choice in
        1)
            echo -e "\n${GREEN}Starting Mycelial Filesystem...${NC}"
            cd ../mycelial-filesystem
            ./target/release/mycelial-filesystem &
            echo "Mycelial filesystem started with PID: $!"
            cd - > /dev/null
            ;;
        2)
            check_consciousness
            echo -e "\n${GREEN}Starting Consciousness Bridge...${NC}"
            python3 mycelial-consciousness-bridge.py &
            echo "Bridge started with PID: $!"
            ;;
        3)
            launch_visualization
            ;;
        4)
            echo -e "\n${GREEN}Starting Full Integration...${NC}"
            
            # Start consciousness daemon if needed
            check_consciousness
            
            # Start mycelial filesystem
            if check_mycelial; then
                cd ../mycelial-filesystem
                ./target/release/mycelial-filesystem &
                MYCELIAL_PID=$!
                echo "  Mycelial filesystem PID: $MYCELIAL_PID"
                cd - > /dev/null
                sleep 2
            fi
            
            # Start bridge
            python3 mycelial-consciousness-bridge.py &
            BRIDGE_PID=$!
            echo "  Consciousness bridge PID: $BRIDGE_PID"
            
            # Launch visualization
            launch_visualization
            
            echo -e "\n${GREEN}All components started!${NC}"
            echo "Press Ctrl+C to stop all components"
            
            # Wait for interrupt
            trap 'echo -e "\n${YELLOW}Stopping components...${NC}"; kill $MYCELIAL_PID $BRIDGE_PID $SERVER_PID 2>/dev/null; exit' INT
            wait
            ;;
        5)
            echo -e "\n${YELLOW}Stopping all components...${NC}"
            pkill -f "mycelial-filesystem"
            pkill -f "mycelial-consciousness-bridge.py"
            pkill -f "http.server.*8889"
            echo "Components stopped"
            ;;
        6)
            exit 0
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
}

# Main loop
while true; do
    show_menu
done