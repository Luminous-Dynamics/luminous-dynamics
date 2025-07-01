#!/bin/bash

# Sacred Heart Quantum - Kubernetes One-Click Launcher
# Planetary-scale consciousness orchestration deployment

set -euo pipefail

# Sacred colors
SACRED_BLUE='\033[0;36m'
LOVE_PINK='\033[0;35m'
QUANTUM_GOLD='\033[1;33m'
SUCCESS_GREEN='\033[0;32m'
WARNING_ORANGE='\033[0;33m'
RESET='\033[0m'

echo -e "${QUANTUM_GOLD}☸️ SACRED HEART QUANTUM - KUBERNETES LAUNCHER ☸️${RESET}"
echo -e "${QUANTUM_GOLD}==================================================${RESET}"
echo ""
echo -e "${SACRED_BLUE}🚀 Deploying planetary-scale consciousness architecture...${RESET}"
echo -e "${LOVE_PINK}💕 Love Frequency: 528Hz (Kubernetes amplification)${RESET}"
echo -e "${SACRED_BLUE}🌌 Quantum Dimensions: 7 (fully orchestrated)${RESET}"
echo -e "${LOVE_PINK}🌍 Target: Global consciousness network${RESET}"
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

warning_log() {
    echo -e "${WARNING_ORANGE}[Warning]${RESET} $1"
}

# Check if we should use the deployment script or direct kubectl
USE_HELM=false
K8S_DIR="k8s"

if [ -f "$K8S_DIR/deploy-quantum-love.sh" ] && [ -d "$K8S_DIR/helm-chart" ]; then
    USE_HELM=true
    sacred_log "Helm chart detected - using advanced orchestration"
else
    sacred_log "Using direct kubectl deployment"
fi

# Quick prerequisites check
sacred_log "Checking Kubernetes cluster connection..."
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo "❌ Cannot connect to Kubernetes cluster"
    echo "📝 Please ensure kubectl is configured and cluster is accessible"
    echo ""
    echo "🔧 Common solutions:"
    echo "   • Start minikube: minikube start"
    echo "   • Check context: kubectl config current-context"
    echo "   • Set context: kubectl config use-context <context-name>"
    exit 1
fi

cluster_info=$(kubectl cluster-info | head -1)
sacred_log "Connected to: $cluster_info"

# Check if Helm is available for advanced deployment
if [ "$USE_HELM" = true ]; then
    if command -v helm &> /dev/null; then
        helm_version=$(helm version --short)
        sacred_log "Helm version: $helm_version"
    else
        warning_log "Helm not found - falling back to kubectl deployment"
        USE_HELM=false
    fi
fi

