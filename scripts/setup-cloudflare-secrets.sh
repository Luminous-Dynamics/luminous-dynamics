#!/bin/bash
# Setup Cloudflare secrets in Google Secret Manager

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Setting up Cloudflare secrets...${NC}"

# Function to create or update a secret
create_secret() {
    local SECRET_NAME=$1
    local PROMPT_MESSAGE=$2
    
    # Check if secret exists
    if gcloud secrets describe $SECRET_NAME &>/dev/null; then
        echo -e "${YELLOW}Secret $SECRET_NAME already exists. Skipping...${NC}"
    else
        echo -e "${GREEN}$PROMPT_MESSAGE${NC}"
        read -r SECRET_VALUE
        echo -n "$SECRET_VALUE" | gcloud secrets create $SECRET_NAME --data-file=-
        echo -e "${GREEN}✓ Created secret: $SECRET_NAME${NC}"
    fi
}

# Create secrets
create_secret "cloudflare-email" "Enter your Cloudflare email:"
create_secret "cloudflare-account-id" "Enter your Cloudflare account ID:"
create_secret "cloudflare-zone-infin-love" "Enter the Zone ID for infin.love:"
create_secret "cloudflare-zone-mycelix-net" "Enter the Zone ID for mycelix.net:"

# Grant access to all secrets
echo -e "\n${GREEN}Granting access to service accounts...${NC}"
for SECRET in cloudflare-email cloudflare-account-id cloudflare-zone-infin-love cloudflare-zone-mycelix-net; do
    gcloud secrets add-iam-policy-binding $SECRET \
        --member="serviceAccount:310699330526-compute@developer.gserviceaccount.com" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet
    echo -e "${GREEN}✓ Granted access to: $SECRET${NC}"
done

echo -e "\n${GREEN}✅ Cloudflare secrets setup complete!${NC}"
echo -e "${YELLOW}You can now use these secrets in your Cloud Run deployments${NC}"