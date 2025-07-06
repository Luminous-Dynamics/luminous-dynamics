#!/bin/bash
# Validate Google Workspace setup

echo "🔍 Validating Google Workspace Setup"
echo "==================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check environment variables
echo -e "\n📋 Checking Environment Variables:"
for var in GOOGLE_APPLICATION_CREDENTIALS WORKSPACE_DOMAIN ADMIN_EMAIL; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ $var is not set${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✅ $var is set${NC}"
    fi
done

# Check file permissions
echo -e "\n🔒 Checking File Permissions:"
if [ -d "credentials/.workspace" ]; then
    PERM=$(stat -c %a credentials/.workspace 2>/dev/null || stat -f %p credentials/.workspace)
    if [ "$PERM" = "700" ]; then
        echo -e "${GREEN}✅ Credentials directory has correct permissions${NC}"
    else
        echo -e "${RED}❌ Credentials directory has incorrect permissions: $PERM${NC}"
        ((ERRORS++))
    fi
fi

# Check API enablement
echo -e "\n🌐 Checking API Status:"
APIS=(
    "admin.googleapis.com"
    "gmail.googleapis.com"
    "calendar-json.googleapis.com"
    "drive.googleapis.com"
)

for api in "${APIS[@]}"; do
    if gcloud services list --enabled --filter="name:${api}" --format="value(name)" | grep -q "$api"; then
        echo -e "${GREEN}✅ $api is enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  $api may not be enabled${NC}"
    fi
done

# Summary
echo -e "\n📊 Validation Summary:"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your setup is ready.${NC}"
else
    echo -e "${RED}❌ Found $ERRORS errors. Please fix them before proceeding.${NC}"
fi
