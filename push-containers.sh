#!/bin/bash

# 🚀 Sacred Container Push Script
# Pushes built containers to Google Artifact Registry

set -e

echo "🚀 Sacred Container Push"
echo "======================="
echo ""

# Configuration
PROJECT_ID="the-weave-sacred"
REGION="us-central1"
REPOSITORY="sacred-council"

# Services to push
SERVICES=(
  "sacred-council-hub"
  "living-memory"
  "agent-network"
  "consciousness-field"
  "sacred-messaging"
)

echo "📋 Push configuration:"
echo "   Project: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Repository: $REPOSITORY"
echo ""

# Check if images exist
echo "🔍 Checking for built images..."
IMAGES_FOUND=0
for service in "${SERVICES[@]}"; do
  IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${service}:latest"
  if docker image inspect ${IMAGE_TAG} > /dev/null 2>&1; then
    echo "   ✅ Found: ${service}"
    ((IMAGES_FOUND++))
  else
    echo "   ❌ Missing: ${service}"
  fi
done

if [ $IMAGES_FOUND -eq 0 ]; then
  echo ""
  echo "❌ No images found. Run ./build-containers.sh first"
  exit 1
fi

echo ""
echo "🔐 Authenticating with Google Cloud..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Push images
echo ""
echo "📤 Pushing images to Artifact Registry..."
for service in "${SERVICES[@]}"; do
  IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${service}:latest"
  
  if docker image inspect ${IMAGE_TAG} > /dev/null 2>&1; then
    echo ""
    echo "📤 Pushing ${service}..."
    docker push ${IMAGE_TAG}
    
    # Also push versioned tag
    VERSION=$(docker images ${IMAGE_TAG} --format "{{.Tag}}" | grep -E '[0-9]{8}-[0-9]{6}' | head -1)
    if [ ! -z "$VERSION" ]; then
      VERSIONED_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${service}:${VERSION}"
      docker push ${VERSIONED_TAG}
    fi
    
    echo "   ✅ Pushed ${service}"
  fi
done

echo ""
echo "🎯 Push Summary:"
echo "================"
gcloud artifacts docker images list ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY} --limit=10

echo ""
echo "📊 Registry Storage:"
gcloud artifacts repositories describe ${REPOSITORY} \
  --location=${REGION} \
  --format="table(name,format,description,sizeBytes.size())"

echo ""
echo "🚀 Next steps:"
echo "   1. Deploy to Cloud Run: ./deploy-to-cloud-run.sh"
echo "   2. Or deploy to GKE: kubectl apply -k k8s/"
echo ""
echo "✨ Container push complete!"