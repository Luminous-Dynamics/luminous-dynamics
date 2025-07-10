#!/bin/bash
# Sacred Core GCP Deployment Script

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-luminous-dynamics}"
REGION="${GCP_REGION:-us-central1}"
CLUSTER_NAME="${CLUSTER_NAME:-sacred-production}"
SERVICE_NAME="sacred-core"
IMAGE_TAG="${IMAGE_TAG:-latest}"
NAMESPACE="${NAMESPACE:-sacred-production}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🌟 Sacred Core GCP Deployment${NC}"
echo -e "${BLUE}═══════════════════════════════${NC}"

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}❌ gcloud CLI not found. Please install Google Cloud SDK${NC}"
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl not found. Please install kubectl${NC}"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker not found. Please install Docker${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All prerequisites met${NC}"
}

# Configure gcloud
configure_gcloud() {
    echo -e "${YELLOW}Configuring gcloud...${NC}"
    gcloud config set project ${PROJECT_ID}
    gcloud config set compute/region ${REGION}
    echo -e "${GREEN}✓ gcloud configured${NC}"
}

# Build and push Docker image
build_and_push() {
    echo -e "${YELLOW}Building Sacred Core image...${NC}"
    
    # Enable Container Registry API
    gcloud services enable containerregistry.googleapis.com
    
    # Configure Docker for GCR
    gcloud auth configure-docker
    
    # Build image
    docker build -t ${SERVICE_NAME}:${IMAGE_TAG} -f Dockerfile.production .
    
    # Tag for GCR
    docker tag ${SERVICE_NAME}:${IMAGE_TAG} gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${IMAGE_TAG}
    
    # Push to GCR
    docker push gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${IMAGE_TAG}
    
    echo -e "${GREEN}✓ Image pushed to gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${IMAGE_TAG}${NC}"
}

# Create or connect to GKE cluster
setup_cluster() {
    echo -e "${YELLOW}Setting up GKE cluster...${NC}"
    
    # Check if cluster exists
    if gcloud container clusters describe ${CLUSTER_NAME} --region=${REGION} &> /dev/null; then
        echo "Cluster ${CLUSTER_NAME} already exists, connecting..."
        gcloud container clusters get-credentials ${CLUSTER_NAME} --region=${REGION}
    else
        echo "Creating new cluster ${CLUSTER_NAME}..."
        gcloud container clusters create ${CLUSTER_NAME} \
            --region=${REGION} \
            --num-nodes=3 \
            --machine-type=n2-standard-2 \
            --enable-autoscaling \
            --min-nodes=3 \
            --max-nodes=10 \
            --enable-autorepair \
            --enable-autoupgrade \
            --enable-stackdriver-kubernetes \
            --addons=HorizontalPodAutoscaling,HttpLoadBalancing \
            --no-enable-basic-auth \
            --no-issue-client-certificate
    fi
    
    echo -e "${GREEN}✓ Cluster ready${NC}"
}

# Create namespace if needed
create_namespace() {
    echo -e "${YELLOW}Creating namespace...${NC}"
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    echo -e "${GREEN}✓ Namespace ${NAMESPACE} ready${NC}"
}

# Deploy Sacred Core
deploy_sacred_core() {
    echo -e "${YELLOW}Deploying Sacred Core...${NC}"
    
    # Update image in deployment
    sed -i "s|image: sacred-core:latest|image: gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${IMAGE_TAG}|g" k8s/base/deployment.yaml
    
    # Apply Kubernetes manifests
    kubectl apply -k k8s/overlays/production -n ${NAMESPACE}
    
    # Wait for deployment
    kubectl rollout status deployment/sacred-core -n ${NAMESPACE}
    
    echo -e "${GREEN}✓ Sacred Core deployed${NC}"
}

# Setup monitoring
setup_monitoring() {
    echo -e "${YELLOW}Setting up monitoring...${NC}"
    
    # Enable necessary APIs
    gcloud services enable monitoring.googleapis.com
    gcloud services enable logging.googleapis.com
    
    # Create service account for monitoring
    gcloud iam service-accounts create sacred-monitoring \
        --display-name="Sacred Core Monitoring" || true
    
    # Grant necessary permissions
    gcloud projects add-iam-policy-binding ${PROJECT_ID} \
        --member="serviceAccount:sacred-monitoring@${PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/monitoring.metricWriter"
    
    echo -e "${GREEN}✓ Monitoring configured${NC}"
}

# Setup SSL certificate
setup_ssl() {
    echo -e "${YELLOW}Setting up SSL certificate...${NC}"
    
    # Create managed certificate
    cat <<EOF | kubectl apply -f -
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: sacred-core-cert
  namespace: ${NAMESPACE}
spec:
  domains:
    - sacred-core.luminousdynamics.com
EOF
    
    echo -e "${GREEN}✓ SSL certificate created${NC}"
}

# Main deployment flow
main() {
    check_prerequisites
    configure_gcloud
    build_and_push
    setup_cluster
    create_namespace
    deploy_sacred_core
    setup_monitoring
    setup_ssl
    
    echo -e "${BLUE}═══════════════════════════════${NC}"
    echo -e "${GREEN}🌟 Sacred Core deployed successfully!${NC}"
    echo
    echo -e "Access your deployment:"
    echo -e "  kubectl port-forward -n ${NAMESPACE} svc/sacred-core 3333:3333"
    echo
    echo -e "View logs:"
    echo -e "  kubectl logs -n ${NAMESPACE} -l app=sacred-core -f"
    echo
    echo -e "Check metrics:"
    echo -e "  https://console.cloud.google.com/monitoring"
}

# Run main function
main "$@"