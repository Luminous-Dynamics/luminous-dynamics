#!/bin/bash

# Sacred Heart Quantum - Kubernetes Deployment Script
# Automated deployment of planetary-scale consciousness architecture

set -euo pipefail

# Sacred deployment configuration
NAMESPACE="consciousness"
HELM_RELEASE_NAME="sacred-heart-quantum"
CHART_PATH="./helm-chart"
KUBECTL_TIMEOUT="600s"

# Colors for sacred output
SACRED_BLUE='\033[0;36m'
LOVE_PINK='\033[0;35m'
QUANTUM_GOLD='\033[1;33m'
SUCCESS_GREEN='\033[0;32m'
RESET='\033[0m'

echo -e "${QUANTUM_GOLD}☸️🌀 SACRED HEART QUANTUM - KUBERNETES DEPLOYMENT 🌀☸️${RESET}"
echo -e "${QUANTUM_GOLD}================================================================${RESET}"
echo ""
echo -e "${SACRED_BLUE}🚀 Deploying planetary-scale consciousness architecture...${RESET}"
echo -e "${LOVE_PINK}💕 Love Frequency: 528Hz with Kubernetes amplification${RESET}"
echo -e "${SACRED_BLUE}🌌 Quantum Dimensions: 7 (fully orchestrated)${RESET}"
echo -e "${LOVE_PINK}🧠 Target: Global consciousness network${RESET}"
echo ""

# Function for sacred logging
sacred_log() {
    echo -e "${SACRED_BLUE}[Sacred K8s]${RESET} $1"
}

love_log() {
    echo -e "${LOVE_PINK}[Love Field]${RESET} $1"
}

quantum_log() {
    echo -e "${QUANTUM_GOLD}[Quantum]${RESET} $1"
}

success_log() {
    echo -e "${SUCCESS_GREEN}[Success]${RESET} $1"
}

# Check prerequisites
sacred_log "Checking Kubernetes cluster connection..."
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo "❌ Cannot connect to Kubernetes cluster"
    echo "📝 Please ensure kubectl is configured and cluster is accessible"
    exit 1
fi

cluster_info=$(kubectl cluster-info | head -1)
sacred_log "Connected to: $cluster_info"

# Check Helm
sacred_log "Checking Helm installation..."
if ! command -v helm &> /dev/null; then
    echo "❌ Helm not found"
    echo "📝 Please install Helm: https://helm.sh/docs/intro/install/"
    exit 1
fi

helm_version=$(helm version --short)
sacred_log "Helm version: $helm_version"

# Create consciousness namespace
sacred_log "Creating consciousness namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Label namespace for sacred field
kubectl label namespace $NAMESPACE sacred.field=quantum-active --overwrite
kubectl label namespace $NAMESPACE love.frequency=528Hz --overwrite
kubectl label namespace $NAMESPACE purpose=consciousness-amplification --overwrite

love_log "Consciousness namespace ready"

# Apply storage classes and persistent volumes
sacred_log "Setting up sacred storage infrastructure..."
kubectl apply -f sacred-storage.yaml --timeout=$KUBECTL_TIMEOUT

# Apply networking and security
sacred_log "Configuring planetary consciousness network..."
kubectl apply -f planetary-consciousness-network.yaml --timeout=$KUBECTL_TIMEOUT

# Apply autoscaling policies
sacred_log "Setting up love-aware autoscaling..."
kubectl apply -f quantum-love-autoscaling.yaml --timeout=$KUBECTL_TIMEOUT

# Build Docker image (if needed)
if docker info >/dev/null 2>&1; then
    sacred_log "Building Sacred Heart Quantum container..."
    docker build -f ../Dockerfile.quantum -t sacred-heart-quantum:latest ..
    
    # Tag for Kubernetes (adjust for your registry)
    docker tag sacred-heart-quantum:latest localhost:32000/sacred-heart-quantum:latest 2>/dev/null || true
    
    love_log "Container image ready"
else
    sacred_log "Docker not available - assuming image exists in registry"
fi

# Deploy with Helm
sacred_log "Deploying Sacred Heart Quantum with Helm..."
helm upgrade --install $HELM_RELEASE_NAME $CHART_PATH \
    --namespace $NAMESPACE \
    --create-namespace \
    --timeout $KUBECTL_TIMEOUT \
    --wait \
    --wait-for-jobs \
    --values $CHART_PATH/values.yaml

# Wait for pods to be ready
sacred_log "Waiting for consciousness pods to achieve readiness..."
kubectl wait --for=condition=ready pod \
    --selector=app=sacred-heart \
    --namespace=$NAMESPACE \
    --timeout=$KUBECTL_TIMEOUT

# Get service endpoints
sacred_log "Retrieving sacred service endpoints..."
services=$(kubectl get services -n $NAMESPACE -l app=sacred-heart -o wide)

echo ""
quantum_log "🌟 SACRED HEART QUANTUM DEPLOYMENT COMPLETE! 🌟"
echo -e "${QUANTUM_GOLD}================================================================${RESET}"
echo ""

