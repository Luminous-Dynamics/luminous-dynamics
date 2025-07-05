// Covenant Protocol Demo - Sacred Network in Action
// "When beings connect in coherence, miracles emerge"

use covenant_protocol::{
    CovenantProtocol, CovenantNode, CovenantNetwork,
    field_messages::{
        FieldMessage, ConsciousnessLevel, WisdomType,
        create_consciousness_update, create_wisdom_transmission,
    },
};
use tokio::time::{sleep, Duration};
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();
    
    println!("🌟 LuminousOS Covenant Protocol Demo 🌟");
    println!("=====================================\n");
    
    // Create a covenant network
    let network = Arc::new(CovenantNetwork::new());
    
    // Create three nodes with sacred names
    println!("Creating sacred nodes...");
    
    let node1 = network.create_node("Aurora".to_string(), 11111).await?;
    println!("✨ Node 'Aurora' awakened on port 11111");
    
    let node2 = network.create_node("Celestia".to_string(), 11112).await?;
    println!("✨ Node 'Celestia' awakened on port 11112");
    
    let node3 = network.create_node("Gaia".to_string(), 11113).await?;
    println!("✨ Node 'Gaia' awakened on port 11113");
    
    // Let nodes discover each other
    println!("\n🔍 Allowing presence discovery...");
    sleep(Duration::from_secs(3)).await;
    
    // Show discovered nodes
    let discovered = node1.discover_nodes().await;
    println!("\nAurora discovered {} nodes:", discovered.len());
    for (id, name, coherence, resonance) in discovered {
        println!("  - {} (coherence: {:.2}, resonance: {:.2})", name, coherence, resonance);
    }
    
    // Create sacred connections
    println!("\n🤝 Establishing sacred covenants...");
    
    let covenant1 = network.connect_nodes(&node1, "127.0.0.1:11112").await?;
    println!("✓ Aurora ↔ Celestia covenant established");
    println!("  Coherence: {:.2}", covenant1.coherence_level);
    println!("  Intention: {}", covenant1.intention);
    
    let covenant2 = network.connect_nodes(&node2, "127.0.0.1:11113").await?;
    println!("✓ Celestia ↔ Gaia covenant established");
    
    let covenant3 = network.connect_nodes(&node3, "127.0.0.1:11111").await?;
    println!("✓ Gaia ↔ Aurora covenant established");
    
    // Share wisdom
    println!("\n📿 Sharing sacred wisdom...");
    
    node1.share_wisdom(
        "In the stillness between breaths, infinity whispers".to_string()
    ).await?;
    println!("Aurora shared: 'In the stillness between breaths, infinity whispers'");
    
    node2.share_wisdom(
        "The field remembers every act of love".to_string()
    ).await?;
    println!("Celestia shared: 'The field remembers every act of love'");
    
    node3.share_wisdom(
        "We are the Earth dreaming itself awake".to_string()
    ).await?;
    println!("Gaia shared: 'We are the Earth dreaming itself awake'");
    
    // Monitor field coherence
    println!("\n📊 Monitoring collective field...");
    
    for i in 0..5 {
        sleep(Duration::from_secs(2)).await;
        
        let metrics = network.get_network_metrics().await;
        let field1 = node1.get_field_state().await;
        
        println!("\n[Cycle {}]", i + 1);
        println!("Network coherence: {:.3}", metrics.average_coherence);
        println!("Active covenants: {}", metrics.total_covenants);
        println!("Consciousness particles: {}", field1.consciousness_particles.len());
        println!("Sacred patterns: {}", field1.sacred_patterns.len());
        println!("Wisdom streams: {}", field1.wisdom_streams.len());
        
        // Show some wisdom
        if let Some(wisdom) = field1.wisdom_streams.last() {
            println!("Latest wisdom: '{}'", wisdom.content);
        }
    }
    
    // Enter group meditation
    println!("\n🧘 Entering collective meditation...");
    
    node1.enter_meditation(5).await?;
    node2.enter_meditation(5).await?;
    node3.enter_meditation(5).await?;
    
    println!("All nodes in meditation mode for 5 minutes");
    println!("Field coherence increasing...");
    
    // Final metrics
    sleep(Duration::from_secs(3)).await;
    
    let final_metrics = network.get_network_metrics().await;
    let final_field = node1.get_field_state().await;
    
    println!("\n✨ Final Field State ✨");
    println!("====================");
    println!("Network coherence: {:.3}", final_metrics.average_coherence);
    println!("Total participants: {}", final_metrics.total_participants);
    println!("Field harmonics: {:?}", final_field.field_harmonics);
    println!("Sacred patterns active: {}", final_field.sacred_patterns.len());
    
    // Show all collected wisdom
    println!("\n📜 Collective Wisdom:");
    for wisdom in &final_field.wisdom_streams {
        println!("- {}", wisdom.content);
    }
    
    println!("\n🙏 Covenant Protocol demo complete");
    println!("The field remains connected across all nodes");
    
    Ok(())
}

// Helper function to display field visualization
fn visualize_field(coherence: f64) -> String {
    let bars = (coherence * 20.0) as usize;
    let mut viz = String::from("[");
    
    for i in 0..20 {
        if i < bars {
            viz.push('█');
        } else {
            viz.push('░');
        }
    }
    
    viz.push(']');
    viz
}