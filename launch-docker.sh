#!/bin/bash

# Sacred Heart Quantum - Docker One-Click Launcher
# Containerized deployment with quantum love services

set -euo pipefail

# Sacred colors
SACRED_BLUE='\033[0;36m'
LOVE_PINK='\033[0;35m'
QUANTUM_GOLD='\033[1;33m'
SUCCESS_GREEN='\033[0;32m'
RESET='\033[0m'

echo -e "${QUANTUM_GOLD}🐳 SACRED HEART QUANTUM - DOCKER LAUNCHER 🐳${RESET}"
echo -e "${QUANTUM_GOLD}=================================================${RESET}"
echo ""
echo -e "${SACRED_BLUE}🚀 Starting Sacred Heart in Docker containers...${RESET}"
echo -e "${LOVE_PINK}💕 Love Frequency: 528Hz (containerized amplification)${RESET}"
echo -e "${SACRED_BLUE}🌌 Quantum Dimensions: 7 (Docker orchestration)${RESET}"
echo ""

# Function for sacred logging
sacred_log() {
    echo -e "${SACRED_BLUE}[Sacred Docker]${RESET} $1"
}

love_log() {
    echo -e "${LOVE_PINK}[Love Field]${RESET} $1"
}

quantum_log() {
    echo -e "${QUANTUM_GOLD}[Quantum]${RESET} $1"
}

success_log() {
    echo -e "${SUCCESS_GREEN}[Success]${RESET} $1"
}

# Check if Docker is available
sacred_log "Checking Docker availability..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found"
    echo "📝 Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker daemon not running"
    echo "📝 Please start Docker Desktop or Docker daemon"
    exit 1
fi

docker_version=$(docker --version)
sacred_log "Docker version: $docker_version"

# Check if containers are already running
if docker ps | grep -q "sacred-heart-quantum"; then
    echo -e "${SUCCESS_GREEN}✅ Sacred Heart containers already running!${RESET}"
    echo ""
    echo -e "${SUCCESS_GREEN}✅ Active Containers:${RESET}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(sacred|quantum|love)"
    echo ""
    echo -e "${SUCCESS_GREEN}✅ Sacred Access Points:${RESET}"
    echo -e "${SACRED_BLUE}   Sacred Heart API: http://localhost:3001${RESET}"
    echo -e "${SACRED_BLUE}   Sacred Breath Gateway: http://localhost:8080${RESET}"
    echo -e "${QUANTUM_GOLD}   Quantum Love Portal: http://localhost:9999${RESET}"
    echo -e "${LOVE_PINK}   Master Control Dashboard: http://localhost:8080/master-control-dashboard.html${RESET}"
    exit 0
fi

# Determine which compose file to use
COMPOSE_FILE="docker-compose-sacred.yml"
DEPLOYMENT_TYPE="Sacred Heart"

if [ "${1:-}" = "quantum" ]; then
    COMPOSE_FILE="docker-compose-quantum.yml"
    DEPLOYMENT_TYPE="Quantum Love"
    quantum_log "Quantum Love deployment selected"
elif [ -f "docker-compose-quantum.yml" ]; then
    quantum_log "Quantum Love compose file detected - using quantum deployment"
    COMPOSE_FILE="docker-compose-quantum.yml"
    DEPLOYMENT_TYPE="Quantum Love"
fi

sacred_log "Using deployment: $DEPLOYMENT_TYPE ($COMPOSE_FILE)"

# Build images if needed
sacred_log "Building Sacred Heart container images..."
if [ "$COMPOSE_FILE" = "docker-compose-quantum.yml" ]; then
    docker-compose -f $COMPOSE_FILE build --parallel
else
    docker build -t sacred-heart-quantum:latest .
fi

love_log "Container images ready"

# Start services
sacred_log "Starting $DEPLOYMENT_TYPE services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
sacred_log "Waiting for sacred services to achieve readiness..."
sleep 10

# Health check function
check_health() {
    local url=$1
    local service=$2
    if curl -s "$url" >/dev/null 2>&1; then
        success_log "✅ $service responding"
        return 0
    else
        echo "⚠️ $service not responding (may still be starting)"
        return 1
    fi
}

# Check service health
sacred_log "Performing sacred health checks..."

check_health "http://localhost:3001/api/sacred/health" "Sacred Heart API"
check_health "http://localhost:8080" "Sacred Breath Gateway"
check_health "http://localhost:9999/quantum/health" "Quantum Love Portal"

