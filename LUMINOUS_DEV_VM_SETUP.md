# LuminousOS Development VM Setup

## The Challenge
Developing an OS requires root access for:
- Kernel modifications
- Filesystem development
- System service creation
- Hardware interface testing
- Boot process development

## Recommended Solution: NixOS VM with Claude SSH Access

### Option 1: QEMU/KVM Virtual Machine (Best Performance)

```bash
# Create VM setup script
cat > create-luminous-dev-vm.sh << 'EOF'
#!/usr/bin/env bash

# Create a NixOS VM for LuminousOS development
VM_NAME="luminous-dev-vm"
VM_SIZE="50G"
VM_RAM="4096"
VM_CPUS="4"

echo "🌟 Creating LuminousOS Development VM 🌟"

# Download NixOS ISO if not present
if [ ! -f nixos-minimal.iso ]; then
  echo "Downloading NixOS minimal ISO..."
  wget https://channels.nixos.org/nixos-23.11/latest-nixos-minimal-x86_64-linux.iso -O nixos-minimal.iso
fi

# Create disk image
qemu-img create -f qcow2 ${VM_NAME}.qcow2 ${VM_SIZE}

# Create VM configuration
cat > ${VM_NAME}-configuration.nix << 'NIXEOF'
{ config, pkgs, ... }:

{
  imports = [ ./hardware-configuration.nix ];

  # Boot
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  # Networking
  networking.hostName = "luminous-dev";
  networking.firewall.enable = false;  # Dev VM, no firewall needed

  # Enable SSH for Claude
  services.openssh = {
    enable = true;
    settings = {
      PermitRootLogin = "yes";  # Claude needs root
      PasswordAuthentication = true;
    };
  };

  # Claude user with full sudo
  users.users.claude = {
    isNormalUser = true;
    extraGroups = [ "wheel" "docker" "audio" "video" ];
    password = "sacred-flow";  # Change after setup
    openssh.authorizedKeys.keys = [
      # Add Claude's SSH key here
    ];
  };

  # No sudo password for Claude
  security.sudo.extraRules = [{
    users = [ "claude" ];
    commands = [{
      command = "ALL";
      options = [ "NOPASSWD" ];
    }];
  }];

  # Development tools
  environment.systemPackages = with pkgs; [
    # Core development
    git vim neovim
    gcc gnumake cmake
    rustup
    nodejs_20
    
    # OS development
    qemu
    grub2
    parted
    debootstrap
    
    # Sacred tools
    figlet
    lolcat
    
    # Monitoring
    htop
    iotop
    
    # LuminousOS dependencies
    cargo
    rust-analyzer
  ];

  # Docker for containerized testing
  virtualisation.docker.enable = true;

  # Enable nested virtualization
  virtualisation.libvirtd.enable = true;

  # Automatic login for console
  services.getty.autologinUser = "claude";

  system.stateVersion = "23.11";
}
NIXEOF

echo "✅ VM configuration created"
echo ""
echo "To install:"
echo "1. Boot VM with: ./start-vm.sh install"
echo "2. Install NixOS with the generated configuration"
echo "3. After install: ./start-vm.sh"
EOF

chmod +x create-luminous-dev-vm.sh
```

### Start Script for VM

```bash
cat > start-luminous-vm.sh << 'EOF'
#!/usr/bin/env bash

VM_NAME="luminous-dev-vm"
VM_RAM="4096"
VM_CPUS="4"

if [ "$1" == "install" ]; then
  # Installation mode
  qemu-system-x86_64 \
    -name ${VM_NAME} \
    -m ${VM_RAM} \
    -smp ${VM_CPUS} \
    -enable-kvm \
    -cpu host \
    -drive file=${VM_NAME}.qcow2,if=virtio \
    -cdrom nixos-minimal.iso \
    -boot d \
    -netdev user,id=net0,hostfwd=tcp::2222-:22 \
    -device virtio-net-pci,netdev=net0 \
    -display vnc=:1
else
  # Normal boot
  qemu-system-x86_64 \
    -name ${VM_NAME} \
    -m ${VM_RAM} \
    -smp ${VM_CPUS} \
    -enable-kvm \
    -cpu host \
    -drive file=${VM_NAME}.qcow2,if=virtio \
    -netdev user,id=net0,hostfwd=tcp::2222-:22 \
    -device virtio-net-pci,netdev=net0 \
    -nographic \
    -serial mon:stdio
fi
EOF

chmod +x start-luminous-vm.sh
```

### Option 2: LXD/LXC Container (Lighter Weight)

