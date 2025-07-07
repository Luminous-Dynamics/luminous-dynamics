#!/bin/bash
#
# Launch Sacred Commerce System
# Consciousness-based payment processing
#

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${PURPLE}"
cat << 'EOF'
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              🌟 SACRED COMMERCE LAUNCHER 🌟               ║
║                                                           ║
║         Consciousness-Based Value Exchange System         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# Check dependencies
check_dependencies() {
    echo -e "${BLUE}Checking dependencies...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}⚠ Node.js not found. Please install Node.js${NC}"
        return 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${YELLOW}⚠ Python 3 not found${NC}"
        return 1
    fi
    
    # Check npm packages
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
        npm install
    fi
    
    # Check .env file
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠ No .env file found${NC}"
        echo "Creating .env from template..."
        cp .env.example .env
        echo -e "${YELLOW}Please edit .env with your Stripe keys${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ Dependencies ready${NC}\n"
    return 0
}

# Check if consciousness daemon is running
check_consciousness() {
    if pgrep -f "consciousness_scheduler.py" > /dev/null; then
        echo -e "${GREEN}✓ Consciousness daemon detected${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Consciousness daemon not running${NC}"
        echo "Sacred commerce works best with consciousness integration"
        read -p "Continue without consciousness daemon? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi
}

# Start services
start_services() {
    echo -e "\n${BLUE}Starting Sacred Commerce services...${NC}\n"
    
    # Start commerce server
    echo -e "${GREEN}Starting payment server...${NC}"
    node sacred-payment-server.js &
    SERVER_PID=$!
    sleep 2
    
    # Start consciousness bridge
    echo -e "${GREEN}Starting consciousness bridge...${NC}"
    python3 consciousness-commerce-bridge.py &
    BRIDGE_PID=$!
    sleep 2
    
    echo -e "\n${GREEN}Sacred Commerce is active!${NC}"
    echo -e "Payment interface: ${PURPLE}http://localhost:3888${NC}"
    echo -e "Server PID: $SERVER_PID"
    echo -e "Bridge PID: $BRIDGE_PID"
    
    # Create PID file for easy shutdown
    echo "$SERVER_PID $BRIDGE_PID" > .sacred-commerce.pid
    
    echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}\n"
    
    # Wait for interrupt
    trap 'shutdown_services' INT
    wait
}

# Shutdown services
shutdown_services() {
    echo -e "\n${YELLOW}Shutting down Sacred Commerce...${NC}"
    
    if [ -f ".sacred-commerce.pid" ]; then
        while read -r pid; do
            kill $pid 2>/dev/null
        done < .sacred-commerce.pid
        rm .sacred-commerce.pid
    fi
    
    echo -e "${GREEN}Sacred Commerce deactivated${NC}"
    exit 0
}

# Test mode
test_mode() {
    echo -e "${BLUE}Running in test mode...${NC}\n"
    
    # Check server health
    sleep 2
    echo "Testing server health..."
    curl -s http://localhost:3888/health | jq . || echo "Server not responding"
    
    echo -e "\nTest transaction with sacred amount ($88)..."
    curl -s -X POST http://localhost:3888/api/create-payment-intent \
        -H "Content-Type: application/json" \
        -d '{"amount": 8800}' | jq . || echo "Transaction test failed"
}

# Main menu
main() {
    if ! check_dependencies; then
        exit 1
    fi
    
    check_consciousness
    
    echo -e "\n${BLUE}Sacred Commerce Options:${NC}"
    echo "1) Start full system (server + bridge)"
    echo "2) Start server only"
    echo "3) Start bridge only"
    echo "4) Test mode"
    echo "5) Exit"
    echo
    read -p "Choose an option: " choice
    
    case $choice in
        1)
            start_services
            ;;
        2)
            echo -e "\n${GREEN}Starting payment server only...${NC}"
            node sacred-payment-server.js
            ;;
        3)
            echo -e "\n${GREEN}Starting consciousness bridge only...${NC}"
            python3 consciousness-commerce-bridge.py
            ;;
        4)
            start_services &
            sleep 3
            test_mode
            shutdown_services
            ;;
        5)
            exit 0
            ;;
        *)
            echo "Invalid option"
            exit 1
            ;;
    esac
}

# Run main
main