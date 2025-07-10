#!/bin/bash
# Compile and run the Rust Stillpoint Kernel

echo "🌟 LuminousOS Rust Kernel Compilation Guide"
echo "=========================================="

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed!"
    echo ""
    echo "📦 To install Rust, run:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo ""
    echo "After installation, run:"
    echo "source $HOME/.cargo/env"
    exit 1
fi

# Navigate to LuminousOS directory
cd /home/tstoltz/luminous-os

echo "🔨 Compiling the Stillpoint Kernel..."
echo ""

# Compile in debug mode (faster compilation)
echo "Debug build:"
cargo build --bin luminous-kernel

if [ $? -eq 0 ]; then
    echo "✅ Debug build successful!"
    echo "Binary location: target/debug/luminous-kernel"
    echo ""
fi

# Optionally compile in release mode (optimized)
echo "Would you like to build an optimized release version? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Building optimized release..."
    cargo build --release --bin luminous-kernel
    
    if [ $? -eq 0 ]; then
        echo "✅ Release build successful!"
        echo "Binary location: target/release/luminous-kernel"
    fi
fi

echo ""
echo "🏃 To run the kernel demo:"
echo ""
echo "Debug version:"
echo "  cargo run --bin luminous-kernel"
echo ""
echo "Release version:"
echo "  cargo run --release --bin luminous-kernel"
echo ""
echo "Or run the binary directly:"
echo "  ./target/debug/luminous-kernel"
echo "  ./target/release/luminous-kernel"

echo ""
echo "🎯 Advanced Compilation Options:"
echo ""
echo "1. Compile all Stillpoint components:"
echo "   cargo build --all"
echo ""
echo "2. Run tests:"
echo "   cargo test"
echo ""
echo "3. Check for issues without building:"
echo "   cargo check"
echo ""
echo "4. Build documentation:"
echo "   cargo doc --open"

# Offer to run the demo
echo ""
echo "❓ Would you like to run the kernel demo now? (y/n)"
read -r run_response
if [[ "$run_response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌟 Starting Stillpoint Kernel..."
    echo ""
    cargo run --bin luminous-kernel
fi