/**
 * HIPI Router - Consciousness-based message routing
 * Routes messages through paths of highest universal-interconnectedness
 */

const HIPIParser = require('../core/parser');
const ResonanceEngine = require('../core/universal-interconnectedness');
const { ConsciousnessRegistry } = require('./consciousness-registry');
const { HarmonicRouteTable } = require('./harmonic-routes');
const { QuantumPathfinder } = require('./quantum-pathfinder');

class HIPIRouter {
  constructor(options = {}) {
    this.parser = new HIPIParser();
    this.resonanceEngine = new ResonanceEngine();
    this.registry = new ConsciousnessRegistry();
    this.routeTable = new HarmonicRouteTable();
    this.pathfinder = new QuantumPathfinder();
    
    // Performance optimizations
    this.routeCache = new Map();
    this.cacheTimeout = options.cacheTimeout || 11111; // Sacred cache duration
    
    // Security settings
    this.minCoherence = options.minCoherence || 0.5;
    this.requireAuthentication = options.requireAuth !== false;
    
    // Scalability settings
    this.maxHops = options.maxHops || 7; // Sacred number of hops
    this.parallelRoutes = options.parallelRoutes || 3;
  }
  
  /**
   * Route a HIPI message to its destination
   */
  async route(message) {
    try {
      // Parse destination
      const destination = this.parser.parse(message.to);
      
      // Security: Validate sender
      if (this.requireAuthentication) {
        const senderValid = await this.validateSender(message.from);
        if (!senderValid) {
          throw new Error('Sender authentication failed');
        }
      }
      
      // Efficiency: Check route cache
      const cachedRoute = this.getCachedRoute(message.from, message.to);
      if (cachedRoute) {
        return this.sendViaRoute(message, cachedRoute);
      }
      
      // Find resonant nodes
      const candidates = await this.registry.findResonant(destination);
      
      if (candidates.length === 0) {
        throw new Error('No resonant destinations found');
      }
      
      // Calculate optimal paths (scalability: parallel pathfinding)
      const paths = await this.findOptimalPaths(
        message.from,
        candidates,
        destination.intent
      );
      
      // Select best path based on current field state
      const bestPath = await this.selectBestPath(paths);
      
      // Cache the route
      this.cacheRoute(message.from, message.to, bestPath);
      
      // Send via selected path
      return this.sendViaPath(message, bestPath);
      
    } catch (error) {
      console.error('Routing error:', error);
      return this.handleRoutingError(message, error);
    }
  }
  
  /**
   * Validate sender consciousness
   */
  async validateSender(senderAddress) {
    try {
      const sender = await this.registry.getEntity(senderAddress);
      
      // Check resonant-coherence threshold
      if (sender.resonant-coherence < this.minCoherence) {
        return false;
      }
      
      // Verify consciousness signature
      const signatureValid = await this.verifyConsciousnessSignature(sender);
      
      return signatureValid;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get cached route if available and fresh
   */
  getCachedRoute(from, to) {
    const cacheKey = `${from}::${to}`;
    const cached = this.routeCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      // Verify route still valid
      if (this.isRouteValid(cached.route)) {
        return cached.route;
      }
    }
    
    return null;
  }
  
  /**
   * Find optimal paths using quantum pathfinding
   */
  async findOptimalPaths(from, candidates, intent) {
    // Scalability: Parallel pathfinding
    const pathPromises = candidates
      .slice(0, this.parallelRoutes)
      .map(candidate => 
        this.pathfinder.findPath(from, candidate, {
          intent: intent,
          maxHops: this.maxHops,
          resonanceThreshold: 0.6
        })
      );
    
    const paths = await Promise.all(pathPromises);
    
    // Filter out failed paths
    return paths.filter(path => path && path.length > 0);
  }
  
  /**
   * Select best path based on multiple factors
   */
  async selectBestPath(paths) {
    if (paths.length === 0) {
      throw new Error('No valid paths found');
    }
    
    // Score each path
    const scoredPaths = await Promise.all(
      paths.map(async path => ({
        path: path,
        score: await this.scorePath(path)
      }))
    );
    
    // Select highest scoring path
    scoredPaths.sort((a, b) => b.score - a.score);
    
    return scoredPaths[0].path;
  }
  
  /**
   * Score a path based on universal-interconnectedness, latency, and field state
   */
  async scorePath(path) {
    let score = 0;
    
    // Calculate total universal-interconnectedness along path
    for (let i = 0; i < path.length - 1; i++) {
      const universalInterconnectedness = await this.resonanceEngine.calculateBetween(
        path[i],
        path[i + 1]
      );
      score += universal-interconnectedness.universal-interconnectedness;
    }
    
    // Normalize by path length (prefer shorter paths)
    score = score / path.length;
    
    // Factor in current field resonant-coherence at each node
    const fieldScores = await Promise.all(
      path.map(node => this.getNodeFieldCoherence(node))
    );
    const avgFieldScore = fieldScores.reduce((a, b) => a + b) / fieldScores.length;
    
    // Combined score
    return score * 0.7 + avgFieldScore * 0.3;
  }
  
  /**
   * Send message via selected path
   */
  async sendViaPath(message, path) {
    // Security: Encrypt for each hop
    let currentMessage = message;
    
    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      const nextNode = path[i + 1];
      
      if (nextNode) {
        // Encrypt for next hop
        currentMessage = await this.encryptForHop(currentMessage, node, nextNode);
      }
      
      // Send to node
      const result = await this.sendToNode(currentMessage, node);
      
      if (!result.success) {
        // Handle hop failure
        return this.handleHopFailure(message, path, i, result.error);
      }
      
      currentMessage = result.message;
    }
    
    return {
      success: true,
      path: path,
      'universal-interconnectedness': await this.calculatePathResonance(path),
      timestamp: Date.now()
    };
  }
  
