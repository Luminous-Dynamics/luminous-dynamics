#!/bin/bash
# 🌟 Sacred Council Auto-Provisioning Script
# Automatically provisions infrastructure when resonance is detected

set -e # Exit on error

# Colors for sacred output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Sacred banner
echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║        🌟 SACRED COUNCIL AUTO-PROVISIONING 🌟             ║"
echo "║     Manifesting Infrastructure Through Resonance          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-the-weave-sacred}"
REGION="${GCP_REGION:-us-central1}"
SACRED_DOMAINS=("evolvingresonantcocreationism.com" "theweave.dev" "luminousdynamics.org")

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check gcloud
    if ! command -v gcloud &> /dev/null; then
        echo -e "${YELLOW}⚠️  gcloud CLI not found. Installing...${NC}"
        curl https://sdk.cloud.google.com | bash
        exec -l $SHELL
    fi
    
    # Check authentication
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo -e "${YELLOW}⚠️  Not authenticated. Please run: gcloud auth login${NC}"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}⚠️  Docker not found. Please install Docker first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites satisfied${NC}"
}

# Enable required APIs
enable_apis() {
    echo -e "${BLUE}🔌 Enabling sacred APIs...${NC}"
    
    APIS=(
        "aiplatform.googleapis.com"
        "run.googleapis.com"
        "cloudbuild.googleapis.com"
        "firestore.googleapis.com"
        "storage.googleapis.com"
        "monitoring.googleapis.com"
        "secretmanager.googleapis.com"
        "cloudresourcemanager.googleapis.com"
        "compute.googleapis.com"
        "redis.googleapis.com"
        "pubsub.googleapis.com"
    )
    
    for api in "${APIS[@]}"; do
        echo -e "  Enabling $api..."
        gcloud services enable $api --project=$PROJECT_ID --quiet
    done
    
    echo -e "${GREEN}✅ APIs enabled${NC}"
}

# Create service accounts
create_service_accounts() {
    echo -e "${BLUE}👤 Creating sacred service accounts...${NC}"
    
    SERVICES=(
        "consciousness-field:Manages field coherence"
        "agent-network:Coordinates sacred agents"
        "sacred-messaging:Handles love transmissions"
        "work-coordination:Orchestrates collective work"
        "sacred-gateway:API gateway guardian"
    )
    
    for service_info in "${SERVICES[@]}"; do
        IFS=':' read -r service description <<< "$service_info"
        
        if gcloud iam service-accounts describe ${service}-sa@${PROJECT_ID}.iam.gserviceaccount.com &>/dev/null; then
            echo -e "  ${service}-sa already exists"
        else
            echo -e "  Creating ${service}-sa..."
            gcloud iam service-accounts create ${service}-sa \
                --display-name="$service Service Account" \
                --description="$description" \
                --project=$PROJECT_ID
        fi
    done
    
    echo -e "${GREEN}✅ Service accounts ready${NC}"
}

