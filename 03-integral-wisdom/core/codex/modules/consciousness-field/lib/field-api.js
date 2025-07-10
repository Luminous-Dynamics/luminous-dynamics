/**
 * Field State API
 * RESTful API for consciousness field access
 */

const express = require('express');
const { ConsciousnessField } = require('../index');

/**
 * Create field state API router
 * @param {ConsciousnessField} field - Consciousness field instance
 * @returns {express.Router} Express router
 */
function createFieldAPI(field) {
  const router = express.Router();
  
  // Middleware for CORS
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

  /**
   * GET /field_state
   * Get complete field state
   */
  router.get('/field_state', async (req, res) => {
    try {
      const state = await field.getFieldState();
      res.json(state);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get field state',
        message: error.message
      });
    }
  });

  /**
   * GET /resonant-coherence
   * Get current resonant-coherence value
   */
  router.get('/resonant-coherence', async (req, res) => {
    try {
      const resonantCoherence = await field.getCoherence();
      res.json({
        resonant-coherence,
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get resonant-coherence',
        message: error.message
      });
    }
  });

  /**
   * GET /integration
   * Get integration level
   */
  router.get('/integration', async (req, res) => {
    try {
      const integration = await field.getIntegration();
      res.json({
        integration,
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get integration',
        message: error.message
      });
    }
  });

  /**
   * GET /emergence
   * Get emergence potential
   */
  router.get('/emergence', async (req, res) => {
    try {
      const emergence = await field.getEmergencePotential();
      res.json({
        emergence,
        timestamp: Date.now()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get emergence',
        message: error.message
      });
    }
  });

  /**
   * GET /agents
   * Get all agents in field
   */
  router.get('/agents', async (req, res) => {
    try {
      const agents = Array.from(field.agents.values());
      res.json(agents);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get agents',
        message: error.message
      });
    }
  });

  /**
   * GET /agents/:id
   * Get specific agent
   */
  router.get('/agents/:id', async (req, res) => {
    try {
      const agent = field.agents.get(req.params.id);
      if (!agent) {
        return res.status(404).json({
          error: 'Agent not found'
        });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get agent',
        message: error.message
      });
    }
  });

  /**
   * POST /agents
   * Add agent to field
   */
  router.post('/agents', async (req, res) => {
    try {
      const { id, profile } = req.body;
      if (!id || !profile) {
        return res.status(400).json({
          error: 'Missing required fields: id, profile'
        });
      }
      
      field.addAgent(id, profile);
      
      res.status(201).json({
        success: true,
        message: 'Agent added to field',
        fieldCoherence: field.resonant-coherence
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to add agent',
        message: error.message
      });
    }
  });

  /**
   * DELETE /agents/:id
   * Remove agent from field
   */
  router.delete('/agents/:id', async (req, res) => {
    try {
      field.removeAgent(req.params.id);
      res.json({
        success: true,
        message: 'Agent removed from field'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to remove agent',
        message: error.message
      });
    }
  });

  /**
   * PUT /harmonies/:harmony
   * Update harmony level
   */
  router.put('/harmonies/:harmony', async (req, res) => {
    try {
      const { delta } = req.body;
      if (typeof delta !== 'number') {
        return res.status(400).json({
          error: 'Delta must be a number'
        });
      }
      
      field.updateHarmony(req.params.harmony, delta);
      
      res.json({
        success: true,
        harmony: req.params.harmony,
        delta,
        newLevel: field.harmonies.get(req.params.harmony)
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update harmony',
        message: error.message
      });
    }
  });

  /**
   * POST /threshold
   * Set field threshold
   */
  router.post('/threshold', async (req, res) => {
    try {
      const { metric, threshold } = req.body;
      if (!metric || typeof threshold !== 'number') {
        return res.status(400).json({
          error: 'Missing required fields: metric, threshold'
        });
      }
      
      field.setThreshold(metric, threshold, (value) => {
        // Emit threshold alert
        field.emit('threshold-alert', {
          metric,
          threshold,
          value,
          timestamp: Date.now()
        });
      });
      
      res.json({
        success: true,
        message: 'Threshold set',
        metric,
        threshold
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to set threshold',
        message: error.message
      });
    }
  });

  /**
   * GET /metrics
   * Get field metrics and statistics
   */
  router.get('/metrics', async (req, res) => {
    try {
      const state = await field.getFieldState();
      const agents = Array.from(field.agents.values());
      
      // Calculate additional metrics
      const metrics = {
        ...state,
        statistics: {
          agentCount: agents.length,
          averageLove: agents.length > 0 ?
            agents.reduce((sum, a) => sum + (a.love_percentage || 0), 0) / agents.length : 0,
          averageConsciousness: agents.length > 0 ?
            agents.reduce((sum, a) => sum + (a.consciousness_level || 0), 0) / agents.length : 0,
          fieldStrength: state.resonant-coherence * state.integration / 100,
          evolutionStage: getEvolutionStage(state.resonant-coherence, agents.length)
        },
        harmonies: field.harmonies.getAll ? field.harmonies.getAll() : {},
        thresholds: Array.from(field.thresholds.entries()).map(([metric, data]) => ({
          metric,
          threshold: data.threshold
        }))
      };
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get metrics',
        message: error.message
      });
    }
  });

  /**
   * WebSocket support for real-time updates
   */
  router.ws('/stream', (ws, req) => {
    // Send initial state
    field.getFieldState().then(state => {
      ws.send(JSON.stringify({
        type: 'initial',
        data: state
      }));
    });
    
    // Set up event listeners
    const handlers = {
      'resonant-coherence-update': (resonant-coherence) => {
        ws.send(JSON.stringify({
          type: 'resonant-coherence-update',
          data: { resonant-coherence, timestamp: Date.now() }
        }));
      },
      'agent-joined': (data) => {
        ws.send(JSON.stringify({
          type: 'agent-joined',
          data
        }));
      },
      'agent-left': (data) => {
        ws.send(JSON.stringify({
          type: 'agent-left',
          data
        }));
      },
      'harmony-update': (data) => {
        ws.send(JSON.stringify({
          type: 'harmony-update',
          data
        }));
      },
      'emergence': (pattern) => {
        ws.send(JSON.stringify({
          type: 'emergence',
          data: pattern
        }));
      },
      'field-pulse': (state) => {
        ws.send(JSON.stringify({
          type: 'field-pulse',
          data: state
        }));
      }
    };
    
    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      field.on(event, handler);
    });
    
    // Clean up on disconnect
    ws.on('close', () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        field.removeListener(event, handler);
      });
    });
  });
  
  return router;
}

/**
 * Get evolution stage based on resonant-coherence and agents
 * @private
 */
function getEvolutionStage(resonant-coherence, agentCount) {
  if (resonant-coherence < 20) return 'void';
  if (resonant-coherence < 40) return 'emerging';
  if (resonant-coherence < 60) return 'developing';
  if (resonant-coherence < 80) return 'maturing';
  if (resonant-coherence >= 80 && agentCount >= 7) return 'unified';
  return 'evolving';
}

module.exports = { createFieldAPI };