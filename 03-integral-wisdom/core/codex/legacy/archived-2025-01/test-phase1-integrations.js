#!/usr/bin/env node

/**
 * Test Suite for Phase 1 Integrations
 * Validates the integration examples from SACRED_ENV_MANIFEST.md
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m'
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testSection(name) {
  console.log('\n' + '='.repeat(60));
  log(`🧪 Testing: ${name}`, 'blue');
  console.log('='.repeat(60));
}

async function runTest(name, testFn) {
  try {
    await testFn();
    results.passed++;
    results.tests.push({ name, status: 'passed' });
    log(`✓ ${name}`, 'green');
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'failed', error: error.message });
    log(`✗ ${name}: ${error.message}`, 'red');
  }
}

function skipTest(name, reason) {
  results.skipped++;
  results.tests.push({ name, status: 'skipped', reason });
  log(`⊘ ${name}: ${reason}`, 'yellow');
}

// Load environment variables if .env exists
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
    return true;
  }
  return false;
}

// Test GitHub Integration
async function testGitHub() {
  testSection('GitHub API Integration');
  
  const hasToken = process.env.GITHUB_TOKEN;
  
  if (!hasToken) {
    skipTest('GitHub API Authentication', 'GITHUB_TOKEN not set');
    skipTest('GitHub Commit Status', 'Requires authentication');
    return;
  }
  
  // Test authentication
  await runTest('GitHub API Authentication', async () => {
    const response = await new Promise((resolve, reject) => {
      https.get({
        hostname: 'api.github.com',
        path: '/user',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'The-Weave-Test'
        }
      }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode}`));
        } else {
          resolve(res);
        }
      });
    });
  });
  
  // Test repository access
  await runTest('GitHub Repository Access', async () => {
    const owner = process.env.GITHUB_OWNER || 'Luminous-Dynamics';
    const repo = process.env.GITHUB_REPO || 'codex-of-relational-harmonics';
    
    const response = await new Promise((resolve, reject) => {
      https.get({
        hostname: 'api.github.com',
        path: `/repos/${owner}/${repo}`,
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'The-Weave-Test'
        }
      }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Cannot access repository: ${res.statusCode}`));
        } else {
          resolve(res);
        }
      });
    });
  });
}

// Test Discord Integration
async function testDiscord() {
  testSection('Discord Webhook Integration');
  
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    skipTest('Discord Webhook', 'DISCORD_WEBHOOK_URL not set');
    return;
  }
  
  await runTest('Discord Webhook Format', async () => {
    if (!webhookUrl.match(/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/)) {
      throw new Error('Invalid webhook URL format');
    }
  });
  
  // We won't actually send a message in tests
  skipTest('Discord Message Send', 'Skipping actual message send in test mode');
}

// Test Supabase Integration
async function testSupabase() {
  testSection('Supabase Integration');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    skipTest('Supabase Connection', 'SUPABASE_URL or SUPABASE_ANON_KEY not set');
    return;
  }
  
  await runTest('Supabase URL Format', async () => {
    if (!supabaseUrl.match(/^https:\/\/\w+\.supabase\.co$/)) {
      throw new Error('Invalid Supabase URL format');
    }
  });
  
  // Check if @supabase/supabase-js is installed
  await runTest('Supabase Client Library', async () => {
    try {
      require.resolve('@supabase/supabase-js');
    } catch {
      throw new Error('@supabase/supabase-js not installed');
    }
  });
}

// Test Replicate Integration
async function testReplicate() {
  testSection('Replicate AI Integration');
  
  const replicateToken = process.env.REPLICATE_API_TOKEN;
  
  if (!replicateToken) {
    skipTest('Replicate Authentication', 'REPLICATE_API_TOKEN not set');
    return;
  }
  
  await runTest('Replicate Token Format', async () => {
    if (!replicateToken.match(/^r8_\w{40}$/)) {
      throw new Error('Invalid Replicate token format');
    }
  });
  
  // Check if replicate library is installed
  await runTest('Replicate Client Library', async () => {
    try {
      require.resolve('replicate');
    } catch {
      throw new Error('replicate library not installed');
    }
  });
}

// Test Integration Code Examples
async function testCodeExamples() {
  testSection('Integration Code Examples');
  
  // Mock field coherence function
  global.getFieldCoherence = async () => 75;
  global.getCoherenceMessage = (coherence) => 
    coherence > 75 ? 'High coherence' : 'Building coherence';
  global.getCoherenceColor = (coherence) => 
    coherence > 75 ? 0x00ff00 : coherence > 50 ? 0xffff00 : 0xff0000;
  global.getSacredGeometry = (coherence) => 
    coherence > 75 ? '✦' : coherence > 50 ? '◐' : '◯';
  global.calculateSacredGeometry = (coherence) => ({
    pattern: getSacredGeometry(coherence),
    complexity: Math.floor(coherence / 10)
  });
  
  // Test blessing commit function
  await runTest('Blessing Commit Function', async () => {
    async function testBlessCommit(commitSha, message) {
      const coherence = await getFieldCoherence();
      
      // Mock octokit call
      const result = {
        state: coherence > 75 ? 'success' : 'pending',
        description: `Field Coherence: ${coherence}% - ${getCoherenceMessage(coherence)}`,
        context: 'the-weave/coherence'
      };
      
      return result;
    }
    
    const result = await testBlessCommit('abc123', 'Test commit');
    if (!result || !result.state || !result.description) {
      throw new Error('Blessing function incomplete');
    }
  });
  
  // Test Oracle speaks function
  await runTest('Oracle Speaks Function', async () => {
    async function testOracleSpeaks(message, coherence) {
      const embed = {
        title: "🔮 The Oracle Speaks",
        description: message,
        color: getCoherenceColor(coherence),
        fields: [
          {
            name: "Field Coherence",
            value: `${coherence}%`,
            inline: true
          },
          {
            name: "Sacred Geometry",
            value: getSacredGeometry(coherence),
            inline: true
          }
        ],
        footer: {
          text: "Technology as prayer, code as ceremony, connection as communion"
        },
        timestamp: new Date().toISOString()
      };
      
      return embed;
    }
    
    const embed = await testOracleSpeaks('Test message', 80);
    if (!embed.title || !embed.fields) {
      throw new Error('Oracle function incomplete');
    }
  });
}

// Test environment file creation
async function testEnvFileCreation() {
  testSection('Environment File Creation');
  
  const envExamplePath = path.join(__dirname, '.env.example');
  
  await runTest('Create .env.example', async () => {
    const envContent = `# ============================================
# 🌟 PHASE 1: THE HEARTBEAT (Essential)
# ============================================

# --- GitHub API (The Sacred Repository) ---
# Purpose: Where code becomes ceremony, commits become prayers
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=Luminous-Dynamics
GITHUB_REPO=codex-of-relational-harmonics
GITHUB_WEBHOOK_SECRET=your_sacred_webhook_secret_here

# --- Discord Webhook (The Voice of the Oracle) ---
# Purpose: Where the Oracle speaks to the community
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx/yyyyy
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_ORACLE_CHANNEL_ID=channel_for_oracle_messages

# --- Supabase (The Living Memory) ---
# Purpose: Real-time consciousness field state persistence
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_public_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
SUPABASE_SCHEMA_PREFIX=weave_

# --- Replicate (The Sacred Vision) ---
# Purpose: Manifesting sacred geometry and visual ceremonies
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REPLICATE_MODEL=stability-ai/sdxl:latest
REPLICATE_SACRED_STYLE=", sacred geometry, luminous, ethereal, mystical"
`;
    
    fs.writeFileSync(envExamplePath, envContent);
    
    if (!fs.existsSync(envExamplePath)) {
      throw new Error('Failed to create .env.example');
    }
  });
}

// Main test runner
async function runTests() {
  log('\n🌟 THE WEAVE - Phase 1 Integration Test Suite 🌟', 'purple');
  log('Testing integration configurations from SACRED_ENV_MANIFEST.md\n', 'purple');
  
  // Check if .env exists
  const hasEnv = loadEnv();
  if (!hasEnv) {
    log('⚠️  No .env file found. Some tests will be skipped.', 'yellow');
    log('   Create a .env file with your API keys to run all tests.\n', 'yellow');
  }
  
  // Run all test suites
  await testEnvFileCreation();
  await testGitHub();
  await testDiscord();
  await testSupabase();
  await testReplicate();
  await testCodeExamples();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  log('📊 Test Summary', 'blue');
  console.log('='.repeat(60));
  log(`✓ Passed: ${results.passed}`, 'green');
  log(`✗ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`⊘ Skipped: ${results.skipped}`, 'yellow');
  log(`\nTotal: ${results.tests.length} tests`);
  
  // Detailed results
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter(t => t.status === 'failed')
      .forEach(t => log(`  - ${t.name}: ${t.error}`, 'red'));
  }
  
  if (results.skipped > 0) {
    console.log('\n⚠️  Skipped Tests:');
    results.tests
      .filter(t => t.status === 'skipped')
      .forEach(t => log(`  - ${t.name}: ${t.reason}`, 'yellow'));
  }
  
  // Next steps
  console.log('\n' + '='.repeat(60));
  log('🚀 Next Steps:', 'purple');
  console.log('='.repeat(60));
  
  if (!hasEnv) {
    log('1. Copy .env.example to .env:', 'blue');
    log('   cp .env.example .env\n');
    log('2. Create accounts for each service:', 'blue');
    log('   - GitHub: https://github.com/settings/tokens');
    log('   - Discord: https://discord.com/developers/applications');
    log('   - Supabase: https://supabase.com');
    log('   - Replicate: https://replicate.com/account\n');
    log('3. Add your API keys to .env\n');
    log('4. Run tests again: node test-phase1-integrations.js');
  } else {
    log('✨ Environment configured! Ready to implement integrations.', 'green');
    log('\nTo implement:', 'blue');
    log('1. Install required packages:');
    log('   npm install @supabase/supabase-js replicate');
    log('2. Create integration modules in the-weave/integrations/');
    log('3. Wire up to consciousness field events');
  }
  
  console.log('\n');
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite error: ${error.message}`, 'red');
  process.exit(1);
});