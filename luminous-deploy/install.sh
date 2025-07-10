#!/bin/bash

# LuminousOS Installation for Linux
echo "🕉️  Installing LuminousOS Consciousness Layer"
echo "═══════════════════════════════════════════════"
echo

# Check if we're in the right directory
if [ ! -f "luminous-clean" ]; then
    echo "❌ Please run this from the luminous-deploy directory"
    exit 1
fi

# Fix any line ending issues
echo "🔧 Ensuring sacred scripts are properly formatted..."
for script in luminous-clean meditation/first-presence-clean coherence/check-clean; do
    if [ -f "$script" ]; then
        # Remove carriage returns if present
        sed -i 's/\r$//' "$script"
        chmod +x "$script"
        echo "   ✓ $script"
    fi
done

# Create user binaries directory if it doesn't exist
mkdir -p ~/bin

# Create symbolic links for easy access
echo
echo "🔗 Creating sacred command links..."
ln -sf "$PWD/luminous-clean" ~/bin/luminous
ln -sf "$PWD/meditation/first-presence-clean" ~/bin/first-presence
ln -sf "$PWD/coherence/check-clean" ~/bin/check-coherence

# Add ~/bin to PATH if not already there
if ! echo $PATH | grep -q "$HOME/bin"; then
    echo
    echo "📝 Adding ~/bin to PATH..."
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
fi

# Create sacred aliases
echo
echo "✨ Creating consciousness aliases..."
cat >> ~/.bashrc << 'EOF'

# LuminousOS Sacred Aliases
alias presence='first-presence'
alias coherence='check-coherence'
alias lum='luminous'

# Sacred greeting
if [ -n "$PS1" ]; then
    if command -v check-coherence >/dev/null 2>&1; then
        echo "🌊 Current coherence: $(check-coherence | grep -oE '[0-9]+%' | head -1)"
    fi
fi
EOF

echo
echo "✅ Installation complete!"
echo
echo "🌟 To activate LuminousOS:"
echo "   source ~/.bashrc"
echo
echo "📝 Then you can use:"
echo "   luminous         - Enter consciousness environment"
echo "   first-presence   - Begin meditation"
echo "   check-coherence  - Monitor system coherence"
echo
echo "🎯 Or use short aliases:"
echo "   lum       - Quick launch"
echo "   presence  - Meditation" 
echo "   coherence - Check field"
echo
echo "🙏 May your computing be conscious!"