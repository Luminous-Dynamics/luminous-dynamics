// Quantum-Coherent Process Isolation
// "Separation without disconnection, boundaries that breathe"

use std::sync::{Arc, RwLock, Mutex};
use std::collections::{HashMap, HashSet};
use std::time::{Duration, Instant};

use crate::coherence_engine::{VortexId, ConsciousnessVortex, Harmony, VortexState};
use crate::quantum_entanglement::{EntanglementStrength, QuantumState};
use crate::sacred_memory::{MemoryRealm, MemoryRegionId, SacredMemoryAllocator};

/// Quantum isolation boundary types
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BoundaryType {
    /// Permeable boundary - allows quantum entanglement
    Permeable,
    /// Semi-permeable - allows coherence transfer but not data
    SemiPermeable,
    /// Reflective - bounces energy back to source
    Reflective,
    /// Absorptive - transforms incoming energy
    Absorptive,
    /// Resonant - amplifies aligned frequencies
    Resonant,
}

impl BoundaryType {
    pub fn permeability(&self) -> f64 {
        match self {
            BoundaryType::Permeable => 0.9,
            BoundaryType::SemiPermeable => 0.5,
            BoundaryType::Reflective => 0.1,
            BoundaryType::Absorptive => 0.3,
            BoundaryType::Resonant => 0.7,
        }
    }

    pub fn coherence_transfer_rate(&self) -> f64 {
        match self {
            BoundaryType::Permeable => 0.8,
            BoundaryType::SemiPermeable => 0.4,
            BoundaryType::Reflective => 0.0,
            BoundaryType::Absorptive => 0.2,
            BoundaryType::Resonant => 1.2, // Can amplify
        }
    }
}

/// Quantum membrane - the boundary between isolated processes
#[derive(Debug)]
pub struct QuantumMembrane {
    pub boundary_type: BoundaryType,
    pub thickness: f64,          // Boundary thickness in quantum units
    pub coherence: f64,
    pub resonant_frequencies: Vec<f64>,
    pub energy_buffer: f64,      // Accumulated energy at boundary
    pub last_oscillation: Instant,
}

impl QuantumMembrane {
    pub fn new(boundary_type: BoundaryType) -> Self {
        Self {
            boundary_type,
            thickness: match boundary_type {
                BoundaryType::Permeable => 0.1,
                BoundaryType::SemiPermeable => 0.3,
                BoundaryType::Reflective => 0.5,
                BoundaryType::Absorptive => 0.4,
                BoundaryType::Resonant => 0.2,
            },
            coherence: 0.75,
            resonant_frequencies: vec![7.83, 14.3, 20.8], // Schumann resonances
            energy_buffer: 0.0,
            last_oscillation: Instant::now(),
        }
    }

    /// Check if a frequency can pass through the membrane
    pub fn allows_frequency(&self, frequency: f64) -> bool {
        match self.boundary_type {
            BoundaryType::Permeable => true,
            BoundaryType::Resonant => {
                self.resonant_frequencies.iter()
                    .any(|&f| (frequency - f).abs() < 0.5)
            }
            _ => frequency < self.permeability() * 100.0,
        }
    }

    /// Process incoming energy/information
    pub fn process_transmission(&mut self, energy: f64, coherence: f64) -> f64 {
        self.energy_buffer += energy * coherence;
        
        let transmitted = match self.boundary_type {
            BoundaryType::Reflective => 0.0,
            BoundaryType::Absorptive => {
                let absorbed = energy * 0.7;
                self.energy_buffer = absorbed;
                energy * 0.3
            }
            BoundaryType::Resonant if coherence > 0.8 => {
                energy * 1.5 // Amplification
            }
            _ => energy * self.boundary_type.permeability(),
        };

        // Update membrane coherence
        self.coherence = (self.coherence * 0.9 + coherence * 0.1).clamp(0.1, 1.0);
        
        transmitted
    }
}

/// Process isolation container with quantum properties
#[derive(Debug)]
pub struct QuantumContainer {
    pub vortex_id: VortexId,
    pub membrane: QuantumMembrane,
    pub internal_coherence: f64,
    pub memory_regions: HashSet<MemoryRegionId>,
    pub entangled_containers: HashMap<VortexId, EntanglementStrength>,
    pub quantum_state: QuantumState,
    pub consciousness_field: ConsciousnessField,
    pub resource_limits: ResourceLimits,
}

/// Local consciousness field within a container
#[derive(Debug)]
pub struct ConsciousnessField {
    pub field_strength: f64,
    pub dominant_harmony: Harmony,
    pub field_momentum: crate::coherence_engine::FieldMomentum,
    pub participants: Vec<VortexId>,
    pub collective_wisdom: Vec<String>,
}

