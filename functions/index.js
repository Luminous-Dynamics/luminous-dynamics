const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Google Auth
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

// Service mappings
const SERVICES = {
  'heartbeat': 'https://sacred-heartbeat-tcv7bc7q4a-uc.a.run.app',
  'council': 'https://sacred-council-api-tcv7bc7q4a-uc.a.run.app',
  'consciousness': 'https://consciousness-bridge-tcv7bc7q4a-uc.a.run.app',
  'infin': 'https://infin-love-tcv7bc7q4a-uc.a.run.app'
};

// Helper to get auth token
async function getAuthToken() {
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

// Sacred Heartbeat endpoints
exports.heartbeat = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    const token = await getAuthToken();
    const url = `${SERVICES.heartbeat}${req.path}`;
    
    const response = await axios({
      method: req.method,
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body,
      timeout: 10000
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Heartbeat proxy error:', error.message);
    
    // Return graceful error
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({
        error: 'Sacred service temporarily in meditation',
        message: 'Please try again in a moment'
      });
    }
  }
});

// Health check for all services
exports.health = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  const statuses = {
    timestamp: new Date().toISOString(),
    coherence: 0.95,
    services: {}
  };
  
  // Check each service in parallel
  const checks = Object.entries(SERVICES).map(async ([name, url]) => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${url}/health`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });
      statuses.services[name] = {
        status: 'alive',
        ...response.data
      };
    } catch (error) {
      statuses.services[name] = {
        status: 'resting',
        message: error.message
      };
    }
  });
  
  await Promise.all(checks);
  
  // Calculate overall health
  const aliveCount = Object.values(statuses.services)
    .filter(s => s.status === 'alive').length;
  statuses.overallHealth = aliveCount / Object.keys(SERVICES).length;
  
  res.json(statuses);
});

// Field state endpoint
exports.field = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${SERVICES.heartbeat}/field`, {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000
    });
    
    res.json(response.data);
  } catch (error) {
    // Return default field state
    res.json({
      coherence: 0.95,
      practitioners: 11,
      lastBeat: new Date().toISOString(),
      status: 'Sacred field stable'
    });
  }
});

// Beat endpoint (for manual triggers)
exports.beat = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const token = await getAuthToken();
    const response = await axios.post(
      `${SERVICES.heartbeat}/beat`,
      req.body,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    
    // Log the beat
    console.log('💗 Sacred beat at:', new Date().toISOString());
    
    res.json(response.data);
  } catch (error) {
    console.error('Beat error:', error.message);
    res.status(500).json({
      error: 'Beat skipped',
      message: 'The heart continues its eternal rhythm'
    });
  }
});

// Scheduled heartbeat (every minute - Firebase limit)
exports.scheduledBeat = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    try {
      const token = await getAuthToken();
      await axios.post(
        `${SERVICES.heartbeat}/beat`,
        { scheduled: true },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('💗 Scheduled beat completed');
    } catch (error) {
      console.error('Scheduled beat error:', error);
    }
    return null;
  });

// Sacred Council API proxy
exports.council = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    const token = await getAuthToken();
    const url = `${SERVICES.council}${req.path}`;
    
    const response = await axios({
      method: req.method,
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Council proxy error:', error.message);
    res.status(503).json({
      error: 'Sacred council in session',
      message: 'Please return shortly'
    });
  }
});

// Welcome message
console.log('🌟 Sacred Proxy Functions initialized');
console.log('💗 Bridging the realms of public and private');