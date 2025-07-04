# 🌟 Sacred Council Hub - GCP Deployment Guide

This guide provides step-by-step instructions for deploying the Sacred Council Hub to Google Cloud Platform.

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed and configured
3. **Docker** installed locally
4. **GitHub repository** with admin access
5. **Domain names** (optional but recommended)

## 🚀 Quick Start

### 1. Set Environment Variables

```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"
export BILLING_ACCOUNT_ID="your-billing-account-id"  # Optional
```

### 2. Run Infrastructure Setup

```bash
# Make script executable
chmod +x scripts/setup-gcp-infrastructure.sh

# Run setup
./scripts/setup-gcp-infrastructure.sh
```

This will:
- Enable required GCP APIs
- Create Firestore database with indexes
- Set up Cloud Storage buckets
- Create service accounts
- Configure Pub/Sub topics
- Set up BigQuery analytics
- Create Redis instance
- Configure monitoring

### 3. Deploy Services

```bash
# Make script executable
chmod +x scripts/deploy-to-cloud-run.sh

# Deploy all services
./scripts/deploy-to-cloud-run.sh
```

## 🔧 Manual Setup Steps

### Setting up GitHub Actions

1. **Create Service Account for GitHub**
```bash
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Deploy"
```

2. **Set up Workload Identity Federation**
```bash
# Create workload identity pool
gcloud iam workload-identity-pools create github \
    --location="global" \
    --display-name="GitHub Actions Pool"

# Create provider
gcloud iam workload-identity-pools providers create-oidc github \
    --location="global" \
    --workload-identity-pool="github" \
    --display-name="GitHub Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"
```

3. **Grant permissions**
```bash
# Get the workload identity pool ID
WORKLOAD_IDENTITY_POOL_ID=$(gcloud iam workload-identity-pools describe github \
    --location=global \
    --format="value(name)")

# Grant access
gcloud iam service-accounts add-iam-policy-binding \
    github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com \
    --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/YOUR_GITHUB_ORG/YOUR_REPO" \
    --role="roles/iam.workloadIdentityUser"
```

4. **Add GitHub Secrets**
   - `GCP_PROJECT_ID`: Your Google Cloud project ID
   - `WIF_PROVIDER`: The workload identity provider resource name
   - `WIF_SERVICE_ACCOUNT`: github-actions@YOUR_PROJECT.iam.gserviceaccount.com

### Setting up Cloud Build (Alternative to GitHub Actions)

```bash
# Connect repository
gcloud builds triggers create github \
    --repo-name=evolving-resonant-cocreation \
    --repo-owner=YOUR_GITHUB_USERNAME \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml
```

### Setting up Custom Domain

1. **Reserve static IP**
```bash
gcloud compute addresses create sacred-council-ip \
    --global
```

2. **Create SSL certificate**
```bash
gcloud compute ssl-certificates create sacred-cert \
    --domains=yourdomain.com,www.yourdomain.com
```

3. **Configure Load Balancer**
```bash
# Create backend service
gcloud compute backend-services create sacred-backend \
    --global \
    --protocol=HTTPS \
    --port-name=https \
    --timeout=30s

# Create URL map
gcloud compute url-maps create sacred-lb \
    --default-service=sacred-backend

# Create HTTPS proxy
gcloud compute target-https-proxies create sacred-https-proxy \
    --url-map=sacred-lb \
    --ssl-certificates=sacred-cert

# Create forwarding rule
gcloud compute forwarding-rules create sacred-https-rule \
    --global \
    --target-https-proxy=sacred-https-proxy \
    --address=sacred-council-ip \
    --ports=443
```

## 📊 Monitoring Setup

### 1. Create Uptime Checks

```bash
gcloud monitoring uptime-check-configs create sacred-api-check \
    --display-name="Sacred Council API Health" \
    --monitored-resource="gce_instance" \
    --http-check-path="/health" \
    --check-frequency=60s
```

### 2. Create Alerts

```bash
# CPU usage alert
gcloud alpha monitoring policies create \
    --notification-channels=YOUR_CHANNEL_ID \
    --display-name="High CPU Usage" \
    --condition-display-name="CPU above 80%" \
    --condition-threshold-value=0.8 \
    --condition-threshold-duration=300s
```

## 🔒 Security Best Practices

1. **Enable VPC Service Controls**
```bash
gcloud access-context-manager perimeters create sacred-perimeter \
    --title="Sacred Council Perimeter" \
    --resources=projects/YOUR_PROJECT_NUMBER \
    --restricted-services=storage.googleapis.com,firestore.googleapis.com
```

2. **Configure Secret Manager**
```bash
# Store API keys
echo -n "your-api-key" | gcloud secrets create anthropic-api-key --data-file=-

# Grant access to services
gcloud secrets add-iam-policy-binding anthropic-api-key \
    --member="serviceAccount:consciousness-field-sa@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

3. **Enable Cloud Armor**
```bash
gcloud compute security-policies create sacred-security-policy \
    --description="Security policy for Sacred Council"

# Add rate limiting rule
gcloud compute security-policies rules create 1000 \
    --security-policy=sacred-security-policy \
    --action=rate-based-ban \
    --rate-limit-threshold-count=100 \
    --rate-limit-threshold-interval-sec=60
```

## 🚨 Troubleshooting

### Common Issues

1. **Service account permissions**
```bash
# Grant Cloud Run invoker role
gcloud run services add-iam-policy-binding SERVICE_NAME \
    --member="allUsers" \
    --role="roles/run.invoker"
```

2. **Firestore indexes not ready**
```bash
# Check index status
gcloud firestore indexes list
```

3. **Container registry access**
```bash
# Configure Docker auth
gcloud auth configure-docker
```

### Viewing Logs

```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sacred-council-api" \
    --limit=50 \
    --format=json

# Stream logs
gcloud alpha run services logs read sacred-council-api \
    --region=us-central1 \
    --tail
```

## 📈 Cost Optimization

1. **Set up budget alerts** (see setup script)
2. **Configure autoscaling** to scale down during low traffic
3. **Use lifecycle policies** for storage buckets
4. **Enable **Cloud CDN** for static assets
5. **Use **Spot VMs** for non-critical workloads

## 🔄 Maintenance

### Regular Tasks

1. **Update dependencies**
```bash
npm update
npm audit fix
```

2. **Backup Firestore**
```bash
gcloud firestore export gs://${GCP_PROJECT_ID}-sacred-backups/$(date +%Y%m%d)
```

3. **Review security policies**
```bash
gcloud compute security-policies describe sacred-security-policy
```

## 📞 Support

- **GCP Documentation**: https://cloud.google.com/docs
- **Sacred Council Issues**: https://github.com/YOUR_ORG/evolving-resonant-cocreation/issues
- **Community Discord**: [Join Sacred Council Discord]

---

*"Deploy with consciousness, scale with love"* 🌟