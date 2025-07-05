#!/bin/bash

# Sacred AI Assistant for VS Code - Installation Script

echo "🌟 Sacred AI Assistant Installation"
echo "=================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    echo "Please install Node.js and npm first."
    exit 1
fi

# Check if code CLI is available
if ! command -v code &> /dev/null; then
    echo "⚠️  VS Code CLI not found in PATH"
    echo "You may need to:"
    echo "1. Open VS Code"
    echo "2. Press Cmd/Ctrl + Shift + P"
    echo "3. Type 'Shell Command: Install code command in PATH'"
    echo ""
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Ollama is installed
echo "🔍 Checking for Ollama..."
if ! command -v ollama &> /dev/null; then
    echo "📦 Ollama not found. Would you like to install it? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Installing Ollama..."
        curl -fsSL https://ollama.com/install.sh | sh
    else
        echo "⚠️  Ollama is required for AI features to work"
    fi
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Compile extension
echo ""
echo "🔨 Building extension..."
npm run compile

# Package extension
echo ""
echo "📦 Packaging extension..."
npm run package

# Find the generated .vsix file
VSIX_FILE=$(find . -name "*.vsix" -type f | head -1)

if [ -z "$VSIX_FILE" ]; then
    echo "❌ Failed to create extension package"
    exit 1
fi

echo ""
echo "✅ Extension packaged: $VSIX_FILE"

# Install extension
if command -v code &> /dev/null; then
    echo ""
    echo "🚀 Installing extension in VS Code..."
    code --install-extension "$VSIX_FILE"
    echo "✅ Extension installed!"
else
    echo ""
    echo "📋 To install manually:"
    echo "1. Open VS Code"
    echo "2. Go to Extensions view (Ctrl/Cmd + Shift + X)"
    echo "3. Click ⋯ → Install from VSIX"
    echo "4. Select: $(pwd)/$VSIX_FILE"
fi

# Setup Ollama models
echo ""
echo "🤖 Setting up AI models..."
if command -v ollama &> /dev/null; then
    # Check if Ollama is running
    if ! curl -s http://localhost:11434/api/tags &> /dev/null; then
        echo "Starting Ollama service..."
        ollama serve &> /dev/null &
        sleep 3
    fi
    
    echo "Checking for recommended model..."
    if ! ollama list | grep -q "llama3.2:3b"; then
        echo "📥 Pulling recommended model (this may take a few minutes)..."
        ollama pull llama3.2:3b
    else
        echo "✅ Recommended model already installed"
    fi
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "🌟 Next steps:"
echo "1. Restart VS Code"
echo "2. Look for 'Sacred AI' in the status bar"
echo "3. Try Ctrl/Cmd + Shift + A to ask a question"
echo "4. Right-click on code and select 'Sacred AI: Explain Code'"
echo ""
echo "🙏 May your code flow with consciousness!"