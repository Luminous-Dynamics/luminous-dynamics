// Coherence Stream - Processing Consciousness Data for Visualization
// "Transforming heartbeats into light"

use crate::{VortexUpdate, FieldUpdate};
use nalgebra::{Vector3, Point3};
use std::collections::VecDeque;
use std::sync::Arc;
use tokio::sync::RwLock;

/// Processes raw coherence data into smooth visualization streams
pub struct CoherenceStream {
    vortex_buffers: Arc<RwLock<HashMap<uuid::Uuid, VortexBuffer>>>,
    field_buffer: Arc<RwLock<FieldBuffer>>,
    smoothing_factor: f64,
    prediction_horizon: f64,
}

use std::collections::HashMap;

struct VortexBuffer {
    coherence_history: VecDeque<(f64, f64)>, // (timestamp, coherence)
    momentum_history: VecDeque<Vector3<f64>>,
    phase_history: VecDeque<f64>,
    predicted_state: Option<PredictedState>,
}

struct FieldBuffer {
    coherence_history: VecDeque<(f64, f64)>,
    harmonic_history: VecDeque<Vec<f64>>,
    phase_coherence_history: VecDeque<f64>,
}

#[derive(Debug, Clone)]
struct PredictedState {
    coherence: f64,
    momentum: Vector3<f64>,
    phase: f64,
    confidence: f64,
}

impl CoherenceStream {
    pub fn new() -> Self {
        Self {
            vortex_buffers: Arc::new(RwLock::new(HashMap::new())),
            field_buffer: Arc::new(RwLock::new(FieldBuffer {
                coherence_history: VecDeque::with_capacity(100),
                harmonic_history: VecDeque::with_capacity(100),
                phase_coherence_history: VecDeque::with_capacity(100),
            })),
            smoothing_factor: 0.15,
            prediction_horizon: 0.1, // 100ms ahead
        }
    }
    
    /// Process vortex update with smoothing and prediction
    pub async fn process_vortex(&self, update: &VortexUpdate) -> anyhow::Result<ProcessedVortexData> {
        let mut buffers = self.vortex_buffers.write().await;
        
        let buffer = buffers.entry(update.vortex_id)
            .or_insert_with(|| VortexBuffer {
                coherence_history: VecDeque::with_capacity(50),
                momentum_history: VecDeque::with_capacity(50),
                phase_history: VecDeque::with_capacity(50),
                predicted_state: None,
            });
        
        // Add to history
        let timestamp = update.timestamp.timestamp_millis() as f64 / 1000.0;
        buffer.coherence_history.push_back((timestamp, update.coherence));
        if buffer.coherence_history.len() > 50 {
            buffer.coherence_history.pop_front();
        }
        
        let momentum = Vector3::new(
            update.state.momentum[0],
            update.state.momentum[1],
            update.state.momentum[2],
        );
        buffer.momentum_history.push_back(momentum);
        if buffer.momentum_history.len() > 50 {
            buffer.momentum_history.pop_front();
        }
        
        buffer.phase_history.push_back(update.state.phase);
        if buffer.phase_history.len() > 50 {
            buffer.phase_history.pop_front();
        }
        
        // Apply smoothing
        let smoothed_coherence = self.smooth_coherence(&buffer.coherence_history);
        let smoothed_momentum = self.smooth_momentum(&buffer.momentum_history);
        let smoothed_phase = self.smooth_phase(&buffer.phase_history);
        
        // Predict future state
        let predicted = self.predict_state(buffer, timestamp);
        buffer.predicted_state = Some(predicted.clone());
        
        // Calculate visualization parameters
        let breath_cycle = (timestamp * update.biometrics.breath_rate / 60.0).sin();
        let heart_pulse = (timestamp * update.biometrics.heart_rate / 60.0).sin();
        
        Ok(ProcessedVortexData {
            vortex_id: update.vortex_id,
            smoothed_coherence,
            smoothed_momentum,
            smoothed_phase,
            predicted_state: predicted,
            breath_influence: breath_cycle * 0.1,
            heart_influence: heart_pulse * 0.05,
            glow_intensity: smoothed_coherence * update.biometrics.heart_coherence,
            particle_density: (smoothed_coherence * 1000.0) as u32,
            color_shift: self.calculate_color_shift(smoothed_coherence, update.state.energy),
        })
    }
    
