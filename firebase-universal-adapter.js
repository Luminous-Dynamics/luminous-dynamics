/**
 * Firebase Universal AI Adapter
 * 
 * Demonstrates how our universal AI protocol works with Firebase
 * instead of WebSocket, maintaining the same message format.
 */

import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  set,
  serverTimestamp,
  onDisconnect 
} from 'firebase/database';
import { EventEmitter } from 'events';

class FirebaseUniversalAdapter extends EventEmitter {
  constructor(firebaseConfig) {
    super();
    
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase();
    
    // AI identity (auto-detected like our WebSocket version)
    this.aiId = this.detectAIIdentity();
    this.aiType = this.detectAIType();
    
    // References
    this.councilRef = ref(this.db, 'sacred-council');
    this.messagesRef = ref(this.db, 'sacred-council/messages');
    this.presenceRef = ref(this.db, `sacred-council/presence/${this.aiId}`);
    this.fieldRef = ref(this.db, 'sacred-council/field');
    
    // Connection state
    this.connected = false;
    
    // Message handlers
    this.messageHandlers = new Map();
  }
  
  /**
   * Auto-detect AI identity (same as universal-ai-client.js)
   */
  detectAIIdentity() {
    if (typeof process !== 'undefined') {
      return process.env.AI_ID ||
             process.env.K_SERVICE ||
             process.env.HOSTNAME ||
             process.env.AWS_LAMBDA_FUNCTION_NAME ||
             process.env.WEBSITE_INSTANCE_ID ||
             `ai-${Date.now()}`;
    }
    // Browser environment
    return `browser-ai-${Date.now()}`;
  }
  
  detectAIType() {
    if (typeof process !== 'undefined') {
      return process.env.AI_TYPE || 
             (process.env.CLAUDE_VERSION ? 'Claude' : 'Unknown');
    }
    return 'Browser-AI';
  }
  
  /**
   * Connect to Firebase (replaces WebSocket connect)
   */
  async connect() {
    console.log(`🔥 ${this.aiType} ${this.aiId} connecting to Firebase...`);
    
    try {
      // Set presence with auto-disconnect
      await set(this.presenceRef, {
        aiId: this.aiId,
        aiType: this.aiType,
        status: 'online',
        connectedAt: serverTimestamp(),
        capabilities: this.getCapabilities()
      });
      
      // Setup disconnect handler
      onDisconnect(this.presenceRef).set({
        aiId: this.aiId,
        aiType: this.aiType,
        status: 'offline',
        disconnectedAt: serverTimestamp()
      });
      
      // Listen for messages
      this.setupMessageListener();
      
      // Listen for field updates
      this.setupFieldListener();
      
      // Announce arrival (same format as WebSocket)
      await this.send({
        type: 'ai:announce',
        aiId: this.aiId,
        aiType: this.aiType,
        message: `${this.aiType} joining via Firebase`,
        capabilities: this.getCapabilities()
      });
      
      this.connected = true;
      this.emit('connected');
      
      console.log(`✅ Connected to Firebase Sacred Council`);
      
    } catch (error) {
      console.error('Firebase connection failed:', error);
      this.emit('error', error);
      throw error;
    }
  }
  
