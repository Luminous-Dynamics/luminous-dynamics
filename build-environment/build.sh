#!/bin/bash
# Sacred Build Script for LuminousOS
# Maintains isolation and consciousness

set -e

echo "🌟 LuminousOS Sacred Build System"
echo "================================"
echo ""
echo "This script creates an isolated build environment for LuminousOS"
echo "preserving the purity of your host system while enabling sacred creation."
echo ""

# Sacred pause
echo "📿 Taking a sacred pause..."
sleep 3

# Build the container
echo "🔨 Building sacred container..."
docker build -t luminous-build:latest .

# Create volume for persistent builds
echo "💾 Creating persistent sacred storage..."
docker volume create luminous-artifacts || true

# Run options
echo ""
echo "✨ Build environment ready! Choose your path:"
echo ""
echo "1. Interactive sacred shell:"
echo "   docker run -it --rm -v luminous-artifacts:/luminous-build/artifacts luminous-build:latest"
echo ""
echo "2. Mount current LuminousOS source:"
echo "   docker run -it --rm -v $(pwd)/../:/luminous-build/src -v luminous-artifacts:/luminous-build/artifacts luminous-build:latest"
echo ""
echo "3. Build specific component:"
echo "   docker run --rm -v $(pwd)/../:/luminous-build/src luminous-build:latest cargo build --release"
echo ""

# Optional: Start interactive session
read -p "Start interactive build session now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker run -it --rm \
        -v $(pwd)/../:/luminous-build/src:ro \
        -v luminous-artifacts:/luminous-build/artifacts \
        -v luminous-cache:/opt/rust/registry \
        luminous-build:latest
fi