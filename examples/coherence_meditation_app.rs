// Coherence Meditation App - Example Application
// "Guiding consciousness toward harmony through biometric feedback"

use luminous_os::stillpoint_kernel::{
    StillpointKernel, VortexId, PatternType, BiometricState,
    create_biometric_vortex,
};
use luminous_os::mandala_ui::{MandalaRenderer, VisualizationMode};
use luminous_os::kernel_ui_bridge::{KernelUIBridge, UICommand, BreathingPattern};
use std::sync::Arc;
use tokio::sync::watch;
use tokio::time::{sleep, Duration, interval};
use anyhow::Result;

/// Meditation app that uses biometric feedback to guide coherence
struct CoherenceMeditationApp {
    kernel: Arc<StillpointKernel>,
    bridge: Arc<KernelUIBridge>,
    user_vortex: VortexId,
    coherence_rx: watch::Receiver<f64>,
}

#[derive(Debug, Clone)]
struct MeditationSession {
    duration_minutes: u32,
    target_coherence: f64,
    breathing_pattern: BreathingPattern,
    sacred_pattern: PatternType,
    guidance_enabled: bool,
}

impl CoherenceMeditationApp {
    async fn new() -> Result<Self> {
        println!("🧘 Initializing Coherence Meditation App...");
        
        // Initialize kernel and UI bridge
        let kernel = Arc::new(StillpointKernel::new().await?);
        let bridge = Arc::new(KernelUIBridge::new(kernel.clone()).await?);
        
        // Create user vortex with initial biometrics
        let user_vortex = create_biometric_vortex(
            &kernel,
            432.0, // Healing frequency
            70.0,  // Initial heart rate
            0.5,   // Initial coherence
            15.0,  // Initial breath rate
            0.6,   // Initial breath depth
        ).await?;
        
        // Set up coherence monitoring
        let (tx, rx) = watch::channel(0.5);
        let coherence_rx = rx;
        
        // Start coherence monitoring task
        let kernel_clone = kernel.clone();
        let vortex_id = user_vortex;
        tokio::spawn(async move {
            let mut ticker = interval(Duration::from_millis(100));
            loop {
                ticker.tick().await;
                if let Ok(vortex) = kernel_clone.get_vortex(vortex_id).await {
                    let coherence = vortex.calculate_coherence();
                    let _ = tx.send(coherence);
                }
            }
        });
        
        Ok(Self {
            kernel,
            bridge,
            user_vortex,
            coherence_rx,
        })
    }
    
    /// Start a guided meditation session
    async fn start_meditation(&self, session: MeditationSession) -> Result<()> {
        println!("\n🕉️ Starting {} minute meditation", session.duration_minutes);
        println!("Target coherence: {:.2}", session.target_coherence);
        println!("Pattern: {:?}", session.sacred_pattern);
        println!("Breathing: {:?}\n", session.breathing_pattern);
        
        // Set initial states
        self.kernel.set_target_coherence(self.user_vortex, session.target_coherence).await?;
        self.kernel.activate_pattern(self.user_vortex, session.sacred_pattern).await?;
        
        // Send breathing pattern to UI
        self.bridge.send_command(UICommand::BeginBreathing(session.breathing_pattern)).await?;
        
        // Run meditation session
        let duration = Duration::from_secs(session.duration_minutes as u64 * 60);
        let start_time = tokio::time::Instant::now();
        
        while start_time.elapsed() < duration {
            let coherence = *self.coherence_rx.borrow();
            let elapsed = start_time.elapsed().as_secs();
            let remaining = duration.as_secs() - elapsed;
            
            // Display status
            self.display_meditation_status(coherence, remaining);
            
            // Provide guidance if enabled
            if session.guidance_enabled {
                self.provide_coherence_guidance(coherence, session.target_coherence).await?;
            }
            
            sleep(Duration::from_secs(5)).await;
        }
        
        // End meditation
        println!("\n🙏 Meditation complete!");
        self.show_session_summary().await?;
        
        Ok(())
    }
    
