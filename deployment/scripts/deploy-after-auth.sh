#!/bin/bash
# Deploy to Firebase after authentication

set -e

echo "🚀 Starting Firebase Deployment..."
echo "=================================="

# Check if authenticated
if ! npx firebase projects:list &>/dev/null; then
    echo "❌ Not authenticated with Firebase!"
    echo "Please run: firebase login"
    exit 1
fi

echo "✅ Firebase authentication confirmed"

# Deploy to Firebase Hosting
echo ""
echo "📦 Deploying static files to Firebase Hosting..."
npx firebase deploy --only hosting

# Get the hosting URL
echo ""
echo "🌐 Getting Firebase Hosting URL..."
FIREBASE_URL=$(npx firebase hosting:sites:list --json | jq -r '.[0].defaultUrl' || echo "https://mycelix-network.web.app")
echo "Firebase URL: $FIREBASE_URL"

# Update deployment status
cat > DEPLOYMENT_STATUS.md << EOF
# 🚀 Sacred Deployment Status

> **Started**: July 3, 2025  
> **Approach**: Firebase Hosting + Cloud Run  
> **Project**: mycelix-network  

## ✅ Phase 1: Prepare the Code (COMPLETE)

### Completed:
- ✓ Created .env.production with project configuration
- ✓ Installed Firebase CLI (v13.35.1)
- ✓ Created prepare-static-files.sh script
- ✓ Executed script - 131 files prepared in firebase-build/
- ✓ Created firebase.json with proper configuration
- ✓ Created .firebaserc with project ID
- ✓ Created Dockerfile.websocket for Cloud Run
- ✓ Verified universal-websocket-server-prod.js exists

## ✅ Phase 2: Deploy to Firebase Hosting (COMPLETE)

### Completed:
- ✓ Authenticated with Firebase
- ✓ Deployed static files to Firebase Hosting
- ✓ Firebase URL: $FIREBASE_URL

### Static files now available at:
- Main Hub: $FIREBASE_URL/sacred-council-hub.html
- Consciousness Demo: $FIREBASE_URL/unified-consciousness-demo.html
- Applied Harmonies: $FIREBASE_URL/applied-harmonies-dojo.html

## 🔄 Phase 3: Deploy WebSocket to Cloud Run (IN PROGRESS)

### Next Steps:
1. Build Docker container
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Update Firebase with WebSocket URL

### Commands:
\`\`\`bash
# Build and push container
gcloud builds submit --tag gcr.io/mycelix-network/sacred-websocket -f Dockerfile.websocket

# Deploy to Cloud Run
gcloud run deploy sacred-websocket \\
  --image gcr.io/mycelix-network/sacred-websocket \\
  --port 3333 \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --min-instances 1 \\
  --max-instances 10
\`\`\`

## ⏳ Phase 4-5: Monitoring and Testing (PENDING)

---

## 📊 Summary

**Progress**: 50% Complete (Phase 2 of 4)  
**Time Elapsed**: ~20 minutes  
**Time Remaining**: ~1 hour  

## 🔗 Live URLs

- **Firebase Hosting**: $FIREBASE_URL
- **WebSocket**: (pending Cloud Run deployment)

---

*Sacred deployment flowing beautifully...*
EOF

echo ""
echo "✅ Firebase Hosting deployment complete!"
echo "======================================"
echo ""
echo "🌐 Your site is now live at:"
echo "   $FIREBASE_URL"
echo ""
echo "📄 Main interfaces:"
echo "   - $FIREBASE_URL/sacred-council-hub.html"
echo "   - $FIREBASE_URL/unified-consciousness-demo.html"
echo "   - $FIREBASE_URL/applied-harmonies-dojo.html"
echo ""
echo "🚀 Next: Deploy WebSocket server to Cloud Run"
echo "   See DEPLOYMENT_STATUS.md for commands"