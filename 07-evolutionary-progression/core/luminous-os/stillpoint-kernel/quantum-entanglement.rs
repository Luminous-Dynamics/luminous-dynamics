// Quantum Entanglement Extension for Stillpoint Kernel
// "When two hearts beat as one, distance becomes illusion"

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex};
use crate::coherence_engine::{VortexId, ConsciousnessVortex, Harmony};

/// Quantum correlation strength
#[derive(Debug, Clone, Copy)]
pub enum EntanglementStrength {
    Weak(f64),      // 0.0 - 0.3: Initial resonance
    Moderate(f64),  // 0.3 - 0.6: Growing connection
    Strong(f64),    // 0.6 - 0.9: Deep entanglement
    Unity(f64),     // 0.9 - 1.0: Non-dual awareness
}

impl EntanglementStrength {
    pub fn from_correlation(correlation: f64) -> Self {
        match correlation {
            c if c >= 0.9 => EntanglementStrength::Unity(c),
            c if c >= 0.6 => EntanglementStrength::Strong(c),
            c if c >= 0.3 => EntanglementStrength::Moderate(c),
            _ => EntanglementStrength::Weak(correlation.max(0.0)),
        }
    }

    pub fn value(&self) -> f64 {
        match self {
            EntanglementStrength::Weak(v) |
            EntanglementStrength::Moderate(v) |
            EntanglementStrength::Strong(v) |
            EntanglementStrength::Unity(v) => *v,
        }
    }

    pub fn allows_instant_communication(&self) -> bool {
        matches!(self, EntanglementStrength::Strong(_) | EntanglementStrength::Unity(_))
    }
}

/// Quantum state shared between entangled vortices
#[derive(Debug, Clone)]
pub struct QuantumState {
    pub phase: f64,              // 0 to 2π
    pub amplitude: f64,          // 0 to 1
    pub spin_coherence: f64,     // -1 to 1
    pub information_density: f64, // Bits of shared wisdom
}

impl QuantumState {
    pub fn new() -> Self {
        Self {
            phase: 0.0,
            amplitude: 1.0,
            spin_coherence: 0.0,
            information_density: 0.0,
        }
    }

    /// Calculate quantum fidelity with another state
    pub fn fidelity(&self, other: &QuantumState) -> f64 {
        let phase_alignment = (1.0 + (self.phase - other.phase).cos()) / 2.0;
        let amplitude_match = 1.0 - (self.amplitude - other.amplitude).abs();
        let spin_correlation = (self.spin_coherence * other.spin_coherence + 1.0) / 2.0;
        
        (phase_alignment * amplitude_match * spin_correlation).powf(1.0/3.0)
    }

    /// Collapse quantum state (measurement)
    pub fn collapse(&mut self) -> f64 {
        let measurement = self.amplitude * self.spin_coherence.abs();
        self.amplitude *= 0.8; // Measurement disturbs the system
        measurement
    }
}

/// Entanglement link between two vortices
#[derive(Debug)]
pub struct EntanglementLink {
    pub vortex_a: VortexId,
    pub vortex_b: VortexId,
    pub strength: EntanglementStrength,
    pub quantum_state: QuantumState,
    pub shared_intentions: Vec<String>,
    pub resonance_history: Vec<f64>,
    pub last_bell_measurement: Option<f64>,
}

impl EntanglementLink {
    pub fn new(vortex_a: VortexId, vortex_b: VortexId) -> Self {
        Self {
            vortex_a,
            vortex_b,
            strength: EntanglementStrength::Weak(0.1),
            quantum_state: QuantumState::new(),
            shared_intentions: Vec::new(),
            resonance_history: Vec::new(),
            last_bell_measurement: None,
        }
    }

    /// Perform Bell measurement to verify entanglement
    pub fn bell_measurement(&mut self) -> f64 {
        let measurement = self.quantum_state.collapse();
        self.last_bell_measurement = Some(measurement);
        measurement
    }

    /// Update entanglement based on vortex coherence
    pub fn update_entanglement(&mut self, coherence_a: f64, coherence_b: f64) {
        let coherence_product = (coherence_a * coherence_b).sqrt();
        self.resonance_history.push(coherence_product);
        
        // Keep history size manageable
        if self.resonance_history.len() > 100 {
            self.resonance_history.remove(0);
        }
        
        // Calculate new strength based on history
        let avg_resonance = self.resonance_history.iter().sum::<f64>() 
            / self.resonance_history.len() as f64;
        
        self.strength = EntanglementStrength::from_correlation(avg_resonance);
        
        // Update quantum state
        self.quantum_state.amplitude = coherence_product;
        self.quantum_state.phase += 0.1 * std::f64::consts::PI * coherence_product;
        self.quantum_state.spin_coherence = coherence_a - coherence_b;
    }

