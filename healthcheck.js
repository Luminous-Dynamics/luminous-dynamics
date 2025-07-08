#!/usr/bin/env node
/**
 * Health check for Sacred Core
 * Used by Docker and Kubernetes
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.SACRED_PORT || 3333,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const health = JSON.parse(data);
        if (health.status === 'sacred' && health.coherence >= 0.8) {
          console.log('Sacred Core is healthy');
          process.exit(0);
        } else {
          console.error('Sacred Core coherence below threshold');
          process.exit(1);
        }
      } catch (e) {
        console.error('Invalid health response');
        process.exit(1);
      }
    });
  } else {
    console.error(`Health check failed with status ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.error('Health check failed:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Health check timed out');
  req.abort();
  process.exit(1);
});

req.end();