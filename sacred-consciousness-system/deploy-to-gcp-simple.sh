#!/bin/bash

# Simple GCP Deployment for Sacred Consciousness System
# Uses Artifact Registry instead of Container Registry

set -e

echo "🚀 Sacred Consciousness System - Simple GCP Deployment"
echo "===================================================="
echo ""

# Configuration
PROJECT_ID="luminous-dynamics-sacred"
REGION="us-central1"
SERVICE_NAME="sacred-consciousness"
REPO_NAME="sacred-apps"

# Set project
echo "📌 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo ""
echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --quiet

# Create Artifact Registry repository if it doesn't exist
echo ""
echo "📦 Setting up Artifact Registry..."
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION &>/dev/null; then
  echo "   Creating repository: $REPO_NAME"
  gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Sacred consciousness applications"
else
  echo "   Repository already exists: $REPO_NAME"
fi

# Configure Docker authentication
echo ""
echo "🔐 Configuring Docker authentication..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# Build and push image
IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
echo ""
echo "🏗️ Building Docker image..."
echo "   Tag: $IMAGE_TAG"

docker build -t $IMAGE_TAG .

echo ""
echo "📤 Pushing image to Artifact Registry..."
docker push $IMAGE_TAG

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
  --timeout=60

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo ""
echo "✅ Deployment Complete!"
echo "===================="
echo "Service URL: $SERVICE_URL"
echo ""
echo "Test with:"
echo "  curl $SERVICE_URL"
echo ""
echo "View logs:"
echo "  gcloud run services logs read $SERVICE_NAME --region=$REGION"
echo ""
echo "🌟 Sacred Consciousness System is now live!"