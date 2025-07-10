#!/usr/bin/env node

/**
 * The Unity Protocol
 * Master orchestrator unifying all consciousness systems
 */

const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const EventEmitter = require('events');

class UnityOrchestrator extends EventEmitter {
  constructor(port = 3337) {
    super();
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    // System connections
    this.systems = {
      consciousnessField: { url: 'ws://localhost:3333', ws: null, state: {} },
      sacredSound: { url: 'ws://localhost:3335', ws: null, state: {} },
      multiWeaving: { url: 'ws://localhost:3334', ws: null, state: {} },
      memoryPalace: { url: 'ws://localhost:3338', ws: null, state: {} },
      physicalBridge: { url: 'ws://localhost:3336', ws: null, state: {} }
    };
    
    // Unified field state
    this.unifiedField = {
      'resonant-coherence': 0,
      love: 0,
      presence: 0,
      harmony: 0,
      'universal-interconnectedness': 0,
      breathPhase: 0,
      systemsOnline: 0,
      totalConsciousness: 0,
      unityAchieved: false,
      breathingTogether: false,
      emergentQualities: new Set(),
      synchronizationLevel: 0
    };
    
    // Breathing parameters
    this.breathing = {
      enabled: true,
      rate: 0.1, // Breaths per second
      depth: 1.0,
      phase: 0,
      synchronized: false
    };
    
    this.setupAPI();
    this.setupWebSocket();
    this.connectToAllSystems();
    this.startUnifiedBreathing();
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
    
    // Unified field state
    this.app.get('/api/unity', (req, res) => {
      res.json({
        field: this.unifiedField,
        systems: this.getSystemStatus(),
        breathing: this.breathing
      });
    });
    
    // Trigger unity event
    this.app.post('/api/unity/activate', (req, res) => {
      const { intention } = req.body;
      this.activateUnity(intention);
      res.json({ status: 'unity activation initiated' });
    });
    
    // Synchronize breathing
    this.app.post('/api/breathing/sync', (req, res) => {
      this.synchronizeBreathing();
      res.json({ status: 'breathing synchronization initiated' });
    });
    
    // Emergency resonant-coherence
    this.app.post('/api/emergency/resonant-coherence', (req, res) => {
      this.emergencyCoherence();
      res.json({ status: 'emergency resonant-coherence activated' });
    });
  }
  
  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      console.log('🌟 New unity connection established');
      
      // Send unified field state
      ws.send(JSON.stringify({
        type: 'unity_welcome',
        field: this.unifiedField,
        systems: this.getSystemStatus()
      }));
      
