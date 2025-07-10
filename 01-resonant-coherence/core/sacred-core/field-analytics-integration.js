#!/usr/bin/env node
/**
 * Field Analytics Integration
 * Connects Field Coherence Analytics to Sacred API endpoints
 */

const fieldAnalytics = require('../field-coherence-analytics');
const sacredTime = require('../sacred-time-service');

// Express middleware for field analytics
function fieldAnalyticsMiddleware() {
  return async (req, res, next) => {
    // Add analytics to request
    req.fieldAnalytics = fieldAnalytics.getAnalyticsAPI();
    
    // Record measurement on each request
    if (req.path.includes('/api/')) {
      const context = {
        endpoint: req.path,
        method: req.method,
        agent: req.body?.agent || req.query?.agent || 'unknown',
        messageType: req.body?.type,
        workStatus: req.body?.status
      };
      
      // Get current coherence from storage if available
      const currentCoherence = req.app.locals?.storage?.fieldCoherence || 
                              fieldAnalytics.getCurrentCoherence();
      
      await fieldAnalytics.recordMeasurement(currentCoherence / 100, context);
    }
    
    next();
  };
}

// Add analytics endpoints to an Express app
function addAnalyticsEndpoints(app) {
  // Get current analytics state
  app.get('/api/analytics/current', (req, res) => {
    const analytics = req.fieldAnalytics;
    
    res.json({
      coherence: analytics.getCurrentCoherence(),
      level: analytics.getCoherenceLevel(),
      trend: analytics.getTrend(),
      mandala: analytics.getMandalaData(),
      insights: analytics.getInsights(),
      timestamp: new Date().toISOString(),
      sacredTime: req.sacredTime
    });
  });
  
  // Get coherence weather forecast
  app.get('/api/analytics/weather', (req, res) => {
    const weather = req.fieldAnalytics.getCoherenceWeather();
    
    res.json({
      ...weather,
      sacredTime: req.sacredTime,
      recommendations: getWeatherRecommendations(weather)
    });
  });
  
  // Get active patterns
  app.get('/api/analytics/patterns', (req, res) => {
    const patterns = req.fieldAnalytics.getPatterns();
    
    res.json({
      patterns: patterns.filter(p => p.strength > 0.5),
      totalDetected: patterns.length,
      strongestPattern: patterns.sort((a, b) => b.strength - a.strength)[0],
      sacredTime: req.sacredTime
    });
  });
  
  // Get predictions
  app.get('/api/analytics/predictions', (req, res) => {
    const predictions = req.fieldAnalytics.getPredictions();
    
    res.json({
      predictions,
      highConfidence: predictions.filter(p => p.confidence > 0.75),
      consensus: calculateConsensusPrediction(predictions),
      sacredTime: req.sacredTime
    });
  });
  
  // Get historical data
  app.get('/api/analytics/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const history = req.fieldAnalytics.getHistory(limit);
    
    res.json({
      measurements: history,
      count: history.length,
      timespan: history.length > 0 ? {
        start: history[0].timestamp,
        end: history[history.length - 1].timestamp
      } : null,
      sacredTime: req.sacredTime
    });
  });
  
  // Get influence analysis
  app.get('/api/analytics/influences', (req, res) => {
    const influences = req.fieldAnalytics.getInfluences();
    
    res.json({
      influences,
      strongest: getStrongestInfluences(influences),
      recommendations: getInfluenceRecommendations(influences),
      sacredTime: req.sacredTime
    });
  });
  
  // Get phase statistics
  app.get('/api/analytics/phases', (req, res) => {
    const phaseStats = req.fieldAnalytics.getPhaseStats();
    
    res.json({
      phases: phaseStats,
      optimal: getOptimalPhases(phaseStats),
      current: req.sacredTime.sacred.phase,
      sacredTime: req.sacredTime
    });
  });
  
  // Record custom measurement
  app.post('/api/analytics/record', async (req, res) => {
    const { coherence, context } = req.body;
    
    if (!coherence || coherence < 0 || coherence > 1) {
      return res.status(400).json({ error: 'Invalid coherence value (0-1)' });
    }
    
    const measurement = await fieldAnalytics.recordMeasurement(coherence, context);
    
    res.json({
      measurement,
      insights: await req.fieldAnalytics.getInsights(),
      sacredTime: req.sacredTime
    });
  });
  
  // WebSocket support for real-time updates (if express-ws is available)
  if (app.ws) {
    app.ws('/api/analytics/stream', (ws, req) => {
      console.log('📡 Analytics stream connected');
      
      // Send initial state
      ws.send(JSON.stringify({
        type: 'initial',
        data: {
          coherence: fieldAnalytics.getCurrentCoherence(),
          mandala: fieldAnalytics.getMandalaData(),
          insights: fieldAnalytics.getInsights()
        }
      }));
      
      // Set up event listeners
      const handlers = {
        measurement: (data) => {
          ws.send(JSON.stringify({ type: 'measurement', data }));
        },
        'mandala:updated': (data) => {
          ws.send(JSON.stringify({ type: 'mandala', data }));
        },
        'patterns:detected': (data) => {
          ws.send(JSON.stringify({ type: 'patterns', data }));
        },
        'threshold:crossed': (data) => {
          ws.send(JSON.stringify({ type: 'threshold', data }));
        },
        'predictions:updated': (data) => {
          ws.send(JSON.stringify({ type: 'predictions', data }));
        }
      };
      
      // Register all handlers
      for (const [event, handler] of Object.entries(handlers)) {
        fieldAnalytics.on(event, handler);
      }
      
      // Clean up on disconnect
      ws.on('close', () => {
        console.log('📡 Analytics stream disconnected');
        for (const [event, handler] of Object.entries(handlers)) {
          fieldAnalytics.off(event, handler);
        }
      });
    });
  }
}

