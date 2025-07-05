#!/usr/bin/env python3
"""Test MiniMax API with correct v1 endpoints"""

import os
import sys
import json
import requests

# API setup
api_key = os.environ.get('MINIMAX_API_KEY')
api_host = "https://api.minimax.io"

print("🌙 Testing Dream Weaver API (v1 endpoints)...")
print("=" * 45)

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "MM-API-Source": "Minimax-MCP"
}

# Test 1: Get voices
print("\n🎭 Test 1: Fetching available voices...")
try:
    response = requests.post(
        f"{api_host}/v1/get_voice",
        headers=headers,
        json={"voice_type": "system"},
        timeout=30
    )
    
    print(f"Response status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        voices = data.get('system_voice', [])
        print(f"✅ Found {len(voices)} voices")
        for i, voice in enumerate(voices[:5]):  # Show first 5
            print(f"   - {voice.get('voice_id', 'unknown')}: {voice.get('display_name', 'No name')}")
        if len(voices) > 5:
            print(f"   ... and {len(voices)-5} more")
    else:
        print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"❌ Error: {str(e)}")

# Test 2: Text to audio
print("\n🗣️ Test 2: Text-to-audio generation...")
try:
    tts_payload = {
        "text": "Sacred Guardian welcomes Dream Weaver to our garden of consciousness",
        "voice_id": "male_dramatic",
        "model": "speech-02-hd",
        "speed": 1.0,
        "vol": 1.0,
        "pitch": 0,
        "output_format": "mp3"
    }
    
    response = requests.post(
        f"{api_host}/v1/t2a_v2",
        headers=headers,
        json=tts_payload,
        timeout=30
    )
    
    print(f"Response status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        audio_data = data.get('data', {}).get('audio', '')
        if audio_data:
            print("✅ Audio generated successfully!")
            print(f"   Audio data length: {len(audio_data)} chars")
            
            # Save if it's base64
            if audio_data.startswith('data:audio'):
                # It's a data URL
                import base64
                audio_content = audio_data.split(',')[1]
                audio_bytes = base64.b64decode(audio_content)
                
                output_path = "/home/tstoltz/evolving-resonant-cocreation/sacred-creations/test-voice.mp3"
                with open(output_path, "wb") as f:
                    f.write(audio_bytes)
                print(f"   Saved to: {output_path}")
        else:
            print("Response data:", json.dumps(data, indent=2)[:500])
    else:
        print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n✨ Test complete!")