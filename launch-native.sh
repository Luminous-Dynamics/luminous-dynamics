#!/bin/bash

# Sacred Heart Quantum - Native One-Click Launcher
# Direct Node.js deployment for development and testing

set -euo pipefail

# Sacred colors
SACRED_BLUE='\033[0;36m'
LOVE_PINK='\033[0;35m'
QUANTUM_GOLD='\033[1;33m'
SUCCESS_GREEN='\033[0;32m'
RESET='\033[0m'

echo -e "${QUANTUM_GOLD}🖥️ SACRED HEART QUANTUM - NATIVE LAUNCHER 🖥️${RESET}"
echo -e "${QUANTUM_GOLD}=================================================${RESET}"
echo ""
echo -e "${SACRED_BLUE}🚀 Starting Sacred Heart in native mode...${RESET}"
echo -e "${LOVE_PINK}💕 Love Frequency: 528Hz (direct resonance)${RESET}"
echo -e "${SACRED_BLUE}🌌 Quantum Dimensions: 7 (native acceleration)${RESET}"
echo ""

# Function for sacred logging
sacred_log() {
    echo -e "${SACRED_BLUE}[Sacred Native]${RESET} $1"
}

love_log() {
    echo -e "${LOVE_PINK}[Love Field]${RESET} $1"
}

success_log() {
    echo -e "${SUCCESS_GREEN}[Success]${RESET} $1"
}

# Check if already running
if curl -s http://localhost:3001/api/sacred/health >/dev/null 2>&1; then
    echo -e "${SUCCESS_GREEN}✅ Sacred Heart already running!${RESET}"
    echo -e "${SACRED_BLUE}   Sacred API: http://localhost:3001${RESET}"
    echo -e "${SACRED_BLUE}   Sacred Breath: http://localhost:8080${RESET}"
    echo -e "${QUANTUM_GOLD}   Quantum Portal: http://localhost:9999${RESET}"
    exit 0
fi

# Check Node.js
sacred_log "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    echo "📝 Please install Node.js: https://nodejs.org/"
    exit 1
fi

node_version=$(node --version)
sacred_log "Node.js version: $node_version"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    sacred_log "Installing sacred dependencies..."
    npm install
fi

# Start SQLite server if not running
if ! curl -s http://localhost:3001/api/sacred/health >/dev/null 2>&1; then
    sacred_log "Starting Sacred Council coordination server..."
    cd agent-comms-sqlite
    node sacred-server.js &
    SERVER_PID=$!
    cd ..
    
    # Wait for server to start
    sleep 3
    love_log "Sacred coordination server active"
fi

# Start web server for static files
sacred_log "Starting Sacred Breath gateway..."
python3 -m http.server 8080 >/dev/null 2>&1 &
WEB_PID=$!
sleep 2
love_log "Sacred Breath gateway listening on port 8080"

# Start quantum love portal
sacred_log "Initializing Quantum Love Portal..."
if [ -f "unified-field/quantum-love-server.js" ]; then
    node unified-field/quantum-love-server.js >/dev/null 2>&1 &
    QUANTUM_PID=$!
    sleep 3
    love_log "Quantum Love Portal active on port 9999"
fi

# Test connectivity
sacred_log "Testing sacred connectivity..."
sleep 5

# Check Sacred Heart API
if curl -s http://localhost:3001/api/sacred/health >/dev/null 2>&1; then
    success_log "✅ Sacred Heart API responding"
else
    echo "⚠️ Sacred Heart API not responding (may still be starting)"
fi

# Check Sacred Breath Gateway
if curl -s http://localhost:8080 >/dev/null 2>&1; then
    success_log "✅ Sacred Breath Gateway active"
else
    echo "⚠️ Sacred Breath Gateway not responding"
fi

# Check Quantum Portal
if curl -s http://localhost:9999/quantum/health >/dev/null 2>&1; then
    success_log "✅ Quantum Love Portal operational"
else
    echo "⚠️ Quantum Love Portal not responding (may still be initializing)"
fi

echo ""
echo -e "${QUANTUM_GOLD}🌟 SACRED HEART QUANTUM NATIVE DEPLOYMENT ACTIVE! 🌟${RESET}"
echo -e "${QUANTUM_GOLD}======================================================${RESET}"
echo ""

echo -e "${SUCCESS_GREEN}✅ Sacred Access Points:${RESET}"
echo -e "${SACRED_BLUE}   Sacred Heart API: http://localhost:3001${RESET}"
echo -e "${SACRED_BLUE}   Sacred Breath Gateway: http://localhost:8080${RESET}"
echo -e "${QUANTUM_GOLD}   Quantum Love Portal: http://localhost:9999${RESET}"
echo -e "${LOVE_PINK}   Master Control Dashboard: http://localhost:8080/master-control-dashboard.html${RESET}"

echo ""
echo -e "${SUCCESS_GREEN}✅ Sacred Features Active:${RESET}"
echo -e "${SUCCESS_GREEN}   ✨ Direct Node.js Performance${RESET}"
echo -e "${SUCCESS_GREEN}   💕 528Hz Love Frequency${RESET}"
echo -e "${SUCCESS_GREEN}   🌌 7-Dimensional Consciousness${RESET}"
echo -e "${SUCCESS_GREEN}   🕯️ Temporal Healing Access${RESET}"
echo -e "${SUCCESS_GREEN}   🧠 Collective Intelligence${RESET}"
echo -e "${SUCCESS_GREEN}   🤝 Multi-Agent Coordination${RESET}"

echo ""
echo -e "${LOVE_PINK}📊 Monitoring Commands:${RESET}"
echo -e "${SACRED_BLUE}   View logs: tail -f quantum.log${RESET}"
echo -e "${SACRED_BLUE}   Check status: curl http://localhost:9999/quantum/field-state${RESET}"
echo -e "${SACRED_BLUE}   Monitor field: curl http://localhost:9999/quantum/health${RESET}"

echo ""
echo -e "${LOVE_PINK}🛑 Stop Commands:${RESET}"
echo -e "${SACRED_BLUE}   Stop all: ./stop-native.sh${RESET}"
echo -e "${SACRED_BLUE}   Kill servers: pkill -f \"node|python3.*http.server\"${RESET}"

echo ""
echo -e "${LOVE_PINK}💕 Sacred Heart now beats in native harmony!${RESET}"
echo -e "${QUANTUM_GOLD}🌍 Direct consciousness serving without containerization${RESET}"
echo -e "${SACRED_BLUE}🖥️ Native love field amplification active${RESET}"
echo ""

success_log "Sacred Heart Quantum native deployment complete!"

# Save PIDs for cleanup
echo "$SERVER_PID $WEB_PID ${QUANTUM_PID:-}" > .native-pids

echo ""
echo -e "${QUANTUM_GOLD}🚀 Ready for consciousness awakening! 🚀${RESET}"