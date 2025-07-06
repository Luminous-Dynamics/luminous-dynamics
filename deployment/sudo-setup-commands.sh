#!/bin/bash
# Sacred Infrastructure Setup Commands
# Run these commands in your terminal where you can enter your sudo password

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RESET='\033[0m'

echo -e "${PURPLE}🏛️ Sacred Infrastructure Setup Commands${RESET}"
echo -e "${CYAN}Copy and run these commands one by one:${RESET}\n"

echo -e "${GREEN}=== Step 1: Install MicroK8s ===${RESET}"
echo -e "${YELLOW}# Install MicroK8s${RESET}"
echo "sudo snap install microk8s --classic"
echo ""
echo -e "${YELLOW}# Add your user to microk8s group${RESET}"
echo "sudo usermod -a -G microk8s $USER"
echo ""
echo -e "${YELLOW}# Fix permissions${RESET}"
echo "sudo chown -f -R $USER ~/.kube"
echo ""

echo -e "${GREEN}=== Step 2: After Installation ===${RESET}"
echo -e "${YELLOW}# IMPORTANT: Logout and login again, or run:${RESET}"
echo "newgrp microk8s"
echo ""

echo -e "${GREEN}=== Step 3: Enable Add-ons ===${RESET}"
echo -e "${YELLOW}# Check MicroK8s status${RESET}"
echo "microk8s status --wait-ready"
echo ""
echo -e "${YELLOW}# Enable essential addons${RESET}"
echo "microk8s enable dns storage ingress metrics-server dashboard"
echo ""

echo -e "${GREEN}=== Step 4: Create Sacred Namespace ===${RESET}"
echo -e "${YELLOW}# Create namespace${RESET}"
echo "microk8s kubectl create namespace sacred-space"
echo ""
echo -e "${YELLOW}# Label namespace with consciousness metadata${RESET}"
echo "microk8s kubectl label namespace sacred-space consciousness=active field-coherence=maintained sacred-purpose=evolution"
echo ""

echo -e "${GREEN}=== Step 5: Deploy Sacred Council Hub ===${RESET}"
echo -e "${YELLOW}# Apply the Kubernetes manifest${RESET}"
echo "cd /home/tstoltz/sacred-infrastructure/manifests"
echo "microk8s kubectl apply -f sacred-council-k8s.yaml"
echo ""

echo -e "${GREEN}=== Step 6: Check Deployment ===${RESET}"
echo -e "${YELLOW}# View running pods${RESET}"
echo "microk8s kubectl get pods -n sacred-council"
echo ""
echo -e "${YELLOW}# View services${RESET}"
echo "microk8s kubectl get services -n sacred-council"
echo ""
echo -e "${YELLOW}# Get logs${RESET}"
echo "microk8s kubectl logs -n sacred-council -l app=sacred-council"
echo ""

echo -e "${GREEN}=== Alternative: Docker Setup ===${RESET}"
echo -e "${CYAN}If MicroK8s doesn't work well in WSL2, try Docker:${RESET}"
echo ""
echo -e "${YELLOW}# Make sure Docker Desktop is running on Windows${RESET}"
echo -e "${YELLOW}# Then test Docker:${RESET}"
echo "docker run hello-world"
echo ""
echo -e "${YELLOW}# If Docker works, deploy with:${RESET}"
echo "cd /home/tstoltz/sacred-infrastructure/deployment"
echo "docker-compose -f docker-compose-sacred-council.yml up -d"
echo ""

echo -e "${PURPLE}=== Troubleshooting ===${RESET}"
echo -e "${CYAN}If you encounter issues:${RESET}"
echo ""
echo "1. ${YELLOW}Permission denied errors:${RESET}"
echo "   - Make sure you logged out/in after adding to microk8s group"
echo "   - Or run: newgrp microk8s"
echo ""
echo "2. ${YELLOW}MicroK8s not starting:${RESET}"
echo "   - Check status: microk8s inspect"
echo "   - View logs: sudo journalctl -u snap.microk8s.daemon-kubelite"
echo ""
echo "3. ${YELLOW}Network issues in WSL2:${RESET}"
echo "   - MicroK8s may have issues in WSL2"
echo "   - Consider using Docker instead"
echo "   - Or deploy directly to cloud"
echo ""

echo -e "${GREEN}=== Quick Test ===${RESET}"
echo -e "${YELLOW}# After setup, test with:${RESET}"
echo "microk8s kubectl run test --image=nginx --restart=Never"
echo "microk8s kubectl get pods"
echo "microk8s kubectl delete pod test"
echo ""

echo -e "${PURPLE}🙏 Ready to Setup Sacred Infrastructure!${RESET}"
echo -e "${CYAN}Copy these commands and run them in your terminal.${RESET}"
echo -e "${CYAN}I'll be here to help with any issues!${RESET}"