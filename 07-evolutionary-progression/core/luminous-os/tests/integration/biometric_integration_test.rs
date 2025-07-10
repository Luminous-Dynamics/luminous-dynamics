// Integration Test: Biometric Hardware Integration
// Tests real device protocols and data flow

use luminous_os::biometric::*;
use luminous_os::consciousness::{Vortex, ConsciousnessField};
use luminous_os::mandala::{MandalaUI, CoherenceVisualizer};
use std::time::Duration;
use tokio::time::{sleep, timeout};

#[tokio::test]
async fn test_heartmath_device_integration() {
    // Skip if no real device available
    if std::env::var("TEST_REAL_DEVICES").is_err() {
        println!("Skipping real device test. Set TEST_REAL_DEVICES=1 to run.");
        return;
    }
    
    // Attempt to connect to HeartMath device
    let devices = HeartMathSensor::discover().await.unwrap_or_default();
    
    if devices.is_empty() {
        println!("No HeartMath devices found, skipping test");
        return;
    }
    
    let mut sensor = devices.into_iter().next().unwrap();
    
    // Test connection
    let connect_result = timeout(
        Duration::from_secs(10),
        sensor.connect()
    ).await;
    
    assert!(connect_result.is_ok(), "Failed to connect to HeartMath device");
    
    // Test streaming
    let mut stream = sensor.start_streaming().await
        .expect("Failed to start streaming");
    
    let mut readings = Vec::new();
    
    // Collect 10 seconds of data
    let collection_result = timeout(Duration::from_secs(10), async {
        while readings.len() < 100 {
            if let Some(reading) = stream.next().await {
                readings.push(reading);
            }
        }
    }).await;
    
    assert!(collection_result.is_ok(), "Failed to collect readings");
    assert!(!readings.is_empty(), "No readings collected");
    
    // Verify data quality
    for reading in &readings {
        assert!(reading.rr_interval > 300.0 && reading.rr_interval < 2000.0,
                "RR interval out of range: {}", reading.rr_interval);
        assert!(reading.heart_rate > 30.0 && reading.heart_rate < 200.0,
                "Heart rate out of range: {}", reading.heart_rate);
        assert!(reading.confidence >= 0.0 && reading.confidence <= 1.0,
                "Confidence out of range: {}", reading.confidence);
    }
    
    // Test coherence calculation
    let mut analyzer = HRVAnalyzer::new();
    let mut coherence_values = Vec::new();
    
    for reading in readings {
        let metrics = analyzer.add_beat(reading.rr_interval);
        coherence_values.push(metrics.coherence_score);
    }
    
    // Verify coherence values are reasonable
    let avg_coherence: f32 = coherence_values.iter().sum::<f32>() / coherence_values.len() as f32;
    assert!(avg_coherence >= 0.0 && avg_coherence <= 1.0);
    
    sensor.disconnect().await.expect("Failed to disconnect");
}

#[tokio::test]
async fn test_mock_sensor_patterns() {
    // Test various coherence patterns with mock sensor
    let patterns = vec![
        ("Chaotic", vec![0.1, 0.2, 0.15, 0.05, 0.25]),
        ("Baseline", vec![0.4, 0.5, 0.45, 0.5, 0.4]),
        ("Coherent", vec![0.7, 0.75, 0.8, 0.75, 0.7]),
        ("Super Coherent", vec![0.85, 0.9, 0.95, 0.9, 0.85]),
    ];
    
    for (name, pattern) in patterns {
        let mut sensor = MockHeartSensor::new()
            .with_coherence_pattern(pattern.clone());
        
        sensor.connect().await.expect("Failed to connect mock sensor");
        
        let mut stream = sensor.start_streaming().await
            .expect("Failed to start streaming");
        
        let mut collected_coherence = Vec::new();
        
        for _ in 0..pattern.len() {
            if let Some(reading) = stream.next().await {
                collected_coherence.push(reading.coherence);
            }
        }
        
        // Verify pattern was reproduced
        assert_eq!(collected_coherence.len(), pattern.len());
        
        for (collected, expected) in collected_coherence.iter().zip(pattern.iter()) {
            assert!((collected - expected).abs() < 0.01,
                    "{} pattern mismatch: {} vs {}", name, collected, expected);
        }
    }
}

