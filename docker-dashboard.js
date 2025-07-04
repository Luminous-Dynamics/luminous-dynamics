#!/usr/bin/env node

/**
 * Docker Dashboard Server
 * Serves a dashboard that can properly check Docker status
 */

const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3341;

// Serve static files
app.use(express.static('web'));

// API endpoint to get Docker status
app.get('/api/docker-status', (req, res) => {
    exec('docker-compose -f docker-compose.local.yml ps --format json', (error, stdout, stderr) => {
        if (error) {
            // Fallback to text format
            exec('docker-compose -f docker-compose.local.yml ps', (error2, stdout2, stderr2) => {
                if (error2) {
                    res.json({ error: 'Failed to get Docker status' });
                } else {
                    // Parse text output
                    const lines = stdout2.split('\n');
                    const services = [];
                    
                    // Skip header and parse service lines
                    for (let i = 2; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (line) {
                            const parts = line.split(/\s+/);
                            if (parts.length >= 4) {
                                services.push({
                                    name: parts[0],
                                    status: parts[parts.length - 2] + ' ' + parts[parts.length - 1]
                                });
                            }
                        }
                    }
                    
                    res.json({ services });
                }
            });
        } else {
            try {
                const services = stdout.split('\n')
                    .filter(line => line.trim())
                    .map(line => JSON.parse(line));
                res.json({ services });
            } catch (e) {
                res.json({ error: 'Failed to parse Docker status' });
            }
        }
    });
});

// API endpoint to check service health
app.get('/api/service-health/:port', async (req, res) => {
    const port = req.params.port;
    const http = require('http');
    
    const options = {
        hostname: 'localhost',
        port: port,
        path: '/api/health',
        method: 'GET',
        timeout: 2000
    };
    
    const request = http.request(options, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        response.on('end', () => {
            try {
                const json = JSON.parse(data);
                res.json({ healthy: true, data: json });
            } catch (e) {
                res.json({ healthy: true, data: null });
            }
        });
    });
    
    request.on('error', (e) => {
        res.json({ healthy: false, error: e.message });
    });
    
    request.on('timeout', () => {
        request.destroy();
        res.json({ healthy: false, error: 'Timeout' });
    });
    
    request.end();
});

// Serve the dashboard HTML
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐳 Docker Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #e0e0e0;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 30px;
            background: linear-gradient(45deg, #00d4ff, #0099e0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .service-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .service-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .service-name {
            font-size: 1.3em;
            font-weight: 600;
        }

        .service-status {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }

        .status-running {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid #10b981;
        }

        .status-stopped {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid #ef4444;
        }

        .service-info {
            display: grid;
            gap: 10px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.9em;
        }

        .info-label {
            color: #888;
        }

        .info-value {
            font-family: monospace;
            color: #00d4ff;
        }

        .refresh-btn {
            display: block;
            margin: 20px auto;
            padding: 12px 24px;
            background: linear-gradient(45deg, #00d4ff, #0099e0);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .refresh-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
        }

        .last-update {
            text-align: center;
            color: #888;
            font-size: 0.9em;
            margin-top: 20px;
        }

        .commands {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }

        .command {
            background: #000;
            color: #0f0;
            padding: 10px;
            margin: 10px 0;
            font-family: monospace;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐳 Docker Dashboard</h1>
        
        <button class="refresh-btn" onclick="refreshStatus()">🔄 Refresh Status</button>
        
        <div class="services-grid" id="services">
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                Loading services...
            </div>
        </div>
        
        <div class="last-update" id="last-update"></div>
        
        <div class="commands">
            <h3 style="margin-bottom: 15px;">Quick Commands:</h3>
            <div class="command">docker-compose -f docker-compose.local.yml up -d</div>
            <div class="command">docker-compose -f docker-compose.local.yml down</div>
            <div class="command">docker-compose -f docker-compose.local.yml logs -f</div>
            <div class="command">docker-compose -f docker-compose.local.yml ps</div>
        </div>
    </div>

    <script>
        const services = [
            { name: 'consciousness-field', displayName: '🌊 Consciousness Field', port: 3333 },
            { name: 'agent-network', displayName: '🤝 Agent Network', port: 3334 },
            { name: 'sacred-messaging', displayName: '💬 Sacred Messaging', port: 3335 },
            { name: 'work-coordination', displayName: '📋 Work Coordination', port: 3336 },
            { name: 'gateway', displayName: '🌐 API Gateway', port: 3337 },
            { name: 'web', displayName: '🖥️ Web Interface', port: 8338 }
        ];

        async function refreshStatus() {
            const container = document.getElementById('services');
            container.innerHTML = '';
            
            try {
                // Get Docker status from our server
                const response = await fetch('/api/docker-status');
                const data = await response.json();
                
                for (const service of services) {
                    const dockerInfo = data.services?.find(s => 
                        s.name?.includes(service.name) || s.Service === service.name
                    );
                    
                    const isRunning = dockerInfo && 
                        (dockerInfo.Status?.includes('Up') || dockerInfo.State === 'running');
                    
                    // Check health endpoint through our server
                    let healthInfo = null;
                    if (isRunning) {
                        try {
                            const healthResponse = await fetch(\`/api/service-health/\${service.port}\`);
                            const healthData = await healthResponse.json();
                            if (healthData.healthy && healthData.data) {
                                healthInfo = healthData.data;
                            }
                        } catch (e) {
                            console.error('Health check failed:', e);
                        }
                    }
                    
                    const card = document.createElement('div');
                    card.className = 'service-card';
                    card.innerHTML = \`
                        <div class="service-header">
                            <div class="service-name">\${service.displayName}</div>
                            <div class="service-status \${isRunning ? 'status-running' : 'status-stopped'}">
                                \${isRunning ? 'Running' : 'Stopped'}
                            </div>
                        </div>
                        <div class="service-info">
                            <div class="info-row">
                                <span class="info-label">Port:</span>
                                <span class="info-value">\${service.port}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Container:</span>
                                <span class="info-value">\${dockerInfo ? dockerInfo.name || dockerInfo.Name : 'N/A'}</span>
                            </div>
                            \${healthInfo ? \`
                            <div class="info-row">
                                <span class="info-label">Health:</span>
                                <span class="info-value">\${healthInfo.status || 'OK'}</span>
                            </div>
                            \` : ''}
                            \${healthInfo && healthInfo.coherence ? \`
                            <div class="info-row">
                                <span class="info-label">Coherence:</span>
                                <span class="info-value">\${Math.round(healthInfo.coherence)}%</span>
                            </div>
                            \` : ''}
                            \${healthInfo && healthInfo.agents !== undefined ? \`
                            <div class="info-row">
                                <span class="info-label">Agents:</span>
                                <span class="info-value">\${healthInfo.agents}</span>
                            </div>
                            \` : ''}
                        </div>
                    \`;
                    container.appendChild(card);
                }
                
                document.getElementById('last-update').textContent = 
                    'Last updated: ' + new Date().toLocaleTimeString();
                    
            } catch (error) {
                container.innerHTML = \`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ef4444;">
                        Error loading status: \${error.message}
                    </div>
                \`;
            }
        }

        // Initial load
        refreshStatus();
        
        // Auto-refresh every 5 seconds
        setInterval(refreshStatus, 5000);
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║      Docker Dashboard Server           ║
╚════════════════════════════════════════╝

🚀 Dashboard running at:
   http://localhost:${PORT}

✨ This server can check Docker status
   without CORS issues!

Press Ctrl+C to stop
    `);
});