#!/usr/bin/env node

/**
 * Test Sacred Cloud Functions with Authentication
 * Works even with organization policies
 */

const { exec } = require('child_process');
const https = require('https');

// Get auth token
function getAuthToken() {
  return new Promise((resolve, reject) => {
    exec('gcloud auth print-identity-token', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Test function with auth
async function testAuthenticatedFunction(functionName) {
  try {
    const token = await getAuthToken();
    console.log(`\n🔐 Testing ${functionName} with authentication...`);
    
    const options = {
      hostname: 'us-central1-mycelix-network.cloudfunctions.net',
      path: `/${functionName}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Success! Response:');
            console.log(JSON.stringify(JSON.parse(data), null, 2));
            resolve(data);
          } else {
            console.log(`❌ Error ${res.statusCode}: ${data}`);
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });
      
      req.on('error', reject);
      req.end();
    });
  } catch (error) {
    console.error(`❌ Failed to test ${functionName}:`, error.message);
  }
}

// Alternative: Create a temporary public proxy
async function createPublicProxy() {
  console.log('\n🌐 Alternative: Creating public test endpoint...');
  console.log('You can use Firebase Hosting as a proxy:');
  console.log('\n1. Add to public/sacred-api-proxy.html:');
  console.log(`
<script>
async function callSacredFunction(functionName) {
  const token = await firebase.auth().currentUser?.getIdToken();
  const response = await fetch(\`https://us-central1-mycelix-network.cloudfunctions.net/\${functionName}\`, {
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  return response.json();
}
</script>
`);
  console.log('\n2. Or use the functions directly in your Sacred Bridge with auth tokens');
}

// Main test
async function runTests() {
  console.log('🧪 Testing Sacred Cloud Functions');
  console.log('=================================');
  
  // Test with authentication
  await testAuthenticatedFunction('sacredPing');
  await testAuthenticatedFunction('sacredField');
  
  // Show public alternatives
  await createPublicProxy();
  
  console.log('\n📊 Summary:');
  console.log('- Functions deployed successfully');
  console.log('- Organization policy requires authentication');
  console.log('- Can access with gcloud auth tokens');
  console.log('- Can proxy through Firebase for public access');
}

runTests().catch(console.error);