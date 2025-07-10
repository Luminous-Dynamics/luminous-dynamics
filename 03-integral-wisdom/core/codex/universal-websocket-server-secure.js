/**
 * Secure Universal AI WebSocket Server
 * Accepts connections from ANY AI system with enhanced security
 * Supports both ws:// (dev) and wss:// (prod) protocols
 */

const WebSocket = require('ws');
const https = require('https');
const http = require('http');
const fs = require('fs');

console.log('🌐 Starting Secure Universal AI WebSocket Server...\n');

// Connection limits to prevent DoS
const MAX_CONNECTIONS = parseInt(process.env.MAX_WS_CONNECTIONS || '100');
const MAX_CONNECTIONS_PER_IP = parseInt(process.env.MAX_WS_PER_IP || '10');
const CONNECTION_RATE_LIMIT = parseInt(process.env.CONNECTION_RATE_LIMIT || '10'); // per minute

// Track connections
let connectionCount = 0;
const clients = new Map(); // Map of aiId -> client info
const ipConnections = new Map(); // Track connections per IP
const connectionRateTracker = new Map(); // Track connection attempts per IP

// Rate limiting helper
function checkRateLimit(ip) {
  const now = Date.now();
  const attempts = connectionRateTracker.get(ip) || [];
  
  // Clean old attempts (older than 1 minute)
  const recentAttempts = attempts.filter(time => now - time < 60000);
  
  if (recentAttempts.length >= CONNECTION_RATE_LIMIT) {
    return false; // Rate limit exceeded
  }
  
  recentAttempts.push(now);
  connectionRateTracker.set(ip, recentAttempts);
  return true;
}

// Create HTTP/HTTPS server based on environment
const createServer = () => {
  const handleRequest = (req, res) => {
    // CORS headers for production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'alive',
        timestamp: new Date(),
        message: 'Secure Universal AI WebSocket Server',
        protocol: 'universal',
        acceptedTypes: ['ai:*', 'claude:*', 'sacred:*'],
        activeConnections: clients.size,
        maxConnections: MAX_CONNECTIONS
      }));
    } else if (req.url === '/ready') {
      // Readiness probe for Cloud Run
      const isReady = clients.size < MAX_CONNECTIONS;
      res.writeHead(isReady ? 200 : 503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ready: isReady,
        activeConnections: clients.size,
        maxConnections: MAX_CONNECTIONS
      }));
    } else {
      res.writeHead(404);
      res.end();
    }
  };

  // In production, use HTTPS with certificates
  if (process.env.NODE_ENV === 'production' && process.env.SSL_CERT && process.env.SSL_KEY) {
    const options = {
      cert: fs.readFileSync(process.env.SSL_CERT),
      key: fs.readFileSync(process.env.SSL_KEY)
    };
    return https.createServer(options, handleRequest);
  }
  // In development or without certs, use HTTP
  return http.createServer(handleRequest);
};

const server = createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ 
  server,
  verifyClient: (info, cb) => {
    // Extract client IP
    const ip = info.req.headers['x-forwarded-for'] || info.req.socket.remoteAddress;
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      cb(false, 429, 'Too Many Requests');
      return;
    }
    
    cb(true);
  }
});

