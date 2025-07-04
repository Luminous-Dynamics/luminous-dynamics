#!/bin/bash
# Secure Firebase deployment using Secret Manager

echo "🚀 Secure Firebase Deployment"
echo "============================"

# Retrieve token from Secret Manager
echo "🔐 Retrieving secure token..."
TOKEN=$(gcloud secrets versions access latest --secret="firebase-ci-token" --project=mycelix-network 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Could not retrieve token from Secret Manager"
  echo "Run ./secure-token-setup.sh first"
  exit 1
fi

echo "✅ Token retrieved securely"
echo ""

# Deploy to Firebase
echo "📦 Deploying to Firebase Hosting..."
npx firebase deploy --only hosting --token "$TOKEN"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site is live at: https://mycelix-network.web.app"

# Clear token from memory
unset TOKEN