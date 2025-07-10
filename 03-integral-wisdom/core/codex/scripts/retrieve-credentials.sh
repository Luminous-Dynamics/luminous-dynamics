#!/bin/bash

# 🔐 Secure Credential Retrieval Script
# Retrieves credentials from GCP Secret Manager and sets up environment

set -e

echo "🔐 Sacred Credential Retrieval System"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with gcloud${NC}"
    echo "Please run: gcloud auth login"
    exit 1
fi

# Function to retrieve secret
retrieve_secret() {
    local secret_name=$1
    local output_file=$2
    
    echo -e "${YELLOW}📥 Retrieving ${secret_name}...${NC}"
    
    if gcloud secrets versions access latest --secret="${secret_name}" > "${output_file}" 2>/dev/null; then
        echo -e "${GREEN}✅ Retrieved ${secret_name}${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to retrieve ${secret_name}${NC}"
        return 1
    fi
}

# Create credentials directory
CREDS_DIR="$HOME/.sacred-credentials"
mkdir -p "$CREDS_DIR"
chmod 700 "$CREDS_DIR"

# Retrieve GCP service account key
if retrieve_secret "gcp-service-account-key" "$CREDS_DIR/gcp-key.json"; then
    chmod 600 "$CREDS_DIR/gcp-key.json"
    export GOOGLE_APPLICATION_CREDENTIALS="$CREDS_DIR/gcp-key.json"
    echo -e "${GREEN}✅ Set GOOGLE_APPLICATION_CREDENTIALS${NC}"
fi

# Retrieve Firebase token
if retrieve_secret "firebase-ci-token" "$CREDS_DIR/firebase-token"; then
    chmod 600 "$CREDS_DIR/firebase-token"
    export FIREBASE_TOKEN=$(cat "$CREDS_DIR/firebase-token")
    echo -e "${GREEN}✅ Set FIREBASE_TOKEN${NC}"
fi

# Create environment file for future sessions
ENV_FILE="$HOME/.sacred-env"
cat > "$ENV_FILE" << EOF
# Sacred Credentials Environment
export GOOGLE_APPLICATION_CREDENTIALS="$CREDS_DIR/gcp-key.json"
export FIREBASE_TOKEN=\$(cat "$CREDS_DIR/firebase-token" 2>/dev/null)
export GCP_PROJECT_ID="mycelix-network"
export GCP_LOCATION="us-central1"
EOF

chmod 600 "$ENV_FILE"

echo ""
echo -e "${GREEN}🎉 Credentials retrieved successfully!${NC}"
echo ""
echo "To use in future sessions, run:"
echo -e "${YELLOW}source ~/.sacred-env${NC}"
echo ""
echo "Available credentials:"
ls -la "$CREDS_DIR"

# Test the credentials
echo ""
echo "Testing credentials..."
echo -e "${YELLOW}🔵 GCP:${NC}"
gcloud config get-value project || echo "GCP not configured"

echo -e "${YELLOW}🔥 Firebase:${NC}"
if [ -n "$FIREBASE_TOKEN" ]; then
    npx firebase projects:list --token "$FIREBASE_TOKEN" 2>/dev/null | head -5 || echo "Firebase token may need refresh"
else
    echo "No Firebase token found"
fi