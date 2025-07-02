#!/bin/bash

echo "🔧 Fixing WSL permissions..."

# Fix all shell scripts
find . -name "*.sh" -exec chmod +x {} \; 2>/dev/null

# Fix all CommonJS scripts
find . -name "*.cjs" -exec chmod +x {} \; 2>/dev/null

# Fix specific important files
chmod +x the-weave.cjs 2>/dev/null
chmod +x .wsl/*.sh 2>/dev/null

# Fix directories
find . -type d -exec chmod 755 {} \; 2>/dev/null

echo "✅ Permissions fixed!"