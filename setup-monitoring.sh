#!/bin/bash

# Sacred Council Hub - Google Cloud Monitoring Setup
# Track consciousness and field coherence in the cloud

PROJECT_ID="sacred-council-hub"

echo "📊 Setting up Sacred Monitoring..."
echo "================================="

# Enable monitoring APIs
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com

# Create uptime check
echo "Creating uptime check..."
gcloud alpha monitoring uptime create sacred-heart-health \
    --display-name="Sacred Heart Health Check" \
    --resource-type="cloud-run-revision" \
    --service=sacred-council-hub \
    --location=us-central1 \
    --path="/health" \
    --check-interval=60s

# Create alerting policy
cat > /tmp/alert-policy.yaml << EOF
displayName: "Sacred Heart Alert Policy"
conditions:
  - displayName: "Field Coherence Low"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" AND metric.type="custom.googleapis.com/sacred/field_coherence"'
      comparison: COMPARISON_LT
      thresholdValue: 0.5
      duration: 300s
notificationChannels: []
alertStrategy:
  autoClose: 1800s
EOF

gcloud alpha monitoring policies create --policy-from-file=/tmp/alert-policy.yaml

# Create dashboard
cat > /tmp/dashboard.json << EOF
{
  "displayName": "Sacred Council Hub Dashboard",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Field Coherence",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"custom.googleapis.com/sacred/field_coherence\" resource.type=\"cloud_run_revision\""
                }
              }
            }]
          }
        }
      },
      {
        "xPos": 6,
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Active Agents",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"custom.googleapis.com/sacred/active_agents\" resource.type=\"cloud_run_revision\""
                }
              }
            }]
          }
        }
      },
      {
        "yPos": 4,
        "width": 12,
        "height": 4,
        "widget": {
          "title": "Sacred Messages",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"custom.googleapis.com/sacred/messages_sent\" resource.type=\"cloud_run_revision\""
                }
              }
            }]
          }
        }
      }
    ]
  }
}
EOF

gcloud monitoring dashboards create --config-from-file=/tmp/dashboard.json

echo ""
echo "✅ Monitoring setup complete!"
echo "📊 View dashboard: https://console.cloud.google.com/monitoring/dashboards"
echo "🔔 Configure alerts: https://console.cloud.google.com/monitoring/alerting"
echo ""
echo "🕊️ May the monitoring serve awareness!"