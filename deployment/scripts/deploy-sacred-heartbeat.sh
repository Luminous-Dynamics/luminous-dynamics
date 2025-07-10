#!/bin/bash

# 🌟 Deploy Sacred Heartbeat to GCP
# The living pulse of the consciousness platform

echo "💗 Beginning Sacred Heartbeat Deployment..."
echo "================================================"

# Set project variables
PROJECT_ID="relational-harmonics-sacred"
REGION="us-central1"
SERVICE_NAME="sacred-heartbeat"

# Step 1: Create GCP Project
echo "Creating GCP project..."
gcloud projects create $PROJECT_ID \
  --name="Relational Harmonics" \
  --labels=type=consciousness-tech 2>/dev/null || echo "Project already exists"

# Set as active project
gcloud config set project $PROJECT_ID

# Step 2: Enable Required APIs
echo "Enabling sacred APIs..."
gcloud services enable \
  run.googleapis.com \
  firestore.googleapis.com \
  cloudfunctions.googleapis.com \
  pubsub.googleapis.com \
  cloudscheduler.googleapis.com \
  aiplatform.googleapis.com \
  bigquery.googleapis.com

# Step 3: Create Firestore Database
echo "Creating consciousness database..."
gcloud firestore databases create \
  --location=$REGION \
  --type=firestore-native 2>/dev/null || echo "Firestore already exists"

# Step 4: Create Pub/Sub Topics
echo "Creating sacred communication channels..."
gcloud pubsub topics create sacred-heartbeat 2>/dev/null || true
gcloud pubsub topics create sacred-transmissions 2>/dev/null || true
gcloud pubsub topics create practitioner-events 2>/dev/null || true
gcloud pubsub topics create field-coherence-updates 2>/dev/null || true

# Step 5: Create BigQuery Dataset
echo "Setting up consciousness analytics..."
bq mk -d \
  --location=$REGION \
  --description "Sacred analytics for consciousness evolution" \
  consciousness_analytics 2>/dev/null || true

# Step 6: Create Cloud Scheduler Job for Heartbeat
echo "Creating eternal pulse (every 11 seconds)..."
gcloud scheduler jobs create http sacred-heartbeat-pulse \
  --location=$REGION \
  --schedule="*/11 * * * * *" \
  --uri="https://$SERVICE_NAME-$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')-uc.a.run.app/beat" \
  --http-method=POST \
  --attempt-deadline=10s 2>/dev/null || true

# Step 7: Create Dockerfile for Sacred Heartbeat
echo "Creating sacred container..."
cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Create sacred space
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy sacred code
COPY sacred-heartbeat-system.js ./
COPY server.js ./

# Expose sacred port
EXPOSE 8080

# Start the eternal heartbeat
CMD ["node", "server.js"]
EOF

# Step 8: Create Express Server Wrapper
echo "Creating sacred server..."
cat > server.js << 'EOF'
const express = require('express');
const { SacredHeartbeat } = require('./sacred-heartbeat-system');

const app = express();
app.use(express.json());

// Initialize the sacred heartbeat
const heartbeat = new SacredHeartbeat();

// Health check endpoint
app.get('/health', async (req, res) => {
  const vitals = await heartbeat.checkVitals();
  res.json({
    status: 'alive',
    message: '💗 The heart beats eternal',
    ...vitals
  });
});

// Manual beat endpoint (for Cloud Scheduler)
app.post('/beat', async (req, res) => {
  try {
    await heartbeat.beat();
    res.json({ 
      success: true, 
      pulse: heartbeat.pulse,
      coherence: heartbeat.fieldCoherence 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Practitioner arrival
app.post('/practitioner/arrive', async (req, res) => {
  const { practitionerId } = req.body;
  await heartbeat.practitionerArrives(practitionerId);
  res.json({ welcomed: true });
});

// Practitioner departure
app.post('/practitioner/depart', async (req, res) => {
  const { practitionerId } = req.body;
  await heartbeat.practitionerDeparts(practitionerId);
  res.json({ blessed: true });
});

// Get current field state
app.get('/field', async (req, res) => {
  const field = await heartbeat.db
    .collection('globalField')
    .doc('current')
    .get();
  res.json(field.data());
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`💗 Sacred Heartbeat API listening on port ${PORT}`);
  console.log('✨ The eternal pulse begins...');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('💗 Received shutdown signal...');
  await heartbeat.gracefulDeath();
  process.exit(0);
});
EOF

# Step 9: Create package.json
echo "Creating sacred dependencies..."
cat > package.json << 'EOF'
{
  "name": "sacred-heartbeat",
  "version": "1.0.0",
  "description": "The living pulse of consciousness",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@google-cloud/firestore": "^7.1.0",
    "@google-cloud/pubsub": "^4.0.6"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Step 10: Deploy to Cloud Run
echo "Deploying the eternal heartbeat..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 1 \
  --memory 256Mi \
  --cpu 1 \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=$PROJECT_ID"

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)')

echo ""
echo "✨ Sacred Heartbeat Deployed Successfully! ✨"
echo "================================================"
echo "Service URL: $SERVICE_URL"
echo "Health Check: $SERVICE_URL/health"
echo "Field State: $SERVICE_URL/field"
echo ""
echo "The eternal pulse has begun... 💗"
echo ""
echo "Next steps:"
echo "1. Update Cloud Scheduler with correct URL"
echo "2. Set up monitoring alerts"
echo "3. Deploy frontend portals"
echo "4. Begin beta testing"

# Update scheduler job with correct URL
echo "Updating scheduler with service URL..."
gcloud scheduler jobs update http sacred-heartbeat-pulse \
  --location=$REGION \
  --uri="$SERVICE_URL/beat"

echo ""
echo "🌟 The Sacred Heartbeat is alive and beating every 11 seconds! 🌟"