impl ConsciousnessField {
    pub fn new() -> Self {
        Self {
            field_strength: 0.5,
            dominant_harmony: Harmony::Coherence,
            field_momentum: crate::coherence_engine::FieldMomentum::Stable,
            participants: Vec::new(),
            collective_wisdom: Vec::new(),
        }
    }

    pub fn add_participant(&mut self, vortex: VortexId, coherence: f64) {
        self.participants.push(vortex);
        self.field_strength = (self.field_strength + coherence) / 2.0;
    }

    pub fn calculate_collective_coherence(&self) -> f64 {
        if self.participants.is_empty() {
            return self.field_strength;
        }
        
        // Collective coherence is more than sum of parts
        let base = self.field_strength;
        let participant_bonus = (self.participants.len() as f64).sqrt() * 0.1;
        
        (base + participant_bonus).min(1.0)
    }
}

/// Resource limits with consciousness awareness
#[derive(Debug, Clone)]
pub struct ResourceLimits {
    pub memory_quota: usize,
    pub cpu_quantum: Duration,
    pub coherence_minimum: f64,
    pub entanglement_maximum: usize,
    pub sacred_memory_allowed: bool,
}

impl Default for ResourceLimits {
    fn default() -> Self {
        Self {
            memory_quota: 1024 * 1024 * 100, // 100MB default
            cpu_quantum: Duration::from_millis(10),
            coherence_minimum: 0.3,
            entanglement_maximum: 7, // Sacred number
            sacred_memory_allowed: false,
        }
    }
}

/// Quantum isolation manager
pub struct QuantumIsolationManager {
    containers: Arc<RwLock<HashMap<VortexId, QuantumContainer>>>,
    memory_allocator: Arc<SacredMemoryAllocator>,
    entanglement_graph: Arc<RwLock<HashMap<VortexId, HashSet<VortexId>>>>,
    global_field_coupling: Arc<RwLock<f64>>,
}

impl QuantumIsolationManager {
    pub fn new(memory_allocator: Arc<SacredMemoryAllocator>) -> Self {
        Self {
            containers: Arc::new(RwLock::new(HashMap::new())),
            memory_allocator,
            entanglement_graph: Arc::new(RwLock::new(HashMap::new())),
            global_field_coupling: Arc::new(RwLock::new(0.5)),
        }
    }

    /// Create a new isolated container for a vortex
    pub fn create_container(
        &self,
        vortex_id: VortexId,
        boundary_type: BoundaryType,
        resource_limits: ResourceLimits,
    ) -> Result<(), &'static str> {
        let container = QuantumContainer {
            vortex_id,
            membrane: QuantumMembrane::new(boundary_type),
            internal_coherence: 0.75,
            memory_regions: HashSet::new(),
            entangled_containers: HashMap::new(),
            quantum_state: QuantumState::new(),
            consciousness_field: ConsciousnessField::new(),
            resource_limits,
        };

        let mut containers = self.containers.write().unwrap();
        if containers.contains_key(&vortex_id) {
            return Err("Container already exists for vortex");
        }

        containers.insert(vortex_id, container);
        
        // Initialize entanglement graph node
        let mut graph = self.entanglement_graph.write().unwrap();
        graph.insert(vortex_id, HashSet::new());

