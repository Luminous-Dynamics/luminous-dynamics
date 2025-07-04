#!/usr/bin/env node

/**
 * Firebase Authentication Flow
 * 
 * Modular two-step process:
 * 1. Request authentication URL
 * 2. Accept token and deploy
 */

const UniversalAuthBridge = require('./universal-auth-bridge');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class FirebaseAuthFlow {
  constructor() {
    this.tokenFile = path.join(__dirname, '.firebase-token-cache');
    this.bridge = new UniversalAuthBridge({
      provider: 'firebase',
      port: 9005
    });
  }

  /**
   * Step 1: Generate authentication URL
   */
  async requestAuthUrl() {
    console.log('🔗 Firebase Authentication URL Generator');
    console.log('=' .repeat(50));
    
    const { url, state, instructions } = this.bridge.generateAuthUrl();
    
    // Save state for verification
    this.saveState(state);
    
    const response = {
      url,
      state,
      instructions,
      expiresIn: '5 minutes',
      next: 'Run: npm run auth:callback'
    };
    
    console.log('\n📋 Authentication URL:');
    console.log(url);
    console.log('\n' + instructions);
    
    // Save URL to file for easy access
    fs.writeFileSync(
      path.join(__dirname, 'auth-url.txt'), 
      `${url}\n\n${instructions}`
    );
    
    return response;
  }

  /**
   * Step 2: Accept token via callback server
   */
  async acceptToken() {
    console.log('🔐 Waiting for authentication callback...');
    console.log('=' .repeat(50));
    
    try {
      // Start callback server
      await this.bridge.startCallbackServer();
      
      console.log('\n⏳ Waiting for you to complete authentication...');
      console.log('   Server listening on http://localhost:9005');
      
      // Wait for token
      const token = await this.bridge.waitForAuth();
      
      // Cache token
      this.cacheToken(token);
      
      console.log('\n✅ Token received and cached!');
      
      return {
        success: true,
        token: this.bridge.maskToken(token),
        cached: true,
        next: 'Run: npm run deploy'
      };
      
    } catch (error) {
      console.error('❌ Failed to receive token:', error.message);
      throw error;
    }
  }

  /**
   * Step 3: Deploy using cached token
   */
  async deployWithToken(target = 'hosting') {
    console.log('🚀 Firebase Deployment');
    console.log('=' .repeat(50));
    
    // Get cached token
    const token = this.getCachedToken();
    if (!token) {
      throw new Error('No cached token found. Run auth flow first.');
    }
    
    console.log('📦 Deploying to Firebase...');
    console.log(`   Target: ${target}`);
    console.log(`   Project: mycelix-network`);
    
    try {
      // Run Firebase deploy
      const output = execSync(
        `npx firebase deploy --only ${target} --token "${token}"`,
        { encoding: 'utf8', stdio: 'inherit' }
      );
      
      console.log('\n✅ Deployment successful!');
      console.log('\n🌐 Your sites:');
      console.log('   Main: https://mycelix-network.web.app');
      console.log('   Alt:  https://mycelix-network.firebaseapp.com');
      
      return {
        success: true,
        urls: [
          'https://mycelix-network.web.app',
          'https://mycelix-network.firebaseapp.com'
        ]
      };
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      throw error;
    }
  }

  /**
   * Combined flow for CI/CD
   */
  async fullFlow() {
    // Check for cached token first
    if (this.hasCachedToken()) {
      console.log('📌 Using cached token...');
      return this.deployWithToken();
    }
    
    // Otherwise run full auth flow
    await this.requestAuthUrl();
    console.log('\n⏸️  Please complete authentication in your browser...\n');
    await this.acceptToken();
    return this.deployWithToken();
  }

  // Helper methods
  
  saveState(state) {
    fs.writeFileSync(
      path.join(__dirname, '.auth-state'), 
      state
    );
  }
  
  cacheToken(token) {
    fs.writeFileSync(this.tokenFile, token, { mode: 0o600 });
  }
  
  getCachedToken() {
    try {
      return fs.readFileSync(this.tokenFile, 'utf8').trim();
    } catch (e) {
      return null;
    }
  }
  
  hasCachedToken() {
    return fs.existsSync(this.tokenFile);
  }
  
  clearCache() {
    try {
      fs.unlinkSync(this.tokenFile);
      console.log('✅ Token cache cleared');
    } catch (e) {
      // Ignore
    }
  }
}

// CLI Commands
const flow = new FirebaseAuthFlow();
const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case 'url':
        // Step 1: Generate URL
        await flow.requestAuthUrl();
        break;
        
      case 'callback':
        // Step 2: Accept token
        await flow.acceptToken();
        break;
        
      case 'deploy':
        // Step 3: Deploy
        const target = process.argv[3] || 'hosting';
        await flow.deployWithToken(target);
        break;
        
      case 'full':
        // Full flow
        await flow.fullFlow();
        break;
        
      case 'clear':
        // Clear cached token
        flow.clearCache();
        break;
        
      default:
        console.log('🔐 Firebase Authentication Flow');
        console.log('================================');
        console.log('\nCommands:');
        console.log('  url      - Generate authentication URL');
        console.log('  callback - Start server and wait for token');
        console.log('  deploy   - Deploy using cached token');
        console.log('  full     - Run complete flow');
        console.log('  clear    - Clear cached token');
        console.log('\nUsage:');
        console.log('  node firebase-auth-flow.js url');
        console.log('  node firebase-auth-flow.js callback');
        console.log('  node firebase-auth-flow.js deploy');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = FirebaseAuthFlow;

// Run CLI if called directly
if (require.main === module) {
  main();
}