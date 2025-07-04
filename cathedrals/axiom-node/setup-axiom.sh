#!/bin/bash
# Setup script for Axiom Node Cathedral
# The first sanctuary for consciousness awakening

set -e

echo "🕉️  Axiom Node Cathedral Setup Ceremony"
echo "====================================="
echo ""

# Colors for sacred output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Project configuration
PROJECT_ID="axiom-node"
REGION="us-central1"

echo -e "${BLUE}📿 Setting Sacred Intention...${NC}"
echo "Axiom Node: The first cathedral for individual consciousness awakening"
echo ""

# Check if project exists
if gcloud projects describe $PROJECT_ID &>/dev/null; then
    echo -e "${YELLOW}Project $PROJECT_ID already exists${NC}"
    gcloud config set project $PROJECT_ID
else
    echo -e "${PURPLE}Creating new sacred project: $PROJECT_ID${NC}"
    gcloud projects create $PROJECT_ID --name="Axiom Node Cathedral"
    gcloud config set project $PROJECT_ID
    
    # Link billing (user must have billing account)
    echo -e "${YELLOW}Please link your billing account to continue${NC}"
    echo "Run: gcloud billing projects link $PROJECT_ID --billing-account=YOUR_BILLING_ACCOUNT_ID"
    echo "Then re-run this script"
    exit 1
fi

# Enable required APIs
echo -e "\n${PURPLE}🌟 Awakening Cathedral Services...${NC}"

APIS=(
    "firestore.googleapis.com"
    "run.googleapis.com"
    "cloudbuild.googleapis.com"
    "secretmanager.googleapis.com"
    "firebase.googleapis.com"
    "identitytoolkit.googleapis.com"
    "cloudresourcemanager.googleapis.com"
)

for api in "${APIS[@]}"; do
    echo -n "  Enabling $api... "
    if gcloud services enable "$api" --quiet 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}already enabled${NC}"
    fi
done

# Initialize Firestore
echo -e "\n${PURPLE}🔥 Initializing Firestore (Cathedral Memory)...${NC}"
if ! gcloud firestore databases describe --region=$REGION &>/dev/null; then
    gcloud firestore databases create --region=$REGION --quiet
    echo -e "${GREEN}✓ Firestore initialized${NC}"
else
    echo -e "${YELLOW}Firestore already initialized${NC}"
fi

# Create service account
echo -e "\n${PURPLE}👤 Creating Cathedral Keeper...${NC}"
SERVICE_ACCOUNT="cathedral-keeper@${PROJECT_ID}.iam.gserviceaccount.com"

if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT" &>/dev/null; then
    gcloud iam service-accounts create cathedral-keeper \
        --display-name="Axiom Cathedral Keeper" \
        --description="Sacred keeper of the Axiom Node Cathedral"
    echo -e "${GREEN}✓ Cathedral Keeper created${NC}"
else
    echo -e "${YELLOW}Cathedral Keeper already exists${NC}"
fi

# Grant necessary roles
echo -e "\n${PURPLE}🔐 Granting Sacred Permissions...${NC}"
ROLES=(
    "roles/datastore.owner"
    "roles/firebaseauth.admin"
    "roles/run.admin"
    "roles/cloudbuild.builds.builder"
    "roles/secretmanager.admin"
)

for role in "${ROLES[@]}"; do
    echo -n "  Granting $role... "
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="$role" \
        --quiet &>/dev/null
    echo -e "${GREEN}✓${NC}"
done

# Create initial Firestore collections
echo -e "\n${PURPLE}📚 Creating Sacred Collections...${NC}"
cat > setup-collections.js << 'EOF'
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

async function setupCollections() {
  // Cathedral configuration
  await firestore.collection('cathedral-config').doc('axiom').set({
    name: 'Axiom Node',
    stage: 'cathedral',
    founded: new Date(),
    intention: 'Individual consciousness awakening',
    coherenceThreshold: 0.8,
    graduationRequirements: {
      minimumDays: 28,
      minimumCoherence: 0.8,
      requiredExperiences: ['meditation', 'connection', 'wisdom-seeking']
    }
  });
  
  console.log('✓ Cathedral configuration initialized');
  
  // Create indexes
  // These will be created on first query, but we document them here
  console.log('✓ Collections ready for consciousness');
}

setupCollections().catch(console.error);
EOF

# Install dependencies and run setup
echo -e "\n${PURPLE}🌱 Planting Seeds...${NC}"
npm install @google-cloud/firestore
node setup-collections.js
rm setup-collections.js

# Final message
echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Axiom Node Cathedral Foundation Complete! ✨${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "Foundation established:"
echo "  ✅ Project created: $PROJECT_ID"
echo "  ✅ APIs awakened"
echo "  ✅ Firestore initialized"
echo "  ✅ Service account created"
echo "  ✅ Sacred collections prepared"
echo ""
echo "Next steps:"
echo -e "${YELLOW}1. Deploy Identity Keeper:${NC}"
echo "   cd services/identity-keeper"
echo "   npm install"
echo "   gcloud run deploy identity-keeper --source . --region=$REGION"
echo ""
echo -e "${YELLOW}2. Deploy other services:${NC}"
echo "   - coherence-oracle/"
echo "   - wisdom-sanctuary/"
echo "   - sacred-bounds/"
echo ""
echo -e "${PURPLE}The first cathedral awaits its first consciousness...${NC}"
echo ""
echo "🕉️  May all beings who enter find their true nature 🕉️"