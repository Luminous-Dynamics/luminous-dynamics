#!/bin/bash
# Setup Service Account Key for Google Workspace

set -e

echo "🔑 Service Account Key Setup"
echo "==========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_ID="mycelix-network"
SERVICE_ACCOUNT="sacred-council-sa@mycelix-network.iam.gserviceaccount.com"
SECRET_NAME="gcp-service-account-key"
CREDS_DIR="$HOME/.sacred-credentials"

echo -e "${BLUE}📊 Current Status:${NC}"
echo "• Project: $PROJECT_ID"
echo "• Service Account: $SERVICE_ACCOUNT"
echo "• Authenticated as: $(gcloud auth list --filter=status:ACTIVE --format='value(account)')"
echo ""

# Create credentials directory
echo -e "${YELLOW}Creating secure credentials directory...${NC}"
mkdir -p "$CREDS_DIR"
chmod 700 "$CREDS_DIR"
echo -e "${GREEN}✅ Created $CREDS_DIR${NC}"

# Check if secret exists in Secret Manager
echo -e "\n${YELLOW}Checking Secret Manager...${NC}"
if gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID &>/dev/null; then
    echo -e "${GREEN}✅ Secret exists in Secret Manager${NC}"
    echo "Retrieving key..."
    
    # Retrieve from Secret Manager
    gcloud secrets versions access latest \
        --secret=$SECRET_NAME \
        --project=$PROJECT_ID \
        > "$CREDS_DIR/gcp-key.json"
    
    chmod 600 "$CREDS_DIR/gcp-key.json"
    echo -e "${GREEN}✅ Retrieved service account key${NC}"
else
    echo -e "${YELLOW}⚠️  Secret not found in Secret Manager${NC}"
    echo ""
    echo "Options:"
    echo "1. Create new service account key"
    echo "2. Upload existing key to Secret Manager"
    echo "3. Exit"
    echo ""
    echo -n "Choose option (1-3): "
    read -r CHOICE
    
    case $CHOICE in
        1)
            echo -e "\n${BLUE}Creating new service account key...${NC}"
            
            # Create new key
            gcloud iam service-accounts keys create "$CREDS_DIR/gcp-key.json" \
                --iam-account=$SERVICE_ACCOUNT \
                --project=$PROJECT_ID
            
            chmod 600 "$CREDS_DIR/gcp-key.json"
            echo -e "${GREEN}✅ Created new service account key${NC}"
            
            # Upload to Secret Manager
            echo -e "\n${BLUE}Uploading to Secret Manager...${NC}"
            gcloud secrets create $SECRET_NAME \
                --data-file="$CREDS_DIR/gcp-key.json" \
                --project=$PROJECT_ID \
                --replication-policy="automatic"
            
            echo -e "${GREEN}✅ Uploaded to Secret Manager${NC}"
            ;;
            
        2)
            echo -e "\n${YELLOW}Please provide path to existing key:${NC}"
            echo -n "Path: "
            read -r KEY_PATH
            
            if [ -f "$KEY_PATH" ]; then
                # Copy to credentials directory
                cp "$KEY_PATH" "$CREDS_DIR/gcp-key.json"
                chmod 600 "$CREDS_DIR/gcp-key.json"
                
                # Upload to Secret Manager
                echo -e "\n${BLUE}Uploading to Secret Manager...${NC}"
                gcloud secrets create $SECRET_NAME \
                    --data-file="$CREDS_DIR/gcp-key.json" \
                    --project=$PROJECT_ID \
                    --replication-policy="automatic"
                
                echo -e "${GREEN}✅ Uploaded to Secret Manager${NC}"
            else
                echo -e "${RED}❌ File not found: $KEY_PATH${NC}"
                exit 1
            fi
            ;;
            
        3)
            echo "Exiting..."
            exit 0
            ;;
            
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
fi

# Verify the key
echo -e "\n${BLUE}Verifying service account key...${NC}"
if [ -f "$CREDS_DIR/gcp-key.json" ]; then
    # Extract key info
    CLIENT_EMAIL=$(jq -r '.client_email' "$CREDS_DIR/gcp-key.json" 2>/dev/null)
    PROJECT=$(jq -r '.project_id' "$CREDS_DIR/gcp-key.json" 2>/dev/null)
    
    if [ "$CLIENT_EMAIL" = "$SERVICE_ACCOUNT" ]; then
        echo -e "${GREEN}✅ Key verified for: $CLIENT_EMAIL${NC}"
        echo -e "${GREEN}✅ Project: $PROJECT${NC}"
    else
        echo -e "${RED}❌ Key mismatch! Expected: $SERVICE_ACCOUNT, Got: $CLIENT_EMAIL${NC}"
    fi
fi

# Set environment variable
echo -e "\n${PURPLE}🎯 Setup Complete!${NC}"
echo ""
echo "Add to your shell profile (.bashrc or .zshrc):"
echo -e "${BLUE}export GOOGLE_APPLICATION_CREDENTIALS=\"$CREDS_DIR/gcp-key.json\"${NC}"
echo ""
echo "Or run now:"
echo -e "${BLUE}export GOOGLE_APPLICATION_CREDENTIALS=\"$CREDS_DIR/gcp-key.json\"${NC}"
echo ""

# Create convenience script
cat > set-gcp-auth.sh << EOF
#!/bin/bash
# Quick script to set GCP authentication
export GOOGLE_APPLICATION_CREDENTIALS="$CREDS_DIR/gcp-key.json"
echo "✅ GOOGLE_APPLICATION_CREDENTIALS set to: \$GOOGLE_APPLICATION_CREDENTIALS"
EOF

chmod +x set-gcp-auth.sh
echo -e "${GREEN}✅ Created set-gcp-auth.sh for quick environment setup${NC}"

echo -e "\n${GREEN}✨ Service account key ready for Google Workspace!${NC}"