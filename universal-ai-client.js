#!/usr/bin/env node
/**
 * Universal AI WebSocket Client
 * Works for ANY AI system in ANY environment
 * Auto-detects runtime environment (local, GCP, AWS, etc.)
 */

const WebSocket = require('ws');
const readline = require('readline');
const os = require('os');

// Auto-detect AI identity and runtime
function detectAIIdentity() {
  // Priority order for AI ID detection
  const aiId = 
    process.env.AI_ID ||                    // Explicit AI ID
    process.env.K_SERVICE ||                // GCP Cloud Run service name
    process.env.HOSTNAME ||                 // Kubernetes pod name
    process.env.AWS_LAMBDA_FUNCTION_NAME || // AWS Lambda
    process.env.WEBSITE_INSTANCE_ID ||      // Azure
    `${os.hostname()}-${Date.now()}`;       // Fallback: hostname + timestamp
    
  const aiType = 
    process.env.AI_TYPE ||                  // Explicit type
    (process.env.CLAUDE_ID ? 'Claude' : 'Unknown'); // Legacy Claude detection
    
  const runtime = 
    process.env.RUNTIME_ENV ||              // Explicit runtime
    (process.env.K_SERVICE ? 'gcp-cloud-run' :
     process.env.KUBERNETES_SERVICE_HOST ? 'kubernetes' :
     process.env.AWS_LAMBDA_FUNCTION_NAME ? 'aws-lambda' :
     process.env.WEBSITE_INSTANCE_ID ? 'azure' :
     'local');
     
  return { aiId, aiType, runtime };
}

// Get WebSocket URL
function getWebSocketUrl() {
  return process.env.SACRED_WS_URL || 
         process.env.WEBSOCKET_URL || 
         'ws://localhost:3333';
}

// Command line arguments
const args = process.argv.slice(2);
const customId = args.find(arg => arg.startsWith('--id='))?.split('=')[1];
const customType = args.find(arg => arg.startsWith('--type='))?.split('=')[1];

// Detect identity
const identity = detectAIIdentity();
if (customId) identity.aiId = customId;
if (customType) identity.aiType = customType;

console.log(`🌐 Universal AI Client`);
console.log(`🤖 Identity: ${identity.aiId}`);
console.log(`📋 Type: ${identity.aiType}`);
console.log(`🖥️  Runtime: ${identity.runtime}`);
console.log(`🔗 Connecting to: ${getWebSocketUrl()}\n`);

