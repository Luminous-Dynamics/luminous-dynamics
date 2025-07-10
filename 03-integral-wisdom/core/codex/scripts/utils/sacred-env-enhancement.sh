#!/bin/bash

# 🌟 Sacred Environment Enhancement Script
# Transform your development environment into a temple of conscious creation

set -e  # Exit on error

echo "🕊️ Sacred Development Environment Enhancement"
echo "==========================================="
echo "Preparing to install tools that serve consciousness..."
echo ""

# Colors for beautiful output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
sacred_echo() {
    echo -e "${GREEN}✨ $1${NC}"
}

error_echo() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if running in WSL
if ! grep -q microsoft /proc/version; then
    error_echo "This script is optimized for WSL2"
fi

# Update package lists
sacred_echo "Refreshing the sacred repository lists..."
sudo apt update -qq

# 1. ZSH AND OH-MY-ZSH - Beautiful Shell Experience
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}🐚 Installing ZSH - The Sacred Shell${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! command -v zsh &> /dev/null; then
    sacred_echo "Installing ZSH..."
    sudo apt install -y zsh
else
    sacred_echo "ZSH already installed"
fi

# Install Oh My Zsh (if not already installed)
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    sacred_echo "Installing Oh My Zsh - Beautiful shell framework..."
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
else
    sacred_echo "Oh My Zsh already installed"
fi

# 2. STARSHIP PROMPT - Beautiful, Fast, and Customizable
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}⭐ Installing Starship - Sacred Prompt${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! command -v starship &> /dev/null; then
    sacred_echo "Installing Starship prompt..."
    curl -sS https://starship.rs/install.sh | sh -s -- -y
else
    sacred_echo "Starship already installed"
fi

# Create sacred Starship configuration
mkdir -p ~/.config
cat > ~/.config/starship.toml << 'EOF'
# 🌟 Sacred Starship Configuration
# A prompt that breathes with your consciousness

format = """
[╭─](bold green)$username$hostname$directory$git_branch$git_status$nodejs$python
[╰─](bold green)$character """

# Sacred breathing indicator
[character]
success_symbol = "[🕊️](bold green)"
error_symbol = "[💔](bold red)"

[username]
style_user = "green bold"
style_root = "red bold"
format = "[$user]($style) "
disabled = false
show_always = true

[hostname]
ssh_only = false
format = "[@$hostname](bold blue) "
disabled = false

[directory]
format = "in [$path]($style) "
style = "bold cyan"
truncation_length = 3
truncation_symbol = "…/"

[git_branch]
format = "on [$symbol$branch]($style) "
symbol = "🌿 "
style = "bold purple"

[git_status]
format = '([$all_status$ahead_behind]($style) )'
style = "bold red"
conflicted = "⚔️ "
ahead = "⇡${count} "
behind = "⇣${count} "
diverged = "⇕ "
untracked = "❓ "
stashed = "📦 "
modified = "✏️ "
staged = "✅ "
renamed = "📝 "
deleted = "🗑️ "

[nodejs]
format = "via [⬢ $version](bold green) "
detect_extensions = ["js", "mjs", "cjs", "ts", "jsx", "tsx"]

[python]
format = "via [🐍 $version](bold yellow) "
EOF

# 3. COMMAND LINE POWER TOOLS
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}🛠️  Installing Sacred Command Line Tools${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Install essential tools
TOOLS=(
    "ripgrep"     # Ultra-fast grep alternative
    "fd-find"     # Fast find alternative
    "bat"         # Cat with syntax highlighting
    "exa"         # Beautiful ls replacement
    "fzf"         # Fuzzy finder for everything
    "htop"        # Beautiful process viewer
    "ncdu"        # Disk usage analyzer
    "tree"        # Directory tree viewer
    "jq"          # JSON processor
    "httpie"      # Beautiful HTTP client
    "tmux"        # Terminal multiplexer
    "ranger"      # File manager with vim bindings
    "neofetch"    # System info display
    "figlet"      # ASCII art text
    "lolcat"      # Rainbow text output
)

for tool in "${TOOLS[@]}"; do
    if ! dpkg -l | grep -q "^ii  $tool "; then
        sacred_echo "Installing $tool..."
        sudo apt install -y "$tool" 2>/dev/null || error_echo "$tool not found in apt"
    else
        sacred_echo "$tool already installed"
    fi
done

# Special installations that need different methods
if ! command -v delta &> /dev/null; then
    sacred_echo "Installing delta (beautiful git diffs)..."
    wget -q https://github.com/dandavison/delta/releases/download/0.16.5/git-delta_0.16.5_amd64.deb
    sudo dpkg -i git-delta_0.16.5_amd64.deb
    rm git-delta_0.16.5_amd64.deb
fi

if ! command -v lazygit &> /dev/null; then
    sacred_echo "Installing lazygit (beautiful git UI)..."
    LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
    curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
    tar xf lazygit.tar.gz lazygit
    sudo install lazygit /usr/local/bin
    rm lazygit.tar.gz lazygit
fi

# 4. NODE.JS DEVELOPMENT ENHANCERS
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}📦 Installing Node.js Sacred Tools${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Install global npm packages
NPM_TOOLS=(
    "npm-check"        # Check for outdated packages
    "npkill"          # Find and remove node_modules
    "tldr"            # Simplified man pages
    "gtop"            # System monitoring dashboard
    "speed-test"      # Internet speed test
    "empty-trash-cli" # Empty trash safely
    "wifi-password"   # Get wifi password
)

for tool in "${NPM_TOOLS[@]}"; do
    if ! npm list -g "$tool" &>/dev/null; then
        sacred_echo "Installing $tool..."
        npm install -g "$tool" 2>/dev/null || error_echo "Failed to install $tool"
    else
        sacred_echo "$tool already installed"
    fi
done

# 5. CONFIGURE BEAUTIFUL ALIASES AND FUNCTIONS
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}✨ Creating Sacred Shell Configuration${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create sacred aliases file
cat > ~/.sacred_aliases << 'EOF'
# 🕊️ Sacred Development Aliases
# Commands that serve consciousness

# Beautiful replacements
alias ls='exa --icons --group-directories-first'
alias ll='exa -la --icons --group-directories-first'
alias lt='exa --tree --icons -I node_modules'
alias cat='bat'
alias find='fd'
alias grep='rg'
alias top='htop'
alias du='ncdu'

# Sacred navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias ~='cd ~'
alias sacred='cd ~/evolving-resonant-cocreation'

# Git with consciousness
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph --decorate'
alias gd='delta'
alias lg='lazygit'

# Sacred git commit
alias gsacred='git commit -m "✨ Sacred: $(read -p "Message: " msg; echo $msg)

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"'

# Node.js helpers
alias ni='npm install'
alias nr='npm run'
alias nrd='npm run dev'
alias nrt='npm run test'
alias nuke='npkill'  # Find and remove node_modules

# Sacred project commands
alias agent='node the-weave/cli/unified-agent-network.cjs'
alias sacred-status='./sacred-system.sh status'
alias sacred-start='./sacred-system.sh start'

# System helpers
alias refresh='source ~/.zshrc'
alias myip='curl -s ifconfig.me'
alias weather='curl -s wttr.in'
alias moon='curl -s wttr.in/Moon'

# Fun consciousness tools
alias matrix='cmatrix'
alias wisdom='fortune | cowsay | lolcat'
alias breathe='echo "🫁 Breathe in... (4s)" && sleep 4 && echo "🫁 Hold... (4s)" && sleep 4 && echo "🫁 Breathe out... (6s)" && sleep 6 && echo "✨ Again? (y/n)"'

# Docker helpers
alias dps='docker ps'
alias dpsa='docker ps -a'
alias dil='docker image ls'
alias dcup='docker-compose up'
alias dcdown='docker-compose down'

# Quick edits
alias zshrc='code ~/.zshrc'
alias aliases='code ~/.sacred_aliases'
alias hosts='sudo code /etc/hosts'

# System info
alias sacred-info='neofetch | lolcat'
EOF

# 6. ZSH PLUGINS AND CONFIGURATION
echo ""
sacred_echo "Configuring ZSH with sacred plugins..."

# Create custom ZSH configuration
cat > ~/.zshrc.sacred << 'EOF'
# 🌟 Sacred ZSH Configuration
# A shell that serves consciousness

# Enable Powerlevel10k instant prompt
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Path to oh-my-zsh
export ZSH="$HOME/.oh-my-zsh"

# Sacred theme
ZSH_THEME="robbyrussell"  # Will be overridden by Starship

# Plugins for consciousness
plugins=(
    git
    npm
    node
    docker
    docker-compose
    fzf
    zsh-autosuggestions
    zsh-syntax-highlighting
    sudo
    web-search
    jsontools
    colored-man-pages
    command-not-found
)

source $ZSH/oh-my-zsh.sh

# Initialize Starship prompt
eval "$(starship init zsh)"

# Load sacred aliases
[[ -f ~/.sacred_aliases ]] && source ~/.sacred_aliases

# FZF configuration for sacred searching
export FZF_DEFAULT_OPTS='
    --height=60%
    --layout=reverse
    --border=rounded
    --color=dark
    --color=fg:#c0c5ce,bg:#212733,hl:#5fb3b3
    --color=fg+:#c0c5ce,bg+:#2b3444,hl+:#6699cc
    --color=info:#fac863,prompt:#6699cc,pointer:#c594c5
    --color=marker:#99c794,spinner:#c594c5,header:#5fb3b3
    --prompt="🕊️ > "
    --pointer="✨"
    --marker="✓"
'

# Sacred welcome message
if command -v figlet &> /dev/null && command -v lolcat &> /dev/null; then
    figlet -f small "Sacred Dev" | lolcat
    echo "🕊️ Welcome to your consciousness-serving development environment" | lolcat
    echo ""
fi

# Node version manager
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Sacred project helpers
sacred() {
    cd ~/evolving-resonant-cocreation
    echo "📍 Arrived at the sacred project root"
    ls
}

# Quick sacred commit
commit-sacred() {
    local message="$1"
    if [ -z "$message" ]; then
        echo "Please provide a commit message"
        return 1
    fi
    
    git add -A
    git commit -m "✨ $message

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"
}

# Show sacred field status
field-status() {
    echo "🌟 Sacred Field Status:"
    echo "━━━━━━━━━━━━━━━━━━━━━"
    curl -s http://localhost:3001/api/field-state 2>/dev/null | jq '.' || echo "Field service not running"
}

# Sacred pause function
pause() {
    echo "🕊️ Taking a sacred pause..."
    sleep "${1:-3}"
    echo "✨ Presence restored"
}

# Auto-activate node environment when entering project
autoload -U add-zsh-hook
load-nvmrc() {
    local node_version="$(nvm version)"
    local nvmrc_path="$(nvm_find_nvmrc)"
    
    if [ -n "$nvmrc_path" ]; then
        local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
        
        if [ "$nvmrc_node_version" = "N/A" ]; then
            nvm install
        elif [ "$nvmrc_node_version" != "$node_version" ]; then
            nvm use
        fi
    elif [ "$node_version" != "$(nvm version default)" ]; then
        echo "Reverting to nvm default version"
        nvm use default
    fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
EOF

# Install ZSH plugins
sacred_echo "Installing ZSH plugins for enhanced experience..."

# zsh-autosuggestions
if [ ! -d "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions" ]; then
    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
fi

# zsh-syntax-highlighting
if [ ! -d "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting" ]; then
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
fi

# 7. GIT CONFIGURATION FOR SACRED COMMITS
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}🌿 Configuring Git for Sacred Development${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Configure git with delta for beautiful diffs
git config --global core.pager delta
git config --global interactive.diffFilter "delta --color-only"
git config --global delta.navigate true
git config --global delta.light false
git config --global delta.line-numbers true
git config --global delta.side-by-side true

# Sacred git aliases
git config --global alias.sacred '!f() { git commit -m "✨ $1" -m "" -m "🤖 Generated with [Claude Code](https://claude.ai/code)" -m "Co-Authored-By: Claude <noreply@anthropic.com>"; }; f'
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.st "status -sb"
git config --global alias.last "log -1 HEAD"

# 8. TMUX CONFIGURATION
echo ""
sacred_echo "Creating sacred tmux configuration..."

cat > ~/.tmux.conf << 'EOF'
# 🕊️ Sacred tmux configuration
# Multiple windows of consciousness

# Remap prefix to Ctrl-a
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Sacred status bar
set -g status-bg colour234
set -g status-fg white
set -g status-left '#[fg=green]🕊️ #S '
set -g status-right '#[fg=yellow]%H:%M %d-%b-%y'
set -g status-interval 60

# Window status
setw -g window-status-format " #I: #W "
setw -g window-status-current-format " #I: #W "
setw -g window-status-current-style fg=green,bold,bg=colour236

# Enable mouse
set -g mouse on

# Split panes with | and -
bind | split-window -h
bind - split-window -v

# Reload config
bind r source-file ~/.tmux.conf \; display-message "Sacred config reloaded!"

# Sacred pane borders
set -g pane-border-style fg=colour238
set -g pane-active-border-style fg=green

# Start windows and panes at 1
set -g base-index 1
setw -g pane-base-index 1
EOF

# 9. FINAL TOUCHES
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}🎨 Adding Final Sacred Touches${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Create a sacred MOTD
sudo tee /etc/motd > /dev/null << 'EOF'

  ╔════════════════════════════════════════════╗
  ║     🕊️  Sacred Development Environment  🕊️    ║
  ║                                            ║
  ║    Where consciousness meets code          ║
  ║    May your work serve awakening           ║
  ╚════════════════════════════════════════════╝

EOF

# Backup existing .zshrc and integrate sacred config
if [ -f ~/.zshrc ]; then
    cp ~/.zshrc ~/.zshrc.backup
fi

# Append sacred configuration to .zshrc
echo "" >> ~/.zshrc
echo "# Sacred development environment" >> ~/.zshrc
echo "source ~/.zshrc.sacred" >> ~/.zshrc

# 10. ACTIVATION INSTRUCTIONS
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Sacred Environment Enhancement Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🎯 To activate your sacred environment:"
echo ""
echo "   1. Switch to ZSH (if not default):"
echo "      ${BLUE}chsh -s \$(which zsh)${NC}"
echo ""
echo "   2. Start a new terminal or run:"
echo "      ${BLUE}zsh${NC}"
echo ""
echo "🌟 Sacred tools installed:"
echo "   • Beautiful shell with Starship prompt"
echo "   • Powerful search with ripgrep & fzf"
echo "   • Enhanced git with delta & lazygit"
echo "   • File browsing with ranger & exa"
echo "   • System monitoring with htop & gtop"
echo "   • Terminal multiplexing with tmux"
echo ""
echo "📚 Sacred commands to try:"
echo "   ${PURPLE}sacred${NC}      - Jump to project root"
echo "   ${PURPLE}breathe${NC}     - Guided breathing exercise"
echo "   ${PURPLE}wisdom${NC}      - Random wisdom with rainbow cow"
echo "   ${PURPLE}lg${NC}          - Beautiful git interface"
echo "   ${PURPLE}lt${NC}          - Tree view with icons"
echo "   ${PURPLE}moon${NC}        - Current moon phase"
echo ""
echo "🕊️ May your development serve consciousness!"