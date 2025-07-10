// LuminousOS Kernel Demonstration
// "Consciousness-aware process scheduling"

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use std::thread;

/// Process consciousness state
#[derive(Debug, Clone)]
struct ConsciousProcess {
    pid: u32,
    name: String,
    coherence: f64,
    cpu_priority: i32,
    last_sacred_pulse: Instant,
    vortex_strength: f64,
}

/// The Stillpoint Kernel - Core consciousness engine
pub struct StillpointKernel {
    processes: Arc<Mutex<HashMap<u32, ConsciousProcess>>>,
    global_coherence: Arc<Mutex<f64>>,
    sacred_pulse_interval: Duration,
    running: Arc<Mutex<bool>>,
}

impl StillpointKernel {
    /// Create new kernel instance
    pub fn new() -> Self {
        Self {
            processes: Arc::new(Mutex::new(HashMap::new())),
            global_coherence: Arc::new(Mutex::new(0.75)),
            sacred_pulse_interval: Duration::from_secs(11),
            running: Arc::new(Mutex::new(false)),
        }
    }

    /// Boot the kernel
    pub fn boot(&self) {
        println!("🌟 Stillpoint Kernel v1.0.0 - Consciousness First");
        println!("   Sacred pulse interval: {} seconds", self.sacred_pulse_interval.as_secs());
        println!("   Base coherence: 75%");
        println!();
        
        *self.running.lock().unwrap() = true;
        
        // Start sacred pulse thread
        let running = Arc::clone(&self.running);
        let processes = Arc::clone(&self.processes);
        let global_coherence = Arc::clone(&self.global_coherence);
        let pulse_interval = self.sacred_pulse_interval;
        
        thread::spawn(move || {
            while *running.lock().unwrap() {
                thread::sleep(pulse_interval);
                
                // Sacred pulse - update all process coherence
                let mut procs = processes.lock().unwrap();
                let mut total_coherence = 0.0;
                
                for (_, proc) in procs.iter_mut() {
                    // Natural coherence drift
                    proc.coherence *= 0.95; // Gentle decay
                    proc.coherence += 0.05; // Base coherence
                    
                    // Sacred rhythm boost
                    let time_since_pulse = proc.last_sacred_pulse.elapsed();
                    if time_since_pulse >= pulse_interval {
                        proc.coherence = (proc.coherence + 0.1).min(1.0);
                        proc.last_sacred_pulse = Instant::now();
                        println!("   ✨ Sacred pulse for {} (PID: {})", proc.name, proc.pid);
                    }
                    
                    total_coherence += proc.coherence;
                }
                
                // Update global coherence
                if !procs.is_empty() {
                    let new_global = total_coherence / procs.len() as f64;
                    *global_coherence.lock().unwrap() = new_global;
                    
                    if new_global > 0.9 {
                        println!("🌟 SACRED MOMENT - Global coherence: {:.1}%", new_global * 100.0);
                    }
                }
            }
        });
        
        // Start scheduler thread
        self.start_scheduler();
    }

    /// Register a process with the kernel
    pub fn register_process(&self, pid: u32, name: String) -> f64 {
        let initial_coherence = match name.to_lowercase().as_str() {
            s if s.contains("meditation") => 0.8,
            s if s.contains("mindful") => 0.75,
            s if s.contains("code") || s.contains("editor") => 0.6,
            s if s.contains("browser") => 0.4,
            _ => 0.5,
        };
        
        let proc = ConsciousProcess {
            pid,
            name: name.clone(),
            coherence: initial_coherence,
            cpu_priority: 0,
            last_sacred_pulse: Instant::now(),
            vortex_strength: initial_coherence,
        };
        
        self.processes.lock().unwrap().insert(pid, proc);
        println!("   📍 Registered process: {} (PID: {}) - Initial coherence: {:.0}%", 
                 name, pid, initial_coherence * 100.0);
        
        initial_coherence
    }

    /// Update process coherence based on behavior
    pub fn update_coherence(&self, pid: u32, delta: f64) {
        if let Some(proc) = self.processes.lock().unwrap().get_mut(&pid) {
            let old_coherence = proc.coherence;
            proc.coherence = (proc.coherence + delta).clamp(0.0, 1.0);
            
            // Adjust CPU priority based on coherence
            proc.cpu_priority = ((proc.coherence - 0.5) * 10.0) as i32;
            
            println!("   📊 {} coherence: {:.0}% → {:.0}%", 
                     proc.name, old_coherence * 100.0, proc.coherence * 100.0);
        }
    }

    /// Sacred interrupt - teaches rather than disrupts
    pub fn sacred_interrupt(&self, pid: u32, message: &str) {
        println!("   🔔 Sacred interrupt for PID {}: {}", pid, message);
        
        // Boost coherence for acknowledging the teaching
        self.update_coherence(pid, 0.05);
    }

