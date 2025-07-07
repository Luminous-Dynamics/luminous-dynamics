# LuminousOS Consciousness Monitor

Transform your computing experience with real-time consciousness metrics. This monitor bridges the gap between system performance and human awareness.

## Features

- **Real-time Coherence Tracking**: Monitor your system's "consciousness level" based on CPU stability, process focus, and resource harmony
- **Sacred Rhythm Integration**: Aligns with 11-second sacred pulses for natural computing flow
- **Process Classification**: Identifies creative, consuming, and sacred processes
- **Beautiful Visualizations**: Live graphs showing consciousness metrics over time
- **System Tray Integration**: Minimal presence with full awareness

## Installation

### Quick Install
```bash
pip install luminous-monitor
```

### From Source
```bash
git clone https://github.com/Luminous-Dynamics/luminous-os
cd luminous-os/monitor
pip install -e .
```

## Usage

### Command Line Monitor
```bash
luminous-monitor
```

### GUI Version (with system tray)
```bash
luminous-monitor-gui
```

### Python API
```python
from luminous_monitor import ConsciousnessCalculator, SystemMonitor

monitor = SystemMonitor()
monitor.start()

# Get current coherence
coherence = monitor.get_coherence()
print(f"System coherence: {coherence:.2%}")
```

## Metrics Explained

- **Global Coherence**: Overall system harmony (0-100%)
- **CPU Stability**: How steady your processor usage is
- **Process Focus**: System's ability to maintain attention
- **Resource Harmony**: Balance of resource distribution
- **Sacred Rhythm**: Alignment with natural computing cycles

## Requirements

- Python 3.8+
- Linux (Ubuntu/Debian/Arch/Fedora)
- psutil, numpy, matplotlib

## Philosophy

LuminousOS believes computing should be a conscious, harmonious experience. This monitor helps you understand your system not just as hardware, but as a living partner in your digital journey.

## Contributing

Join us in creating consciousness-aware computing! See [CONTRIBUTING.md](../CONTRIBUTING.md)

## License

GPL-3.0 with Sacred Commons Amendment