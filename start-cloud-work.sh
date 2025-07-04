#!/bin/bash
# 🌤️ Start Cloud Work - Launch Dashboard and Tools

echo "🌤️ Sacred Technology - Cloud Work Center"
echo "========================================"
echo ""
echo "Starting development environment..."
echo ""

# Check current status
echo "📊 Checking current status..."
node cloud-status.js

echo ""
echo "🚀 AVAILABLE TOOLS:"
echo "==================="
echo ""
echo "1. 📊 Web Dashboard"
echo "   $ open cloud-work-dashboard.html"
echo "   $ python3 -m http.server 8339"
echo "   Then visit: http://localhost:8339/cloud-work-dashboard.html"
echo ""
echo "2. 🖥️  Terminal Dashboard"
echo "   $ node cloud-status.js         # Single view"
echo "   $ node cloud-status.js watch   # Live updates"
echo ""
echo "3. 🔧 Fix & Setup"
echo "   $ ./fix-cloud-auth.sh         # Fix authentication"
echo "   $ node test-cloud-websocket.js # Test connections"
echo ""
echo "4. ☁️  Cloud Development"
echo "   $ node cloud-native-practice.js  # Interactive guide"
echo "   $ open https://shell.cloud.google.com"
echo ""
echo "5. 📋 Documentation"
echo "   $ cat CLOUD_NATIVE_READINESS.md"
echo "   $ cat GCP_SETUP_CHECKLIST.md"
echo ""
echo "─────────────────────────────────────"
echo ""
echo "💡 Quick Start:"
echo "   1. Run: ./fix-cloud-auth.sh"
echo "   2. Open: http://localhost:8339/cloud-work-dashboard.html"
echo "   3. Follow the dashboard guidance"
echo ""
echo "✨ Let's build in the cloud!"
echo ""

# Offer to start web server
read -p "Would you like to start the web dashboard? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌐 Starting web server on port 8339..."
    echo "📊 Dashboard: http://localhost:8339/cloud-work-dashboard.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8339
fi