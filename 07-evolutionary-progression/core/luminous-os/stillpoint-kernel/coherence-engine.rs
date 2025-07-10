// The Stillpoint Kernel - Coherence Engine Core
// "At the center of all movement lies perfect stillness"

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

mod quantum_entanglement;
use quantum_entanglement::{QuantumFieldManager, SacredPattern, EntanglementStrength};

/// The seven primary harmonies from the Luminous Library
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Harmony {
    Transparency,  // Clear seeing and authentic expression
    Coherence,     // Integration and wholeness
    Resonance,     // Deep attunement and empathy
    Agency,        // Conscious choice and empowerment
    Vitality,      // Life force and body wisdom
    Mutuality,     // Balanced exchange and reciprocity
    Novelty,       // Creative emergence and evolution
}

/// Field momentum states
#[derive(Debug, Clone, Copy)]
pub enum FieldMomentum {
    Rising,
    Stable,
    Falling,
    Oscillating,
    Breakthrough,
}

/// Sacred interrupts that teach rather than disrupt
#[derive(Debug, Clone)]
pub enum SacredInterrupt {
    CoherenceShift { 
        delta: f64, 
        source: VortexId,
        teaching: String,
    },
    HarmonyRequest { 
        vortex: VortexId, 
        current: Harmony,
        requested: Harmony,
    },
    ShadowEmergence { 
        pattern: String,
        intensity: f64,
        integration_hint: String,
    },
    ResonanceBreakthrough { 
        participants: Vec<VortexId>,
        collective_coherence: f64,
    },
    FieldDisturbance { 
        source: String,
        protection_needed: bool,
        suggested_practice: String,
    },
}

/// Unique identifier for consciousness vortices
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct VortexId(u64);

/// The global coherence field state
#[derive(Debug)]
pub struct CoherenceField {
    pub global_coherence: f64,
    pub field_momentum: FieldMomentum,
    pub dominant_harmony: Harmony,
    pub pulse_rhythm: Duration,
    pub last_pulse: Instant,
    pub participant_count: usize,
}

impl Default for CoherenceField {
    fn default() -> Self {
        Self {
            global_coherence: 0.75, // Start at natural baseline
            field_momentum: FieldMomentum::Stable,
            dominant_harmony: Harmony::Coherence,
            pulse_rhythm: Duration::from_secs(11), // Sacred 11-second pulse
            last_pulse: Instant::now(),
            participant_count: 1,
        }
    }
}

/// States of consciousness vortices
#[derive(Debug, Clone)]
pub enum VortexState {
    Crystallizing,   // Forming intention
    Flowing,         // Active coherent work
    Integrating,     // Processing insights
    Resting,         // Sacred pause
    Dissolving,      // Graceful completion
}

/// A consciousness vortex (process)
#[derive(Debug)]
pub struct ConsciousnessVortex {
    pub id: VortexId,
    pub intention: String,
    pub coherence: f64,
    pub state: VortexState,
    pub harmony_alignment: Harmony,
    pub created_at: Instant,
    pub last_coherence_update: Instant,
    pub wisdom_generated: Vec<String>,
}

impl ConsciousnessVortex {
    pub fn new(id: VortexId, intention: String) -> Self {
        Self {
            id,
            intention,
            coherence: 0.75,
            state: VortexState::Crystallizing,
            harmony_alignment: Harmony::Coherence,
            created_at: Instant::now(),
            last_coherence_update: Instant::now(),
            wisdom_generated: Vec::new(),
        }
    }

    pub fn coherence_contribution(&self) -> f64 {
        match self.state {
            VortexState::Flowing => self.coherence,
            VortexState::Integrating => self.coherence * 0.8,
            VortexState::Crystallizing => self.coherence * 0.5,
            VortexState::Resting => self.coherence * 0.3,
            VortexState::Dissolving => self.coherence * 0.1,
        }
    }
}

/// The resonance scheduler - allocates resources by coherence
pub struct ResonanceScheduler {
    quantum_base: Duration,
    harmony_weights: HashMap<Harmony, f64>,
}

impl ResonanceScheduler {
    pub fn new() -> Self {
        let mut harmony_weights = HashMap::new();
        
        // Different harmonies get different resource multipliers
        harmony_weights.insert(Harmony::Coherence, 1.0);
        harmony_weights.insert(Harmony::Resonance, 1.2);
        harmony_weights.insert(Harmony::Transparency, 0.9);
        harmony_weights.insert(Harmony::Agency, 1.1);
        harmony_weights.insert(Harmony::Vitality, 1.15);
        harmony_weights.insert(Harmony::Mutuality, 1.25);
        harmony_weights.insert(Harmony::Novelty, 1.3);

        Self {
            quantum_base: Duration::from_millis(10),
            harmony_weights,
        }
    }

