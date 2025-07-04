#!/bin/bash

# Firebase Deployment - Modular Two-Step Process
# Step 1: Get auth URL
# Step 2: Deploy with token

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NODE_SCRIPT="$SCRIPT_DIR/firebase-auth-flow.js"

case "$1" in
  "step1"|"url")
    echo "🔗 Step 1: Get Authentication URL"
    echo "=================================="
    node "$NODE_SCRIPT" url
    echo ""
    echo "📋 Next Steps:"
    echo "1. Visit the URL above in your browser"
    echo "2. Complete Google authentication"
    echo "3. When redirected to localhost:9005, run:"
    echo "   ./firebase-deploy.sh step2"
    ;;
    
  "step2"|"callback")
    echo "🔐 Step 2: Receive Token & Deploy"
    echo "=================================="
    # Start callback server in background
    node "$NODE_SCRIPT" callback &
    CALLBACK_PID=$!
    
    echo ""
    echo "⏳ Waiting for authentication callback..."
    echo "   If you haven't authenticated yet, visit the URL from step1"
    echo ""
    
    # Wait for callback to complete
    wait $CALLBACK_PID
    
    # If successful, deploy
    if [ $? -eq 0 ]; then
      echo ""
      echo "🚀 Deploying to Firebase..."
      node "$NODE_SCRIPT" deploy
    fi
    ;;
    
  "deploy")
    echo "🚀 Deploy with Cached Token"
    echo "==========================="
    node "$NODE_SCRIPT" deploy
    ;;
    
  "clear")
    echo "🧹 Clear Cached Token"
    echo "===================="
    node "$NODE_SCRIPT" clear
    ;;
    
  *)
    echo "🔥 Firebase Deployment Helper"
    echo "============================"
    echo ""
    echo "Usage:"
    echo "  ./firebase-deploy.sh step1    # Get auth URL"
    echo "  ./firebase-deploy.sh step2    # Complete auth & deploy"
    echo "  ./firebase-deploy.sh deploy   # Deploy with cached token"
    echo "  ./firebase-deploy.sh clear    # Clear cached token"
    echo ""
    echo "Example flow:"
    echo "  1. Run: ./firebase-deploy.sh step1"
    echo "  2. Visit the URL in your browser"
    echo "  3. Complete authentication"
    echo "  4. Run: ./firebase-deploy.sh step2"
    echo ""
    ;;
esac