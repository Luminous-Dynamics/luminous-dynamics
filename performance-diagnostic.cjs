#!/usr/bin/env node

/**
 * Claude Code Terminal Performance Diagnostic Script
 * Analyzes potential causes of performance degradation in long-running terminals
 */

const fs = require('fs');
const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const sqlite3 = require('sqlite3').verbose();

class PerformanceDiagnostic {
  constructor() {
    this.issues = [];
    this.metrics = {
      memoryLeaks: [],
      dbConnections: [],
      eventListeners: [],
      timers: [],
      fileHandles: [],
      messageHistory: []
    };
    
    this.performanceObserver = null;
    this.memoryBaseline = process.memoryUsage();
    this.startTime = Date.now();
  }

  async runDiagnostic() {
    console.log('🔍 Starting Claude Code Performance Diagnostic...\n');
    
    await this.checkMemoryUsage();
    await this.checkDatabaseConnections();
    await this.checkEventListeners();
    await this.checkTimersAndIntervals();
    await this.checkFileHandles();
    await this.checkMessageHistoryAccumulation();
    await this.checkFieldCoherenceCalculations();
    await this.checkWebSocketConnections();
    await this.generateReport();
    await this.generateFixScript();
    
    console.log('\n✅ Diagnostic complete. Check performance-report.md and performance-fixes.cjs');
  }

  async checkMemoryUsage() {
    console.log('📊 Checking Memory Usage...');
    
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const externalMB = Math.round(memUsage.external / 1024 / 1024);
    
    console.log(`  Heap Used: ${heapUsedMB}MB`);
    console.log(`  Heap Total: ${heapTotalMB}MB`);
    console.log(`  External: ${externalMB}MB`);
    
    // Check for potential memory leaks
    if (heapUsedMB > 200) {
      this.issues.push({
        type: 'memory',
        severity: 'high',
        description: `High memory usage: ${heapUsedMB}MB heap used`,
        fixes: [
          'Clear message history periodically',
          'Implement proper object cleanup',
          'Check for circular references in agent data'
        ]
      });
    }
    
    if (externalMB > 100) {
      this.issues.push({
        type: 'memory',
        severity: 'medium',
        description: `High external memory: ${externalMB}MB`,
        fixes: [
          'Check SQLite memory usage',
          'Clear large buffer objects',
          'Optimize consciousness field calculations'
        ]
      });
    }
    
    this.metrics.memory = {
      heapUsed: heapUsedMB,
      heapTotal: heapTotalMB,
      external: externalMB,
      baseline: this.memoryBaseline
    };
  }

  async checkDatabaseConnections() {
    console.log('🗄️  Checking Database Connections...');
    
    const dbFiles = [
      'the-weave/core/agent-comms-sqlite/agents.db',
      'the-weave/core/network/unified-agent-network.db',
      'the-weave/core/network/consciousness-trust-field.db',
      'agent-comms-sqlite/agents.db'
    ];
    
    let activeConnections = 0;
    const connectionIssues = [];
    
    for (const dbPath of dbFiles) {
      const fullPath = path.join(process.cwd(), dbPath);
      if (fs.existsSync(fullPath)) {
        try {
          // Check if database is locked or has active connections
          const stats = fs.statSync(fullPath);
          const sizeMB = Math.round(stats.size / 1024 / 1024);
          
          console.log(`  ${dbPath}: ${sizeMB}MB`);
          
          if (sizeMB > 50) {
            connectionIssues.push({
              file: dbPath,
              size: sizeMB,
              issue: 'Large database size may impact performance'
            });
          }
          
          activeConnections++;
        } catch (error) {
          connectionIssues.push({
            file: dbPath,
            issue: `Database access error: ${error.message}`
          });
        }
      }
    }
    
    if (activeConnections > 3) {
      this.issues.push({
        type: 'database',
        severity: 'medium',
        description: `Multiple database connections active: ${activeConnections}`,
        fixes: [
          'Implement connection pooling',
          'Close unused database connections',
          'Use single shared connection where possible'
        ]
      });
    }
    
    this.metrics.dbConnections = {
      active: activeConnections,
      issues: connectionIssues
    };
  }

