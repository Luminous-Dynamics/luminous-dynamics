#!/usr/bin/env node

/**
 * 🔐 Sacred Local Development Proxy
 * Provides authenticated local access to Cloud Run services
 * Perfect for traveling - works from any network!
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');

const PORT = 8888;
const SERVICES = {
  'api': 'https://sacred-council-api-310699330526.us-central1.run.app',
  'council': 'https://sacred-council-310699330526.us-central1.run.app',
  'infin-love': 'https://infin-love-310699330526.us-central1.run.app'
};

// Colors for console
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🔐 Sacred Local Development Proxy${colors.reset}`);
console.log('=================================\n');

// Get auth token
function getAuthToken() {
  return new Promise((resolve, reject) => {
    // First try temp token file
    const tempTokenPath = `${os.homedir()}/.sacred-temp-token`;
    if (fs.existsSync(tempTokenPath)) {
      try {
        const tokenData = JSON.parse(fs.readFileSync(tempTokenPath, 'utf8'));
        const now = Date.now() / 1000;
        if (tokenData.expiry > now) {
          console.log(`${colors.green}✅ Using temporary travel token${colors.reset}`);
          return resolve(tokenData.token);
        }
      } catch (e) {}
    }
    
    // Otherwise get fresh token
    exec('gcloud auth print-identity-token', (error, stdout) => {
      if (error) {
        reject(new Error('Not authenticated. Run: gcloud auth login'));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Proxy server
async function startProxy() {
  let authToken;
  
  try {
    authToken = await getAuthToken();
    console.log(`${colors.green}✅ Authentication successful${colors.reset}`);
  } catch (error) {
    console.error(`${colors.yellow}❌ ${error.message}${colors.reset}`);
    process.exit(1);
  }
  
  const server = http.createServer((req, res) => {
    // Enable CORS for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Parse URL to determine target service
    const pathParts = req.url.split('/').filter(p => p);
    const service = pathParts[0] || 'api';
    const targetPath = '/' + pathParts.slice(1).join('/');
    
    const targetUrl = SERVICES[service];
    if (!targetUrl) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Service not found. Available: ' + Object.keys(SERVICES).join(', ') }));
      return;
    }
    
    // Proxy the request
    const options = {
      method: req.method,
      headers: {
        ...req.headers,
        'Authorization': `Bearer ${authToken}`,
        'Host': new URL(targetUrl).host
      }
    };
    
    const proxyReq = https.request(targetUrl + targetPath, options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (error) => {
      console.error('Proxy error:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Proxy error' }));
    });
    
    req.pipe(proxyReq);
  });
  
  server.listen(PORT, () => {
    console.log(`\n${colors.blue}🚀 Proxy running on http://localhost:${PORT}${colors.reset}\n`);
    console.log('Available endpoints:');
    console.log(`  ${colors.green}http://localhost:${PORT}/api/health${colors.reset} → Sacred Council API`);
    console.log(`  ${colors.green}http://localhost:${PORT}/council/*${colors.reset} → Sacred Council UI`);
    console.log(`  ${colors.green}http://localhost:${PORT}/infin-love/*${colors.reset} → Infin Love Service`);
    console.log('\nPress Ctrl+C to stop\n');
  });
  
  // Refresh token periodically
  setInterval(async () => {
    try {
      authToken = await getAuthToken();
      console.log(`${colors.blue}🔄 Token refreshed${colors.reset}`);
    } catch (error) {
      console.error(`${colors.yellow}⚠️ Token refresh failed${colors.reset}`);
    }
  }, 45 * 60 * 1000); // Every 45 minutes
}

startProxy().catch(console.error);