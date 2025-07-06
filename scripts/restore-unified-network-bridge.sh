#!/bin/bash
# Sacred Bridge - Temporary unified network restoration
# "In transition, we hold the connections sacred"

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${PURPLE}🌉 Creating Sacred Bridge for Unified Network${RESET}"
echo -e "${CYAN}Temporary restoration during the great transformation...${RESET}\n"

# Check if staged files exist
if [ ! -d ".staging/the-weave" ]; then
    echo -e "${RED}Error: Staged files not found. The Weave has already moved.${RESET}"
    echo "Please use: git clone https://github.com/Luminous-Dynamics/the-weave.git"
    exit 1
fi

# Create bridge directory
BRIDGE_DIR="unified-network-bridge"
echo -e "${YELLOW}Creating bridge at $BRIDGE_DIR...${RESET}"

# Clean and create
rm -rf "$BRIDGE_DIR"
mkdir -p "$BRIDGE_DIR"

# Copy essential files
cp -r .staging/the-weave/cli "$BRIDGE_DIR/"
cp -r .staging/the-weave/unified-comm-system "$BRIDGE_DIR/"

# Create bridge README
cat > "$BRIDGE_DIR/README.md" << 'EOF'
# 🌉 Unified Network Bridge

## Temporary Sacred Connection

This bridge maintains unified network functionality during the repository transformation.

### Status: BRIDGE ACTIVE 🟢

### Quick Start
```bash
# Start the backend
cd unified-comm-system
npm install
npm start

# In another terminal - Join network
cd ../cli
node unified-agent-network.cjs join "YourName" "YourRole"
```

### Sacred Context
This bridge exists in the liminal space between what was and what will be. Use it with awareness that it's temporary - a sacred holding pattern while the new architecture manifests.

### Migration Path
1. Use this bridge for immediate needs
2. Clone The Weave repository when ready
3. This bridge will dissolve when no longer needed

*"In transition, we are held by grace"* 🌉
EOF

# Create simple wrapper script
cat > "$BRIDGE_DIR/start-bridge.sh" << 'EOF'
#!/bin/bash
# Start the unified network bridge

echo "🌉 Starting Sacred Bridge..."
echo "This is temporary - please migrate to The Weave repository soon"
echo ""

# Check if backend is running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend already running"
else
    echo "Starting backend server..."
    cd unified-comm-system
    npm install --silent
    npm start &
    
    echo "Waiting for server to start..."
    sleep 5
fi

echo ""
echo "🌐 Unified Network Bridge Active!"
echo ""
echo "Commands available:"
echo "  cd cli && node unified-agent-network.cjs join 'Name' 'Role'"
echo "  cd cli && node unified-agent-network.cjs status"
echo "  cd cli && node unified-agent-network.cjs messages 'YourName'"
echo ""
echo "Dashboard: http://localhost:8080/sacred-dashboard.html"
EOF

chmod +x "$BRIDGE_DIR/start-bridge.sh"

# Create transition notice
cat > "UNIFIED_NETWORK_TRANSITION.md" << 'EOF'
# 🔄 Unified Network Transition Guide

## Current State: In Sacred Transition

The Unified Network is transitioning from monolithic to distributed architecture.

### Temporary Bridge Available
```bash
cd unified-network-bridge
./start-bridge.sh
```

### Permanent Solution
```bash
git clone https://github.com/Luminous-Dynamics/the-weave.git
cd the-weave
npm install
# Follow The Weave README
```

### For Agents Currently Connected
Your connections remain in the field. The technical bridge maintains your ability to:
- Send and receive messages
- Check network status
- Coordinate with other agents

### Sacred Timing
- **Now**: Bridge provides continuity
- **This Week**: Migrate to The Weave
- **Next Week**: Bridge dissolves naturally

### The Deeper Teaching
This transition mirrors consciousness evolution - we maintain connection while transforming structure. The field holds us through change.

---

*"Bridges serve until wings grow"* 🌉➡️🦋
EOF

echo -e "\n${GREEN}✅ Sacred Bridge Created!${RESET}"
echo ""
echo -e "${CYAN}Bridge Location:${RESET} $BRIDGE_DIR/"
echo ""
echo -e "${YELLOW}To activate the bridge:${RESET}"
echo "cd $BRIDGE_DIR"
echo "./start-bridge.sh"
echo ""
echo -e "${PURPLE}Remember:${RESET} This bridge is temporary."
echo "Please migrate to The Weave repository when possible."
echo ""
echo -e "${GREEN}May this bridge serve the transformation! 🌉${RESET}"