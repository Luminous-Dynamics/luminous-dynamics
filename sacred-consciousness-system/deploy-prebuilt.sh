#!/bin/bash

# Deploy using a pre-built Deno container
# This avoids the Artifact Registry permission issues

set -e

echo "🌟 Sacred Consciousness System - Pre-built Container Deployment"
echo "=============================================================="
echo ""

# Configuration
PROJECT_ID="luminous-dynamics-sacred"
REGION="us-central1"
SERVICE_NAME="sacred-consciousness"

# Set project
echo "📌 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Deploy using the official Deno image with source mounted
echo ""
echo "🚀 Deploying with pre-built Deno container..."

# Create a deployment package
echo "📦 Creating deployment package..."
cat > deploy-config.yaml << EOF
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: $SERVICE_NAME
spec:
  template:
    spec:
      containers:
      - image: denoland/deno:1.37.0
        command: ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "https://raw.githubusercontent.com/denoland/fresh/main/init.ts", ".", "--force"]
        ports:
        - containerPort: 8000
        env:
        - name: DENO_ENV
          value: production
        - name: SACRED_MODE
          value: "true"
        resources:
          limits:
            memory: 512Mi
            cpu: 1000m
EOF

# Deploy using kubectl (if available) or gcloud
echo ""
echo "☁️ Deploying to Cloud Run..."

# Alternative: Deploy a simple Deno hello world first
gcloud run deploy $SERVICE_NAME \
  --image=denoland/deno:1.37.0 \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --port=8000 \
  --memory=512Mi \
  --min-instances=0 \
  --max-instances=10 \
  --command="deno" \
  --args="run,--allow-net,https://deno.land/std@0.208.0/http/file_server.ts"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo ""
echo "✅ Basic Deployment Complete!"
echo "=========================="
echo "Service URL: $SERVICE_URL"
echo ""
echo "Note: This deploys a basic Deno file server as a proof of concept."
echo "To deploy the actual app, we need to resolve the Artifact Registry permissions."
echo ""
echo "Next steps:"
echo "1. Visit GCP Console: https://console.cloud.google.com/artifacts"
echo "2. Navigate to the repository"
echo "3. Manually grant Cloud Build service account permissions"
echo "4. Or contact GCP support about the permission issue"
echo ""
echo "🌟 At least we have a running Cloud Run service!"