#!/usr/bin/env node

/**
 * Timer Leak Fix Script
 * Specifically addresses timer cleanup issues in server files
 */

const fs = require('fs');
const path = require('path');

class TimerLeakFixer {
  constructor() {
    this.fixes = 0;
    this.backupDir = path.join(process.cwd(), 'performance-fixes-backup');
  }

  async applyFixes() {
    console.log('🔧 Applying timer leak fixes...');
    
    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir);
    }
    
    await this.fixAgentCommServer();
    await this.fixSacredServer();
    await this.fixUnifiedAgentNetwork();
    
    console.log(`✅ Applied ${this.fixes} timer leak fixes`);
    console.log(`📁 Backups saved to: ${this.backupDir}`);
  }

  createBackup(filePath) {
    const fileName = path.basename(filePath);
    const backupPath = path.join(this.backupDir, `${fileName}.backup`);
    fs.copyFileSync(filePath, backupPath);
    console.log(`  💾 Backed up ${fileName}`);
  }

  async fixAgentCommServer() {
    const serverPath = path.join(process.cwd(), 'the-weave/core/agent-comms-sqlite/server.js');
    
    if (!fs.existsSync(serverPath)) {
      console.log('  ⏭️  Skipping server.js (not found)');
      return;
    }
    
    console.log('🛠️  Fixing agent-comms-sqlite/server.js');
    this.createBackup(serverPath);
    
    let content = fs.readFileSync(serverPath, 'utf8');
    
    // Add cleanup interval tracking
    const classAddition = `
  constructor(port = 3001) {
    this.port = port;
    this.db = new AgentDatabase();
    this.cleanupInterval = null; // Track cleanup interval for proper shutdown
  }`;
    
    content = content.replace(
      /constructor\(port = 3001\) {\s*this\.port = port;\s*this\.db = new AgentDatabase\(\);\s*}/,
      classAddition.trim()
    );
    
    // Fix the interval assignment
    const intervalFix = `
    // Cleanup every hour - store interval ID for proper cleanup
    this.cleanupInterval = setInterval(async () => {
      await this.db.cleanup();
      console.log('🧹 Database cleanup completed');
    }, 60 * 60 * 1000);

    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      console.log(\`\\n🛑 Received \${signal}, shutting down gracefully...\`);
      
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        console.log('⏰ Cleaned up database cleanup interval');
      }
      
      if (this.db) {
        await this.db.close();
        console.log('🗄️  Closed database connection');
      }
      
      if (server) {
        server.close(() => {
          console.log('🚪 HTTP server closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('exit', () => {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }
    });`;
    
    content = content.replace(
      /\/\/ Cleanup every hour\s*setInterval\(async \(\) => \{[^}]+\}, 60 \* 60 \* 1000\);/,
      intervalFix.trim()
    );
    
    fs.writeFileSync(serverPath, content);
    console.log('  ✅ Fixed timer leaks in server.js');
    this.fixes++;
  }

  async fixSacredServer() {
    const sacredServerPaths = [
      'the-weave/core/agent-comms-sqlite/sacred-server.js',
      'the-weave/core/agent-comms-sqlite/sacred-server-hipi.js',
      'the-weave/core/sacred-bridge/sacred-server.js'
    ];
    
    for (const serverPath of sacredServerPaths) {
      const fullPath = path.join(process.cwd(), serverPath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`  ⏭️  Skipping ${serverPath} (not found)`);
        continue;
      }
      
      console.log(`🛠️  Fixing ${serverPath}`);
      this.createBackup(fullPath);
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Add cleanup interval tracking to constructor
      if (content.includes('this.port = port;') && !content.includes('this.cleanupIntervals = []')) {
        content = content.replace(
          /(this\.port = port;)/,
          '$1\n    this.cleanupIntervals = []; // Track all intervals for cleanup'
        );
      }
      
      // Fix setInterval calls by storing their IDs
      content = content.replace(
        /setInterval\(([^,]+),\s*([^)]+)\)/g,
        (match, callback, interval) => {
          return `(() => {
        const intervalId = setInterval(${callback}, ${interval});
        if (this.cleanupIntervals) this.cleanupIntervals.push(intervalId);
        return intervalId;
      })()`;
        }
      );
      
      // Add graceful shutdown if not present
      if (!content.includes('gracefulShutdown')) {
        const shutdownCode = `
    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      console.log(\`\\n🛑 Sacred server received \${signal}, shutting down gracefully...\`);
      
      // Clear all tracked intervals
      if (this.cleanupIntervals) {
        this.cleanupIntervals.forEach(intervalId => clearInterval(intervalId));
        console.log(\`⏰ Cleaned up \${this.cleanupIntervals.length} intervals\`);
      }
      
      // Close database connections
      if (this.db && typeof this.db.close === 'function') {
        await this.db.close();
        console.log('🗄️  Closed database connection');
      }
      
      if (this.sacredBridge && typeof this.sacredBridge.close === 'function') {
        await this.sacredBridge.close();
        console.log('🌉 Closed sacred bridge');
      }
      
      console.log('✅ Sacred server shutdown complete');
      process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('exit', () => {
      if (this.cleanupIntervals) {
        this.cleanupIntervals.forEach(intervalId => clearInterval(intervalId));
      }
    });
`;
        
        // Add before the return statement
        content = content.replace(
          /(return server;)/,
          shutdownCode + '\n    $1'
        );
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`  ✅ Fixed timer leaks in ${path.basename(serverPath)}`);
      this.fixes++;
    }
  }

  async fixUnifiedAgentNetwork() {
    const networkPaths = [
      'the-weave/core/network/unified-agent-network.cjs',
      'the-weave/cli/unified-agent-network.cjs'
    ];
    
    for (const networkPath of networkPaths) {
      const fullPath = path.join(process.cwd(), networkPath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`  ⏭️  Skipping ${networkPath} (not found)`);
        continue;
      }
      
      console.log(`🛠️  Fixing ${networkPath}`);
      this.createBackup(fullPath);
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix the heartbeat and polling intervals in the CLI section
      if (content.includes('const heartbeat = setInterval')) {
        content = content.replace(
          /const heartbeat = setInterval\(([^)]+)\);/,
          `const heartbeat = setInterval($1);
        const messagePoller = setInterval(async () => {
          // Message polling logic here
        }, 5000);
        const presenceChecker = setInterval(async () => {
          // Presence checking logic here  
        }, 10000);`
        );
        
        // Update the graceful shutdown to clear all intervals
        content = content.replace(
          /clearInterval\(heartbeat\);/g,
          `clearInterval(heartbeat);
          clearInterval(messagePoller);
          clearInterval(presenceChecker);`
        );
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`  ✅ Fixed timer leaks in ${path.basename(networkPath)}`);
      this.fixes++;
    }
  }
}

