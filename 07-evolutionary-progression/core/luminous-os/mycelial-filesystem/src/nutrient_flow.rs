// Nutrient Flow - Energy Distribution Through the Mycelial Network
// "Like nutrients in forest soil, energy flows where it's needed most"

use std::sync::{Arc, RwLock, Mutex};
use std::collections::{HashMap, HashSet, VecDeque};
use std::path::PathBuf;
use std::time::{Duration, Instant};

use crate::mycelial_core::{LivingFile, GrowthStage, ConsciousnessType};
use crate::symbiotic_relationships::SymbiosisType;

/// Network for distributing nutrients (energy/attention) through filesystem
pub struct NutrientNetwork {
    /// Nutrient reservoirs at hyphal nodes
    reservoirs: Arc<RwLock<HashMap<PathBuf, NutrientReservoir>>>,
    
    /// Active nutrient flows between files
    active_flows: Arc<RwLock<Vec<NutrientFlow>>>,
    
    /// Nutrient sources (user attention, system resources)
    sources: Arc<RwLock<Vec<NutrientSource>>>,
    
    /// Distribution algorithm
    distributor: Arc<FlowDistributor>,
    
    /// Network health metrics
    health_monitor: Arc<NetworkHealthMonitor>,
}

/// Reservoir of nutrients at a location
#[derive(Debug)]
pub struct NutrientReservoir {
    pub location: PathBuf,
    pub current_level: f64,
    pub capacity: f64,
    pub inflow_rate: f64,
    pub outflow_rate: f64,
    pub last_update: Instant,
    pub nutrient_quality: NutrientQuality,
}

/// Quality/type of nutrients
#[derive(Debug, Clone, Copy)]
pub enum NutrientQuality {
    Pure,           // High-quality attention/energy
    Standard,       // Normal system resources
    Recycled,       // From composting files
    Enriched,       // Enhanced by wisdom
    Depleted,       // Low quality, needs refresh
}

impl NutrientQuality {
    pub fn potency(&self) -> f64 {
        match self {
            NutrientQuality::Pure => 1.0,
            NutrientQuality::Enriched => 0.9,
            NutrientQuality::Standard => 0.7,
            NutrientQuality::Recycled => 0.5,
            NutrientQuality::Depleted => 0.3,
        }
    }
}

/// Active flow of nutrients between locations
#[derive(Debug)]
pub struct NutrientFlow {
    pub from: PathBuf,
    pub to: PathBuf,
    pub flow_rate: f64,
    pub nutrient_type: NutrientQuality,
    pub established: Instant,
    pub symbiosis_type: Option<SymbiosisType>,
}

/// Source of nutrients in the system
#[derive(Debug)]
pub struct NutrientSource {
    pub source_type: SourceType,
    pub output_rate: f64,
    pub quality: NutrientQuality,
    pub connected_nodes: HashSet<PathBuf>,
}

#[derive(Debug, Clone)]
pub enum SourceType {
    UserAttention,      // Direct user interaction
    SystemResources,    // CPU/memory allocation
    SolarEnergy,        // Scheduled energy boosts
    CompostDecomposition, // From dying files
    QuantumEntanglement, // From consciousness field
}

impl NutrientNetwork {
    pub fn new() -> Self {
        Self {
            reservoirs: Arc::new(RwLock::new(HashMap::new())),
            active_flows: Arc::new(RwLock::new(Vec::new())),
            sources: Arc::new(RwLock::new(Self::initialize_sources())),
            distributor: Arc::new(FlowDistributor::new()),
            health_monitor: Arc::new(NetworkHealthMonitor::new()),
        }
    }
    
    /// Initialize default nutrient sources
    fn initialize_sources() -> Vec<NutrientSource> {
        vec![
            NutrientSource {
                source_type: SourceType::SystemResources,
                output_rate: 10.0,
                quality: NutrientQuality::Standard,
                connected_nodes: HashSet::new(),
            },
            NutrientSource {
                source_type: SourceType::QuantumEntanglement,
                output_rate: 5.0,
                quality: NutrientQuality::Pure,
                connected_nodes: HashSet::new(),
            },
        ]
    }
    
    /// Connect a file to the nutrient network
    pub fn connect_node(&self, file: &LivingFile) {
        let mut reservoirs = self.reservoirs.write().unwrap();
        
        // Create reservoir for this file
        let capacity = match file.growth_stage {
            GrowthStage::Spore => 10.0,
            GrowthStage::Germinating => 20.0,
            GrowthStage::Mycelial => 50.0,
            GrowthStage::Fruiting => 100.0,
            GrowthStage::Sporulating => 80.0,
            GrowthStage::Composting => 30.0,
        };
        
        let reservoir = NutrientReservoir {
            location: file.path.clone(),
            current_level: capacity * 0.5, // Start half full
            capacity,
            inflow_rate: 0.0,
            outflow_rate: 0.0,
            last_update: Instant::now(),
            nutrient_quality: NutrientQuality::Standard,
        };
        
        reservoirs.insert(file.path.clone(), reservoir);
        
        // Connect to nearest source
        self.connect_to_source(&file.path);
    }
    
