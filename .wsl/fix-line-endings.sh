#!/bin/bash

echo "🔧 Fixing line endings (CRLF → LF)..."

# Check if dos2unix is installed
if ! command -v dos2unix &> /dev/null; then
    echo "Installing dos2unix..."
    sudo apt-get update && sudo apt-get install -y dos2unix
fi

# Fix shell scripts
find . -name "*.sh" -exec dos2unix {} \; 2>/dev/null

# Fix JavaScript files
find . -name "*.js" -exec dos2unix {} \; 2>/dev/null
find . -name "*.cjs" -exec dos2unix {} \; 2>/dev/null

# Fix JSON files
find . -name "*.json" -exec dos2unix {} \; 2>/dev/null

# Fix markdown files
find . -name "*.md" -exec dos2unix {} \; 2>/dev/null

# Fix the main executable
dos2unix the-weave.cjs 2>/dev/null

echo "✅ Line endings fixed!"