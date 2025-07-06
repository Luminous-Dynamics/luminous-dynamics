#!/bin/bash
# Fix line endings for all shell scripts
# Useful for WSL environments

echo "🔧 Fixing line endings for WSL compatibility..."

# Find all .sh files and fix their line endings
find . -name "*.sh" -type f -exec sed -i 's/\r$//' {} \;

echo "✅ Fixed line endings for all .sh files"
echo ""
echo "Making all scripts executable..."
find . -name "*.sh" -type f -exec chmod +x {} \;

echo "✅ All scripts are now executable"