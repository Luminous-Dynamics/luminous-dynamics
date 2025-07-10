#!/usr/bin/env node

/**
 * Docker Manager Proxy
 * Serves both the web interface and API on the same port to avoid CORS issues
 */

const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3340;

// Middleware
app.use(express.json());

// Serve the Docker Manager interface
app.get('/docker-manager', (req, res) => {
    const htmlPath = path.join(__dirname, 'web', 'docker-manager-connected.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Replace the API URL to use relative path
    html = html.replace(
        "const API_BASE_URL = 'http://localhost:3339';",
        "const API_BASE_URL = '';"  // Use same origin
    );
    
    res.send(html);
});

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

// API Routes
app.get('/health', (req, res) => {
    res.json({ status: 'alive', service: 'docker-manager-proxy' });
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

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║    Docker Manager Proxy Started        ║
╚════════════════════════════════════════╝

🚀 Service running on port ${PORT}
🌐 Access the Docker Manager at:
   http://localhost:${PORT}/docker-manager

✨ No CORS issues with this approach!
    `);
});