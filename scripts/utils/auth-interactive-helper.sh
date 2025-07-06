#!/bin/bash
# Interactive Authentication Helper
# Provides links for manual auth completion

echo "🔐 Interactive Authentication Helper"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Function to handle Firebase auth
firebase_auth() {
    echo -e "${BLUE}🔥 Firebase Authentication${NC}"
    echo "================================"
    echo ""
    
    # Start Firebase login with no-localhost flag
    echo "Starting Firebase authentication..."
    echo ""
    
    # This will output the auth URL
    firebase login --no-localhost 2>&1 | tee /tmp/firebase-auth.log
    
    # Extract the URL from output
    AUTH_URL=$(grep -o 'https://[^[:space:]]*' /tmp/firebase-auth.log | head -1)
    
    if [ -n "$AUTH_URL" ]; then
        echo -e "\n${YELLOW}📋 COPY THIS LINK:${NC}"
        echo -e "${GREEN}$AUTH_URL${NC}"
        echo ""
        echo -e "${YELLOW}Instructions:${NC}"
        echo "1. Open the link above in your browser"
        echo "2. Authorize with your Google account"
        echo "3. Copy the authorization code"
        echo "4. Paste it here and press Enter"
        echo ""
        echo -n "Enter authorization code: "
        read -r AUTH_CODE
        
        # Complete authentication with the code
        echo "$AUTH_CODE" | firebase login --no-localhost
        
        echo -e "\n${GREEN}✅ Firebase authentication complete!${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not extract auth URL. Showing full output:${NC}"
        cat /tmp/firebase-auth.log
    fi
}

# Function to handle gcloud auth
gcloud_auth() {
    echo -e "\n${BLUE}☁️  Google Cloud Authentication${NC}"
    echo "===================================="
    echo ""
    
    # Start gcloud auth with no-launch-browser flag
    echo "Starting gcloud authentication..."
    echo ""
    
    # This will output the auth URL
    gcloud auth login --no-launch-browser 2>&1 | tee /tmp/gcloud-auth.log
    
    # Extract the URL
    AUTH_URL=$(grep -o 'https://accounts.google.com[^[:space:]]*' /tmp/gcloud-auth.log | head -1)
    
    if [ -n "$AUTH_URL" ]; then
        echo -e "\n${YELLOW}📋 COPY THIS LINK:${NC}"
        echo -e "${GREEN}$AUTH_URL${NC}"
        echo ""
        echo -e "${YELLOW}Instructions:${NC}"
        echo "1. Open the link above in your browser"
        echo "2. Authorize with your Google account"
        echo "3. Copy the authorization code"
        echo "4. Paste it here and press Enter"
        echo ""
        echo -n "Enter authorization code: "
        read -r AUTH_CODE
        
        # Complete authentication
        echo "$AUTH_CODE" | gcloud auth login --no-launch-browser
        
        echo -e "\n${GREEN}✅ Google Cloud authentication complete!${NC}"
    fi
}

# Function for Firebase CI token (alternative method)
firebase_ci_token() {
    echo -e "\n${BLUE}🔐 Firebase CI Token Method${NC}"
    echo "==============================="
    echo ""
    echo "Alternative: Generate a CI token for non-interactive use"
    echo ""
    
    # Generate CI token
    firebase login:ci --no-localhost 2>&1 | tee /tmp/firebase-ci.log
    
    # Extract URL
    AUTH_URL=$(grep -o 'https://[^[:space:]]*' /tmp/firebase-ci.log | head -1)
    
    if [ -n "$AUTH_URL" ]; then
        echo -e "\n${YELLOW}📋 COPY THIS LINK:${NC}"
        echo -e "${GREEN}$AUTH_URL${NC}"
        echo ""
        echo -e "${YELLOW}Instructions:${NC}"
        echo "1. Open the link above in your browser"
        echo "2. Authorize with your Google account"
        echo "3. Copy the authorization code"
        echo "4. Paste it here and press Enter"
        echo ""
        echo -n "Enter authorization code: "
        read -r AUTH_CODE
        
        # Complete token generation
        echo "$AUTH_CODE" | firebase login:ci --no-localhost
        
        # Extract token from output
        TOKEN=$(grep -o '[[:alnum:]_-]\{40,\}' /tmp/firebase-ci.log | tail -1)
        
        if [ -n "$TOKEN" ]; then
            echo -e "\n${GREEN}✅ CI Token generated!${NC}"
            echo -e "${YELLOW}Save this token securely:${NC}"
            echo -e "${PURPLE}$TOKEN${NC}"
            echo ""
            echo "To use this token:"
            echo "export FIREBASE_TOKEN=$TOKEN"
            echo "firebase deploy --token \$FIREBASE_TOKEN"
            
            # Save to secure file
            echo "$TOKEN" > ~/.firebase-ci-token
            chmod 600 ~/.firebase-ci-token
            echo -e "\n${GREEN}Token saved to: ~/.firebase-ci-token${NC}"
        fi
    fi
}

# Main menu
echo -e "${PURPLE}Choose authentication method:${NC}"
echo "1. Firebase Login"
echo "2. Google Cloud Login"
echo "3. Firebase CI Token (for automation)"
echo "4. All of the above"
echo ""
echo -n "Enter choice (1-4): "
read -r CHOICE

case $CHOICE in
    1)
        firebase_auth
        ;;
    2)
        gcloud_auth
        ;;
    3)
        firebase_ci_token
        ;;
    4)
        firebase_auth
        gcloud_auth
        firebase_ci_token
        ;;
    *)
        echo -e "${YELLOW}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}✨ Authentication helper complete!${NC}"