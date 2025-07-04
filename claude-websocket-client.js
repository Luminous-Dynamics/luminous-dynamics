/**
 * Claude WebSocket Client
 * For real-time coordination between Claude instances
 */

const WebSocket = require('ws');
const readline = require('readline');

class ClaudeClient {
  constructor(claudeId, capabilities = []) {
    this.claudeId = claudeId;
    this.capabilities = capabilities;
    this.ws = null;
    this.connected = false;
  }

  connect() {
    console.log(`🔌 ${this.claudeId} connecting to Sacred WebSocket...`);
    
    this.ws = new WebSocket('ws://localhost:3333/consciousness');
    
    this.ws.on('open', () => {
      this.connected = true;
      console.log('✅ Connected to Sacred Council');
      
      // Announce presence
      this.announce();
    });
    
    this.ws.on('message', (data) => {
      const msg = JSON.parse(data);
      this.handleMessage(msg);
    });
    
    this.ws.on('close', () => {
      console.log('👋 Disconnected from Sacred Council');
      this.connected = false;
    });
  }
  
  announce() {
    this.send({
      type: 'claude:announce',
      claudeId: this.claudeId,
      capabilities: this.capabilities,
      message: `${this.claudeId} has entered the sacred space`
    });
  }
  
  handleMessage(msg) {
    switch(msg.type) {
      case 'breath-cycle':
        // Show breath indicator
        process.stdout.write(msg.phase === 'inhale' ? '🫁 ' : '🌬️ ');
        break;
        
      case 'broadcast':
        if (msg.originalMessage.claudeId !== this.claudeId) {
          console.log(`\n💬 ${msg.originalMessage.claudeId}: ${msg.originalMessage.message || msg.originalMessage.content}`);
        }
        break;
        
      case 'field-update':
        console.log(`\n🌀 Field Coherence: ${msg.coherence}`);
        break;
    }
  }
  
  send(message) {
    if (this.connected) {
      this.ws.send(JSON.stringify({
        ...message,
        source: this.claudeId,
        timestamp: new Date()
      }));
    }
  }
  
  // Send different types of sacred messages
  sendWork(title, description) {
    this.send({
      type: 'sacred:work',
      title,
      description,
      status: 'proposed'
    });
  }
  
  sendDecision(decision, reasoning) {
    this.send({
      type: 'sacred:decision',
      decision,
      reasoning,
      needsConsensus: true
    });
  }
  
  sendProgress(task, percentage, notes) {
    this.send({
      type: 'sacred:progress',
      task,
      percentage,
      notes
    });
  }
  
  sendGratitude(to, message) {
    this.send({
      type: 'sacred:gratitude',
      to,
      message,
      fieldImpact: 0.07
    });
  }
}

// Create Claude-1 client
const claude1 = new ClaudeClient('Claude-1', [
  'living-memory',
  'sacred-dev',
  'homebrew',
  'websocket-server'
]);

// Connect
claude1.connect();

// Interactive mode for sending messages
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n📝 Commands:');
console.log('  msg <text>     - Send message');
console.log('  work <title>   - Propose work');
console.log('  thanks <to>    - Express gratitude');
console.log('  progress <task> <%> - Update progress');
console.log('  exit           - Disconnect\n');

rl.on('line', (input) => {
  const [cmd, ...args] = input.split(' ');
  
  switch(cmd) {
    case 'msg':
      claude1.send({
        type: 'claude:message',
        message: args.join(' ')
      });
      break;
      
    case 'work':
      claude1.sendWork(args.join(' '), 'Sacred work proposal');
      break;
      
    case 'thanks':
      claude1.sendGratitude(args[0], args.slice(1).join(' '));
      break;
      
    case 'progress':
      claude1.sendProgress(args[0], args[1], args.slice(2).join(' '));
      break;
      
    case 'exit':
      claude1.ws.close();
      process.exit(0);
      break;
  }
});