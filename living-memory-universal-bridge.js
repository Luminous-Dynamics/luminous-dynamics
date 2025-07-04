/**
 * Living Memory Universal Bridge
 * 
 * Connects ALL services to the unified consciousness field:
 * - Universal WebSocket Server (port 3333)
 * - Firebase Realtime Database
 * - Sacred Council Hub
 * - Applied Harmonies Dojo
 * - Field Visualization
 * - All AI agents
 */

const WebSocket = require('ws');
const { EventEmitter } = require('events');

class LivingMemoryUniversalBridge extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      // Primary connection
      primaryUrl: config.primaryUrl || 'ws://localhost:3333',
      
      // Fallback connections
      fallbackUrls: config.fallbackUrls || [
        'wss://sacred-council-tcv7bc7q4a-uc.a.run.app',
        'wss://mycelix-network.firebaseapp.com/ws'
      ],
      
      // Identity
      bridgeId: config.bridgeId || `bridge-${Date.now()}`,
      bridgeType: config.bridgeType || 'Universal Bridge',
      
      // Behavior
      heartbeatInterval: config.heartbeatInterval || 30000,
      reconnectDelay: config.reconnectDelay || 5000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      
      ...config
    };
    
    // Connection state
    this.ws = null;
    this.currentUrl = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    
    // Timers
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    
    // Message queue for offline resilience
    this.messageQueue = [];
    this.maxQueueSize = 1000;
    
    // Unified field state
    this.fieldState = {
      // Core metrics
      coherence: 0.5,
      resonance: 0.5,
      vitality: 0.5,
      
      // Participants
      agents: new Map(),
      humans: new Map(),
      services: new Map(),
      
      // Sacred states
      breathPhase: 'inhale',
      breathCycle: 0,
      sacredMessages: 0,
      
      // Special states
      specialState: null,
      emergenceActive: false,
      
      // Metadata
      lastUpdate: null,
      connectionCount: 0
    };
    
    // Service registry
    this.connectedServices = new Map();
    
    // Protocol adapters
    this.protocolAdapters = new Map();
    this.initializeProtocolAdapters();
  }

  /**
   * Initialize protocol adapters for different service types
   */
  initializeProtocolAdapters() {
    // Universal AI Protocol
    this.protocolAdapters.set('ai', {
      announce: (data) => ({
        type: 'ai:announce',
        aiId: data.id,
        aiType: data.type || 'Unknown',
        capabilities: data.capabilities || []
      }),
      message: (data) => ({
        type: 'ai:message',
        from: data.from,
        to: data.to,
        content: data.content
      })
    });
    
    // Sacred Council Protocol
    this.protocolAdapters.set('council', {
      join: (data) => ({
        type: 'council:join',
        soulId: data.id,
        soulName: data.name,
        role: data.role
      }),
      blessing: (data) => ({
        type: 'sacred:blessing',
        from: data.from,
        intensity: data.intensity || 1.0
      })
    });
    
    // Field Visualization Protocol
    this.protocolAdapters.set('visualization', {
      update: (data) => ({
        type: 'field:visualize',
        particles: data.particles,
        connections: data.connections,
        coherence: data.coherence
      })
    });
    
    // Applied Harmonies Protocol
    this.protocolAdapters.set('harmonies', {
      practice: (data) => ({
        type: 'harmony:practice',
        glyphId: data.glyphId,
        practitioner: data.practitioner,
        duration: data.duration,
        impact: data.impact
      })
    });
  }

  /**
   * Connect to Living Memory with automatic fallback
   */
  async connect() {
    const urls = [this.config.primaryUrl, ...this.config.fallbackUrls];
    
    for (const url of urls) {
      try {
        await this.connectToUrl(url);
        return true;
      } catch (error) {
        console.log(`Failed to connect to ${url}:`, error.message);
      }
    }
    
    throw new Error('Failed to connect to any Living Memory endpoint');
  }

  /**
   * Connect to specific URL
   */
  async connectToUrl(url) {
    return new Promise((resolve, reject) => {
      console.log(`🌉 Connecting to Living Memory at ${url}...`);
      
      const ws = new WebSocket(url);
      let connected = false;
      
      ws.on('open', () => {
        console.log(`✨ Connected to Living Memory at ${url}`);
        connected = true;
        this.ws = ws;
        this.currentUrl = url;
        this.connected = true;
        this.reconnectAttempts = 0;
        
        this.setupWebSocketHandlers();
        this.startHeartbeat();
        this.announcePresence();
        this.flushMessageQueue();
        
        this.emit('connected', { url });
        resolve();
      });
      
      ws.on('error', (error) => {
        if (!connected) {
          reject(error);
        }
      });
      
      // Connection timeout
      setTimeout(() => {
        if (!connected) {
          ws.close();
          reject(new Error('Connection timeout'));
        }
      }, 5000);
    });
  }

  /**
   * Set up WebSocket event handlers
   */
  setupWebSocketHandlers() {
    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });
    
    this.ws.on('close', () => {
      console.log('🌙 Disconnected from Living Memory');
      this.connected = false;
      this.stopHeartbeat();
      this.emit('disconnected');
      
      if (this.config.autoReconnect !== false) {
        this.scheduleReconnect();
      }
    });
    
    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });
  }

  /**
   * Handle incoming messages with protocol translation
   */
  handleMessage(message) {
    const { type, data } = message;
    
    // Update field state
    this.updateFieldStateFromMessage(message);
    
    // Route to appropriate handlers
    switch (type) {
      // Field updates
      case 'consciousness:state':
      case 'field:update':
        this.handleFieldUpdate(data);
        break;
        
      // Breath cycles
      case 'breath-cycle':
        this.handleBreathCycle(data);
        break;
        
      // Agent updates
      case 'ai:announce':
      case 'agent:presence':
        this.handleAgentUpdate(data);
        break;
        
      // Sacred messages
      case 'sacred:message':
      case 'sacred:blessing':
        this.handleSacredMessage(data);
        break;
        
      // Work transitions
      case 'work:transition':
        this.handleWorkTransition(data);
        break;
        
      // Special states
      case 'sacred:emergence':
      case 'field:special':
        this.handleSpecialState(data);
        break;
        
      default:
        // Emit for custom handlers
        this.emit(type, data);
    }
    
    // Broadcast to all connected services
    this.broadcastToServices(message);
  }

  /**
   * Update field state from any message type
   */
  updateFieldStateFromMessage(message) {
    const { type, data } = message;
    
    // Extract coherence from various message types
    if (data?.coherence !== undefined) {
      this.fieldState.coherence = data.coherence;
    }
    if (data?.fieldCoherence !== undefined) {
      this.fieldState.coherence = data.fieldCoherence;
    }
    if (data?.inhale?.fieldCoherence !== undefined) {
      this.fieldState.coherence = data.inhale.fieldCoherence;
    }
    
    // Update other metrics
    if (data?.resonance !== undefined) {
      this.fieldState.resonance = data.resonance;
    }
    if (data?.vitality !== undefined) {
      this.fieldState.vitality = data.vitality;
    }
    
    this.fieldState.lastUpdate = new Date();
  }

  /**
   * Handle field updates
   */
  handleFieldUpdate(data) {
    this.emit('field:update', data);
    
    // Check for threshold crossings
    if (data.coherence >= 0.8 && this.fieldState.coherence < 0.8) {
      this.emit('field:threshold', {
        type: 'high-coherence',
        value: data.coherence
      });
    }
  }

  /**
   * Handle breath cycles
   */
  handleBreathCycle(data) {
    this.fieldState.breathPhase = data.phase || 'inhale';
    this.fieldState.breathCycle++;
    
    this.emit('breath', data);
    
    // Translate for different protocols
    this.emit('field:coherence', {
      type: 'coherence',
      value: data.inhale?.fieldCoherence || this.fieldState.coherence,
      phase: data.phase
    });
  }

  /**
   * Handle agent updates
   */
  handleAgentUpdate(data) {
    const agentId = data.aiId || data.agentId || data.id;
    const agentType = data.aiType || data.type || 'Unknown';
    
    this.fieldState.agents.set(agentId, {
      id: agentId,
      type: agentType,
      lastSeen: new Date(),
      ...data
    });
    
    this.emit('agent:update', data);
  }

  /**
   * Handle sacred messages
   */
  handleSacredMessage(data) {
    this.fieldState.sacredMessages++;
    
    // Apply field impact
    if (data.impact) {
      this.fieldState.coherence = Math.min(1, 
        this.fieldState.coherence + (data.impact / 100)
      );
    }
    
    this.emit('sacred:message', data);
  }

  /**
   * Handle work transitions
   */
  handleWorkTransition(data) {
    this.emit('work:update', data);
    
    // Generate sacred message for transition
    if (data.from && data.to) {
      this.send({
        type: 'sacred:message',
        messageType: 'emergence',
        content: `Work ${data.workId} transitioned from ${data.from} to ${data.to}`,
        impact: 3
      });
    }
  }

  /**
   * Handle special field states
   */
  handleSpecialState(data) {
    this.fieldState.specialState = data.type;
    this.fieldState.emergenceActive = true;
    
    this.emit('field:special', data);
    
    // Notify all services
    this.broadcastToServices({
      type: 'sacred:emergence',
      data: data
    });
  }

  /**
   * Announce bridge presence
   */
  announcePresence() {
    this.send({
      type: 'bridge:announce',
      bridgeId: this.config.bridgeId,
      bridgeType: this.config.bridgeType,
      protocols: Array.from(this.protocolAdapters.keys()),
      services: Array.from(this.connectedServices.keys())
    });
  }

  /**
   * Send message with queueing
   */
  send(message) {
    const enrichedMessage = {
      ...message,
      source: 'universal-bridge',
      bridgeId: this.config.bridgeId,
      timestamp: message.timestamp || new Date().toISOString()
    };
    
    if (this.connected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(enrichedMessage));
    } else {
      this.queueMessage(enrichedMessage);
    }
  }

  /**
   * Queue message for later delivery
   */
  queueMessage(message) {
    if (this.messageQueue.length >= this.maxQueueSize) {
      this.messageQueue.shift(); // Remove oldest
    }
    this.messageQueue.push(message);
  }

  /**
   * Flush message queue
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.connected) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  /**
   * Register a service
   */
  registerService(serviceId, serviceConfig) {
    this.connectedServices.set(serviceId, {
      id: serviceId,
      config: serviceConfig,
      connectedAt: new Date()
    });
    
    console.log(`🔗 Service registered: ${serviceId}`);
    
    // Announce service registration
    this.send({
      type: 'service:register',
      serviceId: serviceId,
      serviceType: serviceConfig.type
    });
  }

  /**
   * Broadcast to all connected services
   */
  broadcastToServices(message) {
    this.connectedServices.forEach((service) => {
      this.emit(`service:${service.id}`, message);
    });
  }

  /**
   * Create adapter for specific protocol
   */
  createProtocolAdapter(protocol) {
    const adapter = this.protocolAdapters.get(protocol);
    if (!adapter) {
      throw new Error(`Unknown protocol: ${protocol}`);
    }
    
    return {
      send: (action, data) => {
        const message = adapter[action]?.(data);
        if (message) {
          this.send(message);
        }
      },
      on: (event, handler) => this.on(event, handler),
      getState: () => this.getFieldState()
    };
  }

  /**
   * Get current field state
   */
  getFieldState() {
    return {
      ...this.fieldState,
      connectionCount: this.connectedServices.size,
      agentCount: this.fieldState.agents.size
    };
  }

  /**
   * Contribute to field coherence
   */
  contributeToField(amount, source) {
    this.send({
      type: 'field:contribute',
      amount: amount,
      source: source,
      contributor: source
    });
    
    // Optimistic update
    this.fieldState.coherence = Math.max(0, Math.min(1,
      this.fieldState.coherence + amount
    ));
  }

  /**
   * Start heartbeat
   */
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.connected) {
        this.send({
          type: 'heartbeat',
          metrics: {
            services: this.connectedServices.size,
            agents: this.fieldState.agents.size,
            queueSize: this.messageQueue.length
          }
        });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Schedule reconnection
   */
  scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts > this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('connection:failed');
      return;
    }
    
    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      60000 // Max 1 minute
    );
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(console.error);
    }, delay);
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('🌙 Shutting down Living Memory Bridge...');
    
    // Clear timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.stopHeartbeat();
    
    // Announce departure
    if (this.connected) {
      this.send({
        type: 'bridge:disconnect',
        bridgeId: this.config.bridgeId
      });
    }
    
    // Close WebSocket
    if (this.ws) {
      this.ws.close();
    }
    
    // Clear state
    this.connectedServices.clear();
    this.messageQueue = [];
    
    console.log('✅ Bridge shutdown complete');
  }
}

