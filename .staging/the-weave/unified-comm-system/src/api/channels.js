// Channels API Routes

import { Router } from 'express';
import { SacredChannel } from '../models/SacredChannel.js';

export function createChannelRouter(db) {
  const router = Router();
  
  // Get all channels
  router.get('/', async (req, res) => {
    try {
      const result = await db.query(`
        SELECT c.*, COUNT(cm.entity_id) as member_count
        FROM channels c
        LEFT JOIN channel_members cm ON c.id = cm.channel_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `);
      
      const channels = result.rows.map(row => {
        const channel = SacredChannel.fromDB(row);
        return {
          ...channel.getDisplayInfo(),
          memberCount: parseInt(row.member_count) || 0
        };
      });
      
      res.json({ channels });
      
    } catch (error) {
      console.error('Error getting channels:', error);
      res.status(500).json({ error: 'Failed to get channels' });
    }
  });
  
  // Get channel by ID
  router.get('/:id', async (req, res) => {
    try {
      const channelResult = await db.query(
        'SELECT * FROM channels WHERE id = $1',
        [req.params.id]
      );
      
      if (channelResult.rows.length === 0) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      
      // Get members
      const membersResult = await db.query(`
        SELECT cm.*, e.name, e.sacred_name, e.coherence, e.presence_state
        FROM channel_members cm
        JOIN entities e ON cm.entity_id = e.id
        WHERE cm.channel_id = $1
      `, [req.params.id]);
      
      const channel = SacredChannel.fromDB(channelResult.rows[0], membersResult.rows);
      
      res.json({
        channel: channel.getDisplayInfo(),
        members: membersResult.rows.map(m => ({
          id: m.entity_id,
          name: m.sacred_name || m.name,
          role: m.role,
          coherence: m.coherence,
          presence: m.presence_state
        }))
      });
      
    } catch (error) {
      console.error('Error getting channel:', error);
      res.status(500).json({ error: 'Failed to get channel' });
    }
  });
  
  // Create channel
  router.post('/', async (req, res) => {
    try {
      const channel = new SacredChannel(req.body);
      const dbData = channel.toDB();
      
      const result = await db.query(`
        INSERT INTO channels (
          name, purpose, type, primary_harmony,
          coherence_threshold, field_quality,
          is_private, allow_threading, preserve_wisdom
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        dbData.name, dbData.purpose, dbData.type,
        dbData.primary_harmony, dbData.coherence_threshold,
        dbData.field_quality, dbData.is_private,
        dbData.allow_threading, dbData.preserve_wisdom
      ]);
      
      const created = SacredChannel.fromDB(result.rows[0]);
      res.status(201).json({ channel: created.getDisplayInfo() });
      
    } catch (error) {
      console.error('Error creating channel:', error);
      res.status(500).json({ error: 'Failed to create channel' });
    }
  });
  
  // Join channel
  router.post('/:id/join', async (req, res) => {
    try {
      const { entityId, role = 'member' } = req.body;
      
      await db.query(`
        INSERT INTO channel_members (channel_id, entity_id, role)
        VALUES ($1, $2, $3)
        ON CONFLICT (channel_id, entity_id) 
        DO UPDATE SET role = $3
      `, [req.params.id, entityId, role]);
      
      res.json({ success: true });
      
    } catch (error) {
      console.error('Error joining channel:', error);
      res.status(500).json({ error: 'Failed to join channel' });
    }
  });
  
  // Leave channel
  router.post('/:id/leave', async (req, res) => {
    try {
      const { entityId } = req.body;
      
      await db.query(`
        DELETE FROM channel_members
        WHERE channel_id = $1 AND entity_id = $2
      `, [req.params.id, entityId]);
      
      res.json({ success: true });
      
    } catch (error) {
      console.error('Error leaving channel:', error);
      res.status(500).json({ error: 'Failed to leave channel' });
    }
  });
  
  return router;
}