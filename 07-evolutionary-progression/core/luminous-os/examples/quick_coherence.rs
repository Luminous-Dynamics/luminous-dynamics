// Quick Coherence Example
// Simple heart coherence training application

use luminous_os::biometric::{HeartSensor, MockHeartSensor, CoherenceTrainer, TrainingProtocol};
use luminous_os::consciousness::{Vortex, ConsciousnessField};
use luminous_os::sacred::SacredGeometry;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("💗 LuminousOS Quick Coherence Trainer 💗\n");
    
    // Initialize consciousness field
    let mut field = ConsciousnessField::new();
    
    // Birth helper vortex
    let mut vortex = Vortex::birth("coherence_guide")
        .with_intention("Support heart coherence training")
        .in_field(&field)?;
    
    // Connect heart sensor (or use mock)
    let mut sensor = connect_heart_sensor().await?;
    
    // Create coherence trainer
    let mut trainer = CoherenceTrainer::new()
        .protocol(TrainingProtocol::QuickCoherence)
        .target_coherence(0.7)
        .with_visual_feedback()
        .with_breath_pacer();
    
    println!("Starting 5-minute coherence session...\n");
    println!("Instructions:");
    println!("1. Focus your attention on your heart area");
    println!("2. Breathe slowly and deeply");
    println!("3. Activate a positive feeling (gratitude, compassion)");
    println!("\nPress Ctrl+C to end session early\n");
    
    // Start training session
    trainer.start_session(Duration::from_secs(300)).await?;
    
    let mut stream = sensor.start_streaming().await?;
    let start_time = std::time::Instant::now();
    
    while let Some(reading) = stream.next().await {
        // Update trainer with biometric data
        trainer.on_biometric_update(BiometricReading::Heart(reading.clone()));
        
        // Get feedback
        let feedback = trainer.get_feedback();
        
        // Update vortex coherence
        vortex.set_coherence(reading.coherence);
        
        // Display feedback
        display_feedback(&feedback, &reading);
        
        // Vortex responds to coherence
        if reading.coherence > 0.7 {
            vortex.emanate(SacredGeometry::FlowerOfLife { rings: 3 });
            field.amplify_coherence(1.05);
        }
        
        // Check if session complete
        if trainer.session_complete() || start_time.elapsed() > Duration::from_secs(300) {
            break;
        }
        
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
    
    // Get session report
    let report = trainer.end_session().await;
    
    println!("\n=== Session Complete ===");
    println!("Average Coherence: {:.2}", report.average_coherence);
    println!("Peak Coherence: {:.2}", report.peak_coherence);
    println!("Time in Coherence: {:?}", report.time_in_coherence);
    println!("Achievement Points: {}", report.achievement_points);
    
    if report.average_coherence > 0.6 {
        println!("\n✨ Great job! You maintained good coherence.");
    }
    
    Ok(())
}

async fn connect_heart_sensor() -> Result<Box<dyn HeartSensor>, Box<dyn std::error::Error>> {
    // Try to find real sensor
    match HeartSensor::discover_any().await {
        Ok(sensor) => {
            println!("Found heart sensor: {}", sensor.name());
            sensor.connect().await?;
            Ok(Box::new(sensor))
        }
        Err(_) => {
            println!("No physical sensor found. Using simulated data.");
            println!("For best results, connect a HeartMath or Polar device.\n");
            
            // Create realistic mock sensor
            let mock = MockHeartSensor::new()
                .with_base_heart_rate(70.0)
                .with_hrv_rmssd(40.0)
                .with_dynamic_coherence(|t| {
                    // Simulate gradual coherence improvement with practice
                    let base = 0.3;
                    let practice_effect = 0.4 * (1.0 - (-t as f32 * 0.02).exp());
                    let breathing_effect = 0.2 * ((t as f32 * 0.1).sin() + 1.0) / 2.0;
                    
                    (base + practice_effect + breathing_effect).min(0.95)
                });
            
            Ok(Box::new(mock))
        }
    }
}

fn display_feedback(feedback: &CoherenceFeedback, reading: &HeartReading) {
    // Clear line and display current status
    print!("\r");
    
    // Heart rate and coherence
    print!("❤️ {} bpm | ", reading.heart_rate as u32);
    
    // Coherence bar
    let coherence_bar = create_coherence_bar(feedback.current_coherence);
    print!("{} {:.2} | ", coherence_bar, feedback.current_coherence);
    
    // Trend indicator
    let trend = match feedback.trend {
        CoherenceTrend::Increasing { rate } => format!("↗️ +{:.1}%", rate * 100.0),
        CoherenceTrend::Stable => "➡️ Stable".to_string(),
        CoherenceTrend::Decreasing { rate } => format!("↘️ -{:.1}%", rate * 100.0),
    };
    print!("{} | ", trend);
    
    // Breathing guide
    if let VisualGuide::BreathingBall { inhale_time, exhale_time } = &feedback.visual_guide {
        let phase = get_breath_phase(*inhale_time, *exhale_time);
        print!("{}", phase);
    }
    
    // Flush to ensure immediate display
    use std::io::{self, Write};
    io::stdout().flush().unwrap();
}

fn create_coherence_bar(coherence: f32) -> String {
    let filled = (coherence * 10.0) as usize;
    let empty = 10 - filled;
    
    let bar = "█".repeat(filled) + &"░".repeat(empty);
    
    // Color coding (using unicode)
    if coherence < 0.4 {
        format!("🔴 [{}]", bar)
    } else if coherence < 0.7 {
        format!("🟡 [{}]", bar)
    } else {
        format!("🟢 [{}]", bar)
    }
}

fn get_breath_phase(inhale_time: f32, exhale_time: f32) -> &'static str {
    let cycle_time = inhale_time + exhale_time;
    let phase = (std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs_f32() % cycle_time) / cycle_time;
    
    if phase < inhale_time / cycle_time {
        "🫁 Inhale...  "
    } else {
        "💨 Exhale... "
    }
}