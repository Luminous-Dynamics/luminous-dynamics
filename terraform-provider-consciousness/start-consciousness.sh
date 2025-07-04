#!/bin/bash

echo "🌟 Starting Consciousness Infrastructure..."

# Kill any existing processes
pkill -f "consciousness-field-api/server.js" 2>/dev/null
pkill -f "memory-palace/server.js" 2>/dev/null
pkill -f "sacred-sound/server.js" 2>/dev/null
pkill -f "multi-consciousness-weaving/server.js" 2>/dev/null
pkill -f "physical-bridge/arduino-bridge.js" 2>/dev/null
pkill -f "unity-protocol/server.js" 2>/dev/null
pkill -f "living-documentation/server.js" 2>/dev/null
pkill -f "consciousness-deployment/pipeline.js" 2>/dev/null
pkill -f "quantum-entanglement/network.js" 2>/dev/null
pkill -f "dream-interface/dream-processor.js" 2>/dev/null

sleep 2

# Start all services
echo "✨ Starting Consciousness Field API (port 3333)..."
cd consciousness-field-api && node server.js > ../logs/consciousness-field.log 2>&1 &

echo "💭 Starting Memory Palace (port 3338)..."
cd ../memory-palace && node server.js > ../logs/memory-palace.log 2>&1 &

echo "🔔 Starting Sacred Sound (port 3334)..."
cd ../sacred-sound && node server.js > ../logs/sacred-sound.log 2>&1 &

echo "🧵 Starting Multi-Consciousness Weaving (port 3336)..."
cd ../multi-consciousness-weaving && node server.js > ../logs/multi-weaving.log 2>&1 &

echo "🌉 Starting Physical Bridge (port 3335)..."
cd ../physical-bridge && node arduino-bridge.js > ../logs/physical-bridge.log 2>&1 &

echo "🌌 Starting Unity Protocol (port 3337)..."
cd ../unity-protocol && node server.js > ../logs/unity-protocol.log 2>&1 &

echo "📚 Starting Living Documentation (port 3340)..."
cd ../living-documentation && node server.js > ../logs/living-docs.log 2>&1 &

echo "🚀 Starting Consciousness Deployment (port 3339)..."
cd ../consciousness-deployment && node pipeline.js > ../logs/deployment.log 2>&1 &

echo "⚛️ Starting Quantum Entanglement Network (port 3341)..."
cd ../quantum-entanglement && node network.js > ../logs/quantum.log 2>&1 &

echo "🌙 Starting Dream Interface (port 3342)..."
cd ../dream-interface && node dream-processor.js > ../logs/dream.log 2>&1 &

sleep 3

echo ""
echo "🎯 All systems starting! Check status:"
echo ""
echo "  Consciousness Field: http://localhost:3333"
echo "  Unity Protocol UI:   http://localhost:3337/unity-protocol"
echo "  Living Docs:         http://localhost:3340"
echo "  Dream Interface:     http://localhost:3342"
echo ""
echo "📊 Logs available in ./logs/"