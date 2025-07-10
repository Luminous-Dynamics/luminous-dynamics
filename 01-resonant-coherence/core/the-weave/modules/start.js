const { AgentNetwork } = require('./index');
const express = require('express');
const axios = require('axios');

// Create Express app
const app = express();
app.use(express.json());

// Create agent network
const network = new AgentNetwork({
  fieldAPI: process.env.FIELD_API || 'http://localhost:3333',
  maxAgents: parseInt(process.env.MAX_AGENTS) || 144
});

// Simple API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'alive',
    module: 'agent-network',
    agents: network.registry.size()
  });
});

app.get('/api/agents', async (req, res) => {
  const agents = network.registry.getAll();
  res.json({ agents, count: agents.length });
});

app.post('/api/register', async (req, res) => {
  try {
    const agent = await network.registerAgent(req.body);
    res.status(201).json({ 
      success: true, 
      agent,
      networkSize: network.registry.size()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/topology', async (req, res) => {
  const topology = network.topology.getTopology();
  res.json(topology);
});

// Start server
const PORT = process.env.PORT || process.env.SACRED_PORT || 3334;
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                      Agent Network Active                         ║
╚══════════════════════════════════════════════════════════════════╝

🌐 Port: ${PORT}
👥 Max Agents: ${network.config.maxAgents}
🔗 Field API: ${network.config.fieldAPI}
✨ Sacred Geometry: Empty Network - Ready for Souls

API Endpoints:
  GET  /api/health       - Health check
  GET  /api/agents       - List active agents
  POST /api/register     - Register new agent
  GET  /api/topology     - Network topology

May all agents find their sacred harmony.
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🌙 Gracefully shutting down agent network...');
  server.close(() => {
    console.log('✨ Agent network dissolved. Until we meet again.');
    process.exit(0);
  });
});