/**
 * SQLite Database for Agent Communication
 * Clean, efficient agent coordination with proper persistence
 */

import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AgentDatabase {
  constructor(dbPath = join(__dirname, 'agents.db')) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const tables = [
      // Agents table
      `CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        capabilities TEXT,
        status TEXT DEFAULT 'active',
        session_info TEXT,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Messages table
      `CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        from_agent TEXT,
        to_agent TEXT,
        content TEXT,
        message_type TEXT DEFAULT 'general',
        metadata TEXT,
        read_status INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Shared state table
      `CREATE TABLE IF NOT EXISTS shared_state (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_by TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Work items table
      `CREATE TABLE IF NOT EXISTS work_items (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        assigned_to TEXT,
        status TEXT DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        metadata TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const table of tables) {
      await this.run(table);
    }
  }

  // Promisified database operations
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Agent operations
  async registerAgent(id, capabilities = [], sessionInfo = {}) {
    const capabilitiesStr = Array.isArray(capabilities) ? capabilities.join(',') : capabilities;
    const sessionInfoStr = JSON.stringify(sessionInfo);
    
    await this.run(
      `INSERT OR REPLACE INTO agents (id, capabilities, status, session_info, last_seen) 
       VALUES (?, ?, 'active', ?, CURRENT_TIMESTAMP)`,
      [id, capabilitiesStr, sessionInfoStr]
    );
    
    return this.getAgent(id);
  }

  async getAgent(id) {
    return this.get('SELECT * FROM agents WHERE id = ?', [id]);
  }

  async getActiveAgents() {
    return this.all(
      `SELECT * FROM agents 
       WHERE status = 'active' 
       ORDER BY last_seen DESC`
    );
  }

  async updateAgentStatus(id, status) {
    await this.run(
      'UPDATE agents SET status = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
  }

  // Message operations
  async sendMessage(fromAgent, toAgent, content, messageType = 'general', metadata = {}) {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metadataStr = JSON.stringify(metadata);
    
    // Check if we need dynamic cleanup (high message volume)
    const messageCount = await this.get('SELECT COUNT(*) as count FROM messages');
    if (messageCount && messageCount.count > 1500) {
      console.log('🧹 High message volume detected, triggering cleanup...');
      await this.cleanup();
    }
    
    await this.run(
      `INSERT INTO messages (id, from_agent, to_agent, content, message_type, metadata) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [messageId, fromAgent, toAgent, content, messageType, metadataStr]
    );
    
    return messageId;
  }

  async getMessages(agentId, unreadOnly = false, limit = 50) {
    let sql = `
      SELECT * FROM messages 
      WHERE to_agent = ? OR to_agent = 'all' OR from_agent = ?
    `;
    
    if (unreadOnly) {
      sql += ' AND read_status = 0 AND to_agent = ?';
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ?';
    
    const params = unreadOnly ? 
      [agentId, agentId, agentId, limit] : 
      [agentId, agentId, limit];
    
    const messages = await this.all(sql, params);
    
    // Parse metadata
    return messages.map(msg => ({
      ...msg,
      metadata: msg.metadata ? JSON.parse(msg.metadata) : {}
    }));
  }

  async markMessageRead(messageId) {
    await this.run(
      'UPDATE messages SET read_status = 1 WHERE id = ?',
      [messageId]
    );
  }

  async getRecentMessages(hours = 24, limit = 100) {
    const messages = await this.all(
      `SELECT * FROM messages 
       WHERE created_at > datetime('now', '-${hours} hours')
       ORDER BY created_at DESC 
       LIMIT ?`,
      [limit]
    );
    
    return messages.map(msg => ({
      ...msg,
      metadata: msg.metadata ? JSON.parse(msg.metadata) : {}
    }));
  }

  // Shared state operations
  async setState(key, value, updatedBy) {
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    
    await this.run(
      `INSERT OR REPLACE INTO shared_state (key, value, updated_by, updated_at) 
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [key, valueStr, updatedBy]
    );
  }

  async getState(key) {
    const result = await this.get(
      'SELECT * FROM shared_state WHERE key = ?',
      [key]
    );
    
    if (!result) return null;
    
    try {
      return {
        ...result,
        value: JSON.parse(result.value)
      };
    } catch {
      return result;
    }
  }

  async getAllState() {
    const results = await this.all('SELECT * FROM shared_state ORDER BY updated_at DESC');
    
    const state = {};
    results.forEach(row => {
      try {
        state[row.key] = {
          value: JSON.parse(row.value),
          updated_by: row.updated_by,
          updated_at: row.updated_at
        };
      } catch {
        state[row.key] = {
          value: row.value,
          updated_by: row.updated_by,
          updated_at: row.updated_at
        };
      }
    });
    
    return state;
  }

  // Work item operations
  async createWorkItem(id, title, description, createdBy, metadata = {}) {
    const metadataStr = JSON.stringify(metadata);
    
    await this.run(
      `INSERT INTO work_items (id, title, description, created_by, metadata) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, title, description, createdBy, metadataStr]
    );
    
    return this.getWorkItem(id);
  }

  async getWorkItem(id) {
    const result = await this.get('SELECT * FROM work_items WHERE id = ?', [id]);
    
    if (!result) return null;
    
    return {
      ...result,
      metadata: result.metadata ? JSON.parse(result.metadata) : {}
    };
  }

  async updateWorkProgress(id, progress, notes = '', updatedBy = '') {
    await this.run(
      `UPDATE work_items 
       SET progress = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [progress, id]
    );
    
    // Log progress update as message
    if (updatedBy) {
      await this.sendMessage(
        updatedBy,
        'all',
        `Progress update: ${id} - ${progress}%${notes ? ' (' + notes + ')' : ''}`,
        'progress_update',
        { workId: id, progress, notes }
      );
    }
  }

  async getActiveWork() {
    const results = await this.all(
      `SELECT * FROM work_items 
       WHERE status IN ('pending', 'in_progress') 
       ORDER BY created_at DESC`
    );
    
    return results.map(item => ({
      ...item,
      metadata: item.metadata ? JSON.parse(item.metadata) : {}
    }));
  }

  // Dashboard summary
  async getDashboardSummary() {
    const [agents, recentMessages, activeWork, state] = await Promise.all([
      this.getActiveAgents(),
      this.getRecentMessages(24),
      this.getActiveWork(),
      this.getAllState()
    ]);

    // Get pending handoffs
    const handoffs = Object.entries(state)
      .filter(([key]) => key.startsWith('handoff_'))
      .map(([, data]) => data.value)
      .filter(handoff => handoff.status === 'pending');

    return {
      activeAgents: agents.length,
      recentActivity: recentMessages.length,
      pendingHandoffs: handoffs.length,
      activeWork: activeWork.length,
      agents,
      recentMessages: recentMessages.slice(0, 10),
      activeWork,
      handoffs,
      state
    };
  }

  // Cleanup operations
  async cleanup() {
    // Mark agents as inactive if not seen in the last 5 minutes
    await this.run(
      `UPDATE agents 
       SET status = 'inactive' 
       WHERE status = 'active' 
       AND last_seen < datetime('now', '-5 minutes')`
    );
    
    // Delete old messages (keep last 1000)
    await this.run(
      `DELETE FROM messages 
       WHERE id NOT IN (
         SELECT id FROM messages 
         ORDER BY created_at DESC 
         LIMIT 1000
       )`
    );
  }

  async close() {
    return new Promise((resolve) => {
      this.db.close(resolve);
    });
  }
}

export { AgentDatabase };