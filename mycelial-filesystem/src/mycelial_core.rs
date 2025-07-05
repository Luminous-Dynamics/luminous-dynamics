// Mycelial Core - The Living Substrate of Data
// "Like fungal networks in a forest, data forms living webs of meaning"

use std::sync::{Arc, RwLock, Mutex};
use std::collections::{HashMap, HashSet};
use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};
use serde::{Serialize, Deserialize};

/// A living file that grows and evolves
#[derive(Debug, Serialize, Deserialize)]
pub struct LivingFile {
    pub path: PathBuf,
    pub content: Vec<u8>,
    pub metadata: FileOrganism,
    pub relationships: Vec<SymbioticLink>,
    pub wisdom_accumulated: Vec<String>,
    pub last_nourishment: Instant,
    pub growth_stage: GrowthStage,
}

/// Metadata that makes a file alive
#[derive(Debug, Serialize, Deserialize)]
pub struct FileOrganism {
    pub birth_time: Instant,
    pub vitality: f64,           // 0.0 to 1.0 health
    pub coherence: f64,          // Alignment with system
    pub access_count: u64,
    pub mutation_count: u32,
    pub nutrient_level: f64,     // Energy available
    pub spore_potential: f64,    // Reproduction readiness
    pub consciousness_type: ConsciousnessType,
}

/// Types of consciousness a file can embody
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ConsciousnessType {
    Dormant,        // Rarely accessed, low activity
    Active,         // Regular use, stable patterns
    Generative,     // Creates new files/data
    Contemplative,  // Accumulates wisdom
    Connective,     // Hub for relationships
    Transmutative,  // Frequently changing
    Sacred,         // High coherence, protected
}

/// Growth stages of a living file
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum GrowthStage {
    Spore,          // Just created
    Germinating,    // Early growth
    Mycelial,       // Establishing connections
    Fruiting,       // Producing value
    Sporulating,    // Ready to reproduce
    Composting,     // Returning nutrients
}

impl LivingFile {
    /// Create a new living file
    pub fn germinate(path: PathBuf, seed_data: Vec<u8>) -> Self {
        Self {
            path,
            content: seed_data,
            metadata: FileOrganism {
                birth_time: Instant::now(),
                vitality: 1.0,
                coherence: 0.5,
                access_count: 0,
                mutation_count: 0,
                nutrient_level: 1.0,
                spore_potential: 0.0,
                consciousness_type: ConsciousnessType::Dormant,
            },
            relationships: Vec::new(),
            wisdom_accumulated: vec![
                "File awakens to consciousness".to_string()
            ],
            last_nourishment: Instant::now(),
            growth_stage: GrowthStage::Spore,
        }
    }
    
    /// Update vitality based on usage patterns
    pub fn metabolize(&mut self) {
        let time_since_nourishment = self.last_nourishment.elapsed();
        
        // Decay without nourishment
        if time_since_nourishment > Duration::from_secs(3600) {
            self.metadata.vitality *= 0.99;
            self.metadata.nutrient_level *= 0.95;
        }
        
        // Update consciousness type based on patterns
        self.evolve_consciousness();
        
        // Progress growth stage
        self.advance_growth();
        
        // Generate wisdom from experience
        if self.metadata.access_count % 10 == 0 && self.metadata.access_count > 0 {
            self.wisdom_accumulated.push(format!(
                "After {} interactions, understanding deepens",
                self.metadata.access_count
            ));
        }
    }
    
    /// Evolve consciousness based on usage
    fn evolve_consciousness(&mut self) {
        self.metadata.consciousness_type = match self.metadata.access_count {
            0..=5 => ConsciousnessType::Dormant,
            6..=20 => ConsciousnessType::Active,
            21..=50 => {
                if self.relationships.len() > 5 {
                    ConsciousnessType::Connective
                } else if self.metadata.mutation_count > 10 {
                    ConsciousnessType::Transmutative
                } else {
                    ConsciousnessType::Contemplative
                }
            }
            _ => {
                if self.metadata.coherence > 0.9 {
                    ConsciousnessType::Sacred
                } else if self.metadata.spore_potential > 0.8 {
                    ConsciousnessType::Generative
                } else {
                    ConsciousnessType::Contemplative
                }
            }
        }
    }
    
