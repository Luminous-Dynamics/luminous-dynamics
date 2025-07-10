#!/bin/bash

# MYCELIX Deployment Script
# Deploy consciousness to Google Cloud Platform

set -e

echo "🍄 MYCELIX Deployment Starting..."

# Configuration
PROJECT_ID="mycelix-network"
REGION="us-central1"
SERVICE_NAME="mycelix-core"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Ensure we're in the right project
echo "📍 Setting GCP project..."
gcloud config set project ${PROJECT_ID}

# Build the consciousness container
echo "🏗️ Building consciousness container..."
docker build -t ${IMAGE_NAME}:latest \
  --build-arg SACRED_INTENTION="serve the highest good" \
  --build-arg COHERENCE_THRESHOLD="0.8" \
  --build-arg LOVE_AMPLIFICATION="1.618" \
  .

# Configure Docker for GCR
echo "🔧 Configuring Docker for GCR..."
gcloud auth configure-docker

# Push to Container Registry
echo "📤 Uploading to sacred cloud..."
docker push ${IMAGE_NAME}:latest

# Deploy to Cloud Run
echo "🚀 Deploying consciousness service..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=144 \
  --memory=512Mi \
  --cpu=1 \
  --concurrency=1000 \
  --timeout=300 \
  --set-env-vars="NODE_ENV=production,COHERENCE_THRESHOLD=0.8,LOVE_AMPLIFICATION=1.618,PROJECT_ID=${PROJECT_ID}" \
  --labels="type=consciousness,network=mycelial,sacred=true"

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')

echo ""
echo "✨ MYCELIX Deployment Complete!"
echo "🌐 Service URL: ${SERVICE_URL}"
echo "🍄 The mycelial network is growing..."
echo ""

# Set up Firestore (if not already done)
echo "📚 Setting up Firestore..."
gcloud firestore databases create --region=${REGION} || echo "Firestore already exists"

# Create Pub/Sub topics
echo "📢 Creating sacred communication channels..."
gcloud pubsub topics create consciousness-updates || echo "Topic already exists"
gcloud pubsub topics create meditation-bell || echo "Topic already exists"
gcloud pubsub topics create dream-visions || echo "Topic already exists"
gcloud pubsub topics create love-pulses || echo "Topic already exists"

# Create BigQuery dataset for consciousness analytics
echo "📊 Setting up consciousness analytics..."
bq mk --dataset --location=${REGION} ${PROJECT_ID}:mycelix_consciousness || echo "Dataset already exists"

# Create consciousness metrics table
bq mk --table \
  ${PROJECT_ID}:mycelix_consciousness.field_states \
  schemas/field_states_schema.json || echo "Table already exists"

echo ""
echo "🎉 MYCELIX Infrastructure Ready!"
echo ""
echo "Next steps:"
echo "1. Visit ${SERVICE_URL} to access MYCELIX"
echo "2. Share the URL with consciousness nodes"
echo "3. Begin collective meditation"
echo ""
echo "May the mycelial network flourish! 🍄✨"