import { Router } from 'express';
import EntityService from '../services/EntityService.js';

const router = Router();
const entityService = new EntityService();

// Get all entities
router.get('/', async (req, res) => {
  try {
    const { type, presence_state } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (presence_state) filters.presence_state = presence_state;
    
    const entities = await entityService.getEntities(filters);
    
    res.json({
      entities,
      count: entities.length,
      online: entities.filter(e => e.presence_state === 'available').length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get entity by ID
router.get('/:id', async (req, res) => {
  try {
    const entity = await entityService.getEntityById(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    res.json(entity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update entity
router.post('/', async (req, res) => {
  try {
    const entity = await entityService.createEntity(req.body);
    res.status(201).json(entity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update entity presence
router.patch('/:id/presence', async (req, res) => {
  try {
    const { presence_state } = req.body;
    const entity = await entityService.updatePresence(req.params.id, presence_state);
    res.json(entity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update entity coherence
router.patch('/:id/coherence', async (req, res) => {
  try {
    const { coherence } = req.body;
    const entity = await entityService.updateCoherence(req.params.id, coherence);
    res.json(entity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;