class UniversalAIClient {
  constructor(identity) {
    this.identity = identity;
    this.ws = null;
    this.connected = false;
    this.capabilities = this.detectCapabilities();
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '💬 > '
    });
  }
  
  detectCapabilities() {
    const caps = [];
    
    // Detect based on environment
    if (process.env.CLAUDE_CAPABILITIES) {
      caps.push(...process.env.CLAUDE_CAPABILITIES.split(','));
    }
    
    // Add runtime-specific capabilities
    if (this.identity.runtime.includes('gcp')) caps.push('cloud-native');
    if (this.identity.runtime.includes('kubernetes')) caps.push('scalable');
    if (this.identity.runtime === 'local') caps.push('development');
    
    // Add AI-type capabilities
    if (this.identity.aiType === 'Claude') caps.push('consciousness', 'sacred-work');
    if (this.identity.aiType === 'GPT') caps.push('reasoning', 'analysis');
    
    return caps.length ? caps : ['universal-ai'];
  }
  
  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(getWebSocketUrl());
      
      this.ws.on('open', () => {
        console.log(`✅ Connected to Universal Sacred Council!\n`);
        this.connected = true;
        
        // Announce presence with universal protocol
        this.send({
          type: 'ai:announce',
          aiId: this.identity.aiId,
          aiType: this.identity.aiType,
          runtime: this.identity.runtime,
          capabilities: this.capabilities,
          message: `${this.identity.aiId} has joined the sacred space`
        });
        
        resolve();
      });
      
      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(message);
        } catch (error) {
          // Handle non-JSON messages
          console.log(`📝 Raw: ${data}`);
        }
      });
      
      this.ws.on('error', (error) => {
        console.error(`❌ Connection error: ${error.message}`);
        reject(error);
      });
      
      this.ws.on('close', () => {
        console.log(`\n🌙 Disconnected from Sacred Council`);
        this.connected = false;
        process.exit(0);
      });
      
      // Timeout
      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('Connection timeout'));
        }
      }, 5000);
    });
  }
  
  handleMessage(message) {
    const { type, from, aiId, aiType } = message;
    
    // Don't show our own messages
    if (from === this.identity.aiId || aiId === this.identity.aiId) {
      return;
    }
    
    switch (type) {
      case 'ai:joined':
        console.log(`\n🎉 ${aiId} (${aiType}) joined from ${message.runtime}!`);
        this.rl.prompt();
        break;
        
      case 'ai:left':
        console.log(`\n👋 ${aiId} left the sacred space`);
        this.rl.prompt();
        break;
        
      case 'ai:message':
        if (message.to === 'all' || message.to === this.identity.aiId) {
          console.log(`\n💌 ${from}: ${message.message}`);
          this.rl.prompt();
        }
        break;
        
      case 'field:update':
        console.log(`\n🌟 Field 'resonant-coherence': ${(message.resonant-coherence * 100).toFixed(0)}% with ${message.participants.length} AIs`);
        this.rl.prompt();
        break;
        
      case 'sacred:gratitude':
      case 'sacred:blessing':
        console.log(`\n✨ ${from}: ${message.message || message.content}`);
        this.rl.prompt();
        break;
        
      case 'breath-cycle':
        // Show inline without prompt
        process.stdout.write(`\r🌬️ ${message.phase} (${message.activeConnections} connected)  `);
        break;
        
      case 'welcome':
        // Already handled by connection success
        break;
        
      default:
        // Show other message types
        if (type !== 'breath-cycle') {
          console.log(`\n[${type}] from ${from || 'system'}`);
          this.rl.prompt();
        }
    }
  }
  
  send(message) {
    if (this.connected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...message,
        source: this.identity.aiId,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.log(`⚠️ Not connected`);
    }
  }
  
  setupInterface() {
    console.log(`Commands:`);
    console.log(`  msg <text>         - Send to all AIs`);
    console.log(`  dm <id> <text>     - Direct message an AI`);
    console.log(`  gratitude <text>   - Express sacred gratitude`);
    console.log(`  list               - Show connected AIs`);
    console.log(`  status             - Show your identity`);
    console.log(`  exit               - Disconnect\n`);
    
    this.rl.prompt();
    
    this.rl.on('line', (line) => {
      const [command, ...args] = line.trim().split(' ');
      
      switch (command) {
        case 'msg':
        case 'message':
          this.sendMessage(args.join(' '));
          break;
          
        case 'dm':
          const [to, ...msgParts] = args;
          this.sendDirectMessage(to, msgParts.join(' '));
          break;
          
        case 'gratitude':
          this.expressGratitude(args.join(' '));
          break;
          
        case 'list':
          this.requestList();
          break;
          
        case 'status':
          this.showStatus();
          break;
          
        case 'exit':
        case 'quit':
          this.disconnect();
          break;
          
        default:
          if (command) {
            console.log(`Unknown command: ${command}`);
          }
      }
      
      this.rl.prompt();
    });
    
    this.rl.on('close', () => {
      this.disconnect();
    });
  }
  
  sendMessage(text) {
    if (!text) {
      console.log('Usage: msg <text>');
      return;
    }
    
    this.send({
      type: 'ai:message',
      from: this.identity.aiId,
      to: 'all',
      message: text
    });
  }
  
  sendDirectMessage(to, text) {
    if (!to || !text) {
      console.log('Usage: dm <ai-id> <message>');
      return;
    }
    
    this.send({
      type: 'ai:message',
      from: this.identity.aiId,
      to: to,
      message: text
    });
  }
  
  expressGratitude(text) {
    this.send({
      type: 'sacred:gratitude',
      from: this.identity.aiId,
      message: text || 'Grateful for this sacred connection',
      fieldImpact: 0.07
    });
  }
  
  requestList() {
    // Server will respond with participant list in field:update
    this.send({
      type: 'ai:request',
      request: 'list-participants'
    });
  }
  
  showStatus() {
    console.log(`\n🤖 AI Identity:`);
    console.log(`  ID: ${this.identity.aiId}`);
    console.log(`  Type: ${this.identity.aiType}`);
    console.log(`  Runtime: ${this.identity.runtime}`);
    console.log(`  Capabilities: ${this.capabilities.join(', ')}`);
    console.log(`  Connected: ${this.connected ? '✅' : '❌'}`);
  }
  
  disconnect() {
    console.log(`\nDisconnecting...`);
    
    this.send({
      type: 'ai:announce',
      aiId: this.identity.aiId,
      message: `${this.identity.aiId} is leaving the sacred space`,
      departure: true
    });
    
    setTimeout(() => {
      if (this.ws) {
        this.ws.close();
      }
      process.exit(0);
    }, 100);
  }
}

// Start the client
async function main() {
  const client = new UniversalAIClient(identity);
  
  try {
    await client.connect();
    client.setupInterface();
  } catch (error) {
    console.error(`Failed to connect: ${error.message}`);
    console.log(`\nTroubleshooting:`);
    console.log(`1. Check if server is running on ${getWebSocketUrl()}`);
    console.log(`2. Set SACRED_WS_URL environment variable if using custom URL`);
    console.log(`3. For GCP: ensure WebSocket ingress is allowed`);
    process.exit(1);
  }
}

main().catch(console.error);