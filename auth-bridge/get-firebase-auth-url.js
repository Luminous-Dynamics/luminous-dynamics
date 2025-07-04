#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🔗 Getting Firebase Authentication URL...\n');

const firebaseLogin = spawn('npx', ['firebase', 'login', '--reauth', '--no-localhost'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let urlFound = false;

firebaseLogin.stdout.on('data', (data) => {
  output += data.toString();
  
  // Look for the session ID
  const sessionMatch = output.match(/Take note of your session ID:\s+([A-Z0-9]+)/);
  if (sessionMatch && !urlFound) {
    console.log(`Session ID: ${sessionMatch[1]}`);
  }
  
  // Look for the URL
  const urlMatch = output.match(/(https:\/\/auth\.firebase\.tools\/login\?[^\s]+)/);
  if (urlMatch && !urlFound) {
    urlFound = true;
    console.log(`\nAuthentication URL:\n${urlMatch[1]}\n`);
    console.log('Instructions:');
    console.log('1. Visit the URL above in your browser');
    console.log('2. Sign in with your Google account');
    console.log('3. Copy the authorization code');
    console.log('4. Share the code to complete authentication\n');
    
    // Kill the process once we have the URL
    setTimeout(() => {
      firebaseLogin.kill();
      process.exit(0);
    }, 1000);
  }
});

firebaseLogin.stderr.on('data', (data) => {
  console.error(data.toString());
});

// Timeout after 10 seconds
setTimeout(() => {
  if (!urlFound) {
    console.error('Timeout: Could not get authentication URL');
    firebaseLogin.kill();
    process.exit(1);
  }
}, 10000);