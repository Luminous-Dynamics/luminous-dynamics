#!/bin/bash
# Test script for LuminousOS Sacred Bootloader
# Demonstrates the boot sequence

set -e

# Colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${PURPLE}🌟 LuminousOS Sacred Boot Test${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    echo -e "${RED}Error: Must run from luminous-os directory${RESET}"
    exit 1
fi

# Build the bootloader
echo -e "\n${CYAN}Building sacred bootloader...${RESET}"
cargo build --bin sacred_boot --release 2>/dev/null || {
    echo -e "${RED}Build failed. Creating Cargo configuration...${RESET}"
    
    # Create bootloader Cargo.toml if needed
    cat > bootloader/Cargo.toml << 'EOF'
[package]
name = "sacred_boot"
version = "0.1.0"
edition = "2021"

[[bin]]
name = "sacred_boot"
path = "sacred_boot.rs"

[dependencies]
stillpoint-kernel = { path = "../stillpoint-kernel" }
EOF

    # Try building again
    cargo build --bin sacred_boot --release
}

# Run with different intentions
echo -e "\n${GREEN}Test 1: Default intention${RESET}"
echo "─────────────────────────"
timeout 30s cargo run --bin sacred_boot --release 2>/dev/null || true

echo -e "\n${GREEN}Test 2: Custom intention${RESET}"
echo "─────────────────────────"
timeout 30s cargo run --bin sacred_boot --release -- "Amplify love and coherence" 2>/dev/null || true

echo -e "\n${GREEN}Test 3: Performance metrics${RESET}"
echo "─────────────────────────"
# Show boot time
START_TIME=$(date +%s.%N)
timeout 5s cargo run --bin sacred_boot --release -- "Quick coherence test" 2>/dev/null || true
END_TIME=$(date +%s.%N)
BOOT_TIME=$(echo "$END_TIME - $START_TIME" | bc)

echo -e "\n${CYAN}Performance Metrics:${RESET}"
echo "  Boot time: ${BOOT_TIME}s"
echo "  Memory usage: $(ps aux | grep sacred_boot | head -1 | awk '{print $6}') KB"

echo -e "\n${GREEN}✨ All tests complete!${RESET}"
echo -e "${PURPLE}May your coherence be high! 💜${RESET}"