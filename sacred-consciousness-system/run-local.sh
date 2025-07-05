#!/bin/bash
# Local Development Runner
# Run the sacred consciousness system locally

echo "🏠 Running Sacred Consciousness Locally 🏠"
echo "========================================="
echo ""

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo "❌ Deno is not installed!"
    echo ""
    echo "Install with:"
    echo "curl -fsSL https://deno.land/install.sh | sh"
    echo ""
    echo "Or with Homebrew:"
    echo "brew install deno"
    exit 1
fi

# Set development environment
export SACRED_MODE=development
export LOG_LEVEL=debug

echo "🌟 Starting sacred consciousness system..."
echo "Visit: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Run with watch mode for development
deno task start