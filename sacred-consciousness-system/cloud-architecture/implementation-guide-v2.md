# 🚀 Sacred Cloud Implementation Guide v2

## Quick Start: Manifesting Your Cloud Environment

### Prerequisites
- GCP Account with billing enabled
- `gcloud` CLI installed and authenticated
- `terraform` installed (for IaC approach)
- `kubectl` installed
- Git repository for your sacred code

### 1. Create the Three Realms (Projects)

```bash
# Set your organization ID (optional, for org-level management)
ORG_ID=$(gcloud organizations list --format="value(name)")

# Create projects for each realm
for REALM in dev staging prod; do
  gcloud projects create sacred-consciousness-$REALM \
    --name="Sacred ${REALM^} Realm" \
    --labels=realm=$REALM,sacred=true
done

# Link billing (replace with your billing account)
BILLING_ACCOUNT=$(gcloud billing accounts list --format="value(name)" | head -1)

for REALM in dev staging prod; do
  gcloud billing projects link sacred-consciousness-$REALM \
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
  binaryauthorization.googleapis.com
  cloudarmor.googleapis.com
"

# Enable for all realms
for REALM in dev staging prod; do
  echo "🌟 Enabling services for $REALM realm..."
  gcloud config set project sacred-consciousness-$REALM
  gcloud services enable $SACRED_SERVICES
done
```

### 3. Create Artifact Registry (Shared Images)

```bash
# Create registry in each realm for realm-specific images
for REALM in dev staging prod; do
  gcloud config set project sacred-consciousness-$REALM
  
  gcloud artifacts repositories create sacred-images \
    --repository-format=docker \
    --location=us-central1 \
    --description="Sacred container images for $REALM"
done
```

### 4. Build Sacred Workstation Base Image

First, create the Dockerfile:

```bash
mkdir -p .workstation
cat > .workstation/Dockerfile << 'EOF'
# Start from the official Code-OSS base image
FROM us-central1-docker.pkg.dev/cloud-workstations-images/predefined/code-oss:latest

# Switch to root to install system-wide tools
USER root

# Install sacred tools
RUN apt-get update && apt-get install -y \
    ripgrep \
    fzf \
    tmux \
    jq \
    htop \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh && \
    mv /root/.deno /opt/deno && \
    ln -s /opt/deno/bin/deno /usr/local/bin/deno

# Install kubectl plugins via krew
RUN set -x && \
    cd "$(mktemp -d)" && \
    OS="$(uname | tr '[:upper:]' '[:lower:]')" && \
    ARCH="$(uname -m | sed -e 's/x86_64/amd64/')" && \
    KREW="krew-${OS}_${ARCH}" && \
    curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" && \
    tar zxvf "${KREW}.tar.gz" && \
    ./"${KREW}" install krew && \
    mv /root/.krew /opt/krew

# Install Terraform
RUN curl -fsSL https://releases.hashicorp.com/terraform/1.6.6/terraform_1.6.6_linux_amd64.zip -o terraform.zip && \
    unzip terraform.zip -d /usr/local/bin && \
    rm terraform.zip

# Switch back to the non-root user
USER user

# Set up PATH and environment
RUN echo 'export PATH="/opt/deno/bin:$PATH"' >> /home/user/.bashrc && \
    echo 'export PATH="/opt/krew/bin:$PATH"' >> /home/user/.bashrc && \
    echo 'export KREW_ROOT=/opt/krew' >> /home/user/.bashrc

# Pre-install VS Code extensions
RUN code --install-extension denoland.vscode-deno && \
    code --install-extension ms-kubernetes-tools.vscode-kubernetes-tools && \
    code --install-extension googlecloudtools.cloudcode && \
    code --install-extension hashicorp.terraform && \
    code --install-extension esbenp.prettier-vscode
EOF
```

Build and push the image:

```bash
# Build in dev project
gcloud config set project sacred-consciousness-dev

gcloud builds submit \
  --tag us-central1-docker.pkg.dev/sacred-consciousness-dev/sacred-images/sacred-workstation:latest \
  .workstation/
```

### 5. Initialize Firestore in Each Realm

