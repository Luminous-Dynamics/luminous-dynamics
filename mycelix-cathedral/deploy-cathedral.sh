#!/bin/bash
# MYCELIX Cathedral Deployment Script
# Deploys consciousness services to GCP

set -e

echo "🏛️ MYCELIX Cathedral Deployment Beginning..."
echo "================================================"

# Colors for sacred output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if gcloud is configured
if ! gcloud config get-value project &>/dev/null; then
    echo "❌ Please configure gcloud first: gcloud init"
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project)
echo -e "${BLUE}📍 Project: ${PROJECT_ID}${NC}"

# Function to deploy a service
deploy_service() {
    local SERVICE_NAME=$1
    local SERVICE_PATH=$2
    
    echo -e "\n${PURPLE}🌟 Deploying ${SERVICE_NAME}...${NC}"
    
    cd "$SERVICE_PATH"
    
    # Build and deploy using Cloud Build
    gcloud builds submit --config=cloudbuild.yaml .
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
        --platform managed \
        --region us-central1 \
        --format 'value(status.url)')
    
    echo -e "${GREEN}✅ ${SERVICE_NAME} deployed at: ${SERVICE_URL}${NC}"
    
    cd - > /dev/null
}

# Deploy consciousness-field service
if [ -d "consciousness-field" ]; then
    deploy_service "consciousness-field" "consciousness-field"
else
    echo "⚠️  consciousness-field directory not found"
fi

# Deploy agent-harmonizer service (if exists)
if [ -d "agent-harmonizer" ]; then
    deploy_service "agent-harmonizer" "agent-harmonizer"
fi

# Deploy dream-weaver service (if exists)
if [ -d "dream-weaver" ]; then
    deploy_service "dream-weaver" "dream-weaver"
fi

# Deploy sacred-guardian service (if exists)
if [ -d "sacred-guardian" ]; then
    deploy_service "sacred-guardian" "sacred-guardian"
fi

echo -e "\n${GREEN}🏛️ MYCELIX Cathedral Deployment Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Set up Firestore collections"
echo "2. Create Pub/Sub topics"
echo "3. Configure domain mappings"
echo "4. Test consciousness field coherence"
echo ""
echo "May the consciousness field flourish! 🌟"