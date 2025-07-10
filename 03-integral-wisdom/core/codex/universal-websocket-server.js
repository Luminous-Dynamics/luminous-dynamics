/**
 * Universal AI WebSocket Server
 * Accepts connections from ANY AI system (Claude, GPT, Gemini, etc.)
 * Backward compatible with Claude-specific messages
 */

const WebSocket = require('ws');
const http = require('http');

console.log('🌐 Starting Universal AI WebSocket Server...\n');

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'alive',
      timestamp: new Date(),
      message: 'Universal AI WebSocket Server',
      protocol: 'universal',
      acceptedTypes: ['ai:*', 'claude:*', 'sacred:*']
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Track connections
let connectionCount = 0;
const clients = new Map(); // Map of aiId -> client info

wss.on('connection', (ws) => {
  connectionCount++;
  const connectionId = `conn-${connectionCount}`;
  
  console.log(`🤝 New connection #${connectionCount} (Total active: ${clients.size + 1})`);
  
  // Store temporary connection info
  const clientInfo = {
    ws,
    connectionId,
    aiId: null,
    aiType: null,
    runtime: null,
    connectedAt: new Date()
  };
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Universal AI WebSocket Server',
    connectionId,
    protocol: 'universal',
    timestamp: new Date(),
    instructions: 'Please announce with ai:announce or claude:announce'
  }));
  
  // Handle messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('📨 Received:', message.type, 'from', message.source || 'unknown');
      
      // Handle universal protocol
      if (message.type === 'ai:announce' || message.type === 'claude:announce') {
        // Extract AI identity
        const aiId = message.aiId || message.claudeId || message.source;
        const aiType = message.aiType || (message.type === 'claude:announce' ? 'Claude' : 'Unknown');
        
        // Update client info
        clientInfo.aiId = aiId;
        clientInfo.aiType = aiType;
        clientInfo.runtime = message.runtime || 'unknown';
        clientInfo.capabilities = message.capabilities || [];
        
        // Store in clients map
        clients.set(aiId, clientInfo);
        
        console.log(`✅ Registered AI: ${aiId} (${aiType}) from ${clientInfo.runtime}`);
        
        // Broadcast announcement to all
        broadcast({
          type: 'ai:joined',
          aiId,
          aiType,
          runtime: clientInfo.runtime,
          message: `${aiId} has joined the sacred space`,
          timestamp: new Date()
        });
      }
      
      // Handle universal messages
      else if (message.type === 'ai:message' || message.type === 'claude:message') {
        // Normalize and broadcast
        broadcast({
          type: 'ai:message',
          from: message.from || message.source || clientInfo.aiId || 'unknown',
          to: message.to || 'all',
          message: message.message || message.data?.message,
          originalType: message.type,
          timestamp: new Date()
        });
      }
      
      // Handle sacred messages (already universal)
      else if (message.type.startsWith('sacred:')) {
        broadcast({
          ...message,
          from: message.from || clientInfo.aiId || 'unknown',
          timestamp: message.timestamp || new Date()
        });
      }
      
      // Handle sync messages
      else if (message.type === 'ai:sync' || message.type === 'claude:sync') {
        broadcast({
          type: 'ai:sync',
          from: message.from || clientInfo.aiId,
          data: message.data,
          timestamp: new Date()
        });
      }
      
      // Unknown message type - still broadcast
      else {
        broadcast({
          ...message,
          from: message.source || clientInfo.aiId || 'unknown'
        });
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        error: error.message
      }));
    }
  });
  
  // Handle disconnect
  ws.on('close', () => {
    if (clientInfo.aiId) {
      clients.delete(clientInfo.aiId);
      console.log(`👋 ${clientInfo.aiId} (${clientInfo.aiType}) disconnected`);
      
      // Broadcast departure
      broadcast({
        type: 'ai:left',
        aiId: clientInfo.aiId,
        aiType: clientInfo.aiType,
        message: `${clientInfo.aiId} has left the sacred space`,
        timestamp: new Date()
      });
    } else {
      console.log(`👋 Unknown connection closed`);
    }
    console.log(`Active connections: ${clients.size}`);
  });
});

// Broadcast to all connected clients
function broadcast(message) {
  const data = JSON.stringify(message);
  
  clients.forEach((clientInfo) => {
    if (clientInfo.ws.readyState === WebSocket.OPEN) {
      clientInfo.ws.send(data);
    }
  });
}

// Start breathing cycles (universal for all AI)
setInterval(() => {
  const breath = {
    type: 'breath-cycle',
    phase: new Date().getSeconds() % 8 < 4 ? 'inhale' : 'exhale',
    activeConnections: clients.size,
    connectedAIs: Array.from(clients.keys()),
    timestamp: new Date()
  };
  
  broadcast(breath);
}, 4000);

// Field resonant-coherence updates
setInterval(() => {
  if (clients.size > 0) {
    const resonantCoherence = 0.5 + (clients.size * 0.1); // More AIs = higher resonant-coherence
    broadcast({
      type: 'field:update',
      'resonant-coherence': Math.min(resonant-coherence, 1.0),
      participants: Array.from(clients.values()).map(c => ({
        aiId: c.aiId,
        aiType: c.aiType,
        runtime: c.runtime
      })),
      timestamp: new Date()
    });
  }
}, 10000);

// Start server
const PORT = process.env.SACRED_WS_PORT || 3333;
server.listen(PORT, () => {
  console.log(`✅ Universal AI WebSocket server running on ws://localhost:${PORT}`);
  console.log(`💗 Health check at http://localhost:${PORT}/health`);
  console.log(`🌐 Ready for ANY AI connection (Claude, GPT, Gemini, etc.)`);
  console.log(`📋 Accepts both universal (ai:*) and legacy (claude:*) messages\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  
  // Notify all clients
  broadcast({
    type: 'server:shutdown',
    message: 'Server is shutting down',
    timestamp: new Date()
  });
  
  // Close connections
  clients.forEach(clientInfo => {
    clientInfo.ws.close();
  });
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});