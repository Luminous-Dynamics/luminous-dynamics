/**
 * Production-Ready Universal AI WebSocket Server
 * With connection limits, health checks, and structured logging
 */

const WebSocket = require('ws');
const http = require('http');

// Production configuration
const CONFIG = {
  PORT: process.env.PORT || 3333,
  MAX_CONNECTIONS: parseInt(process.env.MAX_CONNECTIONS || '100'),
  BREATH_CYCLE_INTERVAL: parseInt(process.env.BREATH_CYCLE_MS || '4000'),
  FIELD_UPDATE_INTERVAL: parseInt(process.env.FIELD_UPDATE_MS || '10000'),
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Structured logging for Cloud Logging
function log(severity, message, labels = {}) {
  if (CONFIG.NODE_ENV === 'production') {
    console.log(JSON.stringify({
      severity,
      message,
      timestamp: new Date().toISOString(),
      labels: {
        ...labels,
        service: 'sacred-council',
        version: process.env.K_REVISION || 'unknown'
      }
    }));
  } else {
    console.log(`[${severity}] ${message}`, labels);
  }
}

log('INFO', '🌐 Starting Production Universal AI WebSocket Server', CONFIG);

// Track connections with limits
const clients = new Map();
let totalConnectionsServed = 0;
let messagesProcessed = 0;

// Create HTTP server with health checks
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.url === '/health' || req.url === '/_ah/health') {
    // Basic health check
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      connections: {
        current: clients.size,
        max: CONFIG.MAX_CONNECTIONS,
        total_served: totalConnectionsServed
      },
      messages_processed: messagesProcessed
    }));
  } else if (req.url === '/_ah/ready') {
    // Readiness check for load balancing
    const isReady = clients.size < CONFIG.MAX_CONNECTIONS * 0.9;
    res.writeHead(isReady ? 200 : 503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: isReady ? 'ready' : 'at-capacity',
      capacity: `${clients.size}/${CONFIG.MAX_CONNECTIONS}`
    }));
  } else if (req.url === '/metrics') {
    // Prometheus-style metrics
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`
# HELP websocket_connections_current Current WebSocket connections
# TYPE websocket_connections_current gauge
websocket_connections_current ${clients.size}

# HELP websocket_connections_total Total WebSocket connections served
# TYPE websocket_connections_total counter
websocket_connections_total ${totalConnectionsServed}

# HELP websocket_messages_total Total messages processed
# TYPE websocket_messages_total counter
websocket_messages_total ${messagesProcessed}
    `.trim());
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Create WebSocket server
const wss = new WebSocket.Server({ 
  server,
  // Verify client on connection
  verifyClient: (info, cb) => {
    if (clients.size >= CONFIG.MAX_CONNECTIONS) {
      cb(false, 503, 'Server at capacity');
      log('WARN', 'Connection rejected - at capacity', { 
        current: clients.size,
        max: CONFIG.MAX_CONNECTIONS 
      });
    } else {
      cb(true);
    }
  }
});

