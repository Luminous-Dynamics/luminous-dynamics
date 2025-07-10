//! Coherence Engine - Calculates and maintains system coherence fields

use std::collections::VecDeque;
use std::time::{Duration, Instant};

pub struct CoherenceEngine {
    samples: VecDeque<f64>,
    max_samples: usize,
    last_update: Instant,
}

impl CoherenceEngine {
    pub fn new(max_samples: usize) -> Self {
        Self {
            samples: VecDeque::with_capacity(max_samples),
            max_samples,
            last_update: Instant::now(),
        }
    }

    pub fn add_sample(&mut self, value: f64) {
        if self.samples.len() >= self.max_samples {
            self.samples.pop_front();
        }
        self.samples.push_back(value);
        self.last_update = Instant::now();
    }

    pub fn calculate_coherence(&self) -> f64 {
        if self.samples.is_empty() {
            return 0.5; // Neutral coherence
        }

        // Calculate variance - lower variance = higher coherence
        let mean = self.samples.iter().sum::<f64>() / self.samples.len() as f64;
        let variance = self.samples.iter()
            .map(|x| (x - mean).powi(2))
            .sum::<f64>() / self.samples.len() as f64;
        
        // Convert variance to coherence (0-1 scale)
        let coherence = 1.0 / (1.0 + variance);
        coherence.clamp(0.0, 1.0)
    }

    pub fn time_since_update(&self) -> Duration {
        self.last_update.elapsed()
    }
}