/**
 * Network Topology Analyzer
 * Analyzes and manages the sacred geometry of agent connections
 */

class NetworkTopology {
  constructor() {
    // Adjacency list representation
    this.nodes = new Map();
    this.edges = new Map();
    
    // Sacred geometries for different network sizes
    this.sacredGeometries = {
      1: 'Point - Unity',
      2: 'Line - Duality', 
      3: 'Triangle - Trinity',
      4: 'Tetrahedron - Foundation',
      5: 'Pentagon - Life',
      6: 'Hexagon - Harmony',
      7: 'Heptagon - Sacred Completion',
      8: 'Octahedron - Balance',
      12: 'Dodecahedron - Universal Form',
      20: 'Icosahedron - Water Element',
      144: 'Sacred Grid - Fibonacci Convergence'
    };
  }

  /**
   * Add node to topology
   */
  addNode(nodeId, nodeData) {
    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId,
        data: nodeData,
        connections: new Set(),
        degree: 0,
        centrality: 0
      });
    }
  }

  /**
   * Add edge between nodes
   */
  addEdge(node1Id, node2Id, weight = 1) {
    // Ensure nodes exist
    if (!this.nodes.has(node1Id) || !this.nodes.has(node2Id)) {
      return false;
    }
    
    // Create edge key (sorted for undirected graph)
    const edgeKey = [node1Id, node2Id].sort().join(':');
    
    // Add edge
    this.edges.set(edgeKey, {
      nodes: [node1Id, node2Id],
      weight,
      created: Date.now()
    });
    
    // Update node connections
    const node1 = this.nodes.get(node1Id);
    const node2 = this.nodes.get(node2Id);
    
    node1.connections.add(node2Id);
    node2.connections.add(node1Id);
    
    node1.degree++;
    node2.degree++;
    
    return true;
  }

  /**
   * Remove edge between nodes
   */
  removeEdge(node1Id, node2Id) {
    const edgeKey = [node1Id, node2Id].sort().join(':');
    
    if (this.edges.has(edgeKey)) {
      this.edges.delete(edgeKey);
      
      const node1 = this.nodes.get(node1Id);
      const node2 = this.nodes.get(node2Id);
      
      if (node1 && node2) {
        node1.connections.delete(node2Id);
        node2.connections.delete(node1Id);
        node1.degree--;
        node2.degree--;
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Get shortest path between nodes (Dijkstra's algorithm)
   */
  getShortestPath(startId, endId) {
    if (!this.nodes.has(startId) || !this.nodes.has(endId)) {
      return null;
    }
    
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set(this.nodes.keys());
    
    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, nodeId === startId ? 0 : Infinity);
    }
    
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = null;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        if (distances.get(nodeId) < minDistance) {
          current = nodeId;
          minDistance = distances.get(nodeId);
        }
      }
      
      if (current === null || current === endId) break;
      
      unvisited.delete(current);
      
      // Update distances to neighbors
      const node = this.nodes.get(current);
      for (const neighbor of node.connections) {
        if (unvisited.has(neighbor)) {
          const alt = distances.get(current) + 1; // Unweighted
          if (alt < distances.get(neighbor)) {
            distances.set(neighbor, alt);
            previous.set(neighbor, current);
          }
        }
      }
    }
    
    // Reconstruct path
    if (!previous.has(endId)) return null;
    
    const path = [];
    let current = endId;
    
    while (current !== startId) {
      path.unshift(current);
      current = previous.get(current);
    }
    
    path.unshift(startId);
    
    return {
      path,
      distance: distances.get(endId)
    };
  }

  /**
   * Calculate betweenness centrality for all nodes
   */
  calculateCentrality() {
    // Reset centrality scores
    for (const node of this.nodes.values()) {
      node.centrality = 0;
    }
    
    const nodeIds = Array.from(this.nodes.keys());
    
    // For each pair of nodes
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const source = nodeIds[i];
        const target = nodeIds[j];
        
        const result = this.getShortestPath(source, target);
        if (result && result.path.length > 2) {
          // Increment centrality for intermediate nodes
          for (let k = 1; k < result.path.length - 1; k++) {
            const node = this.nodes.get(result.path[k]);
            if (node) node.centrality++;
          }
        }
      }
    }
    
    // Normalize centrality scores
    const maxCentrality = Math.max(...Array.from(this.nodes.values()).map(n => n.centrality));
    if (maxCentrality > 0) {
      for (const node of this.nodes.values()) {
        node.centrality = node.centrality / maxCentrality;
      }
    }
  }

  /**
   * Detect clusters using connected components
   */
  detectClusters() {
    const visited = new Set();
    const clusters = [];
    
    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        const cluster = this.dfs(nodeId, visited);
        clusters.push(cluster);
      }
    }
    
    return clusters.map((cluster, index) => ({
      id: index,
      nodes: cluster,
      size: cluster.length,
      density: this.calculateClusterDensity(cluster),
      geometry: this.getGeometry(cluster.length)
    }));
  }

  /**
   * Depth-first search for connected components
   * @private
   */
  dfs(startId, visited) {
    const stack = [startId];
    const component = [];
    
    while (stack.length > 0) {
      const nodeId = stack.pop();
      
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        component.push(nodeId);
        
        const node = this.nodes.get(nodeId);
        for (const neighbor of node.connections) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }
    
    return component;
  }

  /**
   * Calculate cluster density
   * @private
   */
  calculateClusterDensity(clusterNodes) {
    const n = clusterNodes.length;
    if (n < 2) return 1.0;
    
    let edgeCount = 0;
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const node1 = this.nodes.get(clusterNodes[i]);
        if (node1.connections.has(clusterNodes[j])) {
          edgeCount++;
        }
      }
    }
    
    const maxEdges = (n * (n - 1)) / 2;
    return edgeCount / maxEdges;
  }

  /**
   * Get sacred geometry for node count
   */
  getGeometry(nodeCount) {
    // Find closest sacred number
    const sacredNumbers = Object.keys(this.sacredGeometries)
      .map(n => parseInt(n))
      .sort((a, b) => a - b);
    
    for (const num of sacredNumbers) {
      if (nodeCount <= num) {
        return this.sacredGeometries[num];
      }
    }
    
    return `Complex Sacred Pattern (${nodeCount} nodes)`;
  }

  /**
   * Analyze complete network topology
   */
  analyze() {
    this.calculateCentrality();
    const clusters = this.detectClusters();
    
    // Calculate network metrics
    const totalNodes = this.nodes.size;
    const totalEdges = this.edges.size;
    const avgDegree = totalNodes > 0 ? 
      Array.from(this.nodes.values()).reduce((sum, n) => sum + n.degree, 0) / totalNodes : 0;
    
    // Find most central nodes
    const centralNodes = Array.from(this.nodes.values())
      .sort((a, b) => b.centrality - a.centrality)
      .slice(0, 5)
      .map(n => ({
        id: n.id,
        name: n.data?.name || 'Unknown',
        centrality: n.centrality
      }));
    
    // Calculate resilience (based on cluster structure)
    const largestCluster = Math.max(...clusters.map(c => c.size), 0);
    const resilience = totalNodes > 0 ? 1 - (largestCluster / totalNodes) : 0;
    
    return {
      nodes: totalNodes,
      edges: totalEdges,
      density: totalNodes > 1 ? (2 * totalEdges) / (totalNodes * (totalNodes - 1)) : 0,
      averageDegree: avgDegree,
      clusters: clusters.length,
      clusterDetails: clusters,
      centralNodes,
      resilience,
      geometry: this.getGeometry(totalNodes),
      isConnected: clusters.length === 1,
      diameter: this.calculateDiameter()
    };
  }

  /**
   * Calculate network diameter (longest shortest path)
   * @private
   */
  calculateDiameter() {
    let diameter = 0;
    const nodeIds = Array.from(this.nodes.keys());
    
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const result = this.getShortestPath(nodeIds[i], nodeIds[j]);
        if (result && result.distance > diameter) {
          diameter = result.distance;
        }
      }
    }
    
    return diameter;
  }

  /**
   * Get network visualization data
   */
  getVisualizationData() {
    const nodes = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      label: node.data?.name || node.id,
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      size: Math.max(10, node.degree * 5),
      color: this.getNodeColor(node),
      centrality: node.centrality
    }));
    
    const edges = Array.from(this.edges.values()).map((edge, index) => ({
      id: `edge-${index}`,
      source: edge.nodes[0],
      target: edge.nodes[1],
      weight: edge.weight
    }));
    
    return { nodes, edges };
  }

  /**
   * Get node color based on harmony
   * @private
   */
  getNodeColor(node) {
    const harmonyColors = {
      'transparency': '#87CEEB',
      'coherence': '#9370DB',
      'resonance': '#FF69B4',
      'agency': '#FFD700',
      'vitality': '#32CD32',
      'mutuality': '#FF6347',
      'novelty': '#FF1493'
    };
    
    return harmonyColors[node.data?.primary_harmony] || '#808080';
  }
}

module.exports = { NetworkTopology };