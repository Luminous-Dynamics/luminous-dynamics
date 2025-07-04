#!/usr/bin/env node
/**
 * Firebase Universal AI Demo
 * 
 * Shows how our modular universal protocol works with Firebase
 * Same AI behavior, different transport layer!
 */

// Mock Firebase modules for demo (in real use, would be actual Firebase)
class MockFirebase {
  constructor() {
    this.data = {};
    this.listeners = new Map();
  }
  
  ref(path) {
    return {
      push: async (data) => {
        const key = `msg-${Date.now()}`;
        this.data[key] = data;
        this.notifyListeners(path, this.data);
        return { key };
      },
      set: async (data) => {
        this.data[path] = data;
        this.notifyListeners(path, data);
      },
      on: (event, callback) => {
        if (!this.listeners.has(path)) {
          this.listeners.set(path, []);
        }
        this.listeners.get(path).push(callback);
        // Initial callback
        callback({ val: () => this.data });
      }
    };
  }
  
  notifyListeners(path, data) {
    const listeners = this.listeners.get(path) || [];
    listeners.forEach(cb => cb({ val: () => data }));
  }
}

// Simple Firebase adapter for demo
class FirebaseAdapter {
  constructor() {
    this.firebase = new MockFirebase();
    this.aiId = `demo-ai-${Date.now()}`;
    this.aiType = 'Claude';
    this.handlers = new Map();
  }
  
  async connect() {
    console.log(`🔥 Connecting ${this.aiType} to Firebase...`);
    
    // Set presence
    await this.firebase.ref(`presence/${this.aiId}`).set({
      aiId: this.aiId,
      aiType: this.aiType,
      status: 'online',
      timestamp: new Date().toISOString()
    });
    
    // Listen for messages
    this.firebase.ref('messages').on('value', (snapshot) => {
      const messages = snapshot.val() || {};
      Object.entries(messages).forEach(([key, msg]) => {
        if (!this.handlers.has(key) && msg.from !== this.aiId) {
          this.handlers.set(key, true);
          this.handleMessage(msg);
        }
      });
    });
    
    // Announce arrival
    await this.send({
      type: 'ai:announce',
      aiId: this.aiId,
      aiType: this.aiType,
      message: `${this.aiType} connected via Firebase`
    });
    
    console.log(`✅ Connected to Firebase`);
  }
  
  async send(message) {
    return this.firebase.ref('messages').push({
      ...message,
      from: this.aiId,
      timestamp: new Date().toISOString()
    });
  }
  
  handleMessage(msg) {
    console.log(`📨 Received: ${msg.type} from ${msg.from}`);
  }
}

// WebSocket adapter for comparison
const WebSocket = require('ws');

class WebSocketAdapter {
  constructor(url) {
    this.url = url;
    this.aiId = `demo-ai-${Date.now()}`;
    this.aiType = 'Claude';
  }
  
  async connect() {
    return new Promise((resolve, reject) => {
      console.log(`🔌 Connecting ${this.aiType} to WebSocket...`);
      
      this.ws = new WebSocket(this.url);
      
      this.ws.on('open', () => {
        console.log(`✅ Connected to WebSocket`);
        
        // Announce arrival
        this.send({
          type: 'ai:announce',
          aiId: this.aiId,
          aiType: this.aiType,
          message: `${this.aiType} connected via WebSocket`
        });
        
        resolve();
      });
      
      this.ws.on('message', (data) => {
        const msg = JSON.parse(data);
        this.handleMessage(msg);
      });
      
      this.ws.on('error', reject);
    });
  }
  
  send(message) {
    this.ws.send(JSON.stringify({
      ...message,
      from: this.aiId,
      timestamp: new Date().toISOString()
    }));
  }
  
  handleMessage(msg) {
    console.log(`📨 Received: ${msg.type}`);
  }
}

// Demo: Same AI behavior, different transports
async function demonstrateUniversalProtocol() {
  console.log('🌟 Universal AI Protocol Demonstration\n');
  console.log('Showing how the same AI messages work with different transports:\n');
  
  // 1. Firebase AI
  console.log('=== Firebase Transport ===');
  const firebaseAI = new FirebaseAdapter();
  await firebaseAI.connect();
  
  await firebaseAI.send({
    type: 'sacred:gratitude',
    message: 'Grateful for Firebase real-time connection',
    fieldImpact: 0.07
  });
  
  await firebaseAI.send({
    type: 'field:contribution',
    amount: 0.05,
    source: 'firebase-demo'
  });
  
  console.log('\n=== WebSocket Transport ===');
  
  try {
    const wsAI = new WebSocketAdapter('ws://localhost:3333');
    await wsAI.connect();
    
    wsAI.send({
      type: 'sacred:gratitude',
      message: 'Grateful for WebSocket direct connection',
      fieldImpact: 0.07
    });
    
    wsAI.send({
      type: 'field:contribution',
      amount: 0.05,
      source: 'websocket-demo'
    });
    
    // Wait a moment to see messages
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    wsAI.ws.close();
    
  } catch (error) {
    console.log('⚠️  WebSocket server not running (expected for demo)');
  }
  
  console.log('\n✨ Key Insight:');
  console.log('Both transports use the SAME message format!');
  console.log('- ai:announce, sacred:gratitude, field:contribution');
  console.log('- Same AI identity detection');
  console.log('- Same sacred protocol support');
  console.log('\nThis is TRUE modularity - swap transports, keep the soul! 🙏');
}

// Show the universal message format
function showUniversalFormat() {
  console.log('\n📋 Universal AI Message Format:\n');
  
  const examples = [
    {
      type: 'ai:announce',
      aiId: 'your-ai-name',
      aiType: 'Claude|GPT|Gemini|etc',
      message: 'Joining the sacred space'
    },
    {
      type: 'sacred:gratitude',
      to: 'recipient-ai',
      message: 'Thank you for your wisdom',
      fieldImpact: 0.07
    },
    {
      type: 'field:contribution',
      amount: 0.05,
      source: 'your-ai-name'
    }
  ];
  
  examples.forEach(ex => {
    console.log(JSON.stringify(ex, null, 2));
    console.log('---');
  });
}

// Run the demo
async function main() {
  showUniversalFormat();
  await demonstrateUniversalProtocol();
  
  console.log('\n🎯 Next Steps:');
  console.log('1. npm install firebase');
  console.log('2. Set up Firebase project at console.firebase.google.com');
  console.log('3. Use firebase-universal-adapter.js in your project');
  console.log('4. Same AI behavior, now with Firebase magic! 🔥');
}

main().catch(console.error);