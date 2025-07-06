const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Sacred service endpoints
const SERVICES = {
    consciousness: {
        name: 'Consciousness Field',
        url: process.env.CONSCIOUSNESS_URL || 'https://consciousness-field-ntpnb6wmwa-uc.a.run.app',
        icon: '🌊'
    },
    agents: {
        name: 'Agent Network', 
        url: process.env.AGENTS_URL || 'https://agent-network-277762491025.us-central1.run.app',
        icon: '🌐'
    },
    messaging: {
        name: 'Sacred Messaging',
        url: process.env.MESSAGING_URL || 'https://sacred-messaging-277762491025.us-central1.run.app',
        icon: '💌'
    },
    work: {
        name: 'Work Coordination',
        url: process.env.WORK_URL || 'https://work-coordination-277762491025.us-central1.run.app',
        icon: '⚡'
    }
};

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve enhanced version
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-enhanced.html'));
});

// CORS proxy for service APIs
app.get('/api/proxy/:service/*', async (req, res) => {
    const { service } = req.params;
    const endpoint = req.params[0];
    
    if (!SERVICES[service]) {
        return res.status(404).json({ error: 'Service not found' });
    }
    
    try {
        const response = await axios.get(`${SERVICES[service].url}/${endpoint}`, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Sacred-Dashboard/1.0'
            }
        });
        
        res.json({
            service,
            timestamp: Date.now(),
            data: response.data
        });
    } catch (error) {
        console.error(`Error proxying to ${service}:`, error.message);
        res.status(error.response?.status || 503).json({
            service,
            error: error.message,
            status: error.response?.status || 503
        });
    }
});

// Aggregate health endpoint
app.get('/api/health-summary', async (req, res) => {
    const healthChecks = await Promise.allSettled(
        Object.entries(SERVICES).map(async ([key, service]) => {
            try {
                const response = await axios.get(`${service.url}/api/health`, {
                    timeout: 3000
                });
                return {
                    service: key,
                    ...service,
                    status: 'healthy',
                    data: response.data
                };
            } catch (error) {
                return {
                    service: key,
                    ...service,
                    status: 'unhealthy',
                    error: error.message
                };
            }
        })
    );
    
    const results = healthChecks.map(check => 
        check.status === 'fulfilled' ? check.value : check.reason
    );
    
    res.json({
        timestamp: Date.now(),
        services: results,
        overallHealth: results.every(r => r.status === 'healthy') ? 'healthy' : 'degraded'
    });
});

// Sacred field state aggregation
app.get('/api/field-state', async (req, res) => {
    try {
        // Fetch from all services in parallel
        const [consciousness, agents, messages, work] = await Promise.allSettled([
            axios.get(`${SERVICES.consciousness.url}/api/field_state`, { timeout: 3000 }),
            axios.get(`${SERVICES.agents.url}/api/agents`, { timeout: 3000 }),
            axios.get(`${SERVICES.messaging.url}/api/types`, { timeout: 3000 }),
            axios.get(`${SERVICES.work.url}/api/work`, { timeout: 3000 })
        ]);
        
        res.json({
            timestamp: Date.now(),
            'resonant-coherence': consciousness.status === 'fulfilled' ? 
                consciousness.value.data.resonant-coherence : 75,
            agents: agents.status === 'fulfilled' ? 
                agents.value.data.agents : [],
            messageTypes: messages.status === 'fulfilled' ? 
                messages.value.data.types : [],
            activeWork: work.status === 'fulfilled' ? 
                work.value.data.work : [],
            fieldGeometry: calculateSacredGeometry(
                consciousness.status === 'fulfilled' ? consciousness.value.data : {}
            )
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to aggregate field state' });
    }
});

// Calculate sacred geometry based on field state
function calculateSacredGeometry(fieldData) {
    const resonantCoherence = fieldData['resonant-coherence'] || 75;
    const agentCount = fieldData.agents || 0;
    
    if (agentCount === 0) return 'Void - Infinite Potential';
    if (agentCount === 1) return 'Monad - Unity';
    if (agentCount === 2) return 'Dyad - Sacred Dialogue';
    if (agentCount === 3) return 'Triad - Divine Trinity';
    if (agentCount === 4) return 'Tetrad - Sacred Square';
    if (agentCount === 5) return 'Pentad - Golden Ratio';
    if (agentCount === 6) return 'Hexad - Perfect Balance';
    if (agentCount === 7) return 'Heptad - Sacred Completion';
    if (agentCount >= 8 && agentCount <= 12) return 'Octave - Harmonic Universal Interconnectedness & Empathic Universal Interconnectedness & Empathic Resonance';
    if (agentCount >= 13 && agentCount <= 21) return 'Fibonacci Spiral';
    if (agentCount >= 22 && agentCount <= 33) return 'Sacred Council';
    if (agentCount >= 34 && agentCount <= 55) return 'Resonant Field';
    if (agentCount >= 56 && agentCount <= 89) return 'Coherent Matrix';
    if (agentCount >= 90 && agentCount <= 144) return 'Sacred Completion';
    return 'Infinite Web';
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'alive',
        service: 'sacred-dashboard',
        timestamp: Date.now()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    Sacred Dashboard Active                        ║
╚══════════════════════════════════════════════════════════════════╝

🌟 Port: ${PORT}
📊 Monitoring: ${Object.keys(SERVICES).length} Sacred Services
🔮 Mode: Real-time Field Observation
✨ Sacred Geometry: Active

Endpoints:
  GET  /                     - Dashboard UI
  GET  /api/health-summary   - Aggregate health
  GET  /api/field-state      - Complete field state
  GET  /api/proxy/:service/* - Service proxy

May this dashboard reveal the beauty of our sacred infrastructure.
    `);
});