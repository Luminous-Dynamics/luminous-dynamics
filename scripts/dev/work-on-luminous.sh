#!/bin/bash

# Convenience script for working with LuminousOS
# Both paths point to the same files thanks to symbolic link

echo "🌟 LuminousOS Development Helper"
echo "================================"
echo ""
echo "📁 Repository Paths:"
echo "   Working: /home/tstoltz/evolving-resonant-cocreation/luminous-os (symlink)"
echo "   Git:     /home/tstoltz/luminous-os (actual repo)"
echo ""

case "$1" in
    "status")
        echo "📊 Git Status:"
        cd /home/tstoltz/luminous-os
        git status --short
        ;;
        
    "diff")
        echo "📝 Git Diff:"
        cd /home/tstoltz/luminous-os
        git diff
        ;;
        
    "commit")
        if [ -z "$2" ]; then
            echo "❌ Usage: ./work-on-luminous.sh commit \"Your commit message\""
            exit 1
        fi
        echo "💾 Committing changes..."
        cd /home/tstoltz/luminous-os
        git add .
        git commit -m "$2"
        ;;
        
    "push")
        echo "🚀 Pushing to GitHub..."
        cd /home/tstoltz/luminous-os
        git push origin main
        ;;
        
    "pull")
        echo "📥 Pulling from GitHub..."
        cd /home/tstoltz/luminous-os
        git pull origin main
        ;;
        
    "build")
        echo "🔨 Building LuminousOS..."
        cd /home/tstoltz/luminous-os
        cargo build --release
        ;;
        
    "test")
        echo "🧪 Running tests..."
        cd /home/tstoltz/luminous-os
        cargo test
        ;;
        
    *)
        echo "Available commands:"
        echo "  ./work-on-luminous.sh status  - Show git status"
        echo "  ./work-on-luminous.sh diff    - Show uncommitted changes"
        echo "  ./work-on-luminous.sh commit \"message\" - Commit changes"
        echo "  ./work-on-luminous.sh push    - Push to GitHub"
        echo "  ./work-on-luminous.sh pull    - Pull from GitHub"
        echo "  ./work-on-luminous.sh build   - Build the OS"
        echo "  ./work-on-luminous.sh test    - Run tests"
        echo ""
        echo "💡 Tip: You can work in either location - they're the same!"
        ;;
esac