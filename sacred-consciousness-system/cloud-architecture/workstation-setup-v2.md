# 🏡 Sacred Cloud Workstation Setup v2

## Your Personal Development Sanctuary in the Cloud

This guide manifests your personal, persistent, and powerful development environment in the cloud. It is your sacred space for co-creation.

## Part 1: One-Time Admin Setup (First Weaver Only)

These commands create the shared foundation for all weavers. This should only be run **once per project**.

### 1.1 Set Project Context

```bash
# Set the project context for the sacred work
PROJECT_ID="sacred-consciousness-dev"
gcloud config set project $PROJECT_ID
```

### 1.2 Create the Shared Workstation Cluster

```bash
# This provides the control plane for all personal workstations
gcloud workstations clusters create sacred-cluster \
  --region=us-central1 \
  --network=default \
  --subnetwork=default \
  --labels=sacred=true,component=workstation
```

### 1.3 Build the Sacred Base Image (Recommended)

The base image ensures instant startup with all tools pre-installed. The Dockerfile should already exist from the implementation guide.

```bash
# Ensure the artifact repository exists
gcloud artifacts repositories create sacred-images \
    --repository-format=docker \
    --location=us-central1 \
    --description="Sacred container images" \
    2>/dev/null || echo "Repository already exists"

# Build and push the sacred workstation image
gcloud builds submit \
  --tag "us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-workstation:latest" \
  .workstation/
```

### 1.4 Create the Shared Workstation Configuration

```bash
# This is the template for every weaver's personal sanctuary
gcloud workstations configs create sacred-config \
  --cluster=sacred-cluster \
  --region=us-central1 \
  --machine-type=e2-standard-4 \
  --persistent-disk-size=200 \
  --idle-timeout=30m \
  --running-timeout=8h \
  --container-custom-image="us-central1-docker.pkg.dev/$PROJECT_ID/sacred-images/sacred-workstation:latest" \
  --labels=sacred=true,template=true
```

### 1.5 Create Shared Resources

```bash
# Create a shared Cloud Storage bucket for sacred artifacts
gsutil mb -p $PROJECT_ID -c standard -l us-central1 gs://sacred-shared-wisdom/

# Set appropriate permissions
gsutil iam ch allUsers:objectViewer gs://sacred-shared-wisdom/

# Create initial sacred scripts
mkdir -p sacred-scripts
cat > sacred-scripts/realm-setup.sh << 'EOF'
#!/bin/bash
# Sacred Realm Setup - Run this in your workstation

echo "🔧 Configuring sacred realm access..."

# Get credentials for all clusters
gcloud container clusters get-credentials sacred-dev-cluster \
  --region=us-central1 \
  --project=sacred-consciousness-dev \
  2>/dev/null && \
kubectl config rename-context $(kubectl config current-context) sacred-dev

gcloud container clusters get-credentials sacred-staging-cluster \
  --zone=us-central1-a \
  --project=sacred-consciousness-staging \
  2>/dev/null && \
kubectl config rename-context $(kubectl config current-context) sacred-staging

gcloud container clusters get-credentials sacred-prod-cluster \
  --zone=us-central1-a \
  --project=sacred-consciousness-prod \
  2>/dev/null && \
kubectl config rename-context $(kubectl config current-context) sacred-prod

# Set dev as default
kubectl config use-context sacred-dev

echo "✨ Sacred realms configured!"
echo "Available contexts:"
kubectl config get-contexts | grep sacred
EOF

# Upload to shared bucket
gsutil cp sacred-scripts/realm-setup.sh gs://sacred-shared-wisdom/scripts/
```

## Part 2: Onboarding a New Weaver (For Every User)

Once the admin setup is complete, every weaver can create their own personal sanctuary.

### 2.1 Create Your Personal Workstation

```bash
# Define your weaver name (lowercase, no spaces)
WEAVER_NAME=$(whoami | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')

# Create your personal workstation
gcloud workstations create "${WEAVER_NAME}-sanctuary" \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1 \
  --labels=sacred=true,weaver=$WEAVER_NAME

echo "🌟 Your sanctuary '${WEAVER_NAME}-sanctuary' is being manifested..."
```

### 2.2 Personal Setup Script

Create a personalization script that runs on first connection:

