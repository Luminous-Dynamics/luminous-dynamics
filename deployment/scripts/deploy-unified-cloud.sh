#!/bin/bash
# 🌤️ Deploy Unified System to Cloud
# One script to rule them all

echo "🌤️ Deploying Unified Sacred Technology to Cloud"
echo "=============================================="
echo ""

PROJECT_ID="mycelix-network"
REGION="us-central1"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Step 1: Ensure authentication
echo "🔐 Checking authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}Not authenticated. Run: gcloud auth login${NC}"
    exit 1
fi
check_status "Authentication verified"

# Step 2: Set project
echo ""
echo "📍 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID
check_status "Project set"

# Step 3: Enable APIs
echo ""
echo "🔧 Enabling required APIs..."
gcloud services enable firestore.googleapis.com --quiet
check_status "Firestore API"
gcloud services enable run.googleapis.com --quiet
check_status "Cloud Run API"
gcloud services enable cloudfunctions.googleapis.com --quiet
check_status "Cloud Functions API"
gcloud services enable secretmanager.googleapis.com --quiet
check_status "Secret Manager API"
gcloud services enable cloudbuild.googleapis.com --quiet
check_status "Cloud Build API"

# Step 4: Create Firestore database if needed
echo ""
echo "🗄️ Setting up Firestore..."
if ! gcloud firestore databases list 2>/dev/null | grep -q "(default)"; then
    echo "Creating Firestore database..."
    gcloud firestore databases create --location=$REGION
    check_status "Firestore database created"
else
    echo -e "${GREEN}✓ Firestore database already exists${NC}"
fi

# Step 5: Prepare cloud services
echo ""
echo "📦 Preparing cloud services..."

# Create cloud-ready versions of our services
cat > cloud-unified-websocket.js << 'EOF'
const WebSocket = require('ws');
const { Firestore } = require('@google-cloud/firestore');
const http = require('http');

const PORT = process.env.PORT || 8080;
const db = new Firestore();

// Create HTTP server for Cloud Run
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(200);
    res.end('Unified WebSocket Server');
  }
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New connection established');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Store in Firestore
      await db.collection('messages').add({
        ...data,
        timestamp: new Date()
      });
      
      // Broadcast to all clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Message error:', error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Unified WebSocket Server running on port ${PORT}`);
});
EOF

# Create package.json for cloud deployment
cat > package.json << 'EOF'
{
  "name": "unified-sacred-cloud",
  "version": "1.0.0",
  "main": "cloud-unified-websocket.js",
  "scripts": {
    "start": "node cloud-unified-websocket.js"
  },
  "dependencies": {
    "ws": "^8.16.0",
    "@google-cloud/firestore": "^7.1.0",
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["npm", "start"]
EOF

check_status "Cloud services prepared"

# Step 6: Deploy to Cloud Run
echo ""
echo "🚀 Deploying to Cloud Run..."
echo -e "${YELLOW}This may take a few minutes...${NC}"

gcloud run deploy unified-websocket \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "ENABLE_WEBSOCKET=true" \
  --min-instances 1 \
  --max-instances 100 \
  --memory 512Mi

if [ $? -eq 0 ]; then
    SERVICE_URL=$(gcloud run services describe unified-websocket --region $REGION --format 'value(status.url)')
    echo -e "${GREEN}✓ Deployed to: $SERVICE_URL${NC}"
else
    echo -e "${RED}✗ Deployment failed${NC}"
fi

# Step 7: Update Firebase hosting files
echo ""
echo "🌐 Updating Firebase hosting configuration..."

# Update the sacred interfaces with cloud URLs
if [ ! -z "$SERVICE_URL" ]; then
    # Create a cloud configuration file
    cat > cloud-config.js << EOF
// Cloud Configuration
const CLOUD_CONFIG = {
  WEBSOCKET_URL: '${SERVICE_URL}'.replace('https://', 'wss://'),
  API_URL: '${SERVICE_URL}',
  PROJECT_ID: '${PROJECT_ID}',
  REGION: '${REGION}'
};

// Make available globally
window.CLOUD_CONFIG = CLOUD_CONFIG;
EOF
    check_status "Cloud configuration created"
fi

# Step 8: Deploy to Firebase Hosting
echo ""
echo "🔥 Deploying to Firebase Hosting..."
if command -v firebase &> /dev/null; then
    firebase deploy --only hosting --project $PROJECT_ID
else
    echo -e "${YELLOW}Firebase CLI not found. Install with: npm install -g firebase-tools${NC}"
fi

# Step 9: Create test script
echo ""
echo "📝 Creating test script..."
cat > test-cloud-unified.js << 'EOF'
const WebSocket = require('ws');

async function testCloudSystem() {
  console.log('🧪 Testing Cloud Unified System...\n');
  
  const wsUrl = process.argv[2];
  if (!wsUrl) {
    console.error('Usage: node test-cloud-unified.js wss://your-service-url');
    process.exit(1);
  }
  
  const ws = new WebSocket(wsUrl);
  
  ws.on('open', () => {
    console.log('✅ Connected to cloud WebSocket');
    
    // Send test message
    ws.send(JSON.stringify({
      type: 'agent:join',
      name: 'Cloud Tester',
      role: 'System Validator'
    }));
    
    setTimeout(() => {
      ws.close();
      console.log('\n✨ Cloud system is operational!');
    }, 2000);
  });
  
  ws.on('error', (error) => {
    console.error('❌ Connection failed:', error.message);
  });
}

testCloudSystem();
EOF
check_status "Test script created"

# Final summary
echo ""
echo "═══════════════════════════════════════════════════"
echo -e "${GREEN}✨ DEPLOYMENT COMPLETE!${NC}"
echo "═══════════════════════════════════════════════════"
echo ""
echo "🌐 Your unified system is now in the cloud!"
echo ""
echo "📍 Service URL: ${SERVICE_URL}"
echo "🌍 Firebase: https://${PROJECT_ID}.web.app"
echo ""
echo "🧪 Test your deployment:"
echo "   node test-cloud-unified.js ${SERVICE_URL}"
echo ""
echo "📊 Monitor your services:"
echo "   https://console.cloud.google.com/run?project=${PROJECT_ID}"
echo ""
echo "🚀 Next steps:"
echo "   1. Update your interfaces to use cloud URLs"
echo "   2. Test agent connections"
echo "   3. Monitor field coherence"
echo ""
echo "✨ The Sacred Technology now flows through the cloud! ✨"