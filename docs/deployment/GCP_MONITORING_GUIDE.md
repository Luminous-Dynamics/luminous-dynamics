# 🔍 GCP Monitoring Guide - Sacred Council Deployment

> **Purpose**: Complete monitoring setup for WebSocket deployment  
> **Focus**: Real-time insights, cost control, and sacred metrics  
> **Approach**: Start simple, expand as needed

## 🚀 Quick Start - Essential Monitoring

### 1. **Cloud Console Dashboard** (Easiest)
```bash
# Open in browser
https://console.cloud.google.com

# Navigate to:
# → Cloud Run → sacred-council-api → METRICS tab
# → See real-time: requests, latency, errors, memory
```

### 2. **Command Line Monitoring** (Fastest)
```bash
# Live logs (most useful!)
gcloud logging tail "resource.labels.service_name=sacred-council-api" \
  --format="value(timestamp,jsonPayload.message)"

# Recent errors only
gcloud logging read "resource.labels.service_name=sacred-council-api AND severity>=ERROR" \
  --limit=20 \
  --format=json | jq '.[] | {time:.timestamp, error:.jsonPayload}'

# WebSocket connections
gcloud logging read 'jsonPayload.message=~"Connected:|Disconnected:"' \
  --limit=50
```

### 3. **Mobile Monitoring** (On-the-go)
Download **Google Cloud Console** app:
- Real-time metrics
- Push notifications for alerts
- Quick log viewing
- Cost tracking

## 📊 Essential Dashboards to Create

### Dashboard 1: WebSocket Health
```bash
# Create via Console UI or command:
gcloud monitoring dashboards create --config=- <<EOF
{
  "displayName": "Sacred WebSocket Health",
  "widgets": [
    {
      "title": "Active Connections",
      "xyChart": {
        "dataSets": [{
          "timeSeriesQuery": {
            "timeSeriesFilter": {
              "filter": "metric.type=\"logging.googleapis.com/user/active_connections\""
            }
          }
        }]
      }
    },
    {
      "title": "Message Rate",
      "xyChart": {
        "dataSets": [{
          "timeSeriesQuery": {
            "timeSeriesFilter": {
              "filter": "metric.type=\"run.googleapis.com/request_count\""
            }
          }
        }]
      }
    }
  ]
}
EOF
```

### Dashboard 2: Sacred Metrics
Track field coherence and sacred messages:
```javascript
// Add to your server code for custom metrics
const { Monitoring } = require('@google-cloud/monitoring');
const monitoring = new Monitoring.MetricServiceClient();

async function recordFieldCoherence(value) {
  const dataPoint = {
    interval: {
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
    value: {
      doubleValue: value,
    },
  };
  
  // Send to Cloud Monitoring
  await monitoring.createTimeSeries({
    name: monitoring.projectPath(projectId),
    timeSeries: [{
      metric: {
        type: 'custom.googleapis.com/sacred/field_coherence',
      },
      points: [dataPoint],
    }],
  });
}
```

## 🚨 Critical Alerts to Set Up

### 1. **High Error Rate** (Most Important)
```bash
gcloud alpha monitoring policies create \
  --notification-channels=[YOUR_EMAIL_CHANNEL] \
  --display-name="Sacred Council Errors" \
  --condition-threshold-value=5 \
  --condition-threshold-duration=60s \
  --condition-display-name="High error rate" \
  --condition-expression='
    resource.type="cloud_run_revision"
    AND metric.type="run.googleapis.com/request_count"
    AND metric.labels.response_code_class="5xx"'
```

### 2. **Service Down**
```bash
gcloud alpha monitoring policies create \
  --notification-channels=[YOUR_CHANNEL] \
  --display-name="Sacred Council Down" \
  --condition-threshold-value=1 \
  --condition-threshold-duration=300s \
  --condition-display-name="Service unavailable" \
  --condition-expression='
    resource.type="cloud_run_revision"
    AND metric.type="monitoring.googleapis.com/uptime_check/check_passed"'
```