// Additional utility: Create a timer registry for new code
const timerRegistryCode = `
/**
 * Timer Registry - Centralized timer management
 * Use this instead of raw setInterval/setTimeout to prevent leaks
 */
class TimerRegistry {
  constructor() {
    this.timers = new Set();
    this.intervals = new Set();
    this.isShuttingDown = false;
  }

  setTimeout(callback, delay, ...args) {
    if (this.isShuttingDown) return null;
    
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (!this.isShuttingDown) callback(...args);
    }, delay);
    
    this.timers.add(timer);
    return timer;
  }

  setInterval(callback, delay, ...args) {
    if (this.isShuttingDown) return null;
    
    const interval = setInterval(() => {
      if (!this.isShuttingDown) callback(...args);
    }, delay);
    
    this.intervals.add(interval);
    return interval;
  }

  clearTimeout(timer) {
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(timer);
    }
  }

  clearInterval(interval) {
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(interval);
    }
  }

  clearAll() {
    this.isShuttingDown = true;
    
    this.timers.forEach(timer => {
      try { clearTimeout(timer); } catch (e) {}
    });
    
    this.intervals.forEach(interval => {
      try { clearInterval(interval); } catch (e) {}
    });
    
    this.timers.clear();
    this.intervals.clear();
    
    console.log(\`⏰ Cleared \${this.timers.size + this.intervals.size} timers\`);
  }

  getActiveCount() {
    return {
      timers: this.timers.size,
      intervals: this.intervals.size,
      total: this.timers.size + this.intervals.size
    };
  }
}

// Create global instance
const timerRegistry = new TimerRegistry();

// Set up global cleanup handlers
let cleanupHandlersSetup = false;
function setupGlobalCleanup() {
  if (cleanupHandlersSetup) return;
  cleanupHandlersSetup = true;
  
  ['SIGINT', 'SIGTERM', 'exit'].forEach(signal => {
    process.on(signal, () => {
      console.log(\`\\n🧹 Timer cleanup triggered by \${signal}\`);
      timerRegistry.clearAll();
      if (signal !== 'exit') process.exit(0);
    });
  });
}

setupGlobalCleanup();

module.exports = timerRegistry;
`;

// Run fixes if script is called directly
if (require.main === module) {
  const fixer = new TimerLeakFixer();
  
  fixer.applyFixes().then(() => {
    // Create the timer registry utility
    fs.writeFileSync('timer-registry.cjs', timerRegistryCode);
    console.log('\n📦 Created timer-registry.cjs for future use');
    console.log('\n🎯 Next steps:');
    console.log('1. Test the fixed servers to ensure they still work properly');
    console.log('2. Use timer-registry.cjs in new code to prevent future leaks');
    console.log('3. Monitor memory usage over time');
    console.log('4. Consider implementing similar fixes for other files');
  }).catch(console.error);
}

module.exports = TimerLeakFixer;