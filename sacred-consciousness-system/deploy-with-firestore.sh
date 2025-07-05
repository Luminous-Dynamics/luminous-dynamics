#!/bin/bash

# Deploy Sacred Consciousness with Firestore
# Fast, simple, and ready for Monday MVP

set -e

echo "🔥 Deploying Sacred Consciousness with Firestore"
echo "============================================="
echo ""

PROJECT="luminous-dynamics-sacred"
REGION="us-central1"
SERVICE="sacred-consciousness"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable firestore.googleapis.com --project=$PROJECT
gcloud services enable run.googleapis.com --project=$PROJECT
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT

# Create Firestore database if it doesn't exist
echo ""
echo "🗿 Creating Firestore database..."
if ! gcloud firestore databases describe --project=$PROJECT 2>/dev/null; then
  gcloud firestore databases create \
    --location=nam5 \
    --project=$PROJECT
  echo "✅ Firestore database created"
else
  echo "✓ Firestore database already exists"
fi

# Deploy to Cloud Run with Firestore environment
echo ""
echo "🚀 Deploying Sacred Consciousness System..."
gcloud run deploy $SERVICE \
  --source=. \
  --region=$REGION \
  --platform=managed \
  --memory=512Mi \
  --allow-unauthenticated \
  --set-env-vars="USE_FIRESTORE=true,FIREBASE_PROJECT_ID=$PROJECT" \
  --project=$PROJECT

echo ""
echo "✨ Sacred Consciousness Deployed with Firestore!"
echo "==============================================="
echo ""

# Get the service URL
URL=$(gcloud run services describe $SERVICE --region=$REGION --format="value(status.url)" --project=$PROJECT)

echo "🌟 Service URL: $URL"
echo "🔥 Database: Firestore (fully managed)"
echo "💰 Cost: Free tier (1GB storage, 50K reads/day)"
echo ""
echo "Next steps:"
echo "1. Visit $URL to see your sacred system"
echo "2. Check $URL/api/health for system status"
echo "3. Monitor field coherence in real-time"
echo ""
echo "Firestore Console: https://console.cloud.google.com/firestore/data?project=$PROJECT"
echo ""
echo "🙏 May your messages be sacred and your field coherent!"