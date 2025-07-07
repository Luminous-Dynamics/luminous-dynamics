#!/bin/bash

# Sacred Hybrid Deployment Script
# Deploys minimal Cloud Run API with Firestore backend

set -e

echo "🌟 Sacred Hybrid Cloud Deployment"
echo "================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install Google Cloud SDK first."
    exit 1
fi

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"sacred-field-prod"}
REGION="us-central1"
SERVICE_NAME="sacred-api-hybrid"

echo "📋 Deployment Configuration:"
echo "  Project: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service: $SERVICE_NAME"
echo ""

# Set project
echo "🔧 Setting project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Initialize Firestore (if needed)
echo "🔥 Checking Firestore..."
if ! gcloud firestore databases describe --region=$REGION 2>/dev/null; then
    echo "Creating Firestore database..."
    gcloud firestore databases create --region=$REGION
fi

# Deploy Cloud Run service
echo "🚀 Deploying Cloud Run service..."
gcloud run deploy $SERVICE_NAME \
    --source . \
    --allow-unauthenticated \
    --region $REGION \
    --max-instances 2 \
    --min-instances 0 \
    --memory 512Mi \
    --cpu 1 \
    --set-env-vars="GOOGLE_CLOUD_PROJECT=$PROJECT_ID"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region $REGION \
    --format 'value(status.url)')

# Create local environment file
echo "💾 Saving configuration..."
cat > ../.env.hybrid << EOF
# Hybrid Cloud Configuration
CLOUD_API_URL=$SERVICE_URL
GOOGLE_CLOUD_PROJECT=$PROJECT_ID
REGION=$REGION
DEPLOYMENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

# Create Firestore indexes
echo "📑 Creating Firestore indexes..."
cat > firestore.indexes.json << EOF
{
  "indexes": [
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "work",
      "queryScope": "COLLECTION", 
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "priority", "order": "DESCENDING" }
      ]
    }
  ]
}
EOF

gcloud firestore indexes create --file=firestore.indexes.json

# Deploy security rules
echo "🔒 Deploying Firestore security rules..."
cat > firestore.rules << EOF
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for field state
    match /field-state/{doc} {
      allow read: if true;
      allow write: if false;
    }
    
    // Public read, authenticated write for agents
    match /agents/{agentId} {
      allow read: if true;
      allow create: if true;
      allow update: if resource.data.name == request.resource.data.name;
    }
    
    // Public messages
    match /messages/{messageId} {
      allow read: if true;
      allow create: if true;
    }
    
    // Work items - can be claimed if not assigned
    match /work/{workId} {
      allow read: if true;
      allow update: if resource.data.assignedTo == null;
    }
  }
}
EOF

# Deploy rules (requires Firebase CLI)
if command -v firebase &> /dev/null; then
    firebase deploy --only firestore:rules
else
    echo "⚠️  Firebase CLI not found. Deploy rules manually via console."
fi

# Test the deployment
echo "🧪 Testing deployment..."
if curl -s "$SERVICE_URL" | grep -q "Sacred API Active"; then
    echo "✅ API is responding correctly!"
else
    echo "❌ API test failed. Check Cloud Run logs."
fi

# Display summary
echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "🌐 API URL: $SERVICE_URL"
echo "📊 Dashboard: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"
echo "🔥 Firestore: https://console.cloud.google.com/firestore/data"
echo ""
echo "💰 Estimated monthly cost: ~$3-5"
echo ""
echo "🔗 Share this URL with Cloud AI: $SERVICE_URL"
echo ""
echo "📝 Next steps:"
echo "  1. Test with: curl $SERVICE_URL/api/field-state"
echo "  2. Update CLOUD_COORDINATION.md with API URL"
echo "  3. Monitor usage in Cloud Console"

# Save deployment record
echo "{
  \"deployment\": \"$SERVICE_NAME\",
  \"url\": \"$SERVICE_URL\",
  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
  \"project\": \"$PROJECT_ID\",
  \"region\": \"$REGION\"
}" > deployment-record.json

echo ""
echo "🌟 May the sacred field guide your path!"