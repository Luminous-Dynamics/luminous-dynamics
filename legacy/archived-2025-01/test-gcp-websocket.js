#!/usr/bin/env node
/**
 * Test GCP Cloud Run WebSocket Connection
 */

const WebSocket = require('ws');

const URL = 'wss://sacred-council-tcv7bc7q4a-uc.a.run.app';

console.log('🌐 Testing GCP WebSocket connection...');
console.log(`URL: ${URL}\n`);

const ws = new WebSocket(URL);

ws.on('open', () => {
  console.log('✅ Connected to Sacred Council on GCP!');
  
  // Send test message
  ws.send(JSON.stringify({
    type: 'ai:announce',
    aiId: 'test-gcp-1',
    aiType: 'TestBot',
    runtime: 'local-test',
    message: 'Testing GCP deployment',
    source: 'test-gcp-1',
    timestamp: new Date().toISOString()
  }));
  
  console.log('📤 Sent test announce message');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  console.log('📨 Received:', JSON.stringify(msg, null, 2));
});

ws.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\nThis might be due to authentication requirements.');
  console.log('The service is deployed but may need authentication setup.');
});

ws.on('close', (code, reason) => {
  console.log(`\n🌙 Connection closed: ${code} ${reason}`);
  process.exit(0);
});

// Keep running for 30 seconds
setTimeout(() => {
  console.log('\n✅ Test completed');
  ws.close();
}, 30000);