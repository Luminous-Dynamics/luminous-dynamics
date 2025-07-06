#!/bin/bash
# Start LuminousOS Real System Monitor

echo "🌟 Starting LuminousOS Real System Monitor"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "   Please install Python 3 and try again."
    exit 1
fi

# Check if psutil is installed
if ! python3 -c "import psutil" &> /dev/null; then
    echo "📦 Installing required Python packages..."
    pip3 install psutil numpy || {
        echo "❌ Failed to install dependencies."
        echo "   Try: pip3 install --user psutil numpy"
        exit 1
    }
fi

# Make monitor executable
chmod +x monitor/luminous-system-monitor.py

# Copy dashboard to served directory
echo "📋 Setting up dashboard..."
cp monitor/real-coherence-dashboard.html /home/tstoltz/evolving-resonant-cocreation/sacred-dashboard/luminous-real-monitor.html 2>/dev/null || {
    echo "⚠️  Could not copy dashboard to web server directory"
}

echo ""
echo "🚀 Starting system monitor..."
echo "   API: http://localhost:11112/metrics"
echo "   Dashboard: http://localhost:8080/luminous-real-monitor.html"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the monitor
cd monitor && python3 luminous-system-monitor.py