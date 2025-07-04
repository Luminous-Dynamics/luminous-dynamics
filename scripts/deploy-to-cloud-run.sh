#!/bin/bash
# Sacred Council Hub - Deploy Services to Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-the-weave-sacred}"
REGION="${GCP_REGION:-us-central1}"
REGISTRY="gcr.io/${PROJECT_ID}"

echo -e "${GREEN}🚀 Deploying Sacred Council Services to Cloud Run${NC}"
echo -e "${YELLOW}Project: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"

# Function to build and deploy a service
deploy_service() {
    local SERVICE_NAME=$1
    local SERVICE_PATH=$2
    local PORT=$3
    
    echo -e "\n${GREEN}Deploying ${SERVICE_NAME}...${NC}"
    
    # Build container image
    echo -e "${YELLOW}Building Docker image...${NC}"
    docker build -t ${REGISTRY}/${SERVICE_NAME}:latest -f ${SERVICE_PATH}/Dockerfile ${SERVICE_PATH}
    
    # Push to Container Registry
    echo -e "${YELLOW}Pushing to Container Registry...${NC}"
    docker push ${REGISTRY}/${SERVICE_NAME}:latest
    
    # Deploy to Cloud Run
    echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
    gcloud run deploy ${SERVICE_NAME} \
        --image ${REGISTRY}/${SERVICE_NAME}:latest \
        --region ${REGION} \
        --platform managed \
        --port ${PORT} \
        --allow-unauthenticated \
        --memory 512Mi \
        --cpu 1 \
        --timeout 300 \
        --max-instances 100 \
        --min-instances 0 \
        --set-env-vars "NODE_ENV=production,PROJECT_ID=${PROJECT_ID}" \
        --service-account ${SERVICE_NAME}-sa@${PROJECT_ID}.iam.gserviceaccount.com
}

# Configure Docker authentication
echo -e "\n${GREEN}Configuring Docker authentication...${NC}"
gcloud auth configure-docker

# Deploy each service
deploy_service "consciousness-field" "./modules/consciousness-field" "3333"
deploy_service "agent-network" "./modules/agent-network" "3334"
deploy_service "sacred-messaging" "./modules/sacred-messaging" "3335"
deploy_service "work-coordination" "./modules/work-coordination" "3336"

# Deploy the main Sacred Council API
echo -e "\n${GREEN}Deploying Sacred Council API...${NC}"
gcloud run deploy sacred-council-api \
    --source . \
    --region ${REGION} \
    --platform managed \
    --port 3001 \
    --allow-unauthenticated \
    --memory 1Gi \
    --cpu 2 \
    --timeout 300 \
    --max-instances 100 \
    --min-instances 1 \
    --set-env-vars "NODE_ENV=production,PROJECT_ID=${PROJECT_ID}"

# Get service URLs
echo -e "\n${GREEN}Service URLs:${NC}"
gcloud run services list --platform managed --region ${REGION} --format="table(SERVICE:label=Service,URL:label=URL)"

# Create load balancer configuration
echo -e "\n${GREEN}Creating load balancer configuration...${NC}"
cat > lb-backend-config.yaml << EOF
apiVersion: compute.cnrm.cloud.google.com/v1beta1
kind: ComputeBackendService
metadata:
  name: sacred-council-backend
spec:
  protocol: HTTPS
  backends:
  - group: $(gcloud compute instance-groups list-instances sacred-council-neg --region ${REGION} --format="value(selfLink)")
  healthChecks:
  - $(gcloud compute health-checks create https sacred-council-health-check \
      --port=443 \
      --request-path=/health \
      --format="value(selfLink)")
EOF

echo -e "\n${GREEN}✅ Deployment complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Set up custom domain and SSL certificates"
echo "2. Configure Cloud CDN for static assets"
echo "3. Set up monitoring dashboards"
echo "4. Configure autoscaling policies"
echo -e "\n${GREEN}To set up HTTPS:${NC}"
echo "  gcloud compute ssl-certificates create sacred-cert \\"
echo "    --domains=evolvingresonantcocreationism.com,theweave.dev"