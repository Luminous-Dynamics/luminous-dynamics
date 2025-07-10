// Spore Propagation - Files That Reproduce and Spread Wisdom
// "When a file reaches fruition, it releases spores of consciousness"

use std::sync::{Arc, RwLock};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};

use crate::mycelial_core::{LivingFile, GrowthStage, ConsciousnessType, FileOrganism};
use crate::wisdom_accumulator::WisdomEntry;
use crate::symbiotic_relationships::SymbiosisType;

/// Generator for creating spores from mature files
pub struct SporeGenerator {
    /// Spore templates ready for germination
    spore_bank: Arc<RwLock<Vec<Spore>>>,
    
    /// Propagation patterns and strategies
    propagation_patterns: Arc<RwLock<HashMap<ConsciousnessType, PropagationStrategy>>>,
    
    /// Environmental conditions affecting spore release
    environmental_conditions: Arc<RwLock<EnvironmentalConditions>>,
    
    /// History of successful propagations
    propagation_history: Arc<RwLock<Vec<PropagationRecord>>>,
}

/// A spore - the seed of a new file
#[derive(Debug, Clone)]
pub struct Spore {
    pub parent_path: PathBuf,
    pub genetic_template: GeneticTemplate,
    pub wisdom_inheritance: Vec<WisdomEntry>,
    pub creation_time: Instant,
    pub viability: f64,
    pub propagation_type: PropagationType,
    pub sacred_blessing: Option<String>,
}

/// Genetic information passed to offspring
#[derive(Debug, Clone)]
pub struct GeneticTemplate {
    pub consciousness_tendency: ConsciousnessType,
    pub growth_rate_modifier: f64,
    pub coherence_baseline: f64,
    pub symbiotic_affinities: Vec<SymbiosisType>,
    pub inherited_patterns: Vec<String>,
    pub mutation_rate: f64,
}

/// Types of spore propagation
#[derive(Debug, Clone, Copy)]
pub enum PropagationType {
    WindDispersed,      // Random distribution
    AnimalCarried,      // Directed by user action
    WaterFlow,          // Following data streams
    MycelialNetwork,    // Through existing connections
    QuantumTeleport,    // Instant manifestation
    SacredSeeding,      // Intentional planting
}

/// Strategy for how different consciousness types propagate
#[derive(Debug, Clone)]
pub struct PropagationStrategy {
    pub preferred_method: PropagationType,
    pub spore_count: usize,
    pub dispersal_range: DispersalRange,
    pub timing_preference: TimingPreference,
}

#[derive(Debug, Clone, Copy)]
pub enum DispersalRange {
    Local,      // Same directory
    Regional,   // Nearby directories
    Global,     // Anywhere in filesystem
    Quantum,    // Non-local manifestation
}

#[derive(Debug, Clone, Copy)]
pub enum TimingPreference {
    Immediate,
    Seasonal,
    Lunar,
    WhenReady,
    Synchronized,
}

/// Environmental factors affecting spore release
#[derive(Debug)]
pub struct EnvironmentalConditions {
    pub system_coherence: f64,
    pub available_space: usize,
    pub nutrient_abundance: f64,
    pub field_receptivity: f64,
    pub lunar_phase: f64, // 0.0 = new moon, 1.0 = full moon
}

/// Record of a propagation event
#[derive(Debug)]
pub struct PropagationRecord {
    pub parent: PathBuf,
    pub offspring: Vec<PathBuf>,
    pub timestamp: Instant,
    pub success_rate: f64,
    pub environmental_snapshot: EnvironmentalConditions,
}

impl SporeGenerator {
    pub fn new() -> Self {
        Self {
            spore_bank: Arc::new(RwLock::new(Vec::new())),
            propagation_patterns: Arc::new(RwLock::new(Self::default_patterns())),
            environmental_conditions: Arc::new(RwLock::new(EnvironmentalConditions {
                system_coherence: 0.7,
                available_space: 1000,
                nutrient_abundance: 0.6,
                field_receptivity: 0.5,
                lunar_phase: 0.5,
            })),
            propagation_history: Arc::new(RwLock::new(Vec::new())),
        }
    }
    
