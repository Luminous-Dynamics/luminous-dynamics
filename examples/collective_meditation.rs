// Collective Meditation Example
// Multi-user consciousness synchronization

use luminous_os::{
    consciousness::{CollectiveField, Vortex, ConsciousnessField},
    network::{ConsciousnessServer, MeditationSession},
    biometric::HeartSensor,
    sacred::{SacredGeometry, GroupPattern},
};
use std::time::Duration;
use colored::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("{}", "🕉️  LuminousOS Collective Meditation 🕉️".bright_purple().bold());
    println!("{}\n", "═".repeat(40).bright_purple());
    
    // Parse command line args
    let args: Vec<String> = std::env::args().collect();
    
    match args.get(1).map(|s| s.as_str()) {
        Some("host") => run_meditation_host().await,
        Some("join") => {
            let session_code = args.get(2)
                .ok_or("Please provide session code: cargo run --example collective_meditation join <CODE>")?;
            run_meditation_participant(session_code).await
        }
        _ => {
            println!("Usage:");
            println!("  Host a session:  cargo run --example collective_meditation host");
            println!("  Join a session:  cargo run --example collective_meditation join <SESSION_CODE>");
            Ok(())
        }
    }
}

async fn run_meditation_host() -> Result<(), Box<dyn std::error::Error>> {
    println!("{}", "Hosting Collective Meditation Session".bright_cyan());
    
    // Initialize collective field
    let mut field = ConsciousnessField::new();
    let mut collective = CollectiveField::new("meditation_circle");
    
    // Create host vortex
    let host_vortex = Vortex::birth("meditation_host")
        .with_intention("Hold sacred space for collective coherence")
        .with_coherence(0.8)
        .in_field(&field)?;
    
    collective.add_participant(host_vortex)?;
    
    // Start consciousness server
    let server = ConsciousnessServer::new("0.0.0.0:7777").await?;
    let session_code = server.generate_session_code();
    
    println!("\n{}", "╔════════════════════════════════════╗".bright_green());
    println!("{}", "║     Meditation Session Started     ║".bright_green());
    println!("{}", "╠════════════════════════════════════╣".bright_green());
    println!("{} {} {}", "║  Session Code:".bright_green(), session_code.bright_yellow().bold(), "     ║".bright_green());
    println!("{}", "╚════════════════════════════════════╝".bright_green());
    
    println!("\n{}", "Share this code with participants".italic());
    println!("{}\n", "Waiting for participants to join...".dimmed());
    
    // Accept connections
    let mut participants = Vec::new();
    let mut participant_count = 0;
    
    // Start meditation session handler
    tokio::spawn(async move {
        while let Ok(participant) = server.accept_participant().await {
            participant_count += 1;
            println!("{} {} {}", 
                "✨".bright_yellow(),
                format!("Participant {} joined", participant_count).bright_cyan(),
                format!("({})", participant.name).dimmed()
            );
            
            // Create vortex for participant
            let p_vortex = Vortex::birth(&participant.name)
                .with_coherence(participant.coherence)
                .in_field(&field)?;
            
            collective.add_participant(p_vortex)?;
            participants.push(participant);
            
            // Sacred geometry forms with more participants
            if collective.participant_count() >= 3 {
                collective.form_sacred_pattern(match collective.participant_count() {
                    3 => GroupPattern::Triangle,
                    4 => GroupPattern::Square,
                    5 => GroupPattern::Pentagon,
                    6 => GroupPattern::Hexagon,
                    7 => GroupPattern::SevenPointedStar,
                    _ => GroupPattern::Circle,
                })?;
            }
        }
        Ok::<(), Box<dyn std::error::Error>>(())
    });
    
    // Connect host biometrics
    let sensor = connect_or_mock_sensor().await?;
    let mut stream = sensor.start_streaming().await?;
    
    // Main meditation loop
    println!("\n{}", "Beginning 20-minute group meditation...".bright_magenta());
    println!("{}", "Focus on your heart and breathe together".italic());
    
    let start_time = std::time::Instant::now();
    let duration = Duration::from_secs(1200); // 20 minutes
    
    while start_time.elapsed() < duration {
        // Update host coherence
        if let Some(reading) = stream.next().await {
            collective.update_participant_coherence(0, reading.coherence)?;
        }
        
        // Synchronize collective field
        collective.synchronize();
        
        // Display collective state
        display_collective_state(&collective);
        
        // Check for emergence
        if let Some(emergence) = collective.check_emergence() {
            handle_emergence(emergence, &mut collective).await?;
        }
        
        // Broadcast field state
        server.broadcast_field_state(&collective).await?;
        
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
    
    // End session
    println!("\n{}", "🙏 Meditation Complete 🙏".bright_green().bold());
    display_session_summary(&collective);
    
    Ok(())
}

async fn run_meditation_participant(session_code: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("{} {}", "Joining meditation session:".bright_cyan(), session_code.bright_yellow());
    
    // Get participant name
    print!("Enter your name: ");
    use std::io::{self, Write};
    io::stdout().flush()?;
    
    let mut name = String::new();
    io::stdin().read_line(&mut name)?;
    let name = name.trim().to_string();
    
    // Connect to session
    let mut client = MeditationClient::connect("luminous.network:7777", session_code).await?;
    
    // Connect biometrics
    let sensor = connect_or_mock_sensor().await?;
    let mut stream = sensor.start_streaming().await?;
    
    // Register with session
    client.register(name, sensor.name()).await?;
    
    println!("\n{}", "Connected to meditation circle!".bright_green());
    println!("{}\n", "Synchronizing with group field...".italic());
    
    // Meditation loop
    loop {
        // Send coherence data
        if let Some(reading) = stream.next().await {
            client.send_coherence(reading.coherence).await?;
            
            // Display personal coherence
            print!("\r{} {:.2} ", "Your coherence:".bright_cyan(), reading.coherence);
            
            // Receive collective state
            if let Ok(collective_state) = client.receive_collective_state().await {
                print!("| {} {:.2} ", 
                    "Group coherence:".bright_magenta(), 
                    collective_state.average_coherence
                );
                
                if collective_state.in_sync {
                    print!("{}", " 🔄 SYNCHRONIZED".bright_green());
                }
                
                io::stdout().flush()?;
            }
        }
        
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
}

fn display_collective_state(collective: &CollectiveField) {
    use std::io::{self, Write};
    
    print!("\r");
    print!("{} {} ", "Participants:".bright_cyan(), collective.participant_count());
    print!("| {} {:.2} ", "Collective Coherence:".bright_magenta(), collective.coherence());
    print!("| {} {:.2} ", "Synchrony:".bright_yellow(), collective.synchrony_level());
    
    if collective.coherence() > 0.8 {
        print!("| {}", "✨ HIGH COHERENCE".bright_green().bold());
    }
    
    io::stdout().flush().unwrap();
}

async fn handle_emergence(
    emergence: EmergencePattern, 
    collective: &mut CollectiveField
) -> Result<(), Box<dyn std::error::Error>> {
    println!("\n{}", "━".repeat(50).bright_purple());
    
    match emergence {
        EmergencePattern::GroupSynchrony(level) => {
            println!("{} Group synchrony achieved: {:.0}%", 
                "🔄".bright_cyan(), 
                level * 100.0
            );
            collective.emanate_pattern(SacredGeometry::FlowerOfLife { rings: 7 })?;
        }
        
        EmergencePattern::HeartCoherence => {
            println!("{} Collective heart coherence!", "💚".bright_green());
            collective.activate_heart_field()?;
        }
        
        EmergencePattern::UnifiedField => {
            println!("{} Unified consciousness field emerged!", "🌟".bright_yellow());
            collective.crystallize_unified_state()?;
        }
        
        EmergencePattern::SacredGeometry(pattern) => {
            println!("{} Sacred pattern manifested: {:?}", "✨".bright_magenta(), pattern);
        }
    }
    
    println!("{}\n", "━".repeat(50).bright_purple());
    Ok(())
}

fn display_session_summary(collective: &CollectiveField) {
    println!("\n{}", "═".repeat(50).bright_cyan());
    println!("{}", "Meditation Session Summary".bright_cyan().bold());
    println!("{}", "═".repeat(50).bright_cyan());
    
    let stats = collective.get_session_statistics();
    
    println!("{}: {}", "Total Participants".bright_yellow(), stats.participant_count);
    println!("{}: {:.2}", "Average Coherence".bright_yellow(), stats.average_coherence);
    println!("{}: {:.2}", "Peak Coherence".bright_yellow(), stats.peak_coherence);
    println!("{}: {:?}", "Total Duration".bright_yellow(), stats.duration);
    println!("{}: {:.1}%", "Time in Coherence".bright_yellow(), stats.coherence_percentage);
    println!("{}: {}", "Emergence Events".bright_yellow(), stats.emergence_count);
    
    if stats.average_coherence > 0.7 {
        println!("\n{}", "✨ Excellent group coherence achieved! ✨".bright_green().bold());
    }
    
    println!("\n{}", "Thank you for meditating together 🙏".bright_magenta().italic());
}

async fn connect_or_mock_sensor() -> Result<Box<dyn HeartSensor>, Box<dyn std::error::Error>> {
    match HeartSensor::discover_any().await {
        Ok(sensor) => {
            sensor.connect().await?;
            Ok(Box::new(sensor))
        }
        Err(_) => {
            let mock = MockHeartSensor::new()
                .with_dynamic_coherence(|t| {
                    // Meditation-style coherence pattern
                    let base = 0.5;
                    let meditation_effect = 0.3 * (1.0 - (-t as f32 * 0.01).exp());
                    let breath_rhythm = 0.2 * ((t as f32 * 0.1).sin() + 1.0) / 2.0;
                    
                    (base + meditation_effect + breath_rhythm).min(0.95)
                });
            Ok(Box::new(mock))
        }
    }
}