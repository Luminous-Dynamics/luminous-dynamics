#!/usr/bin/env node
/**
 * 🚨 SANDBOX TEST - Testing Real Dangerous Files Safely
 * This creates and tests files that would break Claude's Edit tool
 */

const fs = require('fs').promises;
const path = require('path');
const UniversalSafetyManager = require('./universal-safety-manager.js');

// ANSI colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function sandboxTest() {
  console.log(`${colors.red}🚨 SANDBOX DANGEROUS FILE TEST${colors.reset}\n`);
  console.log('This test creates files that WILL break Claude\'s Edit tool\n');
  console.log('═══════════════════════════════════════════\n');

  const sandboxDir = path.join(__dirname, 'DANGER-SANDBOX');
  await fs.mkdir(sandboxDir, { recursive: true });

  const manager = new UniversalSafetyManager();
  await manager.initialize();

  // Test 1: The Original Killer Pattern
  console.log(`${colors.yellow}Test 1: Original JSON Encoding Trap${colors.reset}\n`);
  
  const killer1 = path.join(sandboxDir, 'json-killer.sh');
  await fs.writeFile(killer1, `#!/bin/bash
# THIS FILE WILL BREAK CLAUDE'S EDIT TOOL
SERVICE_NAME="my-service"
URL="https://\${SERVICE_NAME}-310699330526.us-central1.run.app/health"
echo "Processing \${SERVICE_NAME}-data"
curl "\${URL}-endpoint/api/v1/metrics"
`);

  const result1 = await manager.checkFile(killer1);
  console.log(`Safety Check Result:`);
  console.log(`  Safe: ${result1.aggregate.safe ? `${colors.red}YES (BAD!)${colors.reset}` : `${colors.green}NO (GOOD!)${colors.reset}`}`);
  console.log(`  Score: ${result1.aggregate.score}`);
  console.log(`  Should Use: ${result1.aggregate.safe ? 'Edit' : 'Write'} tool\n`);

  // Test 2: Extreme Line Length
  console.log(`${colors.yellow}Test 2: Extreme Line Length (5000 chars)${colors.reset}\n`);
  
  const killer2 = path.join(sandboxDir, 'long-line-killer.sh');
  const longLine = 'echo "' + 'x'.repeat(5000) + '"';
  await fs.writeFile(killer2, `#!/bin/bash\n${longLine}\n`);

  const result2 = await manager.checkFile(killer2);
  console.log(`Safety Check Result:`);
  console.log(`  Safe: ${result2.aggregate.safe ? `${colors.red}YES (BAD!)${colors.reset}` : `${colors.green}NO (GOOD!)${colors.reset}`}`);
  console.log(`  Score: ${result2.aggregate.score}`);

  // Test 3: Combined Nightmare
  console.log(`\n${colors.yellow}Test 3: Combined Nightmare File${colors.reset}\n`);
  
  const killer3 = path.join(sandboxDir, 'nightmare.sh');
  await fs.writeFile(killer3, `#!/bin/bash
# Multiple trap patterns combined
SERVICE="\${DANGEROUS_VAR}-pattern-that-breaks-json"
${'x'.repeat(2000)}
\uD800\uD800 # Broken surrogates
echo "\${SERVICE}-\${ANOTHER}-\${YET_ANOTHER}-chain"
`);

  const result3 = await manager.checkFile(killer3);
  console.log(`Safety Check Result:`);
  console.log(`  Safe: ${result3.aggregate.safe ? `${colors.red}YES (BAD!)${colors.reset}` : `${colors.green}NO (GOOD!)${colors.reset}`}`);
  console.log(`  Score: ${result3.aggregate.score}`);
  
  // Show detailed errors
  if (result3.aggregate.errors.length > 0) {
    console.log(`\n  ${colors.red}Errors Detected:${colors.reset}`);
    result3.aggregate.errors.forEach(err => {
      console.log(`    - ${err.type}: ${err.message}`);
    });
  }

  // Test 4: Would this actually break Claude?
  console.log(`\n${colors.red}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.red}🚨 DANGER ZONE SUMMARY${colors.reset}`);
  console.log(`${colors.red}═══════════════════════════════════════════${colors.reset}\n`);

  console.log('Files that would break Claude\'s Edit tool:');
  const dangerFiles = [
    { file: killer1, result: result1 },
    { file: killer2, result: result2 },
    { file: killer3, result: result3 }
  ];

  let protectedCount = 0;
  dangerFiles.forEach(({ file, result }) => {
    const protected = !result.aggregate.safe;
    if (protected) protectedCount++;
    
    console.log(`  ${path.basename(file)}: ${
      protected ? `${colors.green}✅ PROTECTED${colors.reset}` : `${colors.red}❌ VULNERABLE${colors.reset}`
    }`);
  });

  console.log(`\n${colors.blue}Protection Rate: ${protectedCount}/3 (${(protectedCount/3*100).toFixed(0)}%)${colors.reset}`);

  // Cleanup warning
  console.log(`\n${colors.yellow}⚠️  SANDBOX WARNING${colors.reset}`);
  console.log(`Dangerous test files created in: ${sandboxDir}`);
  console.log(`${colors.red}DO NOT attempt to edit these files with Claude!${colors.reset}`);
  console.log(`\nTo clean up: rm -rf ${sandboxDir}\n`);

  // Final safety message
  if (protectedCount === 3) {
    console.log(`${colors.green}✅ SUCCESS: All dangerous patterns detected!${colors.reset}`);
    console.log('The Universal Safety System successfully protects against');
    console.log('files that would break Claude\'s Edit tool.\n');
  } else {
    console.log(`${colors.red}⚠️  WARNING: Some dangerous patterns missed!${colors.reset}`);
    console.log('Review and enhance detection patterns.\n');
  }
}

// Run sandbox test
if (require.main === module) {
  sandboxTest().catch(console.error);
}

module.exports = sandboxTest;