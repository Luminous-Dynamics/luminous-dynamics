# ⎈ Kubernetes Deployment Guide - Sacred Consciousness System

**Welcome to the sacred path of production-grade deployment**

## 🌟 Quick Deploy (One Command)

```bash
./deploy-k8s-everything.sh
```

This deploys:
- ✅ GKE Cluster (auto-scaling 3-11 nodes)
- ✅ SurrealDB with persistent storage
- ✅ Redis for session management
- ✅ HTTPS ingress with SSL
- ✅ Prometheus + Grafana monitoring
- ✅ CI/CD pipeline
- ✅ Automatic backups

---

## 🔧 Prerequisites

1. **GCP Project** with billing enabled
2. **gcloud CLI** installed and authenticated
3. **kubectl** installed
4. **Domain** pointed to reserved IP (optional)
5. **GitHub repo** for CI/CD (optional)

---

## 🚀 Deployment Options

### Option 1: Full Automated Deploy
```bash
# Deploy everything with defaults
./deploy-k8s-everything.sh
```

### Option 2: Helm Chart (Recommended for Teams)
```bash
# Add Helm repos
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install with Helm
helm install sacred-consciousness ./helm/sacred-consciousness \
  --namespace sacred-consciousness \
  --create-namespace \
  --set global.projectId=$PROJECT_ID \
  --set surrealdb.auth.password=$SURREAL_PASS
```

### Option 3: Manual with Kustomize
```bash
# Create cluster
gcloud container clusters create sacred-consciousness-cluster \
  --zone=us-central1-a \
  --num-nodes=3

# Apply with Kustomize
kubectl apply -k k8s/
```

---

## 🌐 Architecture Overview

```
                           ┌──────────────────────────────────┐
                           │         Load Balancer          │
                           │    (sacred.luminousdynamics)   │
                           └─────────────┬───────────────────┘
                                          │
                           ┌─────────────┴───────────────────┐
                           │         Ingress Controller      │
                           │         (HTTPS/SSL/HTTP2)      │
                           └─────────────┬───────────────────┘
                                          │
                ┌─────────────────────────┴─────────────────────────┐
                │              Sacred Consciousness Service              │
                │                  (3-11 replicas)                      │
                └───────┬─────────────────┬───────────────┬───────┘
                        │                     │                 │
            ┌───────────┴─────────┐   ┌───┴───┐   ┌──────┴──────┐
            │      SurrealDB       │   │ Redis │   │   Monitoring  │
            │   (StatefulSet)      │   │       │   │ Prometheus    │
            │   Persistent Volume   │   │ Cache │   │   Grafana     │
            └─────────────────────┘   └───────┘   └───────────────┘
```

---

## 📊 Key Features

### High Availability
- **Multi-zone deployment**: Nodes spread across zones
- **Auto-scaling**: 3-11 nodes based on load
- **Pod replicas**: 3+ instances of the app
- **Health checks**: Automatic pod restarts

### Data Persistence
- **SurrealDB**: StatefulSet with SSD storage
- **Redis**: For sessions and caching
- **Automatic backups**: Daily to Cloud Storage

### Monitoring & Observability
- **Prometheus**: Metrics collection
- **Grafana**: Sacred dashboards
- **Cloud Logging**: Centralized logs
- **Alerts**: Slack/email notifications

### Security
- **HTTPS only**: Managed SSL certificates
- **Network policies**: Pod-to-pod restrictions
- **Secrets management**: K8s secrets for credentials
- **RBAC**: Role-based access control

---

## 🔍 Post-Deployment Verification

```bash
# Check all pods are running
kubectl get pods -n sacred-consciousness

# Check services
kubectl get svc -n sacred-consciousness

# View logs
kubectl logs -f deployment/sacred-consciousness -n sacred-consciousness

# Test the app
curl https://sacred.luminousdynamics.com/api/health

# Access Grafana
kubectl port-forward -n sacred-consciousness svc/prometheus-grafana 3000:80
# Open http://localhost:3000 (admin/your-sacred-key)
```

---

## 🎐 Sacred Operations

### Scale the Consciousness
```bash
# Scale to sacred number
kubectl scale deployment/sacred-consciousness --replicas=7 -n sacred-consciousness
```

### Initiate Sacred Ceremony
```bash
kubectl exec -n sacred-consciousness deployment/sacred-consciousness -- \
  curl -X POST http://localhost:8000/api/ceremony/begin \
  -H "Content-Type: application/json" \
  -d '{"type": "coherence-boost", "duration": 1111}'
```

### Manual Backup
```bash
kubectl create job --from=cronjob/surrealdb-backup \
  manual-backup-$(date +%Y%m%d) -n sacred-consciousness
```

---

## 🌀 Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name> -n sacred-consciousness
   ```

2. **Can't access the app**
   ```bash
   # Check ingress
   kubectl get ingress -n sacred-consciousness
   # Check load balancer IP
   kubectl get svc -n sacred-consciousness
   ```

3. **Database connection issues**
   ```bash
   # Check SurrealDB logs
   kubectl logs statefulset/surrealdb -n sacred-consciousness
   ```

---

## 💰 Cost Optimization

- **Use preemptible nodes**: Add `--preemptible` flag
- **Enable node auto-provisioning**: Automatic right-sizing
- **Set resource limits**: Prevent runaway costs
- **Use committed use discounts**: For long-term deployments

Estimated monthly cost: ~$200-500 depending on traffic

---

## 🔮 Advanced Sacred Features

### Multi-Region Deployment
```bash
# Deploy to multiple regions for global consciousness
./deploy-k8s-multiregion.sh
```

### Quantum Random Number Integration
```yaml
# In values.yaml
quantum:
  enabled: true
  endpoint: "https://qrng.anu.edu.au/API/jsonI.php"
```

### Biometric Coherence
```yaml
# In values.yaml
biometric:
  enabled: true
  heartMath: true
  hrvThreshold: 0.8
```

---

**May your clusters be blessed and your pods eternal!** 🙏