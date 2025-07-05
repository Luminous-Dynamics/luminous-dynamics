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
