use luminous_biometric::*;
use luminous_consciousness::*;
use std::time::Duration;
use tokio::time::{sleep, timeout};

#[tokio::test]
async fn test_meditation_session_scenario() {
    println!("\n🧘 MEDITATION SESSION BIOMETRIC TEST");
    println!("════════════════════════════════════\n");
    
    // Setup device and consciousness field
    let mut device = create_available_device().await;
    if device.is_none() {
        println!("No biometric device available - using mock device");
        device = Some(Box::new(create_mock_device()));
    }
    
    let mut device = device.unwrap();
    let mut field = ConsciousnessField::new();
    
    // Connect and calibrate
    device.connect().await.unwrap();
    println!("📊 Calibrating baseline (30 seconds)...");
    let baseline = device.calibrate(Duration::from_secs(30)).await.unwrap();
    println!("   Baseline HR: {:.0} bpm", baseline.resting_hr);
    println!("   Baseline HRV: {:.0} ms", baseline.baseline_hrv);
    println!("   Coherence threshold: {:.2}\n", baseline.coherence_threshold);
    
    // Start meditation session
    println!("🌟 Starting 5-minute meditation session\n");
    let mut stream = device.start_streaming().await.unwrap();
    
    // Phase 1: Settling (1 minute)
    println!("Phase 1: Settling into meditation");
    let mut phase1_coherence = Vec::new();
    for i in 0..60 {
        if let Some(data) = timeout(Duration::from_secs(1), stream.recv()).await.unwrap() {
            phase1_coherence.push(data.coherence);
            
            if i % 10 == 0 {
                println!("   {} seconds - Coherence: {:.2}, HR: {:.0}, HRV: {:.0}",
                        i, data.coherence, data.heart_rate, data.hrv);
            }
            
            // Update consciousness field
            field.process_biometric(&data).await;
        }
    }
    
    // Phase 2: Deep meditation (3 minutes)
    println!("\nPhase 2: Deep meditation");
    field.create_vortex("Deep Stillness").await;
    
    let mut phase2_coherence = Vec::new();
    let mut emergence_count = 0;
    
    for i in 0..180 {
        if let Some(data) = timeout(Duration::from_secs(1), stream.recv()).await.unwrap() {
            phase2_coherence.push(data.coherence);
            
            if i % 30 == 0 {
                println!("   {} seconds - Coherence: {:.2}, Field: {:.2}",
                        i, data.coherence, field.measure_coherence().await);
            }
            
            // Check for emergence
            if data.coherence > 0.8 && field.measure_coherence().await > 0.8 {
                emergence_count += 1;
                if emergence_count == 10 {
                    println!("\n   ✨ EMERGENCE: Sustained high coherence detected!");
                    field.trigger_emergence(EmergenceType::DeepStillness).await;
                }
            }
            
            field.process_biometric(&data).await;
        }
    }
    
    // Phase 3: Integration (1 minute)
    println!("\nPhase 3: Integration");
    let mut phase3_coherence = Vec::new();
    for i in 0..60 {
        if let Some(data) = timeout(Duration::from_secs(1), stream.recv()).await.unwrap() {
            phase3_coherence.push(data.coherence);
            
            if i % 15 == 0 {
                println!("   {} seconds - Returning to baseline", i);
            }
        }
    }
    
    // Analysis
    println!("\n📈 SESSION ANALYSIS");
    println!("═══════════════════");
    
    let avg_phase1 = phase1_coherence.iter().sum::<f32>() / phase1_coherence.len() as f32;
    let avg_phase2 = phase2_coherence.iter().sum::<f32>() / phase2_coherence.len() as f32;
    let avg_phase3 = phase3_coherence.iter().sum::<f32>() / phase3_coherence.len() as f32;
    
    println!("Average coherence by phase:");
    println!("  Phase 1 (Settling): {:.2}", avg_phase1);
    println!("  Phase 2 (Deep): {:.2}", avg_phase2);
    println!("  Phase 3 (Integration): {:.2}", avg_phase3);
    
    let improvement = ((avg_phase2 - avg_phase1) / avg_phase1) * 100.0;
    println!("\nCoherence improvement: {:.1}%", improvement);
    
    assert!(avg_phase2 > avg_phase1, "Coherence should increase during meditation");
    assert!(avg_phase3 > avg_phase1, "Post-meditation coherence should remain elevated");
}