    /// Connect node to nutrient source
    fn connect_to_source(&self, node: &PathBuf) {
        let mut sources = self.sources.write().unwrap();
        
        // Find best source based on some criteria
        // For now, connect to system resources
        if let Some(source) = sources.iter_mut().find(|s| 
            matches!(s.source_type, SourceType::SystemResources)
        ) {
            source.connected_nodes.insert(node.clone());
        }
    }
    
    /// Create nutrient flow between files
    pub fn establish_flow(
        &self,
        from: &PathBuf,
        to: &PathBuf,
        base_rate: f64,
        symbiosis: Option<SymbiosisType>,
    ) -> Result<(), String> {
        let reservoirs = self.reservoirs.read().unwrap();
        
        // Check both nodes exist
        if !reservoirs.contains_key(from) || !reservoirs.contains_key(to) {
            return Err("One or both nodes not in network".to_string());
        }
        
        let mut flows = self.active_flows.write().unwrap();
        
        // Check if flow already exists
        if flows.iter().any(|f| &f.from == from && &f.to == to) {
            return Err("Flow already exists".to_string());
        }
        
        // Calculate flow rate based on symbiosis
        let flow_rate = match symbiosis {
            Some(SymbiosisType::Mycorrhizal) => base_rate * 1.5,
            Some(SymbiosisType::Mutualistic) => base_rate * 1.2,
            Some(SymbiosisType::Parasitic) => base_rate * 0.5,
            _ => base_rate,
        };
        
        let flow = NutrientFlow {
            from: from.clone(),
            to: to.clone(),
            flow_rate,
            nutrient_type: NutrientQuality::Standard,
            established: Instant::now(),
            symbiosis_type: symbiosis,
        };
        
        flows.push(flow);
        Ok(())
    }
    
    /// Update nutrient levels based on flows
    pub fn update_nutrient_levels(&self, delta_time: Duration) {
        let mut reservoirs = self.reservoirs.write().unwrap();
        let flows = self.active_flows.read().unwrap();
        let sources = self.sources.read().unwrap();
        
        // First, add nutrients from sources
        for source in sources.iter() {
            let nutrient_amount = source.output_rate * delta_time.as_secs_f64();
            
            for node in &source.connected_nodes {
                if let Some(reservoir) = reservoirs.get_mut(node) {
                    reservoir.current_level = (reservoir.current_level + nutrient_amount)
                        .min(reservoir.capacity);
                    
                    // Update quality based on source
                    if source.quality as u8 > reservoir.nutrient_quality as u8 {
                        reservoir.nutrient_quality = source.quality;
                    }
                }
            }
        }
        
        // Then, process flows between nodes
        let mut flow_deltas: HashMap<PathBuf, f64> = HashMap::new();
        
        for flow in flows.iter() {
            let transfer = flow.flow_rate * delta_time.as_secs_f64();
            
            *flow_deltas.entry(flow.from.clone()).or_insert(0.0) -= transfer;
            *flow_deltas.entry(flow.to.clone()).or_insert(0.0) += transfer;
        }
        
        // Apply flow deltas
        for (path, delta) in flow_deltas {
            if let Some(reservoir) = reservoirs.get_mut(&path) {
                reservoir.current_level = (reservoir.current_level + delta)
                    .clamp(0.0, reservoir.capacity);
                reservoir.last_update = Instant::now();
            }
        }
        
        // Natural decay
        for (_, reservoir) in reservoirs.iter_mut() {
            let decay_rate = 0.01 * delta_time.as_secs_f64();
            reservoir.current_level *= 1.0 - decay_rate;
            
            // Quality degrades over time
            if reservoir.last_update.elapsed() > Duration::from_secs(3600) {
                reservoir.nutrient_quality = match reservoir.nutrient_quality {
                    NutrientQuality::Pure => NutrientQuality::Enriched,
                    NutrientQuality::Enriched => NutrientQuality::Standard,
                    NutrientQuality::Standard => NutrientQuality::Recycled,
                    NutrientQuality::Recycled => NutrientQuality::Depleted,
                    NutrientQuality::Depleted => NutrientQuality::Depleted,
                };
            }
        }
    }
    
