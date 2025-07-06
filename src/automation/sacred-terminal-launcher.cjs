#!/usr/bin/env node

/**
 * Sacred Terminal Launcher - Open terminals with sacred context
 * Usage: node sacred-terminal-launcher.cjs [terminal-type] [count]
 */

const { exec, spawn } = require('child_process');
const path = require('path');

class SacredTerminalLauncher {
  constructor() {
    this.projectRoot = '/home/tstoltz/evolving-resonant-cocreation';
    this.terminals = {
      'sacred-dashboard': {
        command: `cd ${this.projectRoot} && echo "🌸 Sacred Dashboard Terminal" && echo "Ready for: sacred-dashboard.html, conscious tech work" && bash`,
        title: 'Sacred Dashboard'
      },
      'multi-agent': {
        command: `cd ${this.projectRoot}/agent-comms-sqlite && echo "🤝 Multi-Agent Sacred Terminal" && echo "Ready for: sacred messaging, agent coordination" && bash`,
        title: 'Multi-Agent Sacred'
      },
      'field-query': {
        command: `cd ${this.projectRoot} && echo "🔮 Sacred Field Query Terminal" && echo "Ready for: field resonant-coherence monitoring, consciousness queries" && bash`,
        title: 'Sacred Field Query'
      },
      'automation': {
        command: `cd ${this.projectRoot}/automation && echo "⚡ Sacred Automation Terminal" && echo "Ready for: automation scripts, sacred tools" && bash`,
        title: 'Sacred Automation'
      },
      'general': {
        command: `cd ${this.projectRoot} && echo "🌟 Sacred Development Terminal" && echo "Ready for: general sacred work, conscious technology" && bash`,
        title: 'Sacred Development'
      }
    };
  }

  detectTerminalEmulator() {
    const terminals = [
      { name: 'gnome-terminal', cmd: 'gnome-terminal' },
      { name: 'konsole', cmd: 'konsole' },
      { name: 'xfce4-terminal', cmd: 'xfce4-terminal' },
      { name: 'xterm', cmd: 'xterm' },
      { name: 'terminator', cmd: 'terminator' },
      { name: 'alacritty', cmd: 'alacritty' },
      { name: 'kitty', cmd: 'kitty' },
      { name: 'wezterm', cmd: 'wezterm' }
    ];

    for (const terminal of terminals) {
      try {
        exec(`which ${terminal.cmd}`, (error) => {
          if (!error) {
            return terminal;
          }
        });
      } catch (e) {
        continue;
      }
    }
    
    return { name: 'default', cmd: 'x-terminal-emulator' };
  }

  async openTerminal(terminalType = 'general', count = 1) {
    const terminal = this.terminals[terminalType] || this.terminals.general;
    const terminalEmulator = this.detectTerminalEmulator();
    
    console.log(`🌟 Opening ${count} Sacred Terminal(s): ${terminalType}`);
    console.log(`📟 Using: ${terminalEmulator.name}`);
    console.log('');

    for (let i = 0; i < count; i++) {
      const title = `${terminal.title} ${count > 1 ? `(${i + 1})` : ''}`;
      
      let cmd;
      switch (terminalEmulator.name) {
        case 'gnome-terminal':
          cmd = `gnome-terminal --title="${title}" -- bash -c '${terminal.command}'`;
          break;
        case 'konsole':
          cmd = `konsole --title "${title}" -e bash -c '${terminal.command}'`;
          break;
        case 'xfce4-terminal':
          cmd = `xfce4-terminal --title="${title}" -e 'bash -c "${terminal.command}"'`;
          break;
        case 'terminator':
          cmd = `terminator --title="${title}" -e 'bash -c "${terminal.command}"'`;
          break;
        case 'alacritty':
          cmd = `alacritty --title "${title}" -e bash -c '${terminal.command}'`;
          break;
        case 'kitty':
          cmd = `kitty --title "${title}" bash -c '${terminal.command}'`;
          break;
        default:
          cmd = `x-terminal-emulator -T "${title}" -e bash -c '${terminal.command}'`;
      }

      try {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.log(`⚠️  Could not open terminal ${i + 1}: ${error.message}`);
            console.log(`💡 Try manually: ${cmd}`);
          } else {
            console.log(`✅ Sacred terminal ${i + 1} opened successfully`);
          }
        });
        