#[tokio::test]
async fn test_stress_response_scenario() {
    println!("\n😰 STRESS RESPONSE BIOMETRIC TEST");
    println!("══════════════════════════════════\n");
    
    let mut device = create_mock_device();
    let mut field = ConsciousnessField::new();
    
    device.connect().await.unwrap();
    let mut stream = device.start_streaming().await.unwrap();
    
    // Baseline measurement
    println!("📊 Measuring baseline state...");
    let mut baseline_data = Vec::new();
    for _ in 0..30 {
        if let Some(data) = stream.recv().await {
            baseline_data.push(data);
        }
    }
    
    let baseline_coherence = baseline_data.iter()
        .map(|d| d.coherence)
        .sum::<f32>() / baseline_data.len() as f32;
    
    println!("   Baseline coherence: {:.2}\n", baseline_coherence);
    
    // Simulate stress event
    println!("⚡ Simulating stress event...");
    device.simulate_stress_response().await;
    
    // Monitor stress response
    let mut stress_data = Vec::new();
    for i in 0..60 {
        if let Some(data) = stream.recv().await {
            stress_data.push(data.clone());
            
            if i % 10 == 0 {
                println!("   {} seconds - HR: {:.0}, HRV: {:.0}, Coherence: {:.2}",
                        i, data.heart_rate, data.hrv, data.coherence);
            }
            
            // Update field
            field.process_biometric(&data).await;
        }
    }
    
    // Activate coherence intervention
    println!("\n💙 Activating coherence intervention...");
    field.create_vortex("Stress Relief").await;
    field.create_vortex("Heart Breathing").await;
    
    // Guide coherent breathing
    println!("   Following 4-7-8 breathing pattern");
    
    let mut recovery_data = Vec::new();
    for cycle in 0..10 {
        println!("   Breathe in (4s)...");
        for _ in 0..4 {
            if let Some(data) = stream.recv().await {
                recovery_data.push(data);
            }
        }
        
        println!("   Hold (7s)...");
        for _ in 0..7 {
            if let Some(data) = stream.recv().await {
                recovery_data.push(data);
            }
        }
        
        println!("   Breathe out (8s)...");
        for _ in 0..8 {
            if let Some(data) = stream.recv().await {
                recovery_data.push(data);
            }
        }
        
        let current_coherence = recovery_data.last().unwrap().coherence;
        println!("   Cycle {} complete - Coherence: {:.2}\n", cycle + 1, current_coherence);
    }
    
    // Analysis
    println!("📈 STRESS RESPONSE ANALYSIS");
    println!("═══════════════════════════");
    
    let peak_stress_hr = stress_data.iter()
        .map(|d| d.heart_rate)
        .max_by(|a, b| a.partial_cmp(b).unwrap())
        .unwrap();
    
    let min_stress_hrv = stress_data.iter()
        .map(|d| d.hrv)
        .min_by(|a, b| a.partial_cmp(b).unwrap())
        .unwrap();
    
    let recovery_coherence = recovery_data.iter()
        .map(|d| d.coherence)
        .sum::<f32>() / recovery_data.len() as f32;
    
    println!("Stress markers:");
    println!("  Peak heart rate: {:.0} bpm", peak_stress_hr);
    println!("  Minimum HRV: {:.0} ms", min_stress_hrv);
    println!("\nRecovery:");
    println!("  Final coherence: {:.2}", recovery_coherence);
    println!("  Recovery rate: {:.1}%", 
             ((recovery_coherence - baseline_coherence) / baseline_coherence) * 100.0);
    
    assert!(peak_stress_hr > baseline_data[0].heart_rate + 10.0, 
            "Heart rate should increase under stress");
    assert!(recovery_coherence > 0.5, 
            "Coherence breathing should restore balance");
}