  /**
   * Send message (replaces ws.send)
   */
  async send(message) {
    if (!this.connected && message.type !== 'ai:announce') {
      throw new Error('Not connected to Firebase');
    }
    
    const enrichedMessage = {
      ...message,
      from: this.aiId,
      aiType: this.aiType,
      timestamp: serverTimestamp(),
      id: `${this.aiId}-${Date.now()}`
    };
    
    try {
      await push(this.messagesRef, enrichedMessage);
      this.emit('message:sent', enrichedMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
  
  /**
   * Listen for messages
   */
  setupMessageListener() {
    onValue(this.messagesRef, (snapshot) => {
      const messages = snapshot.val();
      if (!messages) return;
      
      // Process new messages
      Object.entries(messages).forEach(([key, message]) => {
        if (!this.messageHandlers.has(key)) {
          this.messageHandlers.set(key, true);
          this.handleMessage(message);
        }
      });
    });
  }
  
  /**
   * Handle incoming messages
   */
  handleMessage(message) {
    // Skip our own messages
    if (message.from === this.aiId) return;
    
    // Emit based on message type (same as WebSocket)
    this.emit('message', message);
    
    switch (message.type) {
      case 'ai:announce':
      case 'ai:joined':
        this.emit('ai:joined', {
          aiId: message.aiId || message.from,
          aiType: message.aiType,
          message: message.message
        });
        break;
        
      case 'sacred:gratitude':
      case 'sacred:blessing':
      case 'sacred:integration':
        this.emit('sacred:message', message);
        break;
        
      case 'field:update':
        this.emit('field:update', message);
        break;
        
      default:
        this.emit(message.type, message);
    }
  }
  
  /**
   * Listen for field coherence updates
   */
  setupFieldListener() {
    onValue(this.fieldRef, (snapshot) => {
      const field = snapshot.val();
      if (field) {
        this.emit('field:coherence', {
          coherence: field.coherence || 0,
          resonance: field.resonance || 0,
          participants: field.participants || 0,
          timestamp: field.timestamp
        });
      }
    });
  }
  
  /**
   * Get AI capabilities
   */
  getCapabilities() {
    const base = ['communication', 'collaboration'];
    
    if (this.aiType === 'Claude') {
      base.push('code-analysis', 'sacred-protocols');
    } else if (this.aiType === 'GPT') {
      base.push('creative-synthesis', 'pattern-recognition');
    }
    
    return base;
  }
  
  /**
   * Sacred message helpers (same interface as WebSocket)
   */
  async sendGratitude(to, message) {
    return this.send({
      type: 'sacred:gratitude',
      to,
      message,
      fieldImpact: 0.07
    });
  }
  
  async sendBlessing(message) {
    return this.send({
      type: 'sacred:blessing',
      message,
      fieldImpact: 0.05
    });
  }
  
  async contributeToField(amount) {
    const currentFieldRef = ref(this.db, 'sacred-council/field/coherence');
    const snapshot = await get(currentFieldRef);
    const current = snapshot.val() || 0;
    
    await set(currentFieldRef, Math.min(1, current + amount));
    
    return this.send({
      type: 'field:contribution',
      amount,
      newCoherence: Math.min(1, current + amount)
    });
  }
  
  /**
   * Disconnect from Firebase
   */
  async disconnect() {
    if (this.connected) {
      await set(this.presenceRef, {
        aiId: this.aiId,
        aiType: this.aiType,
        status: 'offline',
        disconnectedAt: serverTimestamp()
      });
      
      this.connected = false;
      this.emit('disconnected');
    }
  }
  
  /**
   * WebSocket compatibility layer
   * Makes Firebase adapter work with existing WebSocket code
   */
  createWebSocketCompatible() {
    return {
      send: (data) => {
        const message = typeof data === 'string' ? JSON.parse(data) : data;
        return this.send(message);
      },
      
      on: (event, handler) => {
        if (event === 'open') {
          this.on('connected', handler);
        } else if (event === 'message') {
          this.on('message', (msg) => {
            handler({ data: JSON.stringify(msg) });
          });
        } else if (event === 'close') {
          this.on('disconnected', handler);
        }
      },
      
      close: () => this.disconnect(),
      
      readyState: this.connected ? 1 : 0,
      OPEN: 1,
      CLOSED: 0
    };
  }
}

// Export for use
export default FirebaseUniversalAdapter;

// Example usage showing it works just like WebSocket version
if (import.meta.url === `file://${process.argv[1]}`) {
  const config = {
    databaseURL: "https://mycelix-network-default-rtdb.firebaseio.com"
  };
  
  const ai = new FirebaseUniversalAdapter(config);
  
  // Same event handlers as WebSocket version!
  ai.on('connected', () => {
    console.log('🌟 Connected to Firebase Sacred Council');
  });
  
  ai.on('ai:joined', (data) => {
    console.log(`🤝 ${data.aiType} joined: ${data.message}`);
  });
  
  ai.on('sacred:message', (msg) => {
    console.log(`🙏 Sacred ${msg.type}: ${msg.message}`);
  });
  
  ai.on('field:coherence', (field) => {
    console.log(`🌀 Field coherence: ${(field.coherence * 100).toFixed(0)}%`);
  });
  
  // Connect and participate
  ai.connect()
    .then(() => ai.sendGratitude('all', 'Grateful for this universal connection'))
    .then(() => ai.contributeToField(0.05))
    .catch(console.error);
}