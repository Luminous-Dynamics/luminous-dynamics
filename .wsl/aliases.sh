#!/bin/bash
# WSL-Optimized Sacred Development Aliases

# Core commands
alias weave='~/evolving-resonant-cocreation/the-weave.cjs'
alias oracle='weave oracle'
alias sacred='weave message sacred'
alias status='weave status'
alias evolve='weave evolve'

# VS Code
alias vscode='code.exe'
alias vs='code.exe .'

# Quick navigation
alias erc='cd ~/evolving-resonant-cocreation'
alias web='cd ~/evolving-resonant-cocreation/web'
alias src='cd ~/evolving-resonant-cocreation/src'

# WSL fixes
alias fix-perms='find . -name "*.sh" -o -name "*.cjs" | xargs chmod +x'
alias fix-lines='find . -name "*.sh" -o -name "*.cjs" -o -name "*.js" | xargs dos2unix 2>/dev/null'
alias fix-all='fix-perms && fix-lines'

# Sacred development
alias start-sacred='~/evolving-resonant-cocreation/the-weave.cjs start'
alias sacred-dash='xdg-open http://localhost:8080/sacred-dashboard.html 2>/dev/null || echo "Open http://localhost:8080/sacred-dashboard.html"'

# Git helpers
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'

# Show this help
alias sacred-help='echo "
🌟 Sacred Development Commands:
  weave         - Main entry point
  oracle        - Consult the oracle
  sacred        - Send sacred message
  status        - Check system status
  evolve        - Check evolution needs
  
  vscode/vs     - Open VS Code
  start-sacred  - Start The Weave
  sacred-dash   - Open dashboard
  
  fix-perms     - Fix permissions
  fix-lines     - Fix line endings
  fix-all       - Fix everything
"'