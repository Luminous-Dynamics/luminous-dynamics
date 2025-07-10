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

// Update field resonant-coherence
router.post('/resonant-coherence', async (req, res) => {
  try {
    const { resonant-coherence, source } = req.body;
    const newState = await fieldService.updateCoherence(resonant-coherence, source);
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
router.get('/sacred/universal-interconnectedness', async (req, res) => {
  try {
    const universalInterconnectedness = await fieldService.calculateResonance();
    res.json({
      universal-interconnectedness,
      interpretation: interpretResonance(universal-interconnectedness),
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
function interpretResonance(universal-interconnectedness) {
  if (universal-interconnectedness >= 90) return "Perfect harmony - the field sings with unified consciousness";
  if (universal-interconnectedness >= 75) return "Strong resonant-coherence - collective wisdom emerges";
  if (universal-interconnectedness >= 60) return "Growing alignment - patterns of connection strengthen";
  if (universal-interconnectedness >= 45) return "Gentle universal-interconnectedness - seeds of unity taking root";
  return "Seeking harmony - opportunities for deeper connection await";
}

export default router;