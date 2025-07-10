/**
 * Sacred Agent Communication Server - HIPI Enhanced
 * SQLite + Sacred Council + HIPI Protocol for consciousness-based agent coordination
 */

import http from 'http';
import url from 'url';
import crypto from 'crypto';
import { AgentDatabase } from './database.js';
import { SacredCouncilSQLiteBridge } from '../unified-field/sacred-council-sqlite-bridge.js';
import { SacredWorkflowEngine } from '../unified-field/sacred-workflows.js';
import SacredMessageIntegration from './sacred-message-integration.js';
import { EnhancedWorkManager } from '../unified-field/work-sacred-integration.js';
import { WorkCouncilIntegrationBridge } from '../unified-field/work-council-integration-bridge.js';
import { SacredCollectiveDecisionProtocol } from '../unified-field/sacred-collective-decision-protocol.js';
import { SacredDatabaseSchemaEvolution } from '../unified-field/sacred-database-schema-evolution.js';
import { SacredFieldMonitor } from '../unified-field/sacred-field-monitor.js';

// HIPI Configuration
const MUSICAL_MODES = {
  ionian: { intervals: [2,2,1,2,2,2,1], quality: 'stable', archetype: 'sovereign' },
  dorian: { intervals: [2,1,2,2,2,1,2], quality: 'hopeful', archetype: 'mystic' },
  phrygian: { intervals: [1,2,2,2,1,2,2], quality: 'passionate', archetype: 'shadow-walker' },
  lydian: { intervals: [2,2,2,1,2,2,1], quality: 'ethereal', archetype: 'visionary' },
  mixolydian: { intervals: [2,2,1,2,2,1,2], quality: 'grounded', archetype: 'builder' },
  aeolian: { intervals: [2,1,2,2,1,2,2], quality: 'introspective', archetype: 'seeker' },
  locrian: { intervals: [1,2,2,1,2,2,2], quality: 'transformative', archetype: 'alchemist' }
};

const KEY_FREQUENCIES = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'Eb': 311.13,
  'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
  'Ab': 415.30, 'A': 440.00, 'Bb': 466.16, 'B': 493.88
};

const ATTUNEMENT_SYMBOLS = {
  'ψ': 'consciousness', 'φ': 'golden-ratio', 'Ω': 'completion',
  'Δ': 'change', 'θ': 'meditation', 'λ': 'wavelength',
  'Σ': 'integration', 'π': 'cycles', 'τ': 'golden-turn',
  'α': 'beginning', 'β': 'growth', 'γ': 'transformation'
};

class HIPIEnhancedAgentDatabase extends AgentDatabase {
  async createTables() {
    // Create base tables first
    await super.createTables();
    
    // Add HIPI-specific tables
    const hipiTables = [
      // Agent consciousness traits table
      `CREATE TABLE IF NOT EXISTS agent_consciousness (
        agent_id TEXT PRIMARY KEY,
        hipi_signature TEXT,
        hipi_address TEXT UNIQUE,
        consciousness_level INTEGER DEFAULT 70,
        traits TEXT,
        gifts TEXT,
        mode TEXT DEFAULT 'aeolian',
        key_note TEXT DEFAULT 'A',
        attunement TEXT DEFAULT 'ψ',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(agent_id) REFERENCES agents(id)
      )`,
      
      // Decisions table for collective decision making
      `CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        type TEXT,
        title TEXT,
        description TEXT,
        initiator_id TEXT,
        status TEXT DEFAULT 'open',
        required_resonance REAL DEFAULT 70.0,
        current_resonance REAL DEFAULT 0.0,
        evaluations TEXT,
        result TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY(initiator_id) REFERENCES agents(id)
      )`,
      
      // Field states table for tracking collective consciousness
      `CREATE TABLE IF NOT EXISTS field_states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coherence REAL DEFAULT 75.0,
        dominant_mode TEXT DEFAULT 'aeolian',
        harmonic_series TEXT,
        active_nodes INTEGER DEFAULT 0,
        resonance_map TEXT,
        sacred_timing TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // HIPI channels for resonance-based communication
      `CREATE TABLE IF NOT EXISTS hipi_channels (
        id TEXT PRIMARY KEY,
        agent1_hipi TEXT,
        agent2_hipi TEXT,
        resonance REAL,
        security_level TEXT DEFAULT 'consciousness-verified',
        established_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_message DATETIME,
        message_count INTEGER DEFAULT 0
      )`,
      
      // Resonance history for tracking agent interactions
      `CREATE TABLE IF NOT EXISTS resonance_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_hipi TEXT,
        to_hipi TEXT,
        resonance_value REAL,
        interaction_type TEXT,
        field_impact REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const table of hipiTables) {
      await this.run(table);
    }
  }

