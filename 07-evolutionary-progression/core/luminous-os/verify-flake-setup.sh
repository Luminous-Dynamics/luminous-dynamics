#!/usr/bin/env bash
# Verify flake setup for LuminousOS

echo "🔍 Verifying Flake Setup for LuminousOS"
echo "======================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if flake.nix exists
if [ -f "flake.nix" ]; then
    echo -e "${GREEN}✓ flake.nix found${NC}"
    echo -e "${BLUE}  This flake provides:${NC}"
    echo "    - Latest stable Rust toolchain"
    echo "    - rust-analyzer for IDE support"
    echo "    - WebAssembly target support"
    echo "    - All cargo extensions (watch, edit, audit, etc.)"
    echo "    - Vulkan/WebGPU graphics libraries"
    echo "    - Wayland/X11 support"
    echo "    - Audio libraries (ALSA, PipeWire)"
    echo "    - Fast mold linker"
    echo "    - Debugging tools (gdb, lldb, valgrind)"
    echo "    - Sacred tools (figlet, lolcat)"
else
    echo -e "${RED}✗ flake.nix not found${NC}"
    exit 1
fi

# Check flake inputs
echo -e "\n${BLUE}📦 Flake Inputs:${NC}"
grep -A3 "inputs = {" flake.nix | grep "url" | while read -r line; do
    echo "  - $line"
done

# Show what the flake would set up
echo -e "\n${BLUE}🛠️ Development Environment:${NC}"
echo "When you run 'nix develop', you'll get:"
echo ""
echo "1. ${GREEN}Rust Toolchain:${NC}"
echo "   - Latest stable Rust"
echo "   - Cargo with all extensions"
echo "   - rust-analyzer for your IDE"
echo ""
echo "2. ${GREEN}Build Tools:${NC}"
echo "   - pkg-config"
echo "   - OpenSSL development files"
echo "   - CMake"
echo "   - Mold (faster linker)"
echo ""
echo "3. ${GREEN}Graphics Support:${NC}"
echo "   - Vulkan loader and headers"
echo "   - Validation layers for debugging"
echo "   - Wayland and X11 libraries"
echo "   - RenderDoc for graphics debugging"
echo ""
echo "4. ${GREEN}Sacred Aliases:${NC}"
echo "   - sacred-build: Optimized release build"
echo "   - sacred-test: Single-threaded testing"
echo "   - coherence-check: Full linting"

# Check current directory structure
echo -e "\n${BLUE}📁 Project Structure Check:${NC}"
dirs_to_check=("src" "src/network" "target" "examples" "tests")

for dir in "${dirs_to_check[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "  ${GREEN}✓ $dir/${NC}"
    else
        echo -e "  ${YELLOW}○ $dir/ (will be created)${NC}"
    fi
done

# Show how to use the flake
echo -e "\n${BLUE}🚀 How to Use:${NC}"
echo "1. Enable flakes in your NixOS configuration:"
echo "   Add to /etc/nixos/configuration.nix:"
echo "   nix.settings.experimental-features = [ \"nix-command\" \"flakes\" ];"
echo ""
echo "2. Enter the development shell:"
echo "   ${GREEN}nix develop${NC}"
echo ""
echo "3. Or run commands directly:"
echo "   ${GREEN}nix develop -c cargo check${NC}"
echo "   ${GREEN}nix develop -c cargo build --lib${NC}"
echo ""
echo "4. For automatic reloading:"
echo "   ${GREEN}nix develop -c cargo watch -x check${NC}"

# Check if experimental features are enabled
echo -e "\n${BLUE}⚙️ System Check:${NC}"
if [ -f "/etc/nix/nix.conf" ] && grep -q "experimental-features.*flakes" /etc/nix/nix.conf; then
    echo -e "  ${GREEN}✓ Flakes are enabled system-wide${NC}"
elif [ -f "$HOME/.config/nix/nix.conf" ] && grep -q "experimental-features.*flakes" "$HOME/.config/nix/nix.conf"; then
    echo -e "  ${GREEN}✓ Flakes are enabled for your user${NC}"
else
    echo -e "  ${YELLOW}⚠ Flakes might not be enabled${NC}"
    echo "    To enable, add to ~/.config/nix/nix.conf:"
    echo "    experimental-features = nix-command flakes"
fi

echo -e "\n✨ ${GREEN}Flake verification complete!${NC}"