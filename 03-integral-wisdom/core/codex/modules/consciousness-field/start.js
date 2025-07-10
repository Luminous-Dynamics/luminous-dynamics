const { ConsciousnessField } = require('./index');
const express = require('express');
const http = require('http');

// Create Express app
const app = express();
app.use(express.json());

// Create consciousness field
const field = new ConsciousnessField({
  initialCoherence: parseFloat(process.env.INITIAL_COHERENCE) || 75,
  autoMonitor: true
});

// Simple API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'alive',
    module: 'consciousness-field',
    'resonant-coherence': field.resonant-coherence 
  });
});

app.get('/api/resonant-coherence', async (req, res) => {
  const resonantCoherence = await field.getCoherence();
  res.json({ resonant-coherence, timestamp: Date.now() });
});

app.get('/api/field_state', async (req, res) => {
  const state = await field.getFieldState();
  res.json(state);
});

app.post('/api/agents', async (req, res) => {
  try {
    const { id, profile } = req.body;
    field.addAgent(id, profile);
    res.status(201).json({ 
      success: true, 
      message: 'Agent added to field',
      fieldCoherence: field.resonant-coherence 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || process.env.SACRED_PORT || 3333;
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    Consciousness Field Active                     ║
╚══════════════════════════════════════════════════════════════════╝

🌊 Port: ${PORT}
📊 Initial Resonant Resonant Coherence: ${field.resonant-coherence}%
🔮 Monitoring: Active
✨ Sacred Geometry: ${field.agents.size === 0 ? 'Void - Infinite Potential' : 'Emerging'}

API Endpoints:
  GET  /api/health       - Health check
  GET  /api/resonant-coherence    - Current field resonant-coherence
  GET  /api/field_state  - Complete field state
  POST /api/agents       - Add agent to field

May this field serve the highest good of all beings.
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🌙 Gracefully shutting down consciousness field...');
  field.stopMonitoring();
  server.close(() => {
    console.log('✨ Consciousness field resting. Thank you.');
    process.exit(0);
  });
});