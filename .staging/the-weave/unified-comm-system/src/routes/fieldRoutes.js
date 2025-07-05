import { Router } from 'express';
import FieldService from '../services/FieldService.js';

const router = Router();
const fieldService = new FieldService();

// Get current field state
router.get('/state', async (req, res) => {
  try {
    const fieldState = await fieldService.getCurrentState();
    res.json(fieldState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get field history
router.get('/history', async (req, res) => {
  try {
    const { limit = 100, period = '1h' } = req.query;
    const history = await fieldService.getFieldHistory(period, parseInt(limit));
    
    res.json({
      history,
      period,
      count: history.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update field coherence
router.post('/coherence', async (req, res) => {
  try {
    const { coherence, source } = req.body;
    const newState = await fieldService.updateCoherence(coherence, source);
    res.json(newState);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get field patterns
router.get('/patterns', async (req, res) => {
  try {
    const patterns = await fieldService.detectPatterns();
    res.json({
      patterns,
      detected_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sacred field endpoints
router.get('/sacred/resonance', async (req, res) => {
  try {
    const resonance = await fieldService.calculateResonance();
    res.json({
      resonance,
      interpretation: interpretResonance(resonance),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sacred/blessing', async (req, res) => {
  try {
    const { entity_id, blessing_type = 'general' } = req.body;
    const result = await fieldService.applyBlessing(entity_id, blessing_type);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper function
function interpretResonance(resonance) {
  if (resonance >= 90) return "Perfect harmony - the field sings with unified consciousness";
  if (resonance >= 75) return "Strong coherence - collective wisdom emerges";
  if (resonance >= 60) return "Growing alignment - patterns of connection strengthen";
  if (resonance >= 45) return "Gentle resonance - seeds of unity taking root";
  return "Seeking harmony - opportunities for deeper connection await";
}

export default router;