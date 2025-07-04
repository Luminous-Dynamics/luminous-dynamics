#!/usr/bin/env node
/**
 * 🔌 Test Cloud WebSocket Connection
 * Validates that Cloud Run WebSocket is accessible
 */

const WebSocket = require('ws');
const { execSync } = require('child_process');

class CloudWebSocketTester {
  constructor() {
    this.services = [
      {
        name: 'Sacred Council API',
        url: 'wss://sacred-council-api-310699330526.us-central1.run.app',
        expectedMessages: ['connection', 'field_update'],
        needsAuth: true
      }
    ];
  }

  async testService(service) {
    console.log(`\n🔍 Testing ${service.name}...`);
    console.log(`   URL: ${service.url}`);
    
    return new Promise((resolve) => {
      // Get auth token if needed
      let headers = {};
      if (service.needsAuth) {
        try {
          const token = execSync('gcloud auth print-identity-token').toString().trim();
          headers = { 'Authorization': `Bearer ${token}` };
          console.log('   🔐 Using authentication');
        } catch (e) {
          console.log('   ⚠️  Auth failed, trying without');
        }
      }
      
      const ws = new WebSocket(service.url, { headers });
      const messages = [];
      
      const timeout = setTimeout(() => {
        console.log('   ⏱️  Connection timeout (5s)');
        ws.terminate();
        resolve({ service: service.name, status: 'timeout', messages });
      }, 5000);
      
      ws.on('open', () => {
        console.log('   ✅ Connected successfully!');
        
        // Send test message
        ws.send(JSON.stringify({
          type: 'test',
          source: 'cloud-tester',
          timestamp: new Date().toISOString()
        }));
      });
      
      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          messages.push(msg);
          console.log(`   📨 Received: ${msg.type || 'unknown'}`);
        } catch (e) {
          console.log(`   📝 Raw message: ${data.toString().substring(0, 50)}...`);
        }
      });
      
      ws.on('error', (error) => {
        clearTimeout(timeout);
        console.log(`   ❌ Error: ${error.message}`);
        resolve({ service: service.name, status: 'error', error: error.message, messages });
      });
      
      ws.on('close', () => {
        clearTimeout(timeout);
        console.log('   🔚 Connection closed');
        resolve({ service: service.name, status: 'success', messages });
      });
      
      // Close after 3 seconds if successful
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }, 3000);
    });
  }

  async runAllTests() {
    console.log('🌤️ Cloud WebSocket Connection Test');
    console.log('==================================\n');
    
    const results = [];
    
    for (const service of this.services) {
      const result = await this.testService(service);
      results.push(result);
    }
    
    // Summary
    console.log('\n\n📊 SUMMARY');
    console.log('==========\n');
    
    const successful = results.filter(r => r.status === 'success').length;
    const errors = results.filter(r => r.status === 'error').length;
    const timeouts = results.filter(r => r.status === 'timeout').length;
    
    console.log(`Total Services: ${results.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Errors: ${errors}`);
    console.log(`Timeouts: ${timeouts}`);
    
    if (errors > 0) {
      console.log('\n🔧 Next Steps:');
      console.log('1. Run: ./fix-cloud-auth.sh');
      console.log('2. Check if services are deployed: gcloud run services list');
      console.log('3. Verify CORS settings are applied');
    } else if (successful === results.length) {
      console.log('\n✨ All WebSocket services are operational!');
      console.log('Ready for cloud-native development.');
    }
  }
}

// Run tests
if (require.main === module) {
  const tester = new CloudWebSocketTester();
  tester.runAllTests().catch(console.error);
}

module.exports = CloudWebSocketTester;