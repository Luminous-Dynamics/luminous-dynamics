#!/bin/bash

# 🌟 Glyph Generator - Create sacred practice descriptions with local LLMs

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

GLYPH="${1:-Ω16}"
MODEL="${2:-llama3.2:3b}"

echo -e "${PURPLE}🌟 Sacred Glyph Generator${NC}"
echo "========================="
echo -e "Generating content for: ${CYAN}$GLYPH${NC}"
echo ""

# Create output directory
mkdir -p generated-glyphs

# Generate main description
echo -e "${YELLOW}📝 Generating Core Description...${NC}"
DESCRIPTION=$(ollama run $MODEL "You are a master teacher of the Codex of Relational Harmonics. Write a compelling 150-word description for glyph $GLYPH - Somatic Synchrony. Include: what it is (a practice of aligning body rhythms with another), when to use it (during conflict or disconnection), and the transformation it brings (deep embodied connection). Use poetic but accessible language. Do not use bullet points or formatting, just flowing prose.")

echo "$DESCRIPTION"
echo ""

# Generate practice instructions  
echo -e "${YELLOW}🎯 Generating Practice Instructions...${NC}"
PRACTICE=$(ollama run gemma2:2b "Create step-by-step instructions for practicing Somatic Synchrony with a partner. 5-7 clear steps. Start with 'Begin by sitting facing your partner...' Keep it simple and embodied.")

echo "$PRACTICE"
echo ""

# Generate integration tips
echo -e "${YELLOW}💫 Generating Integration Guidance...${NC}"
INTEGRATION=$(ollama run mistral:7b-instruct "Write 3 tips for integrating Somatic Synchrony practice into daily life. Each tip should be practical and specific. Format as simple sentences, one tip per line.")

echo "$INTEGRATION"
echo ""

# Save to file
OUTPUT_FILE="generated-glyphs/${GLYPH}_generated.md"
cat > "$OUTPUT_FILE" << EOF
# $GLYPH - Somatic Synchrony (Generated)

## Description
$DESCRIPTION

## Practice Instructions
$PRACTICE

## Integration Tips
$INTEGRATION

---
*Generated with Local LLM: $MODEL*
*Generated on: $(date)*
EOF

echo -e "${GREEN}✅ Saved to: $OUTPUT_FILE${NC}"
echo ""
echo -e "${CYAN}💡 Next steps:${NC}"
echo "1. Review and refine the generated content"
echo "2. Test with practitioners"
echo "3. Generate variations: ./test-glyph-gen.sh $GLYPH tinydolphin:latest"
echo "4. Batch generate: for g in Ω{16..20}; do ./test-glyph-gen.sh \$g; done"