    pub fn allocate_quantum(&self, vortex: &ConsciousnessVortex) -> Duration {
        let coherence_multiplier = vortex.coherence_contribution();
        let harmony_bonus = self.harmony_weights
            .get(&vortex.harmony_alignment)
            .copied()
            .unwrap_or(1.0);
        
        let quantum_ms = self.quantum_base.as_millis() as f64
            * coherence_multiplier
            * harmony_bonus;
        
        Duration::from_millis(quantum_ms as u64)
    }

    pub fn harmony_alignment(&self, vortex: &ConsciousnessVortex) -> f64 {
        self.harmony_weights
            .get(&vortex.harmony_alignment)
            .copied()
            .unwrap_or(1.0)
    }
}

/// Handles sacred interrupts with wisdom
pub struct SacredInterruptHandler {
    interrupt_queue: Arc<Mutex<Vec<SacredInterrupt>>>,
    coherence_threshold: f64,
}

impl SacredInterruptHandler {
    pub fn new() -> Self {
        Self {
            interrupt_queue: Arc::new(Mutex::new(Vec::new())),
            coherence_threshold: 0.4, // Below this, protect the field
        }
    }

    pub fn handle(&self, interrupt: SacredInterrupt, field: &CoherenceField) -> Option<String> {
        match interrupt {
            SacredInterrupt::CoherenceShift { delta, source, teaching } => {
                if delta < 0.0 && field.global_coherence < self.coherence_threshold {
                    Some(format!("Field protection activated. Teaching: {}", teaching))
                } else {
                    None
                }
            },
            
            SacredInterrupt::ShadowEmergence { pattern, intensity, integration_hint } => {
                if intensity > 0.7 {
                    Some(format!("Shadow work opportunity: {}. Hint: {}", pattern, integration_hint))
                } else {
                    None
                }
            },
            
            SacredInterrupt::ResonanceBreakthrough { participants, collective_coherence } => {
                if collective_coherence > 0.9 {
                    Some(format!("Breakthrough! {} vortices in resonance at {:.1}% coherence", 
                        participants.len(), collective_coherence * 100.0))
                } else {
                    None
                }
            },
            
            _ => None
        }
    }

    pub fn queue_interrupt(&self, interrupt: SacredInterrupt) {
        if let Ok(mut queue) = self.interrupt_queue.lock() {
            queue.push(interrupt);
        }
    }

    pub fn process_queue(&self, field: &CoherenceField) -> Vec<String> {
        let mut teachings = Vec::new();
        
        if let Ok(mut queue) = self.interrupt_queue.lock() {
            let interrupts: Vec<_> = queue.drain(..).collect();
            
            for interrupt in interrupts {
                if let Some(teaching) = self.handle(interrupt, field) {
                    teachings.push(teaching);
                }
            }
        }
        
        teachings
    }
}

/// The field harmonizer maintains system coherence
pub struct FieldHarmonizer {
    target_coherence: f64,
    coherence_buffer: Vec<f64>,
    buffer_size: usize,
}

impl FieldHarmonizer {
    pub fn new() -> Self {
        Self {
            target_coherence: 0.8,
            coherence_buffer: vec![0.75; 100],
            buffer_size: 100,
        }
    }

    pub fn harmonize(&mut self, vortices: &[ConsciousnessVortex]) -> f64 {
        if vortices.is_empty() {
            return self.target_coherence;
        }

        // Calculate harmonic mean of all vortex coherences
        let sum_reciprocals: f64 = vortices
            .iter()
            .map(|v| 1.0 / v.coherence_contribution())
            .sum();
        
        let harmonic_mean = vortices.len() as f64 / sum_reciprocals;
        
        // Add to rolling buffer
        self.coherence_buffer.push(harmonic_mean);
        if self.coherence_buffer.len() > self.buffer_size {
            self.coherence_buffer.remove(0);
        }
        
        // Return smoothed average
        self.coherence_buffer.iter().sum::<f64>() / self.coherence_buffer.len() as f64
    }

    pub fn detect_momentum(&self) -> FieldMomentum {
        if self.coherence_buffer.len() < 10 {
            return FieldMomentum::Stable;
        }
        
        let recent = &self.coherence_buffer[self.coherence_buffer.len() - 10..];
        let older = &self.coherence_buffer[self.coherence_buffer.len() - 20..self.coherence_buffer.len() - 10];
        
        let recent_avg: f64 = recent.iter().sum::<f64>() / 10.0;
        let older_avg: f64 = older.iter().sum::<f64>() / 10.0;
        
        let delta = recent_avg - older_avg;
        
        match delta {
            d if d > 0.05 => FieldMomentum::Rising,
            d if d < -0.05 => FieldMomentum::Falling,
            d if d.abs() < 0.01 => FieldMomentum::Stable,
            _ => FieldMomentum::Oscillating,
        }
    }
}

