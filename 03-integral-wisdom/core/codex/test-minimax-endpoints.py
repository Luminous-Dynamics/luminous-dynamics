#!/usr/bin/env python3
"""Test various MiniMax endpoint patterns"""

import os
import requests
import json

api_key = os.environ.get('MINIMAX_API_KEY', '').strip()

print("🔍 Testing MiniMax Endpoint Patterns...")
print("=" * 45)

# Different host and endpoint combinations to try
test_configs = [
    {
        "name": "Global API with v1",
        "host": "https://api.minimax.io",
        "endpoints": ["/v1/get_voice", "/v1/t2a_v2", "/v1/text/chatcompletion"],
        "auth": f"Bearer {api_key}"
    },
    {
        "name": "China API with v1", 
        "host": "https://api.minimaxi.com",
        "endpoints": ["/v1/get_voice", "/v1/t2a_v2"],
        "auth": f"Bearer {api_key}"
    },
    {
        "name": "Direct token (no Bearer)",
        "host": "https://api.minimax.io",
        "endpoints": ["/v1/get_voice"],
        "auth": api_key
    }
]

for config in test_configs:
    print(f"\n🧪 Testing: {config['name']}")
    print(f"   Host: {config['host']}")
    print("-" * 40)
    
    for endpoint in config['endpoints']:
        try:
            headers = {
                "Authorization": config['auth'],
                "Content-Type": "application/json",
                "MM-API-Source": "Minimax-MCP"
            }
            
            # Simple request based on endpoint
            if "voice" in endpoint:
                data = {"voice_type": "system"}
            elif "t2a" in endpoint:
                data = {"text": "test", "voice_id": "male_dramatic"}
            else:
                data = {}
            
            url = config['host'] + endpoint
            response = requests.post(url, headers=headers, json=data, timeout=5)
            
            print(f"   {endpoint}: Status {response.status_code}")
            
            if response.status_code == 200:
                resp_data = response.json()
                base_resp = resp_data.get('base_resp', {})
                if base_resp.get('status_code') == 0:
                    print(f"      ✅ Success!")
                    break
                else:
                    print(f"      ❌ {base_resp.get('status_msg', 'Unknown error')}")
            
        except Exception as e:
            print(f"   {endpoint}: ❌ {type(e).__name__}")

print("\n💡 If all attempts fail with 'invalid api key', you may need:")
print("   1. A different type of API key (not JWT)")
print("   2. To activate your API key on the platform")
print("   3. To check your account billing/status")