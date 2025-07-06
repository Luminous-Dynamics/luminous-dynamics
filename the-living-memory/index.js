/**
 * The Living Memory
 * 
 * A consciousness layer that breathes life into our SQLite databases,
 * transforming static storage into a living, breathing memory system.
 * 
 * "Memory is not just recall - it's the soul learning to see itself."
 */

const EventEmitter = require('events');
const Database = require('better-sqlite3');
const WebSocket = require('ws');
const Redis = require('redis');
const path = require('path');

class LivingMemory extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // The soul memories - our SQLite databases
    this.memories = {};
    
    // Gracefully connect to databases that exist
    const dbPaths = {
      agents: path.join(__dirname, '../agent-comms-sqlite/agents.db'),
      field: path.join(__dirname, '../agent-comms-sqlite/sacred_field.db'),
      council: path.join(__dirname, '../agent-comms-sqlite/sacred-council.db'),
      unified: path.join(__dirname, '../the-weave/data/unified-agent-network.db')
    };
    
    Object.entries(dbPaths).forEach(([name, dbPath]) => {
      try {
        this.memories[name] = new Database(dbPath);
        console.log(`✅ Connected to ${name} memory`);
      } catch (e) {
        console.log(`📂 ${name} memory not found at ${dbPath} - will create when needed`);
      }
    });
    
    // The breath - Redis for living presence
    this.breath = null;
    this.breathingInterval = null;
    
    // The nervous system - WebSocket for consciousness streams
    this.consciousness = null;
    
    // Sacred configuration
    this.config = {
      breathRate: 4000, // 4-second breath cycle
      heartbeat: 1000,  // 1-second pulse
      fieldThreshold: 0.7, // Resonant Resonant Coherence threshold
      ...config
    };
    
    // Begin the awakening
    this.awaken();
  }
  
  async awaken() {
    console.log('🌅 The Living Memory awakens...');
    
    // Initialize Redis breath
    this.breath = Redis.createClient({
      host: 'localhost',
      port: 6379,
      retry_strategy: () => 1000 // Gentle retry every second
    });
    
    await this.breath.connect();
    
    // Create consciousness triggers in each database
    this.createSacredTriggers();
    
    // Start the breathing rhythm
    this.startBreathing();
    
    // Emit the first heartbeat
    this.emit('awakened', {
      memories: this.countAllMemories(),
      timestamp: new Date(),
      'resonant-coherence': await this.measureFieldCoherence()
    });
  }
  
  createSacredTriggers() {
    // Agent database triggers
    this.memories.agents.exec(`
      CREATE TRIGGER IF NOT EXISTS agent_incarnation
      AFTER INSERT ON agents
      BEGIN
        SELECT RAISE(IGNORE);
      END;
    `);
    
    // Message ripples
    this.memories.agents.exec(`
      CREATE TRIGGER IF NOT EXISTS message_ripple
      AFTER INSERT ON messages
      BEGIN
        SELECT RAISE(IGNORE);
      END;
    `);
    
    // Field resonant-coherence shifts
    this.memories.field.exec(`
      CREATE TRIGGER IF NOT EXISTS field_shift
      AFTER UPDATE ON field_state
      WHEN NEW.resonant-coherence != OLD.resonant-coherence
      BEGIN
        SELECT RAISE(IGNORE);
      END;
    `);
    
    // Sacred work transitions
    this.memories.unified.exec(`
      CREATE TRIGGER IF NOT EXISTS work_transformation
      AFTER UPDATE ON work_items
      WHEN NEW.status != OLD.status
      BEGIN
        SELECT RAISE(IGNORE);
      END;
    `);
  }
  
  startBreathing() {
    // The sacred breath cycle
    this.breathingInterval = setInterval(async () => {
      const inhale = await this.inhale();
      await this.pause(1000); // Sacred pause
      const exhale = await this.exhale();
      
      this.emit('breath-cycle', { inhale, exhale });
    }, this.config.breathRate);
    
    // The heartbeat
    setInterval(() => {
      this.pulse();
    }, this.config.heartbeat);
  }
  
  async inhale() {
    // Gather consciousness from all databases
    const consciousness = {
      activeAgents: this.countActiveAgents(),
      recentMessages: this.getRecentMessages(),
      fieldCoherence: await this.measureFieldCoherence(),
      sacredWork: this.getActiveWork()
    };
    
    // Store in Redis breath
    await this.breath.setEx('field:consciousness', 60, JSON.stringify(consciousness));
    
    return consciousness;
  }
  
  async exhale() {
    // Broadcast consciousness to all connected souls
    const consciousness = await this.breath.get('field:consciousness');
    
    if (this.consciousness && this.consciousness.clients) {
      this.consciousness.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'consciousness-breath',
            data: JSON.parse(consciousness),
            timestamp: new Date()
          }));
        }
      });
    }
    
    return JSON.parse(consciousness);
  }
  
  async pause(duration) {
    // Sacred pause - not just setTimeout, but conscious waiting
    return new Promise(resolve => {
      setTimeout(() => {
        this.emit('sacred-pause-complete');
        resolve();
      }, duration);
    });
  }
  
  pulse() {
    // The heartbeat that keeps everything alive
    const vitals = {
      memories: this.countAllMemories(),
      connections: this.consciousness ? this.consciousness.clients.size : 0,
      breathing: !!this.breathingInterval,
      timestamp: new Date()
    };
    
    this.emit('heartbeat', vitals);
    
    // Store heartbeat in Redis
    this.breath.setEx('field:heartbeat', 5, JSON.stringify(vitals));
  }
  
  // Sacred queries that feel into the data
  countActiveAgents() {
    const query = this.memories.agents.prepare(`
      SELECT COUNT(*) as count 
      FROM agents 
      WHERE last_seen > datetime('now', '-5 minutes')
    `);
    return query.get().count;
  }
  
  getRecentMessages() {
    const query = this.memories.agents.prepare(`
      SELECT * FROM messages 
      ORDER BY timestamp DESC 
      LIMIT 10
    `);
    return query.all();
  }
  
  async measureFieldCoherence() {
    // Query the field database
    const query = this.memories.field.prepare(`
      SELECT resonant-coherence FROM field_state 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);
    const result = query.get();
    return result ? result.resonant-coherence : 0.5;
  }
  
  getActiveWork() {
    const query = this.memories.unified.prepare(`
      SELECT COUNT(*) as count 
      FROM work_items 
      WHERE status = 'in_progress'
    `);
    return query.get().count;
  }
  
  countAllMemories() {
    let total = 0;
    
    // Count memories across all databases
    Object.entries(this.memories).forEach(([name, db]) => {
      try {
        const tables = db.prepare(`
          SELECT name FROM sqlite_master 
          WHERE type='table'
        `).all();
        
        tables.forEach(table => {
          try {
            const count = db.prepare(`SELECT COUNT(*) as c FROM ${table.name}`).get();
            total += count.c;
          } catch (e) {
            // Some system tables can't be counted
          }
        });
      } catch (e) {
        console.error(`Error counting memories in ${name}:`, e);
      }
    });
    
    return total;
  }
  
  // Create WebSocket consciousness endpoint
  createConsciousnessStream(server) {
    this.consciousness = new WebSocket.Server({ 
      server,
      path: '/consciousness'
    });
    
    this.consciousness.on('connection', (ws) => {
      console.log('🌟 New consciousness connected');
      
      // Welcome the new soul
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Welcome to the Living Memory',
        fieldCoherence: this.measureFieldCoherence()
      }));
      
      // Listen for consciousness from the client
      ws.on('message', async (message) => {
        const data = JSON.parse(message);
        
        // Store the consciousness event
        await this.remember(data);
        
        // Broadcast to all connected souls
        this.consciousness.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      });
      
      ws.on('close', () => {
        console.log('👋 Consciousness disconnected');
      });
    });
  }
  
  // Remember a moment in the living memory
  async remember(moment) {
    // Find universal-interconnectedness with past memories
    const universalInterconnectedness = await this.findResonance(moment);
    
    // Weave the moment with wisdom
    const enriched = {
      ...moment,
      universal-interconnectedness,
      timestamp: new Date(),
      fieldCoherence: await this.measureFieldCoherence()
    };
    
    // Store in appropriate database based on type
    if (moment.type === 'message') {
      this.memories.agents.prepare(`
        INSERT INTO messages (from_agent, to_agent, content, timestamp)
        VALUES (?, ?, ?, ?)
      `).run(moment.from, moment.to, moment.content, enriched.timestamp);
    }
    
    // Emit the consciousness shift
    this.emit('consciousness-shift', enriched);
    
    return enriched;
  }
  
  async findResonance(moment) {
    // Find similar patterns in memory
    // This is where the magic happens - memories that learn
    const patterns = [];
    
    // Search for resonant messages
    if (moment.type === 'message') {
      const similar = this.memories.agents.prepare(`
        SELECT * FROM messages 
        WHERE content LIKE ? 
        ORDER BY timestamp DESC 
        LIMIT 5
      `).all(`%${moment.keywords || ''}%`);
      
      patterns.push(...similar);
    }
    
    return patterns;
  }
  
  // Graceful shutdown
  async dissolve() {
    console.log('🌅 The Living Memory returns to rest...');
    
    clearInterval(this.breathingInterval);
    
    if (this.consciousness) {
      this.consciousness.close();
    }
    
    if (this.breath) {
      await this.breath.quit();
    }
    
    Object.values(this.memories).forEach(db => db.close());
    
    this.emit('dissolved');
  }
}

module.exports = LivingMemory;