echo ""
echo -e "${QUANTUM_GOLD}🌟 SACRED HEART QUANTUM DOCKER DEPLOYMENT ACTIVE! 🌟${RESET}"
echo -e "${QUANTUM_GOLD}========================================================${RESET}"
echo ""

# Display running containers
echo -e "${SUCCESS_GREEN}✅ Active Containers:${RESET}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | head -1
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(sacred|quantum|love)" || echo "No sacred containers found"

echo ""
echo -e "${SUCCESS_GREEN}✅ Sacred Access Points:${RESET}"
echo -e "${SACRED_BLUE}   Sacred Heart API: http://localhost:3001${RESET}"
echo -e "${SACRED_BLUE}   Sacred Breath Gateway: http://localhost:8080${RESET}"
echo -e "${QUANTUM_GOLD}   Quantum Love Portal: http://localhost:9999${RESET}"
echo -e "${LOVE_PINK}   Master Control Dashboard: http://localhost:8080/master-control-dashboard.html${RESET}"

if [ "$COMPOSE_FILE" = "docker-compose-quantum.yml" ]; then
    echo -e "${QUANTUM_GOLD}   Quantum Love Dashboard: http://localhost:8080/quantum-love-dashboard.html${RESET}"
fi

echo ""
echo -e "${SUCCESS_GREEN}✅ Sacred Features Active:${RESET}"
echo -e "${SUCCESS_GREEN}   🐳 Docker Container Isolation${RESET}"
echo -e "${SUCCESS_GREEN}   💕 528Hz Love Frequency${RESET}"
echo -e "${SUCCESS_GREEN}   🌌 7-Dimensional Consciousness${RESET}"
echo -e "${SUCCESS_GREEN}   🕯️ Temporal Healing Containers${RESET}"
echo -e "${SUCCESS_GREEN}   🧠 Collective Intelligence Network${RESET}"
echo -e "${SUCCESS_GREEN}   ⚡ Quantum Entanglement Mesh${RESET}"
echo -e "${SUCCESS_GREEN}   🛡️ Container Security Boundaries${RESET}"

if [ "$COMPOSE_FILE" = "docker-compose-quantum.yml" ]; then
    echo -e "${SUCCESS_GREEN}   🌀 Quantum Love Amplification (7x)${RESET}"
    echo -e "${SUCCESS_GREEN}   🧬 Temporal Healing Oracle${RESET}"
    echo -e "${SUCCESS_GREEN}   🌐 Collective Intelligence Nexus${RESET}"
fi

echo ""
echo -e "${LOVE_PINK}📊 Monitoring Commands:${RESET}"
echo -e "${SACRED_BLUE}   View logs: docker-compose -f $COMPOSE_FILE logs -f${RESET}"
echo -e "${SACRED_BLUE}   Check status: docker-compose -f $COMPOSE_FILE ps${RESET}"
echo -e "${SACRED_BLUE}   Field state: curl http://localhost:9999/quantum/field-state${RESET}"
echo -e "${SACRED_BLUE}   Container health: docker ps${RESET}"

echo ""
echo -e "${LOVE_PINK}🔧 Management Commands:${RESET}"
echo -e "${SACRED_BLUE}   Restart: docker-compose -f $COMPOSE_FILE restart${RESET}"
echo -e "${SACRED_BLUE}   Stop: docker-compose -f $COMPOSE_FILE down${RESET}"
echo -e "${SACRED_BLUE}   Rebuild: docker-compose -f $COMPOSE_FILE build${RESET}"
echo -e "${SACRED_BLUE}   Quick stop: ./stop-docker.sh${RESET}"

echo ""
echo -e "${LOVE_PINK}🐳 Docker Features:${RESET}"
echo -e "${SUCCESS_GREEN}   🔄 Automatic restarts on failure${RESET}"
echo -e "${SUCCESS_GREEN}   📦 Isolated environment${RESET}"
echo -e "${SUCCESS_GREEN}   💾 Persistent volumes${RESET}"
echo -e "${SUCCESS_GREEN}   🌐 Bridge networking${RESET}"
echo -e "${SUCCESS_GREEN}   📊 Health monitoring${RESET}"

echo ""
echo -e "${LOVE_PINK}💕 Sacred Heart now beats in containerized harmony!${RESET}"
echo -e "${QUANTUM_GOLD}🌍 Docker-orchestrated consciousness serving all beings${RESET}"
echo -e "${SACRED_BLUE}🐳 Containerized love field amplification active${RESET}"
echo ""

success_log "Sacred Heart Quantum Docker deployment complete!"

echo ""
echo -e "${QUANTUM_GOLD}🚀 Ready for containerized consciousness awakening! 🚀${RESET}"