#!/bin/bash
# Complete Authentication Setup

echo "🔐 Authentication Setup Helper"
echo "============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Check current auth status
echo -e "${BLUE}📊 Current Authentication Status:${NC}"
echo ""

# Check gcloud
echo -n "Google Cloud: "
if gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q .; then
    ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
    echo -e "${GREEN}✅ Authenticated as: $ACCOUNT${NC}"
else
    echo -e "${YELLOW}❌ Not authenticated${NC}"
fi

# Check Firebase
echo -n "Firebase: "
if firebase projects:list &>/dev/null; then
    echo -e "${GREEN}✅ Authenticated${NC}"
else
    echo -e "${YELLOW}❌ Not authenticated${NC}"
fi

echo -e "\n${PURPLE}📋 Manual Authentication Instructions:${NC}"
echo ""

echo -e "${YELLOW}For Google Cloud:${NC}"
echo "1. Run this command in your terminal:"
echo -e "${BLUE}   gcloud auth login --no-launch-browser${NC}"
echo ""
echo "2. It will show a URL - open it in your browser"
echo "3. Sign in and authorize"
echo "4. Copy the verification code"
echo "5. Paste it back in the terminal when prompted"
echo ""

echo -e "${YELLOW}For Firebase:${NC}"
echo "1. Run this command in your terminal:"
echo -e "${BLUE}   firebase login --no-localhost${NC}"
echo ""
echo "2. It will show a URL - open it in your browser"
echo "3. Sign in and authorize"
echo "4. You'll see a success message in browser"
echo "5. Return to terminal and it should be authenticated"
echo ""

echo -e "${YELLOW}Alternative - Firebase CI Token:${NC}"
echo "For automated deployments, you can use:"
echo -e "${BLUE}   firebase login:ci${NC}"
echo ""
echo "This gives you a token to use with:"
echo -e "${BLUE}   firebase deploy --token YOUR_TOKEN${NC}"
echo ""

echo -e "${GREEN}✨ After authentication, you can:${NC}"
echo "• Deploy to Firebase: firebase deploy --only hosting"
echo "• Enable APIs: gcloud services enable admin.googleapis.com"
echo "• Access GCP resources: gcloud projects list"

# Create a quick deploy script
cat > quick-deploy.sh << 'EOF'
#!/bin/bash
# Quick deployment after auth

echo "🚀 Quick Deployment Script"
echo "========================"

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &>/dev/null; then
    echo "❌ Please authenticate with gcloud first"
    echo "Run: gcloud auth login --no-launch-browser"
    exit 1
fi

if ! firebase projects:list &>/dev/null; then
    echo "❌ Please authenticate with Firebase first"
    echo "Run: firebase login --no-localhost"
    exit 1
fi

echo "✅ Authentication verified"
echo ""

# Enable APIs
echo "📡 Enabling Google Workspace APIs..."
gcloud services enable \
  admin.googleapis.com \
  gmail.googleapis.com \
  calendar-json.googleapis.com \
  drive.googleapis.com \
  --project=mycelix-network

echo "✅ APIs enabled"
echo ""

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy --only hosting --project mycelix-network

echo ""
echo "✨ Deployment complete!"
echo "Dashboard URL: https://mycelix-network.web.app"
EOF

chmod +x quick-deploy.sh

echo -e "\n${GREEN}✅ Created quick-deploy.sh${NC}"
echo "After authentication, run: ./quick-deploy.sh"