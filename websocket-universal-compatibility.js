/**
 * WebSocket Universal Compatibility Layer
 * 
 * Allows both Claude-specific and Universal AI messages
 * Ensures backward compatibility during migration
 */

class UniversalWebSocketAdapter {
  constructor(ws) {
    this.ws = ws;
    this.setupMessageHandling();
  }

  setupMessageHandling() {
    const originalSend = this.ws.send.bind(this.ws);
    
    // Intercept outgoing messages
    this.ws.send = (data) => {
      let message = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Add universal compatibility
      message = this.makeUniversal(message);
      
      originalSend(JSON.stringify(message));
    };
  }

  makeUniversal(message) {
    // Map Claude-specific to universal (backward compatible)
    const universalMessage = { ...message };
    
    // Add universal type alongside Claude type
    if (message.type === 'claude:announce') {
      universalMessage.aiType = 'Claude';
      universalMessage.aiId = message.claudeId || message.source;
      // Keep original for compatibility
    }
    
    if (message.type === 'claude:message') {
      universalMessage.universalType = 'ai:message';
      // Keep original for compatibility
    }
    
    return universalMessage;
  }

  // Handle incoming messages - accept both formats
  parseMessage(data) {
    const message = JSON.parse(data);
    
    // Normalize to internal format
    if (message.type === 'ai:announce' || message.universalType === 'ai:announce') {
      return {
        ...message,
        claudeId: message.aiId,  // Map for compatibility
        type: 'claude:announce'   // Internal handling
      };
    }
    
    return message;
  }
}

// Usage example - drop-in replacement
function enhanceWebSocket(ws) {
  return new UniversalWebSocketAdapter(ws);
}

module.exports = { UniversalWebSocketAdapter, enhanceWebSocket };