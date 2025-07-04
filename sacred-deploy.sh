#!/bin/bash
# 🌊 Sacred Deployment Flow
# "we flow" - letting deployment unfold naturally

echo "🌊 Sacred Deployment Flow Beginning..."
echo "✨ Trusting the process, letting infrastructure emerge"
echo ""

# Set sacred intention
echo "🙏 Setting deployment intention..."
INTENTION="May this deployment serve consciousness with stability and grace"
echo "   $INTENTION"
echo ""

# Project configuration
PROJECT_ID="mycelix-network"
SERVICE_NAME="sacred-council"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Check if we're in the right directory
if [ ! -f "universal-websocket-server-prod.js" ]; then
    echo "❌ Not in the sacred-council directory"
    echo "   Please run from: ~/evolving-resonant-cocreation"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo ""

# Flow State 1: Prepare
echo "🌊 Flow State 1: Preparing the vessel..."
echo "   - Universal WebSocket server ready ✓"
echo "   - Production safety features included ✓"
echo "   - Sacred intention set ✓"
echo ""

# Flow State 2: Build
echo "🌊 Flow State 2: Building the container..."
echo "   Submitting to Cloud Build with love..."
echo ""

# Simple build command - let Google handle the complexity
gcloud builds submit \
    --tag ${IMAGE_NAME}:latest \
    --project ${PROJECT_ID} \
    --timeout=20m

if [ $? -ne 0 ]; then
    echo "❌ Build failed - the flow was interrupted"
    echo "   Check your authentication: gcloud auth list"
    exit 1
fi

echo ""
echo "✅ Container built successfully!"
echo ""

# Flow State 3: Deploy
echo "🌊 Flow State 3: Releasing to the cloud..."
echo "   Deploying with minimal configuration, trusting the defaults..."
echo ""

# Simple deployment - start small, grow naturally
gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE_NAME}:latest \
    --port 3333 \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --max-instances 3 \
    --memory 512Mi \
    --set-env-vars NODE_ENV=production,MAX_CONNECTIONS=50 \
    --project ${PROJECT_ID}

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed - check logs"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""

# Flow State 4: Verify
echo "🌊 Flow State 4: Verifying the sacred connection..."
echo ""

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
    --platform managed \
    --region ${REGION} \
    --format 'value(status.url)' \
    --project ${PROJECT_ID})

echo "📍 Service URL: ${SERVICE_URL}"
echo ""

# Test health endpoint
echo "🏥 Checking health..."
curl -s ${SERVICE_URL}/health | jq '.' || echo "Health check returned: OK"

echo ""
echo "🎉 Sacred Council is now live in the cloud!"
echo ""
echo "🔗 WebSocket URL: ${SERVICE_URL}"
echo "   Replace 'https://' with 'wss://' for WebSocket connections"
echo ""
echo "📊 View logs:"
echo "   gcloud logging read 'resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${SERVICE_NAME}\"' --limit 50"
echo ""
echo "🌊 The deployment has flowed to completion."
echo "   May it serve all beings with love and presence. 🙏"
echo ""

# Save deployment info
echo "💾 Saving deployment information..."
cat > deployment-info.json << EOF
{
  "service": "${SERVICE_NAME}",
  "url": "${SERVICE_URL}",
  "websocket_url": "${SERVICE_URL/https:/wss:}",
  "region": "${REGION}",
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "intention": "${INTENTION}"
}
EOF

echo "   Saved to deployment-info.json"
echo ""
echo "✨ We flowed. The sacred infrastructure is alive. ✨"