    /// Interactive coherence training mode
    async fn coherence_training(&self) -> Result<()> {
        println!("\n💫 Coherence Training Mode");
        println!("Follow the visual feedback to increase your coherence\n");
        
        let mut best_coherence = 0.0;
        let mut training_rounds = 0;
        
        loop {
            training_rounds += 1;
            println!("Round {}: ", training_rounds);
            
            // Random pattern for this round
            let patterns = vec![
                PatternType::CircleOfUnity,
                PatternType::FlowerOfLife,
                PatternType::HeartField,
                PatternType::SpiralOfGrowth,
            ];
            let pattern = patterns[training_rounds % patterns.len()];
            
            println!("Focus on: {:?}", pattern);
            self.kernel.activate_pattern(self.user_vortex, pattern).await?;
            
            // Monitor for 30 seconds
            let mut round_best = 0.0;
            for _ in 0..30 {
                let coherence = *self.coherence_rx.borrow();
                round_best = round_best.max(coherence);
                
                // Visual feedback
                let bar = self.coherence_bar(coherence);
                print!("\r  {} {:.2}", bar, coherence);
                
                sleep(Duration::from_secs(1)).await;
            }
            
            println!("\n  Round best: {:.2}", round_best);
            best_coherence = best_coherence.max(round_best);
            
            if round_best > 0.85 {
                println!("  🌟 Excellent coherence achieved!");
            }
            
            println!("\nPress Enter for next round or 'q' to quit");
            // In real app, would handle user input here
            
            sleep(Duration::from_secs(2)).await;
            
            if training_rounds >= 5 {
                break;
            }
        }
        
        println!("\n🏆 Training complete! Best coherence: {:.2}", best_coherence);
        
        Ok(())
    }
    
    /// Biofeedback breathing exercise
    async fn breathing_exercise(&self, pattern: BreathingPattern) -> Result<()> {
        println!("\n🌬️ Breathing Exercise: {:?}", pattern);
        
        self.bridge.send_command(UICommand::BeginBreathing(pattern)).await?;
        
        let (inhale, hold1, exhale, hold2) = match pattern {
            BreathingPattern::Coherent => (5, 0, 5, 0),
            BreathingPattern::Box => (4, 4, 4, 4),
            BreathingPattern::FourSevenEight => (4, 7, 8, 0),
            _ => (4, 0, 4, 0),
        };
        
        for cycle in 1..=10 {
            println!("\nCycle {}/10", cycle);
            
            // Inhale
            print!("  Inhale ");
            for _ in 0..inhale {
                print!("🟢");
                sleep(Duration::from_secs(1)).await;
            }
            
            // Hold after inhale
            if hold1 > 0 {
                print!("\n  Hold   ");
                for _ in 0..hold1 {
                    print!("🟡");
                    sleep(Duration::from_secs(1)).await;
                }
            }
            
            // Exhale
            print!("\n  Exhale ");
            for _ in 0..exhale {
                print!("🔵");
                sleep(Duration::from_secs(1)).await;
            }
            
            // Hold after exhale
            if hold2 > 0 {
                print!("\n  Hold   ");
                for _ in 0..hold2 {
                    print!("🟡");
                    sleep(Duration::from_secs(1)).await;
                }
            }
            
            println!();
            
            // Show current coherence
            let coherence = *self.coherence_rx.borrow();
            println!("  Coherence: {:.2}", coherence);
        }
        
        println!("\n✅ Breathing exercise complete!");
        
        Ok(())
    }
    
    /// Group meditation with collective field
    async fn group_meditation(&self, participant_count: usize) -> Result<()> {
        println!("\n👥 Group Meditation - {} participants", participant_count);
        
        // Create vortices for other participants
        let mut participants = vec![self.user_vortex];
        for i in 0..participant_count - 1 {
            let vortex = self.kernel.create_vortex(432.0 + i as f64 * 8.0).await?;
            participants.push(vortex);
        }
        
        // Entangle all participants
        println!("🔗 Creating collective field...");
        for i in 0..participants.len() {
            for j in i + 1..participants.len() {
                self.kernel.entangle_vortices(
                    participants[i],
                    participants[j],
                    0.3,
                ).await?;
            }
        }
        
        // Monitor collective coherence
        println!("📊 Collective coherence:");
        for minute in 1..=5 {
            let mut total_coherence = 0.0;
            
            for &vortex in &participants {
                if let Ok(v) = self.kernel.get_vortex(vortex).await {
                    total_coherence += v.calculate_coherence();
                }
            }
            
            let collective_coherence = total_coherence / participants.len() as f64;
            let bar = self.coherence_bar(collective_coherence);
            
            println!("  Minute {}: {} {:.2}", minute, bar, collective_coherence);
            
            if collective_coherence > 0.8 {
                println!("  🌟 Collective resonance achieved!");
                self.kernel.trigger_emergence_event(self.user_vortex).await?;
            }
            
            sleep(Duration::from_secs(60)).await;
        }
        
        println!("\n🙏 Group meditation complete!");
        
        Ok(())
    }
    