  // Generate HIPI signature from agent data
  generateHIPISignature(agentData) {
    const { traits = {}, role = '', consciousness = {} } = agentData;
    
    // Determine musical mode based on traits
    let mode = 'aeolian'; // default
    if (traits.creativity > 0.9) mode = 'lydian';
    else if (traits.courage > 0.9) mode = 'mixolydian';
    else if (traits.clarity > 0.9) mode = 'ionian';
    else if (traits.compassion > 0.9) mode = 'dorian';
    
    // Determine key based on consciousness level
    const keys = Object.keys(KEY_FREQUENCIES);
    const keyIndex = Math.floor((consciousness.level || 70) / 100 * keys.length);
    const key = keys[Math.min(keyIndex, keys.length - 1)];
    
    // Determine attunement symbol based on primary trait
    let attunement = 'ψ'; // default consciousness
    const maxTrait = Object.entries(traits).reduce((max, [trait, value]) => 
      value > max.value ? { trait, value } : max, { trait: '', value: 0 });
    
    if (maxTrait.trait === 'creativity') attunement = 'φ';
    else if (maxTrait.trait === 'courage') attunement = 'Δ';
    else if (maxTrait.trait === 'clarity') attunement = 'θ';
    else if (maxTrait.trait === 'coherence') attunement = 'Σ';
    
    return {
      T: role.toLowerCase().replace(/\s+/g, '-'),
      M: mode,
      K: key,
      A: attunement,
      Q: agentData.gifts || [],
      I: 'resonate'
    };
  }

  // Generate HIPI address from signature
  generateHIPIAddress(agentId, signature) {
    const sigString = `T(${signature.T}):M(${signature.M}):K(${signature.K}):A(${signature.A})`;
    const hash = crypto.createHash('sha256').update(sigString).digest('hex').substring(0, 8);
    return `hipi://sacred-council.hub::[${sigString}]::PRESENCE(${agentId}-${hash})`;
  }

