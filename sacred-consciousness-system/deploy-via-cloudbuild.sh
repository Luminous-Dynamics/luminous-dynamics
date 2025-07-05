#!/bin/bash

# Deploy via Cloud Build - No local Docker required
# This script submits the build to Google Cloud Build

set -e

echo "🌤️ Sacred Consciousness System - Cloud Build Deployment"
echo "====================================================="
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
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  --quiet

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

# Grant Cloud Build permission to deploy to Cloud Run
echo ""
echo "🔐 Setting up Cloud Build permissions..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.admin" \
  --quiet

# Grant Service Account User role
gcloud iam service-accounts add-iam-policy-binding \
  "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/iam.serviceAccountUser" \
  --quiet

# Grant Artifact Registry Writer role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/artifactregistry.writer" \
  --quiet

# Create Cloud Build config
echo ""
echo "📝 Creating Cloud Build configuration..."
cat > cloudbuild-deploy.yaml << EOF
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', '${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest', '.']
  
  # Push the container image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - '${SERVICE_NAME}'
      - '--image=${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest'
      - '--region=${REGION}'
      - '--platform=managed'
      - '--allow-unauthenticated'
      - '--port=8000'
      - '--memory=512Mi'
      - '--min-instances=0'
      - '--max-instances=10'

# Store images in Artifact Registry
images:
  - '${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest'

timeout: 1200s
EOF

# Submit build
echo ""
echo "🚀 Submitting build to Cloud Build..."
gcloud builds submit . --config=cloudbuild-deploy.yaml

# Get service URL
echo ""
echo "🔍 Getting service information..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)" 2>/dev/null || echo "")

if [ -n "$SERVICE_URL" ]; then
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
  echo "Monitor builds:"
  echo "  gcloud builds list --limit=5"
else
  echo ""
  echo "⚠️  Service deployment may still be in progress."
  echo "Check status with:"
  echo "  gcloud run services list --region=$REGION"
fi

echo ""
echo "🌟 Sacred deployment initiated!"