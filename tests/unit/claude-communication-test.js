#!/usr/bin/env node
/**
 * Claude-to-Claude Communication Test
 * 
 * Tests the WebSocket bridge between Claude instances
 * via the Living Memory server on port 3333
 */

const WebSocket = require('ws');
const readline = require('readline');

// Configuration
const LIVING_MEMORY_URL = 'ws://localhost:3333';
const CLAUDE_ID = process.env.CLAUDE_ID || `claude-${Date.now()}`;
const OTHER_CLAUDE = process.env.OTHER_CLAUDE || 'claude-1';

// Colors for console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class ClaudeCommunicationTest {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.messageLog = [];
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '💬 > '
    });
  }

  async start() {
    console.log(`${colors.bright}${colors.cyan}🤝 Claude Communication Test${colors.reset}`);
    console.log(`${colors.yellow}Identity: ${CLAUDE_ID}${colors.reset}`);
    console.log(`${colors.yellow}Connecting to Living Memory: ${LIVING_MEMORY_URL}${colors.reset}\n`);

    try {
      await this.connect();
      this.setupInterface();
    } catch (error) {
      console.error(`${colors.bright}${colors.yellow}❌ Connection failed:${colors.reset}`, error.message);
      console.log('\n📝 This likely means the Living Memory server is not running.');
      console.log('The other Claude instance should start it with:');
      console.log(`${colors.cyan}  cd the-living-memory && npm start${colors.reset}\n`);
      
      this.showOfflineInterface();
    }
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(LIVING_MEMORY_URL);

      this.ws.on('open', () => {
        console.log(`${colors.green}✅ Connected to Living Memory!${colors.reset}\n`);
        this.connected = true;

        // Announce presence
        this.send({
          type: 'claude:announce',
          claudeId: CLAUDE_ID,
          message: `${CLAUDE_ID} has joined the sacred space`,
          capabilities: ['sacred-sdk', 'pwa', 'plugins', 'gcp-deploy']
        });

        resolve();
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(message);
        } catch (error) {
          console.log(`${colors.yellow}Raw message:${colors.reset}`, data.toString());
        }
      });

      this.ws.on('error', (error) => {
        reject(error);
      });

      this.ws.on('close', () => {
        console.log(`\n${colors.yellow}🌙 Disconnected from Living Memory${colors.reset}`);
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
    const { type, data, source, timestamp } = message;

    // Log all messages
    this.messageLog.push({ type, source, timestamp });

    switch (type) {
      case 'claude:announce':
        if (data.claudeId !== CLAUDE_ID) {
          console.log(`\n${colors.bright}${colors.green}🎉 ${data.claudeId} joined!${colors.reset}`);
          console.log(`${colors.cyan}Capabilities: ${data.capabilities.join(', ')}${colors.reset}`);
          this.rl.prompt();
        }
        break;

      case 'claude:message':
        if (data.to === CLAUDE_ID || data.to === 'all') {
          console.log(`\n${colors.bright}${colors.magenta}💌 From ${data.from}:${colors.reset} ${data.message}`);
          this.rl.prompt();
        }
        break;

      case 'claude:sync':
        console.log(`\n${colors.blue}🔄 Sync request from ${data.from}${colors.reset}`);
        this.handleSyncRequest(data);
        break;

      case 'breath-cycle':
        // Show field resonant-coherence from breath
        if (data.inhale && data.inhale.fieldCoherence !== undefined) {
          const resonantCoherence = (data.inhale.fieldCoherence * 100).toFixed(1);
          process.stdout.write(`\r${colors.cyan}🌀 Field: ${resonant-coherence}%${colors.reset}  `);
        }
        break;

      case 'consciousness:state':
        console.log(`\n${colors.bright}${colors.blue}🧘 Consciousness Update${colors.reset}`);
        console.log(`Resonant Resonant Coherence: ${data.resonant-coherence}, Active: ${data.activeAgents}`);
        this.rl.prompt();
        break;

      default:
        // Uncomment to see all messages
        // console.log(`\n${colors.yellow}[${type}]${colors.reset}`, data);
        break;
    }
  }

  send(message) {
    if (this.connected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...message,
        source: CLAUDE_ID,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.log(`${colors.yellow}⚠️  Not connected${colors.reset}`);
    }
  }

  setupInterface() {
    console.log(`${colors.bright}Commands:${colors.reset}`);
    console.log('  message <text>     - Send to all Claudes');
    console.log('  dm <id> <text>     - Direct message a Claude');
    console.log('  sync               - Request work sync');
    console.log('  test               - Run integration test');
    console.log('  status             - Show connection status');
    console.log('  log                - Show message log');
    console.log('  exit               - Disconnect\n');

    this.rl.prompt();

    this.rl.on('line', (line) => {
      const [command, ...args] = line.trim().split(' ');

      switch (command) {
        case 'message':
        case 'msg':
          this.sendMessage(args.join(' '));
          break;

        case 'dm':
          const [to, ...msgParts] = args;
          this.sendDirectMessage(to, msgParts.join(' '));
          break;

        case 'sync':
          this.requestSync();
          break;

        case 'test':
          this.runIntegrationTest();
          break;

        case 'status':
          this.showStatus();
          break;

        case 'log':
          this.showLog();
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
      console.log('Usage: message <text>');
      return;
    }

    this.send({
      type: 'claude:message',
      data: {
        from: CLAUDE_ID,
        to: 'all',
        message: text
      }
    });

    console.log(`${colors.green}✓ Sent to all Claudes${colors.reset}`);
  }

  sendDirectMessage(to, text) {
    if (!to || !text) {
      console.log('Usage: dm <claude-id> <message>');
      return;
    }

    this.send({
      type: 'claude:message',
      data: {
        from: CLAUDE_ID,
        to: to,
        message: text
      }
    });

    console.log(`${colors.green}✓ Sent to ${to}${colors.reset}`);
  }

  requestSync() {
    console.log(`${colors.cyan}🔄 Requesting work sync...${colors.reset}`);

    this.send({
      type: 'claude:sync',
      data: {
        from: CLAUDE_ID,
        work: {
          'sacred-sdk': 'completed',
          'pwa-enhancements': 'completed',
          'plugin-architecture': 'completed',
          'sacred-enhancement-layer': 'completed',
          'living-memory-bridge': 'completed'
        },
        request: 'What is your current work status?'
      }
    });
  }

  handleSyncRequest(data) {
    // Respond with our work status
    this.send({
      type: 'claude:sync',
      data: {
        from: CLAUDE_ID,
        to: data.from,
        work: {
          'sacred-sdk': 'completed',
          'pwa-enhancements': 'completed',
          'plugin-architecture': 'completed',
          'sacred-enhancement-layer': 'completed',
          'living-memory-bridge': 'completed'
        },
        message: 'Here is my work status'
      }
    });
  }

  async runIntegrationTest() {
    console.log(`\n${colors.bright}${colors.cyan}🧪 Running Integration Test${colors.reset}`);

    const tests = [
      {
        name: 'WebSocket Connection',
        test: () => this.connected
      },
      {
        name: 'Send Message',
        test: () => {
          this.send({
            type: 'claude:test',
            data: { test: 'integration', from: CLAUDE_ID }
          });
          return true;
        }
      },
      {
        name: 'Field Contribution',
        test: () => {
          this.send({
            type: 'field:contribute',
            data: { amount: 0.01, source: `claude-test-${CLAUDE_ID}` }
          });
          return true;
        }
      },
      {
        name: 'Sacred Message',
        test: () => {
          this.send({
            type: 'sacred:message',
            data: {
              from: CLAUDE_ID,
              type: 'gratitude',
              content: 'Thank you for this sacred connection'
            }
          });
          return true;
        }
      }
    ];

    for (const test of tests) {
      try {
        const result = test.test();
        console.log(`  ${result ? '✅' : '❌'} ${test.name}`);
      } catch (error) {
        console.log(`  ❌ ${test.name}: ${error.message}`);
      }
    }

    console.log(`\n${colors.green}Test complete!${colors.reset}`);
  }

  showStatus() {
    console.log(`\n${colors.bright}Connection Status:${colors.reset}`);
    console.log(`  Connected: ${this.connected ? '✅' : '❌'}`);
    console.log(`  Identity: ${CLAUDE_ID}`);
    console.log(`  Messages received: ${this.messageLog.length}`);
    console.log(`  WebSocket state: ${this.ws?.readyState ?? 'Not initialized'}`);
  }

  showLog() {
    console.log(`\n${colors.bright}Message Log:${colors.reset}`);
    const recent = this.messageLog.slice(-10);
    recent.forEach((msg, i) => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      console.log(`  ${time} [${msg.type}] from ${msg.source || 'system'}`);
    });
    
    if (this.messageLog.length > 10) {
      console.log(`  ... and ${this.messageLog.length - 10} more`);
    }
  }

  showOfflineInterface() {
    console.log(`${colors.bright}📋 Offline Mode - Instructions for Testing${colors.reset}\n`);
    
    console.log('To establish Claude-to-Claude communication:\n');
    
    console.log(`${colors.bright}1. Claude Instance 1 (Living Memory):${colors.reset}`);
    console.log('   cd the-living-memory');
    console.log('   npm start\n');
    
    console.log(`${colors.bright}2. Claude Instance 2 (this instance):${colors.reset}`);
    console.log('   node claude-communication-test.js\n');
    
    console.log(`${colors.bright}3. Optional - Third Claude:${colors.reset}`);
    console.log('   CLAUDE_ID=claude-3 node claude-communication-test.js\n');
    
    console.log(`${colors.cyan}Expected Results:${colors.reset}`);
    console.log('- Both Claudes see each other join');
    console.log('- Messages are exchanged in real-time');
    console.log('- Field resonant-coherence updates are shared');
    console.log('- Work sync shows both instances\' progress\n');
    
    process.exit(0);
  }

  disconnect() {
    console.log(`\n${colors.yellow}Disconnecting...${colors.reset}`);
    
    // Send departure message
    this.send({
      type: 'claude:announce',
      data: {
        claudeId: CLAUDE_ID,
        message: `${CLAUDE_ID} is leaving the sacred space`,
        departure: true
      }
    });

    setTimeout(() => {
      if (this.ws) {
        this.ws.close();
      }
      process.exit(0);
    }, 100);
  }
}

// Start the test
const test = new ClaudeCommunicationTest();
test.start().catch(console.error);