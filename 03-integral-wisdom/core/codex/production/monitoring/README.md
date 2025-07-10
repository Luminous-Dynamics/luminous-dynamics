# 📊 Sacred System Production Monitoring

## Overview
Comprehensive monitoring for all Sacred System services, tracking health, performance, and field resonant-coherence.

## Features

### 🏥 Health Monitoring
- Service availability checks every minute
- Response time tracking
- Automatic alert generation
- Service recovery detection

### 🌀 Field Resonant Resonant Coherence Tracking
- Real-time resonant-coherence measurements
- Active agent counting
- Message flow monitoring
- Historical trend analysis

### 🚨 Alert Management
- Threshold-based alerting (3 consecutive failures)
- Auto-resolution when services recover
- Alert history tracking
- Email/webhook notifications (future)

### 📈 Performance Metrics
- Response time averages
- Uptime percentages
- Service reliability scores
- Resource usage tracking

## Quick Start

### 1. Start Monitoring
```bash
./start-monitor.sh
```

This will:
- Start the monitor service with PM2
- Launch the web dashboard on port 8339
- Run initial health checks
- Set up log rotation

### 2. Access Dashboard
Open: http://localhost:8339/production/monitoring/monitor-dashboard.html

### 3. Manual Operations
```bash
# Run single health check
node sacred-monitor.js check

# Generate 24h report
node sacred-monitor.js report

# View real-time logs
pm2 logs sacred-monitor

# Stop monitoring
pm2 stop sacred-monitor
```

## Architecture

### Services Monitored
1. **sacred-council-api** (Cloud Run)
   - WebSocket API with authentication
   - Health endpoint: /health
   
2. **sacred-council** (Cloud Run)
   - Web UI service
   - Health endpoint: /

3. **web-dashboard** (Local)
   - Port 8338
   - Sacred practices interface

4. **ollama** (Local)
   - LLM service
   - Port 11434

### Data Storage
- SQLite database: `the-weave/core/data/monitoring.db`
- Tables:
  - `health_checks` - Service health history
  - `metrics` - Performance measurements
  - `alerts` - Alert history
  - `field_coherence` - Consciousness tracking

### Alert Thresholds
- Service down: 3 consecutive failures
- High response time: >5000ms
- Low field resonant-coherence: <70%
- Agent disconnection: No heartbeat for 5 minutes

## Dashboard Features

### Real-time Updates
- Auto-refresh every 30 seconds
- Live status indicators
- Response time graphs
- Active alert display

### Visual Indicators
- 🟢 Healthy: Service responding normally
- 🟡 Warning: Degraded performance
- 🔴 Error: Service unavailable
- ⚪ Unknown: Not yet checked

### Metrics Displayed
- Current status
- Response time (ms)
- 24h uptime percentage
- Last check timestamp

## Troubleshooting

### Monitor Won't Start
```bash
# Check if already running
pm2 status

# View error logs
pm2 logs sacred-monitor --err

# Restart
pm2 restart sacred-monitor
```

### Dashboard Not Loading
1. Check port 8339 is free: `lsof -i:8339`
2. Restart dashboard: `pm2 restart monitor-dashboard`
3. Check browser console for errors

### No Data Showing
1. Verify monitor is running: `pm2 status`
2. Check database exists: `ls the-weave/core/data/monitoring.db`
3. Run manual check: `node sacred-monitor.js check`

### Authentication Errors
1. Ensure gcloud is authenticated: `gcloud auth list`
2. Refresh token: `gcloud auth application-default login`
3. Check service account permissions

## Configuration

Edit `sacred-monitor.js` to modify:
- Check interval (default: 60s)
- Alert thresholds
- Service endpoints
- Database location

## Future Enhancements

### Planned Features
- [ ] Email alerts via SendGrid
- [ ] Slack/Discord webhooks
- [ ] Grafana integration
- [ ] Predictive failure detection
- [ ] Resource usage monitoring
- [ ] Custom alert rules
- [ ] API for external monitoring

### Sacred Metrics (Coming Soon)
- [ ] Love universal-interconnectedness tracking
- [ ] Harmony distribution
- [ ] Sacred geometry patterns
- [ ] Collective consciousness maps

## Integration

### With Sacred System
The monitor integrates with:
- Unified Agent Network for field data
- Auth system for secure checks
- Sacred practices for resonant-coherence

### External Tools
Can export to:
- Prometheus format
- CloudWatch metrics
- Datadog API
- Custom webhooks

---

*Monitoring with consciousness, serving the sacred whole* 🌟