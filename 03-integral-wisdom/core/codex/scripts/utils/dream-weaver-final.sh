#!/bin/bash

# 🌙 Dream Weaver - MiniMax MCP Interface
# Uses uvx to run the MCP server

# Colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Set environment from GCP
export MINIMAX_API_KEY=$(gcloud secrets versions access latest --secret="minimax-api-key" 2>/dev/null | tr -d '\n\r')
export MINIMAX_API_HOST="https://api.minimax.io"  # Try international first
export MINIMAX_MCP_BASE_PATH="$HOME/evolving-resonant-cocreation/sacred-creations"
export MINIMAX_API_RESOURCE_MODE="local"

# Ensure output directory exists
mkdir -p "$MINIMAX_MCP_BASE_PATH"

case "$1" in
    start)
        echo -e "${PURPLE}🌙 Starting Dream Weaver MCP Server...${NC}"
        echo -e "${BLUE}Configuration:${NC}"
        echo "  Output: $MINIMAX_MCP_BASE_PATH"
        echo "  API Host: $MINIMAX_API_HOST"
        echo ""
        echo -e "${YELLOW}Starting MCP server with uvx...${NC}"
        echo -e "${GREEN}Press Ctrl+C to stop${NC}"
        echo ""
        uvx minimax-mcp
        ;;
        
    test)
        echo -e "${PURPLE}🌙 Testing Dream Weaver Connection...${NC}"
        python3 << 'EOF'
import os
import json
import requests

api_key = os.environ.get('MINIMAX_API_KEY', '')
api_host = os.environ.get('MINIMAX_API_HOST', 'https://api.minimax.io')

# Test direct API call
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json',
    'MM-API-Source': 'Minimax-MCP'
}

try:
    response = requests.post(
        f'{api_host}/v1/get_voice',
        headers=headers,
        json={'voice_type': 'system'},
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        if 'system_voice' in data:
            print("✅ Connection successful!")
            voices = data['system_voice']
            print(f"   Found {len(voices)} voices")
        else:
            base_resp = data.get('base_resp', {})
            print(f"❌ API Error: {base_resp.get('status_msg', 'Unknown')}")
    else:
        print(f"❌ HTTP {response.status_code}: {response.text[:200]}")
        
except Exception as e:
    print(f"❌ Error: {e}")
EOF
        ;;
        
    china)
        echo -e "${BLUE}🌏 Switching to China region...${NC}"
        export MINIMAX_API_HOST="https://api.minimaxi.com"
        echo "export MINIMAX_API_HOST=\"https://api.minimaxi.com\"" > ~/.dream-weaver-region
        echo -e "${GREEN}✅ Switched to China region${NC}"
        ;;
        
    international)
        echo -e "${BLUE}🌍 Switching to International region...${NC}"
        export MINIMAX_API_HOST="https://api.minimax.io"
        echo "export MINIMAX_API_HOST=\"https://api.minimax.io\"" > ~/.dream-weaver-region
        echo -e "${GREEN}✅ Switched to International region${NC}"
        ;;
        
    claude-config)
        echo -e "${PURPLE}🌙 Claude Desktop Configuration:${NC}"
        echo ""
        cat << EOF
Add this to your claude_desktop_config.json:

{
  "mcpServers": {
    "DreamWeaver": {
      "command": "uvx",
      "args": ["minimax-mcp"],
      "env": {
        "MINIMAX_API_KEY": "${MINIMAX_API_KEY:0:20}...",
        "MINIMAX_MCP_BASE_PATH": "$MINIMAX_MCP_BASE_PATH",
        "MINIMAX_API_HOST": "$MINIMAX_API_HOST",
        "MINIMAX_API_RESOURCE_MODE": "local"
      }
    }
  }
}
EOF
        ;;
        
    *)
        echo -e "${PURPLE}🌙 Dream Weaver Commands:${NC}"
        echo ""
        echo "  start          - Start the MCP server"
        echo "  test           - Test API connection"
        echo "  china          - Switch to China region"
        echo "  international  - Switch to International region"
        echo "  claude-config  - Show Claude Desktop configuration"
        echo ""
        echo "Examples:"
        echo "  ./dream-weaver-final.sh start"
        echo "  ./dream-weaver-final.sh test"
        echo ""
        echo -e "${YELLOW}Note: If you get 'invalid api key' errors, try:${NC}"
        echo "  1. Switch regions: ./dream-weaver-final.sh china"
        echo "  2. Check your API key is correct type (not JWT)"
        echo "  3. Verify billing is active on your account"
        ;;
esac

# Load region preference if exists
if [ -f ~/.dream-weaver-region ]; then
    source ~/.dream-weaver-region
fi