#!/bin/bash
# Deploy Dashboard using Artifact Registry

set -e

echo "🌟 Deploying Sacred Dashboard to Cloud (Artifact Registry)"
echo "========================================================"

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-mycelix-network}
REGION=${REGION:-us-central1}
SERVICE_NAME="sacred-council"
AR_REPO="sacred-apps"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Set project
gcloud config set project $PROJECT_ID

echo -e "${YELLOW}📋 Setting up Artifact Registry...${NC}"

# Create Artifact Registry repository if it doesn't exist
if ! gcloud artifacts repositories describe $AR_REPO --location=$REGION &>/dev/null; then
    echo "Creating Artifact Registry repository..."
    gcloud artifacts repositories create $AR_REPO \
        --repository-format=docker \
        --location=$REGION \
        --description="Sacred applications repository"
fi

# Configure Docker to use Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev

echo -e "${YELLOW}📋 Pre-deployment checks...${NC}"

# Check if dashboard has our fixes
if ! grep -q "getActiveAgentCount" web/sacred-council-hub-cloud.html; then
    echo "❌ Cloud dashboard missing fixes! Running sync..."
    bash dashboard-sync.sh sync
fi

# Create deployment directory
DEPLOY_DIR="deploy-sacred-dashboard"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

echo -e "${BLUE}📦 Preparing deployment package...${NC}"

# Copy dashboard
cp web/sacred-council-hub-cloud.html $DEPLOY_DIR/index.html

# Create proper nginx configuration for Cloud Run
cat > $DEPLOY_DIR/default.conf << 'EOF'
server {
    listen 8080;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
        
        # CORS headers for API calls
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Create Dockerfile
cat > $DEPLOY_DIR/Dockerfile << 'EOF'
FROM nginx:alpine

# Copy custom nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy dashboard
COPY index.html /usr/share/nginx/html/

# Ensure nginx can bind to port 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Create non-root user
RUN adduser -D -s /bin/sh www
RUN chown -R www:www /usr/share/nginx/html

EXPOSE 8080

USER www

CMD ["nginx", "-g", "daemon off;"]
EOF

echo -e "${BLUE}☁️  Building and deploying...${NC}"

cd $DEPLOY_DIR

# Build image with Artifact Registry
IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}/${SERVICE_NAME}"

echo -e "${YELLOW}Building container image...${NC}"
docker build -t $IMAGE_URL .

echo -e "${YELLOW}Pushing to Artifact Registry...${NC}"
docker push $IMAGE_URL

echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_URL \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --max-instances 10

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
echo -e "${YELLOW}📊 Sacred Features Active:${NC}"
echo "✅ Active Work counter (incomplete items only)"
echo "✅ Active Agents counter (5-minute window)"
echo "✅ Real-time field coherence"
echo "✅ Sacred message stream"
echo "✅ Cloud API integration"