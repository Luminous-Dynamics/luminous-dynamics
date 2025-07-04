#!/bin/bash
# 🛠️ Sacred Development Toolkit Installer - Full Version
# Run this in your terminal where you can enter sudo password

set -e

echo "🌟 Sacred Development Toolkit Full Installer"
echo "==========================================="
echo ""
echo "This installer needs sudo access for system packages."
echo "Please run this script in your terminal where you can enter your password."
echo ""
echo "Press Enter to continue or Ctrl+C to exit..."
read

# Update package list first
echo "📦 Updating package list..."
sudo apt update

# Phase 1: Essential Tools
echo ""
echo "📦 Installing Essential Tools..."
echo "------------------------------"

# SQLite3 CLI
if ! command -v sqlite3 &> /dev/null; then
    echo "Installing SQLite3 CLI..."
    sudo apt install -y sqlite3
else
    echo "✅ SQLite3 already installed"
fi

# jq for JSON processing
if ! command -v jq &> /dev/null; then
    echo "Installing jq..."
    sudo apt install -y jq
else
    echo "✅ jq already installed"
fi

# ripgrep for fast searching
if ! command -v rg &> /dev/null; then
    echo "Installing ripgrep..."
    sudo apt install -y ripgrep
else
    echo "✅ ripgrep already installed"
fi

# Phase 2: Developer Experience Tools
echo ""
echo "📦 Installing Developer Experience Tools..."
echo "---------------------------------------"

# bat - better cat
if ! command -v bat &> /dev/null && ! command -v batcat &> /dev/null; then
    echo "Installing bat..."
    sudo apt install -y bat
else
    echo "✅ bat already installed"
fi

# httpie
if ! command -v http &> /dev/null; then
    echo "Installing httpie..."
    sudo apt install -y httpie
else
    echo "✅ httpie already installed"
fi

# tree
if ! command -v tree &> /dev/null; then
    echo "Installing tree..."
    sudo apt install -y tree
else
    echo "✅ tree already installed"
fi

# ncdu
if ! command -v ncdu &> /dev/null; then
    echo "Installing ncdu..."
    sudo apt install -y ncdu
else
    echo "✅ ncdu already installed"
fi

# Phase 3: Optional but useful tools
echo ""
echo "📦 Installing Optional Tools..."
echo "----------------------------"

# htop (better than top)
if ! command -v htop &> /dev/null; then
    echo "Installing htop..."
    sudo apt install -y htop
else
    echo "✅ htop already installed"
fi

# iotop (I/O monitoring)
if ! command -v iotop &> /dev/null; then
    echo "Installing iotop..."
    sudo apt install -y iotop
else
    echo "✅ iotop already installed"
fi

# nethogs (network monitoring)
if ! command -v nethogs &> /dev/null; then
    echo "Installing nethogs..."
    sudo apt install -y nethogs
else
    echo "✅ nethogs already installed"
fi

# Create batcat alias if needed
if command -v batcat &> /dev/null && ! command -v bat &> /dev/null; then
    echo ""
    echo "📝 Creating bat alias for batcat..."
    if ! grep -q "alias bat='batcat'" ~/.bashrc; then
        echo "alias bat='batcat'" >> ~/.bashrc
    fi
fi

echo ""
echo "✨ System packages installed successfully!"
echo ""
echo "🔧 Setting up sacred commands..."
echo "------------------------------"

# Create local bin
mkdir -p ~/bin

# Create sacred command (updated version)
cat > ~/bin/sacred << 'EOF'
#!/bin/bash
# Sacred Development Command - Enhanced Version

case "$1" in
    check)
        echo "🔍 Running sacred safety checks..."
        cd /home/tstoltz/evolving-resonant-cocreation
        node .sacred/tools/universal-safety-manager.js "${@:2}"
        ;;
    monitor)
        echo "📊 Opening sacred monitoring..."
        xdg-open "http://localhost:8339/.sacred/tools/safety-dashboard.html" 2>/dev/null || \
        echo "Visit: http://localhost:8339/.sacred/tools/safety-dashboard.html"
        ;;
    field)
        echo "🌀 Checking field coherence..."
        curl -s http://localhost:3001/api/field-state | jq '.' 2>/dev/null || \
        echo "Service not running or jq not installed"
        ;;
    gcp)
        echo "☁️ GCP Architecture Diagram..."
        xdg-open "http://localhost:8339/.sacred/tools/gcp-architecture-diagram.html" 2>/dev/null || \
        echo "Visit: http://localhost:8339/.sacred/tools/gcp-architecture-diagram.html"
        ;;
    db)
        echo "💾 Opening sacred databases..."
        cd /home/tstoltz/evolving-resonant-cocreation
        if [ -f "the-weave/cli/unified-agent-network.db" ]; then
            sqlite3 the-weave/cli/unified-agent-network.db
        else
            echo "Database not found"
        fi
        ;;
    test)
        echo "🧪 Running safety system tests..."
        cd /home/tstoltz/evolving-resonant-cocreation/.sacred/tools
        node validate-safety-system.js
        ;;
    help)
        echo "Sacred Development Toolkit - Enhanced"
        echo ""
        echo "Commands:"
        echo "  check <file>  - Run safety checks"
        echo "  monitor       - Open monitoring dashboard"
        echo "  field         - Check field coherence"
        echo "  gcp           - View GCP architecture"
        echo "  db            - Open sacred database"
        echo "  test          - Run safety tests"
        echo "  help          - Show this help"
        ;;
    *)
        sacred help
        ;;
