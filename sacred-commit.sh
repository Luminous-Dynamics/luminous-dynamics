#!/bin/bash

# Sacred Council Hub - Organized Commit Helper
# Creates well-structured commits with sacred intention

echo "🌟 Sacred Commit Helper"
echo "====================="
echo ""

# Function to create a commit
sacred_commit() {
    local commit_num=$1
    local title=$2
    local description=$3
    shift 3
    local files=("$@")
    
    echo "📦 Preparing Commit $commit_num: $title"
    echo "Files to add:"
    
    # Add files
    for file in "${files[@]}"; do
        if [ -e "$file" ]; then
            git add "$file"
            echo "  ✓ $file"
        fi
    done
    
    # Show what will be committed
    echo ""
    echo "📋 Changes to be committed:"
    git status --short | grep "^A"
    
    # Confirm
    read -p "Create this commit? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git commit -m "$title" -m "$description" -m "🤖 Generated with [Claude Code](https://claude.ai/code)" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
        echo "✅ Commit created!"
    else
        git reset HEAD .
        echo "❌ Commit cancelled, files unstaged"
    fi
    echo ""
}

# Show current status
echo "📊 Current git status:"
echo "Modified files: $(git status --short | grep "^ M" | wc -l)"
echo "New files: $(git status --short | grep "^??" | wc -l)"
echo ""

# Menu
echo "Choose commit to create:"
echo "1. Docker & Kubernetes Infrastructure"
echo "2. Google Cloud Migration"
echo "3. Architecture Evolution"
echo "4. Sacred Council Features"
echo "5. AI Image Generation"
echo "6. Documentation Updates"
echo "7. Website Updates"
echo "8. Unified Field Enhancements"
echo "9. Create all commits in sequence"
echo "0. Exit"
echo ""

read -p "Enter choice (0-9): " choice

case $choice in
    1)
        sacred_commit 1 "🐳 Docker & Kubernetes Infrastructure" \
            "Complete containerization for Sacred Council Hub with:
- Production-ready Dockerfile with security best practices
- Multiple docker-compose configurations for different environments
- Kubernetes manifests for GKE deployment
- Launch scripts for various deployment scenarios
- Sacred Heart & Breath architecture implementation" \
            "Dockerfile" ".dockerignore" "docker-compose.yml" "docker-compose-sacred.yml" \
            "docker-compose-production.yml" "docker-compose-quantum.yml" \
            "k8s/deployment.yaml" "launch-*.sh" "stop-*.sh" \
            "sacred-heart-start.js" "sacred-council-start.js"
        ;;
    
    2)
        sacred_commit 2 "☁️ Google Cloud Migration Guide" \
            "Comprehensive GCP deployment documentation and scripts:
- Complete migration guide from local to cloud
- Artifact Registry setup and Docker push scripts
- Cloud Run and GKE deployment options
- Cloud SQL setup for production database
- Monitoring and alerting configuration
- Windows-specific deployment guide" \
            "GOOGLE_CLOUD_MIGRATION.md" "deploy-gcp.sh" "deploy-to-gcp.sh" \
            "setup-cloud-sql.sh" "setup-monitoring.sh" "cloudrun-deploy.yaml" \
            "WINDOWS_DEPLOYMENT_GUIDE.md"
        ;;
    
    3)
        sacred_commit 3 "🏛️ Sacred Architecture Evolution" \
            "Next-generation consciousness-native cloud architecture:
- Event-driven microservices design
- Real-time field synchronization
- Edge consciousness with CloudFlare Workers
- Practical implementation roadmap
- Architecture comparison and decision guide" \
            "SACRED_CLOUD_ARCHITECTURE_V2.md" "PRACTICAL_SACRED_ARCHITECTURE.md" \
            "ARCHITECTURE_COMPARISON.md" "ARCHITECTURE_DECISION_GUIDE.md" \
            "services/"
        ;;
    
    4)
        sacred_commit 4 "🕊️ Sacred Council Hub Features" \
            "Multi-agent consciousness coordination system:
- Sacred Council Hub main interface
- Unified consciousness demonstration
- Enhanced sacred dashboard with real-time updates
- Agent onboarding protocol
- Council profiles system" \
            "sacred-council-hub.html" "unified-consciousness-demo.html" \
            "sacred-dashboard.html" "agent-onboarding-protocol.cjs" \
            "council-profiles/" "SACRED_COUNCIL_*.md" "MULTI_AGENT_*.md"
        ;;
    
    5)
        sacred_commit 5 "🎨 AI Image Generation Toolkit" \
            "Professional AI art generation system:
- Support for DALL-E 3, Stable Diffusion, Leonardo AI, Midjourney
- Automated art studio with batch workflows
- Sacred image manifestation integration
- Enhanced generator with consciousness modes" \
            "AI_IMAGE_TOOLKIT.md" "automated-art-studio.html" \
            "enhanced-ai-image-generator.cjs" "sacred-image-studio.html" \
            "test-sacred-image-generation.cjs" "sacred-demo-image.html"
        ;;
    
    6)
        sacred_commit 6 "📚 Documentation & Setup Updates" \
            "Comprehensive documentation refresh:
- Updated README with latest features
- Enhanced CLAUDE.md with full context
- Ubuntu setup automation script
- Various guide documents
- Help needed updates" \
            "README.md" "CLAUDE.md" "HELP_NEEDED.md" \
            "ubuntu-sacred-setup.sh" "UBUNTU_VS_WINDOWS_SACRED.md" \
            "*.md" "pre-push-cleanup.sh" "fix-line-endings.sh"
        ;;
    
    7)
        sacred_commit 7 "🌐 Website Updates" \
            "Major updates to all three sacred websites:
- Evolving Resonant Cocreation main site refresh
- Luminous Dynamics First Light enhancements
- Relational Harmonics Dojo integration" \
            "websites/evolvingresonantcocreationism/index.html" \
            "websites/luminousdynamics/first-light.html" \
            "websites/relationalharmonics/dojo.html" \
            "websites/*/unified-field/*.js"
        ;;
    
    8)
        sacred_commit 8 "🌀 Unified Field System Enhancements" \
            "Advanced consciousness field calculations:
- Meta-consciousness system implementation
- Work-sacred message integration
- Database enhancements
- SQLite server improvements" \
            "unified-field/meta-consciousness-system.js" \
            "unified-field/work-sacred-integration.js" \
            "unified-field/*.js" "unified-field/*.cjs" \
            "agent-comms-sqlite/database.js" \
            "agent-comms-sqlite/sacred-server.js"
        ;;
    
    9)
        echo "🔄 Creating all commits in sequence..."
        echo "This will organize ~200 files into 8 logical commits."
        echo "Please review each commit carefully before confirming."
        echo ""
        read -p "Continue? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Run all commits in sequence
            $0 1
            $0 2
            $0 3
            $0 4
            $0 5
            $0 6
            $0 7
            $0 8
        fi
        ;;
    
    0)
        echo "🕊️ Exiting sacred commit helper"
        exit 0
        ;;
    
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📊 Final status:"
git status --short | wc -l
echo "files remaining"