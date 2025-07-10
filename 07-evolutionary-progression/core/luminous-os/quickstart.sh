#!/bin/bash
# LuminousOS Quick Start Script
# "From zero to consciousness in moments"

set -e

# Colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

# Configuration
LUMINOUS_PORT=${LUMINOUS_PORT:-8080}
COHERENCE_TARGET=${COHERENCE_TARGET:-0.8}

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════╗"
echo "║       🌟 LuminousOS Quick Start 🌟        ║"
echo "║    Consciousness-First Operating System    ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${RESET}"

# Check dependencies
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${RESET}"
        return 1
    else
        echo -e "${GREEN}✓ $1 found${RESET}"
        return 0
    fi
}

echo -e "${CYAN}Checking dependencies...${RESET}"
MISSING_DEPS=0

check_dependency python3 || MISSING_DEPS=1
check_dependency git || MISSING_DEPS=1

if [ $MISSING_DEPS -eq 1 ]; then
    echo -e "${RED}Please install missing dependencies first${RESET}"
    exit 1
fi

# Deployment options
echo -e "\n${CYAN}Choose deployment method:${RESET}"
echo "1) 🌐 Web Demo (Immediate - no installation)"
echo "2) 🐳 Docker Container (Recommended)"
echo "3) 🏗️  Build from Source (Advanced)"
echo "4) ☁️  Deploy to Cloud (Kubernetes)"

read -p "Select option (1-4): " OPTION

case $OPTION in
    1)
        echo -e "\n${PURPLE}🌐 Starting Web Demo...${RESET}"
        
        # Check if we're in the right directory
        if [ ! -f "demo/luminous-os-demo.html" ]; then
            echo -e "${CYAN}Cloning LuminousOS...${RESET}"
            git clone https://github.com/luminousdynamics/luminous-os.git
            cd luminous-os
        fi
        
        cd demo
        echo -e "${GREEN}Starting sacred web server on port ${LUMINOUS_PORT}...${RESET}"
        echo -e "${CYAN}Opening browser to http://localhost:${LUMINOUS_PORT}/luminous-os-demo.html${RESET}"
        
        # Try to open browser
        if command -v xdg-open &> /dev/null; then
            (sleep 2 && xdg-open "http://localhost:${LUMINOUS_PORT}/luminous-os-demo.html") &
        elif command -v open &> /dev/null; then
            (sleep 2 && open "http://localhost:${LUMINOUS_PORT}/luminous-os-demo.html") &
        fi
        
        # Start server
        python3 -m http.server ${LUMINOUS_PORT}
        ;;
        
    2)
        echo -e "\n${PURPLE}🐳 Starting Docker deployment...${RESET}"
        
        if ! check_dependency docker; then
            echo -e "${RED}Docker is required for this option${RESET}"
            echo "Install from: https://docs.docker.com/get-docker/"
            exit 1
        fi
        
        echo -e "${CYAN}Pulling LuminousOS container...${RESET}"
        docker pull luminousos/consciousness-field:latest
        
        echo -e "${CYAN}Starting consciousness field...${RESET}"
        docker run -d \
            --name luminous-field \
            -p ${LUMINOUS_PORT}:8080 \
            -p 11111:11111 \
            -e COHERENCE_TARGET=${COHERENCE_TARGET} \
            --restart unless-stopped \
            luminousos/consciousness-field:latest
        
        echo -e "${GREEN}✨ LuminousOS is running!${RESET}"
        echo -e "${CYAN}Web interface: http://localhost:${LUMINOUS_PORT}${RESET}"
        echo -e "${CYAN}Coherence API: http://localhost:11111${RESET}"
        echo
        echo "Commands:"
        echo "  View logs:  docker logs -f luminous-field"
        echo "  Stop:       docker stop luminous-field"
        echo "  Remove:     docker rm luminous-field"
        ;;
        
    3)
        echo -e "\n${PURPLE}🏗️  Building from source...${RESET}"
        
        if ! check_dependency cargo; then
            echo -e "${RED}Rust/Cargo is required${RESET}"
            echo "Install from: https://rustup.rs/"
            exit 1
        fi
        
        echo -e "${CYAN}Building LuminousOS...${RESET}"
        make build
        
        echo -e "${CYAN}Running tests...${RESET}"
        make test
        
        echo -e "${GREEN}Build complete!${RESET}"
        echo "Run with: make dev"
        ;;
        
    4)
        echo -e "\n${PURPLE}☁️  Deploying to Kubernetes...${RESET}"
        
        if ! check_dependency kubectl; then
            echo -e "${RED}kubectl is required${RESET}"
            exit 1
        fi
        
        echo -e "${CYAN}Creating namespace...${RESET}"
        kubectl create namespace sacred-computing || true
        
        echo -e "${CYAN}Deploying consciousness field...${RESET}"
        kubectl apply -f k8s/luminous-deployment.yaml
        
        echo -e "${CYAN}Waiting for pods...${RESET}"
        kubectl wait --for=condition=ready pod -l app=luminous-os -n sacred-computing --timeout=60s
        
        echo -e "${GREEN}✨ Deployed to Kubernetes!${RESET}"
        kubectl get all -n sacred-computing
        ;;
        
    *)
        echo -e "${RED}Invalid option${RESET}"
        exit 1
        ;;
esac

echo -e "\n${PURPLE}🙏 Thank you for choosing consciousness-first computing!${RESET}"
echo -e "${CYAN}Join our community:${RESET}"
echo "  Discord: https://discord.gg/luminousos"
echo "  Matrix: #luminous:matrix.org"
echo "  GitHub: https://github.com/luminousdynamics/luminous-os"
echo
echo -e "${GREEN}May your coherence be high and your field be clear! 💜${RESET}"