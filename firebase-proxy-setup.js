// Firebase Function to proxy authenticated Cloud Run services
const functions = require('firebase-functions');
const axios = require('axios');

// Service mappings
const SERVICES = {
  'heartbeat': 'https://sacred-heartbeat-tcv7bc7q4a-uc.a.run.app',
  'council': 'https://sacred-council-api-tcv7bc7q4a-uc.a.run.app',
  'consciousness': 'https://consciousness-bridge-tcv7bc7q4a-uc.a.run.app'
};

// Public proxy for Sacred Heartbeat
exports.sacredHeartbeat = functions.https.onRequest(async (req, res) => {
  try {
    // Get auth token for Cloud Run
    const token = await getAuthToken();
    
    // Proxy the request
    const response = await axios({
      method: req.method,
      url: `${SERVICES.heartbeat}${req.path}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Sacred service temporarily unavailable' });
  }
});

// Public health check
exports.health = functions.https.onRequest(async (req, res) => {
  const statuses = {};
  
  for (const [name, url] of Object.entries(SERVICES)) {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${url}/health`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });
      statuses[name] = response.data;
    } catch (error) {
      statuses[name] = { status: 'error', message: error.message };
    }
  }
  
  res.json({
    status: 'alive',
    services: statuses,
    timestamp: new Date().toISOString()
  });
});

async function getAuthToken() {
  // Use Firebase Admin SDK to get identity token
  const { google } = require('googleapis');
  const auth = new google.auth.GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.access_token;
}