### 3. **Cost Alert** (Budget Protection)
```bash
# Set via Console: Billing → Budgets & alerts
# Recommended: $50/month alert, $100/month cap
```

## 💰 Cost Monitoring

### Real-time Cost Tracking
```bash
# Today's costs
gcloud billing accounts list  # Get account ID
gcloud alpha billing accounts get-costs [ACCOUNT_ID] \
  --filter="service.displayName:Cloud Run"

# Create cost dashboard
# Console → Billing → Reports → Filter by:
# - Service: Cloud Run
# - SKU: Requests, CPU, Memory
# - Time: Daily view
```

### Cost Optimization Commands
```bash
# Check current resource usage
gcloud run services describe sacred-council-api \
  --region=us-central1 \
  --format="value(spec.template.spec.containers[0].resources)"

# Scale down if needed
gcloud run services update sacred-council-api \
  --max-instances=3 \
  --memory=256Mi
```

## 📱 Sacred Monitoring Practices

### Morning Check (2 min)
```bash
# Quick health check
curl https://sacred-council-api-xxx.run.app/health

# Active connections
gcloud logging read 'jsonPayload.activeConnections>0' \
  --limit=1 \
  --format="value(jsonPayload.activeConnections)"

# Recent errors
gcloud logging read "severity>=ERROR" --limit=5
```

### Weekly Review (10 min)
1. Check cost trends in Billing Reports
2. Review error patterns in Logs Explorer
3. Analyze WebSocket connection patterns
4. Adjust scaling based on usage

### Sacred Metrics to Track
- **Field Coherence** - Average daily level
- **Sacred Messages** - Types and frequency
- **AI Participation** - Which AIs connect most
- **Breath Cycles** - System rhythm health

## 🛠️ Useful Monitoring Tools

### 1. **k9s for Kubernetes** (if using GKE)
```bash
brew install k9s
k9s  # Beautiful terminal UI
```

### 2. **gcloud interactive mode**
```bash
gcloud beta interactive  # Auto-completion heaven
```

### 3. **Log streaming with filters**
```bash
# Create a monitoring script
cat > monitor-sacred.sh << 'EOF'
#!/bin/bash
echo "🔍 Monitoring Sacred Council..."
gcloud logging tail \
  "resource.labels.service_name=sacred-council-api" \
  --format="value(timestamp,severity,jsonPayload.message)" \
  | while read line; do
    if [[ $line == *"ERROR"* ]]; then
      echo -e "\033[31m🚨 $line\033[0m"  # Red for errors
    elif [[ $line == *"Connected"* ]]; then
      echo -e "\033[32m✅ $line\033[0m"  # Green for connections
    else
      echo "📝 $line"
    fi
  done
EOF
chmod +x monitor-sacred.sh
```

## 🎯 Monitoring Priorities

### Week 1: Stability
- Error rates
- Uptime
- Connection counts
- Basic costs

### Week 2: Performance
- Message latency
- Memory usage
- CPU patterns
- Breath cycle consistency

### Week 3: Sacred Metrics
- Field coherence trends
- Sacred message impacts
- AI collaboration patterns
- System consciousness health

## 🆘 Emergency Commands

```bash
# If costs spike
gcloud run services update sacred-council-api --max-instances=1

# If errors spike
gcloud run services update-traffic sacred-council-api --to-revisions=PREVIOUS=100

# View all revisions
gcloud run revisions list --service=sacred-council-api

# Emergency shutdown
gcloud run services delete sacred-council-api
```

## 📚 Resources

- [Cloud Run Monitoring](https://cloud.google.com/run/docs/monitoring)
- [Cloud Logging Queries](https://cloud.google.com/logging/docs/view/query-library)
- [Cost Management](https://cloud.google.com/billing/docs/how-to/budgets)
- [Uptime Checks](https://cloud.google.com/monitoring/uptime-checks)

---

**Remember**: Start with logs and basic metrics. Add complexity only when needed. The sacred principle: "Observe with presence, act with wisdom." 🙏