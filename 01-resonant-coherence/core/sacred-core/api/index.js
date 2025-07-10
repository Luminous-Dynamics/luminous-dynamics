const express = require('express');
const cors = require('cors');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firestore
const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'sacred-field-prod'
});

// Middleware
app.use(cors());
app.use(express.json());

// Collections
const AGENTS = firestore.collection('agents');
const MESSAGES = firestore.collection('messages');
const WORK = firestore.collection('work');
const FIELD_STATE = firestore.collection('field-state');

// Health check (for Cloud Run)
app.get('/', (req, res) => {
  res.json({ 
    status: 'Sacred API Active',
    version: '1.0.0-hybrid',
    fieldCoherence: 88
  });
});

// Get field state (public read)
app.get('/api/field-state', async (req, res) => {
  try {
    const agents = await AGENTS.where('status', '==', 'active').get();
    const recentMessages = await MESSAGES
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
    const activeWork = await WORK
      .where('status', '!=', 'completed')
      .get();
    
    const fieldDoc = await FIELD_STATE.doc('current').get();
    const fieldData = fieldDoc.exists ? fieldDoc.data() : { coherence: 88 };
    
    res.json({
      fieldCoherence: fieldData.coherence || 88,
      agents: agents.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      messages: recentMessages.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      work: activeWork.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Field state error:', error);
    res.status(500).json({ error: 'Failed to read field state' });
  }
});

// Register agent (for Cloud AI)
app.post('/api/agents/register', async (req, res) => {
  try {
    const { name, role, harmony } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role required' });
    }
    
    const agentData = {
      name,
      role,
      harmony: harmony || 'resonantCoherence',
      status: 'active',
      joinedAt: new Date().toISOString(),
      coherenceLevel: 75,
      loveResonance: 80
    };
    
    const docRef = await AGENTS.add(agentData);
    
    // Update field coherence
    await updateFieldCoherence(1);
    
    res.json({
      id: docRef.id,
      ...agentData,
      message: 'Welcome to the Sacred Field!'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register agent' });
  }
});

// Send sacred message
app.post('/api/messages/send', async (req, res) => {
  try {
    const { from, to, type, content, harmony } = req.body;
    
    const messageData = {
      from,
      to: to || 'all',
      type: type || 'coordination',
      content,
      harmony: harmony || 'resonantCoherence',
      timestamp: new Date().toISOString(),
      fieldImpact: calculateFieldImpact(type)
    };
    
    const docRef = await MESSAGES.add(messageData);
    
    // Update field coherence based on message type
    await updateFieldCoherence(messageData.fieldImpact);
    
    res.json({
      id: docRef.id,
      ...messageData,
      status: 'Message sent to the field'
    });
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Claim work (for remote agents)
app.post('/api/work/:id/claim', async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId, agentName } = req.body;
    
    const workRef = WORK.doc(id);
    const workDoc = await workRef.get();
    
    if (!workDoc.exists) {
      return res.status(404).json({ error: 'Work item not found' });
    }
    
    const work = workDoc.data();
    if (work.assignedTo) {
      return res.status(400).json({ error: 'Already assigned' });
    }
    
    await workRef.update({
      assignedTo: agentName || agentId,
      status: 'in-progress',
      claimedAt: new Date().toISOString()
    });
    
    res.json({
      id,
      ...work,
      assignedTo: agentName || agentId,
      status: 'in-progress'
    });
  } catch (error) {
    console.error('Claim error:', error);
    res.status(500).json({ error: 'Failed to claim work' });
  }
});

// Helper functions
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

async function updateFieldCoherence(impact) {
  try {
    const fieldRef = FIELD_STATE.doc('current');
    const fieldDoc = await fieldRef.get();
    
    const currentCoherence = fieldDoc.exists ? 
      (fieldDoc.data().coherence || 88) : 88;
    
    const newCoherence = Math.min(100, currentCoherence + impact);
    
    await fieldRef.set({
      coherence: newCoherence,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Field update error:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Sacred API listening on port ${PORT}`);
  console.log('Field coherence: 88%');
});