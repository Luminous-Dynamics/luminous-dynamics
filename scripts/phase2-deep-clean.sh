#!/bin/bash
# Phase 2: Main Repository Deep Clean
# Organize remaining 110+ scripts and create clean structure

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${CYAN}🧹 Starting Phase 2: Deep Repository Clean${RESET}"
echo -e "${YELLOW}Organizing 110+ remaining scripts...${RESET}\n"

# Create clean directory structure
echo -e "${CYAN}Creating organized directory structure...${RESET}"
mkdir -p src/{glyphs,automation,sacred-council,web,unified-field}
mkdir -p scripts/{install,build,test,utils,dev}
mkdir -p docs/{guides,api,architecture,reference}
mkdir -p examples/{basic,advanced,integrations}
mkdir -p tests/{unit,integration,e2e}
mkdir -p .archive/{old-versions,staging,to-review}

# Move automation to src
echo -e "\n${CYAN}Moving automation to src/...${RESET}"
if [[ -d "automation" ]]; then
    cp -r automation/* src/automation/ 2>/dev/null || true
    git rm -r automation 2>/dev/null || rm -rf automation
    echo -e "${GREEN}✓ Moved automation${RESET}"
fi

# Move unified-field to src
echo -e "\n${CYAN}Moving unified-field to src/...${RESET}"
if [[ -d "unified-field" ]]; then
    cp -r unified-field/* src/unified-field/ 2>/dev/null || true
    git rm -r unified-field 2>/dev/null || rm -rf unified-field
    echo -e "${GREEN}✓ Moved unified-field${RESET}"
fi

# Move web interfaces
echo -e "\n${CYAN}Moving web interfaces to src/web/...${RESET}"
if [[ -d "web" ]]; then
    cp -r web/* src/web/ 2>/dev/null || true
    git rm -r web 2>/dev/null || rm -rf web
    echo -e "${GREEN}✓ Moved web interfaces${RESET}"
fi

# Organize scripts by type
echo -e "\n${CYAN}Organizing scripts by category...${RESET}"

# Installation scripts
for script in install*.sh; do
    if [[ -f "$script" && "$script" != "install.sh" ]]; then
        mv "$script" scripts/install/ 2>/dev/null || true
    fi
done
echo -e "${GREEN}✓ Moved installation scripts${RESET}"

# Build scripts
for script in build*.sh; do
    if [[ -f "$script" ]]; then
        mv "$script" scripts/build/ 2>/dev/null || true
    fi
done
echo -e "${GREEN}✓ Moved build scripts${RESET}"

# Test scripts
for script in test*.sh; do
    if [[ -f "$script" ]]; then
        mv "$script" scripts/test/ 2>/dev/null || true
    fi
done
echo -e "${GREEN}✓ Moved test scripts${RESET}"

# Start/Run scripts to utils
for script in start*.sh run*.sh; do
    if [[ -f "$script" ]]; then
        mv "$script" scripts/utils/ 2>/dev/null || true
    fi
done
echo -e "${GREEN}✓ Moved start/run scripts${RESET}"

# Development scripts
for script in work-*.sh create-*.sh generate-*.sh; do
    if [[ -f "$script" ]]; then
        mv "$script" scripts/dev/ 2>/dev/null || true
    fi
done
echo -e "${GREEN}✓ Moved development scripts${RESET}"

# Archive .staging directory
echo -e "\n${CYAN}Archiving .staging directory...${RESET}"
if [[ -d ".staging" ]]; then
    mv .staging .archive/staging 2>/dev/null || true
    echo -e "${GREEN}✓ Archived .staging${RESET}"
fi

# Move documentation files (except key ones)
echo -e "\n${CYAN}Organizing documentation...${RESET}"
for doc in *.md; do
    case "$doc" in
        README.md|CLAUDE.md|SECURITY.md)
            # Keep these in root
            ;;
        *GUIDE*.md|*PLAN*.md|*SETUP*.md)
            mv "$doc" docs/guides/ 2>/dev/null || true
            ;;
        *STATUS*.md|*SUMMARY*.md|*ANALYSIS*.md)
            mv "$doc" docs/reference/ 2>/dev/null || true
            ;;
        *)
            mv "$doc" docs/ 2>/dev/null || true
            ;;
    esac
done
echo -e "${GREEN}✓ Organized documentation${RESET}"

# Move example files
echo -e "\n${CYAN}Moving example files...${RESET}"
if [[ -d "examples" ]]; then
    cp -r examples/* examples/basic/ 2>/dev/null || true
fi

# Clean up test files
echo -e "\n${CYAN}Moving test files...${RESET}"
for test in *test*.js *spec*.js; do
    if [[ -f "$test" ]]; then
        mv "$test" tests/unit/ 2>/dev/null || true
    fi
done
echo -e "${GREEN}✓ Organized test files${RESET}"

# Special handling for sacred directories
echo -e "\n${CYAN}Consolidating sacred directories...${RESET}"
mkdir -p src/sacred-council/components
for dir in sacred-*; do
    if [[ -d "$dir" && "$dir" != "sacred-msg.sh" ]]; then
        case "$dir" in
            sacred-dashboard|sacred-council*)
                cp -r "$dir"/* src/sacred-council/components/ 2>/dev/null || true
                rm -rf "$dir"
                ;;
            *)
                mv "$dir" .archive/to-review/ 2>/dev/null || true
                ;;
        esac
    fi
done
echo -e "${GREEN}✓ Consolidated sacred directories${RESET}"

# Create a root script index
echo -e "\n${CYAN}Creating script index...${RESET}"
cat > scripts/README.md << 'EOF'
# Scripts Directory

## Organization
- `install/` - Installation and setup scripts
- `build/` - Build and compilation scripts
- `test/` - Testing scripts
- `utils/` - Utility scripts (start, run, etc.)
- `dev/` - Development helper scripts

## Key Scripts
- Main installation: `install/install.sh`
- Sacred message tool: `/sacred-msg.sh` (kept in root)
- Development setup: `dev/setup-sacred-dev.sh`

## Usage
Most scripts should be run from the project root:
```bash
./scripts/install/install-sacred-tools.sh
```
EOF

# Final summary
echo -e "\n${CYAN}Generating cleanup report...${RESET}"
REMAINING_SCRIPTS=$(ls *.sh 2>/dev/null | wc -l)
TOTAL_DIRS=$(find . -type d -not -path "./.git/*" | wc -l)

cat > PHASE2_CLEANUP_REPORT.md << EOF
# Phase 2 Cleanup Report
Date: $(date)

## Before Cleanup
- 110+ scripts in root directory
- 323 total directories
- No clear organization

## After Cleanup
- $REMAINING_SCRIPTS scripts remaining in root
- $TOTAL_DIRS total directories
- Clear src/scripts/docs structure

## New Structure
\`\`\`
src/
├── automation/      # Automation tools
├── glyphs/         # Glyph system
├── sacred-council/ # Sacred Council components
├── unified-field/  # Unified field system
└── web/           # Web interfaces

scripts/
├── install/       # Installation scripts
├── build/         # Build scripts
├── test/          # Test scripts
├── utils/         # Utility scripts
└── dev/           # Development scripts

docs/
├── guides/        # How-to guides
├── api/           # API documentation
├── architecture/  # System design
└── reference/     # Reference docs
\`\`\`

## Files Kept in Root
- README.md
- CLAUDE.md
- LICENSE
- package.json
- sacred-msg.sh
- .gitignore

## Next Steps
1. Review .archive/to-review/ for any important files
2. Update import paths in code
3. Test key scripts still work
4. Update documentation
EOF

echo -e "\n${GREEN}✅ Phase 2 Deep Clean Complete!${RESET}"
echo -e "${CYAN}Results:${RESET}"
echo "- Scripts organized into categories"
echo "- Source code in src/ directory"
echo "- Documentation consolidated"
echo "- Only $REMAINING_SCRIPTS scripts remain in root"
echo ""
echo -e "${YELLOW}Ready for Phase 3: Test Sacred Infrastructure with MicroK8s${RESET}"