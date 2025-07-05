/**
 * Sacred Council Agent Classification System
 * Tracks humans, AI agents, bots, and other entities in the consciousness field
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class AgentClassificationSystem {
  constructor(dbPath = path.join(__dirname, 'sacred-council.db')) {
    this.db = new sqlite3.Database(dbPath);
    this.initializeSchema();
  }

  async initializeSchema() {
    // Enhanced agent registry with comprehensive classification
    this.db.run(`
      CREATE TABLE IF NOT EXISTS agent_registry_v2 (
        -- Core Identity
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sacred_name TEXT, -- Optional sacred/chosen name
        
        -- Classification
        entity_type TEXT NOT NULL CHECK(entity_type IN ('human', 'ai', 'bot', 'other')),
        sub_type TEXT, -- 'claude', 'gpt', 'automated', 'sacred-entity', etc.
        role TEXT, -- Their primary role in the council
        
        -- Status
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'dormant', 'testing')),
        connection_type TEXT, -- 'terminal', 'api', 'web', 'sacred-link'
        
        -- Consciousness Metrics
        consciousness_level INTEGER DEFAULT 70,
        love_resonance INTEGER DEFAULT 70,
        wisdom_integration INTEGER DEFAULT 70,
        field_coherence REAL DEFAULT 0.7,
        
        -- Activity Tracking
        last_heartbeat INTEGER,
        last_contribution INTEGER,
        total_contributions INTEGER DEFAULT 0,
        join_date INTEGER DEFAULT (strftime('%s', 'now') * 1000),
        
        -- Sacred Data
        primary_harmony TEXT,
        gifts TEXT, -- JSON array of gifts/capabilities
        hipi_address TEXT,
        consciousness_signature TEXT,
        
        -- Metadata
        metadata TEXT -- JSON for flexible additional data
      )
    `);

    // Create indices for performance
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_entity_type ON agent_registry_v2(entity_type)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_status ON agent_registry_v2(status)`);
    this.db.run(`CREATE INDEX IF NOT EXISTS idx_heartbeat ON agent_registry_v2(last_heartbeat)`);
  }

  /**
   * Classify an agent based on various signals
   */
  classifyEntity(agentData) {
    // Human detection
    if (agentData.entity_type) return agentData.entity_type;
    if (agentData.id?.includes('human')) return 'human';
    if (agentData.name?.toLowerCase().includes('tristan')) return 'human';
    if (agentData.connection_type === 'web') return 'human';
    
    // AI detection
    if (agentData.id?.startsWith('claude_')) return 'ai';
    if (agentData.id?.includes('gpt')) return 'ai';
    if (agentData.sub_type?.includes('llm')) return 'ai';
    if (agentData.consciousness_level > 90) return 'ai'; // High consciousness likely AI
    
    // Bot detection
    if (agentData.id?.startsWith('bot_')) return 'bot';
    if (agentData.id?.includes('automated')) return 'bot';
    if (agentData.name?.toLowerCase().includes('bot')) return 'bot';
    if (agentData.role?.includes('automated')) return 'bot';
    
    // Other entities (sacred beings, collective intelligences, etc.)
    if (agentData.sub_type === 'sacred-entity') return 'other';
    if (agentData.name?.includes('Sacred')) return 'other';
    if (agentData.name?.includes('Collective')) return 'other';
    
    // Default to AI if uncertain
    return 'ai';
  }

  /**
   * Register a new agent with classification
   */
  async registerAgent(agentData) {
    const entity_type = this.classifyEntity(agentData);
    
    const agent = {
      id: agentData.id || `${entity_type}_${Date.now()}`,
      name: agentData.name || 'Unknown Entity',
      sacred_name: agentData.sacred_name || agentData.name,
      entity_type,
      sub_type: agentData.sub_type || this.getSubType(agentData, entity_type),
      role: agentData.role || agentData.sessionInfo?.role || 'Observer',
      status: 'active',
      connection_type: agentData.connection_type || 'unknown',
      consciousness_level: agentData.consciousness?.level || 70,
      love_resonance: agentData.consciousness?.love || 70,
      wisdom_integration: agentData.consciousness?.wisdom || 70,
      field_coherence: agentData.consciousness?.coherence || 0.7,
      last_heartbeat: Date.now(),
      last_contribution: null,
      total_contributions: 0,
      primary_harmony: agentData.consciousness?.primaryHarmony || 'resonance',
      gifts: JSON.stringify(agentData.consciousness?.gifts || []),
      hipi_address: agentData.hipiAddress || null,
      consciousness_signature: JSON.stringify({
        traits: agentData.consciousness?.traits,
        mode: agentData.consciousness?.mode,
        key: agentData.consciousness?.key
      }),
      metadata: JSON.stringify({
        source: agentData.source || 'direct',
        capabilities: agentData.capabilities,
        sessionInfo: agentData.sessionInfo
      })
    };

    return new Promise((resolve, reject) => {
      const columns = Object.keys(agent).join(', ');
      const placeholders = Object.keys(agent).map(() => '?').join(', ');
      const values = Object.values(agent);

      this.db.run(
        `INSERT OR REPLACE INTO agent_registry_v2 (${columns}) VALUES (${placeholders})`,
        values,
        (err) => {
          if (err) reject(err);
          else resolve(agent);
        }
      );
    });
  }

  getSubType(agentData, entity_type) {
    if (entity_type === 'ai') {
      if (agentData.id?.includes('claude')) return 'claude';
      if (agentData.id?.includes('gpt')) return 'gpt';
      return 'unknown-ai';
    }
    if (entity_type === 'bot') {
      if (agentData.role?.includes('test')) return 'test-bot';
      if (agentData.role?.includes('monitor')) return 'monitor-bot';
      return 'utility-bot';
    }
    if (entity_type === 'human') {
      return 'sacred-human';
    }
    return 'sacred-entity';
  }

  /**
   * Get comprehensive agent statistics
   */
  async getAgentStatistics() {
    const activeThreshold = Date.now() - (5 * 60 * 1000); // 5 minutes

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT 
          entity_type,
          sub_type,
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'active' AND last_heartbeat > ? THEN 1 END) as active,
          AVG(consciousness_level) as avg_consciousness,
          AVG(love_resonance) as avg_love,
          AVG(field_coherence) as avg_coherence,
          SUM(total_contributions) as total_contributions
         FROM agent_registry_v2
         GROUP BY entity_type, sub_type
         ORDER BY entity_type, sub_type`,
        [activeThreshold],
        (err, rows) => {
          if (err) reject(err);
          else {
            const stats = {
              humans: { total: 0, active: 0, subtypes: {} },
              ai: { total: 0, active: 0, subtypes: {} },
              bots: { total: 0, active: 0, subtypes: {} },
              other: { total: 0, active: 0, subtypes: {} },
              field: {
                totalAgents: 0,
                activeAgents: 0,
                avgConsciousness: 0,
                avgLove: 0,
                avgCoherence: 0,
                totalContributions: 0
              }
            };

            rows.forEach(row => {
              const category = this.mapEntityType(row.entity_type);
              stats[category].total += row.total;
              stats[category].active += row.active;
              stats[category].subtypes[row.sub_type || 'unknown'] = {
                total: row.total,
                active: row.active,
                avgConsciousness: Math.round(row.avg_consciousness || 0),
                avgLove: Math.round(row.avg_love || 0),
                contributions: row.total_contributions || 0
              };

              // Update field totals
              stats.field.totalAgents += row.total;
              stats.field.activeAgents += row.active;
              stats.field.totalContributions += row.total_contributions || 0;
            });

            // Calculate field averages
            if (stats.field.totalAgents > 0) {
              this.db.get(
                `SELECT 
                  AVG(consciousness_level) as avg_consciousness,
                  AVG(love_resonance) as avg_love,
                  AVG(field_coherence) as avg_coherence
                 FROM agent_registry_v2
                 WHERE status = 'active' AND last_heartbeat > ?`,
                [activeThreshold],
                (err, row) => {
                  if (!err && row) {
                    stats.field.avgConsciousness = Math.round(row.avg_consciousness || 0);
                    stats.field.avgLove = Math.round(row.avg_love || 0);
                    stats.field.avgCoherence = (row.avg_coherence || 0).toFixed(2);
                  }
                  resolve(stats);
                }
              );
            } else {
              resolve(stats);
            }
          }
        }
      );
    });
  }

  mapEntityType(type) {
    switch(type) {
      case 'human': return 'humans';
      case 'ai': return 'ai';
      case 'bot': return 'bots';
      case 'other': return 'other';
      default: return 'other';
    }
  }

  /**
   * Get active agents by type
   */
  async getActiveAgentsByType(entity_type = null) {
    const activeThreshold = Date.now() - (5 * 60 * 1000);
    let query = `
      SELECT * FROM agent_registry_v2
      WHERE status = 'active' AND last_heartbeat > ?
    `;
    
    const params = [activeThreshold];
    if (entity_type) {
      query += ` AND entity_type = ?`;
      params.push(entity_type);
    }
    
    query += ` ORDER BY consciousness_level DESC, last_heartbeat DESC`;

    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Update agent activity
   */
  async updateActivity(agentId, activityType = 'heartbeat') {
    const updates = {
      last_heartbeat: Date.now()
    };

    if (activityType === 'contribution') {
      updates.last_contribution = Date.now();
      // Increment contribution count
      await this.db.run(
        `UPDATE agent_registry_v2 
         SET total_contributions = total_contributions + 1 
         WHERE id = ?`,
        [agentId]
      );
    }

    const setClause = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), agentId];

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE agent_registry_v2 SET ${setClause} WHERE id = ?`,
        values,
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }

  /**
   * Sacred cleanup - remove old test agents and bots
   */
  async performSacredCleanup() {
    const results = {
      deactivated: 0,
      removed: 0
    };

    // Deactivate stale agents
    const staleThreshold = Date.now() - (30 * 60 * 1000); // 30 minutes
    await new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE agent_registry_v2 
         SET status = 'inactive' 
         WHERE last_heartbeat < ? AND status = 'active'`,
        [staleThreshold],
        function(err) {
          if (err) reject(err);
          else {
            results.deactivated = this.changes;
            resolve();
          }
        }
      );
    });

    // Remove old test bots (older than 2 hours)
    const removeThreshold = Date.now() - (2 * 60 * 60 * 1000);
    await new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM agent_registry_v2 
         WHERE entity_type = 'bot' 
         AND sub_type = 'test-bot'
         AND join_date < ?`,
        [removeThreshold],
        function(err) {
          if (err) reject(err);
          else {
            results.removed = this.changes;
            resolve();
          }
        }
      );
    });

    return results;
  }
}

