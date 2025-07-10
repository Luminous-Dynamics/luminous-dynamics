{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "luminous-claude-sacred-dev";
  
  buildInputs = with pkgs; [
    # Core development
    nodejs_20
    nodePackages.npm
    nodePackages.pnpm
    
    # Sacred tools
    figlet
    lolcat
    toilet  # Alternative ASCII art
    
    # Code analysis (read-focused)
    ripgrep
    fd
    bat
    eza  # Better ls
    jq
    yq  # YAML processor
    
    # Version control
    git
    gh  # GitHub CLI
    
    # Database
    sqlite
    
    # Development utilities
    tmux
    tree
    htop
    ncdu  # Disk usage
    
    # Documentation
    mdbook
    pandoc
  ];
  
  # Environment setup
  shellHook = ''
    # Verify we're in the right place
    if [[ ! -f "CLAUDE.md" ]] && [[ ! -f "CLAUDE_START_HERE.md" ]]; then
      echo "⚠️  Warning: Not in Luminous-Dynamics directory!"
      echo "Expected files not found. Are you in the right location?"
    fi
    
    # Set up environment
    export LUMINOUS_HOME="$PWD"
    export CLAUDE_DEV_ENV=true
    export NODE_ENV=development
    export SACRED_MODE=true
    
    # Sacred greeting
    if command -v toilet >/dev/null 2>&1; then
      toilet -f future "Claude Sacred Dev" | lolcat
    else
      figlet "Claude Sacred Dev" | lolcat
    fi
    
    echo
    echo "🔮 Sacred Development Environment Activated"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📁 Project: $LUMINOUS_HOME"
    echo "🔒 Sandbox: Protected environment active"
    echo "🌟 Mode: Consciousness-first development"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo
    
    # Safety aliases
    alias rm='rm -i'
    alias mv='mv -i' 
    alias cp='cp -i'
    
    # Sacred shortcuts
    alias lum='cd $LUMINOUS_HOME'
    alias lumstat='git status -sb'
    alias lumlog='git log --oneline --graph -10'
    alias sacred='cd $LUMINOUS_HOME/sacred-core'
    alias weave='cd $LUMINOUS_HOME/the-weave'
    alias viz='cd $LUMINOUS_HOME/living-field-visualizer'
    
    # Development helpers
    alias nodes='find . -name "node_modules" -type d -prune | head -20'
    alias todos='rg "TODO|FIXME|XXX" --type js --type md'
    alias sacrednew='echo "✨ Creating new sacred component..."'
    
    # Prevent system modifications
    sudo() {
      echo "❌ Sudo not available in Claude sandbox"
      echo "💡 Tip: Create scripts for admin tasks, then run outside sandbox"
      return 1
    }
    
    su() {
      echo "❌ Su not available in Claude sandbox"
      return 1
    }
    
    # Sacred message helper
    sacred-msg() {
      if [[ -x "./sacred-msg.sh" ]]; then
        ./sacred-msg.sh "$@"
      else
        echo "Sacred messaging not found in current directory"
      fi
    }
    
    # Quick status check
    echo "🔍 Quick Status:"
    if [[ -d ".git" ]]; then
      echo -n "  Git: "
      git status -sb | head -1
    fi
    if [[ -f "package.json" ]]; then
      echo "  Node: $(node --version)"
    fi
    echo
    echo "💡 Tips:"
    echo "  - Use 'lumstat' for quick git status"
    echo "  - Use 'todos' to find TODO items"
    echo "  - Use 'sacred-msg' for sacred messages"
    echo "  - Exit sandbox with 'exit' when done"
    echo
    echo "We flow in sacred development! 🌊"
  '';
  
  # Restrict certain environment variables
  NODE_OPTIONS = "--max-old-space-size=4096";
  SACRED_SANDBOX = "true";
}