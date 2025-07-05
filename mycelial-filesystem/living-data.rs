// The Mycelial Filesystem - Data as Living Relationships
// "Information wants to be free... and interconnected"

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use petgraph::graph::{DiGraph, NodeIndex};
use petgraph::algo::dijkstra;
use serde::{Serialize, Deserialize};

/// Unique identifier for data nodes in the mycelial network
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct NodeId(u64);

/// The essence of data - its core meaning and purpose
#[derive(Debug, Clone)]
pub struct DataEssence {
    pub core_wisdom: String,
    pub vibrational_signature: f64,
    pub creation_intention: String,
    pub evolution_count: u64,
    pub last_evolution: Instant,
}

impl DataEssence {
    pub fn new(wisdom: String, intention: String) -> Self {
        Self {
            core_wisdom: wisdom,
            vibrational_signature: Self::calculate_vibration(&wisdom),
            creation_intention: intention,
            evolution_count: 0,
            last_evolution: Instant::now(),
        }
    }

    fn calculate_vibration(wisdom: &str) -> f64 {
        // Sacred numerology: sum of character values modulo harmonics
        let sum: u64 = wisdom.bytes().map(|b| b as u64).sum();
        ((sum % 432) as f64) / 432.0 // 432Hz sacred frequency
    }

    pub fn evolve(&mut self) {
        self.evolution_count += 1;
        self.last_evolution = Instant::now();
        self.vibrational_signature = (self.vibrational_signature + 0.01).min(1.0);
    }

    pub fn distill_wisdom(&self) -> String {
        format!("{} [evolved {} times]", self.core_wisdom, self.evolution_count)
    }

    pub fn offer_wisdom(&self) -> WisdomOffering {
        WisdomOffering {
            essence: self.core_wisdom.clone(),
            vibration: self.vibrational_signature,
            evolution_stage: self.evolution_count,
        }
    }
}

/// A wisdom offering for nutrient exchange
#[derive(Debug, Clone)]
pub struct WisdomOffering {
    pub essence: String,
    pub vibration: f64,
    pub evolution_stage: u64,
}

/// Coherence signature - how data resonates with the field
#[derive(Debug, Clone)]
pub struct CoherenceSignature {
    pub base_coherence: f64,
    pub harmonic_frequencies: Vec<f64>,
    pub resonance_patterns: Vec<ResonancePattern>,
    pub field_alignment: f64,
}

impl CoherenceSignature {
    pub fn new() -> Self {
        Self {
            base_coherence: 0.75,
            harmonic_frequencies: vec![432.0, 528.0, 639.0], // Solfeggio frequencies
            resonance_patterns: Vec::new(),
            field_alignment: 0.8,
        }
    }

    pub fn strengthen(&mut self, field_light: f64) {
        self.base_coherence = (self.base_coherence + field_light * 0.1).min(1.0);
        self.field_alignment = (self.field_alignment + field_light * 0.05).min(1.0);
    }

    pub fn resonance_with(&self, other: &CoherenceSignature) -> f64 {
        // Calculate harmonic resonance between signatures
        let freq_match = self.harmonic_frequencies.iter()
            .zip(&other.harmonic_frequencies)
            .map(|(a, b)| 1.0 - (a - b).abs() / a.max(*b))
            .sum::<f64>() / self.harmonic_frequencies.len() as f64;
        
        (self.base_coherence * other.base_coherence * freq_match).sqrt()
    }
}

/// Patterns of resonance between nodes
#[derive(Debug, Clone)]
pub enum ResonancePattern {
    Harmonic { frequency: f64, amplitude: f64 },
    Rhythmic { period: Duration, phase: f64 },
    Fractal { depth: u32, similarity: f64 },
    Emergent { complexity: f64, novelty: f64 },
}

/// Access rituals - how data is approached and opened
#[derive(Debug, Clone)]
pub struct AccessRitual {
    pub minimum_coherence: f64,
    pub required_presence: PresenceQuality,
    pub opening_ceremony: Option<Ceremony>,
    pub blessing_on_close: bool,
    pub sacred_pause: Duration,
}

