#!/usr/bin/env node

/**
 * Simple Performance Fixes for Claude Code
 * Basic fixes without template literals
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class SimplePerformanceFixes {
  constructor() {
    this.fixes = 0;
  }

  async applyFixes() {
    console.log('🔧 Applying simple performance fixes...');
    
    await this.cleanupDatabases();
    await this.createSimpleUtilities();
    
    console.log('✅ Applied ' + this.fixes + ' simple performance fixes');
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
      
      // Clean old messages (keep last 500)
      db.run('DELETE FROM messages WHERE id NOT IN (SELECT id FROM messages ORDER BY created_at DESC LIMIT 500)', (err) => {
        if (err && !err.message.includes('no such table')) {
          console.log('Warning: Could not clean messages in ' + dbPath + ': ' + err.message);
        }
      });
      
      // Clean old unified_messages 
      db.run('DELETE FROM unified_messages WHERE id NOT IN (SELECT id FROM unified_messages ORDER BY created_at DESC LIMIT 500)', (err) => {
        if (err && !err.message.includes('no such table')) {
          console.log('Warning: Could not clean unified_messages in ' + dbPath + ': ' + err.message);
        }
      });
      
      // Vacuum to reclaim space
      db.run('VACUUM', (err) => {
        if (err) {
          console.log('Warning: Could not vacuum ' + dbPath + ': ' + err.message);
        }
        db.close(resolve);
      });
    });
  }

  async createSimpleUtilities() {
    console.log('📦 Creating simple utilities...');
    
    // Simple memory monitor
    const memoryMonitor = `
// Simple Memory Monitor
setInterval(() => {
  const usage = process.memoryUsage();
  const heapMB = Math.round(usage.heapUsed / 1024 / 1024);
  if (heapMB > 100) {
    console.log('Memory usage: ' + heapMB + 'MB - Consider cleanup');
    if (global.gc) global.gc();
  }
}, 60000); // Check every minute
`;
    
    fs.writeFileSync('simple-memory-monitor.js', memoryMonitor);
    
    // Simple timer cleanup helper
    const timerHelper = `
// Simple Timer Cleanup Helper
const activeTimers = new Set();
const activeIntervals = new Set();

function safeSetTimeout(fn, delay) {
  const timer = setTimeout(() => {
    activeTimers.delete(timer);
    fn();
  }, delay);
  activeTimers.add(timer);
  return timer;
}

function safeSetInterval(fn, delay) {
  const interval = setInterval(fn, delay);
  activeIntervals.add(interval);
  return interval;
}

function clearAllTimers() {
  activeTimers.forEach(t => clearTimeout(t));
  activeIntervals.forEach(i => clearInterval(i));
  activeTimers.clear();
  activeIntervals.clear();
  console.log('All timers cleared');
}

// Auto-cleanup on exit
process.on('SIGINT', clearAllTimers);
process.on('SIGTERM', clearAllTimers);

module.exports = { safeSetTimeout, safeSetInterval, clearAllTimers };
`;
    
    fs.writeFileSync('simple-timer-helper.js', timerHelper);
    
    console.log('  Created simple-memory-monitor.js');
    console.log('  Created simple-timer-helper.js');
    this.fixes++;
  }
}

// Run fixes if script is called directly
if (require.main === module) {
  const fixes = new SimplePerformanceFixes();
  fixes.applyFixes().then(() => {
    console.log('');
    console.log('🎯 Simple fixes complete! Next steps:');
    console.log('1. Include simple-timer-helper.js in your server files');
    console.log('2. Use safeSetTimeout/safeSetInterval instead of raw timers');
    console.log('3. Run simple-memory-monitor.js to track memory usage');
    console.log('4. Monitor the system with: node performance-monitor.cjs');
  }).catch(console.error);
}

module.exports = SimplePerformanceFixes;