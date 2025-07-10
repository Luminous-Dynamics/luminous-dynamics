#\!/bin/bash
set -e

PROJECT_ID="the-weave-sacred"
REGION="us-central1"
REPOSITORY="sacred-council"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}"

echo "🌟 Pushing containers to Google Artifact Registry..."
echo "Registry: ${REGISTRY}"
echo

# List of containers to push
declare -A CONTAINERS=(
    ["consciousness-field"]="evolving-resonant-cocreation-consciousness-field"
    ["agent-network"]="evolving-resonant-cocreation-agent-network"
    ["sacred-messaging"]="evolving-resonant-cocreation-sacred-messaging"
    ["work-coordination"]="evolving-resonant-cocreation-work-coordination"
    ["sacred-discord"]="sacred-council-oracle"
)

# Push each container
for NAME in "${\!CONTAINERS[@]}"; do
    LOCAL_IMAGE="${CONTAINERS[$NAME]}:latest"
    REMOTE_IMAGE="${REGISTRY}/${NAME}:latest"
    
    echo "📦 Processing ${NAME}..."
    echo "   Tagging: ${LOCAL_IMAGE} -> ${REMOTE_IMAGE}"
    docker tag ${LOCAL_IMAGE} ${REMOTE_IMAGE}
    
    echo "   ⬆️  Pushing to GCP..."
    docker push ${REMOTE_IMAGE} || echo "   ⚠️  Failed to push ${NAME}, continuing..."
    
    echo "   ✅ ${NAME} processed\!"
    echo
done

echo "🎉 Push process complete\!"
echo
echo "📋 View pushed images:"
echo "gcloud artifacts docker images list ${REGISTRY}"