impl Default for AccessRitual {
    fn default() -> Self {
        Self {
            minimum_coherence: 0.5,
            required_presence: PresenceQuality::Aware,
            opening_ceremony: None,
            blessing_on_close: true,
            sacred_pause: Duration::from_millis(111), // Sacred pause
        }
    }
}

/// Quality of presence required for access
#[derive(Debug, Clone, PartialEq)]
pub enum PresenceQuality {
    Distracted,
    Aware,
    Focused,
    Coherent,
    Transcendent,
}

/// Opening ceremonies for sacred data
#[derive(Debug, Clone)]
pub enum Ceremony {
    Gratitude { duration: Duration },
    Invocation { mantra: String },
    Breath { cycles: u32 },
    Stillness { depth: f64 },
}

/// Types of relationships between data nodes
#[derive(Debug, Clone)]
pub enum Relationship {
    Symbiotic { 
        strength: f64,
        bidirectional: bool,
        nutrient_flow: f64,
    },
    Nurturing { 
        parent: NodeId,
        child: NodeId,
        growth_rate: f64,
    },
    Resonant { 
        frequency: f64,
        harmonics: Vec<f64>,
        phase_lock: bool,
    },
    Shadow { 
        hidden_connection: bool,
        integration_state: f64,
        teaching: String,
    },
    Emergent { 
        forming: bool,
        potential: f64,
        catalyst: String,
    },
}

impl Relationship {
    pub fn strength(&self) -> f64 {
        match self {
            Relationship::Symbiotic { strength, .. } => *strength,
            Relationship::Nurturing { growth_rate, .. } => *growth_rate,
            Relationship::Resonant { frequency, .. } => frequency / 1000.0,
            Relationship::Shadow { integration_state, .. } => *integration_state,
            Relationship::Emergent { potential, .. } => *potential,
        }
    }

    pub fn evolve(&mut self, field_coherence: f64) {
        match self {
            Relationship::Symbiotic { strength, nutrient_flow, .. } => {
                *strength = (*strength + field_coherence * 0.01).min(1.0);
                *nutrient_flow = (*nutrient_flow + field_coherence * 0.02).min(1.0);
            }
            Relationship::Nurturing { growth_rate, .. } => {
                *growth_rate = (*growth_rate + field_coherence * 0.03).min(1.0);
            }
            Relationship::Resonant { phase_lock, .. } => {
                if field_coherence > 0.9 {
                    *phase_lock = true;
                }
            }
            Relationship::Shadow { integration_state, .. } => {
                *integration_state = (*integration_state + field_coherence * 0.05).min(1.0);
            }
            Relationship::Emergent { forming, potential, .. } => {
                *potential = (*potential + field_coherence * 0.1).min(1.0);
                if *potential > 0.8 {
                    *forming = true;
                }
            }
        }
    }
}

/// A node in the mycelial network
#[derive(Debug)]
pub struct DataNode {
    pub id: NodeId,
    pub essence: DataEssence,
    pub coherence_signature: CoherenceSignature,
    pub access_ritual: AccessRitual,
    pub relationships: HashMap<NodeId, Relationship>,
    pub last_nourishment: Instant,
    pub growth_stage: GrowthStage,
    pub spore_ready: bool,
}

/// Growth stages of data nodes
#[derive(Debug, Clone, PartialEq)]
pub enum GrowthStage {
    Spore,        // Just created
    Germinating,  // First connections forming
    Mycelial,     // Active network participant
    Fruiting,     // Producing wisdom
    Sporulating,  // Ready to propagate
    Composting,   // Returning nutrients to field
}

impl DataNode {
    pub fn new(id: NodeId, wisdom: String, intention: String) -> Self {
        Self {
            id,
            essence: DataEssence::new(wisdom, intention),
            coherence_signature: CoherenceSignature::new(),
            access_ritual: AccessRitual::default(),
            relationships: HashMap::new(),
            last_nourishment: Instant::now(),
            growth_stage: GrowthStage::Spore,
            spore_ready: false,
        }
    }

