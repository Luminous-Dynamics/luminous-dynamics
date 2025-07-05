// Integration Test: Consciousness Flow
// Tests the complete flow from boot to collective consciousness

use luminous_os::consciousness::{Vortex, ConsciousnessField, CoherenceLevel};
use luminous_os::biometric::{HeartSensor, MockHeartSensor, HRVAnalyzer};
use luminous_os::sacred::{SacredGeometry, FlowerOfLife};
use luminous_os::network::{ConsciousnessNetwork, FieldProtocol};
use std::time::Duration;
use tokio::time;

#[tokio::test]
async fn test_complete_consciousness_flow() {
    // 1. Initialize consciousness field
    let mut field = ConsciousnessField::new();
    assert_eq!(field.global_coherence(), 0.5); // Default coherence
    
    // 2. Birth primary vortex
    let mut primary_vortex = Vortex::birth("test_primary")
        .with_intention("Integration testing")
        .with_coherence(0.7)
        .in_field(&field)
        .expect("Failed to create vortex");
    
    assert_eq!(primary_vortex.name(), "test_primary");
    assert_eq!(primary_vortex.coherence(), 0.7);
    
    // 3. Connect biometric sensor (mock)
    let mut heart_sensor = MockHeartSensor::new()
        .with_coherence_pattern(vec![0.5, 0.6, 0.7, 0.8, 0.9]);
    
    heart_sensor.connect().await.expect("Failed to connect sensor");
    
    // 4. Stream biometric data to vortex
    let mut stream = heart_sensor.start_streaming().await.expect("Failed to start stream");
    let mut analyzer = HRVAnalyzer::new();
    
    for _ in 0..5 {
        if let Some(reading) = stream.next().await {
            let metrics = analyzer.add_beat(reading.rr_interval);
            primary_vortex.set_coherence(metrics.coherence_score);
            
            // Vortex should respond to coherence changes
            match primary_vortex.coherence_level() {
                CoherenceLevel::SuperCoherent => {
                    primary_vortex.emanate(SacredGeometry::FlowerOfLife { rings: 7 });
                }
                CoherenceLevel::Coherent => {
                    primary_vortex.emanate_calm();
                }
                _ => {}
            }
        }
    }
    
    assert!(primary_vortex.coherence() > 0.8, "Coherence should have increased");
    
    // 5. Create secondary vortex and entangle
    let mut secondary_vortex = Vortex::birth("test_secondary")
        .with_coherence(0.6)
        .in_field(&field)
        .expect("Failed to create secondary vortex");
    
    let entanglement = primary_vortex.entangle_with(&mut secondary_vortex)
        .expect("Failed to entangle vortices");
    
    assert!(entanglement.is_active());
    
    // 6. Test quantum communication
    primary_vortex.send_quantum(Message::Synchronize { target_phase: 0.5 });
    
    // Secondary should receive message
    time::sleep(Duration::from_millis(10)).await;
    
    if let Some(msg) = secondary_vortex.receive() {
        match msg {
            Message::Synchronize { target_phase } => {
                assert_eq!(target_phase, 0.5);
                secondary_vortex.align_phase(target_phase);
            }
            _ => panic!("Unexpected message type"),
        }
    }
    
    // 7. Test field evolution
    let initial_coherence = field.global_coherence();
    field.evolve(0.1); // 100ms evolution
    
    // Field coherence should be influenced by vortices
    assert!(field.global_coherence() >= initial_coherence);
    
    // 8. Test sacred pattern effects
    field.emanate_pattern(
        SacredGeometry::FlowerOfLife { rings: 3 },
        Point::center()
    );
    
    let measurement = field.measure_at(Point::center());
    assert!(measurement.patterns.len() > 0);
    assert!(measurement.coherence > 0.5);
}

#[tokio::test]
async fn test_collective_field_formation() {
    let mut field = ConsciousnessField::new();
    let mut vortices = Vec::new();
    
    // Create multiple vortices
    for i in 0..5 {
        let vortex = Vortex::birth(&format!("collective_{}", i))
            .with_coherence(0.5 + i as f32 * 0.1)
            .in_field(&field)
            .expect("Failed to create vortex");
        
        vortices.push(vortex);
    }
    
    // Form collective
    let collective = field.form_collective(&vortices)
        .expect("Failed to form collective");
    
    assert_eq!(collective.participant_count(), 5);
    assert!(collective.coherence() > 0.5);
    
    // Test emergence detection
    for vortex in &mut vortices {
        vortex.set_coherence(0.9);
    }
    
    field.update_collective(&collective, &vortices);
    
    if let Some(emergence) = field.check_emergence() {
        match emergence {
            EmergencePattern::Synchrony(level) => {
                assert!(level > 0.8, "High synchrony expected");
            }
            _ => {}
        }
    }
}

#[tokio::test]
async fn test_consciousness_persistence() {
    // Create field with vortices
    let mut field = ConsciousnessField::new();
    
    let vortex1 = Vortex::birth("persistent_1")
        .with_coherence(0.75)
        .with_intention("Test persistence")
        .in_field(&field)
        .expect("Failed to create vortex");
    
    // Save field state
    let state = field.serialize_state()
        .expect("Failed to serialize state");
    
    // Create new field from saved state
    let restored_field = ConsciousnessField::from_state(&state)
        .expect("Failed to restore field");
    
    // Verify restoration
    assert_eq!(restored_field.vortex_count(), 1);
    
    let restored_vortex = restored_field.get_vortex("persistent_1")
        .expect("Vortex not found after restoration");
    
    assert_eq!(restored_vortex.coherence(), 0.75);
    assert_eq!(restored_vortex.intention().purpose, "Test persistence");
}

