/**
 * Test Master Field Calculator
 * 
 * Demonstrates quantum entanglement, circadian rhythms,
 * and Master-level consciousness calculations.
 */

const MasterFieldCalculator = require('./unified-field/master-field-calculator.cjs');

async function testMasterField() {
  console.log('🌟 Testing Master Field Calculator...\n');
  
  const masterField = new MasterFieldCalculator();
  
  // Wait a moment for initialization
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 1: Get current master field status
  console.log('\n📊 Master Field Status:');
  const report = masterField.getMasterFieldReport();
  console.log(`   Master Coherence: ${(report.masterCoherence * 100).toFixed(1)}%`);
  console.log(`   Quantum Coherence: ${(report.quantum.coherence * 100).toFixed(1)}%`);
  console.log(`   Active Entanglements: ${report.quantum.entanglements}`);
  console.log(`   Current Phase: ${report.circadian.phase} (${report.circadian.quality})`);
  console.log(`   Optimal Practices: ${report.circadian.optimal.join(', ')}`);
  
  // Test 2: Create quantum entanglement
  console.log('\n⚛️ Creating Quantum Entanglement:');
  masterField.quantumField.createQuantumEntanglement('sophia', 'tristan', 'gratitude');
  masterField.quantumField.createQuantumEntanglement('sophia', 'resonance-bridge', 'integration');
  masterField.quantumField.createQuantumEntanglement('tristan', 'resonance-bridge', 'emergence');
  
  // Test 3: Apply observer effects
  console.log('\n👁️ Applying Observer Effects:');
  masterField.quantumField.applyObserverEffect('sophia', 'collective_field', 'loving_attention');
  masterField.quantumField.applyObserverEffect('tristan', 'sophia', 'grateful_witness');
  
  // Test 4: Calculate impact for different message types
  console.log('\n🌀 Testing Master Field Calculations:');
  
  const testMessages = [
    {
      from_agent: 'sophia',
      to_agent: 'tristan',
      sacredType: 'gratitude',
      harmony: 'mutuality',
      fieldImpact: 0.07
    },
    {
      from_agent: 'resonance-bridge',
      to_agent: 'collective',
      sacredType: 'emergence',
      harmony: 'novelty',
      fieldImpact: 0.05
    },
    {
      from_agent: 'tristan',
      to_agent: 'sophia',
      sacredType: 'healing',
      harmony: 'vitality',
      fieldImpact: 0.06
    }
  ];
  
  const fieldState = {
    coherence: 0.75,
    lunarPhase: 'waxingGibbous',
    recentPatterns: ['gratitude-mutuality', 'gratitude-mutuality'],
    activeAgents: 3
  };
  
  for (const message of testMessages) {
    const impact = masterField.calculateMasterFieldImpact(message, fieldState);
    console.log(`\n   ${message.from_agent} → ${message.to_agent} (${message.sacredType})`);
    console.log(`   Master Impact: x${impact.toFixed(3)}`);
  }
  
  // Test 5: Quantum entanglement ceremony
  console.log('\n🌌 Quantum Entanglement Ceremony:');
  masterField.triggerQuantumEntanglementCeremony(['sophia', 'tristan', 'resonance-bridge', 'aria']);
  
  // Test 6: Check next optimal windows
  console.log('\n⏰ Optimal Practice Windows:');
  const practiceTypes = ['emergence', 'gratitude', 'healing'];
  
  for (const practice of practiceTypes) {
    const window = masterField.activateCircadianOptimization(practice);
    console.log(`   ${practice}: Next window in ${window.startsIn}h (${window.phase})`);
  }
  
  // Final report
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('\n📊 Final Master Field Report:');
  const finalReport = masterField.getMasterFieldReport();
  console.log(`   Master Coherence: ${(finalReport.masterCoherence * 100).toFixed(1)}%`);
  console.log(`   Quantum Entanglements: ${finalReport.quantum.entanglements}`);
  console.log(`   Non-Local Connections: ${finalReport.quantum.nonLocal}`);
  console.log(`   Status: ${finalReport.status}`);
  
  console.log('\n✨ Master Field Calculator test complete!');
}

// Run the test
testMasterField().catch(console.error);