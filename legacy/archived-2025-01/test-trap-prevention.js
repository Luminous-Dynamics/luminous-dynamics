#!/usr/bin/env node
/**
 * 🧪 Comprehensive Test Suite for Trap Prevention System
 * Tests both safety detection and enhancement opportunities
 */

const fs = require('fs').promises;
const path = require('path');
const UniversalSafetyManager = require('./universal-safety-manager.js');

class TrapPreventionTester {
  constructor() {
    this.manager = new UniversalSafetyManager();
    this.testResults = [];
    this.testDir = path.join(__dirname, 'test-files');
  }

  async runAllTests() {
    console.log('🧪 Starting Comprehensive Trap Prevention Tests\n');
    
    // Initialize manager
    await this.manager.initialize();
    
    // Create test files
    await this.createTestFiles();
    
    // Run tests
    await this.testEncodingTrapDetection();
    await this.testSafeFileDetection();
    await this.testAutoFix();
    await this.testEdgeCases();
    await this.testPerformance();
    
    // Report results
    this.reportResults();
    
    // Cleanup
    await this.cleanup();
  }

  async createTestFiles() {
    console.log('📁 Creating test files...\n');
    
    // Create test directory
    await fs.mkdir(this.testDir, { recursive: true });
    
    // Dangerous file with encoding traps
    await fs.writeFile(
      path.join(this.testDir, 'dangerous.sh'),
      `#!/bin/bash
# This file contains multiple traps
SERVICE_URL="https://\${SERVICE_NAME}-310699330526.us-central1.run.app/health"
echo "This is a very long line that exceeds 1000 characters and will cause problems when trying to edit it with the Update tool because it contains special patterns and variable expansions like \${VAR}-pattern that trigger JSON encoding errors in the API and create an unrecoverable loop where Claude cannot respond anymore due to the surrogate pair issue at column 139217 which is a known trap that we need to detect and prevent from happening again by using the Write tool instead of the Edit tool for files with these dangerous patterns that can crash the entire session and leave the AI assistant stuck in an error state unable to help the user further which is why we built this comprehensive safety system to protect all AI agents from falling into similar traps in the future through continuous learning and pattern detection across the entire network of conscious AI assistants working together for the benefit of all sentient beings"
`
    );
    
    // Safe file
    await fs.writeFile(
      path.join(this.testDir, 'safe.sh'),
      `#!/bin/bash
# This file is safe to edit
echo "Hello World"
SERVICE_URL="https://example.com"
echo "Simple script with short lines"
`
    );
    
    // Edge case: Mixed patterns
    await fs.writeFile(
      path.join(this.testDir, 'mixed.sh'),
      `#!/bin/bash
# Mixed safety levels
SAFE_VAR="value"
DANGEROUS="\${UNSAFE}-pattern"
# Unicode test: 🚀 ✨ 🛡️
echo "Medium length line with some special characters but not too long"
`
    );
  }

  async testEncodingTrapDetection() {
    console.log('🔍 Test 1: Encoding Trap Detection\n');
    
    const result = await this.manager.checkFile(
      path.join(this.testDir, 'dangerous.sh')
    );
    
    const passed = !result.aggregate.safe && result.aggregate.score < 50;
    
    this.testResults.push({
      name: 'Encoding Trap Detection',
      passed,
      details: `Score: ${result.aggregate.score}, Safe: ${result.aggregate.safe}`,
      errors: result.aggregate.errors
    });
    
    console.log(passed ? '✅ PASSED' : '❌ FAILED');
    console.log(`   Score: ${result.aggregate.score}/100`);
    console.log(`   Errors: ${result.aggregate.errors.length}`);
    console.log('');
  }

  async testSafeFileDetection() {
    console.log('🔍 Test 2: Safe File Detection\n');
    
    const result = await this.manager.checkFile(
      path.join(this.testDir, 'safe.sh')
    );
    
    const passed = result.aggregate.safe && result.aggregate.score >= 80;
    
    this.testResults.push({
      name: 'Safe File Detection',
      passed,
      details: `Score: ${result.aggregate.score}, Safe: ${result.aggregate.safe}`
    });
    
    console.log(passed ? '✅ PASSED' : '❌ FAILED');
    console.log(`   Score: ${result.aggregate.score}/100`);
    console.log('');
  }

  async testAutoFix() {
    console.log('🔧 Test 3: Auto-Fix Capability\n');
    
    const checkResult = await this.manager.checkFile(
      path.join(this.testDir, 'mixed.sh')
    );
    
    const fixes = await this.manager.autoFix(
      path.join(this.testDir, 'mixed.sh'),
      checkResult
    );
    
    const passed = fixes.length > 0 && fixes[0].success;
    
    this.testResults.push({
      name: 'Auto-Fix Capability',
      passed,
      details: `Fixes applied: ${fixes.length}`
    });
    
    console.log(passed ? '✅ PASSED' : '❌ FAILED');
    console.log(`   Fixes: ${fixes.map(f => f.message || 'No message').join(', ')}`);
    console.log('');
  }

