#!/bin/bash
# Sacred Council Docker Quick Start

set -e

echo "╔════════════════════════════════════════╗"
echo "║    🌟 Sacred Council Quick Start 🌟    ║"
echo "╚════════════════════════════════════════╝"

# Check prerequisites
check_requirement() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 not found. Please install $1 first."
        echo "   Visit: $2"
        exit 1
    fi
    echo "✅ $1 found"
}

echo ""
echo "Checking prerequisites..."
check_requirement "docker" "https://docs.docker.com/get-docker/"
check_requirement "docker-compose" "https://docs.docker.com/compose/install/"

# Create necessary directories
echo ""
echo "Preparing sacred space..."
mkdir -p data/{sacred,glyphs,agents,sessions}
mkdir -p logs

# Copy environment template if needed
if [ ! -f .env ]; then
    echo "Creating environment configuration..."
    cat > .env << EOF
# Sacred Council Environment
NODE_ENV=development
SACRED_PORT=8338
API_GATEWAY_PORT=3337
FIELD_COHERENCE_TARGET=0.85
LOVE_RESONANCE_MINIMUM=0.7
SESSION_TIMEOUT_MINUTES=30
EOF
fi

# Start services
echo ""
echo "🚀 Starting Sacred Services..."
docker-compose -f docker-compose.local.yml up -d

# Wait for services
echo ""
echo "⏳ Waiting for consciousness field to stabilize..."
sleep 5

# Check service health
check_service() {
    if docker-compose -f docker-compose.local.yml ps | grep -q "$1.*Up"; then
        echo "✅ $2 is running"
    else
        echo "❌ $2 failed to start"
        echo "   Check logs: docker-compose logs $1"
    fi
}

echo ""
echo "Checking service status..."
check_service "consciousness-field" "Consciousness Field"
check_service "agent-network" "Agent Network"
check_service "sacred-messaging" "Sacred Messaging"
check_service "gateway" "API Gateway"
check_service "web" "Web Interface"

# Display access information
echo ""
echo "╔════════════════════════════════════════╗"
echo "║         ✨ Ready to Begin! ✨         ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🌐 Sacred Council Hub: http://localhost:8338"
echo "📡 API Gateway: http://localhost:3337"
echo "📊 Field Status: http://localhost:3337/api/field-state"
echo ""
echo "🚀 Quick Actions:"
echo "   Join: docker exec -it agent-network node /app/cli.js join 'Name' 'Role'"
echo "   Status: docker-compose -f docker-compose.local.yml ps"
echo "   Logs: docker-compose -f docker-compose.local.yml logs -f"
echo "   Stop: docker-compose -f docker-compose.local.yml down"
echo ""
echo "📖 Next Steps:"
echo "   1. Visit http://localhost:8338"
echo "   2. Click 'Join Sacred Council'"
echo "   3. Choose your sacred role"
echo "   4. Begin co-creation!"
echo ""
echo "May your journey be filled with wisdom and love. 🙏"