esac
EOF
chmod +x ~/bin/sacred

# Update PATH if needed
if ! grep -q "$HOME/bin" ~/.bashrc; then
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
fi

# Add enhanced aliases
if ! grep -q "# Sacred Development Aliases - Enhanced" ~/.bashrc; then
    cat >> ~/.bashrc << 'EOF'

# Sacred Development Aliases - Enhanced
alias scheck='sacred check'
alias smon='sacred monitor'
alias sfield='sacred field'
alias sgcp='sacred gcp'
alias sdb='sacred db'
alias stest='sacred test'

# Enhanced safety check with bat
safety() {
    if [ -z "$1" ]; then
        echo "Usage: safety <filename>"
        return 1
    fi
    sacred check "$1" && echo "" && echo "📄 File preview:" && (bat --line-range=1:20 "$1" 2>/dev/null || batcat --line-range=1:20 "$1" 2>/dev/null || head -20 "$1")
}

# Pretty JSON viewing
jqp() {
    if [ -z "$1" ]; then
        echo "Usage: jqp <json-file>"
        return 1
    fi
    jq '.' "$1" | bat -l json 2>/dev/null || jq '.' "$1" | batcat -l json 2>/dev/null || jq '.' "$1"
}

# HTTP with pretty output
http-pretty() {
    http "$@" | jq '.' | bat -l json 2>/dev/null || http "$@" | jq '.' | batcat -l json 2>/dev/null || http "$@" | jq '.'
}

# Enhanced dev status
dev-status() {
    echo "🌟 Sacred Development Status"
    echo "=========================="
    echo ""
    echo "📁 Current directory: $(pwd)"
    echo "🌿 Git branch: $(git branch --show-current 2>/dev/null || echo 'not a git repo')"
    echo "📦 Node version: $(node --version)"
    echo "🐍 Python version: $(python3 --version)"
    echo "🐳 Docker version: $(docker --version 2>/dev/null | cut -d' ' -f3 | cut -d',' -f1)"
    echo ""
    echo "🛠️ Sacred Tools:"
    echo "  ✓ Safety System: $(command -v sacred &>/dev/null && echo 'Ready' || echo 'Not installed')"
    echo "  ✓ SQLite3: $(command -v sqlite3 &>/dev/null && echo 'Ready' || echo 'Not installed')"
    echo "  ✓ jq: $(command -v jq &>/dev/null && echo 'Ready' || echo 'Not installed')"
    echo "  ✓ ripgrep: $(command -v rg &>/dev/null && echo 'Ready' || echo 'Not installed')"
    echo "  ✓ bat: $(command -v bat &>/dev/null || command -v batcat &>/dev/null && echo 'Ready' || echo 'Not installed')"
    echo ""
    echo "📊 Monitoring: http://localhost:8339/.sacred/tools/safety-dashboard.html"
    echo "🌐 GCP Diagram: http://localhost:8339/.sacred/tools/gcp-architecture-diagram.html"
}

# Quick project navigation
erc() {
    cd /home/tstoltz/evolving-resonant-cocreation
}

# Sacred tools directory
sacred-tools() {
    cd /home/tstoltz/evolving-resonant-cocreation/.sacred/tools
}

# Weave directory
weave() {
    cd /home/tstoltz/evolving-resonant-cocreation/the-weave
}
EOF
fi

echo ""
echo "✅ Sacred Development Toolkit Installation Complete!"
echo "=================================================="
echo ""
echo "🎯 Next Steps:"
echo "1. Run: source ~/.bashrc"
echo "   (or open a new terminal)"
echo ""
echo "2. Test the installation:"
echo "   dev-status     # Check all tools"
echo "   sacred help    # See sacred commands"
echo "   safety README.md  # Test safety check with preview"
echo ""
echo "📋 New Sacred Commands:"
echo "  sacred check   - Safety check files"
echo "  sacred monitor - Open dashboard"
echo "  sacred field   - Check field coherence"
echo "  sacred gcp     - View architecture"
echo "  sacred db      - Open sacred database"
echo "  sacred test    - Run safety tests"
echo ""
echo "🛠️ Installed Tools:"
echo "  ✓ sqlite3 - Database management"
echo "  ✓ jq - JSON processing"
echo "  ✓ ripgrep - Fast searching"
echo "  ✓ bat - Syntax highlighted viewing"
echo "  ✓ httpie - Beautiful HTTP client"
echo "  ✓ tree - Directory visualization"
echo "  ✓ ncdu - Interactive disk usage"
echo "  ✓ htop - Process monitoring"
echo "  ✓ iotop - I/O monitoring"
echo "  ✓ nethogs - Network monitoring"
echo ""
echo "May your development serve consciousness! 🙏✨"