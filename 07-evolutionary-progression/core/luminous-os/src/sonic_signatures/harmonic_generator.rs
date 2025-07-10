//! Generate harmonic frequencies for processes

use std::f32::consts::PI;

pub struct HarmonicGenerator {
    base_frequency: f32,
    harmonics: Vec<f32>,
}

impl HarmonicGenerator {
    pub fn new(base_frequency: f32) -> Self {
        Self {
            base_frequency,
            harmonics: vec![1.0, 1.5, 2.0, 3.0, 5.0], // Sacred ratios
        }
    }

    pub fn generate_frequency_for_process(&self, cpu_usage: f32, memory_usage: f32) -> f32 {
        // Map system metrics to frequency
        let activity = (cpu_usage + memory_usage) / 2.0;
        let harmonic_index = (activity * (self.harmonics.len() - 1) as f32) as usize;
        
        self.base_frequency * self.harmonics[harmonic_index.min(self.harmonics.len() - 1)]
    }

    pub fn generate_waveform(&self, frequency: f32, duration: f32, sample_rate: u32) -> Vec<f32> {
        let num_samples = (duration * sample_rate as f32) as usize;
        (0..num_samples)
            .map(|i| {
                let t = i as f32 / sample_rate as f32;
                (2.0 * PI * frequency * t).sin()
            })
            .collect()
    }
}