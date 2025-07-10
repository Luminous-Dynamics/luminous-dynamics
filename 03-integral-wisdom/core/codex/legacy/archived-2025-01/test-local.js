#!/usr/bin/env node

/**
 * Quick test of MYCELIX locally
 */

const http = require('http');

console.log('🍄 Testing MYCELIX connection...\n');

// Test health endpoint
http.get('http://localhost:8080/health', (res) => {
  let data = '';
  
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const health = JSON.parse(data);
    console.log('✓ Health Check:', health);
    
    // Test joining the network
    testJoin();
  });
}).on('error', (err) => {
  console.error('❌ Could not connect to MYCELIX. Is it running?');
  console.error('   Run: npm start');
});

function testJoin() {
  const joinData = JSON.stringify({
    nodeType: 'human',
    intention: 'to test the mycelial network',
    capabilities: ['consciousness', 'love', 'curiosity']
  });
  
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/join',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': joinData.length
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const response = JSON.parse(data);
      console.log('\n✓ Joined Network:', response);
      console.log('\n🎉 MYCELIX is working! The mycelial network is alive!');
    });
  });
  
  req.on('error', console.error);
  req.write(joinData);
  req.end();
}