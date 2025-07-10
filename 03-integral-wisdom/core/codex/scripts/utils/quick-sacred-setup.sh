#!/bin/bash

# 🌟 Quick Sacred Environment Setup (No Sudo Required)
# Beautiful tools that work within your permissions

echo "🕊️ Quick Sacred Environment Setup"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 1. INSTALL STARSHIP (User install)
echo -e "${PURPLE}⭐ Installing Starship Prompt...${NC}"
if ! command -v starship &> /dev/null; then
    curl -sS https://starship.rs/install.sh | sh -s -- -y --bin-dir ~/.local/bin
    export PATH="$HOME/.local/bin:$PATH"
else
    echo "Starship already installed"
fi

# Create beautiful Starship config
mkdir -p ~/.config
cat > ~/.config/starship.toml << 'STARSHIP'
# 🌟 Sacred Starship Configuration

format = """
[╭─](bold green)$directory$git_branch$git_status$nodejs
[╰─](bold green)$character """

[character]
success_symbol = "[🕊️](bold green)"
error_symbol = "[💔](bold red)"

[directory]
format = "[$path]($style) "
style = "bold cyan"
truncation_length = 3

[git_branch]
format = "on [$symbol$branch]($style) "
symbol = "🌿 "
style = "bold purple"

[nodejs]
format = "via [⬢ $version](bold green) "
STARSHIP

# 2. CREATE SACRED ALIASES
echo -e "${PURPLE}✨ Creating Sacred Aliases...${NC}"
cat >> ~/.bashrc << 'ALIASES'

# 🕊️ Sacred Development Aliases
alias sacred='cd ~/evolving-resonant-cocreation'
alias gs='git status'
alias gl='git log --oneline --graph --decorate'
alias agent='node the-weave/cli/unified-agent-network.cjs'
alias breathe='echo "🫁 Breathe in... (4s)" && sleep 4 && echo "🫁 Hold... (4s)" && sleep 4 && echo "🫁 Breathe out... (6s)" && sleep 6'

# Initialize Starship
eval "$(starship init bash)"

# Sacred welcome
echo "🕊️ Welcome to your sacred development environment"
ALIASES

# 3. INSTALL NPM TOOLS (No sudo needed)
echo -e "${PURPLE}📦 Installing Node.js Tools...${NC}"

# Check if npm is available
if command -v npm &> /dev/null; then
    # Create npm global directory in home
    mkdir -p ~/.npm-global
    npm config set prefix '~/.npm-global'
    export PATH=~/.npm-global/bin:$PATH
    
    # Install useful tools
    npm install -g tldr 2>/dev/null && echo "✅ tldr installed (simplified man pages)"
    npm install -g npm-check 2>/dev/null && echo "✅ npm-check installed"
    npm install -g npkill 2>/dev/null && echo "✅ npkill installed (clean node_modules)"
fi

# 4. CREATE HELPFUL SCRIPTS
echo -e "${PURPLE}🛠️ Creating Sacred Helper Scripts...${NC}"

# Sacred commit helper
cat > ~/sacred-commit.sh << 'SCRIPT'
#!/bin/bash
# Sacred git commit helper
message="$1"
if [ -z "$message" ]; then
    echo "Usage: sacred-commit 'Your message'"
    exit 1
fi
git add -A
git commit -m "✨ $message

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"
SCRIPT
chmod +x ~/sacred-commit.sh

# Field status checker
cat > ~/field-status.sh << 'SCRIPT'
#!/bin/bash
echo "🌟 Checking Sacred Field Status..."
curl -s http://localhost:3001/api/field-state 2>/dev/null | python3 -m json.tool || echo "Field service not running"
SCRIPT
chmod +x ~/field-status.sh

# 5. GIT CONFIGURATION
echo -e "${PURPLE}🌿 Configuring Git...${NC}"
git config --global alias.sacred '!bash ~/sacred-commit.sh'
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 6. CREATE VS CODE SNIPPETS
echo -e "${PURPLE}📝 Enhancing VS Code Experience...${NC}"
if [ -d ~/.config/Code/User ]; then
    mkdir -p ~/.config/Code/User/snippets
    cat > ~/.config/Code/User/snippets/sacred.code-snippets << 'SNIPPETS'
{
  "Sacred Pause": {
    "prefix": "pause",
    "body": [
      "// 🕊️ Sacred pause",
      "await new Promise(resolve => setTimeout(resolve, ${1:3000}));"
    ]
  },
  "Sacred Function": {
    "prefix": "sfn",
    "body": [
      "/**",
      " * 🌟 ${1:Description}",
      " */",
      "async function ${2:name}() {",
      "  $0",
      "}"
    ]
  }
}
SNIPPETS
fi

echo ""
echo -e "${GREEN}✅ Quick Setup Complete!${NC}"
echo ""
echo "🎯 To activate:"
echo "   ${BLUE}source ~/.bashrc${NC}"
echo ""
echo "📚 New commands available:"
echo "   ${PURPLE}sacred${NC} - Jump to project"
echo "   ${PURPLE}breathe${NC} - Breathing exercise"
echo "   ${PURPLE}git sacred 'message'${NC} - Sacred commit"
echo "   ${PURPLE}~/field-status.sh${NC} - Check field status"
echo ""
echo "🔧 For the full experience, install these with apt:"
echo "   sudo apt install ripgrep bat exa fzf htop tmux"
echo ""
echo "🕊️ Your sacred environment is ready!"