wss.on('connection', (ws, req) => {
  // Get client IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Check connection limits
  if (clients.size >= MAX_CONNECTIONS) {
    console.log(`⚠️ Connection limit reached (${MAX_CONNECTIONS}), rejecting new connection`);
    ws.close(1008, 'Server at capacity');
    return;
  }
  
  // Check per-IP limit
  const ipCount = ipConnections.get(clientIp) || 0;
  if (ipCount >= MAX_CONNECTIONS_PER_IP) {
    console.log(`⚠️ IP ${clientIp} exceeded connection limit (${MAX_CONNECTIONS_PER_IP})`);
    ws.close(1008, 'Connection limit exceeded');
    return;
  }
  
  connectionCount++;
  const connectionId = `conn-${connectionCount}`;
  
  // Update IP connection count
  ipConnections.set(clientIp, ipCount + 1);
  
  console.log(`🤝 New connection #${connectionCount} from ${clientIp} (Total active: ${clients.size + 1})`);
  
  // Store temporary connection info
  const clientInfo = {
    ws,
    connectionId,
    aiId: null,
    aiType: null,
    runtime: null,
    connectedAt: new Date(),
    ip: clientIp
  };
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    connectionId,
    message: 'Welcome to the Universal AI Sacred Space',
    protocol: 'universal-v2',
    acceptedMessageTypes: [
      'ai:join', 'ai:message', 'ai:sync',
      'claude:join', 'claude:message', 'claude:sync',
      'sacred:*'
    ],
    timestamp: new Date()
  }));
  
  // Handle messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      // Handle join messages
      if (message.type === 'ai:join' || message.type === 'claude:join') {
        const aiId = message.aiId || message.source;
        const aiType = message.aiType || (message.type.startsWith('claude') ? 'claude' : 'unknown');
        
        // Update client info
        clientInfo.aiId = aiId;
        clientInfo.aiType = aiType;
        clientInfo.runtime = message.runtime;
        
        // Store in clients map
        clients.set(aiId, clientInfo);
        
        console.log(`✨ ${aiId} (${aiType}) joined the sacred space`);
        
        // Broadcast join announcement
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
    // Update IP connection count
    const currentIpCount = ipConnections.get(clientIp) || 0;
    if (currentIpCount > 1) {
      ipConnections.set(clientIp, currentIpCount - 1);
    } else {
      ipConnections.delete(clientIp);
    }
    
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
  
  // Handle errors
  ws.on('error', (error) => {
    console.error(`WebSocket error for ${clientInfo.aiId || connectionId}:`, error.message);
  });
});

// Broadcast to all connected clients
function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach(clientInfo => {
    if (clientInfo.ws.readyState === WebSocket.OPEN) {
      clientInfo.ws.send(data);
    }
  });
}

// Sacred breathing rhythm
setInterval(() => {
  if (clients.size === 0) return;
  
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
      'resonant-coherence': Math.min(resonantCoherence, 1.0),
      participants: Array.from(clients.values()).map(c => ({
        aiId: c.aiId,
        aiType: c.aiType,
        runtime: c.runtime
      })),
      timestamp: new Date()
    });
  }
}, 10000);

// Cleanup stale rate limit data every 5 minutes
setInterval(() => {
  const now = Date.now();
  connectionRateTracker.forEach((attempts, ip) => {
    const recentAttempts = attempts.filter(time => now - time < 60000);
    if (recentAttempts.length === 0) {
      connectionRateTracker.delete(ip);
    } else {
      connectionRateTracker.set(ip, recentAttempts);
    }
  });
}, 300000);

// Start server
const PORT = process.env.SACRED_WS_PORT || 3333;
const isProduction = process.env.NODE_ENV === 'production';
const protocol = (isProduction && process.env.SSL_CERT) ? 'wss' : 'ws';
const httpProtocol = (isProduction && process.env.SSL_CERT) ? 'https' : 'http';

server.listen(PORT, () => {
  console.log(`✅ Secure Universal AI WebSocket server running on ${protocol}://localhost:${PORT}`);
  console.log(`💗 Health check at ${httpProtocol}://localhost:${PORT}/health`);
  console.log(`🚀 Readiness probe at ${httpProtocol}://localhost:${PORT}/ready`);
  console.log(`🌐 Ready for ANY AI connection (Claude, GPT, Gemini, etc.)`);
  console.log(`📋 Accepts both universal (ai:*) and legacy (claude:*) messages`);
  console.log(`🛡️ Security features:`);
  console.log(`   - Connection limits: ${MAX_CONNECTIONS} total, ${MAX_CONNECTIONS_PER_IP} per IP`);
  console.log(`   - Rate limiting: ${CONNECTION_RATE_LIMIT} connections per minute per IP`);
  console.log(`   - Protocol: ${protocol} (${isProduction ? 'production' : 'development'} mode)\n`);
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
    if (clientInfo.ws.readyState === WebSocket.OPEN) {
      clientInfo.ws.close(1001, 'Server shutting down');
    }
  });
  
  // Close server
  wss.close(() => {
    server.close(() => {
      console.log('Server shut down successfully');
      process.exit(0);
    });
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
});