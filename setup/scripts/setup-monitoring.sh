#!/bin/bash
# Setup monitoring and alerts for sacred system

echo "📊 Setting Up Sacred Monitoring"
echo "=============================="
echo ""

PROJECT_ID="mycelix-network"
SERVICE_NAME="sacred-council-api"
REGION="us-central1"

# Set project
gcloud config set project $PROJECT_ID

echo "1️⃣ Creating Uptime Checks..."
echo ""

# Create uptime check for Firebase hosting
gcloud monitoring uptime-check-configs create \
  --display-name="Sacred Firebase Hosting" \
  --monitored-resource="type=uptime_url,host=mycelix-network.web.app" \
  --http-check="path=/,port=443,use-ssl=true" \
  --check-interval=5m \
  --timeout=10s || echo "Uptime check may already exist"

# Create uptime check for WebSocket health (after deployment)
if [ -f "docs/deployment/WEBSOCKET_DEPLOYED.md" ]; then
  SERVICE_URL=$(grep "URL:" docs/deployment/WEBSOCKET_DEPLOYED.md | head -1 | cut -d' ' -f3)
  HOST=$(echo $SERVICE_URL | sed 's|https://||')
  
  gcloud monitoring uptime-check-configs create \
    --display-name="Sacred WebSocket Health" \
    --monitored-resource="type=uptime_url,host=$HOST" \
    --http-check="path=/health,port=443,use-ssl=true" \
    --check-interval=1m \
    --timeout=10s || echo "Uptime check may already exist"
fi

echo ""
echo "2️⃣ Creating Alert Policies..."
echo ""

# Alert for service downtime
cat > /tmp/alert-policy.json << EOF
{
  "displayName": "Sacred Service Down Alert",
  "conditions": [
    {
      "displayName": "Service is down",
      "conditionThreshold": {
        "filter": "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_count\"",
        "comparison": "COMPARISON_LT",
        "thresholdValue": 1,
        "duration": "300s",
        "aggregations": [
          {
            "alignmentPeriod": "60s",
            "perSeriesAligner": "ALIGN_RATE"
          }
        ]
      }
    }
  ],
  "notificationChannels": []
}
EOF

gcloud alpha monitoring policies create --policy-from-file=/tmp/alert-policy.json || echo "Alert policy may already exist"

echo ""
echo "3️⃣ Creating Dashboard..."
echo ""

# Create monitoring dashboard
cat > /tmp/dashboard.json << EOF
{
  "displayName": "Sacred Council Monitoring",
  "gridLayout": {
    "widgets": [
      {
        "title": "Request Rate",
        "xyChart": {
          "dataSets": [{
            "timeSeriesQuery": {
              "timeSeriesFilter": {
                "filter": "resource.type=\"cloud_run_revision\" resource.labels.service_name=\"$SERVICE_NAME\"",
                "aggregation": {
                  "alignmentPeriod": "60s",
                  "perSeriesAligner": "ALIGN_RATE"
                }
              }
            }
          }]
        }
      },
      {
        "title": "WebSocket Connections",
        "xyChart": {
          "dataSets": [{
            "timeSeriesQuery": {
              "timeSeriesFilter": {
                "filter": "resource.type=\"cloud_run_revision\" metric.type=\"run.googleapis.com/container/instance_count\"",
                "aggregation": {
                  "alignmentPeriod": "60s",
                  "perSeriesAligner": "ALIGN_MEAN"
                }
              }
            }
          }]
        }
      }
    ]
  }
}
EOF

gcloud monitoring dashboards create --config-from-file=/tmp/dashboard.json || echo "Dashboard may already exist"

echo ""
echo "4️⃣ Quick Monitoring Commands..."
echo ""

cat > docs/deployment/MONITORING_COMMANDS.md << 'EOF'
# Sacred Monitoring Commands

## View Logs
```bash
# Cloud Run logs
gcloud logs read --service=sacred-council-api --limit=50

# Firebase hosting logs (in console)
open https://console.firebase.google.com/project/mycelix-network/hosting/usage
```

## Check Health
```bash
# WebSocket health
curl https://sacred-council-api-xxxxx-uc.a.run.app/health

# Firebase hosting
curl -I https://mycelix-network.web.app/
```

## Monitor Metrics
```bash
# Cloud Run metrics
gcloud run services describe sacred-council-api --region=us-central1

# View in console
open https://console.cloud.google.com/run/detail/us-central1/sacred-council-api/metrics
```

## Cost Monitoring
```bash
# Current month costs
gcloud billing accounts list
gcloud alpha billing budgets list

# Set budget alert
open https://console.cloud.google.com/billing/budgets
```
EOF

echo "✅ Monitoring setup complete!"
echo ""
echo "📊 View your dashboards:"
echo "   https://console.cloud.google.com/monitoring/dashboards"
echo ""
echo "📈 View metrics:"
echo "   https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/metrics"
echo ""
echo "💰 Check costs:"
echo "   https://console.cloud.google.com/billing"