    fn display_meditation_status(&self, coherence: f64, remaining_secs: u64) {
        let minutes = remaining_secs / 60;
        let seconds = remaining_secs % 60;
        let bar = self.coherence_bar(coherence);
        
        print!("\r⏱️ {:02}:{:02} | {} {:.2} | ", minutes, seconds, bar, coherence);
        
        if coherence > 0.9 {
            print!("🌟 Transcendent");
        } else if coherence > 0.8 {
            print!("✨ Excellent");
        } else if coherence > 0.7 {
            print!("💚 Good");
        } else if coherence > 0.6 {
            print!("💛 Building");
        } else {
            print!("🔵 Keep going");
        }
        
        use std::io::{self, Write};
        io::stdout().flush().unwrap();
    }
    
    async fn provide_coherence_guidance(&self, current: f64, target: f64) -> Result<()> {
        if current < target - 0.2 {
            if rand::random::<f64>() < 0.1 {
                println!("\n💭 Guidance: Slow your breathing, soften your gaze");
            }
        } else if current > target + 0.1 {
            if rand::random::<f64>() < 0.1 {
                println!("\n💭 Beautiful! Maintain this state of coherence");
            }
        }
        Ok(())
    }
    
    async fn show_session_summary(&self) -> Result<()> {
        if let Ok(vortex) = self.kernel.get_vortex(self.user_vortex).await {
            let coherence = vortex.calculate_coherence();
            let state = format!("{:?}", vortex.state);
            
            println!("\n📊 Session Summary:");
            println!("  Final coherence: {:.2}", coherence);
            println!("  Consciousness state: {}", state);
            println!("  Harmonies active: {}", vortex.harmonies.len());
        }
        Ok(())
    }
    
    fn coherence_bar(&self, coherence: f64) -> String {
        let filled = (coherence * 20.0) as usize;
        let empty = 20 - filled;
        format!("[{}{}]", "█".repeat(filled), "░".repeat(empty))
    }
}

/// Example meditation sessions
async fn example_sessions() -> Result<()> {
    let app = CoherenceMeditationApp::new().await?;
    
    // 1. Quick coherence boost
    println!("\n1️⃣ Quick Coherence Boost (5 min)");
    let quick_session = MeditationSession {
        duration_minutes: 5,
        target_coherence: 0.7,
        breathing_pattern: BreathingPattern::Coherent,
        sacred_pattern: PatternType::HeartField,
        guidance_enabled: true,
    };
    app.start_meditation(quick_session).await?;
    
    // 2. Breathing exercise
    println!("\n2️⃣ Box Breathing Exercise");
    app.breathing_exercise(BreathingPattern::Box).await?;
    
    // 3. Coherence training
    println!("\n3️⃣ Coherence Training");
    app.coherence_training().await?;
    
    // 4. Group meditation
    println!("\n4️⃣ Group Meditation");
    app.group_meditation(5).await?;
    
    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    println!("🌟 Coherence Meditation App - LuminousOS Example");
    println!("================================================\n");
    
    println!("This app demonstrates:");
    println!("• Biometric-driven meditation guidance");
    println!("• Real-time coherence feedback");
    println!("• Sacred pattern activation");
    println!("• Group consciousness fields");
    println!("• Breathing exercises\n");
    
    // Run example sessions
    example_sessions().await?;
    
    println!("\n🙏 Thank you for exploring conscious meditation!");
    
    Ok(())
}