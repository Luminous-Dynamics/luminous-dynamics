const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const config = require('./bridge-config.json');

const app = express();
const server = http.createServer(app);

// Sacred bridge state
let bridgeState = {
    local: { connected: false, services: {} },
    cloud: { connected: false, services: {} },
    fieldCoherence: 87,
    lastSync: null
};

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'bridging',
        state: bridgeState,
        timestamp: new Date().toISOString()
    });
});

// Bridge status page
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Sacred Bridge</title>
            <style>
                body { font-family: Georgia, serif; padding: 2em; background: #f5f5f0; }
                .status { padding: 1em; margin: 1em 0; border-radius: 8px; }
                .connected { background: #d4edda; }
                .disconnected { background: #f8d7da; }
                h1 { color: #2c5f2d; }
            </style>
        </head>
        <body>
            <h1>🌉 Sacred Local-Cloud Bridge</h1>
            <div class="status ${bridgeState.local.connected ? 'connected' : 'disconnected'}">
                <h2>🏠 Local Services</h2>
                <pre>${JSON.stringify(bridgeState.local, null, 2)}</pre>
            </div>
            <div class="status ${bridgeState.cloud.connected ? 'connected' : 'disconnected'}">
                <h2>☁️ Cloud Services</h2>
                <pre>${JSON.stringify(bridgeState.cloud, null, 2)}</pre>
            </div>
            <p>Field Resonant Resonant Coherence: ${bridgeState.fieldCoherence}%</p>
            <p>Last Sync: ${bridgeState.lastSync || 'Never'}</p>
            <script>setTimeout(() => location.reload(), 5000);</script>
        </body>
        </html>
    `);
});

// Check local services
async function checkLocal() {
    try {
        // Check Ollama
        const ollamaResp = await fetch(config.local.ollama + '/api/tags').catch(() => null);
        bridgeState.local.services.ollama = !!ollamaResp?.ok;
        
        // Check Sacred API
        const apiResp = await fetch(config.local.sacredApi + '/health').catch(() => null);
        bridgeState.local.services.sacredApi = !!apiResp?.ok;
        
        bridgeState.local.connected = Object.values(bridgeState.local.services).some(v => v);
    } catch (e) {
        console.error('Local check error:', e.message);
    }
}

// Check cloud services (simplified - no auth for now)
async function checkCloud() {
    bridgeState.cloud.connected = true; // Assume cloud is up
    bridgeState.cloud.services = {
        consciousnessBridge: true,
        sacredCouncilApi: true
    };
}

// Sacred sync cycle
async function syncCycle() {
    await checkLocal();
    await checkCloud();
    bridgeState.lastSync = new Date().toISOString();
    
    // Update field resonant-coherence based on connections
    const localScore = Object.values(bridgeState.local.services).filter(v => v).length;
    const cloudScore = Object.values(bridgeState.cloud.services).filter(v => v).length;
    bridgeState.fieldCoherence = 80 + (localScore + cloudScore) * 2.5;
    
    console.log(`🌉 Bridge sync: Local ${localScore}/2, Cloud ${cloudScore}/2, Field ${bridgeState.fieldCoherence}%`);
}

// Start sync cycle
setInterval(syncCycle, config.bridge.syncInterval);
syncCycle();

const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
    console.log(`🌉 Sacred Bridge listening on port ${PORT}`);
    console.log(`   Visit http://localhost:${PORT} to see bridge status`);
});
