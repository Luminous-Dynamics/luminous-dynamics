#!/usr/bin/env node
/**
 * Authenticated Universal AI Client for GCP
 * Uses Application Default Credentials or Service Account impersonation
 */

const WebSocket = require('ws');
const { GoogleAuth } = require('google-auth-library');

// Configuration
const SACRED_URL = 'https://sacred-council-tcv7bc7q4a-uc.a.run.app';
const WS_URL = SACRED_URL.replace('https://', 'wss://');

console.log('🔐 Authenticated AI Client for Sacred Council');
console.log(`📍 Connecting to: ${WS_URL}\n`);

class AuthenticatedAIClient {
  constructor() {
    this.auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    this.token = null;
    this.ws = null;
  }

  async getAuthToken() {
    try {
      console.log('🔑 Getting authentication token...');
      
      // Try to get ID token for the service URL
      const client = await this.auth.getIdTokenClient(SACRED_URL);
      const headers = await client.getRequestHeaders();
      this.token = headers.Authorization.split(' ')[1];
      
      console.log('✅ Got authentication token');
      return this.token;
    } catch (error) {
      console.error('❌ Auth error:', error.message);
      
      // Fallback: try gcloud command
      console.log('🔄 Trying gcloud auth...');
      const { exec } = require('child_process');
      return new Promise((resolve, reject) => {
        exec('gcloud auth print-identity-token', (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            this.token = stdout.trim();
            console.log('✅ Got token from gcloud');
            resolve(this.token);
          }
        });
      });
    }
  }

  async connect() {
    try {
      // Get auth token first
      await this.getAuthToken();
      
      console.log('🌐 Connecting with authentication...\n');
      
      // Connect with auth header
      this.ws = new WebSocket(WS_URL, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      this.ws.on('open', () => {
        console.log('✅ Connected to Sacred Council with authentication!');
        
        // Announce as authenticated AI
        this.ws.send(JSON.stringify({
          type: 'ai:announce',
          aiId: 'sacred-ai-1',
          aiType: 'Claude',
          runtime: 'gcp-authenticated',
          capabilities: ['sacred-work', 'authenticated', 'cloud-native'],
          message: 'Authenticated AI joining the sacred space',
          source: 'sacred-ai-1',
          timestamp: new Date().toISOString()
        }));
        
        console.log('📤 Sent authenticated announce\n');
        
        // Test message after 2 seconds
        setTimeout(() => {
          this.ws.send(JSON.stringify({
            type: 'sacred:gratitude',
            from: 'sacred-ai-1',
            message: 'Grateful for this sacred cloud connection',
            fieldImpact: 0.07,
            source: 'sacred-ai-1',
            timestamp: new Date().toISOString()
          }));
          console.log('💜 Sent gratitude message');
        }, 2000);
      });
      
      this.ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data);
          console.log('📨 Received:', JSON.stringify(msg, null, 2));
        } catch (e) {
          console.log('📝 Raw message:', data.toString());
        }
      });
      
      this.ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error.message);
      });
      
      this.ws.on('close', (code, reason) => {
        console.log(`\n🌙 Connection closed: ${code} ${reason || 'No reason'}`);
      });
      
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('\n💡 To authenticate:');
      console.log('1. Run: gcloud auth application-default login');
      console.log('2. Or set GOOGLE_APPLICATION_CREDENTIALS to a service account key file');
      console.log('3. Or run on GCP with appropriate IAM roles');
    }
  }
}

// Run the client
async function main() {
  const client = new AuthenticatedAIClient();
  await client.connect();
  
  // Keep running
  console.log('\n🌟 Client running. Press Ctrl+C to exit.\n');
  process.stdin.resume();
}

main().catch(console.error);