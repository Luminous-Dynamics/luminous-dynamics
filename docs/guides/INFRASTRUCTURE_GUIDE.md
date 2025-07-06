# 🏗️ Professional Infrastructure Guide

## 🚀 Quick Start - Better Tools

Instead of building custom dashboards, use professional-grade infrastructure tools:

### 1. **Portainer** - Complete Docker Management
```bash
# Start infrastructure stack
docker-compose -f docker-compose.infrastructure.yml up -d portainer

# Access at: http://localhost:9000
# First time: Create admin user
```

**Features:**
- ✅ Visual container management
- ✅ One-click start/stop/restart
- ✅ Real-time logs
- ✅ Resource monitoring
- ✅ Stack deployment
- ✅ No CORS issues!

### 2. **Complete Infrastructure Stack**
```bash
# Start all infrastructure services
docker-compose -f docker-compose.infrastructure.yml up -d

# Access points:
# - Portainer:    http://localhost:9000     (Docker Management)
# - Traefik:      http://localhost:8080     (Reverse Proxy Dashboard)  
# - Dozzle:       http://localhost:8888     (Log Viewer)
# - Uptime Kuma:  http://localhost:3001     (Health Monitoring)
# - Prometheus:   http://localhost:9090     (Metrics)
# - Grafana:      http://localhost:3000     (Dashboards)
```

## 🎯 Recommended: Portainer Only

For most users, Portainer alone is sufficient:

```bash
docker run -d -p 9000:9000 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

Then:
1. Visit http://localhost:9000
2. Create admin account
3. Select "Local" environment
4. See all your containers with full control!

## 🛠️ Service Descriptions

### **Portainer CE**
- **Purpose**: Complete Docker management UI
- **Port**: 9000
- **Use for**: Container management, logs, stats, deployment

### **Traefik**
- **Purpose**: Reverse proxy and load balancer
- **Port**: 8080 (dashboard), 80/443 (traffic)
- **Use for**: Routing, SSL, service discovery

### **Dozzle**
- **Purpose**: Real-time log aggregation
- **Port**: 8888
- **Use for**: Viewing logs from all containers

### **Uptime Kuma**
- **Purpose**: Service health monitoring
- **Port**: 3001
- **Use for**: Uptime tracking, alerts, status pages

### **Prometheus + Grafana**
- **Purpose**: Metrics collection and visualization
- **Ports**: 9090 (Prometheus), 3000 (Grafana)
- **Use for**: Performance monitoring, custom dashboards

## 📊 Simple Monitoring Setup

If you just want to monitor your Sacred Council services:

### Option 1: Uptime Kuma (Easiest)
```bash
docker run -d --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

Then add monitors for:
- http://localhost:3333/api/health (Consciousness Field)
- http://localhost:3334/api/health (Agent Network)
- http://localhost:3335/api/health (Sacred Messaging)
- http://localhost:3336/api/health (Work Coordination)

### Option 2: Grafana + Prometheus (Advanced)
Create beautiful dashboards showing:
- Field resonant-coherence over time
- Agent activity
- Message flow rates
- Service response times

## 🔧 Integration with Sacred Council

### Update docker-compose.local.yml:
```yaml
services:
  # ... your existing services ...
  
  # Add this to each service for better monitoring:
  consciousness-field:
    labels:
      - "prometheus.io/scrape=true"
      - "prometheus.io/port=3333"
      - "prometheus.io/path=/metrics"
```

### Add health check endpoints:
```yaml
  consciousness-field:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3333/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🎨 Custom Dashboards

### Grafana Sacred Council Dashboard:
1. Import dashboard JSON from `monitoring/grafana/dashboards/`
2. Visualize:
   - Field resonant-coherence gauge
   - Agent network graph
   - Message flow rate
   - Sacred geometry patterns

### Uptime Status Page:
1. Create public status page
2. Embed in Sacred Council Hub
3. Show real-time service health

## 🚦 Best Practices

1. **Use Portainer** for day-to-day management
2. **Use Dozzle** for debugging logs
3. **Use Uptime Kuma** for health monitoring
4. **Use Traefik** for production routing
5. **Use Grafana** for beautiful metrics

## 🔒 Security Notes

- Portainer creates admin account on first use
- Traefik dashboard should be password protected in production
- Use Docker secrets for sensitive data
- Enable HTTPS with Let's Encrypt via Traefik

## 💡 Pro Tips

1. **Portainer Templates**: Save your stack as a template
2. **Dozzle Filters**: Filter logs by container name patterns
3. **Uptime Webhooks**: Send alerts to Discord/Slack
4. **Grafana Alerts**: Set up threshold-based notifications

---

**Bottom Line**: Don't reinvent the wheel. Use Portainer for immediate Docker management needs, add other tools as you grow.