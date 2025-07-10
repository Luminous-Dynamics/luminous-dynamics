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
