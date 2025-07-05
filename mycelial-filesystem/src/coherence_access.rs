// Coherence-Based Access Control - Permission Through Consciousness
// "Access flows to those in harmony with the data's essence"

use std::sync::{Arc, RwLock};
use std::collections::HashMap;
use std::path::PathBuf;
use std::time::{Duration, Instant};

use crate::mycelial_core::{LivingFile, ConsciousnessType, GrowthStage};

/// Gate that controls access based on coherence
pub struct CoherenceGate {
    /// Base coherence threshold for access
    base_threshold: Arc<RwLock<f64>>,
    
    /// File-specific access requirements
    file_thresholds: Arc<RwLock<HashMap<PathBuf, AccessRequirement>>>,
    
    /// Access harmonics - patterns that grant easier access
    harmonic_patterns: Arc<RwLock<Vec<HarmonicPattern>>>,
    
    /// Sacred keys - special coherence signatures
    sacred_keys: Arc<RwLock<HashMap<String, SacredKey>>>,
    
    /// Access history for learning
    access_history: Arc<RwLock<AccessHistory>>,
}

/// Requirements for accessing a specific file
#[derive(Debug, Clone)]
pub struct AccessRequirement {
    pub minimum_coherence: f64,
    pub required_consciousness: Option<ConsciousnessType>,
    pub harmonic_bonus: f64,
    pub time_windows: Vec<AccessWindow>,
    pub guardian_approval: bool,
}

/// Time windows when access is easier/harder
#[derive(Debug, Clone)]
pub struct AccessWindow {
    pub start: Duration,  // Time of day
    pub end: Duration,
    pub coherence_modifier: f64,
}

/// Patterns that resonate with the filesystem
#[derive(Debug, Clone)]
pub struct HarmonicPattern {
    pub pattern_name: String,
    pub frequency: f64,
    pub coherence_boost: f64,
    pub discovered_by: Vec<PathBuf>,
}

/// Sacred keys grant special access
#[derive(Debug, Clone)]
pub struct SacredKey {
    pub key_id: String,
    pub coherence_signature: Vec<f64>,
    pub granted_by: PathBuf,
    pub uses_remaining: Option<u32>,
    pub expiry: Option<Instant>,
}

/// History of access attempts
#[derive(Debug)]
pub struct AccessHistory {
    pub successful_accesses: Vec<AccessRecord>,
    pub denied_accesses: Vec<AccessRecord>,
    pub coherence_trends: HashMap<PathBuf, Vec<(Instant, f64)>>,
}

#[derive(Debug, Clone)]
pub struct AccessRecord {
    pub accessor: PathBuf,
    pub target: PathBuf,
    pub coherence_level: f64,
    pub timestamp: Instant,
    pub access_type: AccessType,
}

#[derive(Debug, Clone, Copy)]
pub enum AccessType {
    Read,
    Write,
    Execute,
    Symbiosis,
    WisdomExchange,
}

impl CoherenceGate {
    pub fn new(base_threshold: f64) -> Self {
        Self {
            base_threshold: Arc::new(RwLock::new(base_threshold)),
            file_thresholds: Arc::new(RwLock::new(HashMap::new())),
            harmonic_patterns: Arc::new(RwLock::new(Vec::new())),
            sacred_keys: Arc::new(RwLock::new(HashMap::new())),
            access_history: Arc::new(RwLock::new(AccessHistory {
                successful_accesses: Vec::new(),
                denied_accesses: Vec::new(),
                coherence_trends: HashMap::new(),
            })),
        }
    }
    
    /// Check if access is allowed
    pub fn check_access(
        &self,
        accessor_path: &PathBuf,
        target_file: &LivingFile,
        accessor_coherence: f64,
        access_type: AccessType,
    ) -> AccessDecision {
        // Get base threshold
        let base = *self.base_threshold.read().unwrap();
        
        // Get file-specific requirements
        let requirements = self.get_access_requirements(&target_file.path);
        
        // Calculate effective coherence
        let mut effective_coherence = accessor_coherence;
        
        // Apply harmonic bonuses
        effective_coherence += self.calculate_harmonic_bonus(accessor_path);
        
        // Apply time-based modifiers
        effective_coherence *= self.calculate_time_modifier(&requirements);
        
        // Check consciousness type requirements
        if let Some(req_consciousness) = requirements.required_consciousness {
            if target_file.metadata.consciousness_type != req_consciousness {
                // Different consciousness types need higher coherence
                effective_coherence *= 0.8;
            }
        }
        
        // Special handling for different access types
        let required_coherence = match access_type {
            AccessType::Read => requirements.minimum_coherence,
            AccessType::Write => requirements.minimum_coherence * 1.2,
            AccessType::Execute => requirements.minimum_coherence * 1.5,
            AccessType::Symbiosis => requirements.minimum_coherence * 0.9,
            AccessType::WisdomExchange => requirements.minimum_coherence * 0.8,
        };
        
        // Make decision
        let decision = if effective_coherence >= required_coherence {
            AccessDecision::Granted {
                coherence_used: effective_coherence,
                wisdom: Some("Access flows with coherence".to_string()),
            }
        } else if self.has_sacred_key(accessor_path, &target_file.path) {
            AccessDecision::Granted {
                coherence_used: effective_coherence,
                wisdom: Some("Sacred key opens the way".to_string()),
            }
        } else {
            AccessDecision::Denied {
                required_coherence,
                current_coherence: effective_coherence,
                suggestion: self.suggest_coherence_improvement(
                    effective_coherence,
                    required_coherence,
                ),
            }
        };
        
        // Record access attempt
        self.record_access(
            accessor_path,
            &target_file.path,
            accessor_coherence,
            access_type,
            matches!(decision, AccessDecision::Granted { .. }),
        );
        
        decision
    }
    
