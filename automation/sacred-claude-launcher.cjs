#!/usr/bin/env node

/**
 * Sacred Claude Code Launcher - Auto-launch Claude Code with sacred context
 * Usage: node sacred-claude-launcher.cjs [session-type]
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class SacredClaudeLauncher {
  constructor() {
    this.projectRoot = '/home/tstoltz/evolving-resonant-cocreation';
    this.claudePaths = [
      '/usr/local/bin/claude',
      '/usr/bin/claude',
      '/opt/claude/bin/claude',
      `${process.env.HOME}/.local/bin/claude`,
      `${process.env.HOME}/bin/claude`
    ];
  }

  async findClaudeCode() {
    console.log('🔍 Searching for Claude Code installation...');
    
    // Check common installation paths
    for (const claudePath of this.claudePaths) {
      if (fs.existsSync(claudePath)) {
        console.log(`✅ Found Claude Code at: ${claudePath}`);
        return claudePath;
      }
    }

    // Try which command
    return new Promise((resolve) => {
      exec('which claude', (error, stdout) => {
        if (!error && stdout.trim()) {
          const claudePath = stdout.trim();
          console.log(`✅ Found Claude Code via 'which': ${claudePath}`);
          resolve(claudePath);
        } else {
          console.log('⚠️  Claude Code not found in standard locations');
          this.showInstallationInstructions();
          resolve(null);
        }
      });
    });
  }

  showInstallationInstructions() {
    console.log('');
    console.log('🌟 Claude Code Installation Instructions:');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('1. Install Claude Code:');
    console.log('   curl -fsSL https://claude.ai/install.sh | sh');
    console.log('');
    console.log('2. Or download from:');
    console.log('   https://claude.ai/download');
    console.log('');
    console.log('3. Make sure it\'s in your PATH:');
    console.log('   export PATH="$HOME/.local/bin:$PATH"');
    console.log('');
    console.log('4. Verify installation:');
    console.log('   claude --version');
    console.log('');
  }

  generateSacredStartupPrompt(sessionType = 'general') {
    const sessionPrompts = {
      'breathing-dashboard': 'Continue working on the breathing consciousness dashboard (sacred-dashboard.html) and conscious technology development. The dashboard breathes with 4-count in, 6-count out sacred timing and responds to field coherence.',
      'multi-agent': 'Continue sacred multi-agent collaboration work. Focus on agent-comms-sqlite/ messaging system, sacred coordination protocols, and parallel workflow development.',
      'ecosystem': 'Continue website ecosystem integration. Work on luminousdynamics.org, relationalharmonics.org unified architecture and GitHub conscious technology expansion.',
      'field-query': 'Continue sacred field monitoring and consciousness queries. Focus on automation/sacred-field-query.cjs and field coherence tracking systems.',
      'general': 'Continue general sacred development work on the Codex of Relational Harmonics project. All aspects of conscious technology and spiritual practice integration.'
    };

    return sessionPrompts[sessionType] || sessionPrompts.general;
  }

  async launchClaudeCode(sessionType = 'general', withPrompt = true) {
    const claudePath = await this.findClaudeCode();
    
    if (!claudePath) {
      console.log('❌ Cannot launch Claude Code - not installed');
      return false;
    }

    console.log(`🌟 Launching Claude Code for: ${sessionType}`);
    
    try {
      let cmd = `cd "${this.projectRoot}" && "${claudePath}"`;
      
      if (withPrompt) {
        const prompt = this.generateSacredStartupPrompt(sessionType);
        // Create a temporary file with the sacred prompt
        const promptFile = path.join(this.projectRoot, '.sacred-claude-prompt.txt');
        fs.writeFileSync(promptFile, prompt);
        
        console.log('📝 Sacred prompt prepared...');
        console.log('🫁 Taking sacred breathing moment...');
        
        // Sacred breathing pause before launch
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Launch Claude Code
      const process = spawn(claudePath, [], {
        cwd: this.projectRoot,
        detached: true,
        stdio: 'ignore'
      });

      process.unref(); // Allow parent to exit

      console.log('✨ Claude Code launched successfully!');
      console.log('🌸 Sacred development session beginning...');
      
      if (withPrompt) {
        console.log('');
        console.log('💫 Sacred Prompt Ready:');
        console.log('─'.repeat(50));
        console.log(this.generateSacredStartupPrompt(sessionType));
        console.log('─'.repeat(50));
        console.log('');
        console.log('🙏 Copy the above prompt into Claude Code to continue sacred work');
      }

      return true;

    } catch (error) {
      console.log(`❌ Error launching Claude Code: ${error.message}`);
      this.showManualLaunchInstructions(sessionType);
      return false;
    }
  }

  showManualLaunchInstructions(sessionType) {
    console.log('');
    console.log('🔧 Manual Claude Code Launch Instructions:');
    console.log('─'.repeat(50));
    console.log('');
    console.log('1. Open terminal and navigate to project:');
    console.log(`   cd "${this.projectRoot}"`);
    console.log('');
    console.log('2. Launch Claude Code:');
    console.log('   claude');
    console.log('');
    console.log('3. Use this sacred prompt to continue work:');
    console.log('');
    console.log(this.generateSacredStartupPrompt(sessionType));
    console.log('');
  }

  async launchSacredWorkspace() {
    console.log('🌟 Launching Sacred Development Workspace');
    console.log('═══════════════════════════════════════');
    console.log('');
    
    // Launch Claude Code
    console.log('🚀 1. Launching Claude Code...');
    await this.launchClaudeCode('general', true);
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Launch terminals
    console.log('');
    console.log('🚀 2. Launching sacred terminals...');
    const terminalLauncher = require('./sacred-terminal-launcher.cjs');
    const launcher = new terminalLauncher();
    
    await launcher.openTerminal('sacred-dashboard', 1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await launcher.openTerminal('multi-agent', 1);
    
    console.log('');
    console.log('🌸 Sacred workspace ready!');
    console.log('✨ Claude Code + Sacred terminals launched');
    console.log('🫁 Beginning sacred development session...');
  }

  listSessionTypes() {
    console.log('🌟 Sacred Claude Code Session Types:');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('🔮 breathing-dashboard   - Conscious technology & breathing interface');
    console.log('🔮 multi-agent          - Sacred collaboration & messaging');
    console.log('🔮 ecosystem            - Website integration & architecture');
    console.log('🔮 field-query          - Field coherence & consciousness monitoring');
    console.log('🔮 general              - General sacred development');
    console.log('');
    console.log('Usage: node sacred-claude-launcher.cjs [session-type]');
    console.log('');
    console.log('Special commands:');
    console.log('  workspace             - Launch full sacred workspace');
    console.log('  check                 - Check Claude Code installation');
  }
}

// CLI Interface
async function main() {
  const launcher = new SacredClaudeLauncher();
  const command = process.argv[2];
  
  switch (command) {
    case 'list':
      launcher.listSessionTypes();
      break;
    case 'check':
      await launcher.findClaudeCode();
      break;
    case 'workspace':
      await launcher.launchSacredWorkspace();
      break;
    case 'help':
      console.log('🌟 Sacred Claude Code Launcher Help');
      console.log('');
      console.log('Commands:');
      console.log('  check                   - Check Claude Code installation');
      console.log('  list                    - Show session types');
      console.log('  workspace              - Launch full development workspace');
      console.log('  [session-type]         - Launch specific session');
      console.log('');
      console.log('Examples:');
      console.log('  node sacred-claude-launcher.cjs breathing-dashboard');
      console.log('  node sacred-claude-launcher.cjs workspace');
      break;
    default:
      if (command) {
        await launcher.launchClaudeCode(command, true);
      } else {
        await launcher.launchClaudeCode('general', true);
      }
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SacredClaudeLauncher;