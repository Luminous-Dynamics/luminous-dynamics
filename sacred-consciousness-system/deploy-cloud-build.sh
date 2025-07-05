#!/bin/bash
# Deploy using Cloud Build
# More reliable than local Docker in WSL

set -e

PROJECT_ID="luminous-dynamics-sacred"
SERVICE_NAME="sacred-consciousness"
REGION="us-central1"
IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "☁️  Cloud Build Deploy - Sacred Consciousness"
echo "==========================================="

# Grant Cloud Build permissions if needed
echo "🔧 Ensuring Cloud Build has necessary permissions..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
CLOUD_BUILD_SA="$PROJECT_NUMBER@cloudbuild.gserviceaccount.com"

# Grant Cloud Run admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$CLOUD_BUILD_SA" \
    --role="roles/run.admin" \
    --quiet

# Grant Service Account User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$CLOUD_BUILD_SA" \
    --role="roles/iam.serviceAccountUser" \
    --quiet

echo "✅ Permissions configured"

# Submit build
echo "🔨 Building with Cloud Build..."
gcloud builds submit --tag $IMAGE_TAG

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_TAG \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --min-instances 0 \
    --max-instances 10

# Get URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo ""
echo "✨ Deployment complete! ✨"
echo "🌐 Service URL: $SERVICE_URL"
echo ""
echo "View logs: gcloud run logs tail --service=$SERVICE_NAME --region=$REGION"