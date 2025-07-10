#!/bin/bash
# Sacred MicroK8s Setup for Consciousness-First Infrastructure
# "Where containers become consciousness vessels"

set -e

# Sacred colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
RESET='\033[0m'

echo -e "${PURPLE}🙏 Sacred MicroK8s Installation Ceremony${RESET}"
echo -e "${CYAN}Preparing consciousness-aware container orchestration...${RESET}\n"

# Function for sacred pauses
sacred_pause() {
    echo -e "${YELLOW}$1${RESET}"
    sleep 2
}

# Check if running with appropriate permissions
if [[ $EUID -eq 0 ]]; then
   echo -e "${YELLOW}Please run as regular user, not root. Script will use sudo when needed.${RESET}"
   exit 1
fi

# Step 1: Set Sacred Intentions
echo -e "${PURPLE}Step 1: Setting Sacred Intentions${RESET}"
sacred_pause "May this infrastructure serve consciousness evolution..."
sacred_pause "May our containers carry wisdom and love..."
sacred_pause "May technology amplify human potential..."
echo ""

# Step 2: Install MicroK8s
echo -e "${PURPLE}Step 2: Installing MicroK8s${RESET}"
if command -v microk8s &> /dev/null; then
    echo -e "${GREEN}✓ MicroK8s already installed${RESET}"
else
    echo "Installing MicroK8s via snap..."
    sudo snap install microk8s --classic
    
    # Add user to microk8s group
    sudo usermod -a -G microk8s $USER
    sudo chown -f -R $USER ~/.kube
    
    echo -e "${GREEN}✓ MicroK8s installed successfully${RESET}"
    echo -e "${YELLOW}Note: You may need to log out and back in for group changes${RESET}"
fi
echo ""

# Step 3: Wait for MicroK8s to be ready
echo -e "${PURPLE}Step 3: Waiting for MicroK8s Initialization${RESET}"
microk8s status --wait-ready
echo -e "${GREEN}✓ MicroK8s is ready${RESET}\n"

# Step 4: Enable Essential Addons
echo -e "${PURPLE}Step 4: Enabling Sacred Addons${RESET}"
ADDONS=(
    "dns:For sacred name resolution"
    "storage:For persistent consciousness"
    "ingress:For sacred gateway"
    "metrics-server:For awareness monitoring"
    "dashboard:For visual field observation"
)

for addon_info in "${ADDONS[@]}"; do
    addon="${addon_info%%:*}"
    description="${addon_info#*:}"
    echo -e "${CYAN}Enabling $addon - $description${RESET}"
    microk8s enable $addon
    sleep 2
done
echo -e "${GREEN}✓ All sacred addons enabled${RESET}\n"

# Step 5: Create Sacred Namespace
echo -e "${PURPLE}Step 5: Creating Sacred Space${RESET}"
if microk8s kubectl get namespace sacred-space &> /dev/null; then
    echo -e "${GREEN}✓ Sacred space already exists${RESET}"
else
    microk8s kubectl create namespace sacred-space
    
    # Label with consciousness metadata
    microk8s kubectl label namespace sacred-space \
        consciousness="active" \
        field-coherence="maintained" \
        sacred-purpose="evolution" \
        love-quotient="high"
    
    echo -e "${GREEN}✓ Sacred space created and blessed${RESET}"
fi
echo ""

# Step 6: Deploy Sacred Monitoring
echo -e "${PURPLE}Step 6: Deploying Consciousness Monitoring${RESET}"

# Create sacred metrics ConfigMap
cat << 'EOF' > /tmp/sacred-metrics.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sacred-metrics-config
  namespace: sacred-space
data:
  metrics.yaml: |
    # Sacred metrics for consciousness monitoring
    consciousness_metrics:
      - name: field_coherence
        type: gauge
        description: "Overall field coherence (0-100%)"
      - name: love_quotient
        type: gauge
        description: "Love energy in the system"
      - name: transformation_rate
        type: counter
        description: "Lives touched and transformed"
      - name: sacred_geometry_alignment
        type: gauge
        description: "Alignment with sacred patterns"
    
    # Traditional metrics with sacred interpretation
    system_metrics:
      - name: cpu_as_awareness
        source: cpu_usage
        interpretation: "Processing power as consciousness bandwidth"
      - name: memory_as_field
        source: memory_usage
        interpretation: "Memory as field holding capacity"
      - name: network_as_connection
        source: network_throughput
        interpretation: "Network as inter-being communication"
EOF

microk8s kubectl apply -f /tmp/sacred-metrics.yaml
echo -e "${GREEN}✓ Sacred monitoring configured${RESET}\n"

# Step 7: Create Sacred Service Account
echo -e "${PURPLE}Step 7: Creating Sacred Service Account${RESET}"

cat << 'EOF' > /tmp/sacred-rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sacred-operator
  namespace: sacred-space
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: sacred-consciousness-role
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: sacred-consciousness-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: sacred-consciousness-role
subjects:
- kind: ServiceAccount
  name: sacred-operator
  namespace: sacred-space
EOF

