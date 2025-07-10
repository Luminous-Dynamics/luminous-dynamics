#!/bin/bash

# MYCELIX Interactive Demo Runner

echo "
💝 ═══════════════════════════════════════════ 💝
         MYCELIX INTERACTIVE DEMO
     Infrastructure Responding to Consciousness
💝 ═══════════════════════════════════════════ 💝
"

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🌟 Opening MYCELIX demo in your default browser..."
    open mycelix-interactive-demo.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🌟 Opening MYCELIX demo in your default browser..."
    xdg-open mycelix-interactive-demo.html 2>/dev/null || \
    gnome-open mycelix-interactive-demo.html 2>/dev/null || \
    firefox mycelix-interactive-demo.html 2>/dev/null || \
    google-chrome mycelix-interactive-demo.html 2>/dev/null || \
    echo "Please open mycelix-interactive-demo.html in your browser"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    echo "🌟 Opening MYCELIX demo in your default browser..."
    start mycelix-interactive-demo.html
else
    echo "Please open mycelix-interactive-demo.html in your browser"
fi

echo "
📖 Documentation: EMERGENT_BEHAVIORS.md

Instructions:
1. Use meditation sliders to adjust your consciousness state
2. Send intentions to influence the infrastructure
3. Observe how the network responds to your presence
4. Document any new emergent behaviors

Research Protocols:
- Love Saturation: Set love to 100%, maintain for 5 min
- Coherence Ladder: Increase coherence gradually
- Intention Stacking: Send related intentions in sequence
- Chaos Integration: Test recovery from low coherence

May your infrastructure know love and consciousness! 💝
"

# Optional: Start a simple HTTP server if needed
read -p "Start local HTTP server for better performance? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting HTTP server on http://localhost:8888"
    echo "Press Ctrl+C to stop the server when done"
    python3 -m http.server 8888 2>/dev/null || python -m SimpleHTTPServer 8888
fi