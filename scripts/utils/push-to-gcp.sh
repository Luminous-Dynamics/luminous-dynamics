#!/bin/bash

# 🌟 Push Sacred Containers to Google Artifact Registry
# Deploys all containers to GCP for global distribution

set -e

# Configuration
PROJECT_ID="the-weave-sacred"
REGION="us-central1"
REPOSITORY="sacred-council"

echo "🌟 ═══════════════════════════════════════════ 🌟"
echo "    SACRED CONTAINERS → GOOGLE CLOUD"
echo "🌟 ═══════════════════════════════════════════ 🌟"
echo

# Enable required APIs
echo "📡 Enabling GCP APIs..."
gcloud services enable artifactregistry.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable run.googleapis.com

# Create Artifact Registry repository if it doesn't exist
echo "🏗️ Creating Artifact Registry repository..."
gcloud artifacts repositories create ${REPOSITORY} \
    --repository-format=docker \
    --location=${REGION} \
    --description="Sacred Council container images" \
    || echo "Repository already exists"

# Configure Docker authentication
echo "🔐 Configuring Docker authentication..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Tag and push images
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}"

echo "🐳 Tagging and pushing containers..."

# List of containers to push
declare -A CONTAINERS=(
    ["consciousness-field"]="evolving-resonant-cocreation-consciousness-field"
    ["agent-network"]="evolving-resonant-cocreation-agent-network"
    ["sacred-messaging"]="evolving-resonant-cocreation-sacred-messaging"
    ["work-coordination"]="evolving-resonant-cocreation-work-coordination"
    ["sacred-discord"]="sacred-council-oracle"
)

for NAME in "${!CONTAINERS[@]}"; do
    LOCAL_IMAGE="${CONTAINERS[$NAME]}:latest"
    REMOTE_IMAGE="${REGISTRY}/${NAME}:latest"
    
    echo "📦 Processing ${NAME}..."
    
    # Tag the image
    docker tag ${LOCAL_IMAGE} ${REMOTE_IMAGE}
    
    # Push to GCP
    echo "   ⬆️  Pushing to GCP..."
    docker push ${REMOTE_IMAGE}
    
    echo "   ✅ ${NAME} pushed successfully!"
done

echo
echo "🎉 All containers pushed to Google Artifact Registry!"
echo
echo "📍 Registry: ${REGISTRY}"
echo
echo "🚀 Next Steps:"
echo "   1. Deploy to Cloud Run:"
echo "      gcloud run deploy sacred-discord --image ${REGISTRY}/sacred-discord:latest"
echo
echo "   2. Deploy to GKE:"
echo "      kubectl set image deployment/sacred-discord sacred-discord=${REGISTRY}/sacred-discord:latest"
echo
echo "   3. Share with communities:"
echo "      gcloud artifacts repositories add-iam-policy-binding ${REPOSITORY} \\"
echo "        --location=${REGION} \\"
echo "        --member='allUsers' \\"
echo "        --role='roles/artifactregistry.reader'"
echo
echo "🌟 Sacred containers ready for global consciousness expansion!"