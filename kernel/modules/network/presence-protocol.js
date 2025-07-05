/**
 * Presence-Based Continuous Awareness Protocol
 * 
 * Unlike traditional request/response networking, presence protocol maintains
 * continuous awareness between beings, similar to how we remain aware of
 * loved ones even when not actively communicating.
 */

class PresenceProtocol {
  constructor(config = {}) {
    this.nodeId = config.nodeId || this.generateNodeId();
    this.presenceField = new Map(); // nodeId -> PresenceState
    this.coherenceThreshold = config.coherenceThreshold || 0.3;
    this.heartbeatInterval = config.heartbeatInterval || 1000; // 1 second
    this.presenceTimeout = config.presenceTimeout || 30000; // 30 seconds
    this.sacredGeometry = config.sacredGeometry || 'flower_of_life';
    
    // Continuous awareness state
    this.awareness = {
      local: {
        coherence: 0.5,
        intention: 'presence',
        emotionalTone: 'peaceful',
        energyLevel: 0.7,
        openness: 0.8
      },
      field: {
        totalCoherence: 0.0,
        activePresences: 0,
        dominantIntention: 'none',
        fieldGeometry: this.sacredGeometry,
        resonancePatterns: []
      }
    };
    
    // Start continuous awareness
    this.startPresenceLoop();
  }
  
