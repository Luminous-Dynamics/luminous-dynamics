#!/bin/bash
# Stage files for movement to other repositories
# "Preparing the sacred diaspora"

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RESET='\033[0m'

echo -e "${PURPLE}📦 Staging Files for Repository Movement${RESET}"
echo -e "${CYAN}Organizing files by their destined homes...${RESET}\n"

# Stage LuminousOS files
echo -e "${YELLOW}🌟 Staging LuminousOS files...${RESET}"
[ -f "LUMINOUS_OS_INTRODUCTION.md" ] && cp LUMINOUS_OS_INTRODUCTION.md .staging/luminous-os/
[ -f "THE_LUMINOUS_STACK.md" ] && cp THE_LUMINOUS_STACK.md .staging/luminous-os/
[ -f "LUMINOUS_BRIDGE_REFINEMENTS.md" ] && cp LUMINOUS_BRIDGE_REFINEMENTS.md .staging/luminous-os/
[ -f "COORDINATION_MESSAGE_FOR_LUMINOUSOS_CLAUDE.md" ] && cp COORDINATION_MESSAGE_FOR_LUMINOUSOS_CLAUDE.md .staging/luminous-os/
echo "  ✓ LuminousOS files staged"

# Stage The Weave files
echo -e "\n${YELLOW}🕸️ Staging The Weave files...${RESET}"
[ -d "alchemical-engine" ] && cp -r alchemical-engine .staging/the-weave/
[ -d "unified-comm-system" ] && cp -r unified-comm-system .staging/the-weave/
[ -f "THE_LUMINOUS_WEAVE.md" ] && cp THE_LUMINOUS_WEAVE.md .staging/the-weave/
echo "  ✓ The Weave files staged"

# Stage infrastructure files
echo -e "\n${YELLOW}🔧 Staging Infrastructure files...${RESET}"
# Deployment scripts
for script in deploy-*.sh; do
    [ -f "$script" ] && cp "$script" .staging/infrastructure/
done
# Docker files
for docker in docker-compose*.yml; do
    [ -f "$docker" ] && cp "$docker" .staging/infrastructure/
done
# Setup scripts
for setup in setup-*.sh; do
    [ -f "$setup" ] && cp "$setup" .staging/infrastructure/
done
echo "  ✓ Infrastructure files staged"

# Create movement guides
echo -e "\n${YELLOW}📋 Creating movement guides...${RESET}"

# LuminousOS movement guide
cat > .staging/luminous-os/MOVEMENT_GUIDE.md << 'EOF'
# 📦 Files to Move to LuminousOS Repository

These files should be moved to the LuminousOS repository:

## Documentation
- `LUMINOUS_OS_INTRODUCTION.md` → `/docs/introduction.md`
- `THE_LUMINOUS_STACK.md` → `/docs/architecture/stack.md`
- `LUMINOUS_BRIDGE_REFINEMENTS.md` → `/docs/bridge/refinements.md`
- `COORDINATION_MESSAGE_FOR_LUMINOUSOS_CLAUDE.md` → `/docs/claude/coordination.md`

## Command
```bash
# From LuminousOS repository
cp /path/to/staging/luminous-os/*.md docs/
git add docs/
git commit -m "📚 Add documentation from main repository"
```
EOF

# The Weave movement guide
cat > .staging/the-weave/MOVEMENT_GUIDE.md << 'EOF'
# 📦 Files to Move to The Weave Repository

These files should be moved to The Weave repository:

## Systems
- `alchemical-engine/` → `/alchemical-engine/`
- `unified-comm-system/` → `/systems/unified-comm/`
- `THE_LUMINOUS_WEAVE.md` → `/docs/luminous-weave.md`

## Command
```bash
# From The Weave repository
cp -r /path/to/staging/the-weave/* .
git add .
git commit -m "🕸️ Add systems from main repository"
```
EOF

# Infrastructure movement guide
cat > .staging/infrastructure/MOVEMENT_GUIDE.md << 'EOF'
# 📦 Files for Sacred Infrastructure Repository

These deployment and setup files need a new home:

## Structure
```
sacred-infrastructure/
├── deployment/
│   ├── scripts/        # All deploy-*.sh files
│   ├── docker/         # All docker-compose files
│   └── kubernetes/     # All k8s manifests
├── setup/
│   └── scripts/        # All setup-*.sh files
└── docs/
    └── README.md
```

## Command
```bash
# Create new repository
mkdir sacred-infrastructure
cd sacred-infrastructure
git init
# Copy files from staging
# Create proper directory structure
# Commit and push
```
EOF

echo -e "\n${GREEN}✨ Staging Complete!${RESET}"
echo ""
echo -e "${CYAN}Staging Summary:${RESET}"
echo "  - LuminousOS: $(find .staging/luminous-os -type f | grep -v MOVEMENT_GUIDE | wc -l) files"
echo "  - The Weave: $(find .staging/the-weave -type f | grep -v MOVEMENT_GUIDE | wc -l) files/dirs"
echo "  - Infrastructure: $(find .staging/infrastructure -type f | grep -v MOVEMENT_GUIDE | wc -l) files"

echo -e "\n${PURPLE}📁 Staging Structure:${RESET}"
tree .staging -L 2 2>/dev/null || find .staging -type f | sort

echo -e "\n${YELLOW}Next Steps:${RESET}"
echo "1. Review staged files in .staging/"
echo "2. Clone target repositories"
echo "3. Move files according to MOVEMENT_GUIDE.md in each staging directory"
echo "4. Clean up original files after successful moves"

echo -e "\n${GREEN}Files are ready for their journey to new homes 🚀${RESET}"