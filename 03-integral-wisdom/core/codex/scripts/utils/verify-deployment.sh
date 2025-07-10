#!/bin/bash
# Verify deployment URLs are correct

echo "🔍 Verifying deployment URLs..."
echo "================================"
echo ""

# Check a deployed file
echo "📋 Checking sacred-council-hub.html for correct URLs..."
curl -s https://mycelix-network.web.app/sacred-council-hub.html | grep -o "sacred-council.*\.run\.app" | head -5

echo ""
echo "✅ If you see 'sacred-council-310699330526.us-central1.run.app' above,"
echo "   then the URLs have been successfully updated!"
echo ""
echo "🌐 Test the live site:"
echo "   https://mycelix-network.web.app/sacred-council-hub.html"
echo ""
echo "📊 Check browser console for WebSocket connection status"