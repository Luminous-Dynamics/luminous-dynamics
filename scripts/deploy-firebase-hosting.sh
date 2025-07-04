#!/bin/bash

# Firebase Hosting Deployment Script
# Deploys all static files to Firebase Hosting
# WebSocket/APIs remain on Cloud Run

set -e

echo "🔥 Firebase Hosting Deployment"
echo "════════════════════════════════"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not installed!"
    echo "Install with: npm install -g firebase-tools"
    exit 1
fi

# Initialize Firebase if needed
if [ ! -f ".firebaserc" ]; then
    echo "🔧 Initializing Firebase project..."
    firebase init hosting --project $GOOGLE_CLOUD_PROJECT
fi

# Update WebSocket URLs in static files
echo "📝 Updating WebSocket URLs for production..."

# Get the Cloud Run service URL
SERVICE_URL=$(gcloud run services describe sacred-council-api \
    --region=us-central1 \
    --format='value(status.url)' 2>/dev/null || echo "")

if [ -z "$SERVICE_URL" ]; then
    echo "⚠️  Cloud Run service not deployed yet"
    echo "Using placeholder URL. Remember to update after deploying backend!"
    SERVICE_URL="https://sacred-council-api-xxxxx-uc.a.run.app"
fi

# Update URLs in HTML files
find web -name "*.html" -type f -exec sed -i.bak \
    -e "s|ws://localhost:3333|wss://${SERVICE_URL}/ws|g" \
    -e "s|http://localhost:3333|${SERVICE_URL}/api|g" {} \;

# Update URLs in JS files
find web -name "*.js" -type f -exec sed -i.bak \
    -e "s|ws://localhost:3333|wss://${SERVICE_URL}/ws|g" \
    -e "s|http://localhost:3333|${SERVICE_URL}/api|g" {} \;

# Clean up backup files
find web -name "*.bak" -type f -delete

# Create production index
cat > web/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sacred Council - Evolving Resonant Co-creation</title>
    <link rel="manifest" href="/pwa/manifest.json">
    <meta name="theme-color" content="#A8B5A6">
    <style>
        body {
            font-family: Georgia, serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #FAF9F7;
            color: #333;
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
    </style>
</head>
<body>
    <h1>🌟 Sacred Council Hub</h1>
    <p>Welcome to the Evolving Resonant Co-creation platform</p>
    
    <div class="card">
        <h2>🏛️ Main Interfaces</h2>
        <ul>
            <li><a href="/sacred-council-hub.html">Sacred Council Hub</a> - Multi-agent collaboration</li>
            <li><a href="/unified-consciousness-demo.html">Unified Consciousness Demo</a> - Field visualization</li>
            <li><a href="/applied-harmonies-dojo.html">Applied Harmonies Dojo</a> - Sacred practices</li>
        </ul>
    </div>
    
    <div class="card">
        <h2>📚 Documentation</h2>
        <ul>
            <li><a href="/docs/">Technical Documentation</a></li>
            <li><a href="/sacred-constellation-map.html">Sacred Journey Map</a></li>
        </ul>
    </div>
    
    <div class="card">
        <h2>🔧 System Status</h2>
        <p>WebSocket Server: <span id="ws-status">Checking...</span></p>
    </div>
    
    <script>
        // Check WebSocket connection
        const ws = new WebSocket('${SERVICE_URL}'.replace('https', 'wss') + '/ws');
        const status = document.getElementById('ws-status');
        
        ws.onopen = () => {
            status.textContent = '✅ Connected';
            status.style.color = 'green';
            ws.close();
        };
        
        ws.onerror = () => {
            status.textContent = '❌ Offline';
            status.style.color = 'red';
        };
        
        // PWA install
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/pwa/service-worker.js');
        }
    </script>
</body>
</html>
EOF

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "════════════════════════════════"
echo
echo "🌐 Your site is live at:"
firebase hosting:channel:view --json | jq -r '.url'
echo
echo "📊 Next steps:"
echo "1. Deploy WebSocket backend to Cloud Run"
echo "2. Update Firebase rewrites if needed"
echo "3. Set up custom domain"
echo "4. Enable Firebase Analytics"