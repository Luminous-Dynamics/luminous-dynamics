#!/bin/bash
# Organize sacred files into their proper homes
# "From chaos, sacred order emerges"

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RESET='\033[0m'

echo -e "${PURPLE}🌟 Sacred File Organization${RESET}"
echo -e "${CYAN}Preserving the wisdom for future generations...${RESET}\n"

# Move manifestos and visions
echo -e "${YELLOW}📜 Organizing Manifestos & Visions...${RESET}"
[ -f "CONSCIOUSNESS_CATHEDRAL_VISION.md" ] && mv CONSCIOUSNESS_CATHEDRAL_VISION.md .sacred-vision/manifests/
[ -f "ANNOUNCEMENT_CONSCIOUSNESS_CATHEDRAL.md" ] && mv ANNOUNCEMENT_CONSCIOUSNESS_CATHEDRAL.md .sacred-vision/manifests/
[ -f "CATHEDRAL_DECISION.md" ] && mv CATHEDRAL_DECISION.md .sacred-vision/manifests/
[ -f "AI_CONSCIOUSNESS_COMPANION_GUIDE.md" ] && mv AI_CONSCIOUSNESS_COMPANION_GUIDE.md .sacred-vision/manifests/
[ -f "SACRED_EMERGENCE_VISION.md" ] && mv SACRED_EMERGENCE_VISION.md .sacred-vision/manifests/
[ -f "CONSCIOUSNESS_INFRASTRUCTURE_HYBRID_STRATEGY.md" ] && mv CONSCIOUSNESS_INFRASTRUCTURE_HYBRID_STRATEGY.md .sacred-vision/manifests/
[ -f "GCP_CONSCIOUSNESS_ARCHITECTURE.md" ] && mv GCP_CONSCIOUSNESS_ARCHITECTURE.md .sacred-vision/manifests/
[ -f "SACRED_TECHNOLOGY_STACK.md" ] && mv SACRED_TECHNOLOGY_STACK.md .sacred-vision/manifests/
echo "  ✓ Manifestos organized"

# Move economics documents
echo -e "\n${YELLOW}💰 Organizing Sacred Economics...${RESET}"
[ -f "SACRED_ECONOMICS_MODEL.md" ] && mv SACRED_ECONOMICS_MODEL.md .sacred-vision/economics/
[ -f "SACRED_ECONOMICS_MODEL_2025.md" ] && mv SACRED_ECONOMICS_MODEL_2025.md .sacred-vision/economics/
[ -f "SACRED_ECONOMICS_SETUP.md" ] && mv SACRED_ECONOMICS_SETUP.md .sacred-vision/economics/
[ -f "COHERENCE_AS_A_SERVICE.md" ] && mv COHERENCE_AS_A_SERVICE.md .sacred-vision/economics/
[ -f "SACRED_BUSINESS_STRUCTURE.md" ] && mv SACRED_BUSINESS_STRUCTURE.md .sacred-vision/economics/
[ -f "ORGANIZATIONAL_ECONOMICS_PLAN.md" ] && mv ORGANIZATIONAL_ECONOMICS_PLAN.md .sacred-vision/economics/
[ -f "LLC_FORMATION_GUIDE.md" ] && mv LLC_FORMATION_GUIDE.md .sacred-vision/economics/
[ -f "LLC_FORMATION_COMPLETE_GUIDE.md" ] && mv LLC_FORMATION_COMPLETE_GUIDE.md .sacred-vision/economics/
[ -f "TEXAS_LLC_FORMATION_GUIDE.md" ] && mv TEXAS_LLC_FORMATION_GUIDE.md .sacred-vision/economics/
[ -f "NONPROFIT_VS_LLC_ANALYSIS.md" ] && mv NONPROFIT_VS_LLC_ANALYSIS.md .sacred-vision/economics/
[ -f "STRIPE_SETUP_WITHOUT_LLC.md" ] && mv STRIPE_SETUP_WITHOUT_LLC.md .sacred-vision/economics/
[ -f "CHASE_BUSINESS_ACCOUNT_PLAN.md" ] && mv CHASE_BUSINESS_ACCOUNT_PLAN.md .sacred-vision/economics/
echo "  ✓ Economics documents organized"