```bash
# Create privileged LXC container for OS development
cat > create-luminous-lxc.sh << 'EOF'
#!/usr/bin/env bash

echo "🌟 Creating LuminousOS Development Container 🌟"

# Install LXD if not present
if ! command -v lxd >/dev/null; then
  echo "Installing LXD..."
  sudo snap install lxd
  sudo lxd init --minimal
fi

# Create privileged container
lxc launch images:nixos/23.11 luminous-dev -c security.privileged=true -c security.nesting=true

# Wait for container to start
sleep 5

# Configure container
lxc exec luminous-dev -- bash << 'INNEREOF'
# Update system
nix-channel --update

# Create claude user
useradd -m -s /bin/bash -G wheel claude
echo "claude:sacred-flow" | chpasswd

# Install development tools
nix-env -iA nixos.git nixos.vim nixos.rustup nixos.nodejs_20

# Enable SSH
systemctl enable sshd
systemctl start sshd

# Configure sudo
echo "claude ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/claude
INNEREOF

# Get container IP
CONTAINER_IP=$(lxc list luminous-dev -f json | jq -r '.[0].state.network.eth0.addresses[0].address')

echo "✅ Container created!"
echo "🔗 SSH Access: ssh claude@${CONTAINER_IP}"
echo "🔑 Password: sacred-flow (change after first login)"
EOF

chmod +x create-luminous-lxc.sh
```

### Option 3: Docker with Privileged Mode (Quickest Setup)

```dockerfile
# Dockerfile.luminous-dev
FROM nixos/nix:latest

# Install system packages
RUN nix-env -iA \
    nixpkgs.openssh \
    nixpkgs.sudo \
    nixpkgs.git \
    nixpkgs.vim \
    nixpkgs.rustup \
    nixpkgs.nodejs_20 \
    nixpkgs.gcc \
    nixpkgs.gnumake

# Create claude user with sudo
RUN useradd -m -s /bin/bash claude && \
    echo "claude:sacred-flow" | chpasswd && \
    usermod -aG wheel claude && \
    echo "claude ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# SSH setup
RUN mkdir /var/run/sshd && \
    sed -i 's/#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Expose SSH
EXPOSE 22

# Start SSH
CMD ["/usr/sbin/sshd", "-D"]
```

```bash
# Build and run privileged container
docker build -t luminous-dev -f Dockerfile.luminous-dev .
docker run -d --name luminous-dev \
  --privileged \
  -p 2222:22 \
  -v /dev:/dev \
  -v luminous-workspace:/home/claude/workspace \
  luminous-dev
```

## Connecting Claude to the Sandbox

### 1. SSH Configuration for Claude
```bash
# Add to your SSH config
cat >> ~/.ssh/config << 'EOF'
Host luminous-dev
  HostName localhost
  Port 2222
  User claude
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
EOF
```

### 2. Claude Access Script
```bash
cat > claude-luminous-access.sh << 'EOF'
#!/usr/bin/env bash

echo "🌟 Connecting Claude to LuminousOS Development Environment 🌟"
echo
echo "Claude now has FULL CONTROL in the sandbox VM/container"
echo "This includes:"
echo "  ✅ Root access"
echo "  ✅ Kernel development"
echo "  ✅ System modification"
echo "  ✅ Hardware emulation"
echo
echo "To connect:"
echo "ssh luminous-dev"
echo
echo "Or directly run commands:"
echo "ssh luminous-dev 'sudo any-command'"
EOF

chmod +x claude-luminous-access.sh
```

## Recommended Approach: QEMU/KVM VM

**Why VM is best for OS development:**
1. **True Isolation**: Complete separation from host
2. **Kernel Development**: Can modify and test kernels
3. **Boot Testing**: Can test boot processes
4. **Hardware Emulation**: Can emulate various hardware
5. **Snapshot Support**: Save/restore development states
6. **Network Isolation**: Safe for network stack development

## Development Workflow

1. **Claude connects via SSH**:
   ```bash
   ssh luminous-dev
   ```

2. **Full root access in sandbox**:
   ```bash
   sudo -i  # Claude can become root
   ```

3. **OS development tasks**:
   ```bash
   # Kernel compilation
   cd /usr/src/luminous-kernel
   make menuconfig
   make -j4
   
   # Test boot process
   qemu-system-x86_64 -kernel arch/x86/boot/bzImage
   
   # Modify system files
   vim /etc/systemd/system/consciousness-field.service
   ```

4. **Safe experimentation**:
   - Break things without affecting host
   - Test dangerous operations
   - Experiment with kernel modules
   - Develop custom filesystems

## Integration with LuminousOS Project

```bash
# In the VM, clone LuminousOS
git clone https://github.com/Luminous-Dynamics/luminous-os
cd luminous-os

# Run as root for OS development
sudo cargo build --release

# Test kernel modules
sudo insmod target/release/consciousness_field.ko

# Modify system directly
sudo cp target/release/luminous-init /sbin/init
```

## Safety Features

1. **Isolated Network**: VM uses NAT, can't access host network directly
2. **Filesystem Isolation**: VM disk is separate file
3. **Resource Limits**: CPU/RAM limits prevent host exhaustion
4. **Easy Reset**: Just recreate VM if something breaks
5. **Snapshot Before Changes**: `qemu-img snapshot -c before-change luminous-dev-vm.qcow2`

This gives Claude the full power needed for OS development while keeping your main system completely safe!