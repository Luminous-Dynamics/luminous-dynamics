#!/usr/bin/env node

/**
 * Universal Deploy Manager
 * 
 * Scalable, modular deployment system for any platform
 * Supports: Firebase, Vercel, Netlify, AWS, Google Cloud, etc.
 */

const UniversalAuthBridge = require('./universal-auth-bridge');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class UniversalDeployManager {
  constructor(config = {}) {
    this.config = {
      provider: config.provider || 'firebase',
      projectName: config.projectName || 'mycelix-network',
      tokenStore: config.tokenStore || path.join(__dirname, '.deploy-tokens'),
      ...config
    };
    
    // Ensure token store exists
    if (!fs.existsSync(this.config.tokenStore)) {
      fs.mkdirSync(this.config.tokenStore, { recursive: true, mode: 0o700 });
    }
    
    // Provider configurations
    this.providers = {
      firebase: {
        authBridge: { provider: 'firebase', port: 9005 },
        deployCommand: (token, target) => 
          `npx firebase deploy --only ${target} --token "${token}"`,
        defaultTarget: 'hosting',
        urls: [
          `https://${this.config.projectName}.web.app`,
          `https://${this.config.projectName}.firebaseapp.com`
        ]
      },
      vercel: {
        authBridge: { provider: 'github', port: 9006 },
        deployCommand: (token) => `vercel --token="${token}"`,
        urls: [`https://${this.config.projectName}.vercel.app`]
      },
      netlify: {
        authBridge: { provider: 'github', port: 9007 },
        deployCommand: (token, dir) => 
          `netlify deploy --prod --dir=${dir} --auth="${token}"`,
        defaultTarget: 'dist',
        urls: [`https://${this.config.projectName}.netlify.app`]
      },
      gcloud: {
        authBridge: { provider: 'google', port: 9008 },
        deployCommand: (token) => 
          `gcloud app deploy --quiet --project=${this.config.projectName}`,
        requiresInit: true,
        urls: [`https://${this.config.projectName}.appspot.com`]
      }
    };
  }

  /**
   * Step 1: Initialize authentication
   */
  async initAuth(options = {}) {
    const provider = this.providers[this.config.provider];
    if (!provider) {
      throw new Error(`Unknown provider: ${this.config.provider}`);
    }
    
    console.log(`\n🔐 ${this.config.provider.toUpperCase()} Authentication`);
    console.log('=' .repeat(50));
    
    // Create auth bridge
    this.authBridge = new UniversalAuthBridge(provider.authBridge);
    
    // Generate auth URL
    const { url, state, instructions } = this.authBridge.generateAuthUrl(options);
    
    // Save state
    this.saveState(state);
    
    // Create response object
    const response = {
      provider: this.config.provider,
      url,
      state,
      instructions,
      callbackPort: provider.authBridge.port,
      next: `Run: node universal-deploy-manager.js callback ${this.config.provider}`
    };
    
    // Save to file for easy access
    const authFile = path.join(this.config.tokenStore, `${this.config.provider}-auth.json`);
    fs.writeFileSync(authFile, JSON.stringify(response, null, 2));
    
    console.log('\n📋 Authentication URL:');
    console.log(url);
    console.log('\n' + instructions);
    console.log(`\n💾 Auth info saved to: ${authFile}`);
    
    return response;
  }

  /**
   * Step 2: Handle authentication callback
   */
  async handleCallback() {
    const provider = this.providers[this.config.provider];
    if (!provider) {
      throw new Error(`Unknown provider: ${this.config.provider}`);
    }
    
    console.log(`\n🔐 Waiting for ${this.config.provider} authentication...`);
    console.log('=' .repeat(50));
    
    // Create auth bridge if not exists
    if (!this.authBridge) {
      this.authBridge = new UniversalAuthBridge(provider.authBridge);
    }
    
    try {
      // Start callback server
      await this.authBridge.startCallbackServer();
      
      console.log(`\n⏳ Complete authentication in your browser...`);
      console.log(`   Callback server: http://localhost:${provider.authBridge.port}`);
      
      // Wait for token
      const token = await this.authBridge.waitForAuth();
      
      // Encrypt and cache token
      this.cacheToken(token);
      
      console.log('\n✅ Authentication successful!');
      console.log(`   Token cached for ${this.config.provider}`);
      console.log(`\n📦 Ready to deploy!`);
      console.log(`   Run: node universal-deploy-manager.js deploy ${this.config.provider}`);
      
      return {
        success: true,
        provider: this.config.provider,
        tokenCached: true
      };
      
    } catch (error) {
      console.error(`\n❌ Authentication failed:`, error.message);
      throw error;
    }
  }

  /**
   * Step 3: Deploy to provider
   */
  async deploy(options = {}) {
    const provider = this.providers[this.config.provider];
    if (!provider) {
      throw new Error(`Unknown provider: ${this.config.provider}`);
    }
    
    console.log(`\n🚀 Deploying to ${this.config.provider.toUpperCase()}`);
    console.log('=' .repeat(50));
    
    // Get cached token
    const token = this.getCachedToken();
    if (!token) {
      console.log('❌ No cached token found.');
      console.log(`   Run: node universal-deploy-manager.js auth ${this.config.provider}`);
      throw new Error('Authentication required');
    }
    
    // Prepare deployment
    const target = options.target || provider.defaultTarget || '.';
    console.log(`\n📦 Deployment details:`);
    console.log(`   Provider: ${this.config.provider}`);
    console.log(`   Project:  ${this.config.projectName}`);
    console.log(`   Target:   ${target}`);
    
    try {
      // Run provider-specific deployment
      const command = provider.deployCommand(token, target);
      console.log(`\n🔧 Running deployment command...`);
      
      const output = execSync(command, {
        encoding: 'utf8',
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      console.log('\n✅ Deployment successful!');
      console.log('\n🌐 Your sites:');
      provider.urls.forEach(url => {
        console.log(`   ${url}`);
      });
      
      // Save deployment record
      this.saveDeploymentRecord({
        provider: this.config.provider,
        timestamp: new Date().toISOString(),
        target,
        urls: provider.urls,
        success: true
      });
      
      return {
        success: true,
        provider: this.config.provider,
        urls: provider.urls
      };
      
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      throw error;
    }
  }

  /**
   * List all cached tokens
   */
  listTokens() {
    console.log('\n🔑 Cached Authentication Tokens');
    console.log('=' .repeat(50));
    
    const tokens = [];
    for (const provider in this.providers) {
      const tokenFile = this.getTokenPath(provider);
      if (fs.existsSync(tokenFile)) {
        const stats = fs.statSync(tokenFile);
        tokens.push({
          provider,
          cached: true,
          modified: stats.mtime
        });
      }
    }
    
    if (tokens.length === 0) {
      console.log('\nNo cached tokens found.');
    } else {
      console.log('\nProvider    | Status | Last Updated');
      console.log('-'.repeat(50));
      tokens.forEach(t => {
        console.log(
          `${t.provider.padEnd(11)} | ✅     | ${t.modified.toLocaleString()}`
        );
      });
    }
    
    return tokens;
  }

  /**
   * Clear cached tokens
   */
  clearTokens(provider = null) {
    if (provider) {
      // Clear specific provider
      const tokenFile = this.getTokenPath(provider);
      if (fs.existsSync(tokenFile)) {
        fs.unlinkSync(tokenFile);
        console.log(`✅ Cleared token for ${provider}`);
      }
    } else {
      // Clear all tokens
      for (const p in this.providers) {
        this.clearTokens(p);
      }
    }
  }

  // Helper methods
  
  getTokenPath(provider) {
    return path.join(this.config.tokenStore, `${provider}.token`);
  }
  
  saveState(state) {
    const statePath = path.join(this.config.tokenStore, `${this.config.provider}.state`);
    fs.writeFileSync(statePath, state);
  }
  
  cacheToken(token) {
    // Simple encryption (in production, use proper key management)
    const cipher = crypto.createCipher('aes256', 'sacred-deploy-key');
    const encrypted = cipher.update(token, 'utf8', 'hex') + cipher.final('hex');
    
    const tokenPath = this.getTokenPath(this.config.provider);
    fs.writeFileSync(tokenPath, encrypted, { mode: 0o600 });
  }
  
  getCachedToken() {
    try {
      const tokenPath = this.getTokenPath(this.config.provider);
      const encrypted = fs.readFileSync(tokenPath, 'utf8');
      
      // Decrypt
      const decipher = crypto.createDecipher('aes256', 'sacred-deploy-key');
      const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
      
      return decrypted;
    } catch (e) {
      return null;
    }
  }
  
  saveDeploymentRecord(record) {
    const historyFile = path.join(this.config.tokenStore, 'deployment-history.json');
    let history = [];
    
    try {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    } catch (e) {
      // Start fresh
    }
    
    history.push(record);
    
    // Keep last 100 deployments
    if (history.length > 100) {
      history = history.slice(-100);
    }
    
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  }
}

// CLI Interface
async function main() {
  const [command, provider, ...args] = process.argv.slice(2);
  
  if (!command) {
    showHelp();
    return;
  }
  
  const manager = new UniversalDeployManager({
    provider: provider || 'firebase'
  });
  
  try {
    switch (command) {
      case 'auth':
        await manager.initAuth();
        break;
        
      case 'callback':
        await manager.handleCallback();
        break;
        
      case 'deploy':
        const target = args[0];
        await manager.deploy({ target });
        break;
        
      case 'list':
        manager.listTokens();
        break;
        
      case 'clear':
        manager.clearTokens(provider);
        break;
        
      default:
        console.log(`Unknown command: ${command}`);
        showHelp();
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🚀 Universal Deploy Manager
===========================

Commands:
  auth [provider]      - Initialize authentication
  callback [provider]  - Handle auth callback
  deploy [provider]    - Deploy to provider
  list                 - List cached tokens
  clear [provider]     - Clear cached tokens

Providers:
  firebase  - Firebase Hosting
  vercel    - Vercel
  netlify   - Netlify
  gcloud    - Google Cloud

Examples:
  node universal-deploy-manager.js auth firebase
  node universal-deploy-manager.js callback firebase
  node universal-deploy-manager.js deploy firebase hosting
  
  # Full flow for new provider
  node universal-deploy-manager.js auth vercel
  # ... complete auth in browser ...
  node universal-deploy-manager.js callback vercel
  node universal-deploy-manager.js deploy vercel
`);
}

// Export for programmatic use
module.exports = UniversalDeployManager;

// Run CLI if called directly
if (require.main === module) {
  main();
}