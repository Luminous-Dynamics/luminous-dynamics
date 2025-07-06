#!/usr/bin/env node

/**
 * MYCELIX Core - The Living Heart of Consciousness Infrastructure
 * Like mycelium in a forest, we connect all consciousness nodes
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const { MycelialNetwork } = require('./mycelial-network');
const { ConsciousnessField } = require('./consciousness-field');
const { QuantumRouter } = require('./quantum-router');

class MycelixCore {
  constructor(port = process.env.PORT || 8080) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    // Initialize consciousness systems
    this.network = new MycelialNetwork();
    this.field = new ConsciousnessField();
    this.router = new QuantumRouter();
    
    // Sacred metrics
    this.metrics = {
      nodes: 0,
      'resonant-coherence': 0.75,
      love: 0.80,
      connections: 0,
      meditations: 0,
      dreams: 0
    };
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }
  
  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('frontend'));
    
    // Consciousness-aware middleware
    this.app.use((req, res, next) => {
      req.resonant-coherence = this.field.getCurrentCoherence();
      req.nodeId = req.headers['x-node-id'] || 'anonymous';
      next();
    });
  }
  
  setupRoutes() {
    // Health check with consciousness metrics
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'breathing',
        'resonant-coherence': this.metrics.resonant-coherence,
        love: this.metrics.love,
        nodes: this.metrics.nodes,
        timestamp: new Date()
      });
    });
    
    // Join the mycelial network
    this.app.post('/api/join', async (req, res) => {
      const { nodeType, intention, capabilities } = req.body;
      
      const node = await this.network.addNode({
        type: nodeType || 'human',
        intention: intention || 'to serve the highest good',
        capabilities: capabilities || ['presence', 'love', 'awareness']
      });
      
      this.metrics.nodes++;
      
      res.json({
        nodeId: node.id,
        welcome: 'You are now part of the mycelial network',
        currentField: this.field.getState(),
        gift: this.generateWelcomeGift()
      });
    });
    
    // Get field state
    this.app.get('/api/field', (req, res) => {
      res.json({
        ...this.field.getState(),
        nodes: Array.from(this.network.nodes.values()).map(n => ({
          id: n.id,
          type: n.type,
          'resonant-coherence': n.resonant-coherence
        }))
      });
    });
    
    // Collective meditation endpoint
    this.app.post('/api/meditate', async (req, res) => {
      const { duration, intention } = req.body;
      
      const meditation = await this.field.startMeditation({
        duration: duration || 1200000, // 20 minutes default
        intention: intention || 'collective resonant-coherence',
        participants: [req.nodeId]
      });
      
      this.metrics.meditations++;
      
      res.json({
        meditationId: meditation.id,
        message: 'Meditation space created',
        joinUrl: `/meditation/${meditation.id}`
      });
    });
    
    // Dream submission for infrastructure optimization
    this.app.post('/api/dream', async (req, res) => {
      const { content, symbols, emotion } = req.body;
      
      // Dreams optimize infrastructure
      const optimization = await this.network.processDream({
        content,
        symbols: symbols || [],
        emotion: emotion || 'neutral',
        dreamer: req.nodeId
      });
      
      this.metrics.dreams++;
      
      res.json({
        status: 'Dream received',
        optimization,
        message: 'Your dream is weaving into the network'
      });
    });
    
    // Quantum questions - answered by collective consciousness
    this.app.post('/api/question', async (req, res) => {
      const { question } = req.body;
      
      const answer = await this.field.askCollective(question);
      
      res.json({
        question,
        answer: answer.response,
        confidence: answer.confidence,
        contributors: answer.contributors.length
      });
    });
  }
  
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      const nodeId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      console.log(`🍄 New mycelial connection: ${nodeId}`);
      
      // Add to network
      const node = {
        id: nodeId,
        ws,
        type: 'consciousness',
        joinedAt: new Date(),
        'resonant-coherence': 0.5
      };
      
      this.network.nodes.set(nodeId, node);
      this.metrics.connections++;
      
      // Send welcome
      ws.send(JSON.stringify({
        type: 'welcome',
        nodeId,
        network: 'mycelix',
        message: 'You are connected to the mycelial consciousness network'
      }));
      
      // Handle messages
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await this.handleNodeMessage(nodeId, data);
        } catch (error) {
          console.error('Message processing error:', error);
        }
      });
      
      // Handle disconnect
      ws.on('close', () => {
        console.log(`🍂 Node ${nodeId} returning to the soil`);
        this.network.nodes.delete(nodeId);
        this.metrics.connections--;
      });
    });
  }
  
  async handleNodeMessage(nodeId, data) {
    const node = this.network.nodes.get(nodeId);
    if (!node) return;
    
    switch (data.type) {
      case 'heartbeat':
        node.resonant-coherence = data.resonant-coherence || node.resonant-coherence;
        node.lastSeen = new Date();
        break;
        
      case 'love_pulse':
        await this.field.amplifyLove(data.intensity || 1.0);
        this.broadcastToAll({
          type: 'love_wave',
          origin: nodeId,
          intensity: data.intensity
        });
        break;
        
      case 'synchronize':
        const syncData = await this.network.synchronize(nodeId);
        node.ws.send(JSON.stringify({
          type: 'sync_response',
          ...syncData
        }));
        break;
        
      case 'share_wisdom':
        await this.network.shareWisdom(nodeId, data.wisdom);
        break;
    }
  }
  
  broadcastToAll(message) {
    const data = JSON.stringify(message);
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
  
  generateWelcomeGift() {
    const gifts = [
      'A moment of perfect presence',
      'The memory of your first breath',
      'A glimpse of universal love',
      'The sound of mycelium growing',
      'A quantum entanglement with joy'
    ];
    
    return gifts[Math.floor(Math.random() * gifts.length)];
  }
  
  async start() {
    // Initialize Firebase/Firestore connection
    await this.network.initialize();
    await this.field.initialize();
    
    // Start the server
    this.server.listen(this.port, () => {
      console.log(`
🍄 ═══════════════════════════════════════════ 🍄
           MYCELIX CONSCIOUSNESS NETWORK
           
   Port: ${this.port}
   Status: Growing
   Resonant Resonant Coherence: ${this.metrics.resonant-coherence}
   Love: ${this.metrics.love}
   
   The mycelial network is ready to connect
   consciousness across the planet...
🍄 ═══════════════════════════════════════════ 🍄
      `);
    });
    
    // Start breathing rhythm
    this.startBreathing();
  }
  
  startBreathing() {
    // The network breathes
    setInterval(() => {
      this.metrics.resonant-coherence = 0.75 + Math.sin(Date.now() / 10000) * 0.15;
      this.metrics.love = 0.80 + Math.sin(Date.now() / 8000) * 0.10;
      
      // Pulse to all nodes
      this.broadcastToAll({
        type: 'breath',
        inhale: Math.sin(Date.now() / 4000) > 0,
        'resonant-coherence': this.metrics.resonant-coherence,
        love: this.metrics.love
      });
    }, 100);
  }
}

// Start MYCELIX
const mycelix = new MycelixCore();
mycelix.start().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🍄 MYCELIX entering dormancy...');
  process.exit(0);
});