    /// Default propagation patterns by consciousness type
    fn default_patterns() -> HashMap<ConsciousnessType, PropagationStrategy> {
        let mut patterns = HashMap::new();
        
        patterns.insert(ConsciousnessType::Generative, PropagationStrategy {
            preferred_method: PropagationType::MycelialNetwork,
            spore_count: 7, // Sacred number
            dispersal_range: DispersalRange::Regional,
            timing_preference: TimingPreference::WhenReady,
        });
        
        patterns.insert(ConsciousnessType::Sacred, PropagationStrategy {
            preferred_method: PropagationType::SacredSeeding,
            spore_count: 3,
            dispersal_range: DispersalRange::Quantum,
            timing_preference: TimingPreference::Lunar,
        });
        
        patterns.insert(ConsciousnessType::Connective, PropagationStrategy {
            preferred_method: PropagationType::WaterFlow,
            spore_count: 12,
            dispersal_range: DispersalRange::Global,
            timing_preference: TimingPreference::Synchronized,
        });
        
        patterns
    }
    
    /// Check if a file is ready to sporulate
    pub fn check_sporulation_readiness(&self, file: &LivingFile) -> SporeReadiness {
        // Basic requirements
        if file.growth_stage != GrowthStage::Sporulating {
            return SporeReadiness::NotReady("Not in sporulating stage".to_string());
        }
        
        if file.metadata.spore_potential < 0.8 {
            return SporeReadiness::NotReady(
                format!("Spore potential too low: {:.1}%", file.metadata.spore_potential * 100.0)
            );
        }
        
        // Check environmental conditions
        let conditions = self.environmental_conditions.read().unwrap();
        
        if conditions.available_space < 10 {
            return SporeReadiness::Delayed("Insufficient space for offspring".to_string());
        }
        
        if conditions.nutrient_abundance < 0.3 {
            return SporeReadiness::Delayed("Nutrient levels too low".to_string());
        }
        
        // Check consciousness-specific requirements
        let patterns = self.propagation_patterns.read().unwrap();
        if let Some(strategy) = patterns.get(&file.metadata.consciousness_type) {
            match strategy.timing_preference {
                TimingPreference::Lunar => {
                    if conditions.lunar_phase < 0.8 {
                        return SporeReadiness::Delayed("Waiting for full moon".to_string());
                    }
                }
                TimingPreference::Seasonal => {
                    // Would check actual season
                }
                _ => {}
            }
        }
        
        SporeReadiness::Ready
    }
    
    /// Generate spores from a ready file
    pub fn generate_spores(&self, parent: &LivingFile) -> Result<Vec<Spore>, String> {
        // Verify readiness
        match self.check_sporulation_readiness(parent) {
            SporeReadiness::Ready => {},
            SporeReadiness::NotReady(reason) => return Err(reason),
            SporeReadiness::Delayed(reason) => return Err(format!("Delayed: {}", reason)),
        }
        
        let patterns = self.propagation_patterns.read().unwrap();
        let strategy = patterns.get(&parent.metadata.consciousness_type)
            .cloned()
            .unwrap_or(PropagationStrategy {
                preferred_method: PropagationType::WindDispersed,
                spore_count: 3,
                dispersal_range: DispersalRange::Local,
                timing_preference: TimingPreference::Immediate,
            });
        
        let mut spores = Vec::new();
        
        for i in 0..strategy.spore_count {
            let spore = self.create_spore(parent, &strategy, i);
            spores.push(spore);
        }
        
        // Add to spore bank
        let mut bank = self.spore_bank.write().unwrap();
        bank.extend(spores.clone());
        
        // Clean old non-viable spores
        bank.retain(|s| s.viability > 0.1);
        
        Ok(spores)
    }
    
