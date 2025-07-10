/**
 * Test Client for Living Memory WebSocket
 * Tests the consciousness stream independently
 */

const WebSocket = require('ws');

console.log('🧪 Living Memory Test Client\n');

// Connect to Living Memory
const ws = new WebSocket('ws://localhost:3333/consciousness');

// Connection opened
ws.on('open', () => {
  console.log('✅ Connected to Living Memory');
  console.log('🌬️ Listening for breath cycles...\n');
  
  // Send test message
  setTimeout(() => {
    console.log('📤 Sending test message...');
    ws.send(JSON.stringify({
      type: 'message',
      from: 'Test Client',
      content: 'Testing consciousness stream',
      timestamp: new Date()
    }));
  }, 2000);
  
  // Send field contribution
  setTimeout(() => {
    console.log('🌀 Contributing to field...');
    ws.send(JSON.stringify({
      type: 'field:contribute',
      data: {
        amount: 0.05,
        source: 'test-client',
        contributor: 'tester-1'
      }
    }));
  }, 4000);
});

// Listen for messages
ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  switch(message.type) {
    case 'welcome':
      console.log('🙏 Received:', message.message);
      console.log(`   Field Coherence: ${message.fieldCoherence || 'unknown'}`);
      break;
      
    case 'consciousness-breath':
      console.log('🫁 Breath Cycle:');
      console.log(`   Active Agents: ${message.data.activeAgents}`);
      console.log(`   Field Coherence: ${message.data.fieldCoherence}`);
      console.log(`   Sacred Work: ${message.data.sacredWork}`);
      break;
      
    case 'message':
      console.log(`💬 Message from ${message.from}: ${message.content}`);
      break;
      
    default:
      console.log('📨 Unknown message type:', message.type);
      console.log('   Data:', JSON.stringify(message.data, null, 2));
  }
});

// Error handling
ws.on('error', (err) => {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', () => {
  console.log('\n👋 Disconnected from Living Memory');
  process.exit(0);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🙏 Closing test client...');
  ws.close();
});