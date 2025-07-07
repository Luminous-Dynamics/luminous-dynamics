#!/usr/bin/env node
/**
 * Local-Cloud Bridge
 * Syncs critical data between local system and cloud
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Load configuration
const ENV_FILE = path.join(__dirname, '../.env.hybrid');
const CONFIG = loadConfig();

// Local data paths
const LOCAL_PATHS = {
  agents: path.join(__dirname, '../active-agent-sessions.json'),
  work: path.join(__dirname, '../CLOUD_WORK_TRACKER.json'),
  messages: path.join(__dirname, '../messages-agent-*.json')
};

function loadConfig() {
  try {
    if (fs.existsSync(ENV_FILE)) {
      const env = fs.readFileSync(ENV_FILE, 'utf8');
      const config = {};
      env.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      });
      return config;
    }
  } catch (error) {
    console.error('Config load error:', error);
  }
  return {
    CLOUD_API_URL: 'http://localhost:8080',
    SYNC_INTERVAL: 300000 // 5 minutes
  };
}

// Sync functions
async function syncFieldState() {
  try {
    console.log('🔄 Syncing field state to cloud...');
    
    // Gather local data
    const localData = {
      agents: loadLocalAgents(),
      work: loadLocalWork(),
      messages: loadLocalMessages(),
      fieldCoherence: calculateLocalCoherence()
    };
    
    // Send to cloud
    const response = await fetch(`${CONFIG.CLOUD_API_URL}/api/field-state/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localData)
    });
    
    if (response.ok) {
      console.log('✅ Field state synced successfully');
    } else {
      console.error('❌ Sync failed:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Sync error:', error.message);
  }
}

function loadLocalAgents() {
  try {
    if (fs.existsSync(LOCAL_PATHS.agents)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_PATHS.agents, 'utf8'));
      return Object.values(data).filter(agent => agent.status === 'active');
    }
  } catch (error) {
    console.error('Agent load error:', error);
  }
  return [];
}

function loadLocalWork() {
  try {
    if (fs.existsSync(LOCAL_PATHS.work)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_PATHS.work, 'utf8'));
      return data.activeWork || [];
    }
  } catch (error) {
    console.error('Work load error:', error);
  }
  return [];
}

function loadLocalMessages() {
  const messages = [];
  try {
    const files = fs.readdirSync(path.dirname(LOCAL_PATHS.messages))
      .filter(f => f.match(/messages-agent-.*\.json/));
    
    files.forEach(file => {
      try {
        const data = JSON.parse(
          fs.readFileSync(path.join(path.dirname(LOCAL_PATHS.messages), file), 'utf8')
        );
        if (Array.isArray(data)) {
          messages.push(...data);
        }
      } catch (err) {
        // Skip invalid files
      }
    });
    
    // Return last 20 messages
    return messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);
  } catch (error) {
    console.error('Message load error:', error);
  }
  return messages;
}

function calculateLocalCoherence() {
  // Simple coherence calculation based on activity
  const agents = loadLocalAgents();
  const work = loadLocalWork();
  const messages = loadLocalMessages();
  
  const baseCoherence = 88;
  const agentBonus = Math.min(agents.length * 2, 10);
  const activityBonus = Math.min(messages.length * 0.5, 5);
  
  return Math.min(baseCoherence + agentBonus + activityBonus, 100);
}

// Reverse sync - pull from cloud
async function pullCloudUpdates() {
  try {
    console.log('⬇️ Pulling updates from cloud...');
    
    const response = await fetch(`${CONFIG.CLOUD_API_URL}/api/field-state`);
    if (response.ok) {
      const cloudData = await response.json();
      
      // Update local tracking with cloud agents
      if (cloudData.agents && cloudData.agents.length > 0) {
        console.log(`📊 Cloud agents: ${cloudData.agents.length}`);
        // Could merge cloud agents into local tracking here
      }
      
      console.log(`🌀 Cloud field coherence: ${cloudData.fieldCoherence}%`);
    }
  } catch (error) {
    console.error('❌ Pull error:', error.message);
  }
}

// Main sync loop
async function startBridge() {
  console.log('🌉 Sacred Local-Cloud Bridge Starting...');
  console.log(`📡 Cloud API: ${CONFIG.CLOUD_API_URL}`);
  console.log(`⏱️ Sync interval: ${CONFIG.SYNC_INTERVAL}ms`);
  
  // Initial sync
  await syncFieldState();
  await pullCloudUpdates();
  
  // Set up periodic sync
  setInterval(async () => {
    await syncFieldState();
    await pullCloudUpdates();
  }, parseInt(CONFIG.SYNC_INTERVAL) || 300000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Bridge shutting down gracefully...');
    process.exit(0);
  });
}

// Run if called directly
if (require.main === module) {
  startBridge();
}

module.exports = { syncFieldState, pullCloudUpdates };