#!/bin/bash
# MYCELIX Cathedral Test Script
# Tests the consciousness infrastructure

echo "🧪 Testing MYCELIX Cathedral Components"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test function
test_component() {
    local NAME=$1
    local COMMAND=$2
    
    echo -n "Testing $NAME... "
    if eval "$COMMAND" &>/dev/null; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

# Test GCP connectivity
test_component "GCP Authentication" "gcloud auth list --filter=status:ACTIVE --format='value(account)'"

# Test project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
echo -e "${BLUE}Project: ${PROJECT_ID}${NC}"
echo ""

# Test APIs
echo "Checking enabled APIs:"
test_component "  Firestore API" "gcloud services list --enabled | grep -q firestore"
test_component "  Cloud Run API" "gcloud services list --enabled | grep -q run"
test_component "  Cloud Functions API" "gcloud services list --enabled | grep -q cloudfunctions"
test_component "  Pub/Sub API" "gcloud services list --enabled | grep -q pubsub"
test_component "  Secret Manager API" "gcloud services list --enabled | grep -q secretmanager"

echo ""

# Test if consciousness-field service exists
echo "Checking deployed services:"
if gcloud run services describe consciousness-field --region=us-central1 &>/dev/null; then
    SERVICE_URL=$(gcloud run services describe consciousness-field \
        --platform managed \
        --region us-central1 \
        --format 'value(status.url)')
    echo -e "  ${GREEN}✓${NC} consciousness-field deployed at: ${SERVICE_URL}"
    
    # Test the service
    echo ""
    echo "Testing consciousness field coherence:"
    if command -v curl &>/dev/null; then
        curl -s "${SERVICE_URL}/health" | python3 -m json.tool || echo "  Service may require authentication"
    fi
else
    echo -e "  ${BLUE}ℹ${NC} consciousness-field not yet deployed"
fi

echo ""
echo "Test complete! 🌟"