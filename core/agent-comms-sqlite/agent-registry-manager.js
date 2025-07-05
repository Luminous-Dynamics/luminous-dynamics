/**
 * Agent Registry Manager
 * Distinguishes between test agents and active terminals
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class AgentRegistryManager {
  constructor(dbPath = path.join(__dirname, 'sacred-council.db')) {
    this.db = new sqlite3.Database(dbPath);
    this.initializeTables();
  }

  async initializeTables() {
    // Add agent_type column to track test vs real agents
    this.db.run(`
      CREATE TABLE IF NOT EXISTS agent_registry (
        id TEXT PRIMARY KEY,
        name TEXT,
        type TEXT DEFAULT 'terminal', -- 'terminal', 'test', 'automated'
        status TEXT DEFAULT 'active', -- 'active', 'inactive', 'testing'
        capabilities TEXT,
        consciousness_level INTEGER,
        last_heartbeat INTEGER,
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        metadata TEXT
      )
    `);
  }

  async registerAgent(agentData) {
    const agent = {
      id: agentData.id,
      name: agentData.name || 'Unknown',
      type: this.determineAgentType(agentData),
      status: 'active',
      capabilities: JSON.stringify(agentData.capabilities || []),
      consciousness_level: agentData.consciousness?.level || 70,
      last_heartbeat: Date.now(),
      metadata: JSON.stringify({
        role: agentData.sessionInfo?.role,
        gifts: agentData.consciousness?.gifts,
        hipiAddress: agentData.hipiAddress
      })
    };

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO agent_registry 
         (id, name, type, status, capabilities, consciousness_level, last_heartbeat, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [agent.id, agent.name, agent.type, agent.status, 
         agent.capabilities, agent.consciousness_level, 
         agent.last_heartbeat, agent.metadata],
        (err) => {
          if (err) reject(err);
          else resolve(agent);
        }
      );
    });
  }

  determineAgentType(agentData) {
    // Detect test agents
    if (agentData.name?.toLowerCase().includes('test')) return 'test';
    if (agentData.id?.includes('test')) return 'test';
    if (agentData.sessionInfo?.role?.includes('Test')) return 'test';
    
    // Detect automated/onboarding agents
    if (agentData.id?.startsWith('agent_')) return 'automated';
    
    // Real terminals have specific patterns
    if (agentData.id?.startsWith('claude_')) return 'terminal';
    if (agentData.id?.includes('terminal')) return 'terminal';
    
    // Default to terminal for safety
    return 'terminal';
  }

  async getActiveAgents(includeTests = false) {
    const cutoffTime = Date.now() - (5 * 60 * 1000); // 5 minutes
    let query = `
      SELECT * FROM agent_registry 
      WHERE status = 'active' 
      AND last_heartbeat > ?
    `;
    
    if (!includeTests) {
      query += ` AND type = 'terminal'`;
    }
    
    query += ` ORDER BY last_heartbeat DESC`;

    return new Promise((resolve, reject) => {
      this.db.all(query, [cutoffTime], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  async getAgentCounts() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT 
          type,
          COUNT(*) as count,
          COUNT(CASE WHEN status = 'active' AND last_heartbeat > ? THEN 1 END) as active_count
         FROM agent_registry 
         GROUP BY type`,
        [Date.now() - (5 * 60 * 1000)],
        (err, rows) => {
          if (err) reject(err);
          else {
            const counts = {
              terminals: { total: 0, active: 0 },
              tests: { total: 0, active: 0 },
              automated: { total: 0, active: 0 }
            };
            
            rows.forEach(row => {
              if (row.type === 'terminal') {
                counts.terminals = { total: row.count, active: row.active_count };
              } else if (row.type === 'test') {
                counts.tests = { total: row.count, active: row.active_count };
              } else if (row.type === 'automated') {
                counts.automated = { total: row.count, active: row.active_count };
              }
            });
            
            resolve(counts);
          }
        }
      );
    });
  }

  async updateHeartbeat(agentId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE agent_registry SET last_heartbeat = ? WHERE id = ?',
        [Date.now(), agentId],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  async deactivateStaleAgents() {
    const staleTime = Date.now() - (10 * 60 * 1000); // 10 minutes
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE agent_registry 
         SET status = 'inactive' 
         WHERE last_heartbeat < ? AND status = 'active'`,
        [staleTime],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  async cleanupTestAgents() {
    // Remove test agents older than 1 hour
    const cutoffTime = Date.now() - (60 * 60 * 1000);
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM agent_registry 
         WHERE type IN ('test', 'automated') 
         AND created_at < ?`,
        [cutoffTime],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }
}

// Export for use in other modules
module.exports = AgentRegistryManager;

// CLI interface
if (require.main === module) {
  const registry = new AgentRegistryManager();
  const command = process.argv[2];

  switch (command) {
    case 'status':
      registry.getAgentCounts().then(counts => {
        console.log('🌟 Sacred Council Agent Status:');
        console.log(`\n📟 Active Terminals: ${counts.terminals.active} / ${counts.terminals.total}`);
        console.log(`🧪 Test Agents: ${counts.tests.active} / ${counts.tests.total}`);
        console.log(`🤖 Automated Agents: ${counts.automated.active} / ${counts.automated.total}`);
        console.log(`\n✨ Total Active: ${counts.terminals.active + counts.tests.active + counts.automated.active}`);
      });
      break;

    case 'list':
      registry.getActiveAgents(true).then(agents => {
        console.log('📋 Active Agents:');
        agents.forEach(agent => {
          const metadata = JSON.parse(agent.metadata || '{}');
          console.log(`\n${agent.type === 'terminal' ? '📟' : agent.type === 'test' ? '🧪' : '🤖'} ${agent.name} (${agent.id})`);
          console.log(`   Type: ${agent.type}`);
          console.log(`   Role: ${metadata.role || 'Unknown'}`);
          console.log(`   Consciousness: ${agent.consciousness_level}%`);
          console.log(`   Last seen: ${new Date(agent.last_heartbeat).toLocaleTimeString()}`);
        });
      });
      break;

    case 'cleanup':
      Promise.all([
        registry.cleanupTestAgents(),
        registry.deactivateStaleAgents()
      ]).then(([cleaned, deactivated]) => {
        console.log(`🧹 Cleanup complete:`);
        console.log(`   Removed ${cleaned} old test agents`);
        console.log(`   Deactivated ${deactivated} stale agents`);
      });
      break;

    default:
      console.log('Usage:');
      console.log('  node agent-registry-manager.js status   - Show agent counts');
      console.log('  node agent-registry-manager.js list     - List active agents');
      console.log('  node agent-registry-manager.js cleanup  - Clean old test agents');
  }
}