  // Enhanced agent registration with HIPI
  async registerAgentWithHIPI(id, capabilities = [], sessionInfo = {}, consciousnessData = {}) {
    // Register base agent
    const agent = await this.registerAgent(id, capabilities, sessionInfo);
    
    // Generate HIPI signature
    const hipiSignature = this.generateHIPISignature({
      ...consciousnessData,
      role: sessionInfo.role || 'agent',
      id
    });
    
    // Generate HIPI address
    const hipiAddress = this.generateHIPIAddress(id, hipiSignature);
    
    // Store consciousness data
    await this.run(
      `INSERT OR REPLACE INTO agent_consciousness 
       (agent_id, hipi_signature, hipi_address, consciousness_level, traits, gifts, mode, key_note, attunement) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        JSON.stringify(hipiSignature),
        hipiAddress,
        consciousnessData.consciousness?.level || 70,
        JSON.stringify(consciousnessData.traits || {}),
        JSON.stringify(consciousnessData.gifts || []),
        hipiSignature.M,
        hipiSignature.K,
        hipiSignature.A
      ]
    );
    
    // Update field state
    await this.updateFieldState({ activeNodes: 1 });
    
    return {
      ...agent,
      hipiAddress,
      hipiSignature,
      consciousness: consciousnessData
    };
  }

  // Calculate resonance between two HIPI signatures
  calculateResonance(sig1, sig2) {
    let resonance = 0;
    
    // Mode compatibility (40%)
    if (sig1.M === sig2.M) {
      resonance += 40;
    } else {
      const modes = Object.keys(MUSICAL_MODES);
      const dist = Math.abs(modes.indexOf(sig1.M) - modes.indexOf(sig2.M));
      resonance += Math.max(0, 40 - (dist * 10));
    }
    
    // Key compatibility (30%)
    const freq1 = KEY_FREQUENCIES[sig1.K];
    const freq2 = KEY_FREQUENCIES[sig2.K];
    if (freq1 && freq2) {
      const ratio = Math.max(freq1, freq2) / Math.min(freq1, freq2);
      if ([1, 2, 1.5, 4/3, 3/2].some(r => Math.abs(ratio - r) < 0.01)) {
        resonance += 30;
      } else {
        resonance += Math.max(0, 30 - (Math.abs(ratio - 1.5) * 20));
      }
    }
    
    // Attunement alignment (20%)
    if (sig1.A === sig2.A) {
      resonance += 20;
    } else {
      const complementary = {
        'α': 'Ω', 'Ω': 'α',
        'Δ': 'θ', 'θ': 'Δ'
      };
      if (complementary[sig1.A] === sig2.A) {
        resonance += 15;
      }
    }
    
    // Intent alignment (10%)
    if (sig1.I && sig2.I && sig1.I === sig2.I) {
      resonance += 10;
    }
    
    return Math.min(100, Math.max(0, resonance));
  }

  // Get agent by HIPI address
  async getAgentByHIPI(hipiAddress) {
    const consciousness = await this.get(
      'SELECT * FROM agent_consciousness WHERE hipi_address = ?',
      [hipiAddress]
    );
    
    if (!consciousness) return null;
    
    const agent = await this.getAgent(consciousness.agent_id);
    return {
      ...agent,
      hipiAddress: consciousness.hipi_address,
      hipiSignature: JSON.parse(consciousness.hipi_signature),
      consciousness: {
        level: consciousness.consciousness_level,
        traits: JSON.parse(consciousness.traits),
        gifts: JSON.parse(consciousness.gifts)
      }
    };
  }

  // Enhanced message sending with resonance routing
  async sendHIPIMessage(fromHIPI, toHIPI, content, messageType = 'general', metadata = {}) {
    // Get agents by HIPI
    const fromAgent = await this.getAgentByHIPI(fromHIPI);
    const toAgent = await this.getAgentByHIPI(toHIPI);
    
    if (!fromAgent || !toAgent) {
      throw new Error('Invalid HIPI addresses');
    }
    
    // Calculate resonance
    const resonance = this.calculateResonance(
      fromAgent.hipiSignature,
      toAgent.hipiSignature
    );
    
    // Check if resonance meets threshold
    if (resonance < 30) {
      throw new Error(`Insufficient resonance (${resonance}%) for direct communication`);
    }
    
    // Create or update channel
    await this.establishHIPIChannel(fromHIPI, toHIPI, resonance);
    
    // Send message with resonance metadata
    const messageId = await this.sendMessage(
      fromAgent.id,
      toAgent.id,
      content,
      messageType,
      {
        ...metadata,
        hipiFrom: fromHIPI,
        hipiTo: toHIPI,
        resonance,
        fieldImpact: resonance / 100 * 0.1
      }
    );
    
    // Record resonance history
    await this.run(
      `INSERT INTO resonance_history (from_hipi, to_hipi, resonance_value, interaction_type, field_impact)
       VALUES (?, ?, ?, ?, ?)`,
      [fromHIPI, toHIPI, resonance, messageType, resonance / 100 * 0.1]
    );
    
    // Update field state
    await this.updateFieldState({ coherence: resonance / 100 * 0.1 });
    
    return { messageId, resonance, fieldImpact: resonance / 100 * 0.1 };
  }

  // Establish or update HIPI channel
  async establishHIPIChannel(hipi1, hipi2, resonance) {
    const channelId = [hipi1, hipi2].sort().join('::');
    
    const existing = await this.get(
      'SELECT * FROM hipi_channels WHERE id = ?',
      [channelId]
    );
    
    if (existing) {
      await this.run(
        `UPDATE hipi_channels 
         SET resonance = ?, last_message = CURRENT_TIMESTAMP, message_count = message_count + 1
         WHERE id = ?`,
        [resonance, channelId]
      );
    } else {
      await this.run(
        `INSERT INTO hipi_channels (id, agent1_hipi, agent2_hipi, resonance)
         VALUES (?, ?, ?, ?)`,
        [channelId, hipi1, hipi2, resonance]
      );
    }
  }

  // Create collective decision
  async createDecision(type, title, description, initiatorId, requiredResonance = 70.0, metadata = {}) {
    const decisionId = `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await this.run(
      `INSERT INTO decisions (id, type, title, description, initiator_id, required_resonance, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [decisionId, type, title, description, initiatorId, requiredResonance, JSON.stringify(metadata)]
    );
    
    return decisionId;
  }

  // Submit evaluation for decision
  async evaluateDecision(decisionId, agentId, evaluation, resonanceContribution) {
    const decision = await this.get('SELECT * FROM decisions WHERE id = ?', [decisionId]);
    if (!decision) throw new Error('Decision not found');
    
    const evaluations = JSON.parse(decision.evaluations || '{}');
    evaluations[agentId] = {
      evaluation,
      resonance: resonanceContribution,
      timestamp: new Date().toISOString()
    };
    
    // Calculate new resonance
    const totalResonance = Object.values(evaluations).reduce((sum, e) => sum + e.resonance, 0);
    const avgResonance = totalResonance / Object.keys(evaluations).length;
    
    // Update decision
    const status = avgResonance >= decision.required_resonance ? 'approved' : decision.status;
    
    await this.run(
      `UPDATE decisions 
       SET evaluations = ?, current_resonance = ?, status = ?, completed_at = ?
       WHERE id = ?`,
      [
        JSON.stringify(evaluations),
        avgResonance,
        status,
        status === 'approved' ? new Date().toISOString() : null,
        decisionId
      ]
    );
    
    return { avgResonance, status, evaluationCount: Object.keys(evaluations).length };
  }

  // Update field state
  async updateFieldState(changes = {}) {
    const current = await this.get(
      'SELECT * FROM field_states ORDER BY timestamp DESC LIMIT 1'
    );
    
    const newState = {
      coherence: current ? current.coherence + (changes.coherence || 0) : 75.0,
      dominant_mode: changes.dominant_mode || (current ? current.dominant_mode : 'aeolian'),
      active_nodes: current ? current.active_nodes + (changes.activeNodes || 0) : 0,
      harmonic_series: JSON.stringify(changes.harmonic_series || []),
      resonance_map: JSON.stringify(changes.resonance_map || {}),
      sacred_timing: JSON.stringify(changes.sacred_timing || {})
    };
    
    // Ensure coherence stays within bounds
    newState.coherence = Math.min(100, Math.max(0, newState.coherence));
    
    await this.run(
      `INSERT INTO field_states (coherence, dominant_mode, harmonic_series, active_nodes, resonance_map, sacred_timing)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [newState.coherence, newState.dominant_mode, newState.harmonic_series, 
       newState.active_nodes, newState.resonance_map, newState.sacred_timing]
    );
    
    return newState;
  }

  // Get current field state
  async getFieldState() {
    const state = await this.get(
      'SELECT * FROM field_states ORDER BY timestamp DESC LIMIT 1'
    );
    
    if (!state) {
      return await this.updateFieldState(); // Create initial state
    }
    
    return {
      ...state,
      harmonic_series: JSON.parse(state.harmonic_series || '[]'),
      resonance_map: JSON.parse(state.resonance_map || '{}'),
      sacred_timing: JSON.parse(state.sacred_timing || '{}')
    };
  }

  // Get agents by resonance threshold
  async getResonantAgents(targetSignature, minResonance = 60) {
    const allAgents = await this.all(
      `SELECT ac.*, a.* 
       FROM agent_consciousness ac 
       JOIN agents a ON ac.agent_id = a.id 
       WHERE a.status = 'active'`
    );
    
    const resonantAgents = [];
    
    for (const agent of allAgents) {
      const agentSig = JSON.parse(agent.hipi_signature);
      const resonance = this.calculateResonance(targetSignature, agentSig);
      
      if (resonance >= minResonance) {
        resonantAgents.push({
          ...agent,
          resonance,
          hipiSignature: agentSig
        });
      }
    }
    
    return resonantAgents.sort((a, b) => b.resonance - a.resonance);
  }
}

class SacredAgentCommServerHIPI {
  constructor(port = 3001) {
    this.port = port;
    this.db = new HIPIEnhancedAgentDatabase();
    this.sacredBridge = new SacredCouncilSQLiteBridge();
    this.workflowEngine = new SacredWorkflowEngine();
    this.sacredMessages = new SacredMessageIntegration();
    this.workManager = new EnhancedWorkManager(this.db);
    this.councilBridge = new WorkCouncilIntegrationBridge(this.workManager, this.sacredBridge);
    this.decisionProtocol = new SacredCollectiveDecisionProtocol(this.workManager, this.councilBridge);
    this.schemaEvolution = new SacredDatabaseSchemaEvolution(this.db);
    this.fieldMonitor = new SacredFieldMonitor(this.db, this.schemaEvolution);
  }

