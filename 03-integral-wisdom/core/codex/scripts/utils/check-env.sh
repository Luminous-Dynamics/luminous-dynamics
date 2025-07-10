#!/bin/bash

# Environment Check Script - Run this frequently

echo "🔍 ENVIRONMENT CHECK"
echo "==================="
echo ""
echo "📍 Location: $(pwd)"
echo "🖥️  System: WSL2 Ubuntu on Windows"
echo "👤 User: $(whoami)"
echo "🕐 Time: $(date)"
echo ""

echo "📁 Working Directory Contents:"
ls -la | grep -E "^d" | wc -l | xargs echo "  Directories:"
ls -la | grep -E "^-" | wc -l | xargs echo "  Files:"
echo ""

echo "🌐 Local Services:"
echo "  Checking ports..."
for port in 3001 8080 8338 8889 11434; do
  if lsof -i :$port >/dev/null 2>&1; then
    service=$(lsof -i :$port 2>/dev/null | grep LISTEN | awk '{print $1}' | head -1)
    echo "  ✅ Port $port: $service"
  else
    echo "  ❌ Port $port: Not active"
  fi
done
echo ""

echo "☁️  Cloud Environment:"
echo "  Project: $(gcloud config get-value project 2>/dev/null || echo 'Not set')"
echo "  Account: $(gcloud config get-value account 2>/dev/null || echo 'Not authenticated')"
echo ""

echo "🔄 Running Processes:"
echo "  Node processes: $(ps aux | grep node | grep -v grep | wc -l)"
echo "  Claude instances: $(ps aux | grep claude | grep -v grep | wc -l)"
echo ""

echo "📋 Recent Changes:"
find . -maxdepth 1 -type f -mmin -10 2>/dev/null | head -5 | sed 's/^/  /'

# Update context file
cat > .env-context << EOF
# AUTO-GENERATED ENVIRONMENT CONTEXT
TIMESTAMP="$(date)"
CURRENT_DIR="$(pwd)"
ACTIVE_PORTS="$(lsof -i -P -n | grep LISTEN | grep -E ":(3001|8080|8338|8889|11434)" | awk '{print $9}' | cut -d: -f2 | sort -u | tr '\n' ' ')"
NODE_PROCESSES="$(ps aux | grep node | grep -v grep | wc -l)"
CLOUD_PROJECT="$(gcloud config get-value project 2>/dev/null)"
EOF

echo ""
echo "✅ Context updated in .env-context"