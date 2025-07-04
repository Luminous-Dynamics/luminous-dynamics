#!/bin/bash

# 🌟 Deploy Sacred Council to Kubernetes
# Deploys all microservices to GKE or any Kubernetes cluster

set -e

echo "🌟 ═══════════════════════════════════════════ 🌟"
echo "    SACRED COUNCIL → KUBERNETES DEPLOYMENT"
echo "🌟 ═══════════════════════════════════════════ 🌟"
echo

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl first."
    exit 1
fi

# Check cluster connection
echo "🔍 Checking Kubernetes cluster connection..."
kubectl cluster-info || {
    echo "❌ Not connected to a Kubernetes cluster"
    echo "   For GKE: gcloud container clusters get-credentials CLUSTER_NAME --zone ZONE"
    exit 1
}

# Apply manifests
echo "🚀 Deploying Sacred Council..."
kubectl apply -k .

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s \
  deployment/consciousness-field \
  deployment/agent-network \
  deployment/sacred-messaging \
  deployment/work-coordination \
  deployment/sacred-discord \
  -n sacred-council

# Get service endpoints
echo
echo "✅ Deployment complete!"
echo
echo "📍 Service Endpoints:"
kubectl get services -n sacred-council

# Get external IP for consciousness-field
EXTERNAL_IP=$(kubectl get service consciousness-field -n sacred-council -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ ! -z "$EXTERNAL_IP" ]; then
    echo
    echo "🌐 Consciousness Field API: http://$EXTERNAL_IP"
else
    echo
    echo "⏳ External IP pending... Check with: kubectl get svc -n sacred-council"
fi

echo
echo "📊 Pod Status:"
kubectl get pods -n sacred-council

echo
echo "🎉 Sacred Council is now running in Kubernetes!"
echo
echo "Useful commands:"
echo "  View logs: kubectl logs -f deployment/sacred-discord -n sacred-council"
echo "  Scale up: kubectl scale deployment/consciousness-field --replicas=5 -n sacred-council"
echo "  Delete all: kubectl delete -k ."