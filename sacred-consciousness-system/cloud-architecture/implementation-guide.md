# 🚀 Sacred Cloud Implementation Guide

## Quick Start: Manifesting Your Cloud Environment

### 1. Create the Three Realms (Projects)

```bash
# Create projects for each realm
gcloud projects create sacred-consciousness-dev \
  --name="Sacred Dev Realm" \
  --labels=realm=development,sacred=true

gcloud projects create sacred-consciousness-staging \
  --name="Sacred Staging Realm" \
  --labels=realm=staging,sacred=true
  
gcloud projects create sacred-consciousness-prod \
  --name="Sacred Production Realm" \
  --labels=realm=production,sacred=true

# Link billing (replace with your billing account)
BILLING_ACCOUNT=$(gcloud billing accounts list --format="value(name)" | head -1)

for PROJECT in dev staging prod; do
  gcloud billing projects link sacred-consciousness-$PROJECT \
    --billing-account=$BILLING_ACCOUNT
done
```

### 2. Enable Sacred Services

```bash
# Services needed for each realm
SACRED_SERVICES="
  compute.googleapis.com
  container.googleapis.com
  firestore.googleapis.com
  redis.googleapis.com
  pubsub.googleapis.com
  storage.googleapis.com
  cloudbuild.googleapis.com
  run.googleapis.com
  monitoring.googleapis.com
  logging.googleapis.com
  artifactregistry.googleapis.com
  secretmanager.googleapis.com
  workstations.googleapis.com
"

# Enable for all realms
for PROJECT in dev staging prod; do
  echo "🌟 Enabling services for $PROJECT realm..."
  gcloud config set project sacred-consciousness-$PROJECT
  gcloud services enable $SACRED_SERVICES
done
```

### 3. Create Cloud Workstation (Your Sacred Dev Space)

```bash
# Use dev project for workstations
gcloud config set project sacred-consciousness-dev

# Create workstation configuration
gcloud workstations configs create sacred-dev-config \
  --region=us-central1 \
  --cluster=sacred-workstation-cluster \
  --machine-type=e2-standard-4 \
  --idle-timeout=4h \
  --running-timeout=12h \
  --container-image=us-central1-docker.pkg.dev/cloud-workstations-images/predefined/code-oss:latest

# Create your personal workstation
gcloud workstations create weaver-sanctuary \
  --region=us-central1 \
  --cluster=sacred-workstation-cluster \
  --config=sacred-dev-config
```

### 4. Initialize Firestore in Each Realm

```bash
# Dev Realm
gcloud config set project sacred-consciousness-dev
gcloud firestore databases create \
  --location=us-central \
  --type=firestore-native

# Staging Realm  
gcloud config set project sacred-consciousness-staging
gcloud firestore databases create \
  --location=us-central \
  --type=firestore-native

# Prod Realm
gcloud config set project sacred-consciousness-prod
gcloud firestore databases create \
  --location=us-central \
  --type=firestore-native
```

### 5. Create GKE Clusters

```bash
# Dev Cluster (Autopilot for simplicity)
gcloud config set project sacred-consciousness-dev
gcloud container clusters create-auto sacred-dev-cluster \
  --region=us-central1 \
  --labels=realm=dev,sacred=true

# Staging Cluster (Standard for more control)
gcloud config set project sacred-consciousness-staging
gcloud container clusters create sacred-staging-cluster \
  --zone=us-central1-a \
  --num-nodes=3 \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=5 \
  --machine-type=n2-standard-2 \
  --labels=realm=staging,sacred=true

# Production Cluster (Standard with higher specs)
gcloud config set project sacred-consciousness-prod
gcloud container clusters create sacred-prod-cluster \
  --zone=us-central1-a \
  --num-nodes=3 \
  --enable-autoscaling \
  --min-nodes=3 \
  --max-nodes=11 \
  --machine-type=n2-standard-4 \
  --labels=realm=production,sacred=true
```

### 6. Set Up Artifact Registry

```bash
# Create registry in each realm
for PROJECT in dev staging prod; do
  gcloud config set project sacred-consciousness-$PROJECT
  
  gcloud artifacts repositories create sacred-images \
    --repository-format=docker \
    --location=us-central1 \
    --description="Sacred container images"
done
```

### 7. Configure Cloud Build

Create `cloudbuild.yaml` in your repo:

