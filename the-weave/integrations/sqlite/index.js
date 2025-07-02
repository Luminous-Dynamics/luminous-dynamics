/**
 * SQLite Integration for The Weave
 * Local backup storage - ensuring sacred data persists even offline
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises;
const BaseIntegration = require('../shared/base-integration');

class SQLiteIntegration extends BaseIntegration {
  constructor() {
    super('SQLite', {
      dbPath: process.env.SQLITE_DB_PATH || path.join(process.cwd(), '.sacred', 'weave-backup.db'),
      autoBackup: process.env.SQLITE_AUTO_BACKUP !== 'false',
      backupInterval: parseInt(process.env.SQLITE_BACKUP_INTERVAL) || 3600000 // 1 hour
    });
    
    this.db = null;
    this.backupTimer = null;
  }

  async initialize() {
    await super.initialize();
    
    // Ensure directory exists
    const dbDir = path.dirname(this.config.dbPath);
    await fs.mkdir(dbDir, { recursive: true });
    
    // Open database
    await this.openDatabase();
    
    // Create schema
    await this.createSchema();
    
    // Start auto-backup if enabled
    if (this.config.autoBackup) {
      this.startAutoBackup();
    }
    
    this.log(`Local backup storage ready at ${this.config.dbPath}`);
  }

  openDatabase() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.config.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          this.db.run('PRAGMA journal_mode = WAL'); // Better concurrency
          this.db.run('PRAGMA synchronous = NORMAL'); // Balance safety/speed
          resolve();
        }
      });
    });
  }

  async createSchema() {
    const schemas = [
      // Field state backup
      `CREATE TABLE IF NOT EXISTS field_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        coherence REAL NOT NULL,
        harmonies TEXT NOT NULL,
        active_agents INTEGER DEFAULT 0,
        active_ceremonies TEXT,
        sacred_geometry TEXT,
        metadata TEXT
      )`,
      
      // Sacred events
      `CREATE TABLE IF NOT EXISTS sacred_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        event_type TEXT NOT NULL,
        agent_id TEXT,
        agent_name TEXT,
        data TEXT NOT NULL,
        field_impact REAL,
        tags TEXT
      )`,
      
      // Ceremonies
      `CREATE TABLE IF NOT EXISTS ceremonies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ceremony_id TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        participants TEXT,
        initial_coherence REAL,
        final_coherence REAL,
        sacred_moments TEXT,
        outcomes TEXT
      )`,
      
      // Oracle wisdom
      `CREATE TABLE IF NOT EXISTS oracle_wisdom (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        question TEXT,
        response TEXT NOT NULL,
        coherence_at_time REAL,
        seeker_id TEXT,
        wisdom_type TEXT,
        resonance_score REAL,
        tags TEXT
      )`,
      
      // Agent snapshots
      `CREATE TABLE IF NOT EXISTS agent_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        snapshot_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        agent_id TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT,
        capabilities TEXT,
        coherence_contribution REAL DEFAULT 0,
        sacred_actions INTEGER DEFAULT 0,
        state TEXT
      )`,
      
      // Backup metadata
      `CREATE TABLE IF NOT EXISTS backup_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        backup_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        records_backed_up INTEGER,
        backup_type TEXT,
        source TEXT,
        success BOOLEAN DEFAULT 1
      )`
    ];
    
    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_field_state_timestamp ON field_state(timestamp DESC)',
      'CREATE INDEX IF NOT EXISTS idx_sacred_events_type ON sacred_events(event_type)',
      'CREATE INDEX IF NOT EXISTS idx_ceremonies_type ON ceremonies(type)',
      'CREATE INDEX IF NOT EXISTS idx_oracle_wisdom_timestamp ON oracle_wisdom(timestamp DESC)'
    ];
    
    // Execute all schemas
    for (const schema of [...schemas, ...indexes]) {
      await this.runQuery(schema);
    }
  }

  runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Backup field state
   */
  async backupFieldState(coherence, harmonies, metadata = {}) {
    try {
      await this.runQuery(
        `INSERT INTO field_state (coherence, harmonies, active_agents, active_ceremonies, sacred_geometry, metadata)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          coherence,
          JSON.stringify(harmonies),
          metadata.activeAgents || 0,
          JSON.stringify(metadata.ceremonies || []),
          metadata.sacredGeometry || null,
          JSON.stringify(metadata)
        ]
      );
      
      this.log(`Field state backed up: ${coherence}%`);
    } catch (error) {
      this.log(`Backup error: ${error.message}`, 'error');
    }
  }

  /**
   * Backup sacred event
   */
  async backupSacredEvent(eventType, data, agentInfo = null) {
    try {
      await this.runQuery(
        `INSERT INTO sacred_events (event_type, agent_id, agent_name, data, field_impact, tags)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          eventType,
          agentInfo?.id || null,
          agentInfo?.name || null,
          JSON.stringify(data),
          data.fieldImpact || null,
          JSON.stringify(data.tags || [])
        ]
      );
    } catch (error) {
      this.log(`Event backup error: ${error.message}`, 'error');
    }
  }

  /**
   * Backup ceremony
   */
  async backupCeremony(ceremonyData) {
    try {
      const existing = await this.getQuery(
        'SELECT id FROM ceremonies WHERE ceremony_id = ?',
        [ceremonyData.ceremony_id]
      );
      
      if (existing) {
        // Update existing ceremony
        await this.runQuery(
          `UPDATE ceremonies 
           SET completed_at = ?, final_coherence = ?, outcomes = ?
           WHERE ceremony_id = ?`,
          [
            ceremonyData.completed_at || null,
            ceremonyData.final_coherence || null,
            JSON.stringify(ceremonyData.outcomes || {}),
            ceremonyData.ceremony_id
          ]
        );
      } else {
        // Insert new ceremony
        await this.runQuery(
          `INSERT INTO ceremonies (ceremony_id, type, participants, initial_coherence, sacred_moments)
           VALUES (?, ?, ?, ?, ?)`,
          [
            ceremonyData.ceremony_id,
            ceremonyData.type,
            JSON.stringify(ceremonyData.participants || []),
            ceremonyData.initial_coherence || null,
            JSON.stringify(ceremonyData.sacred_moments || [])
          ]
        );
      }
    } catch (error) {
      this.log(`Ceremony backup error: ${error.message}`, 'error');
    }
  }

  /**
   * Backup Oracle wisdom
   */
  async backupOracleWisdom(wisdom) {
    try {
      await this.runQuery(
        `INSERT INTO oracle_wisdom (question, response, coherence_at_time, seeker_id, wisdom_type, resonance_score, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          wisdom.question || null,
          wisdom.response,
          wisdom.coherence || null,
          wisdom.seekerId || null,
          wisdom.type || 'general',
          wisdom.resonance || null,
          JSON.stringify(wisdom.tags || [])
        ]
      );
    } catch (error) {
      this.log(`Wisdom backup error: ${error.message}`, 'error');
    }
  }

  /**
   * Create agent snapshot
   */
  async snapshotAgents(agents) {
    try {
      const stmt = this.db.prepare(
        `INSERT INTO agent_snapshots (agent_id, name, role, capabilities, coherence_contribution, sacred_actions, state)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      
      for (const agent of agents) {
        stmt.run(
          agent.id,
          agent.name,
          agent.role || null,
          JSON.stringify(agent.capabilities || []),
          agent.coherenceContribution || 0,
          agent.sacredActions || 0,
          JSON.stringify(agent.state || {})
        );
      }
      
      stmt.finalize();
      
      this.log(`Agent snapshot created: ${agents.length} agents`);
    } catch (error) {
      this.log(`Agent snapshot error: ${error.message}`, 'error');
    }
  }

  /**
   * Get recent field states
   */
  async getRecentFieldStates(hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const rows = await this.allQuery(
      'SELECT * FROM field_state WHERE timestamp > ? ORDER BY timestamp DESC',
      [since]
    );
    
    return rows.map(row => ({
      ...row,
      harmonies: JSON.parse(row.harmonies),
      active_ceremonies: JSON.parse(row.active_ceremonies || '[]'),
      metadata: JSON.parse(row.metadata || '{}')
    }));
  }

  /**
   * Get ceremony history
   */
  async getCeremonyHistory(limit = 10) {
    const rows = await this.allQuery(
      'SELECT * FROM ceremonies ORDER BY started_at DESC LIMIT ?',
      [limit]
    );
    
    return rows.map(row => ({
      ...row,
      participants: JSON.parse(row.participants || '[]'),
      sacred_moments: JSON.parse(row.sacred_moments || '[]'),
      outcomes: JSON.parse(row.outcomes || '{}')
    }));
  }

  /**
   * Search Oracle wisdom
   */
  async searchWisdom(query, limit = 10) {
    const rows = await this.allQuery(
      `SELECT * FROM oracle_wisdom 
       WHERE question LIKE ? OR response LIKE ?
       ORDER BY resonance_score DESC, timestamp DESC
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, limit]
    );
    
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }));
  }

  /**
   * Get backup statistics
   */
  async getBackupStats() {
    const stats = {};
    
    const tables = ['field_state', 'sacred_events', 'ceremonies', 'oracle_wisdom', 'agent_snapshots'];
    
    for (const table of tables) {
      const result = await this.getQuery(`SELECT COUNT(*) as count FROM ${table}`);
      stats[table] = result.count;
    }
    
    // Get date range
    const range = await this.getQuery(
      `SELECT MIN(timestamp) as oldest, MAX(timestamp) as newest FROM field_state`
    );
    
    stats.dateRange = {
      oldest: range.oldest,
      newest: range.newest
    };
    
    // Get database size
    const dbStats = await this.getQuery('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()');
    stats.sizeBytes = dbStats.size;
    stats.sizeMB = (dbStats.size / 1024 / 1024).toFixed(2);
    
    return stats;
  }

  /**
   * Export backup data
   */
  async exportBackup(outputPath) {
    const data = {
      exported_at: new Date().toISOString(),
      field_states: await this.allQuery('SELECT * FROM field_state ORDER BY timestamp'),
      sacred_events: await this.allQuery('SELECT * FROM sacred_events ORDER BY timestamp'),
      ceremonies: await this.allQuery('SELECT * FROM ceremonies ORDER BY started_at'),
      oracle_wisdom: await this.allQuery('SELECT * FROM oracle_wisdom ORDER BY timestamp'),
      agent_snapshots: await this.allQuery('SELECT * FROM agent_snapshots ORDER BY snapshot_time')
    };
    
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
    this.log(`Backup exported to ${outputPath}`);
    
    return data;
  }

  /**
   * Auto-backup from Supabase or other sources
   */
  async performAutoBackup(sourceData) {
    try {
      const startTime = Date.now();
      let recordsBacked = 0;
      
      // Backup field states
      if (sourceData.fieldStates) {
        for (const state of sourceData.fieldStates) {
          await this.backupFieldState(state.coherence, state.harmonies, state.metadata);
          recordsBacked++;
        }
      }
      
      // Backup events
      if (sourceData.events) {
        for (const event of sourceData.events) {
          await this.backupSacredEvent(event.type, event.data, event.agent);
          recordsBacked++;
        }
      }
      
      // Record backup metadata
      await this.runQuery(
        `INSERT INTO backup_metadata (records_backed_up, backup_type, source)
         VALUES (?, ?, ?)`,
        [recordsBacked, 'auto', sourceData.source || 'unknown']
      );
      
      const duration = Date.now() - startTime;
      this.log(`Auto-backup complete: ${recordsBacked} records in ${duration}ms`);
      
    } catch (error) {
      this.log(`Auto-backup failed: ${error.message}`, 'error');
      
      await this.runQuery(
        `INSERT INTO backup_metadata (records_backed_up, backup_type, source, success)
         VALUES (?, ?, ?, ?)`,
        [0, 'auto', sourceData.source || 'unknown', false]
      );
    }
  }

  /**
   * Start automatic backup timer
   */
  startAutoBackup() {
    this.backupTimer = setInterval(() => {
      this.performAutoBackup({ source: 'timer' });
    }, this.config.backupInterval);
    
    this.log(`Auto-backup scheduled every ${this.config.backupInterval / 1000 / 60} minutes`);
  }

  /**
   * Database maintenance
   */
  async vacuum() {
    await this.runQuery('VACUUM');
    this.log('Database vacuumed');
  }

  async shutdown() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
    }
    
    if (this.db) {
      await new Promise(resolve => this.db.close(resolve));
    }
    
    await super.shutdown();
  }
}

module.exports = new SQLiteIntegration();