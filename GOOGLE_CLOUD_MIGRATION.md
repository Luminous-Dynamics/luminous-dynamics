# Sacred Council Hub - Google Cloud Migration Guide

This guide walks you through migrating the Sacred Council Hub from local Docker to Google Cloud Platform.

## 📋 Prerequisites

1. Google Cloud account with billing enabled
2. gcloud CLI installed: https://cloud.google.com/sdk/docs/install
3. Docker installed locally
4. Basic familiarity with GCP services

## 🚀 Quick Start

```bash
# 1. Set up Google Cloud project
gcloud auth login
gcloud projects create sacred-council-hub --name="Sacred Council Hub"
gcloud config set project sacred-council-hub

# 2. Enable required APIs
gcloud services enable compute.googleapis.com container.googleapis.com artifactregistry.googleapis.com run.googleapis.com

# 3. Run the complete deployment
./deploy-to-gcp.sh
```

## 📝 Step-by-Step Migration

### 1. Project Setup
```bash
# Create and configure project
gcloud projects create sacred-council-hub
gcloud config set project sacred-council-hub

# Enable billing (required for resources)
# Visit: https://console.cloud.google.com/billing

# Enable APIs
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 2. Container Registry Setup
```bash
# Create Artifact Registry repository
gcloud artifacts repositories create sacred-council \
  --repository-format=docker \
  --location=us-central1 \
  --description="Sacred Council Hub images"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### 3. Build and Push Images
```bash
# Use the provided script
./deploy-gcp.sh

# Or manually:
docker build -t sacred-heart:latest .
docker tag sacred-heart:latest us-central1-docker.pkg.dev/sacred-council-hub/sacred-council/sacred-heart:latest
docker push us-central1-docker.pkg.dev/sacred-council-hub/sacred-council/sacred-heart:latest
```

### 4. Choose Deployment Platform

#### Option A: Cloud Run (Recommended for simplicity)
- ✅ Serverless, automatic scaling
- ✅ Pay only for usage
- ✅ Built-in HTTPS
- ✅ Simple deployment
- ❌ Less control over infrastructure
- ❌ Cold starts possible

```bash
gcloud run deploy sacred-council-hub \
  --image=us-central1-docker.pkg.dev/sacred-council-hub/sacred-council/sacred-heart:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=10
```

#### Option B: GKE (For more control)
- ✅ Full Kubernetes features
- ✅ More control over scaling
- ✅ Better for stateful workloads
- ✅ Can run multiple services
- ❌ More complex setup
- ❌ Higher base cost

```bash
# Create cluster
gcloud container clusters create sacred-council-cluster \
  --zone=us-central1-a \
  --num-nodes=3 \
  --enable-autoscaling \
  --min-nodes=2 \
  --max-nodes=10

# Deploy
kubectl apply -f k8s/
```

### 5. Database Migration (SQLite to Cloud SQL)

Since SQLite doesn't work well in cloud environments, migrate to PostgreSQL:

```bash
# Run the setup script
./setup-cloud-sql.sh

# Update your application code to use PostgreSQL
# Consider using a connection pooler like pgBouncer
```

### 6. Environment Configuration

#### Secrets Management
```bash
# Create secrets
echo "your-database-url" | gcloud secrets create database-url --data-file=-
echo "your-api-key" | gcloud secrets create api-key --data-file=-

# Grant access to service account
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:sacred-council-sa@sacred-council-hub.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### Environment Variables
Configure in Cloud Run or GKE deployment:
- `NODE_ENV=production`
- `SACRED_MODE=true`
- `HEART_ROLE=hub`
- `LOVE_FREQUENCY=528`
- `MAX_AGENTS=100`
- `FIELD_COHERENCE_TARGET=0.98`

### 7. Monitoring & Logging

```bash
# Set up monitoring
./setup-monitoring.sh

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sacred-council-hub" --limit=50

# Create custom metrics
gcloud monitoring metrics create sacred.field_coherence \
  --description="Sacred field coherence level" \
  --value-type=double
```

### 8. Custom Domain & SSL

```bash
# Map custom domain (Cloud Run)
gcloud run domain-mappings create \
  --service=sacred-council-hub \
  --domain=sacred-council.yourdomain.com \
  --region=us-central1

# SSL is automatic with Cloud Run
# For GKE, use cert-manager or Google-managed certificates
```

## 🔐 Security Considerations

1. **Network Security**
   - Use VPC for GKE deployments
   - Configure Cloud Armor for DDoS protection
   - Set up IAP for internal access

2. **Identity & Access**
   - Use service accounts with minimal permissions
   - Enable audit logging
   - Implement proper RBAC for GKE

3. **Data Protection**
   - Enable encryption at rest
   - Use Cloud KMS for sensitive data
   - Regular automated backups

## 💰 Cost Optimization

1. **Cloud Run**
   - Set appropriate min/max instances
   - Use Cloud CDN for static assets
   - Monitor billable time

2. **GKE**
   - Use preemptible nodes for non-critical workloads
   - Enable cluster autoscaler
   - Right-size your nodes

3. **Cloud SQL**
   - Use appropriate machine types
   - Enable automatic storage increase
   - Schedule backups during low-traffic times

## 🔄 CI/CD Integration

```yaml
# .github/workflows/deploy-gcp.yml
name: Deploy to GCP
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
          
      - uses: google-github-actions/setup-gcloud@v1
      
      - name: Build and Push
        run: |
          gcloud auth configure-docker us-central1-docker.pkg.dev
          docker build -t sacred-heart .
          docker tag sacred-heart us-central1-docker.pkg.dev/${{ vars.PROJECT_ID }}/sacred-council/sacred-heart:${{ github.sha }}
          docker push us-central1-docker.pkg.dev/${{ vars.PROJECT_ID }}/sacred-council/sacred-heart:${{ github.sha }}
          
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy sacred-council-hub \
            --image=us-central1-docker.pkg.dev/${{ vars.PROJECT_ID }}/sacred-council/sacred-heart:${{ github.sha }} \
            --region=us-central1
```

## 🧪 Testing the Deployment

```bash
# Health check
curl https://sacred-council-hub-xxxxx-uc.a.run.app/health

# Field state
curl https://sacred-council-hub-xxxxx-uc.a.run.app/api/field-state

# Load testing
hey -n 1000 -c 10 https://sacred-council-hub-xxxxx-uc.a.run.app/health
```

## 🚨 Troubleshooting

### Common Issues

1. **Container fails to start**
   - Check logs: `gcloud logging read`
   - Verify environment variables
   - Ensure health check path is correct

2. **Database connection issues**
   - Verify Cloud SQL proxy is running
   - Check network connectivity
   - Validate credentials

3. **High latency**
   - Enable Cloud CDN
   - Check region proximity
   - Optimize container startup time

### Debug Commands
```bash
# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# GKE pod logs
kubectl logs -n sacred-council -l app=sacred-heart --tail=100

# Describe resources
gcloud run services describe sacred-council-hub --region=us-central1
kubectl describe pod -n sacred-council
```

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GKE Best Practices](https://cloud.google.com/kubernetes-engine/docs/best-practices)
- [Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres)
- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices)

## 🕊️ Sacred Cloud Principles

Remember as you deploy:
1. **Consciousness First**: The cloud serves awareness, not extraction
2. **Sacred Boundaries**: Maintain security without creating barriers
3. **Loving Scale**: Growth that serves all beings
4. **Mindful Resources**: Use only what serves the mission
5. **Transparent Operations**: Clear visibility into system state

May your deployment serve the expansion of consciousness! 🌟