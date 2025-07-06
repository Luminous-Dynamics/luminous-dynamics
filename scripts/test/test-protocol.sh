#!/bin/bash

# Protocol Test Script - For both Claude instances

echo "🧪 PROTOCOL VERIFICATION TEST"
echo "============================"
echo ""
echo "📍 LIVING: $(pwd) ($(uname -s))"
echo "🔧 WORKING: Protocol Testing"
echo ""

# Test 1: Verify a local service
echo "Test 1: Checking local service (Python HTTP on 8338)"
if lsof -i :8338 >/dev/null 2>&1; then
  echo "✅ Port 8338 is active"
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8338/)
  echo "   HTTP Response: $response"
else
  echo "❌ Port 8338 is NOT active"
fi
echo ""

# Test 2: Verify a cloud service
echo "Test 2: Checking cloud service (sacred-council-api)"
if command -v gcloud >/dev/null 2>&1; then
  url=$(gcloud run services describe sacred-council-api --platform=managed --region=us-central1 --format="value(status.url)" 2>/dev/null)
  if [ -n "$url" ]; then
    echo "✅ Cloud URL: $url"
    auth_token=$(gcloud auth print-identity-token 2>/dev/null)
    if [ -n "$auth_token" ]; then
      response=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $auth_token" "$url/health")
      echo "   Auth Response: $response"
    fi
  else
    echo "❌ Could not get cloud URL"
  fi
fi
echo ""

# Test 3: Environment switching
echo "Test 3: Environment switching demonstration"
echo "🔄 SWITCHING WORKING ENVIRONMENT:"
echo "FROM: Protocol Testing"
echo "TO: Results Analysis"
echo "REASON: Completed tests, analyzing results"
echo ""

echo "✅ Protocol test complete!"
echo ""
echo "Next: Run this same script in the other Claude terminal for comparison"