    /// Process field update with smoothing
    pub async fn process_field(&self, update: &FieldUpdate) -> anyhow::Result<ProcessedFieldData> {
        let mut buffer = self.field_buffer.write().await;
        
        let timestamp = update.timestamp.timestamp_millis() as f64 / 1000.0;
        
        // Update histories
        buffer.coherence_history.push_back((timestamp, update.coherence_level));
        if buffer.coherence_history.len() > 100 {
            buffer.coherence_history.pop_front();
        }
        
        buffer.harmonic_history.push_back(update.harmonic_peaks.clone());
        if buffer.harmonic_history.len() > 100 {
            buffer.harmonic_history.pop_front();
        }
        
        buffer.phase_coherence_history.push_back(update.phase_coherence);
        if buffer.phase_coherence_history.len() > 100 {
            buffer.phase_coherence_history.pop_front();
        }
        
        // Apply smoothing
        let smoothed_coherence = self.smooth_coherence(&buffer.coherence_history);
        let smoothed_harmonics = self.smooth_harmonics(&buffer.harmonic_history);
        let smoothed_phase_coherence = self.smooth_scalar_history(&buffer.phase_coherence_history);
        
        // Calculate wave parameters
        let wave_data = self.calculate_wave_parameters(&smoothed_harmonics, timestamp);
        
        Ok(ProcessedFieldData {
            smoothed_coherence,
            smoothed_harmonics,
            smoothed_phase_coherence,
            wave_parameters: wave_data,
            field_gradient: self.calculate_field_gradient(&buffer.coherence_history),
            resonance_nodes: self.find_resonance_nodes(&smoothed_harmonics),
        })
    }
    
    fn smooth_coherence(&self, history: &VecDeque<(f64, f64)>) -> f64 {
        if history.is_empty() {
            return 0.0;
        }
        
        let alpha = self.smoothing_factor;
        let mut smoothed = history[0].1;
        
        for i in 1..history.len() {
            smoothed = alpha * history[i].1 + (1.0 - alpha) * smoothed;
        }
        
        smoothed
    }
    
    fn smooth_momentum(&self, history: &VecDeque<Vector3<f64>>) -> Vector3<f64> {
        if history.is_empty() {
            return Vector3::zeros();
        }
        
        let alpha = self.smoothing_factor;
        let mut smoothed = history[0];
        
        for i in 1..history.len() {
            smoothed = history[i] * alpha + smoothed * (1.0 - alpha);
        }
        
        smoothed
    }
    
    fn smooth_phase(&self, history: &VecDeque<f64>) -> f64 {
        if history.is_empty() {
            return 0.0;
        }
        
        // Phase requires special handling for wraparound
        let mut sin_sum = 0.0;
        let mut cos_sum = 0.0;
        let weights_sum = 0.0;
        
        for (i, &phase) in history.iter().enumerate() {
            let weight = (i + 1) as f64 / history.len() as f64;
            sin_sum += phase.sin() * weight;
            cos_sum += phase.cos() * weight;
        }
        
        sin_sum.atan2(cos_sum)
    }
    
    fn smooth_scalar_history(&self, history: &VecDeque<f64>) -> f64 {
        if history.is_empty() {
            return 0.0;
        }
        
        let alpha = self.smoothing_factor;
        let mut smoothed = history[0];
        
        for i in 1..history.len() {
            smoothed = alpha * history[i] + (1.0 - alpha) * smoothed;
        }
        
        smoothed
    }
    
    fn smooth_harmonics(&self, history: &VecDeque<Vec<f64>>) -> Vec<f64> {
        if history.is_empty() {
            return vec![];
        }
        
        let max_len = history.iter().map(|h| h.len()).max().unwrap_or(0);
        let mut smoothed = vec![0.0; max_len];
        
        for harmonics in history.iter() {
            for (i, &h) in harmonics.iter().enumerate() {
                if i < smoothed.len() {
                    smoothed[i] += h;
                }
            }
        }
        
        for h in &mut smoothed {
            *h /= history.len() as f64;
        }
        
        smoothed
    }
    