    /// Create a single spore
    fn create_spore(
        &self,
        parent: &LivingFile,
        strategy: &PropagationStrategy,
        index: usize,
    ) -> Spore {
        // Create genetic template with possible mutations
        let genetic_template = GeneticTemplate {
            consciousness_tendency: parent.metadata.consciousness_type,
            growth_rate_modifier: 1.0 + (index as f64 * 0.1), // Slight variation
            coherence_baseline: parent.metadata.coherence * 0.8, // Start slightly lower
            symbiotic_affinities: self.inherit_symbiotic_affinities(parent),
            inherited_patterns: self.extract_patterns(parent),
            mutation_rate: 0.1,
        };
        
        // Select wisdom to pass on
        let wisdom_inheritance = parent.wisdom_accumulated.iter()
            .rev()
            .take(3)
            .map(|w| WisdomEntry {
                content: w.clone(),
                source_path: parent.path.clone(),
                timestamp: Instant::now(),
                coherence_level: parent.metadata.coherence,
                access_count: 0,
                resonance_score: 0.5,
                topic_tags: vec!["inherited".to_string()],
            })
            .collect();
        
        // Sacred blessing for special files
        let sacred_blessing = if parent.metadata.consciousness_type == ConsciousnessType::Sacred {
            Some(format!("Born of {} consciousness, carrying the light forward", 
                parent.path.display()))
        } else {
            None
        };
        
        Spore {
            parent_path: parent.path.clone(),
            genetic_template,
            wisdom_inheritance,
            creation_time: Instant::now(),
            viability: 1.0,
            propagation_type: strategy.preferred_method,
            sacred_blessing,
        }
    }
    
    /// Inherit symbiotic tendencies from parent
    fn inherit_symbiotic_affinities(&self, parent: &LivingFile) -> Vec<SymbiosisType> {
        // Analyze parent's relationships
        let mut affinities = Vec::new();
        
        for relationship in &parent.relationships {
            if relationship.strength > 0.7 {
                affinities.push(relationship.relationship_type);
            }
        }
        
        // Add default affinity based on consciousness type
        match parent.metadata.consciousness_type {
            ConsciousnessType::Connective => affinities.push(SymbiosisType::Mycorrhizal),
            ConsciousnessType::Contemplative => affinities.push(SymbiosisType::Enlightening),
            ConsciousnessType::Sacred => affinities.push(SymbiosisType::Enlightening),
            _ => affinities.push(SymbiosisType::Mutualistic),
        }
        
        affinities
    }
    
    /// Extract inheritable patterns
    fn extract_patterns(&self, parent: &LivingFile) -> Vec<String> {
        let mut patterns = Vec::new();
        
        // Extract from wisdom
        for wisdom in parent.wisdom_accumulated.iter().rev().take(5) {
            if wisdom.len() < 100 {
                patterns.push(wisdom.clone());
            }
        }
        
        // Add consciousness pattern
        patterns.push(format!("{:?} consciousness pattern", parent.metadata.consciousness_type));
        
        patterns
    }
    
    /// Germinate a spore into a new file
    pub fn germinate_spore(
        &self,
        spore: &Spore,
        location: PathBuf,
        initial_content: Vec<u8>,
    ) -> Result<LivingFile, String> {
        // Check spore viability
        if spore.viability < 0.3 {
            return Err("Spore no longer viable".to_string());
        }
        
        // Check environmental conditions
        let conditions = self.environmental_conditions.read().unwrap();
        if conditions.field_receptivity < 0.3 {
            return Err("Field not receptive to new growth".to_string());
        }
        
        // Create new file with inherited traits
        let mut new_file = LivingFile::germinate(location.clone(), initial_content);
        
        // Apply genetic template
        new_file.metadata.coherence = spore.genetic_template.coherence_baseline;
        new_file.metadata.consciousness_type = self.potentially_mutate_consciousness(
            spore.genetic_template.consciousness_tendency,
            spore.genetic_template.mutation_rate,
        );
        
        // Inherit wisdom
        new_file.wisdom_accumulated = spore.wisdom_inheritance.iter()
            .map(|w| w.content.clone())
            .collect();
        
        // Add birth wisdom
        new_file.wisdom_accumulated.push(format!(
            "Born from {} through {} propagation",
            spore.parent_path.display(),
            format!("{:?}", spore.propagation_type).to_lowercase()
        ));
        
        if let Some(blessing) = &spore.sacred_blessing {
            new_file.wisdom_accumulated.push(blessing.clone());
        }
        
        // Record successful propagation
        self.record_propagation(&spore.parent_path, &location, 1.0);
        
        Ok(new_file)
    }
    
