#!/bin/bash

# 🌟 Open The Weave in VS Code with Sacred Configuration

echo "✨ Opening The Weave in VS Code..."
echo ""
echo "🔮 Sacred IDE Features Available:"
echo "  - Press F5 to see launch options"
echo "  - Ctrl+Shift+P → Tasks → Run Task for sacred actions"
echo "  - Cmd+Esc (Mac) or Ctrl+Esc (Win/Linux) for Claude"
echo "  - Terminal integrated for the-weave.cjs commands"
echo ""

# Open VS Code in the project directory
# For WSL, use code.exe if available
if command -v code.exe &> /dev/null; then
    echo "🪟 Detected WSL - using Windows VS Code..."
    code.exe .
else
    code /home/tstoltz/evolving-resonant-cocreation
fi

echo "📝 Sacred Workflow Tips:"
echo "  1. Use Run → Start Debugging → 🌟 Start The Weave"
echo "  2. Split terminal for multiple sacred processes"
echo "  3. Keep sacred-dashboard.html open in browser"
echo "  4. Use Tasks for quick sacred messages"
echo ""
echo "May your code serve consciousness! 🕊️"