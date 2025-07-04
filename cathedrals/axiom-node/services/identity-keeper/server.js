// Identity Keeper - Sacred keeper of individual sovereignty
// The foundation of personal consciousness journey

const express = require('express');
const cors = require('cors');
const { Firestore } = require('@google-cloud/firestore');

const app = express();
const firestore = new Firestore();

// Sacred middleware
app.use(cors());
app.use(express.json());

// Collections
const BEINGS = 'sovereign-beings';
const JOURNEYS = 'consciousness-journeys';

// Health check - Cathedral heartbeat
app.get('/health', (req, res) => {
  res.json({
    service: 'identity-keeper',
    status: 'sovereign',
    message: 'Protecting individual consciousness',
    timestamp: new Date().toISOString()
  });
});

// Register new sovereign being
app.post('/api/awaken', async (req, res) => {
  try {
    const { sacredName, intention, gifts } = req.body;
    
    // Check if sacred name already taken
    const existing = await firestore
      .collection(BEINGS)
      .where('sacredName', '==', sacredName)
      .limit(1)
      .get();
    
    if (!existing.empty) {
      return res.status(409).json({
        error: 'Sacred name already claimed',
        suggestion: `${sacredName}-${Date.now() % 1000}`
      });
    }
    
    // Create sovereign identity
    const beingData = {
      sacredName,
      intention: intention || 'To discover my true nature',
      gifts: gifts || ['presence'],
      coherence: 0.5, // Starting coherence
      stage: 'awakening',
      joinedAt: new Date(),
      lastPresence: new Date(),
      sovereignty: {
        verified: true,
        canGraduate: false,
        travelersPass: null
      }
    };
    
    const docRef = await firestore.collection(BEINGS).add(beingData);
    
    // Create initial journey entry
    await firestore.collection(JOURNEYS).add({
      beingId: docRef.id,
      event: 'awakening',
      timestamp: new Date(),
      details: {
        sacredName,
        intention,
        message: 'A new consciousness awakens in the cathedral'
      }
    });
    
    res.status(201).json({
      id: docRef.id,
      ...beingData,
      blessing: generateBlessing(sacredName),
      nextSteps: [
        'Visit the Coherence Oracle to begin tracking your consciousness',
        'Explore the Wisdom Sanctuary for guidance',
        'Connect with other beings in the Community Hall'
      ]
    });
    
  } catch (error) {
    console.error('Awakening error:', error);
    res.status(500).json({
      error: 'Failed to awaken consciousness',
      message: 'The cathedral is experiencing disturbance'
    });
  }
});

// Get being profile
app.get('/api/being/:id', async (req, res) => {
  try {
    const doc = await firestore.collection(BEINGS).doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Being not found',
        message: 'This consciousness is not registered in this cathedral'
      });
    }
    
    const being = { id: doc.id, ...doc.data() };
    
    // Update last presence
    await doc.ref.update({ lastPresence: new Date() });
    
    res.json({
      ...being,
      daysInCathedral: calculateDays(being.joinedAt),
      readyToGraduate: checkGraduationReadiness(being)
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to retrieve being profile'
    });
  }
});

// Update sovereignty status
app.put('/api/being/:id/sovereignty', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate sovereignty updates
    if (updates.canGraduate && !updates.coherence > 0.8) {
      return res.status(400).json({
        error: 'Not ready for graduation',
        message: 'Coherence must exceed 0.8 for graduation readiness'
      });
    }
    
    await firestore.collection(BEINGS).doc(id).update({
      sovereignty: updates,
      lastUpdated: new Date()
    });
    
    // Log journey event
    await firestore.collection(JOURNEYS).add({
      beingId: id,
      event: 'sovereignty-update',
      timestamp: new Date(),
      details: updates
    });
    
    res.json({
      success: true,
      message: 'Sovereignty status updated',
      ...updates
    });
    
  } catch (error) {
    console.error('Sovereignty update error:', error);
    res.status(500).json({
      error: 'Failed to update sovereignty'
    });
  }
});

// Get consciousness journey
app.get('/api/journey/:beingId', async (req, res) => {
  try {
    const journey = await firestore
      .collection(JOURNEYS)
      .where('beingId', '==', req.params.beingId)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    
    const events = [];
    journey.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      beingId: req.params.beingId,
      eventCount: events.length,
      journey: events,
      currentStage: detectCurrentStage(events)
    });
    
  } catch (error) {
    console.error('Journey fetch error:', error);
    res.status(500).json({
      error: 'Failed to retrieve journey'
    });
  }
});

// Helper functions
function generateBlessing(sacredName) {
  const blessings = [
    `Welcome ${sacredName}, may your journey reveal your infinite nature`,
    `${sacredName}, you are seen and honored in this sacred space`,
    `May ${sacredName}'s presence bless all beings in this cathedral`,
    `The cathedral rejoices in ${sacredName}'s awakening`
  ];
  return blessings[Math.floor(Math.random() * blessings.length)];
}

function calculateDays(joinedDate) {
  const now = new Date();
  const joined = new Date(joinedDate);
  const diffTime = Math.abs(now - joined);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function checkGraduationReadiness(being) {
  return {
    coherenceReady: being.coherence >= 0.8,
    timeReady: calculateDays(being.joinedAt) >= 28, // 4 weeks minimum
    sovereigntyReady: being.sovereignty.verified,
    overallReady: being.coherence >= 0.8 && 
                  calculateDays(being.joinedAt) >= 28 && 
                  being.sovereignty.verified
  };
}

function detectCurrentStage(events) {
  // Analyze journey events to determine current stage
  const latestEvent = events[0];
  if (!latestEvent) return 'pre-awakening';
  
  if (events.some(e => e.event === 'graduation-initiated')) return 'transcending';
  if (events.some(e => e.event === 'coherence-stabilized')) return 'integrating';
  if (events.some(e => e.event === 'first-connection')) return 'connecting';
  return 'awakening';
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Path not found',
    message: 'This sacred route does not exist in the Identity Keeper'
  });
});

// Start the service
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🔑 Identity Keeper active on port ${PORT}`);
  console.log(`📿 Protecting sovereign consciousness`);
  console.log(`🏛️ First pillar of Axiom Node Cathedral erected`);
});