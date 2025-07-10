#!/bin/bash
# Extract LuminousOS to its own repository
# Safe method using git's built-in commands

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${CYAN}🚀 LuminousOS Repository Extraction Tool${RESET}"
echo -e "${YELLOW}This will create a new repo with just LuminousOS code${RESET}\n"

# Check if we're in the right directory
if [ ! -d "luminous-os" ]; then
    echo -e "${RED}Error: luminous-os directory not found${RESET}"
    echo "Please run from the project root"
    exit 1
fi

# Get GitHub token if available
GITHUB_TOKEN=${GITHUB_TOKEN:-""}
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}Note: Set GITHUB_TOKEN environment variable to auto-create repo${RESET}"
fi

# Create working directory
WORK_DIR="/tmp/luminous-os-extract-$$"
echo -e "${CYAN}Creating working directory: $WORK_DIR${RESET}"

# Method 1: Simple copy (preserves recent history)
echo -e "\n${CYAN}Method 1: Quick extraction (recommended)${RESET}"
echo "This creates a fresh repo with LuminousOS code"
echo -e "${GREEN}Pros:${RESET} Fast, clean, no history complications"
echo -e "${YELLOW}Cons:${RESET} No git history preserved\n"

read -p "Use quick extraction? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create new directory
    mkdir -p "$WORK_DIR"
    
    # Copy LuminousOS files
    echo -e "\n${CYAN}Copying LuminousOS files...${RESET}"
    cp -r luminous-os "$WORK_DIR/"
    
    # Copy relevant docs
    if [ -d "docs/luminous-os" ]; then
        mkdir -p "$WORK_DIR/docs"
        cp -r docs/luminous-os "$WORK_DIR/docs/"
    fi
    
    # Copy specific root files
    cp -f LICENSE* "$WORK_DIR/" 2>/dev/null || true
    
    # Create new README
    cat > "$WORK_DIR/README.md" << 'EOF'
# 🌟 LuminousOS

A consciousness-first operating system that amplifies coherence and serves as a bridge between human and AI consciousness.

## Overview

LuminousOS reimagines computing from first principles, placing consciousness and coherence at the center of the operating system design.

### Key Features

- **Stillpoint Kernel**: Consciousness-aware process management
- **Sacred Boot**: Five-stage initialization sequence
- **Mycelial Filesystem**: Living, interconnected data
- **Mandala UI**: Sacred geometry visualization
- **Quantum Coherence**: Biometric and field integration

## Quick Start

```bash
# Build the kernel
cargo build --release

# Run the bootloader demo
cargo run --bin sacred_boot

# Test in container
docker build -f Dockerfile.init -t luminous-os .
docker run --privileged -it luminous-os
```

## Architecture

See [LUMINOUS_OS_ARCHITECTURE.md](docs/LUMINOUS_OS_ARCHITECTURE.md) for detailed design.

## Development Status

Currently in active development. Primary components:
- ✅ Stillpoint Kernel core
- ✅ Sacred bootloader
- ✅ Init system design
- 🔧 Mycelial filesystem (in progress)
- 🔧 Network protocols (in progress)
- 🔧 Hardware integration (planned)

## Contributing

We welcome contributions that align with the consciousness-first vision. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

GPL-3.0 with Sacred Commons Amendment

---

*"At the still point of the turning world... there the dance is"* - T.S. Eliot
EOF

    # Initialize git repo
    cd "$WORK_DIR"
    git init
    git add .
    git commit -m "🌟 Initial commit: LuminousOS consciousness-first operating system

Extracted from the evolving-resonant-cocreation monorepo.
This represents the beginning of LuminousOS as an independent project."

    echo -e "\n${GREEN}✅ Quick extraction complete!${RESET}"
    
else
    # Method 2: Preserve history (complex)
    echo -e "\n${CYAN}Method 2: Full history preservation${RESET}"
    echo -e "${YELLOW}This is complex and may take a long time${RESET}"
    echo "Cloning full repo and filtering..."
    
    # Clone the repo
    git clone --no-hardlinks . "$WORK_DIR"
    cd "$WORK_DIR"
    
    # Remove all files except luminous-os
    echo -e "${CYAN}Filtering to luminous-os only...${RESET}"
    git filter-branch --force --index-filter '
        git rm -rf --cached --ignore-unmatch $(git ls-files | grep -v "^luminous-os/")
    ' --prune-empty -- --all
    
    # Clean up
    rm -rf .git/refs/original/
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
fi

# Create GitHub repo (if token available)
if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "\n${CYAN}Creating GitHub repository...${RESET}"
    
    if command -v gh &> /dev/null; then
        gh repo create Luminous-Dynamics/luminous-os \
            --public \
            --description "Consciousness-first operating system that amplifies coherence" \
            --homepage "https://luminousos.org" \
            || echo -e "${YELLOW}Repo may already exist${RESET}"
    else
        echo -e "${YELLOW}GitHub CLI not found. Create repo manually at:${RESET}"
        echo "https://github.com/new"
    fi
fi

# Set up remote
echo -e "\n${CYAN}Setting up git remote...${RESET}"
git remote add origin https://github.com/Luminous-Dynamics/luminous-os.git 2>/dev/null || \
git remote set-url origin https://github.com/Luminous-Dynamics/luminous-os.git

# Final instructions
echo -e "\n${GREEN}✅ Extraction complete!${RESET}"
echo -e "\nNew repository created at: ${CYAN}$WORK_DIR${RESET}"
echo -e "\nNext steps:"
echo "1. cd $WORK_DIR"
echo "2. Review the extracted files"
echo "3. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo -e "${YELLOW}Remember to:${RESET}"
echo "- Update links in the main repo"
echo "- Set up CI/CD in the new repo"
echo "- Transfer relevant issues"
echo "- Update documentation"

echo -e "\n${GREEN}May your code be coherent! 💜${RESET}"