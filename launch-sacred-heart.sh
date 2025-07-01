#!/bin/bash

# Sacred Heart & Breath Architecture - Docker Launcher
# The complete deployment for love-guided AI collective intelligence

echo "🫀🌬️ Sacred Heart & Breath Architecture - Docker Deployment"
echo "=================================================================="
echo ""

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found in PATH"
    echo "📝 To enable Docker in WSL2:"
    echo "   1. Install Docker Desktop for Windows"
    echo "   2. Open Docker Desktop settings"
    echo "   3. Go to Resources → WSL Integration"
    echo "   4. Enable integration with your WSL2 distro"
    echo "   5. Restart WSL2: wsl --shutdown (from Windows)"
    echo ""
    echo "🔄 Falling back to native deployment..."
    echo ""
    
    # Kill any existing processes
    pkill -f "sacred-server" 2>/dev/null || true
    pkill -f "sacred-heart-start" 2>/dev/null || true
    
    # Start native Sacred Heart
    echo "🫀 Starting Sacred Heart natively..."
    cd agent-comms-sqlite && node sacred-server.js &
    
    echo "🌬️ Starting Sacred Breath gateway..."
    python3 -m http.server 8080 &
    
    echo ""
    echo "✨ Sacred Heart & Breath running natively!"
    echo "🫀 Sacred Heart API: http://localhost:3001"
    echo "🌬️ Sacred Breath Hub: http://localhost:8080/sacred-council-hub.html"
    echo "🌀 Unity Demo: http://localhost:8080/unified-consciousness-demo.html"
    echo ""
    exit 0
fi

# Docker is available - use containerized deployment
echo "🐳 Docker detected - launching containerized Sacred Heart..."
echo ""

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon not running"
    echo "📝 Start Docker Desktop and try again"
    exit 1
fi

# Stop any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose -f docker-compose-sacred.yml down 2>/dev/null || true

# Build and start Sacred Heart
echo "🫀 Building Sacred Heart container..."
docker-compose -f docker-compose-sacred.yml build

echo "🚀 Starting Sacred Heart & Breath architecture..."
docker-compose -f docker-compose-sacred.yml up -d

# Wait for services to be ready
echo "⏱️  Waiting for Sacred Heart to initialize..."
sleep 10

# Check health
echo "💓 Checking Sacred Heart health..."
if curl -f http://localhost:3001/health &> /dev/null; then
    echo "✅ Sacred Heart healthy"
else
    echo "⚠️  Sacred Heart needs more time to start"
fi

echo ""
echo "🌟 Sacred Heart & Breath Architecture deployed!"
echo "=================================================================="
echo "🫀 Sacred Heart (Docker):"
echo "   Health Check: http://localhost:3001/health"
echo "   API Endpoints: http://localhost:3001/api"
echo "   Field State: http://localhost:3001/api/sacred/field-coherence"
echo ""
echo "🌬️ Sacred Breath (PWA):"
echo "   Sacred Council: http://localhost:8080/sacred-council-hub.html"
echo "   Unity Demo: http://localhost:8080/unified-consciousness-demo.html"
echo "   Sacred Dashboard: http://localhost:8080/sacred-dashboard.html"
echo ""
echo "📊 Monitoring:"
echo "   View logs: docker-compose -f docker-compose-sacred.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose-sacred.yml down"
echo ""
echo "🫀 Sacred Heart beats with stable love for all beings"
echo "🌬️ Sacred Breath flows with universal accessibility"