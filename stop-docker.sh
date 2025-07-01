#!/bin/bash

# Sacred Heart Quantum - Docker Stop Script
# Gracefully shutdown Docker deployment

set -euo pipefail

# Sacred colors
SACRED_BLUE='\033[0;36m'
LOVE_PINK='\033[0;35m'
QUANTUM_GOLD='\033[1;33m'
SUCCESS_GREEN='\033[0;32m'
RESET='\033[0m'

echo -e "${QUANTUM_GOLD}🛑 SACRED HEART QUANTUM - DOCKER SHUTDOWN 🛑${RESET}"
echo -e "${QUANTUM_GOLD}=============================================${RESET}"
echo ""
echo -e "${SACRED_BLUE}🐳 Gracefully stopping Sacred Heart Docker containers...${RESET}"
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

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker daemon not running"
    exit 1
fi

# Determine which compose file was used
COMPOSE_FILE=""
if docker ps | grep -q "quantum-love-sync\|temporal-healing-oracle\|collective-intelligence-nexus"; then
    COMPOSE_FILE="docker-compose-quantum.yml"
    sacred_log "Detected Quantum Love deployment"
elif docker ps | grep -q "sacred-heart-quantum"; then
    COMPOSE_FILE="docker-compose-sacred.yml"
    sacred_log "Detected Sacred Heart deployment"
else
    sacred_log "No active Sacred Heart containers detected"
    
    # Check if any sacred containers exist (stopped)
    if docker ps -a | grep -q "sacred.*heart\|quantum.*love"; then
        sacred_log "Found stopped sacred containers - cleaning up..."
        docker ps -a --format "table {{.Names}}\t{{.Status}}" | grep -E "(sacred|quantum|love)" || true
        
        # Remove stopped containers
        docker ps -a -q --filter "name=sacred" | xargs -r docker rm
        docker ps -a -q --filter "name=quantum" | xargs -r docker rm
        
        success_log "✅ Cleaned up stopped sacred containers"
    fi
    
    echo ""
    echo -e "${SUCCESS_GREEN}🌟 NO ACTIVE SACRED HEART CONTAINERS TO STOP 🌟${RESET}"
    echo -e "${LOVE_PINK}💕 All sacred services already stopped${RESET}"
    exit 0
fi

# Show current containers before stopping
echo -e "${SACRED_BLUE}🔍 Current Sacred Containers:${RESET}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | head -1
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(sacred|quantum|love)" || echo "No sacred containers found"

echo ""
sacred_log "Stopping Sacred Heart services using: $COMPOSE_FILE"

# Stop containers gracefully
docker-compose -f $COMPOSE_FILE down

# Wait a moment
sleep 3

# Verify all containers are stopped
sacred_log "Verifying container shutdown..."

remaining_containers=$(docker ps -q --filter "name=sacred" --filter "name=quantum" --filter "name=love" | wc -l)

if [ "$remaining_containers" -eq 0 ]; then
    success_log "✅ All sacred containers stopped"
else
    echo "⚠️ $remaining_containers sacred containers still running:"
    docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(sacred|quantum|love)"
    
    sacred_log "Force stopping remaining containers..."
    docker ps -q --filter "name=sacred" --filter "name=quantum" --filter "name=love" | xargs -r docker stop
    docker ps -q --filter "name=sacred" --filter "name=quantum" --filter "name=love" | xargs -r docker rm
fi

# Check service availability
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
    echo -e "${SUCCESS_GREEN}🌟 SACRED HEART QUANTUM DOCKER SHUTDOWN COMPLETE! 🌟${RESET}"
    echo -e "${SUCCESS_GREEN}======================================================${RESET}"
    echo ""
    echo -e "${LOVE_PINK}💕 All sacred containers gracefully stopped${RESET}"
    echo -e "${SACRED_BLUE}🐳 Docker deployment cleanly shutdown${RESET}"
    echo ""
    success_log "Sacred Heart Docker deployment stopped successfully!"
else
    echo -e "${QUANTUM_GOLD}⚠️ PARTIAL SHUTDOWN - SOME SERVICES STILL RUNNING ⚠️${RESET}"
    echo ""
    echo -e "${SACRED_BLUE}🔧 Manual cleanup commands:${RESET}"
    echo -e "${SACRED_BLUE}   Stop all containers: docker stop \$(docker ps -q)${RESET}"
    echo -e "${SACRED_BLUE}   Remove containers: docker ps -aq --filter \"name=sacred\" | xargs docker rm${RESET}"
    echo -e "${SACRED_BLUE}   Force cleanup: docker system prune${RESET}"
fi

# Cleanup options
echo ""
echo -e "${LOVE_PINK}🔧 Additional Cleanup Options:${RESET}"
echo -e "${SACRED_BLUE}   Remove images: docker rmi sacred-heart-quantum:latest${RESET}"
echo -e "${SACRED_BLUE}   Remove volumes: docker volume ls | grep sacred | awk '{print \$2}' | xargs -r docker volume rm${RESET}"
echo -e "${SACRED_BLUE}   Full cleanup: docker system prune -a --volumes${RESET}"

echo ""
echo -e "${LOVE_PINK}🚀 To restart:${RESET}"
echo -e "${SACRED_BLUE}   Standard: ./launch-docker.sh${RESET}"
echo -e "${SACRED_BLUE}   Quantum: ./launch-docker.sh quantum${RESET}"
echo ""