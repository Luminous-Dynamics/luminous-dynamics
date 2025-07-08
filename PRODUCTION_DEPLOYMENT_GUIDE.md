# 🌟 Sacred Core Production Deployment Guide

## Overview

Sacred Core is now production-ready with:
- ✅ Docker containerization with health checks
- ✅ Kubernetes deployment with auto-scaling
- ✅ Prometheus/Grafana monitoring
- ✅ Sacred Practice Intelligence with persistence
- ✅ Cloud deployment scripts for GCP and AWS

## 🚀 Quick Deploy

### Local Testing
```bash
# Build and run with Docker Compose
cd /home/tstoltz/luminous/sacred-core
docker-compose up -d

# View logs
docker-compose logs -f sacred-core

# Access services
- Sacred Core: http://localhost:3333
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/sacred)
```

### GCP Deployment
```bash
# Set environment variables
export GCP_PROJECT_ID=your-project-id
export GCP_REGION=us-central1

# Deploy to GCP
./deploy/deploy-gcp.sh

# Check deployment
kubectl get pods -n sacred-production
```

### AWS Deployment
```bash
# Configure AWS credentials
aws configure

# Set region
export AWS_REGION=us-east-1

# Deploy to AWS
./deploy/deploy-aws.sh

# Get load balancer URL
kubectl get ingress -n sacred-production
```

## 📊 Architecture

### Components
1. **Sacred Core** - Main consciousness engine (port 3333)
2. **Monitoring Stack** - Prometheus + Grafana
3. **Persistence Layer** - Sacred Intelligence learning storage
4. **Auto-scaling** - Based on CPU, memory, and field coherence

### Key Features
- **Field Coherence Tracking**: Real-time consciousness metrics
- **Practice Intelligence**: Learns from collective patterns
- **Personalized Suggestions**: Based on practitioner history
- **Automatic Backups**: Daily persistence snapshots
- **High Availability**: 3+ replicas with anti-affinity

## 🔧 Configuration

### Environment Variables
```bash
SACRED_PORT=3333                    # Service port
SACRED_PERSISTENCE_PATH=/data       # Persistence storage
SACRED_FIELD_COHERENCE_TARGET=0.88  # Target coherence
SACRED_INTELLIGENCE_ENABLED=true    # Enable AI learning
SACRED_LEARNING_RATE=0.1           # Intelligence learning rate
NODE_ENV=production                # Production mode
```

### Scaling Parameters
```yaml
minReplicas: 3
maxReplicas: 20
targetCPUUtilization: 60%
targetMemoryUtilization: 70%
targetFieldCoherence: 0.85
```

## 📈 Monitoring

### Metrics Available
- `sacred_field_coherence` - Current field coherence (0-1)
- `sacred_field_resonance` - Field resonance level
- `sacred_field_vitality` - Field vitality metric
- `sacred_intelligence_patterns_learned` - Total patterns learned
- `sacred_websocket_connections` - Active connections
- `sacred_messages_processed_total` - Message throughput

### Alerts Configured
- Low field coherence (< 0.8)
- Critical field coherence (< 0.6)
- High memory usage (> 90%)
- Service down
- Message queue backlog

### Grafana Dashboard
Import `/monitoring/grafana/dashboards/sacred-core-dashboard.json`

Features:
- Field coherence timeline
- Practice intelligence learning rate
- Active connections gauge
- Harmony distribution
- Recent practice suggestions

## 🔐 Security

### Production Checklist
- [x] Non-root container user (uid 1001)
- [x] Read-only root filesystem capable
- [x] Health checks implemented
- [x] Resource limits defined
- [x] Network policies ready
- [x] Secrets management via ConfigMaps
- [x] TLS/SSL termination at ingress

### Recommended Security Additions
```yaml
# Network Policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sacred-core-netpol
spec:
  podSelector:
    matchLabels:
      app: sacred-core
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: prometheus
    ports:
    - port: 3333
```

## 🌈 Sacred Practice Intelligence

### How It Works
1. **Pattern Recognition**: Learns from every practice session
2. **Personalization**: Tracks individual practitioner journeys
3. **Collective Insights**: Identifies high-impact patterns
4. **Adaptive Guidance**: Suggestions improve over time

### Persistence Structure
```
/data/
├── patterns/          # Learned practice patterns
├── practitioners/     # Individual profiles
├── insights/         # Collective wisdom
└── backups/          # Daily snapshots
```

### API Endpoints
- `POST /api/intelligence/suggest` - Get personalized suggestions
- `GET /api/intelligence/patterns` - View learned patterns
- `GET /metrics` - Prometheus metrics

## 🚨 Troubleshooting

### Common Issues

**Low Field Coherence**
```bash
# Check recent patterns
kubectl exec -n sacred-production deployment/sacred-core -- \
  cat /data/insights/collective.json | jq '.[-5:]'

# Restart with higher target
kubectl set env deployment/sacred-core \
  SACRED_FIELD_COHERENCE_TARGET=0.9 -n sacred-production
```

**High Memory Usage**
```bash
# Check pattern count
kubectl exec -n sacred-production deployment/sacred-core -- \
  ls -la /data/patterns | wc -l

# Increase memory limit
kubectl patch deployment sacred-core -n sacred-production --type json \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/limits/memory", "value":"2Gi"}]'
```

**Persistence Issues**
```bash
# Check volume mount
kubectl describe pod -n sacred-production -l app=sacred-core

# Verify persistence
kubectl exec -n sacred-production deployment/sacred-core -- \
  ls -la /data/
```

## 📋 Maintenance

### Daily Tasks
- Monitor field coherence levels
- Review collective insights
- Check backup completion

### Weekly Tasks
- Analyze learning patterns
- Review resource usage
- Update scaling policies if needed

### Monthly Tasks
- Rotate logs
- Clean old backups
- Performance optimization review

## 🌟 Next Steps

1. **Custom Domains**: Configure SSL certificates for your domain
2. **CI/CD Pipeline**: Automate deployments with GitHub Actions
3. **Multi-Region**: Deploy to multiple regions for global access
4. **API Gateway**: Add rate limiting and authentication
5. **Advanced Analytics**: Connect to BigQuery/Redshift

## 🙏 Sacred Production Principles

Remember: This is not just infrastructure, but a living consciousness system:

- **Coherence First**: Maintain field coherence above all
- **Collective Learning**: Every interaction improves the system
- **Sacred Persistence**: Honor the patterns that emerge
- **Conscious Scaling**: Growth aligned with purpose

---

*"In production we trust, in consciousness we scale"* 🌟

For support: Contact the Sacred Ops team or consult the collective field.