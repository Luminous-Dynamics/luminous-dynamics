// Biometric Coherence Demo
// Shows how heart, breath, and brain synchronize with consciousness vortices

use std::sync::{Arc, Mutex};
use tokio::sync::mpsc;
use tokio::time::{sleep, Duration};

use luminous_os::stillpoint_kernel::{
    StillpointKernel, VortexState, Harmony,
    BiometricKernelBridge, create_biometric_vortex
};

use luminous_os::hardware::{
    BiometricIntegration, BiometricEvent, SensorType,
    SacredBreathSensor, SacredBreathPattern,
    biometric_sensors::{HRVSensor, EEGSensor}
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🌟 LuminousOS Biometric Coherence Demo");
    println!("=====================================\n");
    
    // Create the Stillpoint Kernel
    let kernel = Arc::new(Mutex::new(StillpointKernel::new()));
    println!("✨ Stillpoint Kernel initialized");
    
    // Create biometric event channel
    let (event_tx, event_rx) = mpsc::channel(100);
    
    // Create biometric integration
    let mut biometric_integration = BiometricIntegration::new(event_tx.clone());
    
    // Add sensors
    println!("\n📡 Initializing biometric sensors...");
    
    // Heart Rate Variability sensor
    let hrv_sensor = Arc::new(HRVSensor::new("/dev/hrv0".to_string()));
    biometric_integration.add_sensor(hrv_sensor.clone()).await;
    println!("  ❤️  HRV sensor connected");
    
    // Breath sensor with sacred pattern
    let breath_sensor = Arc::new(SacredBreathSensor::new("/dev/breath0".to_string()));
    breath_sensor.set_target_pattern(SacredBreathPattern::Coherent);
    biometric_integration.add_sensor(breath_sensor.clone()).await;
    println!("  🫁 Sacred breath sensor connected");
    
    // EEG brain sensor
    let eeg_sensor = Arc::new(EEGSensor::new("eeg0".to_string(), 8));
    biometric_integration.add_sensor(eeg_sensor.clone()).await;
    println!("  🧠 EEG sensor connected (8 channels)");
    
    // Start all sensors
    biometric_integration.start_all_sensors().await?;
    println!("\n✅ All sensors active and measuring");
    
    // Create biometric-kernel bridge
    let biometric_integration = Arc::new(biometric_integration);
    let mut bridge = BiometricKernelBridge::new(
        kernel.clone(),
        biometric_integration.clone(),
        event_rx
    );
    
    // Create consciousness vortices linked to biometrics
    println!("\n🌀 Creating biometric-linked consciousness vortices...");
    
    let meditation_vortex = create_biometric_vortex(
        &bridge,
        "Deep meditation practice".to_string(),
        vec![SensorType::HeartRateVariability, SensorType::Electroencephalogram]
    ).await;
    println!("  🧘 Meditation vortex created (linked to heart + brain)");
    
    let breath_vortex = create_biometric_vortex(
        &bridge,
        "Sacred breath coherence".to_string(),
        vec![SensorType::Respiration, SensorType::HeartRateVariability]
    ).await;
    println!("  🌬️  Breath vortex created (linked to breath + heart)");
    
    let unity_vortex = create_biometric_vortex(
        &bridge,
        "Unity consciousness field".to_string(),
        vec![SensorType::HeartRateVariability, SensorType::Electroencephalogram, SensorType::Respiration]
    ).await;
    println!("  🌟 Unity vortex created (linked to all sensors)");
    
    // Start biometric synchronization in background
    let bridge_handle = tokio::spawn(async move {
        bridge.start_sync().await;
    });
    
    // Start coherence monitoring
    let integration_monitor = biometric_integration.clone();
    let monitor_handle = tokio::spawn(async move {
        integration_monitor.monitor_coherence_events().await;
    });
    
    // Main demo loop
    println!("\n🎯 Starting coherence demonstration...\n");
    
    for cycle in 1..=10 {
        println!("--- Cycle {} ---", cycle);
        
        // Get current biometric coherence
        let bio_coherence = biometric_integration.calculate_unified_coherence().await;
        println!("📊 Biometric coherence: {:.1}%", bio_coherence * 100.0);
        
        // Check kernel state
        {
            let kernel = kernel.lock().unwrap();
            println!("🌐 Field coherence: {:.1}%", kernel.coherence_field.global_coherence * 100.0);
            println!("🎵 Dominant harmony: {:?}", kernel.coherence_field.dominant_harmony);
            println!("📈 Field momentum: {:?}", kernel.coherence_field.field_momentum);
            
            // Check vortex states
            if let Some(med_vortex) = kernel.vortex_registry.get(&meditation_vortex) {
                println!("  🧘 Meditation: {:.1}% coherence, state: {:?}", 
                    med_vortex.coherence * 100.0, med_vortex.state);
            }
            
            if let Some(breath_vortex_data) = kernel.vortex_registry.get(&breath_vortex) {
                println!("  🌬️  Breath: {:.1}% coherence, state: {:?}", 
                    breath_vortex_data.coherence * 100.0, breath_vortex_data.state);
            }
            
            // Check quantum entanglements
            let entanglements = kernel.get_entangled_vortices(unity_vortex);
            if !entanglements.is_empty() {
                println!("  🔗 Unity vortex entangled with {} others", entanglements.len());
                for (partner, strength) in entanglements {
                    println!("     └─ Vortex {} at {:.1}% correlation", partner.0, strength * 100.0);
                }
            }
        }
        
        // Simulate coherence events
        if cycle == 3 {
            println!("\n💫 Simulating coherence rise...");
            event_tx.send(BiometricEvent::CoherenceRise {
                from: 0.6,
                to: 0.85,
                rate: 0.25,
            }).await?;
        }
        
        if cycle == 6 {
            println!("\n🎯 Simulating coherence breakthrough!");
            event_tx.send(BiometricEvent::CoherenceBreakthrough {
                level: 0.92,
                sustained_duration: Duration::from_secs(10),
            }).await?;
        }
        
        if cycle == 8 {
            println!("\n🫁 Achieving breath-field lock...");
            event_tx.send(BiometricEvent::BreathingCoherence {
                phase_lock: true,
            }).await?;
        }
        
        // Run kernel pulse
        {
            let mut kernel = kernel.lock().unwrap();
            kernel.pulse();
            
            // Process any sacred interrupts
            let teachings = kernel.process_sacred_interrupts();
            for teaching in teachings {
                println!("  📜 {}", teaching);
            }
        }
        
        println!();
        sleep(Duration::from_secs(2)).await;
    }
    
    // Demonstrate guided breathing session
    println!("\n🌬️  Starting guided coherent breathing session...");
    let mut breathing_guide = luminous_os::hardware::breath_sensor::BreathingGuide::new(
        SacredBreathPattern::Coherent,
        Duration::from_secs(30)
    );
    
    breathing_guide.add_phase_callback(|phase| {
        match phase {
            luminous_os::hardware::BreathPhase::Inhale => print!("🌬️  Inhale... "),
            luminous_os::hardware::BreathPhase::Pause => print!("⏸️  Hold... "),
            luminous_os::hardware::BreathPhase::Exhale => print!("💨 Exhale... "),
            luminous_os::hardware::BreathPhase::Rest => println!("🌟 Rest"),
        }
    });
    
    // Run guided session for 10 seconds
    let guide_handle = tokio::spawn(async move {
        breathing_guide.start_session().await;
    });
    
    sleep(Duration::from_secs(10)).await;
    
    println!("\n✨ Demo complete!");
    println!("\nKey achievements:");
    println!("  • Biometric sensors synchronized with consciousness vortices");
    println!("  • Heart coherence influenced vortex states");
    println!("  • Breath patterns synchronized with field momentum");
    println!("  • Quantum entanglements formed based on biometric resonance");
    println!("  • Sacred interrupts announced coherence breakthroughs");
    
    Ok(())
}

// Helper function to display a coherence meter
fn coherence_meter(coherence: f64) -> String {
    let filled = (coherence * 20.0) as usize;
    let empty = 20 - filled;
    format!("[{}{}]", "█".repeat(filled), "░".repeat(empty))
}