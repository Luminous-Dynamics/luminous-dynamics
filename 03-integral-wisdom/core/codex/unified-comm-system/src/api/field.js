// Field API Routes - Sacred field state and metrics

import { Router } from 'express';

export function createFieldRouter(fieldService) {
  const router = Router();
  
  // Get current field state
  router.get('/', async (req, res) => {
    try {
      const fieldState = await fieldService.getCurrentState();
      const metrics = await fieldService.getFieldMetrics();
      
      res.json({
        state: fieldState,
        metrics
      });
      
    } catch (error) {
      console.error('Error getting field state:', error);
      res.status(500).json({ error: 'Failed to get field state' });
    }
  });
  
  // Get field metrics
  router.get('/metrics', async (req, res) => {
    try {
      const metrics = await fieldService.getFieldMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Error getting field metrics:', error);
      res.status(500).json({ error: 'Failed to get field metrics' });
    }
  });
  
  // Apply practitioner influence
  router.post('/influence', async (req, res) => {
    try {
      const { practitionerId, action } = req.body;
      
      await fieldService.applyPractitionerInfluence(practitionerId, action);
      const newState = await fieldService.getCurrentState();
      
      res.json({
        success: true,
        fieldState: newState
      });
      
    } catch (error) {
      console.error('Error applying influence:', error);
      res.status(500).json({ error: 'Failed to apply influence' });
    }
  });
  
  // Get entity field impact
  router.get('/impact/:entityId', async (req, res) => {
    try {
      const impact = await fieldService.calculateEntityFieldImpact(req.params.entityId);
      
      res.json({
        entityId: req.params.entityId,
        fieldImpact: impact,
        level: impact < 10 ? 'seed' : impact < 50 ? 'growing' : impact < 100 ? 'flowering' : 'master'
      });
      
    } catch (error) {
      console.error('Error calculating impact:', error);
      res.status(500).json({ error: 'Failed to calculate impact' });
    }
  });
  
  // Get field history
  router.get('/history', async (req, res) => {
    try {
      const { hours = 24 } = req.query;
      
      const result = await fieldService.db.query(`
        SELECT * FROM field_state
        WHERE recorded_at > NOW() - INTERVAL '${parseInt(hours)} hours'
        ORDER BY recorded_at DESC
      `);
      
      res.json({
        history: result.rows,
        timespan: `${hours} hours`
      });
      
    } catch (error) {
      console.error('Error getting field history:', error);
      res.status(500).json({ error: 'Failed to get field history' });
    }
  });
  
  return router;
}