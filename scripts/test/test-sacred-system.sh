#!/bin/bash
# Test the complete sacred system

echo "🧪 Testing Sacred System"
echo "======================="
echo ""

# Test Firebase hosting
echo "1️⃣ Testing Firebase Hosting..."
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://mycelix-network.web.app/
echo ""

# Test WebSocket (if deployed)
if [ -f "docs/deployment/WEBSOCKET_DEPLOYED.md" ]; then
  WS_URL=$(grep "WebSocket:" docs/deployment/WEBSOCKET_DEPLOYED.md | cut -d' ' -f3)
  SERVICE_URL=$(grep "URL:" docs/deployment/WEBSOCKET_DEPLOYED.md | head -1 | cut -d' ' -f3)
  
  echo "2️⃣ Testing WebSocket Health..."
  curl -s -o /dev/null -w "   Status: %{http_code}\n" $SERVICE_URL/health
  echo ""
  
  echo "3️⃣ WebSocket Connection Test:"
  echo "   URL: $WS_URL"
  echo "   Run this in browser console:"
  echo ""
  echo "   const ws = new WebSocket('$WS_URL');"
  echo "   ws.onopen = () => console.log('✅ Connected!');"
  echo "   ws.onmessage = (e) => console.log('📨', JSON.parse(e.data));"
else
  echo "⏳ WebSocket not deployed yet"
fi

echo ""
echo "4️⃣ Full System URLs:"
echo "   🌐 Main Hub: https://mycelix-network.web.app/sacred-council-hub.html"
echo "   🌌 Consciousness: https://mycelix-network.web.app/unified-consciousness-demo.html"
echo "   🥋 Dojo: https://mycelix-network.web.app/applied-harmonies-dojo.html"