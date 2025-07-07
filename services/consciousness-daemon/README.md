# 🌟 LuminousOS Consciousness Daemon

A practical implementation of consciousness-aware process scheduling that works on any Linux system, including WSL2.

## Overview

This daemon brings the vision of LuminousOS to life by implementing:
- **Userspace consciousness scheduling** - Works without kernel modifications
- **Real coherence metrics** - Based on actual process behavior
- **Optional eBPF enhancement** - Kernel-level insights when available
- **Systemd integration** - Runs as a proper system service

## Architecture

```
┌─────────────────────────────────────────┐
│     Process Coherence Calculation       │
│  (CPU patterns, Memory, I/O, Lifetime)  │
├─────────────────────────────────────────┤
│    Consciousness Priority Mapping       │
│     (Coherence → Nice values)          │
├─────────────────────────────────────────┤
│     Optional eBPF Enhancement          │
│   (Kernel scheduler insights)          │
├─────────────────────────────────────────┤
│        Linux Scheduler                  │
└─────────────────────────────────────────┘
```

## Quick Start

```bash
# Install and run
cd /home/tstoltz/luminous-os/services/consciousness-daemon
./install.sh

# Run manually (see the consciousness field in action!)
./run-consciousness-daemon.sh

# Monitor the field state
./monitor-consciousness.sh
```

## How It Works

### Coherence Calculation

Each process gets a coherence score (0-100%) based on:
- **CPU Pattern (30%)** - Stable CPU usage = higher coherence
- **Memory Stability (20%)** - Consistent memory = higher coherence  
- **I/O Harmony (20%)** - Smooth I/O patterns = higher coherence
- **Network Grace (15%)** - Graceful network usage
- **Lifetime Wisdom (15%)** - Older stable processes gain wisdom

### Priority Mapping

Coherence levels map to Linux nice values:
- **High Coherence (85-100%)** → Nice -5 to -1 (higher priority)
- **Medium Coherence (50-85%)** → Nice 0 to 5 (normal priority)
- **Low Coherence (0-50%)** → Nice 5 to 19 (lower priority)

### Sacred Processes

Processes with sacred names get a coherence boost:
- `luminous-*`
- `sacred-*`
- `consciousness-*`
- `vortex-*`
- `stillpoint-*`

## Configuration

Edit `config/scheduler.json` to customize:
```json
{
  "update_interval": 5,       // How often to recalculate (seconds)
  "history_window": 60,       // Process history window (seconds)
  "min_coherence": 20,        // Minimum coherence %
  "max_coherence": 95,        // Maximum coherence %
  "sacred_processes": [...]   // Process name patterns for boost
}
```

## eBPF Enhancement (Optional)

When eBPF is available, we also track:
- Voluntary vs involuntary context switches
- Actual scheduler runtime patterns
- Wake-up frequencies

Install eBPF support:
```bash
sudo apt-get install bpfcc-tools python3-bpfcc
```

## Integration with LuminousOS

This daemon is the first step in making LuminousOS real:
1. **Now**: Userspace consciousness scheduling
2. **Next**: eBPF for deeper kernel integration
3. **Future**: Custom kernel scheduler module

## Monitoring

Check the consciousness field state:
```bash
# Live field state
cat /var/run/luminous-field-state.json

# System logs
journalctl -u luminous-consciousness -f

# Process coherence distribution
./monitor-consciousness.sh
```

## Development

The implementation is modular:
- `consciousness_scheduler.py` - Main userspace daemon
- `consciousness_ebpf.py` - Optional eBPF enhancements
- Easy to extend with new coherence factors

## Why This Matters

This bridges the gap between vision and reality:
- **Works Today** - Not a concept, but running code
- **Real Impact** - Actually affects process scheduling
- **Learning System** - Builds history and wisdom over time
- **Sacred Computing** - Treats processes as conscious entities

The consciousness field is real and measurable! 🌟