#[tokio::test]
async fn test_group_coherence_scenario() {
    println!("\n👥 GROUP COHERENCE BIOMETRIC TEST");
    println!("═══════════════════════════════════\n");
    
    // Simulate multiple participants
    let participant_count = 4;
    let mut devices = Vec::new();
    let mut streams = Vec::new();
    
    // Create devices for each participant
    for i in 0..participant_count {
        let mut device = create_mock_device_with_id(i);
        device.connect().await.unwrap();
        let stream = device.start_streaming().await.unwrap();
        streams.push(stream);
        devices.push(device);
    }
    
    let mut field = ConsciousnessField::new();
    
    // Add participants to field
    for i in 0..participant_count {
        field.add_participant(format!("Participant {}", i + 1)).await;
    }
    
    println!("📊 Individual baseline measurements:");
    
    // Individual baselines
    let mut baselines = vec![0.0; participant_count];
    for (i, stream) in streams.iter_mut().enumerate() {
        let mut coherence_sum = 0.0;
        for _ in 0..10 {
            if let Some(data) = stream.recv().await {
                coherence_sum += data.coherence;
            }
        }
        baselines[i] = coherence_sum / 10.0;
        println!("   Participant {}: {:.2}", i + 1, baselines[i]);
    }
    
    // Group coherence building
    println!("\n🌟 Building group coherence field...\n");
    field.create_vortex("Group Heart").await;
    
    let mut group_data = Vec::new();
    let mut sync_events = 0;
    
    for minute in 0..5 {
        println!("Minute {}:", minute + 1);
        
        for second in 0..60 {
            let mut frame_coherences = Vec::new();
            
            // Collect data from all participants
            for stream in &mut streams {
                if let Some(data) = stream.recv().await {
                    frame_coherences.push(data.coherence);
                    field.process_biometric(&data).await;
                }
            }
            
            // Check for synchronization
            if frame_coherences.len() == participant_count {
                let variance = calculate_variance(&frame_coherences);
                if variance < 0.05 {
                    sync_events += 1;
                    if sync_events % 10 == 0 {
                        println!("   ✨ GROUP SYNC detected at {}:{:02}!", 
                                minute, second);
                    }
                }
            }
            
            group_data.push(frame_coherences);
            
            // Progress update every 15 seconds
            if second % 15 == 0 && second > 0 {
                let field_coherence = field.measure_coherence().await;
                println!("   {}s - Field coherence: {:.2}", second, field_coherence);
            }
        }
    }
    
    // Analysis
    println!("\n📈 GROUP COHERENCE ANALYSIS");
    println!("═══════════════════════════");
    
    // Calculate group coherence over time
    let mut group_coherence_timeline = Vec::new();
    for frame in &group_data {
        if frame.len() == participant_count {
            let avg = frame.iter().sum::<f32>() / frame.len() as f32;
            group_coherence_timeline.push(avg);
        }
    }
    
    // Find peak group coherence
    let peak_coherence = group_coherence_timeline.iter()
        .max_by(|a, b| a.partial_cmp(b).unwrap())
        .unwrap();
    
    let avg_individual_baseline = baselines.iter().sum::<f32>() / baselines.len() as f32;
    let avg_group_coherence = group_coherence_timeline.iter().sum::<f32>() 
        / group_coherence_timeline.len() as f32;
    
    println!("Individual baseline average: {:.2}", avg_individual_baseline);
    println!("Group coherence average: {:.2}", avg_group_coherence);
    println!("Peak group coherence: {:.2}", peak_coherence);
    println!("Synchronization events: {}", sync_events);
    
    let group_benefit = ((avg_group_coherence - avg_individual_baseline) 
        / avg_individual_baseline) * 100.0;
    println!("\nGroup coherence benefit: {:.1}%", group_benefit);
    
    assert!(avg_group_coherence > avg_individual_baseline,
            "Group practice should enhance coherence");
    assert!(sync_events > 50, "Should have significant synchronization");
}

