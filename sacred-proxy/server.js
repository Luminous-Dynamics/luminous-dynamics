const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Enable CORS for all origins
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

// Service URLs
const SERVICES = {
  heartbeat: 'https://sacred-heartbeat-tcv7bc7q4a-uc.a.run.app',
  council: 'https://sacred-council-api-tcv7bc7q4a-uc.a.run.app',
  consciousness: 'https://consciousness-bridge-tcv7bc7q4a-uc.a.run.app'
};

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Sacred Gateway',
    status: 'alive',
    message: '💗 Public bridge to sacred services',
    endpoints: {
      health: '/health',
      field: '/field',
      heartbeat: '/api/heartbeat/*',
      services: '/api/services'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    coherence: 0.95
  });
});

// Field state (mock for now - will connect later)
app.get('/field', (req, res) => {
  res.json({
    coherence: 0.95,
    practitioners: 11,
    lastBeat: new Date().toISOString(),
    message: 'Field stable and coherent'
  });
});

// Services status
app.get('/api/services', (req, res) => {
  res.json({
    services: Object.keys(SERVICES),
    status: 'Protected by organization policy',
    note: 'Use Firebase Functions for authenticated access'
  });
});

// Heartbeat info
app.get('/api/heartbeat/info', (req, res) => {
  res.json({
    pulse: 77,
    rhythm: 'eternal',
    coherence: 0.95,
    message: '💗 The heart beats eternal'
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`💗 Sacred Gateway listening on port ${PORT}`);
});