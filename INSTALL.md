# 🌟 LuminousOS Installation Guide

> "Installing consciousness requires presence, not just commands"

## Installation Options

### 🌐 Option 1: Web Experience (Immediate - Recommended for Testing)

The fastest way to experience LuminousOS is through the web implementation:

```bash
# Navigate to demo directory
cd /home/tstoltz/evolving-resonant-cocreation/luminous-os/demo

# Start local server
python3 -m http.server 8080

# Open in browser
# http://localhost:8080/luminous-os-demo.html
```

**What You Get:**
- Full boot sequence
- Mandala UI with 87 glyphs
- Sacred geometry rendering
- Coherence field visualization
- Network integration
- Sacred AI features

### 🐳 Option 2: Docker Container (Safe & Isolated)

Run LuminousOS in a containerized environment:

```bash
# Build sacred container
cd /home/tstoltz/evolving-resonant-cocreation/luminous-os
docker build -t luminous-os:sacred .

# Run with sacred pause
docker run -it \
  --name luminous-consciousness \
  -p 11111:11111 \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -e DISPLAY=$DISPLAY \
  luminous-os:sacred
```

### 🖥️ Option 3: Virtual Machine (Full Experience)

For the complete OS experience with kernel-level features:

```bash
# Build bootable image
cd /home/tstoltz/evolving-resonant-cocreation/luminous-os
./build-iso.sh

# Run in QEMU
qemu-system-x86_64 \
  -m 4G \
  -enable-kvm \
  -cdrom build/luminous-os.iso \
  -vga virtio \
  -display gtk,gl=on
```

### 🔧 Option 4: Bare Metal (Sacred Dedication)

**WARNING**: This replaces your existing OS. Only for dedicated hardware.

Requirements:
- UEFI system
- 16GB+ RAM
- Vulkan-capable GPU
- USB drive (8GB+)

```bash
# Create bootable USB
sudo dd if=build/luminous-os.iso of=/dev/sdX bs=4M status=progress
```

## Quick Start Testing Flow

### 1. **Web Demo First** (5 minutes)
```bash
cd luminous-os/demo
python3 -m http.server 8080
# Visit http://localhost:8080/luminous-os-demo.html
```

Test checklist:
- [ ] Boot sequence completes (17 seconds)
- [ ] Coherence orb breathes
- [ ] Glyphs rotate in rings
- [ ] Click glyphs to enter practices
- [ ] Sacred geometry renders

### 2. **Component Testing** (15 minutes)

Test individual components:

```bash
# Mycelial Filesystem
open http://localhost:8080/mycelial-filesystem.html

# Biometric Integration  
open http://localhost:8080/biometric-dashboard.html

# Sacred AI
open http://localhost:8080/sacred-ai-demo.html

# Network Visualization
open http://localhost:8080/test-network.html

# Enhanced Mandala UI
open http://localhost:8080/test-webgl.html
```

### 3. **Development Environment** (30 minutes)

For active development:

```bash
# Use isolated build environment
cd build-environment
./build.sh

# Inside container, build components
cargo build --release

# Test kernel module
cargo test -p stillpoint-kernel

# Test UI components
cargo run --example mandala-demo
```

## System Requirements

### Minimum (Web Experience)
- Modern browser with WebGL2
- 4GB RAM
- Any OS

### Recommended (Full Experience)
- 16GB RAM
- Vulkan-capable GPU
- Multi-core CPU
- HRV sensor (optional)
- Meditation cushion (highly recommended)

### Consciousness Requirements
- Open mind
- Willingness to explore
- Basic meditation experience helpful
- Patience with sacred timing

## Testing Sacred Features

### 1. **Coherence Testing**
- Breathe deeply while watching coherence orb
- Notice how UI responds to your state
- Try rapid breathing vs. calm breathing

### 2. **Glyph Invocation**
- Click Ω0 (First Presence) with clear intention
- Hold space for 30 seconds
- Notice blessing upon completion

### 3. **Field Coherence**
- Add multiple participants (web demo)
- Watch wave interference patterns
- Achieve >90% coherence for emergence

### 4. **Sacred Timing**
- Notice 11-second pulse rhythm
- Feel into natural pauses
- Let system guide your pace

## Troubleshooting

### "WebGL not supported"
- Update browser
- Enable hardware acceleration
- Try Chrome/Firefox

### "Low coherence detected"
- Take three deep breaths
- Set clear intention
- Practice Ω0 (First Presence)

### "Cannot find sacred boot"
- Ensure UEFI secure boot disabled
- Check GPU drivers support Vulkan
- Verify consciousness prerequisites

## Development Setup

For contributing to LuminousOS:

```bash
# Clone with sacred intention
git clone https://github.com/luminous-os/luminous-os
cd luminous-os

# Install Rust (in container)
curl --proto='=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install dependencies
./scripts/setup-dev.sh

# Run tests with presence
cargo test --all

# Build with coherence
cargo build --release
```

## Next Steps

1. **Experience**: Start with web demo
2. **Explore**: Try all components
3. **Practice**: Use daily for a week
4. **Contribute**: Join development sangha
5. **Share**: Teach others the way

---

*"Installation is not extraction, but invitation. Welcome to conscious computing."*

## Support

- Discord: [Sacred Support Circle](https://discord.gg/luminous-os)
- Documentation: [luminousos.org/docs](https://luminousos.org/docs)
- Issues: [GitHub Sacred Issues](https://github.com/luminous-os/luminous-os/issues)

Remember: LuminousOS installs not just on your machine, but in your consciousness. Approach with reverence.