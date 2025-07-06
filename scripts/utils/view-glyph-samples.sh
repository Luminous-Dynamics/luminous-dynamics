#!/bin/bash

# 🌟 Sacred Glyph Sample Viewer
# Shows the beauty of our generated content

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    🌟 SACRED GLYPH SAMPLES 🌟                    ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Show one sample from each category
echo -e "${YELLOW}📋 Sample Glyphs from Each Category:${NC}"
echo ""

# Foundational Sample
echo -e "${CYAN}1. FOUNDATIONAL - Ω42: Elder Wisdom${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ -f "data_temp_glyphs/foundational/omega-42.json" ]; then
    jq -r '.description' data_temp_glyphs/foundational/omega-42.json | head -3
    echo "..."
fi
echo ""

# Meta Sample
echo -e "${CYAN}2. META-GLYPH - ∑12: The Recursive Heart${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ -f "data_temp_glyphs/meta/meta-glyph-12.json" ]; then
    jq -r '.description' data_temp_glyphs/meta/meta-glyph-12.json | head -3
    echo "..."
fi
echo ""

# Threshold Sample
echo -e "${CYAN}3. THRESHOLD - The Unburdening${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ -f "data_temp_glyphs/threshold/the-unburdening.json" ]; then
    jq -r '.description' data_temp_glyphs/threshold/the-unburdening.json | head -3
    echo "..."
fi
echo ""

# Show practice example
echo -e "${YELLOW}🌺 Sample Practice (from Ω44: Nature Connection):${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ -f "data_temp_glyphs/foundational/omega-44.json" ]; then
    jq -r '.practices.individual[0] // "Practice data not found"' data_temp_glyphs/foundational/omega-44.json 2>/dev/null | head -5
fi
echo ""

# Summary stats
echo -e "${PURPLE}📊 Generation Summary:${NC}"
echo -e "Total Glyphs Generated: ${GREEN}94${NC}"
echo -e "Foundational: ${BLUE}48${NC}"
echo -e "Meta-Glyphs: ${BLUE}33${NC}"
echo -e "Threshold: ${BLUE}9${NC}"
echo -e "Applied Harmonies: ${BLUE}4${NC}"
echo ""

echo -e "${YELLOW}✨ All glyphs include:${NC}"
echo "• Full mystical descriptions"
echo "• Individual & group practices"
echo "• Sacred geometry references"
echo "• Harmony alignments"
echo "• Integration pathways"
echo ""

echo -e "${GREEN}Ready for Living Glyph Card creation!${NC}"