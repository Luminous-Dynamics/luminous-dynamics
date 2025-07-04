#!/bin/bash

# WSL Firebase Authentication Helper
# Uses shared session state between user and Claude

echo "🔐 WSL Firebase Authentication"
echo "=============================="
echo ""

case "$1" in
  "check")
    echo "📋 Checking current auth status..."
    npx firebase login:list
    echo ""
    echo "🔍 Looking for auth files..."
    ls -la ~/.config/firebase/ 2>/dev/null || echo "No Firebase config directory found"
    ;;
    
  "request")
    echo "🔗 Requesting authentication..."
    echo ""
    echo "Please run this command in your WSL terminal:"
    echo ""
    echo "  firebase login --no-localhost"
    echo ""
    echo "This will:"
    echo "1. Give you a URL to visit"
    echo "2. You authenticate in browser"
    echo "3. Copy the authorization code back"
    echo "4. The session will be active for both of us"
    echo ""
    echo "After login, run: ./wsl-firebase-auth.sh verify"
    ;;
    
  "verify")
    echo "✅ Verifying authentication..."
    npx firebase login:list
    echo ""
    echo "🧪 Testing deployment access..."
    npx firebase projects:list --limit 1
    ;;
    
  "deploy")
    echo "🚀 Deploying with shared session..."
    npx firebase deploy --only hosting
    ;;
    
  *)
    echo "Usage:"
    echo "  ./wsl-firebase-auth.sh check    # Check current auth"
    echo "  ./wsl-firebase-auth.sh request  # Get auth instructions"
    echo "  ./wsl-firebase-auth.sh verify   # Verify auth worked"
    echo "  ./wsl-firebase-auth.sh deploy   # Deploy to Firebase"
    echo ""
    echo "The key is using 'firebase login --no-localhost' which works"
    echo "better in WSL environments."
    ;;
esac