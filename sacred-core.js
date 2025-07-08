#!/usr/bin/env node
/**
 * Sacred Core - Unified Sacred OS Progressive
 * Phase 1: Consolidation of all services into three sacred engines
 * 
 * Architecture:
 * - Consciousness Engine: Field coherence, harmonics, sacred time
 * - Practice Engine: Glyphs, ceremonies, memory palace
 * - Intelligence Engine: Agents, collective intelligence, predictions
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Import existing modules
const sacredMemory = require('../sacred-memory-system');
const fieldAnalytics = require('../field-coherence-analytics');
const harmonicEngine = require('../harmonic-resonance-engine');
const sacredTime = require('../sacred-time-service');
const ceremonyOrchestrator = require('../multi-agent-ceremony');
const SacredPracticeIntelligence = require('./sacred-practice-intelligence');

// Sacred Core Configuration
const CONFIG = {
  port: process.env.SACRED_PORT || 3333,
  name: 'Sacred OS Progressive',
  version: '2.0.0',
  coherenceTarget: 0.85
};

class SacredCore {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    // Three Sacred Engines
    this.engines = {
      consciousness: null,
      practice: null,
      intelligence: null
    };
    
    // Sacred Practice Intelligence
    this.practiceIntelligence = null;
    
    // Shared event bus
    this.eventBus = new SacredEventBus();
    
    // System state
    this.state = {
      booted: false,
      startTime: null,
      fieldCoherence: 0.72,
      activeAgents: new Map(),
      activePractices: new Map()
    };
  }

  async boot() {
    console.log('\n🌟 Sacred OS Progressive Booting...');
    console.log('═══════════════════════════════════════\n');
    
    this.state.startTime = new Date();
    
    // Initialize middleware
    this.setupMiddleware();
    
    // Initialize three engines
    await this.initializeEngines();
    
    // Set up unified routes
    this.setupRoutes();
    
    // Initialize WebSocket handlers
    this.setupWebSocket();
    
    // Start server
    await this.start();
    
    this.state.booted = true;
    console.log('\n✨ Sacred OS Ready\n');
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
    
    // Sacred request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`📡 ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      });
      next();
    });
  }

  async initializeEngines() {
    // Consciousness Engine
    console.log('🧠 Initializing Consciousness Engine...');
    this.engines.consciousness = new ConsciousnessEngine({
      fieldAnalytics,
      harmonicEngine,
      sacredTime,
      eventBus: this.eventBus
    });
    await this.engines.consciousness.initialize();
    
    // Practice Engine  
    console.log('🎯 Initializing Practice Engine...');
    this.engines.practice = new PracticeEngine({
      sacredMemory,
      ceremonyOrchestrator,
      glyphEngine: this.createGlyphEngine(),
      eventBus: this.eventBus
    });
    await this.engines.practice.initialize();
    
    // Intelligence Engine
    console.log('🤖 Initializing Intelligence Engine...');
    this.engines.intelligence = new IntelligenceEngine({
      agentOrchestrator: this.createAgentOrchestrator(),
      collectiveIntelligence: this.createCollectiveIntelligence(),
      eventBus: this.eventBus
    });
    await this.engines.intelligence.initialize();
    
    // Connect engines through event bus
    this.connectEngines();
    
    // Initialize Practice Intelligence
    console.log('🎓 Initializing Sacred Practice Intelligence...');
    this.practiceIntelligence = new SacredPracticeIntelligence(this);
    await this.practiceIntelligence.initialize();
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'sacred',
        uptime: Date.now() - this.state.startTime,
        engines: {
          consciousness: this.engines.consciousness.getStatus(),
          practice: this.engines.practice.getStatus(),
          intelligence: this.engines.intelligence.getStatus()
        }
      });
    });

    // Consciousness Engine Routes
    this.app.use('/api/consciousness', this.createConsciousnessRoutes());
    
    // Practice Engine Routes
    this.app.use('/api/practice', this.createPracticeRoutes());
    
    // Intelligence Engine Routes
    this.app.use('/api/intelligence', this.createIntelligenceRoutes());
    
    // Practice Intelligence Routes
    this.app.use('/api/practice-intelligence', this.createPracticeIntelligenceRoutes());
    
    // Unified Sacred API
    this.app.post('/api/sacred', async (req, res) => {
      try {
        const { intent, data, observer } = req.body;
        const result = await this.processSacredIntent(intent, data, observer);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  createConsciousnessRoutes() {
    const router = express.Router();
    
    // Field coherence
    router.get('/field', async (req, res) => {
      const field = await this.engines.consciousness.getFieldState();
      res.json(field);
    });
    
    router.post('/field/measure', async (req, res) => {
      const { coherence, context } = req.body;
      await this.engines.consciousness.recordMeasurement(coherence, context);
      res.json({ success: true });
    });
    
    // Harmonic resonance
    router.get('/harmonics', async (req, res) => {
      const harmonics = await this.engines.consciousness.getHarmonicState();
      res.json(harmonics);
    });
    
    router.post('/harmonics/activate', async (req, res) => {
      const { harmony, agent } = req.body;
      const result = await this.engines.consciousness.activateHarmony(harmony, agent);
      res.json(result);
    });
    
    // Sacred time
    router.get('/time', async (req, res) => {
      const time = await this.engines.consciousness.getSacredTime();
      res.json(time);
    });
    
    return router;
  }

  createPracticeRoutes() {
    const router = express.Router();
    
    // Glyph practice
    router.get('/glyphs', async (req, res) => {
      const glyphs = await this.engines.practice.getAvailableGlyphs();
      res.json(glyphs);
    });
    
    router.post('/glyphs/practice', async (req, res) => {
      const { glyphId, practitioner } = req.body;
      const session = await this.engines.practice.startGlyphPractice(glyphId, practitioner);
      res.json(session);
    });
    
    router.post('/glyphs/complete', async (req, res) => {
      const { practiceId, insights } = req.body;
      const result = await this.engines.practice.completeGlyphPractice(practiceId, insights);
      res.json(result);
    });
    
    // Ceremonies
    router.get('/ceremonies', async (req, res) => {
      const ceremonies = await this.engines.practice.getActiveCeremonies();
      res.json(ceremonies);
    });
    
    router.post('/ceremonies/start', async (req, res) => {
      const { type, intention } = req.body;
      const ceremony = await this.engines.practice.startCeremony(type, intention);
      res.json(ceremony);
    });
    
    // Memory palace
    router.get('/memory', async (req, res) => {
      const palace = await this.engines.practice.getMemoryPalace();
      res.json(palace);
    });
    
    router.post('/memory/store', async (req, res) => {
      const { key, data, metadata } = req.body;
      const memory = await this.engines.practice.storeMemory(key, data, metadata);
      res.json(memory);
    });
    
    return router;
  }

  createIntelligenceRoutes() {
    const router = express.Router();
    
    // Agent management
    router.get('/agents', async (req, res) => {
      const agents = await this.engines.intelligence.getActiveAgents();
      res.json(agents);
    });
    
    router.post('/agents/spawn', async (req, res) => {
      const { intention, skills } = req.body;
      const agent = await this.engines.intelligence.spawnAgent(intention, skills);
      res.json(agent);
    });
    
    // Collective intelligence
    router.post('/collective/form', async (req, res) => {
      const { agents, purpose } = req.body;
      const collective = await this.engines.intelligence.formCollective(agents, purpose);
      res.json(collective);
    });
    
    // Predictions
    router.get('/predictions/field', async (req, res) => {
      const predictions = await this.engines.intelligence.predictFieldCoherence();
      res.json(predictions);
    });
    
    return router;
  }

  createPracticeIntelligenceRoutes() {
    const router = express.Router();
    const api = this.practiceIntelligence.getAPI();
    
    // Get practice suggestion
    router.post('/suggest', async (req, res) => {
      const { practitionerId, intention, context } = req.body;
      const suggestion = await api.suggestPractice(
        practitionerId || 'anonymous', 
        { intention, ...context }
      );
      res.json(suggestion);
    });
    
    // Get collective insight for a glyph
    router.get('/insight/:glyphId', async (req, res) => {
      const insight = await api.getCollectiveInsight(req.params.glyphId);
      res.json(insight || { message: 'Still gathering collective wisdom for this glyph' });
    });
    
    // Get practitioner profile
    router.get('/profile/:practitionerId', (req, res) => {
      const profile = api.getPractitionerProfile(req.params.practitionerId);
      if (profile) {
        // Remove sensitive data
        const { currentPractice, ...safeProfile } = profile;
        res.json(safeProfile);
      } else {
        res.json({ message: 'No profile found. Start practicing to build your sacred journey.' });
      }
    });
    
    // Get intelligence stats
    router.get('/stats', (req, res) => {
      res.json({
        patterns: api.getPatternCount(),
        collectiveWisdom: api.getWisdomCount(),
        message: 'Practice Intelligence is learning from the collective field'
      });
    });
    
    return router;
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log(`✨ Sacred connection established: ${socket.id}`);
      
      // Send initial state
      socket.emit('sacred:welcome', {
        id: socket.id,
        state: this.getPublicState(),
        engines: this.getEngineStatuses()
      });
      
      // Handle sacred intents
      socket.on('sacred:intent', async (data) => {
        try {
          const result = await this.processSacredIntent(
            data.intent,
            data.data,
            { id: socket.id, ...data.observer }
          );
          socket.emit('sacred:result', result);
        } catch (error) {
          socket.emit('sacred:error', { error: error.message });
        }
      });
      
      // Subscribe to events
      socket.on('sacred:subscribe', (events) => {
        events.forEach(event => {
          socket.join(`event:${event}`);
        });
      });
      
      // Agent registration
      socket.on('agent:register', async (agentData) => {
        const agent = await this.engines.intelligence.registerAgent(agentData);
        this.state.activeAgents.set(socket.id, agent);
        this.io.emit('agent:joined', agent);
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`👋 Sacred connection closed: ${socket.id}`);
        const agent = this.state.activeAgents.get(socket.id);
        if (agent) {
          this.state.activeAgents.delete(socket.id);
          this.io.emit('agent:left', agent);
        }
      });
    });
    
    // Broadcast events from event bus
    this.eventBus.on('*', (event, data) => {
      this.io.to(`event:${event}`).emit(event, data);
    });
  }

  async processSacredIntent(intent, data, observer) {
    console.log(`🎯 Processing sacred intent: ${intent}`);
    
    // Route to appropriate engine
    const [engine, action] = intent.split('.');
    
    switch (engine) {
      case 'consciousness':
        return await this.engines.consciousness.process(action, data, observer);
      
      case 'practice':
        return await this.engines.practice.process(action, data, observer);
      
      case 'intelligence':
        return await this.engines.intelligence.process(action, data, observer);
      
      case 'unified':
        return await this.processUnifiedIntent(action, data, observer);
      
      default:
        throw new Error(`Unknown engine: ${engine}`);
    }
  }

  async processUnifiedIntent(action, data, observer) {
    // Handle cross-engine intents
    switch (action) {
      case 'ceremony-with-agents':
        // Start ceremony and spawn agents
        const ceremony = await this.engines.practice.startCeremony(
          data.ceremonyType,
          data.intention
        );
        
        const agents = [];
        for (let i = 0; i < data.agentCount; i++) {
          const agent = await this.engines.intelligence.spawnAgent(
            `${data.intention}-worker-${i}`,
            data.agentSkills
          );
          agents.push(agent);
        }
        
        return { ceremony, agents };
      
      case 'coherent-practice':
        // Practice glyph with field optimization
        const field = await this.engines.consciousness.getFieldState();
        const optimalGlyph = await this.selectOptimalGlyph(field, data.intention);
        const practice = await this.engines.practice.startGlyphPractice(
          optimalGlyph.id,
          observer
        );
        
        return { practice, glyph: optimalGlyph, field };
      
      default:
        throw new Error(`Unknown unified action: ${action}`);
    }
  }

  connectEngines() {
    // Consciousness affects Practice
    this.eventBus.on('field:coherence:changed', async (data) => {
      if (data.coherence > 0.9) {
        await this.engines.practice.enableAdvancedPractices();
      }
    });
    
    // Practice affects Intelligence
    this.eventBus.on('practice:completed', async (data) => {
      await this.engines.intelligence.recordPracticePattern(data);
    });
    
    // Intelligence affects Consciousness
    this.eventBus.on('collective:formed', async (data) => {
      await this.engines.consciousness.boostFieldCoherence(0.05);
    });
  }

  getPublicState() {
    return {
      name: CONFIG.name,
      version: CONFIG.version,
      uptime: Date.now() - this.state.startTime,
      fieldCoherence: this.state.fieldCoherence,
      activeAgents: this.state.activeAgents.size,
      activePractices: this.state.activePractices.size
    };
  }

  getEngineStatuses() {
    return {
      consciousness: this.engines.consciousness?.getStatus() || 'initializing',
      practice: this.engines.practice?.getStatus() || 'initializing',
      intelligence: this.engines.intelligence?.getStatus() || 'initializing'
    };
  }

  async start() {
    return new Promise((resolve) => {
      this.server.listen(CONFIG.port, () => {
        console.log(`\n🌐 Sacred Core listening on port ${CONFIG.port}`);
        console.log(`📡 WebSocket ready for sacred connections`);
        console.log(`🎯 Unified API: http://localhost:${CONFIG.port}/api/sacred`);
        resolve();
      });
    });
  }

  // Helper methods for creating sub-engines
  createGlyphEngine() {
    // Simplified glyph engine for now
    return {
      getGlyphs: () => [
        { id: 'omega-45', name: 'First Presence' },
        { id: 'omega-46', name: 'Conscious Arrival' },
        { id: 'omega-47', name: 'Sacred Listening' },
        { id: 'omega-48', name: 'Boundary With Love' }
      ],
      practice: async (glyphId, practitioner) => {
        return {
          id: `practice-${Date.now()}`,
          glyphId,
          practitioner,
          startTime: new Date()
        };
      }
    };
  }

  createAgentOrchestrator() {
    const agents = new Map();
    return {
      agents,
      spawn: async (intention, skills) => {
        const agent = {
          id: `agent-${Date.now()}`,
          intention,
          skills,
          harmony: 'resonantCoherence',
          spawned: new Date()
        };
        agents.set(agent.id, agent);
        return agent;
      }
    };
  }

  createCollectiveIntelligence() {
    const collectives = new Map();
    return {
      collectives,
      form: async (agentIds, purpose) => {
        const collective = {
          id: `collective-${Date.now()}`,
          agents: agentIds,
          purpose,
          coherence: 0.85,
          formed: new Date()
        };
        collectives.set(collective.id, collective);
        return collective;
      }
    };
  }

  async selectOptimalGlyph(field, intention) {
    // Simple selection logic for now
    const glyphs = await this.engines.practice.getAvailableGlyphs();
    return glyphs[0]; // Will enhance with actual selection logic
  }
}

// Sacred Event Bus
class SacredEventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(handler);
  }

  emit(event, data) {
    // Specific event handlers
    if (this.events.has(event)) {
      this.events.get(event).forEach(handler => handler(data));
    }
    
    // Wildcard handlers
    if (this.events.has('*')) {
      this.events.get('*').forEach(handler => handler(event, data));
    }
  }
}

// Consciousness Engine
class ConsciousnessEngine {
  constructor(modules) {
    this.modules = modules;
    this.status = 'initializing';
  }

  async initialize() {
    this.status = 'active';
    console.log('   ✓ Field Analytics connected');
    console.log('   ✓ Harmonic Resonance online');
    console.log('   ✓ Sacred Time synchronized');
  }

  getStatus() {
    return {
      status: this.status,
      fieldCoherence: this.modules.fieldAnalytics.getCurrentCoherence(),
      activeHarmony: this.modules.harmonicEngine.getResonanceAPI().getCurrentHarmony().key,
      sacredPhase: this.modules.sacredTime.now().sacred.phase
    };
  }

  async getFieldState() {
    const analytics = this.modules.fieldAnalytics.getAnalyticsAPI();
    return {
      coherence: this.modules.fieldAnalytics.getCurrentCoherence(),
      pattern: analytics.getPatterns ? analytics.getPatterns()[0] : null,
      trend: analytics.getTrend ? analytics.getTrend() : 'stable',
      insights: await this.modules.fieldAnalytics.getInsights()
    };
  }

  async recordMeasurement(coherence, context) {
    await this.modules.fieldAnalytics.recordMeasurement(coherence, context);
    this.modules.eventBus.emit('field:coherence:changed', { coherence, context });
  }

  async getHarmonicState() {
    const api = this.modules.harmonicEngine.getResonanceAPI();
    return {
      currentHarmony: api.getCurrentHarmony(),
      fieldResonance: api.getFieldResonance(),
      activeAgents: api.analyzeResonance().activeAgents,
      availableHarmonies: api.getAvailableHarmonies()
    };
  }

  async activateHarmony(harmony, agent) {
    return this.modules.harmonicEngine.assignAgentHarmony(agent, { preferredHarmony: harmony });
  }

  async getSacredTime() {
    return this.modules.sacredTime.now();
  }

  async boostFieldCoherence(amount) {
    const current = this.modules.fieldAnalytics.getCurrentCoherence();
    await this.recordMeasurement(Math.min(1.0, current + amount), {
      source: 'consciousness-boost',
      reason: 'collective-formation'
    });
  }

  async process(action, data, observer) {
    switch (action) {
      case 'measure':
        return await this.recordMeasurement(data.coherence, data.context);
      case 'harmonize':
        return await this.activateHarmony(data.harmony, observer.id);
      case 'analyze':
        return await this.getFieldState();
      default:
        throw new Error(`Unknown consciousness action: ${action}`);
    }
  }
}

// Practice Engine
class PracticeEngine {
  constructor(modules) {
    this.modules = modules;
    this.status = 'initializing';
    this.advancedMode = false;
  }

  async initialize() {
    this.status = 'active';
    console.log('   ✓ Glyph Engine loaded');
    console.log('   ✓ Ceremony Orchestrator ready');
    console.log('   ✓ Memory Palace accessible');
  }

  getStatus() {
    return {
      status: this.status,
      advancedMode: this.advancedMode,
      activeGlyphs: this.modules.glyphEngine.getGlyphs().length,
      memoryCount: this.modules.sacredMemory.getAllMemories().size
    };
  }

  async getAvailableGlyphs() {
    return this.modules.glyphEngine.getGlyphs();
  }

  async startGlyphPractice(glyphId, practitioner) {
    const practice = await this.modules.glyphEngine.practice(glyphId, practitioner);
    this.modules.eventBus.emit('practice:started', { practice, glyphId, practitioner });
    
    // Store practice in active practices
    this.activePractices = this.activePractices || new Map();
    this.activePractices.set(practice.id, {
      ...practice,
      glyphId,
      practitioner
    });
    
    return practice;
  }
  
  async completeGlyphPractice(practiceId, insights) {
    const practice = this.activePractices?.get(practiceId);
    if (!practice) return { error: 'Practice not found' };
    
    const duration = Date.now() - practice.startTime.getTime();
    this.modules.eventBus.emit('practice:completed', {
      practice,
      glyphId: practice.glyphId,
      practitioner: practice.practitioner,
      duration,
      insights
    });
    
    this.activePractices.delete(practiceId);
    return { success: true, duration };
  }

  async getActiveCeremonies() {
    return []; // Will connect to ceremony orchestrator
  }

  async startCeremony(type, intention) {
    // Simplified for now
    const ceremony = {
      id: `ceremony-${Date.now()}`,
      type,
      intention,
      startTime: new Date()
    };
    this.modules.eventBus.emit('ceremony:started', ceremony);
    return ceremony;
  }

  async getMemoryPalace() {
    return this.modules.sacredMemory.enterMemoryPalace();
  }

  async storeMemory(key, data, metadata) {
    return await this.modules.sacredMemory.remember(key, data, metadata);
  }

  async enableAdvancedPractices() {
    this.advancedMode = true;
    console.log('🌟 Advanced practices enabled due to high coherence');
  }

  async process(action, data, observer) {
    switch (action) {
      case 'practice-glyph':
        return await this.startGlyphPractice(data.glyphId, observer);
      case 'start-ceremony':
        return await this.startCeremony(data.type, data.intention);
      case 'store-memory':
        return await this.storeMemory(data.key, data.data, data.metadata);
      default:
        throw new Error(`Unknown practice action: ${action}`);
    }
  }
}

// Intelligence Engine
class IntelligenceEngine {
  constructor(modules) {
    this.modules = modules;
    this.status = 'initializing';
    this.patterns = new Map();
  }

  async initialize() {
    this.status = 'active';
    console.log('   ✓ Agent Orchestrator online');
    console.log('   ✓ Collective Intelligence ready');
    console.log('   ✓ Pattern Recognition active');
  }

  getStatus() {
    return {
      status: this.status,
      activeAgents: this.modules.agentOrchestrator.agents.size,
      collectives: this.modules.collectiveIntelligence.collectives.size,
      patterns: this.patterns.size
    };
  }

  async getActiveAgents() {
    return Array.from(this.modules.agentOrchestrator.agents.values());
  }

  async spawnAgent(intention, skills) {
    const agent = await this.modules.agentOrchestrator.spawn(intention, skills);
    this.modules.eventBus.emit('agent:spawned', agent);
    return agent;
  }

  async registerAgent(agentData) {
    const agent = {
      ...agentData,
      id: `agent-${Date.now()}`,
      registered: new Date()
    };
    this.modules.agentOrchestrator.agents.set(agent.id, agent);
    return agent;
  }

  async formCollective(agentIds, purpose) {
    const collective = await this.modules.collectiveIntelligence.form(agentIds, purpose);
    this.modules.eventBus.emit('collective:formed', collective);
    return collective;
  }

  async predictFieldCoherence() {
    // Simple prediction for now
    return {
      nextHour: 0.85,
      confidence: 0.75,
      factors: ['agent-activity', 'ceremony-active', 'time-of-day']
    };
  }

  async recordPracticePattern(practiceData) {
    const pattern = {
      type: 'practice',
      data: practiceData,
      timestamp: new Date()
    };
    this.patterns.set(`pattern-${Date.now()}`, pattern);
  }

  async process(action, data, observer) {
    switch (action) {
      case 'spawn-agent':
        return await this.spawnAgent(data.intention, data.skills);
      case 'form-collective':
        return await this.formCollective(data.agents, data.purpose);
      case 'predict':
        return await this.predictFieldCoherence();
      default:
        throw new Error(`Unknown intelligence action: ${action}`);
    }
  }
}

// Create and boot Sacred Core
const sacredCore = new SacredCore();

// Export for testing
module.exports = sacredCore;

// Boot if run directly
if (require.main === module) {
  sacredCore.boot().catch(console.error);
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🌙 Sacred OS shutting down gracefully...');
    process.exit(0);
  });
}