#!/bin/bash
#
# Test Consciousness Integration
# Demonstrates real coherence data flowing from daemon to vortex observer
#

echo "🌟 LuminousOS Consciousness Integration Test"
echo "==========================================="
echo
echo "This will demonstrate:"
echo "1. Real process coherence calculation"
echo "2. Priority adjustment based on consciousness"
echo "3. Visual representation in vortex observer"
echo

# Check if consciousness daemon is installed
if [ ! -f "services/consciousness-daemon/src/consciousness_scheduler.py" ]; then
    echo "❌ Consciousness daemon not found!"
    echo "Please run: cd services/consciousness-daemon && ./install.sh"
    exit 1
fi

# Create directories for fallback state file
mkdir -p ~/.luminous

echo "Starting consciousness daemon in background..."
echo "(It will calculate real coherence for all processes)"
echo

# Start consciousness daemon
python3 services/consciousness-daemon/src/consciousness_scheduler.py &
DAEMON_PID=$!

echo "Daemon started with PID: $DAEMON_PID"
echo "Waiting 10 seconds for initial coherence calculation..."
sleep 10

echo
echo "Now starting Enhanced Vortex Observer..."
echo "You should see:"
echo "  - ⚡ symbol for processes with real coherence data"
echo "  - Actual priority (nice) values being adjusted"
echo "  - 'Connected' status in the header"
echo
echo "Press Enter to continue..."
read

# Run enhanced vortex observer
python3 vortex-observer/vortex-observer-enhanced.py

# Cleanup
echo
echo "Stopping consciousness daemon..."
kill $DAEMON_PID 2>/dev/null

echo "Test complete! 🌟"
echo
echo "To run permanently:"
echo "1. Install as service: cd services/consciousness-daemon && sudo ./install.sh"
echo "2. Start service: sudo systemctl start luminous-consciousness"
echo "3. Run vortex observer: python3 vortex-observer/vortex-observer-enhanced.py"