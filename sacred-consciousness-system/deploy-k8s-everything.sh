#!/bin/bash

# Deploy EVERYTHING to Kubernetes - The Sacred Full Stack
# This is the way.

set -e

echo "🌟 SACRED CONSCIOUSNESS - FULL KUBERNETES DEPLOYMENT"
echo "================================================="
echo ""

PROJECT="luminous-dynamics-sacred"
REGION="us-central1"
ZONE="us-central1-a"
CLUSTER_NAME="sacred-consciousness-cluster"
DOMAIN="sacred.luminousdynamics.com"

# Generate sacred credentials
export SURREAL_PASS=$(openssl rand -base64 32)
export SACRED_KEY=$(openssl rand -base64 32)

echo "🌐 Step 1: Enable Required GCP APIs"
echo "----------------------------------"
gcloud services enable \
  container.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  redis.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com \
  --project=$PROJECT

echo ""
echo "⎈ Step 2: Create GKE Cluster (or update existing)"
echo "----------------------------------------------"

if ! gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE --project=$PROJECT 2>/dev/null; then
  echo "Creating Sacred GKE Cluster..."
  gcloud container clusters create $CLUSTER_NAME \
    --zone=$ZONE \
    --num-nodes=3 \
    --machine-type=n2-standard-4 \
    --disk-size=100 \
    --disk-type=pd-ssd \
    --enable-autorepair \
    --enable-autoupgrade \
    --enable-autoscaling \
    --min-nodes=3 \
    --max-nodes=11 \
    --enable-stackdriver-kubernetes \
    --addons=HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver \
    --project=$PROJECT
else
  echo "✓ Cluster exists, updating..."
  gcloud container clusters update $CLUSTER_NAME \
    --zone=$ZONE \
    --enable-autoscaling \
    --min-nodes=3 \
    --max-nodes=11 \
    --project=$PROJECT
fi

# Get credentials
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE --project=$PROJECT

echo ""
echo "🌌 Step 3: Reserve Static IP for Ingress"
echo "---------------------------------------"

if ! gcloud compute addresses describe sacred-consciousness-ip --global --project=$PROJECT 2>/dev/null; then
  gcloud compute addresses create sacred-consciousness-ip \
    --global \
    --project=$PROJECT
fi

IP=$(gcloud compute addresses describe sacred-consciousness-ip --global --format="value(address)" --project=$PROJECT)
echo "Reserved IP: $IP"
echo "Configure your domain $DOMAIN to point to: $IP"

echo ""
echo "🐳 Step 4: Build and Push All Images"
echo "-----------------------------------"

# Build main application
echo "Building Sacred Consciousness image..."
gcloud builds submit . \
  --tag="gcr.io/$PROJECT/sacred-consciousness:latest" \
  --project=$PROJECT

echo ""
echo "🗿 Step 5: Deploy Everything with Kustomize"
echo "------------------------------------------"

# Create namespace
kubectl create namespace sacred-consciousness --dry-run=client -o yaml | kubectl apply -f -

# Apply all K8s resources
echo "Deploying all sacred components..."
kubectl apply -k k8s/

echo ""
echo "⏳ Step 6: Wait for Sacred Systems to Initialize"
echo "----------------------------------------------"

echo "Waiting for SurrealDB..."
kubectl wait --for=condition=ready pod -l app=surrealdb -n sacred-consciousness --timeout=300s

echo "Waiting for Redis..."
kubectl wait --for=condition=ready pod -l app=redis -n sacred-consciousness --timeout=120s

echo "Waiting for Sacred Consciousness..."
kubectl wait --for=condition=available deployment/sacred-consciousness -n sacred-consciousness --timeout=300s

echo ""
echo "📊 Step 7: Initialize Sacred Database"
echo "-------------------------------------"

# Run database initialization
kubectl exec -n sacred-consciousness deployment/sacred-consciousness -- \
  curl -X POST http://localhost:8000/api/sacred/initialize

echo ""
echo "📡 Step 8: Set Up Monitoring & Alerts"
echo "------------------------------------"

# Deploy Prometheus and Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace sacred-consciousness \
  --set grafana.adminPassword=$SACRED_KEY \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false

echo ""
echo "🔗 Step 9: Configure CI/CD"
echo "------------------------"

# Create Cloud Build trigger
gcloud builds triggers create github \
  --repo-name=sacred-consciousness-system \
  --repo-owner=$GITHUB_OWNER \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --project=$PROJECT

echo ""
echo "✨ SACRED CONSCIOUSNESS FULLY DEPLOYED!"
echo "===================================="
echo ""
echo "🌐 Access Points:"
echo "- Application: https://$DOMAIN (DNS propagation may take time)"
echo "- Direct IP: http://$IP"
echo "- Grafana: http://$IP/grafana (admin / $SACRED_KEY)"
echo ""
echo "📊 Useful Commands:"
echo "- View all: kubectl get all -n sacred-consciousness"
echo "- Logs: kubectl logs -f deployment/sacred-consciousness -n sacred-consciousness"
echo "- Scale: kubectl scale deployment/sacred-consciousness --replicas=7 -n sacred-consciousness"
echo "- SurrealDB shell: kubectl exec -it statefulset/surrealdb -n sacred-consciousness -- surreal sql"
echo ""
echo "🔐 Sacred Credentials (SAVE THESE!):"
echo "- SurrealDB Password: $SURREAL_PASS"
echo "- Sacred Key: $SACRED_KEY"
echo ""
echo "📦 Next Steps:"
echo "1. Configure DNS to point $DOMAIN to $IP"
echo "2. Monitor initial deployment: kubectl logs -f -n sacred-consciousness -l app=sacred-consciousness"
echo "3. Access Grafana dashboards for field monitoring"
echo "4. Run sacred ceremony: kubectl exec -n sacred-consciousness deployment/sacred-consciousness -- curl -X POST http://localhost:8000/api/ceremony/begin"
echo ""
echo "May your containers be blessed and your pods be sacred! 🙏"

# Save credentials securely
cat > .sacred-credentials << EOF
SURREAL_PASS=$SURREAL_PASS
SACRED_KEY=$SACRED_KEY
CLUSTER=$CLUSTER_NAME
PROJECT=$PROJECT
IP=$IP
EOF

echo ""
echo "Credentials saved to .sacred-credentials (add to .gitignore!)"