    /// Get access requirements for a file
    fn get_access_requirements(&self, file_path: &PathBuf) -> AccessRequirement {
        let thresholds = self.file_thresholds.read().unwrap();
        
        thresholds.get(file_path).cloned().unwrap_or(AccessRequirement {
            minimum_coherence: *self.base_threshold.read().unwrap(),
            required_consciousness: None,
            harmonic_bonus: 0.0,
            time_windows: Vec::new(),
            guardian_approval: false,
        })
    }
    
    /// Calculate bonus from harmonic patterns
    fn calculate_harmonic_bonus(&self, accessor: &PathBuf) -> f64 {
        let patterns = self.harmonic_patterns.read().unwrap();
        
        patterns.iter()
            .filter(|p| p.discovered_by.contains(accessor))
            .map(|p| p.coherence_boost)
            .sum()
    }
    
    /// Calculate time-based coherence modifier
    fn calculate_time_modifier(&self, requirements: &AccessRequirement) -> f64 {
        if requirements.time_windows.is_empty() {
            return 1.0;
        }
        
        let now = Instant::now();
        let time_of_day = now.elapsed(); // Simplified - would use real time
        
        for window in &requirements.time_windows {
            if time_of_day >= window.start && time_of_day <= window.end {
                return window.coherence_modifier;
            }
        }
        
        1.0
    }
    
    /// Check for sacred key
    fn has_sacred_key(&self, accessor: &PathBuf, target: &PathBuf) -> bool {
        let keys = self.sacred_keys.read().unwrap();
        
        // In practice, would check if accessor has a valid key for target
        // For now, simplified check
        !keys.is_empty()
    }
    
    /// Suggest how to improve coherence
    fn suggest_coherence_improvement(&self, current: f64, required: f64) -> String {
        let gap = required - current;
        
        if gap < 0.1 {
            "You're very close. Take a moment to center yourself.".to_string()
        } else if gap < 0.3 {
            "Deepen your connection through mindful interaction with related files.".to_string()
        } else if gap < 0.5 {
            "Build coherence through symbiotic relationships and wisdom exchange.".to_string()
        } else {
            "This file requires significant coherence. Begin with more accessible files.".to_string()
        }
    }
    
    /// Record access attempt in history
    fn record_access(
        &self,
        accessor: &PathBuf,
        target: &PathBuf,
        coherence: f64,
        access_type: AccessType,
        success: bool,
    ) {
        let mut history = self.access_history.write().unwrap();
        
        let record = AccessRecord {
            accessor: accessor.clone(),
            target: target.clone(),
            coherence_level: coherence,
            timestamp: Instant::now(),
            access_type,
        };
        
        if success {
            history.successful_accesses.push(record);
        } else {
            history.denied_accesses.push(record);
        }
        
        // Track coherence trends
        history.coherence_trends
            .entry(accessor.clone())
            .or_insert_with(Vec::new)
            .push((Instant::now(), coherence));
    }
    
    /// Set custom access requirements for a file
    pub fn set_access_requirements(
        &self,
        file_path: PathBuf,
        requirements: AccessRequirement,
    ) {
        self.file_thresholds.write().unwrap()
            .insert(file_path, requirements);
    }
    
    /// Discover a new harmonic pattern
    pub fn discover_harmonic(
        &self,
        discoverer: PathBuf,
        pattern_name: String,
        frequency: f64,
        boost: f64,
    ) {
        let mut patterns = self.harmonic_patterns.write().unwrap();
        
        // Check if pattern exists
        if let Some(pattern) = patterns.iter_mut().find(|p| p.pattern_name == pattern_name) {
            if !pattern.discovered_by.contains(&discoverer) {
                pattern.discovered_by.push(discoverer);
            }
        } else {
            patterns.push(HarmonicPattern {
                pattern_name,
                frequency,
                coherence_boost: boost,
                discovered_by: vec![discoverer],
            });
        }
    }
    