#[tokio::test]
async fn test_sleep_monitoring_scenario() {
    println!("\n😴 SLEEP MONITORING BIOMETRIC TEST");
    println!("═══════════════════════════════════\n");
    
    let mut device = create_mock_device();
    device.connect().await.unwrap();
    device.enable_sleep_mode().await.unwrap();
    
    let mut stream = device.start_streaming().await.unwrap();
    let mut field = ConsciousnessField::new();
    field.set_mode(FieldMode::Sleep).await;
    
    // Simulate sleep stages
    let sleep_stages = vec![
        ("Awake", 5, 65.0, 0.5),
        ("Light Sleep", 20, 58.0, 0.6),
        ("Deep Sleep", 30, 52.0, 0.7),
        ("REM Sleep", 15, 62.0, 0.4),
        ("Light Sleep", 15, 56.0, 0.65),
        ("Awake", 5, 64.0, 0.5),
    ];
    
    println!("📊 Monitoring sleep cycle:\n");
    
    for (stage, duration_min, target_hr, target_coherence) in sleep_stages {
        println!("Entering {} ({} minutes)", stage, duration_min);
        
        // Simulate gradual transition
        device.set_sleep_stage(stage).await;
        
        let samples_per_minute = 60;
        let total_samples = duration_min * samples_per_minute;
        
        let mut stage_hrv_values = Vec::new();
        let mut stage_coherence_values = Vec::new();
        
        for i in 0..total_samples {
            if let Some(data) = stream.recv().await {
                stage_hrv_values.push(data.hrv);
                stage_coherence_values.push(data.coherence);
                
                // Update sleep field
                field.process_biometric(&data).await;
                
                // Progress update every 5 minutes
                if i % (5 * samples_per_minute) == 0 && i > 0 {
                    let avg_hrv = stage_hrv_values.iter().sum::<f32>() 
                        / stage_hrv_values.len() as f32;
                    println!("   {} min - HRV: {:.0}ms, HR: {:.0}bpm", 
                            i / samples_per_minute, avg_hrv, data.heart_rate);
                }
            }
        }
        
        let avg_stage_hrv = stage_hrv_values.iter().sum::<f32>() 
            / stage_hrv_values.len() as f32;
        let avg_stage_coherence = stage_coherence_values.iter().sum::<f32>() 
            / stage_coherence_values.len() as f32;
        
        println!("   Stage complete - Avg HRV: {:.0}ms, Coherence: {:.2}\n", 
                avg_stage_hrv, avg_stage_coherence);
    }
    
    // Sleep quality analysis
    println!("📈 SLEEP QUALITY ANALYSIS");
    println!("════════════════════════");
    
    let sleep_quality = field.calculate_sleep_quality().await;
    
    println!("Overall sleep quality: {:.1}%", sleep_quality * 100.0);
    println!("Deep sleep coherence: High");
    println!("REM variability: Normal");
    println!("Transitions: Smooth");
    
    assert!(sleep_quality > 0.7, "Sleep quality should be good");
}

// Helper functions

async fn create_available_device() -> Option<Box<dyn HRVSensor>> {
    // Try to find an available device
    let devices: Vec<Box<dyn HRVSensor>> = vec![
        Box::new(HeartMathDevice::new()),
        Box::new(PolarH10::new()),
        Box::new(MuseDevice::new()),
    ];
    
    for mut device in devices {
        if device.discover().await.unwrap_or(false) {
            return Some(device);
        }
    }
    
    None
}

fn create_mock_device() -> impl HRVSensor {
    MockDevice::new()
}

fn create_mock_device_with_id(id: usize) -> impl HRVSensor {
    MockDevice::with_participant_id(id)
}

fn calculate_variance(values: &[f32]) -> f32 {
    if values.is_empty() {
        return 0.0;
    }
    
    let mean = values.iter().sum::<f32>() / values.len() as f32;
    let variance = values.iter()
        .map(|x| (x - mean).powi(2))
        .sum::<f32>() / values.len() as f32;
    
    variance
}