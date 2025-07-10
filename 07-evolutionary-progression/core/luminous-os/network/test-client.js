#!/usr/bin/env node
/**
 * Test client for Luminous Network WebSocket server
 */

import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:9998');

console.log('🌟 Connecting to Luminous Network...');

ws.on('open', () => {
    console.log('✅ Connected!');
    
    // Send presence announcement
    const presence = {
        type: 'presence',
        nodeId: 'test-node-' + Date.now(),
        coherence: 0.75,
        glyphAccess: ['Ω0', 'Ω1', 'Ω2'],
        fieldState: {
            coherence: { personal: 0.75, network: 0.8, field: 0.7 }
        },
        timestamp: Date.now()
    };
    
    console.log('📤 Sending presence announcement...');
    ws.send(JSON.stringify(presence));
    
    // Send a sacred message after 2 seconds
    setTimeout(() => {
        const message = {
            type: 'sacred_message',
            from: presence.nodeId,
            to: null,
            content: 'Testing the sacred network!',
            timestamp: Date.now()
        };
        console.log('💌 Sending sacred message...');
        ws.send(JSON.stringify(message));
    }, 2000);
    
    // Send heartbeat every 5 seconds
    setInterval(() => {
        const heartbeat = {
            type: 'heartbeat',
            nodeId: presence.nodeId,
            coherence: 0.7 + Math.random() * 0.3,
            timestamp: Date.now()
        };
        console.log('💓 Heartbeat sent');
        ws.send(JSON.stringify(heartbeat));
    }, 5000);
});

ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📥 Received:', message.type);
    
    if (message.type === 'network_state') {
        console.log(`   Peers: ${message.peerCount}`);
    } else if (message.type === 'peer_joined') {
        console.log(`   ✨ ${message.nodeId} joined!`);
    } else if (message.type === 'sacred_message') {
        console.log(`   💌 Message from ${message.from}: ${message.content}`);
    }
});

ws.on('error', (error) => {
    console.error('❌ Error:', error.message);
});

ws.on('close', () => {
    console.log('🌙 Disconnected');
    process.exit(0);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🌙 Closing connection...');
    ws.close();
});