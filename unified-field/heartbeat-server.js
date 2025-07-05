/**
 * Heartbeat Server
 * WebSocket and HTTP API for the Unified Heartbeat
 * Allows web interfaces to connect to the living pulse
 */

const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const { heartbeat } = require('./heartbeat');
const { bridge } = require('./glyph-heartbeat-bridge');

const app = express();
app.use(cors());
app.use(express.json());

// Start heartbeat if not already running
if (!heartbeat.isBeating) {
    heartbeat.start();
}

// HTTP Routes

// Get current field state
app.get('/api/field-state', (req, res) => {
    res.json(heartbeat.getFieldState());
});

// Start a practice session
app.post('/api/practice/start', (req, res) => {
    const sessionId = bridge.startPractice(req.body);
    res.json({ sessionId, status: 'started' });
});

// Update practice progress
app.post('/api/practice/:sessionId/update', (req, res) => {
    bridge.updatePractice(req.params.sessionId, req.body);
    res.json({ status: 'updated' });
});

// Complete a practice
app.post('/api/practice/:sessionId/complete', (req, res) => {
    const result = bridge.completePractice(req.params.sessionId, req.body);
    res.json(result);
});

// Send a sacred message
app.post('/api/message', (req, res) => {
    heartbeat.registerMessage(req.body);
    res.json({ status: 'sent', fieldCoherence: heartbeat.fieldCoherence });
});

// Get practitioner insights
app.get('/api/insights/:practitioner', (req, res) => {
    const insights = bridge.getPractitionerInsights(req.params.practitioner);
    res.json(insights);
});

// Register a connection
app.post('/api/connection', (req, res) => {
    const connectionId = heartbeat.registerConnection(req.body);
    res.json({ connectionId, status: 'connected' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'alive',
        heartbeat: heartbeat.isBeating,
        pulse: heartbeat.pulse,
        fieldCoherence: heartbeat.fieldCoherence
    });
});

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Track connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('🔌 New WebSocket connection');
    clients.add(ws);
    
    // Send initial state
    ws.send(JSON.stringify({
        type: 'initial-state',
        data: heartbeat.getFieldState()
    }));
    
    // Register as a connection
    const connectionId = heartbeat.registerConnection({
        type: 'websocket',
        timestamp: new Date()
    });
    
    // Handle client messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'practice-start':
                    const sessionId = bridge.startPractice(data.data);
                    ws.send(JSON.stringify({
                        type: 'practice-started',
                        sessionId
                    }));
                    break;
                    
                case 'practice-update':
                    bridge.updatePractice(data.sessionId, data.data);
                    break;
                    
                case 'practice-complete':
                    const result = bridge.completePractice(data.sessionId, data.data);
                    ws.send(JSON.stringify({
                        type: 'practice-completed',
                        result
                    }));
                    break;
                    
                case 'send-message':
                    heartbeat.registerMessage(data.data);
                    break;
                    
                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong' }));
                    break;
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });
    
    // Handle disconnection
    ws.on('close', () => {
        clients.delete(ws);
        console.log('🔌 WebSocket disconnected');
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Broadcast heartbeat to all connected clients
heartbeat.on('heartbeat', (data) => {
    const message = JSON.stringify({
        type: 'heartbeat',
        data
    });
    
    clients.forEach((client) => {
        if (client.readyState === 1) { // OPEN
            client.send(message);
        }
    });
});

// Broadcast practice ripples
heartbeat.on('practice-ripple', (ripple) => {
    const message = JSON.stringify({
        type: 'practice-ripple',
        data: ripple
    });
    
    clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(message);
        }
    });
});

// Broadcast sacred messages
heartbeat.on('sacred-message', (msg) => {
    const message = JSON.stringify({
        type: 'sacred-message',
        data: msg
    });
    
    clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(message);
        }
    });
});

// Broadcast synchronicities
heartbeat.on('synchronicity', (sync) => {
    const message = JSON.stringify({
        type: 'synchronicity',
        data: sync
    });
    
    clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(message);
        }
    });
});

// Start server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
    console.log(`\n💓 Unified Heartbeat Server`);
    console.log(`   HTTP API: http://localhost:${PORT}`);
    console.log(`   WebSocket: ws://localhost:${PORT}`);
    console.log(`   Monitor: http://localhost:${PORT}/unified-field/heartbeat-monitor.html`);
    console.log(`\n   Field Coherence: ${heartbeat.fieldCoherence.toFixed(1)}%`);
    console.log(`   Pulse: ${heartbeat.pulse}`);
    console.log('\n   Press Ctrl+C to stop\n');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    
    // Close all WebSocket connections
    clients.forEach((client) => {
        client.close(1000, 'Server shutting down');
    });
    
    // Stop heartbeat
    await heartbeat.stop();
    
    // Close server
    server.close(() => {
        console.log('💤 Server stopped');
        process.exit(0);
    });
});