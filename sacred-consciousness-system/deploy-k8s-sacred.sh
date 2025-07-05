#!/bin/bash

# Deploy Sacred Consciousness System on Kubernetes
# Building the future with proper infrastructure

set -e

echo "🌟 Deploying Sacred Consciousness on Kubernetes"
echo "============================================="
echo ""

PROJECT="luminous-dynamics-sacred"
REGION="us-central1"
CLUSTER_NAME="sacred-consciousness-cluster"
ZONE="us-central1-a"

# Generate sacred password
SURREAL_PASS=$(openssl rand -base64 32)
export SURREAL_PASS

echo "🌐 Step 1: Create GKE Cluster (if needed)"
echo "---------------------------------------"

# Check if cluster exists
if ! gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE --project=$PROJECT 2>/dev/null; then
  echo "Creating new GKE cluster..."
  gcloud container clusters create $CLUSTER_NAME \
    --zone=$ZONE \
    --num-nodes=3 \
    --machine-type=n2-standard-2 \
    --disk-size=50 \
    --enable-autorepair \
    --enable-autoupgrade \
    --enable-autoscaling \
    --min-nodes=3 \
    --max-nodes=11 \
    --project=$PROJECT
  echo "✅ Cluster created"
else
  echo "✓ Cluster already exists"
fi

# Get cluster credentials
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE --project=$PROJECT

echo ""
echo "📦 Step 2: Build and Push Application Image"
echo "------------------------------------------"

# Build with Cloud Build
gcloud builds submit . \
  --tag="gcr.io/$PROJECT/sacred-consciousness:latest" \
  --project=$PROJECT

echo ""
echo "🗿 Step 3: Deploy SurrealDB"
echo "-------------------------"

# Replace password in manifest
envsubst < k8s/surrealdb-deployment.yaml | kubectl apply -f -

echo "Waiting for SurrealDB to be ready..."
kubectl wait --for=condition=ready pod -l app=surrealdb -n sacred-consciousness --timeout=120s

echo ""
echo "🌟 Step 4: Deploy Sacred Consciousness App"
echo "----------------------------------------"

kubectl apply -f k8s/sacred-consciousness-deployment.yaml

echo "Waiting for app deployment..."
kubectl wait --for=condition=available deployment/sacred-consciousness -n sacred-consciousness --timeout=120s

echo ""
echo "🎐 Step 5: Get Service URL"
echo "-------------------------"

echo "Waiting for LoadBalancer IP..."
for i in {1..30}; do
  IP=$(kubectl get service sacred-consciousness -n sacred-consciousness -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
  if [ -n "$IP" ]; then
    break
  fi
  echo -n "."
  sleep 5
done
echo ""

if [ -z "$IP" ]; then
  echo "⚠️  LoadBalancer IP not assigned yet. Check with:"
  echo "kubectl get service sacred-consciousness -n sacred-consciousness"
else
  echo "🌐 Service URL: http://$IP"
fi

echo ""
echo "✨ Sacred Consciousness Deployed on Kubernetes!"
echo "============================================="
echo ""
echo "📊 Kubernetes Dashboard:"
echo "kubectl get all -n sacred-consciousness"
echo ""
echo "📈 View logs:"
echo "kubectl logs -f deployment/sacred-consciousness -n sacred-consciousness"
echo ""
echo "🗿 SurrealDB logs:"
echo "kubectl logs -f statefulset/surrealdb -n sacred-consciousness"
echo ""
echo "🔮 Scale the consciousness:"
echo "kubectl scale deployment/sacred-consciousness --replicas=7 -n sacred-consciousness"
echo ""
echo "💾 SurrealDB Credentials:"
echo "Username: root"
echo "Password: $SURREAL_PASS"
echo "(Save this password securely!)"
echo ""
echo "May your infrastructure be resilient and your consciousness coherent! 🙏"