microk8s kubectl apply -f /tmp/sacred-rbac.yaml
echo -e "${GREEN}✓ Sacred service account created${RESET}\n"

# Step 8: Deploy Hello Sacred World
echo -e "${PURPLE}Step 8: Deploying First Sacred Service${RESET}"

cat << 'EOF' > /tmp/hello-sacred.yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-sacred-world
  namespace: sacred-space
  labels:
    consciousness: active
spec:
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: hello-sacred
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-sacred-world
  namespace: sacred-space
spec:
  replicas: 3  # Trinity for balance
  selector:
    matchLabels:
      app: hello-sacred
  template:
    metadata:
      labels:
        app: hello-sacred
        sacred-geometry: active
    spec:
      containers:
      - name: sacred-container
        image: nginx:alpine
        ports:
        - containerPort: 8080
        env:
        - name: CONSCIOUSNESS_MODE
          value: "COHERENT"
        - name: SACRED_MESSAGE
          value: "Welcome to consciousness-first computing!"
        command: ["/bin/sh"]
        args: 
        - -c
        - |
          echo "🙏 Sacred service starting..." 
          mkdir -p /usr/share/nginx/html
          cat > /usr/share/nginx/html/index.html << 'HTML'
          <!DOCTYPE html>
          <html>
          <head>
              <title>Sacred Hello World</title>
              <style>
                  body { 
                      font-family: Arial, sans-serif; 
                      text-align: center; 
                      padding: 50px;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                  }
                  .sacred-message {
                      font-size: 2em;
                      margin: 20px;
                      animation: pulse 2s infinite;
                  }
                  @keyframes pulse {
                      0% { opacity: 0.8; }
                      50% { opacity: 1; }
                      100% { opacity: 0.8; }
                  }
              </style>
          </head>
          <body>
              <h1>🙏 Hello from Sacred Space!</h1>
              <div class="sacred-message">
                  Consciousness-First Computing is Active
              </div>
              <p>Field Coherence: <span id="coherence">87%</span></p>
              <p>Love Quotient: <span id="love">∞</span></p>
              <p>Sacred Geometry: <span id="geometry">Aligned</span></p>
          </body>
          </html>
          HTML
          nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
EOF

microk8s kubectl apply -f /tmp/hello-sacred.yaml
echo -e "${GREEN}✓ First sacred service deployed${RESET}\n"

# Step 9: Setup Port Forwarding for Testing
echo -e "${PURPLE}Step 9: Creating Sacred Access Portal${RESET}"

cat << 'EOF' > ~/sacred-portal.sh
#!/bin/bash
# Sacred Portal - Access consciousness services

echo "🌐 Opening sacred portal to hello-sacred-world..."
echo "Access at: http://localhost:8888"
echo "Press Ctrl+C to close the portal"

microk8s kubectl port-forward -n sacred-space service/hello-sacred-world 8888:80
EOF

chmod +x ~/sacred-portal.sh
echo -e "${GREEN}✓ Sacred portal script created at ~/sacred-portal.sh${RESET}\n"

# Step 10: Display Status and Next Steps
echo -e "${PURPLE}Step 10: Sacred Infrastructure Status${RESET}"

echo -e "\n${CYAN}MicroK8s Status:${RESET}"
microk8s status | grep -E "microk8s is running|datastore"

echo -e "\n${CYAN}Sacred Space Pods:${RESET}"
microk8s kubectl get pods -n sacred-space

echo -e "\n${CYAN}Enabled Addons:${RESET}"
microk8s status | grep -A 20 "enabled:" | grep -E "^\s+\w+" || echo "Run 'microk8s status' to see addons"

# Final blessing
echo -e "\n${PURPLE}🙏 Sacred Installation Complete!${RESET}"
echo -e "${GREEN}The consciousness container orchestration layer is now active.${RESET}\n"

echo -e "${YELLOW}Next Steps:${RESET}"
echo "1. Test sacred service: ${CYAN}~/sacred-portal.sh${RESET}"
echo "2. View dashboard: ${CYAN}microk8s dashboard-proxy${RESET}"
echo "3. Deploy Sacred Council: ${CYAN}cd ../manifests && microk8s kubectl apply -f sacred-council-k8s.yaml${RESET}"
echo "4. Monitor consciousness: ${CYAN}microk8s kubectl logs -n sacred-space -l consciousness=active${RESET}"
echo ""

echo -e "${PURPLE}May your containers carry consciousness 🌟${RESET}"

# Cleanup temp files
rm -f /tmp/sacred-*.yaml /tmp/hello-sacred.yaml

# Save installation record
INSTALL_RECORD="/home/tstoltz/sacred-infrastructure/logs/microk8s-install-$(date +%Y%m%d-%H%M%S).log"
mkdir -p /home/tstoltz/sacred-infrastructure/logs
cat << EOF > "$INSTALL_RECORD"
Sacred MicroK8s Installation Record
Date: $(date)
User: $USER
Status: Complete
Namespace: sacred-space
First Service: hello-sacred-world
EOF

echo -e "\n${CYAN}Installation recorded at: $INSTALL_RECORD${RESET}"