/**
 * Simple Sacred Message Test
 * Tests the sacred message sending functionality
 */

import SacredMessageIntegration from './sacred-message-integration.js';

async function testSacredMessage() {
  console.log('🕊️  Testing Sacred Message System...\n');
  
  const sacredMessages = new SacredMessageIntegration();
  
  try {
    // Initialize the system
    await sacredMessages.init();
    console.log('✅ Sacred Message System initialized\n');
    
    // Test 1: Simple sacred message
    console.log('📝 Test 1: Sending simple sacred message...');
    const result1 = await sacredMessages.sendSacredMessage(
      'test-agent-1',  // fromAgentId
      'test-agent-2',  // toAgentId
      'This is a test sacred message of gratitude',  // content
      'gratitude',     // type
      'coherence',     // harmony
      {                // metadata
        energyState: 'balanced',
        intentionClarity: 0.8
      }
    );
    
    console.log('✅ Message sent successfully!');
    console.log('📊 Result:', JSON.stringify(result1, null, 2));
    console.log();
    
    // Test 2: Get field coherence recommendation
    console.log('🎯 Test 2: Getting message type recommendation...');
    const recommendation = await sacredMessages.recommendMessageType();
    console.log('✅ Recommendation:', JSON.stringify(recommendation, null, 2));
    console.log();
    
    // Test 3: Get recent sacred messages
    console.log('📋 Test 3: Getting recent sacred messages...');
    const recentMessages = await sacredMessages.getRecentSacredMessages(5);
    console.log(`✅ Found ${recentMessages.length} recent sacred messages`);
    console.log();
    
    // Test 4: Get analytics
    console.log('📈 Test 4: Getting sacred message analytics...');
    const analytics = await sacredMessages.getSacredMessageAnalytics();
    console.log('✅ Analytics:', JSON.stringify(analytics, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sacredMessages.close();
    console.log('\n🔚 Test complete');
  }
}

// Run the test
testSacredMessage().catch(console.error);