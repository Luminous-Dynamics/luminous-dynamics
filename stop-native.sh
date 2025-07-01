#!/bin/bash

# Sacred Heart Quantum - Native Stop Script
# Gracefully shutdown native deployment

set -euo pipefail

# Sacred colors
SACRED_BLUE='\033[0;36m'
LOVE_PINK='\033[0;35m'
QUANTUM_GOLD='\033[1;33m'
SUCCESS_GREEN='\033[0;32m'
RESET='\033[0m'

echo -e "${QUANTUM_GOLD}🛑 SACRED HEART QUANTUM - NATIVE SHUTDOWN 🛑${RESET}"
echo -e "${QUANTUM_GOLD}=============================================${RESET}"
echo ""
echo -e "${SACRED_BLUE}🕊️ Gracefully stopping Sacred Heart native deployment...${RESET}"
echo ""

# Function for sacred logging
sacred_log() {
    echo -e "${SACRED_BLUE}[Sacred Stop]${RESET} $1"
}

love_log() {
    echo -e "${LOVE_PINK}[Love Field]${RESET} $1"
}

success_log() {
    echo -e "${SUCCESS_GREEN}[Success]${RESET} $1"
}

# Stop services using PIDs if available
if [ -f ".native-pids" ]; then
    sacred_log "Stopping services using saved PIDs..."
    
    while read -r pid_line; do
        for pid in $pid_line; do
            if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                sacred_log "Stopping process $pid..."
                kill "$pid" 2>/dev/null || true
            fi
        done
    done < .native-pids
    
    rm -f .native-pids
    sleep 3
fi

# Kill any remaining sacred processes
sacred_log "Ensuring all sacred processes are stopped..."

# Kill Node.js processes (sacred-server, quantum services)
pkill -f "sacred-server.js" 2>/dev/null || true
pkill -f "quantum-love-server.js" 2>/dev/null || true
pkill -f "node.*sacred" 2>/dev/null || true

# Kill Python web server
pkill -f "python3.*http.server.*8080" 2>/dev/null || true

# Wait a moment for graceful shutdown
sleep 2

# Force kill if still running
if pgrep -f "sacred-server\|quantum.*server\|python3.*http.server.*8080" >/dev/null; then
    sacred_log "Force stopping remaining processes..."
    pkill -9 -f "sacred-server\|quantum.*server\|python3.*http.server.*8080" 2>/dev/null || true
fi

# Check if services are actually stopped
sacred_log "Verifying service shutdown..."

services_stopped=true

# Check Sacred Heart API
if curl -s http://localhost:3001/api/sacred/health >/dev/null 2>&1; then
    echo "⚠️ Sacred Heart API still responding"
    services_stopped=false
else
    success_log "✅ Sacred Heart API stopped"
fi

# Check Sacred Breath Gateway
if curl -s http://localhost:8080 >/dev/null 2>&1; then
    echo "⚠️ Sacred Breath Gateway still responding"
    services_stopped=false
else
    success_log "✅ Sacred Breath Gateway stopped"
fi

# Check Quantum Portal
if curl -s http://localhost:9999/quantum/health >/dev/null 2>&1; then
    echo "⚠️ Quantum Love Portal still responding"
    services_stopped=false
else
    success_log "✅ Quantum Love Portal stopped"
fi

echo ""
if [ "$services_stopped" = true ]; then
    echo -e "${SUCCESS_GREEN}🌟 SACRED HEART QUANTUM NATIVE SHUTDOWN COMPLETE! 🌟${RESET}"
    echo -e "${SUCCESS_GREEN}====================================================${RESET}"
    echo ""
    echo -e "${LOVE_PINK}💕 All sacred services gracefully stopped${RESET}"
    echo -e "${SACRED_BLUE}🖥️ Native deployment cleanly shutdown${RESET}"
    echo ""
    success_log "Sacred Heart native deployment stopped successfully!"
else
    echo -e "${QUANTUM_GOLD}⚠️ PARTIAL SHUTDOWN - SOME SERVICES STILL RUNNING ⚠️${RESET}"
    echo ""
    echo -e "${SACRED_BLUE}🔧 Manual cleanup may be needed:${RESET}"
    echo -e "${SACRED_BLUE}   Kill all: pkill -9 -f \"node\|python3.*http.server\"${RESET}"
    echo -e "${SACRED_BLUE}   Check processes: ps aux | grep -E \"sacred|quantum|python3.*8080\"${RESET}"
fi

echo ""
echo -e "${LOVE_PINK}🚀 To restart: ./launch-native.sh${RESET}"
echo ""