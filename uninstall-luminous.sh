#!/bin/bash
#
# LuminousOS Uninstaller
# Cleanly remove LuminousOS from your system
#

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Paths
INSTALL_BASE="$HOME/.luminous"
BIN_PATH="$HOME/.local/bin"
SYSTEMD_USER="$HOME/.config/systemd/user"

echo -e "${YELLOW}LuminousOS Uninstaller${NC}"
echo "========================"
echo
echo "This will remove:"
echo "  • $INSTALL_BASE (all LuminousOS files)"
echo "  • Command line tools from $BIN_PATH"
echo "  • Systemd service files"
echo
read -p "Continue with uninstallation? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstallation cancelled."
    exit 0
fi

echo -e "\n${YELLOW}Stopping services...${NC}"
if command -v systemctl &> /dev/null; then
    systemctl --user stop luminous-consciousness 2>/dev/null
    systemctl --user disable luminous-consciousness 2>/dev/null
fi

echo -e "${YELLOW}Removing files...${NC}"

# Remove binaries
for cmd in luminous luminous-daemon luminous-vortex luminous-sonic luminous-mycelial; do
    rm -f "$BIN_PATH/$cmd"
    echo "  Removed $cmd"
done

# Remove systemd service
rm -f "$SYSTEMD_USER/luminous-consciousness.service"
if command -v systemctl &> /dev/null; then
    systemctl --user daemon-reload
fi

# Remove installation directory
if [ -d "$INSTALL_BASE" ]; then
    rm -rf "$INSTALL_BASE"
    echo "  Removed $INSTALL_BASE"
fi

echo -e "\n${GREEN}LuminousOS has been uninstalled.${NC}"
echo -e "${YELLOW}Note: Python packages were not removed (use pip to manage them)${NC}"
echo -e "${YELLOW}Note: PATH modifications in .bashrc were not removed${NC}\n"