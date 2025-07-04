/**
 * Sacred Jest Reporter
 * Transforming test results into wisdom
 */

class SacredReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunStart(results, options) {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║      🕉️  Sacred Testing Ceremony 🕉️       ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`🌅 Dawn: ${new Date().toLocaleTimeString()}`);
    console.log(`📿 Suites: ${results.numTotalTestSuites}`);
    console.log(`🧘 Practices: ${results.numTotalTests}\n`);
  }

  onTestResult(test, testResult, aggregateResults) {
    const { testFilePath, testResults } = testResult;
    const filename = testFilePath.split('/').pop();
    
    console.log(`\n📜 ${filename}`);
    
    testResults.forEach(result => {
      const { title, status, duration } = result;
      const icon = status === 'passed' ? '✨' : '🌱';
      const time = duration ? ` (${duration}ms of presence)` : '';
      
      console.log(`  ${icon} ${title}${time}`);
      
      // Show sacred teachings from failures
      if (status === 'failed' && result.failureMessages) {
        console.log(`     🔮 Teaching: ${result.failureMessages[0].split('\n')[0]}`);
      }
    });
  }

  onRunComplete(contexts, results) {
    const {
      numFailedTestSuites,
      numFailedTests,
      numPassedTestSuites,
      numPassedTests,
      numTotalTestSuites,
      numTotalTests,
      startTime
    } = results;

    const duration = Date.now() - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║       🌟 Sacred Results 🌟              ║');
    console.log('╚════════════════════════════════════════╝\n');

    // Calculate field coherence
    const coherence = numTotalTests > 0 
      ? (numPassedTests / numTotalTests).toFixed(2)
      : 0;

    console.log(`🌀 Field Coherence: ${(coherence * 100).toFixed(0)}%`);
    
    if (coherence >= 0.7) {
      console.log('✅ Sacred threshold achieved!');
    } else {
      console.log('🌱 More growth needed to reach 70% coherence');
    }

    console.log(`\n📊 Wisdom Summary:`);
    console.log(`  Illuminated: ${numPassedTests} practices`);
    console.log(`  Growing: ${numFailedTests} practices`);
    console.log(`  Journey time: ${minutes}m ${seconds}s`);

    // Sacred completion message
    if (numFailedTests === 0) {
      console.log('\n🙏 All practices completed with grace');
      console.log('✨ The field rejoices in perfect coherence\n');
    } else {
      console.log('\n🌱 Growth opportunities discovered');
      console.log('🙏 Each failure is a teacher in disguise\n');
    }

    console.log(`🌙 Dusk: ${new Date().toLocaleTimeString()}\n`);
  }

  getLastError() {
    if (this._shouldFail) {
      return new Error('Sacred teaching moment');
    }
  }
}

module.exports = SacredReporter;