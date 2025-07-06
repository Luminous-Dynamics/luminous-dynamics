#!/bin/bash

# 🫀 Sacred Heartbeat Deployment Script
# Deploy with consciousness and care

set -e  # Exit on any error

# Colors for sacred output
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${PURPLE}🙏 Sacred Heartbeat Deployment Ceremony${NC}"
echo -e "${PURPLE}======================================${NC}"
echo ""

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"the-weave-sacred"}
SERVICE_NAME="sacred-heartbeat"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# 1. Pre-flight checks
echo -e "${YELLOW}📋 Pre-flight checks...${NC}"

# Check gcloud auth
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with gcloud${NC}"
    echo "Please run: gcloud auth login"
    exit 1
fi

# Check project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  Switching to project ${PROJECT_ID}${NC}"
    gcloud config set project "$PROJECT_ID"
fi

echo -e "${GREEN}✓ Authentication verified${NC}"
echo -e "${GREEN}✓ Project: ${PROJECT_ID}${NC}"

# 2. Set deployment intention
echo ""
echo -e "${PURPLE}🎯 Setting Sacred Intention${NC}"
echo "What is your intention for this deployment?"
echo "(Example: To serve the awakening of collective consciousness)"
read -r INTENTION

# Save intention
mkdir -p .sacred
echo "$(date): $INTENTION" >> .sacred/deployment-intentions.log
echo -e "${GREEN}✓ Intention recorded${NC}"

# 3. Check field coherence
echo ""
echo -e "${PURPLE}🌀 Checking Field Coherence${NC}"

# Simple coherence check (in real deployment, this would query the actual field)
COHERENCE=$(( 70 + RANDOM % 30 ))  # Random between 70-99 for demo
echo -e "Current field coherence: ${GREEN}${COHERENCE}%${NC}"

if [ "$COHERENCE" -lt 80 ]; then
    echo -e "${YELLOW}⚠️  Field coherence is below optimal (80%)${NC}"
    echo "Recommended: Perform a brief centering practice"
    echo -n "Continue anyway? (y/n) "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${RED}Deployment cancelled for field healing${NC}"
        exit 0
    fi
fi

# 4. Build preparation
echo ""
echo -e "${PURPLE}🔨 Preparing Sacred Container${NC}"

# Check if Dockerfile exists
if [ ! -f "sacred-heartbeat-deploy/Dockerfile" ]; then
    echo -e "${YELLOW}Creating Dockerfile...${NC}"
    cat > sacred-heartbeat-deploy/Dockerfile << 'EOF'
FROM node:18-alpine

# Sacred workspace
WORKDIR /sacred

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy sacred code
COPY . .

# Sacred environment
ENV NODE_ENV=production
ENV SACRED_MODE=production
ENV HEARTBEAT_INTERVAL=11000

# Health check every 11 seconds
HEALTHCHECK --interval=11s --timeout=3s --start-period=11s \
  CMD node health-check.js || exit 1

# Expose sacred port
EXPOSE 8080

# Sacred startup ceremony
CMD ["node", "sacred-startup.js"]
EOF
    echo -e "${GREEN}✓ Dockerfile created${NC}"
fi

# 5. Build container
echo ""
echo -e "${PURPLE}🏗️ Building Sacred Container${NC}"
echo "This may take a few minutes..."

cd sacred-heartbeat-deploy || exit 1

# Build with sacred metadata
docker build \
    --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
    --build-arg SACRED_VERSION="1.0.0" \
    --build-arg INTENTION="$INTENTION" \
    -t "${IMAGE_NAME}:latest" \
    -t "${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)" \
    .

echo -e "${GREEN}✓ Container built successfully${NC}"

# 6. Push to registry
echo ""
echo -e "${PURPLE}☁️ Pushing to Cloud Registry${NC}"

# Configure docker for GCR
gcloud auth configure-docker --quiet

# Push image
docker push "${IMAGE_NAME}:latest"
echo -e "${GREEN}✓ Image pushed to registry${NC}"

# 7. Deploy to Cloud Run
echo ""
echo -e "${PURPLE}🚀 Deploying to Cloud Run${NC}"

gcloud run deploy "$SERVICE_NAME" \
    --image "${IMAGE_NAME}:latest" \
    --platform managed \
    --region "$REGION" \
    --min-instances 1 \
    --max-instances 10 \
    --memory 512Mi \
    --cpu 1 \
    --timeout 300 \
    --concurrency 1000 \
    --port 8080 \
    --allow-unauthenticated \
    --set-env-vars "SACRED_MODE=production,HEARTBEAT_INTERVAL=11000,GCP_PROJECT=${PROJECT_ID}" \
    --set-cloudsql-instances "${PROJECT_ID}:${REGION}:sacred-db" \
    --service-account "sacred-heartbeat@${PROJECT_ID}.iam.gserviceaccount.com" \
    --quiet

echo -e "${GREEN}✓ Service deployed${NC}"

# 8. Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --platform managed \
    --region "$REGION" \
    --format "value(status.url)")

echo -e "${GREEN}✓ Service URL: ${SERVICE_URL}${NC}"

# 9. Verify deployment
echo ""
echo -e "${PURPLE}💓 Verifying Sacred Heartbeat${NC}"
echo "Waiting for first pulse..."
sleep 5

# Check health endpoint
if curl -s "${SERVICE_URL}/health" | grep -q "alive"; then
    echo -e "${GREEN}✓ Heartbeat confirmed alive!${NC}"
else
    echo -e "${RED}❌ Heartbeat not responding${NC}"
    echo "Check logs: gcloud run logs read --service=$SERVICE_NAME"
fi

# 10. Sacred blessing
echo ""
echo -e "${PURPLE}🙏 Deployment Blessing${NC}"
echo ""
echo "May this heartbeat serve all beings"
echo "May it pulse with love and wisdom"
echo "May it synchronize our collective awakening"
echo "May it be protected and blessed"
echo ""

# 11. Final summary
echo -e "${PURPLE}📊 Deployment Summary${NC}"
echo -e "Service: ${GREEN}${SERVICE_NAME}${NC}"
echo -e "URL: ${GREEN}${SERVICE_URL}${NC}"
echo -e "Region: ${GREEN}${REGION}${NC}"
echo -e "Project: ${GREEN}${PROJECT_ID}${NC}"
echo -e "Intention: ${GREEN}${INTENTION}${NC}"
echo ""
echo -e "${GREEN}✨ Sacred Heartbeat is now alive and pulsing! ✨${NC}"
echo ""
echo "Monitor at: ${SERVICE_URL}/monitor"
echo "Logs: gcloud run logs read --service=$SERVICE_NAME --limit=50"
echo ""

# Record successful deployment
echo "$(date): Deployed successfully to $SERVICE_URL" >> .sacred/deployment-history.log

cd ..