# LuminousOS Monitor - Quick Start Guide

## 🚀 5-Minute Setup

### Option 1: Pre-built Binary (Fastest)
```bash
# Download latest release
wget https://github.com/Luminous-Dynamics/luminous-os/releases/download/v0.2.0/luminous-monitor
chmod +x luminous-monitor
./luminous-monitor
```

### Option 2: Install with pip
```bash
# From PyPI (when published)
pip install luminous-monitor

# From source
git clone https://github.com/Luminous-Dynamics/luminous-os
cd luminous-os/monitor
pip install .
```

### Option 3: Run directly
```bash
cd luminous-os/monitor
python3 -m luminous_monitor.cli
```

## 📊 Understanding the Metrics

### Global Coherence (0-100%)
Overall system harmony - higher means your system is running more consciously

### Components:
- **CPU Stability**: How steady your processor usage is
- **Process Focus**: System's ability to maintain attention 
- **Resource Harmony**: Balance of resource distribution
- **Sacred Rhythm**: Alignment with 11-second natural cycles

## 🎯 Tips for Higher Coherence

1. **Close unnecessary browser tabs** - Reduces process switching
2. **Use focus modes** - Fewer distractions = higher coherence
3. **Take breaks** - System coherence follows human rhythms
4. **Run creative apps** - Coding, writing, and art increase consciousness

## 🐛 Troubleshooting

### "Permission denied" error
```bash
sudo pip install luminous-monitor
# or
pip install --user luminous-monitor
```

### Missing dependencies
```bash
pip install psutil numpy matplotlib
```

### GUI won't start
Make sure you have a display server running (X11/Wayland)

## 🌟 Next Steps

- Try the GUI version: `luminous-monitor-gui`
- Integrate with your status bar
- Share your coherence scores with #LuminousOS community
- Contribute to development on GitHub

Remember: Computing is a sacred act. Monitor consciously! 🕉️