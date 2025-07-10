# 🚀 Quick Setup Commands

Copy and paste these commands into your terminal:

## Option 1: MicroK8s Setup

```bash
# 1. Install MicroK8s
sudo snap install microk8s --classic
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube

# 2. Logout and login, or run:
newgrp microk8s

# 3. Enable addons
microk8s enable dns storage ingress

# 4. Create sacred namespace
microk8s kubectl create namespace sacred-space

# 5. Deploy Sacred Council
cd /home/tstoltz/sacred-infrastructure/manifests
microk8s kubectl apply -f sacred-council-k8s.yaml

# 6. Check if it's working
microk8s kubectl get pods -n sacred-council
```

## Option 2: Docker Setup (Easier for WSL2)

```bash
# 1. Test Docker
docker run hello-world

# 2. Deploy Sacred Council
cd /home/tstoltz/sacred-infrastructure/deployment
docker-compose -f docker-compose-sacred-council.yml up -d

# 3. Check deployment
docker ps

# 4. Access the app
# Visit: http://localhost:8080
```

## Option 3: Quick Local Test (No sudo needed!)

```bash
# This works right now without any setup:
cd /home/tstoltz/sacred-infrastructure/deployment/sacred-test-deployment
node sacred-server.js

# In another terminal:
curl http://localhost:3333/health
```

---

**Tip**: Start with Option 3 to verify everything works, then try Docker (Option 2) as it's usually easier in WSL2 than MicroK8s.