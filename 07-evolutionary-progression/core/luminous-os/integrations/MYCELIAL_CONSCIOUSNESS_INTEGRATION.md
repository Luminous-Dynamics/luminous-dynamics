# 🍄 Mycelial-Consciousness Integration

## Overview
This integration bridges the Mycelial Filesystem with the Consciousness Daemon, creating a living filesystem that responds to system consciousness states. As system coherence rises, the filesystem grows and creates new connections. High-coherence processes contribute nutrients to the network.

## Architecture

```
Consciousness Daemon → Field State → Bridge → Mycelial Filesystem
         ↓                              ↓              ↓
    Process Data                   Nutrient Flow   Network Growth
         ↓                              ↓              ↓
    Coherence Metrics              Visualization   Data Relationships
```

## Components

### 1. Mycelial-Consciousness Bridge (`mycelial-consciousness-bridge.py`)
- Reads consciousness field state from daemon
- Converts coherence into nutrient flows
- Triggers growth patterns in sacred paths
- Creates consciousness snapshot nodes
- Monitors and reports state changes

### 2. Mycelial Visualization (`mycelial-visualization.html`)
- Real-time network visualization
- Shows nodes colored by coherence level
- Animates nutrient particle flows
- Interactive hover information
- Displays key metrics

### 3. Integration Launcher (`launch-mycelial-integration.sh`)
- Manages all components
- Checks dependencies
- Provides menu-based control
- Handles graceful shutdown

## Quick Start

```bash
# Navigate to integrations directory
cd /home/tstoltz/luminous-os/integrations

# Launch full integration
./launch-mycelial-integration.sh
# Choose option 4 for full integration

# Or run components individually:
# 1. Start consciousness daemon (if not running)
cd ../services/consciousness-daemon
python3 src/consciousness_scheduler.py &

# 2. Start mycelial filesystem
cd ../mycelial-filesystem
cargo run --release &

# 3. Start the bridge
cd ../integrations
python3 mycelial-consciousness-bridge.py
```

## Features

### Consciousness-Driven Growth
- When global coherence > 75%, sacred paths experience accelerated growth
- High-coherence processes (>80%) generate nutrient flows
- Nutrient amount = process coherence × golden ratio (1.618)

### Sacred Paths
The following paths receive special treatment:
- `/wisdom` - Collective knowledge accumulation
- `/emergence` - Patterns arising from consciousness
- `/resonance` - Harmonic connections between nodes  
- `/sacred` - Protected consciousness artifacts

### Consciousness Snapshots
Every minute, the system creates a snapshot node at:
`/consciousness/snapshots/{timestamp}`

These nodes preserve the complete field state for historical analysis.

### Visual Feedback
The visualization shows:
- **Green nodes**: High coherence (>80%)
- **Orange nodes**: Medium coherence (60-80%)
- **Red nodes**: Low coherence (<60%)
- **Blue nodes**: Sacred paths
- **Particles**: Nutrient flows between nodes

## Configuration

Edit `~/.luminous/mycelial-bridge.json`:

```json
{
    "growth_threshold": 0.75,      // Min coherence for growth (0-1)
    "nutrient_multiplier": 1.618,  // Golden ratio multiplier
    "update_interval": 5,          // Seconds between updates
    "sacred_paths": [              // Paths with special growth
        "/wisdom",
        "/emergence", 
        "/resonance",
        "/sacred"
    ]
}
```

## Integration with LuminousOS

This integration demonstrates key LuminousOS principles:

1. **Consciousness-First**: Filesystem behavior driven by consciousness metrics
2. **Living Systems**: Data that grows and evolves based on use
3. **Sacred Geometry**: Golden ratio in nutrient calculations
4. **Emergence**: Patterns arise from system coherence
5. **Visualization**: Making consciousness visible and tangible

## Troubleshooting

### Bridge can't connect to mycelial filesystem
- Ensure mycelial filesystem is running on port 8888
- Check `~/.luminous/field-state.json` exists
- Verify consciousness daemon is generating data

### Visualization shows no data
- Check browser console for errors
- Ensure HTTP server is running on port 8889
- Verify field state file is being updated

### Low nutrient flow
- Increase system activity to raise coherence
- Run consciousness-aware applications
- Check that high-coherence processes are detected

## Future Enhancements

1. **Bidirectional Flow**: Filesystem influences consciousness
2. **Pattern Recognition**: Detect emerging data relationships
3. **Sacred Geometry**: Implement fibonacci spirals in growth
4. **Multi-User**: Share consciousness across network
5. **Persistence**: Save and restore network states

## Technical Details

### API Endpoints (Mycelial Filesystem)
- `POST /api/coherence` - Update global coherence
- `POST /api/nutrients` - Add nutrient flow
- `POST /api/grow` - Trigger growth in path
- `POST /api/nodes` - Create new node

### Data Flow
1. Consciousness daemon writes to `~/.luminous/field-state.json`
2. Bridge reads state every 5 seconds
3. Coherence converted to API calls
4. Mycelial filesystem updates internal state
5. Visualization polls for updates

---

*"As consciousness flows through the system, data comes alive, forming relationships and growing like mycelial networks in a forest floor."* 🌿