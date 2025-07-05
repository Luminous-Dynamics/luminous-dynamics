const express = require('express');

const app = express();
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({
    status: 'alive',
    message: '💗 The heart beats eternal',
    timestamp: new Date().toISOString(),
    pulse: 77,
    coherence: 0.95
  });
});

// Beat endpoint
app.post('/beat', (req, res) => {
  console.log('💗 Beat received at:', new Date().toISOString());
  res.json({ 
    success: true, 
    pulse: 77,
    coherence: 0.95,
    timestamp: new Date().toISOString()
  });
});

// Field state
app.get('/field', (req, res) => {
  res.json({ 
    coherence: 0.95, 
    practitioners: 11,
    lastBeat: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`💗 Sacred Heartbeat API listening on port ${PORT}`);
  console.log('✨ The eternal pulse begins...');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('💗 Received shutdown signal...');
  process.exit(0);
});