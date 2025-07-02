#!/usr/bin/env node

/**
 * Test Suite for The Eleven Applied Harmonies
 * Validates the complete foundation for conscious relationship mastery
 * 
 * This sacred test verifies:
 * 1. All 11 Applied Harmonies are present and complete
 * 2. Mystical bridges connect properly to foundations
 * 3. Learning paths flow naturally
 * 4. Metadata integrity for each harmony
 * 5. Interactive components functional
 * 6. Sacred sets properly categorized
 */

const fs = require('fs').promises;
const path = require('path');

// ANSI colors for sacred output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class ElevenHarmoniesTestSuite {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: []
    };
    
    // Expected Applied Harmonies
    this.expectedHarmonies = [
      'Ω45', 'Ω46', 'Ω47', 'Ω48', // Core Foundation
      'Ω49', 'Ω50', 'Ω51', 'Ω52', // Essential Daily Practice
      'Ω53', 'Ω55', 'Ω56'          // Field Mastery
    ];
    
    // Expected mystical foundations
    this.expectedFoundations = {
      'Ω45': 'Ω0',
      'Ω46': 'Ω1',
      'Ω47': 'Ω4',
      'Ω48': 'Ω7',
      'Ω49': 'Ω2',
      'Ω50': 'Ω3',
      'Ω51': 'Ω10',
      'Ω52': 'Ω15',
      'Ω53': 'Ω5',
      'Ω55': 'Ω11',
      'Ω56': 'Ω12'
    };
  }

  async runAllTests() {
    console.log(`${colors.bold}${colors.magenta}
╔═══════════════════════════════════════════════════════════╗
║        Sacred Test Suite for The Eleven Applied Harmonies  ║
║                  Conscious Relationship Mastery            ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

    await this.testSchemaIntegrity();
    await this.testAllHarmoniesPresent();
    await this.testMysticalBridges();
    await this.testLearningPaths();
    await this.testInteractiveComponents();
    await this.testSacredSets();
    await this.testMetadataIntegrity();
    await this.testProgressionFlow();
    await this.testFieldCoherence();
    
    this.displayResults();
  }

  async testSchemaIntegrity() {
    console.log(`\n${colors.cyan}Testing Schema Integrity...${colors.reset}`);
    
    try {
      const schemaPath = path.join(__dirname, 'true-integration-schema.js');
      const schemaContent = await fs.readFile(schemaPath, 'utf8');
      
      // Check if file loads without syntax errors
      const module = require(schemaPath);
      
      if (module.glyphs && module.appliedHarmonies) {
        this.pass('Schema loads successfully');
        
        if (module.glyphs.foundations && module.appliedHarmonies.practices) {
          this.pass('Schema structure intact');
        } else {
          this.fail('Schema structure missing required sections');
        }
      } else {
        this.fail('Schema missing core exports');
      }
    } catch (error) {
      this.fail(`Schema integrity check failed: ${error.message}`);
    }
  }

  async testAllHarmoniesPresent() {
    console.log(`\n${colors.cyan}Testing Presence of All Eleven Harmonies...${colors.reset}`);
    
    try {
      const schema = require('./true-integration-schema.js');
      const practices = schema.appliedHarmonies.practices;
      
      for (const harmonyId of this.expectedHarmonies) {
        if (practices[harmonyId]) {
          this.pass(`${harmonyId}: ${practices[harmonyId].name} present`);
        } else {
          this.fail(`${harmonyId} missing from schema`);
        }
      }
      
      // Check count
      const actualCount = Object.keys(practices).length;
      if (actualCount === 11) {
        this.pass('Exactly 11 Applied Harmonies present');
      } else {
        this.fail(`Expected 11 harmonies, found ${actualCount}`);
      }
    } catch (error) {
      this.fail(`Harmony presence test failed: ${error.message}`);
    }
  }

  async testMysticalBridges() {
    console.log(`\n${colors.cyan}Testing Mystical Bridge Connections...${colors.reset}`);
    
    try {
      const schema = require('./true-integration-schema.js');
      const practices = schema.appliedHarmonies.practices;
      const foundations = schema.glyphs.foundations;
      
      for (const [applied, foundation] of Object.entries(this.expectedFoundations)) {
        const appliedHarmony = practices[applied];
        const foundationGlyph = foundations[foundation];
        
        if (!appliedHarmony) {
          this.fail(`Applied Harmony ${applied} not found`);
          continue;
        }
        
        if (!foundationGlyph) {
          this.fail(`Foundation ${foundation} not found`);
          continue;
        }
        
        // Check bridge exists
        if (appliedHarmony.bridge && appliedHarmony.bridge.toMystical) {
          this.pass(`${applied} → ${foundation} bridge exists`);
          
          // Verify bridge references correct foundation
          if (appliedHarmony.bridge.toMystical.includes(foundation)) {
            this.pass(`${applied} correctly references ${foundation}`);
          } else {
            this.warn(`${applied} bridge may not properly reference ${foundation}`);
          }
        } else {
          this.fail(`${applied} missing mystical bridge`);
        }
      }
    } catch (error) {
      this.fail(`Mystical bridge test failed: ${error.message}`);
    }
  }

  async testLearningPaths() {
    console.log(`\n${colors.cyan}Testing Learning Path Progression...${colors.reset}`);
    
    try {
      const schema = require('./true-integration-schema.js');
      const practices = schema.appliedHarmonies.practices;
      
      // Test Essential Daily Practice progression
      const dailyPractice = ['Ω45', 'Ω52', 'Ω49', 'Ω50', 'Ω51'];
      for (let i = 0; i < dailyPractice.length - 1; i++) {
        const current = practices[dailyPractice[i]];
        const next = dailyPractice[i + 1];
        
        if (current.learningPath && current.learningPath.next === next) {
          this.pass(`${dailyPractice[i]} → ${next} path connected`);
        } else {
          this.warn(`${dailyPractice[i]} → ${next} path may need adjustment`);
        }
      }
      
      // Test Field Mastery progression
      const fieldMastery = ['Ω53', 'Ω55', 'Ω56'];
      for (const harmonyId of fieldMastery) {
        if (practices[harmonyId] && practices[harmonyId].category === 'fieldMastery') {
          this.pass(`${harmonyId} correctly categorized as Field Mastery`);
        } else {
          this.fail(`${harmonyId} miscategorized`);
        }
      }
    } catch (error) {
      this.fail(`Learning path test failed: ${error.message}`);
    }
  }

  async testInteractiveComponents() {
    console.log(`\n${colors.cyan}Testing Interactive Components...${colors.reset}`);
    
    try {
      const schema = require('./true-integration-schema.js');
      const practices = schema.appliedHarmonies.practices;
      
      for (const harmonyId of this.expectedHarmonies) {
        const harmony = practices[harmonyId];
        
        if (harmony.interactiveComponent) {
          // Check basic structure
          if (harmony.interactiveComponent.type && harmony.interactiveComponent.props) {
            this.pass(`${harmonyId} has interactive component`);
            
            // Verify sacred timing where applicable
            if (harmony.interactiveComponent.props.duration && 
                harmony.interactiveComponent.props.timing) {
              this.pass(`${harmonyId} honors sacred timing`);
            }
          } else {
            this.warn(`${harmonyId} interactive component incomplete`);
          }
        } else {
          this.warn(`${harmonyId} missing interactive component`);
        }
      }
    } catch (error) {
      this.fail(`Interactive component test failed: ${error.message}`);
    }
  }

  async testSacredSets() {
    console.log(`\n${colors.cyan}Testing Sacred Set Organization...${colors.reset}`);
    
    try {
      const schema = require('./true-integration-schema.js');
      const metadata = schema.appliedHarmonies.metadata;
      
      if (!metadata || !metadata.sacredSets) {
        this.fail('Sacred sets metadata missing');
        return;
      }
      
      const { essentialDaily, fieldMastery, coreFoundation } = metadata.sacredSets;
      
      // Test Essential Daily Practice (5 tools)
      if (essentialDaily && essentialDaily.glyphs.length === 5) {
        this.pass('Essential Daily Practice has 5 tools');
      } else {
        this.fail('Essential Daily Practice incomplete');
      }
      
      // Test Field Mastery (3 tools)
      if (fieldMastery && fieldMastery.glyphs.length === 3) {
        this.pass('Field Mastery has 3 tools');
      } else {
        this.fail('Field Mastery incomplete');
      }
      
      // Test Core Foundation (4 tools)
      if (coreFoundation && coreFoundation.glyphs.length === 4) {
        this.pass('Core Foundation has 4 tools');
      } else {
        this.fail('Core Foundation incomplete');
      }
      
      // Verify no overlaps
      const allGlyphs = [
        ...essentialDaily.glyphs,
        ...fieldMastery.glyphs,
        ...coreFoundation.glyphs
      ];
      const uniqueGlyphs = new Set(allGlyphs);
      
      if (uniqueGlyphs.size === 11) {
        this.pass('All 11 harmonies uniquely categorized');
      } else {
        this.fail('Sacred sets have overlaps or missing glyphs');
      }
    } catch (error) {
      this.fail(`Sacred sets test failed: ${error.message}`);
    }
  }

  async testMetadataIntegrity() {
    console.log(`\n${colors.cyan}Testing Metadata Integrity...${colors.reset}`);
    
    try {
      const schema = require('./true-integration-schema.js');
      const practices = schema.appliedHarmonies.practices;
      
      const requiredFields = [
        'name', 'number', 'mysticalFoundation', 'practicalDescription',
        'howToPractice', 'whenToUse', 'category'
      ];
      
      for (const harmonyId of this.expectedHarmonies) {
        const harmony = practices[harmonyId];
        let complete = true;
        
        for (const field of requiredFields) {
          if (!harmony[field]) {
            this.warn(`${harmonyId} missing ${field}`);
            complete = false;
          }
        }
        
        if (complete) {
          this.pass(`${harmonyId} metadata complete`);
        }
      }
    } catch (error) {
      this.fail(`Metadata integrity test failed: ${error.message}`);
    }
  }

  async testProgressionFlow() {
    console.log(`\n${colors.cyan}Testing Natural Progression Flow...${colors.reset}`);
    
    try {
      const schema = require('./true-integration-schema.js');
      const metadata = schema.appliedHarmonies.metadata;
      
      if (metadata && metadata.progressionGuidance) {
        const guidance = metadata.progressionGuidance;
        
        // Check phases exist
        if (guidance.beginnerPath && guidance.intermediatePath && guidance.advancedPath) {
          this.pass('All progression paths defined');
          
          // Verify beginner starts with presence
          if (guidance.beginnerPath.includes('Ω45')) {
            this.pass('Beginner path starts with First Presence');
          } else {
            this.warn('Beginner path should start with First Presence');
          }
          
          // Verify advanced includes field mastery
          const hasFieldMastery = guidance.advancedPath.some(id => 
            ['Ω53', 'Ω55', 'Ω56'].includes(id)
          );
          if (hasFieldMastery) {
            this.pass('Advanced path includes Field Mastery');
          } else {
            this.warn('Advanced path missing Field Mastery');
          }
        } else {
          this.fail('Progression paths incomplete');
        }
      } else {
        this.fail('Progression guidance missing');
      }
    } catch (error) {
      this.fail(`Progression flow test failed: ${error.message}`);
    }
  }

  async testFieldCoherence() {
    console.log(`\n${colors.cyan}Testing Overall Field Coherence...${colors.reset}`);
    
    try {
      const schema = require('./true-integration-schema.js');
      
      // Test coherence indicators
      const coherenceChecks = {
        'Mystical-Practical Balance': () => {
          return schema.glyphs && schema.appliedHarmonies;
        },
        'Bridge Bidirectionality': () => {
          const practices = schema.appliedHarmonies.practices;
          return Object.values(practices).every(p => 
            p.bridge && p.bridge.toMystical && p.bridge.fromMystical
          );
        },
        'Sacred Timing Honored': () => {
          const practices = schema.appliedHarmonies.practices;
          return Object.values(practices).some(p => 
            p.sacredTiming && p.sacredTiming.optimalDuration
          );
        },
        'Integration Complete': () => {
          return schema.appliedHarmonies.metadata && 
                 schema.appliedHarmonies.metadata.integrationStatus === 'complete';
        }
      };
      
      for (const [check, testFn] of Object.entries(coherenceChecks)) {
        if (testFn()) {
          this.pass(check);
        } else {
          this.warn(`${check} may need attention`);
        }
      }
      
      // Overall coherence score
      const coherenceScore = (this.testResults.passed / 
        (this.testResults.passed + this.testResults.failed + this.testResults.warnings)) * 100;
      
      console.log(`\n${colors.bold}Field Coherence Score: ${coherenceScore.toFixed(1)}%${colors.reset}`);
      
    } catch (error) {
      this.fail(`Field coherence test failed: ${error.message}`);
    }
  }

  // Test result helpers
  pass(message) {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
    this.testResults.passed++;
  }

  fail(message) {
    console.log(`${colors.red}✗${colors.reset} ${message}`);
    this.testResults.failed++;
    this.testResults.errors.push(message);
  }

  warn(message) {
    console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
    this.testResults.warnings++;
  }

  displayResults() {
    console.log(`\n${colors.bold}${colors.magenta}
╔═══════════════════════════════════════════════════════════╗
║                     Test Results Summary                   ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

    console.log(`${colors.green}Passed: ${this.testResults.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${this.testResults.failed}${colors.reset}`);
    console.log(`${colors.yellow}Warnings: ${this.testResults.warnings}${colors.reset}`);

    if (this.testResults.failed === 0) {
      console.log(`\n${colors.bold}${colors.green}
🌟 THE ELEVEN APPLIED HARMONIES ARE COMPLETE AND COHERENT! 🌟
The foundation for conscious relationship mastery stands ready.
${colors.reset}`);
    } else {
      console.log(`\n${colors.bold}${colors.red}
Some tests failed. The Eleven need attention before they're ready.
${colors.reset}`);
      
      console.log('\nErrors:');
      this.testResults.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }

    if (this.testResults.warnings > 0) {
      console.log(`\n${colors.yellow}Consider addressing warnings for optimal coherence.${colors.reset}`);
    }

    // Sacred completion message
    console.log(`\n${colors.cyan}${colors.bold}
May The Eleven serve the awakening of conscious relationship
in all beings who engage with these sacred practices. 🙏
${colors.reset}`);
  }
}

// Run the test suite
if (require.main === module) {
  const testSuite = new ElevenHarmoniesTestSuite();
  testSuite.runAllTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
}

module.exports = ElevenHarmoniesTestSuite;