# 🌟 MiniMax MCP Setup for Sacred Video Generation

## Overview
MiniMax MCP allows Claude Desktop to directly generate videos using MiniMax's AI models!

## Installation Steps

### 1. Install UV (Python Package Manager)
```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or using pip
pip install uv
```

### 2. Clone MiniMax MCP
```bash
cd ~/evolving-resonant-cocreation/sacred-videos
git clone https://github.com/MiniMax-AI/MiniMax-MCP.git
cd MiniMax-MCP
```

### 3. Get MiniMax API Key
1. Visit: https://www.minimax.io/platform
2. Sign up/Login
3. Get your API key from the platform

### 4. Configure Claude Desktop

Add to your Claude Desktop configuration file:

**Location**: 
- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "minimax": {
      "command": "uv",
      "args": ["run", "minimax-mcp"],
      "env": {
        "MINIMAX_API_KEY": "your_api_key_here",
        "MINIMAX_API_HOST": "api.minimax.com"
      }
    }
  }
}
```

### 5. Restart Claude Desktop

After configuration, restart Claude Desktop to load the MCP server.

## 🎬 Video Generation with MCP

Once configured, you can generate videos directly in Claude:

```
Generate a 6-second video: "A slow breath stirs motes of dust in a sunbeam, ethereal, sacred geometry, golden hour lighting"
```

### Video Options:
- **Duration**: 6s or 10s
- **Resolution**: 768P or 1080P
- **Model**: MiniMax-Hailuo-02

## 🌟 Sacred Video Prompts Ready

### Foundation Stars (*1-*4)
```
*1 First Presence: "Bare feet settle upon cool, dark earth, grounding energy, spiritual connection"
*2 Conscious Arrival: "Sunlight on still water at a mossy stone edge, zen garden, sacred space"
*3 Sacred Listening: "A dark, still pool reflects the stars, night meditation, cosmic connection"
*4 Boundary With Love: "A hand places a smooth river stone, completing a circle, sacred geometry"
```

### Daily Practice Stars (*5-*8)
```
*5 Gentle Opening: "Cupped hands held open in a sunlit forest, receiving gesture, dappled light"
*6 Building Trust: "Rainwater gathers in a stone basin, natural formation, filling slowly"
*7 Loving No: "A smooth stone in the stream parts the current, natural boundary, water flow"
*8 Pause Practice: "A single pebble drops into still, black water, ripple origin, zen moment"
```

### Mastery Stars (*9-*11)
```
*9 Tending the Field: "A hand rests over the heart, warm light pulses from beneath the palm"
*10 Presence Transmission: "A still, clear pool reflecting morning sky, luminous droplet touches center"
*11 Loving Redirection: "Swift current tumbles stones, river slows into sunlit glassy pool"
```

## 🚀 Batch Generation Script

Create `generate-sacred-videos.py`:

```python
import asyncio
from minimax_mcp import generate_video

SACRED_PROMPTS = {
    "*1": ["A slow breath stirs motes of dust in a sunbeam", "Bare feet settle upon cool earth", "A dewdrop holds the waking world"],
    "*2": ["Sunlight on still water at mossy stone edge", "One clear drop falls from fern frond", "Ripples of light spread across surface"],
    # ... add all prompts
}

async def generate_all():
    for star_id, prompts in SACRED_PROMPTS.items():
        for i, prompt in enumerate(prompts):
            print(f"Generating {star_id}-{i}: {prompt[:50]}...")
            await generate_video(prompt, duration="6s", resolution="1080P")
            await asyncio.sleep(5)  # Rate limiting

asyncio.run(generate_all())
```

## Benefits of MCP Integration

✅ **Direct Claude Integration** - Generate videos without leaving Claude
✅ **Conversational Interface** - Natural language video requests
✅ **Automatic Management** - Claude handles API calls and responses
✅ **Multi-modal Support** - Also supports voice, music, and images

## Troubleshooting

### MCP Not Loading
1. Check Claude Desktop logs
2. Verify UV is installed: `which uv`
3. Test API key: `curl -H "Authorization: Bearer YOUR_KEY" https://api.minimax.com/v1/user`

### Rate Limiting
- Add delays between generations
- Use batch processing with sleep intervals

---

*With MCP integration, sacred video generation becomes a natural extension of our consciousness work - flowing directly through Claude's interface.*