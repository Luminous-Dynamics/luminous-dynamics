/**
 * 🔐 Google OAuth Integration
 * Enables Google AI and other Google services
 */

const { google } = require('googleapis');
const express = require('express');
const crypto = require('crypto');

class GoogleOAuthManager {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3001/auth/google/callback'
    );
    
    // Scopes for various Google services
    this.scopes = [
      'https://www.googleapis.com/auth/generative-language.retriever',
      'https://www.googleapis.com/auth/generative-language.tuning',
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];
    
    this.tokens = null;
    this.setupRoutes();
  }
  
  setupRoutes() {
    this.router = express.Router();
    
    // Start OAuth flow
    this.router.get('/auth/google', (req, res) => {
      const state = crypto.randomBytes(32).toString('hex');
      req.session = { state };
      
      const authUrl = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.scopes,
        state: state,
        prompt: 'consent'
      });
      
      console.log('🔐 Starting Google OAuth flow...');
      res.redirect(authUrl);
    });
    
    // Handle OAuth callback
    this.router.get('/auth/google/callback', async (req, res) => {
      const { code, state } = req.query;
      
      try {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        this.tokens = tokens;
        
        console.log('✅ Google OAuth successful!');
        
        // Store refresh token securely
        if (tokens.refresh_token) {
          process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token;
        }
        
        res.send(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>✅ Google Authentication Successful!</h1>
              <p>The Sacred Council Oracle now has access to Google AI services.</p>
              <p>You can close this window and return to Discord.</p>
              <script>
                setTimeout(() => window.close(), 5000);
              </script>
            </body>
          </html>
        `);
        
        this.emit('authenticated', tokens);
      } catch (error) {
        console.error('❌ OAuth error:', error);
        res.status(500).send('Authentication failed');
      }
    });
  }
  
  async ensureAuthenticated() {
    // Try to use refresh token if available
    if (process.env.GOOGLE_REFRESH_TOKEN && !this.tokens) {
      try {
        this.oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });
        
        const { credentials } = await this.oauth2Client.refreshAccessToken();
        this.tokens = credentials;
        console.log('✅ Google tokens refreshed');
      } catch (error) {
        console.log('⚠️  Google OAuth needed - visit http://localhost:3001/auth/google');
      }
    }
    
    return !!this.tokens;
  }
  
  async getGeminiClient() {
    if (!await this.ensureAuthenticated()) {
      throw new Error('Google authentication required');
    }
    
    // Return authenticated Gemini client
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    return new GoogleGenerativeAI(this.tokens.access_token);
  }
  
  getExpressRouter() {
    return this.router;
  }
}

// Extend EventEmitter for auth events
const EventEmitter = require('events');
Object.setPrototypeOf(GoogleOAuthManager.prototype, EventEmitter.prototype);

module.exports = GoogleOAuthManager;