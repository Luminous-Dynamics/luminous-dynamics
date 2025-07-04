#!/bin/bash
# Test Cloudflare API connection using secrets from Google Secret Manager

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Testing Cloudflare API connection...${NC}"

# Get secrets from Google Secret Manager
CLOUDFLARE_API_KEY=$(gcloud secrets versions access latest --secret=cloudflare-api-key 2>/dev/null || echo "")
CLOUDFLARE_EMAIL=$(gcloud secrets versions access latest --secret=cloudflare-email 2>/dev/null || echo "")

if [ -z "$CLOUDFLARE_API_KEY" ]; then
    echo -e "${RED}Error: cloudflare-api-key secret not found${NC}"
    exit 1
fi

if [ -z "$CLOUDFLARE_EMAIL" ]; then
    echo -e "${YELLOW}Warning: cloudflare-email secret not found. Enter your Cloudflare email:${NC}"
    read -r CLOUDFLARE_EMAIL
fi

# Test API connection by listing zones
echo -e "\n${YELLOW}Fetching your Cloudflare zones...${NC}"
RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones" \
    -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
    -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
    -H "Content-Type: application/json")

# Check if successful
SUCCESS=$(echo $RESPONSE | jq -r '.success')

if [ "$SUCCESS" = "true" ]; then
    echo -e "${GREEN}✅ Successfully connected to Cloudflare API!${NC}"
    echo -e "\n${GREEN}Your zones:${NC}"
    echo $RESPONSE | jq -r '.result[] | "\(.name) - Zone ID: \(.id)"'
    
    # Save zone IDs for easy reference
    echo -e "\n${YELLOW}To save these zone IDs as secrets, run:${NC}"
    echo $RESPONSE | jq -r '.result[] | "echo -n \"\(.id)\" | gcloud secrets create cloudflare-zone-\(.name | gsub("\\."; "-")) --data-file=-"'
else
    echo -e "${RED}❌ Failed to connect to Cloudflare API${NC}"
    echo -e "${RED}Error:${NC}"
    echo $RESPONSE | jq -r '.errors'
fi