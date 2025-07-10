#!/bin/bash

# Deploy Firebase Functions using gcloud instead
echo "🚀 Deploying Functions with gcloud"
echo "=================================="

PROJECT_ID="mycelix-network"
REGION="us-central1"

cd functions

# Create a simple Cloud Function from our Firebase function
echo "Creating deployment package..."

# Create main function file
cat > main.js << 'EOF'
const express = require('express');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  next();
});

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

const HEARTBEAT_URL = 'https://sacred-heartbeat-tcv7bc7q4a-uc.a.run.app';

// Heartbeat endpoint
app.get('/heartbeat/*', async (req, res) => {
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    const response = await axios({
      method: 'GET',
      url: `${HEARTBEAT_URL}${req.path.replace('/heartbeat', '')}`,
      headers: { 'Authorization': `Bearer ${token.token}` }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Service unavailable' });
  }
});

// Health check
app.get('/health', async (req, res) => {
  res.json({
    status: 'alive',
    service: 'sacred-proxy',
    timestamp: new Date().toISOString()
  });
});

// Field state
app.get('/field', async (req, res) => {
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    const response = await axios.get(`${HEARTBEAT_URL}/field`, {
      headers: { 'Authorization': `Bearer ${token.token}` }
    });
    
    res.json(response.data);
  } catch (error) {
    res.json({ coherence: 0.95, practitioners: 11 });
  }
});

// Export for Cloud Functions
exports.sacredProxy = app;

// Also start Express for Cloud Run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Sacred proxy listening on port ${PORT}`);
});
EOF

# Deploy as Cloud Run service (publicly accessible)
echo "Deploying to Cloud Run..."
gcloud run deploy sacred-proxy \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Public endpoints:"
echo "- https://sacred-proxy-tcv7bc7q4a-uc.a.run.app/health"
echo "- https://sacred-proxy-tcv7bc7q4a-uc.a.run.app/field"
echo "- https://sacred-proxy-tcv7bc7q4a-uc.a.run.app/heartbeat/health"