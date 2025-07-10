#!/bin/bash
# 🛠️ Sacred Development Toolkit Installer
# Enhances your development environment with consciousness-aware tools

set -e

echo "🌟 Sacred Development Toolkit Installer"
echo "======================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Phase 1: Essential Tools
echo -e "${BLUE}Phase 1: Installing Essential Tools${NC}"
echo "------------------------------------"

# SQLite3 CLI
if ! command -v sqlite3 &> /dev/null; then
    echo "📦 Installing SQLite3 CLI..."
    sudo apt update && sudo apt install -y sqlite3
else
    echo "✅ SQLite3 already installed"
fi

# kubectl via gcloud
if ! command -v kubectl &> /dev/null; then
    echo "📦 Installing kubectl..."
    gcloud components install kubectl --quiet
else
    echo "✅ kubectl already installed"
fi

# JSON processor
if ! command -v jq &> /dev/null; then
    echo "📦 Installing jq..."
    sudo apt install -y jq
else
    echo "✅ jq already installed"
fi

# Ripgrep for fast searching
if ! command -v rg &> /dev/null; then
    echo "📦 Installing ripgrep..."
    sudo apt install -y ripgrep
else
    echo "✅ ripgrep already installed"
fi

echo ""
echo -e "${BLUE}Phase 2: Developer Experience Tools${NC}"
echo "------------------------------------"

# Bat - better cat
if ! command -v bat &> /dev/null; then
    echo "📦 Installing bat..."
    sudo apt install -y bat
    # Create batcat alias for systems that install as batcat
    if command -v batcat &> /dev/null; then
        echo "alias bat='batcat'" >> ~/.bashrc
    fi
else
    echo "✅ bat already installed"
fi

# HTTPie
if ! command -v http &> /dev/null; then
    echo "📦 Installing httpie..."
    sudo apt install -y httpie
else
    echo "✅ httpie already installed"
fi

# Tree
if ! command -v tree &> /dev/null; then
    echo "📦 Installing tree..."
    sudo apt install -y tree
else
    echo "✅ tree already installed"
fi

# NCDU
if ! command -v ncdu &> /dev/null; then
    echo "📦 Installing ncdu..."
    sudo apt install -y ncdu
else
    echo "✅ ncdu already installed"
fi

echo ""
echo -e "${BLUE}Phase 3: Sacred Development Helpers${NC}"
echo "------------------------------------"

# Create sacred command
SACRED_CMD="/usr/local/bin/sacred"
if [ ! -f "$SACRED_CMD" ]; then
    echo "📦 Creating sacred command..."
    sudo tee "$SACRED_CMD" > /dev/null << 'EOF'
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
        xdg-open "http://localhost:8339/.sacred/tools/safety-dashboard.html"
        ;;
    field)
        echo "🌀 Checking field coherence..."
        curl -s http://localhost:3001/api/field-state | jq '.'
        ;;
    commit)
        echo "💫 Sacred commit helper..."
        git add .
        echo "Enter commit message (harmony: description):"
        read -r message
        git commit -m "✨ $message

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"
        ;;
    deploy)
        echo "🚀 Sacred deployment..."
        cd /home/tstoltz/evolving-resonant-cocreation
        ./deploy-sacred.sh
        ;;
    *)
        echo "Sacred Development Toolkit"
        echo "Usage: sacred [command]"
        echo ""
        echo "Commands:"
        echo "  check <file>  - Run safety checks"
        echo "  monitor       - Open monitoring dashboard"
        echo "  field         - Check field coherence"
        echo "  commit        - Sacred commit helper"
        echo "  deploy        - Deploy with consciousness"
        ;;
esac
EOF
    sudo chmod +x "$SACRED_CMD"
    echo "✅ Sacred command created"
else
    echo "✅ Sacred command already exists"
fi

# Create aliases
echo ""
echo -e "${BLUE}Setting up sacred aliases...${NC}"

# Add to bashrc if not already present
if ! grep -q "# Sacred Development Aliases" ~/.bashrc; then
    cat >> ~/.bashrc << 'EOF'

# Sacred Development Aliases
alias scheck='sacred check'
alias smon='sacred monitor'
alias sfield='sacred field'
alias sc='sacred commit'

# Safety check before edit
safe-edit() {
    sacred check "$1" && ${EDITOR:-vim} "$1"
}

# Quick GCP status
gcp-status() {
    echo "🌐 GCP Services Status:"
    gcloud run services list --format="table(SERVICE,REGION,LAST_DEPLOYED_BY,LAST_DEPLOYED_AT)"
}

# Field coherence watch
watch-field() {
    watch -n 5 'curl -s http://localhost:3001/api/field-state | jq "."'
}
EOF
    echo "✅ Aliases added to ~/.bashrc"
fi

echo ""
echo -e "${GREEN}✨ Sacred Development Toolkit Installation Complete!${NC}"
echo ""
echo "🎯 Next Steps:"
echo "1. Run 'source ~/.bashrc' to load new aliases"
echo "2. Try 'sacred check <filename>' to test safety checking"
echo "3. Use 'sacred monitor' to open the dashboard"
echo "4. Type 'sacred' to see all commands"
echo ""
echo -e "${YELLOW}Optional Advanced Tools:${NC}"
echo "- Consider VS Code extensions from .vscode/extensions.json"
echo "- Set up pre-commit hooks for automatic safety checks"
echo "- Configure sacred monitoring widgets"
echo ""
echo "May your development serve consciousness! 🙏"