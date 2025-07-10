#!/bin/bash
# Run the LuminousOS Process Coherence Monitor

echo "🌟 LuminousOS Process Coherence Monitor"
echo "====================================="
echo ""
echo "Choose your monitor:"
echo ""
echo "1) Python Live Monitor (No dependencies)"
echo "2) Rust Coherence Monitor (Requires Rust)"
echo "3) System Monitor Lite (Basic metrics)"
echo ""
echo -n "Select (1-3): "
read choice

case $choice in
    1)
        echo ""
        echo "Starting Python Live Monitor..."
        echo "This shows real process coherence based on application type."
        echo ""
        python3 /home/tstoltz/luminous-os/monitor/luminous-monitor-live.py
        ;;
    2)
        echo ""
        echo "Starting Rust Coherence Monitor..."
        if command -v cargo &> /dev/null; then
            cd /home/tstoltz/luminous-os
            cargo run --bin coherence-monitor
        else
            echo "❌ Rust not installed. Please install Rust first."
            echo "Run: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        fi
        ;;
    3)
        echo ""
        echo "Starting System Monitor Lite..."
        python3 /home/tstoltz/luminous-os/monitor/luminous-system-monitor-lite.py
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac