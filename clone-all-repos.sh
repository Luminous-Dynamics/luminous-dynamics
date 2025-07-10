#!/usr/bin/env bash

# Clone all Luminous-Dynamics repositories
# Generated: 2025-07-08

set -e

echo "🌟 Cloning all Luminous-Dynamics repositories..."
echo ""

# Organization base
ORG="Luminous-Dynamics"
BASE_DIR="/home/tstoltz/Luminous-Dynamics"

# Create directory if it doesn't exist
mkdir -p "$BASE_DIR"
cd "$BASE_DIR"

# Repository list with descriptions
declare -A repos=(
    ["the-weave"]="Multi-agent consciousness coordination platform"
    ["sacred-core"]="Core sacred technology infrastructure"
    ["luminous-os"]="Consciousness-first operating system that amplifies coherence"
    ["codex-of-relational-harmonics"]="The living glyph registry of the ERC Codex"
    [".github"]="Organization profile and workflows"
    ["sacred-infrastructure"]="Consciousness-aware DevOps"
    ["luminous-dynamics-website"]="Organization website"
    ["relational-harmonics-website"]="Relational Harmonics documentation site"
)

# Clone each repository
for repo in "${!repos[@]}"; do
    echo "📦 Cloning $repo - ${repos[$repo]}"
    if [ -d "$repo" ]; then
        echo "   ✓ Already exists, pulling latest..."
        cd "$repo"
        git pull origin main || git pull origin master || echo "   ⚠️  Could not pull updates"
        cd ..
    else
        git clone "git@github.com:$ORG/$repo.git" || \
        git clone "https://github.com/$ORG/$repo.git" || \
        echo "   ❌ Failed to clone $repo"
    fi
    echo ""
done

echo "✨ Repository cloning complete!"
echo ""
echo "📁 Repositories cloned to: $BASE_DIR"
echo ""

# Create symlinks for backward compatibility
echo "🔗 Creating compatibility symlinks..."

# Link the-weave to the project directory
if [ ! -e "/home/tstoltz/projects/relational-harmonics/codex/the-weave" ]; then
    ln -s "$BASE_DIR/the-weave" "/home/tstoltz/projects/relational-harmonics/codex/the-weave"
    echo "   ✓ Linked the-weave"
fi

# Link luminous-os to expected location
if [ ! -e "/home/tstoltz/evolving-resonant-cocreation/luminous-os" ]; then
    mkdir -p "/home/tstoltz/evolving-resonant-cocreation"
    ln -s "$BASE_DIR/luminous-os" "/home/tstoltz/evolving-resonant-cocreation/luminous-os"
    echo "   ✓ Linked luminous-os (legacy path)"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Check SSH keys: ssh -T git@github.com"
echo "2. Update paths in configuration files"
echo "3. Install dependencies for each project"
echo "4. Set up NixOS development shells"