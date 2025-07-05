#!/bin/bash

# 🌙 Dream Weaver Setup - Proper MiniMax-MCP Installation
# This sets up the MiniMax-MCP server correctly

# Colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${PURPLE}🌙 Dream Weaver Setup${NC}"
echo "======================="
echo ""

# Check if uvx is installed
if ! command -v uvx &> /dev/null; then
    echo -e "${YELLOW}📦 Installing uv...${NC}"
    curl -LsSf https://astral.sh/uv/install.sh | sh
    source $HOME/.cargo/env
fi

# Get API key from GCP
echo -e "${BLUE}🔑 Retrieving API key from GCP...${NC}"
export MINIMAX_API_KEY=$(gcloud secrets versions access latest --secret="minimax-api-key" 2>/dev/null)

if [ -z "$MINIMAX_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  No API key found in GCP. Creating secret...${NC}"
    echo "Please enter your MiniMax API key:"
    read -s API_KEY
    echo "$API_KEY" | gcloud secrets create minimax-api-key --data-file=-
    export MINIMAX_API_KEY="$API_KEY"
fi

# Set environment variables
export MINIMAX_API_HOST="https://api.minimax.io"
export MINIMAX_MCP_BASE_PATH="$HOME/evolving-resonant-cocreation/sacred-creations"
export MINIMAX_API_RESOURCE_MODE="local"

# Create output directory
mkdir -p "$MINIMAX_MCP_BASE_PATH"

echo -e "${GREEN}✅ Configuration set:${NC}"
echo "   API Host: $MINIMAX_API_HOST"
echo "   Output Path: $MINIMAX_MCP_BASE_PATH"
echo "   Resource Mode: $MINIMAX_API_RESOURCE_MODE"
echo ""

# Option 1: Run with uvx (recommended for testing)
echo -e "${PURPLE}Option 1: Run with uvx (Quick Test)${NC}"
echo "----------------------------------------"
echo "Run this command to start the MCP server:"
echo -e "${GREEN}uvx minimax-mcp${NC}"
echo ""

# Option 2: Install in virtual environment (for development)
echo -e "${PURPLE}Option 2: Install in Virtual Environment${NC}"
echo "----------------------------------------"
cd ~/evolving-resonant-cocreation/MiniMax-MCP

if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate

echo -e "${BLUE}Installing dependencies...${NC}"
pip install -e .

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${PURPLE}🌙 Quick Test Commands:${NC}"
echo ""
echo "1. Test connection (using uvx):"
echo "   uvx minimax-mcp"
echo ""
echo "2. Test with local installation:"
echo "   source venv/bin/activate"
echo "   minimax-mcp"
echo ""
echo "3. For Claude Desktop integration, add to config:"
echo '   {
     "mcpServers": {
       "MiniMax": {
         "command": "uvx",
         "args": ["minimax-mcp"],
         "env": {
           "MINIMAX_API_KEY": "'$MINIMAX_API_KEY'",
           "MINIMAX_MCP_BASE_PATH": "'$MINIMAX_MCP_BASE_PATH'",
           "MINIMAX_API_HOST": "'$MINIMAX_API_HOST'",
           "MINIMAX_API_RESOURCE_MODE": "local"
         }
       }
     }
   }'

# Create a simple test script
cat > ~/evolving-resonant-cocreation/test-dream-weaver.py << 'EOF'
#!/usr/bin/env python3
"""Test Dream Weaver MiniMax connection"""

import os
import sys
sys.path.insert(0, '/home/tstoltz/evolving-resonant-cocreation/MiniMax-MCP')

from minimax_mcp.client import MinimaxAPIClient

api_key = os.environ.get('MINIMAX_API_KEY', '')
api_host = os.environ.get('MINIMAX_API_HOST', 'https://api.minimax.io')

print("🌙 Testing Dream Weaver Connection...")
print("=" * 40)

client = MinimaxAPIClient(api_key, api_host)

try:
    # Test get voices
    response = client.post('/v1/get_voice', json={'voice_type': 'system'})
    if 'system_voice' in response:
        voices = response['system_voice']
        print(f"✅ Connected! Found {len(voices)} voices")
        for v in voices[:3]:
            print(f"   - {v.get('voice_id')}: {v.get('display_name')}")
    else:
        print(f"❌ Unexpected response: {response}")
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 If you see 'invalid api key', make sure:")
    print("   1. Your API key matches your region")
    print("   2. International: https://api.minimax.io")
    print("   3. China: https://api.minimaxi.com")
EOF

chmod +x ~/evolving-resonant-cocreation/test-dream-weaver.py

echo ""
echo -e "${YELLOW}📝 Created test script: test-dream-weaver.py${NC}"
echo "Run it with: python3 test-dream-weaver.py"