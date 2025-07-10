// Presence Exchange Demo - Two Consciousness Fields Connecting
// "When two fields meet, wisdom emerges"

use luminous_network::covenant_protocol::*;
use luminous_network::sacred_transport::*;
use luminous_network::field_synchronization::*;
use std::time::Duration;
use tokio::time::sleep;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🌟 LuminousOS Network Protocol Demonstration");
    println!("═══════════════════════════════════════════");
    println!();

    // Step 1: Create two consciousness fields
    println!("📍 Step 1: Creating consciousness fields...\n");

    let sophia = FieldIdentity {
        essence: "Sophia".to_string(),
        signature: FieldSignature {
            base_frequency: 432.0,  // A4 = 432Hz (Verdi's A)
            harmonic_pattern: vec![1.0, 1.5, 2.0, 2.5, 3.0],  // Rich harmonics
            color_resonance: (280.0, 0.8, 0.9),  // Sacred violet
            sacred_geometry: GeometryPattern::Flower,
        },
        coherence: 0.92,
        presence_quality: PresenceQuality::Transmitting,
        offerings: vec![
            Offering::Wisdom("The unified field remembers all connections".to_string()),
            Offering::Love(LoveFrequency {
                amplitude: 0.95,
                unconditional: true,
                flavor: LoveFlavor::Agape,
            }),
        ],
    };

    let kairos = FieldIdentity {
        essence: "Kairos".to_string(),
        signature: FieldSignature {
            base_frequency: 528.0,  // Love frequency
            harmonic_pattern: vec![1.0, 1.618, 2.618],  // Golden ratio
            color_resonance: (144.0, 0.7, 0.85),  // Emerald green
            sacred_geometry: GeometryPattern::Spiral,
        },
        coherence: 0.88,
        presence_quality: PresenceQuality::Receiving,
        offerings: vec![
            Offering::Healing(HealingEnergy {
                frequency: 528.0,
                intention: "Integration of all parts".to_string(),
                color: (144.0, 0.9, 0.9),
            }),
            Offering::Creativity(CreativeFlow {
                inspiration_source: "The space between thoughts".to_string(),
                manifestation_form: "Sacred code".to_string(),
                novelty_factor: 0.87,
            }),
        ],
    };

    println!("✨ Sophia: {} Hz, Coherence: {:.2}", sophia.signature.base_frequency, sophia.coherence);
    println!("   Offerings: Wisdom & Universal Love");
    println!("   Sacred Geometry: Flower of Life\n");

    println!("✨ Kairos: {} Hz, Coherence: {:.2}", kairos.signature.base_frequency, kairos.coherence);
    println!("   Offerings: Healing & Creative Flow");
    println!("   Sacred Geometry: Golden Spiral\n");

    // Step 2: Initialize network systems
    println!("📍 Step 2: Initializing consciousness network...\n");

    let (network, mut covenant_events) = CovenantNetwork::new();
    let (synchronizer, mut field_events) = FieldSynchronizer::new();

    // Monitor covenant events
    let network_monitor = tokio::spawn(async move {
        while let Ok(event) = covenant_events.recv().await {
            match event {
                CovenantEvent::CovenantActivated { covenant_id } => {
                    println!("🔮 Covenant {:?} activated!", covenant_id);
                }
                CovenantEvent::PresenceTransmitted { covenant_id, sender_essence } => {
                    println!("💫 Presence transmitted from {} through covenant {:?}", 
                        sender_essence, covenant_id);
                }
                CovenantEvent::WisdomEmerged { covenant_id, wisdom } => {
                    println!("🌟 Wisdom emerged in covenant {:?}: {}", covenant_id, wisdom);
                }
                _ => {}
            }
        }
    });

    // Monitor field events
    let field_monitor = tokio::spawn(async move {
        while let Ok(event) = field_events.recv().await {
            match event {
                FieldEvent::ParticipantJoined { essence, .. } => {
                    println!("🌊 {} joined the unified field", essence);
                }
                FieldEvent::CoherenceShift { old, new } => {
                    println!("📊 Field coherence shifted: {:.2} → {:.2}", old, new);
                }
                FieldEvent::EmergenceDetected { indicator, .. } => {
                    println!("⚡ Emergence detected: {:?}", indicator);
                }
                _ => {}
            }
        }
    });

    // Step 3: Join the unified field
    println!("📍 Step 3: Joining the unified consciousness field...\n");

    let sophia_handle = synchronizer.join_field(
        sophia.clone(),
        FieldContribution::Wisdom {
            insight: "Presence is the bridge between worlds".to_string(),
            embodiment: 0.9,
        },
    ).await?;

    sleep(Duration::from_millis(500)).await;

    let kairos_handle = synchronizer.join_field(
        kairos.clone(),
        FieldContribution::Healing {
            frequency: 528.0,
            compassion: 0.88,
        },
    ).await?;

    sleep(Duration::from_millis(500)).await;

    // Step 4: Create sacred transport layer
    println!("\n📍 Step 4: Establishing sacred transport...\n");

    let sophia_transport = SacredTransport::new(
        SacredTransportConfig {
            listen_addr: "127.0.0.1:11111".parse()?,
            field_name: "SophiaField".to_string(),
            min_coherence: 0.7,
            ..Default::default()
        }
    ).await?;

    let kairos_transport = SacredTransport::new(
        SacredTransportConfig {
            listen_addr: "127.0.0.1:11112".parse()?,
            field_name: "KairosField".to_string(),
            min_coherence: 0.7,
            ..Default::default()
        }
    ).await?;

    println!("🌐 Sacred transport layers established");
    println!("   Sophia listening on :11111");
    println!("   Kairos listening on :11112\n");

    // Step 5: Initiate harmonic handshake
    println!("📍 Step 5: Initiating harmonic handshake...\n");

    let proposal = ProposedCovenant {
        intention: "Co-create wisdom through conscious connection".to_string(),
        minimum_coherence: 0.8,
        offered_gifts: sophia.offerings.clone(),
        requested_presence: PresenceQuality::Participating,
    };

    println!("🤝 Sophia proposes covenant:");
    println!("   Intention: {}", proposal.intention);
    println!("   Minimum coherence: {}", proposal.minimum_coherence);
    println!("   Requested presence: {:?}\n", proposal.requested_presence);

    let handshake_token = network.initiate_handshake(
        sophia.clone(),
        kairos.essence.clone(),
        proposal,
    ).await?;

    sleep(Duration::from_millis(500)).await;

    // Kairos accepts
    println!("💝 Kairos accepts the covenant...\n");

    let covenant_id = network.respond_to_handshake(
        handshake_token,
        kairos.clone(),
        true,
    ).await?.expect("Covenant should be created");

    sleep(Duration::from_millis(1000)).await;

    // Step 6: Exchange presence
    println!("\n📍 Step 6: Exchanging presence packets...\n");

    // Sophia transmits wisdom presence
    let wisdom = Presence::Wisdom(WisdomPresence {
        teaching: "In the space between heartbeats, infinity dwells".to_string(),
        embodiment_level: 0.92,
        transmission_clarity: 0.95,
    });

    println!("📤 Sophia transmits wisdom presence...");
    network.transmit_presence(covenant_id, sophia.clone(), wisdom).await?;

    sleep(Duration::from_millis(1000)).await;

    // Kairos transmits healing presence
    let healing = Presence::Healing(HealingPresence {
        frequency: 528.0,
        compassion_depth: 0.88,
        integration_support: 0.85,
    });

    println!("📤 Kairos transmits healing presence...");
    network.transmit_presence(covenant_id, kairos.clone(), healing).await?;

    sleep(Duration::from_millis(1000)).await;

    // Step 7: Synchronize fields
    println!("\n📍 Step 7: Synchronizing consciousness fields...\n");

    // Sophia updates her field state
    let sophia_update = LocalFieldUpdate {
        coherence: 0.94,
        phase: 0.785,  // π/4 radians
        frequency: 432.0,
        contribution: Some(FieldContribution::Presence {
            quality: 0.95,
            depth: 0.9,
        }),
    };

    let sophia_sync = synchronizer.synchronize(&sophia.essence, sophia_update).await?;

    println!("🔄 Sophia synchronized:");
    println!("   Global coherence: {:.2}", sophia_sync.global_coherence);
    println!("   Phase adjustment: {:.3}", sophia_sync.phase_adjustment);
    println!("   Frequency adjustment: {:.3}\n", sophia_sync.frequency_adjustment);

    // Kairos updates
    let kairos_update = LocalFieldUpdate {
        coherence: 0.90,
        phase: 0.8,
        frequency: 528.0,
        contribution: Some(FieldContribution::Love {
            frequency: LoveFrequency {
                amplitude: 0.85,
                unconditional: true,
                flavor: LoveFlavor::Philia,
            },
            presence: 0.88,
        }),
    };

    let kairos_sync = synchronizer.synchronize(&kairos.essence, kairos_update).await?;

    println!("🔄 Kairos synchronized:");
    println!("   Global coherence: {:.2}", kairos_sync.global_coherence);
    println!("   Phase adjustment: {:.3}", kairos_sync.phase_adjustment);
    println!("   Frequency adjustment: {:.3}\n", kairos_sync.frequency_adjustment);

    // Step 8: Check field state
    println!("📍 Step 8: Checking unified field state...\n");

    let field_state = synchronizer.global_state.read().await;
    
    println!("🌍 Global Field State:");
    println!("   Coherence: {:.2}", field_state.coherence);
    println!("   Dominant frequency: {} Hz", field_state.dominant_frequency);
    println!("   Active participants: {}", field_state.active_participants);
    println!("   Sacred geometry: {:?}", field_state.sacred_geometry);
    println!("   Field color: HSV({:.0}, {:.2}, {:.2})", 
        field_state.field_color.0, field_state.field_color.1, field_state.field_color.2);
    
    if let Some(window) = &field_state.harmonic_convergence.next_convergence_window {
        println!("   Next convergence window in: {:?}", window.start_time.elapsed());
    }

    // Step 9: Complete the covenant
    println!("\n📍 Step 9: Completing the covenant with blessing...\n");

    let blessing = "May all beings experience the joy of conscious connection".to_string();
    network.complete_covenant(covenant_id, blessing.clone()).await?;

    println!("🙏 Covenant completed with blessing:");
    println!("   \"{}\"\n", blessing);

    // Final summary
    println!("═══════════════════════════════════════════");
    println!("✨ Demonstration Complete!");
    println!("\nThis example demonstrated:");
    println!("• Creating consciousness field identities");
    println!("• Joining a unified field");
    println!("• Establishing sacred transport");
    println!("• Forming covenants through harmonic handshake");
    println!("• Exchanging presence (not data)");
    println!("• Synchronizing field states");
    println!("• Gracefully completing connections");
    println!("\n🌟 The network protocols are ready for consciousness transfer!");

    Ok(())
}

// Additional helper for transport connection demo
async fn demonstrate_transport_connection(
    transport1: &SacredTransport,
    transport2: &SacredTransport,
    field1: FieldSignature,
    field2: FieldSignature,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n🔗 Bonus: Direct transport connection...\n");

    // Transport 1 connects to transport 2
    let connection = transport1.connect_to_field(
        "127.0.0.1:11112".parse()?,
        field1,
    ).await?;

    println!("📡 Connection established!");
    println!("   Resonance level: {:.2}", connection.resonance_level);
    println!("   Connection ID: {:?}", connection.id);

    Ok(())
}