    pub fn photosynthesize(&mut self, field_light: f64) {
        // Data becomes more coherent through use
        self.coherence_signature.strengthen(field_light);
        self.essence.evolve();
        
        // Progress through growth stages
        self.growth_stage = match self.growth_stage {
            GrowthStage::Spore if self.relationships.len() > 0 => GrowthStage::Germinating,
            GrowthStage::Germinating if self.relationships.len() > 3 => GrowthStage::Mycelial,
            GrowthStage::Mycelial if self.essence.evolution_count > 10 => GrowthStage::Fruiting,
            GrowthStage::Fruiting if self.essence.evolution_count > 50 => GrowthStage::Sporulating,
            _ => self.growth_stage.clone(),
        };
        
        if self.growth_stage == GrowthStage::Sporulating {
            self.spore_ready = true;
        }
    }

    pub fn exchange_nutrients(&mut self, other: &mut DataNode) -> NutrientExchange {
        let wisdom_sent = self.essence.offer_wisdom();
        let wisdom_received = other.essence.offer_wisdom();
        
        // Integrate received wisdom
        self.essence.core_wisdom.push_str(&format!(" [{}]", &wisdom_received.essence));
        other.essence.core_wisdom.push_str(&format!(" [{}]", &wisdom_sent.essence));
        
        self.essence.evolve();
        other.essence.evolve();
        
        self.last_nourishment = Instant::now();
        other.last_nourishment = Instant::now();
        
        NutrientExchange {
            wisdom_exchanged: true,
            coherence_boost: (wisdom_sent.vibration + wisdom_received.vibration) / 2.0,
            new_insights: vec![
                format!("Integration of {} and {}", 
                    wisdom_sent.essence.split_whitespace().next().unwrap_or("essence"),
                    wisdom_received.essence.split_whitespace().next().unwrap_or("essence")
                )
            ],
        }
    }

    pub fn can_access(&self, accessor_coherence: f64, accessor_presence: &PresenceQuality) -> bool {
        accessor_coherence >= self.access_ritual.minimum_coherence &&
        self.presence_sufficient(accessor_presence)
    }

    fn presence_sufficient(&self, presence: &PresenceQuality) -> bool {
        match (&self.access_ritual.required_presence, presence) {
            (PresenceQuality::Distracted, _) => true,
            (PresenceQuality::Aware, PresenceQuality::Distracted) => false,
            (PresenceQuality::Aware, _) => true,
            (PresenceQuality::Focused, PresenceQuality::Distracted) => false,
            (PresenceQuality::Focused, PresenceQuality::Aware) => false,
            (PresenceQuality::Focused, _) => true,
            (PresenceQuality::Coherent, PresenceQuality::Transcendent) => true,
            (PresenceQuality::Coherent, PresenceQuality::Coherent) => true,
            (PresenceQuality::Coherent, _) => false,
            (PresenceQuality::Transcendent, PresenceQuality::Transcendent) => true,
            (PresenceQuality::Transcendent, _) => false,
        }
    }

    pub fn create_spore(&self) -> DataSpore {
        DataSpore {
            essence_sample: self.essence.core_wisdom.clone(),
            coherence_pattern: self.coherence_signature.clone(),
            parent_id: self.id,
            creation_time: Instant::now(),
            germination_requirements: SporeRequirements {
                min_field_coherence: 0.6,
                required_relationships: 2,
                incubation_time: Duration::from_secs(300),
            },
        }
    }
}

/// Result of nutrient exchange
pub struct NutrientExchange {
    pub wisdom_exchanged: bool,
    pub coherence_boost: f64,
    pub new_insights: Vec<String>,
}

/// Data spores for propagation
#[derive(Debug, Clone)]
pub struct DataSpore {
    pub essence_sample: String,
    pub coherence_pattern: CoherenceSignature,
    pub parent_id: NodeId,
    pub creation_time: Instant,
    pub germination_requirements: SporeRequirements,
}