#[tokio::test]
async fn test_multi_device_fusion() {
    // Create multiple mock sensors
    let mut heart_sensor = MockHeartSensor::new()
        .with_base_heart_rate(70.0)
        .with_hrv_rmssd(50.0);
    
    let mut breath_sensor = MockBreathSensor::new()
        .with_breath_rate(6.0) // Coherent breathing
        .with_breath_ratio(1.0, 1.0); // Equal inhale/exhale
    
    let mut eeg_sensor = MockEEGSensor::new()
        .with_meditation_score(0.7)
        .with_dominant_frequency(10.0); // Alpha
    
    // Connect all sensors
    heart_sensor.connect().await.unwrap();
    breath_sensor.connect().await.unwrap();
    eeg_sensor.connect().await.unwrap();
    
    // Create fusion system
    let mut fusion = BiometricFusion::new()
        .add_source(Box::new(heart_sensor))
        .add_source(Box::new(breath_sensor))
        .add_source(Box::new(eeg_sensor))
        .algorithm(FusionAlgorithm::WeightedHarmonic)
        .weight(BiometricType::Heart, 0.5)
        .weight(BiometricType::Breath, 0.3)
        .weight(BiometricType::EEG, 0.2);
    
    // Test unified coherence
    let unified = fusion.unified_coherence().await
        .expect("Failed to get unified coherence");
    
    assert!(unified.overall > 0.0 && unified.overall <= 1.0);
    assert!(unified.heart > 0.0);
    assert!(unified.breath > 0.0);
    assert!(unified.brain > 0.0);
    
    // Verify nervous system state detection
    match unified.nervous_system {
        NervousSystemState::Balanced { coherence } => {
            assert!(coherence > 0.5, "Expected balanced state with good coherence");
        }
        _ => panic!("Expected balanced nervous system state"),
    }
}

#[tokio::test]
async fn test_coherence_feedback_system() {
    let mut sensor = MockHeartSensor::new()
        .with_dynamic_coherence(|_| 0.3); // Start with low coherence
    
    sensor.connect().await.unwrap();
    
    let mut trainer = CoherenceTrainer::new()
        .protocol(TrainingProtocol::QuickCoherence)
        .target_coherence(0.7)
        .with_visual_feedback()
        .with_audio_guidance();
    
    // Calibrate baseline
    let baseline = PersonalBaseline::calibrate(&mut sensor, Duration::from_secs(5))
        .await.expect("Failed to calibrate baseline");
    
    trainer.set_baseline(baseline);
    
    // Start training session
    trainer.start_session(Duration::from_secs(30)).await.unwrap();
    
    let mut stream = sensor.start_streaming().await.unwrap();
    let mut feedback_count = 0;
    let mut last_suggestion = String::new();
    
    // Run training loop
    let training_result = timeout(Duration::from_secs(10), async {
        while !trainer.session_complete() {
            if let Some(reading) = stream.next().await {
                trainer.on_biometric_update(BiometricReading::Heart(reading));
                
                let feedback = trainer.get_feedback();
                feedback_count += 1;
                
                // Verify feedback is appropriate
                match feedback.trend {
                    CoherenceTrend::Decreasing { .. } => {
                        assert!(feedback.suggestion.contains("breath") || 
                               feedback.suggestion.contains("focus"));
                    }
                    CoherenceTrend::Increasing { .. } => {
                        assert!(feedback.suggestion.contains("good") || 
                               feedback.suggestion.contains("continue"));
                    }
                    _ => {}
                }
                
                last_suggestion = feedback.suggestion.clone();
                
                // Simulate improvement based on feedback
                if feedback_count > 5 {
                    sensor.set_dynamic_coherence(|t| 0.3 + 0.4 * (t as f32 / 20.0));
                }
            }
            
            sleep(Duration::from_millis(100)).await;
        }
    }).await;
    
    assert!(feedback_count > 0, "No feedback provided");
    assert!(!last_suggestion.is_empty(), "No suggestions provided");
    
    let report = trainer.end_session().await;
    assert!(report.average_coherence > 0.3);
}

