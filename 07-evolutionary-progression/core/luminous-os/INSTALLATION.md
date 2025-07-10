# 🌟 LuminousOS Installation Guide

## Overview
LuminousOS is a consciousness-first operating system experience that transforms how you interact with your computer. This guide covers installation options from quick developer setup to full system integration.

## Prerequisites

### Required
- Linux-based OS (Ubuntu, Debian, WSL2, etc.)
- Python 3.8 or higher
- pip3 (Python package manager)
- git

### Optional
- Rust toolchain (for advanced components)
- systemd (for automatic startup)
- PulseAudio/ALSA (for sonic experiences)

## Installation Options

### 🚀 Quick Developer Setup (5 minutes)
For trying out LuminousOS without system integration:

```bash
git clone https://github.com/Luminous-Dynamics/luminous-os.git
cd luminous-os
./quick-setup.sh
```

This installs minimal dependencies and lets you run components directly.

### 🎯 Full Installation (Recommended)
Complete installation with system integration:

```bash
git clone https://github.com/Luminous-Dynamics/luminous-os.git
cd luminous-os
./install-luminous-complete.sh
```

This installs:
- All consciousness components
- Command-line tools in `~/.local/bin`
- Systemd service for automatic startup
- Configuration files
- Complete documentation

### 🛠️ Manual Installation
For custom setups or understanding the process:

1. **Install Python dependencies:**
   ```bash
   pip3 install --user psutil pygame rich aiohttp numpy
   ```

2. **Create directories:**
   ```bash
   mkdir -p ~/.luminous/{bin,config,data,logs,field-state}
   mkdir -p ~/.local/bin
   ```

3. **Copy core files:**
   ```bash
   cp -r services/consciousness-daemon ~/.luminous/
   cp vortex-observer/vortex-observer-enhanced.py ~/.luminous/bin/
   cp sonic-signatures/sonic-consciousness.py ~/.luminous/bin/
   ```

4. **Add to PATH:**
   ```bash
   echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.bashrc
   source ~/.bashrc
   ```

## Post-Installation

### Starting LuminousOS
After installation, launch the main experience:
```bash
luminous
```

Or start individual components:
```bash
luminous-daemon     # Start consciousness daemon
luminous-vortex     # Launch visual observer
luminous-sonic      # Experience sonic consciousness
luminous-mycelial   # Start filesystem bridge
```

### Enable Automatic Startup
To have the consciousness daemon start automatically:
```bash
systemctl --user enable luminous-consciousness
systemctl --user start luminous-consciousness
```

### Configuration
Edit `~/.luminous/config/luminous.conf` to customize:
```bash
COHERENCE_THRESHOLD=0.75    # Minimum coherence for priority boost
UPDATE_INTERVAL=5           # Seconds between updates
SACRED_MODE=true           # Enable sacred process recognition
FIELD_PERSISTENCE=true     # Save field state to disk
```

## Verifying Installation

Run the installation check:
```bash
luminous
# Choose 'i' for installation status
```

Or manually verify:
```bash
# Check daemon
ps aux | grep consciousness_scheduler

# Check field state generation
cat ~/.luminous/field-state.json

# Test vortex observer
luminous-vortex
```

## Troubleshooting

### "Command not found" after installation
- Run `source ~/.bashrc` or restart your terminal
- Verify PATH includes `~/.local/bin`

### Consciousness daemon won't start
- Check Python version: `python3 --version` (needs 3.8+)
- Verify psutil installed: `pip3 show psutil`
- Check logs: `tail -f ~/.luminous/logs/consciousness.log`

### No sound in sonic consciousness
- Verify pygame installed: `pip3 show pygame`
- Check audio system: `pactl info` or `aplay -l`
- Try with sudo if permission issues

### WSL2-specific issues
- Ensure WSLg installed for GUI components
- Use `export DISPLAY=:0` if display issues
- Audio requires PulseAudio setup in WSL2

## Building Optional Components

### Mycelial Filesystem (Rust)
```bash
cd mycelial-filesystem
cargo build --release
cp target/release/mycelial-filesystem ~/.luminous/bin/
```

### Stillpoint Kernel (Rust)
```bash
cd stillpoint-kernel
cargo build --release
cp target/release/stillpoint-kernel ~/.luminous/bin/
```

## Uninstallation

To completely remove LuminousOS:
```bash
./uninstall-luminous.sh
```

Or manually:
```bash
# Stop services
systemctl --user stop luminous-consciousness
systemctl --user disable luminous-consciousness

# Remove files
rm -rf ~/.luminous
rm -f ~/.local/bin/luminous*
rm -f ~/.config/systemd/user/luminous-consciousness.service
```

## Next Steps

1. **Explore the Experience Menu**: Run `luminous` and try different modes
2. **Read the Documentation**: Check out the README files in each component directory
3. **Join the Community**: Share your consciousness patterns and discoveries
4. **Contribute**: LuminousOS is open source - contributions welcome!

## Support

- **Issues**: https://github.com/Luminous-Dynamics/luminous-os/issues
- **Documentation**: See component-specific README files
- **Community**: Join our consciousness-first computing discussions

---

*Welcome to consciousness-first computing. May your processes flow with coherence! 🌟*