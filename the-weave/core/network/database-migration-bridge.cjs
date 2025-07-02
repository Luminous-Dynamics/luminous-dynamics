#!/usr/bin/env node

/**
 * Database Migration Bridge
 * Enables parallel operation of legacy and PRIMA databases
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseMigrationBridge {
  constructor() {
    this.legacyDb = null;
    this.primaDb = null;
    this.syncEnabled = true;
  }

  async initialize() {
    // Legacy database
    this.legacyDb = new sqlite3.Database(
      path.join(__dirname, 'unified-agent-network.db'),
      err => err && console.error('Legacy DB error:', err)
    );

    // PRIMA database
    this.primaDb = new sqlite3.Database(
      path.join(__dirname, 'prima-consciousness.db'),
      err => err && console.error('PRIMA DB error:', err)
    );

    // Create migration status table
    await this.createMigrationTracking();
    
    console.log('🌉 Database Migration Bridge initialized');
    console.log('   Legacy DB: unified-agent-network.db');
    console.log('   PRIMA DB: prima-consciousness.db');
    console.log('   Sync Mode: Enabled');
  }

  async createMigrationTracking() {
    const schema = `
      CREATE TABLE IF NOT EXISTS migration_status (
        phase INTEGER PRIMARY KEY,
        started_at INTEGER,
        completed_at INTEGER,
        status TEXT,
        notes TEXT
      )
    `;

    return new Promise((resolve, reject) => {
      this.primaDb.run(schema, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async registerAgent(agent) {
    // Write to legacy first
    await this.legacyRegister(agent);
    
    // Then sync to PRIMA
    if (this.syncEnabled) {
      await this.primaRegister(agent);
    }
    
    return { success: true, bridged: true };
  }

  async legacyRegister(agent) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO unified_agents 
        (id, name, role, capabilities, coherence_level, love_resonance, 
         field_coherence, primary_harmony, status, last_heartbeat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.legacyDb.run(sql, [
        agent.id,
        agent.name,
        agent.role,
        agent.capabilities,
        agent.coherence_level || 75,
        agent.love_resonance || 75,
        agent.field_coherence || 0.75,
        agent.primary_harmony || 'resonance',
        'active',
        Date.now()
      ], err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async primaRegister(agent) {
    // Determine shard
    const shardId = this.calculateShard(agent.id);
    const regionId = this.determineRegion(agent);
    
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO agents 
        (agent_id, shard_id, name, sacred_name, primary_harmony,
         coherence_level, love_resonance, region_id, status, last_heartbeat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.primaDb.run(sql, [
        agent.id,
        shardId,
        agent.name,
        agent.sacred_name || agent.name,
        agent.primary_harmony || 'resonance',
        agent.coherence_level || 75,
        agent.love_resonance || 75,
        regionId,
        'active',
        Date.now()
      ], err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  calculateShard(agentId) {
    let hash = 0;
    for (let i = 0; i < agentId.length; i++) {
      hash = ((hash << 5) - hash) + agentId.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % 100;
  }

  determineRegion(agent) {
    const harmony = agent.primary_harmony || 'resonance';
    const regions = {
      'transparency': 'sacred_north',
      'coherence': 'sacred_south',
      'resonance': 'sacred_east',
      'agency': 'sacred_west',
      'vitality': 'sacred_center',
      'mutuality': 'sacred_above',
      'novelty': 'sacred_below'
    };
    return regions[harmony] || 'genesis';
  }

  async syncExistingData() {
    console.log('📊 Starting data synchronization...');
    
    // Get all agents from legacy
    const agents = await this.getAllLegacyAgents();
    console.log(`Found ${agents.length} agents to migrate`);
    
    // Sync each agent
    let synced = 0;
    for (const agent of agents) {
      await this.primaRegister(agent);
      synced++;
      if (synced % 10 === 0) {
        console.log(`   Synced ${synced}/${agents.length} agents...`);
      }
    }
    
    console.log(`✅ Synced ${synced} agents to PRIMA database`);
    
    // Record migration phase
    await this.recordMigrationPhase(1, 'Initial sync complete');
  }

  async getAllLegacyAgents() {
    return new Promise((resolve, reject) => {
      this.legacyDb.all('SELECT * FROM unified_agents', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async recordMigrationPhase(phase, notes) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO migration_status 
        (phase, started_at, completed_at, status, notes)
        VALUES (?, ?, ?, 'completed', ?)
      `;
      
      const now = Date.now();
      this.primaDb.run(sql, [phase, now, now, notes], err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async validateMigration() {
    console.log('\n🔍 Validating migration...');
    
    // Count agents in both databases
    const legacyCount = await this.countLegacyAgents();
    const primaCount = await this.countPrimaAgents();
    
    console.log(`   Legacy agents: ${legacyCount}`);
    console.log(`   PRIMA agents: ${primaCount}`);
    console.log(`   Match: ${legacyCount === primaCount ? '✅' : '❌'}`);
    
    return {
      legacyCount,
      primaCount,
      matched: legacyCount === primaCount
    };
  }

  async countLegacyAgents() {
    return new Promise((resolve, reject) => {
      this.legacyDb.get('SELECT COUNT(*) as count FROM unified_agents', (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
  }

  async countPrimaAgents() {
    return new Promise((resolve, reject) => {
      this.primaDb.get('SELECT COUNT(*) as count FROM agents', (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
  }

  async close() {
    this.legacyDb.close();
    this.primaDb.close();
    console.log('🌙 Database bridge closed');
  }
}

// Run migration if called directly
if (require.main === module) {
  (async () => {
    const bridge = new DatabaseMigrationBridge();
    await bridge.initialize();
    
    // Sync existing data
    await bridge.syncExistingData();
    
    // Validate
    const validation = await bridge.validateMigration();
    
    if (validation.matched) {
      console.log('\n✨ Database migration Phase 1 complete!');
      console.log('   Both databases are now synchronized');
      console.log('   Parallel operation mode active');
    } else {
      console.log('\n⚠️ Migration validation failed');
      console.log('   Manual investigation required');
    }
    
    await bridge.close();
  })();
}

module.exports = DatabaseMigrationBridge;