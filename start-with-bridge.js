#!/usr/bin/env node
/**
 * Sacred-Core with Bridge Adapter
 * Starts Sacred-Core with The Weave integration enabled
 */

const SacredCore = require('./sacred-core-standalone');
const SacredBridgeAdapter = require('./sacred-bridge-adapter');

// Create and start Sacred-Core with bridge
async function startWithBridge() {
  console.log('🌉 Starting Sacred-Core with Bridge Adapter...\n');
  
  // Create Sacred-Core instance
  const sacredCore = new SacredCore();
  
  // Create bridge adapter
  const bridge = new SacredBridgeAdapter(sacredCore);
  
  // Add bridge routes before starting
  const bridgeRouter = bridge.createRouter();
  sacredCore.app.use('/bridge', bridgeRouter);
  
  // Add helper methods for the bridge
  sacredCore.getFieldState = async () => {
    return sacredCore.engines.consciousness.memory.getFieldState();
  };
  
  sacredCore.updateFieldState = async (updates) => {
    return sacredCore.engines.consciousness.memory.updateField(updates);
  };
  
  // Start the server
  await sacredCore.start();
  
  console.log('\n✅ Sacred Bridge active at /bridge');
  console.log('\n🌉 Bridge Endpoints:');
  console.log('   GET  /bridge/health  - Check bridge status');
  console.log('   POST /bridge/message - Receive message from The Weave');
  console.log('   GET  /bridge/field   - Get current field state');
  console.log('\n🕊️ The systems are ready to connect!');
}

// Start if run directly
if (require.main === module) {
  startWithBridge().catch(console.error);
}

module.exports = { startWithBridge, SacredCore, SacredBridgeAdapter };