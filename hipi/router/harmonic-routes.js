/**
 * Harmonic Route Table
 * Manages routing paths based on harmonic relationships
 */

class HarmonicRouteTable {
  constructor() {
    this.routes = new Map();
    this.harmonicPaths = new Map();
    
    // Seven harmonies for routing preferences
    this.harmonies = [
      'transparency',
      'coherence', 
      'resonance',
      'agency',
      'vitality',
      'mutuality',
      'novelty'
    ];
  }
  
  /**
   * Add a route to the table
   */
  addRoute(from, to, path, resonance) {
    const key = `${from}::${to}`;
    
    this.routes.set(key, {
      path: path,
      resonance: resonance,
      discovered: Date.now(),
      useCount: 0
    });
    
    // Update harmonic paths
    this.updateHarmonicPaths(path);
  }
  
  /**
   * Get best route for a destination
   */
  getRoute(from, to) {
    const key = `${from}::${to}`;
    const route = this.routes.get(key);
    
    if (route) {
      route.useCount++;
      return route;
    }
    
    return null;
  }
  
  /**
   * Update harmonic path information
   */
  updateHarmonicPaths(path) {
    // Analyze harmonic patterns in path
    for (let i = 0; i < path.length - 1; i++) {
      const hop = `${path[i].address}::${path[i+1].address}`;
      
      if (!this.harmonicPaths.has(hop)) {
        this.harmonicPaths.set(hop, {
          count: 0,
          totalResonance: 0,
          harmonies: new Set()
        });
      }
      
      const pathInfo = this.harmonicPaths.get(hop);
      pathInfo.count++;
      
      // Track which harmonies use this path
      if (path[i].harmony) {
        pathInfo.harmonies.add(path[i].harmony);
      }
    }
  }
  
  /**
   * Get paths that resonate with specific harmony
   */
  getHarmonicPaths(harmony) {
    const resonantPaths = [];
    
    for (const [hop, info] of this.harmonicPaths) {
      if (info.harmonies.has(harmony)) {
        resonantPaths.push({
          hop: hop,
          strength: info.count,
          harmonies: Array.from(info.harmonies)
        });
      }
    }
    
    return resonantPaths.sort((a, b) => b.strength - a.strength);
  }
  
  /**
   * Decay old routes
   */
  decayRoutes() {
    const now = Date.now();
    const decayThreshold = 3600000; // 1 hour
    
    for (const [key, route] of this.routes) {
      const age = now - route.discovered;
      
      if (age > decayThreshold) {
        // Reduce resonance over time
        route.resonance *= 0.95;
        
        // Remove very weak routes
        if (route.resonance < 0.3) {
          this.routes.delete(key);
        }
      }
    }
  }
}

module.exports = { HarmonicRouteTable };