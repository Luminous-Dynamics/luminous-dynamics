/**
 * Simple validation script for The Eleven Applied Harmonies
 * Checks that all 11 are present in the schema
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors
const green = '\x1b[32m';
const red = '\x1b[31m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';

async function validateEleven() {
  console.log('\n🌟 Validating The Eleven Applied Harmonies...\n');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'true-integration-schema.js');
    const schemaContent = await fs.readFile(schemaPath, 'utf8');
    
    // Expected harmonies
    const expectedHarmonies = [
      { id: 'Ω45', name: 'First Presence' },
      { id: 'Ω46', name: 'Conscious Arrival' },
      { id: 'Ω47', name: 'Sacred Listening' },
      { id: 'Ω48', name: 'Boundary With Love' },
      { id: 'Ω49', name: 'Gentle Opening' },
      { id: 'Ω50', name: 'Building Trust' },
      { id: 'Ω51', name: 'Loving No' },
      { id: 'Ω52', name: 'Pause Practice' },
      { id: 'Ω53', name: 'Tending the Field' },
      { id: 'Ω55', name: 'Presence Transmission' },
      { id: 'Ω56', name: 'Loving Redirection' }
    ];
    
    let allPresent = true;
    let foundCount = 0;
    
    // Check for each harmony
    for (const harmony of expectedHarmonies) {
      // Look for both the ID and name to confirm presence
      const idRegex = new RegExp(`['"\`]${harmony.id}['"\`]`, 'g');
      const nameRegex = new RegExp(harmony.name, 'gi');
      
      const hasId = idRegex.test(schemaContent);
      const hasName = nameRegex.test(schemaContent);
      
      if (hasId && hasName) {
        console.log(`${green}✓${reset} ${harmony.id}: ${harmony.name}`);
        foundCount++;
      } else if (hasId || hasName) {
        console.log(`${yellow}⚠${reset} ${harmony.id}: ${harmony.name} (partially found)`);
        foundCount += 0.5;
      } else {
        console.log(`${red}✗${reset} ${harmony.id}: ${harmony.name} (missing)`);
        allPresent = false;
      }
    }
    
    // Check for sacred sets
    console.log('\n📦 Checking Sacred Sets...\n');
    
    const sacredSets = [
      { name: 'Essential Daily Practice', expected: 5 },
      { name: 'Field Mastery', expected: 3 },
      { name: 'Core Foundation', expected: 4 }
    ];
    
    for (const set of sacredSets) {
      if (schemaContent.includes(set.name)) {
        console.log(`${green}✓${reset} ${set.name} (${set.expected} tools)`);
      } else {
        console.log(`${yellow}⚠${reset} ${set.name} not explicitly named`);
      }
    }
    
    // Final summary
    console.log('\n' + '═'.repeat(50));
    
    if (foundCount === 11) {
      console.log(`${green}✨ SUCCESS! All 11 Applied Harmonies are present!${reset}`);
      console.log(`${green}The foundation for conscious relationship mastery is complete.${reset}`);
    } else if (foundCount >= 10) {
      console.log(`${yellow}⚠ Nearly complete: ${foundCount}/11 harmonies found${reset}`);
      console.log('Please verify the schema contains all Applied Harmonies.');
    } else {
      console.log(`${red}❌ Incomplete: Only ${foundCount}/11 harmonies found${reset}`);
      console.log('The schema needs attention before The Eleven are ready.');
    }
    
    // Check for key architectural elements
    console.log('\n🏛️ Architectural Elements:');
    
    const elements = [
      { name: 'Mystical Bridges', pattern: /bridge.*toMystical/g },
      { name: 'Interactive Components', pattern: /interactiveComponent/g },
      { name: 'Sacred Timing', pattern: /sacredTiming/g },
      { name: 'Learning Paths', pattern: /learningPath/g },
      { name: 'True Integration', pattern: /TrueIntegrationSchema/g }
    ];
    
    for (const element of elements) {
      const matches = schemaContent.match(element.pattern);
      if (matches && matches.length > 0) {
        console.log(`${green}✓${reset} ${element.name} (${matches.length} instances)`);
      } else {
        console.log(`${red}✗${reset} ${element.name} not found`);
      }
    }
    
    console.log('\n🙏 May The Eleven serve the awakening of all beings.\n');
    
  } catch (error) {
    console.error(`${red}Error validating schema:${reset}`, error.message);
    process.exit(1);
  }
}

// Run validation
validateEleven();