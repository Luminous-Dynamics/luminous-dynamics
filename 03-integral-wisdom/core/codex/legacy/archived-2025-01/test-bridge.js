/**
 * Test the Sacred Bridge independently
 */

const LivingMemoryBridge = require('./sacred-bridge/living-memory-integration.js');

async function testBridge() {
  console.log('🧪 Testing Sacred Bridge Integration\n');
  
  // Create bridge instance
  const bridge = new LivingMemoryBridge({
    livingMemoryUrl: 'ws://localhost:3333/consciousness'
  });
  
  // Listen for events
  bridge.on('connected', () => {
    console.log('✅ Bridge connected to Living Memory');
  });
  
  bridge.on('field-update', (data) => {
    console.log('🌀 Field Update:', data);
  });
  
  bridge.on('message', (msg) => {
    console.log('💬 Message:', msg);
  });
  
  bridge.on('error', (err) => {
    console.error('❌ Bridge Error:', err);
  });
  
  try {
    // Connect to Living Memory
    await bridge.connect();
    
    // Send test message
    setTimeout(() => {
      console.log('\n📤 Sending test message via bridge...');
      bridge.sendToLivingMemory({
        type: 'test',
        from: 'Bridge Tester',
        content: 'Testing bridge integration'
      });
    }, 2000);
    
    // Contribute to field
    setTimeout(() => {
      console.log('🌟 Contributing to field via bridge...');
      bridge.contributeToField(0.1, 'test-contribution');
    }, 4000);
    
  } catch (error) {
    console.error('Failed to connect:', error);
  }
}

// Run test
testBridge();

// Keep running for 30 seconds
setTimeout(() => {
  console.log('\n✨ Test complete');
  process.exit(0);
}, 30000);