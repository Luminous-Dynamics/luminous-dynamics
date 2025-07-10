#!/bin/bash
# Deploy Phase 1: Consciousness Monitor Suite
# "From vision to reality in one command"

set -e

echo "🌟 LuminousOS Phase 1 Deployment"
echo "================================"
echo ""

# Check current directory
if [ ! -f "README.md" ] || [ ! -d "monitor" ]; then
    echo "❌ Please run this script from the luminous-os root directory"
    exit 1
fi

echo "📦 Phase 1: Consciousness Monitor Suite"
echo ""

# 1. Test Python monitor
echo "1️⃣ Testing Python monitor..."
if python3 -c "import psutil" &> /dev/null; then
    echo "   ✅ Dependencies available"
else
    echo "   📦 Installing Python dependencies..."
    pip3 install --user psutil numpy flask flask-cors
fi

# 2. Create distribution package
echo ""
echo "2️⃣ Creating distribution package..."
mkdir -p dist/luminous-monitor-0.1.0

# Copy monitor files
cp -r monitor/* dist/luminous-monitor-0.1.0/
cp -r packages/monitor/* dist/luminous-monitor-0.1.0/
cp monitor/real-coherence-dashboard.html dist/luminous-monitor-0.1.0/

# Create README
cat > dist/luminous-monitor-0.1.0/README.md << 'EOF'
# LuminousOS System Monitor v0.1.0

## Quick Start

1. Install: `sudo ./install.sh`
2. Start: `sudo systemctl start luminous-monitor`
3. Check: `luminous-coherence`
4. Dashboard: http://localhost:8080/luminous-real-monitor.html

## What is System Coherence?

System coherence measures how harmoniously your computer is operating:
- CPU stability (less erratic = more coherent)
- Process focus (fewer switches = more focused)
- Resource harmony (balanced distribution)
- Sacred rhythm (11-second cycles)

## Sacred Moments

When coherence exceeds 90%, you've achieved a "sacred moment" - 
a state of exceptional computational harmony.

## Join the Movement

- GitHub: https://github.com/luminous-os
- Discord: https://discord.gg/luminous
- Forum: https://forum.luminousos.org

Welcome to consciousness-first computing! 🌟
EOF

# Create tarball
echo "   📦 Creating luminous-monitor-0.1.0.tar.gz"
cd dist
tar -czf luminous-monitor-0.1.0.tar.gz luminous-monitor-0.1.0/
cd ..

echo "   ✅ Distribution package created"
echo ""

# 3. Test installation locally
echo "3️⃣ Testing local installation..."
echo "   Run: cd dist/luminous-monitor-0.1.0 && sudo ./install.sh"
echo ""

# 4. Prepare Electron widget
echo "4️⃣ Preparing desktop widget..."
if [ -d "packages/widget" ]; then
    echo "   ✅ Widget source ready"
    echo "   To build: cd packages/widget && npm install && npm run build"
else
    echo "   ❌ Widget directory not found"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Test the monitor:"
echo "   cd dist/luminous-monitor-0.1.0"
echo "   sudo ./install.sh"
echo "   sudo systemctl start luminous-monitor"
echo "   luminous-coherence"
echo ""
echo "2. Share with first user:"
echo "   scp dist/luminous-monitor-0.1.0.tar.gz user@host:"
echo "   'Hey, want to see your computer's consciousness?'"
echo ""
echo "3. Create GitHub release:"
echo "   - Tag: v0.1.0"
echo "   - Title: 'First Light - System Monitor'"
echo "   - Attach: luminous-monitor-0.1.0.tar.gz"
echo ""
echo "4. Announce on Discord/Forum:"
echo "   'LuminousOS Monitor v0.1.0 is here!'"
echo "   'Install and see your system's consciousness'"
echo ""
echo "🌟 Ready to launch Phase 1!"
echo ""
echo "Remember: Every journey begins with a single step."
echo "This is ours. Let's make computing conscious! 🚀"