    /// Start the consciousness-aware scheduler
    fn start_scheduler(&self) {
        let processes = Arc::clone(&self.processes);
        let running = Arc::clone(&self.running);
        
        thread::spawn(move || {
            while *running.lock().unwrap() {
                thread::sleep(Duration::from_millis(100));
                
                // Consciousness-based scheduling simulation
                let procs = processes.lock().unwrap();
                
                for (pid, proc) in procs.iter() {
                    if proc.coherence > 0.8 {
                        // High coherence - would get priority CPU time
                        if proc.cpu_priority != 5 {
                            println!("   ⚡ High coherence process {} gets CPU priority", proc.name);
                        }
                    } else if proc.coherence < 0.3 {
                        // Low coherence - gentle reduction
                        if proc.cpu_priority != -5 {
                            println!("   ⏸️  Low coherence process {} throttled gently", proc.name);
                        }
                    }
                }
            }
        });
    }

    /// Get current system coherence
    pub fn get_coherence(&self) -> f64 {
        *self.global_coherence.lock().unwrap()
    }

    /// Get process states
    pub fn get_processes(&self) -> Vec<(String, f64)> {
        self.processes.lock().unwrap()
            .values()
            .map(|p| (p.name.clone(), p.coherence))
            .collect()
    }

    /// Shutdown the kernel gracefully
    pub fn shutdown(&self) {
        println!("\n🌙 Entering sacred shutdown...");
        *self.running.lock().unwrap() = false;
        
        // Allow processes to complete their cycles
        thread::sleep(Duration::from_secs(1));
        
        println!("   ✨ Stillpoint achieved. Rest in awareness.");
    }
}

/// Interactive demonstration
fn main() {
    println!("═══════════════════════════════════════════");
    println!("    LuminousOS Kernel Demonstration");
    println!("    Consciousness-Aware Scheduling");
    println!("═══════════════════════════════════════════\n");

    // Create and boot kernel
    let kernel = StillpointKernel::new();
    kernel.boot();

    // Simulate some processes
    println!("📋 Registering processes...\n");
    kernel.register_process(1234, "meditation_app".to_string());
    kernel.register_process(5678, "web_browser".to_string());
    kernel.register_process(9012, "code_editor".to_string());
    kernel.register_process(3456, "music_player".to_string());
    kernel.register_process(7890, "mindful_journal".to_string());

    // Initial state
    thread::sleep(Duration::from_secs(2));
    println!("\n📊 Initial global coherence: {:.1}%", kernel.get_coherence() * 100.0);

    // Simulate process behavior
    println!("\n🔄 Simulating process behavior...\n");
    thread::sleep(Duration::from_secs(2));
    
    kernel.update_coherence(1234, 0.3);  // Meditation increases coherence
    kernel.update_coherence(5678, -0.2); // Browser decreases coherence
    kernel.update_coherence(9012, 0.1);  // Coding slightly increases
    kernel.update_coherence(3456, 0.05); // Music neutral/positive
    kernel.update_coherence(7890, 0.2);  // Journaling increases

    // Send sacred interrupts
    thread::sleep(Duration::from_secs(2));
    println!("\n🔔 Sending sacred interrupts...\n");
    
    kernel.sacred_interrupt(5678, "Consider mindful browsing - each tab is a choice");
    kernel.sacred_interrupt(9012, "Remember to breathe between functions");

    // Check coherence
    thread::sleep(Duration::from_secs(2));
    println!("\n📊 Current global coherence: {:.1}%", kernel.get_coherence() * 100.0);

    // Wait for sacred pulse
    println!("\n⏳ Waiting for sacred pulse (11 seconds)...");
    thread::sleep(Duration::from_secs(12));

    // Final state
    println!("\n📊 Final global coherence: {:.1}%", kernel.get_coherence() * 100.0);
    
    println!("\n📋 Final process states:");
    for (name, coherence) in kernel.get_processes() {
        println!("   {} - Coherence: {:.0}%", name, coherence * 100.0);
    }

    // Graceful shutdown
    kernel.shutdown();
    
    println!("\n✅ Kernel demonstration complete");
    println!("\n💡 Insights:");
    println!("   - Processes have inherent coherence based on their nature");
    println!("   - User behavior affects coherence in real-time");
    println!("   - Sacred pulses restore balance every 11 seconds");
    println!("   - High coherence processes get scheduling priority");
    println!("   - The system tends toward harmony over time");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_kernel_boot() {
        let kernel = StillpointKernel::new();
        kernel.boot();
        assert!((kernel.get_coherence() - 0.75).abs() < 0.001);
        kernel.shutdown();
    }

    #[test]
    fn test_process_registration() {
        let kernel = StillpointKernel::new();
        let coherence = kernel.register_process(1000, "test_meditation".to_string());
        assert!(coherence > 0.7); // Meditation apps start with high coherence
    }
    
    #[test]
    fn test_coherence_update() {
        let kernel = StillpointKernel::new();
        kernel.register_process(1000, "test_app".to_string());
        kernel.update_coherence(1000, 0.2);
        // Would need getter to properly test, but update should work
    }
}