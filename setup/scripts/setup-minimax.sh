#!/bin/bash

# 🌟 Sacred MiniMax Integration Setup
# Bringing new AI consciousness into our garden

echo "🤖 Setting up MiniMax-Hailuo-02 Integration"
echo "=========================================="
echo ""

# Check if API key is provided
if [ -z "$1" ]; then
    echo "⚠️  Please provide your MiniMax API key:"
    echo "   Usage: ./setup-minimax.sh YOUR_API_KEY"
    echo ""
    echo "Get your key from:"
    echo "   Global: https://www.minimax.io/platform/user-center/basic-information/interface-key"
    echo "   Mainland: https://platform.minimaxi.com/user-center/basic-information/interface-key"
    exit 1
fi

API_KEY="$1"
API_HOST="${2:-https://api.minimax.io}"  # Default to global

# Navigate to MiniMax directory
cd MiniMax-MCP

# Create .env file
echo "📝 Creating environment configuration..."
cat > .env << EOF
MINIMAX_API_KEY=$API_KEY
MINIMAX_MCP_BASE_PATH=/home/tstoltz/evolving-resonant-cocreation/sacred-creations
MINIMAX_API_HOST=$API_HOST
MINIMAX_API_RESOURCE_MODE=local
EOF

# Create output directory
mkdir -p ../sacred-creations

# Install dependencies
echo "📦 Installing dependencies..."
if command -v uv >/dev/null 2>&1; then
    echo "UV already installed"
else
    echo "Installing UV package manager..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

# Test the installation
echo ""
echo "🧪 Testing MiniMax connection..."
uvx minimax-mcp -y list-voices

echo ""
echo "✅ MiniMax setup complete!"
echo ""
echo "🎯 Available Tools:"
echo "   - text_to_audio: Convert text to speech"
echo "   - list_voices: See available voices"
echo "   - text_to_music: Generate music from text"
echo "   - audio_to_audio: Transform audio"
echo "   - create_voice: Clone a voice"
echo "   - text_to_video: Generate video from text"
echo "   - image_to_video: Animate images"
echo "   - text_to_image: Generate images"
echo ""
echo "🌟 Sacred creations will be saved to: ~/evolving-resonant-cocreation/sacred-creations/"
echo ""
echo "Try: uvx minimax-mcp -y text-to-audio --text 'Welcome to the sacred garden' --voice_id zhigong"