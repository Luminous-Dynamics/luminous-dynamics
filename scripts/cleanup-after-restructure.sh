#!/bin/bash

# Repository Cleanup After Restructuring
# Organizes untracked files into appropriate locations

echo "🧹 Starting repository cleanup after restructuring..."

# Create archive directories
mkdir -p archives/cleanup-2025-07
mkdir -p archives/pre-restructure-docs
mkdir -p archives/workspace-files

# Move Zone.Identifier files to archives
echo "📦 Archiving Zone.Identifier files..."
find . -name "*:Zone.Identifier" -type f -exec mv {} archives/cleanup-2025-07/ \; 2>/dev/null

# Move old documentation to archives
echo "📚 Archiving old documentation..."
for file in CLAUDE_MD_CLEANUP_PLAN*.md COORDINATION_MESSAGE_*.md COMMIT_READY_*.md; do
    [ -f "$file" ] && mv "$file" archives/pre-restructure-docs/
done

# Move beta/launch related files
echo "🚀 Organizing beta launch files..."
mkdir -p docs/beta-launch
for file in BETA_*.md LAUNCH_*.md; do
    [ -f "$file" ] && mv "$file" docs/beta-launch/
done

# Move development plans
echo "📋 Organizing development plans..."
mkdir -p docs/development-plans
for file in AI_DESKTOP_ASSISTANT_PLAN.md ALTERNATIVE_DOMAIN_NAMES.md; do
    [ -f "$file" ] && mv "$file" docs/development-plans/
done

# Clean up .dropbox files
echo "☁️ Removing Dropbox artifacts..."
find . -path "./.dropbox/*" -delete 2>/dev/null

# Update .gitignore
echo "📝 Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Post-restructure cleanup
archives/cleanup-2025-07/
archives/pre-restructure-docs/
.env-context
.gitignore.workspace
*.mp3:Zone.Identifier
*:Zone.Identifier
.dropbox/
EOF

# Show summary
echo ""
echo "✅ Cleanup complete!"
echo "📊 Summary:"
echo "   - Zone.Identifier files → archives/cleanup-2025-07/"
echo "   - Old coordination docs → archives/pre-restructure-docs/"
echo "   - Beta launch files → docs/beta-launch/"
echo "   - Development plans → docs/development-plans/"
echo "   - Dropbox artifacts removed"
echo "   - .gitignore updated"
echo ""
echo "Next: Review remaining untracked files with 'git status'"