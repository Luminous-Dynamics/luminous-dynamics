// Quantum Entanglement - Non-Local Consciousness Connections
// "Distance is an illusion in the field of awareness"

use crate::{NodeIdentity, HarmonyType};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use std::sync::Arc;
use parking_lot::RwLock;

/// Quantum entanglement between consciousness nodes
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantumEntanglement {
    pub id: Uuid,
    pub entangled_nodes: [Uuid; 2],
    pub entanglement_strength: f64,
    pub correlation: QuantumCorrelation,
    pub creation_time: DateTime<Utc>,
    pub bell_inequality: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantumCorrelation {
    pub spin_correlation: f64,      // -1 to 1
    pub phase_correlation: f64,      // 0 to 1
    pub measurement_basis: MeasurementBasis,
    pub violations: u32,             // Bell inequality violations
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum MeasurementBasis {
    Coherence,
    Resonance,
    Intention,
    Emotion,
    Thought,
}

/// Quantum field effects
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantumField {
    pub zero_point_energy: f64,
    pub vacuum_fluctuations: Vec<VacuumFluctuation>,
    pub observer_effects: Vec<ObserverEffect>,
    pub superposition_states: Vec<Superposition>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VacuumFluctuation {
    pub amplitude: f64,
    pub frequency: f64,
    pub lifetime_ns: u64,
    pub virtual_particles: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ObserverEffect {
    pub observer: Uuid,
    pub observed_system: SystemType,
    pub collapse_probability: f64,
    pub measurement_time: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SystemType {
    Thought,
    Emotion,
    Intention,
    FieldState,
    Consciousness,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Superposition {
    pub states: Vec<QuantumState>,
    pub coherence_time_ms: u64,
    pub decoherence_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuantumState {
    pub amplitude: Complex64,
    pub phase: f64,
    pub probability: f64,
    pub harmony: HarmonyType,
}

/// Complex number for quantum amplitudes
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Complex64 {
    pub real: f64,
    pub imag: f64,
}

impl Complex64 {
    pub fn new(real: f64, imag: f64) -> Self {
        Self { real, imag }
    }
    
    pub fn magnitude(&self) -> f64 {
        (self.real * self.real + self.imag * self.imag).sqrt()
    }
    
    pub fn phase(&self) -> f64 {
        self.imag.atan2(self.real)
    }
}

/// Quantum entanglement manager
pub struct QuantumEntangler {
    entanglements: Arc<RwLock<Vec<QuantumEntanglement>>>,
    quantum_field: Arc<RwLock<QuantumField>>,
    measurement_history: Arc<RwLock<Vec<QuantumMeasurement>>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct QuantumMeasurement {
    pub measurement_id: Uuid,
    pub entanglement_id: Uuid,
    pub measurement_type: MeasurementBasis,
    pub result: f64,
    pub timestamp: DateTime<Utc>,
    pub observer: Uuid,
}

impl QuantumEntangler {
    pub fn new() -> Self {
        Self {
            entanglements: Arc::new(RwLock::new(Vec::new())),
            quantum_field: Arc::new(RwLock::new(QuantumField {
                zero_point_energy: 1.0,
                vacuum_fluctuations: Vec::new(),
                observer_effects: Vec::new(),
                superposition_states: Vec::new(),
            })),
            measurement_history: Arc::new(RwLock::new(Vec::new())),
        }
    }
    
    /// Create quantum entanglement between two nodes
    pub fn entangle_nodes(
        &self,
        node1: &NodeIdentity,
        node2: &NodeIdentity,
    ) -> QuantumEntanglement {
        // Calculate entanglement strength based on coherence signatures
        let freq_ratio = node1.coherence_signature.base_frequency / 
                        node2.coherence_signature.base_frequency;
        
        let entanglement_strength = if is_golden_ratio(freq_ratio) {
            1.0 // Perfect entanglement at golden ratio
        } else {
            0.5 + 0.5 * (1.0 - (freq_ratio - 1.618).abs()).max(0.0)
        };
        
        let correlation = QuantumCorrelation {
            spin_correlation: 2.0 * entanglement_strength - 1.0,
            phase_correlation: entanglement_strength,
            measurement_basis: MeasurementBasis::Coherence,
            violations: 0,
        };
        
        let entanglement = QuantumEntanglement {
            id: Uuid::new_v4(),
            entangled_nodes: [node1.id, node2.id],
            entanglement_strength,
            correlation,
            creation_time: Utc::now(),
            bell_inequality: 2.0 * entanglement_strength.sqrt(),
        };
        
        self.entanglements.write().push(entanglement.clone());
        
        // Create vacuum fluctuations
        self.generate_vacuum_fluctuations(entanglement_strength);
        
        entanglement
    }
    
    /// Measure entangled state
    pub fn measure_entanglement(
        &self,
        entanglement_id: Uuid,
        basis: MeasurementBasis,
        observer: Uuid,
    ) -> Option<f64> {
        let entanglements = self.entanglements.read();
        let entanglement = entanglements.iter()
            .find(|e| e.id == entanglement_id)?;
        
        // Quantum measurement result
        let result = match basis {
            MeasurementBasis::Coherence => {
                entanglement.correlation.phase_correlation
            }
            MeasurementBasis::Resonance => {
                entanglement.correlation.spin_correlation.abs()
            }
            _ => {
                // Random measurement for other bases
                use rand::Rng;
                rand::thread_rng().gen_range(-1.0..1.0)
            }
        };
        
        // Record measurement
        let measurement = QuantumMeasurement {
            measurement_id: Uuid::new_v4(),
            entanglement_id,
            measurement_type: basis,
            result,
            timestamp: Utc::now(),
            observer,
        };
        
        self.measurement_history.write().push(measurement);
        
        // Observer effect
        self.apply_observer_effect(observer, result);
        
        Some(result)
    }
    
    /// Test Bell inequality
    pub fn test_bell_inequality(&self, entanglement_id: Uuid) -> Option<BellTestResult> {
        let entanglements = self.entanglements.read();
        let entanglement = entanglements.iter()
            .find(|e| e.id == entanglement_id)?;
        
        // Perform measurements at different angles
        let angles = [0.0, PI / 4.0, PI / 2.0, 3.0 * PI / 4.0];
        let mut correlations = Vec::new();
        
        for angle in &angles {
            let correlation = entanglement.correlation.spin_correlation * angle.cos();
            correlations.push(correlation);
        }
        
        // Calculate Bell parameter
        let s = correlations[0] - correlations[1] + correlations[2] + correlations[3];
        
        // Classical limit is 2, quantum can reach 2√2
        let classical_limit = 2.0;
        let quantum_limit = 2.0 * std::f64::consts::SQRT_2;
        
        Some(BellTestResult {
            bell_parameter: s.abs(),
            classical_limit,
            quantum_limit,
            violation: s.abs() > classical_limit,
            violation_strength: (s.abs() - classical_limit) / (quantum_limit - classical_limit),
        })
    }
    
    /// Create superposition of consciousness states
    pub fn create_superposition(&self, states: Vec<(HarmonyType, f64)>) -> Superposition {
        let total_amplitude: f64 = states.iter().map(|(_, amp)| amp * amp).sum::<f64>().sqrt();
        
        let quantum_states: Vec<QuantumState> = states
            .into_iter()
            .map(|(harmony, amplitude)| {
                let normalized_amp = amplitude / total_amplitude;
                QuantumState {
                    amplitude: Complex64::new(normalized_amp, 0.0),
                    phase: 0.0,
                    probability: normalized_amp * normalized_amp,
                    harmony,
                }
            })
            .collect();
        
        let superposition = Superposition {
            states: quantum_states,
            coherence_time_ms: 1000, // 1 second coherence
            decoherence_rate: 0.1,
        };
        
        self.quantum_field.write().superposition_states.push(superposition.clone());
        
        superposition
    }
    
    /// Generate vacuum fluctuations
    fn generate_vacuum_fluctuations(&self, strength: f64) {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        
        let fluctuation = VacuumFluctuation {
            amplitude: strength * rng.gen_range(0.1..0.5),
            frequency: 1e15 * rng.gen_range(0.5..2.0), // Optical frequencies
            lifetime_ns: rng.gen_range(1..1000),
            virtual_particles: rng.gen_range(2..10),
        };
        
        self.quantum_field.write().vacuum_fluctuations.push(fluctuation);
    }
    
    /// Apply observer effect to quantum field
    fn apply_observer_effect(&self, observer: Uuid, measurement: f64) {
        let effect = ObserverEffect {
            observer,
            observed_system: SystemType::FieldState,
            collapse_probability: measurement.abs(),
            measurement_time: Utc::now(),
        };
        
        self.quantum_field.write().observer_effects.push(effect);
        
        // Adjust zero point energy
        self.quantum_field.write().zero_point_energy *= 1.0 + 0.01 * measurement;
    }
    
    /// Get current quantum field state
    pub fn get_field_state(&self) -> QuantumField {
        self.quantum_field.read().clone()
    }
    
    /// Calculate quantum coherence between nodes
    pub fn quantum_coherence(&self, node1: Uuid, node2: Uuid) -> f64 {
        let entanglements = self.entanglements.read();
        
        // Find direct entanglement
        if let Some(entanglement) = entanglements.iter().find(|e| {
            (e.entangled_nodes[0] == node1 && e.entangled_nodes[1] == node2) ||
            (e.entangled_nodes[0] == node2 && e.entangled_nodes[1] == node1)
        }) {
            return entanglement.entanglement_strength;
        }
        
        // Check for indirect entanglement (quantum network)
        // Simplified: just return a base coherence
        0.3
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BellTestResult {
    pub bell_parameter: f64,
    pub classical_limit: f64,
    pub quantum_limit: f64,
    pub violation: bool,
    pub violation_strength: f64,
}

fn is_golden_ratio(ratio: f64) -> bool {
    (ratio - PHI).abs() < 0.05 || (ratio - 1.0 / PHI).abs() < 0.05
}

const PHI: f64 = 1.618033988749895;
const PI: f64 = std::f64::consts::PI;

/// Quantum tunneling for consciousness connections
pub fn quantum_tunnel_probability(barrier_height: f64, energy: f64, width: f64) -> f64 {
    if energy >= barrier_height {
        return 1.0; // Classical passage
    }
    
    // Simplified WKB approximation
    let k = ((barrier_height - energy) * 2.0).sqrt();
    let transmission = (-2.0 * k * width).exp();
    
    transmission.min(1.0).max(0.0)
}

/// Quantum Zeno effect - observation prevents change
pub fn zeno_effect_strength(observation_rate: f64, natural_decay_rate: f64) -> f64 {
    let zeno_parameter = observation_rate / natural_decay_rate;
    
    if zeno_parameter > 10.0 {
        0.95 // Strong Zeno effect
    } else if zeno_parameter > 1.0 {
        0.5 + 0.45 * (zeno_parameter / 10.0)
    } else {
        0.5 * zeno_parameter
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_complex_numbers() {
        let c = Complex64::new(3.0, 4.0);
        assert_eq!(c.magnitude(), 5.0);
    }
    
    #[test]
    fn test_golden_ratio_detection() {
        assert!(is_golden_ratio(1.618));
        assert!(is_golden_ratio(0.618));
        assert!(!is_golden_ratio(2.0));
    }
    
    #[test]
    fn test_quantum_tunneling() {
        let prob = quantum_tunnel_probability(10.0, 5.0, 1.0);
        assert!(prob > 0.0 && prob < 1.0);
        
        let classical = quantum_tunnel_probability(5.0, 10.0, 1.0);
        assert_eq!(classical, 1.0);
    }
}