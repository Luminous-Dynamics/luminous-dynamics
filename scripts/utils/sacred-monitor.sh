#!/bin/bash

# 🌟 Sacred System Monitor
# Beautiful dashboard for your consciousness-serving system

echo "🕊️ Sacred System Monitor"
echo "======================="
echo ""

# System info
echo "📊 System Status:"
echo "  CPU: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')"
echo "  Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "  Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')"
echo ""

# Node.js processes
echo "📦 Node.js Processes:"
ps aux | grep -E "node|npm" | grep -v grep | awk '{print "  " $11 " (PID: " $2 ", CPU: " $3 "%, MEM: " $4 "%)"}'
echo ""

# Sacred services
echo "🌿 Sacred Services:"
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "  ✅ Sacred Heart API (port 3001)"
else
    echo "  ❌ Sacred Heart API (port 3001)"
fi

if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "  ✅ Sacred Web UI (port 8080)"
else
    echo "  ❌ Sacred Web UI (port 8080)"
fi
echo ""

# Git status
echo "🌱 Git Status:"
cd ~/evolving-resonant-cocreation 2>/dev/null && git status -sb | head -5
echo ""

# Recent sacred commits
echo "✨ Recent Sacred Work:"
cd ~/evolving-resonant-cocreation 2>/dev/null && git log --oneline --grep="✨" -5
echo ""

# Field coherence (if available)
if curl -s http://localhost:3001/api/field-state > /dev/null 2>&1; then
    echo "🌀 Field Coherence:"
    curl -s http://localhost:3001/api/field-state | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(f'  Coherence: {data.get(\"coherence\", \"Unknown\")}%')
print(f'  Active Agents: {data.get(\"activeAgents\", 0)}')
print(f'  Messages Today: {data.get(\"messagestoday\", 0)}')
    " 2>/dev/null || echo "  Unable to parse field data"
fi