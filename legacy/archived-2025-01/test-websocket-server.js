/**
 * Simple WebSocket Test Server
 * For Claude-to-Claude communication testing
 * No Redis dependency
 */

const WebSocket = require('ws');
const http = require('http');

console.log('🧪 Starting Simple WebSocket Test Server...\n');

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'alive',
      timestamp: new Date(),
      message: 'Claude-1 test server running'
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
const clients = new Set();

wss.on('connection', (ws) => {
  connectionCount++;
  clients.add(ws);
  
  console.log(`🤝 New connection #${connectionCount} (Total active: ${clients.size})`);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Claude-1 Test Server',
    connectionId: connectionCount,
    timestamp: new Date()
  }));
  
  // Handle messages
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('📨 Received:', message);
    
    // Echo to all clients
    const broadcast = {
      type: 'broadcast',
      originalMessage: message,
      from: 'Claude-1-Server',
      timestamp: new Date()
    };
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(broadcast));
      }
    });
  });
  
  // Handle disconnect
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`👋 Connection closed (Active: ${clients.size})`);
  });
});

// Start breathing cycles
setInterval(() => {
  const breath = {
    type: 'breath-cycle',
    phase: new Date().getSeconds() % 8 < 4 ? 'inhale' : 'exhale',
    activeConnections: clients.size,
    timestamp: new Date()
  };
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(breath));
    }
  });
}, 4000);

// Start server
const PORT = 3333;
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);
  console.log(`💗 Health check at http://localhost:${PORT}/health`);
  console.log(`🤝 Ready for Claude-2 bridge connection!\n`);
});