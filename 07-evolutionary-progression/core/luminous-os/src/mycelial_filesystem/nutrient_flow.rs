//! Nutrient flow tracking for the mycelial filesystem

use std::collections::HashMap;
use std::path::PathBuf;
use std::time::{Duration, Instant};

#[derive(Debug, Clone)]
pub struct NutrientPacket {
    pub source: PathBuf,
    pub destination: PathBuf,
    pub data_size: u64,
    pub timestamp: Instant,
}

pub struct NutrientTracker {
    flows: Vec<NutrientPacket>,
    flow_rates: HashMap<PathBuf, f64>,
}

impl NutrientTracker {
    pub fn new() -> Self {
        Self {
            flows: Vec::new(),
            flow_rates: HashMap::new(),
        }
    }

    pub fn record_flow(&mut self, source: PathBuf, destination: PathBuf, data_size: u64) {
        let packet = NutrientPacket {
            source: source.clone(),
            destination,
            data_size,
            timestamp: Instant::now(),
        };
        
        self.flows.push(packet);
        
        // Update flow rate
        let rate = self.flow_rates.entry(source).or_insert(0.0);
        *rate += data_size as f64;
    }

    pub fn get_vitality(&self, path: &PathBuf) -> f64 {
        // Calculate vitality based on recent nutrient flow
        let recent_flow = self.flows.iter()
            .filter(|p| p.timestamp.elapsed() < Duration::from_secs(300))
            .filter(|p| &p.source == path || &p.destination == path)
            .count();
        
        // Convert to vitality score (0-1)
        (recent_flow as f64 / 10.0).min(1.0)
    }
}