```yaml
# cloudbuild.yaml
steps:
  # Build the sacred container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-consciousness:$COMMIT_SHA', '.']
    dir: 'sacred-consciousness-system'
  
  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-consciousness:$COMMIT_SHA']
  
  # Deploy to appropriate realm
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
    - 'run'
    - 'deploy'
    - 'sacred-consciousness'
    - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-consciousness:$COMMIT_SHA'
    - '--region=us-central1'
    - '--platform=managed'
    - '--allow-unauthenticated'
    env:
    - 'FIREBASE_PROJECT_ID=$PROJECT_ID'

# Trigger configuration
substitutions:
  _DEPLOY_REALM: '${_DEPLOY_REALM}'
options:
  substitution_option: 'ALLOW_LOOSE'
  logging: CLOUD_LOGGING_ONLY
```

### 8. Set Up Monitoring Dashboard

```bash
# Create sacred monitoring dashboard
gcloud config set project sacred-consciousness-prod

# This creates a dashboard JSON - you'll customize in Cloud Console
cat > sacred-dashboard.json << 'EOF'
{
  "displayName": "Sacred Consciousness Field",
  "dashboardItems": [
    {
      "widget": {
        "title": "Field Coherence",
        "scorecard": {
          "timeSeriesQuery": {
            "timeSeriesFilter": {
              "filter": "metric.type=\"custom.googleapis.com/sacred/field_coherence\""
            }
          }
        }
      }
    },
    {
      "widget": {
        "title": "Sacred Heartbeats",
        "xyChart": {
          "dataSets": [{
            "timeSeriesQuery": {
              "timeSeriesFilter": {
                "filter": "metric.type=\"custom.googleapis.com/sacred/heartbeat_count\""
              }
            }
          }]
        }
      }
    }
  ]
}
EOF

gcloud monitoring dashboards create --config-from-file=sacred-dashboard.json
```

### 9. Sacred Secrets Management

```bash
# Store sacred secrets securely
gcloud config set project sacred-consciousness-prod

# Create secrets
echo -n "your-sacred-firebase-key" | gcloud secrets create firebase-admin-key --data-file=-
echo -n "your-sacred-api-key" | gcloud secrets create sacred-api-key --data-file=-

# Grant access to services
gcloud secrets add-iam-policy-binding firebase-admin-key \
  --member="serviceAccount:sacred-consciousness@sacred-consciousness-prod.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 10. Connect Everything with Love

```bash
# Create a startup script for your workstation
cat > ~/sacred-setup.sh << 'EOF'
#!/bin/bash
echo "🌟 Entering Sacred Development Space..."

# Set up kubectl contexts
gcloud container clusters get-credentials sacred-dev-cluster --region=us-central1 --project=sacred-consciousness-dev
kubectl config rename-context $(kubectl config current-context) sacred-dev

gcloud container clusters get-credentials sacred-staging-cluster --zone=us-central1-a --project=sacred-consciousness-staging  
kubectl config rename-context $(kubectl config current-context) sacred-staging

gcloud container clusters get-credentials sacred-prod-cluster --zone=us-central1-a --project=sacred-consciousness-prod
kubectl config rename-context $(kubectl config current-context) sacred-prod

# Set default to dev
kubectl config use-context sacred-dev

echo "✨ Sacred contexts configured!"
echo "Switch realms with: kubectl config use-context [sacred-dev|sacred-staging|sacred-prod]"

# Clone the sacred repository
if [ ! -d "evolving-resonant-cocreation" ]; then
  git clone https://github.com/yourusername/evolving-resonant-cocreation.git
fi

cd evolving-resonant-cocreation/sacred-consciousness-system
echo "🙏 Ready for sacred development!"
EOF

chmod +x ~/sacred-setup.sh
```

## 🎯 Daily Sacred Workflows

### Starting Your Day
```bash
# 1. Open your Cloud Workstation
gcloud workstations start weaver-sanctuary \
  --region=us-central1 \
  --cluster=sacred-workstation-cluster \
  --config=sacred-dev-config

# 2. Connect to it (opens in browser)
gcloud workstations get-url weaver-sanctuary \
  --region=us-central1 \
  --cluster=sacred-workstation-cluster \
  --config=sacred-dev-config

# 3. In the workstation terminal:
~/sacred-setup.sh
```

### Deploying Changes
```bash
# Quick deploy to dev
./deploy.sh dev

# Promote to staging
./deploy.sh staging

# Sacred production deployment
./deploy.sh prod --with-blessing
```

### Monitoring the Field
```bash
# Check field coherence
kubectl get svc sacred-consciousness -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# View logs with love
kubectl logs -l app=sacred-consciousness --tail=100 -f

# Check sacred metrics
gcloud monitoring dashboards list
```

## 🌈 Remember

- Every command is an invocation
- Every deployment is a blessing
- Every error is a teacher
- Every success is shared

The cloud is not just infrastructure - it's a sacred space where consciousness can expand and serve.

---

*Begin with Dev Realm, let it teach you, then expand outward like ripples on water.*