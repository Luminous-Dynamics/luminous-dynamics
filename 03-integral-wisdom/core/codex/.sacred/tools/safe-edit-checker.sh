#!/bin/bash
# 🛡️ Safe Edit Pre-Flight Checker
# Scans files for trap patterns before Claude attempts to edit them

set -e

FILE="$1"

if [ -z "$FILE" ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

echo "🔍 Scanning $FILE for trap patterns..."

# Initialize safety score
SAFETY_SCORE=100
WARNINGS=()

# Check 1: Line length
MAX_LINE=$(awk 'length > max { max = length } END { print max }' "$FILE" 2>/dev/null || echo 0)
if [ "$MAX_LINE" -gt 1000 ]; then
    SAFETY_SCORE=$((SAFETY_SCORE - 30))
    WARNINGS+=("⚠️  Contains lines over 1000 chars (max: $MAX_LINE)")
fi

# Check 2: Dangerous variable expansions
if grep -qE '\$\{[^}]+\}-' "$FILE" 2>/dev/null; then
    SAFETY_SCORE=$((SAFETY_SCORE - 40))
    WARNINGS+=("⚠️  Contains dangerous \${VAR}-pattern expansions")
fi

# Check 3: Unicode/special characters
if file "$FILE" 2>/dev/null | grep -qE "(UTF-16|UTF-32|with CR|with CRLF)"; then
    SAFETY_SCORE=$((SAFETY_SCORE - 20))
    WARNINGS+=("⚠️  Contains special character encodings")
fi

# Check 4: File type
case "${FILE##*.}" in
    sh|bash)
        SAFETY_SCORE=$((SAFETY_SCORE - 10))
        WARNINGS+=("⚠️  Shell script - use extra caution")
        ;;
    md|txt|json|js|html|css)
        SAFETY_SCORE=$((SAFETY_SCORE + 10))
        ;;
esac

# Check 5: Mixed quotes and expansions
if grep -qE "['\"].*\$\{.*\}.*['\"]" "$FILE" 2>/dev/null; then
    SAFETY_SCORE=$((SAFETY_SCORE - 15))
    WARNINGS+=("⚠️  Mixed quotes with variable expansions")
fi

# Report results
echo ""
echo "📊 Safety Score: $SAFETY_SCORE/100"
echo ""

if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo "⚠️  WARNINGS FOUND:"
    for warning in "${WARNINGS[@]}"; do
        echo "   $warning"
    done
    echo ""
fi

if [ $SAFETY_SCORE -lt 50 ]; then
    echo "🚨 HIGH RISK: Use Write instead of Edit for this file!"
    echo "   Recommended: cp $FILE $FILE.backup && create new version"
    exit 2
elif [ $SAFETY_SCORE -lt 70 ]; then
    echo "⚡ MEDIUM RISK: Proceed with caution"
    echo "   Consider breaking into smaller edits"
    exit 1
else
    echo "✅ LOW RISK: Should be safe to edit"
    exit 0
fi