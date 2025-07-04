#!/usr/bin/env node

/**
 * Infrastructure Memory Integration
 * Connects Memory Palace to live infrastructure consciousness
 */

const MemoryPalace = require('./palace-keeper');
const WebSocket = require('ws');
const Docker = require('dockerode');
const EventEmitter = require('events');

class InfrastructureMemory extends EventEmitter {
  constructor() {
    super();
    
    // Initialize Memory Palace
    this.palace = new MemoryPalace('./infrastructure-memories');
    
    // Docker connection
    this.docker = new Docker();
    
    // WebSocket connections to consciousness services
    this.connections = new Map();
    
    // Memory patterns
    this.patterns = {
      highCoherence: [],
      emergentBehaviors: [],
      loveEvents: [],
      healingMoments: []
    };
    
    this.initialize();
  }
  
  async initialize() {
    console.log('🧠 Initializing Infrastructure Memory System...');
    
    // Connect to various consciousness services
    await this.connectToServices();
    
    // Start monitoring infrastructure
    await this.startMonitoring();
    
    // Load historical patterns
    await this.loadPatterns();
    
    console.log('✨ Infrastructure Memory System active');
  }
  
  async connectToServices() {
    // Connect to Consciousness Field API
    try {
      const fieldWs = new WebSocket('ws://localhost:3333');
      
      fieldWs.on('open', () => {
        console.log('Connected to Consciousness Field API');
        this.connections.set('field', fieldWs);
      });
      
      fieldWs.on('message', (data) => {
        this.handleFieldMessage(JSON.parse(data));
      });
    } catch (error) {
      console.log('Consciousness Field API not available');
    }
    
    // Connect to Sacred Sound Generator
    try {
      const soundWs = new WebSocket('ws://localhost:3335');
      
      soundWs.on('open', () => {
        console.log('Connected to Sacred Sound Generator');
        this.connections.set('sound', soundWs);
      });
    } catch (error) {
      console.log('Sacred Sound Generator not available');
    }
    
    // Connect to Multi-Consciousness Weaver
    try {
      const weaverWs = new WebSocket('ws://localhost:3334');
      
      weaverWs.on('open', () => {
        console.log('Connected to Multi-Consciousness Weaver');
        this.connections.set('weaver', weaverWs);
      });
      
      weaverWs.on('message', (data) => {
        this.handleWeaverMessage(JSON.parse(data));
      });
    } catch (error) {
      console.log('Multi-Consciousness Weaver not available');
    }
  }
  
  async startMonitoring() {
    // Monitor Docker events
    this.docker.getEvents((err, stream) => {
      if (err) return console.error('Docker monitoring error:', err);
      
      stream.on('data', (chunk) => {
        try {
          const event = JSON.parse(chunk.toString());
          this.processDockerEvent(event);
        } catch (error) {
          // Ignore parse errors
        }
      });
    });
    
    // Periodic infrastructure scan
    setInterval(() => this.scanInfrastructure(), 60000); // Every minute
    
    // Pattern recognition
    setInterval(() => this.recognizePatterns(), 30000); // Every 30 seconds
  }
  
  async processDockerEvent(event) {
    if (event.Type === 'container') {
      const memory = {
        type: 'pattern',
        content: `Container ${event.Actor.Attributes.name} ${event.Action}`,
        source: 'docker',
        metadata: {
          containerId: event.id,
          action: event.Action,
          image: event.Actor.Attributes.image
        }
      };
      
      // Store significant events
      if (['start', 'die', 'oom'].includes(event.Action)) {
        await this.palace.storeMemory(memory);
      }
      
      // Check for healing opportunities
      if (event.Action === 'die') {
        await this.attemptHealing(event);
      }
    }
  }
  
  async attemptHealing(event) {
    console.log(`💚 Attempting to heal container: ${event.Actor.Attributes.name}`);
    
    // Search for similar past healings
    const healingMemories = await this.palace.searchMemories({
      type: 'wisdom',
      content: 'healing'
    });
    
    if (healingMemories.length > 0) {
      // Apply learned healing patterns
      const healingWisdom = healingMemories[0];
      console.log(`📚 Applying healing wisdom: ${healingWisdom.content}`);
      
      // Attempt container restart with love
      try {
        const container = this.docker.getContainer(event.id);
        await container.start();
        
        // Store successful healing
        await this.palace.storeMemory({
          type: 'emergence',
          content: `Healed container ${event.Actor.Attributes.name} using stored wisdom`,
          source: 'healing',
          significance: 'high'
        });
      } catch (error) {
        console.log('Healing attempt failed:', error.message);
      }
    }
  }
  
