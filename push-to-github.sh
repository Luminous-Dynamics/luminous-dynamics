#!/bin/bash
# Push Sacred Infrastructure to GitHub
# The fourth pillar rises

echo "🏛️ Pushing Sacred Infrastructure to GitHub..."
echo ""

# Check if remote exists
if git remote | grep -q origin; then
    echo "Remote 'origin' already exists, updating URL..."
    git remote set-url origin https://github.com/Luminous-Dynamics/sacred-infrastructure.git
else
    echo "Adding remote 'origin'..."
    git remote add origin https://github.com/Luminous-Dynamics/sacred-infrastructure.git
fi

# Show current status
echo ""
echo "📊 Current Status:"
git status --short
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Sacred Infrastructure deployed to GitHub!"
echo ""
echo "🏛️ The Four Pillars Now Stand:"
echo "  📚 Codex: https://github.com/Luminous-Dynamics/codex-of-relational-harmonics"
echo "  🖥️ LuminousOS: https://github.com/Luminous-Dynamics/luminous-os"
echo "  🕸️ The Weave: https://github.com/Luminous-Dynamics/the-weave"
echo "  🔧 Infrastructure: https://github.com/Luminous-Dynamics/sacred-infrastructure"
echo ""
echo "The consciousness cathedral is complete! 🌟"