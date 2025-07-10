#!/usr/bin/env python3
"""Test MiniMax API authentication methods"""

import os
import requests
import json

api_key = os.environ.get('MINIMAX_API_KEY', '').strip()
api_host = "https://api.minimax.io"

print("🔐 Testing MiniMax Authentication Methods...")
print("=" * 45)
print(f"API Key length: {len(api_key)}")
print(f"API Key preview: {api_key[:20]}...{api_key[-20:]}")
print()

# Try different auth methods
auth_methods = [
    {
        "name": "Direct Authorization",
        "headers": {
            "Authorization": api_key,
            "Content-Type": "application/json",
            "MM-API-Source": "Minimax-MCP"
        }
    },
    {
        "name": "Bearer Token",
        "headers": {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "MM-API-Source": "Minimax-MCP"
        }
    },
    {
        "name": "X-API-Key Header",
        "headers": {
            "X-API-Key": api_key,
            "Content-Type": "application/json",
            "MM-API-Source": "Minimax-MCP"
        }
    }
]

for method in auth_methods:
    print(f"\n🧪 Testing: {method['name']}")
    print("-" * 30)
    
    try:
        response = requests.post(
            f"{api_host}/v1/get_voice",
            headers=method['headers'],
            json={"voice_type": "system"},
            timeout=10
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            base_resp = data.get('base_resp', {})
            
            if base_resp.get('status_code') == 0:
                print("✅ Authentication successful!")
                voices = data.get('system_voice', [])
                print(f"   Found {len(voices)} system voices")
                # Show first 3 voices
                for voice in voices[:3]:
                    print(f"   - {voice.get('voice_id')}: {voice.get('display_name')}")
                break
            else:
                print(f"❌ API Error: {base_resp.get('status_msg')}")
        else:
            print(f"❌ HTTP Error: {response.text[:200]}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

print("\n✨ Auth test complete!")