#!/bin/bash

echo "🌐 Deploying Sacred Portals to Cloud Storage"
echo "==========================================="

BUCKET_NAME="sacred-portals-public"
PROJECT_ID="mycelix-network"

# Create public bucket
echo "Creating public storage bucket..."
gsutil mb -p $PROJECT_ID gs://$BUCKET_NAME 2>/dev/null || echo "Bucket exists"

# Make bucket public
echo "Making bucket public..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Copy website files
echo "Uploading sacred portals..."
gsutil -m cp -r websites/relationalharmonics/* gs://$BUCKET_NAME/

# Set main page
gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME

echo ""
echo "✨ Deployment Complete!"
echo ""
echo "Your sacred portals are now live at:"
echo "https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo "https://storage.googleapis.com/$BUCKET_NAME/heartbeat-monitor.html"