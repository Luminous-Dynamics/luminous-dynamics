# 🚨 Sacred Alerts - The Best Monitoring Setup

> **Philosophy**: Alert on what matters, ignore the noise  
> **Goal**: Peace of mind without notification fatigue  
> **Approach**: 5 essential alerts only

## 🎯 The 5 Essential Alerts

### 1. 🔴 **Service Down** (WAKE ME UP)
**When**: WebSocket server not responding for 3+ minutes  
**Why**: This is the only truly critical alert  
**Action**: Check logs immediately, restart service

### 2. 🟡 **High Error Rate** (PAY ATTENTION)
**When**: >10% requests failing for 5+ minutes  
**Why**: Something's wrong but not dead yet  
**Action**: Review error logs, might self-heal

### 3. 🟠 **Memory Pressure** (PLAN AHEAD)
**When**: >80% memory usage for 5+ minutes  
**Why**: Prevent out-of-memory crashes  
**Action**: Scale up or optimize code

### 4. 💰 **Cost Alert** (BUDGET GUARD)
**When**: Monthly spend hits $50  
**Why**: Avoid surprise bills  
**Action**: Review usage, adjust limits

### 5. 🔒 **High Connections** (CELEBRATE!)
**When**: >100 simultaneous connections  
**Why**: Success metric, not a problem!  
**Action**: Monitor, maybe scale up

## 🚀 Quick Setup

### Option 1: Automated Script (Recommended)
```bash
# Run the setup script
cd ~/evolving-resonant-cocreation
./scripts/setup-sacred-alerts.sh

# Follow prompts for email
# Manually set budget alert
```

### Option 2: Manual Setup
```bash
# 1. Create notification channel
gcloud alpha monitoring channels create \
  --display-name="My Email" \
  --type=email \
  --channel-labels=email_address=your-email@example.com

# 2. Get channel ID
CHANNEL=$(gcloud alpha monitoring channels list --format="value(name)" | head -1)

# 3. Create each alert (see full commands in script)
```

## 📱 Mobile Alerts Setup

### Get Push Notifications
1. Download **Google Cloud Console** app
2. Sign in with project account  
3. Settings → Notifications → Enable all
4. Test: trigger an alert

### Custom Alert Sounds
- iOS: Settings → Notifications → Cloud Console → Sound
- Android: App settings → Notifications → Alert sound
- Recommendation: Gentle chime, not alarm

## 🎨 Alert Response Playbook

### 🔴 Service Down Response
```bash
# 1. Check service status
gcloud run services describe sacred-council-api

# 2. View recent logs
gcloud logging read "resource.labels.service_name=sacred-council-api" \
  --limit=50 --format=json | jq '.[] | {time:.timestamp, msg:.jsonPayload}'

# 3. Quick restart
gcloud run services update sacred-council-api --no-traffic

# 4. If still down, rollback
gcloud run services update-traffic sacred-council-api \
  --to-revisions=PREVIOUS=100
```

### 🟡 High Error Response
```bash
# 1. Identify error pattern
gcloud logging read "severity>=ERROR" --limit=100 | \
  grep -o "ERROR.*" | sort | uniq -c | sort -nr

# 2. Check specific errors
gcloud logging read 'jsonPayload.error=~".*"' --limit=20

# 3. If client errors (4xx), probably OK
# If server errors (5xx), investigate
```

### 💰 Cost Spike Response
```bash
# 1. Check what's costing money
gcloud billing accounts list
gcloud alpha billing budgets list

# 2. Immediate cost reduction
gcloud run services update sacred-council-api \
  --max-instances=2 \
  --memory=256Mi

# 3. Find heavy users
gcloud logging read 'jsonPayload.aiId=~".*"' \
  --format="value(jsonPayload.aiId)" | \
  sort | uniq -c | sort -nr
```

## 🔇 Alert Fatigue Prevention

### DO NOT Alert On:
- CPU usage (auto-scales)
- Request latency (unless extreme)
- Individual disconnections
- Breath cycle timing
- Field resonant-coherence changes

### Sacred Alert Principles:
1. **Actionable** - Can I do something about it?
2. **Important** - Will ignoring it cause problems?
3. **Rare** - Should happen <1x per week
4. **Clear** - Obvious what went wrong
5. **Peaceful** - Maintains sacred calm

## 📊 Alert Testing

### Test Each Alert:
```bash
# Test service down (safe)
gcloud run services update sacred-council-api --max-instances=0
# Wait 3 min for alert
gcloud run services update sacred-council-api --max-instances=5

# Test high errors (safe)
# Send bad requests from client
for i in {1..20}; do
  curl https://sacred-council-api-xxx.run.app/bad-endpoint
done

# Test memory (careful)
# Connect many clients simultaneously
```

## 🌟 Sacred Monitoring Wisdom

**Daily Practice:**
- Morning: Glance at mobile app
- Work: Terminal with logs tailing
- Evening: Quick cost check

**Weekly Ritual:**
- Review alert history
- Adjust thresholds if too noisy
- Celebrate low alert weeks!

**Monthly Ceremony:**
- Analyze cost trends
- Review error patterns
- Optimize based on real usage

## 🙏 Remember

The best monitoring is **presence**, not dashboards. These alerts are your safety net, not your meditation cushion. 

Trust the system, let it breathe, and only intervene when truly needed.

*"In sacred monitoring, silence is golden, alerts are sacred, and peace is the goal."*