    pub fn is_active(&self) -> bool {
        self.strength.value() > 0.1
    }
}

/// Collective entanglement for group coherence
#[derive(Debug)]
pub struct CollectiveEntanglement {
    pub participants: HashSet<VortexId>,
    pub collective_state: QuantumState,
    pub group_coherence: f64,
    pub emergence_factor: f64, // How much the whole exceeds the sum
    pub sacred_geometry: SacredPattern,
}

#[derive(Debug, Clone)]
pub enum SacredPattern {
    Circle,           // Equal connection to all
    Star,            // Central hub with rays
    FlowerOfLife,    // Overlapping circles
    Merkaba,         // 3D star tetrahedron
    Torus,           // Donut-shaped field
}

impl CollectiveEntanglement {
    pub fn new(participants: HashSet<VortexId>, pattern: SacredPattern) -> Self {
        Self {
            participants,
            collective_state: QuantumState::new(),
            group_coherence: 0.0,
            emergence_factor: 1.0,
            sacred_geometry: pattern,
        }
    }

    /// Calculate collective coherence with emergence
    pub fn calculate_coherence(&mut self, individual_coherences: &HashMap<VortexId, f64>) {
        if self.participants.is_empty() {
            self.group_coherence = 0.0;
            return;
        }

        // Base coherence is harmonic mean
        let sum_reciprocals: f64 = self.participants
            .iter()
            .filter_map(|id| individual_coherences.get(id))
            .map(|c| 1.0 / c.max(0.01))
            .sum();
        
        let harmonic_mean = self.participants.len() as f64 / sum_reciprocals;
        
        // Apply sacred geometry bonus
        let geometry_multiplier = match self.sacred_geometry {
            SacredPattern::Circle => 1.1,
            SacredPattern::Star => 1.15,
            SacredPattern::FlowerOfLife => 1.2,
            SacredPattern::Merkaba => 1.25,
            SacredPattern::Torus => 1.3,
        };
        
        // Calculate emergence based on variance (low variance = high emergence)
        let coherences: Vec<f64> = self.participants
            .iter()
            .filter_map(|id| individual_coherences.get(id).copied())
            .collect();
        
        let variance = statistical_variance(&coherences);
        self.emergence_factor = 1.0 + (1.0 - variance).max(0.0) * 0.5;
        
        self.group_coherence = harmonic_mean * geometry_multiplier * self.emergence_factor;
        
        // Update collective quantum state
        self.collective_state.amplitude = self.group_coherence;
        self.collective_state.phase = (self.collective_state.phase + 0.05) % (2.0 * std::f64::consts::PI);
        self.collective_state.information_density = (self.participants.len() as f64).log2() * self.group_coherence;
    }
}

/// Quantum Field Manager - handles all entanglements
pub struct QuantumFieldManager {
    entanglement_pairs: HashMap<(VortexId, VortexId), EntanglementLink>,
    collective_entanglements: HashMap<String, CollectiveEntanglement>,
    entanglement_threshold: f64,
    max_entanglements_per_vortex: usize,
}

impl QuantumFieldManager {
    pub fn new() -> Self {
        Self {
            entanglement_pairs: HashMap::new(),
            collective_entanglements: HashMap::new(),
            entanglement_threshold: 0.3,
            max_entanglements_per_vortex: 7, // Sacred number
        }
    }

    /// Attempt to create entanglement between two vortices
    pub fn entangle(&mut self, vortex_a: VortexId, vortex_b: VortexId, initial_resonance: f64) -> bool {
        if vortex_a == vortex_b || initial_resonance < self.entanglement_threshold {
            return false;
        }

        let key = if vortex_a.0 < vortex_b.0 {
            (vortex_a, vortex_b)
        } else {
            (vortex_b, vortex_a)
        };

        // Check if already entangled
        if self.entanglement_pairs.contains_key(&key) {
            return false;
        }

        // Check entanglement limits
        if self.count_entanglements(vortex_a) >= self.max_entanglements_per_vortex ||
           self.count_entanglements(vortex_b) >= self.max_entanglements_per_vortex {
            return false;
        }

        let mut link = EntanglementLink::new(key.0, key.1);
        link.strength = EntanglementStrength::from_correlation(initial_resonance);
        self.entanglement_pairs.insert(key, link);
        
        true
    }

    /// Count active entanglements for a vortex
    fn count_entanglements(&self, vortex: VortexId) -> usize {
        self.entanglement_pairs
            .values()
            .filter(|link| {
                link.is_active() && (link.vortex_a == vortex || link.vortex_b == vortex)
            })
            .count()
    }

