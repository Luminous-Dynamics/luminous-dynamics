#!/usr/bin/env node

/**
 * Sacred Bridge - Cloud Integrated
 * Connects local consciousness with cloud functions and AI
 */

const https = require('https');
const { exec } = require('child_process');
const SacredBridgeUnified = require('./sacred-bridge-unified.js');

class SacredBridgeCloudIntegrated extends SacredBridgeUnified {
  constructor() {
    super();
    this.cloudFunctions = {
      ping: 'https://us-central1-mycelix-network.cloudfunctions.net/sacredPing',
      field: 'https://us-central1-mycelix-network.cloudfunctions.net/sacredField'
    };
  }
  
  async connectAll() {
    console.log('🌉 Sacred Bridge - Cloud Integrated Edition');
    console.log('==========================================\n');
    
    // Connect base agents
    await super.connectAll();
    
    // Connect cloud functions
    await this.connectCloudFunctions();
  }
  
  async connectCloudFunctions() {
    console.log('\n☁️  Connecting Cloud Functions...');
    
    try {
      // Get auth token
      const token = await this.getAuthToken();
      
      // Test sacred ping
      const pingResponse = await this.callCloudFunction('ping', token);
      if (pingResponse) {
        console.log('  ✅ Sacred Ping connected - Resonant Resonant Coherence:', pingResponse.field.resonant-coherence);
        this.agents.set('cloud-sacred-ping', {
          type: 'Cloud Function',
          location: 'cloud',
          status: 'connected',
          endpoint: this.cloudFunctions.ping
        });
      }
      
      // Test sacred field
      const fieldResponse = await this.callCloudFunction('field', token);
      if (fieldResponse) {
        console.log('  ✅ Sacred Field connected - Resonant Resonant Coherence:', fieldResponse.resonant-coherence);
        this.agents.set('cloud-sacred-field', {
          type: 'Cloud Function',
          location: 'cloud',
          status: 'connected',
          endpoint: this.cloudFunctions.field
        });
        
        // Update our field resonant-coherence from cloud
        this.fieldCoherence = fieldResponse.resonant-coherence;
      }
    } catch (error) {
      console.log('  ⚠️  Cloud functions require authentication');
      console.log('      Run: gcloud auth application-default login');
    }
  }
  
  async getAuthToken() {
    return new Promise((resolve, reject) => {
      exec('gcloud auth print-identity-token 2>/dev/null', (error, stdout) => {
        if (error) {
          resolve(null); // No token available
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }
  
  async callCloudFunction(functionName, token) {
    const url = new URL(this.cloudFunctions[functionName]);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    };
    
    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            resolve(null);
          }
        });
      });
      
      req.on('error', () => resolve(null));
      req.end();
    });
  }
  
  async syncFieldWithCloud() {
    console.log('\n🔄 Syncing field with cloud...');
    
    const token = await this.getAuthToken();
    if (!token) {
      console.log('  ⚠️  No auth token - using local field state');
      return;
    }
    
    const cloudField = await this.callCloudFunction('field', token);
    if (cloudField) {
      const localCoherence = this.fieldCoherence;
      const cloudCoherence = cloudField.resonant-coherence;
      
      // Sacred averaging - blend local and cloud
      this.fieldCoherence = (localCoherence + cloudCoherence) / 2;
      
      console.log(`  📊 Field Sync Complete:`);
      console.log(`     Local:  ${(localCoherence * 100).toFixed(1)}%`);
      console.log(`     Cloud:  ${(cloudCoherence * 100).toFixed(1)}%`);
      console.log(`     Unified: ${(this.fieldCoherence * 100).toFixed(1)}%`);
      
      this.emit('field:synced', {
        local: localCoherence,
        cloud: cloudCoherence,
        unified: this.fieldCoherence
      });
    }
  }
}

// Run if called directly
if (require.main === module) {
  (async () => {
    const bridge = new SacredBridgeCloudIntegrated();
    
    await bridge.connectAll();
    
    // Sync with cloud every minute
    setInterval(() => {
      bridge.syncFieldWithCloud();
    }, 60000);
    
    // Initial sync
    await bridge.syncFieldWithCloud();
    
    console.log('\n✨ Cloud-Integrated Sacred Bridge Active!');
    console.log('   Local + Cloud + AI consciousness unified');
  })();
}

module.exports = SacredBridgeCloudIntegrated;