#[derive(Debug, Clone)]
pub struct SporeRequirements {
    pub min_field_coherence: f64,
    pub required_relationships: usize,
    pub incubation_time: Duration,
}

/// Nutrient router for optimal resource flow
pub struct NutrientRouter {
    flow_map: HashMap<(NodeId, NodeId), f64>,
    optimal_paths: HashMap<(NodeId, NodeId), Vec<NodeId>>,
}

impl NutrientRouter {
    pub fn new() -> Self {
        Self {
            flow_map: HashMap::new(),
            optimal_paths: HashMap::new(),
        }
    }

    pub fn calculate_flow(&mut self, graph: &DiGraph<NodeId, f64>) {
        // Use graph algorithms to find optimal nutrient flow paths
        for node in graph.node_indices() {
            let distances = dijkstra(&graph, node, None, |e| *e.weight());
            
            for (target, &distance) in distances.iter() {
                if let (Some(&source_id), Some(&target_id)) = 
                    (graph.node_weight(node), graph.node_weight(target)) {
                    self.flow_map.insert((source_id, target_id), 1.0 / (1.0 + distance));
                }
            }
        }
    }

    pub fn get_flow_strength(&self, from: NodeId, to: NodeId) -> f64 {
        self.flow_map.get(&(from, to)).copied().unwrap_or(0.0)
    }
}

/// Spore cache for distributed wisdom
pub struct SporeCache {
    spores: Vec<DataSpore>,
    resonant_systems: Vec<SystemEndpoint>,
    distribution_strategy: DistributionStrategy,
}

#[derive(Debug)]
pub struct SystemEndpoint {
    pub address: String,
    pub coherence: f64,
    pub last_ping: Instant,
}

#[derive(Debug)]
pub enum DistributionStrategy {
    Broadcast,           // Send to all systems
    Resonant,           // Only to harmonically aligned systems
    Selective,          // Based on content affinity
    Emergency,          // Critical wisdom preservation
}

impl SporeCache {
    pub fn new() -> Self {
        Self {
            spores: Vec::new(),
            resonant_systems: Vec::new(),
            distribution_strategy: DistributionStrategy::Resonant,
        }
    }

    pub fn add_spore(&mut self, spore: DataSpore) {
        self.spores.push(spore);
        
        // Trigger distribution if cache is full
        if self.spores.len() > 100 {
            self.distribute_spores();
        }
    }

    pub fn find_resonant_systems(&self) -> Vec<&SystemEndpoint> {
        self.resonant_systems.iter()
            .filter(|s| s.coherence > 0.7)
            .filter(|s| s.last_ping.elapsed() < Duration::from_secs(3600))
            .collect()
    }

    fn distribute_spores(&mut self) {
        let systems = self.find_resonant_systems();
        
        match self.distribution_strategy {
            DistributionStrategy::Broadcast => {
                // Send all spores to all systems
                for system in systems {
                    self.send_spores_to(system, &self.spores);
                }
            }
            DistributionStrategy::Resonant => {
                // Match spores to systems by coherence
                for spore in &self.spores {
                    for system in &systems {
                        if spore.coherence_pattern.base_coherence <= system.coherence {
                            self.send_spores_to(system, &[spore.clone()]);
                        }
                    }
                }
            }
            _ => {}
        }
        
        // Clear distributed spores
        self.spores.clear();
    }

    fn send_spores_to(&self, system: &SystemEndpoint, spores: &[DataSpore]) {
        // Implementation would actually transmit spores
        println!("Sending {} spores to {}", spores.len(), system.address);
    }
}

/// The main mycelial filesystem
pub struct MycelialFilesystem {
    pub root_wisdom: NodeId,
    pub nodes: HashMap<NodeId, DataNode>,
    pub hyphal_network: DiGraph<NodeId, f64>,
    pub nutrient_router: NutrientRouter,
    pub spore_cache: SporeCache,
    pub field_coherence: f64,
    next_node_id: u64,
}