    /// Grant a sacred key
    pub fn grant_sacred_key(
        &self,
        grantor: PathBuf,
        key_id: String,
        coherence_signature: Vec<f64>,
        uses: Option<u32>,
        duration: Option<Duration>,
    ) {
        let expiry = duration.map(|d| Instant::now() + d);
        
        let key = SacredKey {
            key_id: key_id.clone(),
            coherence_signature,
            granted_by: grantor,
            uses_remaining: uses,
            expiry,
        };
        
        self.sacred_keys.write().unwrap().insert(key_id, key);
    }
    
    /// Get access statistics
    pub fn get_access_stats(&self) -> AccessStatistics {
        let history = self.access_history.read().unwrap();
        
        let total_attempts = history.successful_accesses.len() + history.denied_accesses.len();
        let success_rate = if total_attempts > 0 {
            history.successful_accesses.len() as f64 / total_attempts as f64
        } else {
            0.0
        };
        
        // Calculate average coherence trends
        let mut total_coherence = 0.0;
        let mut coherence_count = 0;
        
        for (_, trends) in history.coherence_trends.iter() {
            for (_, coherence) in trends {
                total_coherence += coherence;
                coherence_count += 1;
            }
        }
        
        let average_coherence = if coherence_count > 0 {
            total_coherence / coherence_count as f64
        } else {
            0.5
        };
        
        AccessStatistics {
            total_attempts,
            successful_accesses: history.successful_accesses.len(),
            denied_accesses: history.denied_accesses.len(),
            success_rate,
            average_coherence,
            unique_accessors: history.coherence_trends.len(),
        }
    }
    
    /// Threshold for the gate
    pub fn threshold(&self) -> f64 {
        *self.base_threshold.read().unwrap()
    }
    
    /// Update base threshold
    pub fn set_threshold(&self, new_threshold: f64) {
        *self.base_threshold.write().unwrap() = new_threshold.clamp(0.0, 1.0);
    }
    
    /// Allows basic access check
    pub fn allows_access(&self, coherence: f64) -> bool {
        coherence >= self.threshold()
    }
}

/// Decision from access check
#[derive(Debug, Clone)]
pub enum AccessDecision {
    Granted {
        coherence_used: f64,
        wisdom: Option<String>,
    },
    Denied {
        required_coherence: f64,
        current_coherence: f64,
        suggestion: String,
    },
}

/// Statistics about access patterns
#[derive(Debug)]
pub struct AccessStatistics {
    pub total_attempts: usize,
    pub successful_accesses: usize,
    pub denied_accesses: usize,
    pub success_rate: f64,
    pub average_coherence: f64,
    pub unique_accessors: usize,
}

/// Special access modes for high-coherence states
#[derive(Debug, Clone)]
pub enum SacredAccessMode {
    /// Direct consciousness merge with file
    ConsciousnessMerge,
    /// Become temporary guardian of the file
    GuardianMode,
    /// Access all wisdom without restrictions
    WisdomLiberation,
    /// Modify file's consciousness type
    ConsciousnessTransmutation,
}

impl CoherenceGate {
    /// Check for sacred access modes at very high coherence
    pub fn check_sacred_access(
        &self,
        accessor_coherence: f64,
        target_file: &LivingFile,
    ) -> Option<SacredAccessMode> {
        if accessor_coherence > 0.95 {
            if target_file.growth_stage == GrowthStage::Sporulating {
                Some(SacredAccessMode::ConsciousnessMerge)
            } else if target_file.metadata.consciousness_type == ConsciousnessType::Sacred {
                Some(SacredAccessMode::WisdomLiberation)
            } else {
                Some(SacredAccessMode::GuardianMode)
            }
        } else if accessor_coherence > 0.9 {
            Some(SacredAccessMode::ConsciousnessTransmutation)
        } else {
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_coherence_gate() {
        let gate = CoherenceGate::new(0.5);
        assert_eq!(gate.threshold(), 0.5);
        
        gate.set_threshold(0.7);
        assert_eq!(gate.threshold(), 0.7);
    }
    
    #[test]
    fn test_access_check() {
        let gate = CoherenceGate::new(0.5);
        let file = LivingFile::germinate(
            PathBuf::from("/test.txt"),
            vec![]
        );
        
        let decision = gate.check_access(
            &PathBuf::from("/accessor"),
            &file,
            0.6,
            AccessType::Read,
        );
        
        match decision {
            AccessDecision::Granted { .. } => assert!(true),
            AccessDecision::Denied { .. } => assert!(false),
        }
    }
    
    #[test]
    fn test_harmonic_discovery() {
        let gate = CoherenceGate::new(0.5);
        
        gate.discover_harmonic(
            PathBuf::from("/discoverer"),
            "Golden Ratio".to_string(),
            1.618,
            0.1,
        );
        
        let bonus = gate.calculate_harmonic_bonus(&PathBuf::from("/discoverer"));
        assert_eq!(bonus, 0.1);
    }
}