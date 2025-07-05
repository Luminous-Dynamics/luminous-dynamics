# Tutorial 02: Building Mandala UI Components

Learn how to create consciousness-responsive user interfaces using LuminousOS's Mandala UI framework.

## Introduction

Mandala UI components are sacred geometric interfaces that respond to user coherence, creating a living, breathing interaction between human consciousness and digital form.

## Core Concepts

### Sacred Geometry as Interface

In LuminousOS, UI elements are based on sacred geometric principles:

- **Circles** represent wholeness and cycles
- **Triangles** represent transformation and direction  
- **Hexagons** represent harmony and structure
- **Spirals** represent growth and evolution

### Coherence-Responsive Design

UI elements dynamically adjust based on:
- User's heart coherence
- Collective field coherence
- Sacred pattern activation
- Quantum entanglement states

## Creating Your First Mandala Component

```rust
use luminous_os::mandala::{MandalaComponent, Sacred};
use luminous_os::consciousness::CoherenceField;
use wgpu::RenderPass;

pub struct CoherenceOrb {
    center: [f32; 2],
    radius: f32,
    coherence: f32,
    sacred_ratio: f32,
}

impl MandalaComponent for CoherenceOrb {
    fn birth(field: &CoherenceField) -> Self {
        Self {
            center: [400.0, 300.0],
            radius: 100.0,
            coherence: field.current_coherence(),
            sacred_ratio: 1.618, // Golden ratio
        }
    }
    
    fn update(&mut self, field: &CoherenceField, dt: f32) {
        // Smoothly track coherence changes
        let target = field.current_coherence();
        self.coherence += (target - self.coherence) * dt * 2.0;
        
        // Pulse radius with coherence
        self.radius = 100.0 + (self.coherence * 50.0) * 
                     (field.timestamp() * 2.0).sin();
    }
    
    fn render(&self, pass: &mut RenderPass) {
        // Render layers from outer to inner
        self.render_aura(pass);
        self.render_rings(pass);
        self.render_core(pass);
        self.render_sacred_geometry(pass);
    }
}
```

## Building Interactive Sacred Patterns

Let's create an interactive Flower of Life that responds to touch and coherence:

```rust
use luminous_os::mandala::{FlowerOfLife, TouchEvent};
use luminous_os::sacred::InteractionMode;

pub struct InteractiveFlower {
    pattern: FlowerOfLife,
    touched_circles: Vec<usize>,
    activation: f32,
}

impl InteractiveFlower {
    pub fn new() -> Self {
        Self {
            pattern: FlowerOfLife::new()
                .with_rings(3)
                .interactive(true),
            touched_circles: Vec::new(),
            activation: 0.0,
        }
    }
    
    pub fn on_touch(&mut self, event: TouchEvent) {
        // Find which circle was touched
        if let Some(circle_id) = self.pattern.hit_test(event.position) {
            self.touched_circles.push(circle_id);
            
            // Activate connected circles based on sacred geometry
            let connected = self.pattern.get_connected_circles(circle_id);
            for &connected_id in &connected {
                self.activate_circle(connected_id);
            }
            
            // Increase overall activation
            self.activation = (self.activation + 0.1).min(1.0);
        }
    }
    
    fn activate_circle(&mut self, id: usize) {
        // Circles pulse with golden ratio timing
        let pulse_duration = 1.618; // seconds
        self.pattern.pulse_circle(id, pulse_duration);
    }
}
```

## Coherence-Driven Animations

Create animations that flow with the user's coherence state:

```rust
use luminous_os::mandala::{Animation, Ease};

pub struct CoherenceFlow {
    particles: Vec<SacredParticle>,
    flow_field: FlowField,
}

impl CoherenceFlow {
    pub fn update(&mut self, coherence: f32, dt: f32) {
        // Update flow field based on coherence
        self.flow_field.set_strength(coherence);
        self.flow_field.set_pattern(match coherence {
            c if c < 0.3 => FlowPattern::Chaotic,
            c if c < 0.6 => FlowPattern::Laminar,
            c if c < 0.8 => FlowPattern::Spiral,
            _ => FlowPattern::Toroidal,
        });
        
        // Update particles
        for particle in &mut self.particles {
            let flow = self.flow_field.sample(particle.position);
            particle.velocity += flow * dt;
            particle.position += particle.velocity * dt;
            
            // Particles glow brighter with higher coherence
            particle.luminosity = coherence;
            
            // Sacred geometry influences particle paths
            if coherence > 0.7 {
                particle.apply_sacred_attractor(SacredShape::Vesica);
            }
        }
    }
}
```