// Connection handler
wss.on('connection', (ws, req) => {
  totalConnectionsServed++;
  const connectionId = `conn-${totalConnectionsServed}`;
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  log('INFO', 'New connection', { 
    connectionId, 
    clientIp,
    current_total: clients.size + 1 
  });
  
  // Client info
  const clientInfo = {
    ws,
    connectionId,
    aiId: null,
    aiType: null,
    runtime: null,
    connectedAt: new Date(),
    lastActivity: new Date(),
    messageCount: 0
  };
  
  // Send welcome
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Universal AI WebSocket Server (Production)',
    connectionId,
    protocol: 'universal',
    timestamp: new Date(),
    server_info: {
      capacity: `${clients.size + 1}/${CONFIG.MAX_CONNECTIONS}`,
      env: CONFIG.NODE_ENV
    }
  }));
  
  // Message handler
  ws.on('message', (data) => {
    try {
      messagesProcessed++;
      clientInfo.lastActivity = new Date();
      clientInfo.messageCount++;
      
      const message = JSON.parse(data);
      
      // Rate limiting check
      if (clientInfo.messageCount > 100 && 
          (Date.now() - clientInfo.connectedAt.getTime()) < 60000) {
        log('WARN', 'Rate limit warning', { 
          aiId: clientInfo.aiId,
          messages_per_min: clientInfo.messageCount 
        });
      }
      
      // Handle announce
      if (message.type === 'ai:announce' || message.type === 'claude:announce') {
        const aiId = message.aiId || message.claudeId || message.source;
        clientInfo.aiId = aiId;
        clientInfo.aiType = message.aiType || 'Unknown';
        clientInfo.runtime = message.runtime || 'unknown';
        
        clients.set(aiId, clientInfo);
        
        log('INFO', 'AI registered', {
          aiId,
          aiType: clientInfo.aiType,
          runtime: clientInfo.runtime
        });
        
        // Broadcast join
        broadcast({
          type: 'ai:joined',
          aiId,
          aiType: clientInfo.aiType,
          runtime: clientInfo.runtime,
          timestamp: new Date()
        }, aiId);
      }
      
      // Handle other messages
      else {
        broadcast({
          ...message,
          from: message.from || clientInfo.aiId || 'unknown',
          timestamp: message.timestamp || new Date()
        });
      }
      
    } catch (error) {
      log('ERROR', 'Message processing error', { 
        error: error.message,
        connectionId 
      });
    }
  });
  
  // Disconnect handler
  ws.on('close', () => {
    if (clientInfo.aiId) {
      clients.delete(clientInfo.aiId);
      log('INFO', 'AI disconnected', {
        aiId: clientInfo.aiId,
        duration: Date.now() - clientInfo.connectedAt.getTime(),
        messages: clientInfo.messageCount
      });
      
      // Broadcast departure
      broadcast({
        type: 'ai:left',
        aiId: clientInfo.aiId,
        timestamp: new Date()
      });
    }
  });
  
  // Error handler
  ws.on('error', (error) => {
    log('ERROR', 'WebSocket error', { 
      error: error.message,
      aiId: clientInfo.aiId 
    });
  });
});

// Broadcast with error handling
function broadcast(message, excludeId = null) {
  const data = JSON.stringify(message);
  let sent = 0;
  
  clients.forEach((clientInfo, aiId) => {
    if (aiId !== excludeId && clientInfo.ws.readyState === WebSocket.OPEN) {
      try {
        clientInfo.ws.send(data);
        sent++;
      } catch (error) {
        log('ERROR', 'Broadcast error', { error: error.message, aiId });
      }
    }
  });
  
  return sent;
}

// Breath cycles - only if clients connected
let breathInterval;
function startBreathCycles() {
  if (breathInterval) return;
  
  breathInterval = setInterval(() => {
    if (clients.size > 0) {
      const breath = {
        type: 'breath-cycle',
        phase: new Date().getSeconds() % 8 < 4 ? 'inhale' : 'exhale',
        activeConnections: clients.size,
        timestamp: new Date()
      };
      
      broadcast(breath);
    }
  }, CONFIG.BREATH_CYCLE_INTERVAL);
}

// Field updates - adaptive frequency
let fieldInterval;
function startFieldUpdates() {
  if (fieldInterval) return;
  
  fieldInterval = setInterval(() => {
    if (clients.size > 0) {
      const coherence = Math.min(0.5 + (clients.size * 0.1), 1.0);
      broadcast({
        type: 'field:update',
        coherence,
        participants: clients.size,
        timestamp: new Date()
      });
    }
  }, CONFIG.FIELD_UPDATE_INTERVAL);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  log('INFO', 'SIGTERM received, shutting down gracefully');
  
  // Stop accepting new connections
  server.close(() => {
    log('INFO', 'HTTP server closed');
  });
  
  // Notify all clients
  broadcast({
    type: 'server:shutdown',
    message: 'Server shutting down',
    timestamp: new Date()
  });
  
  // Close all connections
  clients.forEach(clientInfo => {
    clientInfo.ws.close(1000, 'Server shutdown');
  });
  
  // Clear intervals
  clearInterval(breathInterval);
  clearInterval(fieldInterval);
  
  // Exit
  setTimeout(() => {
    log('INFO', 'Shutdown complete');
    process.exit(0);
  }, 5000);
});

// Start server
server.listen(CONFIG.PORT, () => {
  log('INFO', `✅ Production Universal AI WebSocket server running`, {
    port: CONFIG.PORT,
    max_connections: CONFIG.MAX_CONNECTIONS,
    environment: CONFIG.NODE_ENV
  });
  
  // Start cycles
  startBreathCycles();
  startFieldUpdates();
  
  // Log config
  log('INFO', 'Server configuration', CONFIG);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  log('ERROR', 'Unhandled Rejection', { reason: reason.toString() });
});