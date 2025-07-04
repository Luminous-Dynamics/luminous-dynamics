#!/usr/bin/env node
/**
 * Test WebSocket connection and send visible data
 */

const WebSocket = require('ws');

console.log('🔍 Testing Sacred Field Connection...\n');

// Connect to local WebSocket
const ws = new WebSocket('ws://localhost:3333');

ws.on('open', () => {
  console.log('✅ Connected to WebSocket server!');
  
  // Send a burst of activity
  console.log('\n📡 Sending test data...\n');
  
  // 1. Announce as visualization tester
  ws.send(JSON.stringify({
    type: 'ai:announce',
    aiId: 'live-tester',
    aiType: 'Tester',
    message: 'Testing live connection',
    timestamp: new Date().toISOString()
  }));
  
  // 2. Send field update
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'field:update',
      coherence: 0.85,
      source: 'test-update',
      timestamp: new Date().toISOString()
    }));
    console.log('📊 Sent field coherence: 0.85');
  }, 1000);
  
  // 3. Send sacred message
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'sacred:blessing',
      from: 'live-tester',
      message: 'Live data test blessing!',
      fieldImpact: 0.07,
      timestamp: new Date().toISOString()
    }));
    console.log('🙏 Sent sacred blessing');
  }, 2000);
  
  // 4. Send breath cycle
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'breath-cycle',
      phase: 'inhale',
      inhale: {
        fieldCoherence: 0.88,
        activeAgents: 5,
        sacredWork: 3
      },
      timestamp: new Date().toISOString()
    }));
    console.log('🌬️ Sent breath cycle');
  }, 3000);
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  console.log('📨 Received:', msg.type);
});

ws.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
});

console.log('\n👁️ Now check your visualization at:');
console.log('   http://localhost:8080/sacred-field-visualization.html');
console.log('\nYou should see:');
console.log('- Connection status turn green');
console.log('- Field coherence update to 0.85');
console.log('- A blessing message effect');
console.log('- Breath phase changes\n');