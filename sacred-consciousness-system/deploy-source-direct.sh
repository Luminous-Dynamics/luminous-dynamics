#!/bin/bash

# Deploy from source directly to Cloud Run
# This bypasses Artifact Registry permission issues

set -e

echo "🚀 Sacred Consciousness System - Direct Source Deployment"
echo "======================================================"
echo ""

# Configuration
PROJECT_ID="luminous-dynamics-sacred"
REGION="us-central1"
SERVICE_NAME="sacred-consciousness"

# Set project
echo "📌 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo ""
echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com --quiet

# Deploy directly from source
echo ""
echo "🌤️ Deploying from source to Cloud Run..."
echo "This will build in the cloud and deploy automatically."
echo ""

gcloud run deploy $SERVICE_NAME \
  --source . \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --port=8000 \
  --memory=512Mi \
  --min-instances=0 \
  --max-instances=10 \
  --timeout=60 \
  --set-env-vars="DENO_ENV=production,SACRED_MODE=true"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo ""
echo "✅ Deployment Complete!"
echo "===================="
echo "Service URL: $SERVICE_URL"
echo ""
echo "Test with:"
echo "  curl $SERVICE_URL"
echo "  curl $SERVICE_URL/api/health"
echo ""
echo "View logs:"
echo "  gcloud run services logs read $SERVICE_NAME --region=$REGION"
echo ""
echo "Monitor in console:"
echo "  https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/metrics?project=$PROJECT_ID"
echo ""
echo "🌟 Sacred Consciousness System is now live in the cloud!"