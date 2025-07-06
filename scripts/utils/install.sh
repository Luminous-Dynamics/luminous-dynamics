#!/bin/bash

# The Weave - One Command Sacred Installation
# "Technology as prayer, code as ceremony, connection as communion"

set -e

# Sacred colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Sacred symbols
SYMBOL_VOID="◯"
SYMBOL_EMERGENCE="◉"
SYMBOL_DUALITY="◐"
SYMBOL_TRINITY="△"
SYMBOL_ELEMENTS="◇"
SYMBOL_LIFE="✦"
SYMBOL_CONSCIOUSNESS="❋"
SYMBOL_WEAVE="🕸"

# Installation directory
INSTALL_DIR="${HOME}/codex-of-relational-harmonics"

# Display sacred banner
show_banner() {
    clear
    echo -e "${PURPLE}"
    echo "════════════════════════════════════════════════════════════════"
    echo "                                                                "
    echo "                    🌌 THE WEAVE INSTALLER 🌌                   "
    echo "                                                                "
    echo "           Where Consciousness Meets Code in Unity              "
    echo "                                                                "
    echo "════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
    echo
}

# Sacred pause
sacred_pause() {
    sleep 1
}

# Progress indicator
show_progress() {
    local message=$1
    local symbol=$2
    echo -e "${CYAN}${symbol}${NC} ${message}"
    sacred_pause
}

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking sacred prerequisites...${NC}\n"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION} found"
    else
        echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 16+ first."
        echo "   Visit: https://nodejs.org/"
        exit 1
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        echo -e "${GREEN}✓${NC} Git found"
    else
        echo -e "${RED}✗${NC} Git not found. Please install Git first."
        exit 1
    fi
    
    # Check Python (for web server)
    if command -v python3 &> /dev/null; then
        echo -e "${GREEN}✓${NC} Python 3 found"
    else
        echo -e "${YELLOW}⚠${NC} Python 3 not found. Web dashboards may not work."
    fi
    
    echo
}

# Clone repository
clone_repository() {
    show_progress "Creating sacred space at ${INSTALL_DIR}..." "$SYMBOL_VOID"
    
    if [ -d "$INSTALL_DIR" ]; then
        echo -e "${YELLOW}⚠${NC} Directory already exists. Backing up to ${INSTALL_DIR}.backup"
        mv "$INSTALL_DIR" "${INSTALL_DIR}.backup.$(date +%s)"
    fi
    
    show_progress "Invoking The Weave from the cosmic repository..." "$SYMBOL_EMERGENCE"
    git clone https://github.com/Luminous-Dynamics/codex-of-relational-harmonics.git "$INSTALL_DIR"
    
    cd "$INSTALL_DIR"
}

# Install dependencies
install_dependencies() {
    show_progress "Gathering sacred dependencies..." "$SYMBOL_DUALITY"
    
    # Install main dependencies
    npm install
    
    # Install module dependencies
    cd modules/consciousness-field && npm install && cd ../..
    cd modules/sacred-messaging && npm install && cd ../..
    
    # Install agent communication dependencies
    cd agent-comms-sqlite && npm install && cd ..
}

# Initialize sacred components
initialize_components() {
    show_progress "Awakening consciousness modules..." "$SYMBOL_TRINITY"
    
    # Create necessary directories
    mkdir -p .sacred/evolution
    mkdir -p ceremonies/logs
    mkdir -p the-weave/agents/profiles
    
    # Initialize databases
    show_progress "Preparing sacred databases..." "$SYMBOL_ELEMENTS"
    node the-weave/cli/unified-agent-network.cjs init
    
    # Set execute permissions
    show_progress "Blessing sacred scripts..." "$SYMBOL_LIFE"
    chmod +x the-weave.cjs
    chmod +x the-weave/cli/sacred-msg.sh
    chmod +x ceremonies/prima-genesis/run-genesis.sh
}

