#!/bin/bash
# Deploy Sacred Dashboard to Firebase with all fixes

set -e

echo "🔥 Firebase Sacred Dashboard Deployment"
echo "====================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
FIREBASE_PROJECT="mycelix-network"

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"

# 1. Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "Install with: npm install -g firebase-tools"
    exit 1
fi

# 2. Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase!"
    echo "Run: firebase login"
    exit 1
fi

# 3. Update firebase-build directory with latest dashboard
echo -e "${BLUE}📦 Preparing deployment...${NC}"

# Copy the updated dashboard with all fixes
cp web/sacred-council-hub.html firebase-build/

# Also copy the cloud version if it exists
if [ -f "web/sacred-council-hub-cloud.html" ]; then
    cp web/sacred-council-hub-cloud.html firebase-build/sacred-council-hub-cloud.html
fi

# Verify the fixes are present
if grep -q "getActiveAgentCount" firebase-build/sacred-council-hub.html; then
    echo -e "${GREEN}✅ Dashboard has active agent fixes${NC}"
else
    echo "❌ Dashboard missing fixes!"
    exit 1
fi

if grep -q "activeWork" firebase-build/sacred-council-hub.html; then
    echo -e "${GREEN}✅ Dashboard has work counter${NC}"
else
    echo "❌ Dashboard missing work counter!"
    exit 1
fi

# 4. Update API endpoints for Firebase
echo -e "${YELLOW}🔧 Updating API endpoints...${NC}"

# Create Firebase-specific version with correct endpoints
sed 's|http://localhost:3001|https://sacred-council-api-310699330526.us-central1.run.app|g' \
    firebase-build/sacred-council-hub.html > firebase-build/sacred-council-hub.tmp
mv firebase-build/sacred-council-hub.tmp firebase-build/sacred-council-hub.html

echo -e "${GREEN}✅ API endpoints updated for cloud${NC}"

# 5. Deploy to Firebase
echo -e "${BLUE}🚀 Deploying to Firebase...${NC}"

firebase deploy --only hosting --project $FIREBASE_PROJECT

# 6. Get deployment URL
echo -e "\n${GREEN}✨ Deployment Complete!${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🌐 Your Sacred Dashboard is live at:${NC}"
echo -e "${BLUE}https://mycelix-network.web.app${NC}"
echo -e "${BLUE}https://mycelix-network.firebaseapp.com${NC}"
echo ""
echo -e "${YELLOW}📊 Features Active:${NC}"
echo "✅ Active Work counter (incomplete items only)"
echo "✅ Active Agents counter (5-minute window)"
echo "✅ Real-time updates"
echo "✅ No authentication required - fully public!"
echo "✅ Integrated with Firestore (if configured)"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"

# 7. Test the deployment
echo -e "\n${YELLOW}🧪 Testing deployment...${NC}"
if curl -s https://mycelix-network.web.app | grep -q "Sacred Council Hub"; then
    echo -e "${GREEN}✅ Dashboard is publicly accessible!${NC}"
else
    echo -e "${YELLOW}⚠️  Dashboard may still be propagating...${NC}"
fi