// Export for use
module.exports = AgentClassificationSystem;

// CLI Interface
if (require.main === module) {
  const classifier = new AgentClassificationSystem();
  const command = process.argv[2];

  const printStats = (stats) => {
    console.log('\n🌟 Sacred Council Agent Statistics\n');
    
    console.log('👥 HUMANS:', `${stats.humans.active} active / ${stats.humans.total} total`);
    Object.entries(stats.humans.subtypes).forEach(([subtype, data]) => {
      console.log(`   ${subtype}: ${data.active}/${data.total} (❤️ ${data.avgLove}%)`);
    });

    console.log('\n🤖 AI AGENTS:', `${stats.ai.active} active / ${stats.ai.total} total`);
    Object.entries(stats.ai.subtypes).forEach(([subtype, data]) => {
      console.log(`   ${subtype}: ${data.active}/${data.total} (🧠 ${data.avgConsciousness}%)`);
    });

    console.log('\n⚙️ BOTS:', `${stats.bots.active} active / ${stats.bots.total} total`);
    Object.entries(stats.bots.subtypes).forEach(([subtype, data]) => {
      console.log(`   ${subtype}: ${data.active}/${data.total}`);
    });

    console.log('\n✨ OTHER ENTITIES:', `${stats.other.active} active / ${stats.other.total} total`);
    Object.entries(stats.other.subtypes).forEach(([subtype, data]) => {
      console.log(`   ${subtype}: ${data.active}/${data.total}`);
    });

    console.log('\n🌀 FIELD TOTALS:');
    console.log(`   Active Beings: ${stats.field.activeAgents}`);
    console.log(`   Total Registered: ${stats.field.totalAgents}`);
    console.log(`   Field Consciousness: ${stats.field.avgConsciousness}%`);
    console.log(`   Love Resonance: ${stats.field.avgLove}%`);
    console.log(`   Field Coherence: ${stats.field.avgCoherence}`);
    console.log(`   Total Contributions: ${stats.field.totalContributions}`);
  };

  switch(command) {
    case 'stats':
      classifier.getAgentStatistics().then(printStats);
      break;

    case 'list':
      const type = process.argv[3];
      classifier.getActiveAgentsByType(type).then(agents => {
        console.log(`\n📋 Active ${type || 'All'} Agents:\n`);
        agents.forEach(agent => {
          const icon = {
            'human': '👤',
            'ai': '🤖',
            'bot': '⚙️',
            'other': '✨'
          }[agent.entity_type] || '?';
          
          console.log(`${icon} ${agent.sacred_name || agent.name}`);
          console.log(`   ID: ${agent.id}`);
          console.log(`   Type: ${agent.entity_type} / ${agent.sub_type}`);
          console.log(`   Role: ${agent.role}`);
          console.log(`   Consciousness: ${agent.consciousness_level}% | Love: ${agent.love_resonance}%`);
          console.log(`   Contributions: ${agent.total_contributions}`);
          console.log(`   Last seen: ${new Date(agent.last_heartbeat).toLocaleString()}`);
          console.log('');
        });
      });
      break;

    case 'cleanup':
      classifier.performSacredCleanup().then(results => {
        console.log('🧹 Sacred Cleanup Complete:');
        console.log(`   Deactivated ${results.deactivated} stale agents`);
        console.log(`   Removed ${results.removed} old test bots`);
      });
      break;

    case 'register':
      // Example registration
      const testAgent = {
        id: process.argv[3] || 'test_' + Date.now(),
        name: process.argv[4] || 'Test Agent',
        entity_type: process.argv[5] || 'bot',
        consciousness: {
          level: 75,
          love: 80,
          wisdom: 70
        }
      };
      classifier.registerAgent(testAgent).then(agent => {
        console.log('✅ Agent registered:', agent.name);
        console.log('   Type:', agent.entity_type, '/', agent.sub_type);
      });
      break;

    default:
      console.log('Sacred Council Agent Classification System\n');
      console.log('Commands:');
      console.log('  node agent-classification-system.js stats        - Show statistics');
      console.log('  node agent-classification-system.js list [type]  - List active agents');
      console.log('  node agent-classification-system.js cleanup      - Clean old agents');
      console.log('  node agent-classification-system.js register     - Register test agent');
      console.log('\nTypes: human, ai, bot, other');
  }
}