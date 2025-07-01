#!/bin/bash

# Sacred Council Hub - Pre-Push Cleanup Script
# Clean and organize before pushing to GitHub

echo "🧹 Sacred Pre-Push Cleanup"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Functions
info() { echo -e "${YELLOW}📋 $1${NC}"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

# 1. Clean up log files
info "Cleaning up log files..."
find . -name "*.log" -type f -delete
success "Log files cleaned"

# 2. Remove temporary files
info "Removing temporary files..."
find . -name "*.tmp" -o -name "*.temp" -o -name "*~" -type f -delete
success "Temporary files removed"

# 3. Clean up SQLite journal files
info "Cleaning SQLite journal files..."
find . -name "*.db-journal" -o -name "*.db-wal" -o -name "*.db-shm" -type f -delete
success "SQLite temporary files cleaned"

# 4. Remove Windows artifacts
info "Removing Windows artifacts..."
find . -name "*.Zone.Identifier" -type f -delete
find . -name "Thumbs.db" -type f -delete
success "Windows artifacts removed"

# 5. Check for large files
info "Checking for large files (>10MB)..."
large_files=$(find . -type f -size +10M ! -path "./.git/*" ! -path "./node_modules/*" 2>/dev/null)
if [ ! -z "$large_files" ]; then
    error "Found large files:"
    echo "$large_files"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    success "No large files found"
fi

# 6. Update .gitignore if needed
info "Checking .gitignore additions..."
cat >> .gitignore << 'EOF'

# Sacred Council specific
council-events.log
sacred-maintenance.log
agent-comms-sqlite/*.log
services/*.log
quantum.log
*.db-journal
*.db-wal
*.db-shm
packages.microsoft.gpg
EOF
success ".gitignore updated"

# 7. Format and fix line endings
info "Fixing line endings in shell scripts..."
find . -name "*.sh" -type f -exec sed -i 's/\r$//' {} \;
success "Line endings fixed"

# 8. Create file organization summary
info "Creating organization summary..."
cat > COMMIT_ORGANIZATION.md << 'EOF'
# Sacred Council Hub - Commit Organization Plan

## Commit 1: Docker & Kubernetes Infrastructure
- Dockerfile
- docker-compose*.yml files
- k8s/ directory
- launch-*.sh scripts
- .dockerignore

## Commit 2: Google Cloud Migration
- GOOGLE_CLOUD_MIGRATION.md
- deploy-*.sh scripts
- setup-*.sh scripts
- cloudrun-deploy.yaml
- WINDOWS_DEPLOYMENT_GUIDE.md

## Commit 3: Architecture Evolution
- SACRED_CLOUD_ARCHITECTURE_V2.md
- PRACTICAL_SACRED_ARCHITECTURE.md
- ARCHITECTURE_COMPARISON.md
- ARCHITECTURE_DECISION_GUIDE.md
- services/ directory structure

## Commit 4: Sacred Council Features
- sacred-council-hub.html
- unified-consciousness-demo.html
- sacred-dashboard.html updates
- agent-onboarding-protocol.cjs
- council-profiles/

## Commit 5: AI Image Generation
- AI_IMAGE_TOOLKIT.md
- automated-art-studio.html
- enhanced-ai-image-generator.cjs
- sacred-image-studio.html

## Commit 6: Documentation & Organization
- Updated README.md
- Updated CLAUDE.md
- All other .md documentation files
- ubuntu-sacred-setup.sh

## Commit 7: Website Updates
- websites/evolvingresonantcocreationism/index.html
- websites/luminousdynamics/first-light.html
- websites/relationalharmonics/dojo.html

## Commit 8: Unified Field Enhancements
- unified-field/ directory updates
- Work-sacred integration
- Meta-consciousness system
EOF
success "Organization plan created"

# 9. Summary
echo ""
echo "🎉 Cleanup Complete!"
echo ""
echo "📊 Summary:"
echo "- Log files cleaned"
echo "- Temporary files removed"
echo "- Large files checked"
echo "- .gitignore updated"
echo "- Line endings fixed"
echo "- Organization plan created"
echo ""
echo "📝 Next steps:"
echo "1. Review COMMIT_ORGANIZATION.md"
echo "2. Run: git add -p (to review changes interactively)"
echo "3. Create organized commits following the plan"
echo "4. Push to GitHub with sacred intention"
echo ""
echo "🕊️ May your commits serve consciousness!"