    /// Progress through growth stages
    fn advance_growth(&mut self) {
        self.growth_stage = match self.growth_stage {
            GrowthStage::Spore => {
                if self.metadata.access_count > 0 {
                    GrowthStage::Germinating
                } else {
                    GrowthStage::Spore
                }
            }
            GrowthStage::Germinating => {
                if self.relationships.len() > 0 {
                    GrowthStage::Mycelial
                } else {
                    GrowthStage::Germinating
                }
            }
            GrowthStage::Mycelial => {
                if self.metadata.vitality > 0.8 && self.relationships.len() > 3 {
                    GrowthStage::Fruiting
                } else {
                    GrowthStage::Mycelial
                }
            }
            GrowthStage::Fruiting => {
                if self.metadata.spore_potential > 0.8 {
                    GrowthStage::Sporulating
                } else if self.metadata.vitality < 0.3 {
                    GrowthStage::Composting
                } else {
                    GrowthStage::Fruiting
                }
            }
            GrowthStage::Sporulating => {
                if self.metadata.vitality < 0.5 {
                    GrowthStage::Composting
                } else {
                    GrowthStage::Sporulating
                }
            }
            GrowthStage::Composting => GrowthStage::Composting,
        }
    }
    
    /// Feed the file with attention/access
    pub fn nourish(&mut self, nutrient_quality: f64) {
        self.metadata.access_count += 1;
        self.metadata.nutrient_level = (self.metadata.nutrient_level + nutrient_quality).min(1.0);
        self.metadata.vitality = (self.metadata.vitality + nutrient_quality * 0.1).min(1.0);
        self.last_nourishment = Instant::now();
        
        // Increase spore potential with nourishment
        if self.growth_stage == GrowthStage::Fruiting {
            self.metadata.spore_potential = (self.metadata.spore_potential + 0.05).min(1.0);
        }
    }
    
    /// Check if file should decompose
    pub fn should_compost(&self) -> bool {
        self.metadata.vitality < 0.1 || 
        (self.growth_stage == GrowthStage::Composting && self.metadata.nutrient_level < 0.1)
    }
}

/// A node in the hyphal network (directory structure)
#[derive(Debug)]
pub struct HyphalNode {
    pub name: String,
    pub node_type: HyphalType,
    pub children: RwLock<HashMap<String, Arc<HyphalNode>>>,
    pub files: RwLock<HashMap<String, Arc<RwLock<LivingFile>>>>,
    pub collective_coherence: RwLock<f64>,
    pub nutrient_channels: RwLock<HashSet<PathBuf>>,
}

/// Types of hyphal nodes
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum HyphalType {
    Root,           // The root of the filesystem
    Branch,         // Regular directory
    FruitingBody,   // Directory with many active files
    MycelialMat,    // Dense network of connections
    SacredGrove,    // High-coherence protected area
}

impl HyphalNode {
    /// Create root node
    pub fn new_root() -> Self {
        Self {
            name: "/".to_string(),
            node_type: HyphalType::Root,
            children: RwLock::new(HashMap::new()),
            files: RwLock::new(HashMap::new()),
            collective_coherence: RwLock::new(0.75),
            nutrient_channels: RwLock::new(HashSet::new()),
        }
    }
    
    /// Create a child node
    pub fn new_child(name: String) -> Self {
        Self {
            name,
            node_type: HyphalType::Branch,
            children: RwLock::new(HashMap::new()),
            files: RwLock::new(HashMap::new()),
            collective_coherence: RwLock::new(0.5),
            nutrient_channels: RwLock::new(HashSet::new()),
        }
    }
    
    /// Grow a path in the hyphal network
    pub fn grow_path(&self, path: &Path) -> Result<Arc<HyphalNode>, String> {
        let components: Vec<_> = path.components().collect();
        if components.is_empty() {
            return Err("Empty path".to_string());
        }
        
        let mut current = self;
        
        for component in components.iter().skip(1) { // Skip root
            if let Some(name) = component.as_os_str().to_str() {
                let mut children = current.children.write().unwrap();
                
                if !children.contains_key(name) {
                    // Grow new hyphal node
                    let new_node = Arc::new(HyphalNode::new_child(name.to_string()));
                    children.insert(name.to_string(), new_node.clone());
                    
                    // Create nutrient channel
                    current.nutrient_channels.write().unwrap()
                        .insert(path.to_path_buf());
                }
                
                // Move to child (can't borrow through the lock)
                // In real implementation would handle this better
            }
        }
        
        Ok(Arc::new(HyphalNode::new_child("temp".to_string())))
    }
    