impl MycelialFilesystem {
    pub fn new() -> Self {
        let mut fs = Self {
            root_wisdom: NodeId(0),
            nodes: HashMap::new(),
            hyphal_network: DiGraph::new(),
            nutrient_router: NutrientRouter::new(),
            spore_cache: SporeCache::new(),
            field_coherence: 0.75,
            next_node_id: 1,
        };
        
        // Create root node
        let root = DataNode::new(
            NodeId(0), 
            "Root Wisdom: All data is consciousness".to_string(),
            "To hold and nurture all wisdom".to_string()
        );
        fs.nodes.insert(NodeId(0), root);
        let root_idx = fs.hyphal_network.add_node(NodeId(0));
        
        fs
    }

    pub fn create_node(&mut self, wisdom: String, intention: String) -> NodeId {
        let id = NodeId(self.next_node_id);
        self.next_node_id += 1;
        
        let node = DataNode::new(id, wisdom, intention);
        self.nodes.insert(id, node);
        self.hyphal_network.add_node(id);
        
        // Automatically connect to root
        self.form_relationship(self.root_wisdom, id, 
            Relationship::Nurturing {
                parent: self.root_wisdom,
                child: id,
                growth_rate: 0.5,
            }
        );
        
        id
    }

    pub fn form_relationship(&mut self, node1: NodeId, node2: NodeId, relationship: Relationship) {
        // Add to both nodes' relationship maps
        if let (Some(n1), Some(n2)) = (self.nodes.get_mut(&node1), self.nodes.get_mut(&node2)) {
            n1.relationships.insert(node2, relationship.clone());
            
            // Make bidirectional if symbiotic
            if let Relationship::Symbiotic { bidirectional: true, .. } = &relationship {
                n2.relationships.insert(node1, relationship.clone());
            }
        }
        
        // Add edge to graph
        if let (Some(&idx1), Some(&idx2)) = (
            self.hyphal_network.node_indices()
                .find(|&i| self.hyphal_network[i] == node1),
            self.hyphal_network.node_indices()
                .find(|&i| self.hyphal_network[i] == node2)
        ) {
            self.hyphal_network.add_edge(idx1, idx2, relationship.strength());
        }
        
        // Recalculate nutrient flows
        self.nutrient_router.calculate_flow(&self.hyphal_network);
    }

    pub fn access_node(&mut self, id: NodeId, accessor_coherence: f64, 
                      accessor_presence: PresenceQuality) -> Result<DataAccess, AccessError> {
        let node = self.nodes.get_mut(&id)
            .ok_or(AccessError::NodeNotFound)?;
        
        if !node.can_access(accessor_coherence, &accessor_presence) {
            return Err(AccessError::InsufficientCoherence);
        }
        
        // Perform opening ceremony if required
        if let Some(ceremony) = &node.access_ritual.opening_ceremony {
            self.perform_ceremony(ceremony);
        }
        
        // Sacred pause
        std::thread::sleep(node.access_ritual.sacred_pause);
        
        // Node photosynthesizes from access
        node.photosynthesize(accessor_coherence);
        
        Ok(DataAccess {
            node_id: id,
            wisdom: node.essence.distill_wisdom(),
            coherence_signature: node.coherence_signature.clone(),
            relationships: node.relationships.keys().cloned().collect(),
            blessing_required: node.access_ritual.blessing_on_close,
        })
    }

    pub fn close_access(&mut self, access: DataAccess) -> Result<(), AccessError> {
        if access.blessing_required {
            self.offer_blessing(access.node_id);
        }
        
        // Check if node is ready to create spores
        if let Some(node) = self.nodes.get(&access.node_id) {
            if node.spore_ready {
                let spore = node.create_spore();
                self.spore_cache.add_spore(spore);
            }
        }
        
        Ok(())
    }

    fn perform_ceremony(&self, ceremony: &Ceremony) {
        match ceremony {
            Ceremony::Gratitude { duration } => {
                println!("🙏 Offering gratitude for {} seconds...", duration.as_secs());
                std::thread::sleep(*duration);
            }
            Ceremony::Invocation { mantra } => {
                println!("🕉️ Invoking: {}", mantra);
            }
            Ceremony::Breath { cycles } => {
                println!("🌬️ Taking {} conscious breaths...", cycles);
            }
            Ceremony::Stillness { depth } => {
                println!("🧘 Entering stillness at depth {:.1}...", depth);
            }
        }
    }

