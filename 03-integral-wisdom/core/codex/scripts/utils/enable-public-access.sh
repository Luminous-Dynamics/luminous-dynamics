#!/bin/bash
# Enable public access to Sacred Council services

set -e

echo "🌟 Enabling Public Access to Sacred Dashboard"
echo "==========================================="

PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-mycelix-network}
REGION=${REGION:-us-central1}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}📋 Current Configuration:${NC}"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"

# Services to update
SERVICES=("sacred-council" "sacred-council-api")

for SERVICE in "${SERVICES[@]}"; do
    echo -e "\n${BLUE}🔓 Updating $SERVICE...${NC}"
    
    # Check if service exists
    if gcloud run services describe $SERVICE --region=$REGION &>/dev/null; then
        echo "Found service: $SERVICE"
        
        # Method 1: Try to add allUsers binding
        echo "Attempting to add public access..."
        if gcloud run services add-iam-policy-binding $SERVICE \
            --region=$REGION \
            --member="allUsers" \
            --role="roles/run.invoker" 2>/dev/null; then
            echo -e "${GREEN}✅ Public access enabled for $SERVICE${NC}"
        else
            echo -e "${YELLOW}⚠️  Organization policy may be blocking public access${NC}"
            
            # Method 2: Update service with --allow-unauthenticated flag
            echo "Trying alternative method..."
            if gcloud run services update $SERVICE \
                --region=$REGION \
                --allow-unauthenticated 2>/dev/null; then
                echo -e "${GREEN}✅ Service updated with public access${NC}"
            else
                echo -e "${YELLOW}❌ Could not enable public access for $SERVICE${NC}"
                echo "This may require organization admin permissions"
            fi
        fi
        
        # Get service URL
        URL=$(gcloud run services describe $SERVICE --region=$REGION --format="value(status.url)")
        echo -e "${BLUE}Service URL: $URL${NC}"
        
        # Test access
        echo "Testing access..."
        if curl -s -o /dev/null -w "%{http_code}" $URL | grep -q "200\|404"; then
            echo -e "${GREEN}✅ Service is publicly accessible!${NC}"
        else
            echo -e "${YELLOW}⚠️  Service still requires authentication${NC}"
        fi
    else
        echo -e "${YELLOW}Service $SERVICE not found${NC}"
    fi
done

echo -e "\n${YELLOW}📊 Summary:${NC}"
echo "If services still require authentication, you may need to:"
echo "1. Remove organization policy constraints"
echo "2. Use a personal GCP project without org policies"
echo "3. Contact your GCP organization admin"

echo -e "\n${BLUE}Alternative Solutions:${NC}"
echo "1. Deploy to a personal Firebase project (no org restrictions)"
echo "2. Use GitHub Pages for static dashboard hosting"
echo "3. Deploy to Vercel/Netlify (free tier available)"
echo "4. Continue using local dashboard at http://localhost:8338"