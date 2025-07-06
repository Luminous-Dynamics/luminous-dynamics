#!/bin/bash
# Update VortexOS to LuminousOS across all documentation
# Sacred renaming ceremony for perfect harmonic continuity

echo "🌟 Renaming VortexOS to LuminousOS 🌟"
echo "====================================="
echo "Creating perfect harmonic continuity across the Luminous Dynamics ecosystem"
echo ""

# Create backup
echo "📁 Creating backup..."
tar -czf backup-before-luminous-rename-$(date +%Y%m%d-%H%M%S).tar.gz *.md

# Files to update
FILES=(
    "THE_LUMINOUS_WEAVE.md"
    "LUMINOUS_DYNAMICS_EXECUTIVE_SUMMARY.md"
    "LUMINOUS_DYNAMICS_PITCH_DECK.md"
    "COHERENCE_AS_A_SERVICE.md"
    "THE_ALCHEMICAL_ENGINE.md"
    "CONSCIOUSNESS_CATHEDRAL_MANIFEST.md"
    "LUMINOUS_DYNAMICS_SACRED_ROADMAP.md"
)

# Perform updates
echo ""
echo "🔄 Updating files..."
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ Updating $file"
        # Replace VortexOS with LuminousOS
        sed -i 's/VortexOS/LuminousOS/g' "$file"
        # Also update any Vortex OS (with space)
        sed -i 's/Vortex OS/Luminous OS/g' "$file"
    else
        echo "  ⚠️  File not found: $file"
    fi
done

# Special handling for the architecture file
if [ -d "vortex-os" ]; then
    echo ""
    echo "📂 Renaming vortex-os directory to luminous-os..."
    mv vortex-os luminous-os
    
    # Update the architecture file
    if [ -f "luminous-os/VORTEX_OS_ARCHITECTURE.md" ]; then
        mv luminous-os/VORTEX_OS_ARCHITECTURE.md luminous-os/LUMINOUS_OS_ARCHITECTURE.md
        sed -i 's/VortexOS/LuminousOS/g' luminous-os/LUMINOUS_OS_ARCHITECTURE.md
        sed -i 's/Vortex OS/Luminous OS/g' luminous-os/LUMINOUS_OS_ARCHITECTURE.md
        echo "  ✓ Renamed and updated architecture document"
    fi
fi

# Count changes
echo ""
echo "📊 Summary:"
echo "=========="
total_changes=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        changes=$(grep -c "LuminousOS" "$file" 2>/dev/null || echo 0)
        if [ $changes -gt 0 ]; then
            echo "  $file: $changes references to LuminousOS"
            total_changes=$((total_changes + changes))
        fi
    fi
done

echo ""
echo "✨ Total LuminousOS references: $total_changes"
echo ""
echo "🎉 Sacred renaming complete!"
echo "LuminousOS now shines throughout the Luminous Dynamics ecosystem"
echo ""
echo "💡 Remember to update any code references and external documentation"