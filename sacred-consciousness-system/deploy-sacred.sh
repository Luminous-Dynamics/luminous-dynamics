#!/bin/bash
# Sacred Consciousness Deployment Script
# A mindful approach to cloud deployment

set -e  # Exit on error

# Configuration
PROJECT_ID="luminous-dynamics-sacred"
SERVICE_NAME="sacred-consciousness"
REGION="us-central1"
IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Colors for sacred output
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🏛️ Sacred Consciousness Deployment 🏛️${NC}"
echo "====================================="
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "deno.json" ]; then
        echo "❌ Error: Not in sacred-consciousness-system directory!"
        echo "Please run this script from the project root."
        exit 1
    fi
    
    # Check if gcloud is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo "❌ Error: No active gcloud authentication found!"
        echo "Run: gcloud auth login"
        exit 1
    fi
    
    # Check if project is set
    CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
    if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
        echo "⚠️  Current project is '$CURRENT_PROJECT', switching to '$PROJECT_ID'..."
        gcloud config set project $PROJECT_ID
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed!${NC}"
    echo ""
}

# Function to build and push image
build_image() {
    echo -e "${YELLOW}🔨 Building sacred container...${NC}"
    
    # Check if Cloud Build is available
    if gcloud builds submit --help &>/dev/null; then
        echo "Using Cloud Build..."
        gcloud builds submit --tag $IMAGE_TAG
    else
        echo "Using local Docker build..."
        docker build -t $IMAGE_TAG .
        docker push $IMAGE_TAG
    fi
    
    echo -e "${GREEN}✅ Container built and pushed!${NC}"
    echo ""
}

# Function to deploy service
deploy_service() {
    echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
    
    # Ask about authentication
    echo ""
    echo "Authentication options:"
    echo "1) Public access (--allow-unauthenticated)"
    echo "2) Require authentication (default, more secure)"
    echo ""
    read -p "Choose authentication mode (1 or 2): " AUTH_CHOICE
    
    # Base deployment command
    DEPLOY_CMD="gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_TAG \
        --platform managed \
        --region $REGION \
        --memory 512Mi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --concurrency 80 \
        --timeout 300 \
        --set-env-vars SACRED_MODE=production"
    
    # Add authentication flag if chosen
    if [ "$AUTH_CHOICE" = "1" ]; then
        DEPLOY_CMD="$DEPLOY_CMD --allow-unauthenticated"
        echo -e "${YELLOW}⚠️  Deploying with public access...${NC}"
    else
        echo -e "${GREEN}🔒 Deploying with authentication required...${NC}"
    fi
    
    # Execute deployment
    eval $DEPLOY_CMD
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
    
    echo ""
    echo -e "${GREEN}✨ Deployment complete! ✨${NC}"
    echo -e "Service URL: ${PURPLE}$SERVICE_URL${NC}"
    
    # If authenticated, show how to grant access
    if [ "$AUTH_CHOICE" != "1" ]; then
        echo ""
        echo "To grant access to specific users:"
        echo "gcloud run services add-iam-policy-binding $SERVICE_NAME \\"
        echo "  --member='user:email@domain.com' \\"
        echo "  --role='roles/run.invoker' \\"
        echo "  --region=$REGION"
    fi
}

# Function to verify deployment
verify_deployment() {
    echo ""
    echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
    
    # Check service status
    STATUS=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.conditions[0].status)')
    
    if [ "$STATUS" = "True" ]; then
        echo -e "${GREEN}✅ Service is healthy and ready!${NC}"
    else
        echo -e "${YELLOW}⚠️  Service status: $STATUS${NC}"
        echo "Check logs with: gcloud run logs read --service=$SERVICE_NAME --region=$REGION"
    fi
}

# Main execution
main() {
    check_prerequisites
    
    # Ask for confirmation
    echo "Ready to deploy Sacred Consciousness System to GCP"
    echo "Project: $PROJECT_ID"
    echo "Service: $SERVICE_NAME"
    echo "Region: $REGION"
    echo ""
    read -p "Continue? (y/N) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
    
    build_image
    deploy_service
    verify_deployment
    
    echo ""
    echo -e "${PURPLE}🙏 May this infrastructure serve consciousness! 🙏${NC}"
}

# Run main function
main