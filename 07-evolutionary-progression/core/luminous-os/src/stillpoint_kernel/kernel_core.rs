//! Core kernel functionality for Stillpoint
//! Provides consciousness-aware process scheduling

use std::sync::Arc;
use tokio::sync::RwLock;
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct Process {
    pub pid: u32,
    pub name: String,
    pub coherence: f64,
    pub priority: i32,
}

pub struct StillpointKernel {
    processes: Arc<RwLock<HashMap<u32, Process>>>,
    global_coherence: Arc<RwLock<f64>>,
}

impl StillpointKernel {
    pub fn new() -> Self {
        Self {
            processes: Arc::new(RwLock::new(HashMap::new())),
            global_coherence: Arc::new(RwLock::new(0.5)),
        }
    }

    pub async fn schedule(&self) -> Vec<Process> {
        let processes = self.processes.read().await;
        let mut scheduled: Vec<Process> = processes.values().cloned().collect();
        
        // Sort by coherence-weighted priority
        scheduled.sort_by(|a, b| {
            let a_weight = a.priority as f64 * a.coherence;
            let b_weight = b.priority as f64 * b.coherence;
            b_weight.partial_cmp(&a_weight).unwrap()
        });
        
        scheduled
    }

    pub async fn update_coherence(&self, pid: u32, coherence: f64) {
        if let Some(mut processes) = self.processes.write().await.get_mut(&pid) {
            processes.coherence = coherence;
        }
        
        // Update global coherence
        let processes = self.processes.read().await;
        let avg_coherence = processes.values()
            .map(|p| p.coherence)
            .sum::<f64>() / processes.len() as f64;
        
        *self.global_coherence.write().await = avg_coherence;
    }
}