#!/bin/bash
# 🔐 Firebase Authentication Helper for WSL

echo "🔐 Firebase Authentication for WSL"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}Firebase auth has expired. Choose authentication method:${NC}"
echo ""
echo "1) Interactive login (opens browser)"
echo "2) CI token (for automation)"
echo "3) Check current status"
echo ""

read -p "Choice (1-3): " choice

case $choice in
  1)
    echo -e "\n${BLUE}Starting interactive login...${NC}"
    echo "This will open a browser window for authentication."
    echo ""
    npx firebase login --no-localhost
    ;;
    
  2)
    echo -e "\n${BLUE}Generating CI token...${NC}"
    echo "This will open a browser for one-time authentication."
    echo "Save the token that appears!"
    echo ""
    npx firebase login:ci --no-localhost
    echo ""
    echo -e "${YELLOW}To use the token:${NC}"
    echo "export FIREBASE_TOKEN='your-token-here'"
    echo "OR"
    echo "firebase deploy --token 'your-token-here'"
    ;;
    
  3)
    echo -e "\n${BLUE}Checking authentication status...${NC}"
    npx firebase projects:list 2>&1 | head -5
    ;;
    
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}✅ Done!${NC}"
echo ""
echo "Next steps:"
echo "- To deploy: firebase deploy --only hosting"
echo "- To add domain: Go to Firebase Console → Hosting → Add custom domain"
echo "- Console: https://console.firebase.google.com/project/mycelix-network/hosting"