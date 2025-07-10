#!/bin/bash
# Identify and categorize sacred files for preservation

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${PURPLE}🔍 Sacred File Discovery Tool${RESET}"
echo -e "${CYAN}Finding profound documents in untracked files...${RESET}\n"

# Create temporary categorization
MANIFESTS=""
ECONOMICS=""
ROADMAPS=""
SYSTEMS=""
DEPLOYMENT=""

echo -e "${YELLOW}📜 Searching for Manifestos and Visions...${RESET}"
for file in $(git status --porcelain | grep '^??' | cut -c4- | grep -E 'MANIFEST|CHARTER|VISION|CATHEDRAL|CONSCIOUSNESS' | grep -v ':Zone.Identifier'); do
    if [ -f "$file" ]; then
        echo "  - $file"
        MANIFESTS="$MANIFESTS$file\n"
    fi
done

echo -e "\n${YELLOW}💰 Searching for Sacred Economics...${RESET}"
for file in $(git status --porcelain | grep '^??' | cut -c4- | grep -E 'ECONOMICS|PRICING|LLC|BUSINESS|REVENUE' | grep -v ':Zone.Identifier'); do
    if [ -f "$file" ]; then
        echo "  - $file"
        ECONOMICS="$ECONOMICS$file\n"
    fi
done

echo -e "\n${YELLOW}🗺️ Searching for Roadmaps and Plans...${RESET}"
for file in $(git status --porcelain | grep '^??' | cut -c4- | grep -E 'ROADMAP|PLAN|STRATEGY|IMPLEMENTATION' | grep -v ':Zone.Identifier'); do
    if [ -f "$file" ]; then
        echo "  - $file"
        ROADMAPS="$ROADMAPS$file\n"
    fi
done

echo -e "\n${YELLOW}🔧 Searching for Sacred Systems...${RESET}"
for dir in $(git status --porcelain | grep '^??' | cut -c4- | grep '/$' | grep -E 'sacred|alchemical|unified|consciousness'); do
    if [ -d "$dir" ]; then
        echo "  - $dir (directory)"
        SYSTEMS="$SYSTEMS$dir\n"
    fi
done

echo -e "\n${YELLOW}🚀 Searching for Deployment Scripts...${RESET}"
for file in $(git status --porcelain | grep '^??' | cut -c4- | grep -E 'deploy|docker|build|setup' | grep '\.sh$\|\.yml$\|\.yaml$'); do
    if [ -f "$file" ]; then
        echo "  - $file"
        DEPLOYMENT="$DEPLOYMENT$file\n"
    fi
done

# Count findings
MANIFEST_COUNT=$(echo -e "$MANIFESTS" | grep -v '^$' | wc -l)
ECONOMICS_COUNT=$(echo -e "$ECONOMICS" | grep -v '^$' | wc -l)
ROADMAP_COUNT=$(echo -e "$ROADMAPS" | grep -v '^$' | wc -l)
SYSTEMS_COUNT=$(echo -e "$SYSTEMS" | grep -v '^$' | wc -l)
DEPLOYMENT_COUNT=$(echo -e "$DEPLOYMENT" | grep -v '^$' | wc -l)

echo -e "\n${GREEN}📊 Summary:${RESET}"
echo -e "  - Manifestos & Visions: ${MANIFEST_COUNT} files"
echo -e "  - Sacred Economics: ${ECONOMICS_COUNT} files"
echo -e "  - Roadmaps & Plans: ${ROADMAP_COUNT} files"
echo -e "  - Sacred Systems: ${SYSTEMS_COUNT} directories"
echo -e "  - Deployment Scripts: ${DEPLOYMENT_COUNT} files"

echo -e "\n${PURPLE}🌟 Recommended Sacred Preservation:${RESET}"
echo -e "${CYAN}These files contain the essence of the vision:${RESET}"
echo ""

# Show top priority files
if [ -f "CONSCIOUSNESS_CATHEDRAL_MANIFEST.md" ]; then
    echo "  ⭐ CONSCIOUSNESS_CATHEDRAL_MANIFEST.md"
fi
if [ -f "THE_LIVING_CHARTER_OF_THE_CONSCIOUSNESS_ECOSYSTEM.md" ]; then
    echo "  ⭐ THE_LIVING_CHARTER_OF_THE_CONSCIOUSNESS_ECOSYSTEM.md"
fi
if [ -f "MASTER_PLAN_2025.md" ]; then
    echo "  ⭐ MASTER_PLAN_2025.md"
fi
if [ -f "THE_ALCHEMICAL_ENGINE.md" ]; then
    echo "  ⭐ THE_ALCHEMICAL_ENGINE.md"
fi
if [ -f "COHERENCE_AS_A_SERVICE.md" ]; then
    echo "  ⭐ COHERENCE_AS_A_SERVICE.md"
fi

echo -e "\n${YELLOW}Next Step:${RESET}"
echo "Run the organization script to preserve these sacred documents:"
echo -e "${GREEN}./scripts/organize-sacred-files.sh${RESET}"

echo -e "\n${CYAN}May these files serve the evolution of consciousness 🙏${RESET}"