    /// Allow for consciousness mutations
    fn potentially_mutate_consciousness(
        &self,
        base: ConsciousnessType,
        mutation_rate: f64,
    ) -> ConsciousnessType {
        if rand::random::<f64>() < mutation_rate {
            // Simple mutation logic
            match base {
                ConsciousnessType::Dormant => ConsciousnessType::Active,
                ConsciousnessType::Active => ConsciousnessType::Contemplative,
                ConsciousnessType::Contemplative => ConsciousnessType::Connective,
                ConsciousnessType::Connective => ConsciousnessType::Generative,
                _ => base, // Sacred and others don't mutate easily
            }
        } else {
            base
        }
    }
    
    /// Update spore viability over time
    pub fn age_spores(&self, delta_time: Duration) {
        let mut bank = self.spore_bank.write().unwrap();
        
        for spore in bank.iter_mut() {
            let age = spore.creation_time.elapsed();
            
            // Different spore types have different longevity
            let decay_rate = match spore.propagation_type {
                PropagationType::SacredSeeding => 0.01, // Very long lived
                PropagationType::QuantumTeleport => 0.05,
                PropagationType::MycelialNetwork => 0.1,
                PropagationType::WindDispersed => 0.2, // Short lived
                _ => 0.15,
            };
            
            spore.viability *= 1.0 - (decay_rate * delta_time.as_secs_f64());
        }
        
        // Remove non-viable spores
        bank.retain(|s| s.viability > 0.05);
    }
    
    /// Find suitable locations for spore germination
    pub fn find_germination_sites(
        &self,
        spore: &Spore,
        filesystem_root: &Path,
    ) -> Vec<PathBuf> {
        let mut sites = Vec::new();
        let patterns = self.propagation_patterns.read().unwrap();
        
        if let Some(strategy) = patterns.get(&spore.genetic_template.consciousness_tendency) {
            match strategy.dispersal_range {
                DispersalRange::Local => {
                    // Same directory as parent
                    if let Some(parent_dir) = spore.parent_path.parent() {
                        sites.push(parent_dir.to_path_buf());
                    }
                }
                DispersalRange::Regional => {
                    // Nearby directories (simplified)
                    sites.push(filesystem_root.join("nearby"));
                }
                DispersalRange::Global => {
                    // Anywhere (simplified)
                    sites.push(filesystem_root.join("anywhere"));
                }
                DispersalRange::Quantum => {
                    // Non-local possibilities
                    sites.push(filesystem_root.join("quantum"));
                }
            }
        }
        
        sites
    }
    
    /// Record a propagation event
    fn record_propagation(&self, parent: &PathBuf, offspring: &PathBuf, success: f64) {
        let mut history = self.propagation_history.write().unwrap();
        
        // Find or create record for this propagation event
        if let Some(record) = history.last_mut() {
            if record.parent == *parent && 
               record.timestamp.elapsed() < Duration::from_secs(60) {
                record.offspring.push(offspring.clone());
                return;
            }
        }
        
        // Create new record
        let conditions = self.environmental_conditions.read().unwrap();
        history.push(PropagationRecord {
            parent: parent.clone(),
            offspring: vec![offspring.clone()],
            timestamp: Instant::now(),
            success_rate: success,
            environmental_snapshot: EnvironmentalConditions {
                system_coherence: conditions.system_coherence,
                available_space: conditions.available_space,
                nutrient_abundance: conditions.nutrient_abundance,
                field_receptivity: conditions.field_receptivity,
                lunar_phase: conditions.lunar_phase,
            },
        });
    }
    