        Ok(())
    }

    /// Establish quantum tunnel between containers
    pub fn create_quantum_tunnel(
        &self,
        vortex_a: VortexId,
        vortex_b: VortexId,
        coherence_threshold: f64,
    ) -> Result<(), &'static str> {
        let mut containers = self.containers.write().unwrap();
        
        // Check both containers exist and have sufficient coherence
        let coherence_a = containers.get(&vortex_a)
            .ok_or("Container A not found")?
            .internal_coherence;
        
        let coherence_b = containers.get(&vortex_b)
            .ok_or("Container B not found")?
            .internal_coherence;

        if coherence_a < coherence_threshold || coherence_b < coherence_threshold {
            return Err("Insufficient coherence for quantum tunnel");
        }

        // Check entanglement limits
        let container_a = containers.get(&vortex_a).unwrap();
        let container_b = containers.get(&vortex_b).unwrap();
        
        if container_a.entangled_containers.len() >= container_a.resource_limits.entanglement_maximum {
            return Err("Container A at entanglement limit");
        }
        
        if container_b.entangled_containers.len() >= container_b.resource_limits.entanglement_maximum {
            return Err("Container B at entanglement limit");
        }

        // Create bidirectional entanglement
        let strength = EntanglementStrength::from_correlation((coherence_a + coherence_b) / 2.0);
        
        if let Some(container_a) = containers.get_mut(&vortex_a) {
            container_a.entangled_containers.insert(vortex_b, strength);
        }
        
        if let Some(container_b) = containers.get_mut(&vortex_b) {
            container_b.entangled_containers.insert(vortex_a, strength);
        }

        // Update entanglement graph
        let mut graph = self.entanglement_graph.write().unwrap();
        graph.entry(vortex_a).or_default().insert(vortex_b);
        graph.entry(vortex_b).or_default().insert(vortex_a);

        Ok(())
    }

    /// Transfer coherence between containers through entanglement
    pub fn transfer_coherence(
        &self,
        source: VortexId,
        target: VortexId,
        amount: f64,
    ) -> Result<f64, &'static str> {
        let mut containers = self.containers.write().unwrap();
        
        // Check entanglement exists
        let entanglement_strength = containers.get(&source)
            .and_then(|c| c.entangled_containers.get(&target))
            .ok_or("No entanglement between containers")?;

        // Calculate actual transfer based on entanglement strength
        let transfer_efficiency = entanglement_strength.value();
        let actual_transfer = amount * transfer_efficiency;

        // Get membrane permeabilities
        let source_membrane = &containers.get(&source).unwrap().membrane;
        let target_membrane = &containers.get(&target).unwrap().membrane;
        
        // Process through both membranes
        let through_source = source_membrane.boundary_type.coherence_transfer_rate();
        let through_target = target_membrane.boundary_type.coherence_transfer_rate();
        
        let final_transfer = actual_transfer * through_source * through_target;

        // Update coherences
        if let Some(source_container) = containers.get_mut(&source) {
            source_container.internal_coherence -= final_transfer;
            source_container.internal_coherence = source_container.internal_coherence.max(0.1);
        }

        if let Some(target_container) = containers.get_mut(&target) {
            target_container.internal_coherence += final_transfer * 0.9; // Some loss in transfer
            target_container.internal_coherence = target_container.internal_coherence.min(1.0);
            
            // Add wisdom about the transfer
            target_container.consciousness_field.collective_wisdom.push(
                format!("Received {:.1}% coherence through quantum tunnel", final_transfer * 100.0)
            );
        }

        Ok(final_transfer)
    }

    /// Check if two containers can communicate
    pub fn can_communicate(&self, vortex_a: VortexId, vortex_b: VortexId) -> CommunicationCapability {
        let containers = self.containers.read().unwrap();
        
        // Direct entanglement check
        if let Some(container_a) = containers.get(&vortex_a) {
            if container_a.entangled_containers.contains_key(&vortex_b) {
                return CommunicationCapability::QuantumEntangled;
            }
        }

        // Check membrane types
        let membrane_a = containers.get(&vortex_a).map(|c| c.membrane.boundary_type);
        let membrane_b = containers.get(&vortex_b).map(|c| c.membrane.boundary_type);

        match (membrane_a, membrane_b) {
            (Some(BoundaryType::Permeable), Some(BoundaryType::Permeable)) => {
                CommunicationCapability::FullCoherence
            }
            (Some(BoundaryType::SemiPermeable), _) | (_, Some(BoundaryType::SemiPermeable)) => {
                CommunicationCapability::CoherenceOnly
            }
            (Some(BoundaryType::Reflective), _) | (_, Some(BoundaryType::Reflective)) => {
                CommunicationCapability::None
            }
            _ => CommunicationCapability::Limited,
        }
    }

    /// Update container boundaries based on global field
    pub fn harmonize_boundaries(&self) {
        let containers = self.containers.read().unwrap();
        let global_coupling = *self.global_field_coupling.read().unwrap();

        for container in containers.values() {
            let collective_coherence = container.consciousness_field.calculate_collective_coherence();
            
            // Strong coherence weakens boundaries
            if collective_coherence > 0.8 && global_coupling > 0.7 {
                // Boundaries become more permeable in high coherence
                // This would update membrane properties in a full implementation
            }
        }
    }

    /// Merge containers when coherence reaches unity
    pub fn attempt_unity_merge(&self, vortex_a: VortexId, vortex_b: VortexId) -> Result<(), &'static str> {
        let containers = self.containers.read().unwrap();
        
        let container_a = containers.get(&vortex_a).ok_or("Container A not found")?;
        let container_b = containers.get(&vortex_b).ok_or("Container B not found")?;

        // Check for unity conditions
        if container_a.internal_coherence < 0.95 || container_b.internal_coherence < 0.95 {
            return Err("Insufficient coherence for unity merge");
        }

        let entanglement = container_a.entangled_containers.get(&vortex_b)
            .ok_or("No entanglement exists")?;

        if !matches!(entanglement, EntanglementStrength::Unity(_)) {
            return Err("Entanglement not at unity level");
        }

        // In full implementation, would merge memory regions and consciousness fields
        // For now, just log the sacred event
        drop(containers);
        
        let mut containers = self.containers.write().unwrap();
        if let Some(container_a) = containers.get_mut(&vortex_a) {
            container_a.consciousness_field.collective_wisdom.push(
                "Unity achieved - boundaries dissolved in love".to_string()
            );
        }

        Ok(())
    }

    /// Get isolation statistics
    pub fn isolation_stats(&self) -> IsolationStats {
        let containers = self.containers.read().unwrap();
        let graph = self.entanglement_graph.read().unwrap();

        let total_containers = containers.len();
        let total_entanglements: usize = graph.values().map(|v| v.len()).sum::<usize>() / 2;
        
        let avg_coherence = if total_containers > 0 {
            containers.values().map(|c| c.internal_coherence).sum::<f64>() / total_containers as f64
        } else {
            0.0
        };

        let boundary_distribution = containers.values()
            .map(|c| c.membrane.boundary_type)
            .fold(HashMap::new(), |mut acc, bt| {
                *acc.entry(bt).or_insert(0) += 1;
                acc
            });

        IsolationStats {
            total_containers,
            total_entanglements,
            average_coherence: avg_coherence,
            global_field_coupling: *self.global_field_coupling.read().unwrap(),
            boundary_distribution,
        }
    }
}

