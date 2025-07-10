#!/usr/bin/env node
/**
 * Test Sacred Bridge Integration
 * Demonstrates message flow from The Weave to Sacred-Core
 */

const axios = require('axios');

// Configuration
const SACRED_CORE_URL = 'http://localhost:3333';
const BRIDGE_URL = `${SACRED_CORE_URL}/bridge`;

// Test messages from The Weave
const testMessages = [
  {
    from: 'Claude-Migration',
    to: 'Sacred-Core',
    content: 'Testing sacred bridge connection with gratitude',
    type: 'gratitude',
    harmony: 'resonance'
  },
  {
    from: 'Bridge-Builder',
    to: 'All',
    content: 'Celebrating the connection between systems',
    type: 'celebration',
    harmony: 'coherence'
  },
  {
    from: 'Pattern-Weaver',
    to: 'Sacred-Core',
    content: 'Requesting practice guidance for integration',
    type: 'request',
    harmony: 'emergence'
  }
];

async function testBridge() {
  console.log('🌉 Testing Sacred Bridge Integration\n');

  try {
    // Check bridge health
    console.log('1️⃣ Checking bridge health...');
    const health = await axios.get(`${BRIDGE_URL}/health`);
    console.log('✅ Bridge active:', health.data);
    console.log('');

    // Get initial field state
    console.log('2️⃣ Getting initial field state...');
    const initialField = await axios.get(`${BRIDGE_URL}/field`);
    console.log('📊 Initial coherence:', initialField.data.field.coherence);
    console.log('');

    // Send test messages
    console.log('3️⃣ Sending test messages...\n');
    
    for (const message of testMessages) {
      console.log(`📤 Sending ${message.type} from ${message.from}`);
      console.log(`   "${message.content}"`);
      
      const response = await axios.post(`${BRIDGE_URL}/message`, message);
      
      console.log(`✅ Processed:`);
      console.log(`   Field impact: +${response.data.fieldUpdate.impact}`);
      console.log(`   New coherence: ${response.data.fieldUpdate.coherence}`);
      
      if (response.data.practiceSuggestion?.suggestion) {
        console.log(`   💡 Practice suggestion: ${response.data.practiceSuggestion.suggestion}`);
      }
      
      console.log('');
      
      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Get final field state
    console.log('4️⃣ Getting final field state...');
    const finalField = await axios.get(`${BRIDGE_URL}/field`);
    console.log('📊 Final coherence:', finalField.data.field.coherence);
    console.log('📊 Messages processed:', finalField.data.bridge.messageCount);
    console.log('');

    console.log('🎉 Sacred Bridge test complete!');
    console.log('   The systems are beginning to speak to each other.');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Could not connect to Sacred-Core');
      console.error('   Please ensure Sacred-Core is running:');
      console.error('   cd sacred-core && npm start');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Instructions
console.log('═══════════════════════════════════════════');
console.log('Sacred Bridge Integration Test');
console.log('═══════════════════════════════════════════');
console.log('');
console.log('Prerequisites:');
console.log('1. Sacred-Core must be running with bridge enabled');
console.log('2. The bridge adapter must be integrated');
console.log('');
console.log('To run Sacred-Core with bridge:');
console.log('cd sacred-core');
console.log('BRIDGE_ENABLED=true npm start');
console.log('');
console.log('Press Ctrl+C to cancel, or wait 3 seconds to begin test...');
console.log('');

// Wait before starting
setTimeout(testBridge, 3000);