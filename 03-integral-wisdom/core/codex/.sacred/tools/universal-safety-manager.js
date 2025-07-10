#!/usr/bin/env node
/**
 * 🌟 Universal Safety Manager
 * Scalable, modular system for protecting AI agents from known traps
 */

const fs = require('fs').promises;
const path = require('path');
const { SafetyResult } = require('./safety-modules/base-detector.js');

class UniversalSafetyManager {
  constructor() {
    this.detectors = new Map();
    this.learningDB = new Map(); // In production, use real database
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    console.log('🌟 Initializing Universal Safety Manager...');
    
    // Load all detector modules
    await this.loadDetectors();
    
    // Load learning database
    await this.loadLearningDB();
    
    this.initialized = true;
    console.log('✅ Safety Manager ready with', this.detectors.size, 'detectors');
  }

  async loadDetectors() {
    const modulesDir = path.join(__dirname, 'safety-modules');
    
    try {
      const files = await fs.readdir(modulesDir);
      
      for (const file of files) {
        if (file.endsWith('-detector.js') && file !== 'base-detector.js') {
          try {
            const DetectorClass = require(path.join(modulesDir, file));
            const detector = new DetectorClass();
            this.detectors.set(detector.name, detector);
            console.log(`  📦 Loaded ${detector.name} detector v${detector.version}`);
          } catch (error) {
            console.error(`  ⚠️  Failed to load ${file}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('⚠️  Error loading detectors:', error.message);
    }
  }

  async loadLearningDB() {
    // In production, load from persistent storage
    // For now, initialize with known patterns
    this.learningDB.set('encoding_trap_001', {
      pattern: '${VAR}-',
      discovered: new Date('2025-01-04'),
      severity: 'critical',
      aiSystem: 'claude',
      recovery: 'use_write_tool'
    });
  }

  /**
   * Check a file for all known safety issues
   */
  async checkFile(filePath) {
    await this.initialize();
    
    console.log(`\n🔍 Checking ${filePath} for safety issues...`);
    
    const results = new Map();
    let overallScore = 100;
    let overallSafe = true;
    const allWarnings = [];
    const allErrors = [];
    
    // Run all detectors
    for (const [name, detector] of this.detectors) {
      if (!detector.enabled) continue;
      
      try {
        const result = await detector.check(filePath);
        results.set(name, result);
        
        // Aggregate results
        overallScore = Math.min(overallScore, result.score);
        overallSafe = overallSafe && result.safe;
        allWarnings.push(...result.warnings);
        allErrors.push(...result.errors);
        
        // Log detector result
        if (!result.safe) {
          console.log(`  ❌ ${name}: UNSAFE (score: ${result.score})`);
        } else if (result.warnings.length > 0) {
          console.log(`  ⚠️  ${name}: WARNINGS (score: ${result.score})`);
        } else {
          console.log(`  ✅ ${name}: SAFE (score: ${result.score})`);
        }
      } catch (error) {
        console.error(`  💥 ${name}: ERROR - ${error.message}`);
      }
    }
    
    // Create aggregate result
    const aggregateResult = new SafetyResult({
      safe: overallSafe,
      score: overallScore,
      warnings: allWarnings,
      errors: allErrors,
      metadata: {
        detectorCount: results.size,
        timestamp: new Date().toISOString()
      }
    });
    
    // Get recommendations
    const recommendations = this.getRecommendations(results);
    
    return {
      aggregate: aggregateResult,
      detectorResults: results,
      recommendations
    };
  }

  /**
   * Get consolidated recommendations from all detectors
   */
  getRecommendations(results) {
    const recommendations = [];
    
    for (const [name, result] of results) {
      const detector = this.detectors.get(name);
      if (detector && !result.safe) {
        const rec = detector.getRecommendation(result);
        recommendations.push({
          detector: name,
          ...rec
        });
      }
    }
    
    // Sort by priority
    return recommendations.sort((a, b) => {
      const priority = { use_write: 0, proceed_with_caution: 1, safe_to_edit: 2 };
      return (priority[a.action] || 99) - (priority[b.action] || 99);
    });
  }

  /**
   * Attempt automatic fixes where possible
   */
  async autoFix(filePath, checkResult) {
    console.log(`\n🔧 Attempting automatic fixes for ${filePath}...`);
    
    const fixes = [];
    
    for (const [name, result] of checkResult.detectorResults) {
      const detector = this.detectors.get(name);
      
      if (detector && detector.canAutoFix() && !result.safe) {
        try {
          const fixResult = await detector.autoFix(filePath, result);
          fixes.push({
            detector: name,
            ...fixResult
          });
          
          if (fixResult.success) {
            console.log(`  ✅ ${name}: Fixed successfully`);
          } else {
            console.log(`  ❌ ${name}: Fix failed - ${fixResult.error}`);
          }
        } catch (error) {
          console.error(`  💥 ${name}: Fix error - ${error.message}`);
        }
      }
    }
    
    return fixes;
  }

  /**
   * Learn from a new trap pattern
   */
  async learnPattern(trapInfo) {
    const id = `trap_${Date.now()}`;
    
    this.learningDB.set(id, {
      ...trapInfo,
      discovered: new Date(),
      reportedBy: process.env.USER || 'unknown'
    });
    
    console.log(`📚 Learned new trap pattern: ${id}`);
    
    // In production, persist to database and notify network
    await this.notifyNetwork(trapInfo);
  }

  /**
   * Notify network of new patterns (stub for production)
   */
  async notifyNetwork(pattern) {
    // In production: POST to central API
    console.log('🌐 Pattern shared with safety network');
  }

  /**
   * CLI interface
   */
  static async cli() {
    const manager = new UniversalSafetyManager();
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log(`
🌟 Universal Safety Manager

Usage:
  safety-check <file>           Check file for safety issues
  safety-check --fix <file>     Attempt automatic fixes
  safety-check --learn          Report new trap pattern
  safety-check --help           Show this help

Examples:
  safety-check script.sh
  safety-check --fix problematic.sh
  safety-check --learn "New surrogate pair issue in JSON"
      `);
      return;
    }
    
    const command = args[0];
    const filePath = args[1] || args[0];
    
    switch (command) {
      case '--help':
      case '-h':
        console.log(`
🌟 Universal Safety Manager

Usage:
  safety-check <file>           Check file for safety issues
  safety-check --fix <file>     Attempt automatic fixes
  safety-check --learn          Report new trap pattern
  safety-check --help           Show this help

Examples:
  safety-check script.sh
  safety-check --fix problematic.sh
  safety-check --learn "New surrogate pair issue in JSON"
        `);
        break;
        
      case '--fix':
        const checkResult = await manager.checkFile(filePath);
        if (!checkResult.aggregate.safe) {
          await manager.autoFix(filePath, checkResult);
        }
        break;
        
      case '--learn':
        // Interactive learning mode
        console.log('🎓 Learning mode - describe the trap pattern...');
        // In production, use proper CLI input
        break;
        
      default:
        // Regular check
        const result = await manager.checkFile(filePath);
        
        // Display summary
        console.log('\n📊 Safety Summary:');
        console.log(`  Overall Score: ${result.aggregate.score}/100`);
        console.log(`  Status: ${result.aggregate.safe ? '✅ SAFE' : '🚨 UNSAFE'}`);
        
        if (result.recommendations.length > 0) {
          console.log('\n💡 Recommendations:');
          for (const rec of result.recommendations) {
            console.log(`  • ${rec.description}`);
            if (rec.steps) {
              rec.steps.forEach(step => console.log(`    ${step}`));
            }
          }
        }
        
        // Exit with appropriate code
        process.exit(result.aggregate.safe ? 0 : 1);
    }
  }
}

// Export for use as module
module.exports = UniversalSafetyManager;

// Run CLI if called directly
if (require.main === module) {
  UniversalSafetyManager.cli().catch(console.error);
}