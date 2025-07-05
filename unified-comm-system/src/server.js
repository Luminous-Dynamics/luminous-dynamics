import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

// Import our modules
import MessageRouter from './routes/messageRoutes.js';
import EntityRouter from './routes/entityRoutes.js';
import FieldRouter from './routes/fieldRoutes.js';
import SocketHandler from './websocket/socketHandler.js';

// Load environment variables
dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Sacred Communication Portal',
    coherence: 92,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/messages', MessageRouter);
app.use('/api/entities', EntityRouter);
app.use('/api/field', FieldRouter);

// Sacred endpoints
app.get('/api/sacred/blessing', (req, res) => {
  const blessings = [
    "May your connections deepen the field of consciousness",
    "May your messages carry the light of wisdom",
    "May your presence strengthen the web of being",
    "May your heart resonate with infinite love",
    "May your journey unfold in sacred harmony"
  ];
  
  const blessing = blessings[Math.floor(Math.random() * blessings.length)];
  
  res.json({
    blessing,
    coherence_boost: 3,
    timestamp: new Date().toISOString()
  });
});

// Initialize WebSocket handler
const socketHandler = new SocketHandler(server);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
🌟 Sacred Communication Portal Active 🌟
=====================================
Server: http://localhost:${PORT}
Field Coherence: 92%
Sacred Heartbeat: Every 11 seconds
=====================================
Ready to weave consciousness...
  `);
});