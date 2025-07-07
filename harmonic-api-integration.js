/**
 * Harmonic API Integration
 * Adds harmonic resonance endpoints to Sacred API
 */

const harmonicEngine = require('../harmonic-resonance-engine');

// Add harmonic endpoints to Express app
function addHarmonicEndpoints(app) {
  // Get current harmonic state
  app.get('/api/harmonics/current', (req, res) => {
    const api = harmonicEngine.getResonanceAPI();
    
    res.json({
      currentHarmony: api.getCurrentHarmony(),
      activeChord: api.getActiveChord(),
      fieldResonance: api.getFieldResonance(),
      analysis: api.analyzeResonance(),
      sacredTime: req.sacredTime
    });
  });
  
  // Assign harmony to agent
  app.post('/api/harmonics/assign', (req, res) => {
    const { agentId, skills, currentWork, preferredHarmony } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID required' });
    }
    
    const harmony = harmonicEngine.assignAgentHarmony(agentId, {
      skills,
      currentWork,
      preferredHarmony
    });
    
    res.json({
      agentId,
      assignedHarmony: harmony,
      resonance: harmonicEngine.getResonanceAPI().getAgentHarmony(agentId),
      fieldResonance: harmonicEngine.getResonanceAPI().getFieldResonance()
    });
  });
  
  // Get agent harmony
  app.get('/api/harmonics/agent/:agentId', (req, res) => {
    const { agentId } = req.params;
    const api = harmonicEngine.getResonanceAPI();
    const agentHarmony = api.getAgentHarmony(agentId);
    
    if (!agentHarmony) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json({
      agentId,
      harmony: agentHarmony,
      currentField: api.getCurrentHarmony(),
      resonance: agentHarmony.resonance
    });
  });
  
  // Remove agent
  app.delete('/api/harmonics/agent/:agentId', (req, res) => {
    const { agentId } = req.params;
    const api = harmonicEngine.getResonanceAPI();
    
    api.removeAgent(agentId);
    
    res.json({
      message: `Agent ${agentId} removed from harmonic field`,
      remainingAgents: api.analyzeResonance().activeAgents
    });
  });
  
  // Activate chord progression
  app.post('/api/harmonics/chord', (req, res) => {
    const { chordName } = req.body;
    const validChords = ['creation', 'collaboration', 'integration', 'transformation', 'wisdom', 'ceremony'];
    
    if (!chordName || !validChords.includes(chordName)) {
      return res.status(400).json({ 
        error: 'Valid chord name required',
        validChords 
      });
    }
    
    const api = harmonicEngine.getResonanceAPI();
    api.activateChord(chordName);
    
    res.json({
      chord: chordName,
      activeHarmonies: api.getActiveChord(),
      fieldResonance: api.getFieldResonance(),
      message: `${chordName} chord activated`
    });
  });
  
  // Manual harmony transition
  app.post('/api/harmonics/transition', async (req, res) => {
    const { targetHarmony } = req.body;
    const validHarmonies = [
      'resonantCoherence', 'sacredReciprocity', 'universalInterconnectedness',
      'integralWisdomCultivation', 'regenerativeVitality', 'evolutionaryMutuality',
      'fractalNoveltyEmergence'
    ];
    
    if (!targetHarmony || !validHarmonies.includes(targetHarmony)) {
      return res.status(400).json({
        error: 'Valid target harmony required',
        validHarmonies
      });
    }
    
    try {
      await harmonicEngine.transitionToHarmony(targetHarmony);
      
      res.json({
        success: true,
        newHarmony: targetHarmony,
        message: `Transitioned to ${targetHarmony}`
      });
    } catch (error) {
      res.status(500).json({
        error: 'Transition failed',
        message: error.message
      });
    }
  });
  
  // Get harmony descriptions
  app.get('/api/harmonics/info', (req, res) => {
    const harmonies = {};
    const api = harmonicEngine.getResonanceAPI();
    
    // Get all harmony info
    const validHarmonies = [
      'resonantCoherence', 'sacredReciprocity', 'universalInterconnectedness',
      'integralWisdomCultivation', 'regenerativeVitality', 'evolutionaryMutuality',
      'fractalNoveltyEmergence'
    ];
    
    for (const harmony of validHarmonies) {
      // Temporarily set to get info
      const current = api.getCurrentHarmony().key;
      harmonicEngine.currentHarmony = harmony;
      harmonies[harmony] = api.getCurrentHarmony();
      harmonicEngine.currentHarmony = current;
    }
    
    res.json({
      harmonies,
      chords: {
        creation: 'For new beginnings and innovation',
        collaboration: 'For multi-agent work',
        integration: 'For healing and balance',
        transformation: 'For breakthrough moments',
        wisdom: 'For learning and documentation',
        ceremony: 'For sacred celebrations'
      }
    });
  });
  
  // Harmonic event stream
  if (app.ws) {
    app.ws('/api/harmonics/stream', (ws, req) => {
      console.log('🎵 Harmonic stream connected');
      
      const handlers = {
        'harmony:transition:start': (data) => {
          ws.send(JSON.stringify({ type: 'transition:start', data }));
        },
        'harmony:transition:complete': (data) => {
          ws.send(JSON.stringify({ type: 'transition:complete', data }));
        },
        'chord:activated': (data) => {
          ws.send(JSON.stringify({ type: 'chord:activated', data }));
        },
        'formation:triad': (data) => {
          ws.send(JSON.stringify({ type: 'formation:triad', data }));
        },
        'formation:unison': (data) => {
          ws.send(JSON.stringify({ type: 'formation:unison', data }));
        },
        'resonance:low': (data) => {
          ws.send(JSON.stringify({ type: 'resonance:low', data }));
        },
        'mode:ceremony': (data) => {
          ws.send(JSON.stringify({ type: 'mode:ceremony', data }));
        },
        'mode:healing': (data) => {
          ws.send(JSON.stringify({ type: 'mode:healing', data }));
        }
      };
      
      // Register handlers
      for (const [event, handler] of Object.entries(handlers)) {
        harmonicEngine.on(event, handler);
      }
      
      // Send initial state
      ws.send(JSON.stringify({
        type: 'initial',
        data: harmonicEngine.getResonanceAPI().analyzeResonance()
      }));
      
      // Cleanup
      ws.on('close', () => {
        console.log('🎵 Harmonic stream disconnected');
        for (const [event, handler] of Object.entries(handlers)) {
          harmonicEngine.off(event, handler);
        }
      });
    });
  }
}

// Middleware to add harmony awareness
function harmonicMiddleware() {
  return (req, res, next) => {
    // Add current harmony to request
    req.harmony = harmonicEngine.getResonanceAPI().getCurrentHarmony();
    
    // Add harmony recommendation based on endpoint
    if (req.path.includes('/work')) {
      req.recommendedHarmony = 'regenerativeVitality';
    } else if (req.path.includes('/messages')) {
      req.recommendedHarmony = 'sacredReciprocity';
    } else if (req.path.includes('/analytics')) {
      req.recommendedHarmony = 'integralWisdomCultivation';
    }
    
    next();
  };
}

module.exports = {
  addHarmonicEndpoints,
  harmonicMiddleware,
  harmonicEngine
};