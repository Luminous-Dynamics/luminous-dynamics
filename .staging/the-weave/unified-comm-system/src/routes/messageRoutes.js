import { Router } from 'express';
import MessageService from '../services/MessageService.js';

const router = Router();
const messageService = new MessageService();

// Get messages with filters
router.get('/', async (req, res) => {
  try {
    const { channel, type, sender_id, limit = 50, offset = 0 } = req.query;
    
    const filters = {};
    if (channel) filters.channel = channel;
    if (type) filters.type = type;
    if (sender_id) filters.sender_id = sender_id;
    
    const messages = await messageService.getMessages(filters, parseInt(limit), parseInt(offset));
    
    res.json({
      messages,
      count: messages.length,
      filters
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await messageService.getMessageById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new message
router.post('/', async (req, res) => {
  try {
    const message = await messageService.createMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get message statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await messageService.getMessageStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;