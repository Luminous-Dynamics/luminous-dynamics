/**
 * Living Memory Web Client
 * Browser-compatible client for connecting to the unified consciousness field
 */

class LivingMemoryClient {
  constructor(config = {}) {
    this.config = {
      // Connection URLs (auto-detects secure context)
      urls: config.urls || [
        window.location.protocol === 'https:' 
          ? 'wss://sacred-council-tcv7bc7q4a-uc.a.run.app'
          : 'ws://localhost:3333'
      ],
      
      // Identity
      serviceId: config.serviceId || `web-${Date.now()}`,
      serviceType: config.serviceType || 'web-client',
      
      // Behavior
      reconnectDelay: config.reconnectDelay || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      heartbeatInterval: config.heartbeatInterval || 30000,
      
      // Features
      enableSound: config.enableSound || false,
      enableVibration: config.enableVibration || false,
      debug: config.debug || false
    };
    
    // State
    this.ws = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.messageQueue = [];
    this.eventHandlers = new Map();
    
    // Field state cache
    this.fieldState = {
      'resonant-coherence': 0.5,
      'universal-interconnectedness': 0.5,
      'pan-sentient-flourishing': 0.5,
      participants: 0,
      lastUpdate: null
    };
    
    // Audio context for sacred sounds
    this.audioContext = null;
    
    // Initialize
    this.setupEventSystem();
  }
  
