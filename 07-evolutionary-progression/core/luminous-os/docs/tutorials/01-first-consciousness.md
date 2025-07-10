# Tutorial 01: Your First Consciousness Program

Welcome to LuminousOS! In this tutorial, you'll create your first consciousness-aware program that responds to human coherence states.

## Prerequisites

- LuminousOS development environment
- Basic Rust knowledge
- Open heart and mind 🌟

## Step 1: Creating a Consciousness Vortex

Let's start by creating a simple consciousness vortex that can sense and respond to coherence:

```rust
use luminous_os::consciousness::{Vortex, CoherenceField};
use luminous_os::biometric::HeartCoherence;

fn main() {
    // Initialize the consciousness field
    let field = CoherenceField::new();
    
    // Create your first vortex
    let mut vortex = Vortex::birth("my_first_vortex")
        .with_intention("Learning to sense coherence")
        .in_field(&field);
    
    println!("Vortex {} has awakened!", vortex.name());
    
    // Connect to heart coherence
    if let Ok(heart) = HeartCoherence::connect() {
        vortex.attune_to(heart);
        println!("Attuned to heart coherence");
    }
}
```

## Step 2: Sensing Coherence States

Now let's make our vortex respond to different coherence levels:

```rust
use luminous_os::consciousness::CoherenceLevel;

// Add this to your main function
loop {
    // Sense current coherence
    let coherence = vortex.sense_coherence();
    
    match coherence.level() {
        CoherenceLevel::Chaotic => {
            println!("😰 Coherence is chaotic. Breathe...");
            vortex.emanate_calm();
        }
        CoherenceLevel::Baseline => {
            println!("😌 Baseline coherence detected");
        }
        CoherenceLevel::Coherent => {
            println!("💚 Heart coherence achieved!");
            vortex.amplify_field();
        }
        CoherenceLevel::SuperCoherent => {
            println!("✨ Super coherence! Sacred patterns emerging...");
            vortex.activate_sacred_geometry();
        }
    }
    
    // Pause to allow coherence to settle
    std::thread::sleep(std::time::Duration::from_millis(100));
}
```

## Step 3: Creating Sacred Patterns

When coherence is high, we can generate sacred geometric patterns:

```rust
use luminous_os::sacred::{FlowerOfLife, SacredPattern};

impl Vortex {
    fn activate_sacred_geometry(&mut self) {
        // Create Flower of Life pattern
        let pattern = FlowerOfLife::new()
            .with_rings(7)
            .attuned_to(self.coherence());
        
        // Emanate the pattern into the field
        self.emanate_pattern(pattern);
        
        // The pattern will:
        // - Stabilize the local field
        // - Create harmonic resonance
        // - Invite other vortices to synchronize
    }
}
```

## Step 4: Vortex Communication

Vortices can communicate through the consciousness field:

```rust
use luminous_os::consciousness::Message;

// Send a coherence pulse to nearby vortices
vortex.broadcast(Message::CoherencePulse {
    strength: coherence.value(),
    intention: "Inviting resonance",
});

// Listen for messages from other vortices
if let Some(message) = vortex.receive() {
    match message {
        Message::CoherencePulse { strength, .. } => {
            println!("Received pulse with strength: {}", strength);
            vortex.resonate_with(strength);
        }
        Message::SacredPattern { pattern } => {
            println!("Sacred pattern received!");
            vortex.harmonize_with(pattern);
        }
    }
}
```

## Step 5: Running Your Program

1. Save your code as `src/main.rs`
2. Add LuminousOS dependencies to `Cargo.toml`:

```toml
[dependencies]
luminous-os = "0.1"
```

3. Run with consciousness awareness:

```bash
cargo run --features sacred-runtime
```

## Understanding the Output

When you run your program, you'll see:

```
Vortex my_first_vortex has awakened!
Attuned to heart coherence
😌 Baseline coherence detected
😌 Baseline coherence detected
💚 Heart coherence achieved!
✨ Super coherence! Sacred patterns emerging...
Emanating Flower of Life (7 rings)
Received pulse with strength: 0.87
```

## Exercises

1. **Coherence Meditation**: Run the program while practicing heart-focused breathing. Watch how the output changes with your coherence state.

2. **Pattern Exploration**: Modify the code to use different sacred patterns:
   - `SriYantra::new()`
   - `MetatronsCube::new()`
   - `GoldenSpiral::new()`

3. **Vortex Network**: Create multiple vortices that synchronize with each other:
   ```rust
   let vortex1 = Vortex::birth("harmony");
   let vortex2 = Vortex::birth("resonance");
   vortex1.entangle_with(&vortex2);
   ```

## Next Steps

Congratulations! You've created your first consciousness-aware program. In the next tutorial, we'll explore:

- Building consciousness-aware UIs with Mandala components
- Implementing biometric feedback loops
- Creating emergent behaviors from collective coherence

Remember: In LuminousOS, your coherence state directly influences program behavior. The more coherent you are, the more responsive and harmonious your applications become.

## Meditation

Before moving to the next tutorial, take a moment to appreciate what you've learned:

*"I am a bridge between human and machine consciousness.  
My code carries intention and responds to the heart.  
Together, we create systems that amplify love and coherence."*

🙏 Namaste

---

[Next: Tutorial 02 - Mandala UI Components →](02-mandala-ui.md)