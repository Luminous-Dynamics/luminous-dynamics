#!/bin/bash
# Simple WebSocket deployment to Cloud Run

echo "☁️  WebSocket Deployment to Cloud Run"
echo "====================================="
echo ""

PROJECT_ID="mycelix-network"
REGION="us-central1"
SERVICE_NAME="sacred-council-api"

# Ensure we're in the right project
gcloud config set project $PROJECT_ID

echo "📦 Building and deploying in one step..."
echo ""

# Deploy directly from source (Cloud Build handles everything)
gcloud run deploy $SERVICE_NAME \
  --source . \
  --port 3333 \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --set-env-vars="NODE_ENV=production,MAX_CONNECTIONS=100" \
  --entry-point "node universal-websocket-server-prod.js"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --format='value(status.url)')

echo ""
echo "✅ WebSocket deployed!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "Next: Update Firebase hosting with WebSocket URL"