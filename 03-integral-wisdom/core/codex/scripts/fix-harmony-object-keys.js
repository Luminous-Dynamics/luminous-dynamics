#!/usr/bin/env node

/**
 * Fix Harmony Object Keys Script
 * 
 * Fixes object keys that contain hyphens to be properly quoted
 * This is necessary after the harmony name updates that introduced hyphens
 */

const fs = require('fs');
const path = require('path');

// Track stats
let filesProcessed = 0;
let filesFixed = 0;
let totalFixes = 0;

// Patterns to fix - unquoted object keys with hyphens
const fixPatterns = [
  {
    // Fix unquoted resonant-coherence key
    pattern: /(\s+)resonant-coherence:/g,
    replacement: '$1\'resonant-coherence\':',
    description: 'unquoted resonant-coherence key'
  },
  {
    // Fix unquoted integral-wisdom-cultivation key
    pattern: /(\s+)integral-wisdom-cultivation:/g,
    replacement: '$1\'integral-wisdom-cultivation\':',
    description: 'unquoted integral-wisdom-cultivation key'
  },
  {
    // Fix unquoted pan-sentient-flourishing key
    pattern: /(\s+)pan-sentient-flourishing:/g,
    replacement: '$1\'pan-sentient-flourishing\':',
    description: 'unquoted pan-sentient-flourishing key'
  },
  {
    // Fix unquoted infinite-play key
    pattern: /(\s+)infinite-play:/g,
    replacement: '$1\'infinite-play\':',
    description: 'unquoted infinite-play key'
  },
  {
    // Fix unquoted universal-interconnectedness key
    pattern: /(\s+)universal-interconnectedness:/g,
    replacement: '$1\'universal-interconnectedness\':',
    description: 'unquoted universal-interconnectedness key'
  },
  {
    // Fix unquoted sacred-reciprocity key
    pattern: /(\s+)sacred-reciprocity:/g,
    replacement: '$1\'sacred-reciprocity\':',
    description: 'unquoted sacred-reciprocity key'
  },
  {
    // Fix unquoted evolutionary-progression key
    pattern: /(\s+)evolutionary-progression:/g,
    replacement: '$1\'evolutionary-progression\':',
    description: 'unquoted evolutionary-progression key'
  },
  {
    // Fix property access with hyphens that should use bracket notation
    pattern: /fieldState\.resonant-coherence/g,
    replacement: 'fieldState[\'resonant-coherence\']',
    description: 'property access needing bracket notation'
  },
  {
    // Fix property access in return statements
    pattern: /fieldData\.resonant-coherence/g,
    replacement: 'fieldData[\'resonant-coherence\']',
    description: 'fieldData property access'
  },
  {
    // Fix coherence property calculation
    pattern: /this\.fieldState\.resonant-coherence/g,
    replacement: 'this.fieldState[\'resonant-coherence\']',
    description: 'fieldState coherence access'
  }
];

// File extensions to process
const validExtensions = ['.js', '.cjs', '.mjs', '.jsx', '.ts', '.tsx'];

// Directories to skip
const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'tmp', '.cache'];

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return validExtensions.includes(ext);
}

function shouldSkipDirectory(dirName) {
  return skipDirs.includes(dirName) || dirName.startsWith('.');
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileFixCount = 0;
    
    // Apply all fix patterns
    fixPatterns.forEach(({ pattern, replacement, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        const count = matches.length;
        fileFixCount += count;
        console.log(`  Fixed ${count} instance(s) of ${description} in ${filePath}`);
      }
    });
    
    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      totalFixes += fileFixCount;
    }
    
    filesProcessed++;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

function processDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!shouldSkipDirectory(entry.name)) {
          processDirectory(fullPath);
        }
      } else if (entry.isFile() && shouldProcessFile(fullPath)) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}: ${error.message}`);
  }
}

// Main execution
console.log('🔧 Starting Harmony Object Key Fixes...');
console.log('=====================================');

const startTime = Date.now();
const projectRoot = path.join(__dirname, '..');

// Process the entire project
processDirectory(projectRoot);

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n✅ Fix Complete!');
console.log('================');
console.log(`Files processed: ${filesProcessed}`);
console.log(`Files fixed: ${filesFixed}`);
console.log(`Total fixes applied: ${totalFixes}`);
console.log(`Time taken: ${duration}s`);

if (totalFixes > 0) {
  console.log('\n🎉 Successfully fixed object key issues!');
  console.log('JavaScript objects with hyphenated keys are now properly quoted.');
} else {
  console.log('\n✨ No fixes needed - all object keys are already correct!');
}