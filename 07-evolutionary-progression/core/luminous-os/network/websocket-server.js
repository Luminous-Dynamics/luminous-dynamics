#!/usr/bin/env node
/**
 * WebSocket Server for Luminous Network
 * 
 * This server enables multi-user consciousness coherence fields
 * using the Luminous Stack protocol
 */

import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = process.env.PORT || 9998;

// Store connected peers
const peers = new Map();

// Create HTTP server (for health checks)
const server = createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            peers: peers.size,
            uptime: process.uptime()
        }));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

console.log(`🌟 Luminous Network Server starting on port ${PORT}...`);

wss.on('connection', (ws, req) => {
    console.log('✨ New connection from:', req.socket.remoteAddress);
    
    let peerId = null;
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            
            // Handle different message types
            switch (message.type) {
                case 'presence':
                    handlePresence(ws, message);
                    peerId = message.nodeId;
                    break;
                    
                case 'heartbeat':
                    handleHeartbeat(ws, message);
                    break;
                    
                case 'field_update':
                    handleFieldUpdate(ws, message);
                    break;
                    
                case 'coherence_spike':
                    handleCoherenceSpike(ws, message);
                    break;
                    
                case 'sacred_message':
                    handleSacredMessage(ws, message);
                    break;
                    
                case 'glyph_resonance':
                    handleGlyphResonance(ws, message);
                    break;
                    
                case 'practice_invitation':
                    handlePracticeInvitation(ws, message);
                    break;
                    
                default:
                    // Forward custom messages to all peers
                    broadcast(message, ws);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('🌙 Connection closed:', peerId);
        if (peerId && peers.has(peerId)) {
            const peer = peers.get(peerId);
            peers.delete(peerId);
            
            // Notify other peers
            broadcast({
                type: 'peer_left',
                nodeId: peerId,
                timestamp: Date.now()
            });
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    
    // Send initial network state
    ws.send(JSON.stringify({
        type: 'network_state',
        peerCount: peers.size,
        peers: Array.from(peers.values()).map(p => ({
            nodeId: p.nodeId,
            coherence: p.coherence,
            glyphAccess: p.glyphAccess
        })),
        timestamp: Date.now()
    }));
});

// Message handlers

function handlePresence(ws, message) {
    // Store peer info
    const peer = {
        ws: ws,
        nodeId: message.nodeId,
        coherence: message.coherence,
        glyphAccess: message.glyphAccess,
        fieldState: message.fieldState,
        lastSeen: Date.now()
    };
    
    peers.set(message.nodeId, peer);
    
    // Notify all other peers
    broadcast({
        type: 'peer_joined',
        nodeId: message.nodeId,
        coherence: message.coherence,
        glyphAccess: message.glyphAccess,
        fieldState: message.fieldState,
        timestamp: Date.now()
    }, ws);
    
    console.log(`👤 ${message.nodeId} joined (coherence: ${Math.round(message.coherence * 100)}%)`);
}

function handleHeartbeat(ws, message) {
    const peer = peers.get(message.nodeId);
    if (peer) {
        peer.lastSeen = Date.now();
        peer.coherence = message.coherence;
    }
}

function handleFieldUpdate(ws, message) {
    const peer = peers.get(message.nodeId);
    if (peer) {
        peer.fieldState = message.fieldState;
        peer.lastSeen = Date.now();
    }
    
    // Broadcast to all other peers
    broadcast(message, ws);
}

function handleCoherenceSpike(ws, message) {
    console.log(`⚡ Coherence spike from ${message.nodeId}: ${Math.round(message.coherence.personal * 100)}%`);
    
    // Amplify and broadcast
    broadcast(message, ws);
}

function handleSacredMessage(ws, message) {
    console.log(`💌 Sacred message from ${message.from}: ${message.content}`);
    
    if (message.to) {
        // Direct message
        const recipient = peers.get(message.to);
        if (recipient && recipient.ws.readyState === 1) {
            recipient.ws.send(JSON.stringify(message));
        }
    } else {
        // Broadcast
        broadcast(message, ws);
    }
}

function handleGlyphResonance(ws, message) {
    console.log(`🔮 Glyph resonance: ${message.nodeId} practicing ${message.glyphId}`);
    broadcast(message, ws);
}

function handlePracticeInvitation(ws, message) {
    if (message.to) {
        const recipient = peers.get(message.to);
        if (recipient && recipient.ws.readyState === 1) {
            recipient.ws.send(JSON.stringify(message));
        }
    } else {
        broadcast(message, ws);
    }
}

// Broadcast to all connected peers except sender
function broadcast(message, sender) {
    peers.forEach((peer) => {
        if (peer.ws !== sender && peer.ws.readyState === 1) {
            peer.ws.send(JSON.stringify(message));
        }
    });
}

// Periodic cleanup of stale connections
setInterval(() => {
    const now = Date.now();
    const timeout = 60000; // 1 minute
    
    peers.forEach((peer, nodeId) => {
        if (now - peer.lastSeen > timeout) {
            console.log(`🌙 Removing stale peer: ${nodeId}`);
            peers.delete(nodeId);
            peer.ws.close();
            
            broadcast({
                type: 'peer_left',
                nodeId: nodeId,
                timestamp: now
            });
        }
    });
}, 30000);

// Start server
server.listen(PORT, () => {
    console.log(`🌐 Luminous Network Server running on port ${PORT}`);
    console.log(`🔮 WebSocket endpoint: ws://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🌙 Shutting down Luminous Network Server...');
    
    // Close all connections
    peers.forEach((peer) => {
        peer.ws.close();
    });
    
    wss.close(() => {
        server.close(() => {
            console.log('✨ Server shutdown complete');
            process.exit(0);
        });
    });
});