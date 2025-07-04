#!/usr/bin/env node
/**
 * 🎯 Automated Live Deployment Tester
 * Verifies all deployed systems are working
 */

const https = require('https');
const http = require('http');

class LiveDeploymentTester {
  constructor() {
    this.baseUrl = 'https://mycelix-network.web.app';
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  // Test if URL loads successfully
  async testUrl(url, description) {
    return new Promise((resolve) => {
      console.log(`\n🔍 Testing: ${description}`);
      console.log(`   URL: ${url}`);
      
      const protocol = url.startsWith('https') ? https : http;
      
      protocol.get(url, (res) => {
        const { statusCode } = res;
        
        if (statusCode === 200) {
          console.log(`   ✅ Success (200 OK)`);
          this.results.passed.push({ url, description });
        } else if (statusCode >= 300 && statusCode < 400) {
          console.log(`   ⚠️  Redirect (${statusCode})`);
          this.results.warnings.push({ url, description, status: statusCode });
        } else {
          console.log(`   ❌ Failed (${statusCode})`);
          this.results.failed.push({ url, description, status: statusCode });
        }
        
        // Consume response data
        res.resume();
        resolve();
      }).on('error', (e) => {
        console.log(`   ❌ Error: ${e.message}`);
        this.results.failed.push({ url, description, error: e.message });
        resolve();
      });
    });
  }

  // Test WebSocket endpoints
  async testWebSocket(url, description) {
    console.log(`\n🔌 Testing WebSocket: ${description}`);
    console.log(`   URL: ${url}`);
    
    try {
      const WebSocket = require('ws');
      const ws = new WebSocket(url);
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.log(`   ⚠️  Connection timeout`);
          this.results.warnings.push({ url, description, status: 'timeout' });
          ws.terminate();
          resolve();
        }, 5000);
        
        ws.on('open', () => {
          clearTimeout(timeout);
          console.log(`   ✅ Connected successfully`);
          this.results.passed.push({ url, description });
          ws.close();
          resolve();
        });
        
        ws.on('error', (error) => {
          clearTimeout(timeout);
          console.log(`   ❌ Error: ${error.message}`);
          this.results.failed.push({ url, description, error: error.message });
          resolve();
        });
      });
    } catch (e) {
      console.log(`   ⚠️  WebSocket not available`);
      this.results.warnings.push({ url, description, status: 'unavailable' });
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🎯 Sacred Live Deployment Test');
    console.log('==============================\n');
    console.log(`Base URL: ${this.baseUrl}`);
    console.log(`Time: ${new Date().toISOString()}\n`);

    // Test primary interfaces
    await this.testUrl(this.baseUrl, 'Home Portal');
    await this.testUrl(`${this.baseUrl}/sacred-council-hub.html`, 'Sacred Council Hub');
    await this.testUrl(`${this.baseUrl}/sacred-field-visualization.html`, 'Living Field Visualization');
    await this.testUrl(`${this.baseUrl}/applied-harmonies-dojo.html`, 'Applied Harmonies Dojo');
    await this.testUrl(`${this.baseUrl}/unified-consciousness-demo.html`, 'Unified Consciousness Demo');
    
    // Test supporting pages
    await this.testUrl(`${this.baseUrl}/constellation-journey-map.html`, 'Constellation Journey Map');
    await this.testUrl(`${this.baseUrl}/sacred-navigation.html`, 'Sacred Navigation');
    
    // Test WebSocket endpoints
    await this.testWebSocket('wss://sacred-council-tcv7bc7q4a-uc.a.run.app', 'Cloud Run WebSocket');
    await this.testWebSocket('ws://localhost:3333', 'Local WebSocket');
    
    // Generate report
    this.generateReport();
  }

  // Beautiful test report
  generateReport() {
    console.log('\n\n╔══════════════════════════════════════╗');
    console.log('║    📊 TEST RESULTS SUMMARY           ║');
    console.log('╚══════════════════════════════════════╝\n');
    
    // Summary stats
    const total = this.results.passed.length + this.results.failed.length + this.results.warnings.length;
    const passRate = total > 0 ? (this.results.passed.length / total * 100).toFixed(1) : 0;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Pass Rate: ${passRate}%\n`);
    
    // Passed tests
    if (this.results.passed.length > 0) {
      console.log(`✅ PASSED (${this.results.passed.length}):`);
      this.results.passed.forEach(test => {
        console.log(`   • ${test.description}`);
      });
      console.log('');
    }
    
    // Warnings
    if (this.results.warnings.length > 0) {
      console.log(`⚠️  WARNINGS (${this.results.warnings.length}):`);
      this.results.warnings.forEach(test => {
        console.log(`   • ${test.description} - ${test.status || test.error}`);
      });
      console.log('');
    }
    
    // Failed tests
    if (this.results.failed.length > 0) {
      console.log(`❌ FAILED (${this.results.failed.length}):`);
      this.results.failed.forEach(test => {
        console.log(`   • ${test.description} - ${test.status || test.error}`);
      });
      console.log('');
    }
    
    // Overall status
    console.log('─'.repeat(40));
    if (this.results.failed.length === 0) {
      console.log('\n🎉 All critical systems are LIVE!\n');
    } else {
      console.log('\n⚠️  Some systems need attention\n');
    }
    
    // Sacred blessing
    console.log('🙏 May all systems serve with love and grace\n');
  }
}

// Run tests
if (require.main === module) {
  const tester = new LiveDeploymentTester();
  tester.runAllTests().catch(console.error);
}