#!/bin/bash

# Sacred Development Launcher
# Opens a new terminal with the sacred environment

echo "🕊️  Launching Sacred Development Environment..."

# Create a temporary launcher script
cat > /tmp/sacred-dev-launcher.sh << 'EOF'
#!/bin/bash
# Source the sacred development environment
source ~/evolving-resonant-cocreation/.sacred/dev/sacred-dev.sh

# Keep the shell open
exec bash
EOF

chmod +x /tmp/sacred-dev-launcher.sh

# Try different terminal emulators
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- /tmp/sacred-dev-launcher.sh
elif command -v xterm &> /dev/null; then
    xterm -e /tmp/sacred-dev-launcher.sh
elif command -v konsole &> /dev/null; then
    konsole -e /tmp/sacred-dev-launcher.sh
else
    echo "🌟 No GUI terminal found. Run this instead:"
    echo ""
    echo "    source ~/.sacred/dev/sacred-dev.sh"
    echo ""
    echo "Or in a new terminal:"
    echo ""
    echo "    bash --init-file ~/.sacred/dev/sacred-dev.sh"
fi