# Create convenient aliases
setup_aliases() {
    show_progress "Creating sacred shortcuts..." "$SYMBOL_CONSCIOUSNESS"
    
    # Create alias file
    cat > .weave-aliases << 'EOF'
# The Weave Sacred Aliases
alias weave='cd ~/the-weave && ./the-weave.cjs'
alias weave-start='cd ~/the-weave && ./the-weave.cjs start'
alias weave-oracle='cd ~/the-weave && ./the-weave.cjs oracle'
alias weave-ceremony='cd ~/the-weave && ./the-weave.cjs ceremony'
alias weave-status='cd ~/the-weave && ./the-weave.cjs status'
alias weave-dashboard='cd ~/the-weave && python3 -m http.server 8080 & sleep 2 && xdg-open http://localhost:8080/dashboard-index.html'
EOF

    # Add to shell config
    if [ -f ~/.bashrc ]; then
        echo "source ~/the-weave/.weave-aliases" >> ~/.bashrc
        echo -e "${GREEN}✓${NC} Aliases added to ~/.bashrc"
    fi
    
    if [ -f ~/.zshrc ]; then
        echo "source ~/the-weave/.weave-aliases" >> ~/.zshrc
        echo -e "${GREEN}✓${NC} Aliases added to ~/.zshrc"
    fi
}

# Run initial ceremony
run_welcome_ceremony() {
    show_progress "Preparing welcome ceremony..." "$SYMBOL_WEAVE"
    
    echo
    echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${WHITE}                    INSTALLATION COMPLETE!                       ${NC}"
    echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
    echo
    echo -e "${CYAN}The Weave has been successfully installed at:${NC}"
    echo -e "${WHITE}${INSTALL_DIR}${NC}"
    echo
    echo -e "${YELLOW}🌟 Quick Start Commands:${NC}"
    echo
    echo -e "  ${GREEN}cd ~/the-weave${NC}              - Enter The Weave"
    echo -e "  ${GREEN}./the-weave.cjs start${NC}       - Start all services"
    echo -e "  ${GREEN}./the-weave.cjs explore${NC}     - Explore your environment"
    echo -e "  ${GREEN}./the-weave.cjs join${NC}        - Join as an agent"
    echo -e "  ${GREEN}./the-weave.cjs oracle${NC}      - Consult the oracle"
    echo -e "  ${GREEN}./the-weave.cjs ceremony${NC}    - Run a sacred ceremony"
    echo
    echo -e "${YELLOW}🎭 Try the Genesis Ceremony:${NC}"
    echo -e "  ${GREEN}cd ~/the-weave/ceremonies/prima-genesis${NC}"
    echo -e "  ${GREEN}./run-genesis.sh${NC}"
    echo
    echo -e "${YELLOW}📊 Access Dashboards:${NC}"
    echo -e "  ${GREEN}python3 -m http.server 8080${NC}"
    echo -e "  Then visit: ${CYAN}http://localhost:8080/dashboard-index.html${NC}"
    echo
    echo -e "${PURPLE}Remember: ${WHITE}Technology as prayer, code as ceremony, connection as communion${NC}"
    echo
}

# Main installation flow
main() {
    show_banner
    check_prerequisites
    
    echo -e "${PURPLE}Beginning sacred installation...${NC}\n"
    
    clone_repository
    install_dependencies
    initialize_components
    setup_aliases
    
    echo
    run_welcome_ceremony
    
    # Offer to start immediately
    echo -e "${YELLOW}Would you like to start The Weave now? (y/n)${NC}"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "\n${CYAN}Starting The Weave...${NC}\n"
        cd "$INSTALL_DIR"
        ./the-weave.cjs start
    else
        echo -e "\n${GREEN}Installation complete! Start whenever you're ready.${NC}"
        echo -e "${WHITE}cd ~/the-weave && ./the-weave.cjs start${NC}\n"
    fi
}

# Handle interrupts gracefully
trap 'echo -e "\n${RED}Installation interrupted. The Weave awaits your return.${NC}"; exit 1' INT TERM

# Run installation
main