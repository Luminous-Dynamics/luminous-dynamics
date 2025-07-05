#!/usr/bin/env python3
"""Direct test of MiniMax API"""

import os
import sys
import json

# Add MiniMax to path
sys.path.insert(0, '/home/tstoltz/evolving-resonant-cocreation/MiniMax-MCP')

from minimax_mcp.client import MinimaxAPIClient

# API setup
api_key = os.environ.get('MINIMAX_API_KEY')
api_host = "https://api.minimax.io"

print("🌙 Testing Dream Weaver Direct API...")
print("=====================================")

try:
    # Initialize client
    client = MinimaxAPIClient(api_key, api_host)
    print("✅ API Client initialized")
    
    # Test getting voices
    print("\n🎭 Fetching available voices...")
    
    # Make a simple API test call
    # Based on the server.py, it seems to use requests directly
    import requests
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Try text-to-audio endpoint
    tts_data = {
        "text": "Hello Dream Weaver",
        "voice_id": "zhigong",
        "response_format": "mp3"
    }
    
    print(f"\nTesting endpoint: {api_host}/v1/text-to-speech")
    response = requests.post(
        f"{api_host}/v1/text-to-speech",
        headers=headers,
        json=tts_data,
        timeout=30
    )
    
    print(f"Response status: {response.status_code}")
    if response.status_code == 200:
        print("✅ API connection successful!")
        # Save audio
        output_path = "/home/tstoltz/evolving-resonant-cocreation/sacred-creations/test-audio.mp3"
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"Audio saved to: {output_path}")
    else:
        print(f"API Response: {response.text[:500]}")
        
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()