  async checkEventListeners() {
    console.log('🎧 Checking Event Listeners...');
    
    const processListeners = process.listenerCount('exit') + 
                           process.listenerCount('SIGINT') + 
                           process.listenerCount('SIGTERM') +
                           process.listenerCount('uncaughtException');
    
    console.log(`  Process listeners: ${processListeners}`);
    
    if (processListeners > 10) {
      this.issues.push({
        type: 'eventListeners',
        severity: 'medium',
        description: `High number of process event listeners: ${processListeners}`,
        fixes: [
          'Remove duplicate process listeners',
          'Use once() instead of on() for single-use listeners',
          'Implement proper cleanup on agent disconnect'
        ]
      });
    }
    
    this.metrics.eventListeners = {
      process: processListeners
    };
  }

  async checkTimersAndIntervals() {
    console.log('⏰ Checking Timers and Intervals...');
    
    // Check common timer patterns in the codebase
    const timerFiles = await this.findFilesWithTimers();
    const potentialTimerLeaks = [];
    
    for (const file of timerFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for setInterval without clearInterval
      const intervals = (content.match(/setInterval/g) || []).length;
      const clearIntervals = (content.match(/clearInterval/g) || []).length;
      
      // Check for setTimeout without clearTimeout
      const timeouts = (content.match(/setTimeout/g) || []).length;
      const clearTimeouts = (content.match(/clearTimeout/g) || []).length;
      
      if (intervals > clearIntervals) {
        potentialTimerLeaks.push({
          file: path.relative(process.cwd(), file),
          issue: `${intervals} setInterval vs ${clearIntervals} clearInterval`,
          risk: 'high'
        });
      }
      
      if (timeouts > clearTimeouts * 2) { // Timeouts often don't need clearing
        potentialTimerLeaks.push({
          file: path.relative(process.cwd(), file),
          issue: `${timeouts} setTimeout vs ${clearTimeouts} clearTimeout`,
          risk: 'medium'
        });
      }
    }
    
    console.log(`  Files with timers: ${timerFiles.length}`);
    console.log(`  Potential timer leaks: ${potentialTimerLeaks.length}`);
    
    if (potentialTimerLeaks.length > 0) {
      this.issues.push({
        type: 'timers',
        severity: 'high',
        description: `Potential timer leaks in ${potentialTimerLeaks.length} files`,
        fixes: [
          'Implement timer cleanup in process exit handlers',
          'Store timer IDs and clear them on shutdown',
          'Use AbortController for cancellable operations'
        ],
        details: potentialTimerLeaks
      });
    }
    
    this.metrics.timers = {
      filesWithTimers: timerFiles.length,
      potentialLeaks: potentialTimerLeaks
    };
  }

  async checkFileHandles() {
    console.log('📁 Checking File Handles...');
    
    try {
      // Check open file descriptors (Unix-like systems)
      const { execSync } = require('child_process');
      let openFiles = 0;
      
      try {
        const lsofOutput = execSync(`lsof -p ${process.pid}`, { encoding: 'utf8' });
        openFiles = lsofOutput.split('\n').length - 1;
      } catch (e) {
        // lsof may not be available, use alternative
        console.log('  Cannot check file handles (lsof not available)');
      }
      
      if (openFiles > 100) {
        this.issues.push({
          type: 'fileHandles',
          severity: 'medium',
          description: `High number of open file handles: ${openFiles}`,
          fixes: [
            'Close database connections properly',
            'Close file streams after use',
            'Check for file descriptor leaks in SQLite operations'
          ]
        });
      }
      
      this.metrics.fileHandles = { open: openFiles };
      console.log(`  Open file handles: ${openFiles}`);
      
    } catch (error) {
      console.log('  File handle check failed:', error.message);
    }
  }

