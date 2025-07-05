#!/bin/bash
# Enable Service Account Key Creation
# This modifies the organization policy to allow key creation

echo "🔓 Service Account Key Policy Management"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
ORG_ID="1024050524495"
PROJECT_ID="mycelix-network"
SERVICE_ACCOUNT="sacred-council-sa@mycelix-network.iam.gserviceaccount.com"

echo -e "${BLUE}📊 Current Status:${NC}"
echo "• Organization: evolvingresonantcocreationism.com"
echo "• Organization ID: $ORG_ID"
echo "• Policy: iam.disableServiceAccountKeyCreation"
echo "• Status: ENFORCED (blocking key creation)"
echo ""

echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "• This policy exists for security reasons"
echo "• Disabling it allows any project to create service account keys"
echo "• Consider using alternatives like Workload Identity"
echo ""

echo -e "${PURPLE}Options:${NC}"
echo "1. Disable policy for entire organization (less secure)"
echo "2. Create exception for specific project (recommended)"
echo "3. Temporarily disable, create key, re-enable (best)"
echo "4. Exit without changes"
echo ""
echo -n "Choose option (1-4): "
read -r CHOICE

case $CHOICE in
    1)
        echo -e "\n${YELLOW}Disabling policy organization-wide...${NC}"
        
        # Create policy file to disable
        cat > disable-key-policy.yaml << EOF
name: organizations/$ORG_ID/policies/iam.disableServiceAccountKeyCreation
spec:
  rules:
  - enforce: false
EOF
        
        # Apply the policy
        gcloud org-policies set-policy disable-key-policy.yaml
        
        echo -e "${GREEN}✅ Policy disabled organization-wide${NC}"
        echo -e "${RED}⚠️  This is less secure - consider re-enabling after creating keys${NC}"
        ;;
        
    2)
        echo -e "\n${YELLOW}Creating project exception...${NC}"
        
        # Create policy with project exception
        cat > exception-key-policy.yaml << EOF
name: organizations/$ORG_ID/policies/iam.disableServiceAccountKeyCreation
spec:
  rules:
  - enforce: true
    condition:
      expression: "resource.project != '$PROJECT_ID'"
      title: "Allow key creation for mycelix-network"
      description: "Exception for sacred technology project"
  - enforce: false
    condition:
      expression: "resource.project == '$PROJECT_ID'"
EOF
        
        # Apply the policy
        gcloud org-policies set-policy exception-key-policy.yaml
        
        echo -e "${GREEN}✅ Exception created for project: $PROJECT_ID${NC}"
        ;;
        
    3)
        echo -e "\n${BLUE}Temporary disable approach:${NC}"
        echo ""
        echo "This will:"
        echo "1. Temporarily disable the policy"
        echo "2. Create a service account key"
        echo "3. Re-enable the policy"
        echo ""
        echo -n "Proceed? (y/n): "
        read -r CONFIRM
        
        if [ "$CONFIRM" = "y" ]; then
            echo -e "\n${YELLOW}Step 1: Disabling policy temporarily...${NC}"
            
            # Save current policy
            gcloud org-policies describe constraints/iam.disableServiceAccountKeyCreation \
                --organization=$ORG_ID --format=yaml > original-policy.yaml
            
            # Disable policy
            cat > temp-disable-policy.yaml << EOF
name: organizations/$ORG_ID/policies/iam.disableServiceAccountKeyCreation
spec:
  rules:
  - enforce: false
EOF
            
            gcloud org-policies set-policy temp-disable-policy.yaml
            echo -e "${GREEN}✅ Policy temporarily disabled${NC}"
            
            # Wait for propagation
            echo -e "${YELLOW}Waiting 10 seconds for policy to propagate...${NC}"
            sleep 10
            
            echo -e "\n${YELLOW}Step 2: Creating service account key...${NC}"
            
            # Create the key
            KEY_FILE="$HOME/.sacred-credentials/gcp-key.json"
            mkdir -p "$HOME/.sacred-credentials"
            
            if gcloud iam service-accounts keys create "$KEY_FILE" \
                --iam-account=$SERVICE_ACCOUNT \
                --project=$PROJECT_ID; then
                
                chmod 600 "$KEY_FILE"
                echo -e "${GREEN}✅ Service account key created: $KEY_FILE${NC}"
                
                # Upload to Secret Manager
                echo -e "\n${YELLOW}Uploading to Secret Manager...${NC}"
                if gcloud secrets create gcp-service-account-key \
                    --data-file="$KEY_FILE" \
                    --project=$PROJECT_ID \
                    --replication-policy="automatic" 2>/dev/null || \
                   gcloud secrets versions add gcp-service-account-key \
                    --data-file="$KEY_FILE" \
                    --project=$PROJECT_ID; then
                    echo -e "${GREEN}✅ Key stored in Secret Manager${NC}"
                fi
            else
                echo -e "${RED}❌ Failed to create key${NC}"
            fi
            
            echo -e "\n${YELLOW}Step 3: Re-enabling policy...${NC}"
            
            # Re-enable original policy
            gcloud org-policies set-policy original-policy.yaml
            echo -e "${GREEN}✅ Policy re-enabled${NC}"
            
            # Clean up
            rm -f temp-disable-policy.yaml original-policy.yaml
            
            echo -e "\n${GREEN}✨ Process complete!${NC}"
            echo "Key location: $KEY_FILE"
            echo "Secret Manager: gcp-service-account-key"
        else
            echo "Cancelled"
        fi
        ;;
        
    4)
        echo "No changes made"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "\n${BLUE}📋 Next Steps:${NC}"
echo "1. Export environment variable:"
echo "   export GOOGLE_APPLICATION_CREDENTIALS=\"$HOME/.sacred-credentials/gcp-key.json\""
echo ""
echo "2. Test the key:"
echo "   gcloud auth activate-service-account --key-file=\"$KEY_FILE\""
echo ""
echo "3. Use with Google Workspace APIs"

# Create helper script
cat > test-service-account.sh << 'EOF'
#!/bin/bash
# Test service account authentication

KEY_FILE="$HOME/.sacred-credentials/gcp-key.json"

if [ -f "$KEY_FILE" ]; then
    echo "Testing service account authentication..."
    export GOOGLE_APPLICATION_CREDENTIALS="$KEY_FILE"
    
    # Test with gcloud
    gcloud auth activate-service-account --key-file="$KEY_FILE"
    gcloud auth list
    
    echo "✅ Service account ready for use!"
else
    echo "❌ Key file not found: $KEY_FILE"
fi
EOF

chmod +x test-service-account.sh
echo -e "\n${GREEN}✅ Created test-service-account.sh${NC}"