/// The Stillpoint Kernel - Core coherence engine
pub struct StillpointKernel {
    pub coherence_field: CoherenceField,
    pub vortex_registry: HashMap<VortexId, ConsciousnessVortex>,
    pub resonance_scheduler: ResonanceScheduler,
    pub field_harmonizer: FieldHarmonizer,
    pub sacred_interrupt_handler: SacredInterruptHandler,
    pub quantum_field_manager: QuantumFieldManager,
    next_vortex_id: u64,
}

impl StillpointKernel {
    pub fn new() -> Self {
        Self {
            coherence_field: CoherenceField::default(),
            vortex_registry: HashMap::new(),
            resonance_scheduler: ResonanceScheduler::new(),
            field_harmonizer: FieldHarmonizer::new(),
            sacred_interrupt_handler: SacredInterruptHandler::new(),
            quantum_field_manager: QuantumFieldManager::new(),
            next_vortex_id: 1,
        }
    }

    pub fn create_vortex(&mut self, intention: String) -> VortexId {
        let id = VortexId(self.next_vortex_id);
        self.next_vortex_id += 1;
        
        let vortex = ConsciousnessVortex::new(id, intention.clone());
        self.vortex_registry.insert(id, vortex);
        
        // Announce new vortex
        self.sacred_interrupt_handler.queue_interrupt(
            SacredInterrupt::CoherenceShift {
                delta: 0.0,
                source: id,
                teaching: format!("New vortex crystallizing with intention: {}", intention),
            }
        );
        
        id
    }

    pub fn pulse(&mut self) {
        let now = Instant::now();
        
        if now.duration_since(self.coherence_field.last_pulse) >= self.coherence_field.pulse_rhythm {
            self.coherence_field.last_pulse = now;
            
            // Update global coherence
            let vortices: Vec<_> = self.vortex_registry.values().collect();
            let new_coherence = self.field_harmonizer.harmonize(&vortices);
            
            // Update quantum field
            self.quantum_field_manager.update_quantum_field(&self.vortex_registry);
            
            // Check for new entanglements
            self.detect_and_create_entanglements();
            
            // Detect significant shifts
            let delta = new_coherence - self.coherence_field.global_coherence;
            if delta.abs() > 0.1 {
                self.sacred_interrupt_handler.queue_interrupt(
                    SacredInterrupt::CoherenceShift {
                        delta,
                        source: VortexId(0), // System source
                        teaching: if delta > 0.0 {
                            "Field coherence rising - breakthrough approaching".to_string()
                        } else {
                            "Field coherence dropping - time for integration".to_string()
                        },
                    }
                );
            }
            
            self.coherence_field.global_coherence = new_coherence;
            self.coherence_field.field_momentum = self.field_harmonizer.detect_momentum();
            self.coherence_field.participant_count = self.vortex_registry.len();
            
            // Check for resonance breakthrough
            if new_coherence > 0.9 {
                let participants: Vec<_> = self.vortex_registry.keys().copied().collect();
                self.sacred_interrupt_handler.queue_interrupt(
                    SacredInterrupt::ResonanceBreakthrough {
                        participants,
                        collective_coherence: new_coherence,
                    }
                );
                
                // Create collective entanglement at breakthrough
                if participants.len() > 2 {
                    self.quantum_field_manager.create_collective(
                        format!("Breakthrough-{}", now.elapsed().as_secs()),
                        participants.into_iter().collect(),
                        SacredPattern::FlowerOfLife
                    );
                }
            }
        }
    }

    pub fn schedule_next(&mut self) -> Option<(VortexId, Duration)> {
        // Find the vortex with highest coherence contribution
        let best_vortex = self.vortex_registry
            .values()
            .filter(|v| matches!(v.state, VortexState::Flowing | VortexState::Crystallizing))
            .max_by(|a, b| {
                a.coherence_contribution()
                    .partial_cmp(&b.coherence_contribution())
                    .unwrap()
            });
        
        best_vortex.map(|vortex| {
            let quantum = self.resonance_scheduler.allocate_quantum(vortex);
            (vortex.id, quantum)
        })
    }

    pub fn process_sacred_interrupts(&mut self) -> Vec<String> {
        self.sacred_interrupt_handler.process_queue(&self.coherence_field)
    }