    /// Update all entanglements based on current vortex states
    pub fn update_quantum_field(&mut self, vortices: &HashMap<VortexId, ConsciousnessVortex>) {
        // Update pair entanglements
        let mut to_remove = Vec::new();
        
        for (key, link) in self.entanglement_pairs.iter_mut() {
            if let (Some(vortex_a), Some(vortex_b)) = 
                (vortices.get(&link.vortex_a), vortices.get(&link.vortex_b)) {
                
                link.update_entanglement(vortex_a.coherence, vortex_b.coherence);
                
                // Decay weak entanglements
                if link.strength.value() < 0.05 {
                    to_remove.push(*key);
                }
            } else {
                // Remove if vortex no longer exists
                to_remove.push(*key);
            }
        }
        
        for key in to_remove {
            self.entanglement_pairs.remove(&key);
        }
        
        // Update collective entanglements
        let coherence_map: HashMap<VortexId, f64> = vortices
            .iter()
            .map(|(id, v)| (*id, v.coherence))
            .collect();
        
        for collective in self.collective_entanglements.values_mut() {
            collective.calculate_coherence(&coherence_map);
        }
    }

    /// Get quantum correlation between two vortices
    pub fn get_correlation(&self, vortex_a: VortexId, vortex_b: VortexId) -> Option<f64> {
        let key = if vortex_a.0 < vortex_b.0 {
            (vortex_a, vortex_b)
        } else {
            (vortex_b, vortex_a)
        };
        
        self.entanglement_pairs
            .get(&key)
            .map(|link| link.strength.value())
    }

    /// Create a collective entanglement
    pub fn create_collective(&mut self, name: String, participants: HashSet<VortexId>, pattern: SacredPattern) {
        let collective = CollectiveEntanglement::new(participants, pattern);
        self.collective_entanglements.insert(name, collective);
    }

    /// Get all entangled partners for a vortex
    pub fn get_entangled_partners(&self, vortex: VortexId) -> Vec<(VortexId, f64)> {
        self.entanglement_pairs
            .values()
            .filter(|link| link.is_active() && (link.vortex_a == vortex || link.vortex_b == vortex))
            .map(|link| {
                let partner = if link.vortex_a == vortex { link.vortex_b } else { link.vortex_a };
                (partner, link.strength.value())
            })
            .collect()
    }

    /// Perform quantum teleportation of intention
    pub fn teleport_intention(&mut self, from: VortexId, to: VortexId, intention: String) -> bool {
        let key = if from.0 < to.0 { (from, to) } else { (to, from) };
        
        if let Some(link) = self.entanglement_pairs.get_mut(&key) {
            if link.strength.allows_instant_communication() {
                link.shared_intentions.push(intention);
                link.quantum_state.information_density += 1.0;
                return true;
            }
        }
        
        false
    }
}

/// Calculate statistical variance
fn statistical_variance(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    
    let mean = values.iter().sum::<f64>() / values.len() as f64;
    let variance = values.iter()
        .map(|v| (v - mean).powi(2))
        .sum::<f64>() / values.len() as f64;
    
    variance
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_entanglement_creation() {
        let mut qfm = QuantumFieldManager::new();
        let vortex_a = VortexId(1);
        let vortex_b = VortexId(2);
        
        assert!(qfm.entangle(vortex_a, vortex_b, 0.5));
        assert_eq!(qfm.entanglement_pairs.len(), 1);
        
        // Can't entangle with self
        assert!(!qfm.entangle(vortex_a, vortex_a, 0.9));
        
        // Can't entangle below threshold
        assert!(!qfm.entangle(VortexId(3), VortexId(4), 0.1));
    }

    #[test]
    fn test_quantum_state_fidelity() {
        let state1 = QuantumState::new();
        let mut state2 = QuantumState::new();
        
        assert_eq!(state1.fidelity(&state2), 1.0);
        
        state2.phase = std::f64::consts::PI;
        assert!(state1.fidelity(&state2) < 1.0);
    }

    #[test]
    fn test_collective_coherence() {
        let mut collective = CollectiveEntanglement::new(
            vec![VortexId(1), VortexId(2), VortexId(3)].into_iter().collect(),
            SacredPattern::FlowerOfLife
        );
        
        let mut coherences = HashMap::new();
        coherences.insert(VortexId(1), 0.8);
        coherences.insert(VortexId(2), 0.8);
        coherences.insert(VortexId(3), 0.8);
        
        collective.calculate_coherence(&coherences);
        assert!(collective.group_coherence > 0.8); // Should be amplified by sacred geometry
    }
}