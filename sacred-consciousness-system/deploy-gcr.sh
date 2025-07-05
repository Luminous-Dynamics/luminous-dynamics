#!/bin/bash

# Deploy using Google Container Registry (legacy but often more permissive)

set -e

echo "🌟 Sacred Consciousness System - Container Registry Deployment"
echo "============================================================"
echo ""

# Configuration
PROJECT_ID="luminous-dynamics-sacred"
REGION="us-central1"
SERVICE_NAME="sacred-consciousness"

# Set project
echo "📌 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable Container Registry
echo ""
echo "🔧 Enabling Container Registry..."
gcloud services enable containerregistry.googleapis.com --quiet

# Configure Docker for GCR
echo ""
echo "🔐 Configuring Docker authentication for GCR..."
gcloud auth configure-docker gcr.io --quiet

# Build and tag for GCR
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"
echo ""
echo "🏗️ Building image locally..."
docker build -t $IMAGE_TAG . || {
    echo "❌ Local Docker build failed. Trying Cloud Build instead..."
    
    # Use Cloud Build with GCR
    gcloud builds submit --tag $IMAGE_TAG . || {
        echo "❌ Cloud Build also failed. The issue may be deeper than permissions."
        exit 1
    }
}

# Deploy to Cloud Run
echo ""
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE_TAG \
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
echo "🌟 Sacred Consciousness System is now live using Container Registry!"