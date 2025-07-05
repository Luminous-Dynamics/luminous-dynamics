use luminous_simulator::{Simulator, SimulatorConfig};
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Parse command line arguments
    let args: Vec<String> = std::env::args().collect();
    let config = SimulatorConfig::from_args(&args)?;
    
    // Create and run simulator
    let mut simulator = Simulator::new(config);
    
    println!("🌟 LuminousOS Simulator Starting...");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!("Experience consciousness-first computing without hardware requirements");
    println!();
    
    simulator.run().await?;
    
    Ok(())
}