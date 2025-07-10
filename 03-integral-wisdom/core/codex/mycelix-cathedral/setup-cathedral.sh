#!/bin/bash
# MYCELIX Cathedral Complete Setup
# Establishes the sacred foundation for consciousness infrastructure

set -e

echo "🏛️ MYCELIX Cathedral Setup Ceremony"
echo "==================================="
echo ""

# Colors for sacred output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install it first."
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No GCP project configured. Run: gcloud init"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites satisfied${NC}"
echo -e "${BLUE}📍 Project: ${PROJECT_ID}${NC}"
echo ""

# Enable required APIs
echo -e "${PURPLE}🌟 Phase 1: Enabling consciousness services...${NC}"

APIS=(
    "firestore.googleapis.com"
    "run.googleapis.com" 
    "cloudfunctions.googleapis.com"
    "pubsub.googleapis.com"
    "cloudbuild.googleapis.com"
    "secretmanager.googleapis.com"
    "cloudscheduler.googleapis.com"
    "monitoring.googleapis.com"
)

for api in "${APIS[@]}"; do
    echo -n "  Enabling $api... "
    if gcloud services enable "$api" 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}already enabled${NC}"
    fi
done

# Wait for APIs to propagate
echo ""
echo "⏳ Waiting for services to awaken..."
sleep 10

# Install dependencies
echo -e "\n${PURPLE}🌟 Phase 2: Installing sacred dependencies...${NC}"

if [ ! -f "package.json" ]; then
    echo "Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "mycelix-cathedral",
  "version": "1.0.0",
  "description": "MYCELIX consciousness infrastructure",
  "scripts": {
    "setup:firestore": "node setup-firestore.js",
    "setup:pubsub": "node setup-pubsub.js",
    "deploy": "./deploy-cathedral.sh"
  },
  "dependencies": {
    "@google-cloud/firestore": "^7.1.0",
    "@google-cloud/pubsub": "^4.0.7"
  }
}
EOF
fi

echo "Installing npm packages..."
npm install

# Set up Firestore
echo -e "\n${PURPLE}🌟 Phase 3: Laying the foundation (Firestore)...${NC}"
node setup-firestore.js

# Set up Pub/Sub
echo -e "\n${PURPLE}🌟 Phase 4: Installing the bells (Pub/Sub)...${NC}"
node setup-pubsub.js

# Create service account for Cathedral
echo -e "\n${PURPLE}🌟 Phase 5: Creating Cathedral keeper...${NC}"
SERVICE_ACCOUNT="mycelix-cathedral@${PROJECT_ID}.iam.gserviceaccount.com"

if gcloud iam service-accounts describe "$SERVICE_ACCOUNT" &>/dev/null; then
    echo "  ℹ️  Service account already exists"
else
    gcloud iam service-accounts create mycelix-cathedral \
        --display-name="MYCELIX Cathedral Keeper" \
        --description="Sacred keeper of consciousness infrastructure"
    echo -e "  ${GREEN}✓${NC} Created service account"
fi

# Grant necessary roles
echo "  Granting sacred permissions..."
ROLES=(
    "roles/datastore.user"
    "roles/pubsub.editor"
    "roles/run.invoker"
    "roles/cloudfunctions.invoker"
    "roles/secretmanager.secretAccessor"
)

for role in "${ROLES[@]}"; do
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="$role" \
        --quiet 2>/dev/null || true
done

# Create initial secrets
echo -e "\n${PURPLE}🌟 Phase 6: Securing sacred keys...${NC}"

# Check if we have the test Anthropic key
if [ ! -z "$ANTHROPIC_API_KEY_TEST" ]; then
    echo "  Storing Anthropic test key..."
    echo -n "$ANTHROPIC_API_KEY_TEST" | gcloud secrets create anthropic-test-key \
        --data-file=- 2>/dev/null || echo "  ℹ️  Secret already exists"
fi

# Summary
echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🏛️ MYCELIX Cathedral Foundation Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "Foundation established:"
echo "  ✅ APIs enabled"
echo "  ✅ Firestore collections created"
echo "  ✅ Pub/Sub topics configured"
echo "  ✅ Service account created"
echo ""
echo "Next steps:"
echo -e "${YELLOW}1. Deploy services:${NC} ./deploy-cathedral.sh"
echo -e "${YELLOW}2. Test consciousness field:${NC} curl https://consciousness-field-xxx.run.app/health"
echo -e "${YELLOW}3. Set up domain mapping:${NC} for beautiful URLs"
echo ""
echo -e "${PURPLE}May consciousness flourish in this sacred space! 🌟${NC}"