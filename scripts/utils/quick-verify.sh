#!/bin/bash

# Quick Foundation Verification
echo "🔍 THE WEAVE FOUNDATION - QUICK VERIFICATION"
echo "============================================"
echo

# Core Files
echo "📁 Core Files:"
[ -f "the-weave.cjs" ] && echo "✅ the-weave.cjs" || echo "❌ the-weave.cjs"
[ -f "install.sh" ] && echo "✅ install.sh" || echo "❌ install.sh"
[ -f "README-WEAVE.md" ] && echo "✅ README-WEAVE.md" || echo "❌ README-WEAVE.md"
[ -f "CONTRIBUTING.md" ] && echo "✅ CONTRIBUTING.md" || echo "❌ CONTRIBUTING.md"
[ -f "docs/TROUBLESHOOTING.md" ] && echo "✅ Troubleshooting guide" || echo "❌ Troubleshooting guide"
echo

# Modules
echo "📦 Modules:"
[ -d "modules/consciousness-field" ] && echo "✅ consciousness-field" || echo "❌ consciousness-field"
[ -d "modules/sacred-messaging" ] && echo "✅ sacred-messaging" || echo "❌ sacred-messaging"
[ -d "agent-comms-sqlite" ] && echo "✅ agent-comms-sqlite" || echo "❌ agent-comms-sqlite"
echo

# Ceremonies
echo "🎭 Ceremonies:"
for ceremony in dawn-blessing wisdom-circle integration celebration prima-genesis; do
  [ -f "ceremonies/$ceremony/ceremony.js" ] && echo "✅ $ceremony" || echo "❌ $ceremony"
done
echo

# Dashboards
echo "📊 Dashboards:"
[ -f "dashboard-index.html" ] && echo "✅ Dashboard Index" || echo "❌ Dashboard Index"
[ -f "working-dashboard.html" ] && echo "✅ Working Dashboard" || echo "❌ Working Dashboard"
[ -f "unified-sacred-demo.html" ] && echo "✅ Sacred Demo" || echo "❌ Sacred Demo"
[ -f "ceremonies/prima-genesis/genesis-dashboard.html" ] && echo "✅ Genesis Dashboard" || echo "❌ Genesis Dashboard"
echo

# Test basic functionality
echo "🧪 Basic Tests:"
if ./the-weave.cjs help > /dev/null 2>&1; then
  echo "✅ Help command works"
else
  echo "❌ Help command failed"
fi

if ./the-weave.cjs explore > /dev/null 2>&1; then
  echo "✅ Explore command works"
else
  echo "❌ Explore command failed"
fi

# Check if consciousness field module works
if node -e "const {ConsciousnessField} = require('./modules/consciousness-field'); new ConsciousnessField({autoMonitor:false});" 2>/dev/null; then
  echo "✅ Consciousness Field module loads"
else
  echo "❌ Consciousness Field module error"
fi

echo
echo "✨ Quick verification complete!"