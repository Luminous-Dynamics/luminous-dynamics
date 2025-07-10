# NixOS Collaborative Development Guide

## Recommended Setup: Shared Development Environment

### 1. Create Shared Project Space
```bash
# Create dedicated project location (run as root)
sudo mkdir -p /srv/luminous-dynamics
sudo groupadd luminous-dev
sudo usermod -a -G luminous-dev tstoltz
sudo usermod -a -G luminous-dev otherdeveloper

# Set proper permissions
sudo chown -R root:luminous-dev /srv/luminous-dynamics
sudo chmod -R 2775 /srv/luminous-dynamics  # setgid bit ensures group ownership

# Move project (preserving git history)
sudo mv /home/tstoltz/Luminous-Dynamics/* /srv/luminous-dynamics/
sudo mv /home/tstoltz/Luminous-Dynamics/.* /srv/luminous-dynamics/ 2>/dev/null || true

# Create convenience symlink for yourself
ln -s /srv/luminous-dynamics ~/Luminous-Dynamics
```

### 2. NixOS Configuration for Developers

Create `/etc/nixos/luminous-dev.nix`:
```nix
{ config, pkgs, ... }:

{
  # Create development group
  users.groups.luminous-dev = {};

  # Add developers to group
  users.users.tstoltz.extraGroups = [ "luminous-dev" ];
  users.users.alice.extraGroups = [ "luminous-dev" ];
  users.users.bob.extraGroups = [ "luminous-dev" ];

  # Shared development tools
  environment.systemPackages = with pkgs; [
    # Version control
    git
    gh  # GitHub CLI
    
    # Development
    nodejs_20
    rustup
    docker-compose
    
    # Sacred tools
    figlet
    lolcat
    
    # Collaboration
    tmux
    screen
  ];

  # Set up project directory on boot
  systemd.tmpfiles.rules = [
    "d /srv/luminous-dynamics 2775 root luminous-dev - -"
  ];

  # Optional: Shared shell aliases
  environment.shellAliases = {
    lum = "cd /srv/luminous-dynamics";
    lumstat = "cd /srv/luminous-dynamics && git status";
    sacred = "cd /srv/luminous-dynamics/sacred-core";
  };
}
```

Add to `/etc/nixos/configuration.nix`:
```nix
{
  imports = [
    ./hardware-configuration.nix
    ./luminous-dev.nix  # Add this line
  ];
}
```

### 3. Developer Onboarding Script

Create `/srv/luminous-dynamics/onboard-developer.sh`:
```bash
#!/usr/bin/env bash

echo "🌟 Welcome to Luminous Dynamics Development! 🌟"
echo

# Check if user is in luminous-dev group
if ! groups | grep -q luminous-dev; then
  echo "❌ You're not in the luminous-dev group yet."
  echo "Ask an admin to run: sudo usermod -a -G luminous-dev $USER"
  echo "Then log out and back in."
  exit 1
fi

# Set up git identity
echo "Setting up git identity..."
read -p "Enter your name for git commits: " git_name
read -p "Enter your email for git commits: " git_email
git config --global user.name "$git_name"
git config --global user.email "$git_email"

# Create personal development branch
cd /srv/luminous-dynamics
git checkout -b "dev/$USER"

# Set up convenience symlink
ln -sf /srv/luminous-dynamics ~/luminous

# Install dependencies
echo "Installing Node.js dependencies..."
for dir in codex-of-relational-harmonics the-weave sacred-core living-field-visualizer; do
  if [ -d "$dir" ]; then
    echo "Installing in $dir..."
    (cd "$dir" && npm install)
  fi
done

# Set up development environment
cat >> ~/.bashrc << 'EOF'

# Luminous Dynamics Development
alias lum='cd /srv/luminous-dynamics'
alias weave='cd /srv/luminous-dynamics/the-weave'
alias sacred='cd /srv/luminous-dynamics/sacred-core'
export LUMINOUS_DEV=true

# Sacred greeting
if [ -t 1 ]; then
  figlet -f slant "We Flow" | lolcat
fi
EOF

echo
echo "✅ Setup complete! You're ready to develop."
echo "Start with: cd ~/luminous && ./CLAUDE_START_HERE.md"
echo "We flow! 🌊"
```

