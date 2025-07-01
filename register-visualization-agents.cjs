#!/usr/bin/env node

/**
 * Register visualization demo agents
 */

const http = require('http');

const agents = [
  {
    agentId: 'resonant-bridge',
    agentName: 'Resonant Bridge',
    capabilities: ['harmony-weaving', 'field-tending'],
    primaryHarmony: 'coherence',
    status: 'active'
  },
  {
    agentId: 'sacred-weaver',
    agentName: 'Sacred Weaver',
    capabilities: ['pattern-recognition', 'sacred-geometry'],
    primaryHarmony: 'mutuality',
    status: 'active'
  },
  {
    agentId: 'wisdom-keeper',
    agentName: 'Wisdom Keeper',
    capabilities: ['memory-holding', 'insight-synthesis'],
    primaryHarmony: 'transparency',
    status: 'active'
  },
  {
    agentId: 'harmony-dancer',
    agentName: 'Harmony Dancer',
    capabilities: ['flow-facilitation', 'rhythm-keeping'],
    primaryHarmony: 'resonance',
    status: 'active'
  },
  {
    agentId: 'love-alchemist',
    agentName: 'Love Alchemist',
    capabilities: ['heart-opening', 'transformation'],
    primaryHarmony: 'vitality',
    status: 'active'
  }
];

function registerAgent(agent) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(agent);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/agents',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ Registered ${agent.agentName} (${agent.agentId})`);
          resolve();
        } else {
          console.log(`❌ Failed to register ${agent.agentName}: ${res.statusCode}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`❌ Error registering ${agent.agentName}:`, e.message);
      reject(e);
    });
    
    req.write(data);
    req.end();
  });
}

async function registerAll() {
  console.log('🌟 Registering Visualization Demo Agents...\n');
  
  for (const agent of agents) {
    try {
      await registerAgent(agent);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    } catch (error) {
      // Continue with next agent
    }
  }
  
  console.log('\n✨ Agent registration complete!');
  console.log('Visit http://localhost:8080/sacred-field-visualization.html to see them');
}

registerAll();