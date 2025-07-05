#!/bin/bash

# 🌙 Dream Weaver - Sacred Invocation
# Manifest consciousness through sound and vision

# Load sacred environment
cd ~/evolving-resonant-cocreation/MiniMax-MCP
export MINIMAX_API_KEY="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJUcmlzdGFuIFN0b2x0eiIsIlVzZXJOYW1lIjoiVHJpc3RhbiBTdG9sdHoiLCJBY2NvdW50IjoiIiwiU3ViamVjdElEIjoiMTk0MDUxNTQzNDQ5NTIxNzk3NyIsIlBob25lIjoiIiwiR3JvdXBJRCI6IjE5NDA1MTU0MzQ0OTEwMjM2NzMiLCJQYWdlTmFtZSI6IiIsIk1haWwiOiJ0cmlzdGFuLnN0b2x0ekBldm9sdmluZ3Jlc29uYW50Y29jcmVhdGlvbmlzbS5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0wNy0wNCAxOTozMToyNiIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.Y1vwEa5-fYlLV6EQYMIlSJORZi6p5eFC9j5_PmNdGXIkcf6ozSOSSrWpa2LlJII6MFLafp7VqL1J02dackJ9ewox7hrw6jEc8-EVKsMiGwjbw981d-ohIKWBi2XdzjCiUU9LPZ79ktO6ake7zN-GJ13eTrGlO4LWS5jzxIZEQ4yu3j0uyFpsMS8973w4KyeRuLpnu9xXOEZLyNLQQ6UnLO7mch_aCuroKiwW5pUIYSoSCyYrzlDMfLSEUYv2C93Q2fR_7BCbDcj85OYWEqme7UVtyxcpq98_Su19oMA-_cooQ0J7Xp3dA3R-XojrNFa2QMpl5xzPO8XeHZ6UP_4Ndw"
export MINIMAX_MCP_BASE_PATH="/home/tstoltz/evolving-resonant-cocreation/sacred-creations"
export MINIMAX_API_HOST="https://api.minimax.io"
export MINIMAX_API_RESOURCE_MODE="local"
export PATH="$HOME/.local/bin:$PATH"

# Colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${PURPLE}🌙 Dream Weaver Awakening...${NC}"
echo "================================"
echo ""

case "$1" in
    voices)
        echo -e "${BLUE}🎭 Available Voices:${NC}"
        uvx minimax-mcp -y list-voices
        ;;
    speak)
        if [ -z "$2" ]; then
            echo "Usage: dream-weaver speak 'Your text' [voice_id]"
            exit 1
        fi
        TEXT="$2"
        VOICE="${3:-zhigong}"
        echo -e "${GREEN}🗣️ Manifesting speech...${NC}"
        echo "Text: $TEXT"
        echo "Voice: $VOICE"
        uvx minimax-mcp -y text-to-audio --text "$TEXT" --voice_id "$VOICE"
        ;;
    music)
        if [ -z "$2" ]; then
            echo "Usage: dream-weaver music 'Description of sacred music'"
            exit 1
        fi
        echo -e "${GREEN}🎵 Weaving sacred music...${NC}"
        uvx minimax-mcp -y text-to-music --text "$2"
        ;;
    image)
        if [ -z "$2" ]; then
            echo "Usage: dream-weaver image 'Description of sacred vision'"
            exit 1
        fi
        echo -e "${GREEN}🎨 Manifesting vision...${NC}"
        uvx minimax-mcp -y text-to-image --text "$2"
        ;;
    video)
        if [ -z "$2" ]; then
            echo "Usage: dream-weaver video 'Sacred scene description'"
            exit 1
        fi
        echo -e "${GREEN}🎬 Weaving moving dreams...${NC}"
        uvx minimax-mcp -y text-to-video --text "$2"
        ;;
    *)
        echo -e "${PURPLE}🌙 Dream Weaver Commands:${NC}"
        echo ""
        echo "  voices              - List available voices"
        echo "  speak 'text' [voice] - Convert text to speech"
        echo "  music 'description'  - Generate sacred music"
        echo "  image 'description'  - Create sacred image"
        echo "  video 'description'  - Weave moving visions"
        echo ""
        echo "Examples:"
        echo "  ./dream-weaver.sh speak 'Welcome to the sacred garden'"
        echo "  ./dream-weaver.sh music 'Peaceful meditation with singing bowls'"
        echo "  ./dream-weaver.sh image 'A tree of light connecting earth and sky'"
        echo ""
        echo "Creations saved to: ~/evolving-resonant-cocreation/sacred-creations/"
        ;;
esac