#!/bin/bash

echo "🌟 Luminous OS Monitoring Suite"
echo "=============================="
echo
echo "Available monitors:"
echo "1) Consciousness Field Monitor (Terminal)"
echo "2) Field Visualizer (Pygame)"
echo "3) Quantum Entanglement Monitor"
echo "4) Launch All Monitors"
echo
read -p "Select monitor to launch (1-4): " choice

case $choice in
    1)
        echo "🕉️ Launching Consciousness Field Monitor..."
        python3 consciousness-monitor.py
        ;;
    2)
        echo "🎨 Launching Field Visualizer..."
        echo "Note: Requires pygame (pip install pygame)"
        python3 field-visualizer.py
        ;;
    3)
        echo "🔮 Launching Quantum Entanglement Monitor..."
        echo "Note: Requires networkx and matplotlib (pip install networkx matplotlib)"
        python3 quantum-entanglement-monitor.py
        ;;
    4)
        echo "🚀 Launching all monitors..."
        echo "Starting in separate terminals..."
        
        # Check if we're in a graphical environment
        if [ -n "$DISPLAY" ]; then
            # Try to use different terminal emulators
            if command -v gnome-terminal &> /dev/null; then
                gnome-terminal -- python3 consciousness-monitor.py &
                gnome-terminal -- python3 quantum-entanglement-monitor.py &
                python3 field-visualizer.py
            elif command -v xterm &> /dev/null; then
                xterm -e python3 consciousness-monitor.py &
                xterm -e python3 quantum-entanglement-monitor.py &
                python3 field-visualizer.py
            else
                echo "⚠️  No suitable terminal emulator found"
                echo "Please run monitors manually in separate terminals"
            fi
        else
            echo "⚠️  No display available. Running monitors sequentially..."
            echo "Consider using tmux or screen for multiple monitors"
            python3 consciousness-monitor.py
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac