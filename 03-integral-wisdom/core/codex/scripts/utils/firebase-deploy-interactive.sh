#!/bin/bash
# Interactive Firebase deployment

echo "🔥 Firebase Deployment (Interactive)"
echo "==================================="
echo ""
echo "Firebase needs to create a hosting site."
echo "When prompted:"
echo "1. Answer 'Y' to create a hosting site"
echo "2. Use default options"
echo ""
echo "Running Firebase init..."
echo ""

# Initialize hosting interactively
npx firebase init hosting

echo ""
echo "After initialization completes, run:"
echo "npx firebase deploy --only hosting"