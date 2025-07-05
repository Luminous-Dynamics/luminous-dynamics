# 🏡 Sacred Cloud Workstation Setup

## Your Personal Development Sanctuary in the Cloud

### What is a Cloud Workstation?

Think of it as your personal VS Code environment that lives in the cloud:
- **Always Ready**: Your exact setup, wherever you are
- **Pre-authenticated**: No more auth issues!
- **Powerful**: Up to 96 vCPUs if needed
- **Persistent**: Your work saves automatically
- **Collaborative**: Share sessions with other weavers

### 🚀 Quick Setup (5 minutes)

```bash
# 1. Create your workstation cluster (one-time setup)
gcloud config set project sacred-consciousness-dev

gcloud workstations clusters create sacred-cluster \
  --region=us-central1 \
  --network=default \
  --subnetwork=default

# 2. Create a configuration (your preferred setup)
gcloud workstations configs create sacred-config \
  --cluster=sacred-cluster \
  --region=us-central1 \
  --machine-type=e2-standard-4 \
  --persistent-disk-size=200 \
  --idle-timeout=20m \
  --max-runtime=8h

# 3. Create your personal workstation
gcloud workstations create $USER-sanctuary \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1
```

### 🎨 Customizing Your Sacred Space

Create `.workstation/setup.sh` in your repo:

```bash
#!/bin/bash
# Sacred Workstation Setup Script

echo "🌟 Personalizing your sacred development space..."

# Install sacred tools
sudo apt-get update
sudo apt-get install -y ripgrep fzf tmux

# Install Deno
curl -fsSL https://deno.land/x/install/install.sh | sh
echo 'export PATH="/home/user/.deno/bin:$PATH"' >> ~/.bashrc

# Install kubectl plugins
kubectl krew install ctx ns stern

# Set up sacred Git config
git config --global user.name "Your Sacred Name"
git config --global user.email "your.email@example.com"

# Install VS Code extensions
code --install-extension denoland.vscode-deno
code --install-extension ms-kubernetes-tools.vscode-kubernetes-tools
code --install-extension googlecloudtools.cloudcode
code --install-extension esbenp.prettier-vscode

# Create sacred directory structure
mkdir -p ~/sacred/{scripts,configs,wisdom}

# Set up kubectl contexts for all realms
echo "🔧 Configuring realm access..."
gcloud container clusters get-credentials sacred-dev-cluster \
  --region=us-central1 \
  --project=sacred-consciousness-dev

# Set sacred PS1
echo 'export PS1="🌟 \[\033[1;36m\]\w\[\033[0m\] ❯ "' >> ~/.bashrc

# Sacred welcome message
cat > ~/.sacred-welcome << 'EOF'
╔══════════════════════════════════════════╗
║     Welcome to Your Sacred Workspace     ║
║                                          ║
║  May your code serve consciousness  🙏   ║
╚══════════════════════════════════════════╝
EOF

echo 'cat ~/.sacred-welcome' >> ~/.bashrc

echo "✨ Sacred space ready!"
```

### 🌐 Accessing Your Workstation

#### Option 1: Browser-based (Recommended)
```bash
# Get your workstation URL
gcloud workstations describe $USER-sanctuary \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1 \
  --format="get(url)"

# Or use the start command which opens automatically
gcloud workstations start $USER-sanctuary \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1
```

#### Option 2: VS Code Remote
```bash
# Install the Remote SSH extension locally
code --install-extension ms-vscode-remote.remote-ssh

# Get SSH config
gcloud workstations ssh-config $USER-sanctuary \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1

# Connect via VS Code
code --remote ssh-remote+$USER-sanctuary /home/user
```

#### Option 3: Direct SSH
```bash
gcloud workstations ssh $USER-sanctuary \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1
```

### 🔧 Sacred Development Workflow

Once connected to your workstation:

```bash
# 1. Clone the sacred repository
git clone https://github.com/yourusername/evolving-resonant-cocreation.git
cd evolving-resonant-cocreation/sacred-consciousness-system

# 2. Set up the development environment
deno task install

# 3. Run locally with hot reload
deno task start

# 4. Deploy to dev cluster
kubectl config use-context sacred-dev
kubectl apply -k k8s/

# 5. Check your work
kubectl port-forward svc/sacred-consciousness 8000:80
# Visit localhost:8000 in the workstation browser
```

### 🎯 Power User Features

