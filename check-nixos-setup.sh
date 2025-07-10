#!/usr/bin/env bash
# Check current NixOS setup for Rust development

echo "🔍 Checking NixOS Configuration for Rust Development"
echo "==================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if flakes are enabled
echo -e "\n${BLUE}Checking Flakes Support:${NC}"

# Check system nix.conf
if [ -f "/etc/nix/nix.conf" ]; then
    if grep -q "experimental-features.*flakes" /etc/nix/nix.conf; then
        echo -e "${GREEN}✓ Flakes enabled in /etc/nix/nix.conf${NC}"
    else
        echo -e "${YELLOW}⚠ Flakes not found in /etc/nix/nix.conf${NC}"
    fi
fi

# Check user nix.conf
if [ -f "$HOME/.config/nix/nix.conf" ]; then
    if grep -q "experimental-features.*flakes" "$HOME/.config/nix/nix.conf"; then
        echo -e "${GREEN}✓ Flakes enabled in user config${NC}"
    else
        echo -e "${YELLOW}⚠ Flakes not enabled in user config${NC}"
    fi
else
    echo -e "${YELLOW}○ No user nix.conf found${NC}"
fi

# Check for Rust tools
echo -e "\n${BLUE}Checking Installed Tools:${NC}"

tools=("rustc" "cargo" "rustup" "gcc" "pkg-config" "make")
for tool in "${tools[@]}"; do
    if command -v $tool &> /dev/null; then
        echo -e "${GREEN}✓ $tool is installed${NC}"
    else
        echo -e "${RED}✗ $tool is not installed${NC}"
    fi
done

# Check for graphics libraries
echo -e "\n${BLUE}Checking Graphics Libraries:${NC}"

# Check for Vulkan
if [ -d "/run/opengl-driver/lib" ]; then
    echo -e "${GREEN}✓ OpenGL drivers directory exists${NC}"
else
    echo -e "${YELLOW}⚠ OpenGL drivers directory not found${NC}"
fi

if command -v vulkaninfo &> /dev/null; then
    echo -e "${GREEN}✓ Vulkan tools installed${NC}"
else
    echo -e "${YELLOW}○ Vulkan tools not installed${NC}"
fi

# Check environment variables
echo -e "\n${BLUE}Environment Variables:${NC}"

if [ ! -z "$VK_LAYER_PATH" ]; then
    echo -e "${GREEN}✓ VK_LAYER_PATH is set${NC}"
else
    echo -e "${YELLOW}○ VK_LAYER_PATH not set${NC}"
fi

if [ ! -z "$RUST_BACKTRACE" ]; then
    echo -e "${GREEN}✓ RUST_BACKTRACE is set to: $RUST_BACKTRACE${NC}"
else
    echo -e "${YELLOW}○ RUST_BACKTRACE not set${NC}"
fi

# Show how to enable flakes if not enabled
if ! grep -q "experimental-features.*flakes" /etc/nix/nix.conf 2>/dev/null && \
   ! grep -q "experimental-features.*flakes" "$HOME/.config/nix/nix.conf" 2>/dev/null; then
    echo -e "\n${YELLOW}📝 To enable flakes:${NC}"
    echo "1. For current user only:"
    echo "   mkdir -p ~/.config/nix"
    echo "   echo 'experimental-features = nix-command flakes' >> ~/.config/nix/nix.conf"
    echo ""
    echo "2. System-wide (requires root):"
    echo "   Add to /etc/nixos/configuration.nix:"
    echo "   nix.settings.experimental-features = [ \"nix-command\" \"flakes\" ];"
    echo "   Then run: sudo nixos-rebuild switch"
fi

# Test if we can use nix develop
echo -e "\n${BLUE}Testing Nix Commands:${NC}"

if command -v nix &> /dev/null; then
    nix_version=$(nix --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓ Nix is available: $nix_version${NC}"
    
    # Check if new-style commands work
    if nix --help &> /dev/null; then
        echo -e "${GREEN}✓ New-style nix commands available${NC}"
    else
        echo -e "${YELLOW}⚠ New-style nix commands not available${NC}"
    fi
else
    echo -e "${RED}✗ Nix command not found${NC}"
fi

echo -e "\n${BLUE}📋 Summary:${NC}"
echo "To use the LuminousOS development environment:"
echo "1. Ensure flakes are enabled (see above)"
echo "2. Run: cd /home/tstoltz/Luminous-Dynamics/luminous-os"
echo "3. Run: nix develop  (with flakes) or nix-shell (traditional)"
echo ""
echo "The development shell will provide all necessary tools!"