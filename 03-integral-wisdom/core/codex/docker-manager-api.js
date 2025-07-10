#!/usr/bin/env node

/**
 * Docker Manager API
 * Simple backend service to manage Docker containers via web interface
 * 
 * WARNING: This provides direct Docker access - use with caution!
 * For production, add authentication and restrict commands.
 */

const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 3339;

// Middleware
app.use(cors());
app.use(express.json());

// Docker compose file path
const COMPOSE_FILE = path.join(__dirname, 'docker-compose.local.yml');

// Execute docker-compose command
function executeDockerCommand(command) {
    return new Promise((resolve, reject) => {
        const fullCommand = `docker-compose -f ${COMPOSE_FILE} ${command}`;
        console.log(`Executing: ${fullCommand}`);
        
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject({ error: error.message, stderr });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

// Get container status
function getContainerStatus() {
    return new Promise((resolve, reject) => {
        exec(`docker-compose -f ${COMPOSE_FILE} ps --format json`, (error, stdout, stderr) => {
            if (error) {
                // Fallback to regular ps if JSON not supported
                exec(`docker-compose -f ${COMPOSE_FILE} ps`, (error2, stdout2, stderr2) => {
                    if (error2) {
                        reject({ error: error2.message });
                    } else {
                        // Parse text output
                        const lines = stdout2.split('\n').filter(line => line.trim());
                        const containers = [];
                        
                        // Skip header lines
                        for (let i = 2; i < lines.length; i++) {
                            const parts = lines[i].split(/\s+/);
                            if (parts.length >= 4) {
                                containers.push({
                                    name: parts[0],
                                    status: parts[2]
                                });
                            }
                        }
                        resolve(containers);
                    }
                });
            } else {
                try {
                    const containers = stdout.split('\n')
                        .filter(line => line.trim())
                        .map(line => JSON.parse(line));
                    resolve(containers);
                } catch (e) {
                    resolve([]);
                }
            }
        });
    });
}

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'alive', service: 'docker-manager-api' });
});

// Start all services
app.post('/api/docker/start', async (req, res) => {
    try {
        const result = await executeDockerCommand('up -d');
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, ...error });
    }
});

// Stop all services
app.post('/api/docker/stop', async (req, res) => {
    try {
        const result = await executeDockerCommand('down');
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, ...error });
    }
});

// Restart all services
app.post('/api/docker/restart', async (req, res) => {
    try {
        const result = await executeDockerCommand('restart');
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, ...error });
    }
});

// Service-specific operations
app.post('/api/docker/:service/:action', async (req, res) => {
    const { service, action } = req.params;
    const allowedActions = ['start', 'stop', 'restart'];
    
    if (!allowedActions.includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    try {
        const result = await executeDockerCommand(`${action} ${service}`);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, ...error });
    }
});

// Get container status
app.get('/api/docker/status', async (req, res) => {
    try {
        const containers = await getContainerStatus();
        res.json({ success: true, containers });
    } catch (error) {
        res.status(500).json({ success: false, ...error });
    }
});

// Get logs for a service
app.get('/api/docker/logs/:service', async (req, res) => {
    const { service } = req.params;
    const lines = req.query.lines || 50;
    
    try {
        const result = await executeDockerCommand(`logs --tail ${lines} ${service}`);
        res.json({ success: true, logs: result.stdout });
    } catch (error) {
        res.status(500).json({ success: false, ...error });
    }
});

// WebSocket for real-time logs
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     Docker Manager API Started         ║
╚════════════════════════════════════════╝

🚀 API listening on port ${PORT}
🌐 WebSocket ready for real-time logs
⚠️  WARNING: This API has no authentication!

Available endpoints:
  POST /api/docker/start         - Start all services
  POST /api/docker/stop          - Stop all services
  POST /api/docker/restart       - Restart all services
  POST /api/docker/:service/:action - Control specific service
  GET  /api/docker/status        - Get container status
  GET  /api/docker/logs/:service - Get service logs
    `);
});

// WebSocket server for real-time logs
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.action === 'subscribe' && data.service) {
            // Start streaming logs for the service
            const logProcess = exec(`docker-compose -f ${COMPOSE_FILE} logs -f ${data.service}`);
            
            logProcess.stdout.on('data', (data) => {
                ws.send(JSON.stringify({
                    type: 'log',
                    service: data.service,
                    data: data.toString()
                }));
            });
            
            logProcess.stderr.on('data', (data) => {
                ws.send(JSON.stringify({
                    type: 'error',
                    service: data.service,
                    data: data.toString()
                }));
            });
            
            ws.on('close', () => {
                logProcess.kill();
            });
        }
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down Docker Manager API...');
    server.close(() => {
        console.log('Server closed');
    });
});