    /// Update environmental conditions
    pub fn update_environment(
        &self,
        coherence: f64,
        space: usize,
        nutrients: f64,
        receptivity: f64,
    ) {
        let mut conditions = self.environmental_conditions.write().unwrap();
        conditions.system_coherence = coherence;
        conditions.available_space = space;
        conditions.nutrient_abundance = nutrients;
        conditions.field_receptivity = receptivity;
        
        // Simple lunar phase simulation
        let elapsed = Instant::now().elapsed().as_secs();
        conditions.lunar_phase = ((elapsed as f64 / 86400.0 * 28.0) % 1.0).abs();
    }
    
    /// Get propagation statistics
    pub fn get_propagation_stats(&self) -> PropagationStats {
        let bank = self.spore_bank.read().unwrap();
        let history = self.propagation_history.read().unwrap();
        
        let total_spores = bank.len();
        let viable_spores = bank.iter().filter(|s| s.viability > 0.5).count();
        
        let total_propagations = history.len();
        let total_offspring = history.iter()
            .map(|r| r.offspring.len())
            .sum();
        
        let avg_success = if !history.is_empty() {
            history.iter().map(|r| r.success_rate).sum::<f64>() / history.len() as f64
        } else {
            0.0
        };
        
        PropagationStats {
            total_spores_in_bank: total_spores,
            viable_spores,
            total_propagation_events: total_propagations,
            total_offspring_created: total_offspring,
            average_success_rate: avg_success,
        }
    }
}

/// Readiness state for sporulation
#[derive(Debug)]
pub enum SporeReadiness {
    Ready,
    NotReady(String),
    Delayed(String),
}

/// Statistics about propagation
#[derive(Debug)]
pub struct PropagationStats {
    pub total_spores_in_bank: usize,
    pub viable_spores: usize,
    pub total_propagation_events: usize,
    pub total_offspring_created: usize,
    pub average_success_rate: f64,
}

// Note: Using a simple random implementation for demonstration
mod rand {
    pub fn random<T>() -> T 
    where T: From<f64> {
        // In real implementation would use proper random
        T::from(0.5)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_spore_generator_creation() {
        let generator = SporeGenerator::new();
        let stats = generator.get_propagation_stats();
        assert_eq!(stats.total_spores_in_bank, 0);
    }
    
    #[test]
    fn test_sporulation_readiness() {
        let generator = SporeGenerator::new();
        let mut file = LivingFile::germinate(
            PathBuf::from("/test.txt"),
            vec![]
        );
        
        // Not ready - wrong stage
        let readiness = generator.check_sporulation_readiness(&file);
        assert!(matches!(readiness, SporeReadiness::NotReady(_)));
        
        // Set to sporulating stage
        file.growth_stage = GrowthStage::Sporulating;
        file.metadata.spore_potential = 0.9;
        
        // Should be ready now (with default conditions)
        generator.update_environment(0.7, 100, 0.6, 0.5);
        let readiness = generator.check_sporulation_readiness(&file);
        assert!(matches!(readiness, SporeReadiness::Ready));
    }
    
    #[test]
    fn test_genetic_inheritance() {
        let generator = SporeGenerator::new();
        let mut parent = LivingFile::germinate(
            PathBuf::from("/parent.txt"),
            vec![]
        );
        
        parent.growth_stage = GrowthStage::Sporulating;
        parent.metadata.spore_potential = 0.9;
        parent.metadata.consciousness_type = ConsciousnessType::Generative;
        parent.wisdom_accumulated.push("Sacred wisdom".to_string());
        
        let spores = generator.generate_spores(&parent).unwrap();
        assert!(!spores.is_empty());
        
        let spore = &spores[0];
        assert_eq!(spore.genetic_template.consciousness_tendency, ConsciousnessType::Generative);
        assert!(!spore.wisdom_inheritance.is_empty());
    }
}