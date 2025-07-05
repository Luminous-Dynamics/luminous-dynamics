// Messages API Routes

import { Router } from 'express';

export function createMessageRouter(messageService, entityService) {
  const router = Router();
  
  // Send a message
  router.post('/', async (req, res) => {
    try {
      const { senderId, content, recipients, channelId, threadId, replyTo } = req.body;
      
      // Validate sender
      const sender = await entityService.get(senderId);
      if (!sender) {
        return res.status(404).json({ error: 'Sender not found' });
      }
      
      // Send message
      const message = await messageService.sendMessage(
        sender,
        content,
        recipients,
        channelId,
        { threadId, replyTo }
      );
      
      res.json({
        success: true,
        message: message.getDisplayFormat()
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });
  
  // Get channel messages
  router.get('/channel/:channelId', async (req, res) => {
    try {
      const { channelId } = req.params;
      const { limit = 50, before } = req.query;
      
      const messages = await messageService.getChannelMessages(
        channelId,
        parseInt(limit),
        before
      );
      
      res.json({
        messages: messages.map(m => m.getDisplayFormat()),
        hasMore: messages.length === parseInt(limit)
      });
      
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: 'Failed to get messages' });
    }
  });
  
  // Add reaction
  router.post('/:messageId/reactions', async (req, res) => {
    try {
      const { messageId } = req.params;
      const { entityId, type } = req.body;
      
      // Implementation would add reaction to database
      res.json({ success: true });
      
    } catch (error) {
      console.error('Error adding reaction:', error);
      res.status(500).json({ error: 'Failed to add reaction' });
    }
  });
  
  // Mark as read
  router.post('/:messageId/read', async (req, res) => {
    try {
      const { messageId } = req.params;
      const { entityId, coherence } = req.body;
      
      // Implementation would mark message as read
      res.json({ success: true });
      
    } catch (error) {
      console.error('Error marking as read:', error);
      res.status(500).json({ error: 'Failed to mark as read' });
    }
  });
  
  return router;
}