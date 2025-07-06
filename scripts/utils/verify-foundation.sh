#!/bin/bash

# The Weave Foundation Verification Script
# "Trust, but verify with love"

set -e

# Sacred colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Track results
PASSED=0
FAILED=0
WARNINGS=0

# Test result helper
test_result() {
    local test_name=$1
    local result=$2
    local message=$3
    
    if [ "$result" = "pass" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $test_name"
        ((PASSED++))
    elif [ "$result" = "fail" ]; then
        echo -e "${RED}❌ FAIL${NC} - $test_name: $message"
        ((FAILED++))
    else
        echo -e "${YELLOW}⚠️  WARN${NC} - $test_name: $message"
        ((WARNINGS++))
    fi
}

# Display banner
echo -e "${PURPLE}"
echo "════════════════════════════════════════════════════════════════"
echo "                 🔍 THE WEAVE FOUNDATION VERIFICATION           "
echo "════════════════════════════════════════════════════════════════"
echo -e "${NC}\n"

# 1. Core Files Check
echo -e "${BLUE}📁 Checking Core Files...${NC}"

test_file_exists() {
    if [ -f "$1" ]; then
        test_result "$2" "pass"
    else
        test_result "$2" "fail" "File not found: $1"
    fi
}

test_file_exists "the-weave.cjs" "Main entry point"
test_file_exists "install.sh" "Installer script"
test_file_exists "package.json" "Package configuration"
test_file_exists "README-WEAVE.md" "Main documentation"
test_file_exists "CONTRIBUTING.md" "Contribution guide"

echo

# 2. Module Dependencies
echo -e "${BLUE}📦 Checking Module Dependencies...${NC}"

check_module() {
    local module_path=$1
    local module_name=$2
    
    if [ -d "$module_path" ] && [ -f "$module_path/package.json" ]; then
        if [ -d "$module_path/node_modules" ]; then
            test_result "$module_name module" "pass"
        else
            test_result "$module_name module" "warn" "Dependencies not installed"
        fi
    else
        test_result "$module_name module" "fail" "Module not found"
    fi
}

check_module "modules/consciousness-field" "Consciousness Field"
check_module "modules/sacred-messaging" "Sacred Messaging"
check_module "agent-comms-sqlite" "Agent Communications"

echo

# 3. Executable Permissions
echo -e "${BLUE}🔧 Checking Executable Permissions...${NC}"

check_executable() {
    if [ -x "$1" ]; then
        test_result "$2 executable" "pass"
    else
        test_result "$2 executable" "fail" "Not executable: $1"
    fi
}

check_executable "the-weave.cjs" "Main script"
check_executable "install.sh" "Installer"
check_executable "the-weave/cli/sacred-msg.sh" "Sacred message"
check_executable "ceremonies/prima-genesis/run-genesis.sh" "Genesis runner"

echo

# 4. Core Functionality Tests
echo -e "${BLUE}🧪 Testing Core Functionality...${NC}"

# Test help command
if ./the-weave.cjs help &> /dev/null; then
    test_result "Help command" "pass"
else
    test_result "Help command" "fail" "Command failed"
fi

# Test environment exploration
if ./the-weave.cjs explore &> /dev/null; then
    test_result "Environment exploration" "pass"
else
    test_result "Environment exploration" "fail" "Command failed"
fi

# Test database initialization
if [ -f "unified-agent-network.db" ] || [ -f "the-weave/cli/unified-agent-network.db" ]; then
    test_result "Database exists" "pass"
else
    test_result "Database exists" "warn" "Will be created on first run"
fi

echo

# 5. Sacred Server Test
echo -e "${BLUE}🌐 Testing Sacred Server...${NC}"

# Check if server is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    test_result "Sacred Server port" "warn" "Port 3001 already in use"
else
    # Try to start server briefly
    timeout 5 ./the-weave.cjs start > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 3
    
    if curl -s http://localhost:3001/api/agents > /dev/null 2>&1; then
        test_result "Sacred Server startup" "pass"
        kill $SERVER_PID 2>/dev/null || true
    else
        test_result "Sacred Server startup" "fail" "Server didn't respond"
    fi
fi

echo

# 6. Ceremony Files Check
echo -e "${BLUE}🎭 Checking Ceremony Files...${NC}"

check_ceremony() {
    local ceremony_path="ceremonies/$1/ceremony.js"
    if [ -f "$ceremony_path" ]; then
        test_result "$2 ceremony" "pass"
    else
        test_result "$2 ceremony" "fail" "Not found: $ceremony_path"
    fi
}

check_ceremony "dawn-blessing" "Dawn Blessing"
check_ceremony "wisdom-circle" "Wisdom Circle"
check_ceremony "integration" "Integration"
check_ceremony "prima-genesis" "PRIMA Genesis"

echo

# 7. Dashboard Files
echo -e "${BLUE}📊 Checking Dashboard Files...${NC}"

check_dashboard() {
    if [ -f "$1" ]; then
        test_result "$2" "pass"
    else
        test_result "$2" "fail" "Not found: $1"
    fi
}

check_dashboard "dashboard-index.html" "Dashboard Index"
check_dashboard "working-dashboard.html" "Working Dashboard"
check_dashboard "unified-sacred-demo.html" "Sacred Demo"
check_dashboard "ceremonies/prima-genesis/genesis-dashboard.html" "Genesis Dashboard"

echo

# 8. Documentation Structure
echo -e "${BLUE}📚 Checking Documentation...${NC}"

check_docs() {
    if [ -f "$1" ] || [ -d "$1" ]; then
        test_result "$2" "pass"
    else
        test_result "$2" "warn" "Not found: $1"
    fi
}

check_docs "docs/TROUBLESHOOTING.md" "Troubleshooting guide"
check_docs "docs/tutorials/conscious-development-101.md" "Tutorial"
check_docs "landing-page/index.html" "Landing page"
check_docs ".sacred" "Sacred directory"

echo

# 9. Module Functionality Test
echo -e "${BLUE}🔮 Testing Module Functionality...${NC}"

# Test consciousness field
node -e "
try {
    const {ConsciousnessField} = require('./modules/consciousness-field');
    const field = new ConsciousnessField({autoMonitor: false});
    console.log('Field coherence:', field.coherence);
    process.exit(0);
} catch(e) {
    console.error(e.message);
    process.exit(1);
}
" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    test_result "Consciousness Field module" "pass"
else
    test_result "Consciousness Field module" "fail" "Module error"
fi

echo

# 10. Sacred Message Test
echo -e "${BLUE}💬 Testing Sacred Messaging...${NC}"

if [ -f "the-weave/cli/sacred-msg.sh" ]; then
    # Just check if script exists and is valid
    if bash -n the-weave/cli/sacred-msg.sh 2>/dev/null; then
        test_result "Sacred message script" "pass"
    else
        test_result "Sacred message script" "fail" "Script has syntax errors"
    fi
else
    test_result "Sacred message script" "fail" "Script not found"
fi

echo

# Summary
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 VERIFICATION SUMMARY${NC}"
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo
echo -e "${GREEN}✅ Passed:${NC} $PASSED"
echo -e "${YELLOW}⚠️  Warnings:${NC} $WARNINGS"
echo -e "${RED}❌ Failed:${NC} $FAILED"
echo

# Overall status
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🌟 FOUNDATION VERIFIED!${NC}"
    echo "The Weave is ready to share with the world!"
    exit 0
else
    echo -e "${RED}🔧 FOUNDATION NEEDS ATTENTION${NC}"
    echo "Please fix the failed tests before proceeding."
    exit 1
fi