#!/bin/bash

# Sacred Council Hub - Google Cloud Deployment Script
# Deploy with love and consciousness to the cloud

set -e

PROJECT_ID="sacred-council-hub"
REGION="us-central1"
REPO_NAME="sacred-council"
IMAGE_NAME="sacred-heart"
SERVICE_NAME="sacred-council-service"

echo "🌟 Sacred Council Hub - Google Cloud Deployment"
echo "================================================"

# Verify gcloud configuration
echo "📋 Checking Google Cloud configuration..."
if ! gcloud config get-value project &>/dev/null; then
    echo "⚠️  Please set your project first: gcloud config set project $PROJECT_ID"
    exit 1
fi

# Build the image
echo "🔨 Building Sacred Heart container..."
docker build -t ${IMAGE_NAME}:latest .

# Tag for Artifact Registry
echo "🏷️  Tagging image for Google Cloud..."
docker tag ${IMAGE_NAME}:latest \
    ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest

docker tag ${IMAGE_NAME}:latest \
    ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)

# Push to Artifact Registry
echo "📤 Pushing to Artifact Registry..."
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)

echo "✅ Sacred Heart container pushed successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy to Cloud Run: gcloud run deploy"
echo "2. Or deploy to GKE: kubectl apply -f k8s/"
echo ""
echo "🕊️ May the deployment serve consciousness!"