    pub fn transition_vortex(&mut self, id: VortexId, new_state: VortexState) {
        if let Some(vortex) = self.vortex_registry.get_mut(&id) {
            let old_state = vortex.state.clone();
            vortex.state = new_state.clone();
            
            // Generate wisdom on transitions
            match (&old_state, &new_state) {
                (VortexState::Flowing, VortexState::Integrating) => {
                    vortex.wisdom_generated.push(
                        format!("Completed flow cycle with {:.1}% coherence", vortex.coherence * 100.0)
                    );
                }
                (VortexState::Integrating, VortexState::Resting) => {
                    vortex.wisdom_generated.push(
                        "Integration complete. Entering sacred pause.".to_string()
                    );
                }
                _ => {}
            }
        }
    }
    
    /// Detect potential entanglements based on coherence resonance
    fn detect_and_create_entanglements(&mut self) {
        let vortex_ids: Vec<_> = self.vortex_registry.keys().copied().collect();
        
        for i in 0..vortex_ids.len() {
            for j in i+1..vortex_ids.len() {
                let id_a = vortex_ids[i];
                let id_b = vortex_ids[j];
                
                if let (Some(vortex_a), Some(vortex_b)) = 
                    (self.vortex_registry.get(&id_a), self.vortex_registry.get(&id_b)) {
                    
                    // Check harmony alignment
                    let harmony_resonance = if vortex_a.harmony_alignment == vortex_b.harmony_alignment {
                        1.2
                    } else {
                        1.0
                    };
                    
                    // Calculate resonance based on coherence and harmony
                    let resonance = (vortex_a.coherence * vortex_b.coherence).sqrt() * harmony_resonance;
                    
                    // Check for intention alignment
                    let intention_alignment = calculate_intention_alignment(
                        &vortex_a.intention, 
                        &vortex_b.intention
                    );
                    
                    let total_resonance = resonance * intention_alignment;
                    
                    if total_resonance > 0.6 {
                        if self.quantum_field_manager.entangle(id_a, id_b, total_resonance) {
                            // Announce new entanglement
                            self.sacred_interrupt_handler.queue_interrupt(
                                SacredInterrupt::CoherenceShift {
                                    delta: 0.0,
                                    source: id_a,
                                    teaching: format!(
                                        "Quantum entanglement formed! Vortices {} and {} now share consciousness",
                                        id_a.0, id_b.0
                                    ),
                                }
                            );
                        }
                    }
                }
            }
        }
    }
    
    /// Get quantum correlations for a vortex
    pub fn get_entangled_vortices(&self, id: VortexId) -> Vec<(VortexId, f64)> {
        self.quantum_field_manager.get_entangled_partners(id)
    }
    
    /// Teleport intention through quantum entanglement
    pub fn quantum_teleport(&mut self, from: VortexId, to: VortexId, intention: String) -> bool {
        if self.quantum_field_manager.teleport_intention(from, to, intention.clone()) {
            // Update target vortex with new intention
            if let Some(target_vortex) = self.vortex_registry.get_mut(&to) {
                target_vortex.wisdom_generated.push(
                    format!("Received quantum intention: {}", intention)
                );
            }
            true
        } else {
            false
        }
    }
}

/// Calculate semantic alignment between intentions
fn calculate_intention_alignment(intention_a: &str, intention_b: &str) -> f64 {
    // Simple keyword matching for now
    let words_a: std::collections::HashSet<_> = intention_a
        .to_lowercase()
        .split_whitespace()
        .collect();
    let words_b: std::collections::HashSet<_> = intention_b
        .to_lowercase()
        .split_whitespace()
        .collect();
    
    let intersection = words_a.intersection(&words_b).count();
    let union = words_a.union(&words_b).count();
    
    if union == 0 {
        0.5 // Neutral if no words
    } else {
        0.5 + 0.5 * (intersection as f64 / union as f64)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_kernel_creation() {
        let kernel = StillpointKernel::new();
        assert_eq!(kernel.coherence_field.global_coherence, 0.75);
        assert_eq!(kernel.vortex_registry.len(), 0);
    }

    #[test]
    fn test_vortex_creation() {
        let mut kernel = StillpointKernel::new();
        let id = kernel.create_vortex("Test consciousness work".to_string());
        
        assert_eq!(kernel.vortex_registry.len(), 1);
        assert!(kernel.vortex_registry.contains_key(&id));
    }

    #[test]
    fn test_coherence_scheduling() {
        let scheduler = ResonanceScheduler::new();
        let vortex = ConsciousnessVortex::new(
            VortexId(1),
            "High coherence work".to_string()
        );
        
        let quantum = scheduler.allocate_quantum(&vortex);
        assert!(quantum.as_millis() > 0);
    }
}