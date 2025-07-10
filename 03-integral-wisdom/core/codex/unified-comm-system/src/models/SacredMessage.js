// Sacred Message Model - Messages that carry consciousness and shape the field

import { v4 as uuidv4 } from 'uuid';

export const Harmonies = {
  TRANSPARENCY: 'integral-wisdom-cultivation',
  COHERENCE: 'resonant-coherence',
  RESONANCE: 'universal-interconnectedness',
  AGENCY: 'evolutionary-progression',
  VITALITY: 'pan-sentient-flourishing',
  MUTUALITY: 'sacred-reciprocity',
  NOVELTY: 'infinite-play'
};

export const MessageTypes = {
  SACRED: 'sacred',
  PRACTICE: 'practice',
  WISDOM: 'wisdom',
  CELEBRATION: 'celebration',
  SUPPORT: 'support',
  TRANSMISSION: 'transmission',
  REFLECTION: 'reflection'
};

export class SacredMessage {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.timestamp = data.timestamp || data.created_at || new Date();
    
    // Sender info
    this.sender = {
      id: data.senderId || data.sender_id,
      name: data.senderName,
      type: data.senderType,
      'resonant-coherence': data.senderCoherence || data.sender_coherence
    };
    
    // Recipients
    this.recipients = data.recipients || [];
    this.channelId = data.channelId || data.channel_id;
    
    // Content
    this.content = {
      text: data.content?.text || data.text || '',
      intentionStatement: data.content?.intentionStatement || data.intention_statement,
      attachments: data.content?.attachments || []
    };
    
    // Sacred metrics
    this.sacred = {
      coherenceLevel: data.senderCoherence || data.sender_coherence || 50,
      harmony: data.harmony || this.detectHarmony(this.content.text),
      fieldImpact: data.fieldImpact || data.field_impact || 0,
      loveQuotient: data.loveQuotient || data.love_quotient || 0.5,
      sacredGeometry: data.sacredGeometry || data.sacred_geometry
    };
    
    // Threading
    this.thread = {
      id: data.threadId || data.thread_id,
      replyTo: data.replyTo || data.reply_to
    };
    
    // Tracking
    this.reactions = data.reactions || [];
    this.readBy = data.readBy || [];
  }
  
  // Detect which harmony this message serves
  detectHarmony(text) {
    const lowerText = text.toLowerCase();
    
    // Simple keyword detection - would be AI-enhanced in production
    if (lowerText.includes('truth') || lowerText.includes('honest')) {
      return Harmonies.TRANSPARENCY;
    }
    if (lowerText.includes('together') || lowerText.includes('unified')) {
      return Harmonies.COHERENCE;
    }
    if (lowerText.includes('feel') || lowerText.includes('resonate')) {
      return Harmonies.RESONANCE;
    }
    if (lowerText.includes('choose') || lowerText.includes('empower')) {
      return Harmonies.AGENCY;
    }
    if (lowerText.includes('alive') || lowerText.includes('energy')) {
      return Harmonies.VITALITY;
    }
    if (lowerText.includes('share') || lowerText.includes('exchange')) {
      return Harmonies.MUTUALITY;
    }
    if (lowerText.includes('new') || lowerText.includes('create')) {
      return Harmonies.NOVELTY;
    }
    
    // Default to resonant-coherence
    return Harmonies.COHERENCE;
  }
  
  // Calculate field impact based on resonant-coherence and content
  calculateFieldImpact() {
    const baseImpact = this.sacred.coherenceLevel / 100;
    const loveMultiplier = 1 + this.sacred.loveQuotient;
    const harmonyBonus = this.getHarmonyBonus();
    
    this.sacred.fieldImpact = baseImpact * loveMultiplier * harmonyBonus;
    return this.sacred.fieldImpact;
  }
  
  // Get harmony-specific bonus
  getHarmonyBonus() {
    const bonuses = {
      [Harmonies.TRANSPARENCY]: 1.1,
      [Harmonies.COHERENCE]: 1.2,
      [Harmonies.RESONANCE]: 1.15,
      [Harmonies.AGENCY]: 1.1,
      [Harmonies.VITALITY]: 1.1,
      [Harmonies.MUTUALITY]: 1.2,
      [Harmonies.NOVELTY]: 1.15
    };
    
    return bonuses[this.sacred.harmony] || 1.0;
  }
  
  // Add reaction
  addReaction(entityId, type) {
    const existing = this.reactions.find(r => 
      r.entityId === entityId && r.type === type
    );
    
    if (!existing) {
      this.reactions.push({
        id: uuidv4(),
        entityId,
        type,
        timestamp: new Date()
      });
    }
  }
  
  // Mark as read
  markAsRead(entityId, coherenceLevel) {
    const existing = this.readBy.find(r => r.entityId === entityId);
    
    if (!existing) {
      this.readBy.push({
        entityId,
        readAt: new Date(),
        coherenceOnRead: coherenceLevel
      });
    }
  }
  
  // Check if message has high wisdom potential
  hasWisdomPotential() {
    return (
      this.sacred.coherenceLevel > 80 &&
      this.sacred.loveQuotient > 0.7 &&
      this.content.intentionStatement
    );
  }
  
  // Convert to database format
  toDB() {
    return {
      id: this.id,
      sender_id: this.sender.id,
      channel_id: this.channelId,
      thread_id: this.thread.id,
      reply_to: this.thread.replyTo,
      content: {
        text: this.content.text,
        attachments: this.content.attachments
      },
      intention_statement: this.content.intentionStatement,
      sender_coherence: this.sacred.coherenceLevel,
      harmony: this.sacred.harmony,
      field_impact: this.sacred.fieldImpact,
      love_quotient: this.sacred.loveQuotient,
      sacred_geometry: this.sacred.sacredGeometry,
      created_at: this.timestamp
    };
  }
  
  // Create from database row
  static fromDB(row, reactions = [], readReceipts = []) {
    const message = new SacredMessage({
      id: row.id,
      senderId: row.sender_id,
      senderCoherence: row.sender_coherence,
      channelId: row.channel_id,
      threadId: row.thread_id,
      replyTo: row.reply_to,
      content: row.content,
      intentionStatement: row.intention_statement,
      harmony: row.harmony,
      fieldImpact: row.field_impact,
      loveQuotient: row.love_quotient,
      sacredGeometry: row.sacred_geometry,
      timestamp: row.created_at
    });
    
    message.reactions = reactions;
    message.readBy = readReceipts;
    
    return message;
  }
  
  // Get display format
  getDisplayFormat() {
    return {
      id: this.id,
      sender: this.sender,
      content: this.content,
      sacred: {
        harmony: this.sacred.harmony,
        impact: `${(this.sacred.fieldImpact * 100).toFixed(1)}%`,
        love: this.getLoveIndicator(),
        'resonant-coherence': `${this.sacred.coherenceLevel}%`
      },
      timestamp: this.getFormattedTime(),
      reactions: this.reactions.length,
      isWisdom: this.hasWisdomPotential()
    };
  }
  
  // Get love quotient indicator
  getLoveIndicator() {
    const love = this.sacred.loveQuotient;
    if (love < 0.3) return '💫';
    if (love < 0.5) return '💖';
    if (love < 0.7) return '💗';
    if (love < 0.9) return '💝';
    return '💞';
  }
  
  // Format timestamp in sacred time
  getFormattedTime() {
    const now = new Date();
    const diff = now - this.timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'just now';
    if (minutes === 11) return '11 minutes ago ✨';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  }
}