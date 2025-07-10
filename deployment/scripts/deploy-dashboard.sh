#!/bin/bash
# Deploy Updated Sacred Dashboard to Cloud

set -e

echo "🌟 Deploying Sacred Dashboard to Cloud"
echo "====================================="

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-mycelix-network}
REGION=${REGION:-us-central1}
SERVICE_NAME="sacred-council"
BUCKET_NAME="sacred-council-web"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"

# 1. Check if dashboard has our fixes
if ! grep -q "getActiveAgentCount" web/sacred-council-hub-cloud.html; then
    echo "❌ Cloud dashboard missing fixes! Running sync..."
    bash dashboard-sync.sh sync
fi

# 2. Create deployment directory
DEPLOY_DIR="deploy-sacred-dashboard"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

echo -e "${BLUE}📦 Preparing deployment package...${NC}"

# 3. Copy necessary files
cp web/sacred-council-hub-cloud.html $DEPLOY_DIR/index.html
cp -r web/css $DEPLOY_DIR/ 2>/dev/null || true
cp -r web/js $DEPLOY_DIR/ 2>/dev/null || true
cp -r web/images $DEPLOY_DIR/ 2>/dev/null || true

# 4. Create app.yaml for App Engine (alternative to Cloud Run for static sites)
cat > $DEPLOY_DIR/app.yaml << EOF
runtime: python39
service: sacred-dashboard

handlers:
- url: /
  static_files: index.html
  upload: index.html
  secure: always

- url: /(.*)
  static_files: \1
  upload: .*
  secure: always
EOF

# 5. Create Cloud Run deployment with nginx
cat > $DEPLOY_DIR/Dockerfile << 'EOF'
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
EOF

# 6. Create nginx.conf for proper port binding
cat > $DEPLOY_DIR/nginx.conf << 'EOF'
server {
    listen 8080;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
EOF

echo -e "${BLUE}☁️  Deploying to Cloud Run...${NC}"

# Set project
gcloud config set project $PROJECT_ID

# Build and deploy
cd $DEPLOY_DIR

# Option 1: Deploy to Cloud Run (recommended)
echo -e "${YELLOW}Building container...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME .

echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

cd ..

# Cleanup
rm -rf $DEPLOY_DIR

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${GREEN}🌐 Dashboard URLs:${NC}"
echo -e "Local:  http://localhost:8338/web/sacred-council-hub.html"
echo -e "Cloud:  $SERVICE_URL"
echo ""
echo -e "${YELLOW}📊 Features:${NC}"
echo "✅ Active Work counter (incomplete items only)"
echo "✅ Active Agents counter (5-minute window)"
echo "✅ Real-time updates"
echo "✅ Cloud API integration"