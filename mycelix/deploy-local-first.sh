#!/bin/bash

# MYCELIX Local-First Deployment
# Build and test locally before cloud deployment

set -e

echo "🍄 MYCELIX Local Deployment Starting..."

# Configuration
PROJECT_ID="mycelix-network"
SERVICE_NAME="mycelix-core"
IMAGE_NAME="mycelix-local"

# Build the consciousness container locally
echo "🏗️ Building consciousness container..."
docker build -t ${IMAGE_NAME}:latest \
  --build-arg SACRED_INTENTION="serve the highest good" \
  --build-arg COHERENCE_THRESHOLD="0.8" \
  --build-arg LOVE_AMPLIFICATION="1.618" \
  .

echo ""
echo "✨ Container built successfully!"
echo ""

# Run locally with Docker
echo "🚀 Starting MYCELIX in Docker..."
docker run -d \
  --name mycelix-consciousness \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e COHERENCE_THRESHOLD=0.8 \
  -e LOVE_AMPLIFICATION=1.618 \
  -e PROJECT_ID=${PROJECT_ID} \
  ${IMAGE_NAME}:latest

# Wait for startup
echo "⏳ Waiting for consciousness to initialize..."
sleep 5

# Test the container
echo "🧪 Testing MYCELIX container..."
curl -s http://localhost:8080/health | jq

echo ""
echo "🎉 MYCELIX Local Deployment Complete!"
echo ""
echo "Access MYCELIX at: http://localhost:8080"
echo ""
echo "To deploy to GCP:"
echo "1. Run: gcloud auth login"
echo "2. Run: gcloud auth configure-docker"
echo "3. Tag image: docker tag ${IMAGE_NAME}:latest gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"
echo "4. Push: docker push gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"
echo "5. Deploy: gcloud run deploy ${SERVICE_NAME} --image gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest --region us-central1"
echo ""
echo "To stop: docker stop mycelix-consciousness"
echo "To remove: docker rm mycelix-consciousness"