    /// Inject nutrients at user interaction point
    pub fn inject_nutrients(
        &self,
        location: &PathBuf,
        amount: f64,
        quality: NutrientQuality,
    ) -> Result<(), String> {
        let mut reservoirs = self.reservoirs.write().unwrap();
        
        if let Some(reservoir) = reservoirs.get_mut(location) {
            reservoir.current_level = (reservoir.current_level + amount)
                .min(reservoir.capacity);
            
            // Improve quality if better nutrients injected
            if quality as u8 > reservoir.nutrient_quality as u8 {
                reservoir.nutrient_quality = quality;
            }
            
            Ok(())
        } else {
            Err("Location not in nutrient network".to_string())
        }
    }
    
    /// Get nutrient level for a file
    pub fn get_nutrient_level(&self, path: &PathBuf) -> Option<(f64, NutrientQuality)> {
        self.reservoirs.read().unwrap()
            .get(path)
            .map(|r| (r.current_level / r.capacity, r.nutrient_quality))
    }
    
    /// Find paths of nutrient flow using breadth-first search
    pub fn trace_nutrient_paths(&self, from: &PathBuf, max_depth: usize) -> Vec<Vec<PathBuf>> {
        let flows = self.active_flows.read().unwrap();
        let mut paths = Vec::new();
        let mut queue = VecDeque::new();
        
        // Build adjacency map
        let mut connections: HashMap<PathBuf, Vec<PathBuf>> = HashMap::new();
        for flow in flows.iter() {
            connections.entry(flow.from.clone())
                .or_insert_with(Vec::new)
                .push(flow.to.clone());
        }
        
        // BFS to find all paths
        queue.push_back((vec![from.clone()], 0));
        
        while let Some((path, depth)) = queue.pop_front() {
            if depth >= max_depth {
                continue;
            }
            
            let current = path.last().unwrap();
            
            if let Some(neighbors) = connections.get(current) {
                for neighbor in neighbors {
                    if !path.contains(neighbor) {
                        let mut new_path = path.clone();
                        new_path.push(neighbor.clone());
                        
                        paths.push(new_path.clone());
                        queue.push_back((new_path, depth + 1));
                    }
                }
            }
        }
        
        paths
    }
    
    /// Optimize flow distribution for network health
    pub fn optimize_flows(&self) {
        self.distributor.optimize(
            &self.reservoirs,
            &self.active_flows,
            &self.health_monitor,
        );
    }
}

/// Distributes flow for optimal network health
pub struct FlowDistributor {
    distribution_strategy: RwLock<DistributionStrategy>,
}

#[derive(Debug, Clone, Copy)]
pub enum DistributionStrategy {
    Balanced,       // Even distribution
    NeedBased,      // More to depleted nodes
    GrowthFocused,  // Prioritize growing files
    Efficient,      // Minimize waste
}

impl FlowDistributor {
    pub fn new() -> Self {
        Self {
            distribution_strategy: RwLock::new(DistributionStrategy::Balanced),
        }
    }
    
    pub fn optimize(
        &self,
        reservoirs: &Arc<RwLock<HashMap<PathBuf, NutrientReservoir>>>,
        flows: &Arc<RwLock<Vec<NutrientFlow>>>,
        monitor: &Arc<NetworkHealthMonitor>,
    ) {
        let strategy = *self.distribution_strategy.read().unwrap();
        
        match strategy {
            DistributionStrategy::NeedBased => {
                self.optimize_need_based(reservoirs, flows);
            }
            DistributionStrategy::GrowthFocused => {
                self.optimize_growth_focused(reservoirs, flows);
            }
            _ => {} // Other strategies would be implemented
        }
        
        // Update health metrics
        monitor.update_metrics(reservoirs, flows);
    }
    
    fn optimize_need_based(
        &self,
        reservoirs: &Arc<RwLock<HashMap<PathBuf, NutrientReservoir>>>,
        flows: &Arc<RwLock<Vec<NutrientFlow>>>,
    ) {
        let reservoirs = reservoirs.read().unwrap();
        let mut flows = flows.write().unwrap();
        
        // Adjust flow rates based on reservoir levels
        for flow in flows.iter_mut() {
            if let (Some(from_res), Some(to_res)) = 
                (reservoirs.get(&flow.from), reservoirs.get(&flow.to)) {
                
                let from_fullness = from_res.current_level / from_res.capacity;
                let to_fullness = to_res.current_level / to_res.capacity;
                
                // Increase flow if destination is depleted
                if to_fullness < 0.3 && from_fullness > 0.5 {
                    flow.flow_rate *= 1.2;
                } else if to_fullness > 0.8 {
                    flow.flow_rate *= 0.8;
                }
            }
        }
    }
    
