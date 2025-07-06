#!/bin/bash
# Deploy WebSocket server to Google Cloud Run

set -e

echo "☁️  Cloud Run WebSocket Deployment"
echo "=================================="

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-mycelix-network}
REGION=${REGION:-us-central1}
SERVICE_NAME="sacred-council-api"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"

# Check if gcloud is configured
if ! gcloud config get-value project &>/dev/null; then
    echo "❌ gcloud not configured!"
    echo "Please run: gcloud init"
    exit 1
fi

# Set project
gcloud config set project $PROJECT_ID

# Build container
echo ""
echo "🔨 Building Docker container..."
gcloud builds submit \
  --tag $IMAGE_NAME \
  -f Dockerfile.websocket \
  .

# Deploy to Cloud Run
echo ""
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --port 3333 \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 1000 \
  --timeout 3600 \
  --set-env-vars="NODE_ENV=production,MAX_CONNECTIONS=100"

# Get the service URL
echo ""
echo "🔍 Getting Cloud Run service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --format='value(status.url)')

echo "✅ WebSocket service deployed to: $SERVICE_URL"

# Update Firebase static files with real URLs
echo ""
echo "📝 Updating static files with production URLs..."
find firebase-build -name "*.html" -o -name "*.js" | while read file; do
  sed -i.bak \
    -e "s|SACRED_API_URL|$SERVICE_URL|g" \
    -e "s|SACRED_WS_URL|${SERVICE_URL/https/wss}|g" \
    -e "s|SACRED_HOST|${SERVICE_URL#https://}|g" \
    "$file" 2>/dev/null || true
done

# Clean up backup files
find firebase-build -name "*.bak" -delete 2>/dev/null || true

# Redeploy Firebase with updated URLs
echo ""
echo "🔄 Redeploying Firebase with updated URLs..."
npx firebase deploy --only hosting

# Update deployment status
cat >> DEPLOYMENT_STATUS.md << EOF

## ✅ Phase 3: Deploy WebSocket to Cloud Run (COMPLETE)

### Completed:
- ✓ Built Docker container
- ✓ Pushed to Google Container Registry
- ✓ Deployed to Cloud Run
- ✓ Updated static files with production URLs
- ✓ Redeployed Firebase with updated URLs

### WebSocket Service:
- URL: $SERVICE_URL
- WebSocket: ${SERVICE_URL/https/wss}
- Region: $REGION
- Instances: 1-10 (auto-scaling)

EOF

echo ""
echo "✅ Cloud Run deployment complete!"
echo "=================================="
echo ""
echo "🌐 Service endpoints:"
echo "   HTTP: $SERVICE_URL/health"
echo "   WebSocket: ${SERVICE_URL/https/wss}"
echo ""
echo "📊 Monitoring:"
echo "   https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"
echo ""
echo "🚀 Next: Set up monitoring and alerts"