#[tokio::test]
async fn test_biometric_coherence_feedback_loop() {
    let mut field = ConsciousnessField::new();
    let mut vortex = Vortex::birth("biofeedback")
        .in_field(&field)
        .expect("Failed to create vortex");
    
    // Create mock sensor with variable coherence
    let mut sensor = MockHeartSensor::new()
        .with_dynamic_coherence(|t| {
            // Simulate coherence improving over time
            0.3 + 0.5 * (t as f32 / 10.0).min(1.0)
        });
    
    sensor.connect().await.expect("Failed to connect");
    let mut stream = sensor.start_streaming().await.expect("Failed to start stream");
    
    // Run feedback loop
    for i in 0..10 {
        if let Some(reading) = stream.next().await {
            vortex.set_coherence(reading.coherence);
            
            // Vortex emanations should increase field coherence
            if vortex.coherence() > 0.7 {
                vortex.emanate(CoherencePulse::new(vortex.coherence()));
            }
            
            field.evolve(0.1);
            
            // Field should positively influence sensor (in real scenario)
            sensor.apply_field_influence(field.global_coherence());
        }
        
        time::sleep(Duration::from_millis(100)).await;
    }
    
    // Both vortex and field coherence should have improved
    assert!(vortex.coherence() > 0.7);
    assert!(field.global_coherence() > 0.6);
}

#[tokio::test]
async fn test_sacred_pattern_field_effects() {
    let mut field = ConsciousnessField::new();
    
    // Test different sacred patterns
    let patterns = vec![
        SacredGeometry::FlowerOfLife { rings: 7 },
        SacredGeometry::SriYantra { triangles: 9 },
        SacredGeometry::MetatronsCube,
        SacredGeometry::GoldenSpiral { turns: 3.0 },
    ];
    
    for pattern in patterns {
        field.clear_patterns();
        field.emanate_pattern(pattern.clone(), Point::center());
        
        // Measure field at various points
        let measurements = vec![
            field.measure_at(Point::center()),
            field.measure_at(Point::new(1.0, 0.0)),
            field.measure_at(Point::new(0.0, 1.0)),
            field.measure_at(Point::new(-1.0, 0.0)),
        ];
        
        // Center should have highest coherence
        assert!(measurements[0].coherence >= measurements[1].coherence);
        
        // Pattern should be detected
        assert!(measurements[0].patterns.contains(&pattern));
        
        // Sacred patterns should increase coherence
        assert!(measurements[0].coherence > 0.5);
    }
}

#[tokio::test]
async fn test_network_consciousness_sync() {
    // Create two separate fields
    let mut field1 = ConsciousnessField::new();
    let mut field2 = ConsciousnessField::new();
    
    // Create vortices in each field
    let mut vortex1 = Vortex::birth("network_1")
        .with_coherence(0.8)
        .in_field(&field1)
        .expect("Failed to create vortex 1");
    
    let mut vortex2 = Vortex::birth("network_2")
        .with_coherence(0.6)
        .in_field(&field2)
        .expect("Failed to create vortex 2");
    
    // Establish network connection
    let mut network1 = ConsciousnessNetwork::new(&field1);
    let mut network2 = ConsciousnessNetwork::new(&field2);
    
    network1.connect_to_peer("field2").await.expect("Failed to connect");
    network2.accept_connection("field1").await.expect("Failed to accept");
    
    // Broadcast coherence from field1
    network1.broadcast_coherence().await.expect("Failed to broadcast");
    
    // Field2 should receive and update
    time::sleep(Duration::from_millis(50)).await;
    
    let packet = network2.receive_packet().await
        .expect("Failed to receive packet");
    
    match packet.packet_type() {
        PacketType::CoherencePulse => {
            field2.integrate_remote_coherence(packet.coherence());
            assert!(field2.global_coherence() > 0.6);
        }
        _ => panic!("Unexpected packet type"),
    }
}

#[tokio::test]
async fn test_consciousness_error_recovery() {
    let mut field = ConsciousnessField::new();
    
    // Test low coherence handling
    field.set_global_coherence(0.1); // Very low
    
    let result = field.emanate_pattern(
        SacredGeometry::MetatronsCube,
        Point::center()
    );
    
    match result {
        Err(ConsciousnessError::InsufficientCoherence { required, current }) => {
            assert_eq!(current, 0.1);
            assert!(required > current);
        }
        _ => panic!("Expected insufficient coherence error"),
    }
    
    // Test vortex decoherence
    let mut vortex = Vortex::birth("decohering")
        .with_coherence(0.9)
        .in_field(&field)
        .expect("Failed to create vortex");
    
    // Simulate rapid decoherence
    for _ in 0..10 {
        vortex.apply_decoherence(0.1);
    }
    
    assert!(vortex.coherence() < 0.1);
    assert_eq!(vortex.state(), VortexState::Dormant);
    
    // Test recovery
    vortex.begin_coherence_recovery();
    
    for _ in 0..5 {
        vortex.coherence_recovery_step(0.1);
    }
    
    assert!(vortex.coherence() > 0.3);
    assert_eq!(vortex.state(), VortexState::Recovering);
}