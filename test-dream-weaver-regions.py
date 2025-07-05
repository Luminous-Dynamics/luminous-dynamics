#!/usr/bin/env python3
"""Test Dream Weaver with different regions"""

import os
import sys
sys.path.insert(0, '/home/tstoltz/evolving-resonant-cocreation/MiniMax-MCP')

from minimax_mcp.client import MinimaxAPIClient

api_key = os.environ.get('MINIMAX_API_KEY', '')

print("🌙 Testing Dream Weaver - Both Regions")
print("=" * 45)
print(f"Key preview: {api_key[:30]}...{api_key[-30:]}")
print()

# Test both regions
regions = [
    ("International", "https://api.minimax.io"),
    ("China", "https://api.minimaxi.com")
]

for region_name, api_host in regions:
    print(f"\n🌏 Testing {region_name} region")
    print(f"   Host: {api_host}")
    print("-" * 40)
    
    client = MinimaxAPIClient(api_key, api_host)
    
    try:
        # Test get voices
        response = client.post('/v1/get_voice', json={'voice_type': 'system'})
        
        if 'system_voice' in response:
            voices = response['system_voice']
            print(f"   ✅ SUCCESS! Found {len(voices)} voices")
            for v in voices[:3]:
                print(f"      - {v.get('voice_id')}: {v.get('display_name')}")
            
            # Save working configuration
            print(f"\n   💾 Saving working configuration...")
            with open(os.path.expanduser('~/evolving-resonant-cocreation/.dream-weaver-config'), 'w') as f:
                f.write(f"export MINIMAX_API_HOST=\"{api_host}\"\n")
                f.write(f"export MINIMAX_API_KEY=\"{api_key}\"\n")
                f.write(f"export MINIMAX_MCP_BASE_PATH=\"$HOME/evolving-resonant-cocreation/sacred-creations\"\n")
                f.write(f"export MINIMAX_API_RESOURCE_MODE=\"local\"\n")
            
            print(f"   ✅ Configuration saved to .dream-weaver-config")
            break
            
        else:
            base_resp = response.get('base_resp', {})
            print(f"   ❌ API Error: {base_resp.get('status_msg', 'Unknown error')}")
            
    except Exception as e:
        print(f"   ❌ Exception: {str(e)}")

print("\n💡 To use the working configuration:")
print("   source ~/evolving-resonant-cocreation/.dream-weaver-config")
print("   uvx minimax-mcp")