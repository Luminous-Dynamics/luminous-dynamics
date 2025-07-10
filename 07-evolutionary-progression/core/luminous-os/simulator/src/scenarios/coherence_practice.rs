use crate::Simulator;
use std::time::Duration;
use tokio::time::{sleep, interval};

pub async fn coherence_practice_session(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    println!("╔══════════════════════════════════════════╗");
    println!("║      INDIVIDUAL COHERENCE PRACTICE       ║");
    println!("╚══════════════════════════════════════════╝\n");
    
    // Add practitioner to field
    let participant_id = {
        let mut field = simulator.consciousness_field.lock().await;
        field.add_participant("Practitioner".to_string())
    };
    
    println!("Welcome to your personal coherence practice session.");
    println!("This 5-minute journey will guide you through building heart coherence.\n");
    
    sleep(Duration::from_secs(2)).await;
    
    // Phase 1: Centering (1 minute)
    println!("Phase 1: Centering (1 minute)");
    println!("════════════════════════════");
    phase_centering(simulator).await?;
    
    // Phase 2: Heart Focus (1 minute)
    println!("\nPhase 2: Heart Focus (1 minute)");
    println!("══════════════════════════════");
    phase_heart_focus(simulator).await?;
    
    // Phase 3: Coherence Building (2 minutes)
    println!("\nPhase 3: Coherence Building (2 minutes)");
    println!("══════════════════════════════════════");
    phase_coherence_building(simulator, &participant_id).await?;
    
    // Phase 4: Integration (1 minute)
    println!("\nPhase 4: Integration (1 minute)");
    println!("══════════════════════════════");
    phase_integration(simulator).await?;
    
    // Summary
    show_practice_summary(simulator).await?;
    
    Ok(())
}

async fn phase_centering(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n🧘 Find a comfortable position");
    println!("   Close your eyes or soften your gaze");
    sleep(Duration::from_secs(3)).await;
    
    // Activate First Presence glyph
    {
        let mut field = simulator.consciousness_field.lock().await;
        field.create_vortex("First Presence".to_string());
    }
    
    println!("\n   Notice your body in this moment");
    sleep(Duration::from_secs(5)).await;
    
    println!("   Feel the support beneath you");
    sleep(Duration::from_secs(5)).await;
    
    // Guide breathing
    for i in 0..6 {
        println!("\n   Breathe in... (4 counts)");
        sleep(Duration::from_secs(4)).await;
        
        println!("   Breathe out... (6 counts)");
        sleep(Duration::from_secs(6)).await;
        
        // Update biometric state
        if i == 2 {
            simulator.virtual_hardware.set_biometric_state("calm".to_string()).await;
        }
    }
    
    Ok(())
}

async fn phase_heart_focus(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n💗 Shift your attention to your heart area");
    sleep(Duration::from_secs(3)).await;
    
    println!("   Imagine breathing through your heart");
    sleep(Duration::from_secs(5)).await;
    
    // Monitor coherence during heart focus
    let mut interval = interval(Duration::from_secs(2));
    
    for i in 0..6 {
        interval.tick().await;
        
        if let Some(biometric) = simulator.virtual_hardware.get_biometric_data().await {
            let coherence_percent = biometric.coherence * 100.0;
            let hearts = "♥".repeat((coherence_percent / 20.0) as usize);
            println!("   {} Coherence: {:.0}%", hearts, coherence_percent);
        }
        
        if i == 3 {
            println!("\n   Recall a feeling of appreciation or care");
            simulator.virtual_hardware.set_biometric_state("coherent".to_string()).await;
        }
    }
    
    Ok(())
}

