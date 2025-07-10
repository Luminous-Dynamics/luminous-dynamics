#!/usr/bin/env node
/**
 * The Weave Server - Multi-Agent Coordination Platform
 * Production-ready API server for agent coordination, sacred messaging, and collective intelligence
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const { EventEmitter } = require('events');

// Configuration
const CONFIG = {
  port: process.env.WEAVE_PORT || 3001,
  dbPath: process.env.WEAVE_DB_PATH || './cli/unified-agent-network.db',
  name: 'The Weave Network',
  version: '2.0.0',
  wsEnabled: process.env.WEAVE_WEBSOCKET_ENABLED !== 'false'
};

class WeaveServer extends EventEmitter {
  constructor() {
    super();
    this.app = express();
    this.server = createServer(this.app);
    
    // Initialize WebSocket if enabled
    if (CONFIG.wsEnabled) {
      this.io = new Server(this.server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
      });
    }
    
    // Initialize database
    this.db = new Database(CONFIG.dbPath);
    this.db.pragma('journal_mode = WAL');
    
    // Connected agents map
    this.activeAgents = new Map();
    this.activeSessions = new Map();
    
    this.setupDatabase();
    this.setupMiddleware();
    this.setupRoutes();
    if (CONFIG.wsEnabled) {
      this.setupWebSocket();
    }
  }

  setupDatabase() {
    // Ensure tables exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        capabilities TEXT,
        sacred_name TEXT,
        coherence_level REAL DEFAULT 0.88
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_agent TEXT NOT NULL,
        to_agent TEXT NOT NULL,
        message TEXT NOT NULL,
        message_type TEXT DEFAULT 'coordination',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        read INTEGER DEFAULT 0,
        impact REAL DEFAULT 0,
        FOREIGN KEY (from_agent) REFERENCES agents(id),
        FOREIGN KEY (to_agent) REFERENCES agents(id)
      );

      CREATE TABLE IF NOT EXISTS collectives (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        purpose TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        coherence_level REAL DEFAULT 0.85,
        member_count INTEGER DEFAULT 0,
        FOREIGN KEY (created_by) REFERENCES agents(id)
      );

      CREATE TABLE IF NOT EXISTS collective_members (
        collective_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        role TEXT DEFAULT 'member',
        PRIMARY KEY (collective_id, agent_id),
        FOREIGN KEY (collective_id) REFERENCES collectives(id),
        FOREIGN KEY (agent_id) REFERENCES agents(id)
      );

      CREATE TABLE IF NOT EXISTS work_items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        collective_id TEXT,
        assigned_to TEXT,
        created_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        coherence_impact REAL DEFAULT 0,
        FOREIGN KEY (collective_id) REFERENCES collectives(id),
        FOREIGN KEY (assigned_to) REFERENCES agents(id),
        FOREIGN KEY (created_by) REFERENCES agents(id)
      );

      CREATE INDEX IF NOT EXISTS idx_messages_to_agent ON messages(to_agent, read);
      CREATE INDEX IF NOT EXISTS idx_work_items_status ON work_items(status);
      CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
    `);
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      const stats = this.getNetworkStats();
      res.json({
        status: 'active',
        name: CONFIG.name,
        version: CONFIG.version,
        network: stats,
        websocket: CONFIG.wsEnabled ? 'enabled' : 'disabled'
      });
    });

    // Agent endpoints
    this.app.post('/api/agents/register', (req, res) => {
      const { name, role, capabilities, sacredName } = req.body;
      const agentId = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        const stmt = this.db.prepare(`
          INSERT INTO agents (id, name, role, capabilities, sacred_name)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        stmt.run(agentId, name, role, JSON.stringify(capabilities || []), sacredName || name);
        
        this.emit('agent-registered', { agentId, name, role });
        
        res.json({
          success: true,
          agentId,
          message: `Welcome to The Weave, ${name}!`
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    });

    this.app.get('/api/agents', (req, res) => {
      const agents = this.db.prepare('SELECT * FROM agents WHERE status = ?').all('active');
      res.json(agents);
    });

    this.app.get('/api/agents/:agentId', (req, res) => {
      const agent = this.db.prepare('SELECT * FROM agents WHERE id = ?').get(req.params.agentId);
      if (agent) {
        res.json(agent);
      } else {
        res.status(404).json({ error: 'Agent not found' });
      }
    });

    // Message endpoints
    this.app.post('/api/messages/send', (req, res) => {
      const { from, to, message, type = 'coordination' } = req.body;
      
      try {
        const stmt = this.db.prepare(`
          INSERT INTO messages (from_agent, to_agent, message, message_type)
          VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(from, to, message, type);
        
        // Emit WebSocket event if enabled
        if (CONFIG.wsEnabled && this.activeSessions.has(to)) {
          this.io.to(this.activeSessions.get(to)).emit('new-message', {
            from,
            message,
            type,
            timestamp: new Date()
          });
        }
        
        res.json({
          success: true,
          messageId: result.lastInsertRowid
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    });

    this.app.get('/api/messages/:agentId', (req, res) => {
      const messages = this.db.prepare(`
        SELECT * FROM messages 
        WHERE to_agent = ? AND read = 0
        ORDER BY timestamp DESC
        LIMIT 50
      `).all(req.params.agentId);
      
      // Mark as read
      this.db.prepare('UPDATE messages SET read = 1 WHERE to_agent = ? AND read = 0')
        .run(req.params.agentId);
      
      res.json(messages);
    });

    // Collective endpoints
    this.app.post('/api/collectives/create', (req, res) => {
      const { name, purpose, createdBy } = req.body;
      const collectiveId = `collective-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        this.db.prepare(`
          INSERT INTO collectives (id, name, purpose, created_by)
          VALUES (?, ?, ?, ?)
        `).run(collectiveId, name, purpose, createdBy);
        
        // Add creator as member
        this.db.prepare(`
          INSERT INTO collective_members (collective_id, agent_id, role)
          VALUES (?, ?, ?)
        `).run(collectiveId, createdBy, 'founder');
        
        res.json({
          success: true,
          collectiveId,
          message: `Collective "${name}" created successfully`
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    });

    this.app.get('/api/collectives', (req, res) => {
      const collectives = this.db.prepare(`
        SELECT c.*, COUNT(cm.agent_id) as member_count
        FROM collectives c
        LEFT JOIN collective_members cm ON c.id = cm.collective_id
        GROUP BY c.id
      `).all();
      
      res.json(collectives);
    });

    this.app.post('/api/collectives/:collectiveId/join', (req, res) => {
      const { agentId } = req.body;
      const { collectiveId } = req.params;
      
      try {
        this.db.prepare(`
          INSERT INTO collective_members (collective_id, agent_id)
          VALUES (?, ?)
        `).run(collectiveId, agentId);
        
        res.json({
          success: true,
          message: 'Successfully joined collective'
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    });

    // Work item endpoints
    this.app.post('/api/work/create', (req, res) => {
      const { title, description, collectiveId, assignedTo, createdBy } = req.body;
      const workId = `work-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        this.db.prepare(`
          INSERT INTO work_items (id, title, description, collective_id, assigned_to, created_by)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(workId, title, description, collectiveId, assignedTo, createdBy);
        
        res.json({
          success: true,
          workId,
          message: 'Work item created'
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    });

    this.app.get('/api/work', (req, res) => {
      const { status, collectiveId, assignedTo } = req.query;
      let query = 'SELECT * FROM work_items WHERE 1=1';
      const params = [];
      
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (collectiveId) {
        query += ' AND collective_id = ?';
        params.push(collectiveId);
      }
      if (assignedTo) {
        query += ' AND assigned_to = ?';
        params.push(assignedTo);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const workItems = this.db.prepare(query).all(...params);
      res.json(workItems);
    });

    this.app.patch('/api/work/:workId', (req, res) => {
      const { workId } = req.params;
      const { status, progress, coherenceImpact } = req.body;
      
      try {
        const updates = [];
        const params = [];
        
        if (status !== undefined) {
          updates.push('status = ?');
          params.push(status);
        }
        if (progress !== undefined) {
          updates.push('progress = ?');
          params.push(progress);
        }
        if (coherenceImpact !== undefined) {
          updates.push('coherence_impact = ?');
          params.push(coherenceImpact);
        }
        
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(workId);
        
        this.db.prepare(`
          UPDATE work_items
          SET ${updates.join(', ')}
          WHERE id = ?
        `).run(...params);
        
        res.json({ success: true, message: 'Work item updated' });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    });

    // Network statistics
    this.app.get('/api/network/stats', (req, res) => {
      res.json(this.getNetworkStats());
    });

    // Field coherence
    this.app.get('/api/field/coherence', (req, res) => {
      const coherence = this.calculateFieldCoherence();
      res.json({
        coherence,
        timestamp: new Date(),
        activeAgents: this.activeAgents.size,
        recommendation: coherence > 0.85 ? 'Field is highly coherent' : 'Consider sacred practices to raise coherence'
      });
    });
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log('New WebSocket connection:', socket.id);
      
      // Agent authentication
      socket.on('authenticate', (data) => {
        const { agentId } = data;
        const agent = this.db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
        
        if (agent) {
          this.activeAgents.set(agentId, {
            ...agent,
            socketId: socket.id,
            connectedAt: new Date()
          });
          this.activeSessions.set(agentId, socket.id);
          
          socket.agentId = agentId;
          socket.join(`agent-${agentId}`);
          
          // Update last seen
          this.db.prepare('UPDATE agents SET last_seen = CURRENT_TIMESTAMP WHERE id = ?').run(agentId);
          
          socket.emit('authenticated', {
            success: true,
            agent,
            networkStats: this.getNetworkStats()
          });
          
          // Notify network
          this.io.emit('agent-online', {
            agentId,
            name: agent.name,
            role: agent.role
          });
        } else {
          socket.emit('authenticated', {
            success: false,
            error: 'Invalid agent ID'
          });
        }
      });
      
      // Real-time messaging
      socket.on('send-message', (data) => {
        const { to, message, type = 'coordination' } = data;
        const from = socket.agentId;
        
        if (!from) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }
        
        // Store in database
        const stmt = this.db.prepare(`
          INSERT INTO messages (from_agent, to_agent, message, message_type)
          VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(from, to, message, type);
        
        // Send to recipient if online
        if (this.activeSessions.has(to)) {
          this.io.to(this.activeSessions.get(to)).emit('new-message', {
            from,
            message,
            type,
            timestamp: new Date()
          });
        }
        
        socket.emit('message-sent', {
          success: true,
          messageId: result.lastInsertRowid
        });
      });
      
      // Collective coordination
      socket.on('join-collective', (collectiveId) => {
        socket.join(`collective-${collectiveId}`);
        socket.emit('joined-collective', { collectiveId });
      });
      
      // Field coherence updates
      socket.on('request-coherence', () => {
        const coherence = this.calculateFieldCoherence();
        socket.emit('field-coherence', { coherence });
      });
      
      // Disconnect handling
      socket.on('disconnect', () => {
        if (socket.agentId) {
          this.activeAgents.delete(socket.agentId);
          this.activeSessions.delete(socket.agentId);
          
          this.io.emit('agent-offline', {
            agentId: socket.agentId
          });
        }
      });
    });
    
    // Broadcast field coherence every 30 seconds
    setInterval(() => {
      const coherence = this.calculateFieldCoherence();
      this.io.emit('field-coherence', { coherence });
    }, 30000);
  }

  getNetworkStats() {
    const stats = {
      totalAgents: this.db.prepare('SELECT COUNT(*) as count FROM agents').get().count,
      activeAgents: this.activeAgents.size,
      totalMessages: this.db.prepare('SELECT COUNT(*) as count FROM messages').get().count,
      totalCollectives: this.db.prepare('SELECT COUNT(*) as count FROM collectives').get().count,
      totalWorkItems: this.db.prepare('SELECT COUNT(*) as count FROM work_items').get().count,
      pendingWork: this.db.prepare('SELECT COUNT(*) as count FROM work_items WHERE status = ?').get('pending').count,
      fieldCoherence: this.calculateFieldCoherence()
    };
    
    return stats;
  }

  calculateFieldCoherence() {
    // Base coherence
    let coherence = 0.88;
    
    // Active agents boost
    const activeRatio = this.activeAgents.size / Math.max(1, this.db.prepare('SELECT COUNT(*) as count FROM agents').get().count);
    coherence += activeRatio * 0.05;
    
    // Recent messages boost
    const recentMessages = this.db.prepare(`
      SELECT COUNT(*) as count FROM messages 
      WHERE timestamp > datetime('now', '-1 hour')
    `).get().count;
    coherence += Math.min(recentMessages / 100, 0.05);
    
    // Work completion boost
    const completedWork = this.db.prepare(`
      SELECT AVG(progress) as avg FROM work_items
      WHERE updated_at > datetime('now', '-24 hours')
    `).get().avg || 0;
    coherence += (completedWork / 100) * 0.02;
    
    return Math.min(coherence, 0.99);
  }

  async start() {
    return new Promise((resolve) => {
      this.server.listen(CONFIG.port, () => {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║           🕸️  THE WEAVE NETWORK ACTIVATED 🕸️            ║
║                                                          ║
║  Multi-Agent Coordination Platform v${CONFIG.version}              ║
║  Port: ${CONFIG.port}                                      ║
║  WebSocket: ${CONFIG.wsEnabled ? 'Enabled' : 'Disabled'}                              ║
║  Database: ${path.basename(CONFIG.dbPath)}              ║
║                                                          ║
║  Features:                                               ║
║  ✓ Agent registration and discovery                     ║
║  ✓ Sacred messaging protocol                            ║
║  ✓ Collective formation and coordination                ║
║  ✓ Work item tracking with coherence impact            ║
║  ✓ Real-time WebSocket communication                   ║
║  ✓ Field coherence monitoring                          ║
║                                                          ║
║  API available at http://localhost:${CONFIG.port}/api         ║
╚══════════════════════════════════════════════════════════╝
        `);
        resolve(this.server);
      });
    });
  }

  async shutdown() {
    // Close database
    this.db.close();
    
    // Close server
    return new Promise((resolve) => {
      this.server.close(resolve);
    });
  }
}

// Start server if run directly
if (require.main === module) {
  const weaveServer = new WeaveServer();
  weaveServer.start().catch(console.error);
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await weaveServer.shutdown();
    process.exit(0);
  });
}

module.exports = WeaveServer;