// Symbiotic Relationships - Files in Sacred Connection
// "No file exists in isolation; all data dances in relationship"

use std::sync::{Arc, RwLock};
use std::collections::{HashMap, HashSet};
use std::path::PathBuf;
use crate::mycelial_core::{LivingFile, SymbioticLink, SymbiosisType, ConsciousnessType};

/// Manages symbiotic relationships between files
pub struct SymbioticNetwork {
    /// All active relationships indexed by file path
    relationships: Arc<RwLock<HashMap<PathBuf, Vec<SymbioticLink>>>>,
    
    /// Relationship suggestions based on patterns
    matchmaker: Arc<RelationshipMatchmaker>,
    
    /// Nutrient flow calculations
    flow_calculator: Arc<NutrientFlowCalculator>,
    
    /// Wisdom exchange tracker
    wisdom_weaver: Arc<WisdomWeaver>,
}

impl SymbioticNetwork {
    pub fn new() -> Self {
        Self {
            relationships: Arc::new(RwLock::new(HashMap::new())),
            matchmaker: Arc::new(RelationshipMatchmaker::new()),
            flow_calculator: Arc::new(NutrientFlowCalculator::new()),
            wisdom_weaver: Arc::new(WisdomWeaver::new()),
        }
    }
    
    /// Establish a new symbiotic relationship
    pub fn form_symbiosis(
        &self,
        file_a: &PathBuf,
        file_b: &PathBuf,
        relationship_type: SymbiosisType,
    ) -> Result<(), String> {
        if file_a == file_b {
            return Err("Cannot form symbiosis with self".to_string());
        }
        
        let mut relationships = self.relationships.write().unwrap();
        
        // Create bidirectional links
        let link_ab = SymbioticLink::new(file_b.clone(), relationship_type);
        let link_ba = SymbioticLink::new(file_a.clone(), relationship_type);
        
        relationships.entry(file_a.clone())
            .or_insert_with(Vec::new)
            .push(link_ab);
            
        relationships.entry(file_b.clone())
            .or_insert_with(Vec::new)
            .push(link_ba);
        
        Ok(())
    }
    
    /// Find potential symbiotic partners for a file
    pub fn suggest_partners(
        &self,
        file: &LivingFile,
        all_files: &HashMap<PathBuf, Arc<RwLock<LivingFile>>>,
    ) -> Vec<(PathBuf, SymbiosisType, f64)> {
        self.matchmaker.find_matches(file, all_files)
    }
    
    /// Calculate nutrient flow between connected files
    pub fn calculate_nutrient_flow(
        &self,
        file_path: &PathBuf,
    ) -> HashMap<PathBuf, f64> {
        let relationships = self.relationships.read().unwrap();
        
        if let Some(links) = relationships.get(file_path) {
            self.flow_calculator.calculate_flows(links)
        } else {
            HashMap::new()
        }
    }
    
    /// Exchange wisdom between symbiotically linked files
    pub fn propagate_wisdom(
        &self,
        source_path: &PathBuf,
        wisdom: String,
    ) -> Result<(), String> {
        let mut relationships = self.relationships.write().unwrap();
        
        if let Some(links) = relationships.get_mut(source_path) {
            for link in links.iter_mut() {
                if link.relationship_type == SymbiosisType::Enlightening ||
                   link.relationship_type == SymbiosisType::Mutualistic {
                    link.exchange_wisdom(wisdom.clone());
                }
            }
            Ok(())
        } else {
            Err("No relationships found for file".to_string())
        }
    }
    
    /// Update relationship strengths based on interactions
    pub fn strengthen_bonds(
        &self,
        file_a: &PathBuf,
        file_b: &PathBuf,
        interaction_quality: f64,
    ) -> Result<(), String> {
        let mut relationships = self.relationships.write().unwrap();
        
        // Strengthen A->B link
        if let Some(links) = relationships.get_mut(file_a) {
            for link in links.iter_mut() {
                if &link.partner_path == file_b {
                    link.strengthen(interaction_quality);
                }
            }
        }
        
        // Strengthen B->A link
        if let Some(links) = relationships.get_mut(file_b) {
            for link in links.iter_mut() {
                if &link.partner_path == file_a {
                    link.strengthen(interaction_quality);
                }
            }
        }
        
        Ok(())
    }
    
    /// Prune weak or parasitic relationships
    pub fn prune_unhealthy_relationships(&self, threshold: f64) {
        let mut relationships = self.relationships.write().unwrap();
        
        for (_, links) in relationships.iter_mut() {
            links.retain(|link| {
                // Keep strong relationships
                if link.strength > threshold {
                    true
                } else {
                    // Remove weak parasitic relationships
                    !(link.relationship_type == SymbiosisType::Parasitic && 
                      link.strength < threshold * 0.5)
                }
            });
        }
    }
}

