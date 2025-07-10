#!/usr/bin/env node

/**
 * Fix Harmony Variable Names Script
 * 
 * Fixes variable names that contain hyphens (which are invalid JavaScript identifiers)
 * Converts them to camelCase or uses underscores
 */

const fs = require('fs');
const path = require('path');

// Track stats
let filesProcessed = 0;
let filesFixed = 0;
let totalFixes = 0;

// Patterns to fix - variable declarations with hyphens
const fixPatterns = [
  {
    // Fix const/let/var resonant-coherence variable declarations
    pattern: /(\s*)(const|let|var)\s+resonant-coherence(\s*=)/g,
    replacement: '$1$2 resonantCoherence$3',
    description: 'resonant-coherence variable declaration'
  },
  {
    // Fix const/let/var integral-wisdom-cultivation variable declarations
    pattern: /(\s*)(const|let|var)\s+integral-wisdom-cultivation(\s*=)/g,
    replacement: '$1$2 integralWisdomCultivation$3',
    description: 'integral-wisdom-cultivation variable declaration'
  },
  {
    // Fix const/let/var pan-sentient-flourishing variable declarations
    pattern: /(\s*)(const|let|var)\s+pan-sentient-flourishing(\s*=)/g,
    replacement: '$1$2 panSentientFlourishing$3',
    description: 'pan-sentient-flourishing variable declaration'
  },
  {
    // Fix const/let/var infinite-play variable declarations
    pattern: /(\s*)(const|let|var)\s+infinite-play(\s*=)/g,
    replacement: '$1$2 infinitePlay$3',
    description: 'infinite-play variable declaration'
  },
  {
    // Fix const/let/var universal-interconnectedness variable declarations
    pattern: /(\s*)(const|let|var)\s+universal-interconnectedness(\s*=)/g,
    replacement: '$1$2 universalInterconnectedness$3',
    description: 'universal-interconnectedness variable declaration'
  },
  {
    // Fix const/let/var sacred-reciprocity variable declarations
    pattern: /(\s*)(const|let|var)\s+sacred-reciprocity(\s*=)/g,
    replacement: '$1$2 sacredReciprocity$3',
    description: 'sacred-reciprocity variable declaration'
  },
  {
    // Fix const/let/var evolutionary-progression variable declarations
    pattern: /(\s*)(const|let|var)\s+evolutionary-progression(\s*=)/g,
    replacement: '$1$2 evolutionaryProgression$3',
    description: 'evolutionary-progression variable declaration'
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
console.log('🔧 Starting Harmony Variable Name Fixes...');
console.log('========================================');

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
  console.log('\n🎉 Successfully fixed variable name issues!');
  console.log('Invalid JavaScript identifiers with hyphens have been converted to camelCase.');
} else {
  console.log('\n✨ No fixes needed - all variable names are already valid!');
}