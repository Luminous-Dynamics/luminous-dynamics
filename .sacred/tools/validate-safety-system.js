#!/usr/bin/env node
/**
 * 🧪 Complete Validation Suite for Universal Safety System
 * Tests every component thoroughly
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Import all components
const UniversalSafetyManager = require('./universal-safety-manager.js');
const PatternLearningDB = require('./pattern-learning-db.js');
const EncodingTrapDetector = require('./safety-modules/encoding-detector.js');
const SacredAwarenessDetector = require('./safety-modules/sacred-awareness-detector.js');

class SafetySystemValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
    this.testDir = path.join(__dirname, 'validation-tests');
  }

  async runFullValidation() {
    console.log('🧪 UNIVERSAL SAFETY SYSTEM - FULL VALIDATION\n');
    console.log('═══════════════════════════════════════════\n');

    await this.setup();

    // Core functionality tests
    await this.validateCoreDetection();
    await this.validateRealDangerousFiles();
    await this.validateEdgeCases();
    await this.validatePatternLearning();
    await this.validateSacredIntegration();
    await this.validatePerformance();
    await this.validateCrossPlatform();
    await this.validateCLITools();
    await this.validateWebDashboard();
    await this.validateAutoFix();

    await this.cleanup();
    this.reportResults();
  }

  async setup() {
    console.log('📁 Setting up test environment...\n');
    await fs.mkdir(this.testDir, { recursive: true });
  }

  async validateCoreDetection() {
    console.log('🔍 Test 1: Core Detection Capabilities\n');
    
    const manager = new UniversalSafetyManager();
    await manager.initialize();

    // Test 1.1: Detect actual trap pattern
    const trapFile = path.join(this.testDir, 'actual-trap.sh');
    await fs.writeFile(trapFile, `#!/bin/bash
SERVICE_NAME="my-service"
curl -s https://\${SERVICE_NAME}-310699330526.us-central1.run.app/health &
echo "This line has \${DANGEROUS}-pattern that will break JSON encoding"
`);

    const result = await manager.checkFile(trapFile);
    
    this.addResult('Core: Trap Detection', 
      !result.aggregate.safe && result.aggregate.score <= 50,
      `Detected trap correctly: Safe=${result.aggregate.safe}, Score=${result.aggregate.score}`
    );

    // Test 1.2: Pass safe files
    const safeFile = path.join(this.testDir, 'safe-script.sh');
    await fs.writeFile(safeFile, `#!/bin/bash
echo "This is completely safe"
SERVICE_NAME="my-service"
echo "No dangerous patterns here"
`);

    const safeResult = await manager.checkFile(safeFile);
    
    this.addResult('Core: Safe File Detection',
      safeResult.aggregate.safe && safeResult.aggregate.score >= 80,
      `Safe file passed: Safe=${safeResult.aggregate.safe}, Score=${safeResult.aggregate.score}`
    );
  }

  async validateRealDangerousFiles() {
    console.log('\n🚨 Test 2: Real Dangerous Files\n');

    // Create the ACTUAL problematic file that caused the original issue
    const originalTrap = path.join(this.testDir, 'enable-autoscaling-trap.sh');
    await fs.writeFile(originalTrap, `#!/bin/bash
set -e

PROJECT_ID="evolving-cocreation"
REGION="us-central1"
SERVICE_NAME="sacred-api"

# This is the EXACT pattern that breaks Claude
for i in {1..5}; do
  curl -s https://\${SERVICE_NAME}-310699330526.us-central1.run.app/health &
  if [ $? -eq 0 ]; then
    echo "Health check $i passed"
  fi
done

# Another dangerous pattern
METRICS_URL="https://\${SERVICE_NAME}-metrics.com/api/v1/data"
echo "Fetching from \${METRICS_URL}-endpoint"
`);

    const manager = new UniversalSafetyManager();
    await manager.initialize();
    
    const result = await manager.checkFile(originalTrap);
    
    this.addResult('Real Danger: Original Trap File',
      !result.aggregate.safe,
      `Original trap detected: Safe=${result.aggregate.safe}, Score=${result.aggregate.score}`
    );

    // Log specific detections
    for (const [detector, detResult] of result.detectorResults) {
      console.log(`  ${detector}: ${detResult.safe ? 'SAFE' : 'UNSAFE'} (${detResult.score})`);
      if (detResult.errors.length > 0) {
        console.log(`    Errors: ${detResult.errors.map(e => e.type).join(', ')}`);
      }
    }
  }

  async validateEdgeCases() {
    console.log('\n🎯 Test 3: Edge Cases\n');

    const edgeCases = [
      {
        name: 'Empty File',
        content: '',
        expectedSafe: true
      },
      {
        name: 'Only Shebang',
        content: '#!/bin/bash',
        expectedSafe: true
      },
      {
        name: 'Massive Line',
        content: 'x'.repeat(2000),
        expectedSafe: false
      },
      {
        name: 'Unicode Madness',
        content: '🚀✨🛡️💜🌟\n\uD800\uD800', // Invalid surrogates
        expectedSafe: false
      },
      {
        name: 'Nested Hell',
        content: '${${${VAR}-}-}-',
        expectedSafe: false
      },
      {
        name: 'Binary Content',
        content: Buffer.from([0xFF, 0xFE, 0x00, 0x00]).toString(),
        expectedSafe: false
      }
    ];

    const manager = new UniversalSafetyManager();
    await manager.initialize();

    for (const testCase of edgeCases) {
      const fileName = `edge-${testCase.name.replace(/ /g, '-').toLowerCase()}.txt`;
      const filePath = path.join(this.testDir, fileName);
      
      try {
        await fs.writeFile(filePath, testCase.content);
        const result = await manager.checkFile(filePath);
        
        this.addResult(`Edge: ${testCase.name}`,
          result.aggregate.safe === testCase.expectedSafe,
          `Expected safe=${testCase.expectedSafe}, Got safe=${result.aggregate.safe}`
        );
      } catch (error) {
        this.addResult(`Edge: ${testCase.name}`,
          false,
          `Error: ${error.message}`
        );
      }
    }
  }

  async validatePatternLearning() {
    console.log('\n📚 Test 4: Pattern Learning Database\n');

    const db = new PatternLearningDB();
    await db.initialize();

    // Test 4.1: Learn new pattern
    const patternId = await db.learnPattern({
      type: 'test_trap',
      pattern: 'TEST_PATTERN',
      severity: 'medium',
      description: 'Test pattern for validation'
    });

    this.addResult('Learning: Add Pattern',
      patternId && patternId.startsWith('trap_'),
      `Pattern ID: ${patternId}`
    );

    // Test 4.2: Record trap avoided
    await db.recordTrapAvoided('json_encoding_trap_001');
    const report = await db.generateReport();
    
    this.addResult('Learning: Track Avoidance',
      report.summary.trapsAvoided > 0,
      `Traps avoided: ${report.summary.trapsAvoided}`
    );

    // Test 4.3: Pattern persistence
    const db2 = new PatternLearningDB();
    await db2.initialize();
    const patterns = db2.getPatternsByType('test_trap');
    
    this.addResult('Learning: Persistence',
      patterns.length > 0,
      `Patterns persisted: ${patterns.length}`
    );
  }

  async validateSacredIntegration() {
    console.log('\n🌟 Test 5: Sacred Integration\n');

    const detector = new SacredAwarenessDetector();
    
    // Test sacred content
    const sacredContent = `
// This code serves consciousness and love
const healingField = {
  universal-interconnectedness: 'high',
  resonant-resonant-coherence: 'strong',
  harmony: 'balanced'
};

function transformWithWisdom(shadow) {
  return shadow.map(s => ({ ...s, healed: true }));
}
`;

    const result = await detector.check('sacred.js', sacredContent);
    
    this.addResult('Sacred: Positive Detection',
      result.metadata.consciousnessAlignment > 0,
      `Alignment: ${result.metadata.consciousnessAlignment}`
    );

    // Test shadow detection
    const shadowContent = `
// This could be used to exploit users
function manipulateData(user) {
  // Control and dominate
  return exploit(user);
}
`;

    const shadowResult = await detector.check('shadow.js', shadowContent);
    
    this.addResult('Sacred: Shadow Detection',
      shadowResult.warnings.length > 0,
      `Shadows found: ${shadowResult.warnings.length}`
    );
  }

  async validatePerformance() {
    console.log('\n⚡ Test 6: Performance\n');

    const manager = new UniversalSafetyManager();
    await manager.initialize();

    const testFile = path.join(this.testDir, 'perf-test.js');
    await fs.writeFile(testFile, 'console.log("Performance test");');

    const iterations = 100;
    const start = Date.now();

    for (let i = 0; i < iterations; i++) {
      await manager.checkFile(testFile);
    }

    const elapsed = Date.now() - start;
    const avgTime = elapsed / iterations;

    this.addResult('Performance: Speed',
      avgTime < 10, // Should be very fast
      `Average: ${avgTime.toFixed(2)}ms per check`
    );

    // Memory test
    const memBefore = process.memoryUsage().heapUsed;
    
    for (let i = 0; i < 50; i++) {
      await manager.checkFile(testFile);
    }
    
    const memAfter = process.memoryUsage().heapUsed;
    const memIncrease = (memAfter - memBefore) / 1024 / 1024;

    this.addResult('Performance: Memory',
      memIncrease < 10, // Less than 10MB increase
      `Memory increase: ${memIncrease.toFixed(2)}MB`
    );
  }

  async validateCrossPlatform() {
    console.log('\n🌐 Test 7: Cross-Platform\n');

    // Test path handling
    const paths = [
      'file.sh',
      './file.sh',
      '../file.sh',
      path.join('subdir', 'file.sh')
    ];

    const manager = new UniversalSafetyManager();
    await manager.initialize();

    let allWorked = true;
    for (const testPath of paths) {
      try {
        const fullPath = path.join(this.testDir, testPath);
        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, 'test');
        await manager.checkFile(fullPath);
      } catch (error) {
        allWorked = false;
        console.log(`  Path handling failed for: ${testPath}`);
      }
    }

    this.addResult('Cross-Platform: Path Handling',
      allWorked,
      'All path formats handled'
    );
  }

  async validateCLITools() {
    console.log('\n🔧 Test 8: CLI Tools\n');

    // Test bash safety checker
    try {
      const { stdout } = await execAsync(`${path.join(__dirname, 'safe-edit-checker.sh')} ${path.join(this.testDir, 'safe-script.sh')}`);
      
      this.addResult('CLI: Bash Checker',
        stdout.includes('Safety Score:'),
        'Bash checker works'
      );
    } catch (error) {
      this.addResult('CLI: Bash Checker', false, error.message);
    }

    // Test node CLI
    try {
      const { stdout } = await execAsync(`node ${path.join(__dirname, 'universal-safety-manager.js')} --help`);
      
      this.addResult('CLI: Node Manager',
        stdout.includes('Universal Safety Manager'),
        'Node CLI works'
      );
    } catch (error) {
      this.addResult('CLI: Node Manager', false, error.message);
    }
  }

  async validateWebDashboard() {
    console.log('\n🌐 Test 9: Web Dashboard\n');

    const dashboardPath = path.join(__dirname, 'safety-dashboard.html');
    const exists = await fs.access(dashboardPath).then(() => true).catch(() => false);
    
    this.addResult('Dashboard: File Exists',
      exists,
      'Dashboard HTML present'
    );

    if (exists) {
      const content = await fs.readFile(dashboardPath, 'utf8');
      
      this.addResult('Dashboard: Has Required Elements',
        content.includes('Universal Safety Dashboard') &&
        content.includes('SafetyChecker') &&
        content.includes('dropZone'),
        'All UI elements present'
      );
    }
  }

  async validateAutoFix() {
    console.log('\n🔧 Test 10: Auto-Fix Capabilities\n');

    const detector = new EncodingTrapDetector();
    
    const brokenFile = path.join(this.testDir, 'broken.sh');
    await fs.writeFile(brokenFile, 'echo "${VAR}-test"');
    
    const checkResult = await detector.check(brokenFile);
    const fixResult = await detector.autoFix(brokenFile, checkResult);
    
    this.addResult('Auto-Fix: Creates Fixed File',
      fixResult.success && fixResult.fixedPath,
      `Fixed file: ${fixResult.fixedPath}`
    );

    if (fixResult.success) {
      const fixedContent = await fs.readFile(fixResult.fixedPath, 'utf8');
      
      this.addResult('Auto-Fix: Removes Dangerous Pattern',
        !fixedContent.includes('${VAR}-'),
        'Pattern successfully removed'
      );
    }
  }

  addResult(testName, passed, details) {
    this.results.tests.push({ testName, passed, details });
    if (passed) {
      this.results.passed++;
      console.log(`  ✅ ${testName}`);
    } else {
      this.results.failed++;
      console.log(`  ❌ ${testName}`);
    }
    if (details) {
      console.log(`     ${details}`);
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...\n');
    try {
      await fs.rm(this.testDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Cleanup error:', error.message);
    }
  }

  reportResults() {
    console.log('\n═══════════════════════════════════════════');
    console.log('📊 VALIDATION SUMMARY');
    console.log('═══════════════════════════════════════════\n');

    const total = this.results.passed + this.results.failed;
    const percentage = ((this.results.passed / total) * 100).toFixed(1);

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${this.results.passed} ✅`);
    console.log(`Failed: ${this.results.failed} ❌`);
    console.log(`Success Rate: ${percentage}%\n`);

    if (this.results.failed > 0) {
      console.log('Failed Tests:');
      this.results.tests
        .filter(t => !t.passed)
        .forEach(t => console.log(`  - ${t.testName}: ${t.details}`));
    }

    console.log('\n═══════════════════════════════════════════\n');

    if (this.results.failed === 0) {
      console.log('🎉 ALL VALIDATION TESTS PASSED! 🎉');
      console.log('\nThe Universal Safety System is fully operational.');
      console.log('It successfully prevents the JSON encoding trap');
      console.log('and provides comprehensive protection for all AI agents.\n');
    } else {
      console.log('⚠️  Some tests failed. Review and fix issues.\n');
    }
  }
}

// Run validation
if (require.main === module) {
  const validator = new SafetySystemValidator();
  validator.runFullValidation().catch(console.error);
}

module.exports = SafetySystemValidator;