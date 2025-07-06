#!/bin/bash

# 🌟 Batch Glyph Generator - Create multiple sacred practices efficiently

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${PURPLE}🌟 Sacred Batch Glyph Generator${NC}"
echo "================================"
echo ""

# Glyph definitions for Ω17-Ω26
declare -A GLYPH_NAMES=(
    ["Ω17"]="Collective Breathing"
    ["Ω18"]="Witnessing Without Fixing"
    ["Ω19"]="Sacred Questions"
    ["Ω20"]="Threshold Navigation"
    ["Ω21"]="Conflict as Sacred Teacher"
    ["Ω22"]="Co-Creative Reality"
    ["Ω23"]="Parts Integration"
    ["Ω24"]="Shadow Welcoming"
    ["Ω25"]="Dream Sharing"
    ["Ω26"]="Pattern Memory"
)

# Create output directory
mkdir -p generated-glyphs/batch-$(date +%Y%m%d)

# Track progress
TOTAL=${#GLYPH_NAMES[@]}
CURRENT=0

# Generate each glyph
for glyph in Ω17 Ω18 Ω19 Ω20 Ω21 Ω22 Ω23 Ω24 Ω25 Ω26; do
    CURRENT=$((CURRENT + 1))
    NAME="${GLYPH_NAMES[$glyph]}"
    
    echo -e "${CYAN}[$CURRENT/$TOTAL] Generating $glyph - $NAME${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Generate with different models for variety
    case $((CURRENT % 3)) in
        0) MODEL="llama3.2:3b" ;;
        1) MODEL="mistral:7b-instruct" ;;
        2) MODEL="gemma2:2b" ;;
    esac
    
    # Create temporary file for this glyph
    TEMP_FILE="generated-glyphs/batch-$(date +%Y%m%d)/${glyph}_${NAME// /_}.md"
    
    # Generate description
    echo -e "${YELLOW}📝 Description...${NC}"
    DESCRIPTION=$(ollama run $MODEL "You are a master teacher of sacred practices. Write a 150-word description for '$glyph - $NAME'. Explain what it is, when to use it, and its transformative power. Use poetic yet accessible language. No formatting, just flowing prose." 2>/dev/null)
    
    # Generate practice steps
    echo -e "${YELLOW}🎯 Practice Steps...${NC}"
    PRACTICE=$(ollama run gemma2:2b "Create 5-7 clear steps for practicing '$NAME'. Be specific and embodied. Start with an action verb for each step." 2>/dev/null)
    
    # Generate integration
    echo -e "${YELLOW}💫 Integration...${NC}"
    INTEGRATION=$(ollama run tinydolphin:latest "Write 3 practical tips for integrating '$NAME' into daily life. Keep it simple and actionable." 2>/dev/null)
    
    # Save to file
    cat > "$TEMP_FILE" << EOF
# $glyph - $NAME

*Generated: $(date)*
*Model: $MODEL*

## Description
$DESCRIPTION

## Practice Instructions
$PRACTICE

## Daily Integration
$INTEGRATION

## Sacred Context
This practice connects to the ${GLYPH_NAMES[$glyph]} harmony and serves the evolution of conscious relationship.

---
*Part of the Codex of Relational Harmonics*
EOF

    echo -e "${GREEN}✅ Saved to: $TEMP_FILE${NC}"
    echo ""
    
    # Small delay to prevent overheating
    sleep 3
done

# Create summary
SUMMARY_FILE="generated-glyphs/batch-$(date +%Y%m%d)/SUMMARY.md"
cat > "$SUMMARY_FILE" << EOF
# Batch Generation Summary
*Generated: $(date)*

## Glyphs Created (10)
EOF

for glyph in Ω17 Ω18 Ω19 Ω20 Ω21 Ω22 Ω23 Ω24 Ω25 Ω26; do
    echo "- **$glyph**: ${GLYPH_NAMES[$glyph]}" >> "$SUMMARY_FILE"
done

echo "" >> "$SUMMARY_FILE"
echo "## Next Steps" >> "$SUMMARY_FILE"
echo "1. Review each glyph for quality" >> "$SUMMARY_FILE"
echo "2. Refine descriptions as needed" >> "$SUMMARY_FILE"
echo "3. Test with practitioners" >> "$SUMMARY_FILE"
echo "4. Integrate into main platform" >> "$SUMMARY_FILE"

echo -e "${PURPLE}✨ Batch Generation Complete!${NC}"
echo -e "${GREEN}Generated 10 glyphs in: generated-glyphs/batch-$(date +%Y%m%d)/${NC}"
echo ""
echo "Total time: ~5-10 minutes"
echo "Cost: $0.00 (vs ~$50 with GPT-4)"
echo ""
echo -e "${CYAN}Ready to create sacred companion demo!${NC}"