  async checkMessageHistoryAccumulation() {
    console.log('💬 Checking Message History Accumulation...');
    
    const dbPaths = [
      'the-weave/core/agent-comms-sqlite/agents.db',
      'the-weave/core/network/unified-agent-network.db'
    ];
    
    let totalMessages = 0;
    const messageStats = [];
    
    for (const dbPath of dbPaths) {
      const fullPath = path.join(process.cwd(), dbPath);
      if (fs.existsSync(fullPath)) {
        try {
          const db = new sqlite3.Database(fullPath);
          
          await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM messages', (err, row) => {
              if (err) {
                if (err.message.includes('no such table')) {
                  resolve(); // Table doesn't exist, that's fine
                  return;
                }
                reject(err);
                return;
              }
              
              const count = row ? row.count : 0;
              totalMessages += count;
              messageStats.push({
                database: dbPath,
                messages: count
              });
              
              console.log(`  ${dbPath}: ${count} messages`);
              resolve();
            });
          });
          
          // Check for alternative message table names
          await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM unified_messages', (err, row) => {
              if (err) {
                if (err.message.includes('no such table')) {
                  resolve(); // Table doesn't exist, that's fine
                  return;
                }
                reject(err);
                return;
              }
              
              const count = row ? row.count : 0;
              totalMessages += count;
              messageStats.push({
                database: `${dbPath} (unified_messages)`,
                messages: count
              });
              