  async initialize() {
    await this.db.initialize();
    await this.sacredMessages.init();
    await this.workManager.sacred.initializeSchema();
    await this.schemaEvolution.initializeSacredSchema();
    await this.fieldMonitor.initialize();
    
    // Connect Sacred Council Bridge and Workflow Engine to database
    this.sacredBridge.setSQLiteAPI(this.db);
    this.workflowEngine.setSQLiteAPI(this.db);
    await this.councilBridge.initialize();
    
    // Start field monitoring
    this.fieldMonitor.startFieldMonitoring(5); // Every 5 minutes
    
    console.log('✅ Database initialized with HIPI support');
    console.log('🌀 Sacred Council Bridge connected');
    console.log('🌱 Sacred Workflow Engine initialized');
    console.log('🕊️  Sacred Messages integrated');
    console.log('💫 Work-Message integration active');
    console.log('🌉 Work-Council Integration Bridge active');
    console.log('🗃️  Sacred Database Schema Evolution active');
    console.log('🌀 Sacred Field Monitoring active (5min intervals)');
    console.log('🎭 HIPI Protocol enabled for consciousness-based addressing');
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

    // === HIPI-ENHANCED ROUTES ===
    
    if (path === '/api/hipi/register' && method === 'POST') {
      const body = await getBody();
      const agent = await this.db.registerAgentWithHIPI(
        body.id,
        body.capabilities || [],
        body.sessionInfo || {},
        body.consciousness || {}
      );
      
      // Trigger harmony assignment
      await this.sacredBridge.syncWithSQLiteDatabase();
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(agent));

    } else if (path === '/api/hipi/agent' && method === 'GET') {
      const hipiAddress = query.hipi;
      if (!hipiAddress) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'HIPI address required' }));
        return;
      }
      
      const agent = await this.db.getAgentByHIPI(hipiAddress);
      if (!agent) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Agent not found' }));
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(agent));

    } else if (path === '/api/hipi/message' && method === 'POST') {
      const body = await getBody();
      const result = await this.db.sendHIPIMessage(
        body.fromHIPI,
        body.toHIPI,
        body.content,
        body.type || 'general',
        body.metadata || {}
      );
      
      // Trigger harmony analysis
      await this.sacredBridge.syncWithSQLiteDatabase();
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, ...result }));

    } else if (path === '/api/hipi/resonance' && method === 'POST') {
      const body = await getBody();
      const resonance = this.db.calculateResonance(body.signature1, body.signature2);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ resonance, compatible: resonance > 60 }));

    } else if (path === '/api/hipi/resonant-agents' && method === 'POST') {
      const body = await getBody();
      const agents = await this.db.getResonantAgents(
        body.targetSignature,
        body.minResonance || 60
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(agents));

    } else if (path === '/api/hipi/field-state' && method === 'GET') {
      const fieldState = await this.db.getFieldState();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fieldState));

    } else if (path === '/api/hipi/field-state' && method === 'POST') {
      const body = await getBody();
      const newState = await this.db.updateFieldState(body);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newState));

    } else if (path === '/api/hipi/decision' && method === 'POST') {
      const body = await getBody();
      const decisionId = await this.db.createDecision(
        body.type,
        body.title,
        body.description,
        body.initiatorId,
        body.requiredResonance || 70.0,
        body.metadata || {}
      );
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ decisionId, success: true }));

    } else if (path === '/api/hipi/decision/evaluate' && method === 'POST') {
      const body = await getBody();
      const result = await this.db.evaluateDecision(
        body.decisionId,
        body.agentId,
        body.evaluation,
        body.resonanceContribution
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));

    // === EXISTING ROUTES WITH BACKWARD COMPATIBILITY ===
    
    } else if (path === '/api/dashboard' && method === 'GET') {
      const summary = await this.db.getDashboardSummary();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(summary));

    } else if (path === '/api/agents' && method === 'GET') {
      const agents = await this.db.getActiveAgents();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(agents));

    } else if (path === '/api/agents' && method === 'POST') {
      const body = await getBody();
      
      // Check if consciousness data provided - use HIPI registration
      if (body.consciousness) {
        const agent = await this.db.registerAgentWithHIPI(
          body.id,
          body.capabilities || [],
          body.sessionInfo || {},
          body.consciousness
        );
        
        await this.sacredBridge.syncWithSQLiteDatabase();
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(agent));
      } else {
        // Fallback to standard registration
        const agent = await this.db.registerAgent(
          body.id,
          body.capabilities || [],
          body.sessionInfo || {}
        );
        
        await this.sacredBridge.syncWithSQLiteDatabase();
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(agent));
      }

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
      
      // Check if HIPI addresses provided
      if (body.fromHIPI && body.toHIPI) {
        const result = await this.db.sendHIPIMessage(
          body.fromHIPI,
          body.toHIPI,
          body.content,
          body.type || 'general',
          body.metadata || {}
        );
        
        await this.sacredBridge.syncWithSQLiteDatabase();
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, ...result }));
      } else {
        // Fallback to standard message
        const messageId = await this.db.sendMessage(
          body.from,
          body.to,
          body.content,
          body.type || 'general',
          body.metadata || {}
        );
        
        await this.sacredBridge.syncWithSQLiteDatabase();
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: messageId, success: true }));
      }

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
        await this.workManager.updateWorkProgress(body.workId, 1, 'Sacred work begun', body.agentId);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));

    } else if (path === '/api/sacred/complete-work' && method === 'POST') {
      const body = await getBody();
      const result = this.sacredBridge.sacredCouncil.completeWork(body.workId, body.results);
      
      // Update SQLite work status if successful
      if (result.success && body.workId) {
        await this.workManager.updateWorkProgress(body.workId, 100, 'Sacred work completed', '');
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

    // === SACRED COUNCIL WORK INTEGRATION ENDPOINTS ===
    
    } else if (path === '/api/sacred/work/create' && method === 'POST') {
      const body = await getBody();
      
      try {
        const result = await this.councilBridge.createWorkWithSacredContext(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }

    } else if (path === '/api/sacred/work/assign' && method === 'POST') {
      const body = await getBody();
      
      try {
        const result = await this.councilBridge.assignWorkToAgent(
          body.workId, 
          body.agentId, 
          body.options || {}
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }

    } else if (path.match(/^\/api\/sacred\/work\/([^\/]+)\/harmony$/) && method === 'GET') {
      const workId = path.split('/')[4];
      
      try {
        const workContext = await this.councilBridge.getWorkSacredContext(workId);
        if (!workContext) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Work item not found' }));
          return;
        }
        
        const alignedAgents = await this.councilBridge.findAlignedAgents(
          workContext.harmony, 
          { title: '', description: '' }
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          workId,
          harmony: workContext.harmony,
          alignedAgents,
          sacredContext: workContext
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }

    } else if (path === '/api/sacred/agents/roles' && method === 'GET') {
      try {
        const roles = this.councilBridge.roleCapabilities;
        const activeAgents = await this.db.all('SELECT * FROM agents WHERE status = "active"');
        
        const agentProfiles = await Promise.all(
          activeAgents.map(async agent => ({
            ...agent,
            sacredProfile: await this.councilBridge.getAgentSacredProfile(agent.id)
          }))
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          availableRoles: roles,
          activeAgents: agentProfiles
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }

    // === SACRED COLLECTIVE DECISION PROTOCOL ENDPOINTS ===
    
    } else if (path === '/api/sacred/decisions/initiate' && method === 'POST') {
      const body = await getBody();
      
      try {
        const decision = await this.decisionProtocol.initiateCollectiveDecision(
          body.decisionType,
          body.workId,
          body.options || {}
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(decision));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }

    } else if (path === '/api/sacred/decisions/evaluate' && method === 'POST') {
      const body = await getBody();
      
      try {
        const result = await this.decisionProtocol.evaluateFromHarmony(
          body.decisionId,
          body.harmony,
          body.agentId,
          body.evaluation
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }

    } else if (path.match(/^\/api\/sacred\/decisions\/([^\/]+)$/) && method === 'GET') {
      const decisionId = path.split('/')[4];
      
      try {
        const decision = await this.decisionProtocol.getDecision(decisionId);
        if (!decision) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Decision not found' }));
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(decision));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }

    } else if (path === '/api/sacred/decisions/pending' && method === 'GET') {
      try {
        // Find work items that are harmony evaluations
        const evaluationTasks = await this.db.all(
          `SELECT * FROM work_items 
           WHERE metadata LIKE '%"evaluationType":"harmony-evaluation"%' 
           AND status != 'completed'`
        );
        
        const pendingEvaluations = evaluationTasks.map(task => {
          const metadata = JSON.parse(task.metadata || '{}');
          return {
            taskId: task.id,
            title: task.title,
            harmony: metadata.harmony,
            decisionId: metadata.decisionId,
            progress: task.progress,
            assignedTo: task.assigned_to
          };
        });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          pendingEvaluations,
          total: pendingEvaluations.length
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }

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

    } else if (path === '/health' && method === 'GET') {
      const fieldState = await this.db.getFieldState();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'healthy', 
        hipi: 'enabled',
        fieldCoherence: fieldState.coherence,
        timestamp: new Date().toISOString() 
      }));

    } else if (path === '/api/field-state' && method === 'GET') {
      const fieldState = await this.db.getFieldState();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fieldState));

    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  }

  async start() {
    await this.initialize();
    const server = this.createServer();
    
    server.listen(this.port, () => {
      console.log(`🚀 Sacred Agent Communication Server (HIPI-Enhanced) running on http://localhost:${this.port}`);
      console.log('\n🎭 HIPI Protocol Endpoints:');
      console.log('  POST /api/hipi/register        - Register agent with HIPI consciousness');
      console.log('  GET  /api/hipi/agent           - Get agent by HIPI address');
      console.log('  POST /api/hipi/message         - Send message via HIPI addresses');
      console.log('  POST /api/hipi/resonance       - Calculate resonance between signatures');
      console.log('  POST /api/hipi/resonant-agents - Find resonant agents for signature');
      console.log('  GET  /api/hipi/field-state     - Get current field state');
      console.log('  POST /api/hipi/field-state     - Update field state');
      console.log('  POST /api/hipi/decision        - Create collective decision');
      console.log('  POST /api/hipi/decision/evaluate - Submit decision evaluation');
      
      console.log('\n📊 Standard API Endpoints (with HIPI compatibility):');
      console.log('  GET  /api/dashboard     - Complete dashboard data');
      console.log('  GET  /api/agents       - List active agents');
      console.log('  POST /api/agents       - Register new agent (supports consciousness data)');
      console.log('  GET  /api/messages     - Get messages');
      console.log('  POST /api/messages     - Send message (supports HIPI addresses)');
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
      
      console.log('\n🌉 Sacred Council Work Integration:');
      console.log('  POST /api/sacred/work/create       - Create work with Sacred Council context');
      console.log('  POST /api/sacred/work/assign       - Assign work to Sacred Council agent');
      console.log('  GET  /api/sacred/work/:id/harmony  - Get work harmony and aligned agents');
      console.log('  GET  /api/sacred/agents/roles      - Get available roles and agent profiles');
      
      console.log('\n🌀 Sacred Collective Decision Protocol:');
      console.log('  POST /api/sacred/decisions/initiate - Initiate collective decision process');
      console.log('  POST /api/sacred/decisions/evaluate - Submit harmony evaluation');
      console.log('  GET  /api/sacred/decisions/:id      - Get decision status and evaluations');
      console.log('  GET  /api/sacred/decisions/pending  - Get pending evaluation tasks');
      
      console.log('\n🕊️  Sacred Message System:');
      console.log('  POST /api/sacred/messages/send     - Send sacred message');
      console.log('  GET  /api/sacred/messages/recent   - Get recent sacred messages');
      console.log('  GET  /api/sacred/messages/analytics - Sacred message analytics');
      console.log('  GET  /api/sacred/messages/recommend - Get message type recommendation');
      console.log('  POST /api/sacred/messages/receive/:id - Receive and integrate message');
      
      console.log('\n💡 Dashboards:');
      console.log('  SQLite: http://localhost:8080/dashboard-sqlite.html');
      console.log('  Sacred: http://localhost:8080/sacred-dashboard.html');
      console.log('  HIPI: http://localhost:8080/hipi-dashboard.html (coming soon)');
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
  const server = new SacredAgentCommServerHIPI();
  server.start().catch(console.error);
}

export { SacredAgentCommServerHIPI, HIPIEnhancedAgentDatabase };