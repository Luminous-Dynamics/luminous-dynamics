#!/bin/bash

# Sacred Alerts Setup Script
# Creates the ESSENTIAL alerts for WebSocket deployment
# Philosophy: Alert only on what matters, avoid noise

set -e

echo "🚨 Setting up Sacred Monitoring Alerts..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
echo "📍 Project: $PROJECT_ID"

# Check if user has an email notification channel
echo -e "\n📧 Checking notification channels..."
CHANNELS=$(gcloud alpha monitoring channels list --filter="type=email" --format="value(name)" | head -1)

if [ -z "$CHANNELS" ]; then
    echo "❌ No email notification channel found!"
    echo "Creating one now..."
    read -p "Enter your email address: " EMAIL
    
    CHANNELS=$(gcloud alpha monitoring channels create \
        --display-name="Sacred Alerts Email" \
        --type=email \
        --channel-labels=email_address=$EMAIL \
        --format="value(name)")
    
    echo "✅ Created notification channel"
fi

echo "📬 Using notification channel: $CHANNELS"

# Alert 1: Service is DOWN (CRITICAL)
echo -e "\n🔴 Creating Alert 1: Service Down..."
gcloud alpha monitoring policies create \
    --notification-channels=$CHANNELS \
    --display-name="🔴 CRITICAL: Sacred Council WebSocket Down" \
    --documentation="The WebSocket server is not responding to health checks. \
Check logs: gcloud logging tail 'resource.labels.service_name=sacred-council-api'" \
    --condition-display-name="Service not responding" \
    --condition-threshold-value=1 \
    --condition-threshold-duration=180s \
    --condition-threshold-filter='
        resource.type="cloud_run_revision"
        AND resource.label.service_name="sacred-council-api"
        AND metric.type="run.googleapis.com/request_count"' \
    --condition-threshold-comparison=COMPARISON_LT \
    --combiner=OR || echo "Alert might already exist"

# Alert 2: High Error Rate (IMPORTANT)
echo -e "\n🟡 Creating Alert 2: High Error Rate..."
gcloud alpha monitoring policies create \
    --notification-channels=$CHANNELS \
    --display-name="🟡 WARNING: High Error Rate" \
    --documentation="More than 10% of requests are failing. \
Check errors: gcloud logging read 'severity>=ERROR' --limit=50" \
    --condition-display-name="Error rate above 10%" \
    --condition-threshold-value=0.1 \
    --condition-threshold-duration=300s \
    --condition-threshold-filter='
        resource.type="cloud_run_revision"
        AND resource.label.service_name="sacred-council-api"
        AND metric.type="run.googleapis.com/request_count"
        AND metric.label.response_code_class!="2xx"' \
    --condition-threshold-aggregation='{"alignmentPeriod":"60s","perSeriesAligner":"ALIGN_RATE"}' \
    --combiner=OR || echo "Alert might already exist"

# Alert 3: Memory Pressure (WARNING)
echo -e "\n🟠 Creating Alert 3: Memory Pressure..."
gcloud alpha monitoring policies create \
    --notification-channels=$CHANNELS \
    --display-name="🟠 WARNING: High Memory Usage" \
    --documentation="Container using >80% memory. May need scaling. \
Current usage: gcloud run services describe sacred-council-api" \
    --condition-display-name="Memory above 80%" \
    --condition-threshold-value=0.8 \
    --condition-threshold-duration=300s \
    --condition-threshold-filter='
        resource.type="cloud_run_revision"
        AND resource.label.service_name="sacred-council-api"
        AND metric.type="run.googleapis.com/container/memory/utilizations"' \
    --combiner=OR || echo "Alert might already exist"

# Alert 4: Cost Spike (FINANCIAL)
echo -e "\n💰 Creating Alert 4: Cost Alert..."
echo "Setting up billing alert (requires console access)..."
echo "Please visit: https://console.cloud.google.com/billing/budgets"
echo "Recommended settings:"
echo "  - Budget name: Sacred Council Monthly"
echo "  - Amount: \$50"
echo "  - Alert at: 50%, 90%, 100%"
echo "  - Email: Use same as above"

# Alert 5: Too Many Connections (PROTECTION)
echo -e "\n🔒 Creating Alert 5: Connection Limit..."
gcloud alpha monitoring policies create \
    --notification-channels=$CHANNELS \
    --display-name="🔒 INFO: High Connection Count" \
    --documentation="Many WebSocket connections active. Normal if popular! \
Check: gcloud logging read 'jsonPayload.activeConnections>0' --limit=10" \
    --condition-display-name="More than 100 active connections" \
    --condition-threshold-value=100 \
    --condition-threshold-duration=600s \
    --condition-threshold-filter='
        resource.type="cloud_run_revision"
        AND resource.label.service_name="sacred-council-api"
        AND metric.type="logging.googleapis.com/user/active_connections"' \
    --combiner=OR || echo "Alert might already exist"

# Create uptime check
echo -e "\n🏃 Creating Uptime Check..."
gcloud monitoring uptime create \
    --display-name="Sacred Council Health Check" \
    --resource-type="cloud-run-revision" \
    --service="sacred-council-api" \
    --location="us-central1" \
    --path="/health" \
    --check-interval=300 || echo "Uptime check might already exist"

echo -e "\n✅ Sacred Alerts Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "📊 Your alerts:"
echo "  1. 🔴 Service Down - Know immediately if crashed"
echo "  2. 🟡 High Errors - Catch problems early"
echo "  3. 🟠 Memory Full - Prevent OOM crashes"
echo "  4. 💰 Cost Alert - No bill surprises (set manually)"
echo "  5. 🔒 Many Users - Celebrate popularity!"
echo
echo "🔍 View all alerts:"
echo "  gcloud alpha monitoring policies list"
echo
echo "📱 Get mobile notifications:"
echo "  Download 'Google Cloud Console' app"
echo "  Sign in with same account"
echo "  Enable push notifications"
echo
echo "🙏 May your monitoring be peaceful and your alerts be few!"