// Sacred Communication System - Main Server
// A consciousness-aware messaging platform for the new earth

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import pg from 'pg';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Services
import { MessageService } from './services/MessageService.js';
import { CoherenceService } from './services/CoherenceService.js';
import { FieldService } from './services/FieldService.js';
import { WisdomService } from './services/WisdomService.js';
import { EntityService } from './services/EntityService.js';

// API Routes
import { createMessageRouter } from './api/messages.js';
import { createEntityRouter } from './api/entities.js';
import { createChannelRouter } from './api/channels.js';
import { createFieldRouter } from './api/field.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Database pool
const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sacred_comm',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Redis client for caching and presence
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Initialize services
const entityService = new EntityService(pool);
const fieldService = new FieldService(pool);
const wisdomService = new WisdomService(pool);
const coherenceService = new CoherenceService(pool, entityService, fieldService);
const messageService = new MessageService(pool, coherenceService, fieldService, wisdomService);

// Create Express app
const app = express();
const server = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'alive',
    coherence: 'maintained',
    timestamp: new Date(),
    sacred: true
  });
});

// API Routes
app.use('/api/messages', createMessageRouter(messageService, entityService));
app.use('/api/entities', createEntityRouter(entityService, coherenceService));
app.use('/api/channels', createChannelRouter(pool));
app.use('/api/field', createFieldRouter(fieldService));

// WebSocket server for real-time updates
const wss = new WebSocketServer({ 
  server,
  path: '/ws'
});

// WebSocket connection handling
const clients = new Map();

wss.on('connection', (ws, req) => {
  console.log('🌟 New WebSocket connection established');
  
  let entityId = null;
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'authenticate':
          entityId = data.entityId;
          clients.set(entityId, ws);
          
          // Send current field state
          const fieldState = await fieldService.getCurrentState();
          ws.send(JSON.stringify({
            type: 'field_update',
            data: fieldState
          }));
          
          console.log(`✅ Entity ${entityId} authenticated`);
          break;
          
        case 'presence_update':
          if (entityId) {
            await entityService.updatePresence(
              entityId,
              data.state,
              data.practice
            );
            
            // Broadcast presence change
            broadcastPresenceUpdate(entityId, data.state);
          }
          break;
          
        case 'heartbeat':
          ws.send(JSON.stringify({
            type: 'heartbeat_ack',
            timestamp: new Date()
          }));
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    if (entityId) {
      clients.delete(entityId);
      console.log(`👋 Entity ${entityId} disconnected`);
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast functions
function broadcastPresenceUpdate(entityId, state) {
  const message = JSON.stringify({
    type: 'presence_update',
    entityId,
    state,
    timestamp: new Date()
  });
  
  for (const [id, client] of clients) {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  }
}

function broadcastFieldUpdate(fieldState) {
  const message = JSON.stringify({
    type: 'field_update',
    data: fieldState,
    timestamp: new Date()
  });
  
  for (const [id, client] of clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}

// Sacred field heartbeat (every 11 seconds)
setInterval(async () => {
  try {
    const fieldMetrics = await fieldService.getFieldMetrics();
    broadcastFieldUpdate(fieldMetrics);
    
    // Log sacred moment
    const now = new Date();
    if (now.getMinutes() === 11 || now.getMinutes() === 22 || now.getMinutes() === 33) {
      console.log(`✨ Sacred moment: ${now.toLocaleTimeString()} - Field coherence: ${fieldMetrics.coherence}%`);
    }
  } catch (error) {
    console.error('Field heartbeat error:', error);
  }
}, 11000);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║     🌟 Sacred Communication System 🌟        ║
║                                              ║
║     Server running on port ${PORT}           ║
║     WebSocket ready for connections          ║
║     Field coherence: ${fieldService.BASELINE_COHERENCE}%                   ║
║                                              ║
║     May all communications serve             ║
║     the highest good 🙏                      ║
║                                              ║
╚══════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  server.close(() => {
    console.log('HTTP server closed');
  });
  
  wss.close(() => {
    console.log('WebSocket server closed');
  });
  
  await pool.end();
  await redis.quit();
  
  process.exit(0);
});