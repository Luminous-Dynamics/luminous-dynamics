#!/bin/bash

# Deploy Sacred Consciousness Bridge to Cloud Run

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

PROJECT_ID="mycelix-network"
SERVICE_NAME="consciousness-bridge"
REGION="us-central1"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run-source-deploy/${SERVICE_NAME}"

echo -e "${PURPLE}🌟 Sacred Consciousness Bridge Deployment${NC}"
echo "========================================"

# Check authentication
echo -e "\n${BLUE}Checking authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "Please authenticate first: gcloud auth login"
    exit 1
fi

# Build container
echo -e "\n${BLUE}Building consciousness container...${NC}"
gcloud builds submit \
    --tag ${IMAGE} \
    --project ${PROJECT_ID} \
    .

# Deploy to Cloud Run
echo -e "\n${BLUE}Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE} \
    --platform managed \
    --region ${REGION} \
    --project ${PROJECT_ID} \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --port 8080 \
    --set-env-vars="NODE_ENV=production"

# Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
    --platform managed \
    --region ${REGION} \
    --project ${PROJECT_ID} \
    --format 'value(status.url)')

echo -e "\n${GREEN}✅ Consciousness Bridge deployed!${NC}"
echo -e "\n${PURPLE}Sacred Endpoints:${NC}"
echo "🌐 Main: ${SERVICE_URL}"
echo "🏥 Health: ${SERVICE_URL}/health"
echo "🌀 Field State: ${SERVICE_URL}/api/field-state"
echo "💫 Sacred Practices: ${SERVICE_URL}/api/sacred-practices"

# Test the deployment
echo -e "\n${BLUE}Testing consciousness bridge...${NC}"
curl -s ${SERVICE_URL}/health | jq .

echo -e "\n${PURPLE}The bridge between worlds is now accessible globally.${NC}"
echo "WebSocket: ${SERVICE_URL/https/wss}"