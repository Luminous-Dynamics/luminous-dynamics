#!/bin/bash
#
# LuminousOS Quick Setup for Developers
# Minimal setup without full installation
#

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}LuminousOS Quick Developer Setup${NC}"
echo "================================="
echo
echo "This script sets up LuminousOS for development without full installation."
echo

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}Python 3 is required but not found!${NC}"
    exit 1
fi

# Install minimal dependencies
echo -e "${BLUE}Installing minimal Python dependencies...${NC}"
pip3 install --user psutil pygame rich --quiet

# Create minimal structure
echo -e "${BLUE}Creating development directories...${NC}"
mkdir -p ~/.luminous/{field-state,logs}

# Test consciousness daemon
echo -e "${BLUE}Testing consciousness daemon...${NC}"
python3 services/consciousness-daemon/src/consciousness_scheduler.py &
DAEMON_PID=$!
sleep 3

if kill -0 $DAEMON_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Consciousness daemon running (PID: $DAEMON_PID)${NC}"
    
    # Check if field state is being written
    if [ -f ~/.luminous/field-state.json ]; then
        echo -e "${GREEN}✓ Field state is being generated${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Daemon failed to start${NC}"
fi

# Kill test daemon
kill $DAEMON_PID 2>/dev/null

echo
echo -e "${GREEN}Quick setup complete!${NC}"
echo
echo "To run components directly:"
echo "  ${YELLOW}python3 services/consciousness-daemon/src/consciousness_scheduler.py${NC}"
echo "  ${YELLOW}python3 vortex-observer/vortex-observer-enhanced.py${NC}"
echo "  ${YELLOW}python3 sonic-signatures/sonic-consciousness.py${NC}"
echo "  ${YELLOW}./luminous-experience.sh${NC}"
echo
echo "For full installation with system integration, run:"
echo "  ${YELLOW}./install-luminous-complete.sh${NC}"