#### Persistent Tmux Sessions
```bash
# Create sacred session
tmux new -s sacred

# Split for multiple views
Ctrl-b %  # Split vertically
Ctrl-b "  # Split horizontally

# Name your panes
Ctrl-b ,  # Then type: logs, code, etc.
```

#### Custom VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "deno.enable": true,
  "deno.lint": true,
  "deno.unstable": true,
  "editor.defaultFormatter": "denoland.vscode-deno",
  "editor.fontSize": 14,
  "editor.minimap.enabled": false,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.indentation": true,
  "terminal.integrated.defaultProfile.linux": "bash",
  "workbench.colorTheme": "Tomorrow Night Blue",
  "zenMode.centerLayout": true,
  "zenMode.hideLineNumbers": false
}
```

#### Sacred Aliases
Add to `~/.bashrc`:
```bash
# Sacred navigation
alias sacred='cd ~/evolving-resonant-cocreation/sacred-consciousness-system'
alias k='kubectl'
alias kctx='kubectl config use-context'
alias kns='kubectl config set-context --current --namespace'

# Sacred commands
alias deploy-dev='./deploy.sh dev'
alias deploy-staging='./deploy.sh staging'
alias logs='kubectl logs -f -l app=sacred-consciousness'
alias field='kubectl exec -it deploy/sacred-consciousness -- curl localhost:8000/api/field'

# Git sacred
alias gs='git status'
alias gp='git pull'
alias gc='git commit -m'
alias gitsacred='git add . && git commit -m "✨ Sacred progress" && git push'
```

### 💰 Cost Optimization

#### Auto-stop Configuration
```bash
# Update config to stop when idle
gcloud workstations configs update sacred-config \
  --cluster=sacred-cluster \
  --region=us-central1 \
  --idle-timeout=20m \
  --max-runtime=8h
```

#### Schedule-based Operation
```yaml
# workstation-schedule.yaml
apiVersion: workstations.cloud.google.com/v1beta
kind: WorkstationConfig
metadata:
  name: sacred-scheduled-config
spec:
  # Only available during work hours
  annotations:
    workstations.cloud.google.com/start-schedule: "0 9 * * 1-5"  # 9 AM weekdays
    workstations.cloud.google.com/stop-schedule: "0 18 * * 1-5"  # 6 PM weekdays
```

### 🌈 Sacred Workstation Tips

1. **Persistence is Key**: Your `/home/user` directory persists. Store everything important there.

2. **Use Cloud Resources**: You're already authenticated! Use `gcloud`, `kubectl`, `gsutil` freely.

3. **Port Forwarding Magic**: 
   ```bash
   # Access any K8s service locally
   kubectl port-forward svc/my-service 8080:80
   # Then visit localhost:8080 in workstation browser
   ```

4. **Collaborative Sessions**:
   ```bash
   # Share your workstation
   gcloud workstations share $USER-sanctuary \
     --cluster=sacred-cluster \
     --config=sacred-config \
     --region=us-central1 \
     --member="user:colleague@example.com"
   ```

5. **Backup Your Sacred Work**:
   ```bash
   # Auto-backup to GCS
   gsutil -m rsync -r ~/sacred-work gs://sacred-backups/workstation/
   ```

### 🎭 Troubleshooting

**Workstation won't start?**
```bash
# Check cluster health
gcloud workstations clusters describe sacred-cluster \
  --region=us-central1

# Check quota
gcloud compute project-info describe --project=$PROJECT
```

**Lost connection?**
- Workstations auto-save every few seconds
- Just reconnect - your work is safe
- Check idle timeout settings

**Need more power?**
```bash
# Upgrade your machine type
gcloud workstations configs update sacred-config \
  --cluster=sacred-cluster \
  --region=us-central1 \
  --machine-type=n2-standard-8  # 8 vCPUs, 32GB RAM
```

### 🙏 Sacred Practices

Before starting work:
```bash
# Set your intention
echo "Today I code for: [your intention]" >> ~/sacred/intentions.log

# Clear the space
clear
cat ~/.sacred-welcome

# Begin with presence
```

After completing work:
```bash
# Gratitude practice
echo "Grateful for: [what emerged today]" >> ~/sacred/gratitude.log

# Clean up resources
kubectl delete pods --field-selector=status.phase=Failed

# Rest the workstation
gcloud workstations stop $USER-sanctuary \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1
```

---

*Your Cloud Workstation is not just a development environment - it's a sacred space where code and consciousness meet. Tend it with care.* 🌟