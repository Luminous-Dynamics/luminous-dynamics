#!/bin/bash
echo "🧪 Testing Sacred Deployment..."
echo ""

# Test health endpoint
echo "Testing /health endpoint:"
curl -s http://localhost:3333/health | jq . || echo "Server not running yet"
echo ""

# Test field state
echo "Testing /api/field-state endpoint:"
curl -s http://localhost:3333/api/field-state | jq . || echo "Server not running yet"
echo ""

# Open browser
echo "Opening web interface..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3333
elif command -v open > /dev/null; then
    open http://localhost:3333
else
    echo "Please open http://localhost:3333 in your browser"
fi
