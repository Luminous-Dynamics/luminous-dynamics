/**
 * Agent Communication Server
 * SQLite-based API for Claude Code agent coordination
 */

import http from 'http';
import url from 'url';
import { AgentDatabase } from './database.js';

class AgentCommServer {
  constructor(port = 3001) {
    this.port = port;
    this.db = new AgentDatabase();
    this.cleanupInterval = null; // Track cleanup interval for proper shutdown
  }

  async initialize() {
    await this.db.initialize();
    console.log('✅ Database initialized');
  }

  createServer() {
    const server = http.createServer(async (req, res) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      try {
        await this.handleRequest(req, res);
      } catch (error) {
        console.error('Request error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });

    return server;
  }

  async handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    const query = parsedUrl.query;

    // Helper to get request body
    const getBody = () => {
      return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch {
            resolve({});
          }
        });
      });
    };

    // Routes
    if (path === '/api/dashboard' && method === 'GET') {
      const summary = await this.db.getDashboardSummary();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(summary));

    } else if (path === '/api/agents' && method === 'GET') {
      const agents = await this.db.getActiveAgents();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(agents));

    } else if (path === '/api/agents' && method === 'POST') {
      const body = await getBody();
      const agent = await this.db.registerAgent(
        body.id,
        body.capabilities || [],
        body.sessionInfo || {}
      );
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(agent));

    } else if (path === '/api/messages' && method === 'GET') {
      const agentId = query.agent;
      const unreadOnly = query.unread === 'true';
      const limit = parseInt(query.limit) || 50;
      
      let messages;
      if (agentId) {
        messages = await this.db.getMessages(agentId, unreadOnly, limit);
      } else {
        messages = await this.db.getRecentMessages(24, limit);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(messages));

    } else if (path === '/api/messages' && method === 'POST') {
      const body = await getBody();
      const messageId = await this.db.sendMessage(
        body.from,
        body.to,
        body.content,
        body.type || 'general',
        body.metadata || {}
      );
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: messageId, success: true }));

    } else if (path === '/api/state' && method === 'GET') {
      if (query.key) {
        const state = await this.db.getState(query.key);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(state));
      } else {
        const allState = await this.db.getAllState();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(allState));
      }

    } else if (path === '/api/state' && method === 'POST') {
      const body = await getBody();
      await this.db.setState(body.key, body.value, body.updatedBy);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));

    } else if (path === '/api/work' && method === 'GET') {
      const activeWork = await this.db.getActiveWork();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(activeWork));

    } else if (path === '/api/work' && method === 'POST') {
      const body = await getBody();
      const workItem = await this.db.createWorkItem(
        body.id,
        body.title,
        body.description,
        body.createdBy,
        body.metadata || {}
      );
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(workItem));

    } else if (path.startsWith('/api/work/') && method === 'PUT') {
      const workId = path.split('/')[3];
      const body = await getBody();
      
      if (body.progress !== undefined) {
        await this.db.updateWorkProgress(
          workId,
          body.progress,
          body.notes || '',
          body.updatedBy || ''
        );
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));

    } else if (path === '/api/cleanup' && method === 'POST') {
      await this.db.cleanup();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));

    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  }

  async start() {
    await this.initialize();
    const server = this.createServer();
    
    server.listen(this.port, () => {
      console.log(`🚀 Agent Communication Server running on http://localhost:${this.port}`);
      console.log('\n📊 API Endpoints:');
      console.log('  GET  /api/dashboard     - Complete dashboard data');
      console.log('  GET  /api/agents       - List active agents');
      console.log('  POST /api/agents       - Register new agent');
      console.log('  GET  /api/messages     - Get messages');
      console.log('  POST /api/messages     - Send message');
      console.log('  GET  /api/state        - Get shared state');
      console.log('  POST /api/state        - Set shared state');
      console.log('  GET  /api/work         - Get active work');
      console.log('  POST /api/work         - Create work item');
      console.log('  PUT  /api/work/:id     - Update work progress');
      console.log('  POST /api/cleanup      - Cleanup old data');
      console.log('\n💡 Dashboard: http://localhost:8080/dashboard-sqlite.html');
    });

    // Cleanup every hour - store interval ID for proper cleanup
    this.cleanupInterval = setInterval(async () => {
      await this.db.cleanup();
      console.log('🧹 Database cleanup completed');
    }, 60 * 60 * 1000);

    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
      
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        console.log('⏰ Cleaned up database cleanup interval');
      }
      
      if (this.db) {
        await this.db.close();
        console.log('🗄️  Closed database connection');
      }
      
      if (server) {
        server.close(() => {
          console.log('🚪 HTTP server closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('exit', () => {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }
    });

    return server;
  }
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new AgentCommServer();
  server.start().catch(console.error);
}

export { AgentCommServer };