#!/usr/bin/env node

/**
 * Performance Monitor for Claude Code
 * Continuously monitors system resources and detects degradation
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class PerformanceMonitor {
  constructor(options = {}) {
    this.interval = options.interval || 30000; // 30 seconds
    this.logFile = options.logFile || 'performance.log';
    this.alertThresholds = {
      memoryMB: options.memoryThreshold || 150,
      fileHandles: options.fileHandleThreshold || 80,
      messageCount: options.messageThreshold || 2000
    };
    
    this.monitoring = false;
    this.monitorInterval = null;
    this.metrics = {
      startTime: Date.now(),
      samples: [],
      alerts: []
    };
    
    this.setupGracefulShutdown();
  }

  start() {
    if (this.monitoring) {
      console.log('📊 Performance monitor already running');
      return;
    }
    
    console.log('🚀 Starting performance monitor...');
    console.log(`   Interval: ${this.interval / 1000}s`);
    console.log(`   Log file: ${this.logFile}`);
    console.log(`   Memory threshold: ${this.alertThresholds.memoryMB}MB`);
    
    this.monitoring = true;
    this.collectBaseline();
    
    this.monitorInterval = setInterval(() => {
      this.collectMetrics();
    }, this.interval);
    
    // Also log every 5 minutes
    this.logInterval = setInterval(() => {
      this.logMetrics();
    }, 5 * 60 * 1000);
    
    console.log('✅ Performance monitor started');
    console.log('Press Ctrl+C to stop monitoring\n');
  }

  stop() {
    if (!this.monitoring) return;
    
    console.log('\n🛑 Stopping performance monitor...');
    
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    
    if (this.logInterval) {
      clearInterval(this.logInterval);
      this.logInterval = null;
    }
    
    this.monitoring = false;
    this.generateReport();
    
    console.log('✅ Performance monitor stopped');
  }

  async collectBaseline() {
    console.log('📋 Collecting baseline metrics...');
    const baseline = await this.collectMetrics(true);
    this.metrics.baseline = baseline;
    console.log(`   Memory: ${baseline.memoryMB}MB`);
    console.log(`   File handles: ${baseline.fileHandles}`);
    console.log(`   Messages: ${baseline.totalMessages}`);
  }

  async collectMetrics(isBaseline = false) {
    const timestamp = Date.now();
    const memUsage = process.memoryUsage();
    
    const metrics = {
      timestamp,
      memoryMB: Math.round(memUsage.heapUsed / 1024 / 1024),
      memoryTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
      externalMB: Math.round(memUsage.external / 1024 / 1024),
      fileHandles: await this.getFileHandleCount(),
      totalMessages: await this.getMessageCount(),
      dbSizes: await this.getDatabaseSizes(),
      uptime: Math.round((timestamp - this.metrics.startTime) / 1000 / 60) // minutes
    };
    
    if (!isBaseline) {
      this.metrics.samples.push(metrics);
      this.checkThresholds(metrics);
      this.displayCurrentStatus(metrics);
    }
    
    return metrics;
  }

  async getFileHandleCount() {
    try {
      const { execSync } = require('child_process');
      const lsofOutput = execSync(`lsof -p ${process.pid} 2>/dev/null | wc -l`, { encoding: 'utf8' });
      return parseInt(lsofOutput.trim()) - 1; // Subtract header line
    } catch (e) {
      return 0; // lsof not available
    }
  }

  async getMessageCount() {
    const dbPaths = [
      'the-weave/core/agent-comms-sqlite/agents.db',
      'the-weave/core/network/unified-agent-network.db',
      'agent-comms-sqlite/agents.db'
    ];
    
    let totalMessages = 0;
    
    for (const dbPath of dbPaths) {
      const fullPath = path.join(process.cwd(), dbPath);
      if (fs.existsSync(fullPath)) {
        try {
          const sqlite3 = require('sqlite3').verbose();
          const db = new sqlite3.Database(fullPath);
          
          // Check both message table formats
          await new Promise((resolve) => {
            db.get('SELECT COUNT(*) as count FROM messages', (err, row) => {
              if (!err && row) totalMessages += row.count;
              resolve();
            });
          });
          
          await new Promise((resolve) => {
            db.get('SELECT COUNT(*) as count FROM unified_messages', (err, row) => {
              if (!err && row) totalMessages += row.count;
              resolve();
            });
          });
          
          db.close();
        } catch (e) {
          // Skip databases we can't read
        }
      }
    }
    
    return totalMessages;
  }

  async getDatabaseSizes() {
    const dbPaths = [
      'the-weave/core/agent-comms-sqlite/agents.db',
      'the-weave/core/network/unified-agent-network.db',
      'agent-comms-sqlite/agents.db'
    ];
    
    const sizes = {};
    
    for (const dbPath of dbPaths) {
      const fullPath = path.join(process.cwd(), dbPath);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        sizes[path.basename(dbPath)] = Math.round(stats.size / 1024 / 1024); // MB
      }
    }
    
    return sizes;
  }

  checkThresholds(metrics) {
    const alerts = [];
    
    if (metrics.memoryMB > this.alertThresholds.memoryMB) {
      alerts.push({
        type: 'memory',
        level: 'warning',
        message: `High memory usage: ${metrics.memoryMB}MB (threshold: ${this.alertThresholds.memoryMB}MB)`,
        value: metrics.memoryMB,
        threshold: this.alertThresholds.memoryMB
      });
    }
    
    if (metrics.fileHandles > this.alertThresholds.fileHandles) {
      alerts.push({
        type: 'fileHandles',
        level: 'warning',
        message: `High file handle count: ${metrics.fileHandles} (threshold: ${this.alertThresholds.fileHandles})`,
        value: metrics.fileHandles,
        threshold: this.alertThresholds.fileHandles
      });
    }
    
    if (metrics.totalMessages > this.alertThresholds.messageCount) {
      alerts.push({
        type: 'messages',
        level: 'warning',
        message: `High message count: ${metrics.totalMessages} (threshold: ${this.alertThresholds.messageCount})`,
        value: metrics.totalMessages,
        threshold: this.alertThresholds.messageCount
      });
    }
    
    // Check for rapid memory growth
    if (this.metrics.baseline && this.metrics.samples.length > 5) {
      const memoryGrowth = metrics.memoryMB - this.metrics.baseline.memoryMB;
      const timeElapsed = metrics.uptime; // minutes
      
      if (memoryGrowth > 50 && timeElapsed > 0) {
        const growthRate = memoryGrowth / timeElapsed; // MB per minute
        if (growthRate > 2) { // More than 2MB per minute
          alerts.push({
            type: 'memoryGrowth',
            level: 'critical',
            message: `Rapid memory growth detected: ${growthRate.toFixed(2)}MB/min`,
            value: growthRate,
            threshold: 2
          });
        }
      }
    }
    
    // Display and store alerts
    alerts.forEach(alert => {
      console.log(`\n⚠️  ${alert.level.toUpperCase()}: ${alert.message}`);
      this.metrics.alerts.push({
        ...alert,
        timestamp: metrics.timestamp
      });
    });
  }

  displayCurrentStatus(metrics) {
    // Clear the line and show current status
    process.stdout.write(`\r📊 Memory: ${metrics.memoryMB}MB | Files: ${metrics.fileHandles} | Messages: ${metrics.totalMessages} | Uptime: ${metrics.uptime}m`);
  }

  logMetrics() {
    if (this.metrics.samples.length === 0) return;
    
    const latest = this.metrics.samples[this.metrics.samples.length - 1];
    const logEntry = {
      timestamp: new Date(latest.timestamp).toISOString(),
      memory: latest.memoryMB,
      fileHandles: latest.fileHandles,
      messages: latest.totalMessages,
      dbSizes: latest.dbSizes,
      uptime: latest.uptime
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(this.logFile, logLine);
  }

  generateReport() {
    if (this.metrics.samples.length === 0) {
      console.log('\nNo metrics collected');
      return;
    }
    
    const samples = this.metrics.samples;
    const latest = samples[samples.length - 1];
    const baseline = this.metrics.baseline || samples[0];
    
    const report = `
Performance Monitor Report
=========================
Generated: ${new Date().toISOString()}
Duration: ${latest.uptime} minutes
Samples: ${samples.length}

Memory Usage:
- Baseline: ${baseline.memoryMB}MB
- Current: ${latest.memoryMB}MB
- Growth: ${latest.memoryMB - baseline.memoryMB}MB
- Peak: ${Math.max(...samples.map(s => s.memoryMB))}MB

File Handles:
- Baseline: ${baseline.fileHandles}
- Current: ${latest.fileHandles}
- Peak: ${Math.max(...samples.map(s => s.fileHandles))}

Messages:
- Baseline: ${baseline.totalMessages}
- Current: ${latest.totalMessages}
- Growth: ${latest.totalMessages - baseline.totalMessages}

Database Sizes:
${Object.entries(latest.dbSizes).map(([db, size]) => `- ${db}: ${size}MB`).join('\n')}

Alerts Generated: ${this.metrics.alerts.length}
${this.metrics.alerts.map(alert => `- ${alert.level}: ${alert.message}`).join('\n')}

Recommendations:
${this.generateRecommendations(baseline, latest)}
`;
    
    const reportFile = `performance-report-${Date.now()}.txt`;
    fs.writeFileSync(reportFile, report);
    
    console.log(`\n\n📄 Performance report saved to: ${reportFile}`);
    console.log(report);
  }

  generateRecommendations(baseline, latest) {
    const recommendations = [];
    
    const memoryGrowth = latest.memoryMB - baseline.memoryMB;
    if (memoryGrowth > 20) {
      recommendations.push('- Consider running database cleanup routines');
      recommendations.push('- Check for memory leaks in long-running processes');
    }
    
    if (latest.fileHandles > 50) {
      recommendations.push('- Monitor file handle usage, consider connection pooling');
    }
    
    const messageGrowth = latest.totalMessages - baseline.totalMessages;
    if (messageGrowth > 100) {
      recommendations.push('- Implement message history cleanup policies');
    }
    
    if (this.metrics.alerts.some(a => a.type === 'memoryGrowth')) {
      recommendations.push('- URGENT: Investigate rapid memory growth patterns');
      recommendations.push('- Consider restarting services with high memory usage');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- System performance appears stable');
    }
    
    return recommendations.join('\n');
  }

  setupGracefulShutdown() {
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        this.stop();
        process.exit(0);
      });
    });
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line options
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--interval':
        options.interval = parseInt(value) * 1000; // Convert to ms
        break;
      case '--memory-threshold':
        options.memoryThreshold = parseInt(value);
        break;
      case '--log-file':
        options.logFile = value;
        break;
      case '--help':
        console.log(`
Performance Monitor for Claude Code

Usage: node performance-monitor.cjs [options]

Options:
  --interval <seconds>       Monitoring interval (default: 30)
  --memory-threshold <MB>    Memory alert threshold (default: 150)
  --log-file <path>         Log file path (default: performance.log)
  --help                    Show this help

Examples:
  node performance-monitor.cjs
  node performance-monitor.cjs --interval 60 --memory-threshold 200
  node performance-monitor.cjs --log-file /tmp/perf.log
`);
        process.exit(0);
    }
  }
  
  const monitor = new PerformanceMonitor(options);
  monitor.start();
}

module.exports = PerformanceMonitor;