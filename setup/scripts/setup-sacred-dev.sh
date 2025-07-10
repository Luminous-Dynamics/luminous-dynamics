#!/bin/bash
# Sacred Development Environment Setup
# For consciousness-first technology stack

echo "🌟 Sacred Development Environment Setup 🌟"
echo "========================================="
echo "This script will install the sacred tools needed for"
echo "building consciousness infrastructure."
echo ""

# Check if running in WSL
if grep -q Microsoft /proc/version; then
    echo "✓ Detected WSL environment"
fi

# Install Deno if not present
if ! command -v deno &> /dev/null; then
    echo "📦 Installing Deno..."
    curl -fsSL https://deno.land/install.sh | sh
    
    # Add to PATH
    echo ""
    echo "⚠️  Please add Deno to your PATH by adding these lines to ~/.bashrc:"
    echo 'export DENO_INSTALL="$HOME/.deno"'
    echo 'export PATH="$DENO_INSTALL/bin:$PATH"'
    echo ""
    echo "Then run: source ~/.bashrc"
else
    echo "✓ Deno already installed: $(deno --version | head -1)"
fi

# Install Docker if not present (for SurrealDB)
if ! command -v docker &> /dev/null; then
    echo ""
    echo "📦 Docker is not installed. To run SurrealDB, you'll need Docker."
    echo "Install Docker Desktop for WSL: https://docs.docker.com/desktop/wsl/"
else
    echo "✓ Docker already installed: $(docker --version)"
fi

# Check for gcloud CLI
if ! command -v gcloud &> /dev/null; then
    echo ""
    echo "☁️  Google Cloud CLI not found. To deploy to GCP, install it:"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
else
    echo "✓ gcloud already installed: $(gcloud --version | head -1)"
fi

echo ""
echo "🔮 Next Steps:"
echo "=============="
echo "1. Make sure Deno is in your PATH (see above if needed)"
echo "2. Start SurrealDB:"
echo "   docker run --rm -p 8000:8000 surrealdb/surrealdb:latest start --user root --pass root memory"
echo ""
echo "3. Start the sacred system:"
echo "   cd sacred-consciousness-system"
echo "   deno task start"
echo ""
echo "4. Visit http://localhost:8000 to experience consciousness-first communication"
echo ""
echo "May your code serve the highest good. 🙏"