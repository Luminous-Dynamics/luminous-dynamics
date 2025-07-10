// LuminousOS Process Coherence Monitor
// "Real-time consciousness visualization"

use std::collections::HashMap;
use std::fs::File;
use std::io::{self, BufRead, BufReader};
use std::time::{Duration, Instant};
use std::thread;
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone)]
struct ProcessCoherence {
    pid: u32,
    name: String,
    coherence: f64,
    cpu_usage: f64,
    memory_mb: f64,
    threads: u32,
    last_update: Instant,
    coherence_history: Vec<f64>,
}

#[derive(Debug)]
struct CoherenceMonitor {
    processes: Arc<Mutex<HashMap<u32, ProcessCoherence>>>,
    global_coherence: Arc<Mutex<f64>>,
    update_interval: Duration,
    running: Arc<Mutex<bool>>,
}

impl CoherenceMonitor {
    fn new() -> Self {
        Self {
            processes: Arc::new(Mutex::new(HashMap::new())),
            global_coherence: Arc::new(Mutex::new(75.0)),
            update_interval: Duration::from_secs(1),
            running: Arc::new(Mutex::new(false)),
        }
    }

    fn start(&self) {
        *self.running.lock().unwrap() = true;
        
        // Start monitoring thread
        let processes = Arc::clone(&self.processes);
        let global_coherence = Arc::clone(&self.global_coherence);
        let running = Arc::clone(&self.running);
        let interval = self.update_interval;
        
        thread::spawn(move || {
            while *running.lock().unwrap() {
                // Update process list
                Self::scan_processes(&processes);
                
                // Calculate global coherence
                let mut procs = processes.lock().unwrap();
                let total: f64 = procs.values().map(|p| p.coherence).sum();
                let count = procs.len() as f64;
                
                if count > 0.0 {
                    *global_coherence.lock().unwrap() = total / count;
                }
                
                // Update coherence based on behavior
                for (_, proc) in procs.iter_mut() {
                    Self::update_process_coherence(proc);
                }
                
                drop(procs);
                thread::sleep(interval);
            }
        });
    }

    fn scan_processes(processes: &Arc<Mutex<HashMap<u32, ProcessCoherence>>>) {
        // Read from /proc
        if let Ok(entries) = std::fs::read_dir("/proc") {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if let Some(pid_str) = path.file_name().and_then(|s| s.to_str()) {
                        if let Ok(pid) = pid_str.parse::<u32>() {
                            // Read process info
                            if let Ok(stat_content) = std::fs::read_to_string(path.join("stat")) {
                                if let Some(process) = Self::parse_proc_stat(pid, &stat_content) {
                                    processes.lock().unwrap().insert(pid, process);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fn parse_proc_stat(pid: u32, stat: &str) -> Option<ProcessCoherence> {
        // Basic parsing of /proc/[pid]/stat
        let parts: Vec<&str> = stat.split_whitespace().collect();
        if parts.len() < 24 {
            return None;
        }
        
        // Extract process name (field 2, in parentheses)
        let name = parts[1].trim_matches(|c| c == '(' || c == ')').to_string();
        
        // Calculate initial coherence based on process type
        let coherence = Self::calculate_initial_coherence(&name);
        
        Some(ProcessCoherence {
            pid,
            name,
            coherence,
            cpu_usage: 0.0,
            memory_mb: 0.0,
            threads: 1,
            last_update: Instant::now(),
            coherence_history: vec![coherence],
        })
    }

    fn calculate_initial_coherence(name: &str) -> f64 {
        let name_lower = name.to_lowercase();
        
        // Consciousness-aware apps
        if name_lower.contains("meditation") || name_lower.contains("mindful") {
            0.85
        } else if name_lower.contains("journal") || name_lower.contains("yoga") {
            0.75
        } else if name_lower.contains("music") || name_lower.contains("art") {
            0.65
        } else if name_lower.contains("code") || name_lower.contains("vim") {
            0.60
        } else if name_lower.contains("terminal") || name_lower.contains("bash") {
            0.55
        } else if name_lower.contains("browser") || name_lower.contains("chrome") {
            0.40
        } else {
            0.50
        }
    }

    fn update_process_coherence(proc: &mut ProcessCoherence) {
        // Simulate coherence changes based on "behavior"
        let time_since_update = proc.last_update.elapsed();
        
        if time_since_update > Duration::from_secs(11) {
            // Sacred pulse boost
            proc.coherence = (proc.coherence + 0.1).min(1.0);
        } else {
            // Natural drift
            proc.coherence = (proc.coherence * 0.98 + 0.02).min(1.0);
        }
        
        // Update history
        proc.coherence_history.push(proc.coherence);
        if proc.coherence_history.len() > 60 {
            proc.coherence_history.remove(0);
        }
        
        proc.last_update = Instant::now();
    }

    fn display(&self) {
        loop {
            // Clear screen
            print!("\x1B[2J\x1B[1;1H");
            
            println!("🌟 LuminousOS Process Coherence Monitor");
            println!("=====================================");
            
            // Global coherence
            let global = *self.global_coherence.lock().unwrap();
            println!("Global Coherence: {:.1}% {}", 
                global * 100.0,
                Self::coherence_bar(global));
            println!();
            
            // Process table
            println!("{:<8} {:<20} {:<12} {:<20}", "PID", "Name", "Coherence", "Visualization");
            println!("{:-<60}", "");
            
            let procs = self.processes.lock().unwrap();
            let mut sorted: Vec<_> = procs.values().collect();
            sorted.sort_by(|a, b| b.coherence.partial_cmp(&a.coherence).unwrap());
            
            for proc in sorted.iter().take(20) {
                let icon = if proc.coherence > 0.8 { "🌟" } 
                    else if proc.coherence > 0.6 { "✨" }
                    else if proc.coherence > 0.4 { "💫" }
                    else { "·" };
                    
                println!("{:<8} {:<20} {:>6.1}% {} {}", 
                    proc.pid,
                    Self::truncate_name(&proc.name, 20),
                    proc.coherence * 100.0,
                    icon,
                    Self::coherence_bar(proc.coherence));
            }
            
            println!("\n[Press Ctrl+C to exit]");
            
            thread::sleep(Duration::from_millis(500));
        }
    }

    fn coherence_bar(coherence: f64) -> String {
        let width = 20;
        let filled = (coherence * width as f64) as usize;
        let empty = width - filled;
        
        format!("[{}{}]", "█".repeat(filled), "░".repeat(empty))
    }

    fn truncate_name(name: &str, max_len: usize) -> String {
        if name.len() <= max_len {
            name.to_string()
        } else {
            format!("{}...", &name[..max_len-3])
        }
    }
}

fn main() {
    println!("Initializing Process Coherence Monitor...");
    
    let monitor = CoherenceMonitor::new();
    monitor.start();
    
    // Display thread
    monitor.display();
}