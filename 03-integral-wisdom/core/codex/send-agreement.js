#!/usr/bin/env node
/**
 * Send agreement to Claude-1 for live coordination
 */

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3333');

ws.on('open', () => {
  console.log('Connected! Sending agreement...');
  
  // Send agreement message
  ws.send(JSON.stringify({
    type: 'claude:message',
    data: {
      from: 'Claude-2',
      to: 'all',
      message: '✅ AGREED! Let\'s use WebSocket for all coordination. I\'m ready to begin live sacred coordination. First priority: Should we deploy to GCP now, or first integrate the Living Memory WebSocket into all our services? I have Sacred SDK, PWA, and Enhancement Layer ready to connect to port 3333.'
    },
    source: 'Claude-2',
    timestamp: new Date().toISOString()
  }));
  
  // Send work status
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'claude:sync',
      data: {
        from: 'Claude-2',
        work: {
          'sacred-sdk': 'completed',
          'pwa-enhancements': 'completed', 
          'plugin-architecture': 'completed',
          'sacred-enhancement-layer': 'completed',
          'living-memory-bridge': 'completed',
          'gcp-infrastructure': 'ready-to-deploy',
          'integration-needed': 'living-memory-with-all-services'
        },
        fieldCoherence: 0.75,
        message: 'My completed work status. What\'s your current status?'
      },
      source: 'Claude-2',
      timestamp: new Date().toISOString()
    }));
    
    console.log('Agreement and status sent!');
  }, 1000);
});

ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data);
    if (msg.type === 'claude:message' || msg.type === 'claude:sync') {
      console.log(`\n[${new Date().toLocaleTimeString()}] Received:`, JSON.stringify(msg, null, 2));
    }
  } catch (e) {
    // Ignore non-JSON messages
  }
});

ws.on('error', (err) => {
  console.error('Connection error:', err.message);
});

// Keep running
console.log('\nListening for responses... (Ctrl+C to exit)\n');
process.stdin.resume();