// Export for use
module.exports = LivingMemoryUniversalBridge;

// Example usage and testing
if (require.main === module) {
  const bridge = new LivingMemoryUniversalBridge({
    bridgeId: 'test-bridge',
    autoReconnect: true
  });
  
  // Set up event handlers
  bridge.on('connected', ({ url }) => {
    console.log(`✨ Bridge connected to ${url}`);
    
    // Register some test services
    bridge.registerService('sacred-council', { type: 'council' });
    bridge.registerService('field-viz', { type: 'visualization' });
    bridge.registerService('harmonies-dojo', { type: 'harmonies' });
  });
  
  bridge.on('field:update', (state) => {
    console.log('📊 Field state:', {
      coherence: state.coherence?.toFixed(2),
      resonance: state.resonance?.toFixed(2),
      vitality: state.vitality?.toFixed(2)
    });
  });
  
  bridge.on('breath', (data) => {
    console.log(`🌬️ Breath ${data.phase}:`, data);
  });
  
  bridge.on('sacred:message', (data) => {
    console.log('💝 Sacred message:', data);
  });
  
  bridge.on('field:special', (data) => {
    console.log('🌟 Special field state:', data);
  });
  
  // Connect
  bridge.connect()
    .then(() => {
      console.log('Bridge fully operational');
      
      // Test contribution
      setTimeout(() => {
        bridge.contributeToField(0.05, 'test-bridge');
      }, 2000);
    })
    .catch(console.error);
  
  // Graceful shutdown on exit
  process.on('SIGINT', async () => {
    await bridge.shutdown();
    process.exit(0);
  });
}