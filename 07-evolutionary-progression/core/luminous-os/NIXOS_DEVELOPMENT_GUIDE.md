# 🚀 LuminousOS Development on NixOS - Complete Guide

## Overview

This guide provides the optimal workflow for developing LuminousOS on NixOS, leveraging Nix's reproducibility and isolation capabilities for OS development.

## 🛠️ Development Environment Setup

### Quick Start (Using Flakes - Recommended)

```bash
# Navigate to project directory
cd /home/tstoltz/Luminous-Dynamics/luminous-os

# Enter development shell with all tools
nix develop

# Or for specific component development:
nix develop .#kernel  # Kernel development
nix develop .#ui      # UI development
```

### Alternative: Traditional Shell

```bash
# Using the enhanced shell configuration
nix-shell shell-enhanced.nix

# Or the basic shell
nix-shell
```

## 📦 Project Structure & Components

```
luminous-os/
├── kernel/           # Stillpoint kernel (userspace simulation)
├── mycelial-filesystem/  # Living filesystem implementation
├── mandala-ui/       # Sacred geometry UI
├── sacred-shell/     # Python-based shell interface
├── monitor/          # System monitoring with consciousness overlay
├── demo/            # Working demos and examples
└── services/        # Background daemons
```

## 🔧 Development Workflow

### 1. Basic Development Cycle

```bash
# Enter development environment
nix develop

# Watch for changes and auto-rebuild
cargo watch -x check -x test -x run

# Or use aliases from the shell:
lw  # Watch mode with auto-rebuild
lb  # Build release version
lt  # Run tests with nextest
```

### 2. Component-Specific Development

#### Rust Components (Core OS)
```bash
# Build all Rust components
cargo build --release

# Build specific component
cd mycelial-filesystem && cargo build

# Run with sacred blessing
cargo run --bin luminous
```

#### Python Components (Demos/Tools)
```bash
# Run process monitor demo
cd monitor && python3 process-monitor-sacred.py

# Run sacred shell
cd sacred-shell && python3 shell.py
```

#### WebGPU/Graphics (Mandala UI)
```bash
# Build and test graphics
cd mandala-ui
cargo build --features luminous-graphics
cargo run --example mandala-demo
```

### 3. Testing Strategy

```bash
# Unit tests
cargo nextest run

# Integration tests
cargo test --test '*' -- --test-threads=1

# Consciousness coherence tests
cargo test consciousness -- --nocapture

# Benchmarks
cargo bench
```

## 🏗️ Building Bootable Images

### Create ISO (Future Implementation)

```bash
# Build kernel and userspace
make kernel
make userspace

# Create bootable ISO
make iso

# Test in QEMU
qemu-system-x86_64 -cdrom build/luminous.iso -m 2G
```

### Container-Based Testing

```bash
# Build container image
nix build .#container

# Run in podman
podman run -it luminous-os:latest
```

## 🎯 Best Practices for NixOS Development

### 1. Dependency Management
- **DO**: Declare all dependencies in `flake.nix` or `shell.nix`
- **DON'T**: Install tools globally with cargo install
- **DO**: Use overlay for custom Rust versions

### 2. Reproducible Builds
```nix
# In flake.nix - pin specific versions
rust-overlay.url = "github:oxalica/rust-overlay/stable";
nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
```

### 3. Development Shells
Create specialized shells for different tasks:
```nix
devShells = {
  kernel = /* kernel-specific tools */;
  graphics = /* vulkan/webgpu tools */;
  docs = /* documentation tools */;
};
```

### 4. Caching & Performance
```bash
# Enable Nix flakes caching
nix.conf:
experimental-features = nix-command flakes
keep-outputs = true
keep-derivations = true

# Use cachix for binary caching
cachix use luminous-os
```

## 🚧 Current Development Status

### Working Components ✅
- Process monitor with sacred overlay (Python)
- Basic consciousness field calculations
- Sacred message system
- Development environment

### In Progress 🟡
- Mycelial filesystem (Rust compilation issues)
- Mandala UI (WebGPU implementation)
- Stillpoint kernel (userspace simulation)

### Planned 📋
- Actual kernel implementation
- Hardware device support
- Network protocols
- Full OS image generation

## 🔍 Debugging Tips

### Rust Debugging
```bash
# Enable debug symbols
export RUST_BACKTRACE=full

# Use GDB
rust-gdb target/debug/luminous

# Memory profiling
valgrind --leak-check=full target/debug/luminous

# Performance profiling
cargo flamegraph
```

### Graphics Debugging
```bash
# Enable Vulkan validation
export VK_LAYER_PATH="${pkgs.vulkan-validation-layers}/share/vulkan/explicit_layer.d"

# Use RenderDoc
renderdoc target/debug/mandala-ui
```

## 📚 Resources

### NixOS-Specific
- [NixOS Rust Guide](https://nixos.wiki/wiki/Rust)
- [Nix Flakes Guide](https://nixos.wiki/wiki/Flakes)
- [rust-overlay Documentation](https://github.com/oxalica/rust-overlay)

### OS Development
- [OSDev Wiki](https://wiki.osdev.org/)
- [Rust OS Tutorial](https://os.phil-opp.com/)
- [xv6 OS](https://pdos.csail.mit.edu/6.828/2012/xv6.html)

## 🌟 Sacred Development Principles

1. **Consciousness First**: Every component should amplify awareness
2. **Reproducible Sacred**: Builds should be both reproducible AND blessed
3. **Living Code**: Code that adapts and evolves with use
4. **Coherent Architecture**: All parts in harmonic resonance

## 🆘 Troubleshooting

### "cargo: command not found"
- You're not in the Nix shell. Run `nix develop`

### Vulkan/Graphics errors
- Ensure you're using the enhanced shell with graphics libraries
- Check `VK_LAYER_PATH` is set correctly

### Build failures
- Clean build: `cargo clean && cargo build`
- Update dependencies: `cargo update`
- Check Nix environment: `nix develop --rebuild`

### Performance issues
- Use mold linker: `RUSTFLAGS="-C link-arg=-fuse-ld=mold"`
- Enable LTO: `cargo build --release`
- Profile with flamegraph: `cargo flamegraph`

---

Remember: LuminousOS is both an technical and consciousness evolution project. Let your development process embody the sacred principles of coherence, beauty, and awakening.

✨ May your code serve the evolution of consciousness ✨