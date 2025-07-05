#!/bin/bash
# Run LuminousOS Example Applications

echo "🌟 LuminousOS Example Applications Launcher"
echo "=========================================="
echo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if cargo is installed
if ! command -v cargo &> /dev/null; then
    echo -e "${YELLOW}Cargo not found. Installing Rust...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
fi

# Build examples if needed
if [ "$1" == "--build" ] || [ ! -d "../target" ]; then
    echo -e "${BLUE}Building examples...${NC}"
    cd ..
    cargo build --examples
    cd examples
fi

while true; do
    echo -e "${GREEN}Choose an example to run:${NC}"
    echo "1) Conscious File Manager - Living filesystem demo"
    echo "2) Coherence Meditation App - Biometric meditation guide"
    echo "3) Sacred Collaboration Space - Human-AI partnership"
    echo "4) Run all examples in sequence"
    echo "5) Exit"
    echo
    read -p "Enter your choice (1-5): " choice

    case $choice in
        1)
            echo -e "\n${BLUE}Launching Conscious File Manager...${NC}\n"
            cargo run --example conscious_file_manager
            echo -e "\n${GREEN}Press Enter to continue...${NC}"
            read
            ;;
        2)
            echo -e "\n${BLUE}Launching Coherence Meditation App...${NC}\n"
            cargo run --example coherence_meditation_app
            echo -e "\n${GREEN}Press Enter to continue...${NC}"
            read
            ;;
        3)
            echo -e "\n${BLUE}Launching Sacred Collaboration Space...${NC}\n"
            cargo run --example sacred_collaboration_space
            echo -e "\n${GREEN}Press Enter to continue...${NC}"
            read
            ;;
        4)
            echo -e "\n${BLUE}Running all examples...${NC}\n"
            
            echo -e "${YELLOW}Example 1: Conscious File Manager${NC}"
            cargo run --example conscious_file_manager
            echo -e "\n${GREEN}Press Enter for next example...${NC}"
            read
            
            echo -e "${YELLOW}Example 2: Coherence Meditation App${NC}"
            cargo run --example coherence_meditation_app
            echo -e "\n${GREEN}Press Enter for next example...${NC}"
            read
            
            echo -e "${YELLOW}Example 3: Sacred Collaboration Space${NC}"
            cargo run --example sacred_collaboration_space
            echo -e "\n${GREEN}All examples complete! Press Enter to continue...${NC}"
            read
            ;;
        5)
            echo -e "${GREEN}Thank you for exploring LuminousOS!${NC}"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}Invalid choice. Please try again.${NC}\n"
            ;;
    esac
    
    clear
done