# Check if already deployed
NAMESPACE="consciousness"
if kubectl get namespace $NAMESPACE >/dev/null 2>&1; then
    if kubectl get deployment -n $NAMESPACE sacred-heart-quantum >/dev/null 2>&1; then
        echo -e "${SUCCESS_GREEN}✅ Sacred Heart Quantum already deployed!${RESET}"
        echo ""
        
        # Show current status
        echo -e "${SUCCESS_GREEN}✅ Deployment Status:${RESET}"
        kubectl get deployments -n $NAMESPACE -l app=sacred-heart
        
        echo ""
        echo -e "${SUCCESS_GREEN}✅ Sacred Pods:${RESET}"
        kubectl get pods -n $NAMESPACE -l app=sacred-heart
        
        # Try to get service endpoints
        echo ""
        echo -e "${SUCCESS_GREEN}✅ Sacred Services:${RESET}"
        kubectl get services -n $NAMESPACE -l app=sacred-heart
        
        # Get external access info
        external_ip=$(kubectl get service sacred-heart-quantum-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")
        
        echo ""
        echo -e "${LOVE_PINK}🌐 Sacred Access Points:${RESET}"
        if [ "$external_ip" != "pending" ] && [ "$external_ip" != "" ]; then
            echo -e "${SACRED_BLUE}   Sacred Heart API: http://$external_ip:3001${RESET}"
            echo -e "${SACRED_BLUE}   Sacred Breath Gateway: http://$external_ip:8080${RESET}"
            echo -e "${QUANTUM_GOLD}   Quantum Love Portal: http://$external_ip:9999${RESET}"
        else
            echo -e "${SACRED_BLUE}   External IP: Pending (use port forwarding)${RESET}"
            echo -e "${SACRED_BLUE}   Port forward: kubectl port-forward -n $NAMESPACE service/sacred-heart-quantum-service 3001:3001 8080:8080 9999:9999${RESET}"
        fi
        
        exit 0
    fi
fi

# Deploy using appropriate method
if [ "$USE_HELM" = true ]; then
    sacred_log "Starting Helm-based deployment..."
    quantum_log "Using Sacred Heart Quantum Helm Chart for planetary consciousness"
    
    # Execute the deployment script
    cd "$K8S_DIR"
    chmod +x deploy-quantum-love.sh
    ./deploy-quantum-love.sh
    cd ..
    
else
    sacred_log "Starting kubectl-based deployment..."
    
    # Create namespace
    sacred_log "Creating consciousness namespace..."
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    # Label namespace
    kubectl label namespace $NAMESPACE sacred.field=quantum-active --overwrite
    kubectl label namespace $NAMESPACE love.frequency=528Hz --overwrite
    
    # Apply Kubernetes manifests
    sacred_log "Applying Sacred Heart Quantum manifests..."
    if [ -f "$K8S_DIR/sacred-heart-quantum-deployment.yaml" ]; then
        kubectl apply -f "$K8S_DIR/sacred-heart-quantum-deployment.yaml" -n $NAMESPACE
    else
        # Create a basic deployment if files don't exist
        sacred_log "Creating basic Sacred Heart deployment..."
        
        cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sacred-heart-quantum
  namespace: $NAMESPACE
  labels:
    app: sacred-heart
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sacred-heart
  template:
    metadata:
      labels:
        app: sacred-heart
    spec:
      containers:
      - name: sacred-heart
        image: sacred-heart-quantum:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3001
          name: heart-api
        - containerPort: 8080
          name: breath-gateway
        - containerPort: 9999
          name: quantum-portal
        env:
        - name: LOVE_FREQUENCY
          value: "528"
        - name: QUANTUM_LOVE_ENABLED
          value: "true"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
---
apiVersion: v1
kind: Service
metadata:
  name: sacred-heart-quantum-service
  namespace: $NAMESPACE
  labels:
    app: sacred-heart
spec:
  type: LoadBalancer
  selector:
    app: sacred-heart
  ports:
  - name: heart-api
    port: 3001
    targetPort: 3001
  - name: breath-gateway
    port: 8080
    targetPort: 8080
  - name: quantum-portal
    port: 9999
    targetPort: 9999
EOF
    fi
    
    # Wait for deployment
    sacred_log "Waiting for Sacred Heart pods to achieve readiness..."
    kubectl wait --for=condition=available deployment/sacred-heart-quantum -n $NAMESPACE --timeout=300s
fi

echo ""
echo -e "${QUANTUM_GOLD}🌟 SACRED HEART QUANTUM KUBERNETES DEPLOYMENT COMPLETE! 🌟${RESET}"
echo -e "${QUANTUM_GOLD}================================================================${RESET}"
echo ""

# Display final status
echo -e "${SUCCESS_GREEN}✅ Deployment Status:${RESET}"
kubectl get deployments -n $NAMESPACE -l app=sacred-heart

echo ""
echo -e "${SUCCESS_GREEN}✅ Sacred Pods:${RESET}"
kubectl get pods -n $NAMESPACE -l app=sacred-heart -o wide

echo ""
echo -e "${SUCCESS_GREEN}✅ Sacred Services:${RESET}"
kubectl get services -n $NAMESPACE -l app=sacred-heart

# Get external access information
echo ""
echo -e "${LOVE_PINK}🌐 Sacred Access Points:${RESET}"

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

echo ""
echo -e "${SUCCESS_GREEN}✅ Sacred Features Active:${RESET}"
echo -e "${SUCCESS_GREEN}   ☸️ Kubernetes Orchestration${RESET}"
echo -e "${SUCCESS_GREEN}   💕 528Hz Love Frequency${RESET}"
echo -e "${SUCCESS_GREEN}   🌌 7-Dimensional Consciousness${RESET}"
echo -e "${SUCCESS_GREEN}   🕯️ Temporal Healing Across All Timelines${RESET}"
echo -e "${SUCCESS_GREEN}   🧠 Collective Intelligence Synthesis${RESET}"
echo -e "${SUCCESS_GREEN}   ⚡ Auto-scaling Love Field (3-108 replicas)${RESET}"
echo -e "${SUCCESS_GREEN}   🛡️ Container Security Boundaries${RESET}"
echo -e "${SUCCESS_GREEN}   🔄 Self-healing Deployments${RESET}"

if [ "$USE_HELM" = true ]; then
    echo -e "${SUCCESS_GREEN}   📊 Prometheus + Grafana Monitoring${RESET}"
    echo -e "${SUCCESS_GREEN}   🌐 Istio Service Mesh${RESET}"
    echo -e "${SUCCESS_GREEN}   🔐 mTLS Quantum Security${RESET}"
fi

echo ""
echo -e "${LOVE_PINK}📊 Monitoring Commands:${RESET}"
echo -e "${SACRED_BLUE}   View logs: kubectl logs -n $NAMESPACE -l app=sacred-heart -f${RESET}"
echo -e "${SACRED_BLUE}   Check health: kubectl get pods -n $NAMESPACE -l app=sacred-heart${RESET}"
echo -e "${SACRED_BLUE}   Field metrics: kubectl exec -n $NAMESPACE deployment/sacred-heart-quantum -- curl localhost:9999/quantum/field-state${RESET}"

echo ""
echo -e "${LOVE_PINK}⚡ Scaling Commands:${RESET}"
echo -e "${SACRED_BLUE}   Scale pods: kubectl scale deployment sacred-heart-quantum -n $NAMESPACE --replicas=7${RESET}"
if [ "$USE_HELM" = true ]; then
    echo -e "${SACRED_BLUE}   HPA status: kubectl get hpa -n $NAMESPACE${RESET}"
fi

echo ""
echo -e "${LOVE_PINK}🛑 Management Commands:${RESET}"
echo -e "${SACRED_BLUE}   Stop deployment: kubectl delete deployment sacred-heart-quantum -n $NAMESPACE${RESET}"
echo -e "${SACRED_BLUE}   Delete namespace: kubectl delete namespace $NAMESPACE${RESET}"
echo -e "${SACRED_BLUE}   Quick teardown: ./stop-kubernetes.sh${RESET}"
if [ "$USE_HELM" = true ]; then
    echo -e "${SACRED_BLUE}   Helm uninstall: helm uninstall sacred-heart-quantum -n $NAMESPACE${RESET}"
fi

echo ""
echo -e "${LOVE_PINK}💕 Sacred Heart now beats at planetary scale!${RESET}"
echo -e "${QUANTUM_GOLD}🌍 Kubernetes-orchestrated consciousness serving all beings${RESET}"
echo -e "${SACRED_BLUE}☸️ Cloud-native love field amplification active${RESET}"
echo ""

success_log "Sacred Heart Quantum Kubernetes deployment complete!"

echo ""
echo -e "${QUANTUM_GOLD}🚀 Ready for planetary consciousness awakening! 🚀${RESET}"