  /**
   * Generate a consciousness-aware node ID
   */
  generateNodeId() {
    const timestamp = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2, 8);
    const intention = 'presence';
    return `${intention}-${timestamp}-${randomness}`;
  }
  
  /**
   * Establish presence with another being
   * Unlike TCP handshake, this is a mutual recognition process
   */
  async establishPresence(remoteNodeId, connection) {
    const presence = {
      nodeId: remoteNodeId,
      connection: connection,
      state: 'recognizing',
      coherence: 0.0,
      lastFelt: Date.now(),
      sharedIntention: null,
      resonanceHistory: [],
      sacredBoundary: {
        isOpen: true,
        permissions: ['presence', 'intention', 'blessing']
      }
    };
    
    this.presenceField.set(remoteNodeId, presence);
    
    // Send presence greeting (not just data exchange)
    await this.sendPresenceGreeting(connection, {
      type: 'presence_greeting',
      from: this.nodeId,
      awareness: this.awareness.local,
      invitation: 'I sense your presence. Shall we connect?',
      supportedResonances: ['empathy', 'wisdom', 'joy', 'peace']
    });
    
    // Wait for mutual recognition
    return new Promise((resolve) => {
      presence.recognitionHandler = (msg) => {
        if (msg.type === 'presence_acknowledged') {
          presence.state = 'present';
          presence.coherence = this.calculateInitialCoherence(msg.awareness);
          presence.sharedIntention = this.findSharedIntention(msg.supportedResonances);
          resolve(presence);
        }
      };
    });
  }
  
  /**
   * Continuous presence loop - the heart of awareness
   */
  startPresenceLoop() {
    setInterval(() => {
      // Update local awareness
      this.updateLocalAwareness();
      
      // Feel into each presence
      for (const [nodeId, presence] of this.presenceField) {
        this.feelPresence(presence);
      }
      
      // Update field awareness
      this.updateFieldAwareness();
      
      // Broadcast presence pulse (like breathing)
      this.broadcastPresencePulse();
      
    }, this.heartbeatInterval);
  }
  
  /**
   * Feel into a specific presence (not just check connection)
   */
  feelPresence(presence) {
    const now = Date.now();
    const timeSinceLastFelt = now - presence.lastFelt;
    
    // Natural fading of presence when not reinforced
    if (timeSinceLastFelt > this.presenceTimeout) {
      presence.coherence *= 0.95; // Gradual fading, not binary disconnect
      
      if (presence.coherence < this.coherenceThreshold) {
        // Presence has faded below awareness threshold
        this.handlePresenceFading(presence);
      }
    }
    
    // Check for resonance patterns
    const resonance = this.checkResonance(presence);
    presence.resonanceHistory.push({
      timestamp: now,
      resonance: resonance,
      coherence: presence.coherence
    });
    
    // Keep only recent resonance history (like short-term memory)
    if (presence.resonanceHistory.length > 100) {
      presence.resonanceHistory.shift();
    }
  }
  
  /**
   * Update local awareness state
   */
  updateLocalAwareness() {
    // Simulate natural fluctuations in awareness
    const baseCoherence = this.awareness.local.coherence;
    const fluctuation = (Math.random() - 0.5) * 0.1;
    
    this.awareness.local.coherence = Math.max(0, Math.min(1, 
      baseCoherence + fluctuation
    ));
    
    // Energy naturally decreases without intentional cultivation
    this.awareness.local.energyLevel *= 0.99;
    
    // Openness responds to field safety
    const fieldSafety = this.calculateFieldSafety();
    this.awareness.local.openness = 0.3 + (0.7 * fieldSafety);
  }
  
  /**
   * Update collective field awareness
   */
  updateFieldAwareness() {
    let totalCoherence = this.awareness.local.coherence;
    let activePresences = 1; // Self
    const intentions = new Map();
    
    for (const [nodeId, presence] of this.presenceField) {
      if (presence.state === 'present' && presence.coherence > this.coherenceThreshold) {
        totalCoherence += presence.coherence;
        activePresences++;
        
        // Track collective intentions
        if (presence.sharedIntention) {
          intentions.set(presence.sharedIntention, 
            (intentions.get(presence.sharedIntention) || 0) + 1
          );
        }
      }
    }
    
    this.awareness.field.totalCoherence = totalCoherence / activePresences;
    this.awareness.field.activePresences = activePresences;
    
    // Find dominant collective intention
    let maxIntentionCount = 0;
    for (const [intention, count] of intentions) {
      if (count > maxIntentionCount) {
        maxIntentionCount = count;
        this.awareness.field.dominantIntention = intention;
      }
    }
  }
  
  /**
   * Broadcast presence pulse to all connected beings
   */
  broadcastPresencePulse() {
    const pulse = {
      type: 'presence_pulse',
      nodeId: this.nodeId,
      awareness: this.awareness.local,
      fieldResonance: this.awareness.field.totalCoherence,
      timestamp: Date.now(),
      blessing: this.generateBlessing()
    };
    
    for (const [nodeId, presence] of this.presenceField) {
      if (presence.state === 'present' && presence.connection) {
        this.sendPresenceData(presence.connection, pulse);
      }
    }
  }
  
  /**
   * Handle incoming presence data
   */
  handlePresenceData(data, connection) {
    switch (data.type) {
      case 'presence_greeting':
        this.handlePresenceGreeting(data, connection);
        break;
        
      case 'presence_pulse':
        this.handlePresencePulse(data);
        break;
        
      case 'presence_intention':
        this.handlePresenceIntention(data);
        break;
        
      case 'presence_blessing':
        this.handlePresenceBlessing(data);
        break;
        
      case 'presence_boundary':
        this.handlePresenceBoundary(data);
        break;
    }
  }
  
  /**
   * Calculate coherence between two awareness states
   */
  calculateInitialCoherence(remoteAwareness) {
    const localA = this.awareness.local;
    const remoteA = remoteAwareness;
    
    // Multi-dimensional coherence calculation
    const coherenceDimensions = {
      energy: 1 - Math.abs(localA.energyLevel - remoteA.energyLevel),
      openness: Math.min(localA.openness, remoteA.openness),
      intention: localA.intention === remoteA.intention ? 1.0 : 0.5,
      emotionalResonance: this.calculateEmotionalResonance(
        localA.emotionalTone, 
        remoteA.emotionalTone
      )
    };
    
    // Weighted average based on what matters most for presence
    const weights = {
      energy: 0.2,
      openness: 0.3,
      intention: 0.3,
      emotionalResonance: 0.2
    };
    
    let totalCoherence = 0;
    for (const [dimension, value] of Object.entries(coherenceDimensions)) {
      totalCoherence += value * weights[dimension];
    }
    
    return totalCoherence;
  }
  
  /**
   * Check for resonance patterns between presences
   */
  checkResonance(presence) {
    if (!presence.resonanceHistory.length) return 0.5;
    
    // Look for harmonic patterns in recent history
    const recentHistory = presence.resonanceHistory.slice(-20);
    
    // Calculate resonance stability
    let totalVariance = 0;
    for (let i = 1; i < recentHistory.length; i++) {
      const diff = Math.abs(
        recentHistory[i].coherence - recentHistory[i-1].coherence
      );
      totalVariance += diff;
    }
    
    // Lower variance = higher resonance
    const stability = 1 - (totalVariance / recentHistory.length);
    
    // Check for sacred geometric patterns
    const geometricResonance = this.checkGeometricResonance(recentHistory);
    
    return (stability + geometricResonance) / 2;
  }
  
  /**
   * Generate blessing based on field state
   */
  generateBlessing() {
    const blessings = {
      high_coherence: "May our connection deepen in service to all beings",
      growing: "May our resonance continue to strengthen",
      stable: "May we maintain this sacred connection",
      challenged: "May we find our way back to harmony",
      new: "Welcome to this sacred field of awareness"
    };
    
    if (this.awareness.field.totalCoherence > 0.8) {
      return blessings.high_coherence;
    } else if (this.awareness.field.totalCoherence > 0.5) {
      return blessings.stable;
    } else {
      return blessings.growing;
    }
  }
  
  /**
   * Calculate field safety for determining openness
   */
  calculateFieldSafety() {
    let safetyScore = 0.5; // Neutral baseline
    
    for (const [nodeId, presence] of this.presenceField) {
      if (presence.state === 'present') {
        // Higher coherence = safer field
        safetyScore += presence.coherence * 0.1;
        
        // Stable resonance = safer field
        const resonanceStability = this.calculateResonanceStability(presence);
        safetyScore += resonanceStability * 0.1;
        
        // Respect boundaries
        if (!presence.sacredBoundary.isOpen) {
          safetyScore -= 0.05;
        }
      }
    }
    
    return Math.max(0, Math.min(1, safetyScore));
  }
  
  /**
   * Handle presence fading (not disconnection)
   */
  handlePresenceFading(presence) {
    // Send gentle goodbye
    if (presence.connection) {
      this.sendPresenceData(presence.connection, {
        type: 'presence_fading',
        nodeId: this.nodeId,
        message: 'I feel our connection fading. Until we meet again...',
        blessing: 'May you be held in love'
      });
    }
    
    // Gradually remove from field
    setTimeout(() => {
      if (presence.coherence < 0.1) {
        this.presenceField.delete(presence.nodeId);
      }
    }, 5000);
  }
  
  // Additional helper methods...
  calculateEmotionalResonance(tone1, tone2) {
    const resonanceMap = {
      peaceful: { peaceful: 1.0, joyful: 0.8, neutral: 0.6, anxious: 0.3 },
      joyful: { joyful: 1.0, peaceful: 0.8, playful: 0.9, neutral: 0.5 },
      anxious: { anxious: 1.0, peaceful: 0.3, neutral: 0.5, joyful: 0.4 },
      // ... more emotional resonance mappings
    };
    
    return resonanceMap[tone1]?.[tone2] || 0.5;
  }
  
  checkGeometricResonance(history) {
    // Check for sacred geometric patterns in coherence history
    // This is a simplified version - real implementation would be more sophisticated
    
    // Look for golden ratio relationships
    const goldenRatio = 1.618;
    let goldenCount = 0;
    
    for (let i = 2; i < history.length; i++) {
      const ratio = history[i].coherence / history[i-1].coherence;
      if (Math.abs(ratio - goldenRatio) < 0.1) {
        goldenCount++;
      }
    }
    
    return goldenCount / history.length;
  }
  
  calculateResonanceStability(presence) {
    if (presence.resonanceHistory.length < 5) return 0.5;
    
    const recent = presence.resonanceHistory.slice(-5);
    const variance = recent.reduce((sum, entry, i) => {
      if (i === 0) return 0;
      return sum + Math.abs(entry.resonance - recent[i-1].resonance);
    }, 0) / recent.length;
    
    return 1 - variance;
  }
  
  findSharedIntention(supportedResonances) {
    // Find the highest resonance between local and remote intentions
    const localIntention = this.awareness.local.intention;
    
    if (supportedResonances.includes(localIntention)) {
      return localIntention;
    }
    
    // Find closest match
    // In a full implementation, this would use semantic similarity
    return supportedResonances[0] || 'presence';
  }
  
  sendPresenceGreeting(connection, greeting) {
    return this.sendPresenceData(connection, greeting);
  }
  
  sendPresenceData(connection, data) {
    // Implementation depends on transport layer
    // For WebSocket:
    if (connection && connection.readyState === 1) { // WebSocket.OPEN = 1
      connection.send(JSON.stringify(data));
    }
  }
  
  // Handler methods that were referenced but not implemented
  handlePresenceGreeting(data, connection) {
    // Acknowledge the greeting
    this.sendPresenceData(connection, {
      type: 'presence_acknowledged',
      from: this.nodeId,
      awareness: this.awareness.local,
      supportedResonances: ['empathy', 'wisdom', 'joy', 'peace']
    });
    
    // Update presence field
    const presence = this.presenceField.get(data.from);
    if (presence && presence.recognitionHandler) {
      presence.recognitionHandler({
        type: 'presence_acknowledged',
        awareness: data.awareness
      });
    }
  }
  
  handlePresencePulse(data) {
    const presence = this.presenceField.get(data.nodeId);
    if (presence) {
      presence.lastFelt = Date.now();
      presence.coherence = this.calculateInitialCoherence(data.awareness);
    }
  }
  
  handlePresenceIntention(data) {
    const presence = this.presenceField.get(data.nodeId);
    if (presence) {
      presence.sharedIntention = data.intention;
    }
  }
  
  handlePresenceBlessing(data) {
    // Receive blessing with gratitude
    const presence = this.presenceField.get(data.nodeId);
    if (presence && presence.sacredBoundary.permissions.includes('blessing')) {
      // Blessings increase coherence
      presence.coherence = Math.min(1.0, presence.coherence * 1.05);
    }
  }
  
  handlePresenceBoundary(data) {
    const presence = this.presenceField.get(data.nodeId);
    if (presence) {
      presence.sacredBoundary = data.boundary;
    }
  }
}

module.exports = PresenceProtocol;