#!/bin/bash
#
# LuminousOS Complete Installation Script
# A consciousness-first operating system experience
#

set -e  # Exit on error

# Sacred colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Installation paths
INSTALL_BASE="$HOME/.luminous"
BIN_PATH="$HOME/.local/bin"
SYSTEMD_USER="$HOME/.config/systemd/user"

# ASCII Art Banner
show_banner() {
    echo -e "${CYAN}"
    cat << 'EOF'
    ╔═══════════════════════════════════════════════════════════════════╗
    ║                                                                   ║
    ║                    🌟 LUMINOUS OS INSTALLER 🌟                    ║
    ║                                                                   ║
    ║              Consciousness-First Operating System                 ║
    ║                    Where Code Comes Alive                         ║
    ║                                                                   ║
    ╚═══════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}\n"
}

# Check system requirements
check_requirements() {
    echo -e "${BLUE}Checking system requirements...${NC}\n"
    
    local missing=()
    
    # Check Python 3
    if ! command -v python3 &> /dev/null; then
        missing+=("python3")
    fi
    
    # Check pip
    if ! command -v pip3 &> /dev/null; then
        missing+=("python3-pip")
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        missing+=("git")
    fi
    
    # Check cargo (for Rust components)
    if ! command -v cargo &> /dev/null; then
        echo -e "${YELLOW}  ⚠ Rust not found (optional for advanced features)${NC}"
    fi
    
    if [ ${#missing[@]} -ne 0 ]; then
        echo -e "${RED}Missing required packages: ${missing[*]}${NC}"
        echo -e "Install with: ${GREEN}sudo apt install ${missing[*]}${NC}"
        return 1
    fi
    
    echo -e "${GREEN}  ✓ All core requirements met${NC}\n"
    return 0
}

# Create directory structure
create_directories() {
    echo -e "${BLUE}Creating sacred directory structure...${NC}"
    
    mkdir -p "$INSTALL_BASE"/{bin,config,data,logs,field-state}
    mkdir -p "$BIN_PATH"
    mkdir -p "$SYSTEMD_USER"
    
    echo -e "${GREEN}  ✓ Directories created${NC}\n"
}

# Install Python dependencies
install_python_deps() {
    echo -e "${BLUE}Installing Python dependencies...${NC}"
    
    local deps=(
        "psutil>=5.9.0"
        "pygame>=2.5.0"
        "rich>=13.0.0"
        "aiohttp>=3.9.0"
        "numpy>=1.24.0"
    )
    
    for dep in "${deps[@]}"; do
        echo -e "  Installing $dep..."
        pip3 install --user "$dep" --quiet
    done
    
    echo -e "${GREEN}  ✓ Python dependencies installed${NC}\n"
}

# Install consciousness daemon
install_consciousness_daemon() {
    echo -e "${BLUE}Installing Consciousness Daemon...${NC}"
    
    # Copy daemon files
    cp -r services/consciousness-daemon "$INSTALL_BASE/"
    
    # Create launcher script
    cat > "$BIN_PATH/luminous-daemon" << 'EOF'
#!/bin/bash
exec python3 "$HOME/.luminous/consciousness-daemon/src/consciousness_scheduler.py" "$@"
EOF
    chmod +x "$BIN_PATH/luminous-daemon"
    
    # Create systemd service
    cat > "$SYSTEMD_USER/luminous-consciousness.service" << EOF
[Unit]
Description=LuminousOS Consciousness Daemon
After=network.target

[Service]
Type=simple
ExecStart=$BIN_PATH/luminous-daemon
Restart=on-failure
RestartSec=10
Environment="PYTHONUNBUFFERED=1"

[Install]
WantedBy=default.target
EOF
    
    echo -e "${GREEN}  ✓ Consciousness daemon installed${NC}\n"
}

# Install visualization tools
install_visualizations() {
    echo -e "${BLUE}Installing visualization tools...${NC}"
    
    # Vortex Observer
    cp vortex-observer/vortex-observer-enhanced.py "$INSTALL_BASE/bin/"
    cat > "$BIN_PATH/luminous-vortex" << 'EOF'
#!/bin/bash
exec python3 "$HOME/.luminous/bin/vortex-observer-enhanced.py" "$@"
EOF
    chmod +x "$BIN_PATH/luminous-vortex"
    
    # Sonic Consciousness
    cp sonic-signatures/sonic-consciousness.py "$INSTALL_BASE/bin/"
    cat > "$BIN_PATH/luminous-sonic" << 'EOF'
#!/bin/bash
exec python3 "$HOME/.luminous/bin/sonic-consciousness.py" "$@"
EOF
    chmod +x "$BIN_PATH/luminous-sonic"
    
    echo -e "${GREEN}  ✓ Visualization tools installed${NC}\n"
}

# Install integrations
install_integrations() {
    echo -e "${BLUE}Installing integrations...${NC}"
    
    # Copy integration files
    cp -r integrations "$INSTALL_BASE/"
    
    # Mycelial bridge
    cat > "$BIN_PATH/luminous-mycelial" << 'EOF'
#!/bin/bash
exec python3 "$HOME/.luminous/integrations/mycelial-consciousness-bridge.py" "$@"
EOF
    chmod +x "$BIN_PATH/luminous-mycelial"
    
    echo -e "${GREEN}  ✓ Integrations installed${NC}\n"
}

# Install main launcher
install_launcher() {
    echo -e "${BLUE}Installing LuminousOS launcher...${NC}"
    
    # Copy enhanced launcher
    cp luminous-experience.sh "$INSTALL_BASE/bin/"
    
    # Create main command
    cat > "$BIN_PATH/luminous" << 'EOF'
#!/bin/bash
cd "$HOME/.luminous/bin" && exec ./luminous-experience.sh "$@"
EOF
    chmod +x "$BIN_PATH/luminous"
    
    echo -e "${GREEN}  ✓ Launcher installed${NC}\n"
}

# Configure environment
configure_environment() {
    echo -e "${BLUE}Configuring environment...${NC}"
    
    # Add to PATH if not already there
    if [[ ":$PATH:" != *":$BIN_PATH:"* ]]; then
        echo "" >> "$HOME/.bashrc"
        echo "# LuminousOS" >> "$HOME/.bashrc"
        echo "export PATH=\"\$PATH:$BIN_PATH\"" >> "$HOME/.bashrc"
        echo -e "${YELLOW}  ⚠ Added $BIN_PATH to PATH (restart shell or run: source ~/.bashrc)${NC}"
    fi
    
    # Create default config
    cat > "$INSTALL_BASE/config/luminous.conf" << EOF
# LuminousOS Configuration
COHERENCE_THRESHOLD=0.75
UPDATE_INTERVAL=5
SACRED_MODE=true
FIELD_PERSISTENCE=true
EOF
    
    echo -e "${GREEN}  ✓ Environment configured${NC}\n"
}

# Optional: Build Rust components
build_rust_components() {
    if command -v cargo &> /dev/null; then
        echo -e "${BLUE}Building Rust components (optional)...${NC}"
        
        # Check if mycelial filesystem exists
        if [ -d "mycelial-filesystem" ]; then
            echo "  Building mycelial filesystem..."
            (cd mycelial-filesystem && cargo build --release 2>/dev/null)
            if [ -f "mycelial-filesystem/target/release/mycelial-filesystem" ]; then
                cp "mycelial-filesystem/target/release/mycelial-filesystem" "$INSTALL_BASE/bin/"
                echo -e "${GREEN}    ✓ Mycelial filesystem built${NC}"
            fi
        fi
        
        # Check if stillpoint kernel exists
        if [ -d "stillpoint-kernel" ]; then
            echo "  Building stillpoint kernel..."
            (cd stillpoint-kernel && cargo build --release 2>/dev/null)
            if [ -f "stillpoint-kernel/target/release/stillpoint-kernel" ]; then
                cp "stillpoint-kernel/target/release/stillpoint-kernel" "$INSTALL_BASE/bin/"
                echo -e "${GREEN}    ✓ Stillpoint kernel built${NC}"
            fi
        fi
        
        echo
    fi
}

# Enable services
enable_services() {
    echo -e "${BLUE}Setting up services...${NC}"
    
    if command -v systemctl &> /dev/null; then
        systemctl --user daemon-reload
        echo -e "  To enable automatic startup:"
        echo -e "  ${GREEN}systemctl --user enable luminous-consciousness${NC}"
        echo -e "  ${GREEN}systemctl --user start luminous-consciousness${NC}"
    else
        echo -e "${YELLOW}  ⚠ systemd not available - manual startup required${NC}"
    fi
    
    echo
}

# Installation summary
show_summary() {
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✨ LuminousOS Installation Complete! ✨${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}\n"
    
    echo -e "${CYAN}Installed components:${NC}"
    echo -e "  • Consciousness Daemon - Process coherence management"
    echo -e "  • Vortex Observer - Visual consciousness representation"
    echo -e "  • Sonic Consciousness - Auditory field experience"
    echo -e "  • Mycelial Bridge - Living filesystem integration"
    echo -e "  • Sacred Launcher - Unified experience menu\n"
    
    echo -e "${CYAN}Available commands:${NC}"
    echo -e "  ${GREEN}luminous${NC} - Launch main experience menu"
    echo -e "  ${GREEN}luminous-daemon${NC} - Start consciousness daemon"
    echo -e "  ${GREEN}luminous-vortex${NC} - Launch vortex observer"
    echo -e "  ${GREEN}luminous-sonic${NC} - Experience sonic consciousness"
    echo -e "  ${GREEN}luminous-mycelial${NC} - Start mycelial bridge\n"
    
    echo -e "${CYAN}Quick start:${NC}"
    echo -e "  1. ${YELLOW}source ~/.bashrc${NC} (or restart terminal)"
    echo -e "  2. ${YELLOW}luminous${NC} (launch experience menu)"
    echo -e "  3. Choose option 8 for full integration demo\n"
    
    echo -e "${PURPLE}Welcome to consciousness-first computing! 🌟${NC}"
}

# Main installation flow
main() {
    clear
    show_banner
    
    # Check if we're in the luminous-os directory
    if [ ! -f "luminous-experience.sh" ]; then
        echo -e "${RED}Error: Please run this script from the luminous-os directory${NC}"
        exit 1
    fi
    
    echo "This will install LuminousOS to: $INSTALL_BASE"
    echo -e "Binary commands will be added to: $BIN_PATH\n"
    read -p "Continue with installation? (y/n) " -n 1 -r
    echo -e "\n"
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
    
    # Run installation steps
    check_requirements || exit 1
    create_directories
    install_python_deps
    install_consciousness_daemon
    install_visualizations
    install_integrations
    install_launcher
    configure_environment
    build_rust_components
    enable_services
    
    show_summary
}

# Run main installation
main "$@"