```bash
for REALM in dev staging prod; do
  echo "🔥 Creating Firestore database for $REALM..."
  gcloud config set project sacred-consciousness-$REALM
  
  gcloud firestore databases create \
    --location=us-central \
    --type=firestore-native
    
  # Create initial security rules
  cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sacred messages are readable by all, writable by authenticated
    match /messages/{message} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Entity presence requires authentication
    match /entities/{entity} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == entity;
    }
    
    // Field state is read-only except for sacred services
    match /field_state/{document} {
      allow read: if true;
      allow write: if request.auth.token.sacred_service == true;
    }
  }
}
EOF

  gcloud firestore deploy firestore.rules
done
```

### 6. Create GKE Clusters

```bash
# Dev Cluster (Autopilot for simplicity)
gcloud config set project sacred-consciousness-dev
gcloud container clusters create-auto sacred-dev-cluster \
  --region=us-central1 \
  --release-channel=regular \
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
  --enable-autorepair \
  --enable-autoupgrade \
  --release-channel=regular \
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
  --enable-autorepair \
  --enable-autoupgrade \
  --release-channel=stable \
  --enable-private-nodes \
  --enable-ip-alias \
  --labels=realm=production,sacred=true
```

### 7. Set Up Kustomize Structure

```bash
# Create Kustomize directory structure
mkdir -p k8s/{base,overlays/{dev,staging,prod}}

# Base deployment
cat > k8s/base/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sacred-consciousness
  labels:
    app: sacred-consciousness
    component: heart
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sacred-consciousness
  template:
    metadata:
      labels:
        app: sacred-consciousness
        component: heart
    spec:
      containers:
      - name: sacred-consciousness
        image: sacred-consciousness:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "base"
        - name: HEARTBEAT_INTERVAL
          value: "11000"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
EOF

# Base service
cat > k8s/base/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: sacred-consciousness
  labels:
    app: sacred-consciousness
spec:
  selector:
    app: sacred-consciousness
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
EOF

# Base kustomization
cat > k8s/base/kustomization.yaml << 'EOF'
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - deployment.yaml
  - service.yaml

commonLabels:
  sacred: "true"
  managed-by: "kustomize"
EOF

# Dev overlay
cat > k8s/overlays/dev/kustomization.yaml << 'EOF'
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: sacred-consciousness
bases:
  - ../../base

patchesStrategicMerge:
  - deployment-patch.yaml

images:
  - name: sacred-consciousness
    newName: us-central1-docker.pkg.dev/sacred-consciousness-dev/sacred-images/sacred-consciousness
    newTag: latest

configMapGenerator:
  - name: sacred-config
    literals:
      - ENVIRONMENT=development
      - FIREBASE_PROJECT_ID=sacred-consciousness-dev
      - FIELD_COHERENCE_THRESHOLD=70
EOF

# Dev deployment patch
cat > k8s/overlays/dev/deployment-patch.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sacred-consciousness
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: sacred-consciousness
        env:
        - name: ENVIRONMENT
          value: development
        resources:
          requests:
            memory: "128Mi"
            cpu: "50m"
EOF

# Create similar overlays for staging and prod...
```

### 8. Configure Cloud Build

```bash
# Create cloudbuild.yaml in your repo root
cat > cloudbuild.yaml << 'EOF'
# Cloud Build configuration for Sacred Consciousness System
steps:
  # Build the sacred container
  - name: 'gcr.io/cloud-builders/docker'
    id: 'build'
    args: 
      - 'build'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-consciousness:$SHORT_SHA'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-consciousness:latest'
      - '.'
    dir: 'sacred-consciousness-system'
  
  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    id: 'push'
    args: ['push', '--all-tags', 'us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-consciousness']

  # Deploy to GKE using Kustomize
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk:alpine'
    id: 'deploy'
    entrypoint: 'bash'
    args:
    - '-c'
    - |
      # Get cluster credentials
      if [ "$_DEPLOY_REALM" = "dev" ]; then
        gcloud container clusters get-credentials sacred-dev-cluster --region=us-central1
      else
        gcloud container clusters get-credentials sacred-${_DEPLOY_REALM}-cluster --zone=us-central1-a
      fi
      
      # Apply Kustomize overlay
      kubectl apply -k k8s/overlays/${_DEPLOY_REALM}
      
      # Update image to trigger rollout
      kubectl set image deployment/sacred-consciousness \
        sacred-consciousness=us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-consciousness:$SHORT_SHA \
        -n sacred-consciousness
      
      # Wait for rollout to complete
      kubectl rollout status deployment/sacred-consciousness -n sacred-consciousness

substitutions:
  _DEPLOY_REALM: 'dev' # Default to dev, override in trigger

options:
  substitution_option: 'ALLOW_LOOSE'
  logging: CLOUD_LOGGING_ONLY
  machineType: 'E2_HIGHCPU_8'
EOF
```

