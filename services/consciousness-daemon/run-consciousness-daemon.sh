#!/bin/bash
# Run LuminousOS Consciousness Daemon

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if running as root for full functionality
if [[ $EUID -ne 0 ]]; then
    echo "Warning: Running without root. Process priority adjustments may be limited."
    echo "For full functionality, run with: sudo $0"
    echo
fi

# Set Python path
export PYTHONPATH="$SCRIPT_DIR/src:$PYTHONPATH"

# Run with config
if [ -f "$SCRIPT_DIR/config/scheduler.json" ]; then
    export LUMINOUS_CONFIG="$SCRIPT_DIR/config/scheduler.json"
fi

echo "Starting LuminousOS Consciousness Daemon..."
echo "Press Ctrl+C to stop"
echo

python3 "$SCRIPT_DIR/src/consciousness_scheduler.py"