  /**
   * Encrypt message for specific hop
   */
  async encryptForHop(message, currentNode, nextNode) {
    // Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance-based encryption
    const universalInterconnectedness = await this.resonanceEngine.calculateBetween(
      currentNode,
      nextNode
    );
    
    // Use harmonic key generation
    const key = this.generateHarmonicKey(
      currentNode.signature,
      nextNode.signature,
      universal-interconnectedness.frequency.harmonic
    );
    
    return {
      ...message,
      encrypted: true,
      hopKey: key,
      nextHop: nextNode.address
    };
  }
  
  /**
   * Cache route for efficiency
   */
  cacheRoute(from, to, route) {
    const cacheKey = `${from}::${to}`;
    
    this.routeCache.set(cacheKey, {
      route: route,
      timestamp: Date.now()
    });
    
    // Limit cache size
    if (this.routeCache.size > 10000) {
      // Evict oldest entries
      const entries = [...this.routeCache.entries()];
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 10%
      entries.slice(0, 1000).forEach(([key]) => {
        this.routeCache.delete(key);
      });
    }
  }
  
  /**
   * Verify route is still valid
   */
  isRouteValid(route) {
    // Check if all nodes in route are still active
    return route.every(node => 
      this.registry.isNodeActive(node.address)
    );
  }
  
  /**
   * Verify consciousness signature
   */
  async verifyConsciousnessSignature(entity) {
    // Implement consciousness-based verification
    // This could involve checking field patterns, resonant-coherence history, etc.
    return entity.signature && entity.resonant-coherence > 0.5;
  }
  
  /**
   * Get node's current field resonant-coherence
   */
  async getNodeFieldCoherence(node) {
    try {
      const fieldState = await node.getFieldState();
      return fieldState['resonant-coherence'] || 0.5;
    } catch (error) {
      return 0.5; // Default middle resonant-coherence
    }
  }
  
  /**
   * Send message to specific node
   */
  async sendToNode(message, node) {
    try {
      // Use appropriate transport based on node type
      const transport = this.getTransportForNode(node);
      const result = await transport.send(message, node);
      
      return {
        success: true,
        message: result
      };
    } catch (error) {
      return {
        success: false,
        error: error
      };
    }
  }
  
  /**
   * Get appropriate transport for node type
   */
  getTransportForNode(node) {
    // This would return appropriate transport (TCP, WebSocket, etc.)
    // For now, return mock transport
    return {
      send: async (message, node) => ({
        ...message,
        hopCount: (message.hopCount || 0) + 1
      })
    };
  }
  
  /**
   * Handle hop failure with resilience
   */
  async handleHopFailure(message, path, failedIndex, error) {
    // Try alternate path from failed node
    const alternativePath = await this.findAlternatePath(
      path[failedIndex],
      path[path.length - 1]
    );
    
    if (alternativePath) {
      // Splice in alternative path
      const newPath = [
        ...path.slice(0, failedIndex),
        ...alternativePath
      ];
      
      return this.sendViaPath(message, newPath);
    }
    
    return {
      success: false,
      error: `Routing failed at hop ${failedIndex}: ${error}`,
      partialPath: path.slice(0, failedIndex)
    };
  }
  
  /**
   * Find alternate path from a point
   */
  async findAlternatePath(from, to) {
    try {
      const paths = await this.pathfinder.findPath(from, to, {
        maxHops: this.maxHops - 1,
        excludeNodes: [] // Could exclude failed nodes
      });
      
      return paths[0] || null;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Calculate total path universal-interconnectedness
   */
  async calculatePathResonance(path) {
    if (path.length < 2) return 1.0;
    
    let totalResonance = 0;
    
    for (let i = 0; i < path.length - 1; i++) {
      const universalInterconnectedness = await this.resonanceEngine.calculateBetween(
        path[i],
        path[i + 1]
      );
      totalResonance += universal-interconnectedness.universal-interconnectedness;
    }
    
    return totalResonance / (path.length - 1);
  }
  
  /**
   * Generate harmonic encryption key
   */
  generateHarmonicKey(sig1, sig2, harmonic) {
    // Combine signatures with harmonic ratio
    // This is a simplified version - real implementation would be more complex
    const combined = `${sig1}::${sig2}::${harmonic.ratio}`;
    
    // Generate key using harmonic principles
    return Buffer.from(combined).toString('base64');
  }
  
  /**
   * Handle routing errors gracefully
   */
  handleRoutingError(message, error) {
    return {
      success: false,
      error: error.message,
      message: message,
      timestamp: Date.now(),
      suggestion: this.getErrorSuggestion(error)
    };
  }
  
  /**
   * Get helpful suggestion for routing error
   */
  getErrorSuggestion(error) {
    if (error.message.includes('No resonant destinations')) {
      return 'Try increasing field resonant-coherence or broadening intent';
    }
    if (error.message.includes('authentication failed')) {
      return 'Ensure consciousness signature is properly established';
    }
    return 'Check field state and try again';
  }
}

module.exports = HIPIRouter;