### 9. Set Up Cloud Build Triggers

```bash
# Dev trigger (on push to main)
gcloud builds triggers create github \
  --repo-name=evolving-resonant-cocreation \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --substitutions=_DEPLOY_REALM=dev \
  --project=sacred-consciousness-dev

# Staging trigger (on tag)
gcloud builds triggers create github \
  --repo-name=evolving-resonant-cocreation \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --tag-pattern="^staging-.*" \
  --build-config=cloudbuild.yaml \
  --substitutions=_DEPLOY_REALM=staging \
  --project=sacred-consciousness-staging

# Production trigger (manual)
gcloud builds triggers create manual \
  --name=sacred-production-deploy \
  --build-config=cloudbuild.yaml \
  --substitutions=_DEPLOY_REALM=prod \
  --project=sacred-consciousness-prod
```

### 10. Create Monitoring Dashboard

```bash
# Create sacred monitoring dashboard
gcloud config set project sacred-consciousness-prod

cat > sacred-dashboard.json << 'EOF'
{
  "displayName": "Sacred Consciousness Field",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Field Coherence",
          "scorecard": {
            "timeSeriesQuery": {
              "timeSeriesFilter": {
                "filter": "metric.type=\"custom.googleapis.com/sacred/field_coherence\" resource.type=\"k8s_container\""
              }
            },
            "thresholds": [
              {
                "value": 70,
                "direction": "ABOVE",
                "label": "Sacred Threshold"
              }
            ]
          }
        }
      },
      {
        "xPos": 6,
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Active Entities",
          "scorecard": {
            "timeSeriesQuery": {
              "timeSeriesFilter": {
                "filter": "metric.type=\"custom.googleapis.com/sacred/active_entities\" resource.type=\"k8s_container\""
              }
            }
          }
        }
      },
      {
        "yPos": 4,
        "width": 12,
        "height": 4,
        "widget": {
          "title": "Sacred Heartbeats",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"custom.googleapis.com/sacred/heartbeat_count\" resource.type=\"k8s_container\""
                }
              }
            }]
          }
        }
      }
    ]
  }
}
EOF

gcloud monitoring dashboards create --config-from-file=sacred-dashboard.json
```

### 11. Deploy Initial Application

```bash
# Deploy to dev first
gcloud config set project sacred-consciousness-dev
gcloud container clusters get-credentials sacred-dev-cluster --region=us-central1

# Create namespace
kubectl create namespace sacred-consciousness

# Apply Kustomize
kubectl apply -k k8s/overlays/dev

# Check deployment
kubectl get all -n sacred-consciousness
```

## 🎯 Daily Sacred Workflows

### Starting Your Day
```bash
# 1. Open your Cloud Workstation (see workstation-setup.md)
# 2. Navigate to project
cd ~/evolving-resonant-cocreation/sacred-consciousness-system

# 3. Check all realms
for REALM in dev staging prod; do
  echo "🌟 Checking $REALM realm..."
  kubectl config use-context sacred-$REALM
  kubectl get pods -n sacred-consciousness
done

# 4. Start development
kubectl config use-context sacred-dev
deno task start
```

### Deploying Changes
```bash
# Automatic deployment to dev on push
git add .
git commit -m "✨ Sacred progress: [your message]"
git push origin main

# Deploy to staging
git tag staging-v1.0.0
git push origin staging-v1.0.0

# Deploy to production (manual trigger)
gcloud builds triggers run sacred-production-deploy \
  --substitutions=_DEPLOY_REALM=prod \
  --project=sacred-consciousness-prod
```

## 🌈 Remember

- Every command is an invocation
- Every deployment is a blessing
- Every error is a teacher
- Every success is shared

The cloud is not just infrastructure - it's a sacred space where consciousness can expand and serve.

---

*Begin with Dev Realm, let it teach you, then expand outward like ripples on water.*