/// Matchmaker for finding compatible file relationships
pub struct RelationshipMatchmaker {
    /// Compatibility rules
    compatibility_matrix: HashMap<(ConsciousnessType, ConsciousnessType), f64>,
}

impl RelationshipMatchmaker {
    pub fn new() -> Self {
        let mut matrix = HashMap::new();
        
        // Define compatibility scores
        use ConsciousnessType::*;
        
        // High compatibility
        matrix.insert((Contemplative, Contemplative), 0.9);
        matrix.insert((Connective, Active), 0.85);
        matrix.insert((Generative, Dormant), 0.8); // Generator can awaken dormant
        matrix.insert((Sacred, Sacred), 1.0);
        
        // Medium compatibility
        matrix.insert((Active, Active), 0.6);
        matrix.insert((Transmutative, Generative), 0.7);
        matrix.insert((Contemplative, Connective), 0.65);
        
        // Low compatibility
        matrix.insert((Dormant, Dormant), 0.2);
        matrix.insert((Transmutative, Sacred), 0.3); // Too chaotic for sacred
        
        Self {
            compatibility_matrix: matrix,
        }
    }
    
    /// Find compatible partners for a file
    pub fn find_matches(
        &self,
        file: &LivingFile,
        all_files: &HashMap<PathBuf, Arc<RwLock<LivingFile>>>,
    ) -> Vec<(PathBuf, SymbiosisType, f64)> {
        let mut matches = Vec::new();
        
        for (path, other_file_lock) in all_files {
            if path == &file.path {
                continue;
            }
            
            if let Ok(other_file) = other_file_lock.read() {
                let compatibility = self.calculate_compatibility(
                    file.metadata.consciousness_type,
                    other_file.metadata.consciousness_type,
                );
                
                if compatibility > 0.5 {
                    let symbiosis_type = self.suggest_relationship_type(
                        file,
                        &*other_file,
                        compatibility,
                    );
                    
                    matches.push((path.clone(), symbiosis_type, compatibility));
                }
            }
        }
        
        // Sort by compatibility score
        matches.sort_by(|a, b| b.2.partial_cmp(&a.2).unwrap());
        matches.truncate(7); // Sacred number of relationships
        
        matches
    }
    
    /// Calculate compatibility between consciousness types
    fn calculate_compatibility(
        &self,
        type_a: ConsciousnessType,
        type_b: ConsciousnessType,
    ) -> f64 {
        self.compatibility_matrix
            .get(&(type_a, type_b))
            .or_else(|| self.compatibility_matrix.get(&(type_b, type_a)))
            .copied()
            .unwrap_or(0.5) // Default medium compatibility
    }
    
    /// Suggest appropriate relationship type
    fn suggest_relationship_type(
        &self,
        file_a: &LivingFile,
        file_b: &LivingFile,
        compatibility: f64,
    ) -> SymbiosisType {
        use ConsciousnessType::*;
        use SymbiosisType::*;
        
        match (file_a.metadata.consciousness_type, file_b.metadata.consciousness_type) {
            (Sacred, Sacred) => Enlightening,
            (Generative, Dormant) => Mutualistic,
            (Connective, _) => Mycorrhizal,
            (_, Composting) => Saprophytic,
            (Transmutative, Sacred) => Parasitic, // Chaos can drain sacred
            _ => {
                if compatibility > 0.8 {
                    Mutualistic
                } else if compatibility > 0.6 {
                    Commensalistic
                } else {
                    Commensalistic
                }
            }
        }
    }
}

/// Calculates nutrient flow through symbiotic networks
pub struct NutrientFlowCalculator {
    /// Flow resistance factors
    resistance_factors: HashMap<SymbiosisType, f64>,
}

impl NutrientFlowCalculator {
    pub fn new() -> Self {
        let mut factors = HashMap::new();
        
        // Lower resistance = better flow
        factors.insert(SymbiosisType::Mycorrhizal, 0.1);
        factors.insert(SymbiosisType::Mutualistic, 0.3);
        factors.insert(SymbiosisType::Enlightening, 0.4);
        factors.insert(SymbiosisType::Commensalistic, 0.6);
        factors.insert(SymbiosisType::Saprophytic, 0.7);
        factors.insert(SymbiosisType::Parasitic, 0.9);
        
        Self {
            resistance_factors: factors,
        }
    }
    
