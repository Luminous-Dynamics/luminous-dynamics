#!/usr/bin/env python3
"""Analyze the MiniMax token structure"""

import os
import json
import base64

token = os.environ.get('MINIMAX_API_KEY', '').strip()

print("🔍 Analyzing MiniMax Token...")
print("=" * 45)

# JWT tokens have 3 parts separated by dots
parts = token.split('.')
print(f"Token parts: {len(parts)}")

if len(parts) == 3:
    print("\n✅ This appears to be a JWT token")
    
    # Decode header
    try:
        header = base64.urlsafe_b64decode(parts[0] + '==')
        print("\n📋 Header:")
        print(json.dumps(json.loads(header), indent=2))
    except:
        print("❌ Could not decode header")
    
    # Decode payload
    try:
        payload = base64.urlsafe_b64decode(parts[1] + '==')
        print("\n📋 Payload:")
        payload_json = json.loads(payload)
        print(json.dumps(payload_json, indent=2))
        
        # Look for potential API key fields
        print("\n🔑 Potential key fields:")
        for key, value in payload_json.items():
            if 'key' in key.lower() or 'id' in key.lower() or 'token' in key.lower():
                print(f"   {key}: {value}")
                
    except Exception as e:
        print(f"❌ Could not decode payload: {e}")
    
    print("\n💡 This JWT might need to be:")
    print("   1. Used as-is in Authorization header")
    print("   2. Exchanged for an API key through a login endpoint")
    print("   3. Used with a specific prefix (Bearer, JWT, etc.)")
else:
    print("❌ Not a standard JWT token")

# Check if it might be the Group ID that's the actual API key
print("\n🤔 The actual API key might be obtained from:")
print("   1. The MiniMax platform dashboard")
print("   2. An API endpoint using this JWT for authentication")
print("   3. The GroupID or SubjectID in the token payload")