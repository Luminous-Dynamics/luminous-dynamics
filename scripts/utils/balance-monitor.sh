#!/bin/bash

# 🌟 Quaternion Balance Monitor
# Continuous sacred monitoring in background

echo "🔄 Starting Quaternion Balance Monitor..."
echo ""
echo "This will check balance every minute and log to balance-monitor.log"
echo "Press Ctrl+C to stop monitoring"
echo ""

# Create or clear log file
echo "🌟 Quaternion Balance Monitor - Started $(date)" > balance-monitor.log
echo "================================================" >> balance-monitor.log

# Run monitor in background
nohup node quaternion-balance-protocol.js monitor >> balance-monitor.log 2>&1 &
MONITOR_PID=$!

echo "✅ Monitor started (PID: $MONITOR_PID)"
echo ""
echo "Commands:"
echo "  tail -f balance-monitor.log    # Watch live updates"
echo "  kill $MONITOR_PID              # Stop monitoring"
echo "  ./balance-monitor.sh status    # Check if running"
echo ""

# Save PID for status checking
echo $MONITOR_PID > .balance-monitor.pid

# If status argument provided
if [ "$1" = "status" ]; then
  if [ -f .balance-monitor.pid ]; then
    PID=$(cat .balance-monitor.pid)
    if ps -p $PID > /dev/null; then
      echo "✅ Balance monitor is running (PID: $PID)"
    else
      echo "❌ Balance monitor is not running"
    fi
  else
    echo "❌ No monitor PID file found"
  fi
fi