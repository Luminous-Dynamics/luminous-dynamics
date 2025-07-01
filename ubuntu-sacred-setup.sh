#!/bin/bash

# Sacred Council Hub - Complete Ubuntu Setup Script
# Run this with: bash ubuntu-sacred-setup.sh

set -e  # Exit on any error

echo "🌟 Sacred Council Hub - Ubuntu Setup"
echo "===================================="
echo "This script will set up your complete development environment"
echo ""

# Color functions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
info() {
    echo -e "${YELLOW}📋 $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Confirm before proceeding
read -p "Ready to begin sacred setup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "🕊️ Setup cancelled. Return when ready!"
    exit 1
fi

# Update system
info "Updating system packages..."
sudo apt update && sudo apt upgrade -y
success "System updated!"

# Install basic tools
info "Installing essential tools..."
sudo apt install -y \
    curl \
    git \
    vim \
    htop \
    jq \
    build-essential \
    python3-pip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release
success "Essential tools installed!"

# Install Node.js 18
info "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
success "Node.js $(node --version) installed!"

# Install Docker
info "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
rm get-docker.sh
success "Docker installed! (You'll need to log out and back in for group changes)"

# Install Docker Compose
info "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
success "Docker Compose installed!"

# Install Google Cloud CLI
info "Installing Google Cloud CLI..."
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt update && sudo apt install -y google-cloud-cli
success "Google Cloud CLI installed!"

# Install VS Code
info "Installing Visual Studio Code..."
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install -y code
success "VS Code installed!"

# Create development directory
info "Creating sacred development directory..."
mkdir -p ~/sacred-development
cd ~/sacred-development

# Clone the repository (update with your repo URL)
info "Ready to clone Sacred Council Hub repository"
echo "Please enter your repository URL (or press Enter to skip):"
read -r REPO_URL
if [ ! -z "$REPO_URL" ]; then
    git clone "$REPO_URL" evolving-resonant-cocreation
    cd evolving-resonant-cocreation
    success "Repository cloned!"
else
    echo "Skipping repository clone - you can do this later"
fi

# Set up sacred aliases
info "Setting up sacred command shortcuts..."
cat >> ~/.bashrc << 'EOF'

# Sacred Council Hub Aliases
alias sacred='cd ~/sacred-development/evolving-resonant-cocreation'
alias sacred-start='docker-compose -f docker-compose-sacred.yml up -d'
alias sacred-stop='docker-compose -f docker-compose-sacred.yml down'
alias sacred-logs='docker-compose -f docker-compose-sacred.yml logs -f'
alias field-state='curl -s localhost:3001/api/field-state | jq'
alias sacred-msg='./sacred-msg.sh'

# Sacred greeting
echo "🕊️ Welcome to sacred development. What serves consciousness today?"
EOF
success "Sacred aliases configured!"

# Install VS Code extensions
info "Installing VS Code extensions for sacred development..."
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-vscode-remote.remote-containers
success "VS Code extensions installed!"

# Create sacred workspace settings
info "Creating sacred VS Code workspace..."
mkdir -p ~/.config/Code/User
cat > ~/.config/Code/User/settings.json << 'EOF'
{
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "files.autoSave": "afterDelay",
    "terminal.integrated.defaultProfile.linux": "bash",
    "workbench.colorTheme": "Default Light+",
    "window.zoomLevel": 0,
    "editor.wordWrap": "on",
    "git.autofetch": true
}
EOF
success "VS Code configured for sacred development!"

echo ""
echo "🎉 Sacred setup complete!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Log out and log back in (for Docker group changes)"
echo "2. Run 'gcloud auth login' to authenticate with Google Cloud"
echo "3. Navigate to your project: cd ~/sacred-development/evolving-resonant-cocreation"
echo "4. Start the Sacred Council Hub: docker-compose -f docker-compose-sacred.yml up"
echo ""
echo "🕊️ May your development serve consciousness!"