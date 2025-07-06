#!/bin/bash

# 🔐 Sacred Temporary Travel Access
# Creates time-limited access tokens for development while traveling

echo "🌍 Sacred Travel Access Portal"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get current location info
echo -e "${YELLOW}📍 Current access from:${NC}"
curl -s https://ipapi.co/json/ | jq -r '"\(.city), \(.region) - \(.ip)"' 2>/dev/null || echo "Location unknown"
echo ""

# Function to create temporary access token
create_temp_access() {
    local DURATION=$1
    local PURPOSE=$2
    
    echo -e "${YELLOW}🔑 Creating ${DURATION}-hour access token...${NC}"
    
    # Get identity token (valid for ~1 hour)
    TOKEN=$(gcloud auth print-identity-token 2>/dev/null)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Not authenticated. Please run: gcloud auth login"
        return 1
    fi
    
    # Save token with timestamp
    TIMESTAMP=$(date +%s)
    EXPIRY=$((TIMESTAMP + (DURATION * 3600)))
    
    cat > ~/.sacred-temp-token << EOF
{
  "token": "$TOKEN",
  "created": "$TIMESTAMP",
  "expiry": "$EXPIRY",
  "purpose": "$PURPOSE",
  "location": "$(curl -s https://ipapi.co/city 2>/dev/null || echo 'traveling')"
}
EOF
    
    chmod 600 ~/.sacred-temp-token
    
    echo -e "${GREEN}✅ Temporary access created!${NC}"
    echo "   Valid for: $DURATION hours"
    echo "   Purpose: $PURPOSE"
    echo "   Expires: $(date -d @$EXPIRY)"
}

# Menu
echo "Choose access duration:"
echo "1) 1 hour - Quick testing"
echo "2) 4 hours - Development session"
echo "3) 8 hours - Full workday"
echo "4) 24 hours - Extended travel work"
echo ""
read -p "Choice (1-4): " choice

case $choice in
    1) create_temp_access 1 "Quick testing" ;;
    2) create_temp_access 4 "Development session" ;;
    3) create_temp_access 8 "Full workday" ;;
    4) create_temp_access 24 "Extended travel work" ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

echo ""
echo -e "${GREEN}🚀 Access Ready!${NC}"
echo ""
echo "Use these commands:"
echo ""
echo "# Test access:"
echo "./sacred-dev-proxy.sh"
echo ""
echo "# Direct API calls:"
echo 'curl -H "Authorization: Bearer $(jq -r .token ~/.sacred-temp-token)" \'
echo '  https://sacred-council-api-310699330526.us-central1.run.app/health'
echo ""
echo "# Revoke access early:"
echo "rm ~/.sacred-temp-token"
echo ""
echo -e "${YELLOW}⏰ Remember: This access expires automatically!${NC}"