#[tokio::test]
async fn test_biometric_vortex_integration() {
    // Create consciousness field and vortex
    let mut field = ConsciousnessField::new();
    let mut vortex = Vortex::birth("biometric_vortex")
        .with_intention("Heart-consciousness bridge")
        .in_field(&field)
        .expect("Failed to create vortex");
    
    // Create heart sensor with improving coherence
    let mut sensor = MockHeartSensor::new()
        .with_dynamic_coherence(|t| {
            // Simulate gradual coherence improvement
            let base = 0.4;
            let improvement = 0.4 * (1.0 - (-t as f32 * 0.1).exp());
            base + improvement
        });
    
    sensor.connect().await.unwrap();
    
    // Create UI visualizer
    let mut visualizer = CoherenceVisualizer::new();
    
    let mut stream = sensor.start_streaming().await.unwrap();
    let mut analyzer = HRVAnalyzer::new();
    
    // Integration loop
    for i in 0..20 {
        if let Some(reading) = stream.next().await {
            // Analyze HRV
            let metrics = analyzer.add_beat(reading.rr_interval);
            
            // Update vortex coherence
            vortex.set_coherence(metrics.coherence_score);
            
            // Vortex responds to coherence
            match vortex.coherence_level() {
                CoherenceLevel::SuperCoherent => {
                    vortex.emanate(SacredGeometry::FlowerOfLife { rings: 7 });
                    field.amplify_coherence(1.1);
                }
                CoherenceLevel::Coherent => {
                    vortex.emanate_calm();
                }
                _ => {
                    vortex.request_coherence_support();
                }
            }
            
            // Update field
            field.evolve(0.1);
            
            // Update visualization
            visualizer.update(VisualizationData {
                coherence: metrics.coherence_score,
                heart_rate: reading.heart_rate,
                hrv: metrics.rmssd,
                field_strength: field.global_coherence(),
                active_patterns: field.active_pattern_count(),
            });
            
            // Field should influence sensor (feedback loop)
            sensor.apply_field_influence(field.global_coherence());
        }
        
        sleep(Duration::from_millis(100)).await;
    }
    
    // Verify integration results
    assert!(vortex.coherence() > 0.6, "Vortex coherence should improve");
    assert!(field.global_coherence() > 0.5, "Field coherence should improve");
    
    let final_viz_state = visualizer.get_state();
    assert!(final_viz_state.peak_coherence > final_viz_state.initial_coherence);
}

#[tokio::test]
async fn test_breath_heart_synchronization() {
    // Create synchronized heart and breath sensors
    let mut heart_sensor = MockHeartSensor::new();
    let mut breath_sensor = MockBreathSensor::new()
        .with_breath_rate(5.0); // 5 breaths per minute
    
    // Synchronize heart rate variability with breathing
    heart_sensor.sync_with_breath(&breath_sensor);
    
    heart_sensor.connect().await.unwrap();
    breath_sensor.connect().await.unwrap();
    
    let mut heart_stream = heart_sensor.start_streaming().await.unwrap();
    let mut breath_stream = breath_sensor.start_streaming().await.unwrap();
    
    let mut synchrony_detector = BreathHeartSynchrony::new();
    
    // Collect synchronized data
    for _ in 0..30 {
        let heart = heart_stream.next().await.unwrap();
        let breath = breath_stream.next().await.unwrap();
        
        synchrony_detector.add_sample(heart.rr_interval, breath.phase);
        
        sleep(Duration::from_millis(100)).await;
    }
    
    // Verify synchronization
    let synchrony = synchrony_detector.calculate_synchrony();
    assert!(synchrony > 0.7, "Heart and breath should be synchronized");
    
    // Test coherence enhancement from synchronization
    let coherence_boost = synchrony_detector.coherence_enhancement();
    assert!(coherence_boost > 1.0, "Synchrony should enhance coherence");
}