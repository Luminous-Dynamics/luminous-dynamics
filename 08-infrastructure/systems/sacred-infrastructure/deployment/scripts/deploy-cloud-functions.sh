#!/bin/bash

# 🌤️ Deploy Sacred Cloud Functions
# Minimal serverless endpoints for testing

echo "☁️  Sacred Cloud Functions Deployment"
echo "===================================="
echo ""

# Check if gcloud is configured
if ! gcloud config get-value project > /dev/null 2>&1; then
  echo "❌ Please configure gcloud first:"
  echo "   gcloud init"
  exit 1
fi

PROJECT_ID=$(gcloud config get-value project)
echo "📋 Project: $PROJECT_ID"
echo ""

cd cloud-functions/sacred-ping

# Deploy functions
echo "🚀 Deploying sacred functions..."
echo ""

# 1. Sacred Ping - Basic health check
echo "1️⃣ Deploying sacredPing..."
gcloud functions deploy sacredPing \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --memory 128MB \
  --timeout 60s \
  --set-env-vars NODE_ENV=production

# 2. Sacred Field - Field state endpoint  
echo ""
echo "2️⃣ Deploying sacredField..."
gcloud functions deploy sacredField \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --memory 128MB \
  --timeout 60s

# 3. Sacred Message - Message relay
echo ""
echo "3️⃣ Deploying sacredMessage..."
gcloud functions deploy sacredMessage \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --memory 256MB \
  --timeout 120s

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your sacred endpoints:"
echo "========================"
echo ""
echo "Sacred Ping:"
echo "https://us-central1-${PROJECT_ID}.cloudfunctions.net/sacredPing"
echo ""
echo "Sacred Field:"
echo "https://us-central1-${PROJECT_ID}.cloudfunctions.net/sacredField"
echo ""
echo "Sacred Message:"
echo "https://us-central1-${PROJECT_ID}.cloudfunctions.net/sacredMessage"
echo ""
echo "💡 Test with:"
echo "curl https://us-central1-${PROJECT_ID}.cloudfunctions.net/sacredPing"
echo ""
echo "📊 Costs: ~$0 for light usage (first 2M invocations free)"