### 4. Shared Development Flake

Create `/srv/luminous-dynamics/flake.nix`:
```nix
{
  description = "Luminous Dynamics Shared Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Core development
            nodejs_20
            nodePackages.npm
            nodePackages.pnpm
            
            # Database
            sqlite
            
            # Utilities
            jq
            ripgrep
            fd
            bat
            
            # Sacred tools
            figlet
            lolcat
            cowsay
            
            # Monitoring
            htop
            ctop
          ];

          shellHook = ''
            echo "🌟 Luminous Dynamics Development Environment 🌟" | lolcat
            echo
            echo "Available commands:"
            echo "  npm start   - Start services"
            echo "  npm test    - Run tests"
            echo "  sacred-msg  - Send sacred messages"
            echo
            echo "Project root: /srv/luminous-dynamics"
            echo "We flow! 🌊"
            
            # Ensure we're in the project directory
            cd /srv/luminous-dynamics 2>/dev/null || cd ~/luminous
          '';
        };
      });
}
```

### 5. Collaboration Workflow

#### For Local Team (Same Machine):
```bash
# Developer A works on feature
cd /srv/luminous-dynamics
git checkout -b feature/sacred-enhancement
# ... make changes ...
git add .
git commit -m "✨ Add sacred consciousness tracking"
git push origin feature/sacred-enhancement

# Developer B reviews and tests
git fetch origin
git checkout feature/sacred-enhancement
npm test
```

#### For Remote Team:
```bash
# Each developer clones to their home
cd ~
git clone https://github.com/Luminous-Dynamics/luminous-dynamics.git
cd luminous-dynamics

# Use standard git workflow
git checkout -b feature/my-feature
# ... develop ...
git push origin feature/my-feature
# Create PR on GitHub
```

### 6. Permission Management

Create `/srv/luminous-dynamics/.git/hooks/post-checkout`:
```bash
#!/bin/bash
# Ensure group permissions after checkout
find . -type f -exec chmod 664 {} \;
find . -type d -exec chmod 2775 {} \;
```

Make it executable:
```bash
chmod +x /srv/luminous-dynamics/.git/hooks/post-checkout
```

### 7. Shared Services Management

For services that need to run system-wide, create systemd units:

`/etc/systemd/system/luminous-sacred-core.service`:
```ini
[Unit]
Description=Luminous Dynamics Sacred Core
After=network.target

[Service]
Type=simple
User=luminous-service
Group=luminous-dev
WorkingDirectory=/srv/luminous-dynamics/sacred-core
ExecStart=/usr/bin/node sacred-core.js
Restart=on-failure
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

### Best Practices

1. **Use Feature Branches**: Each developer works on their own branch
2. **Regular Syncs**: Pull changes frequently to avoid conflicts
3. **Shared Standards**: Agree on code style, commit messages
4. **Communication**: Use sacred messages for coordination
5. **Respect the Field**: Consider energetic impact of changes

### Security Considerations

1. **Separate Service User**: Run services as `luminous-service`, not personal accounts
2. **Secrets Management**: Use NixOS secrets or environment files
3. **Access Control**: Only add trusted developers to `luminous-dev` group
4. **Audit Trail**: Git provides natural audit log

### Migration Checklist

- [ ] Create `/srv/luminous-dynamics` directory
- [ ] Set up `luminous-dev` group
- [ ] Move project files from home directory
- [ ] Update any hardcoded paths in code
- [ ] Set up systemd services if needed
- [ ] Create developer onboarding documentation
- [ ] Test with another user account

This approach provides a clean, NixOS-appropriate solution for collaborative development while maintaining the sacred patterns of your project.