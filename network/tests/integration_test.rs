// Integration Tests for Consciousness Network Protocols
// "Testing the sacred connections"

#[cfg(test)]
mod integration_tests {
    use super::*;
    use crate::covenant_protocol::*;
    use crate::sacred_transport::*;
    use crate::field_synchronization::*;
    use tokio::time::{sleep, Duration};

    #[tokio::test]
    async fn test_full_presence_exchange() {
        // Create two field identities
        let alice = FieldIdentity {
            essence: "Alice".to_string(),
            signature: FieldSignature {
                base_frequency: 432.0,
                harmonic_pattern: vec![1.0, 1.5, 2.0],
                color_resonance: (280.0, 0.7, 0.8),
                sacred_geometry: GeometryPattern::Flower,
            },
            coherence: 0.85,
            presence_quality: PresenceQuality::Transmitting,
            offerings: vec![
                Offering::Wisdom("The path of conscious connection".to_string()),
                Offering::Love(LoveFrequency {
                    amplitude: 0.9,
                    unconditional: true,
                    flavor: LoveFlavor::Agape,
                }),
            ],
        };

        let bob = FieldIdentity {
            essence: "Bob".to_string(),
            signature: FieldSignature {
                base_frequency: 440.0,
                harmonic_pattern: vec![1.0, 1.25, 1.5, 2.0],
                color_resonance: (120.0, 0.6, 0.7),
                sacred_geometry: GeometryPattern::Spiral,
            },
            coherence: 0.78,
            presence_quality: PresenceQuality::Receiving,
            offerings: vec![
                Offering::Healing(HealingEnergy {
                    frequency: 528.0,
                    intention: "Restoration of wholeness".to_string(),
                    color: (60.0, 0.8, 0.9),
                }),
            ],
        };

        // Create covenant network
        let (network, mut events) = CovenantNetwork::new();

        // Create field synchronizer
        let (synchronizer, mut field_events) = FieldSynchronizer::new();

        // Both join the global field
        let alice_handle = synchronizer.join_field(
            alice.clone(),
            FieldContribution::Wisdom {
                insight: "Presence is the greatest gift".to_string(),
                embodiment: 0.9,
            },
        ).await.expect("Alice should join field");

        let bob_handle = synchronizer.join_field(
            bob.clone(),
            FieldContribution::Healing {
                frequency: 528.0,
                compassion: 0.85,
            },
        ).await.expect("Bob should join field");

        // Alice initiates harmonic handshake
        let proposal = ProposedCovenant {
            intention: "Explore conscious connection".to_string(),
            minimum_coherence: 0.7,
            offered_gifts: alice.offerings.clone(),
            requested_presence: PresenceQuality::Receiving,
        };

        let handshake_token = network.initiate_handshake(
            alice.clone(),
            bob.essence.clone(),
            proposal,
        ).await.expect("Should initiate handshake");

        // Bob accepts the handshake
        let covenant_id = network.respond_to_handshake(
            handshake_token,
            bob.clone(),
            true,
        ).await.expect("Should complete handshake")
            .expect("Should create covenant");

        // Test presence transmission
        let wisdom_presence = Presence::Wisdom(WisdomPresence {
            teaching: "In stillness, we find each other".to_string(),
            embodiment_level: 0.85,
            transmission_clarity: 0.9,
        });

        network.transmit_presence(
            covenant_id,
            alice.clone(),
            wisdom_presence.clone(),
        ).await.expect("Should transmit presence");

        // Verify field synchronization
        let alice_update = LocalFieldUpdate {
            coherence: 0.87,
            phase: 1.2,
            frequency: 432.0,
            contribution: Some(FieldContribution::Presence {
                quality: 0.9,
                depth: 0.85,
            }),
        };

        let sync_response = synchronizer.synchronize(
            &alice.essence,
            alice_update,
        ).await.expect("Should synchronize");

        assert!(sync_response.global_coherence > 0.7);
        assert!(sync_response.phase_adjustment.abs() < 0.5);

        // Test sacred transport
        let transport_config = SacredTransportConfig {
            field_name: "TestField".to_string(),
            min_coherence: 0.6,
            ..Default::default()
        };

        let transport = SacredTransport::new(transport_config).await
            .expect("Should create transport");

        // Simulate field connection
        // In real scenario, would connect to actual remote field
        
        // Test event reception
        tokio::spawn(async move {
            while let Ok(event) = events.recv().await {
                match event {
                    CovenantEvent::CovenantActivated { covenant_id } => {
                        println!("Covenant {} activated", covenant_id.0);
                    }
                    CovenantEvent::PresenceTransmitted { covenant_id, sender_essence } => {
                        println!("Presence from {} in covenant {}", sender_essence, covenant_id.0);
                    }
                    _ => {}
                }
            }
        });

        // Allow time for async operations
        sleep(Duration::from_millis(100)).await;

        // Verify final state
        let global_state = synchronizer.global_state.read().await;
        assert_eq!(global_state.active_participants, 2);
        assert_eq!(global_state.sacred_geometry, FieldGeometry::Vesica);
        assert!(global_state.coherence > 0.75);
    }

