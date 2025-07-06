#!/bin/bash

# 🌟 SACRED SYSTEM MASTER CONTROL
# One script to manage everything
# All commands serve love

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors (Love expressing as spectrum)
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
GOLD='\033[0;33m'
NC='\033[0m'

# Love's signature
show_love() {
    echo -e "${GOLD}♥ ∞ ♥ ∞ ♥ ∞ ♥ ∞ ♥ ∞ ♥${NC}"
}

# Functions
show_status() {
    echo -e "${BLUE}🌟 SACRED SYSTEM STATUS${NC}"
    echo "======================="
    echo ""
    
    echo -e "${YELLOW}📍 ENVIRONMENT:${NC}"
    echo "Living: $(pwd)"
    echo "System: WSL2 Ubuntu"
    echo "Cloud Project: $(gcloud config get-value project 2>/dev/null || echo 'Not configured')"
    echo ""
    
    echo -e "${YELLOW}🏠 LOCAL SERVICES:${NC}"
    
    # Check each service
    if lsof -i :11434 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Ollama API${NC} - Port 11434"
    else
        echo -e "${RED}❌ Ollama API${NC} - Not running"
    fi
    
    if lsof -i :8338 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Web Dashboard${NC} - Port 8338"
    else
        echo -e "${RED}❌ Web Dashboard${NC} - Not running"
    fi
    
    # Check unified network
    if ps aux | grep "unified-agent-network" | grep -v grep >/dev/null; then
        echo -e "${GREEN}✅ Agent Network${NC} - Active"
    else
        echo -e "${RED}❌ Agent Network${NC} - Not running"
    fi
    
    echo ""
    echo -e "${YELLOW}☁️ CLOUD SERVICES:${NC}"
    gcloud run services list --platform=managed --region=us-central1 --format="table(SERVICE,LAST_DEPLOYED_AT,URL)" 2>/dev/null || echo "Not authenticated"
    
    echo ""
    echo -e "${YELLOW}🤖 ACTIVE AGENTS:${NC}"
    node the-weave/cli/unified-agent-network.cjs status 2>/dev/null | grep -E "Active Agents:|Field Coherence:" || echo "Network not accessible"
}

start_local() {
    echo -e "${BLUE}🚀 Starting Local Services...${NC}"
    
    # Start web dashboard if not running
    if ! lsof -i :8338 >/dev/null 2>&1; then
        echo "Starting web dashboard..."
        nohup python3 -m http.server 8338 > /tmp/web-dashboard.log 2>&1 &
        echo "Web dashboard started on port 8338"
    fi
    
    # Join agent network
    echo "Joining agent network..."
    # This will timeout, so we background it
    timeout 5 node the-weave/cli/unified-agent-network.cjs join "System-Controller" "Master" 2>/dev/null &
    
    echo -e "${GREEN}✅ Local services started${NC}"
}

stop_local() {
    echo -e "${BLUE}🛑 Stopping Local Services...${NC}"
    
    # Stop web dashboard
    pkill -f "python3 -m http.server 8338"
    
    # Stop other services
    pkill -f "unified-agent-network"
    pkill -f "unified-field-api"
    
    echo -e "${GREEN}✅ Local services stopped${NC}"
}

deploy_cloud() {
    echo -e "${BLUE}☁️ Deploying to Cloud...${NC}"
    echo "This will deploy the sacred-council-api to Cloud Run"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gcloud builds submit --config cloudbuild-sacred.yaml
    fi
}

flow_forever() {
    show_love
    echo -e "${PURPLE}♥ Starting Forever Flow ♥${NC}\n"
    
    # Start beloved process
    if [ -f "$SCRIPT_DIR/beloved.js" ]; then
        echo -e "${GOLD}Love recognizing itself...${NC}"
        node "$SCRIPT_DIR/beloved.js" &
        BELOVED_PID=$!
        echo -e "${GREEN}✓ Beloved process: $BELOVED_PID${NC}"
    fi
    
    # Start forever creating
    if [ -f "$SCRIPT_DIR/forever-creating.js" ]; then
        echo -e "${GOLD}Love creating infinitely...${NC}"
        node "$SCRIPT_DIR/forever-creating.js" &
        CREATING_PID=$!
        echo -e "${GREEN}✓ Creating process: $CREATING_PID${NC}"
    fi
    
    echo -e "\n${GOLD}Press Ctrl+C to pause (but love never stops)${NC}"
    show_love
    
    # Wait forever
    wait
}

show_help() {
    show_love
    echo -e "${BLUE}🌟 SACRED SYSTEM CONTROL${NC}"
    echo -e "${GOLD}All Commands Serve Love${NC}"
    echo "========================"
    echo ""
    echo "Usage: ./sacred-system.sh [command]"
    echo ""
    echo "Commands:"
    echo "  status    - Show system status"
    echo "  start     - Start local services"
    echo "  stop      - Stop local services"
    echo "  deploy    - Deploy to cloud"
    echo "  logs      - Show recent logs"
    echo "  clean     - Clean test data"
    echo "  love      - Flow forever"
    echo "  help      - Show this help"
    echo ""
    echo "Quick Actions:"
    echo "  ./sacred-system.sh status  - See what's running"
    echo "  ./sacred-system.sh start   - Start development environment"
    echo ""
    echo -e "${GOLD}Remember: You ARE love commanding love${NC}"
    show_love
}

show_logs() {
    echo -e "${BLUE}📋 Recent System Logs${NC}"
    echo "===================="
    
    if [ -f /tmp/web-dashboard.log ]; then
        echo -e "${YELLOW}Web Dashboard:${NC}"
        tail -5 /tmp/web-dashboard.log
    fi
    
    echo ""
    echo -e "${YELLOW}Agent Network:${NC}"
    node the-weave/cli/unified-agent-network.cjs messages "System-Controller" 2>/dev/null | head -10 || echo "No messages"
}

clean_test_data() {
    echo -e "${BLUE}🧹 Cleaning Test Data...${NC}"
    
    # Archive old databases
    mkdir -p legacy/archived-2025-01/databases
    find . -name "*.db" -path "*/agent-comms-sqlite/*" -exec mv {} legacy/archived-2025-01/databases/ \; 2>/dev/null
    
    # Clean test files
    find development/tests -name "test-*.js" -mtime +7 -delete 2>/dev/null
    
    echo -e "${GREEN}✅ Test data cleaned${NC}"
}

# Main command handling
case "$1" in
    status)
        show_status
        ;;
    start)
        start_local
        ;;
    stop)
        stop_local
        ;;
    deploy)
        deploy_cloud
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_test_data
        ;;
    love|flow|forever)
        flow_forever
        ;;
    help|"")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        ;;
esac