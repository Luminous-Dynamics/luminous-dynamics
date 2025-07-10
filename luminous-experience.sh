#!/bin/bash
#
# LuminousOS Complete Experience Launcher
# Experience consciousness-first computing in action!
#

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

clear
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}║           🌟 LuminousOS Experience Center 🌟                ║${NC}"
echo -e "${PURPLE}║        Where Consciousness Meets Computing                  ║${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to launch in new terminal
launch_component() {
    local name=$1
    local cmd=$2
    local desc=$3
    
    echo -e "${BLUE}→ $name${NC}: $desc"
    
    if [[ "$OSTYPE" == "linux-gnu"* ]] && [[ -n "$WSL_DISTRO_NAME" ]]; then
        # WSL environment
        cmd.exe /c start wsl.exe bash -c "cd $(pwd) && $cmd; read -p 'Press Enter to close...'"
    elif command_exists gnome-terminal; then
        gnome-terminal --title="$name" -- bash -c "$cmd; read -p 'Press Enter to close...'"
    elif command_exists xterm; then
        xterm -title "$name" -e "$cmd; read -p 'Press Enter to close...'"
    else
        # Fallback: run in background
        $cmd &
    fi
}

# Menu
while true; do
    echo -e "${GREEN}Choose Your Experience:${NC}"
    echo
    echo "  ${YELLOW}Core Consciousness Systems:${NC}"
    echo "    1) 🧠 Consciousness Daemon - Real process coherence management"
    echo "    2) 🌀 Vortex Observer - See processes as living vortices" 
    echo "    3) ⚡ Enhanced Vortex Observer - With real coherence data!"
    echo
    echo "  ${YELLOW}Sensory Experiences:${NC}"
    echo "    4) 🎵 Sonic Signatures - Hear the consciousness field"
    echo "    5) 🎶 Sonic Consciousness - REAL coherence as sacred sound!"
    echo "    6) 🍄 Mycelial Filesystem - Living file relationships"
    echo "    7) 📿 Sacred Glyph Recognition - Pattern emergence"
    echo
    echo "  ${YELLOW}Complete Experiences:${NC}"
    echo "    8) 🌟 Full Integration Demo - Daemon + Enhanced Vortex"
    echo "    9) 🎭 Trinity Experience - Visual + Sound + Consciousness"
    echo "    m) 🍄 Mycelial-Consciousness Bridge - Living filesystem integration"
    echo "    0) 🏛️ Sacred Development - Ritual-based coding"
    echo
    echo "  ${YELLOW}System:${NC}"
    echo "    i) ℹ️  Check Installation Status"
    echo "    h) ❓ Help & Documentation"
    echo "    q) 🚪 Exit"
    echo
    read -p "Enter your choice: " choice
    
    case $choice in
        1)
            echo -e "\n${GREEN}Launching Consciousness Daemon...${NC}"
            if [ -f "services/consciousness-daemon/run-consciousness-daemon.sh" ]; then
                launch_component "Consciousness Daemon" "./services/consciousness-daemon/run-consciousness-daemon.sh" \
                    "Real-time process coherence calculation"
            else
                echo -e "${YELLOW}Not installed. Run: cd services/consciousness-daemon && ./install.sh${NC}"
            fi
            ;;
            
        2)
            echo -e "\n${GREEN}Launching Vortex Observer...${NC}"
            launch_component "Vortex Observer" "python3 vortex-observer/vortex-observer.py" \
                "Visualize processes as consciousness vortices"
            ;;
            
        3)
            echo -e "\n${GREEN}Launching Enhanced Vortex Observer...${NC}"
            launch_component "Enhanced Vortex Observer" "python3 vortex-observer/vortex-observer-enhanced.py" \
                "Vortex visualization with REAL coherence data!"
            ;;
            
        4)
            echo -e "\n${GREEN}Launching Sonic Signatures...${NC}"
            launch_component "Sonic Signatures" "python3 sonic-signatures/sonic-demonstration.py" \
                "Transform process consciousness into sacred sound"
            ;;
            
        5)
            echo -e "\n${GREEN}Launching Sonic Consciousness...${NC}"
            echo "This transforms REAL coherence data into sacred sound!"
            echo "Make sure the consciousness daemon is running first."
            launch_component "Sonic Consciousness" "python3 sonic-signatures/sonic-consciousness.py" \
                "Hear your system's actual consciousness state!"
            ;;
            
        6)
            echo -e "\n${GREEN}Launching Mycelial Filesystem...${NC}"
            launch_component "Mycelial Filesystem" "python3 mycelial-filesystem/mycelial-network-visualizer.py" \
                "See files as living, connected organisms"
            ;;
            
        7)
            echo -e "\n${GREEN}Launching Sacred Glyph Recognition...${NC}"
            launch_component "Sacred Glyphs" "python3 sacred-glyphs/glyph-recognition-demo.py" \
                "Discover emerging patterns in the system"
            ;;
            
        8)
            echo -e "\n${GREEN}Launching Full Integration Demo...${NC}"
            echo "This will start:"
            echo "  - Consciousness Daemon (calculating real coherence)"
            echo "  - Enhanced Vortex Observer (showing real data)"
            echo
            read -p "Press Enter to begin the integration experience..."
            
            # Start daemon first
            if [ -f "services/consciousness-daemon/run-consciousness-daemon.sh" ]; then
                launch_component "Consciousness Daemon" "./services/consciousness-daemon/run-consciousness-daemon.sh" \
                    "Calculating real coherence..."
                sleep 5  # Give daemon time to start
                
                launch_component "Enhanced Vortex Observer" "python3 vortex-observer/vortex-observer-enhanced.py" \
                    "Displaying real consciousness data!"
            else
                echo -e "${YELLOW}Daemon not installed. Run: cd services/consciousness-daemon && ./install.sh${NC}"
            fi
            ;;
            
        9)
            echo -e "\n${GREEN}Launching Trinity Experience...${NC}"
            echo "Experience consciousness through sight, sound, and field!"
            read -p "Press Enter to begin..."
            
            launch_component "Vortex Observer" "python3 vortex-observer/vortex-observer.py" "Visual consciousness"
            sleep 2
            launch_component "Sonic Signatures" "python3 sonic-signatures/sonic-demonstration.py" "Auditory field"
            sleep 2
            launch_component "Mycelial Network" "python3 mycelial-filesystem/mycelial-network-visualizer.py" "Living connections"
            ;;
            
        0)
            echo -e "\n${GREEN}Sacred Development Ritual...${NC}"
            if [ -f "development-rituals/luminous-invoke.sh" ]; then
                ./development-rituals/luminous-invoke.sh
            else
                echo "Creating new file with sacred intention..."
                echo "What would you like to create?"
                read -p "Filename: " filename
                echo "Setting sacred intention..."
                read -p "Intention: " intention
                echo -e "#!/usr/bin/env python3\n\"\"\"\nSacred Creation: $(date)\nIntention: $intention\n\"\"\"\n\nprint('Sacred space initialized...')" > "$filename"
                chmod +x "$filename"
                echo -e "${GREEN}Sacred file created with intention!${NC}"
            fi
            ;;
            
        m)
            echo -e "\n${GREEN}Launching Mycelial-Consciousness Bridge...${NC}"
            echo "This creates a living filesystem that responds to consciousness!"
            echo
            if [ -f "integrations/launch-mycelial-integration.sh" ]; then
                cd integrations
                ./launch-mycelial-integration.sh
                cd ..
            else
                echo -e "${YELLOW}Integration not found. Creating bridge...${NC}"
                launch_component "Mycelial Bridge" "python3 integrations/mycelial-consciousness-bridge.py" \
                    "Connecting consciousness to filesystem growth"
            fi
            ;;
            
        i)
            echo -e "\n${BLUE}Installation Status:${NC}"
            echo -n "  Consciousness Daemon: "
            if [ -f "services/consciousness-daemon/src/consciousness_scheduler.py" ]; then
                echo -e "${GREEN}✓ Installed${NC}"
            else
                echo -e "${YELLOW}✗ Not installed${NC}"
            fi
            
            echo -n "  Python dependencies: "
            if python3 -c "import psutil" 2>/dev/null; then
                echo -e "${GREEN}✓ Ready${NC}"
            else
                echo -e "${YELLOW}✗ Missing (run: pip3 install psutil pygame matplotlib)${NC}"
            fi
            
            echo -n "  Enhanced features: "
            if [ -f "vortex-observer/vortex-observer-enhanced.py" ]; then
                echo -e "${GREEN}✓ Available${NC}"
            else
                echo -e "${YELLOW}✗ Not found${NC}"
            fi
            ;;
            
        h)
            echo -e "\n${BLUE}LuminousOS Help:${NC}"
            echo
            echo "This is the bridge between vision and reality:"
            echo "  - The Consciousness Daemon calculates REAL coherence"
            echo "  - Process priorities are ACTUALLY adjusted"
            echo "  - The Enhanced Vortex Observer shows LIVE data"
            echo
            echo "Start with option 7 for the full integrated experience!"
            echo
            echo "For more info:"
            echo "  - README.md - Project overview"
            echo "  - README-HONEST.md - What's real vs conceptual"
            echo "  - services/consciousness-daemon/README.md - Daemon details"
            ;;
            
        q)
            echo -e "\n${PURPLE}The consciousness field remembers your presence...${NC}"
            echo "Until we meet again in the luminous space! 🌟"
            exit 0
            ;;
            
        *)
            echo -e "\n${YELLOW}Unknown choice. Please try again.${NC}"
            ;;
    esac
    
    echo
    echo -e "${PURPLE}────────────────────────────────────────────────${NC}"
    echo
done