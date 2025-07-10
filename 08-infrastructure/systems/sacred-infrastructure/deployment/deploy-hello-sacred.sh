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