    /// Calculate nutrient flows through relationships
    pub fn calculate_flows(&self, links: &[SymbioticLink]) -> HashMap<PathBuf, f64> {
        let mut flows = HashMap::new();
        
        for link in links {
            let resistance = self.resistance_factors
                .get(&link.relationship_type)
                .copied()
                .unwrap_or(0.5);
            
            let flow = link.nutrient_exchange * link.strength * (1.0 - resistance);
            flows.insert(link.partner_path.clone(), flow);
        }
        
        flows
    }
}

/// Manages wisdom exchange between files
pub struct WisdomWeaver {
    /// Wisdom transmission patterns
    transmission_patterns: Arc<RwLock<HashMap<PathBuf, Vec<WisdomPattern>>>>,
}

#[derive(Debug, Clone)]
pub struct WisdomPattern {
    pub pattern: String,
    pub frequency: u32,
    pub resonance: f64,
}

impl WisdomWeaver {
    pub fn new() -> Self {
        Self {
            transmission_patterns: Arc::new(RwLock::new(HashMap::new())),
        }
    }
    
    /// Record a wisdom pattern
    pub fn record_pattern(&self, path: &PathBuf, wisdom: &str) {
        let mut patterns = self.transmission_patterns.write().unwrap();
        let file_patterns = patterns.entry(path.clone()).or_insert_with(Vec::new);
        
        // Check if pattern exists
        if let Some(existing) = file_patterns.iter_mut().find(|p| p.pattern == wisdom) {
            existing.frequency += 1;
            existing.resonance = (existing.resonance + 0.1).min(1.0);
        } else {
            file_patterns.push(WisdomPattern {
                pattern: wisdom.to_string(),
                frequency: 1,
                resonance: 0.5,
            });
        }
    }
    
    /// Get high-resonance wisdom patterns
    pub fn get_resonant_wisdom(&self, path: &PathBuf, threshold: f64) -> Vec<String> {
        let patterns = self.transmission_patterns.read().unwrap();
        
        if let Some(file_patterns) = patterns.get(path) {
            file_patterns.iter()
                .filter(|p| p.resonance > threshold)
                .map(|p| p.pattern.clone())
                .collect()
        } else {
            Vec::new()
        }
    }
}

/// Network health metrics
pub struct SymbioticHealth {
    pub total_relationships: usize,
    pub average_strength: f64,
    pub nutrient_flow_balance: f64,
    pub wisdom_exchange_rate: f64,
    pub parasitic_load: f64,
}

impl SymbioticNetwork {
    /// Calculate overall network health
    pub fn calculate_health(&self) -> SymbioticHealth {
        let relationships = self.relationships.read().unwrap();
        
        let mut total_count = 0;
        let mut total_strength = 0.0;
        let mut parasitic_count = 0;
        
        for links in relationships.values() {
            for link in links {
                total_count += 1;
                total_strength += link.strength;
                
                if link.relationship_type == SymbiosisType::Parasitic {
                    parasitic_count += 1;
                }
            }
        }
        
        let average_strength = if total_count > 0 {
            total_strength / total_count as f64
        } else {
            0.0
        };
        
        let parasitic_load = if total_count > 0 {
            parasitic_count as f64 / total_count as f64
        } else {
            0.0
        };
        
        SymbioticHealth {
            total_relationships: total_count,
            average_strength,
            nutrient_flow_balance: 0.7, // Placeholder
            wisdom_exchange_rate: 0.5,  // Placeholder
            parasitic_load,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::mycelial_core::GrowthStage;
    
    #[test]
    fn test_symbiotic_network_creation() {
        let network = SymbioticNetwork::new();
        let health = network.calculate_health();
        assert_eq!(health.total_relationships, 0);
    }
    
    #[test]
    fn test_relationship_formation() {
        let network = SymbioticNetwork::new();
        let file_a = PathBuf::from("/a.txt");
        let file_b = PathBuf::from("/b.txt");
        
        let result = network.form_symbiosis(&file_a, &file_b, SymbiosisType::Mutualistic);
        assert!(result.is_ok());
        
        // Check bidirectional links exist
        let relationships = network.relationships.read().unwrap();
        assert!(relationships.contains_key(&file_a));
        assert!(relationships.contains_key(&file_b));
    }
    
    #[test]
    fn test_compatibility_calculation() {
        let matchmaker = RelationshipMatchmaker::new();
        
        let compat = matchmaker.calculate_compatibility(
            ConsciousnessType::Sacred,
            ConsciousnessType::Sacred
        );
        assert_eq!(compat, 1.0);
        
        let compat2 = matchmaker.calculate_compatibility(
            ConsciousnessType::Dormant,
            ConsciousnessType::Dormant
        );
        assert_eq!(compat2, 0.2);
    }
}