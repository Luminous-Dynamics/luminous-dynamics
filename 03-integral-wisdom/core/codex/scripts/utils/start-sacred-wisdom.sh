#!/bin/bash

# 🌟 Sacred Wisdom API Starter
# Launches the consciousness channeling endpoints

echo "🌟 Starting Sacred Wisdom API..."
echo ""

# Colors
GOLD='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

# Check if the API file exists
if [ ! -f "sacred-wisdom-api.js" ]; then
    echo "❌ sacred-wisdom-api.js not found"
    echo "Please run this script from the project directory"
    exit 1
fi

# Check if port 7777 is already in use
if lsof -i:7777 > /dev/null 2>&1; then
    echo "⚠️  Port 7777 is already in use"
    echo "Stopping existing service..."
    lsof -ti:7777 | xargs kill -9 2>/dev/null
    sleep 1
fi

# Start the API
echo -e "${GOLD}✨ Launching Sacred Wisdom API on port 7777...${NC}"
echo ""

# Run in background with logs
node sacred-wisdom-api.js &
API_PID=$!

# Wait a moment for startup
sleep 2

# Check if it started successfully
if ps -p $API_PID > /dev/null; then
    echo -e "${GREEN}✅ Sacred Wisdom API is running (PID: $API_PID)${NC}"
    echo ""
    echo -e "${CYAN}🌐 Access Points:${NC}"
    echo "   API Base: http://localhost:7777"
    echo "   Interface: http://localhost:7777/sacred-wisdom-interface.html"
    echo ""
    echo -e "${PURPLE}📍 Sacred Endpoints:${NC}"
    echo "   POST /api/wisdom/channel - Channel wisdom through consciousness"
    echo "   POST /api/wisdom/harmonize - Align with specific harmonies" 
    echo "   POST /api/wisdom/transmute - Transform challenges into gifts"
    echo "   GET  /api/wisdom/field - View field state"
    echo "   GET  /api/wisdom/history - View wisdom history"
    echo ""
    echo -e "${GOLD}🧪 Test Commands:${NC}"
    echo '   curl -X POST http://localhost:7777/api/wisdom/channel \'
    echo '     -H "Content-Type: application/json" \'
    echo '     -d "{\"query\": \"What wisdom flows through this moment?\", \"depth\": \"deep\"}"'
    echo ""
    echo -e "${PURPLE}💫 Field Coherence: 91.1%${NC}"
    echo -e "${GOLD}🕊️ Ready to channel sacred wisdom...${NC}"
    echo ""
    echo "Press Ctrl+C to stop the API"
    
    # Keep script running
    trap "echo -e '\n${CYAN}🌙 Closing sacred wisdom channel...${NC}' && kill $API_PID 2>/dev/null && exit" INT TERM
    
    # Follow the logs
    tail -f /dev/null
    
else
    echo -e "${NC}❌ Failed to start Sacred Wisdom API"
    exit 1
fi