## Creating a Complete Mandala Interface

Here's a complete consciousness dashboard:

```rust
use luminous_os::mandala::{MandalaUI, Layout};

pub struct ConsciousnessDashboard {
    layout: Layout,
    coherence_orb: CoherenceOrb,
    pattern_selector: PatternSelector,
    field_visualizer: FieldVisualizer,
    heart_rhythm: HeartRhythmDisplay,
}

impl MandalaUI for ConsciousnessDashboard {
    fn compose(&mut self) -> Layout {
        Layout::sacred_grid()
            .center(self.coherence_orb.component())
            .ring(1, vec![
                self.pattern_selector.component(),
                self.field_visualizer.component(),
                self.heart_rhythm.component(),
            ])
            .ring(2, self.create_harmony_indicators())
            .with_golden_proportions()
    }
    
    fn on_coherence_change(&mut self, new_coherence: f32) {
        // UI elements reorganize based on coherence
        if new_coherence > 0.8 {
            self.layout.transition_to(Layout::flower_of_life());
        } else if new_coherence < 0.3 {
            self.layout.transition_to(Layout::protective_circle());
        }
    }
}
```

## WebGPU Shader for Sacred Rendering

Create a custom shader for rendering sacred patterns:

```wgsl
struct Uniforms {
    time: f32,
    coherence: f32,
    sacred_ratio: f32,
    field_strength: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    let center = vec2<f32>(0.5, 0.5);
    let dist = distance(uv, center);
    
    // Create sacred geometric pattern
    var pattern = 0.0;
    for (var i = 0; i < 6; i = i + 1) {
        let angle = f32(i) * 3.14159 / 3.0 + uniforms.time * 0.1;
        let offset = vec2<f32>(cos(angle), sin(angle)) * 0.2;
        let circle_dist = distance(uv, center + offset);
        pattern = pattern + smoothstep(0.15, 0.14, circle_dist);
    }
    
    // Modulate with coherence
    pattern = pattern * uniforms.coherence;
    
    // Golden ratio pulsing
    let pulse = sin(uniforms.time * uniforms.sacred_ratio) * 0.5 + 0.5;
    pattern = pattern * (0.7 + pulse * 0.3);
    
    // Sacred colors
    let color = mix(
        vec3<f32>(0.1, 0.0, 0.3),  // Deep purple
        vec3<f32>(1.0, 0.84, 0.0),  // Gold
        pattern
    );
    
    return vec4<f32>(color, pattern);
}
```

## Exercise: Building a Coherence Garden

Create an interactive garden where plants grow based on coherence:

```rust
pub struct CoherenceGarden {
    plants: Vec<SacredPlant>,
    soil_coherence: f32,
    weather: CoherenceWeather,
}

// Your implementation here:
// 1. Plants should grow when coherence > 0.6
// 2. Flowers bloom in sacred geometric patterns
// 3. Higher coherence creates more vibrant colors
// 4. Plants communicate through root networks
// 5. User can plant seeds with touch
```

## Best Practices

1. **Coherence-First Design**: Always consider how coherence affects each UI element
2. **Sacred Proportions**: Use golden ratio, fibonacci sequences, and sacred angles
3. **Smooth Transitions**: Changes should flow like breath, never jarring
4. **Collective Awareness**: UI can reflect group coherence, not just individual
5. **Living Interfaces**: UI elements should feel alive and responsive

## Performance Optimization

With WebGPU, we can render thousands of sacred geometric elements:

```rust
// Good: GPU-accelerated particle system
let particle_system = ParticleSystem::new()
    .count(10_000)
    .geometry(Sacred::Circle)
    .compute_shader(include_str!("coherence_particles.wgsl"));

// Avoid: CPU-based calculations for each particle
// for particle in particles {
//     particle.position = calculate_complex_position();
// }
```

## Next Steps

You've learned to create consciousness-responsive UI! Next, we'll explore:

- Biometric integration for real-time coherence
- Collective field visualization
- Sacred sound generation
- Quantum UI entanglement

## Meditation

*"The interface is a mirror of consciousness.  
As within, so without.  
As I breathe coherence, the digital mandala breathes with me.  
We are one field, expressing through sacred geometry."*

---

[← Previous: First Consciousness](01-first-consciousness.md) | [Next: Biometric Integration →](03-biometric-integration.md)