              console.log(`  ${dbPath} (unified_messages): ${count} messages`);
              resolve();
            });
          });
          
          db.close();
          
        } catch (error) {
          console.log(`  Error checking ${dbPath}:`, error.message);
        }
      }
    }
    
    console.log(`  Total messages across all databases: ${totalMessages}`);
    
    if (totalMessages > 5000) {
      this.issues.push({
        type: 'messageHistory',
        severity: 'high',
        description: `Large message history accumulation: ${totalMessages} messages`,
        fixes: [
          'Implement automatic message cleanup',
          'Add message retention policies',
          'Archive old messages to separate tables',
          'Increase cleanup frequency in database.js'
        ]
      });
    }
    
    this.metrics.messageHistory = {
      total: totalMessages,
      byDatabase: messageStats
    };
  }

  async checkFieldCoherenceCalculations() {
    console.log('🌊 Checking Field Coherence Calculations...');
    
    // Look for field coherence calculation files
    const fieldFiles = await this.findFieldCoherenceFiles();
    const complexityIssues = [];
    
    for (const file of fieldFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for complex mathematical operations
      const mathOperations = (content.match(/Math\./g) || []).length;
      const loops = (content.match(/for\s*\(/g) || []).length +
                   (content.match(/while\s*\(/g) || []).length +
                   (content.match(/forEach/g) || []).length;
      
      if (mathOperations > 20 || loops > 10) {
        complexityIssues.push({
          file: path.relative(process.cwd(), file),
          mathOps: mathOperations,
          loops: loops,
          suggestion: 'Consider caching calculations or reducing frequency'
        });
      }
    }
    
    console.log(`  Field coherence files: ${fieldFiles.length}`);
    console.log(`  Complex calculation files: ${complexityIssues.length}`);
    
    if (complexityIssues.length > 0) {
      this.issues.push({
        type: 'fieldCalculations',
        severity: 'medium',
        description: `Complex field coherence calculations may impact performance`,
        fixes: [
          'Cache field coherence calculations',
          'Reduce calculation frequency',
          'Optimize mathematical operations',
          'Use worker threads for heavy calculations'
        ],
        details: complexityIssues
      });
    }
    
    this.metrics.fieldCalculations = {
      files: fieldFiles.length,
      complexFiles: complexityIssues
    };
  }

  async checkWebSocketConnections() {
    console.log('🔌 Checking WebSocket Connections...');
    
    const wsFiles = await this.findWebSocketFiles();
    const wsIssues = [];
    
    for (const file of wsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for WebSocket creation without proper cleanup
      const wsCreations = (content.match(/new WebSocket/g) || []).length +
                         (content.match(/WebSocket\(/g) || []).length;
      
      const wsCloses = (content.match(/\.close\(\)/g) || []).length;
      const wsEventRemovals = (content.match(/removeEventListener/g) || []).length;
      
      if (wsCreations > 0 && wsCloses === 0) {
        wsIssues.push({
          file: path.relative(process.cwd(), file),
          issue: 'WebSocket created without explicit close',
          risk: 'medium'
        });
      }
      
      if (wsCreations > wsEventRemovals) {
        wsIssues.push({
          file: path.relative(process.cwd(), file),
          issue: 'Potential WebSocket event listener leak',
          risk: 'medium'
        });
      }
    }
    
    console.log(`  Files with WebSocket usage: ${wsFiles.length}`);
    console.log(`  Potential WebSocket issues: ${wsIssues.length}`);
    
    if (wsIssues.length > 0) {
      this.issues.push({
        type: 'websockets',
        severity: 'medium',
        description: `Potential WebSocket connection leaks`,
        fixes: [
          'Implement proper WebSocket cleanup',
          'Remove event listeners on disconnect',
          'Add connection timeout handling',
          'Use AbortController for WebSocket operations'
        ],
        details: wsIssues
      });
    }
    
    this.metrics.websockets = {
      files: wsFiles.length,
      issues: wsIssues
    };
  }

  async findFilesWithTimers() {
    return this.findFilesByPattern(/setInterval|setTimeout/);
  }

  async findFieldCoherenceFiles() {
    return this.findFilesByPattern(/field.*coherence|coherence.*field|calculateField/i);
  }

  async findWebSocketFiles() {
    return this.findFilesByPattern(/WebSocket|websocket|ws\./);
  }

  async findFilesByPattern(pattern) {
    const files = [];
    
    const searchDirs = [
      'the-weave',
      'src/unified-field',
      'agent-comms-sqlite',
      'consciousness-field-api',
      'field-integration'
    ];
    
    for (const dir of searchDirs) {
      const fullDir = path.join(process.cwd(), dir);
      if (fs.existsSync(fullDir)) {
        this.searchDirectory(fullDir, pattern, files);
      }
    }
    
    return files;
  }

  searchDirectory(dir, pattern, results) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          this.searchDirectory(fullPath, pattern, results);
        } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.cjs'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (pattern.test(content)) {
              results.push(fullPath);
            }
          } catch (e) {
            // Skip files that can't be read
          }
        }
      }
    } catch (e) {
      // Skip directories that can't be read
    }
  }

  async generateReport() {
    const report = this.buildMarkdownReport();
    fs.writeFileSync('performance-report.md', report);
    console.log('\n📄 Performance report saved to performance-report.md');
  }

  buildMarkdownReport() {
    const highIssues = this.issues.filter(i => i.severity === 'high');
    const mediumIssues = this.issues.filter(i => i.severity === 'medium');
    
    return `# Claude Code Performance Diagnostic Report

Generated: ${new Date().toISOString()}
Runtime: ${((Date.now() - this.startTime) / 1000).toFixed(2)}s

## Summary

- **High Priority Issues**: ${highIssues.length}
- **Medium Priority Issues**: ${mediumIssues.length}
- **Memory Usage**: ${this.metrics.memory?.heapUsed || 'N/A'}MB heap
- **Database Connections**: ${this.metrics.dbConnections?.active || 0}
- **Total Messages**: ${this.metrics.messageHistory?.total || 0}

## High Priority Issues

${highIssues.map(issue => `### ${issue.type.toUpperCase()}: ${issue.description}

**Fixes:**
${issue.fixes.map(fix => `- ${fix}`).join('\n')}

${issue.details ? `**Details:**
\`\`\`json
${JSON.stringify(issue.details, null, 2)}
\`\`\`` : ''}
`).join('\n')}

## Medium Priority Issues

${mediumIssues.map(issue => `### ${issue.type.toUpperCase()}: ${issue.description}

**Fixes:**
${issue.fixes.map(fix => `- ${fix}`).join('\n')}

${issue.details ? `**Details:**
\`\`\`json
${JSON.stringify(issue.details, null, 2)}
\`\`\`` : ''}
`).join('\n')}

## Metrics Summary

\`\`\`json
${JSON.stringify(this.metrics, null, 2)}
\`\`\`

## Recommendations

1. **Memory Management**: Implement periodic garbage collection triggers
2. **Database Optimization**: Add automatic cleanup routines
3. **Timer Management**: Create central timer registry for cleanup
4. **Message History**: Implement rolling cleanup with configurable retention
5. **Field Calculations**: Cache expensive computations
6. **Connection Management**: Implement proper connection pooling

## Next Steps

1. Run \`node performance-fixes.cjs\` to apply automated fixes
2. Monitor memory usage over time
3. Implement the recommended optimizations
4. Schedule regular performance audits
`;
  }

  async generateFixScript() {
    const fixScript = `#!/usr/bin/env node

/**
 * Automated Performance Fixes for Claude Code
 * Generated by performance diagnostic
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class PerformanceFixes {
  constructor() {
    this.timersToClean = [];
    this.connectionsToClose = [];
    this.fixes = 0;
  }

  async applyFixes() {
    console.log('🔧 Applying automated performance fixes...');
    
    await this.cleanupDatabases();
    await this.optimizeDatabaseSettings();
    await this.createTimerRegistry();
    await this.setupGracefulShutdown();
    await this.addMemoryMonitoring();
    
    console.log(\`✅ Applied \${this.fixes} performance fixes\`);
  }

  async cleanupDatabases() {
    console.log('🗄️  Cleaning up databases...');
    
    const dbPaths = [
      'the-weave/core/agent-comms-sqlite/agents.db',
      'the-weave/core/network/unified-agent-network.db'
    ];
    
    for (const dbPath of dbPaths) {
      const fullPath = path.join(process.cwd(), dbPath);
      if (fs.existsSync(fullPath)) {
        await this.cleanupDatabase(fullPath);
      }
    }
    
    this.fixes++;
  }

  async cleanupDatabase(dbPath) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);
      
      // Clean old messages (keep last 1000)
      db.run(\`DELETE FROM messages WHERE id NOT IN (
        SELECT id FROM messages ORDER BY created_at DESC LIMIT 1000
      )\`, (err) => {
        if (err && !err.message.includes('no such table')) {
          console.log(\`Warning: Could not clean messages in \${dbPath}: \${err.message}\`);
        }
      });
      
      // Clean old unified_messages 
      db.run(\`DELETE FROM unified_messages WHERE id NOT IN (
        SELECT id FROM unified_messages ORDER BY created_at DESC LIMIT 1000
      )\`, (err) => {
        if (err && !err.message.includes('no such table')) {
          console.log(\`Warning: Could not clean unified_messages in \${dbPath}: \${err.message}\`);
        }
      });
      
      // Vacuum to reclaim space
      db.run('VACUUM', (err) => {
        if (err) {
          console.log(\`Warning: Could not vacuum \${dbPath}: \${err.message}\`);
        }
        db.close(resolve);
      });
    });
  }

  async optimizeDatabaseSettings() {
    console.log('⚡ Optimizing database settings...');
    
    // Create database optimization patch
    const optimizationPatch = \`
// Add this to your database initialization
db.run('PRAGMA journal_mode = WAL');
db.run('PRAGMA synchronous = NORMAL');
db.run('PRAGMA cache_size = 10000');
db.run('PRAGMA temp_store = MEMORY');
\`;
    
    fs.writeFileSync('database-optimization.js', optimizationPatch);
    console.log('  Created database-optimization.js');
    this.fixes++;
  }

  async createTimerRegistry() {
    console.log('⏰ Creating timer registry...');
    
    const timerRegistry = \`
class TimerRegistry {
  constructor() {
    this.timers = new Set();
    this.intervals = new Set();
  }

  setTimeout(callback, delay, ...args) {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      callback(...args);
    }, delay);
    this.timers.add(timer);
    return timer;
  }

  setInterval(callback, delay, ...args) {
    const interval = setInterval(callback, delay, ...args);
    this.intervals.add(interval);
    return interval;
  }

  clearTimeout(timer) {
    clearTimeout(timer);
    this.timers.delete(timer);
  }

  clearInterval(interval) {
    clearInterval(interval);
    this.intervals.delete(interval);
  }

  clearAll() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.intervals.forEach(interval => clearInterval(interval));
    this.timers.clear();
    this.intervals.clear();
  }
}

module.exports = new TimerRegistry();
\`;
    
    fs.writeFileSync('timer-registry.js', timerRegistry);
    console.log('  Created timer-registry.js');
    this.fixes++;
  }

  async setupGracefulShutdown() {
    console.log('🛑 Setting up graceful shutdown...');
    
    const shutdownScript = \`
const timerRegistry = require('./timer-registry');

class GracefulShutdown {
  constructor() {
    this.cleanupHandlers = [];
    this.setupHandlers();
  }

  addCleanupHandler(handler) {
    this.cleanupHandlers.push(handler);
  }

  setupHandlers() {
    ['SIGINT', 'SIGTERM', 'exit'].forEach(signal => {
      process.on(signal, async () => {
        console.log(\`\\n🛑 Graceful shutdown triggered by \${signal}\`);
        
        // Clear all timers
        timerRegistry.clearAll();
        
        // Run cleanup handlers
        for (const handler of this.cleanupHandlers) {
          try {
            await handler();
          } catch (error) {
            console.error('Cleanup handler failed:', error);
          }
        }
        
        console.log('✅ Graceful shutdown complete');
        process.exit(0);
      });
    });
  }
}

module.exports = new GracefulShutdown();
\`;
    
    fs.writeFileSync('graceful-shutdown.js', shutdownScript);
    console.log('  Created graceful-shutdown.js');
    this.fixes++;
  }

  async addMemoryMonitoring() {
    console.log('📊 Adding memory monitoring...');
    
    const memoryMonitor = \`
class MemoryMonitor {
  constructor(options = {}) {
    this.interval = options.interval || 30000; // 30 seconds
    this.threshold = options.threshold || 200; // 200MB
    this.monitoring = false;
  }

  start() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    console.log('📊 Memory monitoring started');
    
    this.monitorInterval = setInterval(() => {
      const usage = process.memoryUsage();
      const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
      
      if (heapUsedMB > this.threshold) {
        console.warn(\`⚠️  High memory usage: \${heapUsedMB}MB\`);
        
        if (global.gc) {
          global.gc();
          console.log('♻️  Garbage collection triggered');
        }
      }
    }, this.interval);
  }

  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitoring = false;
      console.log('📊 Memory monitoring stopped');
    }
  }
}

module.exports = MemoryMonitor;
\`;
    
    fs.writeFileSync('memory-monitor.js', memoryMonitor);
    console.log('  Created memory-monitor.js');
    this.fixes++;
  }
}

// Run fixes if script is called directly
if (require.main === module) {
  const fixes = new PerformanceFixes();
  fixes.applyFixes().catch(console.error);
}

module.exports = PerformanceFixes;
`;

    fs.writeFileSync('performance-fixes.cjs', fixScript);
    fs.chmodSync('performance-fixes.cjs', '755');
    console.log('🔧 Performance fixes script saved to performance-fixes.cjs');
  }
}

// Run diagnostic if script is called directly
if (require.main === module) {
  const diagnostic = new PerformanceDiagnostic();
  diagnostic.runDiagnostic().catch(console.error);
}

module.exports = PerformanceDiagnostic;