// Helper functions
function getWeatherRecommendations(weather) {
  const recommendations = [];
  const { current, forecast } = weather;
  
  if (current.level === 'discord' || current.level === 'neutral') {
    recommendations.push('Consider coherence-raising practices');
  }
  
  if (current.trend === 'falling') {
    recommendations.push('Field needs attention - engage in harmonizing activities');
  }
  
  // Check forecast for optimal windows
  const optimalHours = forecast
    .filter(f => f.level === 'resonant' || f.level === 'unity')
    .map(f => f.hour);
    
  if (optimalHours.length > 0) {
    recommendations.push(`Optimal work windows at hours: ${optimalHours.slice(0, 3).join(', ')}`);
  }
  
  return recommendations;
}

function calculateConsensusPrediction(predictions) {
  if (predictions.length === 0) return null;
  
  const weightedSum = predictions.reduce((sum, p) => sum + p.predictedCoherence * p.confidence, 0);
  const weightSum = predictions.reduce((sum, p) => sum + p.confidence, 0);
  
  return {
    coherence: weightedSum / weightSum,
    confidence: weightSum / predictions.length,
    sources: predictions.length
  };
}

function getStrongestInfluences(influences) {
  const sorted = Object.entries(influences)
    .map(([factor, stats]) => ({
      factor,
      netImpact: stats.positive - stats.negative,
      totalOccurrences: stats.positive + stats.negative + stats.neutral
    }))
    .sort((a, b) => Math.abs(b.netImpact) - Math.abs(a.netImpact));
    
  return sorted.slice(0, 5);
}

function getInfluenceRecommendations(influences) {
  const recommendations = [];
  
  for (const [factor, stats] of Object.entries(influences)) {
    const netImpact = stats.positive - stats.negative;
    
    if (netImpact > 5) {
      recommendations.push(`Increase ${factor} activities (strong positive influence)`);
    } else if (netImpact < -5) {
      recommendations.push(`Reduce ${factor} activities (negative influence detected)`);
    }
  }
  
  return recommendations;
}

function getOptimalPhases(phaseStats) {
  return Object.entries(phaseStats)
    .sort((a, b) => b[1].average - a[1].average)
    .slice(0, 3)
    .map(([phase, stats]) => ({
      phase,
      averageCoherence: stats.average,
      reliability: stats.count > 10 ? 'high' : 'low'
    }));
}

// Integration with existing API storage
function syncWithStorage(app) {
  // Update analytics when storage changes
  if (app.locals?.storage) {
    const storage = app.locals.storage;
    
    // Override storage setter to sync with analytics
    const originalCoherence = storage.fieldCoherence;
    Object.defineProperty(storage, 'fieldCoherence', {
      get() { return originalCoherence; },
      set(value) {
        // Update analytics
        fieldAnalytics.recordMeasurement(value / 100, {
          source: 'storage-sync',
          agents: storage.agents?.size || 0,
          messages: storage.messages?.length || 0,
          activeWork: storage.work?.filter(w => w.status !== 'completed').length || 0
        });
        
        // Update storage
        Object.defineProperty(storage, 'fieldCoherence', {
          value,
          writable: true
        });
      }
    });
  }
}

module.exports = {
  fieldAnalyticsMiddleware,
  addAnalyticsEndpoints,
  syncWithStorage,
  fieldAnalytics
};