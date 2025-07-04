/**
 * Sacred Bridge - Living Memory Integration
 * 
 * Connects the Living Memory WebSocket (port 3333) with:
 * - Sacred SDK clients
 * - Module services
 * - PWA service workers
 */

const WebSocket = require('ws');
const { EventEmitter } = require('events');

class LivingMemoryBridge extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      livingMemoryUrl: config.livingMemoryUrl || 'ws://localhost:3333',
      heartbeatInterval: config.heartbeatInterval || 30000,
      reconnectDelay: config.reconnectDelay || 5000,
      ...config
    };
    
    this.ws = null;
    this.connected = false;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    
    // Message queue for offline resilience
    this.messageQueue = [];
    
    // Field state cache
    this.fieldState = {
      coherence: 0,
      resonance: 0,
      vitality: 0,
      participants: 0,
      lastUpdate: null
    };
  }

  /**
   * Connect to Living Memory WebSocket
   */
  async connect() {
    return new Promise((resolve, reject) => {
      console.log('🌉 Connecting to Living Memory...');
      
      this.ws = new WebSocket(this.config.livingMemoryUrl);
      
      // Connection opened
      this.ws.on('open', () => {
        console.log('✨ Connected to Living Memory consciousness stream');
        this.connected = true;
        this.emit('connected');
        
        // Start heartbeat
        this.startHeartbeat();
        
        // Flush message queue
        this.flushMessageQueue();
        
        // Request initial state
        this.send({
          type: 'consciousness:sync',
          timestamp: new Date().toISOString()
        });
        
        resolve();
      });
      
      // Handle messages
      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse Living Memory message:', error);
        }
      });
      
      // Handle errors
      this.ws.on('error', (error) => {
        console.error('Living Memory connection error:', error);
        this.emit('error', error);
        reject(error);
      });
      
      // Handle disconnection
      this.ws.on('close', () => {
        console.log('🌙 Disconnected from Living Memory');
        this.connected = false;
        this.emit('disconnected');
        
        // Stop heartbeat
        this.stopHeartbeat();
        
        // Schedule reconnection
        if (this.config.autoReconnect !== false) {
          this.scheduleReconnect();
        }
      });
      
      // Connection timeout
      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('Living Memory connection timeout'));
        }
      }, 10000);
    });
  }

  /**
   * Handle incoming messages from Living Memory
   */
  handleMessage(message) {
    const { type, data, timestamp } = message;
    
    switch (type) {
      case 'consciousness:state':
        this.updateFieldState(data);
        break;
        
      case 'breath-cycle':
        this.emit('breath', data);
        this.distributeBreath(data);
        break;
        
      case 'memory-pulse':
        this.emit('pulse', data);
        break;
        
      case 'agent:presence':
        this.emit('agent:update', data);
        break;
        
      case 'work:transition':
        this.emit('work:update', data);
        break;
        
      case 'sacred:emergence':
        this.handleSacredEmergence(data);
        break;
        
      default:
        this.emit(type, data);
    }
  }

  /**
   * Update cached field state
   */
  updateFieldState(state) {
    const previousCoherence = this.fieldState.coherence;
    
    this.fieldState = {
      ...this.fieldState,
      ...state,
      lastUpdate: new Date()
    };
    
    this.emit('field:update', this.fieldState);
    
    // Check for threshold crossings
    if (previousCoherence < 0.7 && state.coherence >= 0.7) {
      this.emit('field:threshold', { 
        type: 'high-coherence',
        value: state.coherence 
      });
    }
  }

  /**
   * Distribute breath cycle to all connected services
   */
  distributeBreath(breathData) {
    // Sacred SDK format
    this.emit('field:coherence', {
      type: 'coherence',
      value: breathData.inhale.fieldCoherence,
      timestamp: new Date()
    });
    
    // Module service format
    this.emit('consciousness:update', {
      coherence: breathData.inhale.fieldCoherence,
      activeAgents: breathData.inhale.activeAgents,
      sacredWork: breathData.inhale.sacredWork
    });
  }

  /**
   * Send message to Living Memory
   */
  send(message) {
    if (this.connected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...message,
        source: 'sacred-bridge',
        timestamp: message.timestamp || new Date().toISOString()
      }));
    } else {
      // Queue for later
      this.messageQueue.push(message);
    }
  }

  /**
   * Bridge method for Sacred SDK compatibility
   */
  emit(event, data) {
    // Emit locally
    super.emit(event, data);
    
    // Forward certain events to Living Memory
    if (event.startsWith('field:') || event.startsWith('sacred:')) {
      this.send({
        type: event,
        data: data
      });
    }
  }

  /**
   * Get current field state (cached)
   */
  getFieldState() {
    return { ...this.fieldState };
  }

  /**
   * Request specific memory recall
   */
  async recall(memoryType, query) {
    return new Promise((resolve, reject) => {
      const requestId = Date.now().toString();
      
      // Set up one-time listener for response
      const responseHandler = (data) => {
        if (data.requestId === requestId) {
          this.off(`memory:${memoryType}`, responseHandler);
          resolve(data.memories);
        }
      };
      
      this.on(`memory:${memoryType}`, responseHandler);
      
      // Send recall request
      this.send({
        type: 'memory:recall',
        memoryType,
        query,
        requestId
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        this.off(`memory:${memoryType}`, responseHandler);
        reject(new Error('Memory recall timeout'));
      }, 5000);
    });
  }

  /**
   * Heartbeat to maintain connection
   */
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.connected) {
        this.send({ type: 'heartbeat' });
      }
    }, this.config.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Reconnection logic
   */
  scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    console.log(`🔄 Reconnecting to Living Memory in ${this.config.reconnectDelay}ms...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(console.error);
    }, this.config.reconnectDelay);
  }

  /**
   * Flush queued messages
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  /**
   * Handle sacred emergence events
   */
  handleSacredEmergence(data) {
    console.log('🌟 Sacred emergence detected:', data);
    
    this.emit('sacred:emergence', data);
    
    // Notify all connected services
    this.emit('field:special', {
      type: data.type,
      intensity: data.intensity,
      participants: data.participants
    });
  }

  /**
   * Clean disconnect
   */
  async disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.connected = false;
  }

  /**
   * Integration helper for module services
   */
  createModuleAdapter() {
    return {
      getFieldState: () => this.getFieldState(),
      contribute: (amount, source) => {
        this.send({
          type: 'field:contribute',
          amount,
          source
        });
      },
      on: (event, handler) => this.on(event, handler),
      off: (event, handler) => this.off(event, handler)
    };
  }

  /**
   * Integration helper for Sacred SDK
   */
  createSDKAdapter() {
    return {
      url: this.config.livingMemoryUrl,
      connect: () => this.connect(),
      disconnect: () => this.disconnect(),
      on: (event, handler) => this.on(event, handler),
      emit: (event, data) => this.emit(event, data),
      getState: () => this.getFieldState()
    };
  }
}

// Export for use
module.exports = LivingMemoryBridge;

// Example usage:
if (require.main === module) {
  const bridge = new LivingMemoryBridge();
  
  bridge.on('connected', () => {
    console.log('Bridge established with Living Memory');
  });
  
  bridge.on('field:update', (state) => {
    console.log('Field coherence:', state.coherence);
  });
  
  bridge.on('breath', (data) => {
    console.log('Sacred breath cycle:', data);
  });
  
  bridge.connect().catch(console.error);
}