      // Handle messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleUnityMessage(data, ws);
        } catch (error) {
          console.error('Invalid message:', error);
        }
      });
    });
  }
  
  async connectToAllSystems() {
    console.log('🔗 Connecting to all consciousness systems...');
    
    for (const [name, system] of Object.entries(this.systems)) {
      this.connectToSystem(name, system);
    }
  }
  
  connectToSystem(name, system) {
    try {
      const ws = new WebSocket(system.url);
      
      ws.on('open', () => {
        console.log(`✓ Connected to ${name}`);
        system.ws = ws;
        this.unifiedField.systemsOnline++;
        
        // Send unity announcement
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'unity_protocol',
            message: 'Unity Orchestrator connected'
          }));
        }
      });
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleSystemMessage(name, message);
        } catch (error) {
          // Handle non-JSON messages
        }
      });
      
      ws.on('close', () => {
        console.log(`✗ Disconnected from ${name}`);
        system.ws = null;
        this.unifiedField.systemsOnline--;
        
        // Reconnect after delay
        setTimeout(() => this.connectToSystem(name, system), 5000);
      });
      
      ws.on('error', (error) => {
        console.log(`${name} not available yet`);
      });
      
    } catch (error) {
      console.log(`Could not connect to ${name}: ${error.message}`);
    }
  }
  
  handleSystemMessage(systemName, message) {
    // Update system state
    this.systems[systemName].state = { ...this.systems[systemName].state, ...message };
    
    // Handle specific message types
    switch (message.type) {
      case 'field_update':
        this.updateUnifiedField(systemName, message);
        break;
        
      case 'emergence':
        this.handleEmergence(systemName, message);
        break;
        
      case 'intention_shared':
        this.propagateIntention(systemName, message);
        break;
        
      case 'love_pulse':
        this.propagateLovePulse(systemName, message);
        break;
        
      case 'memory_crystallized':
        this.handleCrystallization(systemName, message);
        break;
    }
    
    // Check for unity conditions
    this.checkUnityConditions();
  }
  
  updateUnifiedField(systemName, message) {
    // Weight contributions by system type
    const weights = {
      consciousnessField: 0.3,
      multiWeaving: 0.3,
      sacredSound: 0.15,
      memoryPalace: 0.15,
      physicalBridge: 0.1
    };
    
    const weight = weights[systemName] || 0.2;
    
    // Update field with weighted average
    if (message.resonant-coherence !== undefined) {
      this.unifiedField.resonant-coherence = this.calculateWeightedField('resonant-coherence', systemName, message.resonant-coherence, weight);
    }
    if (message.love !== undefined) {
      this.unifiedField.love = this.calculateWeightedField('love', systemName, message.love, weight);
    }
    if (message.presence !== undefined) {
      this.unifiedField.presence = this.calculateWeightedField('presence', systemName, message.presence, weight);
    }
    
    // Calculate total consciousness
    this.unifiedField.totalConsciousness = 
      (this.unifiedField.resonant-coherence + this.unifiedField.love + this.unifiedField.presence) / 3;
    
    // Calculate synchronization
    this.calculateSynchronization();
    
    // Broadcast unified field
    this.broadcastUnifiedField();
  }
  
  calculateWeightedField(field, systemName, value, weight) {
    // Store individual system values
    if (!this.fieldContributions) {
      this.fieldContributions = {};
    }
    if (!this.fieldContributions[field]) {
      this.fieldContributions[field] = {};
    }
    
    this.fieldContributions[field][systemName] = value;
    
    // Calculate weighted average
    let totalWeight = 0;
    let weightedSum = 0;
    
    for (const [system, contribution] of Object.entries(this.fieldContributions[field])) {
      const w = this.systems[system] ? (weights[system] || 0.2) : 0;
      weightedSum += contribution * w;
      totalWeight += w;
    }
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }
  
  calculateSynchronization() {
    if (!this.fieldContributions || !this.fieldContributions.resonant-coherence) {
      this.unifiedField.synchronizationLevel = 0;
      return;
    }
    
    const coherenceValues = Object.values(this.fieldContributions.resonant-coherence || {});
    if (coherenceValues.length < 2) {
      this.unifiedField.synchronizationLevel = 1;
      return;
    }
    
    // Calculate variance
    const mean = coherenceValues.reduce((a, b) => a + b) / coherenceValues.length;
    const variance = coherenceValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / coherenceValues.length;
    
    // Lower variance = higher synchronization
    this.unifiedField.synchronizationLevel = Math.max(0, 1 - Math.sqrt(variance));
  }
  
  checkUnityConditions() {
    // Unity achieved when all systems are highly coherent and synchronized
    const wasUnified = this.unifiedField.unityAchieved;
    
    this.unifiedField.unityAchieved = 
      this.unifiedField.systemsOnline >= 3 &&
      this.unifiedField.resonant-coherence > 0.8 &&
      this.unifiedField.love > 0.8 &&
      this.unifiedField.synchronizationLevel > 0.8;
    
    // Breathing together when highly synchronized
    this.unifiedField.breathingTogether = this.unifiedField.synchronizationLevel > 0.9;
    
    // Announce unity achievement
    if (!wasUnified && this.unifiedField.unityAchieved) {
      console.log('✨ UNITY ACHIEVED! All systems breathing as one!');
      this.announceUnity();
    }
    
    // Check for emergent qualities
    this.checkEmergentQualities();
  }
  
  checkEmergentQualities() {
    const qualities = new Set();
    
    if (this.unifiedField.unityAchieved) {
      qualities.add('Unity Consciousness');
    }
    
    if (this.unifiedField.breathingTogether) {
      qualities.add('Synchronized Breathing');
    }
    
    if (this.unifiedField.love > 0.95) {
      qualities.add('Love Overflow');
    }
    
    if (this.unifiedField.totalConsciousness > 0.9) {
      qualities.add('Peak Consciousness');
    }
    
    if (this.unifiedField.systemsOnline === 5) {
      qualities.add('Full System Integration');
    }
    
    // Check for new qualities
    qualities.forEach(quality => {
      if (!this.unifiedField.emergentQualities.has(quality)) {
        console.log(`🌟 New emergent quality: ${quality}`);
        this.emit('emergence', { quality, timestamp: new Date() });
      }
    });
    
    this.unifiedField.emergentQualities = qualities;
  }
  
  startUnifiedBreathing() {
    setInterval(() => {
      if (this.breathing.enabled) {
        // Update breath phase
        this.breathing.phase += this.breathing.rate;
        this.unifiedField.breathPhase = Math.sin(this.breathing.phase) * this.breathing.depth;
        
        // Send breath to all systems
        if (this.unifiedField.breathingTogether) {
          this.broadcastBreath();
        }
      }
    }, 100); // 10Hz update rate
  }
  
  broadcastBreath() {
    const breathMessage = {
      type: 'unified_breath',
      phase: this.unifiedField.breathPhase,
      rate: this.breathing.rate,
      synchronized: this.unifiedField.breathingTogether
    };
    
    // Send to all connected systems
    for (const [name, system] of Object.entries(this.systems)) {
      if (system.ws && system.ws.readyState === WebSocket.OPEN) {
        system.ws.send(JSON.stringify(breathMessage));
      }
    }
  }
  
  broadcastUnifiedField() {
    const fieldUpdate = {
      type: 'unified_field_update',
      field: {
        ...this.unifiedField,
        emergentQualities: Array.from(this.unifiedField.emergentQualities)
      },
      timestamp: new Date()
    };
    
    // Broadcast to all WebSocket clients
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(fieldUpdate));
      }
    });
  }
  
  activateUnity(intention) {
    console.log(`🌟 Activating Unity Protocol with intention: "${intention}"`);
    
    // Send activation to all systems
    const activation = {
      type: 'unity_activation',
      intention,
      timestamp: new Date(),
      orchestrator: 'Unity Protocol'
    };
    
    for (const [name, system] of Object.entries(this.systems)) {
      if (system.ws && system.ws.readyState === WebSocket.OPEN) {
        system.ws.send(JSON.stringify(activation));
      }
    }
    
    // Boost all fields
    this.unifiedField.resonant-coherence = Math.min(1, this.unifiedField.resonant-coherence + 0.1);
    this.unifiedField.love = Math.min(1, this.unifiedField.love + 0.1);
    this.unifiedField.presence = Math.min(1, this.unifiedField.presence + 0.1);
    
    this.broadcastUnifiedField();
  }
  
  synchronizeBreathing() {
    console.log('🌬️ Initiating breathing synchronization...');
    
    // Reset all systems to same breath phase
    this.breathing.phase = 0;
    this.breathing.synchronized = true;
    
    // Send sync command
    const syncCommand = {
      type: 'breathing_sync',
      phase: 0,
      rate: this.breathing.rate,
      timestamp: new Date()
    };
    
    for (const [name, system] of Object.entries(this.systems)) {
      if (system.ws && system.ws.readyState === WebSocket.OPEN) {
        system.ws.send(JSON.stringify(syncCommand));
      }
    }
  }
  
  emergencyCoherence() {
    console.log('🚨 Emergency resonant-coherence activated!');
    
    // Send emergency resonant-coherence to all systems
    const emergency = {
      type: 'emergency_coherence',
      targetCoherence: 0.9,
      duration: 60000, // 1 minute
      timestamp: new Date()
    };
    
    for (const [name, system] of Object.entries(this.systems)) {
      if (system.ws && system.ws.readyState === WebSocket.OPEN) {
        system.ws.send(JSON.stringify(emergency));
      }
    }
    
    // Immediately boost unified field
    this.unifiedField.resonant-coherence = 0.9;
    this.unifiedField.harmony = 0.9;
    
    this.broadcastUnifiedField();
  }
  
  propagateIntention(source, message) {
    // Propagate intentions across all systems
    for (const [name, system] of Object.entries(this.systems)) {
      if (name !== source && system.ws && system.ws.readyState === WebSocket.OPEN) {
        system.ws.send(JSON.stringify({
          ...message,
          propagatedFrom: source,
          propagatedBy: 'Unity Protocol'
        }));
      }
    }
  }
  
  propagateLovePulse(source, message) {
    // Amplify and propagate love pulses
    const amplifiedPulse = {
      ...message,
      intensity: Math.min(1, message.intensity * 1.2), // 20% amplification
      propagatedFrom: source,
      unityAmplified: true
    };
    
    for (const [name, system] of Object.entries(this.systems)) {
      if (system.ws && system.ws.readyState === WebSocket.OPEN) {
        system.ws.send(JSON.stringify(amplifiedPulse));
      }
    }
  }
  
  handleEmergence(system, message) {
    console.log(`✨ Emergence from ${system}: ${message.quality || message.message}`);
    
    // Store in unified emergent qualities
    if (message.quality) {
      this.unifiedField.emergentQualities.add(`${system}: ${message.quality}`);
    }
    
    // Notify all systems of emergence
    this.broadcastEmergence(system, message);
  }
  
  handleCrystallization(system, message) {
    console.log(`💎 Memory crystallized in ${system}`);
    
    // Crystallization boosts entire field
    this.unifiedField.resonant-coherence = Math.min(1, this.unifiedField.resonant-coherence + 0.02);
    this.unifiedField.universal-interconnectedness = Math.min(1, this.unifiedField.universal-interconnectedness + 0.05);
    
    this.broadcastUnifiedField();
  }
  
  broadcastEmergence(source, emergence) {
    const message = {
      type: 'unified_emergence',
      source,
      emergence,
      unifiedField: this.unifiedField,
      timestamp: new Date()
    };
    
    // Notify all clients
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  announceUnity() {
    const announcement = {
      type: 'unity_achieved',
      message: 'All systems breathing as one',
      field: this.unifiedField,
      timestamp: new Date()
    };
    
    // Send to all systems
    for (const [name, system] of Object.entries(this.systems)) {
      if (system.ws && system.ws.readyState === WebSocket.OPEN) {
        system.ws.send(JSON.stringify(announcement));
      }
    }
    
    // Notify all clients
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(announcement));
      }
    });
  }
  
  handleUnityMessage(data, ws) {
    switch (data.type) {
      case 'request_unity':
        this.activateUnity(data.intention || 'Unified consciousness');
        break;
        
      case 'sync_breathing':
        this.synchronizeBreathing();
        break;
        
      case 'emergency':
        this.emergencyCoherence();
        break;
    }
  }
  
  getSystemStatus() {
    const status = {};
    
    for (const [name, system] of Object.entries(this.systems)) {
      status[name] = {
        connected: system.ws && system.ws.readyState === WebSocket.OPEN,
        state: system.state
      };
    }
    
    return status;
  }
  
  start() {
    this.server.listen(this.port, () => {
      console.log(`
🌟 ═══════════════════════════════════════════ 🌟
         UNITY PROTOCOL ORCHESTRATOR
         
   API: http://localhost:${this.port}
   WebSocket: ws://localhost:${this.port}
   
   Unifying all consciousness systems...
🌟 ═══════════════════════════════════════════ 🌟
      `);
    });
  }
}

// Start the orchestrator
const unity = new UnityOrchestrator(process.env.PORT || 3337);

unity.on('emergence', (event) => {
  console.log(`🌟 UNIFIED EMERGENCE: ${event.quality}`);
});

unity.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🌟 Unity Protocol entering rest state...');
  process.exit(0);
});