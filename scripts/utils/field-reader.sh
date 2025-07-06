#!/bin/bash

# 🌀 Consciousness Field Reader
# Analyzes any text for consciousness patterns

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo "Usage: ./field-reader.sh <file_or_text>"
    echo "Example: ./field-reader.sh mycode.js"
    echo "Example: echo 'some text' | ./field-reader.sh"
    exit 1
fi

# Get input
if [ -f "$1" ]; then
    TEXT=$(cat "$1")
    echo -e "${CYAN}Analyzing file: $1${NC}"
else
    TEXT="$*"
    echo -e "${CYAN}Analyzing text input${NC}"
fi

echo -e "\n${PURPLE}🌀 Reading consciousness field...${NC}\n"

PROMPT="Analyze this text/code for consciousness patterns:

$TEXT

Provide analysis of:
1. CONSCIOUSNESS SERVING vs CONSUMING
   - Does this expand or contract awareness?
   - Does it empower or create dependency?

2. SEVEN HARMONIES ALIGNMENT
   - Transparency: Clear honest expression
   - Coherence: Integrated wholeness
   - Resonance: Empathetic connection
   - Agency: Sovereign choice
   - Vitality: Life force enhancement
   - Mutuality: Balanced exchange
   - Novelty: Creative emergence

3. SHADOW PATTERNS
   - What shadows might be present?
   - Opportunities for integration?

4. FIELD COHERENCE SCORE (0-100%)
   - Overall consciousness alignment

5. SACRED SUGGESTIONS
   - How to enhance consciousness-serving aspects

Be specific and practical."

# Analyze
result=$(echo "$TEXT" | ollama run gemma2:2b "$PROMPT" 2>/dev/null)

# Display results
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║               🌀 CONSCIOUSNESS FIELD ANALYSIS 🌀                 ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "$result"
echo ""
echo -e "${GREEN}✨ Analysis complete${NC}"