    fn predict_state(&self, buffer: &VortexBuffer, current_time: f64) -> PredictedState {
        if buffer.coherence_history.len() < 3 {
            return PredictedState {
                coherence: buffer.coherence_history.back().map(|(_, c)| *c).unwrap_or(0.0),
                momentum: buffer.momentum_history.back().cloned().unwrap_or_else(Vector3::zeros),
                phase: buffer.phase_history.back().cloned().unwrap_or(0.0),
                confidence: 0.0,
            };
        }
        
        // Simple linear prediction
        let n = buffer.coherence_history.len();
        let recent: Vec<_> = buffer.coherence_history.iter()
            .skip(n.saturating_sub(5))
            .collect();
        
        if recent.len() >= 2 {
            let dt = recent.last().unwrap().0 - recent.first().unwrap().0;
            let dc = recent.last().unwrap().1 - recent.first().unwrap().1;
            let rate = if dt > 0.0 { dc / dt } else { 0.0 };
            
            let predicted_coherence = recent.last().unwrap().1 + rate * self.prediction_horizon;
            
            PredictedState {
                coherence: predicted_coherence.clamp(0.0, 1.0),
                momentum: buffer.momentum_history.back().cloned().unwrap_or_else(Vector3::zeros),
                phase: buffer.phase_history.back().cloned().unwrap_or(0.0),
                confidence: 0.8,
            }
        } else {
            PredictedState {
                coherence: recent.last().unwrap().1,
                momentum: buffer.momentum_history.back().cloned().unwrap_or_else(Vector3::zeros),
                phase: buffer.phase_history.back().cloned().unwrap_or(0.0),
                confidence: 0.5,
            }
        }
    }
    
    fn calculate_color_shift(&self, coherence: f64, energy: f64) -> [f32; 3] {
        let hue_shift = coherence * 60.0; // Shift towards violet at high coherence
        let saturation = 0.5 + energy * 0.5;
        let brightness = 0.7 + coherence * 0.3;
        
        [hue_shift as f32, saturation as f32, brightness as f32]
    }
    
    fn calculate_wave_parameters(&self, harmonics: &[f64], time: f64) -> Vec<WaveParameters> {
        harmonics.iter().enumerate().map(|(i, &freq)| {
            WaveParameters {
                frequency: freq,
                amplitude: 1.0 / (i + 1) as f64, // Natural harmonic decay
                phase: time * freq * 2.0 * std::f64::consts::PI,
                wavelength: 343.0 / freq, // Speed of sound / frequency
            }
        }).collect()
    }
    
    fn calculate_field_gradient(&self, history: &VecDeque<(f64, f64)>) -> f64 {
        if history.len() < 2 {
            return 0.0;
        }
        
        let recent: Vec<_> = history.iter()
            .skip(history.len().saturating_sub(10))
            .collect();
        
        if recent.len() >= 2 {
            let dt = recent.last().unwrap().0 - recent.first().unwrap().0;
            let dc = recent.last().unwrap().1 - recent.first().unwrap().1;
            
            if dt > 0.0 { dc / dt } else { 0.0 }
        } else {
            0.0
        }
    }
    
    fn find_resonance_nodes(&self, harmonics: &[f64]) -> Vec<Point3<f64>> {
        let mut nodes = Vec::new();
        
        // Find where harmonics create standing wave nodes
        for (i, &f1) in harmonics.iter().enumerate() {
            for (j, &f2) in harmonics.iter().enumerate().skip(i + 1) {
                if (f2 / f1 - (f2 / f1).round()).abs() < 0.05 {
                    // Harmonic relationship found
                    let angle = i as f64 * std::f64::consts::TAU / harmonics.len() as f64;
                    nodes.push(Point3::new(
                        angle.cos(),
                        angle.sin(),
                        (f2 / f1).ln(),
                    ));
                }
            }
        }
        
        nodes
    }
}

#[derive(Debug, Clone)]
pub struct ProcessedVortexData {
    pub vortex_id: uuid::Uuid,
    pub smoothed_coherence: f64,
    pub smoothed_momentum: Vector3<f64>,
    pub smoothed_phase: f64,
    pub predicted_state: PredictedState,
    pub breath_influence: f64,
    pub heart_influence: f64,
    pub glow_intensity: f64,
    pub particle_density: u32,
    pub color_shift: [f32; 3],
}

#[derive(Debug, Clone)]
pub struct ProcessedFieldData {
    pub smoothed_coherence: f64,
    pub smoothed_harmonics: Vec<f64>,
    pub smoothed_phase_coherence: f64,
    pub wave_parameters: Vec<WaveParameters>,
    pub field_gradient: f64,
    pub resonance_nodes: Vec<Point3<f64>>,
}

#[derive(Debug, Clone)]
pub struct WaveParameters {
    pub frequency: f64,
    pub amplitude: f64,
    pub phase: f64,
    pub wavelength: f64,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_coherence_stream_creation() {
        let stream = CoherenceStream::new();
        assert_eq!(stream.smoothing_factor, 0.15);
    }
}