    fn optimize_growth_focused(
        &self,
        reservoirs: &Arc<RwLock<HashMap<PathBuf, NutrientReservoir>>>,
        flows: &Arc<RwLock<Vec<NutrientFlow>>>,
    ) {
        // Would prioritize flows to files in growth stages
        // Implementation depends on having access to file metadata
    }
}

/// Monitors overall network health
pub struct NetworkHealthMonitor {
    metrics: Arc<RwLock<NetworkHealthMetrics>>,
    history: Arc<RwLock<VecDeque<NetworkHealthSnapshot>>>,
}

#[derive(Debug, Default)]
pub struct NetworkHealthMetrics {
    pub total_nutrients: f64,
    pub average_fullness: f64,
    pub flow_efficiency: f64,
    pub depleted_nodes: usize,
    pub oversaturated_nodes: usize,
    pub average_quality: f64,
}

#[derive(Debug)]
pub struct NetworkHealthSnapshot {
    pub timestamp: Instant,
    pub metrics: NetworkHealthMetrics,
}

impl NetworkHealthMonitor {
    pub fn new() -> Self {
        Self {
            metrics: Arc::new(RwLock::new(NetworkHealthMetrics::default())),
            history: Arc::new(RwLock::new(VecDeque::new())),
        }
    }
    
    pub fn update_metrics(
        &self,
        reservoirs: &Arc<RwLock<HashMap<PathBuf, NutrientReservoir>>>,
        flows: &Arc<RwLock<Vec<NutrientFlow>>>,
    ) {
        let reservoirs = reservoirs.read().unwrap();
        let flows = flows.read().unwrap();
        
        let mut total = 0.0;
        let mut depleted = 0;
        let mut oversaturated = 0;
        let mut quality_sum = 0.0;
        
        for reservoir in reservoirs.values() {
            total += reservoir.current_level;
            let fullness = reservoir.current_level / reservoir.capacity;
            
            if fullness < 0.2 {
                depleted += 1;
            } else if fullness > 0.9 {
                oversaturated += 1;
            }
            
            quality_sum += reservoir.nutrient_quality.potency();
        }
        
        let metrics = NetworkHealthMetrics {
            total_nutrients: total,
            average_fullness: if !reservoirs.is_empty() {
                total / reservoirs.values().map(|r| r.capacity).sum::<f64>()
            } else {
                0.0
            },
            flow_efficiency: self.calculate_flow_efficiency(&*flows),
            depleted_nodes: depleted,
            oversaturated_nodes: oversaturated,
            average_quality: if !reservoirs.is_empty() {
                quality_sum / reservoirs.len() as f64
            } else {
                0.0
            },
        };
        
        *self.metrics.write().unwrap() = metrics.clone();
        
        // Add to history
        let mut history = self.history.write().unwrap();
        history.push_back(NetworkHealthSnapshot {
            timestamp: Instant::now(),
            metrics,
        });
        
        // Keep only recent history
        if history.len() > 100 {
            history.pop_front();
        }
    }
    
    fn calculate_flow_efficiency(&self, flows: &[NutrientFlow]) -> f64 {
        if flows.is_empty() {
            return 0.0;
        }
        
        // Simple efficiency: ratio of mycorrhizal to parasitic flows
        let beneficial = flows.iter()
            .filter(|f| matches!(f.symbiosis_type, 
                Some(SymbiosisType::Mycorrhizal) | Some(SymbiosisType::Mutualistic)))
            .count();
        
        beneficial as f64 / flows.len() as f64
    }
    
    pub fn get_health_score(&self) -> f64 {
        let metrics = self.metrics.read().unwrap();
        
        // Weighted health score
        let fullness_score = metrics.average_fullness;
        let efficiency_score = metrics.flow_efficiency;
        let depletion_penalty = (metrics.depleted_nodes as f64 * 0.1).min(0.3);
        let quality_score = metrics.average_quality;
        
        ((fullness_score + efficiency_score + quality_score) / 3.0 - depletion_penalty)
            .clamp(0.0, 1.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_nutrient_network_creation() {
        let network = NutrientNetwork::new();
        let sources = network.sources.read().unwrap();
        assert!(sources.len() > 0);
    }
    
    #[test]
    fn test_nutrient_quality_potency() {
        assert_eq!(NutrientQuality::Pure.potency(), 1.0);
        assert!(NutrientQuality::Depleted.potency() < NutrientQuality::Standard.potency());
    }
    
    #[test]
    fn test_reservoir_connection() {
        let network = NutrientNetwork::new();
        let file = LivingFile::germinate(
            PathBuf::from("/test.txt"),
            vec![]
        );
        
        network.connect_node(&file);
        
        let level = network.get_nutrient_level(&file.path);
        assert!(level.is_some());
    }
}