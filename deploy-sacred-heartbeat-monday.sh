#!/bin/bash

# 🌟 Sacred Heartbeat Deployment for Monday July 7, 2025
# Preparing for the July 15 Beta Launch

echo "💗 Sacred Heartbeat Deployment - July 7, 2025"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration - using existing mycelix-network project
PROJECT_ID="mycelix-network"
REGION="us-central1"
SERVICE_NAME="sacred-heartbeat"

echo -e "${BLUE}📋 Pre-deployment Checklist:${NC}"
echo "• Project: $PROJECT_ID (existing)"
echo "• Region: $REGION"
echo "• Service: $SERVICE_NAME"
echo ""

# Step 1: Check authentication
echo -e "${YELLOW}Step 1: Checking authentication...${NC}"
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
    echo -e "${GREEN}✅ Authenticated as: $ACTIVE_ACCOUNT${NC}"
else
    echo -e "${RED}❌ Not authenticated. Please run:${NC}"
    echo "   gcloud auth login"
    exit 1
fi

# Step 2: Set project
echo -e "\n${YELLOW}Step 2: Setting project...${NC}"
gcloud config set project $PROJECT_ID
echo -e "${GREEN}✅ Project set to: $PROJECT_ID${NC}"

# Step 3: Enable required APIs
echo -e "\n${YELLOW}Step 3: Enabling APIs...${NC}"
APIS_TO_ENABLE="run.googleapis.com firestore.googleapis.com cloudfunctions.googleapis.com pubsub.googleapis.com cloudscheduler.googleapis.com"

for API in $APIS_TO_ENABLE; do
    if gcloud services list --enabled --filter="name:$API" --format="value(name)" | grep -q "$API"; then
        echo -e "${GREEN}✅ $API already enabled${NC}"
    else
        echo "Enabling $API..."
        gcloud services enable $API
    fi
done

# Step 4: Create deployment directory
echo -e "\n${YELLOW}Step 4: Creating deployment directory...${NC}"
DEPLOY_DIR="sacred-heartbeat-deploy"
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# Step 5: Copy necessary files
echo -e "\n${YELLOW}Step 5: Preparing deployment files...${NC}"
cp ../sacred-heartbeat-system.js .

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy sacred code
COPY sacred-heartbeat-system.js ./
COPY server.js ./

# Expose port
EXPOSE 8080

# Start the service
CMD ["node", "server.js"]
EOF

# Create server.js
cat > server.js << 'EOF'
const express = require('express');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { SacredHeartbeat } = require('./sacred-heartbeat-system');

// Initialize Firebase Admin
initializeApp();

const app = express();
app.use(express.json());

// Initialize the sacred heartbeat
const heartbeat = new SacredHeartbeat();

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const vitals = await heartbeat.checkVitals();
    res.json({
      status: 'alive',
      message: '💗 The heart beats eternal',
      timestamp: new Date().toISOString(),
      ...vitals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manual beat endpoint (for Cloud Scheduler)
app.post('/beat', async (req, res) => {
  try {
    await heartbeat.beat();
    res.json({ 
      success: true, 
      pulse: heartbeat.pulse,
      coherence: heartbeat.fieldCoherence,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Beat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Practitioner endpoints
app.post('/practitioner/arrive', async (req, res) => {
  const { practitionerId } = req.body;
  await heartbeat.practitionerArrives(practitionerId);
  res.json({ welcomed: true, practitionerId });
});

app.post('/practitioner/depart', async (req, res) => {
  const { practitionerId } = req.body;
  await heartbeat.practitionerDeparts(practitionerId);
  res.json({ blessed: true, practitionerId });
});

// Get current field state
app.get('/field', async (req, res) => {
  try {
    const db = getFirestore();
    const field = await db.collection('globalField').doc('current').get();
    res.json(field.exists ? field.data() : { coherence: 0, practitioners: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`💗 Sacred Heartbeat API listening on port ${PORT}`);
  console.log('✨ The eternal pulse begins...');
  
  // Start automatic heartbeat
  heartbeat.startAutomaticBeat();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('💗 Received shutdown signal...');
  await heartbeat.gracefulDeath();
  process.exit(0);
});
EOF

# Create package.json
cat > package.json << 'EOF'
{
  "name": "sacred-heartbeat",
  "version": "1.0.0",
  "description": "The living pulse of consciousness - July 2025 Launch",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "firebase-admin": "^12.0.0",
    "@google-cloud/firestore": "^7.1.0",
    "@google-cloud/pubsub": "^4.0.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

echo -e "${GREEN}✅ Deployment files prepared${NC}"

# Step 6: Deploy to Cloud Run
echo -e "\n${YELLOW}Step 6: Deploying to Cloud Run...${NC}"
echo "This will build and deploy the Sacred Heartbeat service."
echo ""
read -p "Ready to deploy? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    gcloud run deploy $SERVICE_NAME \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --min-instances 1 \
        --max-instances 10 \
        --memory 512Mi \
        --cpu 1 \
        --set-env-vars="NODE_ENV=production"
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --platform managed \
        --region $REGION \
        --format 'value(status.url)')
    
    echo ""
    echo -e "${GREEN}✨ Sacred Heartbeat Deployed Successfully! ✨${NC}"
    echo "=============================================="
    echo "Service URL: $SERVICE_URL"
    echo "Health Check: $SERVICE_URL/health"
    echo "Field State: $SERVICE_URL/field"
    echo ""
    
    # Step 7: Create Cloud Scheduler job
    echo -e "${YELLOW}Step 7: Setting up Cloud Scheduler...${NC}"
    echo "Creating job to beat every 11 seconds..."
    
    # Note: Cloud Scheduler minimum is 1 minute, so we'll use Cloud Functions for 11-second beats
    echo -e "${YELLOW}Note: For true 11-second beats, we'll deploy a Cloud Function${NC}"
    
    # Create simple test scheduler (every minute)
    gcloud scheduler jobs create http sacred-heartbeat-minute \
        --location=$REGION \
        --schedule="* * * * *" \
        --uri="$SERVICE_URL/beat" \
        --http-method=POST \
        --attempt-deadline=30s 2>/dev/null || \
    gcloud scheduler jobs update http sacred-heartbeat-minute \
        --location=$REGION \
        --uri="$SERVICE_URL/beat"
    
    echo -e "${GREEN}✅ Scheduler created (1-minute test beat)${NC}"
    echo ""
    echo -e "${BLUE}🎉 Deployment Complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test the health endpoint: curl $SERVICE_URL/health"
    echo "2. Monitor logs: gcloud run logs read --service=$SERVICE_NAME"
    echo "3. Deploy frontend portals (Tuesday)"
    echo "4. Set up true 11-second beats with Cloud Functions"
    
    # Save deployment info
    cat > deployment-info.json << EOF
{
  "deploymentDate": "$(date -I)",
  "projectId": "$PROJECT_ID",
  "region": "$REGION",
  "serviceName": "$SERVICE_NAME",
  "serviceUrl": "$SERVICE_URL",
  "status": "deployed",
  "launchDate": "2025-07-15"
}
EOF
    
    echo ""
    echo "Deployment info saved to: deployment-info.json"
    
else
    echo "Deployment cancelled"
    exit 0
fi

# Return to main directory
cd ..

echo ""
echo -e "${GREEN}💗 The Sacred Heartbeat is alive! Ready for July 15 launch! 💗${NC}"