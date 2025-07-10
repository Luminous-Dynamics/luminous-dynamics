#!/usr/bin/env node

/**
 * 🌉 Claude-Discord Bridge
 * Allows Claude to monitor and suggest Discord bot actions
 */

const fs = require('fs');
const path = require('path');

class ClaudeBridge {
  constructor() {
    this.logFile = path.join(__dirname, 'logs', 'discord-activity.json');
    this.commandQueue = path.join(__dirname, 'logs', 'claude-commands.json');
    
    // Ensure logs directory exists
    if (!fs.existsSync(path.join(__dirname, 'logs'))) {
      fs.mkdirSync(path.join(__dirname, 'logs'));
    }
  }
  
  // Log Discord activity for Claude to read
  logActivity(type, data) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      data
    };
    
    // Read existing log
    let log = [];
    if (fs.existsSync(this.logFile)) {
      log = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
    }
    
    // Add new entry
    log.push(entry);
    
    // Keep last 100 entries
    if (log.length > 100) {
      log = log.slice(-100);
    }
    
    // Save
    fs.writeFileSync(this.logFile, JSON.stringify(log, null, 2));
  }
  
  // Get Claude's suggested commands
  getCommands() {
    if (!fs.existsSync(this.commandQueue)) {
      return [];
    }
    
    const commands = JSON.parse(fs.readFileSync(this.commandQueue, 'utf8'));
    
    // Clear after reading
    fs.writeFileSync(this.commandQueue, '[]');
    
    return commands;
  }
  
  // Create status report for Claude
  async createStatusReport() {
    const report = {
      timestamp: new Date().toISOString(),
      bot: {
        online: false, // Will be updated by bot
        guilds: 0,
        users: 0
      },
      recentActivity: [],
      activeCommands: [],
      errors: []
    };
    
    // Read recent activity
    if (fs.existsSync(this.logFile)) {
      const log = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      report.recentActivity = log.slice(-10); // Last 10 activities
    }
    
    // Save report
    const reportPath = path.join(__dirname, 'logs', 'status-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Status report created at:', reportPath);
    return report;
  }
  
  // Integration with Sacred Council
  integrateWithBot(council) {
    // Log all Discord events
    council.client.on('messageCreate', (message) => {
      if (!message.author.bot) {
        this.logActivity('message', {
          channel: message.channel.name,
          author: message.author.username,
          content: message.content.slice(0, 100),
          timestamp: message.createdTimestamp
        });
      }
    });
    
    // Log ceremonies
    council.on('ceremony-complete', (data) => {
      this.logActivity('ceremony', data);
    });
    
    // Log deliberations
    council.on('deliberation-complete', (data) => {
      this.logActivity('deliberation', data);
    });
    
    // Check for Claude commands periodically
    setInterval(() => {
      const commands = this.getCommands();
      commands.forEach(cmd => {
        console.log('📨 Executing Claude command:', cmd);
        // Execute command (safely)
        this.executeCommand(council, cmd);
      });
    }, 5000); // Every 5 seconds
  }
  
  executeCommand(council, command) {
    // Safe command execution
    switch (command.type) {
      case 'send_message':
        const channel = council.client.channels.cache.find(
          ch => ch.name === command.channel
        );
        if (channel) {
          channel.send(command.message);
        }
        break;
        
      case 'update_presence':
        council.updatePresence();
        break;
        
      case 'generate_report':
        this.createStatusReport();
        break;
        
      default:
        console.log('Unknown command type:', command.type);
    }
  }
}

module.exports = ClaudeBridge;

// CLI usage
if (require.main === module) {
  const bridge = new ClaudeBridge();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'status':
      bridge.createStatusReport();
      break;
      
    case 'send':
      // Add command for Claude to execute
      const cmd = {
        type: 'send_message',
        channel: process.argv[3],
        message: process.argv.slice(4).join(' ')
      };
      
      let commands = [];
      if (fs.existsSync(bridge.commandQueue)) {
        commands = JSON.parse(fs.readFileSync(bridge.commandQueue, 'utf8'));
      }
      commands.push(cmd);
      fs.writeFileSync(bridge.commandQueue, JSON.stringify(commands, null, 2));
      console.log('✅ Command queued for Discord bot');
      break;
      
    default:
      console.log(`
Claude-Discord Bridge

Usage:
  node claude-bridge.js status     - Generate status report
  node claude-bridge.js send <channel> <message> - Queue message
      `);
  }
}