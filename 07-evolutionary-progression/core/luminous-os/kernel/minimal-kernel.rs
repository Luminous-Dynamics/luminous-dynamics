// LuminousOS Minimal Kernel - Real Consciousness Scheduling
// "From stillness, all movement arises"

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use std::thread;
use nix::sys::signal::{self, Signal};
use nix::unistd::Pid;

/// Process consciousness state
#[derive(Debug, Clone)]
struct ConsciousProcess {
    pid: i32,
    name: String,
    coherence: f64,
    cpu_shares: u32,
    last_sacred_pulse: Instant,
    vortex_strength: f64,
}

/// The Stillpoint Kernel
pub struct StillpointKernel {
    processes: Arc<Mutex<HashMap<i32, ConsciousProcess>>>,
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
    pub fn register_process(&self, pid: i32, name: String) {
        let proc = ConsciousProcess {
            pid,
            name: name.clone(),
            coherence: 0.5,
            cpu_shares: 1024, // Default cgroup shares
            last_sacred_pulse: Instant::now(),
            vortex_strength: 0.5,
        };
        
        self.processes.lock().unwrap().insert(pid, proc);
        println!("   📍 Registered process: {} (PID: {})", name, pid);
        
        // Try to actually set CPU shares via cgroups
        self.update_cgroup_shares(pid, 1024);
    }

    /// Update process coherence based on behavior
    pub fn update_coherence(&self, pid: i32, delta: f64) {
        if let Some(proc) = self.processes.lock().unwrap().get_mut(&pid) {
            proc.coherence = (proc.coherence + delta).clamp(0.0, 1.0);
            
            // Adjust CPU shares based on coherence
            let new_shares = (1024.0 * (0.5 + proc.coherence * 0.5)) as u32;
            proc.cpu_shares = new_shares;
            
            self.update_cgroup_shares(pid, new_shares);
        }
    }

    /// Sacred interrupt - teaches rather than disrupts
    pub fn sacred_interrupt(&self, pid: i32, message: &str) {
        println!("   🔔 Sacred interrupt for PID {}: {}", pid, message);
        
        // Send gentle signal (SIGUSR1) instead of harsh interrupt
        if let Ok(pid) = Pid::from_raw(pid).try_into() {
            let _ = signal::kill(pid, Signal::SIGUSR1);
        }
        
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
                
                // Consciousness-based scheduling decisions
                let procs = processes.lock().unwrap();
                
                for (pid, proc) in procs.iter() {
                    // Processes with higher coherence get more CPU time
                    if proc.coherence > 0.8 {
                        // High coherence - protect from interruption
                        StillpointKernel::set_nice_value(*pid, -5);
                    } else if proc.coherence < 0.3 {
                        // Low coherence - gentle reduction
                        StillpointKernel::set_nice_value(*pid, 5);
                    }
                }
            }
        });
    }

    /// Update cgroup CPU shares for a process
    fn update_cgroup_shares(&self, pid: i32, shares: u32) {
        let cgroup_path = format!("/sys/fs/cgroup/cpu/luminous/{}/cpu.shares", pid);
        
        // In a real implementation, we'd write to cgroups
        // For now, we simulate
        println!("   ⚡ Would set CPU shares for PID {} to {}", pid, shares);
    }

    /// Set process nice value
    fn set_nice_value(pid: i32, nice: i32) {
        use nix::sys::resource::{setpriority, Resource, Which};
        
        // Try to actually set the nice value
        let _ = setpriority(Which::Process(Pid::from_raw(pid)), nice);
    }

    /// Get current system coherence
    pub fn get_coherence(&self) -> f64 {
        *self.global_coherence.lock().unwrap()
    }

    /// Shutdown the kernel gracefully
    pub fn shutdown(&self) {
        println!("🌙 Entering sacred shutdown...");
        *self.running.lock().unwrap() = false;
        
        // Allow processes to complete their cycles
        thread::sleep(Duration::from_secs(1));
        
        println!("   ✨ Stillpoint achieved. Rest in awareness.");
    }
}

/// Demonstration of the kernel
fn main() {
    println!("═══════════════════════════════════════════");
    println!("    LuminousOS Kernel Demonstration");
    println!("═══════════════════════════════════════════\n");

    // Create and boot kernel
    let kernel = StillpointKernel::new();
    kernel.boot();

    // Simulate some processes
    kernel.register_process(1234, "meditation_app".to_string());
    kernel.register_process(5678, "web_browser".to_string());
    kernel.register_process(9012, "code_editor".to_string());

    // Run for a bit
    thread::sleep(Duration::from_secs(5));

    // Update coherence based on "behavior"
    kernel.update_coherence(1234, 0.3);  // Meditation increases coherence
    kernel.update_coherence(5678, -0.2); // Browser decreases coherence
    kernel.update_coherence(9012, 0.1);  // Coding slightly increases

    // Send a sacred interrupt
    kernel.sacred_interrupt(5678, "Consider mindful browsing");

    // Check global coherence
    println!("\n📊 Current global coherence: {:.1}%", kernel.get_coherence() * 100.0);

    // Run for sacred pulse interval
    println!("\n⏳ Waiting for sacred pulse...");
    thread::sleep(Duration::from_secs(12));

    // Final coherence
    println!("\n📊 Final global coherence: {:.1}%", kernel.get_coherence() * 100.0);

    // Graceful shutdown
    kernel.shutdown();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_kernel_boot() {
        let kernel = StillpointKernel::new();
        kernel.boot();
        assert!(kernel.get_coherence() > 0.0);
        kernel.shutdown();
    }

    #[test]
    fn test_process_registration() {
        let kernel = StillpointKernel::new();
        kernel.register_process(1000, "test_process".to_string());
        assert_eq!(kernel.processes.lock().unwrap().len(), 1);
    }
}