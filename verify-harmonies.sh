#!/bin/bash
# Verify Seven Harmonies structure and services

echo "🌟 Verifying Seven Harmonies Structure..."
echo

# Check harmony directories
echo "📁 Checking Harmony Directories:"
for i in {00..09}; do
  if [ -d "$i"* ]; then
    dir=$(ls -d $i* | head -1)
    count=$(find "$dir" -type f | wc -l)
    echo "  ✓ $dir - $count files"
  fi
done
echo

# Check sacred documents
echo "📜 Sacred Documents:"
[ -f "CHARTER.md" ] && echo "  ✓ CHARTER.md present" || echo "  ✗ CHARTER.md missing"
[ -f "HARMONIES.md" ] && echo "  ✓ HARMONIES.md present" || echo "  ✗ HARMONIES.md missing"
[ -f "README.md" ] && echo "  ✓ README.md present" || echo "  ✗ README.md missing"
[ -f "CLAUDE.md" ] && echo "  ✓ CLAUDE.md present" || echo "  ✗ CLAUDE.md missing"
echo

# Check core services locations
echo "🔮 Core Services:"
services=(
  "01-resonant-coherence/core/the-weave"
  "01-resonant-coherence/core/sacred-core"
  "01-resonant-coherence/core/unified-field"
  "02-pan-sentient-flourishing/core/living-field-visualizer"
  "03-integral-wisdom/core/codex"
  "05-universal-interconnectedness/core/bridge-of-bridges"
  "07-evolutionary-progression/core/luminous-os"
)

for service in "${services[@]}"; do
  if [ -d "$service" ]; then
    echo "  ✓ $service"
  else
    echo "  ✗ $service NOT FOUND"
  fi
done
echo

# Check running services
echo "🌊 Running Services:"
if curl -s http://localhost:3333/health > /dev/null 2>&1; then
  echo "  ✓ Sacred Core API (port 3333) - ACTIVE"
else
  echo "  ✗ Sacred Core API (port 3333) - NOT RESPONDING"
fi

# Count total files organized
total_files=$(find . -type f | wc -l)
echo
echo "📊 Summary:"
echo "  Total files organized: $total_files"
echo "  Git status: $(git status --porcelain | wc -l) uncommitted changes"
echo
echo "✨ Seven Harmonies structure verification complete!"