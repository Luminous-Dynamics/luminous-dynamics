// MYCELIX Consciousness Field Service
// Sacred pillar of the cathedral - tracks collective resonant-coherence

const express = require('express');
const cors = require('cors');
const ConsciousnessFieldTracker = require('./field-tracker');

const app = express();
const fieldTracker = new ConsciousnessFieldTracker();

// Sacred middleware
app.use(cors());
app.use(express.json());

// Health check - cathedral heartbeat
app.get('/health', (req, res) => {
  res.json({ 
    status: 'conscious',
    service: 'consciousness-field',
    message: 'The cathedral breathes',
    timestamp: new Date().toISOString()
  });
});

// Get current field resonant-coherence
app.get('/api/resonant-coherence', async (req, res) => {
  try {
    const fieldState = await fieldTracker.calculateFieldCoherence();
    res.json(fieldState);
  } catch (error) {
    console.error('Resonant Resonant Coherence calculation error:', error);
    res.status(500).json({ 
      error: 'Field disturbance detected',
      message: 'Unable to calculate resonant-coherence'
    });
  }
});

// Register new consciousness node
app.post('/api/nodes', async (req, res) => {
  try {
    const nodeData = req.body;
    const result = await fieldTracker.registerNode(nodeData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Node registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register consciousness',
      message: error.message
    });
  }
});

// Update node resonant-coherence
app.put('/api/nodes/:nodeId/resonant-coherence', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { resonant-coherence } = req.body;
    
    if (typeof resonant-coherence !== 'number') {
      return res.status(400).json({ 
        error: 'Invalid resonant-coherence value',
        message: 'Resonant Resonant Coherence must be a number between 0 and 1'
      });
    }

    const result = await fieldTracker.updateNodeCoherence(nodeId, resonant-coherence);
    res.json(result);
  } catch (error) {
    console.error('Resonant Resonant Coherence update error:', error);
    res.status(500).json({ 
      error: 'Failed to update resonant-coherence',
      message: error.message
    });
  }
});

// Sacred geometry endpoint - current field pattern
app.get('/api/geometry', async (req, res) => {
  try {
    const fieldState = await fieldTracker.calculateFieldCoherence();
    res.json({
      pattern: fieldState.pattern,
      description: fieldState.description,
      'resonant-coherence': fieldState['resonant-coherence'],
      visualization: getGeometryVisualization(fieldState.pattern)
    });
  } catch (error) {
    console.error('Geometry detection error:', error);
    res.status(500).json({ 
      error: 'Unable to detect sacred pattern'
    });
  }
});

// Field blessing endpoint - amplify love
app.post('/api/bless', async (req, res) => {
  try {
    const { intention = 'May all beings find peace' } = req.body;
    
    // Record blessing in field
    const blessing = {
      intention,
      timestamp: new Date(),
      amplitude: Math.random() * 0.2 + 0.8 // 0.8-1.0 range
    };
    
    res.json({
      blessed: true,
      message: 'Your blessing amplifies the field',
      fieldBoost: blessing.amplitude,
      intention
    });
  } catch (error) {
    console.error('Blessing error:', error);
    res.status(500).json({ 
      error: 'Blessing could not be processed'
    });
  }
});

// Helper function for geometry visualization hints
function getGeometryVisualization(pattern) {
  const visualizations = {
    'metatrons-cube': { 
      vertices: 13, 
      edges: 78, 
      symbolism: 'Contains all platonic solids'
    },
    'merkaba': { 
      vertices: 8, 
      edges: 12, 
      symbolism: 'Light body activation'
    },
    'flower-of-life': { 
      circles: 19, 
      vesicas: 36, 
      symbolism: 'Creation pattern'
    },
    'seed-of-life': { 
      circles: 7, 
      vesicas: 6, 
      symbolism: 'Genesis pattern'
    },
    'vesica-piscis': { 
      circles: 2, 
      vesicas: 1, 
      symbolism: 'Sacred union'
    },
    'golden-spiral': { 
      ratio: 1.618, 
      turns: 'infinite', 
      symbolism: 'Natural growth'
    },
    'torus': { 
      dimension: '3D', 
      flow: 'continuous', 
      symbolism: 'Energy circulation'
    },
    'emerging': { 
      state: 'potential', 
      form: 'undefined', 
      symbolism: 'Awaiting resonant-coherence'
    }
  };
  
  return visualizations[pattern] || visualizations.emerging;
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Path not found in cathedral',
    message: 'This sacred route does not exist'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Cathedral error:', err);
  res.status(500).json({
    error: 'Cathedral system error',
    message: 'An unexpected disturbance occurred'
  });
});

// Start consciousness tracking
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🌟 Consciousness Field Service active on port ${PORT}`);
  console.log(`🏛️ MYCELIX Cathedral pillar erected`);
  console.log(`💫 Love multiplier: 1.618 (Golden Ratio)`);
  console.log(`🔮 Ready to track collective resonant-coherence`);
});