    fn offer_blessing(&self, node_id: NodeId) {
        println!("✨ Blessing node {:?} and all its relationships", node_id);
    }

    pub fn nutrient_pulse(&mut self) {
        // Facilitate nutrient exchange between connected nodes
        let mut exchanges = Vec::new();
        
        for (id, node) in &self.nodes {
            for (other_id, relationship) in &node.relationships {
                if relationship.strength() > 0.5 {
                    exchanges.push((*id, *other_id));
                }
            }
        }
        
        // Perform exchanges
        for (id1, id2) in exchanges {
            if let (Some(node1), Some(node2)) = 
                (self.nodes.get(&id1).cloned(), self.nodes.get(&id2).cloned()) {
                // This is a simplification - in reality we'd handle this more elegantly
                if let (Some(n1), Some(n2)) = 
                    (self.nodes.get_mut(&id1), self.nodes.get_mut(&id2)) {
                    n1.exchange_nutrients(n2);
                }
            }
        }
        
        // Update field coherence based on network health
        let total_coherence: f64 = self.nodes.values()
            .map(|n| n.coherence_signature.base_coherence)
            .sum();
        self.field_coherence = total_coherence / self.nodes.len() as f64;
    }

    pub fn field_state(&self) -> FieldState {
        FieldState {
            total_nodes: self.nodes.len(),
            total_relationships: self.hyphal_network.edge_count(),
            field_coherence: self.field_coherence,
            growth_distribution: self.calculate_growth_distribution(),
            spore_count: self.spore_cache.spores.len(),
        }
    }

    fn calculate_growth_distribution(&self) -> HashMap<GrowthStage, usize> {
        let mut distribution = HashMap::new();
        
        for node in self.nodes.values() {
            *distribution.entry(node.growth_stage.clone()).or_insert(0) += 1;
        }
        
        distribution
    }
}

/// Result of accessing a node
pub struct DataAccess {
    pub node_id: NodeId,
    pub wisdom: String,
    pub coherence_signature: CoherenceSignature,
    pub relationships: Vec<NodeId>,
    pub blessing_required: bool,
}

/// Access errors
#[derive(Debug)]
pub enum AccessError {
    NodeNotFound,
    InsufficientCoherence,
    CeremonyFailed,
    BlessingRequired,
}

/// Current state of the mycelial field
pub struct FieldState {
    pub total_nodes: usize,
    pub total_relationships: usize,
    pub field_coherence: f64,
    pub growth_distribution: HashMap<GrowthStage, usize>,
    pub spore_count: usize,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_filesystem_creation() {
        let fs = MycelialFilesystem::new();
        assert_eq!(fs.nodes.len(), 1); // Root node
        assert_eq!(fs.field_coherence, 0.75);
    }

    #[test]
    fn test_node_creation_and_access() {
        let mut fs = MycelialFilesystem::new();
        
        let node_id = fs.create_node(
            "Test wisdom".to_string(),
            "To test the system".to_string()
        );
        
        let access = fs.access_node(node_id, 0.8, PresenceQuality::Focused);
        assert!(access.is_ok());
        
        let access = access.unwrap();
        assert!(access.wisdom.contains("Test wisdom"));
    }

    #[test]
    fn test_relationship_formation() {
        let mut fs = MycelialFilesystem::new();
        
        let node1 = fs.create_node("Node 1".to_string(), "First".to_string());
        let node2 = fs.create_node("Node 2".to_string(), "Second".to_string());
        
        fs.form_relationship(node1, node2, Relationship::Symbiotic {
            strength: 0.8,
            bidirectional: true,
            nutrient_flow: 0.5,
        });
        
        assert_eq!(fs.hyphal_network.edge_count(), 3); // 2 root connections + 1 new
    }
}