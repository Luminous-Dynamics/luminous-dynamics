#!/bin/bash
# Check deployment status

echo "🔍 Checking Deployment Status"
echo "============================"
echo ""

# Check Firebase
echo "✅ Firebase Hosting: https://mycelix-network.web.app"
curl -s -o /dev/null -w "   Status: %{http_code}\n" https://mycelix-network.web.app/
echo ""

# Check Cloud Run deployment
echo "⏳ Cloud Run WebSocket:"
if gcloud run services describe sacred-council-api --region=us-central1 &>/dev/null; then
  SERVICE_URL=$(gcloud run services describe sacred-council-api --region=us-central1 --format='value(status.url)')
  echo "   ✅ Deployed to: $SERVICE_URL"
  
  # Save deployment info
  cat > docs/deployment/WEBSOCKET_DEPLOYED.md << EOF
# WebSocket Deployment Info

- **Service**: sacred-council-api
- **URL**: $SERVICE_URL
- **WebSocket**: ${SERVICE_URL/https/wss}
- **Region**: us-central1
- **Deployed**: $(date)

## Test Connection

\`\`\`javascript
const ws = new WebSocket('${SERVICE_URL/https/wss}');
ws.onopen = () => console.log('Connected!');
ws.onmessage = (e) => console.log('Message:', e.data);
\`\`\`
EOF
  
  echo "   📄 Deployment info saved!"
else
  echo "   ⏳ Not deployed yet or still building..."
  echo "   Check build status:"
  echo "   gcloud builds list --limit=1"
fi