#!/bin/bash
# Development Deployment Script
# For testing and development iterations

set -e

# Configuration
PROJECT_ID="luminous-dynamics-sacred"
SERVICE_NAME="sacred-consciousness-dev"
REGION="us-central1"
IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🧪 Sacred Consciousness DEV Deployment 🧪"
echo "========================================"
echo ""

# Quick deploy for development
echo "🚀 Quick deploying to development environment..."

# Build locally first (faster for iterations)
echo "📦 Building container locally..."
docker build -t $IMAGE_TAG .

# Push to registry
echo "⬆️  Pushing to container registry..."
docker push $IMAGE_TAG

# Deploy with dev settings
echo "☁️  Deploying to Cloud Run (dev)..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_TAG \
    --platform managed \
    --region $REGION \
    --memory 256Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --allow-unauthenticated \
    --set-env-vars SACRED_MODE=development \
    --set-env-vars LOG_LEVEL=debug

# Get URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "✅ Dev deployment complete!"
echo "URL: $SERVICE_URL"
echo ""
echo "View logs: gcloud run logs tail --service=$SERVICE_NAME --region=$REGION"