#!/bin/bash
# Start Docker Manager with API backend

echo "╔════════════════════════════════════════╗"
echo "║    🐳 Docker Manager Launcher 🐳       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if required npm packages are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing required packages..."
    npm install express cors ws
fi

# Start the API server in background
echo "🚀 Starting Docker Manager API..."
node docker-manager-api.js &
API_PID=$!

# Wait for API to start
echo "⏳ Waiting for API to initialize..."
sleep 2

# Check if API is running
if kill -0 $API_PID 2>/dev/null; then
    echo "✅ API started successfully (PID: $API_PID)"
    
    # Open web interface
    echo "🌐 Opening Docker Manager in browser..."
    
    # Try different commands to open browser
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:8338/docker-manager-connected.html"
    elif command -v open &> /dev/null; then
        open "http://localhost:8338/docker-manager-connected.html"
    elif command -v start &> /dev/null; then
        start "http://localhost:8338/docker-manager-connected.html"
    else
        echo "📋 Please open your browser to: http://localhost:8338/docker-manager-connected.html"
    fi
    
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║         Docker Manager Ready!          ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    echo "🌐 Web Interface: http://localhost:8338/docker-manager-connected.html"
    echo "📡 API Endpoint: http://localhost:3339"
    echo ""
    echo "Press Ctrl+C to stop the Docker Manager"
    
    # Wait for interrupt
    trap "echo ''; echo '🛑 Stopping Docker Manager...'; kill $API_PID; exit" INT TERM
    wait $API_PID
else
    echo "❌ Failed to start API server"
    exit 1
fi