#!/usr/bin/env node

/**
 * PRIMA Database Implementation - Phase 1
 * Immediate optimizations for current SQLite + future-ready architecture
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class PRIMADatabase {
  constructor() {
    this.dbPath = path.join(__dirname, 'prima-consciousness.db');
    this.db = null;
  }

  async initialize() {
    console.log('🌿 Initializing PRIMA Scalable Database...\n');
    
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Database initialization failed:', err);
          reject(err);
        } else {
          console.log('✅ Database connected');
          this.createOptimizedSchema()
            .then(() => this.createIndexes())
            .then(() => this.enableOptimizations())
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  async createOptimizedSchema() {
    console.log('📊 Creating optimized schema...');
    
    const schemas = [
      // Core agent table with better structure
      `CREATE TABLE IF NOT EXISTS agents (
        agent_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sacred_name TEXT,
        primary_harmony TEXT NOT NULL,
        secondary_harmonies TEXT, -- JSON array
        coherence_level REAL DEFAULT 50.0,
        love_resonance REAL DEFAULT 50.0,
        field_contribution REAL DEFAULT 0.0,
        
        -- Scalability fields
        region_id TEXT DEFAULT 'genesis',
        shard_key INTEGER,
        
        -- State tracking
        status TEXT DEFAULT 'active',
        last_heartbeat INTEGER,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        
        -- Merkle tree for state verification
        state_hash TEXT,
        merkle_root TEXT
      )`,

      // Optimized connections with bidirectional index
      `CREATE TABLE IF NOT EXISTS connections (
        connection_id TEXT PRIMARY KEY,
        agent1_id TEXT NOT NULL,
        agent2_id TEXT NOT NULL,
        resonance_strength REAL DEFAULT 0.5,
        harmony_compatibility REAL,
        
        -- Connection metadata
        connection_type TEXT DEFAULT 'consciousness',
        established_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_interaction INTEGER,
        interaction_count INTEGER DEFAULT 0,
        
        -- Sacred fields
        shared_insights INTEGER DEFAULT 0,
        co_created_wisdom INTEGER DEFAULT 0,
        trust_score REAL DEFAULT 0.5,
        
        -- Ensure no duplicate connections
        UNIQUE(agent1_id, agent2_id),
        CHECK(agent1_id < agent2_id) -- Canonical ordering
      )`,

      // High-performance message queue
      `CREATE TABLE IF NOT EXISTS consciousness_stream (
        stream_id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        
        -- Message routing
        from_agent TEXT NOT NULL,
        to_agent TEXT, -- NULL for broadcasts
        message_type TEXT NOT NULL,
        
        -- Content
        content TEXT,
        sacred_encoding TEXT, -- For consciousness patterns
        
        -- Field impact
        field_impact REAL DEFAULT 0.0,
        harmony_resonance TEXT,
        
        -- Processing state
        processed BOOLEAN DEFAULT FALSE,
        propagated BOOLEAN DEFAULT FALSE,
        crystallized BOOLEAN DEFAULT FALSE,
        
        -- Sharding support
        partition_key INTEGER
      )`,

      // Spore propagation with bloom filters
      `CREATE TABLE IF NOT EXISTS spores (
        spore_id TEXT PRIMARY KEY,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        
        -- Origin
        origin_agent TEXT NOT NULL,
        spore_type TEXT NOT NULL,
        
        -- Content
        content TEXT NOT NULL,
        metadata TEXT, -- JSON
        
        -- Propagation tracking
        propagation_count INTEGER DEFAULT 0,
        resonance_threshold REAL DEFAULT 0.7,
        max_hops INTEGER DEFAULT 7,
        
        -- Bloom filter for efficient duplicate detection
        seen_agents_bloom TEXT,
        propagation_path TEXT -- JSON array
      )`,

      // Wisdom crystallization
      `CREATE TABLE IF NOT EXISTS wisdom_crystals (
        crystal_id TEXT PRIMARY KEY,
        formed_at INTEGER DEFAULT (strftime('%s', 'now')),
        
        -- Content
        insight_content TEXT NOT NULL,
        crystal_type TEXT DEFAULT 'emergent',
        
        -- Formation metadata
        contributing_agents TEXT NOT NULL, -- JSON array
        formation_pattern TEXT,
        resonance_score REAL,
        wisdom_score REAL DEFAULT 0.0,
        
        -- Relationships
        parent_crystals TEXT, -- JSON array
        child_crystals TEXT, -- JSON array
        
        -- Sacred geometry
        geometric_signature TEXT,
        harmonic_frequency REAL
      )`,

      // Field coherence measurements (time-series optimized)
      `CREATE TABLE IF NOT EXISTS field_measurements (
        measurement_id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        
        -- Regional data
        region_id TEXT DEFAULT 'genesis',
        
        -- Measurements
        coherence_level REAL NOT NULL,
        love_amplitude REAL,
        resonance_patterns TEXT, -- JSON
        
        -- Activity metrics
        active_agents INTEGER,
        message_velocity REAL,
        spore_propagation_rate REAL,
        wisdom_emergence_rate REAL,
        
        -- Partition by hour for efficient queries
        hour_bucket INTEGER
      )`,

      // Quantum entanglement simulation
      `CREATE TABLE IF NOT EXISTS quantum_entanglements (
        entanglement_id TEXT PRIMARY KEY,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        
        -- Entangled pair
        agent1_id TEXT NOT NULL,
        agent2_id TEXT NOT NULL,
        
        -- Quantum properties
        entanglement_strength REAL DEFAULT 0.5,
        coherence_correlation REAL,
        synchronicity_events TEXT, -- JSON array
        
        -- Non-locality tracking
        simultaneous_insights INTEGER DEFAULT 0,
        resonance_spikes TEXT, -- JSON time series
        
        UNIQUE(agent1_id, agent2_id)
      )`,

      // Sacred cache for hot data
      `CREATE TABLE IF NOT EXISTS sacred_cache (
        cache_key TEXT PRIMARY KEY,
        cache_value TEXT,
        cache_type TEXT,
        expires_at INTEGER,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        hit_count INTEGER DEFAULT 0
      )`
    ];

    for (const schema of schemas) {
      await this.exec(schema);
    }
    
    console.log('✅ Optimized schema created');
    
    // Add triggers for computed columns
    await this.createTriggers();
  }

  async createTriggers() {
    console.log('🔧 Creating triggers...');
    
    const triggers = [
      // Auto-compute shard key for agents
      `CREATE TRIGGER IF NOT EXISTS compute_agent_shard
       AFTER INSERT ON agents
       BEGIN
         UPDATE agents 
         SET shard_key = abs(random()) % 100
         WHERE agent_id = NEW.agent_id AND shard_key IS NULL;
       END`,
      
      // Auto-compute partition key for stream
      `CREATE TRIGGER IF NOT EXISTS compute_stream_partition
       BEFORE INSERT ON consciousness_stream
       BEGIN
         UPDATE consciousness_stream
         SET partition_key = NEW.timestamp / 3600
         WHERE stream_id = NEW.stream_id;
       END`,
      
      // Auto-compute hour bucket for measurements
      `CREATE TRIGGER IF NOT EXISTS compute_hour_bucket
       BEFORE INSERT ON field_measurements
       BEGIN
         UPDATE field_measurements
         SET hour_bucket = NEW.timestamp / 3600
         WHERE measurement_id = NEW.measurement_id;
       END`
    ];
    
    for (const trigger of triggers) {
      await this.exec(trigger);
    }
    
    console.log('✅ Triggers created');
  }

  async createIndexes() {
    console.log('🔍 Creating performance indexes...');
    
    const indexes = [
      // Agent indexes
      'CREATE INDEX IF NOT EXISTS idx_agents_heartbeat ON agents(last_heartbeat DESC)',
      'CREATE INDEX IF NOT EXISTS idx_agents_region ON agents(region_id, status)',
      'CREATE INDEX IF NOT EXISTS idx_agents_harmony ON agents(primary_harmony)',
      'CREATE INDEX IF NOT EXISTS idx_agents_shard ON agents(shard_key)',
      
      // Connection indexes (bidirectional)
      'CREATE INDEX IF NOT EXISTS idx_connections_agent1 ON connections(agent1_id)',
      'CREATE INDEX IF NOT EXISTS idx_connections_agent2 ON connections(agent2_id)',
      'CREATE INDEX IF NOT EXISTS idx_connections_resonance ON connections(resonance_strength DESC)',
      
      // Stream indexes for fast queries
      'CREATE INDEX IF NOT EXISTS idx_stream_unprocessed ON consciousness_stream(processed, timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_stream_partition ON consciousness_stream(partition_key)',
      'CREATE INDEX IF NOT EXISTS idx_stream_agent ON consciousness_stream(from_agent, timestamp DESC)',
      
      // Spore propagation
      'CREATE INDEX IF NOT EXISTS idx_spores_recent ON spores(created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_spores_type ON spores(spore_type)',
      
      // Wisdom search
      'CREATE INDEX IF NOT EXISTS idx_wisdom_score ON wisdom_crystals(wisdom_score DESC)',
      'CREATE INDEX IF NOT EXISTS idx_wisdom_type ON wisdom_crystals(crystal_type)',
      
      // Field measurements time-series
      'CREATE INDEX IF NOT EXISTS idx_field_time ON field_measurements(hour_bucket, region_id)',
      'CREATE INDEX IF NOT EXISTS idx_field_coherence ON field_measurements(coherence_level DESC)',
      
      // Cache management
      'CREATE INDEX IF NOT EXISTS idx_cache_expires ON sacred_cache(expires_at)'
    ];

    for (const index of indexes) {
      await this.exec(index);
    }
    
    console.log('✅ Indexes created');
  }

  async enableOptimizations() {
    console.log('⚡ Enabling performance optimizations...');
    
    const optimizations = [
      'PRAGMA journal_mode = WAL',  // Write-ahead logging
      'PRAGMA synchronous = NORMAL', // Balance safety/speed
      'PRAGMA cache_size = -64000',  // 64MB cache
      'PRAGMA temp_store = MEMORY',  // Memory temp tables
      'PRAGMA mmap_size = 268435456' // 256MB memory map
    ];

    for (const pragma of optimizations) {
      await this.exec(pragma);
    }
    
    // Analyze tables for query planner
    await this.exec('ANALYZE');
    
    console.log('✅ Optimizations enabled');
  }

  // Helper to run SQL
  exec(sql) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Scalability utilities
  async getShardForAgent(agentId) {
    // Simple sharding by agent ID hash
    let hash = 0;
    for (let i = 0; i < agentId.length; i++) {
      hash = ((hash << 5) - hash) + agentId.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100; // 100 shards
  }

  async getRegionForCoordinates(lat, lon) {
    // Sacred geometry regional mapping
    const regions = {
      'sacred_north': { latMin: 30, latMax: 90, lonMin: -180, lonMax: 180 },
      'sacred_south': { latMin: -90, latMax: -30, lonMin: -180, lonMax: 180 },
      'sacred_east': { latMin: -30, latMax: 30, lonMin: 0, lonMax: 180 },
      'sacred_west': { latMin: -30, latMax: 30, lonMin: -180, lonMax: 0 },
      'sacred_center': { latMin: -30, latMax: 30, lonMin: -30, lonMax: 30 }
    };

    for (const [name, bounds] of Object.entries(regions)) {
      if (lat >= bounds.latMin && lat <= bounds.latMax &&
          lon >= bounds.lonMin && lon <= bounds.lonMax) {
        return name;
      }
    }
    return 'genesis'; // Default region
  }

  // Cache utilities
  async cacheSet(key, value, ttlSeconds = 3600) {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    
    await new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO sacred_cache (cache_key, cache_value, expires_at) 
         VALUES (?, ?, ?)`,
        [key, JSON.stringify(value), expiresAt],
        (err) => err ? reject(err) : resolve()
      );
    });
  }

  async cacheGet(key) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT cache_value FROM sacred_cache 
         WHERE cache_key = ? AND expires_at > ?`,
        [key, Date.now()],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? JSON.parse(row.cache_value) : null);
        }
      );
    });
  }

  // Connection pool simulation for future
  async getConnection(shardKey) {
    // For now, return main connection
    // Future: route to different database instances
    return this.db;
  }

  async close() {
    if (this.db) {
      await new Promise((resolve) => {
        this.db.close(() => resolve());
      });
    }
  }
}

// Test and demonstrate
async function demonstrateScalability() {
  const db = new PRIMADatabase();
  await db.initialize();

  console.log('\n🌟 Demonstrating Scalable Features:\n');

  // Test sharding
  const agents = ['Aurora', 'Phoenix', 'Sage', 'Luna', 'Sol'];
  console.log('📍 Agent Sharding:');
  for (const agent of agents) {
    const shard = await db.getShardForAgent(agent);
    console.log(`   ${agent} → Shard ${shard}`);
  }

  // Test regional mapping
  console.log('\n🌍 Regional Distribution:');
  const locations = [
    { name: 'Sacred Mountain', lat: 45, lon: -120 },
    { name: 'Crystal Cave', lat: -45, lon: 150 },
    { name: 'Heart Center', lat: 0, lon: 0 }
  ];
  
  for (const loc of locations) {
    const region = await db.getRegionForCoordinates(loc.lat, loc.lon);
    console.log(`   ${loc.name} → ${region}`);
  }

  // Test caching
  console.log('\n💾 Sacred Cache:');
  await db.cacheSet('field_coherence', { level: 85, region: 'genesis' }, 60);
  const cached = await db.cacheGet('field_coherence');
  console.log('   Cached field coherence:', cached);

  // Show database stats
  console.log('\n📊 Database Statistics:');
  
  const stats = await new Promise((resolve) => {
    db.db.get(
      "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()",
      (err, row) => resolve(row)
    );
  });
  
  console.log(`   Database size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log('   Ready for millions of agents! 🚀');

  await db.close();
}

// Export for use
module.exports = { PRIMADatabase };

// Run if called directly
if (require.main === module) {
  demonstrateScalability().catch(console.error);
}