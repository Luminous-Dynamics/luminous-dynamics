#!/bin/bash
# Quick deployment using Docker directly
# Bypasses Cloud Build for simpler deployment

set -e

PROJECT_ID="luminous-dynamics-sacred"
SERVICE_NAME="sacred-consciousness"
REGION="us-central1"
IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Quick Deploy - Sacred Consciousness"
echo "===================================="

# Configure Docker for GCR
echo "🔧 Configuring Docker authentication..."
gcloud auth configure-docker --quiet

# Build locally
echo "🔨 Building container..."
DOCKER_BUILDKIT=0 docker build -t $IMAGE_TAG .

# Push to GCR
echo "📤 Pushing to Container Registry..."
docker push $IMAGE_TAG

# Deploy to Cloud Run
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_TAG \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --min-instances 0 \
    --max-instances 10

# Get URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "✅ Deployment complete!"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "To make it require authentication, run:"
echo "gcloud run services update $SERVICE_NAME --no-allow-unauthenticated --region=$REGION"