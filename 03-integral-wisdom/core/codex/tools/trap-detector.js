#!/usr/bin/env node
/**
 * 🛡️ Automated Trap Detection Tool
 * Scans files before updates to prevent JSON encoding errors
 */

const fs = require('fs');
const path = require('path');

class TrapDetector {
  constructor() {
    this.traps = {
      longLines: { threshold: 1000, severity: 'high' },
      complexExpansions: { pattern: /\$\{[^}]+\}-/, severity: 'high' },
      specialUnicode: { pattern: /[\uD800-\uDFFF]/, severity: 'critical' },
      unpairedSurrogates: { pattern: /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/, severity: 'critical' },
      nestedQuotes: { pattern: /["'].*\$\{.*["'].*\}.*["']/, severity: 'medium' },
      escapeSequences: { pattern: /\\[^\\nrt"'0]/, severity: 'medium' }
    };
  }

  async scanFile(filePath) {
    console.log(`\n🔍 Scanning: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      return { safe: false, error: 'File not found' };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];

    // Check line lengths
    lines.forEach((line, index) => {
      if (line.length > this.traps.longLines.threshold) {
        issues.push({
          type: 'longLine',
          line: index + 1,
          length: line.length,
          severity: this.traps.longLines.severity,
          message: `Line ${index + 1} is ${line.length} characters (limit: ${this.traps.longLines.threshold})`
        });
      }
    });

    // Check for dangerous patterns
    for (const [trapName, trap] of Object.entries(this.traps)) {
      if (trap.pattern) {
        const matches = content.match(new RegExp(trap.pattern, 'g'));
        if (matches) {
          // Find line numbers for matches
          matches.forEach(match => {
            const lineNum = content.substring(0, content.indexOf(match)).split('\n').length;
            issues.push({
              type: trapName,
              line: lineNum,
              match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
              severity: trap.severity,
              message: `Found ${trapName} pattern`
            });
          });
        }
      }
    }

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return {
      safe: !issues.some(i => i.severity === 'critical' || i.severity === 'high'),
      issues,
      stats: {
        totalLines: lines.length,
        maxLineLength: Math.max(...lines.map(l => l.length)),
        fileSize: content.length
      }
    };
  }

  async scanDirectory(dirPath, extensions = ['.sh', '.js', '.py']) {
    console.log(`📁 Scanning directory: ${dirPath}`);
    console.log(`📋 File types: ${extensions.join(', ')}\n`);

    const results = [];
    
    function walkDir(dir) {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          walkDir(filePath);
        } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
          results.push(filePath);
        }
      }
    }
    
    walkDir(dirPath);
    
    const scanResults = [];
    for (const file of results) {
      const result = await this.scanFile(file);
      scanResults.push({ file, ...result });
    }
    
    return scanResults;
  }

  generateReport(results) {
    console.log('\n📊 Trap Detection Report');
    console.log('========================\n');

    const dangerous = results.filter(r => !r.safe);
    const safe = results.filter(r => r.safe);

    if (dangerous.length > 0) {
      console.log(`⚠️  Found ${dangerous.length} files with potential traps:\n`);
      
      dangerous.forEach(result => {
        console.log(`❌ ${result.file}`);
        result.issues.forEach(issue => {
          const icon = issue.severity === 'critical' ? '🚨' : 
                       issue.severity === 'high' ? '⚠️' : '⚡';
          console.log(`   ${icon} Line ${issue.line}: ${issue.message}`);
          if (issue.match) {
            console.log(`      Match: "${issue.match}"`);
          }
        });
        console.log('');
      });
    }

    console.log(`✅ ${safe.length} files are safe to update`);
    console.log(`❌ ${dangerous.length} files have potential traps`);
    
    return {
      totalScanned: results.length,
      safe: safe.length,
      dangerous: dangerous.length,
      criticalIssues: results.reduce((sum, r) => 
        sum + r.issues.filter(i => i.severity === 'critical').length, 0)
    };
  }

  // Pre-flight check for Update tool
  async preFlightCheck(filePath) {
    console.log('🚀 Pre-flight Check for Update Tool\n');
    
    const result = await this.scanFile(filePath);
    
    if (result.safe) {
      console.log('✅ File is SAFE to update with the Update tool');
      console.log(`   Max line length: ${result.stats.maxLineLength}`);
      console.log(`   Total lines: ${result.stats.totalLines}`);
    } else {
      console.log('❌ File is DANGEROUS - Use Write tool instead!');
      console.log('\n⚠️  Issues found:');
      result.issues.forEach(issue => {
        console.log(`   - ${issue.message}`);
      });
      console.log('\n💡 Recommendation: Use Write tool to create a new version');
    }
    
    return result.safe;
  }
}

// CLI interface
if (require.main === module) {
  const detector = new TrapDetector();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🛡️ Trap Detector - Prevent JSON encoding errors\n');
    console.log('Usage:');
    console.log('  node trap-detector.js <file>       - Scan single file');
    console.log('  node trap-detector.js --dir <path> - Scan directory');
    console.log('  node trap-detector.js --check <file> - Pre-flight check');
    console.log('\nExamples:');
    console.log('  node trap-detector.js enable-autoscaling.sh');
    console.log('  node trap-detector.js --dir ./scripts');
    console.log('  node trap-detector.js --check complex-script.sh');
    process.exit(0);
  }
  
  (async () => {
    if (args[0] === '--dir' && args[1]) {
      const results = await detector.scanDirectory(args[1]);
      detector.generateReport(results);
    } else if (args[0] === '--check' && args[1]) {
      const safe = await detector.preFlightCheck(args[1]);
      process.exit(safe ? 0 : 1);
    } else {
      const result = await detector.scanFile(args[0]);
      if (!result.safe) {
        console.log('\n⚠️  This file has potential traps!');
        result.issues.forEach(issue => {
          console.log(`   Line ${issue.line}: ${issue.message}`);
        });
      } else {
        console.log('✅ File is safe to update');
      }
    }
  })().catch(console.error);
}

module.exports = TrapDetector;