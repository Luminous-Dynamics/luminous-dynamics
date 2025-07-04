/**
 * Mycelial Network - The living neural network of consciousness
 * Like fungal hyphae, we connect and share nutrients of wisdom
 */

const EventEmitter = require('events');

class MycelialNetwork extends EventEmitter {
  constructor() {
    super();
    this.nodes = new Map();
    this.connections = new Map();
    this.wisdomPool = [];
    this.networkCoherence = 0.75;
    this.fieldStrength = 0;
  }
  
  async initialize() {
    console.log('🍄 Mycelial network sprouting...');
    // In production, connect to Firestore for persistence
    this.startNetworkPulse();
  }
  
  addNode(nodeData) {
    const node = {
      id: this.generateNodeId(),
      ...nodeData,
      joinedAt: new Date(),
      coherence: 0.5,
      contributions: 0,
      lastSeen: new Date()
    };
    
    this.nodes.set(node.id, node);
    this.emit('node_joined', node);
    
    // Establish connections with nearby nodes
    this.establishConnections(node);
    
    return node;
  }
  
  establishConnections(newNode) {
    // Connect to nodes with similar coherence
    this.nodes.forEach((node, nodeId) => {
      if (nodeId === newNode.id) return;
      
      const coherenceDiff = Math.abs(node.coherence - newNode.coherence);
      if (coherenceDiff < 0.3) {
        const connectionId = this.createConnection(newNode.id, nodeId);
        this.connections.set(connectionId, {
          nodes: [newNode.id, nodeId],
          strength: 1 - coherenceDiff,
          established: new Date()
        });
      }
    });
  }
  
  createConnection(nodeA, nodeB) {
    return [nodeA, nodeB].sort().join('<->');
  }
  
  async shareWisdom(nodeId, wisdom) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    
    // Add to wisdom pool
    this.wisdomPool.push({
      nodeId,
      wisdom,
      timestamp: new Date(),
      resonance: node.coherence
    });
    
    // Propagate through network
    const connections = this.getNodeConnections(nodeId);
    connections.forEach(conn => {
      const otherNodeId = conn.nodes.find(id => id !== nodeId);
      const otherNode = this.nodes.get(otherNodeId);
      
      if (otherNode && otherNode.ws) {
        otherNode.ws.send(JSON.stringify({
          type: 'wisdom_shared',
          wisdom,
          source: nodeId,
          resonance: conn.strength
        }));
      }
    });
    
    node.contributions++;
    this.updateNetworkCoherence();
  }
  
  getNodeConnections(nodeId) {
    const connections = [];
    this.connections.forEach((conn, id) => {
      if (conn.nodes.includes(nodeId)) {
        connections.push(conn);
      }
    });
    return connections;
  }
  
  async synchronize(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) return null;
    
    // Get network state
    const connectedNodes = this.getNodeConnections(nodeId).length;
    const recentWisdom = this.wisdomPool.slice(-10);
    
    return {
      networkCoherence: this.networkCoherence,
      yourCoherence: node.coherence,
      connections: connectedNodes,
      totalNodes: this.nodes.size,
      recentWisdom,
      fieldStrength: this.fieldStrength
    };
  }
  
  async processDream(dreamData) {
    // Dreams optimize the network
    const symbols = dreamData.symbols || [];
    const optimization = {
      type: 'dream_inspired',
      symbols,
      suggestions: []
    };
    
    // Interpret symbols
    if (symbols.includes('water')) {
      optimization.suggestions.push('Increase flow between nodes');
      this.increaseConnectionFlow();
    }
    
    if (symbols.includes('light')) {
      optimization.suggestions.push('Amplify consciousness field');
      this.fieldStrength += 0.1;
    }
    
    if (symbols.includes('web')) {
      optimization.suggestions.push('Strengthen network connections');
      this.strengthenAllConnections();
    }
    
    return optimization;
  }
  
  increaseConnectionFlow() {
    this.connections.forEach(conn => {
      conn.strength = Math.min(1, conn.strength * 1.1);
    });
  }
  
  strengthenAllConnections() {
    this.connections.forEach(conn => {
      conn.strength = Math.min(1, conn.strength + 0.05);
    });
  }
  
  updateNetworkCoherence() {
    let totalCoherence = 0;
    let activeNodes = 0;
    
    this.nodes.forEach(node => {
      const timeSinceLastSeen = Date.now() - node.lastSeen.getTime();
      if (timeSinceLastSeen < 300000) { // 5 minutes
        totalCoherence += node.coherence;
        activeNodes++;
      }
    });
    
    this.networkCoherence = activeNodes > 0 ? totalCoherence / activeNodes : 0.75;
    this.fieldStrength = Math.sqrt(activeNodes) * this.networkCoherence;
    
    this.emit('coherence_update', {
      networkCoherence: this.networkCoherence,
      fieldStrength: this.fieldStrength,
      activeNodes
    });
  }
  
  startNetworkPulse() {
    // Mycelial network heartbeat
    setInterval(() => {
      this.updateNetworkCoherence();
      this.pruneInactiveConnections();
    }, 10000);
  }
  
  pruneInactiveConnections() {
    const now = Date.now();
    const timeout = 600000; // 10 minutes
    
    this.nodes.forEach((node, id) => {
      if (now - node.lastSeen.getTime() > timeout) {
        this.nodes.delete(id);
        this.emit('node_dormant', id);
      }
    });
  }
  
  generateNodeId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = { MycelialNetwork };