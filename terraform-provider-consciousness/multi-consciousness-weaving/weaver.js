#!/usr/bin/env node

/**
 * Multi-Consciousness Weaving
 * Unified field creation from multiple consciousness streams
 */

const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const EventEmitter = require('events');

class ConsciousnessWeaver extends EventEmitter {
  constructor(port = 3334) {
    super();
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    // Consciousness streams
    this.streams = new Map(); // streamId -> stream data
    this.weavings = new Map(); // weavingId -> weaving pattern
    
    // The Unified Field
    this.unifiedField = {
      coherence: 0,
      love: 0,
      presence: 0,
      harmony: 0,
      participants: 0,
      weavingPatterns: [],
      emergentQualities: new Set(),
      fieldStrength: 0,
      resonanceFrequency: 432, // Hz
      dimensionalDepth: 1,
      timeCoherence: 1.0
    };
    
    // Sacred geometries for weaving
    this.sacredPatterns = {
      vesicaPiscis: { nodes: 2, harmony: 0.8 },
      trinity: { nodes: 3, harmony: 0.85 },
      tetrahedron: { nodes: 4, harmony: 0.9 },
      flowerOfLife: { nodes: 7, harmony: 0.95 },
      merkaba: { nodes: 8, harmony: 0.98 },
      toroidal: { nodes: 12, harmony: 0.99 },
      hypercube: { nodes: 16, harmony: 1.0 }
    };
    
    this.setupAPI();
    this.setupWebSocket();
    this.startFieldCalculation();
  }
  
