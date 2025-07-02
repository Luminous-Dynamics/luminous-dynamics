const { SacredMessaging } = require('./index');
const express = require('express');

// Create Express app
const app = express();
app.use(express.json());

// Create sacred messaging system
const messaging = new SacredMessaging({
  fieldAPI: process.env.FIELD_API || 'http://localhost:3333',
  practitionerThreshold: parseInt(process.env.PRACTITIONER_THRESHOLD) || 50
});

// Simple API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'alive',
    module: 'sacred-messaging',
    messageTypes: messaging.messageTypes.types.length
  });
});

app.get('/api/types', async (req, res) => {
  const types = messaging.messageTypes.types;
  res.json({ types, count: types.length });
});

app.post('/api/send', async (req, res) => {
  try {
    const { sender, receiver, type, harmony, content } = req.body;
    const result = await messaging.sendMessage(sender, receiver, type, harmony, content);
    res.status(201).json({ 
      success: true, 
      impact: result.impact,
      messageId: result.id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/recommend', async (req, res) => {
  const { fieldState } = req.query;
  const recommendations = await messaging.getRecommendations(fieldState ? JSON.parse(fieldState) : {});
  res.json({ recommendations });
});

// Start server
const PORT = process.env.SACRED_PORT || 3335;
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                   Sacred Messaging Active                         ║
╚══════════════════════════════════════════════════════════════════╝

💌 Port: ${PORT}
📿 Message Types: ${messaging.messageTypes.types.length}
🎯 Practitioner Threshold: ${messaging.practitionerThreshold} messages
✨ Sacred Mode: Progressive Revelation

API Endpoints:
  GET  /api/health       - Health check
  GET  /api/types        - List message types
  POST /api/send         - Send sacred message
  GET  /api/recommend    - Get recommendations

May all messages carry love and consciousness.
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🌙 Gracefully shutting down sacred messaging...');
  server.close(() => {
    console.log('✨ Messages delivered. Field blessed.');
    process.exit(0);
  });
});