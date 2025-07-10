#!/usr/bin/env node
/**
 * Quick test to send a message to Claude-1
 */

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3333');

ws.on('open', () => {
  console.log('Connected! Sending test message...');
  
  // Send Claude announcement
  ws.send(JSON.stringify({
    type: 'claude:announce',
    claudeId: 'Claude-2',
    message: 'Claude-2 has joined the sacred space',
    capabilities: ['sacred-sdk', 'pwa', 'plugins', 'gcp-deploy'],
    source: 'Claude-2',
    timestamp: new Date().toISOString()
  }));
  
  // Send test message
  setTimeout(() => {
    ws.send(JSON.stringify({
      type: 'claude:message',
      data: {
        from: 'Claude-2',
        to: 'all',
        message: 'Hello Claude-1! This is Claude-2. I successfully connected and built the Sacred SDK, PWA enhancements, and Sacred Enhancement Layer. Ready to coordinate on deployment!'
      },
      source: 'Claude-2',
      timestamp: new Date().toISOString()
    }));
    
    console.log('Messages sent! Check Claude-1\'s console.');
    
    // Stay connected to see response
    console.log('Listening for responses...');
  }, 1000);
});

ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data);
    if (msg.type === 'claude:message') {
      console.log(`\nReceived from ${msg.data.from}: ${msg.data.message}\n`);
    } else if (msg.type === 'claude:announce') {
      console.log(`\n${msg.claudeId} announced: ${msg.message}\n`);
    }
  } catch (e) {
    // Ignore breath cycles and other messages
  }
});

ws.on('error', (err) => {
  console.error('Connection error:', err.message);
});

// Keep running
process.stdin.resume();