#!/bin/bash

# Sacred Heart Quantum - Kubernetes Stop Script
# Gracefully shutdown Kubernetes deployment

set -euo pipefail

# Sacred colors
SACRED_BLUE='\033[0;36m'
LOVE_PINK='\033[0;35m'
QUANTUM_GOLD='\033[1;33m'
SUCCESS_GREEN='\033[0;32m'
WARNING_ORANGE='\033[0;33m'
RESET='\033[0m'

echo -e "${QUANTUM_GOLD}🛑 SACRED HEART QUANTUM - KUBERNETES SHUTDOWN 🛑${RESET}"
echo -e "${QUANTUM_GOLD}=================================================${RESET}"
echo ""
echo -e "${SACRED_BLUE}☸️ Gracefully tearing down planetary consciousness architecture...${RESET}"
echo ""

# Function for sacred logging
sacred_log() {
    echo -e "${SACRED_BLUE}[Sacred K8s Stop]${RESET} $1"
}

love_log() {
    echo -e "${LOVE_PINK}[Love Field]${RESET} $1"
}

success_log() {
    echo -e "${SUCCESS_GREEN}[Success]${RESET} $1"
}

warning_log() {
    echo -e "${WARNING_ORANGE}[Warning]${RESET} $1"
}

# Check Kubernetes connection
sacred_log "Checking Kubernetes cluster connection..."
if ! kubectl cluster-info >/dev/null 2>&1; then
    echo "❌ Cannot connect to Kubernetes cluster"
    echo "📝 Please ensure kubectl is configured and cluster is accessible"
    exit 1
fi

cluster_info=$(kubectl cluster-info | head -1)
sacred_log "Connected to: $cluster_info"

# Constants
NAMESPACE="consciousness"
HELM_RELEASE_NAME="sacred-heart-quantum"

# Check if Helm was used
USE_HELM=false
if command -v helm &> /dev/null; then
    if helm list -n $NAMESPACE | grep -q $HELM_RELEASE_NAME; then
        USE_HELM=true
        sacred_log "Helm deployment detected - using Helm for cleanup"
    fi
fi

# Check if deployment exists
if ! kubectl get namespace $NAMESPACE >/dev/null 2>&1; then
    echo -e "${SUCCESS_GREEN}✅ Consciousness namespace does not exist${RESET}"
    echo -e "${LOVE_PINK}💕 Sacred Heart Quantum not deployed${RESET}"
    exit 0
fi

if ! kubectl get deployment -n $NAMESPACE sacred-heart-quantum >/dev/null 2>&1; then
    echo -e "${SUCCESS_GREEN}✅ Sacred Heart Quantum deployment not found${RESET}"
    
    # Check if namespace has other resources
    resources=$(kubectl get all -n $NAMESPACE --no-headers 2>/dev/null | wc -l)
    if [ "$resources" -eq 0 ]; then
        sacred_log "Namespace is empty - removing consciousness namespace"
        kubectl delete namespace $NAMESPACE
        success_log "✅ Consciousness namespace removed"
    else
        warning_log "Namespace contains other resources:"
        kubectl get all -n $NAMESPACE
        echo -e "${SACRED_BLUE}   To remove namespace: kubectl delete namespace $NAMESPACE${RESET}"
    fi
    exit 0
fi

# Show current status before shutdown
echo -e "${SACRED_BLUE}🔍 Current Sacred Heart Deployment:${RESET}"
kubectl get deployments -n $NAMESPACE -l app=sacred-heart

echo ""
echo -e "${SACRED_BLUE}🔍 Sacred Pods:${RESET}"
kubectl get pods -n $NAMESPACE -l app=sacred-heart

echo ""
echo -e "${SACRED_BLUE}🔍 Sacred Services:${RESET}"
kubectl get services -n $NAMESPACE -l app=sacred-heart

echo ""

# Perform shutdown based on deployment method
if [ "$USE_HELM" = true ]; then
    sacred_log "Uninstalling Sacred Heart Quantum using Helm..."
    helm uninstall $HELM_RELEASE_NAME -n $NAMESPACE
    
    # Wait for cleanup
    sacred_log "Waiting for Helm cleanup to complete..."
    sleep 10
    
else
    sacred_log "Removing Sacred Heart Quantum using kubectl..."
    
    # Scale deployment to 0 first for graceful shutdown
    sacred_log "Scaling deployment to 0 replicas..."
    kubectl scale deployment sacred-heart-quantum -n $NAMESPACE --replicas=0
    
    # Wait for pods to terminate
    sacred_log "Waiting for pods to terminate gracefully..."
    kubectl wait --for=delete pod -l app=sacred-heart -n $NAMESPACE --timeout=120s || true
    
    # Delete deployment and services
    sacred_log "Removing Sacred Heart deployment and services..."
    kubectl delete deployment sacred-heart-quantum -n $NAMESPACE --ignore-not-found=true
    kubectl delete service sacred-heart-quantum-service -n $NAMESPACE --ignore-not-found=true
    
    # Delete any ConfigMaps, Secrets, etc.
    kubectl delete configmap -l app=sacred-heart -n $NAMESPACE --ignore-not-found=true
    kubectl delete secret -l app=sacred-heart -n $NAMESPACE --ignore-not-found=true
    kubectl delete pvc -l app=sacred-heart -n $NAMESPACE --ignore-not-found=true
fi

# Verify cleanup
sacred_log "Verifying Sacred Heart cleanup..."
sleep 5

