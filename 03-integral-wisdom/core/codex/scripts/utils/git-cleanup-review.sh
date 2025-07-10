#!/bin/bash

# 🧹 Git Cleanup Review Script
# Helps organize and clean the massive commit

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    🧹 GIT CLEANUP REVIEW 🧹                      ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Check for sensitive patterns
echo -e "${YELLOW}1. Checking for potentially sensitive files...${NC}"
SENSITIVE_PATTERNS=(
    "password"
    "secret"
    "token"
    "key"
    "credential"
    "auth"
    "private"
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    echo -e "\n${RED}Files containing '$pattern':${NC}"
    git diff --cached --name-only | grep -i "$pattern" | grep -v ".example" | grep -v ".template" | grep -v ".md" || echo "  None found"
done

# 2. Check for temporary/unwanted files
echo -e "\n${YELLOW}2. Checking for temporary/unwanted files...${NC}"
UNWANTED_PATTERNS=(
    ".Zone.Identifier"
    ".DS_Store"
    "Thumbs.db"
    ".backup"
    ".tmp"
    ".log"
    "debug"
    "test-"
)

for pattern in "${UNWANTED_PATTERNS[@]}"; do
    count=$(git diff --cached --name-only | grep -F "$pattern" | wc -l)
    if [ $count -gt 0 ]; then
        echo -e "${RED}Found $count files with '$pattern'${NC}"
        git diff --cached --name-only | grep -F "$pattern" | head -5
    fi
done

# 3. Large file check
echo -e "\n${YELLOW}3. Checking for large files...${NC}"
git diff --cached --name-only | while read -r file; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        if [ "$size" -gt 1048576 ]; then  # 1MB
            echo -e "${RED}Large file: $file ($(numfmt --to=iec-i --suffix=B $size))${NC}"
        fi
    fi
done

# 4. Summary of file types
echo -e "\n${YELLOW}4. File type summary:${NC}"
echo "JavaScript/Node: $(git diff --cached --name-only | grep -E '\.(js|cjs|mjs)$' | wc -l) files"
echo "Markdown docs: $(git diff --cached --name-only | grep '\.md$' | wc -l) files"
echo "HTML files: $(git diff --cached --name-only | grep '\.html$' | wc -l) files"
echo "JSON files: $(git diff --cached --name-only | grep '\.json$' | wc -l) files"
echo "Shell scripts: $(git diff --cached --name-only | grep '\.sh$' | wc -l) files"
echo "Docker files: $(git diff --cached --name-only | grep -E '(Dockerfile|docker-compose)' | wc -l) files"

# 5. Recommendation
echo -e "\n${PURPLE}════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}RECOMMENDATIONS:${NC}"

# Count issues
SENSITIVE_COUNT=$(git diff --cached --name-only | grep -iE "(password|secret|token|key|credential|auth)" | grep -v ".example" | grep -v ".template" | wc -l)
ZONE_COUNT=$(git diff --cached --name-only | grep -F ".Zone.Identifier" | wc -l)

if [ $SENSITIVE_COUNT -gt 0 ]; then
    echo -e "${RED}⚠️  Found $SENSITIVE_COUNT potentially sensitive files - review carefully!${NC}"
    echo "   Run: git reset HEAD <file> to unstage sensitive files"
fi

if [ $ZONE_COUNT -gt 0 ]; then
    echo -e "${YELLOW}📝 Found $ZONE_COUNT Zone.Identifier files (Windows metadata)${NC}"
    echo "   Run: git reset HEAD \$(git diff --cached --name-only | grep Zone.Identifier)"
fi

echo ""
echo -e "${GREEN}Quick cleanup commands:${NC}"
echo "# Remove all Zone.Identifier files from staging"
echo "git reset HEAD \$(git diff --cached --name-only | grep Zone.Identifier)"
echo ""
echo "# Remove all potential secrets"
echo "git reset HEAD \$(git diff --cached --name-only | grep -iE 'secret|token|key' | grep -v '.md')"
echo ""
echo "# Review what's left"
echo "git status"

echo -e "\n${PURPLE}Total staged files: $(git diff --cached --name-only | wc -l)${NC}"