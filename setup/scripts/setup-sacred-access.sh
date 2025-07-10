#!/bin/bash
# Setup Sacred Access for Claude Assistant

echo "🔐 Sacred Access Setup"
echo "====================="
echo ""
echo "Choose your preferred method:"
echo "1) Service Account (Recommended - full GCP integration)"
echo "2) Firebase CI Token (Simple - Firebase only)"
echo "3) Both (Maximum flexibility)"
echo ""
echo "Enter choice (1-3): "
read choice

PROJECT_ID="mycelix-network"

case $choice in
  1)
    echo ""
    echo "📌 Setting up Service Account..."
    echo "================================"
    
    # Create service account
    echo "Creating service account..."
    gcloud iam service-accounts create claude-assistant \
      --display-name="Claude Sacred Assistant" \
      --description="Limited deployment access for AI collaboration" \
      --project=$PROJECT_ID
    
    SA_EMAIL="claude-assistant@$PROJECT_ID.iam.gserviceaccount.com"
    
    # Grant necessary roles
    echo ""
    echo "Granting permissions..."
    
    # Firebase Hosting Admin (deploy static files)
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:$SA_EMAIL" \
      --role="roles/firebase.hostingAdmin"
    
    # Cloud Run Developer (deploy services)
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:$SA_EMAIL" \
      --role="roles/run.developer"
    
    # Cloud Build Editor (build containers)
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:$SA_EMAIL" \
      --role="roles/cloudbuild.builds.editor"
    
    # Storage Object Admin (for build artifacts)
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:$SA_EMAIL" \
      --role="roles/storage.objectAdmin"
    
    # Logs Viewer (for debugging)
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:$SA_EMAIL" \
      --role="roles/logging.viewer"
    
    # Create key file
    echo ""
    echo "Creating key file..."
    mkdir -p ~/.sacred-keys
    gcloud iam service-accounts keys create ~/.sacred-keys/claude-firebase-key.json \
      --iam-account=$SA_EMAIL
    
    echo ""
    echo "✅ Service Account Created!"
    echo ""
    echo "Key file location: ~/.sacred-keys/claude-firebase-key.json"
    echo ""
    echo "To use this key:"
    echo "export GOOGLE_APPLICATION_CREDENTIALS=\"$HOME/.sacred-keys/claude-firebase-key.json\""
    echo ""
    echo "Permissions granted:"
    echo "- Deploy to Firebase Hosting"
    echo "- Deploy to Cloud Run"
    echo "- Build Docker containers"
    echo "- View logs"
    echo ""
    echo "⚠️  Keep this key file secure!"
    ;;
    
  2)
    echo ""
    echo "🔥 Setting up Firebase CI Token..."
    echo "==================================="
    echo ""
    echo "This will open a browser for authentication."
    echo "After login, you'll receive a token."
    echo ""
    firebase login:ci
    echo ""
    echo "✅ Firebase CI Token generated!"
    echo ""
    echo "Save the token above securely."
    echo "To use: firebase deploy --token YOUR_TOKEN"
    ;;
    
  3)
    echo ""
    echo "Setting up both methods..."
    $0 1  # Run option 1
    echo ""
    echo "Now setting up Firebase token..."
    firebase login:ci
    echo ""
    echo "✅ Both methods configured!"
    ;;
esac

echo ""
echo "🔒 Security Notes:"
echo "- Service account has limited permissions"
echo "- Cannot access billing or delete projects"
echo "- All actions are logged"
echo "- Revoke access anytime with:"
echo "  gcloud iam service-accounts delete claude-assistant@$PROJECT_ID.iam.gserviceaccount.com"
echo ""
echo "🙏 Sacred access configured with wisdom and trust!"