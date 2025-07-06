#!/usr/bin/env node

/**
 * Fix Harmony Replacements Script
 * 
 * Fixes the double/triple replacement issues caused by the update-seven-harmonies.js script
 * where "coherence" was replaced multiple times resulting in:
 * - "resonant-coherence" (should be "resonant-coherence")
 * - "resonant-coherence" (should be "resonant-coherence")
 */

const fs = require('fs');
const path = require('path');

// Track stats
let filesProcessed = 0;
let filesFixed = 0;
let totalFixes = 0;

// Patterns to fix
const fixPatterns = [
  {
    // Fix triple replacement
    pattern: /resonant-coherence/g,
    replacement: 'resonant-coherence',
    description: 'triple replacement'
  },
  {
    // Fix double replacement
    pattern: /resonant-coherence/g,
    replacement: 'resonant-coherence',
    description: 'double replacement'
  }
];

// File extensions to process
const validExtensions = ['.js', '.cjs', '.mjs', '.html', '.css', '.json', '.md', '.yaml', '.yml'];

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
console.log('🔧 Starting Harmony Replacement Fixes...');
console.log('===================================');

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
  console.log('\n🎉 Successfully fixed double/triple replacement issues!');
  console.log('The harmony names should now be correctly formatted.');
} else {
  console.log('\n✨ No fixes needed - all harmony names are already correct!');
}