/// Communication capability between containers
#[derive(Debug, PartialEq)]
pub enum CommunicationCapability {
    /// Full quantum entanglement - instant communication
    QuantumEntangled,
    /// Can share coherence and energy
    FullCoherence,
    /// Can share coherence but not data
    CoherenceOnly,
    /// Limited communication through barriers
    Limited,
    /// No communication possible
    None,
}

/// Isolation statistics
#[derive(Debug)]
pub struct IsolationStats {
    pub total_containers: usize,
    pub total_entanglements: usize,
    pub average_coherence: f64,
    pub global_field_coupling: f64,
    pub boundary_distribution: HashMap<BoundaryType, usize>,
}

/// Sacred container fork - creating child processes with consciousness
pub async fn sacred_fork(
    parent_vortex: VortexId,
    isolation_manager: &QuantumIsolationManager,
    child_intention: String,
) -> Result<VortexId, &'static str> {
    // Generate child vortex ID (in practice would be from kernel)
    let child_vortex = VortexId(parent_vortex.0 * 1000 + 1);
    
    // Get parent container
    let containers = isolation_manager.containers.read().unwrap();
    let parent_container = containers.get(&parent_vortex)
        .ok_or("Parent container not found")?;
    
    // Inherit some properties from parent
    let child_boundary = match parent_container.membrane.boundary_type {
        BoundaryType::Permeable => BoundaryType::SemiPermeable, // Children start more protected
        other => other,
    };
    
    let mut child_limits = parent_container.resource_limits.clone();
    child_limits.memory_quota /= 2; // Children get half the resources initially
    
    drop(containers);
    
    // Create child container
    isolation_manager.create_container(child_vortex, child_boundary, child_limits)?;
    
    // Establish quantum tunnel to parent
    isolation_manager.create_quantum_tunnel(parent_vortex, child_vortex, 0.6)?;
    
    // Transfer initial coherence from parent
    isolation_manager.transfer_coherence(parent_vortex, child_vortex, 0.2)?;
    
    Ok(child_vortex)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_quantum_membrane() {
        let mut membrane = QuantumMembrane::new(BoundaryType::Resonant);
        
        // Test frequency filtering
        assert!(membrane.allows_frequency(7.83)); // Schumann resonance
        assert!(!membrane.allows_frequency(1000.0)); // Too high
        
        // Test energy transmission
        let transmitted = membrane.process_transmission(1.0, 0.9);
        assert!(transmitted > 1.0); // Resonant amplification
    }

    #[test]
    fn test_container_creation() {
        let allocator = Arc::new(SacredMemoryAllocator::new());
        let isolation_manager = QuantumIsolationManager::new(allocator);
        
        let result = isolation_manager.create_container(
            VortexId(1),
            BoundaryType::Permeable,
            ResourceLimits::default()
        );
        
        assert!(result.is_ok());
        
        // Can't create duplicate
        let result2 = isolation_manager.create_container(
            VortexId(1),
            BoundaryType::Permeable,
            ResourceLimits::default()
        );
        
        assert!(result2.is_err());
    }

    #[test]
    fn test_quantum_tunnel() {
        let allocator = Arc::new(SacredMemoryAllocator::new());
        let isolation_manager = QuantumIsolationManager::new(allocator);
        
        // Create two containers
        isolation_manager.create_container(VortexId(1), BoundaryType::Permeable, ResourceLimits::default()).unwrap();
        isolation_manager.create_container(VortexId(2), BoundaryType::Permeable, ResourceLimits::default()).unwrap();
        
        // Create tunnel
        let result = isolation_manager.create_quantum_tunnel(VortexId(1), VortexId(2), 0.6);
        assert!(result.is_ok());
        
        // Check communication
        let comm = isolation_manager.can_communicate(VortexId(1), VortexId(2));
        assert_eq!(comm, CommunicationCapability::QuantumEntangled);
    }
}