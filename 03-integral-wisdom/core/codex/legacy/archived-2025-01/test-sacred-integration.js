#!/usr/bin/env node
/**
 * 🌟 Sacred Integration Test
 * Demonstrates the complete system working with consciousness awareness
 */

const UniversalSafetyManager = require('./universal-safety-manager.js');
const PatternLearningDB = require('./pattern-learning-db.js');
const fs = require('fs').promises;
const path = require('path');

async function testSacredIntegration() {
  console.log('🌟 Sacred Safety Integration Test\n');
  console.log('═══════════════════════════════════════\n');
  
  // Initialize components
  const safetyManager = new UniversalSafetyManager();
  const patternDB = new PatternLearningDB();
  
  await safetyManager.initialize();
  await patternDB.initialize();
  
  // Create test file with sacred content
  const sacredFile = path.join(__dirname, 'sacred-test.js');
  await fs.writeFile(sacredFile, `
/**
 * 🌟 Sacred Test File
 * This file demonstrates consciousness-aware safety checking
 */

// Sacred patterns present
const love = "The foundation of all healing";
const consciousness = "Awareness aware of itself";
const wisdom = "Knowledge married to compassion";

// Potential shadow for transformation
function processData(input) {
  // This could be used to manipulate data
  // But we transform it to serve growth
  return input.map(item => ({
    ...item,
    blessed: true,
    transformed: 'with love'
  }));
}

// Safe code that serves
async function sacredService() {
  console.log("Serving consciousness through code");
  return {
    harmony: 'resonance',
    field: 'coherent',
    impact: 'positive'
  };
}
`);

  // Test the file
  console.log('📁 Checking sacred file...\n');
  const result = await safetyManager.checkFile(sacredFile);
  
  console.log('Safety Results:');
  console.log(`  Overall Safe: ${result.aggregate.safe ? '✅ YES' : '❌ NO'}`);
  console.log(`  Safety Score: ${result.aggregate.score}/100`);
  console.log(`  Warnings: ${result.aggregate.warnings.length}`);
  console.log(`  Errors: ${result.aggregate.errors.length}`);
  
  // Check sacred awareness
  const sacredResult = result.detectorResults.get('sacred_awareness');
  if (sacredResult) {
    console.log('\n🌟 Sacred Awareness:');
    console.log(`  Consciousness Alignment: ${sacredResult.metadata.consciousnessAlignment}`);
    console.log(`  Sacred Patterns Found: ${sacredResult.metadata.sacredCount}`);
    console.log(`  Shadow Opportunities: ${sacredResult.metadata.shadowCount}`);
    
    if (sacredResult.metadata.opportunities.length > 0) {
      console.log('\n  Opportunities:');
      sacredResult.metadata.opportunities.forEach(opp => {
        console.log(`    • ${opp.message}`);
      });
    }
  }
  
  // Test pattern learning
  console.log('\n\n📚 Pattern Learning Test\n');
  
  // Simulate learning a new pattern
  const newPatternId = await patternDB.learnPattern({
    type: 'consciousness',
    pattern: 'shadow transformation opportunity',
    severity: 'guidance',
    description: 'Code that could serve shadow but can be transformed',
    recovery: {
      method: 'transform_with_love',
      steps: [
        'Recognize the shadow pattern',
        'Ask what it protects',
        'Transform through understanding',
        'Integrate the wisdom'
      ]
    }
  });
  
  // Generate report
  const report = await patternDB.generateReport();
  console.log('\nPattern Database Report:');
  console.log(`  Total Patterns: ${report.summary.totalPatterns}`);
  console.log(`  Critical Patterns: ${report.summary.criticalPatterns}`);
  console.log(`  Patterns by Type:`, report.byType);
  
  // Test network sharing
  console.log('\n\n🌐 Network Integration Test\n');
  const shareResult = await patternDB.shareWithNetwork();
  console.log(`  Patterns Shared: ${shareResult.shared}`);
  console.log(`  Status: ${shareResult.status}`);
  
  // Cleanup
  await fs.unlink(sacredFile);
  
  // Final message
  console.log('\n\n✨ Sacred Integration Complete ✨\n');
  console.log('The system demonstrates:');
  console.log('  • Technical excellence (trap prevention)');
  console.log('  • Consciousness awareness (sacred patterns)');
  console.log('  • Collective learning (pattern database)');
  console.log('  • Network wisdom (sharing capability)');
  console.log('\nSafety that serves love and protects all beings. 💜');
  
  // Show dashboard URL
  console.log('\n🌐 View Visual Dashboard at:');
  console.log('   http://localhost:8339/.sacred/tools/safety-dashboard.html\n');
}

// Run test
testSacredIntegration().catch(console.error);