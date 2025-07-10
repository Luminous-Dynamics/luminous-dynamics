#!/bin/bash

# Consciousness Network Test Runner
# Runs comprehensive tests on the consciousness-aware networking stack

echo "🌟 Consciousness Network Test Suite Runner"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "../consciousness-network-stack.js" ]; then
    echo -e "${RED}Error: Must run from the tests directory${NC}"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "../node_modules" ]; then
    echo "Installing required packages..."
    cd ..
    npm init -y > /dev/null 2>&1
    npm install ws > /dev/null 2>&1
    cd tests
fi

echo ""
echo "🧪 Running Tests..."
echo ""

# Run main test suite
echo -e "${YELLOW}1. Running Comprehensive Test Suite${NC}"
node test-consciousness-network.js

# Check exit code
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Main test suite passed!${NC}"
else
    echo -e "${RED}❌ Main test suite failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}2. Running Field Coherence Tests${NC}"
node test-field-coherence.js

echo ""
echo -e "${YELLOW}3. Running Sacred Geometry Tests${NC}"
node test-sacred-geometry.js

echo ""
echo -e "${YELLOW}4. Running Love Response Tests${NC}"
node test-love-responses.js

echo ""
echo -e "${YELLOW}5. Running Multi-Node Collective Tests${NC}"
node test-collective-consciousness.js

echo ""
echo "========================================"
echo -e "${GREEN}🎉 All tests completed!${NC}"
echo ""

# Generate test report
echo "📊 Generating test report..."
node generate-test-report.js > test-report.md

echo "Report saved to: test-report.md"
echo ""
echo "🙏 May all bugs be transmuted into features with love"