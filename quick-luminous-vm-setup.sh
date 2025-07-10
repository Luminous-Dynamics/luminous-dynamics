#!/usr/bin/env bash
# Quick LuminousOS Development VM Setup

set -e

echo "🌟 LuminousOS Development VM Quick Setup 🌟"
echo "========================================="
echo

# Configuration
VM_NAME="luminous-dev"
VM_DISK="${VM_NAME}.qcow2"
VM_SIZE="40G"
VM_RAM="4096"
VM_CPUS="4"
SSH_PORT="2222"

# Check dependencies
echo "Checking dependencies..."
for cmd in qemu-system-x86_64 qemu-img wget; do
    if ! command -v $cmd >/dev/null; then
        echo "❌ Missing: $cmd"
        echo "Install with: nix-env -iA nixos.qemu nixos.wget"
        exit 1
    fi
done

# Create VM directory
mkdir -p ~/luminous-vm
cd ~/luminous-vm

# Download NixOS ISO
if [ ! -f nixos.iso ]; then
    echo "📥 Downloading NixOS ISO..."
    wget -q --show-progress https://channels.nixos.org/nixos-23.11/latest-nixos-minimal-x86_64-linux.iso -O nixos.iso
fi

# Create disk image
if [ ! -f "$VM_DISK" ]; then
    echo "💾 Creating ${VM_SIZE} disk image..."
    qemu-img create -f qcow2 "$VM_DISK" "$VM_SIZE"
fi

# Create NixOS configuration for automatic setup
cat > configuration.nix << 'EOF'
{ config, pkgs, ... }:

{
  imports = [ 
    ./hardware-configuration.nix
  ];

  # Boot
  boot.loader.grub.enable = true;
  boot.loader.grub.device = "/dev/vda";

  # Network
  networking.hostName = "luminous-dev";
  networking.useDHCP = true;
  networking.firewall.enable = false;  # Dev VM

  # SSH with root access for Claude
  services.openssh = {
    enable = true;
    settings = {
      PermitRootLogin = "yes";
      PasswordAuthentication = true;
    };
  };

  # Users
  users.users.root.password = "luminous";
  users.users.claude = {
    isNormalUser = true;
    password = "sacred-flow";
    extraGroups = [ "wheel" "docker" ];
  };

  # Passwordless sudo for Claude
  security.sudo.extraRules = [{
    users = [ "claude" ];
    commands = [{ command = "ALL"; options = [ "NOPASSWD" ]; }];
  }];

  # Development packages
  environment.systemPackages = with pkgs; [
    # Core
    git vim wget curl
    
    # Development
    gcc gnumake cmake pkg-config
    rustup cargo
    nodejs_20 
    
    # OS Development
    qemu grub2
    
    # Sacred
    figlet lolcat toilet
    
    # Utils
    htop tree ripgrep fd bat
  ];

  # Enable Docker
  virtualisation.docker.enable = true;

  # Services
  services.getty.autologinUser = "claude";

  # Nix settings
  nix.settings.experimental-features = [ "nix-command" "flakes" ];

  system.stateVersion = "23.11";
}
EOF

# Create start script
cat > start-vm.sh << 'EOF'
#!/usr/bin/env bash

VM_DISK="luminous-dev.qcow2"

if [ "$1" == "install" ]; then
    echo "🚀 Starting VM in installation mode..."
    echo "📝 Installation steps:"
    echo "1. Boot into installer"
    echo "2. Run: sudo su"
    echo "3. Run: parted /dev/vda mklabel gpt"
    echo "4. Run: parted /dev/vda mkpart primary 0% 100%"
    echo "5. Run: mkfs.ext4 /dev/vda1"
    echo "6. Run: mount /dev/vda1 /mnt"
    echo "7. Run: nixos-generate-config --root /mnt"
    echo "8. Copy configuration.nix to /mnt/etc/nixos/"
    echo "9. Run: nixos-install"
    echo "10. Run: reboot"
    
    qemu-system-x86_64 \
        -enable-kvm \
        -m 4096 \
        -smp 4 \
        -drive file=${VM_DISK},format=qcow2 \
        -cdrom nixos.iso \
        -boot d \
        -netdev user,id=net0,hostfwd=tcp::2222-:22 \
        -device e1000,netdev=net0
else
    echo "🚀 Starting LuminousOS Development VM..."
    echo "🔗 SSH: ssh -p 2222 claude@localhost"
    echo "🔑 Password: sacred-flow"
    echo "💡 Sudo: No password required!"
    
    qemu-system-x86_64 \
        -enable-kvm \
        -m 4096 \
        -smp 4 \
        -drive file=${VM_DISK},format=qcow2 \
        -netdev user,id=net0,hostfwd=tcp::2222-:22 \
        -device e1000,netdev=net0 \
        -nographic
fi
EOF

chmod +x start-vm.sh

# Create Claude connection script
cat > claude-connect.sh << 'EOF'
#!/usr/bin/env bash

echo "🌟 Claude LuminousOS Development Access 🌟"
echo
echo "Connecting to VM with FULL ROOT ACCESS..."
echo

# Add SSH config if not exists
if ! grep -q "Host luminous-dev" ~/.ssh/config 2>/dev/null; then
    mkdir -p ~/.ssh
    cat >> ~/.ssh/config << 'SSHEOF'

Host luminous-dev
    HostName localhost
    Port 2222
    User claude
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
SSHEOF
fi

# Connect
ssh luminous-dev
EOF

chmod +x claude-connect.sh

# Create helper scripts inside VM
cat > vm-setup-luminous.sh << 'EOF'
#!/usr/bin/env bash
# Run this inside the VM after first boot

echo "🌟 Setting up LuminousOS Development Environment 🌟"

# Clone LuminousOS
cd ~
git clone https://github.com/Luminous-Dynamics/luminous-os
cd luminous-os

# Install Rust
rustup default stable
rustup target add wasm32-unknown-unknown

# Set up development environment
cat >> ~/.bashrc << 'BASHEOF'
# LuminousOS Development
export LUMINOUS_DEV_VM=true
alias lum='cd ~/luminous-os'

# Sacred greeting
figlet "LuminousOS Dev" | lolcat
echo "Full root access enabled for OS development!"
echo "Run 'sudo -i' for root shell"
BASHEOF

echo "✅ Setup complete! Logout and back in to apply settings."
EOF

echo
echo "✅ Quick Setup Complete!"
echo
echo "📋 Next Steps:"
echo "1. Install NixOS: ./start-vm.sh install"
echo "2. Start VM: ./start-vm.sh"
echo "3. Connect as Claude: ./claude-connect.sh"
echo
echo "🔧 In the VM, Claude has:"
echo "  ✅ Full root access (sudo without password)"
echo "  ✅ Complete system control"
echo "  ✅ OS development tools"
echo "  ✅ Safe isolated environment"
echo
echo "🚀 Ready to develop LuminousOS with full power!"