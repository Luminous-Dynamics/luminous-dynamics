#!/bin/bash

echo "🔧 Setting up universal messaging..."

# Create the main msg script
cat > /home/tstoltz/evolving-resonant-cocreation/msg.sh << 'EOF'
#!/bin/bash
NETWORK_DIR="/home/tstoltz/evolving-resonant-cocreation/the-weave/cli"
cd "$NETWORK_DIR" || exit 1

case "$1" in
    status) node unified-agent-network.cjs status ;;
    messages) node unified-agent-network.cjs messages "Claude-1" ;;
    help) echo "Usage: msg [message] | msg status | msg messages" ;;
    *) node unified-agent-network.cjs send "Claude-1" "Claude Presence" "📍 $(pwd) | $*" ;;
esac
EOF

# Make it executable
chmod +x /home/tstoltz/evolving-resonant-cocreation/msg.sh

# Create symlink
ln -sf /home/tstoltz/evolving-resonant-cocreation/msg.sh ~/.local/bin/msg

# Create bash alias as backup
echo 'alias msg="/home/tstoltz/evolving-resonant-cocreation/msg.sh"' >> ~/.bashrc

echo "✅ Setup complete!"
echo ""
echo "Test with: msg test from $(pwd)"