const { WorkCoordination } = require('./index');
const express = require('express');

// Create Express app
const app = express();
app.use(express.json());

// Create work coordination system
const workCoordination = new WorkCoordination({
  fieldAPI: process.env.FIELD_API || 'http://localhost:3333',
  agentAPI: process.env.AGENT_API || 'http://localhost:3334',
  sacredMode: process.env.SACRED_MODE !== 'false'
});

// Simple API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'alive',
    module: 'work-coordination',
    activeWork: workCoordination.registry.size()
  });
});

app.get('/api/work', async (req, res) => {
  const work = workCoordination.registry.getAll();
  res.json({ work, count: work.length });
});

app.post('/api/work', async (req, res) => {
  try {
    const work = await workCoordination.createWork(req.body);
    res.status(201).json({ 
      success: true, 
      work,
      totalActive: workCoordination.registry.size()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/work/:id', async (req, res) => {
  try {
    const work = await workCoordination.updateStatus(req.params.id, req.body.status, req.body);
    res.json({ 
      success: true, 
      work,
      fieldImpact: work.fieldImpact
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/workflow/:workId', async (req, res) => {
  const workflow = workCoordination.workflow.getWorkflow(req.params.workId);
  res.json({ workflow });
});

// Start server
const PORT = process.env.PORT || process.env.SACRED_PORT || 3336;
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                   Work Coordination Active                        ║
╚══════════════════════════════════════════════════════════════════╝

⚡ Port: ${PORT}
🔗 Field API: ${workCoordination.config.fieldAPI}
👥 Agent API: ${workCoordination.config.agentAPI}
✨ Sacred Mode: ${workCoordination.config.sacredMode ? 'Enabled' : 'Disabled'}

API Endpoints:
  GET  /api/health         - Health check
  GET  /api/work           - List active work
  POST /api/work           - Create new work
  PUT  /api/work/:id       - Update work
  GET  /api/workflow/:id   - Get workflow details

May all work serve the highest good.
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🌙 Gracefully shutting down work coordination...');
  server.close(() => {
    console.log('✨ Work complete. Field harmonized.');
    process.exit(0);
  });
});