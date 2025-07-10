#!/bin/bash
# WebSocket deployment using Docker to Cloud Run

echo "🐳 WebSocket Docker Deployment to Cloud Run"
echo "=========================================="
echo ""

PROJECT_ID="mycelix-network"
REGION="us-central1"
SERVICE_NAME="sacred-council-api"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Ensure we're in the right project
gcloud config set project $PROJECT_ID

echo "📦 Building Docker image..."
echo ""

# Build and submit to Cloud Build
gcloud builds submit \
  --tag $IMAGE_NAME \
  -f Dockerfile.websocket \
  .

if [ $? -ne 0 ]; then
  echo "❌ Docker build failed!"
  exit 1
fi

echo ""
echo "🚀 Deploying to Cloud Run..."
echo ""

# Deploy the built image
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

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed!"
  exit 1
fi

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region=$REGION \
  --format='value(status.url)')

echo ""
echo "✅ WebSocket deployed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo "🔌 WebSocket URL: ${SERVICE_URL/https/wss}"
echo ""
echo "📝 Next steps:"
echo "1. Test WebSocket connection"
echo "2. Update Firebase config with WebSocket URL"
echo "3. Redeploy Firebase with updated URLs"

# Save deployment info
cat > docs/deployment/WEBSOCKET_DEPLOYED.md << EOF
# WebSocket Deployment Info

- **Service**: $SERVICE_NAME
- **URL**: $SERVICE_URL
- **WebSocket**: ${SERVICE_URL/https/wss}
- **Region**: $REGION
- **Deployed**: $(date)

## Test Connection

\`\`\`javascript
const ws = new WebSocket('${SERVICE_URL/https/wss}');
ws.onopen = () => console.log('Connected!');
ws.onmessage = (e) => console.log('Message:', e.data);
\`\`\`
EOF

echo "📄 Deployment info saved to docs/deployment/WEBSOCKET_DEPLOYED.md"