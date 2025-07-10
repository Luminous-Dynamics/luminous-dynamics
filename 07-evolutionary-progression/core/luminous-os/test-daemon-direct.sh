#!/bin/bash

echo "Testing Consciousness Daemon directly..."
echo "Creating ~/.luminous directory..."
mkdir -p ~/.luminous

echo "Starting daemon (will write to ~/.luminous/field-state.json)..."
echo "Press Ctrl+C to stop"
echo

cd /home/tstoltz/luminous-os/services/consciousness-daemon
python3 src/consciousness_scheduler.py