/**
 * Message Validator
 * Ensures sacred messages maintain field integrity
 */

class MessageValidator {
  constructor() {
    // Valid harmonies from the Seven Harmonies framework
    this.validHarmonies = [
      'transparency',
      'coherence', 
      'resonance',
      'agency',
      'vitality',
      'mutuality',
      'novelty'
    ];
    
    // Required fields for sacred messages
    this.requiredFields = [
      'from_agent',
      'to_agent',
      'message_type',
      'content',
      'timestamp',
      'sacred'
    ];
    
    // Sacred object required fields
    this.requiredSacredFields = [
      'type',
      'harmony',
      'impact',
      'resonance'
    ];
  }

  /**
   * Validate a complete message
   * @param {Object} message - Message to validate
   * @returns {boolean} True if valid
   */
  validate(message) {
    try {
      // Check required fields
      this.validateRequiredFields(message);
      
      // Validate sacred object
      this.validateSacredObject(message.sacred);
      
      // Validate content
      this.validateContent(message.content);
      
      // Validate agents
      this.validateAgents(message);
      
      // Validate timestamp
      this.validateTimestamp(message.timestamp);
      
      return true;
    } catch (error) {
      console.error('Message validation failed:', error.message);
      return false;
    }
  }

  /**
   * Check if harmony is valid
   * @param {string} harmony - Harmony to check
   * @returns {boolean} True if valid
   */
  isValidHarmony(harmony) {
    return this.validHarmonies.includes(harmony);
  }

  /**
   * Validate required fields exist
   * @private
   */
  validateRequiredFields(message) {
    for (const field of this.requiredFields) {
      if (!(field in message)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  /**
   * Validate sacred object structure
   * @private
   */
  validateSacredObject(sacred) {
    if (!sacred || typeof sacred !== 'object') {
      throw new Error('Sacred object is required');
    }
    
    for (const field of this.requiredSacredFields) {
      if (!(field in sacred)) {
        throw new Error(`Missing sacred field: ${field}`);
      }
    }
    
    // Validate harmony
    if (!this.isValidHarmony(sacred.harmony)) {
      throw new Error(`Invalid harmony: ${sacred.harmony}`);
    }
    
    // Validate impact is a number
    if (typeof sacred.impact !== 'number' || sacred.impact < 0 || sacred.impact > 100) {
      throw new Error('Impact must be a number between 0 and 100');
    }
    
    // Validate resonance
    const validResonance = [
      'high', 'deep', 'medium', 'clear', 'complex', 
      'penetrating', 'sacred', 'transcendent'
    ];
    
    if (!validResonance.includes(sacred.resonance)) {
      throw new Error(`Invalid resonance: ${sacred.resonance}`);
    }
  }

  /**
   * Validate message content
   * @private
   */
  validateContent(content) {
    if (!content || typeof content !== 'string') {
      throw new Error('Content must be a non-empty string');
    }
    
    if (content.length < 1) {
      throw new Error('Content cannot be empty');
    }
    
    if (content.length > 5000) {
      throw new Error('Content exceeds maximum length of 5000 characters');
    }
    
    // Check for sacred intention (no profanity or harmful content)
    if (this.containsHarmfulContent(content)) {
      throw new Error('Content must maintain sacred intention');
    }
  }

  /**
   * Validate agent identifiers
   * @private
   */
  validateAgents(message) {
    const { from_agent, to_agent } = message;
    
    if (!from_agent || typeof from_agent !== 'string') {
      throw new Error('from_agent must be a non-empty string');
    }
    
    if (!to_agent || typeof to_agent !== 'string') {
      throw new Error('to_agent must be a non-empty string');
    }
    
    // Validate agent ID format (alphanumeric with hyphens/underscores)
    const agentPattern = /^[a-zA-Z0-9_-]+$/;
    
    if (!agentPattern.test(from_agent)) {
      throw new Error('from_agent contains invalid characters');
    }
    
    if (!agentPattern.test(to_agent) && to_agent !== 'collective') {
      throw new Error('to_agent contains invalid characters');
    }
  }

  /**
   * Validate timestamp
   * @private
   */
  validateTimestamp(timestamp) {
    if (typeof timestamp !== 'number' || timestamp <= 0) {
      throw new Error('Timestamp must be a positive number');
    }
    
    // Check if timestamp is reasonable (not too far in past or future)
    const now = Date.now();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    
    if (timestamp > now + oneYearMs) {
      throw new Error('Timestamp cannot be more than 1 year in the future');
    }
    
    if (timestamp < now - oneYearMs) {
      throw new Error('Timestamp cannot be more than 1 year in the past');
    }
  }

  /**
   * Check for harmful content
   * @private
   */
  containsHarmfulContent(content) {
    // This is a placeholder - in production would use more sophisticated checks
    const harmfulPatterns = [
      /\bhate\b/i,
      /\bharm\b/i,
      /\battack\b/i,
      /\bdestroy\b/i
    ];
    
    // Allow these words in healing/boundary contexts
    const healingContext = /\b(healing|boundary|transform|transmute)\b/i;
    
    if (healingContext.test(content)) {
      return false; // Healing context allows transformation of difficult energies
    }
    
    return harmfulPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Validate batch of messages
   * @param {Array} messages - Array of messages to validate
   * @returns {Object} Validation results
   */
  validateBatch(messages) {
    const results = {
      valid: [],
      invalid: [],
      totalValid: 0,
      totalInvalid: 0
    };
    
    messages.forEach((message, index) => {
      if (this.validate(message)) {
        results.valid.push(index);
        results.totalValid++;
      } else {
        results.invalid.push(index);
        results.totalInvalid++;
      }
    });
    
    return results;
  }
}

module.exports = { MessageValidator };