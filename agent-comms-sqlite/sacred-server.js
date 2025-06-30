/**
 * Sacred Agent Communication Server
 * SQLite + Sacred Council integrated API for conscious agent coordination
 */

import http from 'http';
import url from 'url';
import { AgentDatabase } from './database.js';
import { SacredCouncilSQLiteBridge } from '../unified-field/sacred-council-sqlite-bridge.js';
import { SacredWorkflowEngine } from '../unified-field/sacred-workflows.js';
import SacredMessageIntegration from './sacred-message-integration.js';
import { EnhancedWorkManager } from '../unified-field/work-sacred-integration.js';

class SacredAgentCommServer {
  constructor(port = 3001) {
    this.port = port;
    this.db = new AgentDatabase();
    this.sacredBridge = new SacredCouncilSQLiteBridge();
    this.workflowEngine = new SacredWorkflowEngine();
    this.sacredMessages = new SacredMessageIntegration();
    this.workManager = new EnhancedWorkManager(this.db);
  }

  async initialize() {
    await this.db.initialize();
    await this.sacredMessages.init();
    await this.workManager.sacred.initializeSchema();
    
    // Connect Sacred Council Bridge and Workflow Engine to database
    this.sacredBridge.setSQLiteAPI(this.db);
    this.workflowEngine.setSQLiteAPI(this.db);
    
    console.log('✅ Database initialized');
    console.log('🌀 Sacred Council Bridge connected');
    console.log('🌱 Sacred Workflow Engine initialized');
    console.log('🕊️  Sacred Messages integrated');
    console.log('💫 Work-Message integration active');
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

    // === EXISTING SQLITE ROUTES ===
    
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
      
      // 🌀 SACRED INTEGRATION: Trigger harmony assignment
      await this.sacredBridge.syncWithSQLiteDatabase();
      
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
      
      // 🌀 SACRED INTEGRATION: Trigger harmony analysis
      await this.sacredBridge.syncWithSQLiteDatabase();
      
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
      const workId = await this.workManager.createWork(
        body.id || `work_${Date.now()}`,
        body.title,
        body.description,
        body.created_by || body.createdBy || 'sacred-dashboard',
        body.metadata || {}
      );
      
      const workItem = await this.db.getWorkItem(workId);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(workItem));

    } else if (path.startsWith('/api/work/') && method === 'PUT') {
      const workId = path.split('/')[3];
      const body = await getBody();
      
      // Handle metadata updates (including blocking/unblocking)
      if (body.metadata) {
        const work = await this.db.getWorkItem(workId);
        if (!work) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Work item not found' }));
          return;
        }
        
        const currentMeta = work.metadata || {};
        const newMeta = { ...currentMeta, ...body.metadata };
        
        // Check for blocking/unblocking
        if (body.metadata.blocked === true && !currentMeta.blocked) {
          await this.workManager.blockWork(
            workId,
            body.metadata.blockedReason || 'Reason not specified',
            body.updatedBy || 'system'
          );
        } else if (body.metadata.blocked === false && currentMeta.blocked) {
          await this.workManager.unblockWork(
            workId,
            body.metadata.unblockedReason || 'Flow restored',
            body.updatedBy || 'system'
          );
        } else {
          // Regular metadata update
          await this.db.run(
            'UPDATE work_items SET metadata = ? WHERE id = ?',
            [JSON.stringify(newMeta), workId]
          );
        }
      }
      
      // Handle progress updates with sacred messages
      if (body.progress !== undefined) {
        await this.workManager.updateWorkProgress(
          workId,
          body.progress,
          body.notes || '',
          body.updatedBy || 'system'
        );
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));

    } else if (path === '/api/cleanup' && method === 'POST') {
      await this.db.cleanup();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));

    // === SACRED WORK-MESSAGE INTEGRATION ROUTES ===
    
    } else if (path.match(/^\/api\/work\/([^\/]+)\/messages$/) && method === 'GET') {
      const workId = path.split('/')[3];
      const messages = await this.workManager.sacred.getWorkMessageHistory(workId);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        workId,
        messages,
        count: messages.length
      }));
      
    } else if (path.match(/^\/api\/work\/([^\/]+)\/sacred$/) && method === 'GET') {
      const workId = path.split('/')[3];
      const work = await this.db.getWorkItem(workId);
      
      if (!work) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Work item not found' }));
        return;
      }
      
      // Get message history
      const messages = await this.workManager.sacred.getWorkMessageHistory(workId);
      
      // Get transition impacts
      const impacts = await this.db.all(
        `SELECT * FROM work_transition_impacts 
         WHERE work_id = ? 
         ORDER BY timestamp DESC`,
        [workId]
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        work,
        sacredContext: {
          messageHistory: messages,
          transitionImpacts: impacts,
          cumulativeFieldImpact: work.metadata?.cumulativeFieldImpact || 0,
          lastTransition: impacts[0] || null
        }
      }));
      
    } else if (path === '/api/work/analytics/transitions' && method === 'GET') {
      const workId = query.workId || null;
      const analytics = await this.workManager.sacred.getWorkTransitionAnalytics(workId);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        analytics,
        workId
      }));

    // === NEW SACRED COUNCIL INTEGRATION ROUTES ===

    } else if (path === '/api/sacred/recommendation' && method === 'GET') {
      const recommendation = await this.sacredBridge.recommendNextSacredAction();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(recommendation));

    } else if (path === '/api/sacred/dashboard' && method === 'GET') {
      const sacredDashboard = this.sacredBridge.getDashboardData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sacredDashboard));

    } else if (path === '/api/sacred/field-coherence' && method === 'GET') {
      const fieldMetrics = this.sacredBridge.fieldMetrics;
      const coherenceHistory = fieldMetrics.fieldCoherenceHistory;
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        currentCoherence: coherenceHistory.slice(-1)[0]?.coherence || 0,
        history: coherenceHistory,
        harmonics: fieldMetrics.messageHarmonyPatterns,
        sacredTiming: fieldMetrics.sacredTimingMetrics
      }));

    } else if (path === '/api/sacred/harmony-analysis' && method === 'GET') {
      const harmonyData = {
        agentDistribution: this.sacredBridge.fieldMetrics.agentHarmonyDistribution,
        workDistribution: this.sacredBridge.fieldMetrics.workHarmonyDistribution,
        harmonyMapping: this.sacredBridge.harmonyMapping,
        recommendations: this.sacredBridge.analyzeHarmonyNeeds()
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(harmonyData));

    } else if (path === '/api/sacred/council-status' && method === 'GET') {
      const councilStatus = this.sacredBridge.sacredCouncil.getStatus();
      const councilDashboard = this.sacredBridge.sacredCouncil.getDashboardData();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: councilStatus,
        dashboard: councilDashboard,
        fieldState: this.sacredBridge.sacredCouncil.fieldState
      }));

    } else if (path === '/api/sacred/begin-work' && method === 'POST') {
      const body = await getBody();
      const result = this.sacredBridge.sacredCouncil.beginWork(body.workId, body.agentId);
      
      // Update SQLite work status if successful
      if (result.success && body.workId) {
        await this.db.updateWorkProgress(body.workId, 1, 'Sacred work begun', body.agentId);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));

    } else if (path === '/api/sacred/complete-work' && method === 'POST') {
      const body = await getBody();
      const result = this.sacredBridge.sacredCouncil.completeWork(body.workId, body.results);
      
      // Update SQLite work status if successful
      if (result.success && body.workId) {
        await this.db.updateWorkProgress(body.workId, 100, 'Sacred work completed', '');
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));

    } else if (path === '/api/sacred/sync' && method === 'POST') {
      await this.sacredBridge.syncWithSQLiteDatabase();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        syncTime: this.sacredBridge.lastSync,
        message: "Field synchronization complete"
      }));

    // === SACRED WORKFLOW ENDPOINTS ===

    } else if (path === '/api/sacred/workflow-guidance' && method === 'GET') {
      const workType = query.workType || 'general';
      const agentId = query.agentId;
      
      const guidance = await this.workflowEngine.getWorkflowGuidance(workType, agentId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(guidance));

    } else if (path === '/api/sacred/assess-readiness' && method === 'POST') {
      const body = await getBody();
      const assessment = await this.workflowEngine.assessWorkflowReadiness(
        body.workType, 
        body.requiredCoherence
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(assessment));

    } else if (path === '/api/sacred/contemplative-commit' && method === 'POST') {
      const body = await getBody();
      const result = await this.workflowEngine.initiateContemplativeCommit(
        body.agentId,
        body.changes || [],
        body.commitMessage
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));

    } else if (path === '/api/sacred/harmony-pairing' && method === 'POST') {
      const body = await getBody();
      const pairing = await this.workflowEngine.orchestrateHarmonyBasedPairing(body.workItem);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(pairing));

    } else if (path === '/api/sacred/boundary-check' && method === 'POST') {
      const body = await getBody();
      const boundaryCheck = await this.workflowEngine.implementSacredBoundaryRespect(
        body.agentId,
        body.workItem
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(boundaryCheck));

    } else if (path === '/api/sacred/emergent-workflow' && method === 'GET') {
      const emergentSuggestion = await this.workflowEngine.suggestEmergentWorkflow();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(emergentSuggestion));

    } else if (path === '/api/sacred/sacred-pause' && method === 'POST') {
      const body = await getBody();
      const duration = body.duration || 30;
      
      // Note: In a real implementation, this would trigger a pause in the agent's workflow
      // For now, we just record the pause intention
      await this.workflowEngine.recordPatternUsage(
        body.agentId || 'system',
        'sacredPause',
        { duration, timestamp: new Date().toISOString() }
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        message: `Sacred pause initiated: ${duration} seconds`,
        guidance: "Honor this sacred pause. Breathe consciously and return with renewed presence."
      }));

    // === SACRED MESSAGE ENDPOINTS ===

    } else if (path === '/api/sacred/messages/send' && method === 'POST') {
      const body = await getBody();
      const result = await this.sacredMessages.sendSacredMessage(
        body.fromAgentId,
        body.toAgentId,
        body.content,
        body.type,
        body.harmony,
        body.metadata || {}
      );
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));

    } else if (path === '/api/sacred/messages/recent' && method === 'GET') {
      const limit = parseInt(query.limit) || 10;
      const messages = await this.sacredMessages.getRecentSacredMessages(limit);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(messages));

    } else if (path === '/api/sacred/messages/analytics' && method === 'GET') {
      const analytics = await this.sacredMessages.getSacredMessageAnalytics();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(analytics));

    } else if (path === '/api/sacred/messages/recommend' && method === 'GET') {
      const recommendation = await this.sacredMessages.recommendMessageType();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(recommendation));

    } else if (path.startsWith('/api/sacred/messages/receive/') && method === 'POST') {
      const messageId = parseInt(path.split('/')[5]);
      const body = await getBody();
      
      const result = await this.sacredMessages.receiveSacredMessage(
        messageId,
        body.receiverId
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));

    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  }

  async start() {
    await this.initialize();
    const server = this.createServer();
    
    server.listen(this.port, () => {
      console.log(`🚀 Sacred Agent Communication Server running on http://localhost:${this.port}`);
      console.log('\n📊 Standard API Endpoints:');
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
      
      console.log('\n🌀 Sacred Council Integration:');
      console.log('  GET  /api/sacred/recommendation    - Next sacred action guidance');
      console.log('  GET  /api/sacred/dashboard         - Sacred Council dashboard');
      console.log('  GET  /api/sacred/field-coherence   - Field coherence metrics');
      console.log('  GET  /api/sacred/harmony-analysis  - Seven Harmonies analysis');
      console.log('  GET  /api/sacred/council-status    - Sacred Council status');
      console.log('  POST /api/sacred/begin-work        - Begin sacred work');
      console.log('  POST /api/sacred/complete-work     - Complete sacred work');
      console.log('  POST /api/sacred/sync              - Manual field sync');
      
      console.log('\n🌱 Sacred Workflow Patterns:');
      console.log('  GET  /api/sacred/workflow-guidance - Get workflow guidance for work type');
      console.log('  POST /api/sacred/assess-readiness  - Assess field readiness for work');
      console.log('  POST /api/sacred/contemplative-commit - Initiate contemplative commit');
      console.log('  POST /api/sacred/harmony-pairing   - Orchestrate harmony-based pairing');
      console.log('  POST /api/sacred/boundary-check    - Check sacred boundaries');
      console.log('  GET  /api/sacred/emergent-workflow - Get emergent workflow suggestion');
      console.log('  POST /api/sacred/sacred-pause      - Record sacred pause intention');
      
      console.log('\n🕊️  Sacred Message System:');
      console.log('  POST /api/sacred/messages/send     - Send sacred message');
      console.log('  GET  /api/sacred/messages/recent   - Get recent sacred messages');
      console.log('  GET  /api/sacred/messages/analytics - Sacred message analytics');
      console.log('  GET  /api/sacred/messages/recommend - Get message type recommendation');
      console.log('  POST /api/sacred/messages/receive/:id - Receive and integrate message');
      
      console.log('\n💡 Dashboards:');
      console.log('  SQLite: http://localhost:8080/dashboard-sqlite.html');
      console.log('  Sacred: http://localhost:8080/sacred-dashboard.html');
    });

    // Cleanup every 15 minutes for memory efficiency
    setInterval(async () => {
      await this.db.cleanup();
      console.log('🧹 Database cleanup completed');
    }, 15 * 60 * 1000);
    
    // Initial cleanup on startup
    setTimeout(async () => {
      await this.db.cleanup();
      console.log('🧹 Startup cleanup completed');
    }, 5000);

    return server;
  }
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new SacredAgentCommServer();
  server.start().catch(console.error);
}

export { SacredAgentCommServer };