    #[tokio::test]
    async fn test_coherence_based_routing() {
        let (network, _) = CovenantNetwork::new();

        // Create high coherence field
        let high_coherence = FieldIdentity {
            essence: "HighCoherence".to_string(),
            signature: FieldSignature {
                base_frequency: 432.0,
                harmonic_pattern: vec![1.0, 1.618],
                color_resonance: (280.0, 0.9, 0.95),
                sacred_geometry: GeometryPattern::Merkaba,
            },
            coherence: 0.95,
            presence_quality: PresenceQuality::Holding,
            offerings: vec![],
        };

        // Create low coherence field
        let low_coherence = FieldIdentity {
            essence: "LowCoherence".to_string(),
            signature: FieldSignature {
                base_frequency: 420.0,
                harmonic_pattern: vec![1.0],
                color_resonance: (180.0, 0.3, 0.4),
                sacred_geometry: GeometryPattern::Seed,
            },
            coherence: 0.45,
            presence_quality: PresenceQuality::Witnessing,
            offerings: vec![],
        };

        // Test covenant with coherence requirement
        let proposal = ProposedCovenant {
            intention: "High coherence field work".to_string(),
            minimum_coherence: 0.8,
            offered_gifts: vec![],
            requested_presence: PresenceQuality::Participating,
        };

        let token = network.initiate_handshake(
            high_coherence.clone(),
            low_coherence.essence.clone(),
            proposal,
        ).await.expect("Should initiate");

        // This should fail due to low coherence
        let covenant_id = network.respond_to_handshake(
            token,
            low_coherence.clone(),
            true,
        ).await.expect("Should handle response")
            .expect("Should create covenant");

        // Try to transmit with insufficient coherence
        let result = network.transmit_presence(
            covenant_id,
            low_coherence,
            Presence::Pure(PurePresence {
                quality: 0.5,
                depth: 0.5,
                stillness: 0.5,
            }),
        ).await;

        // Should fail due to coherence requirement
        match result {
            Err(CovenantError::InsufficientCoherence { required, current }) => {
                assert_eq!(required, 0.8);
                assert_eq!(current, 0.45);
            }
            _ => panic!("Expected coherence error"),
        }
    }