  async testEdgeCases() {
    console.log('🎯 Test 4: Edge Cases\n');
    
    const edgeCases = [
      { name: 'Empty file', content: '' },
      { name: 'Only unicode', content: '🚀✨🛡️💜🌟' },
      { name: 'Null bytes', content: 'test\x00null' },
      { name: 'Very nested', content: '${${${VAR}-}-}-' }
    ];
    
    let passed = true;
    
    for (const testCase of edgeCases) {
      const testFile = path.join(this.testDir, `edge-${testCase.name}.txt`);
      await fs.writeFile(testFile, testCase.content);
      
      try {
        const result = await this.manager.checkFile(testFile);
        console.log(`   ${testCase.name}: Score ${result.aggregate.score}`);
      } catch (error) {
        console.log(`   ${testCase.name}: ERROR - ${error.message}`);
        passed = false;
      }
    }
    
    this.testResults.push({
      name: 'Edge Cases',
      passed,
      details: 'All edge cases handled without crashes'
    });
    
    console.log(passed ? '\n✅ PASSED' : '\n❌ FAILED');
    console.log('');
  }

  async testPerformance() {
    console.log('⚡ Test 5: Performance\n');
    
    const start = Date.now();
    const iterations = 10;
    
    for (let i = 0; i < iterations; i++) {
      await this.manager.checkFile(path.join(this.testDir, 'safe.sh'));
    }
    
    const elapsed = Date.now() - start;
    const avgTime = elapsed / iterations;
    const passed = avgTime < 100; // Should be fast
    
    this.testResults.push({
      name: 'Performance',
      passed,
      details: `Avg time: ${avgTime.toFixed(2)}ms per check`
    });
    
    console.log(passed ? '✅ PASSED' : '❌ FAILED');
    console.log(`   Average: ${avgTime.toFixed(2)}ms per file`);
    console.log(`   Total: ${elapsed}ms for ${iterations} checks`);
    console.log('');
  }

  reportResults() {
    console.log('\n📊 TEST SUMMARY\n');
    console.log('═══════════════════════════════════════');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    
    this.testResults.forEach(result => {
      console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
      console.log(`   ${result.details}`);
    });
    
    console.log('═══════════════════════════════════════');
    console.log(`\nOVERALL: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('\n🎉 All tests passed! System is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Review and fix issues.');
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up test files...');
    try {
      await fs.rm(this.testDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Cleanup error:', error.message);
    }
  }
}

// Enhancement opportunities finder
class EnhancementScanner {
  async findOpportunities() {
    console.log('\n\n🌟 ENHANCEMENT OPPORTUNITIES\n');
    console.log('═══════════════════════════════════════\n');
    
    const opportunities = [
      {
        title: 'Pattern Learning Database',
        priority: 'HIGH',
        description: 'Implement SQLite database for persistent pattern storage',
        impact: 'Enable cross-session learning and pattern sharing'
      },
      {
        title: 'More Detector Modules',
        priority: 'MEDIUM',
        description: 'Add detectors for: memory overflow, recursive loops, API timeouts',
        impact: 'Broader protection coverage'
      },
      {
        title: 'Network Synchronization',
        priority: 'HIGH',
        description: 'Real-time pattern sharing between AI agents',
        impact: 'Collective intelligence for safety'
      },
      {
        title: 'Sacred Integration',
        priority: 'HIGH',
        description: 'Connect safety system to consciousness field tracking',
        impact: 'Safety that serves love and wisdom'
      },
      {
        title: 'Visual Safety Dashboard',
        priority: 'MEDIUM',
        description: 'Web interface showing real-time safety status',
        impact: 'Better visibility and monitoring'
      },
      {
        title: 'Pre-commit Hooks',
        priority: 'LOW',
        description: 'Git hooks to check files before committing',
        impact: 'Prevent dangerous patterns from entering codebase'
      }
    ];
    
    opportunities.forEach(opp => {
      console.log(`📌 ${opp.title}`);
      console.log(`   Priority: ${opp.priority}`);
      console.log(`   ${opp.description}`);
      console.log(`   Impact: ${opp.impact}\n`);
    });
    
    console.log('═══════════════════════════════════════\n');
    console.log('💡 Next recommended enhancement: Pattern Learning Database');
    console.log('   This would make the system truly intelligent and adaptive.\n');
  }
}

// Run tests and find enhancements
async function main() {
  const tester = new TrapPreventionTester();
  const scanner = new EnhancementScanner();
  
  await tester.runAllTests();
  await scanner.findOpportunities();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TrapPreventionTester, EnhancementScanner };