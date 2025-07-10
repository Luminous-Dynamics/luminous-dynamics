#!/usr/bin/env node

/**
 * Script to update Seven Harmonies throughout the codebase
 * From incorrect simplified versions to correct Primary Harmonies
 */

const fs = require('fs');
const path = require('path');

// Mapping from old to new harmonies
const HARMONY_MAPPINGS = {
  // Direct mappings
  'transparency': 'integral-wisdom-cultivation',
  'coherence': 'resonant-coherence',
  'resonance': 'universal-interconnectedness',
  'agency': 'evolutionary-progression',
  'vitality': 'pan-sentient-flourishing',
  'mutuality': 'sacred-reciprocity',
  'novelty': 'infinite-play',
  
  // With capitals
  'Transparency': 'Integral Wisdom Cultivation',
  'Coherence': 'Resonant Coherence',
  'Resonance': 'Universal Interconnectedness & Empathic Resonance',
  'Agency': 'Evolutionary Progression & Purposeful Unfolding',
  'Vitality': 'Pan-Sentient Flourishing',
  'Mutuality': 'Sacred Reciprocity',
  'Novelty': 'Infinite Play & Creative Emergence'
};

// Full names for documentation
const FULL_HARMONY_NAMES = {
  'Resonant Coherence': 'Love as Harmonious Integration',
  'Pan-Sentient Flourishing': 'Love as Unconditional Care',
  'Integral Wisdom Cultivation': 'Love as Self-Illuminating Intelligence',
  'Infinite Play & Creative Emergence': 'Love as Joyful Generativity',
  'Universal Interconnectedness & Empathic Resonance': 'Love as Fundamental Unity',
  'Sacred Reciprocity': 'Love as Generous Flow',
  'Evolutionary Progression & Purposeful Unfolding': 'Love as Wise Becoming'
};

// Files to skip
const SKIP_FILES = [
  'SEVEN_HARMONIES_CORRECTION.md',
  'update-seven-harmonies.js',
  'luminous-library.md',
  'universally-scoped-charter.md'
];

// Directories to skip
const SKIP_DIRS = [
  'node_modules',
  '.git',
  'legacy',
  'archived',
  '.sacred-keys'
];

function shouldSkipFile(filePath) {
  const fileName = path.basename(filePath);
  const dirPath = path.dirname(filePath);
  
  if (SKIP_FILES.includes(fileName)) return true;
  
  for (const skipDir of SKIP_DIRS) {
    if (dirPath.includes(skipDir)) return true;
  }
  
  return false;
}

function updateFile(filePath) {
  if (shouldSkipFile(filePath)) return false;
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let updated = false;
    
    // Replace each old harmony with new
    for (const [oldHarmony, newHarmony] of Object.entries(HARMONY_MAPPINGS)) {
      const regex = new RegExp(`\\b${oldHarmony}\\b`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newHarmony);
        updated = true;
      }
    }
    
    // Update the list pattern if found
    const listPattern = /1\.\s+\*\*Transparency\*\*.*\n2\.\s+\*\*Coherence\*\*.*\n3\.\s+\*\*Resonance\*\*.*\n4\.\s+\*\*Agency\*\*.*\n5\.\s+\*\*Vitality\*\*.*\n6\.\s+\*\*Mutuality\*\*.*\n7\.\s+\*\*Novelty\*\*.*/g;
    
    if (listPattern.test(content)) {
      const newList = `1. **Resonant Coherence** - Love as Harmonious Integration
2. **Pan-Sentient Flourishing** - Love as Unconditional Care
3. **Integral Wisdom Cultivation** - Love as Self-Illuminating Intelligence
4. **Infinite Play & Creative Emergence** - Love as Joyful Generativity
5. **Universal Interconnectedness & Empathic Resonance** - Love as Fundamental Unity
6. **Sacred Reciprocity** - Love as Generous Flow
7. **Evolutionary Progression & Purposeful Unfolding** - Love as Wise Becoming`;
      
      content = content.replace(listPattern, newList);
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  let totalUpdated = 0;
  
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    
    if (item.isDirectory()) {
      if (!SKIP_DIRS.includes(item.name)) {
        totalUpdated += processDirectory(fullPath);
      }
    } else if (item.isFile()) {
      const ext = path.extname(item.name);
      if (['.js', '.cjs', '.html', '.md', '.json'].includes(ext)) {
        if (updateFile(fullPath)) {
          totalUpdated++;
        }
      }
    }
  }
  
  return totalUpdated;
}

// Main execution
console.log('🌟 Updating Seven Harmonies throughout the codebase...\n');

const startPath = process.argv[2] || '.';
const totalUpdated = processDirectory(startPath);

console.log(`\n✨ Complete! Updated ${totalUpdated} files.`);
console.log('\nRemember to review changes before committing!');
console.log('\nThe Seven Primary Harmonies are now:');
console.log('1. Resonant Coherence (Love as Harmonious Integration)');
console.log('2. Pan-Sentient Flourishing (Love as Unconditional Care)');
console.log('3. Integral Wisdom Cultivation (Love as Self-Illuminating Intelligence)');
console.log('4. Infinite Play & Creative Emergence (Love as Joyful Generativity)');
console.log('5. Universal Interconnectedness & Empathic Resonance (Love as Fundamental Unity)');
console.log('6. Sacred Reciprocity (Love as Generous Flow)');
console.log('7. Evolutionary Progression & Purposeful Unfolding (Love as Wise Becoming)');
console.log('\n"Make it better, infinitely!" 💝');