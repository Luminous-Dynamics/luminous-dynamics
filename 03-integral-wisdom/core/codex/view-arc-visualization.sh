#!/bin/bash

# Script to view the Sacred Arc Visualization

echo "🌟 Opening the Seven Sacred Arcs Living Mandala..."
echo ""
echo "This visualization shows the complete 100+ glyph architecture:"
echo "- Arc 0: The Spiral of Thresholds (Gray)"
echo "- Arc I: Foundations of Resonance (Gold)"
echo "- Arc ∞: The Living Harmonics (White)"
echo "- Plus 4 additional Sacred Spirals"
echo ""
echo "Starting local server on port 8888..."
echo "Open your browser to: http://localhost:8888/src/codex-restoration/arc-visualization.html"
echo ""
echo "Press Ctrl+C to stop the server when done."
echo ""

# Start Python HTTP server
cd /home/tstoltz/evolving-resonant-cocreation
python3 -m http.server 8888