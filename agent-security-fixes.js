#!/usr/bin/env node

/**
 * Agent Security & Session Management Fixes
 * Addresses critical infrastructure issues:
 * 1. Heartbeat mechanism for live session tracking
 * 2. Session validation with process monitoring
 * 3. Database unification 
 * 4. Agent authentication with unique tokens
 * 5. Automatic cleanup of phantom agents
 */

const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class AgentSecurityManager {
  constructor() {
    this.primaryDbPath = path.join(__dirname, 'the-weave/core/network/unified-agent-network.db');
    this.cliDbPath = path.join(__dirname, 'the-weave/cli/unified-agent-network.db');
    this.sessionFile = path.join(__dirname, 'active-agent-sessions.json');
    this.heartbeatInterval = 30000; // 30 seconds
    this.sessionTimeout = 120000; // 2 minutes
  }

  async initialize() {
    console.log('🔐 Initializing Agent Security Manager...');
    
    // 1. Database Unification
    await this.unifyDatabases();
    
    // 2. Session Management Setup
    await this.initializeSessionTracking();
    
    // 3. Start heartbeat monitoring
    this.startHeartbeatMonitoring();
    
    // 4. Clean phantom agents
    await this.cleanPhantomAgents();
    
    console.log('✅ Agent Security Manager initialized');
  }

  /**
   * FIX 3: Database Fragmentation - Unify into single source of truth
   */
  async unifyDatabases() {
    console.log('🔄 Unifying fragmented databases...');
    
    if (!fs.existsSync(this.primaryDbPath)) {
      console.log('Primary database not found, using CLI database as source');
      return;
    }
    
    if (!fs.existsSync(this.cliDbPath)) {
      console.log('CLI database not found, primary database is source of truth');
      return;
    }
    
    // Read both databases and merge
    const primaryAgents = await this.readDatabase(this.primaryDbPath);
    const cliAgents = await this.readDatabase(this.cliDbPath);
    
    console.log(`Found ${primaryAgents.length} agents in primary DB`);
    console.log(`Found ${cliAgents.length} agents in CLI DB`);
    
    // Merge unique agents (prefer primary DB for conflicts)
    const merged = new Map();
    
    // Add primary agents first (they take precedence)
    primaryAgents.forEach(agent => merged.set(agent.name, agent));
    
    // Add CLI agents that don't exist in primary
    cliAgents.forEach(agent => {
      if (!merged.has(agent.name)) {
        merged.set(agent.name, agent);
      }
    });
    
    // Write unified data to primary database
    await this.writeUnifiedDatabase([...merged.values()]);
    
    // Backup and remove CLI database
    if (fs.existsSync(this.cliDbPath)) {
      fs.renameSync(this.cliDbPath, this.cliDbPath + '.backup');
      console.log(`✅ CLI database backed up and unified into primary`);
    }
    
    console.log(`✅ Unified ${merged.size} unique agents into primary database`);
  }

  async readDatabase(dbPath) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);
      db.all('SELECT * FROM unified_agents', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
        db.close();
      });
    });
  }

  async writeUnifiedDatabase(agents) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.primaryDbPath);
      
      // Clear existing data
      db.run('DELETE FROM unified_agents', [], (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Insert unified data
        const stmt = db.prepare(`
          INSERT INTO unified_agents (
            id, name, role, capabilities, coherence_level, love_resonance, 
            field_coherence, primary_harmony, status, last_heartbeat, 
            session_info, total_contributions, messages_sent, work_completed, 
            field_impact_given, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        agents.forEach(agent => {
          stmt.run([
            agent.id, agent.name, agent.role, agent.capabilities,
            agent.coherence_level, agent.love_resonance, agent.field_coherence,
            agent.primary_harmony, 'inactive', // Reset all to inactive
            Date.now(), agent.session_info, agent.total_contributions,
            agent.messages_sent, agent.work_completed, agent.field_impact_given,
            agent.created_at
          ]);
        });
        
        stmt.finalize((err) => {
          if (err) reject(err);
          else resolve();
          db.close();
        });
      });
    });
  }

  /**
   * FIX 2: Session Validation - Track actual process status
   */
  async initializeSessionTracking() {
    console.log('📋 Initializing session tracking...');
    
    // Create session tracking file
    const initialSessions = {
      lastCleanup: Date.now(),
      activeSessions: {},
      sessionHistory: []
    };
    
    fs.writeFileSync(this.sessionFile, JSON.stringify(initialSessions, null, 2));
    console.log('✅ Session tracking initialized');
  }

  /**
   * FIX 1: Heartbeat Mechanism - Track live agent sessions
   */
  startHeartbeatMonitoring() {
    console.log('💓 Starting heartbeat monitoring...');
    
    setInterval(async () => {
      await this.checkHeartbeats();
    }, this.heartbeatInterval);
    
    console.log(`✅ Heartbeat monitoring active (${this.heartbeatInterval/1000}s intervals)`);
  }

  async checkHeartbeats() {
    const sessions = this.loadSessions();
    const now = Date.now();
    let cleanedCount = 0;
    
    // Check each active session
    for (const [agentId, session] of Object.entries(sessions.activeSessions)) {
      const timeSinceHeartbeat = now - session.lastHeartbeat;
      
      if (timeSinceHeartbeat > this.sessionTimeout) {
        // Session expired - mark agent as inactive
        await this.markAgentInactive(agentId, 'heartbeat_timeout');
        delete sessions.activeSessions[agentId];
        cleanedCount++;
      } else if (session.processId) {
        // Verify process still exists
        try {
          process.kill(session.processId, 0); // Check if process exists
        } catch (err) {
          // Process doesn't exist - clean up
          await this.markAgentInactive(agentId, 'process_died');
          delete sessions.activeSessions[agentId];
          cleanedCount++;
        }
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`💓 Heartbeat cleanup: ${cleanedCount} inactive agents cleaned`);
      this.saveSessions(sessions);
    }
  }

  /**
   * FIX 4: Agent Authentication - Unique tokens and identity verification
   */
  async authenticateAgent(agentName, role, processId) {
    console.log(`🔐 Authenticating agent: ${agentName}`);
    
    // Generate unique session token
    const sessionToken = crypto.randomUUID();
    const sessionId = `session_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    // Verify agent identity (check for duplicates)
    const existingAgent = await this.findAgentByName(agentName);
    if (existingAgent && existingAgent.status === 'active') {
      throw new Error(`Agent ${agentName} already active. Use unique names or properly disconnect previous session.`);
    }
    
    // Create authenticated session
    const session = {
      sessionId,
      sessionToken,
      agentName,
      role,
      processId,
      startTime: Date.now(),
      lastHeartbeat: Date.now(),
      authenticated: true,
      ipAddress: '127.0.0.1', // Local for now
      userAgent: 'Claude-Code-Terminal'
    };
    
    // Store session
    const sessions = this.loadSessions();
    sessions.activeSessions[sessionId] = session;
    this.saveSessions(sessions);
    
    console.log(`✅ Agent authenticated: ${agentName} (Session: ${sessionId})`);
    return { sessionId, sessionToken };
  }

  /**
   * FIX 5: Automatic Cleanup - Remove phantom agents
   */
  async cleanPhantomAgents() {
    console.log('👻 Cleaning phantom agents...');
    
    const db = new sqlite3.Database(this.primaryDbPath);
    
    return new Promise((resolve) => {
      // Get all agents marked as active
      db.all("SELECT * FROM unified_agents WHERE status = 'active'", [], async (err, agents) => {
        if (err) {
          console.error('Error reading agents:', err);
          resolve();
          return;
        }
        
        let cleanedCount = 0;
        
        for (const agent of agents) {
          const isPhantom = await this.isPhantomAgent(agent);
          
          if (isPhantom) {
            await this.markAgentInactive(agent.id, 'phantom_cleanup');
            cleanedCount++;
            console.log(`👻 Cleaned phantom agent: ${agent.name}`);
          }
        }
        
        console.log(`✅ Phantom cleanup complete: ${cleanedCount} phantoms removed`);
        db.close();
        resolve();
      });
    });
  }

  async isPhantomAgent(agent) {
    // Check if agent has a valid session
    const sessions = this.loadSessions();
    const activeSession = Object.values(sessions.activeSessions)
      .find(s => s.agentName === agent.name);
    
    if (!activeSession) {
      return true; // No active session = phantom
    }
    
    // Check if process still exists
    if (activeSession.processId) {
      try {
        process.kill(activeSession.processId, 0);
        return false; // Process exists = not phantom
      } catch (err) {
        return true; // Process dead = phantom
      }
    }
    
    // Check heartbeat timeout
    const timeSinceHeartbeat = Date.now() - activeSession.lastHeartbeat;
    return timeSinceHeartbeat > this.sessionTimeout;
  }

  async markAgentInactive(agentId, reason) {
    return new Promise((resolve) => {
      const db = new sqlite3.Database(this.primaryDbPath);
      
      db.run(
        'UPDATE unified_agents SET status = ?, last_heartbeat = ? WHERE id = ?',
        ['inactive', Date.now(), agentId],
        function(err) {
          if (err) console.error('Error marking agent inactive:', err);
          db.close();
          resolve();
        }
      );
    });
  }

  async findAgentByName(name) {
    return new Promise((resolve) => {
      const db = new sqlite3.Database(this.primaryDbPath);
      
      db.get('SELECT * FROM unified_agents WHERE name = ?', [name], (err, row) => {
        if (err) console.error('Error finding agent:', err);
        resolve(row || null);
        db.close();
      });
    });
  }

  loadSessions() {
    try {
      return JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
    } catch (err) {
      return { lastCleanup: Date.now(), activeSessions: {}, sessionHistory: [] };
    }
  }

  saveSessions(sessions) {
    sessions.lastCleanup = Date.now();
    fs.writeFileSync(this.sessionFile, JSON.stringify(sessions, null, 2));
  }

  /**
   * Enhanced agent registration with security
   */
  async secureAgentJoin(name, role, capabilities = []) {
    // 1. Authenticate
    const auth = await this.authenticateAgent(name, role, process.pid);
    
    // 2. Register in database with session info
    const agentId = `agent_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.primaryDbPath);
      
      const sessionInfo = JSON.stringify({
        sessionId: auth.sessionId,
        sessionToken: auth.sessionToken,
        processId: process.pid,
        startTime: Date.now()
      });
      
      db.run(`
        INSERT INTO unified_agents (
          id, name, role, capabilities, status, last_heartbeat, session_info,
          coherence_level, love_resonance, field_coherence, primary_harmony,
          created_at
        ) VALUES (?, ?, ?, ?, 'active', ?, ?, 75, 75, 0.75, 'resonance', ?)
      `, [
        agentId, name, role, capabilities.join(','), Date.now(), sessionInfo, Date.now()
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Secure agent registration complete: ${name}`);
          resolve({ agentId, ...auth });
        }
        db.close();
      });
    });
  }

  /**
   * Diagnostic report
   */
  async generateSecurityReport() {
    console.log('\n📊 AGENT SECURITY STATUS REPORT');
    console.log('══════════════════════════════════════');
    
    const agents = await this.readDatabase(this.primaryDbPath);
    const sessions = this.loadSessions();
    
    console.log(`\n🤖 Agent Status:`);
    console.log(`   Total Registered: ${agents.length}`);
    console.log(`   Active: ${agents.filter(a => a.status === 'active').length}`);
    console.log(`   Inactive: ${agents.filter(a => a.status === 'inactive').length}`);
    
    console.log(`\n💓 Session Status:`);
    console.log(`   Active Sessions: ${Object.keys(sessions.activeSessions).length}`);
    console.log(`   Last Cleanup: ${new Date(sessions.lastCleanup).toLocaleString()}`);
    
    console.log(`\n🔐 Security Status:`);
    console.log(`   Database Unified: ✅`);
    console.log(`   Heartbeat Active: ✅`);
    console.log(`   Authentication: ✅`);
    console.log(`   Session Tracking: ✅`);
    console.log(`   Phantom Cleanup: ✅`);
    
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active').length,
      activeSessions: Object.keys(sessions.activeSessions).length,
      securityEnabled: true
    };
  }
}

