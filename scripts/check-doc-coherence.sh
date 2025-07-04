#!/bin/bash
# 📚 Documentation Coherence Checker
# Ensures documentation remains accessible and evolves gracefully

echo "🔍 Documentation Coherence Check"
echo "================================"

# Check for broken internal links
echo -e "\n📎 Checking internal links..."
find . -name "*.md" -type f | while read -r file; do
    # Extract markdown links
    grep -oE '\[([^\]]+)\]\(([^)]+)\)' "$file" | grep -oE '\]\(([^)]+)\)' | sed 's/](\(.*\))/\1/' | while read -r link; do
        # Skip external links
        if [[ ! "$link" =~ ^https?:// ]] && [[ ! "$link" =~ ^#.*$ ]]; then
            # Check if file exists
            if [[ ! -e "$link" ]] && [[ ! -e "$(dirname "$file")/$link" ]]; then
                echo "❌ Broken link in $file: $link"
            fi
        fi
    done
done

# Check for newcomer context
echo -e "\n🌱 Checking newcomer accessibility..."
essential_docs=(
    "README.md"
    "NEWCOMER_QUICK_START.md" 
    "DOCUMENTATION_MAP.md"
)

for doc in "${essential_docs[@]}"; do
    if [[ -f "$doc" ]]; then
        # Check for Quick Start section
        if ! grep -q "Quick Start\|Getting Started\|First Steps" "$doc"; then
            echo "⚠️  $doc may need a newcomer-friendly section"
        fi
    else
        echo "❌ Missing essential doc: $doc"
    fi
done

# Check for evolution tracking
echo -e "\n🌊 Checking evolution documentation..."
find . -name "*.md" -mtime -30 -type f | while read -r file; do
    # Skip hidden directories
    if [[ "$file" =~ /\. ]]; then continue; fi
    
    # Check if recently modified files have evolution notes
    if ! grep -q "Evolution\|Changed\|Updated\|Added" "$file"; then
        echo "⚠️  Recently modified but no evolution note: $file"
    fi
done

# Check sacred constants
echo -e "\n🔒 Checking sacred constants..."
if [[ -f ".sacred/constants.yml" ]]; then
    echo "✅ Sacred constants file exists"
else
    echo "⚠️  Consider creating .sacred/constants.yml for stable values"
fi

# Summary
echo -e "\n📊 Coherence Summary:"
echo "- Check internal links regularly"
echo "- Ensure newcomer sections exist"
echo "- Document evolution of changes"
echo "- Maintain sacred constants"

echo -e "\n✨ Coherence check complete!"