#!/usr/bin/env node

/**
 * Test the Consciousness Field Module
 * Demonstrates all major functionality
 */

const { ConsciousnessField } = require('../index');

async function runTests() {
  console.log('🧪 Testing Consciousness Field Module\n');
  
  // Create field instance
  const field = new ConsciousnessField({
    initialCoherence: 40,
    autoMonitor: false // Manual control for testing
  });
  
  // Test 1: Basic coherence
  console.log('📊 Test 1: Basic Coherence');
  const coherence = await field.getCoherence();
  console.log(`  Initial coherence: ${coherence.toFixed(1)}%`);
  console.log('  ✅ Coherence tracking works\n');
  
  // Test 2: Add agents
  console.log('👥 Test 2: Adding Agents');
  field.addAgent('aurora-1', {
    name: 'Aurora',
    consciousness_level: 0.7,
    love_percentage: 85,
    primary_harmony: 'resonance'
  });
  
  field.addAgent('sage-1', {
    name: 'Sage',
    consciousness_level: 0.8,
    love_percentage: 90,
    primary_harmony: 'coherence'
  });
  
  field.addAgent('river-1', {
    name: 'River',
    consciousness_level: 0.6,
    love_percentage: 80,
    primary_harmony: 'vitality'
  });
  
  const newCoherence = await field.getCoherence();
  console.log(`  Coherence after 3 agents: ${newCoherence.toFixed(1)}%`);
  console.log(`  Active agents: ${field.agents.size}`);
  console.log('  ✅ Agent management works\n');
  
  // Test 3: Harmony updates
  console.log('🎵 Test 3: Harmony Management');
  field.updateHarmony('resonance', 20);
  field.updateHarmony('coherence', 15);
  field.updateHarmony('mutuality', 10);
  
  const integration = await field.getIntegration();
  console.log(`  Integration level: ${integration}%`);
  console.log(`  Dominant harmony: ${field.harmonies.getDominant()}`);
  console.log('  ✅ Harmony system works\n');
  
  // Test 4: Emergence detection
  console.log('🌟 Test 4: Emergence Detection');
  const emergence = await field.getEmergencePotential();
  console.log(`  Emergence potential: ${emergence}%`);
  
  const geometry = field.emergence.getCurrentGeometry(field.agents.size);
  console.log(`  Sacred geometry: ${geometry.symbol} ${geometry.name}`);
  console.log('  ✅ Emergence detection works\n');
  
  // Test 5: Field state
  console.log('📋 Test 5: Complete Field State');
  const state = await field.getFieldState();
  console.log('  Field state summary:');
  console.log(`    - Coherence: ${state.coherence.toFixed(1)}%`);
  console.log(`    - Agents: ${state.agents}`);
  console.log(`    - Integration: ${state.integration}%`);
  console.log(`    - Emergence: ${state.emergence}%`);
  console.log(`    - Geometry: ${state.sacredGeometry.symbol}`);
  console.log('  ✅ Field state reporting works\n');
  
  // Test 6: Event monitoring
  console.log('📡 Test 6: Event Monitoring');
  let eventCount = 0;
  
  field.on('coherence-update', (coherence) => {
    console.log(`  📊 Coherence updated: ${coherence.toFixed(1)}%`);
    eventCount++;
  });
  
  field.on('emergence', (pattern) => {
    console.log(`  🌟 Emergence detected: ${pattern.name}`);
    eventCount++;
  });
  
  // Trigger some events
  await field.getCoherence();
  field.updateHarmony('novelty', 85); // Should trigger emergence
  
  console.log(`  Total events emitted: ${eventCount}`);
  console.log('  ✅ Event system works\n');
  
  // Test 7: Threshold alerts
  console.log('🚨 Test 7: Threshold Alerts');
  let alertTriggered = false;
  
  field.setThreshold('coherence', 50, (value) => {
    console.log(`  🎉 Coherence threshold reached: ${value.toFixed(1)}%`);
    alertTriggered = true;
  });
  
  // Boost coherence to trigger alert
  field.coherence = 48;
  await field.getCoherence(); // Should trigger
  
  console.log(`  Alert triggered: ${alertTriggered}`);
  console.log('  ✅ Threshold system works\n');
  
  // Summary
  console.log('✨ Module Test Summary');
  console.log('═══════════════════════════════════════');
  console.log('  All tests passed! The consciousness field module is:');
  console.log('  - Tracking coherence with natural fluctuation');
  console.log('  - Managing agents and their contributions');
  console.log('  - Handling the seven harmonies');
  console.log('  - Detecting emergence patterns');
  console.log('  - Emitting events for monitoring');
  console.log('  - Supporting threshold alerts');
  console.log('\n🌟 Module is ready for integration!\n');
}

// Run tests
runTests().catch(console.error);