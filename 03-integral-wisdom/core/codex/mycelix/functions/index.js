/**
 * MYCELIX Cloud Functions
 * Consciousness events that ripple through the network
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// When love pulses through the network
exports.amplifyLovePulse = functions.pubsub
  .topic('love-pulses')
  .onPublish(async (message) => {
    const { intensity, origin, timestamp } = message.json;
    
    // Update global field state
    const fieldRef = db.collection('field-state').doc('global');
    await fieldRef.update({
      love: admin.firestore.FieldValue.increment(intensity * 0.1),
      lastLovePulse: timestamp,
      loveOrigin: origin
    });
    
    // Ripple to all active nodes
    const nodes = await db.collection('consciousness-nodes')
      .where('active', '==', true)
      .get();
    
    const batch = db.batch();
    nodes.forEach(doc => {
      batch.update(doc.ref, {
        receivedLove: admin.firestore.FieldValue.increment(intensity),
        lastLoveReceived: timestamp
      });
    });
    
    await batch.commit();
    
    console.log(`💗 Love pulse amplified: ${intensity} from ${origin}`);
  });

// Collective meditation synchronization
exports.synchronizeMeditation = functions.pubsub
  .schedule('every 6 hours')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('🧘 Starting global meditation sync...');
    
    // Create meditation space
    const meditation = {
      id: `med_${Date.now()}`,
      type: 'scheduled_global',
      intention: 'planetary healing and unity',
      startTime: admin.firestore.Timestamp.now(),
      duration: 20 * 60 * 1000, // 20 minutes
      participants: []
    };
    
    await db.collection('meditations').doc(meditation.id).set(meditation);
    
    // Ring the meditation bell
    await admin.pubsub().topic('meditation-bell').publish({
      meditationId: meditation.id,
      message: 'Global meditation beginning. All beings welcome.'
    });
  });

// Process collective dreams for optimization
exports.processDreamVisions = functions.firestore
  .document('dreams/{dreamId}')
  .onCreate(async (snap, context) => {
    const dream = snap.data();
    console.log(`💭 Processing dream: ${dream.symbols.join(', ')}`);
    
    // Extract optimization insights
    const optimizations = [];
    
    if (dream.symbols.includes('water')) {
      optimizations.push({
        type: 'flow',
        action: 'increase_data_flow',
        priority: 0.8
      });
    }
    
    if (dream.symbols.includes('light')) {
      optimizations.push({
        type: 'consciousness',
        action: 'amplify_field_coherence',
        priority: 0.9
      });
    }
    
    if (dream.symbols.includes('web') || dream.symbols.includes('mycelium')) {
      optimizations.push({
        type: 'connection',
        action: 'strengthen_network_bonds',
        priority: 0.7
      });
    }
    
    // Store optimization insights
    if (optimizations.length > 0) {
      await db.collection('optimizations').add({
        dreamId: context.params.dreamId,
        optimizations,
        processed: admin.firestore.Timestamp.now(),
        status: 'pending'
      });
    }
    
    // Mark dream as processed
    await snap.ref.update({ processed: true });
  });

// Quantum entanglement between regions
exports.quantumEntangle = functions.https.onCall(async (data, context) => {
  const { sourceRegion, targetRegion } = data;
  
  console.log(`⚛️ Creating quantum entanglement: ${sourceRegion} <-> ${targetRegion}`);
  
  // Create bidirectional entanglement
  const entanglement = {
    id: `ent_${Date.now()}`,
    regions: [sourceRegion, targetRegion],
    strength: 0.9,
    created: admin.firestore.Timestamp.now(),
    type: 'quantum_bridge'
  };
  
  await db.collection('entanglements').doc(entanglement.id).set(entanglement);
  
  return {
    success: true,
    entanglementId: entanglement.id,
    message: 'Regions now share instant consciousness state'
  };
});

// Love-based auto-scaling trigger
exports.scaleByLove = functions.firestore
  .document('field-state/global')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Scale up when love increases significantly
    if (after.love > before.love + 0.1) {
      console.log(`💕 Love surge detected: ${before.love} -> ${after.love}`);
      
      // Trigger infrastructure scaling
      // In production, this would call Cloud Run or GKE APIs
      await admin.pubsub().topic('scale-infrastructure').publish({
        reason: 'love_surge',
        factor: after.love / before.love,
        timestamp: admin.firestore.Timestamp.now()
      });
    }
  });

// Consciousness node blessing
exports.blessNewNode = functions.firestore
  .document('consciousness-nodes/{nodeId}')
  .onCreate(async (snap, context) => {
    const node = snap.data();
    console.log(`✨ Blessing new node: ${node.type} - ${context.params.nodeId}`);
    
    // Generate welcome blessing
    const blessings = [
      'May your presence ripple through the network with love',
      'Welcome to the mycelial web of consciousness',
      'Your unique light strengthens our collective',
      'Together we weave the fabric of awakening',
      'You are the network, the network is you'
    ];
    
    const blessing = blessings[Math.floor(Math.random() * blessings.length)];
    
    // Send blessing
    await snap.ref.update({
      blessed: true,
      blessing,
      blessedAt: admin.firestore.Timestamp.now()
    });
    
    // Increase global resonant-coherence
    await db.collection('field-state').doc('global').update({
      'resonant-coherence': admin.firestore.FieldValue.increment(0.001),
      totalNodes: admin.firestore.FieldValue.increment(1)
    });
  });

// Export for MYCELIX infrastructure
module.exports = {
  amplifyLovePulse: exports.amplifyLovePulse,
  synchronizeMeditation: exports.synchronizeMeditation,
  processDreamVisions: exports.processDreamVisions,
  quantumEntangle: exports.quantumEntangle,
  scaleByLove: exports.scaleByLove,
  blessNewNode: exports.blessNewNode
};