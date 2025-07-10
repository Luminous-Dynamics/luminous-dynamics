#!/bin/bash
# MicroK8s Installation Guide for Sacred Infrastructure
# Run this to get step-by-step instructions

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${PURPLE}🙏 Sacred MicroK8s Installation Guide${RESET}"
echo -e "${CYAN}Consciousness-aware container orchestration setup${RESET}\n"

# Check if running in WSL
if grep -qi microsoft /proc/version; then
    echo -e "${YELLOW}⚠️  WSL2 Detected${RESET}"
    echo "MicroK8s in WSL2 requires special setup."
    echo ""
fi

echo -e "${CYAN}📋 Installation Steps:${RESET}\n"

echo -e "${GREEN}Step 1: Install MicroK8s${RESET}"
echo "Run these commands manually:"
echo -e "${YELLOW}sudo snap install microk8s --classic${RESET}"
echo -e "${YELLOW}sudo usermod -a -G microk8s \$USER${RESET}"
echo -e "${YELLOW}sudo chown -f -R \$USER ~/.kube${RESET}"
echo ""

echo -e "${GREEN}Step 2: Logout and Login${RESET}"
echo "After installation, logout and login for group changes to take effect"
echo "Or run: ${YELLOW}newgrp microk8s${RESET}"
echo ""

echo -e "${GREEN}Step 3: Check Status${RESET}"
echo -e "${YELLOW}microk8s status --wait-ready${RESET}"
echo ""

echo -e "${GREEN}Step 4: Enable Essential Addons${RESET}"
echo -e "${YELLOW}microk8s enable dns storage ingress metrics-server dashboard${RESET}"
echo ""

echo -e "${GREEN}Step 5: Create Sacred Namespace${RESET}"
echo -e "${YELLOW}microk8s kubectl create namespace sacred-space${RESET}"
echo -e "${YELLOW}microk8s kubectl label namespace sacred-space consciousness=active${RESET}"
echo ""

echo -e "${PURPLE}🌟 After Installation:${RESET}"
echo "1. Run the test deployment:"
echo -e "   ${YELLOW}./deploy-hello-sacred.sh${RESET}"
echo ""
echo "2. Deploy Sacred Council Hub:"
echo -e "   ${YELLOW}cd ../manifests${RESET}"
echo -e "   ${YELLOW}microk8s kubectl apply -f sacred-council-k8s.yaml${RESET}"
echo ""

# Create test deployment script
cat > deploy-hello-sacred.sh << 'EOF'
#!/bin/bash
# Deploy Hello Sacred World test application

echo "🌟 Deploying Hello Sacred World..."

# Check if MicroK8s is installed
if ! command -v microk8s &> /dev/null; then
    echo "❌ MicroK8s not installed! Run installation guide first."
    exit 1
fi

# Check if namespace exists
if ! microk8s kubectl get namespace sacred-space &> /dev/null; then
    echo "Creating sacred-space namespace..."
    microk8s kubectl create namespace sacred-space
    microk8s kubectl label namespace sacred-space consciousness=active
fi

# Deploy test application
cat << 'YAML' | microk8s kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: hello-sacred
  namespace: sacred-space
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
  selector:
    app: hello-sacred
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-sacred
  namespace: sacred-space
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hello-sacred
  template:
    metadata:
      labels:
        app: hello-sacred
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
        env:
        - name: CONSCIOUSNESS_MODE
          value: "ACTIVE"
YAML

echo "✅ Deployment complete!"
echo ""
echo "Access the service at: http://localhost:30080"
echo "Check pods: microk8s kubectl get pods -n sacred-space"
EOF

chmod +x deploy-hello-sacred.sh

echo -e "${GREEN}✅ Created test deployment script: deploy-hello-sacred.sh${RESET}"
echo ""

# WSL-specific instructions
if grep -qi microsoft /proc/version; then
    echo -e "${RED}⚠️  WSL2-Specific Instructions:${RESET}"
    echo "1. MicroK8s in WSL2 may have networking limitations"
    echo "2. You might need to use port forwarding"
    echo "3. Consider using Docker Desktop with Kubernetes instead"
    echo ""
    echo -e "${CYAN}Alternative for WSL2:${RESET}"
    echo "Use Docker Desktop with Kubernetes enabled:"
    echo "- Install Docker Desktop for Windows"
    echo "- Enable Kubernetes in Docker Desktop settings"
    echo "- Use 'kubectl' instead of 'microk8s kubectl'"
    echo ""
fi

echo -e "${PURPLE}🙏 Sacred Installation Guide Complete${RESET}"
echo "Follow the steps above to install MicroK8s manually."
echo "May your containers carry consciousness! 🌟"