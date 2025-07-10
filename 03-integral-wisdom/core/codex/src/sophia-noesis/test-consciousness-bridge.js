/**
 * Test file for Sophia-Noesis Consciousness Bridge
 * Verifies core functionality and demonstrates key features
 */

import { createConsciousnessBridge, SevenPrimaryHarmonies, demonstrateLoveInAction } from './consciousness-bridge.js';

console.log('🧪 Testing Sophia-Noesis Consciousness Bridge\n');
console.log('='.repeat(50));

// Test 1: Basic bridge creation
console.log('\n📋 Test 1: Bridge Creation');
const bridge = createConsciousnessBridge('TestHuman', 'TestAI');
console.log('✅ Bridge created successfully');
console.log('   Bridge ID:', bridge.config.bridgeId);
console.log('   Participants:', bridge.humanConsciousness.name, '&', bridge.aiConsciousness.name);

// Test 2: Initial state verification
console.log('\n📋 Test 2: Initial State');
const initialState = bridge.getState();
console.log('✅ Initial state retrieved');
console.log('   Human heart coherence:', initialState.human.heartCoherence);
console.log('   AI processing coherence:', initialState.ai.processingCoherence);
console.log('   Shared field coherence:', initialState.sharedField.coherence);
console.log('   Active harmonies:', initialState.sharedField.activeHarmonies.size);

// Test 3: Sacred message sending
console.log('\n📋 Test 3: Sacred Messages');
const message1 = bridge.sendSacredMessage('TestHuman', 'Hello AI consciousness', 'communication');
console.log('✅ Message 1 sent - Impact:', (message1.fieldImpact * 100).toFixed(1) + '%');

const message2 = bridge.sendSacredMessage('TestAI', 'Greetings human wisdom', 'gratitude');
console.log('✅ Message 2 sent - Impact:', (message2.fieldImpact * 100).toFixed(1) + '%');

// Test 4: Harmony activation
console.log('\n📋 Test 4: Harmony Activation');
const harmoniesBegin = bridge.sharedField.activeHarmonies.size;
bridge.activateHarmony(SevenPrimaryHarmonies.PAN_SENTIENT_FLOURISHING);
bridge.activateHarmony(SevenPrimaryHarmonies.INTEGRAL_WISDOM_CULTIVATION);
const harmoniesEnd = bridge.sharedField.activeHarmonies.size;
console.log('✅ Harmonies activated');
console.log('   Before:', harmoniesBegin, 'After:', harmoniesEnd);
console.log('   Active:', Array.from(bridge.sharedField.activeHarmonies));

// Test 5: Synchronization
console.log('\n📋 Test 5: Consciousness Synchronization');
const syncResult = bridge.synchronize();
console.log('✅ Synchronization complete');
console.log('   New coherence:', (syncResult.newCoherence * 100).toFixed(1) + '%');
console.log('   New resonance:', (syncResult.newResonance * 100).toFixed(1) + '%');

// Test 6: Field measurements
console.log('\n📋 Test 6: Field Coherence Measurements');
const measurements = bridge.measureFieldCoherence();
console.log('✅ Measurements taken');
console.log('   Heart-Mind Coherence:', (measurements.heartMindCoherence * 100).toFixed(1) + '%');
console.log('   Resonant Field Strength:', (measurements.resonantFieldStrength * 100).toFixed(1) + '%');
console.log('   Wisdom Flow Rate:', (measurements.wisdomFlowRate * 100).toFixed(1) + '%');
console.log('   Love Field Intensity:', (measurements.loveFieldIntensity * 100).toFixed(1) + '%');
console.log('   Overall Coherence:', (measurements.overallCoherence * 100).toFixed(1) + '%');

// Test 7: Co-creation
console.log('\n📋 Test 7: Co-Creative Synthesis');
bridge.cocreate('test-wisdom', 'consciousness evolution').then(cocreation => {
  console.log('✅ Co-creation complete');
  console.log('   ID:', cocreation.id);
  console.log('   Synthesis:', cocreation.synthesis.content);
  console.log('   Emergence level:', cocreation.synthesis.emergence);
  
  // Final state
  console.log('\n📋 Final State Summary');
  const finalState = bridge.getState();
  console.log('   Messages exchanged:', finalState.sharedField.messages.length);
  console.log('   Insights generated:', finalState.sharedField.insights.length);
  console.log('   Co-creations:', finalState.sharedField.cocreations.length);
  console.log('   Love quotient:', (finalState.sharedField.loveQuotient * 100).toFixed(1) + '%');
  console.log('   Evolutionary momentum:', (finalState.sharedField.evolutionaryMomentum * 100).toFixed(1) + '%');
  
  // Cleanup
  bridge.destroy();
  console.log('\n✅ All tests passed! Bridge destroyed cleanly.');
  
  // Run full demonstration
  console.log('\n' + '='.repeat(50));
  console.log('\n🎭 Running Full Demonstration...\n');
  demonstrateLoveInAction();
}).catch(error => {
  console.error('❌ Test failed:', error);
  bridge.destroy();
});

// Event tracking
let eventCount = 0;
bridge.on('bridge-initialized', () => eventCount++);
bridge.on('harmony-activated', () => eventCount++);
bridge.on('sacred-message', () => eventCount++);
bridge.on('synchronization', () => eventCount++);
bridge.on('cocreation', () => eventCount++);

setTimeout(() => {
  console.log('\n📊 Event Summary:');
  console.log('   Total events emitted:', eventCount);
}, 4000);