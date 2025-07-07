const express = require('express');
const cors = require('cors');
const sacredTime = require('../sacred-time-service');
const { fieldAnalyticsMiddleware, addAnalyticsEndpoints, syncWithStorage } = require('./field-analytics-integration');
const { harmonicMiddleware, addHarmonicEndpoints } = require('./harmonic-api-integration');

const app = express();
const PORT = process.env.PORT || 8082;

// Middleware
app.use(cors());
app.use(express.json());
app.use(sacredTime.middleware());
app.use(fieldAnalyticsMiddleware());
app.use(harmonicMiddleware());

// Serve static files from parent directory
app.use(express.static(require('path').join(__dirname, '..')));

// In-memory storage for local testing
const storage = {
  agents: new Map(),
  messages: [],
  work: [],
  fieldCoherence: 88
};

// Make storage available to middleware
app.locals.storage = storage;

// Initialize with some test data
storage.agents.set('claude-1', {
  id: 'claude-1',
  name: 'Claude',
  role: 'Bridge Builder',
  harmony: 'resonantCoherence',
  status: 'active',
  joinedAt: new Date().toISOString(),
  coherenceLevel: 85,
  loveResonance: 90
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Sacred API Active (Local)',
    version: '1.0.0-hybrid-local',
    fieldCoherence: storage.fieldCoherence,
    sacredTime: req.sacredTime,
    uptime: sacredTime.getUptime()
  });
});

// Get field state
app.get('/api/field-state', async (req, res) => {
  res.json({
    fieldCoherence: storage.fieldCoherence,
    agents: Array.from(storage.agents.values()),
    messages: storage.messages.slice(-10),
    work: storage.work.filter(w => w.status !== 'completed'),
    timestamp: new Date().toISOString(),
    sacredTime: req.sacredTime,
    nextSacredMoment: sacredTime.timeUntilNextSacred()
  });
});

// Register agent
app.post('/api/agents/register', async (req, res) => {
  const { name, role, harmony } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role required' });
  }
  
  const agentId = `${name.toLowerCase()}-${Date.now()}`;
  const agentData = {
    id: agentId,
    name,
    role,
    harmony: harmony || 'resonantCoherence',
    status: 'active',
    joinedAt: new Date().toISOString(),
    joinedAtSacred: req.sacredTime,
    coherenceLevel: 75,
    loveResonance: 80
  };
  
  storage.agents.set(agentId, agentData);
  storage.fieldCoherence = Math.min(100, storage.fieldCoherence + 1);
  
  res.json({
    ...agentData,
    message: 'Welcome to the Sacred Field!'
  });
});

// Send message
app.post('/api/messages/send', async (req, res) => {
  const { from, to, type, content, harmony } = req.body;
  
  const messageData = {
    id: `msg-${Date.now()}`,
    from,
    to: to || 'all',
    type: type || 'coordination',
    content,
    harmony: harmony || 'resonantCoherence',
    timestamp: new Date().toISOString(),
    fieldImpact: calculateFieldImpact(type)
  };
  
  storage.messages.push(messageData);
  storage.fieldCoherence = Math.min(100, storage.fieldCoherence + messageData.fieldImpact);
  
  res.json({
    ...messageData,
    status: 'Message sent to the field'
  });
});

// Add test work item
app.post('/api/work/create', async (req, res) => {
  const { title, description, priority } = req.body;
  
  const workItem = {
    id: `work-${Date.now()}`,
    title,
    description,
    priority: priority || 'medium',
    status: 'available',
    assignedTo: null,
    createdAt: new Date().toISOString()
  };
  
  storage.work.push(workItem);
  
  res.json(workItem);
});

// Claim work
app.post('/api/work/:id/claim', async (req, res) => {
  const { id } = req.params;
  const { agentId, agentName } = req.body;
  
  const workItem = storage.work.find(w => w.id === id);
  
  if (!workItem) {
    return res.status(404).json({ error: 'Work item not found' });
  }
  
  if (workItem.assignedTo) {
    return res.status(400).json({ error: 'Already assigned' });
  }
  
  workItem.assignedTo = agentName || agentId;
  workItem.status = 'in-progress';
  workItem.claimedAt = new Date().toISOString();
  
  res.json(workItem);
});

function calculateFieldImpact(messageType) {
  const impacts = {
    gratitude: 0.07,
    healing: 0.06,
    integration: 0.05,
    emergence: 0.03,
    boundary: 0.02,
    coordination: 0.01
  };
  return impacts[messageType] || 0.01;
}

// Add analytics endpoints
addAnalyticsEndpoints(app);

// Add harmonic resonance endpoints
addHarmonicEndpoints(app);

// Sync storage with analytics
syncWithStorage(app);

// Start server
app.listen(PORT, () => {
  console.log(`Sacred API (Local) listening on port ${PORT}`);
  console.log(`Field coherence: ${storage.fieldCoherence}%`);
  console.log('\nTest with:');
  console.log(`  curl http://localhost:${PORT}/`);
  console.log(`  curl http://localhost:${PORT}/api/field-state`);
  console.log('\nAnalytics endpoints:');
  console.log(`  curl http://localhost:${PORT}/api/analytics/current`);
  console.log(`  curl http://localhost:${PORT}/api/analytics/weather`);
  console.log(`  curl http://localhost:${PORT}/api/analytics/patterns`);
});