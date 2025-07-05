#!/bin/bash

# 🌟 Install Sacred Development Tools
# Enhanced CLI tools for consciousness-serving development

echo "🕊️ Installing Sacred Development Tools"
echo "===================================="
echo ""
echo "This script will install powerful tools that enhance your development experience."
echo "Some installations require sudo access."
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install with apt
install_tool() {
    local tool=$1
    local package=${2:-$tool}
    if ! command_exists "$tool"; then
        echo "📦 Installing $tool..."
        sudo apt install -y "$package" || echo "⚠️  Failed to install $package"
    else
        echo "✅ $tool already installed"
    fi
}

# Update package list
echo "🔄 Updating package lists..."
sudo apt update

# Essential CLI tools
echo ""
echo "🛠️  Installing Essential CLI Tools..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Search and find tools
install_tool "rg" "ripgrep"      # Ultra-fast grep
install_tool "fd" "fd-find"      # Modern find
install_tool "fzf" "fzf"         # Fuzzy finder

# File viewing and navigation
install_tool "bat" "bat"         # Cat with syntax highlighting
install_tool "exa" "exa"         # Modern ls
install_tool "tree" "tree"       # Directory tree
install_tool "ranger" "ranger"   # Terminal file manager

# System monitoring
install_tool "htop" "htop"       # Process viewer
install_tool "ncdu" "ncdu"       # Disk usage analyzer
install_tool "duf" "duf"         # Better df

# Development tools
install_tool "jq" "jq"           # JSON processor
install_tool "httpie" "httpie"   # HTTP client
install_tool "tmux" "tmux"       # Terminal multiplexer
install_tool "tig" "tig"         # Git text interface

# Fun and useful
install_tool "figlet" "figlet"   # ASCII art text
install_tool "lolcat" "lolcat"   # Rainbow text
install_tool "cmatrix" "cmatrix" # Matrix effect
install_tool "cowsay" "cowsay"   # Talking cow
install_tool "fortune" "fortune-mod" # Random quotes

# Create fd symlink if needed (Ubuntu packages it as fdfind)
if command_exists fdfind && ! command_exists fd; then
    sudo ln -s $(which fdfind) /usr/local/bin/fd
    echo "✅ Created fd symlink"
fi

# Install delta (better git diffs) if not present
if ! command_exists delta; then
    echo "📦 Installing delta (beautiful git diffs)..."
    wget -q https://github.com/dandavison/delta/releases/download/0.16.5/git-delta_0.16.5_amd64.deb -O /tmp/delta.deb
    sudo dpkg -i /tmp/delta.deb 2>/dev/null
    rm /tmp/delta.deb
    echo "✅ Delta installed"
fi

# Install lazygit if not present
if ! command_exists lazygit; then
    echo "📦 Installing lazygit (beautiful git UI)..."
    LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
    curl -Lo /tmp/lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
    tar xf /tmp/lazygit.tar.gz -C /tmp lazygit
    sudo install /tmp/lazygit /usr/local/bin
    rm /tmp/lazygit.tar.gz /tmp/lazygit
    echo "✅ Lazygit installed"
fi

echo ""
echo "🎨 Configuring Beautiful Defaults..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Configure bat
if command_exists bat; then
    mkdir -p ~/.config/bat
    echo '--theme="OneHalfDark"
--style="numbers,changes,header"
--map-syntax="*.js:JavaScript"
--map-syntax="*.ts:TypeScript"' > ~/.config/bat/config
fi

# Configure git with delta
if command_exists delta; then
    git config --global core.pager delta
    git config --global interactive.diffFilter "delta --color-only"
    git config --global delta.navigate true
    git config --global delta.light false
    git config --global delta.line-numbers true
    git config --global delta.side-by-side true
    git config --global delta.syntax-theme "OneHalfDark"
fi

# Add enhanced aliases to bashrc
cat >> ~/.bashrc << 'ALIASES'

# 🌟 Enhanced Sacred Aliases (Added by install-sacred-tools.sh)

