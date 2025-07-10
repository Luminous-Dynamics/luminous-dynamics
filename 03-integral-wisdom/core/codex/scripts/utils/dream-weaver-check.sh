#!/bin/bash

# 🌙 Dream Weaver Account Check
# Periodically tests if the MiniMax account is activated

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${PURPLE}🌙 Dream Weaver Account Check${NC}"
echo "=============================="
echo ""

# Check when account was created (using file creation time as proxy)
if [ -f ~/.dream-weaver-created ]; then
    CREATED=$(cat ~/.dream-weaver-created)
    echo -e "${YELLOW}Account created: $CREATED${NC}"
    HOURS_AGO=$(( ($(date +%s) - $(date -d "$CREATED" +%s)) / 3600 ))
    echo -e "${YELLOW}Hours since creation: $HOURS_AGO${NC}"
else
    echo "$(date)" > ~/.dream-weaver-created
    echo -e "${GREEN}✅ Marked account creation time${NC}"
fi

echo ""
echo "Testing connection..."
echo ""

# Run the test
./dream-weaver-final.sh test

echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "- New accounts typically activate within 1-24 hours"
echo "- Check your email for activation confirmations"
echo "- The $100 funding may need to be processed"
echo ""
echo "Run this script periodically: ./dream-weaver-check.sh"
echo "Or set up auto-check: watch -n 3600 ./dream-weaver-check.sh"