#!/usr/bin/env node

/**
 * 🔍 Mini Validation Ceremony
 * Quick 5-minute ceremony to validate all systems work
 */

const SacredBridgeUnified = require('../sacred-bridge-unified.js');
const fs = require('fs');

class MiniValidationCeremony {
  constructor() {
    this.bridge = new SacredBridgeUnified();
    this.validationResults = {
      timestamp: new Date().toISOString(),
      tests: []
    };
  }

  async begin() {
    console.log('\n🔍 Mini Validation Ceremony');
    console.log('══════════════════════════\n');
    console.log('Testing core systems through sacred practice...\n');

    // Quick connect
    console.log('1️⃣ Testing Sacred Bridge Connection...');
    await this.testConnection();
    
    // Field coherence
    console.log('\n2️⃣ Testing Field Coherence Response...');
    await this.testFieldCoherence();
    
    // Sacred messaging
    console.log('\n3️⃣ Testing Sacred Message Flow...');
    await this.testMessaging();
    
    // Persistence
    console.log('\n4️⃣ Testing Data Persistence...');
    await this.testPersistence();
    
    // Summary
    await this.showResults();
  }

  async testConnection() {
    try {
      await this.bridge.connectAll();
      await this.pause(2000);
      
      const status = this.bridge.getStatus();
      const passed = status.totalAgents >= 2;
      
      console.log(`   Connected agents: ${status.totalAgents}`);
      console.log(`   Local: ${status.localAgents}, Cloud: ${status.cloudAgents}`);
      console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      
      this.validationResults.tests.push({
        name: 'Sacred Bridge Connection',
        passed,
        details: status
      });
    } catch (error) {
      console.log(`   Result: ❌ FAIL - ${error.message}`);
      this.validationResults.tests.push({
        name: 'Sacred Bridge Connection',
        passed: false,
        error: error.message
      });
    }
  }

  async testFieldCoherence() {
    try {
      const before = this.bridge.fieldCoherence;
      console.log(`   Initial coherence: ${(before * 100).toFixed(1)}%`);
      
      // Simple breathing to affect field
      console.log('   Breathing...');
      await this.pause(3000);
      
      // Force a pulse
      this.bridge.fieldPulse();
      const after = this.bridge.fieldCoherence;
      
      console.log(`   Final coherence: ${(after * 100).toFixed(1)}%`);
      const changed = Math.abs(before - after) > 0.001;
      console.log(`   Result: ${changed ? '✅ PASS - Field responds' : '❌ FAIL - Field static'}`);
      
      this.validationResults.tests.push({
        name: 'Field Coherence Response',
        passed: changed,
        before,
        after
      });
    } catch (error) {
      console.log(`   Result: ❌ FAIL - ${error.message}`);
      this.validationResults.tests.push({
        name: 'Field Coherence Response',
        passed: false,
        error: error.message
      });
    }
  }

  async testMessaging() {
    try {
      console.log('   Sending unified message...');
      const message = await this.bridge.sendUnifiedMessage(
        'Validation test: Can all nodes receive this?',
        'sacred:test'
      );
      
      const passed = message && message.id;
      console.log(`   Message ID: ${message?.id || 'none'}`);
      console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      
      this.validationResults.tests.push({
        name: 'Sacred Message Flow',
        passed,
        messageId: message?.id
      });
    } catch (error) {
      console.log(`   Result: ❌ FAIL - ${error.message}`);
      this.validationResults.tests.push({
        name: 'Sacred Message Flow',
        passed: false,
        error: error.message
      });
    }
  }

  async testPersistence() {
    try {
      const testData = {
        ceremony: 'validation',
        timestamp: new Date().toISOString(),
        field: this.bridge.fieldCoherence
      };
      
      // Write
      const filename = `ceremonies/validation-test-${Date.now()}.json`;
      fs.writeFileSync(filename, JSON.stringify(testData, null, 2));
      
      // Read back
      const readBack = JSON.parse(fs.readFileSync(filename, 'utf8'));
      const passed = readBack.ceremony === testData.ceremony;
      
      console.log(`   Write/Read test: ${passed ? '✅' : '❌'}`);
      console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      
      // Cleanup
      fs.unlinkSync(filename);
      
      this.validationResults.tests.push({
        name: 'Data Persistence',
        passed
      });
    } catch (error) {
      console.log(`   Result: ❌ FAIL - ${error.message}`);
      this.validationResults.tests.push({
        name: 'Data Persistence',
        passed: false,
        error: error.message
      });
    }
  }

  async showResults() {
    console.log('\n📊 Validation Results:');
    console.log('════════════════════');
    
    let allPassed = true;
    this.validationResults.tests.forEach(test => {
      console.log(`${test.passed ? '✅' : '❌'} ${test.name}`);
      if (!test.passed) allPassed = false;
    });
    
    console.log('\n🎯 Overall Status:');
    if (allPassed) {
      console.log('✅ ALL SYSTEMS VALIDATED - Ready for practice!');
    } else {
      console.log('⚠️  SOME SYSTEMS NEED ATTENTION - Check details above');
    }
    
    // Save results
    fs.writeFileSync(
      'validation-results.json',
      JSON.stringify(this.validationResults, null, 2)
    );
    console.log('\n📄 Detailed results saved to: validation-results.json');
  }

  pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run validation
if (require.main === module) {
  const ceremony = new MiniValidationCeremony();
  ceremony.begin().catch(console.error);
}

module.exports = MiniValidationCeremony;