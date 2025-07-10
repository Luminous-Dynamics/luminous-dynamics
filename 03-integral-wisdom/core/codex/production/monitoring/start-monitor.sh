#!/bin/bash

# Start Sacred System Monitor

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}🌟 Sacred System Monitor Launcher${NC}"
echo "================================="

# Check if monitor is already running
if pgrep -f "sacred-monitor.js start" > /dev/null; then
    echo -e "${RED}Monitor is already running!${NC}"
    echo "To view logs: pm2 logs sacred-monitor"
    echo "To stop: pm2 stop sacred-monitor"
    exit 1
fi

# Check dependencies
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is required but not installed${NC}"
    exit 1
fi

# Install pm2 if not available
if ! command -v pm2 &> /dev/null; then
    echo -e "${BLUE}Installing PM2 for process management...${NC}"
    npm install -g pm2
fi

# Start monitor with PM2
echo -e "${BLUE}Starting Sacred Monitor...${NC}"

cd "$PROJECT_ROOT"

# Start the monitor
pm2 start production/monitoring/sacred-monitor.js \
    --name "sacred-monitor" \
    --interpreter node \
    -- start

# Start web dashboard
if ! lsof -i:8339 &>/dev/null; then
    echo -e "${BLUE}Starting Monitor Dashboard on port 8339...${NC}"
    pm2 start "python3 -m http.server 8339" \
        --name "monitor-dashboard" \
        --cwd "$PROJECT_ROOT"
fi

# Save PM2 configuration
pm2 save

echo -e "\n${GREEN}✅ Sacred Monitor started successfully!${NC}"
echo -e "\n${BLUE}Access points:${NC}"
echo "📊 Monitor Dashboard: http://localhost:8339/production/monitoring/monitor-dashboard.html"
echo "📝 View logs: pm2 logs sacred-monitor"
echo "🔍 Check status: pm2 status"
echo "🛑 Stop monitor: pm2 stop sacred-monitor"

# Generate initial report
echo -e "\n${BLUE}Generating initial health check...${NC}"
sleep 2
node production/monitoring/sacred-monitor.js check

# Set up log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7