#!/bin/bash
# Enable Firebase services in GCP project

echo "🔧 Enabling Firebase Services in GCP"
echo "===================================="

PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-mycelix-network}
echo "Project: $PROJECT_ID"

# Enable required APIs
echo ""
echo "📡 Enabling required Google Cloud APIs..."

# Firebase Management API
echo "1. Firebase Management API..."
gcloud services enable firebase.googleapis.com --project=$PROJECT_ID

# Firebase Hosting API
echo "2. Firebase Hosting API..."
gcloud services enable firebasehosting.googleapis.com --project=$PROJECT_ID

# Other required APIs
echo "3. Cloud Resource Manager API..."
gcloud services enable cloudresourcemanager.googleapis.com --project=$PROJECT_ID

echo "4. Cloud Billing API..."
gcloud services enable cloudbilling.googleapis.com --project=$PROJECT_ID

# Check if APIs are enabled
echo ""
echo "✅ Checking enabled APIs..."
gcloud services list --enabled --filter="name:(firebase OR firebasehosting)" --project=$PROJECT_ID

echo ""
echo "🎯 Next Steps:"
echo "1. Go to: https://console.firebase.google.com"
echo "2. Click 'Add project'"
echo "3. Select 'Use existing Google Cloud project'"
echo "4. Choose: $PROJECT_ID"
echo "5. Follow the setup wizard"
echo ""
echo "OR try Firebase CLI again:"
echo "npx firebase init hosting"