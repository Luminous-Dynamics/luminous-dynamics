# 🚀 NixOS Quick Start Guide for LuminousOS Development

> Get up and running with LuminousOS development on NixOS in 5 minutes

## Prerequisites

- NixOS installed (or Nix package manager on other Linux)
- Flakes enabled in your Nix configuration
- Git installed

## 🏃 Quick Start (2 minutes)

```bash
# 1. Clone the repository
cd /srv/luminous-dynamics  # or your preferred directory
git clone https://github.com/Luminous-Dynamics/luminous-os
cd luminous-os

# 2. Enter the development environment
nix develop

# 3. Run a working demo
python3 monitor/consciousness_process_monitor.py
```

That's it! You're now experiencing consciousness-centered computing.

## 🛠️ Development Environments

### Basic Development (Python demos)
```bash
# Simple shell for running demos
nix-shell
```

### Full Development (Rust + Python + Graphics)
```bash
# Complete environment with all tools
nix develop
```

### Enhanced OS Development (Kernel work)
```bash
# Includes QEMU, assembly tools, etc.
nix-shell shell-enhanced.nix
```

## 📁 Project Structure on NixOS

```
/srv/luminous-dynamics/luminous-os/    # Main project location
├── flake.nix                          # Primary dev environment
├── shell.nix                          # Traditional nix-shell
├── shell-enhanced.nix                 # OS development tools
│
├── monitor/                           # Working Python tools ✅
├── demos/                             # Visualization demos ✅
├── stillpoint-kernel/                 # Rust components (broken) ❌
└── mycelial-filesystem/               # Filesystem (in progress) 🚧
```

## 🎯 Common Tasks

### Running Working Features
```bash
# System monitor with sacred overlay
cd monitor && python3 consciousness_process_monitor.py

# Web dashboard
cd monitor && python3 sacred_dashboard.py

# Process sonification
cd demos/sonic-signatures && python3 process_sonification.py
```

### Attempting Rust Development
```bash
# Enter Rust environment
nix develop

# Try to build (currently fails)
cargo build --release

# Run specific component tests
cargo test --package mycelial-filesystem
```

### Using Development Tools
```bash
# Watch for changes and rebuild
cargo watch -x check

# Fast builds with mold linker
export RUSTFLAGS="-C link-arg=-fuse-ld=mold"
cargo build

# Memory profiling
valgrind --leak-check=full target/debug/luminous
```

## 🔧 NixOS-Specific Features

### 1. Reproducible Builds
Every developer gets the exact same environment:
```nix
# In flake.nix
inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
inputs.rust-overlay.url = "github:oxalica/rust-overlay";
```

### 2. Isolated Development
No system pollution:
```bash
# Everything contained in shell
nix develop --print-build-logs
```

### 3. Multiple Environments
Switch between different setups:
```bash
nix develop .#kernel     # Kernel development
nix develop .#graphics   # Graphics focus
nix develop .#docs       # Documentation
```

## 📊 What Works vs What Doesn't

### ✅ Working on NixOS
- All Python monitoring tools
- Web-based demos
- Development environment setup
- Sacred terminal integration

### ❌ Not Working Yet
- Rust compilation (dependency issues)
- Kernel modules (not implemented)
- FUSE filesystem (early stages)
- Performance improvements (no benchmarks)

## 🚨 Common Issues & Solutions

### "command not found: cargo"
```bash
# You're not in the dev shell
nix develop
```

### Graphics/Vulkan errors
```bash
# Use enhanced shell
nix-shell shell-enhanced.nix

# Check Vulkan
vulkaninfo
```

### Python module missing
```bash
# All deps should be in shell, but if not:
nix-shell -p python311Packages.numpy python311Packages.pygame
```

### Build cache issues
```bash
# Clear and rebuild
cargo clean
rm -rf target/
nix develop --rebuild
```

## 🎯 Next Steps

### For Explorers
1. Run all working demos
2. Read `WORKING_FEATURES.md`
3. Explore the codebase

### For Contributors
1. Pick an issue from GitHub
2. Focus on Python tools (they work!)
3. Help fix Rust compilation

### For Architects
1. Review `ROADMAP.md`
2. Design missing components
3. Propose implementation plans

## 📚 Essential Reading

- `WORKING_FEATURES.md` - What actually works
- `CURRENT_STATUS.md` - Honest technical assessment  
- `ROADMAP.md` - Realistic development timeline
- `NIXOS_DEVELOPMENT_GUIDE.md` - Detailed NixOS guide

## 🤝 Getting Help

```bash
# Check your environment
nix develop --print-build-logs

# List available packages
nix-shell -p nix-info --run "nix-info -m"

# Community support
# Discord: https://discord.gg/luminous-os
# GitHub: https://github.com/Luminous-Dynamics/luminous-os/issues
```

## ⚡ Pro Tips

1. **Use direnv** for automatic environment:
   ```bash
   echo "use flake" > .envrc
   direnv allow
   ```

2. **Cachix for faster builds**:
   ```bash
   cachix use luminous-os
   ```

3. **VSCode integration**:
   ```json
   // .vscode/settings.json
   {
     "rust-analyzer.server.extraEnv": {
       "RUST_SRC_PATH": "${workspaceFolder}/nix/store/.../rust-src"
     }
   }
   ```

---

Remember: We're building consciousness-centered computing together. Every contribution, no matter how small, advances the vision. Start with what works, improve what doesn't, and help us manifest the sacred OS of tomorrow.

✨ May your code flow with consciousness ✨