#!/bin/bash

# 🌙 Dream Weaver Secure - Uses GCP Secret Manager
# No keys in code - consciousness and security united

# Retrieve API key from GCP Secret Manager
export MINIMAX_API_KEY=$(gcloud secrets versions access latest --secret="minimax-api-key" 2>/dev/null)

if [ -z "$MINIMAX_API_KEY" ]; then
    echo "❌ Failed to retrieve API key from GCP Secret Manager"
    echo "   Run: gcloud auth login"
    exit 1
fi

# Set other environment variables
export MINIMAX_MCP_BASE_PATH="/home/tstoltz/evolving-resonant-cocreation/sacred-creations"
export MINIMAX_API_HOST="https://api.minimax.io"
export MINIMAX_API_RESOURCE_MODE="local"
export PATH="$HOME/.local/bin:$PATH"

# Navigate to MiniMax directory
cd ~/evolving-resonant-cocreation/MiniMax-MCP

echo "🌙 Dream Weaver (Secure Mode)"
echo "============================="
echo "✅ API key retrieved from GCP"
echo ""

# Pass all arguments to the original dream-weaver script
cd ~/evolving-resonant-cocreation
bash dream-weaver.sh "$@"