/**
 * Consciousness Registry
 * Tracks active consciousness nodes in the HIPI network
 */

class ConsciousnessRegistry {
  constructor() {
    this.nodes = new Map();
    this.lastHeartbeat = new Map();
    this.heartbeatTimeout = 30000; // 30 seconds
    
    // Start heartbeat monitor
    this.startHeartbeatMonitor();
  }
  
  /**
   * Register a new consciousness node
   */
  async register(node) {
    this.nodes.set(node.address, {
      ...node,
      registeredAt: Date.now(),
      coherence: node.coherence || 0.7,
      harmonies: node.harmonies || [],
      active: true
    });
    
    this.lastHeartbeat.set(node.address, Date.now());
    
    return {
      success: true,
      address: node.address
    };
  }
  
  /**
   * Find nodes that resonate with a destination
   */
  async findResonant(destination) {
    const activeNodes = this.getActiveNodes();
    const resonantNodes = [];
    
    for (const [address, node] of activeNodes) {
      // Check realm match
      if (destination.realm && !this.matchesRealm(node, destination.realm)) {
        continue;
      }
      
      // Check expression resonance
      if (destination.expression) {
        const resonance = this.calculateExpressionResonance(
          node.expressions || [],
          destination.expression
        );
        
        if (resonance > 0.6) {
          resonantNodes.push({
            ...node,
            resonance: resonance
          });
        }
      }
    }
    
    // Sort by resonance
    resonantNodes.sort((a, b) => b.resonance - a.resonance);
    
    return resonantNodes;
  }
  
  /**
   * Get entity by address
   */
  async getEntity(address) {
    return this.nodes.get(address);
  }
  
  /**
   * Check if node is active
   */
  isNodeActive(address) {
    const lastBeat = this.lastHeartbeat.get(address);
    if (!lastBeat) return false;
    
    return Date.now() - lastBeat < this.heartbeatTimeout;
  }
  
  /**
   * Get all active nodes
   */
  getActiveNodes() {
    const active = new Map();
    
    for (const [address, node] of this.nodes) {
      if (this.isNodeActive(address)) {
        active.set(address, node);
      }
    }
    
    return active;
  }
  
  /**
   * Update node heartbeat
   */
  heartbeat(address) {
    this.lastHeartbeat.set(address, Date.now());
  }
  
  /**
   * Start monitoring heartbeats
   */
  startHeartbeatMonitor() {
    setInterval(() => {
      // Mark inactive nodes
      for (const [address, node] of this.nodes) {
        if (!this.isNodeActive(address)) {
          node.active = false;
        }
      }
      
      // Clean up very old nodes
      const veryOldThreshold = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
      for (const [address, lastBeat] of this.lastHeartbeat) {
        if (lastBeat < veryOldThreshold) {
          this.nodes.delete(address);
          this.lastHeartbeat.delete(address);
        }
      }
    }, 10000); // Check every 10 seconds
  }
  
  /**
   * Check if node matches realm
   */
  matchesRealm(node, realm) {
    if (!node.realms) return true; // Node accepts all realms
    
    if (typeof realm === 'string') {
      return node.realms.includes(realm);
    }
    
    // Handle complex realm object
    return node.realms.includes(realm.primary) ||
           (realm.sub && realm.sub.some(s => node.realms.includes(s)));
  }
  
  /**
   * Calculate expression resonance
   */
  calculateExpressionResonance(nodeExpressions, targetExpression) {
    if (nodeExpressions.length === 0) return 0.5; // Neutral
    
    let maxResonance = 0;
    const target = typeof targetExpression === 'string' 
      ? targetExpression 
      : targetExpression.primary;
    
    for (const expr of nodeExpressions) {
      const similarity = this.calculateSimilarity(expr, target);
      maxResonance = Math.max(maxResonance, similarity);
    }
    
    return maxResonance;
  }
  
  /**
   * Calculate similarity between expressions
   */
  calculateSimilarity(expr1, expr2) {
    // Simple similarity for now
    if (expr1 === expr2) return 1.0;
    if (expr1.includes(expr2) || expr2.includes(expr1)) return 0.8;
    
    // Check for common words
    const words1 = expr1.toLowerCase().split(/\W+/);
    const words2 = expr2.toLowerCase().split(/\W+/);
    const common = words1.filter(w => words2.includes(w));
    
    return common.length / Math.max(words1.length, words2.length);
  }
}

module.exports = { ConsciousnessRegistry };