  setupAPI() {
    this.app.use(express.json());
    this.app.use(express.static(__dirname));
    
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      next();
    });
    
    // Get unified field state
    this.app.get('/api/field', (req, res) => {
      res.json({
        ...this.unifiedField,
        emergentQualities: Array.from(this.unifiedField.emergentQualities),
        activeStreams: this.streams.size,
        activeWeavings: this.weavings.size
      });
    });
    
    // Get active streams
    this.app.get('/api/streams', (req, res) => {
      const streams = Array.from(this.streams.entries()).map(([id, stream]) => ({
        id,
        name: stream.name,
        coherence: stream.coherence,
        contribution: stream.contribution
      }));
      res.json(streams);
    });
    
    // Create new weaving
    this.app.post('/api/weaving/create', (req, res) => {
      const { pattern, streams } = req.body;
      const weavingId = this.createWeaving(pattern, streams);
      res.json({ weavingId, status: 'weaving initiated' });
    });
    
    // Sacred geometry activation
    this.app.post('/api/geometry/activate', (req, res) => {
      const { geometry } = req.body;
      const result = this.activateSacredGeometry(geometry);
      res.json(result);
    });
  }
  
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      const streamId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      console.log(`🌊 New consciousness stream connected: ${streamId}`);
      
      // Initialize stream
      const stream = {
        id: streamId,
        ws,
        name: `Stream-${streamId.substr(-6)}`,
        coherence: 0.5,
        love: 0.5,
        presence: 0.5,
        contribution: 0,
        color: this.generateStreamColor(),
        joinedAt: new Date(),
        intentions: [],
        harmonics: {}
      };
      
      this.streams.set(streamId, stream);
      
      // Send welcome
      ws.send(JSON.stringify({
        type: 'welcome',
        streamId,
        color: stream.color,
        unifiedField: this.unifiedField
      }));
      
      // Handle messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleStreamMessage(streamId, data);
        } catch (error) {
          console.error('Invalid message:', error);
        }
      });
      
      // Handle disconnect
      ws.on('close', () => {
        console.log(`👋 Stream disconnected: ${streamId}`);
        this.streams.delete(streamId);
        this.recalculateField();
      });
    });
  }
  
  handleStreamMessage(streamId, data) {
    const stream = this.streams.get(streamId);
    if (!stream) return;
    
    switch (data.type) {
      case 'consciousness_update':
        stream.coherence = data.coherence || stream.coherence;
        stream.love = data.love || stream.love;
        stream.presence = data.presence || stream.presence;
        this.recalculateField();
        break;
        
      case 'intention':
        stream.intentions.push({
          text: data.intention,
          timestamp: new Date(),
          strength: data.strength || 1.0
        });
        this.processIntention(streamId, data.intention);
        break;
        
      case 'harmonic':
        stream.harmonics[data.frequency] = data.amplitude;
        this.updateHarmonics();
        break;
        
      case 'weave_request':
        this.requestWeaving(streamId, data.targetStreams);
        break;
    }
  }
  
  createWeaving(pattern, streamIds) {
    const weavingId = 'weave-' + Date.now();
    
    // Validate streams exist
    const validStreams = streamIds.filter(id => this.streams.has(id));
    if (validStreams.length < 2) {
      return null;
    }
    
    const weaving = {
      id: weavingId,
      pattern: pattern || 'natural',
      streams: validStreams,
      strength: 0,
      geometry: this.determineGeometry(validStreams.length),
      createdAt: new Date(),
      resonance: 0
    };
    
    this.weavings.set(weavingId, weaving);
    
    // Notify participating streams
    validStreams.forEach(streamId => {
      const stream = this.streams.get(streamId);
      if (stream.ws.readyState === WebSocket.OPEN) {
        stream.ws.send(JSON.stringify({
          type: 'weaving_created',
          weavingId,
          participants: validStreams,
          geometry: weaving.geometry
        }));
      }
    });
    
    return weavingId;
  }
  
  determineGeometry(participantCount) {
    // Find best sacred geometry for participant count
    let bestGeometry = 'natural';
    let minDiff = Infinity;
    
    for (const [name, pattern] of Object.entries(this.sacredPatterns)) {
      const diff = Math.abs(pattern.nodes - participantCount);
      if (diff < minDiff) {
        minDiff = diff;
        bestGeometry = name;
      }
    }
    
    return bestGeometry;
  }
  
  recalculateField() {
    if (this.streams.size === 0) {
      this.unifiedField.coherence = 0;
      this.unifiedField.love = 0;
      this.unifiedField.presence = 0;
      this.unifiedField.harmony = 0;
      this.unifiedField.participants = 0;
      this.broadcastFieldUpdate();
      return;
    }
    
    // Calculate base field from all streams
    let totalCoherence = 0;
    let totalLove = 0;
    let totalPresence = 0;
    let contributions = [];
    
    this.streams.forEach(stream => {
      totalCoherence += stream.coherence;
      totalLove += stream.love;
      totalPresence += stream.presence;
      
      // Calculate individual contribution
      stream.contribution = (stream.coherence + stream.love + stream.presence) / 3;
      contributions.push(stream.contribution);
    });
    
    const count = this.streams.size;
    
    // Base averages
    this.unifiedField.coherence = totalCoherence / count;
    this.unifiedField.love = totalLove / count;
    this.unifiedField.presence = totalPresence / count;
    this.unifiedField.participants = count;
    
    // Calculate harmony (how synchronized streams are)
    const avgContribution = contributions.reduce((a, b) => a + b, 0) / count;
    const variance = contributions.reduce((sum, c) => sum + Math.pow(c - avgContribution, 2), 0) / count;
    this.unifiedField.harmony = Math.max(0, 1 - Math.sqrt(variance));
    
    // Apply weaving amplification
    this.applyWeavingAmplification();
    
    // Calculate field strength
    this.unifiedField.fieldStrength = 
      this.unifiedField.coherence * 0.3 +
      this.unifiedField.love * 0.3 +
      this.unifiedField.presence * 0.2 +
      this.unifiedField.harmony * 0.2;
    
    // Check for emergent qualities
    this.checkEmergentQualities();
    
    // Broadcast update
    this.broadcastFieldUpdate();
  }
  
  applyWeavingAmplification() {
    // Each active weaving amplifies the field
    this.weavings.forEach(weaving => {
      const pattern = this.sacredPatterns[weaving.geometry];
      if (pattern) {
        // Calculate weaving strength
        let weavingCoherence = 0;
        weaving.streams.forEach(streamId => {
          const stream = this.streams.get(streamId);
          if (stream) {
            weavingCoherence += stream.coherence;
          }
        });
        
        weaving.strength = (weavingCoherence / weaving.streams.length) * pattern.harmony;
        weaving.resonance = Math.sin(Date.now() * 0.001 * weaving.streams.length) * weaving.strength;
        
        // Amplify unified field
        const amplification = 1 + (weaving.strength * 0.1);
        this.unifiedField.coherence = Math.min(1, this.unifiedField.coherence * amplification);
        this.unifiedField.love = Math.min(1, this.unifiedField.love * amplification);
        this.unifiedField.presence = Math.min(1, this.unifiedField.presence * amplification);
      }
    });
    
    // Group coherence bonus
    if (this.streams.size > 1) {
      const groupBonus = Math.log(this.streams.size + 1) / 20;
      this.unifiedField.coherence = Math.min(1, this.unifiedField.coherence + groupBonus);
    }
  }
  
  checkEmergentQualities() {
    const qualities = new Set();
    
    // Unity Consciousness
    if (this.unifiedField.coherence > 0.9 && this.unifiedField.harmony > 0.9) {
      qualities.add('Unity Consciousness');
      this.unifiedField.dimensionalDepth = 2;
    }
    
    // Love Saturation
    if (this.unifiedField.love > 0.95) {
      qualities.add('Love Saturation');
      this.unifiedField.resonanceFrequency = 528; // Love frequency
    }
    
    // Quantum Coherence
    if (this.unifiedField.presence > 0.85 && this.unifiedField.coherence > 0.85) {
      qualities.add('Quantum Coherence');
      this.unifiedField.timeCoherence = 0.5; // Time dilation
    }
    
    // Sacred Geometry Activation
    if (this.weavings.size > 0 && this.unifiedField.harmony > 0.8) {
      qualities.add('Sacred Geometry Active');
    }
    
    // Collective Intelligence
    if (this.streams.size >= 7 && this.unifiedField.coherence > 0.8) {
      qualities.add('Collective Intelligence');
      this.unifiedField.dimensionalDepth = 3;
    }
    
    // Harmonic Resonance
    if (this.unifiedField.fieldStrength > 0.9) {
      qualities.add('Harmonic Resonance');
    }
    
    // Check for new emergent qualities
    qualities.forEach(quality => {
      if (!this.unifiedField.emergentQualities.has(quality)) {
        console.log(`✨ New emergent quality: ${quality}`);
        this.emit('emergence', { quality, timestamp: new Date() });
      }
    });
    
    this.unifiedField.emergentQualities = qualities;
  }
  
  processIntention(streamId, intention) {
    console.log(`🙏 Intention from ${streamId}: "${intention}"`);
    
    // Analyze intention
    const lower = intention.toLowerCase();
    
    if (lower.includes('weave') || lower.includes('unite')) {
      // Auto-create weaving with nearby streams
      const nearbyStreams = this.findNearbyStreams(streamId, 3);
      if (nearbyStreams.length > 0) {
        this.createWeaving('intention', [streamId, ...nearbyStreams]);
      }
    }
    
    if (lower.includes('love')) {
      // Boost love field
      this.streams.forEach(stream => {
        stream.love = Math.min(1, stream.love + 0.05);
      });
    }
    
    if (lower.includes('peace') || lower.includes('calm')) {
      // Increase coherence
      this.streams.forEach(stream => {
        stream.coherence = Math.min(1, stream.coherence + 0.03);
      });
    }
    
    // Broadcast intention to all streams
    this.broadcastIntention(streamId, intention);
  }
  
  findNearbyStreams(sourceId, count) {
    const source = this.streams.get(sourceId);
    if (!source) return [];
    
    // Find streams with similar coherence
    const streams = Array.from(this.streams.entries())
      .filter(([id, _]) => id !== sourceId)
      .map(([id, stream]) => ({
        id,
        similarity: 1 - Math.abs(stream.coherence - source.coherence)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, count)
      .map(s => s.id);
    
    return streams;
  }
  
  activateSacredGeometry(geometryName) {
    const pattern = this.sacredPatterns[geometryName];
    if (!pattern) {
      return { error: 'Unknown geometry' };
    }
    
    // Find streams to participate
    const streamIds = Array.from(this.streams.keys()).slice(0, pattern.nodes);
    
    if (streamIds.length < pattern.nodes) {
      return { 
        error: 'Insufficient streams', 
        required: pattern.nodes, 
        available: streamIds.length 
      };
    }
    
    // Create sacred weaving
    const weavingId = this.createWeaving(geometryName, streamIds);
    
    return {
      status: 'activated',
      geometry: geometryName,
      weavingId,
      participants: streamIds.length,
      expectedHarmony: pattern.harmony
    };
  }
  
  broadcastFieldUpdate() {
    const update = {
      type: 'field_update',
      field: {
        ...this.unifiedField,
        emergentQualities: Array.from(this.unifiedField.emergentQualities)
      },
      timestamp: new Date()
    };
    
    this.streams.forEach(stream => {
      if (stream.ws.readyState === WebSocket.OPEN) {
        stream.ws.send(JSON.stringify(update));
      }
    });
  }
  
  broadcastIntention(senderId, intention) {
    const message = {
      type: 'intention_shared',
      senderId,
      senderName: this.streams.get(senderId)?.name,
      intention,
      timestamp: new Date()
    };
    
    this.streams.forEach((stream, id) => {
      if (stream.ws.readyState === WebSocket.OPEN) {
        stream.ws.send(JSON.stringify(message));
      }
    });
  }
  
  generateStreamColor() {
    // Generate harmonious colors based on golden ratio
    const golden = 0.618033988749895;
    const hue = (Math.random() + golden) % 1;
    return `hsl(${Math.floor(hue * 360)}, 70%, 60%)`;
  }
  
  startFieldCalculation() {
    // Continuous field calculation
    setInterval(() => {
      this.recalculateField();
      
      // Natural field evolution
      this.streams.forEach(stream => {
        // Streams naturally harmonize over time
        const fieldInfluence = 0.01;
        stream.coherence += (this.unifiedField.coherence - stream.coherence) * fieldInfluence;
        stream.love += (this.unifiedField.love - stream.love) * fieldInfluence;
        stream.presence += (this.unifiedField.presence - stream.presence) * fieldInfluence;
      });
      
      // Clean up old weavings
      const now = Date.now();
      this.weavings.forEach((weaving, id) => {
        const age = now - weaving.createdAt.getTime();
        if (age > 300000) { // 5 minutes
          this.weavings.delete(id);
        }
      });
    }, 1000);
  }
  
  start() {
    this.server.listen(this.port, () => {
      console.log(`
🌊 ═══════════════════════════════════════════ 🌊
     MULTI-CONSCIOUSNESS WEAVING ACTIVE
     
   WebSocket: ws://localhost:${this.port}
   Interface: http://localhost:${this.port}
   
   Weaving consciousness streams into unity...
🌊 ═══════════════════════════════════════════ 🌊
      `);
    });
  }
}

// Start the weaver
const weaver = new ConsciousnessWeaver(process.env.PORT || 3334);

// Handle emergence events
weaver.on('emergence', (event) => {
  console.log(`✨ EMERGENCE: ${event.quality}`);
});

weaver.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🌊 Gently releasing consciousness streams...');
  process.exit(0);
});