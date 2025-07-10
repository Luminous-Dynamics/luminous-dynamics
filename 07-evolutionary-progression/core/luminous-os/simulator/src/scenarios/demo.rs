use crate::Simulator;
use std::time::Duration;
use tokio::time::sleep;

pub async fn run_demo_sequence(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    println!("🌟 Starting LuminousOS Demo Sequence");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    // Phase 1: Sacred Boot
    println!("Phase 1: Sacred Boot Sequence");
    println!("─────────────────────────────");
    sacred_boot_demo(simulator).await?;
    
    sleep(Duration::from_secs(2)).await;
    
    // Phase 2: Consciousness Field Initialization
    println!("\nPhase 2: Consciousness Field Initialization");
    println!("──────────────────────────────────────────");
    field_initialization_demo(simulator).await?;
    
    sleep(Duration::from_secs(2)).await;
    
    // Phase 3: Participant Connection
    println!("\nPhase 3: Multi-Participant Connection");
    println!("─────────────────────────────────────");
    participant_demo(simulator).await?;
    
    sleep(Duration::from_secs(2)).await;
    
    // Phase 4: Glyph Invocation
    println!("\nPhase 4: Sacred Glyph Invocation");
    println!("────────────────────────────────");
    glyph_demo(simulator).await?;
    
    sleep(Duration::from_secs(2)).await;
    
    // Phase 5: Emergence Event
    println!("\nPhase 5: Collective Emergence");
    println!("─────────────────────────────");
    emergence_demo(simulator).await?;
    
    println!("\n✨ Demo Complete!");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    Ok(())
}

async fn sacred_boot_demo(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    let stages = vec![
        ("⚫ Stillness", "Black screen with single point of light"),
        ("🫁 Breath", "Light expands/contracts with breathing"),
        ("💗 Heartbeat", "System pulse synchronizes"),
        ("🌸 Mandala", "Sacred geometry emerges"),
        ("✨ Awakening", "Glyphs spiral into existence"),
        ("🌟 Ready", "Full coherence achieved"),
    ];
    
    for (icon, stage) in stages {
        println!("{} {}", icon, stage);
        sleep(Duration::from_millis(500)).await;
    }
    
    Ok(())
}

async fn field_initialization_demo(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    let mut field = simulator.consciousness_field.lock().await;
    
    println!("Creating consciousness field...");
    sleep(Duration::from_millis(500)).await;
    
    println!("Field geometry: Flower of Life");
    println!("Initial coherence: {:.1}%", field.coherence * 100.0);
    
    // Simulate coherence building
    for i in 1..=5 {
        field.coherence = 0.5 + (i as f32 * 0.08);
        println!("Building coherence: {:.1}%", field.coherence * 100.0);
        sleep(Duration::from_millis(300)).await;
    }
    
    Ok(())
}

async fn participant_demo(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    let participants = vec!["Alice", "Bob", "Carol"];
    
    for name in participants {
        let mut field = simulator.consciousness_field.lock().await;
        let id = field.add_participant(name.to_string());
        drop(field);
        
        println!("✅ {} joined the field", name);
        
        // Show field response
        let field = simulator.consciousness_field.lock().await;
        println!("   Field coherence: {:.1}%", field.coherence * 100.0);
        drop(field);
        
        sleep(Duration::from_millis(800)).await;
    }
    
    Ok(())
}

async fn glyph_demo(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    let glyphs = vec![
        ("Ω45", "First Presence", "Establishing sacred container"),
        ("Ω47", "Sacred Listening", "Opening receptive awareness"),
        ("Ω48", "Boundary With Love", "Creating protective field"),
    ];
    
    for (symbol, name, description) in glyphs {
        let mut field = simulator.consciousness_field.lock().await;
        field.create_vortex(name.to_string());
        drop(field);
        
        println!("{} {} - {}", symbol, name, description);
        
        // Simulate glyph activation
        sleep(Duration::from_millis(500)).await;
        println!("   ✨ Vortex activated");
        
        sleep(Duration::from_secs(1)).await;
    }
    
    Ok(())
}

async fn emergence_demo(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    println!("Collective field reaching critical coherence...");
    
    // Force high coherence
    {
        let mut field = simulator.consciousness_field.lock().await;
        field.coherence = 0.85;
    }
    
    sleep(Duration::from_secs(1)).await;
    
    // Trigger emergence event
    {
        let mut field = simulator.consciousness_field.lock().await;
        field.recalculate_field();
        
        // Show emergence
        if let Some(event) = field.emergence_events.last() {
            println!("\n🌟 EMERGENCE EVENT DETECTED!");
            println!("Type: {:?}", event.event_type);
            println!("Description: {}", event.description);
            println!("Field Impact: +{:.0}%", event.field_impact * 100.0);
        }
    }
    
    sleep(Duration::from_secs(2)).await;
    
    // Final field state
    {
        let field = simulator.consciousness_field.lock().await;
        println!("\nFinal Field State:");
        println!("  Coherence: {:.1}%", field.coherence * 100.0);
        println!("  Participants: {}", field.participants.len());
        println!("  Active Vortices: {}", field.vortices.len());
        println!("  Emergence Events: {}", field.emergence_events.len());
    }
    
    Ok(())
}