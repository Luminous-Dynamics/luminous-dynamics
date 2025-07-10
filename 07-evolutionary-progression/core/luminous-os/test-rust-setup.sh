#!/usr/bin/env bash
# Test Rust development setup for LuminousOS

echo "🔍 Testing Rust Development Environment..."
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test if we're in nix-shell
if [ -z "$IN_NIX_SHELL" ]; then
    echo -e "${YELLOW}⚠️  Not in nix-shell. Running with nix-shell...${NC}"
    exec nix-shell --run "$0"
fi

echo -e "${GREEN}✓ In Nix development shell${NC}"

# Test Rust toolchain
echo -e "\n📦 Checking Rust toolchain..."
if command -v rustc &> /dev/null; then
    echo -e "${GREEN}✓ rustc: $(rustc --version)${NC}"
else
    echo -e "${RED}✗ rustc not found${NC}"
    exit 1
fi

if command -v cargo &> /dev/null; then
    echo -e "${GREEN}✓ cargo: $(cargo --version)${NC}"
else
    echo -e "${RED}✗ cargo not found${NC}"
    exit 1
fi

# Test compilation
echo -e "\n🔨 Testing LuminousOS compilation..."
cd "$(dirname "$0")"

echo "Running cargo check..."
if cargo check --lib 2>&1; then
    echo -e "${GREEN}✓ Library compilation successful!${NC}"
else
    echo -e "${RED}✗ Compilation failed${NC}"
    echo "Run 'cargo check --lib' to see detailed errors"
fi

# Check for common issues
echo -e "\n🔍 Checking for common issues..."

# Check if main Cargo.toml exists
if [ -f "Cargo.toml" ]; then
    echo -e "${GREEN}✓ Cargo.toml found${NC}"
else
    echo -e "${RED}✗ Cargo.toml missing${NC}"
fi

# Check if src/lib.rs exists
if [ -f "src/lib.rs" ]; then
    echo -e "${GREEN}✓ src/lib.rs found${NC}"
else
    echo -e "${RED}✗ src/lib.rs missing${NC}"
fi

# Test specific modules
echo -e "\n📁 Checking module structure..."
modules=("src/network/mod.rs" "src/network/covenant_protocol.rs" "src/glyphs_applications.rs")

for module in "${modules[@]}"; do
    if [ -f "$module" ]; then
        echo -e "${GREEN}✓ $module${NC}"
    else
        echo -e "${RED}✗ $module missing${NC}"
    fi
done

echo -e "\n✨ ${GREEN}Setup test complete!${NC}"
echo -e "\nNext steps:"
echo "  1. Run 'make dev-shell' to enter development environment"
echo "  2. Run 'cargo check' to see any compilation errors"
echo "  3. Fix errors and run 'cargo build' to build the project"