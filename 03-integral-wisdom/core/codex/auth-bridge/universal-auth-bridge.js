/**
 * Universal Authentication Bridge
 * 
 * A modular, scalable system for handling OAuth flows in any environment
 * Works with Firebase, Google Cloud, GitHub, and any OAuth provider
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');
const { EventEmitter } = require('events');

class UniversalAuthBridge extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      port: config.port || 9005,
      timeout: config.timeout || 300000, // 5 minutes
      provider: config.provider || 'firebase',
      ...config
    };
    
    this.server = null;
    this.authState = null;
    this.authToken = null;
  }

  /**
   * Step 1: Generate authentication URL
   */
  generateAuthUrl(options = {}) {
    const providers = {
      firebase: {
        baseUrl: 'https://accounts.google.com/o/oauth2/auth',
        clientId: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
        scope: [
          'email',
          'openid',
          'https://www.googleapis.com/auth/cloudplatformprojects.readonly',
          'https://www.googleapis.com/auth/firebase',
          'https://www.googleapis.com/auth/cloud-platform'
        ].join(' '),
        responseType: 'code'
      },
      github: {
        baseUrl: 'https://github.com/login/oauth/authorize',
        clientId: options.clientId || process.env.GITHUB_CLIENT_ID,
        scope: 'repo,user'
      },
      google: {
        baseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId: options.clientId || process.env.GOOGLE_CLIENT_ID,
        scope: options.scope || 'email profile',
        responseType: 'code'
      }
    };

    const provider = providers[this.config.provider];
    if (!provider) {
      throw new Error(`Unknown provider: ${this.config.provider}`);
    }

    // Generate state for security
    this.authState = crypto.randomBytes(16).toString('hex');
    
    // Build auth URL
    const params = new URLSearchParams({
      client_id: provider.clientId,
      scope: provider.scope,
      response_type: provider.responseType || 'code',
      state: this.authState,
      redirect_uri: `http://localhost:${this.config.port}/callback`,
      ...options.extraParams
    });

    const authUrl = `${provider.baseUrl}?${params.toString()}`;
    
    this.emit('auth:url:generated', {
      url: authUrl,
      provider: this.config.provider,
      state: this.authState
    });

    return {
      url: authUrl,
      state: this.authState,
      instructions: this.getInstructions()
    };
  }

  /**
   * Step 2: Start local server to receive callback
   */
  async startCallbackServer() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        
        if (parsedUrl.pathname === '/callback') {
          this.handleCallback(req, res, parsedUrl.query);
        } else if (parsedUrl.pathname === '/status') {
          this.handleStatus(req, res);
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      });

      this.server.listen(this.config.port, 'localhost', () => {
        console.log(`🔐 Auth callback server listening on http://localhost:${this.config.port}`);
        this.emit('server:started', { port: this.config.port });
        resolve(this.config.port);
      });

      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`❌ Port ${this.config.port} is already in use`);
          reject(new Error(`Port ${this.config.port} is already in use`));
        } else {
          reject(err);
        }
      });

      // Auto-timeout
      setTimeout(() => {
        if (!this.authToken) {
          this.cleanup();
          reject(new Error('Authentication timeout'));
        }
      }, this.config.timeout);
    });
  }

  /**
   * Handle OAuth callback
   */
  handleCallback(req, res, query) {
    // Verify state for security
    if (query.state !== this.authState) {
      res.writeHead(400);
      res.end('Invalid state parameter');
      return;
    }

    // Extract token or code
    const token = query.code || query.token || query.access_token;
    
    if (!token) {
      res.writeHead(400);
      res.end('No token received');
      return;
    }

    this.authToken = token;
    
    // Send success response
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(this.getSuccessPage(token));
    
    // Emit token event
    this.emit('auth:token:received', {
      token,
      provider: this.config.provider,
      timestamp: new Date()
    });
    
    // Cleanup after short delay
    setTimeout(() => this.cleanup(), 1000);
  }

  /**
   * Handle status check endpoint
   */
  handleStatus(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: this.authToken ? 'authenticated' : 'waiting',
      provider: this.config.provider,
      hasToken: !!this.authToken
    }));
  }

  /**
   * Get provider-specific instructions
   */
  getInstructions() {
    const instructions = {
      firebase: `
1. Visit the URL in your browser
2. Authenticate with your Google account
3. You'll be redirected back to localhost:${this.config.port}
4. Copy the token displayed on the page
5. The token starts with "1//" and is used for Firebase deployments`,
      
      github: `
1. Visit the URL in your browser
2. Authorize the GitHub application
3. You'll be redirected back to localhost:${this.config.port}
4. The access token will be captured automatically`,
      
      google: `
1. Visit the URL in your browser
2. Sign in with your Google account
3. Grant the requested permissions
4. You'll be redirected back to localhost:${this.config.port}
5. The authorization code will be captured`
    };

    return instructions[this.config.provider] || 'Follow the authentication flow in your browser';
  }

  /**
   * Generate success page HTML
   */
  getSuccessPage(token) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Authentication Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            backdrop-filter: blur(10px);
            max-width: 500px;
        }
        h1 { margin-bottom: 1rem; }
        .token-box {
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 0.9rem;
        }
        .copy-button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
        }
        .copy-button:hover {
            background: #45a049;
        }
        .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>Authentication Successful!</h1>
        <p>Your authentication token has been received.</p>
        <div class="token-box" id="token">${this.maskToken(token)}</div>
        <button class="copy-button" onclick="copyToken()">Copy Full Token</button>
        <p style="margin-top: 2rem; opacity: 0.8;">
            You can close this window and return to your terminal.
        </p>
    </div>
    <script>
        const fullToken = ${JSON.stringify(token)};
        function copyToken() {
            navigator.clipboard.writeText(fullToken).then(() => {
                alert('Token copied to clipboard!');
            });
        }
    </script>
</body>
</html>`;
  }

  /**
   * Mask token for display
   */
  maskToken(token) {
    if (token.length <= 20) return token;
    return token.substring(0, 10) + '...' + token.substring(token.length - 10);
  }

  /**
   * Wait for authentication
   */
  async waitForAuth() {
    return new Promise((resolve) => {
      this.once('auth:token:received', (data) => {
        resolve(data.token);
      });
    });
  }

  /**
   * Cleanup server
   */
  cleanup() {
    if (this.server) {
      this.server.close();
      this.server = null;
      this.emit('server:closed');
    }
  }

  /**
   * Full authentication flow
   */
  async authenticate() {
    try {
      // Generate auth URL
      const { url, instructions } = this.generateAuthUrl();
      
      console.log('\n🔐 Authentication Required');
      console.log('=' .repeat(50));
      console.log('\nProvider:', this.config.provider);
      console.log('\nPlease visit this URL to authenticate:');
      console.log('\n' + url);
      console.log('\n' + instructions);
      console.log('\n' + '='.repeat(50));
      
      // Start callback server
      await this.startCallbackServer();
      
      // Wait for token
      const token = await this.waitForAuth();
      
      console.log('\n✅ Authentication successful!');
      console.log('Token received:', this.maskToken(token));
      
      return token;
      
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      this.cleanup();
      throw error;
    }
  }
}

// Export for use
module.exports = UniversalAuthBridge;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const provider = args[0] || 'firebase';
  
  const bridge = new UniversalAuthBridge({ provider });
  
  bridge.authenticate()
    .then(token => {
      console.log('\n🎉 Token ready for use!');
      process.exit(0);
    })
    .catch(err => {
      console.error('\n❌ Error:', err.message);
      process.exit(1);
    });
}