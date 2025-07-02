#!/usr/bin/env node

/**
 * Environment Explorer - Helps agents understand their environment
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class EnvironmentExplorer {
  async explore() {
    console.log('🔍 Exploring Environment...\n');
    
    const exploration = {
      timestamp: new Date().toISOString(),
      platform: await this.explorePlatform(),
      filesystem: await this.exploreFilesystem(),
      services: await this.exploreServices(),
      capabilities: await this.exploreCapabilities(),
      health: await this.assessHealth()
    };
    
    this.report(exploration);
    return exploration;
  }
  
  async explorePlatform() {
    const platform = {
      os: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
      freeMemory: `${Math.round(os.freemem() / 1024 / 1024 / 1024)}GB`,
      user: os.userInfo().username,
      hostname: os.hostname(),
      uptime: `${Math.round(os.uptime() / 3600)} hours`,
      shell: process.env.SHELL || 'unknown',
      node: process.version
    };
    
    // Detect WSL
    if (platform.os === 'linux') {
      try {
        const procVersion = fs.readFileSync('/proc/version', 'utf8');
        platform.isWSL = procVersion.toLowerCase().includes('microsoft');
      } catch (e) {
        platform.isWSL = false;
      }
    }
    
    // Detect Docker
    platform.isDocker = fs.existsSync('/.dockerenv');
    
    return platform;
  }
  
  async exploreFilesystem() {
    const filesystem = {
      cwd: process.cwd(),
      home: os.homedir(),
      projectRoot: this.findProjectRoot(),
      structure: {}
    };
    
    // Count files in main directories
    const dirs = ['src', 'web', 'data', 'docs', 'the-weave'];
    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        filesystem.structure[dir] = this.countFiles(dir);
      }
    }
    
    // Check key files
    filesystem.keyFiles = {
      'the-weave.cjs': fs.existsSync('the-weave.cjs'),
      'CLAUDE.md': fs.existsSync('CLAUDE.md'),
      'package.json': fs.existsSync('package.json'),
      '.git': fs.existsSync('.git')
    };
    
    // Disk space (simple check)
    try {
      const { stdout } = await execAsync('df -h . | tail -1');
      const parts = stdout.trim().split(/\s+/);
      filesystem.diskSpace = {
        total: parts[1],
        used: parts[2],
        available: parts[3],
        usePercent: parts[4]
      };
    } catch (e) {
      filesystem.diskSpace = 'unknown';
    }
    
    return filesystem;
  }
  
  async exploreServices() {
    const services = {};
    
    const checkPort = async (port) => {
      return new Promise((resolve) => {
        const net = require('net');
        const socket = new net.Socket();
        
        socket.setTimeout(500);
        socket.on('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        socket.on('error', () => {
          resolve(false);
        });
        
        socket.connect(port, 'localhost');
      });
    };
    
    // Check known services
    services.sacredServer = {
      port: 3001,
      running: await checkPort(3001),
      name: 'Sacred Server'
    };
    
    services.webInterface = {
      port: 8080,
      running: await checkPort(8080),
      name: 'Web Interface'
    };
    
    services.primaSubstrate = {
      port: 8082,
      running: await checkPort(8082),
      name: 'PRIMA Substrate'
    };
    
    return services;
  }
  
  async exploreCapabilities() {
    const capabilities = {
      commands: {},
      features: {}
    };
    
    // Check for commands
    const commands = ['git', 'node', 'npm', 'python3', 'docker', 'code', 'code.exe'];
    for (const cmd of commands) {
      capabilities.commands[cmd] = await this.commandExists(cmd);
    }
    
    // Check Node.js modules
    capabilities.features.hasNodeModules = fs.existsSync('node_modules');
    
    // Check write permissions
    try {
      const testFile = '.test-write-permission';
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      capabilities.features.canWrite = true;
    } catch (e) {
      capabilities.features.canWrite = false;
    }
    
    return capabilities;
  }
  
  async assessHealth() {
    const health = {
      issues: [],
      warnings: [],
      recommendations: []
    };
    
    // Check for common issues
    const checkLineEndings = () => {
      try {
        const content = fs.readFileSync('the-weave.cjs', 'utf8');
        if (content.includes('\r\n')) {
          health.issues.push('CRLF line endings detected');
          health.recommendations.push('Run: fix-lines or dos2unix');
        }
      } catch (e) {}
    };
    
    const checkPermissions = () => {
      try {
        fs.accessSync('the-weave.cjs', fs.constants.X_OK);
      } catch (e) {
        health.issues.push('the-weave.cjs is not executable');
        health.recommendations.push('Run: chmod +x the-weave.cjs');
      }
    };
    
    checkLineEndings();
    checkPermissions();
    
    // Calculate health score
    health.score = 100 - (health.issues.length * 10) - (health.warnings.length * 5);
    health.status = health.score >= 80 ? 'healthy' : health.score >= 60 ? 'fair' : 'needs attention';
    
    return health;
  }
  
  async commandExists(cmd) {
    try {
      await execAsync(`which ${cmd}`);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  findProjectRoot() {
    let dir = process.cwd();
    while (dir !== '/') {
      if (fs.existsSync(path.join(dir, 'the-weave.cjs'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    return process.cwd();
  }
  
  countFiles(dir) {
    try {
      const items = fs.readdirSync(dir);
      let count = 0;
      for (const item of items) {
        const stat = fs.statSync(path.join(dir, item));
        if (stat.isFile()) count++;
      }
      return count;
    } catch (e) {
      return 0;
    }
  }
  
  report(exploration) {
    console.log('📊 Environment Report');
    console.log('═══════════════════════════════════════════\n');
    
    // Platform
    console.log('🖥️  Platform:');
    console.log(`  OS: ${exploration.platform.os}${exploration.platform.isWSL ? ' (WSL)' : ''}`);
    console.log(`  Memory: ${exploration.platform.freeMemory} free / ${exploration.platform.memory} total`);
    console.log(`  Node: ${exploration.platform.node}`);
    console.log('');
    
    // Services
    console.log('🌐 Services:');
    for (const [key, service] of Object.entries(exploration.services)) {
      const status = service.running ? '🟢' : '🔴';
      console.log(`  ${status} ${service.name} (port ${service.port})`);
    }
    console.log('');
    
    // Capabilities
    console.log('🛠️  Capabilities:');
    const available = Object.entries(exploration.capabilities.commands)
      .filter(([cmd, exists]) => exists)
      .map(([cmd]) => cmd);
    console.log(`  Commands: ${available.join(', ') || 'none'}`);
    console.log(`  Can write: ${exploration.capabilities.features.canWrite ? '✅' : '❌'}`);
    console.log('');
    
    // Health
    console.log('💚 Health:');
    console.log(`  Status: ${exploration.health.status} (${exploration.health.score}/100)`);
    if (exploration.health.issues.length > 0) {
      console.log('  Issues:');
      exploration.health.issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
    }
    if (exploration.health.recommendations.length > 0) {
      console.log('  Recommendations:');
      exploration.health.recommendations.forEach(rec => {
        console.log(`    → ${rec}`);
      });
    }
    
    console.log('\n═══════════════════════════════════════════');
    console.log('✨ Exploration complete!');
  }
}

// Run if called directly
if (require.main === module) {
  const explorer = new EnvironmentExplorer();
  explorer.explore().catch(console.error);
}

module.exports = { EnvironmentExplorer };