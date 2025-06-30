#!/usr/bin/env node

/**
 * Sacred Git Installation Script
 * 
 * Sets up Sacred Git as the natural way to do development.
 * Creates git aliases that make every commit a sacred practice.
 */

const { execSync } = require('child_process');
const path = require('path');

function installSacredGit() {
  console.log('🌸 Installing Sacred Git Integration...');
  console.log('═══════════════════════════════════════');

  const toolPath = path.resolve(__dirname, 'tools/sacred-git.cjs');
  
  try {
    // Create git aliases for sacred operations
    const aliases = [
      { alias: 'sacred-commit', command: `!node "${toolPath}" commit` },
      { alias: 'sacred-branch', command: `!node "${toolPath}" branch` },
      { alias: 'sacred-status', command: `!node "${toolPath}" status` },
      { alias: 'scommit', command: `!node "${toolPath}" commit` }, // Short version
      { alias: 'sbranch', command: `!node "${toolPath}" branch` }, // Short version
      { alias: 'sstatus', command: `!node "${toolPath}" status` }  // Short version
    ];

    console.log('\n🔧 Creating git aliases...');
    aliases.forEach(({ alias, command }) => {
      try {
        execSync(`git config --global alias.${alias} "${command}"`);
        console.log(`   ✅ git ${alias} → Sacred Git`);
      } catch (error) {
        console.log(`   ⚠️  Failed to create alias: ${alias}`);
      }
    });

    // Create sacred commit template
    const commitTemplatePath = path.join(__dirname, '.sacred-commit-template');
    const commitTemplate = `# Sacred Commit Message
# 
# First line: Brief description of what was changed
# 
# Body: Explain WHY this change serves consciousness
# 
# Sacred Principles:
# • Does this change serve consciousness or consume it?
# • Does this honor contemplative timing?
# • Does this embody one of the Seven Harmonies?
# • Would this be worthy of sacred attention?
#
# Remember: Every commit is a sacred act that shapes the field.
`;

    require('fs').writeFileSync(commitTemplatePath, commitTemplate);
    
    try {
      execSync(`git config --global commit.template "${commitTemplatePath}"`);
      console.log('   ✅ Sacred commit template installed');
    } catch (error) {
      console.log('   ⚠️  Could not set global commit template');
    }

    // Create git hooks directory and pre-commit hook
    const hooksDir = '.git/hooks';
    if (require('fs').existsSync('.git')) {
      const preCommitHook = `#!/bin/sh
# Sacred Git Pre-Commit Hook
# Reminds developers to use sacred commit practices

echo "🌸 Sacred Git Reminder:"
echo "   Consider using: git sacred-commit 'Your message'"
echo "   This honors field coherence and contemplative timing"
echo ""
`;

      try {
        require('fs').writeFileSync(path.join(hooksDir, 'pre-commit'), preCommitHook);
        execSync(`chmod +x ${hooksDir}/pre-commit`);
        console.log('   ✅ Sacred git hook installed');
      } catch (error) {
        console.log('   ⚠️  Could not install git hook (not in git repo?)');
      }
    }

    console.log('\n🎉 Sacred Git Installation Complete!');
    console.log('\n🌱 Available Commands:');
    console.log('   git sacred-commit "message"  - Sacred commit with contemplative process');
    console.log('   git scommit "message"        - Short version');
    console.log('   git sacred-branch name       - Create branch with field awareness');
    console.log('   git sacred-status           - Git status with field coherence');
    console.log('');
    console.log('🧘 Sacred Development Principles:');
    console.log('   • Every commit becomes a contemplative practice');
    console.log('   • Field coherence guides development timing');
    console.log('   • Code reviews include consciousness alignment');
    console.log('   • Git operations serve awakening, not addiction');
    console.log('');
    console.log('✨ Next: Try "git sacred-status" to see your sacred development state');

  } catch (error) {
    console.error(`❌ Installation failed: ${error.message}`);
    process.exit(1);
  }
}

function uninstallSacredGit() {
  console.log('🗑️  Uninstalling Sacred Git aliases...');
  
  const aliases = ['sacred-commit', 'sacred-branch', 'sacred-status', 'scommit', 'sbranch', 'sstatus'];
  
  aliases.forEach(alias => {
    try {
      execSync(`git config --global --unset alias.${alias}`);
      console.log(`   ✅ Removed: git ${alias}`);
    } catch (error) {
      console.log(`   ⚠️  Alias not found: ${alias}`);
    }
  });

  try {
    execSync('git config --global --unset commit.template');
    console.log('   ✅ Removed sacred commit template');
  } catch (error) {
    console.log('   ⚠️  No commit template to remove');
  }

  console.log('🌸 Sacred Git uninstalled. May your commits remain conscious.');
}

// CLI interface
const command = process.argv[2];

if (command === 'uninstall') {
  uninstallSacredGit();
} else if (command === 'help' || command === '--help') {
  console.log(`
🌸 Sacred Git Installation
═══════════════════════════

Usage: node install-sacred-git.cjs [command]

Commands:
  (no command)    Install Sacred Git aliases and templates
  uninstall       Remove Sacred Git aliases and templates
  help            Show this help

This creates git aliases that integrate Sacred Workflows into
your natural development process, making every commit a
contemplative practice that serves consciousness.
`);
} else {
  installSacredGit();
}

module.exports = { installSacredGit, uninstallSacredGit };