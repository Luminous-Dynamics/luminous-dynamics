// Message Service - Handles sacred message creation, routing, and field impact

import { SacredMessage, Harmonies } from '../models/SacredMessage.js';
import { v4 as uuidv4 } from 'uuid';

export class MessageService {
  constructor(db, coherenceService, fieldService, wisdomService) {
    this.db = db;
    this.coherenceService = coherenceService;
    this.fieldService = fieldService;
    this.wisdomService = wisdomService;
  }
  
  // Send a sacred message
  async sendMessage(sender, content, recipients = [], channelId = null, options = {}) {
    try {
      // 1. Measure sender resonant-coherence
      const resonantCoherence = await this.coherenceService.measure(sender.id);
      
      // 2. Analyze content for sacred metrics
      const sacred = await this.analyzeSacred(content, resonant-coherence);
      
      // 3. Create message
      const message = new SacredMessage({
        senderId: sender.id,
        senderName: sender.sacredName || sender.name,
        senderType: sender.type,
        senderCoherence: resonant-coherence,
        recipients,
        channelId,
        content,
        ...sacred,
        threadId: options.threadId,
        replyTo: options.replyTo
      });
      
      // 4. Calculate field impact
      message.calculateFieldImpact();
      
      // 5. Store message
      await this.storeMessage(message);
      
      // 6. Route to recipients
      await this.routeMessage(message, sender, recipients);
      
      // 7. Update field resonant-coherence
      await this.fieldService.updateFromMessage(message);
      
      // 8. Check for wisdom
      if (message.hasWisdomPotential()) {
        await this.wisdomService.extract(message);
      }
      
      // 9. Return enriched message
      return message;
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
  // Analyze content for sacred metrics
  async analyzeSacred(content, senderCoherence) {
    const sacred = {
      coherenceLevel: senderCoherence,
      harmony: await this.detectHarmony(content),
      fieldImpact: 0, // Calculated later
      loveQuotient: await this.measureLove(content),
      sacredGeometry: await this.generateGeometry(content)
    };
    
    return sacred;
  }
  
  // Detect harmony from content
  async detectHarmony(content) {
    const text = content.text.toLowerCase();
    const intention = (content.intentionStatement || '').toLowerCase();
    const combined = text + ' ' + intention;
    
    // Enhanced harmony detection
    const harmonyKeywords = {
      [Harmonies.TRANSPARENCY]: ['truth', 'honest', 'authentic', 'real', 'clear', 'open'],
      [Harmonies.COHERENCE]: ['together', 'unified', 'aligned', 'whole', 'integrated'],
      [Harmonies.RESONANCE]: ['feel', 'resonate', 'empathy', 'attune', 'sense', 'vibrate'],
      [Harmonies.AGENCY]: ['choose', 'empower', 'decide', 'create', 'sovereign', 'will'],
      [Harmonies.VITALITY]: ['alive', 'energy', 'vibrant', 'flow', 'dynamic', 'pulse'],
      [Harmonies.MUTUALITY]: ['share', 'exchange', 'reciprocate', 'balance', 'give', 'receive'],
      [Harmonies.NOVELTY]: ['new', 'emerge', 'transform', 'evolve', 'birth', 'innovation']
    };
    
    // Count keyword matches
    const scores = {};
    for (const [harmony, keywords] of Object.entries(harmonyKeywords)) {
      scores[harmony] = keywords.filter(keyword => combined.includes(keyword)).length;
    }
    
    // Find highest scoring harmony
    let maxScore = 0;
    let detectedHarmony = Harmonies.COHERENCE;
    
    for (const [harmony, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedHarmony = harmony;
      }
    }
    
    return detectedHarmony;
  }
  
  // Measure love quotient in content
  async measureLove(content) {
    const text = content.text.toLowerCase();
    const intention = (content.intentionStatement || '').toLowerCase();
    
    // Love indicators
    const loveWords = [
      'love', 'care', 'compassion', 'kindness', 'heart', 'soul',
      'grateful', 'appreciate', 'blessing', 'sacred', 'divine',
      'beauty', 'grace', 'gentle', 'tender', 'warm', 'embrace'
    ];
    
    const challengeWords = [
      'difficult', 'hard', 'struggle', 'pain', 'fear', 'anger',
      'frustration', 'conflict', 'problem', 'issue', 'concern'
    ];
    
    // Count love and challenge words
    const loveCount = loveWords.filter(word => text.includes(word)).length;
    const challengeCount = challengeWords.filter(word => text.includes(word)).length;
    
    // Clear intention adds to love quotient
    const intentionBonus = intention ? 0.1 : 0;
    
    // Calculate quotient (0-1 scale)
    const baseQuotient = loveCount / (loveCount + challengeCount + 1);
    const finalQuotient = Math.min(1, baseQuotient + intentionBonus);
    
    return finalQuotient;
  }
  
  // Generate sacred geometry pattern
  async generateGeometry(content) {
    // Simple pattern generation based on content length and harmony
    const patterns = [
      'flower-of-life',
      'sri-yantra',
      'metatrons-cube',
      'vesica-piscis',
      'golden-spiral',
      'seed-of-life',
      'tree-of-life'
    ];
    
    // Use content length to select pattern
    const index = content.text.length % patterns.length;
    return patterns[index];
  }
  
  // Store message in database
  async storeMessage(message) {
    const query = `
      INSERT INTO messages (
        id, sender_id, channel_id, thread_id, reply_to,
        content, intention_statement,
        sender_coherence, harmony, field_impact, love_quotient, sacred_geometry,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const values = [
      message.id,
      message.sender.id,
      message.channelId,
      message.thread.id,
      message.thread.replyTo,
      JSON.stringify(message.content),
      message.content.intentionStatement,
      message.sacred.coherenceLevel,
      message.sacred.harmony,
      message.sacred.fieldImpact,
      message.sacred.loveQuotient,
      message.sacred.sacredGeometry,
      message.timestamp
    ];
    
    await this.db.query(query, values);
    
    // Store recipients if any
    if (message.recipients.length > 0) {
      const recipientQuery = `
        INSERT INTO message_recipients (message_id, recipient_id)
        VALUES ($1, $2)
      `;
      
      for (const recipientId of message.recipients) {
        await this.db.query(recipientQuery, [message.id, recipientId]);
      }
    }
  }
  
  // Route message to recipients
  async routeMessage(message, sender, recipientIds) {
    // Get recipient entities
    const recipients = await this.getRecipients(recipientIds);
    
    for (const recipient of recipients) {
      // Check resonant-coherence-based routing
      const deliveryTime = await this.calculateOptimalDeliveryTime(recipient, message);
      
      if (deliveryTime === 'immediate') {
        await this.deliverImmediately(message, recipient);
      } else if (deliveryTime === 'queued') {
        await this.queueForOptimalDelivery(message, recipient);
      } else if (deliveryTime === 'held') {
        await this.holdForHigherCoherence(message, recipient);
      }
    }
  }
  
  // Get recipient entities
  async getRecipients(recipientIds) {
    if (!recipientIds || recipientIds.length === 0) return [];
    
    const query = `
      SELECT * FROM entities WHERE id = ANY($1)
    `;
    
    const result = await this.db.query(query, [recipientIds]);
    return result.rows;
  }
  
  // Calculate optimal delivery time based on recipient state
  async calculateOptimalDeliveryTime(recipient, message) {
    // Low resonant-coherence - wait for better state
    if (recipient.resonant-coherence < 30) {
      return 'held';
    }
    
    // In deep practice - queue for later
    if (['deep-practice', 'creative-flow'].includes(recipient.presence_state)) {
      return 'queued';
    }
    
    // High resonant-coherence or available - deliver now
    if (recipient.resonant-coherence > 70 || recipient.presence_state === 'available') {
      return 'immediate';
    }
    
    // Default to queued
    return 'queued';
  }
  
  // Deliver message immediately
  async deliverImmediately(message, recipient) {
    // Emit via WebSocket if connected
    this.emitToRecipient(recipient.id, 'new_message', message);
    
    // Store delivery record
    await this.recordDelivery(message.id, recipient.id, 'delivered');
  }
  
  // Queue message for optimal delivery
  async queueForOptimalDelivery(message, recipient) {
    // Store in delivery queue
    const optimalTime = await this.findOptimalDeliveryWindow(recipient);
    
    await this.db.query(`
      INSERT INTO message_queue (message_id, recipient_id, deliver_at, reason)
      VALUES ($1, $2, $3, $4)
    `, [message.id, recipient.id, optimalTime, 'recipient_in_practice']);
  }
  
  // Hold message until recipient resonant-coherence improves
  async holdForHigherCoherence(message, recipient) {
    await this.db.query(`
      INSERT INTO message_queue (message_id, recipient_id, deliver_at, reason)
      VALUES ($1, $2, NULL, $3)
    `, [message.id, recipient.id, 'low_coherence']);
  }
  
  // Find optimal delivery window
  async findOptimalDeliveryWindow(recipient) {
    // Analyze recipient patterns
    const patterns = await this.analyzeRecipientPatterns(recipient.id);
    
    // Find next high-resonant-coherence window
    const nextWindow = patterns.highCoherenceWindows[0];
    
    return nextWindow || new Date(Date.now() + 3600000); // Default to 1 hour
  }
  
  // Analyze recipient communication patterns
  async analyzeRecipientPatterns(recipientId) {
    // Simplified pattern analysis
    // In production, would analyze historical resonant-coherence data
    
    return {
      highCoherenceWindows: [
        new Date(Date.now() + 3600000), // 1 hour from now
        new Date(Date.now() + 7200000)  // 2 hours from now
      ],
      preferredTimes: ['morning', 'evening'],
      averageCoherence: 65
    };
  }
  
  // Record message delivery
  async recordDelivery(messageId, recipientId, status) {
    await this.db.query(`
      UPDATE message_recipients 
      SET read_at = $1, delivery_status = $2
      WHERE message_id = $3 AND recipient_id = $4
    `, [new Date(), status, messageId, recipientId]);
  }
  
  // Emit to recipient via WebSocket
  emitToRecipient(recipientId, event, data) {
    // This would integrate with WebSocket service
    console.log(`Emitting ${event} to ${recipientId}:`, data);
  }
  
  // Get messages for channel
  async getChannelMessages(channelId, limit = 50, before = null) {
    let query = `
      SELECT m.*, 
        e.name as sender_name, 
        e.sacred_name as sender_sacred_name,
        e.type as sender_type
      FROM messages m
      JOIN entities e ON m.sender_id = e.id
      WHERE m.channel_id = $1
    `;
    
    const params = [channelId];
    
    if (before) {
      query += ` AND m.created_at < $2`;
      params.push(before);
    }
    
    query += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await this.db.query(query, params);
    
    // Convert to SacredMessage instances
    const messages = [];
    for (const row of result.rows) {
      const reactions = await this.getMessageReactions(row.id);
      const readReceipts = await this.getMessageReadReceipts(row.id);
      
      const message = SacredMessage.fromDB(row, reactions, readReceipts);
      message.sender.name = row.sender_sacred_name || row.sender_name;
      message.sender.type = row.sender_type;
      
      messages.push(message);
    }
    
    return messages.reverse(); // Return in chronological order
  }
  
  // Get message reactions
  async getMessageReactions(messageId) {
    const result = await this.db.query(`
      SELECT * FROM reactions WHERE message_id = $1
    `, [messageId]);
    
    return result.rows;
  }
  
  // Get message read receipts
  async getMessageReadReceipts(messageId) {
    const result = await this.db.query(`
      SELECT * FROM message_recipients WHERE message_id = $1 AND read_at IS NOT NULL
    `, [messageId]);
    
    return result.rows.map(row => ({
      entityId: row.recipient_id,
      readAt: row.read_at,
      coherenceOnRead: row.coherence_on_read
    }));
  }
}