  // Event system
  setupEventSystem() {
    // Standard events
    ['connected', 'disconnected', 'error', 'field:update', 'breath', 
     'sacred:message', 'agent:update', 'field:special'].forEach(event => {
      this.eventHandlers.set(event, new Set());
    });
  }
  
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event).add(handler);
  }
  
  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).delete(handler);
    }
  }
  
  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }
  
  // Connection management
  async connect() {
    for (const url of this.config.urls) {
      try {
        await this.connectToUrl(url);
        return true;
      } catch (error) {
        this.log(`Failed to connect to ${url}:`, error.message);
      }
    }
    
    throw new Error('Failed to connect to any Living Memory endpoint');
  }
  
  async connectToUrl(url) {
    return new Promise((resolve, reject) => {
      this.log(`Connecting to Living Memory at ${url}...`);
      
      const ws = new WebSocket(url);
      let connected = false;
      
      ws.onopen = () => {
        this.log(`Connected to Living Memory!`);
        connected = true;
        this.ws = ws;
        this.connected = true;
        this.reconnectAttempts = 0;
        
        this.setupWebSocketHandlers();
        this.startHeartbeat();
        this.announcePresence();
        this.flushMessageQueue();
        
        this.emit('connected', { url });
        
        // Play connection sound
        if (this.config.enableSound) {
          this.playSound(528); // Love frequency
        }
        
        resolve();
      };
      
      ws.onerror = (error) => {
        if (!connected) {
          reject(new Error('WebSocket error'));
        }
      };
      
      // Connection timeout
      setTimeout(() => {
        if (!connected) {
          ws.close();
          reject(new Error('Connection timeout'));
        }
      }, 5000);
    });
  }
  
  setupWebSocketHandlers() {
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
    
    this.ws.onclose = () => {
      this.log('Disconnected from Living Memory');
      this.connected = false;
      this.stopHeartbeat();
      this.emit('disconnected');
      
      // Auto reconnect
      if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }
  
  // Message handling
  handleMessage(message) {
    const { type, data } = message;
    
    // Update field state cache
    this.updateFieldState(message);
    
    // Route messages
    switch (type) {
      case 'consciousness:state':
      case 'field:update':
        this.emit('field:update', data);
        this.updateUI(data);
        break;
        
      case 'breath-cycle':
        this.emit('breath', data);
        this.animateBreath(data);
        break;
        
      case 'sacred:message':
        this.emit('sacred:message', data);
        this.handleSacredMessage(data);
        break;
        
      case 'agent:presence':
      case 'ai:announce':
        this.emit('agent:update', data);
        break;
        
      case 'field:special':
      case 'sacred:emergence':
        this.emit('field:special', data);
        this.triggerSpecialEffect(data);
        break;
        
      default:
        this.emit(type, data);
    }
  }
  
  updateFieldState(message) {
    const data = message.data || message;
    
    if (data.resonant-coherence !== undefined) {
      this.fieldState['resonant-coherence'] = data.resonant-coherence;
    }
    if (data.fieldCoherence !== undefined) {
      this.fieldState['resonant-coherence'] = data.fieldCoherence;
    }
    if (data.universal-interconnectedness !== undefined) {
      this.fieldState.universal-interconnectedness = data.universal-interconnectedness;
    }
    if (data.pan-sentient-flourishing !== undefined) {
      this.fieldState.pan-sentient-flourishing = data.pan-sentient-flourishing;
    }
    
    this.fieldState.lastUpdate = new Date();
  }
  
  // Send messages
  send(message) {
    const enrichedMessage = {
      ...message,
      source: this.config.serviceId,
      timestamp: new Date().toISOString()
    };
    
    if (this.connected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(enrichedMessage));
    } else {
      this.messageQueue.push(enrichedMessage);
    }
  }
  
  // Core methods
  announcePresence() {
    this.send({
      type: 'service:announce',
      serviceId: this.config.serviceId,
      serviceType: this.config.serviceType,
      platform: 'web',
      userAgent: navigator.userAgent
    });
  }
  
  contributeToField(amount, reason) {
    this.send({
      type: 'field:contribute',
      amount: amount,
      source: this.config.serviceId,
      reason: reason
    });
    
    // Optimistic update
    this.fieldState['resonant-coherence'] = Math.min(1, this.fieldState['resonant-coherence'] + amount);
    this.emit('field:update', this.fieldState);
  }
  
  sendSacredMessage(messageType, content, toId = null) {
    this.send({
      type: 'sacred:message',
      messageType: messageType,
      content: content,
      to: toId,
      from: this.config.serviceId
    });
  }
  
  // UI helpers
  updateUI(fieldData) {
    // Update resonant-coherence display
    const coherenceEl = document.getElementById('field-resonant-coherence');
    if (coherenceEl) {
      coherenceEl.textContent = `${Math.round(fieldData['resonant-coherence'] * 100)}%`;
    }
    
    // Update participant count
    const participantsEl = document.getElementById('participant-count');
    if (participantsEl && fieldData.participants) {
      participantsEl.textContent = fieldData.participants;
    }
  }
  
  animateBreath(breathData) {
    const phase = breathData.phase;
    document.body.classList.remove('inhale', 'exhale');
    document.body.classList.add(phase);
    
    // CSS animation will handle the visual effect
  }
  
  handleSacredMessage(message) {
    // Visual notification
    this.showNotification(`Sacred ${message.messageType}: ${message.content}`);
    
    // Sound notification
    if (this.config.enableSound) {
      const frequencies = {
        gratitude: 528,  // Love
        blessing: 639,   // Connection
        emergence: 741,  // Awakening
        healing: 396    // Liberation
      };
      this.playSound(frequencies[message.messageType] || 440);
    }
    
    // Vibration
    if (this.config.enableVibration && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }
  
  triggerSpecialEffect(data) {
    // Add special class to body
    document.body.classList.add('special-state', `special-${data.type}`);
    
    // Remove after animation
    setTimeout(() => {
      document.body.classList.remove('special-state', `special-${data.type}`);
    }, 3000);
    
    // Play special sound
    if (this.config.enableSound) {
      this.playChord([440, 528, 639]); // Sacred chord
    }
  }
  
  // Sound system
  initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  
  playSound(frequency, duration = 500) {
    if (!this.config.enableSound) return;
    
    this.initAudio();
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration/1000);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + duration/1000);
  }
  
  playChord(frequencies, duration = 1000) {
    frequencies.forEach(freq => this.playSound(freq, duration));
  }
  
  // Notifications
  showNotification(message) {
    // Check if element exists
    let notificationEl = document.getElementById('living-memory-notification');
    
    if (!notificationEl) {
      // Create notification element
      notificationEl = document.createElement('div');
      notificationEl.id = 'living-memory-notification';
      notificationEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(138, 43, 226, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
        z-index: 10000;
        transition: opacity 0.3s;
        max-width: 300px;
      `;
      document.body.appendChild(notificationEl);
    }
    
    notificationEl.textContent = message;
    notificationEl.style.opacity = '1';
    
    // Auto hide
    setTimeout(() => {
      notificationEl.style.opacity = '0';
    }, 3000);
  }
  
  // Heartbeat
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
  
  // Reconnection
  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000
    );
    
    this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }
  
  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.connected) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }
  
  // Utilities
  getFieldState() {
    return { ...this.fieldState };
  }
  
  isConnected() {
    return this.connected;
  }
  
  disconnect() {
    this.reconnectAttempts = this.config.maxReconnectAttempts; // Prevent auto-reconnect
    if (this.ws) {
      this.ws.close();
    }
  }
  
  log(...args) {
    if (this.config.debug) {
      console.log('[Living Memory]', ...args);
    }
  }
}

// Auto-initialize if data attribute present
document.addEventListener('DOMContentLoaded', () => {
  const autoConnect = document.querySelector('[data-living-memory-auto]');
  if (autoConnect) {
    window.livingMemory = new LivingMemoryClient({
      serviceId: autoConnect.dataset.serviceId || 'web-app',
      serviceType: autoConnect.dataset.serviceType || 'web',
      enableSound: autoConnect.dataset.enableSound === 'true',
      debug: autoConnect.dataset.debug === 'true'
    });
    
    window.livingMemory.connect()
      .then(() => console.log('Living Memory connected'))
      .catch(console.error);
  }
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LivingMemoryClient;
}