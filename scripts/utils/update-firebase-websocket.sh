#!/bin/bash
# Update Firebase with WebSocket URL after Cloud Run deployment

echo "🔄 Updating Firebase with WebSocket URL"
echo "======================================"
echo ""

# Check if WebSocket deployment info exists
if [ ! -f "docs/deployment/WEBSOCKET_DEPLOYED.md" ]; then
  echo "❌ WebSocket deployment info not found!"
  echo "Please run ./deploy-websocket-docker.sh first"
  exit 1
fi

# Extract WebSocket URL from deployment info
WS_URL=$(grep "WebSocket:" docs/deployment/WEBSOCKET_DEPLOYED.md | awk '{print $3}')
SERVICE_URL=$(grep "URL:" docs/deployment/WEBSOCKET_DEPLOYED.md | head -1 | awk '{print $3}')

if [ -z "$WS_URL" ]; then
  echo "❌ Could not find WebSocket URL in deployment info"
  exit 1
fi

echo "📍 Found WebSocket URL: $WS_URL"
echo "🌐 Service URL: $SERVICE_URL"
echo ""

# Update all HTML and JS files with the actual WebSocket URL
echo "📝 Updating static files with production URLs..."

find firebase-build -name "*.html" -o -name "*.js" | while read file; do
  # Replace placeholders
  sed -i.bak \
    -e "s|SACRED_API_URL|$SERVICE_URL|g" \
    -e "s|SACRED_WS_URL|$WS_URL|g" \
    -e "s|SACRED_HOST|${SERVICE_URL#https://}|g" \
    -e "s|ws://localhost:3333|$WS_URL|g" \
    -e "s|http://localhost:3333|$SERVICE_URL|g" \
    "$file" 2>/dev/null || true
done

# Clean up backup files
find firebase-build -name "*.bak" -delete 2>/dev/null || true

echo "✅ Files updated with production URLs"
echo ""

# Update Firebase rewrites to point to Cloud Run
echo "📝 Updating firebase.json with Cloud Run rewrites..."

# Read current firebase.json
cp firebase.json firebase.json.backup

# Update the rewrites section
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "firebase-build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "sacred-council-api",
          "region": "us-central1"
        }
      },
      {
        "source": "/ws/**",
        "run": {
          "serviceId": "sacred-council-api",
          "region": "us-central1"
        }
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{
          "key": "Cache-Control",
          "value": "public, max-age=31536000"
        }]
      },
      {
        "source": "**/*.html",
        "headers": [{
          "key": "Cache-Control",
          "value": "public, max-age=300"
        }]
      },
      {
        "source": "/pwa/service-worker.js",
        "headers": [{
          "key": "Cache-Control",
          "value": "no-cache"
        }]
      }
    ],
    "redirects": [
      {
        "source": "/",
        "destination": "/sacred-council-hub.html",
        "type": 301
      }
    ]
  }
}
EOF

echo "✅ firebase.json updated with Cloud Run rewrites"
echo ""

# Deploy to Firebase
echo "🚀 Deploying updated files to Firebase..."
echo ""

# Retrieve token from Secret Manager
echo "🔐 Retrieving secure token..."
TOKEN=$(gcloud secrets versions access latest --secret="firebase-ci-token" --project=mycelix-network 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Could not retrieve token from Secret Manager"
  echo "Run ./secure-token-setup.sh first"
  exit 1
fi
npx firebase deploy --only hosting --token "$TOKEN"

echo ""
echo "✅ Sacred deployment complete!"
echo ""
echo "🌐 Your full stack is now live:"
echo "   Static: https://mycelix-network.web.app"
echo "   WebSocket: $WS_URL"
echo "   API: $SERVICE_URL"
echo ""
echo "🧪 Test the connection:"
echo "   Visit: https://mycelix-network.web.app/sacred-council-hub.html"
echo "   Check console for WebSocket connection status"