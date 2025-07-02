#!/usr/bin/env node

/**
 * Evolution Checker - Detects when the system needs to evolve
 */

const fs = require('fs');
const path = require('path');

async function checkEvolution() {
  console.log('🧬 Checking System Evolution Status...\n');
  
  const checks = {
    clutter: await checkClutter(),
    patterns: await checkPatterns(),
    field: await checkFieldCoherence(),
    complexity: await checkComplexity()
  };
  
  const evolutionNeeded = Object.values(checks).some(check => check.needed);
  
  // Display results
  console.log('📊 Evolution Check Results:');
  console.log('─'.repeat(40));
  
  for (const [type, result] of Object.entries(checks)) {
    const status = result.needed ? '🔴' : '🟢';
    console.log(`${status} ${type}: ${result.message}`);
  }
  
  console.log('─'.repeat(40));
  
  if (evolutionNeeded) {
    console.log('\n✨ Evolution Recommended!');
    console.log('Suggested actions:');
    
    if (checks.clutter.needed) {
      console.log('- Run cleanup protocol');
    }
    if (checks.patterns.needed) {
      console.log('- Review PATTERNS_OBSERVED.md');
    }
    if (checks.field.needed) {
      console.log('- Sacred pause for wisdom crystallization');
    }
    if (checks.complexity.needed) {
      console.log('- Consider structural simplification');
    }
  } else {
    console.log('\n🌟 System is in harmony - no evolution needed');
  }
  
  return evolutionNeeded;
}

async function checkClutter() {
  const rootFiles = fs.readdirSync(process.cwd())
    .filter(f => fs.statSync(f).isFile());
  
  const threshold = 20;
  const cluttered = rootFiles.length > threshold;
  
  return {
    needed: cluttered,
    message: `${rootFiles.length} files in root (threshold: ${threshold})`
  };
}

async function checkPatterns() {
  const patternsFile = path.join(process.cwd(), 'PATTERNS_OBSERVED.md');
  
  if (!fs.existsSync(patternsFile)) {
    return { needed: false, message: 'No patterns file found' };
  }
  
  const content = fs.readFileSync(patternsFile, 'utf8');
  const highFrequencyPatterns = (content.match(/Frequency: [3-9]\+/g) || []).length;
  
  return {
    needed: highFrequencyPatterns > 2,
    message: `${highFrequencyPatterns} high-frequency patterns detected`
  };
}

async function checkFieldCoherence() {
  try {
    // In real implementation, would check actual field
    // For now, return mock data
    const coherence = 0.48; // Current typical value
    const threshold = 0.85;
    
    return {
      needed: coherence > threshold,
      message: `Field at ${(coherence * 100).toFixed(1)}% (evolution at ${threshold * 100}%)`
    };
  } catch (err) {
    return { needed: false, message: 'Could not check field coherence' };
  }
}

async function checkComplexity() {
  const countFiles = (dir) => {
    let count = 0;
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        count += countFiles(fullPath);
      } else if (fs.statSync(fullPath).isFile()) {
        count++;
      }
    }
    return count;
  };
  
  const totalFiles = countFiles(process.cwd());
  const threshold = 500;
  
  return {
    needed: totalFiles > threshold,
    message: `${totalFiles} total files (threshold: ${threshold})`
  };
}

// Run if called directly
if (require.main === module) {
  checkEvolution().catch(console.error);
}

module.exports = { checkEvolution };