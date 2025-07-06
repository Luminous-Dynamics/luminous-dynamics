#!/bin/bash
# Fix localhost:3001 references in deployed files

echo "🔄 Fixing localhost:3001 references in deployed files"
echo "=================================================="

# Cloud Run service URL
SERVICE_URL="https://sacred-council-310699330526.us-central1.run.app"

# Count files to update
TOTAL_FILES=$(grep -r "localhost:3001" firebase-build/ --include="*.html" --include="*.js" | cut -d: -f1 | sort | uniq | wc -l)
echo "📋 Found $TOTAL_FILES files with localhost:3001 references"
echo ""

# Update all HTML and JS files
echo "📝 Updating files..."
find firebase-build -name "*.html" -o -name "*.js" | while read file; do
  if grep -q "localhost:3001" "$file" 2>/dev/null; then
    echo "   Updating: $file"
    # Create backup
    cp "$file" "$file.bak"
    
    # Replace all localhost:3001 references
    sed -i \
      -e "s|http://localhost:3001|$SERVICE_URL|g" \
      -e "s|https://localhost:3001|$SERVICE_URL|g" \
      -e "s|ws://localhost:3001|wss://sacred-council-310699330526.us-central1.run.app|g" \
      -e "s|wss://localhost:3001|wss://sacred-council-310699330526.us-central1.run.app|g" \
      "$file"
  fi
done

echo ""
echo "✅ Files updated successfully!"
echo ""

# Verify changes
echo "📊 Verification:"
REMAINING=$(grep -r "localhost:3001" firebase-build/ --include="*.html" --include="*.js" | wc -l)
if [ "$REMAINING" -eq 0 ]; then
  echo "   ✅ No localhost:3001 references remaining"
else
  echo "   ⚠️  $REMAINING localhost:3001 references still found"
fi

echo ""
echo "🧹 Cleaning up backup files..."
find firebase-build -name "*.bak" -delete

echo ""
echo "✅ URL update complete!"
echo ""
echo "📌 Next steps:"
echo "   1. Deploy to Firebase: npm run deploy:firebase"
echo "   2. Or use secure deployment: ./firebase-deploy-secure.sh"