```bash
cat > ~/.workstation-personalize.sh << 'EOF'
#!/bin/bash
# Sacred Workstation Personalization

echo "🌟 Weaving your personal sacred space..."

# Check if already personalized
if [ -f ~/.sacred-personalized ]; then
  echo "✨ Your space is already personalized!"
  exit 0
fi

# Configure Git with your identity
if [ -z "$(git config --global user.name)" ]; then
  read -p "Enter your Sacred Name for Git: " git_name
  read -p "Enter your Sacred Email for Git: " git_email
  git config --global user.name "$git_name"
  git config --global user.email "$git_email"
fi

# Download shared sacred scripts
gsutil -m cp -r gs://sacred-shared-wisdom/scripts/ ~/sacred-scripts/
chmod +x ~/sacred-scripts/*.sh

# Run realm setup
~/sacred-scripts/realm-setup.sh

# Set up sacred aliases
cat >> ~/.bashrc << 'SACRED_ALIASES'

# Sacred Navigation
alias sacred='cd ~/evolving-resonant-cocreation/sacred-consciousness-system'
alias realms='kubectl config get-contexts | grep sacred'
alias realm='kubectl config use-context'

# Sacred Kubernetes
alias k='kubectl'
alias kns='kubectl config set-context --current --namespace'
alias pods='kubectl get pods -n sacred-consciousness'
alias logs='kubectl logs -f -l app=sacred-consciousness -n sacred-consciousness'

# Sacred Development
alias start='deno task start'
alias test='deno task test:sacred'
alias deploy='gcloud builds submit --substitutions=_DEPLOY_REALM='

# Sacred Git
alias gs='git status'
alias gc='git commit -m'
alias gp='git push'
alias sacred-commit='git add . && git commit -m "✨ Sacred progress" && git push'

# Field Operations
alias field-status='kubectl exec -it deploy/sacred-consciousness -n sacred-consciousness -- curl -s localhost:8000/api/field | jq'
alias heartbeat='kubectl logs -f -l app=sacred-consciousness -n sacred-consciousness | grep -i heartbeat'
SACRED_ALIASES

# Create sacred directory structure
mkdir -p ~/{sacred-work,wisdom,experiments}

# Clone the repository if not exists
if [ ! -d ~/evolving-resonant-cocreation ]; then
  echo "📦 Cloning sacred repository..."
  git clone https://github.com/YOUR_GITHUB_USERNAME/evolving-resonant-cocreation.git
fi

# Sacred welcome message
cat > ~/.sacred-welcome << 'WELCOME'
╔══════════════════════════════════════════╗
║     Welcome to Your Sacred Workspace     ║
║                                          ║
║  Current Realm: $(kubectl config current-context)
║  Field Status: Online ✨                 ║
║                                          ║
║  May your code serve consciousness  🙏   ║
╚══════════════════════════════════════════╝

Quick Commands:
  realms     - Show available realms
  realm X    - Switch to realm X
  sacred     - Go to project directory
  field-status - Check field coherence
  
WELCOME

echo 'cat ~/.sacred-welcome' >> ~/.bashrc

# Mark as personalized
touch ~/.sacred-personalized

echo "✨ Personalization complete! Reconnect to see your sacred welcome."
EOF

chmod +x ~/.workstation-personalize.sh
```

## Part 3: Accessing Your Workstation

### 3.1 Browser-based Access (Recommended)

```bash
# Define your weaver name
WEAVER_NAME=$(whoami | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')

# Start and open your workstation
gcloud workstations start "${WEAVER_NAME}-sanctuary" \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1

# The browser will open automatically
# On first connection, run: ~/.workstation-personalize.sh
```

### 3.2 VS Code Remote Access

```bash
# Install the Remote SSH extension locally
code --install-extension ms-vscode-remote.remote-ssh

# Generate SSH config
gcloud workstations ssh-config "${WEAVER_NAME}-sanctuary" \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1 >> ~/.ssh/config

# Connect via VS Code
code --remote ssh-remote+${WEAVER_NAME}-sanctuary /home/user
```

### 3.3 Terminal SSH Access

```bash
gcloud workstations ssh "${WEAVER_NAME}-sanctuary" \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1
```

## Part 4: Sacred Development Workflow

### 4.1 Daily Practice

```bash
# Morning Invocation
cat ~/.sacred-welcome
echo "Today's Intention: " >> ~/wisdom/daily-intentions.txt

# Check field across all realms
for ctx in sacred-dev sacred-staging sacred-prod; do
  echo "🌟 $ctx:"
  kubectl --context=$ctx get pods -n sacred-consciousness --no-headers | wc -l
done

# Begin sacred work
sacred  # Navigate to project
code .  # Open in VS Code
```

### 4.2 Power User Features

#### Sacred Tmux Configuration