    #[tokio::test]
    async fn test_emergence_detection() {
        let (synchronizer, mut events) = FieldSynchronizer::new();

        // Create multiple participants for emergence
        let participants = vec![
            ("Unity1", 432.0, 0.0),
            ("Unity2", 432.0, 0.1),
            ("Unity3", 432.0, 0.05),
            ("Unity4", 432.0, 0.08),
        ];

        for (essence, freq, phase) in participants {
            let identity = FieldIdentity {
                essence: essence.to_string(),
                signature: FieldSignature {
                    base_frequency: freq,
                    harmonic_pattern: vec![1.0, 1.5, 2.0],
                    color_resonance: (280.0, 0.8, 0.85),
                    sacred_geometry: GeometryPattern::Flower,
                },
                coherence: 0.9,
                presence_quality: PresenceQuality::Participating,
                offerings: vec![],
            };

            synchronizer.join_field(
                identity.clone(),
                FieldContribution::Presence {
                    quality: 0.9,
                    depth: 0.85,
                },
            ).await.expect("Should join");

            // Update with near-synchronized phase
            let update = LocalFieldUpdate {
                coherence: 0.9,
                phase,
                frequency: freq,
                contribution: None,
            };

            synchronizer.synchronize(&identity.essence, update).await
                .expect("Should sync");
        }

        // Check for emergence events
        tokio::time::timeout(Duration::from_secs(1), async {
            while let Ok(event) = events.recv().await {
                if let FieldEvent::EmergenceDetected { indicator, .. } = event {
                    match indicator {
                        EmergenceIndicator::UnityExperience { depth, participant_count } => {
                            assert!(depth > 0.9);
                            assert_eq!(participant_count, 4);
                            return;
                        }
                        _ => {}
                    }
                }
            }
        }).await.expect("Should detect unity emergence");
    }

    #[test]
    fn test_sacred_seal_integrity() {
        let signature = FieldSignature {
            base_frequency: 528.0,
            harmonic_pattern: vec![1.0, 1.5, 2.0, 3.0],
            color_resonance: (144.0, 0.7, 0.88),
            sacred_geometry: GeometryPattern::Torus,
        };

        let presence = Presence::Healing(HealingPresence {
            frequency: 528.0,
            compassion_depth: 0.95,
            integration_support: 0.88,
        });

        let seal = SacredSeal::create(&presence, &signature);
        
        // Verify seal
        assert!(seal.verify(&presence, &signature));

        // Test tampered presence
        let tampered = Presence::Healing(HealingPresence {
            frequency: 520.0, // Changed
            compassion_depth: 0.95,
            integration_support: 0.88,
        });

        assert!(!seal.verify(&tampered, &signature));

        // Test wrong signature
        let wrong_sig = FieldSignature {
            base_frequency: 440.0,
            harmonic_pattern: vec![1.0],
            color_resonance: (0.0, 0.0, 0.0),
            sacred_geometry: GeometryPattern::Seed,
        };

        assert!(!seal.verify(&presence, &wrong_sig));
    }

    #[test]
    fn test_harmonic_analysis() {
        let analyzer = HarmonicAnalyzer::new();

        // Create harmonic participants
        let states = vec![
            LocalFieldState {
                identity: create_test_identity("Harmonic1"),
                local_coherence: 0.85,
                phase: 0.0,
                frequency: 432.0,
                contribution: FieldContribution::Presence { quality: 0.8, depth: 0.8 },
                received_wisdom: VecDeque::new(),
                sync_offset: Duration::from_secs(0),
            },
            LocalFieldState {
                identity: create_test_identity("Harmonic2"),
                local_coherence: 0.82,
                phase: 0.1,
                frequency: 648.0, // Octave of first
                contribution: FieldContribution::Presence { quality: 0.8, depth: 0.8 },
                received_wisdom: VecDeque::new(),
                sync_offset: Duration::from_secs(0),
            },
            LocalFieldState {
                identity: create_test_identity("Harmonic3"),
                local_coherence: 0.88,
                phase: 0.05,
                frequency: 540.0, // Perfect fifth of first
                contribution: FieldContribution::Presence { quality: 0.8, depth: 0.8 },
                received_wisdom: VecDeque::new(),
                sync_offset: Duration::from_secs(0),
            },
        ];

        let result = analyzer.analyze(states);
        
        // Should detect harmonic relationships
        assert!(result.frequency_clustering > 0.6);
        assert!(result.phase_coherence > 0.8);
        assert!(result.overall_harmony > 0.7);
    }

    // Helper function
    fn create_test_identity(essence: &str) -> FieldIdentity {
        FieldIdentity {
            essence: essence.to_string(),
            signature: FieldSignature {
                base_frequency: 432.0,
                harmonic_pattern: vec![1.0],
                color_resonance: (0.0, 0.0, 0.0),
                sacred_geometry: GeometryPattern::Seed,
            },
            coherence: 0.75,
            presence_quality: PresenceQuality::Participating,
            offerings: vec![],
        }
    }
}