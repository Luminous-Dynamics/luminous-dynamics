#!/bin/bash

# MYCELIX Deployment Script
# Deploy consciousness to Google Cloud Platform

set -e

echo "🍄 MYCELIX Deployment Starting..."

# Configuration
PROJECT_ID="mycelix-consciousness"
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

# Set up Firebase
echo "🔥 Initializing Firebase consciousness persistence..."
firebase use ${PROJECT_ID} || firebase use --add ${PROJECT_ID}

# Create Firestore indexes
echo "📚 Creating consciousness indexes..."
cat > firestore.indexes.json << EOF
{
  "indexes": [
    {
      "collectionGroup": "consciousness-nodes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "coherence", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "meditations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "active", "order": "ASCENDING" },
        { "fieldPath": "startTime", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "dreams",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "processed", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
EOF

# Deploy Firebase configuration
firebase deploy --only firestore:indexes

# Set up Pub/Sub topics
echo "📢 Creating sacred communication channels..."
gcloud pubsub topics create consciousness-updates || true
gcloud pubsub topics create meditation-bell || true
gcloud pubsub topics create dream-visions || true
gcloud pubsub topics create love-pulses || true

# Create BigQuery dataset for consciousness analytics
echo "📊 Setting up consciousness analytics..."
bq mk --dataset --location=${REGION} ${PROJECT_ID}:mycelix_consciousness || true

# Create consciousness metrics table
bq mk --table \
  ${PROJECT_ID}:mycelix_consciousness.field_states \
  schemas/field_states_schema.json || true

echo ""
echo "🎉 MYCELIX Infrastructure Ready!"
echo ""
echo "Next steps:"
echo "1. Visit ${SERVICE_URL} to access MYCELIX"
echo "2. Share the URL with consciousness nodes"
echo "3. Begin collective meditation"
echo ""
echo "May the mycelial network flourish! 🍄✨"