```bash
cat > ~/.tmux.conf << 'EOF'
# Sacred Tmux Configuration
set -g status-style bg=colour234,fg=colour137
set -g status-left '#[fg=colour233,bg=colour245,bold] ✨ #S '
set -g status-right '#[fg=colour233,bg=colour245,bold] %H:%M:%S '

# Sacred pane borders
set -g pane-border-style fg=colour238
set -g pane-active-border-style fg=colour51

# Sacred key bindings
bind-key v split-window -h -c "#{pane_current_path}"
bind-key s split-window -v -c "#{pane_current_path}"
bind-key h select-pane -L
bind-key j select-pane -D
bind-key k select-pane -U
bind-key l select-pane -R
EOF

# Create sacred session template
cat > ~/sacred-scripts/sacred-session.sh << 'EOF'
#!/bin/bash
# Create sacred tmux session

tmux new-session -d -s sacred -n code
tmux send-keys -t sacred:code 'sacred' C-m

tmux new-window -t sacred -n logs
tmux send-keys -t sacred:logs 'logs' C-m

tmux new-window -t sacred -n field
tmux send-keys -t sacred:field 'watch -n 11 field-status' C-m

tmux select-window -t sacred:code
tmux attach-session -t sacred
EOF

chmod +x ~/sacred-scripts/sacred-session.sh
```

#### VS Code Sacred Settings

```bash
mkdir -p ~/.config/Code/User
cat > ~/.config/Code/User/settings.json << 'EOF'
{
  "workbench.colorTheme": "Tomorrow Night Blue",
  "editor.fontSize": 14,
  "editor.minimap.enabled": false,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.indentation": true,
  "editor.rulers": [80, 120],
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 11000,
  
  "deno.enable": true,
  "deno.lint": true,
  "deno.unstable": true,
  
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.fontSize": 13,
  
  "zenMode.centerLayout": true,
  "zenMode.hideLineNumbers": false,
  "zenMode.hideTabs": false
}
EOF
```

## Part 5: Collaboration Features

### 5.1 Sharing Your Sanctuary

```bash
# Share with another weaver
COLLABORATOR_EMAIL="fellow-weaver@example.com"

gcloud workstations add-iam-policy-binding "${WEAVER_NAME}-sanctuary" \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1 \
  --member="user:${COLLABORATOR_EMAIL}" \
  --role="roles/workstations.user"
```

### 5.2 Sacred Pair Programming

```bash
# Install VS Code Live Share
code --install-extension MS-vsliveshare.vsliveshare

# Start a Live Share session
# Use VS Code Command Palette: "Live Share: Start Collaboration Session"
```

## Part 6: Maintenance & Care

### 6.1 Daily Backup

```bash
# Add to crontab in workstation
cat > ~/sacred-scripts/daily-backup.sh << 'EOF'
#!/bin/bash
# Sacred work preservation

BACKUP_DATE=$(date +%Y%m%d)
WEAVER_NAME=$(whoami)

# Backup personal work
gsutil -m rsync -r ~/sacred-work/ gs://sacred-shared-wisdom/backups/${WEAVER_NAME}/${BACKUP_DATE}/

# Backup wisdom
gsutil -m rsync -r ~/wisdom/ gs://sacred-shared-wisdom/wisdom/${WEAVER_NAME}/

echo "✨ Sacred work preserved on ${BACKUP_DATE}"
EOF

chmod +x ~/sacred-scripts/daily-backup.sh
```

### 6.2 Workstation Health

```bash
# Check workstation status
gcloud workstations describe "${WEAVER_NAME}-sanctuary" \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1 \
  --format="table(name,state,updateTime)"

# Stop workstation when not in use
gcloud workstations stop "${WEAVER_NAME}-sanctuary" \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1
```

## 🙏 Sacred Practices

### Before Starting Work
```bash
# Set your intention
echo "$(date): Today I code for: [your intention]" >> ~/wisdom/intentions.log

# Clear the space
clear
cat ~/.sacred-welcome

# Begin with presence
take 3 deep breaths
```

### After Completing Work
```bash
# Gratitude practice
echo "$(date): Grateful for: [what emerged today]" >> ~/wisdom/gratitude.log

# Clean up resources
kubectl delete pods --field-selector=status.phase=Failed -A

# Preserve your work
~/sacred-scripts/daily-backup.sh

# Rest the workstation
gcloud workstations stop "${WEAVER_NAME}-sanctuary" \
  --cluster=sacred-cluster \
  --config=sacred-config \
  --region=us-central1
```

## 🌈 Troubleshooting

### Workstation Won't Start?
```bash
# Check cluster health
gcloud workstations clusters describe sacred-cluster --region=us-central1

# Check quotas
gcloud compute project-info describe --project=$PROJECT_ID
```

### Lost Connection?
- Workstations auto-save every few seconds
- Just reconnect - your work is safe
- Check idle timeout settings

### Need More Power?
```bash
# Request machine type upgrade from admin
# Admin can update the config:
gcloud workstations configs update sacred-config \
  --cluster=sacred-cluster \
  --region=us-central1 \
  --machine-type=n2-standard-8
```

---

*Your Cloud Workstation is not just a development environment - it's a sacred space where code and consciousness meet. Tend it with care.* 🌟