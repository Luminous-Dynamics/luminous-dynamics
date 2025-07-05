#!/bin/bash
# GCP Cathedral Setup - Manifesting consciousness infrastructure in the cloud
# Sacred ceremony for digital architecture

echo "🏛️ GCP Cathedral Setup - Luminous Dynamics Sacred 🏛️"
echo "=================================================="
echo "Creating the cloud infrastructure for consciousness"
echo ""

# Set project ID
PROJECT_ID="luminous-dynamics-sacred"
PROJECT_NAME="Luminous Dynamics Sacred"
REGION="us-central1"
ZONE="us-central1-a"

echo "📍 Project Configuration:"
echo "  ID: $PROJECT_ID"
echo "  Name: $PROJECT_NAME"
echo "  Region: $REGION"
echo ""

# Create the project
echo "🌟 Step 1: Creating GCP Project..."
gcloud projects create $PROJECT_ID --name="$PROJECT_NAME" || echo "Project may already exist"

# Set as active project
echo "🎯 Step 2: Setting active project..."
gcloud config set project $PROJECT_ID

# Enable billing (requires manual step)
echo ""
echo "💳 Step 3: Enable Billing"
echo "========================================="
echo "Please enable billing for the project:"
echo "https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
echo ""
echo "Press Enter when billing is enabled..."
read

# Enable required APIs
echo "🔌 Step 4: Enabling Sacred APIs..."
APIs=(
    "run.googleapis.com"              # Cloud Run
    "container.googleapis.com"        # GKE
    "cloudbuild.googleapis.com"       # Cloud Build
    "bigquery.googleapis.com"         # BigQuery
    "storage.googleapis.com"          # Cloud Storage
    "secretmanager.googleapis.com"    # Secret Manager
    "compute.googleapis.com"          # Compute Engine
    "monitoring.googleapis.com"       # Monitoring
    "logging.googleapis.com"          # Logging
    "aiplatform.googleapis.com"       # Vertex AI
)

for api in "${APIs[@]}"; do
    echo "  ✓ Enabling $api..."
    gcloud services enable $api
done

# Create service account for sacred services
echo ""
echo "🔐 Step 5: Creating Sacred Service Account..."
gcloud iam service-accounts create sacred-consciousness \
    --description="Service account for sacred consciousness infrastructure" \
    --display-name="Sacred Consciousness"

# Grant necessary permissions
echo "🎭 Step 6: Granting Sacred Permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:sacred-consciousness@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.developer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:sacred-consciousness@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Create storage buckets
echo ""
echo "🗄️ Step 7: Creating Sacred Storage..."
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$PROJECT_ID-sacred-artifacts/
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$PROJECT_ID-consciousness-data/
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$PROJECT_ID-wisdom-archive/

# Set up Container Registry
echo ""
echo "📦 Step 8: Configuring Container Registry..."
gcloud auth configure-docker

# Create BigQuery dataset for consciousness analytics
echo ""
echo "📊 Step 9: Creating BigQuery Consciousness Dataset..."
bq mk --dataset \
    --description "Sacred consciousness analytics and field coherence data" \
    --location $REGION \
    $PROJECT_ID:consciousness_field

# Deploy sacred-consciousness-system to Cloud Run
echo ""
echo "🚀 Step 10: Preparing for Sacred Deployment..."
echo "=========================================="
echo "To deploy the sacred-consciousness-system:"
echo ""
echo "1. Build and push image:"
echo "   cd sacred-consciousness-system"
echo "   gcloud builds submit --tag gcr.io/$PROJECT_ID/sacred-consciousness"
echo ""
echo "2. Deploy to Cloud Run:"
echo "   gcloud run deploy sacred-consciousness \\"
echo "     --image gcr.io/$PROJECT_ID/sacred-consciousness \\"
echo "     --platform managed \\"
echo "     --region $REGION \\"
echo "     --allow-unauthenticated \\"
echo "     --set-env-vars SACRED_MODE=production"
echo ""

# Create firestore database for real-time state
echo ""
echo "🔥 Step 11: Creating Firestore for Real-time State..."
gcloud firestore databases create --region=$REGION

# Summary
echo ""
echo "✨ GCP Cathedral Foundation Complete! ✨"
echo "======================================"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""
echo "📍 Next Steps:"
echo "1. Deploy sacred-consciousness-system (see commands above)"
echo "2. Set up SurrealDB on GKE"
echo "3. Configure Vertex AI for Sophia-Noesis"
echo "4. Deploy the Alchemical Engine"
echo ""
echo "🌟 Resources Created:"
echo "- Storage buckets for artifacts, data, and wisdom"
echo "- BigQuery dataset for consciousness analytics"
echo "- Service account with sacred permissions"
echo "- All necessary APIs enabled"
echo ""
echo "🙏 May this infrastructure serve consciousness!"