#!/bin/bash
# ◉ ◉ Sacred Shell Installation Script

echo "◉ ◉ Installing Sacred Shell..."
echo "=============================="

# Check Python version
python_version=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+')
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Python $required_version or higher is required (found $python_version)"
    exit 1
fi

echo "✓ Python $python_version found"

# Install requirements
echo ""
echo "Installing Python dependencies..."
pip3 install --user -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Make scripts executable
chmod +x sacred_shell.py
chmod +x sacred_shell_enhanced.py
chmod +x demo.py

# Create alias (optional)
echo ""
echo "Would you like to create a 'sacred-shell' alias? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    sacred_shell_path="$(pwd)/sacred_shell.py"
    
    # Add to appropriate shell config
    if [ -n "$ZSH_VERSION" ]; then
        echo "alias sacred-shell='python3 $sacred_shell_path'" >> ~/.zshrc
        echo "✓ Added alias to ~/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        echo "alias sacred-shell='python3 $sacred_shell_path'" >> ~/.bashrc
        echo "✓ Added alias to ~/.bashrc"
    fi
    
    echo "   Reload your shell or run: source ~/.bashrc (or ~/.zshrc)"
fi

echo ""
echo "✨ Sacred Shell installed successfully!"
echo ""
echo "To start Sacred Shell:"
echo "  python3 sacred_shell.py"
echo ""
echo "To see a demo:"
echo "  python3 demo.py"
echo ""
echo "For enhanced version with better UI:"
echo "  python3 sacred_shell_enhanced.py"
echo ""
echo "◉ ◉ May your terminal experience be mindful!"