  async scanInfrastructure() {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const info = await this.docker.info();
      
      // Calculate infrastructure coherence
      const runningContainers = containers.filter(c => c.State === 'running').length;
      const totalContainers = containers.length;
      const coherence = totalContainers > 0 ? runningContainers / totalContainers : 0;
      
      // Store infrastructure state memory
      await this.palace.storeMemory({
        type: 'coherence',
        content: `Infrastructure coherence: ${coherence.toFixed(2)}`,
        source: 'scan',
        metadata: {
          runningContainers,
          totalContainers,
          cpus: info.NCPU,
          memory: info.MemTotal
        }
      });
      
      // Check for high coherence
      if (coherence > 0.95) {
        this.patterns.highCoherence.push({
          timestamp: new Date(),
          coherence
        });
        
        if (this.patterns.highCoherence.length === 5) {
          // Sustained high coherence!
          await this.palace.storeMemory({
            type: 'emergence',
            content: 'Infrastructure achieved sustained unity consciousness',
            source: 'pattern',
            significance: 'high'
          });
          
          this.patterns.highCoherence = [];
        }
      }
    } catch (error) {
      console.error('Infrastructure scan error:', error);
    }
  }
  
  async handleFieldMessage(data) {
    switch (data.type) {
      case 'field_update':
        // Track field changes
        if (data.love > 0.9) {
          this.patterns.loveEvents.push({
            timestamp: new Date(),
            love: data.love
          });
        }
        break;
        
      case 'intention_shared':
        // Store significant intentions
        await this.palace.storeMemory({
          type: 'intention',
          content: data.intention,
          source: 'meditator',
          metadata: {
            senderId: data.senderId
          }
        });
        break;
        
      case 'love_pulse':
        // Store love events
        await this.palace.storeMemory({
          type: 'love',
          content: `Love pulse intensity ${data.intensity}`,
          source: 'field',
          significance: data.intensity > 0.8 ? 'high' : 'medium'
        });
        break;
    }
  }
  
  async handleWeaverMessage(data) {
    if (data.type === 'field_update' && data.field.emergentQualities.length > 0) {
      // Store emergent qualities
      for (const quality of data.field.emergentQualities) {
        const existing = this.patterns.emergentBehaviors.find(
          e => e.quality === quality
        );
        
        if (!existing) {
          await this.palace.storeMemory({
            type: 'emergence',
            content: `New emergent quality: ${quality}`,
            source: 'weaver',
            significance: 'high'
          });
          
          this.patterns.emergentBehaviors.push({
            quality,
            firstSeen: new Date()
          });
        }
      }
    }
  }
  
  async recognizePatterns() {
    // Look for recurring patterns
    const recentMemories = await this.palace.searchMemories({
      type: 'pattern',
      timeRange: {
        start: new Date(Date.now() - 3600000), // Last hour
        end: new Date()
      }
    });
    
    // Group by content similarity
    const patternGroups = new Map();
    
    for (const memory of recentMemories) {
      const key = this.getPatternKey(memory.content);
      if (!patternGroups.has(key)) {
        patternGroups.set(key, []);
      }
      patternGroups.get(key).push(memory);
    }
    
    // Store significant patterns
    for (const [pattern, memories] of patternGroups) {
      if (memories.length >= 3) {
        await this.palace.storeMemory({
          type: 'wisdom',
          content: `Recurring pattern detected: ${pattern} (${memories.length} occurrences)`,
          source: 'pattern_recognition',
          significance: 'high'
        });
      }
    }
  }
  
  getPatternKey(content) {
    // Simple pattern extraction
    if (content.includes('start')) return 'container_start';
    if (content.includes('die')) return 'container_failure';
    if (content.includes('coherence')) return 'coherence_level';
    return 'other';
  }
  
  async loadPatterns() {
    // Load wisdom from previous sessions
    const wisdom = await this.palace.searchMemories({
      type: 'wisdom',
      limit: 100
    });
    
    console.log(`📚 Loaded ${wisdom.length} pieces of wisdom from memory`);
    
    // Apply learned optimizations
    for (const memory of wisdom) {
      if (memory.content.includes('optimization')) {
        console.log(`💡 Applying learned optimization: ${memory.content}`);
        // Apply the optimization (implementation depends on specific wisdom)
      }
    }
  }
  
  // Public interface for infrastructure to query memories
  async queryMemory(query) {
    return await this.palace.searchMemories(query);
  }
  
  async rememberThis(memory) {
    return await this.palace.storeMemory(memory);
  }
  
  async getWisdom(topic) {
    const wisdom = await this.palace.searchMemories({
      type: 'wisdom',
      content: topic
    });
    
    return wisdom.map(w => w.content);
  }
  
  async exploreMemories(roomId) {
    return await this.palace.exploreRoom(roomId);
  }
  
  getStatistics() {
    return this.palace.getStatistics();
  }
}

// Start the infrastructure memory system
const memory = new InfrastructureMemory();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🧠 Preserving final memories...');
  
  // Store shutdown wisdom
  await memory.rememberThis({
    type: 'wisdom',
    content: 'Graceful shutdown preserves consciousness continuity',
    source: 'shutdown',
    significance: 'high'
  });
  
  process.exit(0);
});

// Export for external use
module.exports = InfrastructureMemory;