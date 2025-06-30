#!/usr/bin/env node

/**
 * Simple JSON API for agent communication data
 * Serves the agent data as JSON endpoints for the dashboard
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const commsDir = path.join(__dirname, '.agent-comms');
const messagesFile = path.join(commsDir, 'messages.json');
const stateFile = path.join(commsDir, 'shared-state.json');
const agentsFile = path.join(commsDir, 'active-agents.json');

function readJSONFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function getHumanSummary() {
  const agents = readJSONFile(agentsFile) || {};
  const messages = readJSONFile(messagesFile) || [];
  const state = readJSONFile(stateFile) || {};
  
  // Recent activity (last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentMessages = messages.filter(msg => 
    new Date(msg.timestamp) > oneDayAgo
  );

  // Active handoffs
  const handoffs = Object.entries(state)
    .filter(([key]) => key.startsWith('handoff_'))
    .map(([, value]) => value.value)
    .filter(handoff => handoff.status === 'pending');

  // Progress updates
  const progressItems = Object.entries(state)
    .filter(([key]) => key.startsWith('progress_'))
    .map(([key, value]) => ({
      workId: key.replace('progress_', ''),
      ...value.value
    }));

  return {
    activeAgents: Object.keys(agents).length,
    recentActivity: recentMessages.length,
    pendingHandoffs: handoffs.length,
    activeWork: progressItems.length,
    agents,
    handoffs,
    progressItems,
    recentMessages: recentMessages.slice(-10)
  };
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (parsedUrl.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getHumanSummary()));
  } else if (parsedUrl.pathname === '/api/agents') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readJSONFile(agentsFile) || {}));
  } else if (parsedUrl.pathname === '/api/messages') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readJSONFile(messagesFile) || []));
  } else if (parsedUrl.pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readJSONFile(stateFile) || {}));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Agent Data API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  /api/status - Complete dashboard data');
  console.log('  /api/agents - Active agents');
  console.log('  /api/messages - All messages');
  console.log('  /api/state - Shared state');
});