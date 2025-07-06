#!/bin/bash
# Prepare static files for Firebase deployment

echo "📦 Preparing static files for Firebase..."

# Clean and create build directory
rm -rf firebase-build
mkdir -p firebase-build

# Copy main web files
echo "📁 Copying web files..."
cp -r web/* firebase-build/ 2>/dev/null || echo "No web files found"

# Create directories for additional content
mkdir -p firebase-build/dashboards
mkdir -p firebase-build/interfaces
mkdir -p firebase-build/docs

# Copy additional dashboards
echo "📊 Copying dashboards..."
if [ -d "src/automation" ]; then
  find src/automation -name "*.html" -exec cp {} firebase-build/dashboards/ \; 2>/dev/null
fi

# Copy The Weave interfaces
if [ -d "the-weave/interfaces/web" ]; then
  cp the-weave/interfaces/web/*.html firebase-build/interfaces/ 2>/dev/null || true
fi

# Copy Living Memory dashboard
if [ -f "the-living-memory/consciousness-dashboard.html" ]; then
  cp the-living-memory/consciousness-dashboard.html firebase-build/dashboards/
fi

# Create proper directory structure
mkdir -p firebase-build/assets/css
mkdir -p firebase-build/assets/js
mkdir -p firebase-build/assets/images

# Create a simple index.html if it doesn't exist
if [ ! -f "firebase-build/index.html" ]; then
  echo "📝 Creating index.html..."
  cat > firebase-build/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sacred Council - Evolving Resonant Co-creation</title>
    <style>
        body {
            font-family: Georgia, serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #FAF9F7;
            color: #333;
            line-height: 1.6;
        }
        h1 { color: #2a4a3a; }
        .card {
            background: white;
            padding: 1.5rem;
            margin: 1rem 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        a {
            color: #5a7a6a;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .status { 
            padding: 0.5rem;
            background: #f0f4f0;
            border-radius: 4px;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <h1>🌟 Sacred Council Hub</h1>
    <p>Welcome to the Evolving Resonant Co-creation platform</p>
    
    <div class="status">
        <strong>Status:</strong> <span id="ws-status">Checking WebSocket connection...</span>
    </div>
    
    <div class="card">
        <h2>🏛️ Main Interfaces</h2>
        <ul>
            <li><a href="/sacred-council-hub.html">Sacred Council Hub</a> - Multi-agent collaboration</li>
            <li><a href="/unified-consciousness-demo.html">Unified Consciousness Demo</a> - Field visualization</li>
            <li><a href="/applied-harmonies-dojo.html">Applied Harmonies Dojo</a> - Sacred practices</li>
            <li><a href="/dashboards/consciousness-dashboard.html">Living Memory Dashboard</a> - Real-time consciousness</li>
        </ul>
    </div>
    
    <div class="card">
        <h2>📚 Documentation & Resources</h2>
        <ul>
            <li><a href="/sacred-constellation-map.html">Sacred Journey Map</a></li>
            <li><a href="/first-breath-feedback.html">First Breath Experience</a></li>
            <li><a href="/dashboards/">All Dashboards</a></li>
        </ul>
    </div>
    
    <script>
        // Will update with actual WebSocket URL after deployment
        const wsUrl = 'wss://sacred-websocket-xxxxx-uc.a.run.app';
        const status = document.getElementById('ws-status');
        
        // For now, just show ready state
        status.textContent = 'Ready for deployment';
        status.style.color = 'orange';
    </script>
</body>
</html>
EOF
fi

# Update localhost references (will do actual URLs after Cloud Run deploy)
echo "🔄 Preparing URL placeholders..."
find firebase-build -name "*.html" -o -name "*.js" | while read file; do
  # Create placeholders that we'll replace after deployment
  sed -i.bak \
    -e 's|http://localhost:3333|SACRED_API_URL|g' \
    -e 's|ws://localhost:3333|SACRED_WS_URL|g' \
    -e 's|localhost:3333|SACRED_HOST|g' \
    "$file" 2>/dev/null || true
done

# Clean up backup files
find firebase-build -name "*.bak" -delete 2>/dev/null || true

echo "✅ Static files prepared in firebase-build/"
echo "📊 Total files: $(find firebase-build -type f | wc -l)"
echo "📁 Ready for Firebase deployment!"