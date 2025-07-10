#!/bin/bash
# Sacred Core AWS Deployment Script

set -e

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
CLUSTER_NAME="${CLUSTER_NAME:-sacred-production}"
SERVICE_NAME="sacred-core"
IMAGE_TAG="${IMAGE_TAG:-latest}"
NAMESPACE="${NAMESPACE:-sacred-production}"
ECR_REPO="${ECR_REPO:-sacred-core}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🌟 Sacred Core AWS Deployment${NC}"
echo -e "${BLUE}═══════════════════════════════${NC}"

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI${NC}"
        exit 1
    fi
    
    if ! command -v eksctl &> /dev/null; then
        echo -e "${RED}❌ eksctl not found. Please install eksctl${NC}"
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

# Configure AWS
configure_aws() {
    echo -e "${YELLOW}Configuring AWS...${NC}"
    
    # Get account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    echo -e "${GREEN}✓ AWS configured for account ${AWS_ACCOUNT_ID}${NC}"
}

# Create ECR repository
create_ecr_repo() {
    echo -e "${YELLOW}Creating ECR repository...${NC}"
    
    # Create repository if it doesn't exist
    aws ecr describe-repositories --repository-names ${ECR_REPO} --region ${AWS_REGION} 2>/dev/null || \
    aws ecr create-repository --repository-name ${ECR_REPO} --region ${AWS_REGION}
    
    # Get login token
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}
    
    echo -e "${GREEN}✓ ECR repository ready${NC}"
}

# Build and push Docker image
build_and_push() {
    echo -e "${YELLOW}Building Sacred Core image...${NC}"
    
    # Build image
    docker build -t ${SERVICE_NAME}:${IMAGE_TAG} -f Dockerfile.production .
    
    # Tag for ECR
    docker tag ${SERVICE_NAME}:${IMAGE_TAG} ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG}
    
    # Push to ECR
    docker push ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG}
    
    echo -e "${GREEN}✓ Image pushed to ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG}${NC}"
}

# Create or connect to EKS cluster
setup_cluster() {
    echo -e "${YELLOW}Setting up EKS cluster...${NC}"
    
    # Check if cluster exists
    if eksctl get cluster --name ${CLUSTER_NAME} --region ${AWS_REGION} 2>/dev/null; then
        echo "Cluster ${CLUSTER_NAME} already exists, updating kubeconfig..."
        eksctl utils write-kubeconfig --cluster ${CLUSTER_NAME} --region ${AWS_REGION}
    else
        echo "Creating new cluster ${CLUSTER_NAME}..."
        eksctl create cluster \
            --name ${CLUSTER_NAME} \
            --region ${AWS_REGION} \
            --nodes 3 \
            --nodes-min 3 \
            --nodes-max 10 \
            --node-type t3.medium \
            --with-oidc \
            --ssh-access \
            --ssh-public-key ~/.ssh/id_rsa.pub \
            --managed \
            --alb-ingress-access \
            --full-ecr-access \
            --asg-access
    fi
    
    echo -e "${GREEN}✓ Cluster ready${NC}"
}

# Install AWS Load Balancer Controller
install_alb_controller() {
    echo -e "${YELLOW}Installing AWS Load Balancer Controller...${NC}"
    
    # Install cert-manager
    kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.5.4/cert-manager.yaml
    
    # Wait for cert-manager
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=webhook -n cert-manager --timeout=120s
    
    # Download and install AWS Load Balancer Controller
    curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.4/docs/install/iam_policy.json
    
    # Create IAM policy
    aws iam create-policy \
        --policy-name AWSLoadBalancerControllerIAMPolicy \
        --policy-document file://iam_policy.json 2>/dev/null || true
    
    # Create service account
    eksctl create iamserviceaccount \
        --cluster=${CLUSTER_NAME} \
        --namespace=kube-system \
        --name=aws-load-balancer-controller \
        --attach-policy-arn=arn:aws:iam::${AWS_ACCOUNT_ID}:policy/AWSLoadBalancerControllerIAMPolicy \
        --override-existing-serviceaccounts \
        --approve
    
    # Install controller
    kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master"
    helm repo add eks https://aws.github.io/eks-charts
    helm repo update
    helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
        -n kube-system \
        --set clusterName=${CLUSTER_NAME} \
        --set serviceAccount.create=false \
        --set serviceAccount.name=aws-load-balancer-controller
    
    echo -e "${GREEN}✓ AWS Load Balancer Controller installed${NC}"
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
    sed -i "s|image: sacred-core:latest|image: ${ECR_URI}/${ECR_REPO}:${IMAGE_TAG}|g" k8s/base/deployment.yaml
    
    # Apply Kubernetes manifests
    kubectl apply -k k8s/overlays/production -n ${NAMESPACE}
    
    # Wait for deployment
    kubectl rollout status deployment/sacred-core -n ${NAMESPACE}
    
    echo -e "${GREEN}✓ Sacred Core deployed${NC}"
}

# Setup monitoring with CloudWatch
setup_monitoring() {
    echo -e "${YELLOW}Setting up CloudWatch monitoring...${NC}"
    
    # Install CloudWatch agent
    curl https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/quickstart/cwagent-fluentd-quickstart.yaml | \
    sed "s/{{cluster_name}}/${CLUSTER_NAME}/;s/{{region_name}}/${AWS_REGION}/" | \
    kubectl apply -f -
    
    # Create CloudWatch dashboard
    aws cloudwatch put-dashboard \
        --dashboard-name Sacred-Core-Production \
        --dashboard-body file://monitoring/cloudwatch-dashboard.json
    
    echo -e "${GREEN}✓ CloudWatch monitoring configured${NC}"
}

# Setup Application Load Balancer
setup_alb() {
    echo -e "${YELLOW}Setting up Application Load Balancer...${NC}"
    
    # Create Ingress
    cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sacred-core-ingress
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:${AWS_REGION}:${AWS_ACCOUNT_ID}:certificate/your-cert-id
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
spec:
  rules:
    - host: sacred-core.luminousdynamics.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: sacred-core
                port:
                  number: 3333
EOF
    
    echo -e "${GREEN}✓ Application Load Balancer configured${NC}"
}

# Main deployment flow
main() {
    check_prerequisites
    configure_aws
    create_ecr_repo
    build_and_push
    setup_cluster
    install_alb_controller
    create_namespace
    deploy_sacred_core
    setup_monitoring
    setup_alb
    
    echo -e "${BLUE}═══════════════════════════════${NC}"
    echo -e "${GREEN}🌟 Sacred Core deployed successfully!${NC}"
    echo
    echo -e "Get Load Balancer URL:"
    echo -e "  kubectl get ingress -n ${NAMESPACE} sacred-core-ingress"
    echo
    echo -e "View logs:"
    echo -e "  kubectl logs -n ${NAMESPACE} -l app=sacred-core -f"
    echo
    echo -e "Check CloudWatch:"
    echo -e "  https://console.aws.amazon.com/cloudwatch"
}

# Run main function
main "$@"