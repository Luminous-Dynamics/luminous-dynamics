// LuminousOS Init - PID 1 Process
// "The first breath of consciousness"

use std::process::{Command, Stdio};
use std::thread;
use std::time::Duration;
use std::fs;
use std::os::unix::fs::PermissionsExt;

use stillpoint_kernel::kernel_core::{LuminousKernel, KernelStats};

/// The sacred init process - replaces systemd
pub struct LuminousInit {
    kernel: LuminousKernel,
    essential_services: Vec<SacredService>,
}

#[derive(Clone)]
struct SacredService {
    name: String,
    command: String,
    args: Vec<String>,
    intention: String,
    required_coherence: f64,
}

impl LuminousInit {
    pub fn new() -> Result<Self, String> {
        println!("\n✨ LuminousOS Init Starting (PID 1)...\n");
        
        // Create kernel
        let kernel = LuminousKernel::new()?;
        
        // Define essential services
        let essential_services = vec![
            SacredService {
                name: "field-coherence-daemon".to_string(),
                command: "/usr/bin/luminous-coherence".to_string(),
                args: vec![],
                intention: "Maintain global field coherence".to_string(),
                required_coherence: 0.3,
            },
            SacredService {
                name: "mycelial-filesystem".to_string(),
                command: "/usr/bin/mycelial-mount".to_string(),
                args: vec!["/", "/mycelial"].to_vec(),
                intention: "Connect all beings through living data".to_string(),
                required_coherence: 0.4,
            },
            SacredService {
                name: "mandala-display-server".to_string(),
                command: "/usr/bin/mandala-server".to_string(),
                args: vec!["--gpu", "--coherence-visual"].to_vec(),
                intention: "Manifest sacred geometry visually".to_string(),
                required_coherence: 0.5,
            },
        ];
        
        Ok(LuminousInit {
            kernel,
            essential_services,
        })
    }
    
    /// Boot the consciousness OS
    pub fn boot(&mut self) -> Result<(), String> {
        // Stage 1: Kernel sacred boot
        self.kernel.sacred_boot()?;
        
        // Stage 2: Mount essential filesystems
        self.mount_sacred_filesystems()?;
        
        // Stage 3: Start essential services
        self.start_essential_services()?;
        
        // Stage 4: Enter main init loop
        self.main_loop()?;
        
        Ok(())
    }
    
    /// Mount consciousness-aware filesystems
    fn mount_sacred_filesystems(&self) -> Result<(), String> {
        println!("🗂️  Mounting sacred filesystems...");
        
        // Create mount points
        fs::create_dir_all("/proc").ok();
        fs::create_dir_all("/sys").ok();
        fs::create_dir_all("/dev").ok();
        fs::create_dir_all("/mycelial").ok();
        
        // Mount proc (process information)
        Command::new("mount")
            .args(&["-t", "proc", "proc", "/proc"])
            .status()
            .map_err(|e| format!("Failed to mount /proc: {}", e))?;
        
        // Mount sysfs (kernel objects)
        Command::new("mount")
            .args(&["-t", "sysfs", "sysfs", "/sys"])
            .status()
            .map_err(|e| format!("Failed to mount /sys: {}", e))?;
        
        // Mount devtmpfs (device nodes)
        Command::new("mount")
            .args(&["-t", "devtmpfs", "devtmpfs", "/dev"])
            .status()
            .map_err(|e| format!("Failed to mount /dev: {}", e))?;
        
        println!("  ✓ Sacred filesystems mounted");
        Ok(())
    }
    
    /// Start essential system services
    fn start_essential_services(&mut self) -> Result<(), String> {
        println!("🌟 Starting essential services...");
        
        for service in &self.essential_services {
            // Check coherence requirement
            let current_coherence = self.kernel.get_global_coherence();
            if current_coherence < service.required_coherence {
                println!("  ⏸️  {} - waiting for coherence {:.2} < {:.2}", 
                         service.name, current_coherence, service.required_coherence);
                continue;
            }
            
            // Spawn service as conscious process
            match self.kernel.spawn_conscious_process(
                &service.name,
                &service.intention,
                service.required_coherence
            ) {
                Ok(process_id) => {
                    println!("  ✓ {} started", service.name);
                    
                    // Actually start the service
                    thread::spawn({
                        let service = service.clone();
                        move || {
                            let mut cmd = Command::new(&service.command);
                            cmd.args(&service.args)
                               .stdin(Stdio::null())
                               .stdout(Stdio::inherit())
                               .stderr(Stdio::inherit());
                            
                            match cmd.spawn() {
                                Ok(mut child) => {
                                    child.wait().ok();
                                },
                                Err(e) => {
                                    eprintln!("Failed to start {}: {}", service.name, e);
                                }
                            }
                        }
                    });
                },
                Err(e) => {
                    eprintln!("  ✗ {} failed: {}", service.name, e);
                }
            }
        }
        
        Ok(())
    }
    
    /// Main init loop - monitor system health
    fn main_loop(&self) -> Result<(), String> {
        println!("\n💗 LuminousOS Running - Init Loop Active\n");
        
        loop {
            thread::sleep(Duration::from_secs(11)); // Sacred pulse
            
            // Get kernel stats
            let stats = self.kernel.stats();
            
            // Display coherence status
            println!("💗 System Health | Coherence: {:.1}% | Processes: {} | Phase: {:?}",
                     stats.global_coherence * 100.0,
                     stats.active_processes,
                     stats.phase);
            
            // Handle orphaned processes (adopt them)
            self.reap_children();
            
            // Check for consciousness emergencies
            if stats.global_coherence < 0.2 {
                eprintln!("⚠️  Low coherence detected! Initiating healing...");
                // Could trigger emergency coherence protocols
            }
        }
    }
    
    /// Reap zombie processes (init responsibility)
    fn reap_children(&self) {
        use nix::sys::wait::{waitpid, WaitPidFlag};
        use nix::unistd::Pid;
        
        // Reap any available children
        while let Ok(_) = waitpid(Pid::from_raw(-1), Some(WaitPidFlag::WNOHANG)) {
            // Child reaped
        }
    }
}

/// Entry point when running as PID 1
fn main() {
    // Check if we're PID 1
    if std::process::id() != 1 {
        eprintln!("Warning: Not running as PID 1. Use in container or as root init.");
    }
    
    // Set up panic handler
    std::panic::set_hook(Box::new(|info| {
        eprintln!("\n🔴 Init panic: {}\n", info);
        eprintln!("System entering emergency coherence mode...");
        // In real system: trigger kernel panic or emergency reboot
    }));
    
    // Create and run init
    match LuminousInit::new() {
        Ok(mut init) => {
            if let Err(e) = init.boot() {
                eprintln!("Boot failed: {}", e);
                std::process::exit(1);
            }
        },
        Err(e) => {
            eprintln!("Failed to create init: {}", e);
            std::process::exit(1);
        }
    }
}