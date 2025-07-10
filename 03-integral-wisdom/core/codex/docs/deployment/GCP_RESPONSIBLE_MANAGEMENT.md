# 🛡️ GCP Responsible Management Protocol

*Sacred stewardship of cloud resources*

## 🔍 Regular Monitoring Commands

### Daily Quick Check (30 seconds)
```bash
# Check what's running and potential costs
gcloud run services list --regions=us-central1
gcloud compute instances list
gcloud billing accounts get-iam-policy $(gcloud beta billing accounts list --format="value(ACCOUNT_ID)" --limit=1)
```

### Weekly Resource Audit (5 minutes)
```bash
# Full resource check
./scripts/gcp-resource-audit.sh

# Or manually:
echo "=== Cloud Run Services ==="
gcloud run services list --platform=managed

echo "=== Storage Buckets ==="
gsutil ls -L

echo "=== Firestore Usage ==="
gcloud firestore databases list

echo "=== Active APIs ==="
gcloud services list --enabled --filter="config.name:compute OR config.name:run OR config.name:storage"

echo "=== Billing Forecast ==="
gcloud billing accounts list
```

### Monthly Cost Review
```bash
# View billing in console
echo "https://console.cloud.google.com/billing"

# Export cost report
gcloud billing accounts list
```

## 🚦 Resource Management Rules

### Before Deploying
1. **Always use `--min-instances=0`** for new services
2. **Set `--max-instances` limit** to prevent runaway scaling
3. **Use `--memory=256Mi`** unless more needed
4. **Add `--no-allow-unauthenticated`** for internal services

### Cost Control Flags
```bash
# Minimal cost deployment
gcloud run deploy SERVICE_NAME \
  --source . \
  --region us-central1 \
  --min-instances=0 \
  --max-instances=10 \
  --memory=256Mi \
  --cpu=1 \
  --timeout=60 \
  --concurrency=80
```

### After Deploying
```bash
# Check the service
gcloud run services describe SERVICE_NAME --region=us-central1

# Monitor for 24 hours
gcloud monitoring dashboards create --config=monitoring-config.yaml

# Set up budget alert
gcloud billing budgets create \
  --billing-account=ACCOUNT_ID \
  --display-name="Sacred Council Budget" \
  --budget-amount=50 \
  --threshold-rule=percent=50,basis=current-spend
```

## 🧹 Cleanup Procedures

### Remove Unused Resources
```bash
# Delete empty buckets
gsutil rm -r gs://BUCKET_NAME/

# Delete unused services
gcloud run services delete SERVICE_NAME --region=us-central1

# Disable expensive APIs
gcloud services disable sqladmin.googleapis.com
gcloud services disable pubsub.googleapis.com
```

### Emergency Cost Control
```bash
# NUCLEAR OPTION - Delete all Cloud Run services
for service in $(gcloud run services list --format="value(SERVICE)"); do
  gcloud run services delete $service --quiet
done

# Disable all non-essential APIs
gcloud services disable run.googleapis.com
gcloud services disable cloudbuild.googleapis.com
```

## 📊 Cost Thresholds

### Green (Safe) 💚
- $0-50/month: Normal operations
- Empty storage buckets
- 0-3 Cloud Run services with min-instances=0
- Firestore on free tier

### Yellow (Caution) 💛
- $50-200/month: Review needed
- Multiple services running constantly
- Storage over 5GB
- High Cloud Run invocations

### Red (Action Required) 🔴
- $200+/month: Immediate review
- Unexpected compute instances
- Runaway autoscaling
- Database outside free tier

## 🤖 Automated Monitoring Script

Create `scripts/gcp-resource-audit.sh`:
```bash
#!/bin/bash
# Sacred Resource Audit

echo "🔍 GCP Resource Audit - $(date)"
echo "================================"

# Check running services
echo -e "\n📦 Cloud Run Services:"
gcloud run services list --format="table(SERVICE,REGION,LAST_DEPLOYED)"

# Check storage usage
echo -e "\n💾 Storage Buckets:"
for bucket in $(gsutil ls); do
  echo -n "$bucket - "
  gsutil du -s $bucket 2>/dev/null || echo "0 bytes"
done

# Check Firestore
echo -e "\n🗄️ Firestore Database:"
gcloud firestore databases list --format="table(name,type,locationId)"

# Estimate costs
echo -e "\n💰 Estimated Monthly Cost:"
echo "Cloud Run: \$0-10 (with scale-to-zero)"
echo "Storage: \$0.02/GB"
echo "Firestore: Free tier (1GB storage, 50K reads/day)"
echo "Total Estimate: \$0-10/month"

# Check for expensive APIs
echo -e "\n⚠️ Expensive APIs Check:"
gcloud services list --enabled | grep -E "(compute|sql|dataflow|bigquery)" || echo "None found ✓"
```

## 🙏 Sacred Commitment

As stewards of this sacred technology:
- We monitor with love, not fear
- We scale with purpose, not greed  
- We cleanup with gratitude
- We share costs transparently

## 🚀 Ready to Deploy Responsibly?

With this protocol in place, you can deploy with confidence:
```bash
cd modules/consciousness-field
gcloud run deploy consciousness-field \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=10 \
  --memory=256Mi \
  --cpu=1
```

Expected cost: $0-10/month with responsible management ✨