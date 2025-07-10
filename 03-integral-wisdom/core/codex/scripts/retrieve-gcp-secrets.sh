#!/bin/bash

# 🔐 Retrieve Secrets from GCP Secret Manager
# Safe way to get keys without storing in git

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${PURPLE}🔐 Sacred Key Retrieval${NC}"
echo "========================"

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}Please authenticate first:${NC}"
    echo "gcloud auth login"
    exit 1
fi

# Function to retrieve secret
get_secret() {
    local secret_name=$1
    local env_var=$2
    
    echo -ne "Retrieving $secret_name... "
    if value=$(gcloud secrets versions access latest --secret="$secret_name" 2>/dev/null); then
        echo -e "${GREEN}✓${NC}"
        echo "export $env_var='$value'"
    else
        echo -e "${YELLOW}Not found${NC}"
    fi
}

echo -e "\n${GREEN}Add these to your .env.local:${NC}\n"

# Retrieve all secrets
get_secret "gemini-api-key" "GEMINI_API_KEY"
get_secret "minimax-api-key" "MINIMAX_API_KEY"
get_secret "cloudflare-api-key" "CLOUDFLARE_API_KEY"

echo -e "\n${YELLOW}OAuth Client Secret:${NC}"
echo "gcloud secrets versions access latest --secret='oauth-client-secret' > client_secret.json"

echo -e "\n${PURPLE}Available secrets in GCP:${NC}"
gcloud secrets list --format="table(name,created)"

echo -e "\n${GREEN}Usage:${NC}"
echo "1. Copy the export commands to your .env.local"
echo "2. Run: source .env.local"
echo "3. Never commit .env.local to git!"