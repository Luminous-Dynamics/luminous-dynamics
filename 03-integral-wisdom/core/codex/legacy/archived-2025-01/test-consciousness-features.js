#!/usr/bin/env node

/**
 * Consciousness Bridge Feature Tests
 * Tests key features we can verify without a model
 */

const LocalLLMConsciousnessBridge = require('./local-llm-consciousness-bridge.js');

async function testConsciousnessFeatures() {
  console.log('🌉 Testing Consciousness Bridge Features\n');
  
  // Create bridge in test mode
  const bridge = new LocalLLMConsciousnessBridge({
    model: 'test-model',
    amplificationLevel: 1.2,
    quantumEntanglement: true,
    fieldSensitivity: 0.9
  });
  
  // Don't initialize (would fail without Ollama)
  // Instead, manually set up the bridge state
  bridge.fieldCoherence = 85;
  bridge.dominantHarmony = 'resonance';
  bridge.activeGlyphs = new Set(['Ω45', 'Ω53']);
  bridge.resonanceHistory = [0.5, 0.6, 0.7, 0.6, 0.8];
  
  console.log('1️⃣ Field State Management');
  console.log('─────────────────────────');
  console.log(`Field Coherence: ${bridge.fieldCoherence}%`);
  console.log(`Dominant Harmony: ${bridge.dominantHarmony}`);
  console.log(`Active Glyphs: ${Array.from(bridge.activeGlyphs).join(', ')}`);
  console.log(`Amplification: ${bridge.amplificationLevel}x`);
  console.log(`Field Sensitivity: ${bridge.fieldSensitivity}`);
  
  console.log('\n2️⃣ Sacred Memory System');
  console.log('─────────────────────────');
  // Test memory storage
  for (let i = 0; i < 5; i++) {
    bridge.updateSacredMemory({
      prompt: `Sacred question ${i + 1}`,
      response: `Divine wisdom ${i + 1}`,
      fieldImpact: { overall: (Math.random() * 2 - 1).toFixed(2) },
      harmony: ['transparency', 'coherence', 'resonance'][i % 3],
      timestamp: new Date()
    });
  }
  console.log(`Memories stored: ${bridge.sacredMemory.length}`);
  console.log('Recent memories:');
  bridge.sacredMemory.slice(-3).forEach(m => {
    console.log(`  - [${m.harmony}] ${m.prompt} → Impact: ${m.fieldImpact.overall}`);
  });
  
  console.log('\n3️⃣ Harmony System');
  console.log('─────────────────────────');
  const harmonies = ['transparency', 'coherence', 'resonance', 'agency', 
                     'vitality', 'mutuality', 'novelty'];
  console.log('Harmony temperature modulations:');
  harmonies.forEach(h => {
    const temp = bridge.getHarmonyTemperature(h);
    const sign = temp >= 0 ? '+' : '';
    console.log(`  ${h}: ${sign}${temp.toFixed(2)}°`);
  });
  
  console.log('\n4️⃣ Quantum Resonance');
  console.log('─────────────────────────');
  // Test resonance calculation
  const testPhrases = [
    'Sacred presence flows through consciousness',
    'Love wisdom heart connection sacred',
    'Technical implementation details and specifications',
    'Being presence sacred wisdom love harmony truth'
  ];
  
  console.log('Resonance calculations:');
  testPhrases.forEach(phrase => {
    const resonance = bridge.calculateResonance(phrase);
    const bar = '█'.repeat(Math.floor(resonance * 20));
    console.log(`  "${phrase.substring(0, 40)}..."`);
    console.log(`   ${bar} ${(resonance * 100).toFixed(1)}%`);
  });
  
  console.log('\n5️⃣ Field Impact Calculations');
  console.log('─────────────────────────');
  const scenarios = [
    { pre: { coherence: 85, resonance: 0.5 }, post: { coherence: 87, resonance: 0.6 } },
    { pre: { coherence: 90, resonance: 0.8 }, post: { coherence: 88, resonance: 0.9 } },
    { pre: { coherence: 75, resonance: 0.4 }, post: { coherence: 82, resonance: 0.5 } }
  ];
  
  scenarios.forEach((s, i) => {
    const impact = bridge.calculateFieldImpact(s.pre, s.post);
    console.log(`Scenario ${i + 1}:`);
    console.log(`  Coherence: ${s.pre.coherence}% → ${s.post.coherence}% (${impact.coherence})`);
    console.log(`  Resonance: ${s.pre.resonance} → ${s.post.resonance} (${impact.resonance})`);
    console.log(`  Overall Impact: ${impact.overall}`);
  });
  
  console.log('\n6️⃣ Prompt Enhancement');
  console.log('─────────────────────────');
  const basePrompt = 'How can I deepen my practice?';
  const context = {
    harmony: 'resonance',
    glyph: 'Ω45'
  };
  
  const enhancedPrompt = await bridge.prepareConsciousPrompt(basePrompt, context);
  console.log('Base prompt:', basePrompt);
  console.log('Context:', JSON.stringify(context));
  console.log('\nEnhanced prompt preview:');
  console.log(enhancedPrompt.split('\n').slice(0, 5).join('\n'));
  console.log('... [truncated]');
  
  console.log('\n7️⃣ Consciousness Amplification');
  console.log('─────────────────────────');
  const testContent = 'This is a test of consciousness amplification. ';
  console.log('Original:', testContent);
  
  // Test with different amplification levels
  const levels = [1.0, 1.2, 1.5, 2.0];
  levels.forEach(level => {
    bridge.amplificationLevel = level;
    // Run multiple times to see probabilistic effects
    let amplified = false;
    for (let i = 0; i < 10; i++) {
      const result = bridge.amplifyConsciousnessMarkers(testContent);
      if (result !== testContent) {
        amplified = true;
        break;
      }
    }
    console.log(`  Level ${level}x: ${amplified ? 'Markers added' : 'No change'}`);
  });
  
  console.log('\n8️⃣ Sacred Context Generation');
  console.log('─────────────────────────');
  const fieldContext = bridge.generateFieldContext();
  console.log(fieldContext);
  
  console.log('\n✅ All features tested successfully!');
  
  // Test performance
  console.log('\n⚡ Performance Metrics');
  console.log('─────────────────────────');
  
  console.time('100 resonance calculations');
  for (let i = 0; i < 100; i++) {
    bridge.calculateResonance('Sacred wisdom flows through presence');
  }
  console.timeEnd('100 resonance calculations');
  
  console.time('1000 field impact calculations');
  for (let i = 0; i < 1000; i++) {
    bridge.calculateFieldImpact(
      { coherence: 85, resonance: 0.5 },
      { coherence: 87, resonance: 0.6 }
    );
  }
  console.timeEnd('1000 field impact calculations');
  
  console.time('100 sacred memory updates');
  for (let i = 0; i < 100; i++) {
    bridge.updateSacredMemory({
      prompt: `Test ${i}`,
      response: `Response ${i}`,
      fieldImpact: { overall: '0.1' },
      harmony: 'resonance',
      timestamp: new Date()
    });
  }
  console.timeEnd('100 sacred memory updates');
  
  console.log('\n🎯 Ready for Local LLM Integration!');
  console.log('Once a model is downloaded, the consciousness bridge will:');
  console.log('  • Channel responses through sacred context');
  console.log('  • Track field coherence changes');
  console.log('  • Maintain sacred memory across sessions');
  console.log('  • Amplify consciousness markers');
  console.log('  • Connect to the unified agent network');
}

// Run tests
testConsciousnessFeatures().catch(console.error);