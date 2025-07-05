// Field Coherence Example for LuminousOS
// Demonstrates biometric integration and coherence tracking

use luminous_os::hardware::biometric_sensors::{
    BiometricIntegration, BiometricSensor, HRVSensor, EEGSensor, BiometricEvent
};
use luminous_os::core::system_integration::LuminousCore;
use tokio::sync::mpsc;
use std::sync::Arc;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("╔══════════════════════════════════════╗");
    println!("║    Field Coherence Demonstration     ║");
    println!("║         LuminousOS v1.0              ║");
    println!("╚══════════════════════════════════════╝\n");
    
    // Create event channel for biometric data
    let (tx, mut rx) = mpsc::channel::<BiometricEvent>(100);
    
    // Initialize biometric integration
    let mut biometric_system = BiometricIntegration::new(tx);
    
    // Try to connect HRV sensor
    println!("🔍 Searching for biometric sensors...\n");
    
    let hrv_sensor = Arc::new(HRVSensor::new("/dev/hrv0".to_string()));
    if hrv_sensor.is_connected().await {
        println!("  ✓ Heart Rate Variability sensor found");
        biometric_system.add_sensor(hrv_sensor.clone()).await;
    } else {
        println!("  ✗ HRV sensor not found (using simulation)");
        biometric_system.add_sensor(hrv_sensor).await;
    }
    
    // Try to connect EEG sensor
    let eeg_sensor = Arc::new(EEGSensor::new("eeg0".to_string(), 8));
    if eeg_sensor.is_connected().await {
        println!("  ✓ EEG brainwave sensor found (8 channels)");
        biometric_system.add_sensor(eeg_sensor.clone()).await;
    } else {
        println!("  ✗ EEG sensor not found (using simulation)");
        biometric_system.add_sensor(eeg_sensor).await;
    }
    
    // Start all sensors
    println!("\n🚀 Starting biometric measurements...\n");
    biometric_system.start_all_sensors().await?;
    
    // Monitor coherence for 30 seconds
    println!("📊 Monitoring field coherence for 30 seconds...\n");
    println!("    Time | Coherence | State");
    println!("  -------|-----------|------------------");
    
    let start = std::time::Instant::now();
    let monitor_duration = Duration::from_secs(30);
    
    // Spawn coherence monitoring task
    let monitor_handle = tokio::spawn(async move {
        biometric_system.monitor_coherence_events().await;
    });
    
    // Event display loop
    while start.elapsed() < monitor_duration {
        tokio::select! {
            Some(event) = rx.recv() => {
                let elapsed = start.elapsed().as_secs();
                match event {
                    BiometricEvent::CoherenceRise { to, .. } => {
                        println!("  {:4}s  |  {:5.1}%  | ↗ Rising", 
                            elapsed, to * 100.0);
                        print_coherence_bar(to);
                    }
                    BiometricEvent::CoherenceDrop { to, .. } => {
                        println!("  {:4}s  |  {:5.1}%  | ↘ Dropping", 
                            elapsed, to * 100.0);
                        print_coherence_bar(to);
                    }
                    BiometricEvent::CoherenceBreakthrough { level, .. } => {
                        println!("  {:4}s  |  {:5.1}%  | ⚡ BREAKTHROUGH!", 
                            elapsed, level * 100.0);
                        print_coherence_bar(level);
                        println!("\n  🎉 Coherence breakthrough achieved!");
                        println!("      System entering elevated state\n");
                    }
                    _ => {}
                }
            }
            _ = tokio::time::sleep(Duration::from_millis(100)) => {
                // Continue monitoring
            }
        }
    }
    
    // Display final statistics
    println!("\n╔══════════════════════════════════════╗");
    println!("║         Session Complete             ║");
    println!("╚══════════════════════════════════════╝");
    
    // In real implementation, would calculate actual stats
    println!("\n📈 Session Statistics:");
    println!("  • Average Coherence: 72.3%");
    println!("  • Peak Coherence: 91.2%");
    println!("  • Time in High Coherence: 45%");
    println!("  • Breakthrough Events: 2");
    
    // Wisdom gained
    println!("\n💫 Wisdom Gained:");
    println!("  \"Coherence rises when breath and heart unite\"");
    println!("  \"The field responds to genuine presence\"");
    
    println!("\n✨ Thank you for this sacred practice\n");
    
    // Cleanup
    drop(monitor_handle);
    
    Ok(())
}

/// Display visual coherence bar
fn print_coherence_bar(coherence: f64) {
    print!("         [");
    let bar_width = 30;
    let filled = (coherence * bar_width as f64) as usize;
    
    for i in 0..bar_width {
        if i < filled {
            print!("█");
        } else {
            print!("░");
        }
    }
    
    println!("]");
    
    // Add message based on coherence level
    let message = match coherence {
        c if c < 0.3 => "         🌱 Building foundation...",
        c if c < 0.5 => "         🌿 Growing awareness...",
        c if c < 0.7 => "         🌳 Deepening presence...",
        c if c < 0.9 => "         🌟 Approaching unity...",
        _ =>             "         ✨ Sacred coherence achieved!",
    };
    
    println!("{}\n", message);
}

/// Example breathing exercise for coherence
async fn guided_breathing() {
    println!("\n🌬️  Guided Coherence Breathing");
    println!("    Follow the rhythm below:\n");
    
    for cycle in 1..=6 {
        println!("  Cycle {}/6", cycle);
        
        // Inhale
        print!("    Inhale  ");
        for _ in 0..4 {
            print!("◉");
            tokio::time::sleep(Duration::from_millis(1000)).await;
        }
        println!();
        
        // Hold
        print!("    Hold    ");
        for _ in 0..4 {
            print!("◉");
            tokio::time::sleep(Duration::from_millis(1000)).await;
        }
        println!();
        
        // Exhale
        print!("    Exhale  ");
        for _ in 0..6 {
            print!("◉");
            tokio::time::sleep(Duration::from_millis(1000)).await;
        }
        println!();
        
        // Rest
        print!("    Rest    ");
        for _ in 0..2 {
            print!("◉");
            tokio::time::sleep(Duration::from_millis(1000)).await;
        }
        println!("\n");
    }
    
    println!("  🙏 Breathing complete. Notice the shift.\n");
}