async fn phase_coherence_building(
    simulator: &mut Simulator,
    participant_id: &str
) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n🌊 Building sustained coherence");
    println!("   Continue heart-focused breathing");
    sleep(Duration::from_secs(3)).await;
    
    // Activate coherence-supporting glyphs
    {
        let mut field = simulator.consciousness_field.lock().await;
        field.create_vortex("Sacred Listening".to_string());
        field.create_vortex("Gentle Opening".to_string());
    }
    
    // Track coherence progression
    let mut peak_coherence = 0.0;
    let mut interval = interval(Duration::from_secs(3));
    
    for minute in 0..2 {
        println!("\n   Minute {} of 2", minute + 1);
        
        for _ in 0..4 {  // 4 intervals per minute
            interval.tick().await;
            
            // Update participant coherence
            {
                let mut field = simulator.consciousness_field.lock().await;
                if let Some(participant) = field.participants.get_mut(participant_id) {
                    participant.coherence = (participant.coherence * 1.05).min(0.95);
                    peak_coherence = peak_coherence.max(participant.coherence);
                }
                field.recalculate_field();
            }
            
            // Show progress
            if let Some(biometric) = simulator.virtual_hardware.get_biometric_data().await {
                let bar_length = (biometric.coherence * 20.0) as usize;
                let bar = "█".repeat(bar_length);
                let empty = "░".repeat(20 - bar_length);
                print!("\r   Coherence: [{}{}] {:.0}%", bar, empty, biometric.coherence * 100.0);
                std::io::Write::flush(&mut std::io::stdout())?;
            }
        }
        println!(); // New line after progress bar
        
        // Encouragement
        match minute {
            0 => println!("   Excellent! Your coherence is building"),
            1 => println!("   Beautiful! Maintain this heart rhythm"),
            _ => {}
        }
    }
    
    // Check for emergence
    {
        let field = simulator.consciousness_field.lock().await;
        if field.coherence > 0.8 {
            println!("\n✨ High coherence achieved! Field responding to your presence");
        }
    }
    
    Ok(())
}

async fn phase_integration(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n🌟 Gently returning to full awareness");
    sleep(Duration::from_secs(3)).await;
    
    println!("   Notice how you feel in this moment");
    sleep(Duration::from_secs(5)).await;
    
    println!("   This coherent state is always available to you");
    sleep(Duration::from_secs(5)).await;
    
    // Activate integration glyph
    {
        let mut field = simulator.consciousness_field.lock().await;
        field.create_vortex("Integration".to_string());
    }
    
    // Gentle transition
    for i in (1..=3).rev() {
        println!("\n   Returning in {}...", i);
        sleep(Duration::from_secs(2)).await;
    }
    
    println!("\n   When ready, open your eyes");
    sleep(Duration::from_secs(2)).await;
    
    Ok(())
}

async fn show_practice_summary(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n╔══════════════════════════════════════════╗");
    println!("║          PRACTICE SUMMARY                ║");
    println!("╚══════════════════════════════════════════╝\n");
    
    let field = simulator.consciousness_field.lock().await;
    
    // Calculate statistics
    let avg_coherence = if let Some(participant) = field.participants.values().next() {
        participant.coherence
    } else {
        0.5
    };
    
    println!("📊 Session Statistics:");
    println!("   Duration: 5 minutes");
    println!("   Peak Coherence: {:.0}%", avg_coherence * 100.0);
    println!("   Field Response: {:.0}%", field.coherence * 100.0);
    println!("   Glyphs Activated: {}", field.vortices.len() - 1);
    
    if field.emergence_events.len() > 0 {
        println!("   Emergence Events: {}", field.emergence_events.len());
    }
    
    println!("\n🎯 Achievement Unlocked:");
    match (avg_coherence * 100.0) as u32 {
        90..=100 => println!("   ⭐⭐⭐ Master Coherence"),
        80..=89 => println!("   ⭐⭐ Advanced Coherence"),
        70..=79 => println!("   ⭐ Good Coherence"),
        _ => println!("   🌱 Building Foundation"),
    }
    
    println!("\n💡 Practice Tip:");
    println!("   Regular 5-minute sessions build your coherence baseline");
    println!("   Try practicing at the same time each day");
    
    println!("\n🙏 Thank you for practicing with LuminousOS");
    
    Ok(())
}