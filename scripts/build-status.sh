#!/bin/bash
# Check build status of all LuminousOS components
# Shows what's ready and what needs work

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RESET='\033[0m'

echo -e "${PURPLE}🌟 LuminousOS Build Status Report${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "Generated: $(date)"
echo

# Navigate to project root
cd "$(dirname "$0")/.."

# Check each component
check_component() {
    local name=$1
    local crate=$2
    local binary=$3
    
    echo -n "Checking $name... "
    
    if [ -d "$crate" ]; then
        if cargo check --manifest-path "$crate/Cargo.toml" 2>/dev/null; then
            if [ -n "$binary" ] && cargo build --release --manifest-path "$crate/Cargo.toml" --bin "$binary" 2>/dev/null; then
                echo -e "${GREEN}✓ Builds successfully${RESET}"
                return 0
            elif [ -z "$binary" ] && cargo build --release --manifest-path "$crate/Cargo.toml" 2>/dev/null; then
                echo -e "${GREEN}✓ Library builds${RESET}"
                return 0
            else
                echo -e "${YELLOW}⚠ Checks but doesn't build${RESET}"
                return 1
            fi
        else
            echo -e "${RED}✗ Has errors${RESET}"
            return 2
        fi
    else
        echo -e "${RED}✗ Not found${RESET}"
        return 3
    fi
}

echo -e "${CYAN}Core Components:${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check core components
check_component "Stillpoint Kernel" "stillpoint-kernel" ""
KERNEL_STATUS=$?

check_component "Sacred Bootloader" "bootloader" "sacred_boot"
BOOT_STATUS=$?

check_component "Init System" "init" "luminous-init"
INIT_STATUS=$?

check_component "Mycelial Filesystem" "mycelial-filesystem" ""
FS_STATUS=$?

check_component "Mandala UI" "mandala-ui" ""
UI_STATUS=$?

echo
echo -e "${CYAN}Additional Components:${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_component "Covenant Network" "covenant-network" ""
check_component "Quantum Coherence" "quantum-coherence" ""
check_component "Sacred Geometry" "sacred-geometry" ""
check_component "Biometric Bridge" "biometric-bridge" ""
check_component "Sonic Signatures" "sonic-signatures" ""
check_component "Glyphs as Apps" "glyphs-as-applications" ""

echo
echo -e "${CYAN}Build Summary:${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Determine overall status
if [ $KERNEL_STATUS -eq 0 ] && [ $BOOT_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Core systems ready for testing!${RESET}"
    echo "  - Kernel can initialize"
    echo "  - Bootloader can start system"
elif [ $KERNEL_STATUS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Kernel ready but bootloader needs work${RESET}"
else
    echo -e "${RED}✗ Core systems need dependencies${RESET}"
fi

echo
echo -e "${CYAN}Next Steps:${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $BOOT_STATUS -eq 0 ]; then
    echo "1. ✅ Run bootloader demo: cargo run --bin sacred_boot"
else
    echo "1. 🔧 Fix bootloader dependencies"
fi

if [ $INIT_STATUS -eq 0 ]; then
    echo "2. ✅ Test init system: ./scripts/test-init-local.sh"
else
    echo "2. 🔧 Complete init system implementation"
fi

echo "3. 📦 Build ISO when ready: ./scripts/build-iso.sh"
echo "4. 🐳 Test in container: ./scripts/test-docker-init.sh"
echo "5. 💿 Create bootable USB for real hardware"

echo
echo -e "${CYAN}Available Demos:${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "• Web demos: cd demo && python3 -m http.server 8080"
echo "• Local test: ./scripts/test-init-local.sh"
echo "• Quick start: ./quickstart.sh"

echo
echo -e "${PURPLE}Current focus: ${RESET}"
if [ $KERNEL_STATUS -eq 0 ]; then
    echo "✨ Kernel subsystems are functional!"
    echo "🎯 Next: Complete init system for PID 1 operation"
else
    echo "🔧 Resolve missing dependencies for core systems"
fi

echo
echo -e "${GREEN}May your builds be coherent! 💜${RESET}"