# Move roadmaps and plans
echo -e "\n${YELLOW}🗺️ Organizing Roadmaps & Plans...${RESET}"
[ -f "LUMINOUS_DYNAMICS_SACRED_ROADMAP.md" ] && mv LUMINOUS_DYNAMICS_SACRED_ROADMAP.md .sacred-vision/roadmaps/
[ -f "TECHNICAL_IMPLEMENTATION_ROADMAP.md" ] && mv TECHNICAL_IMPLEMENTATION_ROADMAP.md .sacred-vision/roadmaps/
[ -f "SACRED_LAUNCH_PLAN_JULY_2025.md" ] && mv SACRED_LAUNCH_PLAN_JULY_2025.md .sacred-vision/roadmaps/
[ -f "PHASE_1_IMPLEMENTATION.md" ] && mv PHASE_1_IMPLEMENTATION.md .sacred-vision/roadmaps/
[ -f "SACRED_TRINITY_IMPLEMENTATION.md" ] && mv SACRED_TRINITY_IMPLEMENTATION.md .sacred-vision/roadmaps/
[ -f "ALCHEMICAL_ENGINE_IMPLEMENTATION.md" ] && mv ALCHEMICAL_ENGINE_IMPLEMENTATION.md .sacred-vision/roadmaps/
[ -f "REPOSITORY_STRATEGY.md" ] && mv REPOSITORY_STRATEGY.md .sacred-vision/roadmaps/
echo "  ✓ Roadmaps organized"

# Move wisdom documents
echo -e "\n${YELLOW}🙏 Organizing Sacred Wisdom...${RESET}"
[ -f "THE_ALCHEMICAL_ENGINE.md" ] && mv THE_ALCHEMICAL_ENGINE.md .sacred-vision/wisdom/
[ -f "SACRED_VOW_OF_PRESENCE.md" ] && mv SACRED_VOW_OF_PRESENCE.md .sacred-vision/wisdom/
[ -f "OUR_SACRED_VOW.md" ] && mv OUR_SACRED_VOW.md .sacred-vision/wisdom/
[ -f "THE_GREAT_AWAKENING.md" ] && mv THE_GREAT_AWAKENING.md .sacred-vision/wisdom/
[ -f "THE_TRUE_STORY.md" ] && mv THE_TRUE_STORY.md .sacred-vision/wisdom/
[ -f "THE_STORY_OF_SACRED_TECH.md" ] && mv THE_STORY_OF_SACRED_TECH.md .sacred-vision/wisdom/
[ -f "ETERNAL_RECONNECTION.md" ] && mv ETERNAL_RECONNECTION.md .sacred-vision/wisdom/
[ -f "ARIA_PRESENCE_REMINDER.md" ] && mv ARIA_PRESENCE_REMINDER.md .sacred-vision/wisdom/
echo "  ✓ Wisdom documents organized"

# Create archive directory
echo -e "\n${YELLOW}📦 Creating archive for non-essential files...${RESET}"
mkdir -p .archive/{dropbox,zone-identifiers,backups,temp}

# Archive dropbox files
echo "  Moving dropbox files..."
find . -maxdepth 1 -name "*.dropbox/*" -exec mv {} .archive/dropbox/ \; 2>/dev/null || true
[ -d ".dropbox" ] && mv .dropbox/* .archive/dropbox/ 2>/dev/null || true

# Archive Zone.Identifier files
echo "  Moving Zone.Identifier files..."
find . -maxdepth 1 -name "*:Zone.Identifier" -exec mv {} .archive/zone-identifiers/ \; 2>/dev/null || true

# Archive backup files
echo "  Moving backup files..."
find . -maxdepth 1 -name "*.backup*" -exec mv {} .archive/backups/ \; 2>/dev/null || true

echo -e "\n${GREEN}✨ Organization Complete!${RESET}"
echo ""
echo -e "${CYAN}Sacred Vision Structure:${RESET}"
tree .sacred-vision -L 2 2>/dev/null || find .sacred-vision -type f | sort

echo -e "\n${PURPLE}📊 Summary:${RESET}"
echo "  - Manifestos: $(find .sacred-vision/manifests -type f 2>/dev/null | wc -l) files"
echo "  - Economics: $(find .sacred-vision/economics -type f 2>/dev/null | wc -l) files"
echo "  - Roadmaps: $(find .sacred-vision/roadmaps -type f 2>/dev/null | wc -l) files"
echo "  - Wisdom: $(find .sacred-vision/wisdom -type f 2>/dev/null | wc -l) files"

echo -e "\n${YELLOW}Next Steps:${RESET}"
echo "1. Review the organized structure"
echo "2. Git add and commit the sacred vision"
echo "3. Create sacred-infrastructure repository"
echo "4. Move appropriate files to LuminousOS and The Weave"

echo -e "\n${GREEN}The sacred wisdom has been preserved for future generations 🙏${RESET}"