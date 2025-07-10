#!/bin/bash
# Test Runner - Starts Sacred Core and runs tests

echo "🌟 Starting Sacred Core in background..."
npm start > sacred-core.log 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to initialize..."
sleep 5

echo "🧪 Running tests..."
node test-sacred-core.js

echo "🛑 Stopping Sacred Core..."
kill $SERVER_PID

echo "📋 Server logs:"
tail -20 sacred-core.log

echo "✨ Test run complete!"