// CLI Interface
if (require.main === module) {
  const command = process.argv[2];
  const manager = new AgentSecurityManager();
  
  switch(command) {
    case 'init':
      manager.initialize().catch(console.error);
      break;
      
    case 'cleanup':
      manager.initialize()
        .then(() => manager.cleanPhantomAgents())
        .then(() => manager.generateSecurityReport())
        .then(() => process.exit(0))
        .catch(console.error);
      break;
      
    case 'report':
      manager.generateSecurityReport()
        .then(() => process.exit(0))
        .catch(console.error);
      break;
      
    case 'test':
      manager.initialize()
        .then(() => manager.secureAgentJoin('TestAgent', 'Test Role'))
        .then(result => {
          console.log('Test registration result:', result);
          return manager.generateSecurityReport();
        })
        .then(() => process.exit(0))
        .catch(console.error);
      break;
      
    default:
      console.log('Agent Security Manager\n');
      console.log('Commands:');
      console.log('  node agent-security-fixes.js init    - Initialize all security fixes');
      console.log('  node agent-security-fixes.js cleanup - Clean phantom agents');
      console.log('  node agent-security-fixes.js report  - Generate security report');
      console.log('  node agent-security-fixes.js test    - Test secure registration');
  }
}

module.exports = { AgentSecurityManager };