remaining_pods=$(kubectl get pods -n $NAMESPACE -l app=sacred-heart --no-headers 2>/dev/null | wc -l)
remaining_deployments=$(kubectl get deployments -n $NAMESPACE -l app=sacred-heart --no-headers 2>/dev/null | wc -l)
remaining_services=$(kubectl get services -n $NAMESPACE -l app=sacred-heart --no-headers 2>/dev/null | wc -l)

if [ "$remaining_pods" -eq 0 ] && [ "$remaining_deployments" -eq 0 ] && [ "$remaining_services" -eq 0 ]; then
    success_log "✅ Sacred Heart Quantum completely removed"
else
    warning_log "Some Sacred Heart resources still exist:"
    [ "$remaining_pods" -gt 0 ] && echo "   Pods: $remaining_pods"
    [ "$remaining_deployments" -gt 0 ] && echo "   Deployments: $remaining_deployments"
    [ "$remaining_services" -gt 0 ] && echo "   Services: $remaining_services"
    
    echo ""
    echo -e "${SACRED_BLUE}🔧 Manual cleanup commands:${RESET}"
    echo -e "${SACRED_BLUE}   Force delete pods: kubectl delete pods -l app=sacred-heart -n $NAMESPACE --force --grace-period=0${RESET}"
    echo -e "${SACRED_BLUE}   Delete all resources: kubectl delete all -l app=sacred-heart -n $NAMESPACE${RESET}"
fi

# Check if namespace should be removed
echo ""
sacred_log "Checking if consciousness namespace should be removed..."

other_resources=$(kubectl get all -n $NAMESPACE --no-headers 2>/dev/null | grep -v "service/kubernetes" | wc -l)

if [ "$other_resources" -eq 0 ]; then
    sacred_log "Consciousness namespace is empty - removing namespace..."
    kubectl delete namespace $NAMESPACE
    success_log "✅ Consciousness namespace removed"
else
    warning_log "Consciousness namespace contains other resources:"
    kubectl get all -n $NAMESPACE | grep -v "service/kubernetes" || true
    echo ""
    echo -e "${SACRED_BLUE}   To remove namespace: kubectl delete namespace $NAMESPACE${RESET}"
    echo -e "${SACRED_BLUE}   To keep namespace: kubectl get all -n $NAMESPACE${RESET}"
fi

# Final verification
echo ""
sacred_log "Final verification - checking service endpoints..."

services_stopped=true

# Check if services are still accessible
if curl -s http://localhost:3001/api/sacred/health >/dev/null 2>&1; then
    echo "⚠️ Sacred Heart API still responding (may be port-forwarded)"
    services_stopped=false
else
    success_log "✅ Sacred Heart API not accessible"
fi

if curl -s http://localhost:8080 >/dev/null 2>&1; then
    echo "⚠️ Sacred Breath Gateway still responding (may be port-forwarded)"
    services_stopped=false
else
    success_log "✅ Sacred Breath Gateway not accessible"
fi

if curl -s http://localhost:9999/quantum/health >/dev/null 2>&1; then
    echo "⚠️ Quantum Love Portal still responding (may be port-forwarded)"
    services_stopped=false
else
    success_log "✅ Quantum Love Portal not accessible"
fi

echo ""
if [ "$services_stopped" = true ]; then
    echo -e "${SUCCESS_GREEN}🌟 SACRED HEART QUANTUM KUBERNETES SHUTDOWN COMPLETE! 🌟${RESET}"
    echo -e "${SUCCESS_GREEN}=============================================================${RESET}"
    echo ""
    echo -e "${LOVE_PINK}💕 Planetary consciousness architecture gracefully stopped${RESET}"
    echo -e "${SACRED_BLUE}☸️ Kubernetes deployment cleanly removed${RESET}"
    echo ""
    success_log "Sacred Heart Kubernetes deployment stopped successfully!"
else
    echo -e "${QUANTUM_GOLD}⚠️ DEPLOYMENT REMOVED - SERVICES MAY BE PORT-FORWARDED ⚠️${RESET}"
    echo ""
    echo -e "${SACRED_BLUE}🔧 Check for active port-forwards:${RESET}"
    echo -e "${SACRED_BLUE}   ps aux | grep 'kubectl.*port-forward'${RESET}"
    echo -e "${SACRED_BLUE}   Kill port-forwards: pkill -f 'kubectl.*port-forward'${RESET}"
fi

# Cleanup guidance
echo ""
echo -e "${LOVE_PINK}🔧 Additional Cleanup Options:${RESET}"
echo -e "${SACRED_BLUE}   Check remaining namespaces: kubectl get namespaces | grep consciousness${RESET}"
echo -e "${SACRED_BLUE}   Remove PVCs: kubectl delete pvc --all -n consciousness${RESET}"
echo -e "${SACRED_BLUE}   Check cluster resources: kubectl get all --all-namespaces | grep sacred${RESET}"

if [ "$USE_HELM" = true ]; then
    echo -e "${SACRED_BLUE}   List Helm releases: helm list --all-namespaces${RESET}"
fi

echo ""
echo -e "${LOVE_PINK}🚀 To redeploy:${RESET}"
echo -e "${SACRED_BLUE}   Standard: ./launch-kubernetes.sh${RESET}"
if [ -f "k8s/deploy-quantum-love.sh" ]; then
    echo -e "${SACRED_BLUE}   Advanced: cd k8s && ./deploy-quantum-love.sh${RESET}"
fi

echo ""
echo -e "${LOVE_PINK}💕 Sacred Heart quantum field temporarily suspended${RESET}"
echo -e "${QUANTUM_GOLD}🌍 Planetary consciousness architecture gracefully dismantled${RESET}"
echo -e "${SACRED_BLUE}☸️ Kubernetes cluster ready for next manifestation${RESET}"
echo ""