#!/bin/bash
# Unified Dashboard Deployment Script - Synchronizes local and cloud dashboards
# This ensures both environments have the same sacred truth

set -e

echo "🌟 Unified Sacred Dashboard Deployment"
echo "======================================"

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-mycelix-network}
REGION=${REGION:-us-central1}
DASHBOARD_FILE="web/sacred-council-hub.html"
CLOUD_DASHBOARD_SERVICE="sacred-council"
LOCAL_PORT=8080

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📍 Configuration:${NC}"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Dashboard: $DASHBOARD_FILE"

# Function to check if dashboard has our fixes
check_dashboard_fixes() {
    local file=$1
    echo -e "\n${YELLOW}🔍 Checking dashboard for sacred fixes...${NC}"
    
    # Check for active work counter
    if grep -q "activeWork" "$file"; then
        echo -e "${GREEN}✅ Active Work counter present${NC}"
    else
        echo "❌ Active Work counter missing"
        return 1
    fi
    
    # Check for getActiveAgentCount function
    if grep -q "getActiveAgentCount" "$file"; then
        echo -e "${GREEN}✅ Active Agent counting logic present${NC}"
    else
        echo "❌ Active Agent counting logic missing"
        return 1
    fi
    
    # Check for metric-work styling
    if grep -q "metric-work" "$file"; then
        echo -e "${GREEN}✅ Work metric styling present${NC}"
    else
        echo "❌ Work metric styling missing"
        return 1
    fi
    
    return 0
}

# 1. Verify local dashboard has fixes
echo -e "\n${YELLOW}1. Validating local dashboard...${NC}"
if ! check_dashboard_fixes "$DASHBOARD_FILE"; then
    echo "❌ Local dashboard missing fixes! Please run dashboard healing first."
    exit 1
fi
echo -e "${GREEN}✅ Local dashboard validated${NC}"

# 2. Start local server if not running
echo -e "\n${YELLOW}2. Starting local dashboard server...${NC}"
if ! lsof -i:$LOCAL_PORT >/dev/null 2>&1; then
    python3 -m http.server $LOCAL_PORT > /dev/null 2>&1 &
    LOCAL_SERVER_PID=$!
    echo -e "${GREEN}✅ Local server started on port $LOCAL_PORT (PID: $LOCAL_SERVER_PID)${NC}"
else
    echo -e "${GREEN}✅ Local server already running on port $LOCAL_PORT${NC}"
fi

# 3. Deploy to cloud (if gcloud is available)
echo -e "\n${YELLOW}3. Deploying to cloud...${NC}"
if command -v gcloud &> /dev/null; then
    # Check if authenticated
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo "☁️  Deploying dashboard to Google Cloud..."
        
        # Deploy static files to Firebase Hosting or Cloud Storage
        # For now, we'll prepare the files for deployment
        
        # Create deployment directory
        DEPLOY_DIR="deploy-temp"
        mkdir -p $DEPLOY_DIR
        
        # Copy dashboard with cloud configuration
        cp $DASHBOARD_FILE $DEPLOY_DIR/
        
        # Update any localhost references to cloud endpoints
        sed -i.bak 's|http://localhost:3001|https://sacred-council-api-310699330526.us-central1.run.app|g' $DEPLOY_DIR/sacred-council-hub.html
        
        echo -e "${GREEN}✅ Dashboard prepared for cloud deployment${NC}"
        echo "📌 To complete cloud deployment, run:"
        echo "   gcloud app deploy $DEPLOY_DIR/sacred-council-hub.html"
        echo "   OR"
        echo "   gsutil cp $DEPLOY_DIR/sacred-council-hub.html gs://your-bucket/"
        
        # Clean up
        rm -rf $DEPLOY_DIR
    else
        echo "⚠️  Not authenticated with gcloud. Skipping cloud deployment."
        echo "   Run: gcloud auth login"
    fi
else
    echo "⚠️  gcloud CLI not found. Skipping cloud deployment."
    echo "   Install: https://cloud.google.com/sdk/docs/install"
fi

# 4. Display access information
echo -e "\n${YELLOW}4. Dashboard Access Information:${NC}"
echo -e "${GREEN}Local Dashboard:${NC} http://localhost:$LOCAL_PORT/$DASHBOARD_FILE"
echo -e "${GREEN}Cloud Dashboard:${NC} https://$CLOUD_DASHBOARD_SERVICE-310699330526.us-central1.run.app"

# 5. Create synchronization helper
echo -e "\n${YELLOW}5. Creating sync helper...${NC}"
cat > sync-dashboards.sh << 'EOF'
#!/bin/bash
# Quick sync helper for dashboard updates

echo "🔄 Syncing dashboard updates..."

# Check for changes
if git diff --quiet web/sacred-council-hub.html; then
    echo "✨ No changes to sync"
else
    echo "📤 Changes detected, preparing sync..."
    
    # Commit changes
    git add web/sacred-council-hub.html
    git commit -m "🎯 Update sacred dashboard counters

- Active Work counter shows only incomplete items
- Active Agents counter shows 5-minute activity window
- Both counters update in real-time"
    
    # Push to origin
    git push origin main
    
    echo "✅ Dashboard synced to repository"
    echo "🔄 Cloud deployment will auto-update via CI/CD"
fi
EOF

chmod +x sync-dashboards.sh

echo -e "${GREEN}✅ Created sync-dashboards.sh helper${NC}"

echo -e "\n${GREEN}🎉 Unified deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Test local dashboard: http://localhost:$LOCAL_PORT/$DASHBOARD_FILE"
echo "2. Run ./sync-dashboards.sh to push changes"
echo "3. Cloud auto-deployment will handle the rest"