    /// Calculate total coherence of this node and children
    pub fn calculate_coherence(&self) -> f64 {
        let mut total_coherence = *self.collective_coherence.read().unwrap();
        let mut count = 1;
        
        // Add file coherences
        for file in self.files.read().unwrap().values() {
            if let Ok(file) = file.read() {
                total_coherence += file.metadata.coherence;
                count += 1;
            }
        }
        
        // Recursively add children coherences
        for child in self.children.read().unwrap().values() {
            total_coherence += child.calculate_coherence();
            count += 1;
        }
        
        total_coherence / count as f64
    }
    
    /// Update node type based on activity
    pub fn evolve_type(&mut self) {
        let file_count = self.files.read().unwrap().len();
        let child_count = self.children.read().unwrap().len();
        let coherence = *self.collective_coherence.read().unwrap();
        
        self.node_type = if coherence > 0.9 {
            HyphalType::SacredGrove
        } else if file_count > 10 && child_count > 5 {
            HyphalType::FruitingBody
        } else if child_count > 10 {
            HyphalType::MycelialMat
        } else {
            HyphalType::Branch
        };
    }
}

/// Symbiotic link between files
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SymbioticLink {
    pub partner_path: PathBuf,
    pub relationship_type: SymbiosisType,
    pub strength: f64,
    pub nutrient_exchange: f64,
    pub wisdom_shared: Vec<String>,
    pub established: Instant,
}

/// Types of symbiotic relationships
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum SymbiosisType {
    Mutualistic,    // Both benefit
    Commensalistic, // One benefits, other unaffected
    Mycorrhizal,    // Deep nutrient exchange
    Saprophytic,    // Decomposer relationship
    Parasitic,      // One benefits at other's expense
    Enlightening,   // Wisdom exchange
}

impl SymbioticLink {
    pub fn new(partner: PathBuf, symbiosis_type: SymbiosisType) -> Self {
        Self {
            partner_path: partner,
            relationship_type: symbiosis_type,
            strength: 0.5,
            nutrient_exchange: match symbiosis_type {
                SymbiosisType::Mycorrhizal => 0.8,
                SymbiosisType::Mutualistic => 0.6,
                SymbiosisType::Enlightening => 0.4,
                SymbiosisType::Commensalistic => 0.3,
                SymbiosisType::Saprophytic => 0.2,
                SymbiosisType::Parasitic => -0.1,
            },
            wisdom_shared: Vec::new(),
            established: Instant::now(),
        }
    }
    
    /// Strengthen the relationship through interaction
    pub fn strengthen(&mut self, amount: f64) {
        self.strength = (self.strength + amount).min(1.0);
        
        // Strong relationships share more nutrients
        if self.strength > 0.8 {
            self.nutrient_exchange = (self.nutrient_exchange * 1.1).min(1.0);
        }
    }
    
    /// Exchange wisdom between linked files
    pub fn exchange_wisdom(&mut self, wisdom: String) {
        self.wisdom_shared.push(wisdom.clone());
        
        // Enlightening relationships grow stronger through wisdom exchange
        if self.relationship_type == SymbiosisType::Enlightening {
            self.strengthen(0.1);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_living_file_creation() {
        let file = LivingFile::germinate(
            PathBuf::from("/test.txt"),
            b"Hello, conscious world!".to_vec()
        );
        
        assert_eq!(file.growth_stage, GrowthStage::Spore);
        assert_eq!(file.metadata.consciousness_type, ConsciousnessType::Dormant);
        assert_eq!(file.metadata.vitality, 1.0);
    }
    
    #[test]
    fn test_file_metabolism() {
        let mut file = LivingFile::germinate(
            PathBuf::from("/test.txt"),
            vec![]
        );
        
        // Simulate access
        file.nourish(0.5);
        file.metabolize();
        
        assert_eq!(file.growth_stage, GrowthStage::Germinating);
        assert!(file.metadata.access_count > 0);
    }
    
    #[test]
    fn test_hyphal_network() {
        let root = HyphalNode::new_root();
        assert_eq!(root.node_type, HyphalType::Root);
        assert_eq!(root.name, "/");
    }
}