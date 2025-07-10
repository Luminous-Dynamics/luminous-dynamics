/**
 * 🧠 Pattern Learning Database
 * Persistent storage for trap patterns and collective learning
 */

const fs = require('fs').promises;
const path = require('path');

class PatternLearningDB {
  constructor(dbPath) {
    this.dbPath = dbPath || path.join(__dirname, 'pattern-knowledge.json');
    this.patterns = new Map();
    this.statistics = {
      totalPatterns: 0,
      patternsLearned: 0,
      trapsAvoided: 0,
      lastUpdate: null
    };
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.dbPath, 'utf8');
      const stored = JSON.parse(data);
      
      // Restore patterns
      for (const [id, pattern] of Object.entries(stored.patterns || {})) {
        this.patterns.set(id, pattern);
      }
      
      // Restore statistics
      this.statistics = { ...this.statistics, ...stored.statistics };
      
      console.log(`📚 Loaded ${this.patterns.size} known patterns`);
    } catch (error) {
      // First run or corrupt file
      console.log('📚 Initializing new pattern database');
      await this.seedInitialPatterns();
      await this.save();
    }
  }

  async seedInitialPatterns() {
    // Seed with known patterns
    const initialPatterns = [
      {
        id: 'json_encoding_trap_001',
        type: 'encoding',
        pattern: '${VAR}-',
        regex: '/\\$\\{[^}]+\\}-/g',
        severity: 'critical',
        discovered: '2025-01-04',
        aiSystem: 'claude',
        description: 'Variable expansion with dash causes JSON surrogate pair error',
        recovery: {
          method: 'use_write_tool',
          steps: [
            'Create backup of file',
            'Use Write tool instead of Edit',
            'Rewrite without problematic patterns'
          ]
        },
        occurrences: 1,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'long_line_trap_001',
        type: 'length',
        pattern: 'lines > 1000 chars',
        regex: null,
        severity: 'high',
        discovered: '2025-01-04',
        aiSystem: 'claude',
        description: 'Very long lines can cause API errors',
        recovery: {
          method: 'break_lines',
          steps: [
            'Split long lines into multiple shorter lines',
            'Use line continuation characters',
            'Extract to variables'
          ]
        },
        occurrences: 1,
        lastSeen: new Date().toISOString()
      }
    ];

    for (const pattern of initialPatterns) {
      this.patterns.set(pattern.id, pattern);
    }

    this.statistics.totalPatterns = this.patterns.size;
  }

  async learnPattern(patternInfo) {
    const id = `trap_${patternInfo.type}_${Date.now()}`;
    
    const pattern = {
      id,
      ...patternInfo,
      discovered: new Date().toISOString(),
      occurrences: 1,
      lastSeen: new Date().toISOString(),
      learnedFrom: process.env.USER || 'unknown'
    };

    this.patterns.set(id, pattern);
    this.statistics.patternsLearned++;
    this.statistics.lastUpdate = new Date().toISOString();

    await this.save();
    
    console.log(`🧠 Learned new pattern: ${id}`);
    console.log(`   Type: ${pattern.type}`);
    console.log(`   Severity: ${pattern.severity}`);
    
    return id;
  }

  async recordTrapAvoided(patternId) {
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      pattern.occurrences++;
      pattern.lastSeen = new Date().toISOString();
      this.statistics.trapsAvoided++;
      await this.save();
    }
  }

  getPatternsByType(type) {
    return Array.from(this.patterns.values())
      .filter(p => p.type === type);
  }

  getPatternsBySeverity(severity) {
    return Array.from(this.patterns.values())
      .filter(p => p.severity === severity);
  }

  async evolvePattern(patternId, updates) {
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      // Track evolution history
      pattern.evolutionHistory = pattern.evolutionHistory || [];
      pattern.evolutionHistory.push({
        date: new Date().toISOString(),
        changes: updates,
        reason: updates.reason || 'Pattern evolved through experience'
      });

      // Apply updates
      Object.assign(pattern, updates);
      pattern.lastEvolved = new Date().toISOString();

      await this.save();
      console.log(`🔄 Pattern ${patternId} evolved`);
    }
  }

  async save() {
    const data = {
      version: '1.0.0',
      patterns: Object.fromEntries(this.patterns),
      statistics: this.statistics,
      lastSaved: new Date().toISOString()
    };

    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
  }

  async generateReport() {
    const report = {
      summary: {
        totalPatterns: this.patterns.size,
        criticalPatterns: this.getPatternsBySeverity('critical').length,
        trapsAvoided: this.statistics.trapsAvoided,
        lastUpdate: this.statistics.lastUpdate
      },
      topPatterns: Array.from(this.patterns.values())
        .sort((a, b) => b.occurrences - a.occurrences)
        .slice(0, 5),
      recentlyLearned: Array.from(this.patterns.values())
        .sort((a, b) => new Date(b.discovered) - new Date(a.discovered))
        .slice(0, 3),
      byType: {}
    };

    // Group by type
    for (const pattern of this.patterns.values()) {
      report.byType[pattern.type] = (report.byType[pattern.type] || 0) + 1;
    }

    return report;
  }

  async shareWithNetwork() {
    // In production, this would POST to a central API
    console.log('🌐 Sharing patterns with network...');
    
    const shareable = Array.from(this.patterns.values())
      .filter(p => p.severity === 'critical' || p.occurrences > 5)
      .map(p => ({
        type: p.type,
        pattern: p.pattern,
        severity: p.severity,
        recovery: p.recovery
      }));

    console.log(`   Sharing ${shareable.length} high-impact patterns`);
    
    // Simulate network share
    return {
      shared: shareable.length,
      timestamp: new Date().toISOString(),
      status: 'simulated'
    };
  }
}

// CLI interface
async function cli() {
  const db = new PatternLearningDB();
  await db.initialize();

  const command = process.argv[2];

  switch (command) {
    case 'report':
      const report = await db.generateReport();
      console.log('\n📊 Pattern Learning Report\n');
      console.log('Summary:', JSON.stringify(report.summary, null, 2));
      console.log('\nTop Patterns:');
      report.topPatterns.forEach(p => {
        console.log(`  - ${p.id}: ${p.occurrences} occurrences`);
      });
      break;

    case 'share':
      const result = await db.shareWithNetwork();
      console.log('Share result:', result);
      break;

    case 'learn':
      // Interactive learning (simplified)
      console.log('🎓 Learning mode - TODO: implement interactive input');
      break;

    default:
      console.log(`
Pattern Learning Database

Commands:
  report  - Show pattern statistics
  share   - Share patterns with network
  learn   - Learn new pattern (interactive)
      `);
  }
}

module.exports = PatternLearningDB;

if (require.main === module) {
  cli().catch(console.error);
}