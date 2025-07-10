#!/bin/bash
# Cloudflare DNS Setup for Sacred Council Hub

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required variables
if [ -z "$CLOUDFLARE_API_KEY" ] || [ -z "$CLOUDFLARE_EMAIL" ]; then
    echo -e "${RED}Error: CLOUDFLARE_API_KEY and CLOUDFLARE_EMAIL must be set${NC}"
    echo "Either set them as environment variables or create a .env file"
    exit 1
fi

# Function to get zone ID
get_zone_id() {
    local domain=$1
    curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
        -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
        -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
        -H "Content-Type: application/json" | jq -r '.result[0].id'
}

# Function to create DNS record
create_dns_record() {
    local zone_id=$1
    local name=$2
    local content=$3
    local type=${4:-CNAME}
    local proxied=${5:-true}
    
    echo -e "${YELLOW}Creating DNS record: $name -> $content${NC}"
    
    curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" \
        -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
        -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
        -H "Content-Type: application/json" \
        --data "{
            \"type\":\"$type\",
            \"name\":\"$name\",
            \"content\":\"$content\",
            \"ttl\":1,
            \"proxied\":$proxied
        }" | jq
}

# Main setup
echo -e "${GREEN}🌟 Cloudflare DNS Setup${NC}"

# Setup for infin.love
if [ -n "$CLOUDFLARE_ZONE_ID_INFIN_LOVE" ]; then
    echo -e "\n${GREEN}Setting up infin.love${NC}"
    ZONE_ID=$CLOUDFLARE_ZONE_ID_INFIN_LOVE
else
    echo -e "\n${GREEN}Getting zone ID for infin.love${NC}"
    ZONE_ID=$(get_zone_id "infin.love")
    echo "Zone ID: $ZONE_ID"
fi

# Create DNS records for infin.love
create_dns_record $ZONE_ID "@" "infin-love-310699330526.us-central1.run.app" "CNAME"
create_dns_record $ZONE_ID "www" "infin-love-310699330526.us-central1.run.app" "CNAME"
create_dns_record $ZONE_ID "api" "sacred-council-api-310699330526.us-central1.run.app" "CNAME"

# Setup for mycelix.net
if [ -n "$CLOUDFLARE_ZONE_ID_MYCELIX_NET" ]; then
    echo -e "\n${GREEN}Setting up mycelix.net${NC}"
    ZONE_ID=$CLOUDFLARE_ZONE_ID_MYCELIX_NET
else
    echo -e "\n${GREEN}Getting zone ID for mycelix.net${NC}"
    ZONE_ID=$(get_zone_id "mycelix.net")
    echo "Zone ID: $ZONE_ID"
fi

# Create DNS records for mycelix.net
create_dns_record $ZONE_ID "sacred" "sacred-council-api-310699330526.us-central1.run.app" "CNAME"
create_dns_record $ZONE_ID "consciousness" "consciousness-field-310699330526.us-central1.run.app" "CNAME"

echo -e "\n${GREEN}✅ Cloudflare DNS setup complete!${NC}"
echo -e "${YELLOW}Note: It may take a few minutes for DNS changes to propagate${NC}"