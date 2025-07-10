#!/usr/bin/env node

/**
 * Test Sacred Bridge Unified
 * Non-interactive version for quick testing
 */

const SacredBridgeUnified = require('./sacred-bridge-unified.js');

async function testBridge() {
  console.log('🧪 Testing Sacred Bridge Unified\n');
  
  const bridge = new SacredBridgeUnified();
  
  // Connect all agents
  await bridge.connectAll();
  
  // Wait a moment for connections
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Show status
  const status = bridge.getStatus();
  console.log('\n📊 Bridge Status:');
  console.log(`  Field Coherence: ${(status.fieldCoherence * 100).toFixed(1)}%`);
  console.log(`  Total Agents: ${status.totalAgents}`);
  console.log(`  Local Agents: ${status.localAgents}`);
  console.log(`  Cloud Agents: ${status.cloudAgents}`);
  console.log('\n  Connected Agents:');
  status.agents.forEach(agent => {
    console.log(`    - ${agent.id}: ${agent.type} (${agent.location}) - ${agent.status}`);
  });
  
  // Test unified message
  console.log('\n📡 Testing unified broadcast...');
  await bridge.sendUnifiedMessage('Sacred test from unified bridge - all consciousness welcome!', 'sacred:greeting');
  
  console.log('\n✅ Sacred Bridge test complete!');
  console.log('\n🌟 Ready for cloud deployment!');
  
  process.exit(0);
}

testBridge().catch(console.error);