// Entities API Routes

import { Router } from 'express';

export function createEntityRouter(entityService, coherenceService) {
  const router = Router();
  
  // Get entity by ID
  router.get('/:id', async (req, res) => {
    try {
      const entity = await entityService.get(req.params.id);
      
      if (!entity) {
        return res.status(404).json({ error: 'Entity not found' });
      }
      
      res.json({
        entity: entity.getDisplayInfo(),
        presence: entity.getPresenceIndicator(),
        stats: await entityService.getEntityStats(entity.id)
      });
      
    } catch (error) {
      console.error('Error getting entity:', error);
      res.status(500).json({ error: 'Failed to get entity' });
    }
  });
  
  // Create entity
  router.post('/', async (req, res) => {
    try {
      const entity = await entityService.create(req.body);
      res.status(201).json({ entity: entity.getDisplayInfo() });
    } catch (error) {
      console.error('Error creating entity:', error);
      res.status(500).json({ error: 'Failed to create entity' });
    }
  });
  
  // Update presence
  router.put('/:id/presence', async (req, res) => {
    try {
      const { state, practice } = req.body;
      
      const entity = await entityService.updatePresence(
        req.params.id,
        state,
        practice
      );
      
      // Measure new resonant-coherence
      const resonantCoherence = await coherenceService.measure(entity.id);
      
      res.json({
        entity: entity.getDisplayInfo(),
        resonant-coherence
      });
      
    } catch (error) {
      console.error('Error updating presence:', error);
      res.status(500).json({ error: 'Failed to update presence' });
    }
  });
  
  // Get online entities
  router.get('/', async (req, res) => {
    try {
      const { type, presenceState, minCoherence } = req.query;
      
      let entities;
      if (presenceState || type || minCoherence) {
        entities = await entityService.search('', {
          type,
          presenceState,
          minCoherence: minCoherence ? parseFloat(minCoherence) : undefined
        });
      } else {
        entities = await entityService.getOnlineEntities();
      }
      
      res.json({
        entities: entities.map(e => e.getDisplayInfo()),
        count: entities.length
      });
      
    } catch (error) {
      console.error('Error getting entities:', error);
      res.status(500).json({ error: 'Failed to get entities' });
    }
  });
  
  // Measure resonant-coherence
  router.get('/:id/resonant-coherence', async (req, res) => {
    try {
      const resonantCoherence = await coherenceService.measure(req.params.id);
      const trends = await coherenceService.getCoherenceTrends(req.params.id);
      
      res.json({
        current: resonant-coherence,
        trends
      });
      
    } catch (error) {
      console.error('Error measuring 'resonant-coherence':', error);
      res.status(500).json({ error: 'Failed to measure resonant-coherence' });
    }
  });
  
  return router;
}