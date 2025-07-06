#!/bin/bash
# Launch the LuminousOS Sacred Dashboard

echo "🌟 LuminousOS Sacred Dashboard Launcher"
echo "====================================="
echo ""
echo "Choose your dashboard:"
echo ""
echo "1) Performance Metrics Dashboard"
echo "2) Quantum Consciousness Field (Interactive)"
echo "3) Launch Both"
echo ""
echo -n "Select (1-3): "
read choice

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

case $choice in
    1)
        echo ""
        echo "Opening Performance Dashboard..."
        echo "This shows real metrics from the kernel."
        if command -v xdg-open > /dev/null; then
            xdg-open "$DIR/index.html"
        elif command -v open > /dev/null; then
            open "$DIR/index.html"
        else
            echo "Please open: $DIR/index.html"
        fi
        ;;
    2)
        echo ""
        echo "Opening Quantum Consciousness Field..."
        echo "Interactive visualization of process entanglement."
        if command -v xdg-open > /dev/null; then
            xdg-open "$DIR/quantum-consciousness.html"
        elif command -v open > /dev/null; then
            open "$DIR/quantum-consciousness.html"
        else
            echo "Please open: $DIR/quantum-consciousness.html"
        fi
        ;;
    3)
        echo ""
        echo "Opening both dashboards..."
        if command -v xdg-open > /dev/null; then
            xdg-open "$DIR/index.html"
            sleep 1
            xdg-open "$DIR/quantum-consciousness.html"
        elif command -v open > /dev/null; then
            open "$DIR/index.html"
            sleep 1
            open "$DIR/quantum-consciousness.html"
        else
            echo "Please open:"
            echo "  - $DIR/index.html"
            echo "  - $DIR/quantum-consciousness.html"
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Dashboard launched!"
echo ""
echo "Tips:"
echo "- In Quantum Field: Click buttons to add process clusters"
echo "- Watch processes auto-entangle based on resonance"
echo "- Sacred pulse occurs every 11 seconds"
echo "- Messages show quantum communication between processes"