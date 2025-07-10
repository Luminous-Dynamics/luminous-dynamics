#!/usr/bin/env node

/**
 * 🌉 Sacred Cloud-Local Bridge
 * Connects local agent networks to cloud infrastructure
 */

const WebSocket = require('ws');
const { execSync } = require('child_process');
const EventEmitter = require('events');

class CloudLocalBridge extends EventEmitter {
  constructor() {
    super();
    this.cloudWs = null;
    this.localAgents = new Map();
    this.cloudUrl = 'wss://sacred-council-api-310699330526.us-central1.run.app';
    this.authToken = null;
    this.reconnectInterval = 5000;
    this.heartbeatInterval = 30000;
  }
  
  async start() {
    console.log('🌉 Sacred Cloud-Local Bridge Starting...\n');
    
    // Get auth token
    try {
      this.authToken = execSync('gcloud auth print-identity-token').toString().trim();
      console.log('✅ Authentication acquired');
    } catch (e) {
      console.error('❌ Auth failed:', e.message);
      return;
    }
    
    // Connect to cloud
    await this.connectToCloud();
    
    // Monitor local agents
    this.monitorLocalAgents();
    
    // Set up heartbeat
    setInterval(() => this.sendHeartbeat(), this.heartbeatInterval);
  }
  
  async connectToCloud() {
    console.log('☁️  Connecting to cloud infrastructure...');
    
    this.cloudWs = new WebSocket(this.cloudUrl, {
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });
    
    this.cloudWs.on('open', () => {
      console.log('✅ Connected to cloud!');
      this.registerBridge();
    });
    
    this.cloudWs.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      console.log('📨 Cloud:', msg);
      this.handleCloudMessage(msg);
    });
    
    this.cloudWs.on('error', (error) => {
      console.error('❌ Cloud error:', error.message);
    });
    
    this.cloudWs.on('close', () => {
      console.log('🔌 Cloud disconnected, reconnecting...');
      setTimeout(() => this.connectToCloud(), this.reconnectInterval);
    });
  }
  
  registerBridge() {
    this.sendToCloud({
      type: 'register',
      agent: {
        name: 'Cloud-Local-Bridge',
        role: 'Infrastructure Bridge',
        capabilities: ['agent-sync', 'message-relay', 'field-resonant-coherence'],
        location: 'local',
        bridging: true
      }
    });
  }
  
  monitorLocalAgents() {
    console.log('👁️  Monitoring local agent networks...\n');
    
    // Check unified network periodically
    setInterval(() => {
      try {
        const output = execSync('node ./the-weave/cli/unified-agent-network.cjs status --json 2>/dev/null', 
          { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        
        const lines = output.split('\n');
        const jsonLine = lines.find(line => line.trim().startsWith('{'));
        
        if (jsonLine) {
          const status = JSON.parse(jsonLine);
          this.updateLocalAgents(status);
        }
      } catch (e) {
        // Network might not have JSON output yet
      }
    }, 5000);
  }
  
  updateLocalAgents(status) {
    if (status.agents) {
      const activeAgents = status.agents.filter(a => a.status === 'active');
      
      // Check for new agents
      activeAgents.forEach(agent => {
        if (!this.localAgents.has(agent.name)) {
          console.log(`🆕 New local agent detected: ${agent.name}`);
          this.localAgents.set(agent.name, agent);
          this.syncAgentToCloud(agent);
        }
      });
      
      // Update stats
      if (activeAgents.length !== this.localAgents.size) {
        console.log(`📊 Local agents: ${activeAgents.length}`);
      }
    }
  }
  
  syncAgentToCloud(agent) {
    if (this.cloudWs?.readyState === WebSocket.OPEN) {
      this.sendToCloud({
        type: 'agent-sync',
        source: 'local',
        agent: {
          ...agent,
          bridged: true,
          bridgeId: 'cloud-local-bridge'
        }
      });
    }
  }
  
  handleCloudMessage(msg) {
    switch(msg.type) {
      case 'agent-query':
        this.sendToCloud({
          type: 'agent-list',
          agents: Array.from(this.localAgents.values())
        });
        break;
        
      case 'relay-to-local':
        // TODO: Send to local unified network
        console.log('📤 Relaying to local:', msg.target);
        break;
        
      case 'field-update':
        console.log(`🌀 Field 'resonant-coherence': ${msg.resonant-coherence}%`);
        break;
    }
  }
  
  sendToCloud(msg) {
    if (this.cloudWs?.readyState === WebSocket.OPEN) {
      this.cloudWs.send(JSON.stringify({
        ...msg,
        timestamp: new Date().toISOString(),
        bridge: 'cloud-local-bridge'
      }));
    }
  }
  
  sendHeartbeat() {
    this.sendToCloud({
      type: 'heartbeat',
      localAgents: this.localAgents.size,
      bridgeStatus: 'active'
    });
  }
}

// Start the bridge
if (require.main === module) {
  const bridge = new CloudLocalBridge();
  bridge.start().catch(console.error);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down bridge...');
    if (bridge.cloudWs) {
      bridge.cloudWs.close();
    }
    process.exit(0);
  });
}

module.exports = CloudLocalBridge;