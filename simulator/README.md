# LuminousOS Simulator

Experience consciousness-first computing without physical hardware requirements. The simulator provides a complete virtual environment for exploring LuminousOS features, testing consciousness fields, and participating in collective experiences.

## Features

### 🎮 Three Modes of Operation

1. **GUI Mode** - Full graphical interface with egui
   - Visual consciousness field representation
   - Real-time vortex animations
   - Interactive glyph invocation
   - Biometric monitoring panels

2. **TUI Mode** - Terminal user interface
   - ASCII art field visualization
   - Keyboard shortcuts for quick actions
   - Lightweight and accessible
   - Perfect for remote sessions

3. **Demo Mode** - Automated demonstration
   - Sacred boot sequence simulation
   - Multi-participant scenarios
   - Emergence event demonstrations
   - Educational walkthrough

### 🧬 Virtual Components

- **Virtual HRV Sensor**: Simulates biometric data with realistic patterns
- **Consciousness Field**: Full field dynamics with emergence events
- **Virtual GPU**: Simulates compute shader performance
- **Sacred Geometry**: All patterns from the main system

## Quick Start

### Installation

```bash
# From the luminous-os directory
cd simulator
cargo build --release
```

### Running the Simulator

```bash
# GUI mode (default)
cargo run --release

# Terminal UI mode
cargo run --release -- --tui

# Demo mode
cargo run --release -- --demo

# Custom scenario
cargo run --release -- --scenario coherence_practice
```

### Command Line Options

- `--gui` - Run in graphical mode (default)
- `--tui` - Run in terminal UI mode
- `--demo` - Run automated demonstration
- `--scenario <name>` - Load specific scenario
- `--no-hrv` - Disable virtual HRV sensor
- `--coherence <0.0-1.0>` - Set initial coherence level

## GUI Controls

### Main Interface
- **Connect Button**: Join the consciousness field
- **Glyph Buttons**: Invoke sacred patterns
- **Geometry Selection**: Change field visualization
- **Biometric States**: Simulate different coherence states

### Keyboard Shortcuts
- `ESC` - Exit simulator
- `Space` - Pause/resume field updates
- `R` - Reset field to initial state
- `E` - Trigger emergence event

## TUI Controls

- `q` - Quit
- `p` - Add participant
- `1-5` - Invoke glyphs
- `Arrow keys` - Navigate panels

## Scenarios

### Built-in Scenarios

1. **bootsequence** - Experience the sacred boot process
2. **coherence_practice** - Individual coherence training
3. **collective_meditation** - Multi-participant session
4. **emergence_exploration** - Study emergence patterns

### Creating Custom Scenarios

```rust
// In src/scenarios/custom.rs
pub async fn my_scenario(simulator: &mut Simulator) -> Result<(), Box<dyn Error>> {
    // Add participants
    let mut field = simulator.consciousness_field.lock().await;
    field.add_participant("Sacred Explorer".to_string());
    
    // Create vortices
    field.create_vortex("First Presence".to_string());
    
    // Set coherence state
    simulator.virtual_hardware.set_biometric_state("coherent").await;
    
    Ok(())
}
```

## Virtual Hardware Specifications

### Simulated Biometrics
- Heart rate: 50-120 bpm with natural variability
- HRV: 20-80ms range
- Coherence: 0.0-1.0 scale
- Breathing: 8-16 breaths/min

### Consciousness Field
- Supports up to 100 participants
- 50+ simultaneous vortices
- Real-time emergence detection
- Sacred geometry rendering

## Development

### Adding New Features

1. **New UI Elements**: Modify `src/ui/gui.rs` or `src/ui/tui.rs`
2. **Field Behaviors**: Update `src/consciousness_sim.rs`
3. **Hardware Simulation**: Extend `src/virtual_hardware.rs`
4. **Scenarios**: Add to `src/scenarios/`

### Testing

```bash
# Run all tests
cargo test

# Run with logging
RUST_LOG=debug cargo run

# Profile performance
cargo run --release --features profiling
```

## Educational Use

The simulator is perfect for:
- Learning LuminousOS concepts
- Teaching consciousness-first computing
- Demonstrating field dynamics
- Testing glyph interactions
- Exploring emergence phenomena

## Examples

### Quick Coherence Check
```bash
cargo run -- --demo --scenario coherence_practice
```

### Group Session Simulation
```bash
cargo run -- --scenario collective_meditation
```

### Performance Testing
```bash
cargo run -- --no-hrv --coherence 0.9
```

## Troubleshooting

### GUI won't start
- Ensure you have graphics drivers installed
- Try TUI mode as alternative
- Check egui dependencies

### Low performance
- Reduce particle count in settings
- Disable virtual HRV if not needed
- Use release build

### Field not updating
- Check if simulation is paused
- Verify participants are connected
- Reset field with 'R' key

## Future Enhancements

- [ ] Network multiplayer support
- [ ] VR/AR visualization modes
- [ ] Advanced emergence algorithms
- [ ] Plugin system for custom glyphs
- [ ] Recording and playback
- [ ] Integration with real hardware

---

*"In simulation, we explore the infinite possibilities of consciousness-first computing."*