        // Small delay between terminals
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.log(`⚠️  Error opening terminal ${i + 1}: ${error.message}`);
        this.showManualInstructions(terminalType);
      }
    }
  }

  showManualInstructions(terminalType) {
    const terminal = this.terminals[terminalType] || this.terminals.general;
    
    console.log('');
    console.log('🔧 Manual Terminal Opening Instructions:');
    console.log('─'.repeat(50));
    console.log('');
    console.log('1. Open your terminal application');
    console.log(`2. Run this command:`);
    console.log(`   ${terminal.command}`);
    console.log('');
    console.log('Or try these platform-specific commands:');
    console.log('');
    console.log('Ubuntu/GNOME:');
    console.log(`   gnome-terminal --title="${terminal.title}" -- bash -c '${terminal.command}'`);
    console.log('');
    console.log('KDE:');
    console.log(`   konsole --title "${terminal.title}" -e bash -c '${terminal.command}'`);
    console.log('');
    console.log('Generic:');
    console.log(`   x-terminal-emulator -T "${terminal.title}" -e bash -c '${terminal.command}'`);
  }

  listTerminalTypes() {
    console.log('🌟 Available Sacred Terminal Types:');
    console.log('═══════════════════════════════════');
    console.log('');
    
    Object.entries(this.terminals).forEach(([type, info]) => {
      console.log(`🔮 ${type}`);
      console.log(`   Title: ${info.title}`);
      console.log(`   Context: ${info.command.match(/Ready for: ([^"]+)/)?.[1] || 'Sacred development'}`);
      console.log('');
    });
    
    console.log('Usage: node sacred-terminal-launcher.cjs [type] [count]');
    console.log('Examples:');
    console.log('  node sacred-terminal-launcher.cjs sacred-dashboard');
    console.log('  node sacred-terminal-launcher.cjs multi-agent 2');
    console.log('  node sacred-terminal-launcher.cjs field-query 3');
  }

  async openSacredWorkspace() {
    console.log('🌟 Opening Sacred Workspace - Multiple Terminals');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    
    const workspace = [
      { type: 'general', count: 1 },
      { type: 'sacred-dashboard', count: 1 },
      { type: 'multi-agent', count: 1 },
      { type: 'field-query', count: 1 }
    ];
    
    for (const { type, count } of workspace) {
      await this.openTerminal(type, count);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between different types
    }
    
    console.log('');
    console.log('🌸 Sacred workspace terminals opening...');
    console.log('✨ Ready for multi-faceted sacred development!');
  }
}

// CLI Interface
async function main() {
  const launcher = new SacredTerminalLauncher();
  const command = process.argv[2];
  const count = parseInt(process.argv[3]) || 1;
  
  switch (command) {
    case 'list':
      launcher.listTerminalTypes();
      break;
    case 'workspace':
      await launcher.openSacredWorkspace();
      break;
    case 'help':
      console.log('🌟 Sacred Terminal Launcher Help');
      console.log('');
      console.log('Commands:');
      console.log('  list                    - Show available terminal types');
      console.log('  workspace              - Open full sacred workspace');
      console.log('  [type] [count]         - Open specific terminal type');
      console.log('');
      console.log('Examples:');
      console.log('  node sacred-terminal-launcher.cjs sacred-dashboard');
      console.log('  node sacred-terminal-launcher.cjs multi-agent 2');
      console.log('  node sacred-terminal-launcher.cjs workspace');
      break;
    default:
      if (command) {
        await launcher.openTerminal(command, count);
      } else {
        await launcher.openTerminal('general', 1);
      }
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SacredTerminalLauncher;