# Beautiful ls replacements
if command -v exa >/dev/null 2>&1; then
    alias ls='exa --icons --group-directories-first'
    alias ll='exa -la --icons --group-directories-first'
    alias lt='exa --tree --icons -I node_modules --level=2'
    alias lta='exa --tree --icons -I node_modules'
fi

# Better cat
if command -v bat >/dev/null 2>&1; then
    alias cat='bat --style=plain'
    alias ccat='bat'  # cat with syntax highlighting
fi

# Enhanced find
if command -v fd >/dev/null 2>&1; then
    alias find='fd'
fi

# Git with lazygit
if command -v lazygit >/dev/null 2>&1; then
    alias lg='lazygit'
fi

# Docker shortcuts
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias dlog='docker logs -f'
alias dex='docker exec -it'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'

# System monitoring
alias ports='sudo lsof -i -P -n | grep LISTEN'
alias usage='du -h -d1 | sort -h'
alias biggest='du -hsx * | sort -rh | head -10'

# Network
alias myip='curl -s ifconfig.me && echo'
alias localip='hostname -I | awk "{print \$1}"'
alias speedtest='curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 -'

# Fun commands
matrix() {
    if command -v cmatrix >/dev/null 2>&1; then
        cmatrix -b -C green
    else
        echo "Install cmatrix for the matrix effect!"
    fi
}

wisdom() {
    if command -v fortune >/dev/null 2>&1 && command -v cowsay >/dev/null 2>&1 && command -v lolcat >/dev/null 2>&1; then
        fortune | cowsay | lolcat
    else
        echo "🕊️ Install fortune, cowsay, and lolcat for wisdom!"
    fi
}

# Sacred banner
sacred-banner() {
    if command -v figlet >/dev/null 2>&1 && command -v lolcat >/dev/null 2>&1; then
        figlet -f slant "Sacred Dev" | lolcat
    else
        echo "🕊️ Sacred Development Environment"
    fi
}

# FZF configuration
if command -v fzf >/dev/null 2>&1; then
    # Better command history search
    export FZF_DEFAULT_OPTS='
        --height=50%
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
    
    # Use fd for fzf if available
    if command -v fd >/dev/null 2>&1; then
        export FZF_DEFAULT_COMMAND='fd --type f --strip-cwd-prefix --hidden --follow --exclude .git'
        export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
    fi
fi

# Ranger file manager config
if command -v ranger >/dev/null 2>&1; then
    alias r='ranger'
    # Prevent nested ranger instances
    rcd() {
        temp_file="$(mktemp -t "ranger_cd.XXXXXXXXXX")"
        ranger --choosedir="$temp_file" -- "${@:-$PWD}"
        if chosen_dir="$(cat -- "$temp_file")" && [ -n "$chosen_dir" ] && [ "$chosen_dir" != "$PWD" ]; then
            cd -- "$chosen_dir"
        fi
        rm -f -- "$temp_file"
    }
fi
ALIASES

echo ""
echo "✅ Sacred tools installation complete!"
echo ""
echo "🎯 New Commands Available:"
echo "  ${GREEN}rg${NC} - Ripgrep for ultra-fast searching"
echo "  ${GREEN}fd${NC} - Modern find replacement"
echo "  ${GREEN}fzf${NC} - Fuzzy finder (try Ctrl+R for history)"
echo "  ${GREEN}bat${NC} - Beautiful file viewer with syntax highlighting"
echo "  ${GREEN}exa${NC} - Modern ls with icons"
echo "  ${GREEN}lazygit${NC} - Beautiful git interface"
echo "  ${GREEN}ranger${NC} - Terminal file manager"
echo "  ${GREEN}delta${NC} - Beautiful git diffs"
echo ""
echo "🌟 Fun Commands:"
echo "  ${GREEN}wisdom${NC} - Get sacred wisdom from a rainbow cow"
echo "  ${GREEN}matrix${NC} - Enter the matrix"
echo "  ${GREEN}sacred-banner${NC} - Display sacred banner"
echo ""
echo "🔄 Run 'source ~/.bashrc' to activate all aliases!"