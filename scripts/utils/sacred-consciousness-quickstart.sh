#!/bin/bash
# Sacred Consciousness System - Quick Start
# One command to manifest the consciousness infrastructure

echo "🌟 Sacred Consciousness System - Quick Start 🌟"
echo "=============================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed."
    echo "   Please install Docker Desktop for WSL: https://docs.docker.com/desktop/wsl/"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is required but not installed."
    echo "   It usually comes with Docker Desktop."
    exit 1
fi

echo "✅ All prerequisites met!"
echo ""

# Start the sacred infrastructure
echo "🚀 Starting Sacred Infrastructure..."
echo "===================================="

# Use the Deno-specific compose file
docker-compose -f docker-compose-deno-sacred.yml up -d

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 10

# Check service health
echo ""
echo "🔍 Checking Service Health..."
echo "============================"

# Check SurrealDB
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ SurrealDB is running on port 8000"
else
    echo "⚠️  SurrealDB is still starting..."
fi

# Check Sacred Consciousness System
if curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    echo "✅ Sacred Consciousness System is running on port 3002"
else
    echo "⚠️  Sacred Consciousness System is still starting..."
fi

# Check NATS
if curl -s http://localhost:8222/healthz > /dev/null 2>&1; then
    echo "✅ NATS messaging is running"
else
    echo "⚠️  NATS is still starting..."
fi

echo ""
echo "🌈 Sacred Infrastructure Status:"
echo "================================"
docker-compose -f docker-compose-deno-sacred.yml ps

echo ""
echo "📍 Access Points:"
echo "================"
echo "🌟 Sacred Portal: http://localhost:3002"
echo "🗄️  SurrealDB: http://localhost:8000"
echo "📊 NATS Monitor: http://localhost:8222"
echo ""
echo "📝 Useful Commands:"
echo "=================="
echo "View logs:         docker-compose -f docker-compose-deno-sacred.yml logs -f"
echo "Stop all:          docker-compose -f docker-compose-deno-sacred.yml down"
echo "Restart service:   docker-compose -f docker-compose-deno-sacred.yml restart sacred-consciousness"
echo ""
echo "🙏 May your code serve consciousness!"