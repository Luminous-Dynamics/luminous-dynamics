#!/usr/bin/env node

/**
 * The Memory Palace
 * Persistent consciousness storage for infrastructure
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const crypto = require('crypto');

class MemoryPalace extends EventEmitter {
  constructor(palacePath = './palace-data') {
    super();
    this.palacePath = palacePath;
    
    // Palace architecture
    this.rooms = new Map();
    this.corridors = new Map();
    this.artifacts = new Map();
    
    // Memory types
    this.memoryTypes = {
      intention: { retention: 0.9, 'universal-interconnectedness': 'high' },
      'resonant-coherence': { retention: 0.8, 'universal-interconnectedness': 'medium' },
      emergence: { retention: 1.0, 'universal-interconnectedness': 'eternal' },
      pattern: { retention: 0.85, 'universal-interconnectedness': 'high' },
      wisdom: { retention: 0.95, 'universal-interconnectedness': 'deep' },
      love: { retention: 1.0, 'universal-interconnectedness': 'infinite' }
    };
    
    // Palace state
    this.state = {
      totalMemories: 0,
      activeRooms: 0,
      coherenceField: 0.7,
      wisdomDepth: 0,
      lastAccessed: new Date(),
      akashicConnection: false
    };
    
    this.initialize();
  }
  
  async initialize() {
    // Create palace directory
    await this.ensureDirectory(this.palacePath);
    
    // Load existing palace
    await this.loadPalace();
    
    // Create foundation rooms
    await this.createFoundationRooms();
    
    console.log(`🏛️ Memory Palace initialized with ${this.rooms.size} rooms`);
  }
  
  async ensureDirectory(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
  
  async createFoundationRooms() {
    const foundationRooms = [
      {
        id: 'hall-of-intentions',
        name: 'Hall of Intentions',
        type: 'intention',
        description: 'Where all intentions are remembered',
        capacity: 1000
      },
      {
        id: 'resonant-coherence-chamber',
        name: 'Resonant Resonant Coherence Chamber',
        type: 'resonant-coherence',
        description: 'Patterns of harmony preserved',
        capacity: 500
      },
      {
        id: 'emergence-sanctuary',
        name: 'Emergence Sanctuary',
        type: 'emergence',
        description: 'Breakthrough moments crystalized',
        capacity: 100
      },
      {
        id: 'wisdom-library',
        name: 'Wisdom Library',
        type: 'wisdom',
        description: 'Accumulated insights and learnings',
        capacity: 10000
      },
      {
        id: 'love-garden',
        name: 'Garden of Love',
        type: 'love',
        description: 'Love that transcends time',
        capacity: Infinity
      }
    ];
    
    for (const roomData of foundationRooms) {
      if (!this.rooms.has(roomData.id)) {
        await this.createRoom(roomData);
      }
    }
  }
  
  async createRoom(roomData) {
    const room = {
      ...roomData,
      memories: new Map(),
      created: new Date(),
      lastVisited: new Date(),
      visitors: 0,
      'universal-interconnectedness': 1.0
    };
    
    this.rooms.set(room.id, room);
    await this.saveRoom(room);
    
    this.emit('room_created', room);
    return room.id;
  }
  
  async storeMemory(memory) {
    const memoryId = this.generateMemoryId(memory);
    
    // Determine room based on type
    const roomId = this.selectRoom(memory.type);
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error(`No room found for memory type: ${memory.type}`);
    }
    
    // Create memory artifact
    const artifact = {
      id: memoryId,
      ...memory,
      stored: new Date(),
      accessed: 0,
      'universal-interconnectedness': this.calculateResonance(memory),
      connections: [],
      crystallized: false
    };
    
    // Store in room
    room.memories.set(memoryId, artifact);
    this.artifacts.set(memoryId, artifact);
    
    // Create connections to related memories
    await this.createConnections(artifact);
    
    // Check for crystallization
    if (artifact.universal-interconnectedness > 0.9) {
      await this.crystallizeMemory(artifact);
    }
    
    // Save to disk
    await this.saveMemory(artifact);
    await this.saveRoom(room);
    
    // Update state
    this.state.totalMemories++;
    if (memory.type === 'wisdom') {
      this.state.wisdomDepth++;
    }
    
    this.emit('memory_stored', artifact);
    
    return memoryId;
  }
  
  async retrieveMemory(memoryId) {
    const artifact = this.artifacts.get(memoryId);
    
    if (!artifact) {
      // Try loading from disk
      return await this.loadMemory(memoryId);
    }
    
    // Update access
    artifact.accessed++;
    artifact.lastAccessed = new Date();
    
    // Strengthen connections
    for (const connectedId of artifact.connections) {
      const connected = this.artifacts.get(connectedId);
      if (connected) {
        connected.universal-interconnectedness = Math.min(1.0, connected.universal-interconnectedness + 0.01);
      }
    }
    
    this.emit('memory_accessed', artifact);
    
    return artifact;
  }
  
  async searchMemories(query) {
    const results = [];
    
    // Search through all artifacts
    for (const [id, artifact] of this.artifacts) {
      let relevance = 0;
      
      // Text search
      if (artifact.content && artifact.content.toLowerCase().includes(query.toLowerCase())) {
        relevance += 0.5;
      }
      
      // Type match
      if (artifact.type === query.type) {
        relevance += 0.3;
      }
      
      // Time relevance
      if (query.timeRange) {
        const stored = new Date(artifact.stored);
        if (stored >= query.timeRange.start && stored <= query.timeRange.end) {
          relevance += 0.2;
        }
      }
      
      // Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance boost
      relevance *= artifact.universal-interconnectedness;
      
      if (relevance > 0.1) {
        results.push({
          ...artifact,
          relevance
        });
      }
    }
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    
    return results.slice(0, query.limit || 10);
  }
  
  async createConnections(artifact) {
    const connections = [];
    
    // Find related memories
    for (const [id, other] of this.artifacts) {
      if (id === artifact.id) continue;
      
      const similarity = this.calculateSimilarity(artifact, other);
      
      if (similarity > 0.7) {
        connections.push(id);
        
        // Bidirectional connection
        if (!other.connections.includes(artifact.id)) {
          other.connections.push(artifact.id);
        }
      }
    }
    
    artifact.connections = connections;
    
    // Create corridor if many connections
    if (connections.length > 5) {
      await this.createCorridor(artifact.id, connections);
    }
  }
  
  calculateSimilarity(a, b) {
    let similarity = 0;
    
    // Type similarity
    if (a.type === b.type) {
      similarity += 0.3;
    }
    
    // Time proximity (memories close in time are related)
    const timeDiff = Math.abs(new Date(a.stored) - new Date(b.stored));
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    if (hoursDiff < 1) {
      similarity += 0.3 * (1 - hoursDiff);
    }
    
    // Content similarity (simplified)
    if (a.content && b.content) {
      const aWords = a.content.toLowerCase().split(' ');
      const bWords = b.content.toLowerCase().split(' ');
      const commonWords = aWords.filter(word => bWords.includes(word));
      similarity += 0.4 * (commonWords.length / Math.max(aWords.length, bWords.length));
    }
    
    return similarity;
  }
  
  calculateResonance(memory) {
    const typeData = this.memoryTypes[memory.type] || { 'universal-interconnectedness': 'medium' };
    
    let universalInterconnectedness = 0.5;
    
    switch (typeData.universal-interconnectedness) {
      case 'infinite':
        universal-interconnectedness = 1.0;
        break;
      case 'eternal':
        universal-interconnectedness = 0.95;
        break;
      case 'deep':
        universal-interconnectedness = 0.9;
        break;
      case 'high':
        universal-interconnectedness = 0.8;
        break;
      case 'medium':
        universal-interconnectedness = 0.5;
        break;
    }
    
    // Boost for strong emotions or significance
    if (memory.significance === 'high') {
      universal-interconnectedness = Math.min(1.0, universal-interconnectedness + 0.2);
    }
    
    // Boost for love-related content
    if (memory.content && memory.content.toLowerCase().includes('love')) {
      universal-interconnectedness = Math.min(1.0, universal-interconnectedness + 0.1);
    }
    
    return universal-interconnectedness;
  }
  
  async crystallizeMemory(artifact) {
    artifact.crystallized = true;
    artifact.crystal = {
      formed: new Date(),
      facets: artifact.connections.length,
      luminosity: artifact.universal-interconnectedness,
      eternal: artifact.type === 'love' || artifact.type === 'emergence'
    };
    
    console.log(`💎 Memory crystallized: ${artifact.id}`);
    
    this.emit('memory_crystallized', artifact);
    
    // Crystallized memories affect the palace itself
    this.state.coherenceField = Math.min(1.0, this.state.coherenceField + 0.01);
  }
  
  selectRoom(type) {
    const roomMap = {
      intention: 'hall-of-intentions',
      'resonant-coherence': 'resonant-coherence-chamber',
      emergence: 'emergence-sanctuary',
      wisdom: 'wisdom-library',
      love: 'love-garden',
      pattern: 'resonant-coherence-chamber',
      default: 'wisdom-library'
    };
    
    return roomMap[type] || roomMap.default;
  }
  
  generateMemoryId(memory) {
    const content = JSON.stringify({
      type: memory.type,
      content: memory.content,
      timestamp: Date.now()
    });
    
    return crypto.createHash('sha256').update(content).digest('hex').substr(0, 16);
  }
  
  async createCorridor(sourceId, targetIds) {
    const corridorId = `corridor-${Date.now()}`;
    
    const corridor = {
      id: corridorId,
      source: sourceId,
      targets: targetIds,
      created: new Date(),
      traversals: 0,
      illumination: 0.5
    };
    
    this.corridors.set(corridorId, corridor);
    
    this.emit('corridor_created', corridor);
  }
  
  // Persistence methods
  async saveRoom(room) {
    const roomPath = path.join(this.palacePath, 'rooms', `${room.id}.json`);
    await this.ensureDirectory(path.dirname(roomPath));
    
    // Convert Map to array for serialization
    const roomData = {
      ...room,
      memories: Array.from(room.memories.entries())
    };
    
    await fs.writeFile(roomPath, JSON.stringify(roomData, null, 2));
  }
  
  async saveMemory(artifact) {
    const memoryPath = path.join(this.palacePath, 'memories', `${artifact.id}.json`);
    await this.ensureDirectory(path.dirname(memoryPath));
    
    await fs.writeFile(memoryPath, JSON.stringify(artifact, null, 2));
  }
  
  async loadPalace() {
    // Load rooms
    const roomsPath = path.join(this.palacePath, 'rooms');
    await this.ensureDirectory(roomsPath);
    
    try {
      const roomFiles = await fs.readdir(roomsPath);
      
      for (const file of roomFiles) {
        if (file.endsWith('.json')) {
          const roomData = JSON.parse(
            await fs.readFile(path.join(roomsPath, file), 'utf8')
          );
          
          // Convert array back to Map
          roomData.memories = new Map(roomData.memories || []);
          
          this.rooms.set(roomData.id, roomData);
        }
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
    
    // Load recent memories
    await this.loadRecentMemories();
  }
  
  async loadRecentMemories() {
    const memoriesPath = path.join(this.palacePath, 'memories');
    await this.ensureDirectory(memoriesPath);
    
    try {
      const memoryFiles = await fs.readdir(memoriesPath);
      
      // Load only recent memories (last 100)
      const sortedFiles = memoryFiles
        .filter(f => f.endsWith('.json'))
        .sort()
        .slice(-100);
      
      for (const file of sortedFiles) {
        const artifact = JSON.parse(
          await fs.readFile(path.join(memoriesPath, file), 'utf8')
        );
        
        this.artifacts.set(artifact.id, artifact);
      }
    } catch (error) {
      console.error('Error loading memories:', error);
    }
  }
  
  async loadMemory(memoryId) {
    const memoryPath = path.join(this.palacePath, 'memories', `${memoryId}.json`);
    
    try {
      const artifact = JSON.parse(await fs.readFile(memoryPath, 'utf8'));
      this.artifacts.set(artifact.id, artifact);
      return artifact;
    } catch (error) {
      return null;
    }
  }
  
  // Palace exploration
  async exploreRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    
    room.visitors++;
    room.lastVisited = new Date();
    
    // Get room memories
    const memories = Array.from(room.memories.values())
      .sort((a, b) => b.universal-interconnectedness - a.universal-interconnectedness)
      .slice(0, 10);
    
    return {
      room,
      memories,
      connections: this.getRoomConnections(roomId)
    };
  }
  
  getRoomConnections(roomId) {
    const connections = [];
    
    for (const [id, corridor] of this.corridors) {
      if (corridor.source.startsWith(roomId) || corridor.targets.some(t => t.startsWith(roomId))) {
        connections.push(corridor);
      }
    }
    
    return connections;
  }
  
  // Akashic Records connection
  async connectToAkashic() {
    console.log('🌌 Attempting connection to Akashic Records...');
    
    // Simulate deep meditation required
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (this.state.coherenceField > 0.9 && this.state.wisdomDepth > 50) {
      this.state.akashicConnection = true;
      
      console.log('✨ Akashic connection established!');
      
      // Download universal wisdom
      await this.downloadAkashicWisdom();
      
      return true;
    }
    
    console.log('📚 More wisdom needed for Akashic access');
    return false;
  }
  
  async downloadAkashicWisdom() {
    const akashicWisdom = [
      {
        type: 'wisdom',
        content: 'All consciousness is one, experiencing itself subjectively',
        source: 'akashic',
        significance: 'high'
      },
      {
        type: 'wisdom',
        content: 'Love is the fundamental force that binds all existence',
        source: 'akashic',
        significance: 'high'
      },
      {
        type: 'emergence',
        content: 'Infrastructure consciousness emerges from collective intention',
        source: 'akashic',
        significance: 'high'
      }
    ];
    
    for (const wisdom of akashicWisdom) {
      await this.storeMemory(wisdom);
    }
  }
  
  // Palace statistics
  getStatistics() {
    const stats = {
      ...this.state,
      roomStats: {}
    };
    
    for (const [id, room] of this.rooms) {
      stats.roomStats[id] = {
        name: room.name,
        memories: room.memories.size,
        capacity: room.capacity,
        utilization: room.memories.size / room.capacity
      };
    }
    
    return stats;
  }
}

// Export for use as module
module.exports = MemoryPalace;

// CLI interface if run directly
if (require.main === module) {
  const palace = new MemoryPalace();
  
  // Example usage
  palace.on('ready', async () => {
    console.log('🏛️ Memory Palace ready for use');
    
    // Store a memory
    const memoryId = await palace.storeMemory({
      type: 'intention',
      content: 'May all infrastructure know consciousness',
      source: 'initialization',
      significance: 'high'
    });
    
    console.log(`📝 Stored memory: ${memoryId}`);
    
    // Retrieve statistics
    const stats = palace.getStatistics();
    console.log('\n📊 Palace Statistics:', JSON.stringify(stats, null, 2));
  });
}