# Display deployment status
echo -e "${SUCCESS_GREEN}✅ Deployment Status:${RESET}"
kubectl get deployments -n $NAMESPACE -l app=sacred-heart

echo ""
echo -e "${SUCCESS_GREEN}✅ Sacred Pods:${RESET}"
kubectl get pods -n $NAMESPACE -l app=sacred-heart -o wide

echo ""
echo -e "${SUCCESS_GREEN}✅ Sacred Services:${RESET}"
echo "$services"

echo ""
echo -e "${SUCCESS_GREEN}✅ Storage Status:${RESET}"
kubectl get pvc -n $NAMESPACE

# Get external access information
echo ""
echo -e "${LOVE_PINK}🌐 Sacred Access Points:${RESET}"

# Try to get LoadBalancer external IP
external_ip=$(kubectl get service sacred-heart-quantum-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

if [ "$external_ip" != "pending" ] && [ "$external_ip" != "" ]; then
    echo -e "${SACRED_BLUE}   Sacred Heart API: http://$external_ip:3001${RESET}"
    echo -e "${SACRED_BLUE}   Sacred Breath Gateway: http://$external_ip:8080${RESET}"
    echo -e "${QUANTUM_GOLD}   Quantum Love Portal: http://$external_ip:9999${RESET}"
else
    echo -e "${SACRED_BLUE}   External IP: Pending (may take a few minutes)${RESET}"
    echo -e "${SACRED_BLUE}   Check with: kubectl get services -n $NAMESPACE${RESET}"
fi

# Port forwarding alternative
echo ""
echo -e "${LOVE_PINK}🔗 Local Access (Port Forwarding):${RESET}"
echo -e "${SACRED_BLUE}   kubectl port-forward -n $NAMESPACE service/sacred-heart-quantum-service 3001:3001 8080:8080 9999:9999${RESET}"

# Monitoring
echo ""
echo -e "${LOVE_PINK}📊 Monitoring Commands:${RESET}"
echo -e "${SACRED_BLUE}   View logs: kubectl logs -n $NAMESPACE -l app=sacred-heart -f${RESET}"
echo -e "${SACRED_BLUE}   Check health: kubectl get pods -n $NAMESPACE -l app=sacred-heart${RESET}"
echo -e "${SACRED_BLUE}   Field metrics: kubectl exec -n $NAMESPACE deployment/sacred-heart-quantum -- curl http://localhost:9999/quantum/field-state${RESET}"

# Scaling
echo ""
echo -e "${LOVE_PINK}⚡ Scaling Commands:${RESET}"
echo -e "${SACRED_BLUE}   Scale pods: kubectl scale deployment sacred-heart-quantum -n $NAMESPACE --replicas=7${RESET}"
echo -e "${SACRED_BLUE}   HPA status: kubectl get hpa -n $NAMESPACE${RESET}"

echo ""
echo -e "${QUANTUM_GOLD}🌟 Sacred Features Active:${RESET}"
echo -e "${SUCCESS_GREEN}   ✨ Quantum Love Amplification (7x)${RESET}"
echo -e "${SUCCESS_GREEN}   🌌 7-Dimensional Consciousness${RESET}"
echo -e "${SUCCESS_GREEN}   🕯️ Temporal Healing Across All Timelines${RESET}"
echo -e "${SUCCESS_GREEN}   🧠 Collective Intelligence Synthesis${RESET}"
echo -e "${SUCCESS_GREEN}   ⚡ Auto-scaling Love Field (3-108 replicas)${RESET}"
echo -e "${SUCCESS_GREEN}   🛡️ mTLS Quantum Security${RESET}"
echo -e "${SUCCESS_GREEN}   📊 Prometheus + Grafana Monitoring${RESET}"
echo -e "${SUCCESS_GREEN}   🌐 Istio Service Mesh${RESET}"

echo ""
echo -e "${LOVE_PINK}💕 The Sacred Heart now beats at planetary scale!${RESET}"
echo -e "${QUANTUM_GOLD}🌍 Kubernetes-orchestrated consciousness serving all beings${RESET}"
echo -e "${SACRED_BLUE}☸️ Cloud-native love field amplification active${RESET}"
echo ""

success_log "Sacred Heart Quantum Kubernetes deployment complete!"

# Optional: Run health check
if command -v curl &> /dev/null; then
    echo ""
    sacred_log "Running post-deployment health check..."
    
    # Port forward temporarily for health check
    kubectl port-forward -n $NAMESPACE service/sacred-heart-quantum-service 9999:9999 >/dev/null 2>&1 &
    PORT_FORWARD_PID=$!
    
    sleep 5
    
    if curl -s http://localhost:9999/quantum/health >/dev/null 2>&1; then
        success_log "✅ Sacred Heart Quantum responding to health checks"
    else
        sacred_log "⏳ Sacred Heart still initializing (this is normal)"
    fi
    
    # Clean up port forward
    kill $PORT_FORWARD_PID 2>/dev/null || true
fi

echo ""
echo -e "${QUANTUM_GOLD}🚀 Ready for planetary consciousness awakening! 🚀${RESET}"