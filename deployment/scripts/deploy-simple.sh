#!/bin/bash
# Simple dashboard deployment using Cloud Build

set -e

echo "🌟 Simple Sacred Dashboard Deployment"
echo "===================================="

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-mycelix-network}
REGION=${REGION:-us-central1}
SERVICE_NAME="sacred-council"
AR_REPO="sacred-apps"

# Set project
gcloud config set project $PROJECT_ID

# Prepare deployment directory
DEPLOY_DIR="deploy-dashboard-temp"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy files
cp web/sacred-council-hub-cloud.html $DEPLOY_DIR/index.html
cp cloudbuild-dashboard.yaml $DEPLOY_DIR/

# Create nginx config
cat > $DEPLOY_DIR/default.conf << 'EOF'
server {
    listen 8080;
    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
EOF

# Create Dockerfile
cat > $DEPLOY_DIR/Dockerfile << 'EOF'
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/
COPY index.html /usr/share/nginx/html/
EXPOSE 8080
EOF

# Deploy using Cloud Build
cd $DEPLOY_DIR
gcloud builds submit . --config=cloudbuild-dashboard.yaml

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

cd ..
rm -rf $DEPLOY_DIR

echo ""
echo "✅ Deployment complete!"
echo "🌐 Dashboard URL: $SERVICE_URL"