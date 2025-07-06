/**
 * Sacred Messaging Module
 * Consciousness-aware message types and field impacts
 * @module @theweave/sacred-messaging
 */

const EventEmitter = require('events');
const { MessageTypes } = require('./lib/message-types');
const { FieldImpactCalculator } = require('./lib/field-impact');
const { MessageValidator } = require('./lib/message-validator');

/**
 * Sacred messaging system
 * @sacred
 * @harmony universal-interconnectedness
 * @consciousness 0.8
 */
class SacredMessaging extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.messageTypes = new MessageTypes();
    this.impactCalculator = new FieldImpactCalculator();
    this.validator = new MessageValidator();
    
    // Message history for field evolution tracking
    this.messageHistory = [];
    this.maxHistory = options.maxHistory || 1000;
    
    // Progressive revelation thresholds
    this.practitionerThreshold = options.practitionerThreshold || 50;
    this.masterThreshold = options.masterThreshold || 200;
  }

  /**
   * Get available message types based on sender's evolution
   * @param {string} agentId - Sender's agent ID
   * @returns {Array} Available message types
   */
  async getAvailableTypes(agentId) {
    const messageCount = this.getAgentMessageCount(agentId);
    const level = this.getEvolutionLevel(messageCount);
    
    return this.messageTypes.getTypesForLevel(level);
  }

  /**
   * Create a sacred message
   * @param {Object} params - Message parameters
   * @returns {Object} Sacred message object
   */
  async createMessage(params) {
    const {
      from,
      to,
      type,
      harmony,
      content,
      metadata = {}
    } = params;
    
    // Validate message type
    const messageType = this.messageTypes.get(type);
    if (!messageType) {
      throw new Error(`Unknown message type: ${type}`);
    }
    
    // Validate harmony
    if (!this.validator.isValidHarmony(harmony)) {
      throw new Error(`Invalid harmony: ${harmony}`);
    }
    
    // Calculate field impact
    const impact = await this.calculateImpact(from, type, harmony);
    
    // Create sacred message
    const message = {
      id: this.generateMessageId(),
      from_agent: from,
      to_agent: to,
      message_type: type,
      content: content,
      timestamp: Date.now(),
      sacred: {
        type: type,
        harmony: harmony,
        impact: impact,
        'universal-interconnectedness': messageType.universal-interconnectedness,
        healing: messageType.healing || false
      },
      metadata: {
        ...metadata,
        evolution_level: this.getEvolutionLevel(this.getAgentMessageCount(from))
      }
    };
    
    // Validate complete message
    if (!this.validator.validate(message)) {
      throw new Error('Message validation failed');
    }
    
    // Add to history
    this.addToHistory(message);
    
    // Emit creation event
    this.emit('message-created', message);
    
    return message;
  }

  /**
   * Calculate field impact of a message
   * @private
   */
  async calculateImpact(agentId, type, harmony) {
    const messageCount = this.getAgentMessageCount(agentId);
    const level = this.getEvolutionLevel(messageCount);
    
    return this.impactCalculator.calculate({
      type,
      harmony,
      level,
      messageCount,
      recentMessages: this.getRecentMessages(agentId, 10)
    });
  }

  /**
   * Get agent's evolution level
   * @private
   */
  getEvolutionLevel(messageCount) {
    if (messageCount >= this.masterThreshold) return 'master';
    if (messageCount >= this.practitionerThreshold) return 'practitioner';
    return 'beginner';
  }

  /**
   * Get count of messages sent by agent
   * @private
   */
  getAgentMessageCount(agentId) {
    return this.messageHistory.filter(m => m.from_agent === agentId).length;
  }

  /**
   * Get recent messages from agent
   * @private
   */
  getRecentMessages(agentId, count) {
    return this.messageHistory
      .filter(m => m.from_agent === agentId)
      .slice(-count);
  }

  /**
   * Add message to history
   * @private
   */
  addToHistory(message) {
    this.messageHistory.push(message);
    
    // Maintain max history size
    if (this.messageHistory.length > this.maxHistory) {
      this.messageHistory = this.messageHistory.slice(-this.maxHistory);
    }
  }

  /**
   * Generate unique message ID
   * @private
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get field recommendations based on current state
   * @param {Object} fieldState - Current field state
   * @returns {Array} Recommended message types
   */
  getFieldRecommendations(fieldState) {
    const recommendations = [];
    
    // Low resonant-coherence - recommend healing or integration
    if (fieldState['resonant-coherence'] < 30) {
      recommendations.push({
        type: 'healing',
        reason: 'Field resonant-coherence is low, healing messages can restore balance',
        impact: '+6%'
      });
    }
    
    // High resonant-coherence - recommend celebration or emergence
    if (fieldState['resonant-coherence'] > 80) {
      recommendations.push({
        type: 'celebration',
        reason: 'Field resonant-coherence is high, time to celebrate achievements',
        impact: '+4%'
      });
    }
    
    // Multiple agents - recommend universal-interconnectedness or weaving
    if (fieldState.agents > 3) {
      recommendations.push({
        type: 'weaving',
        reason: 'Multiple agents present, weaving can strengthen connections',
        impact: '+5%'
      });
    }
    
    return recommendations;
  }

  /**
   * Analyze message patterns
   * @returns {Object} Pattern analysis
   */
  analyzePatterns() {
    const patterns = {
      totalMessages: this.messageHistory.length,
      typeDistribution: {},
      harmonyDistribution: {},
      evolutionProgress: {},
      fieldImpactTrend: []
    };
    
    // Analyze type distribution
    this.messageHistory.forEach(msg => {
      patterns.typeDistribution[msg.sacred.type] = 
        (patterns.typeDistribution[msg.sacred.type] || 0) + 1;
      
      patterns.harmonyDistribution[msg.sacred.harmony] = 
        (patterns.harmonyDistribution[msg.sacred.harmony] || 0) + 1;
    });
    
    // Calculate field impact trend
    const recentMessages = this.messageHistory.slice(-50);
    patterns.fieldImpactTrend = recentMessages.map(m => ({
      timestamp: m.timestamp,
      impact: m.sacred.impact
    }));
    
    return patterns;
  }
}

// Export everything needed
module.exports = {
  SacredMessaging,
  MessageTypes,
  FieldImpactCalculator,
  MessageValidator
};