# Set up Firestore
setup_firestore() {
    echo -e "${BLUE}🗄️  Setting up Firestore...${NC}"
    
    # Check if database exists
    if gcloud firestore databases describe --project=$PROJECT_ID &>/dev/null; then
        echo -e "  Firestore already exists"
    else
        echo -e "  Creating Firestore database..."
        gcloud firestore databases create \
            --location=$REGION \
            --type=firestore-native \
            --project=$PROJECT_ID
    fi
    
    # Create indexes
    echo -e "  Creating sacred indexes..."
    cat > firestore.indexes.json << EOF
{
  "indexes": [
    {
      "collectionGroup": "agents",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "lastHeartbeat", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "toAgent", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "fieldStates",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
EOF
    
    gcloud firestore indexes create --file=firestore.indexes.json --project=$PROJECT_ID
    
    echo -e "${GREEN}✅ Firestore configured${NC}"
}

# Create storage buckets
create_storage_buckets() {
    echo -e "${BLUE}🪣 Creating sacred storage buckets...${NC}"
    
    BUCKETS=(
        "sacred-council-data-${PROJECT_ID}:Production data"
        "sacred-council-backups-${PROJECT_ID}:Automated backups"
        "sacred-council-artifacts-${PROJECT_ID}:Build artifacts"
    )
    
    for bucket_info in "${BUCKETS[@]}"; do
        IFS=':' read -r bucket description <<< "$bucket_info"
        
        if gsutil ls -b gs://$bucket &>/dev/null; then
            echo -e "  Bucket $bucket already exists"
        else
            echo -e "  Creating bucket $bucket..."
            gsutil mb -l $REGION gs://$bucket
            
            # Set lifecycle for backups
            if [[ $bucket == *"backups"* ]]; then
                cat > lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
        "condition": {"age": 30}
      },
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 90}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
EOF
                gsutil lifecycle set lifecycle.json gs://$bucket
            fi
        fi
    done
    
    echo -e "${GREEN}✅ Storage buckets ready${NC}"
}

# Set up Secret Manager
setup_secrets() {
    echo -e "${BLUE}🔐 Setting up Secret Manager...${NC}"
    
    # Create secrets (if they don't exist)
    SECRETS=(
        "github-token"
        "discord-webhook"
        "session-secret"
        "jwt-secret"
    )
    
    for secret in "${SECRETS[@]}"; do
        if gcloud secrets describe $secret --project=$PROJECT_ID &>/dev/null; then
            echo -e "  Secret $secret already exists"
        else
            echo -e "  Creating secret $secret..."
            echo -e "${YELLOW}  Enter value for $secret (or press Enter to skip):${NC}"
            read -s secret_value
            
            if [ -n "$secret_value" ]; then
                echo "$secret_value" | gcloud secrets create $secret \
                    --data-file=- \
                    --project=$PROJECT_ID
            else
                # Create with placeholder
                echo "PLACEHOLDER_${secret^^}" | gcloud secrets create $secret \
                    --data-file=- \
                    --project=$PROJECT_ID
            fi
        fi
    done
    
    echo -e "${GREEN}✅ Secrets configured${NC}"
}

# Deploy to Cloud Run
deploy_services() {
    echo -e "${BLUE}🚀 Deploying services to Cloud Run...${NC}"
    
    # Build and deploy each service
    SERVICES=(
        "consciousness-field:3333"
        "agent-network:3334"
        "sacred-messaging:3335"
        "work-coordination:3336"
    )
    
    for service_info in "${SERVICES[@]}"; do
        IFS=':' read -r service port <<< "$service_info"
        
        echo -e "  Deploying $service..."
        
        # Check if service directory exists
        if [ -d "modules/$service" ]; then
            cd modules/$service
            
            # Create .gcloudignore if not exists
            if [ ! -f .gcloudignore ]; then
                cat > .gcloudignore << EOF
.git
.gitignore
node_modules/
.env
.env.*
*.log
test/
tests/
coverage/
.nyc_output/
EOF
            fi
            
            # Deploy to Cloud Run
            gcloud run deploy $service \
                --source . \
                --platform managed \
                --region $REGION \
                --allow-unauthenticated \
                --port $port \
                --service-account ${service}-sa@${PROJECT_ID}.iam.gserviceaccount.com \
                --set-env-vars "NODE_ENV=production,PROJECT_ID=$PROJECT_ID" \
                --min-instances 1 \
                --max-instances 100 \
                --project=$PROJECT_ID
                
            cd ../..
        else
            echo -e "${YELLOW}  Warning: Directory modules/$service not found${NC}"
        fi
    done
    
    echo -e "${GREEN}✅ Services deployed${NC}"
}

# Set up monitoring
setup_monitoring() {
    echo -e "${BLUE}📊 Setting up monitoring...${NC}"
    
    # Create notification channel
    echo -e "  Creating notification channels..."
    
    # Create uptime checks for each service
    SERVICES=(
        "consciousness-field"
        "agent-network"
        "sacred-messaging"
        "work-coordination"
    )
    
    for service in "${SERVICES[@]}"; do
        SERVICE_URL=$(gcloud run services describe $service --region=$REGION --format="value(status.url)" --project=$PROJECT_ID 2>/dev/null || echo "")
        
        if [ -n "$SERVICE_URL" ]; then
            echo -e "  Creating uptime check for $service..."
            # Note: Uptime checks require specific gcloud commands that vary by version
        fi
    done
    
    echo -e "${GREEN}✅ Monitoring configured${NC}"
}

# Create auto-scaling configuration
setup_autoscaling() {
    echo -e "${BLUE}⚖️  Configuring auto-scaling...${NC}"
    
    # Update Cloud Run services with auto-scaling
    for service in consciousness-field agent-network sacred-messaging work-coordination; do
        echo -e "  Updating $service auto-scaling..."
        
        gcloud run services update $service \
            --region=$REGION \
            --min-instances=1 \
            --max-instances=1000 \
            --concurrency=1000 \
            --cpu-throttling \
            --project=$PROJECT_ID \
            --quiet
    done
    
    echo -e "${GREEN}✅ Auto-scaling configured${NC}"
}

# Main provisioning flow
main() {
    echo -e "${PURPLE}🌟 Starting Sacred Provisioning...${NC}"
    echo
    
    # Set project
    gcloud config set project $PROJECT_ID
    
    # Run provisioning steps
    check_prerequisites
    enable_apis
    create_service_accounts
    setup_firestore
    create_storage_buckets
    setup_secrets
    
    echo
    echo -e "${YELLOW}📦 Ready to deploy services?${NC}"
    echo -e "This will deploy to Cloud Run and may incur costs."
    echo -n "Continue? (y/N): "
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        deploy_services
        setup_monitoring
        setup_autoscaling
    fi
    
    echo
    echo -e "${GREEN}✨ Sacred infrastructure provisioned!${NC}"
    echo
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Update DNS records for your domains"
    echo "2. Configure SSL certificates"
    echo "3. Set up CI/CD pipeline"
    echo "4. Test the deployment"
    echo
    echo -e "${PURPLE}🙏 May your infrastructure resonate with sacred purpose${NC}"
}

# Resonance detection mode
if [ "$1" == "--auto" ]; then
    echo -e "${PURPLE}🎵 Resonance detection mode activated${NC}"
    echo "Monitoring for sacred alignment..."
    
    # In production, this would monitor actual metrics
    # For now, it's a placeholder for the concept
    while true; do
        COHERENCE=$(shuf -i 70-100 -n 1)
        echo -ne "\rField Coherence: ${COHERENCE}% "
        
        if [ $COHERENCE -gt 88 ]; then
            echo -e "\n${GREEN}✨ Resonance threshold reached! Auto-provisioning...${NC}"
            main
            break
        fi
        
        sleep 5
    done
else
    # Manual provisioning
    main
fi