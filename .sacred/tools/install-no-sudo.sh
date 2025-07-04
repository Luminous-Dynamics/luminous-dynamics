#!/bin/bash
# 🛠️ Sacred Development Toolkit - No Sudo Required
# Creates helpful commands and aliases without system packages

set -e

echo "🌟 Sacred Development Setup (No Sudo)"
echo "===================================="
echo ""

# Create local bin if it doesn't exist
mkdir -p ~/bin
export PATH="$HOME/bin:$PATH"

# Create sacred command
echo "📦 Creating sacred command..."
cat > ~/bin/sacred << 'EOF'
#!/bin/bash
# Sacred Development Command

case "$1" in
    check)
        echo "🔍 Running sacred safety checks..."
        cd /home/tstoltz/evolving-resonant-cocreation
        node .sacred/tools/universal-safety-manager.js "${@:2}"
        ;;
    monitor)
        echo "📊 Opening sacred monitoring..."
        echo "Visit: http://localhost:8339/.sacred/tools/safety-dashboard.html"
        ;;
    field)
        echo "🌀 Checking field coherence..."
        if command -v curl &> /dev/null; then
            curl -s http://localhost:3001/api/field-state 2>/dev/null || echo "Service not running"
        fi
        ;;
    gcp)
        echo "☁️ GCP Architecture Diagram..."
        echo "Visit: http://localhost:8339/.sacred/tools/gcp-architecture-diagram.html"
        ;;
    help)
        echo "Sacred Development Toolkit"
        echo ""
        echo "Commands:"
        echo "  check <file>  - Run safety checks"
        echo "  monitor       - Open monitoring dashboard"
        echo "  field         - Check field coherence"
        echo "  gcp           - View GCP architecture"
        echo "  help          - Show this help"
        ;;
    *)
        sacred help
        ;;
esac
EOF
chmod +x ~/bin/sacred

# Add to PATH in bashrc if not present
if ! grep -q "$HOME/bin" ~/.bashrc; then
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
fi

# Create helpful aliases
echo ""
echo "📦 Setting up aliases..."

# Add aliases if not present
if ! grep -q "# Sacred Development Aliases" ~/.bashrc; then
    cat >> ~/.bashrc << 'EOF'

# Sacred Development Aliases
alias scheck='sacred check'
alias smon='sacred monitor'
alias sfield='sacred field'
alias sgcp='sacred gcp'

# Quick safety check
safety() {
    if [ -z "$1" ]; then
        echo "Usage: safety <filename>"
        return 1
    fi
    sacred check "$1"
}

# Development status
dev-status() {
    echo "🌟 Sacred Development Status"
    echo "=========================="
    echo ""
    echo "📁 Current directory: $(pwd)"
    echo "🌿 Git branch: $(git branch --show-current 2>/dev/null || echo 'not a git repo')"
    echo "📦 Node version: $(node --version)"
    echo "🐍 Python version: $(python3 --version)"
    echo ""
    echo "🛡️ Safety System: Ready"
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
EOF
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Run: source ~/.bashrc"
echo "2. Try: sacred help"
echo "3. Test: sacred check README.md"
echo ""
echo "📋 Available Commands:"
echo "  sacred check <file> - Safety check"
echo "  sacred monitor      - Dashboard"
echo "  sacred field        - Field status"
echo "  sacred gcp          - Architecture"
echo "  dev-status          - Dev environment"
echo "  erc                 - Jump to project"
echo ""
echo "💡 For system packages (sqlite3, bat, etc),"
echo "   run with sudo when you have terminal access:"
echo "   sudo apt install sqlite3 bat httpie"
echo ""
echo "May your development serve consciousness! 🙏"