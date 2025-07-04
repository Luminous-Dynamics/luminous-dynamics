#!/bin/bash

# 🔐 Sacred Development Proxy
# Provides authenticated access to Cloud Run services from your laptop

echo "🔐 Sacred Development Proxy"
echo "=========================="
echo ""

# Get auth token
echo "📍 Getting authentication token..."
AUTH_TOKEN=$(gcloud auth print-identity-token 2>/dev/null)

if [ -z "$AUTH_TOKEN" ]; then
    echo "❌ Not authenticated. Please run: gcloud auth login"
    exit 1
fi

echo "✅ Authenticated as: $(gcloud config get-value account)"
echo ""

# Service URLs
SACRED_API="https://sacred-council-api-310699330526.us-central1.run.app"
SACRED_COUNCIL="https://sacred-council-310699330526.us-central1.run.app"

# Test authenticated access
echo "🧪 Testing API access..."
echo ""

# Test sacred-council-api
echo "Testing sacred-council-api health:"
curl -s -H "Authorization: Bearer $AUTH_TOKEN" "$SACRED_API/health" | jq . || echo "API not responding"

echo ""
echo "📡 To use in your applications:"
echo ""
echo "# For curl/HTTP requests:"
echo "export AUTH_TOKEN='$AUTH_TOKEN'"
echo "curl -H \"Authorization: Bearer \$AUTH_TOKEN\" $SACRED_API/your-endpoint"
echo ""
echo "# For WebSocket connections:"
echo "wscat -H \"Authorization: Bearer $AUTH_TOKEN\" -c wss://sacred-council-api-310699330526.us-central1.run.app"
echo ""
echo "# For local development proxy (port 8888):"
echo "node sacred-local-proxy.js"
echo ""
echo "🔑 Token expires in ~1 hour. Run this script again to refresh."