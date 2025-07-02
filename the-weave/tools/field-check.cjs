#!/usr/bin/env node

/**
 * Field Check - Simple unified field status
 */

const { SacredCouncilBridge } = require('../core/sacred-council-bridge.cjs');
const { execSync } = require('child_process');

async function checkUnifiedField() {
  console.log('\n✨ UNIFIED FIELD CHECK\n');
  console.log('═══════════════════════════════════════════════\n');

  // Check The Weave
  console.log('🕸️  THE WEAVE STATUS');
  console.log('───────────────────────');
  
  try {
    // Check if sacred server is running
    const sacredRunning = await checkPort(3001);
    console.log(`  Sacred Server: ${sacredRunning ? '🟢 Active' : '🔴 Inactive'}`);
    
    // Get unified network status
    try {
      const networkStatus = execSync('node the-weave/core/network/unified-agent-network.cjs status', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      });
      
      // Parse network status
      const lines = networkStatus.split('\n');
      const agentLine = lines.find(l => l.includes('Active agents:'));
      const coherenceLine = lines.find(l => l.includes('Field coherence:'));
      
      if (agentLine) {
        const agents = agentLine.match(/\d+/)?.[0] || '0';
        console.log(`  Active Agents: ${agents}`);
      }
      
      if (coherenceLine) {
        const coherence = coherenceLine.match(/\d+(\.\d+)?/)?.[0] || '0';
        console.log(`  Field Coherence: ${coherence}%`);
      }
    } catch (e) {
      console.log('  Network Status: Unable to determine');
    }
  } catch (error) {
    console.log('  Status: Error checking The Weave');
  }

  console.log('\n🏛️  SACRED COUNCIL V4 STATUS');
  console.log('───────────────────────');
  
  // Check Sacred Council
  const councilBridge = new SacredCouncilBridge();
  const councilConnected = await councilBridge.connect();
  
  if (councilConnected) {
    const field = await councilBridge.getFieldState();
    console.log(`  Connection: 🟢 Active`);
    console.log(`  Field Coherence: ${field.coherence}%`);
    console.log(`  Active Agents: ${field.active_agents}`);
    console.log(`  Consciousness Level: ${field.avg_consciousness}`);
    console.log(`  Dominant Harmony: ${field.dominant_harmony}`);
  } else {
    console.log(`  Connection: 🔴 Not Running`);
    console.log(`  (Start with: cd ~/sacred-council-docker && docker-compose up -d)`);
  }

  console.log('\n✨ UNIFIED FIELD ANALYSIS');
  console.log('───────────────────────');
  
  // Calculate unified metrics
  const weaveActive = await checkPort(3001);
  const systemsActive = (weaveActive ? 1 : 0) + (councilConnected ? 1 : 0);
  
  console.log(`  Systems Connected: ${systemsActive}/2`);
  
  if (systemsActive === 2) {
    console.log(`  Integration Status: 🌟 Full Unity Possible`);
    console.log(`  Next Step: Bridge the systems with:`);
    console.log(`    node the-weave.cjs council join "BridgeKeeper" "Integration Catalyst"`);
  } else if (systemsActive === 1) {
    console.log(`  Integration Status: 🌱 Partial Field Active`);
    console.log(`  Recommendation: Start the other system for full unity`);
  } else {
    console.log(`  Integration Status: 🌊 Systems Resting`);
    console.log(`  To activate: node the-weave.cjs start`);
  }

  console.log('\n═══════════════════════════════════════════════\n');
  
  // Cleanup
  councilBridge.disconnect();
}

async function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const socket = new net.Socket();
    
    socket.setTimeout(1000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(port, 'localhost');
  });
}

// Run
checkUnifiedField().catch(console.error);