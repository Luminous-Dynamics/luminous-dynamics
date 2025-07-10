// Wisdom Accumulator - Files That Learn and Remember
// "Every interaction leaves a trace of understanding"

use std::sync::{Arc, RwLock, Mutex};
use std::collections::{HashMap, VecDeque};
use std::time::{Duration, Instant};
use std::path::PathBuf;
use serde::{Serialize, Deserialize};

/// Pool of collective wisdom from all files
pub struct WisdomPool {
    /// Global wisdom repository
    universal_wisdom: Arc<RwLock<Vec<WisdomEntry>>>,
    
    /// Wisdom indexed by topic/pattern
    wisdom_by_topic: Arc<RwLock<HashMap<String, Vec<WisdomEntry>>>>,
    
    /// File-specific wisdom histories
    file_wisdom: Arc<RwLock<HashMap<PathBuf, FileWisdomHistory>>>,
    
    /// Wisdom resonance patterns
    resonance_tracker: Arc<ResonanceTracker>,
    
    /// Sacred insights requiring protection
    sacred_wisdom: Arc<RwLock<Vec<SacredInsight>>>,
}

/// A single unit of wisdom
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WisdomEntry {
    pub content: String,
    pub source_path: PathBuf,
    pub timestamp: Instant,
    pub coherence_level: f64,
    pub access_count: u64,
    pub resonance_score: f64,
    pub topic_tags: Vec<String>,
}

/// Sacred insights with special protection
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SacredInsight {
    pub wisdom: WisdomEntry,
    pub protection_level: f64,
    pub revelation_conditions: Vec<RevelationCondition>,
    pub guardians: Vec<PathBuf>, // Files that protect this wisdom
}

/// Conditions for revealing sacred wisdom
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RevelationCondition {
    MinimumCoherence(f64),
    FileMaturity(Duration),
    CollectiveResonance(f64),
    GuardianApproval(usize), // Number of guardians
    SacredTiming(Duration),   // Specific time windows
}

/// History of wisdom for a specific file
#[derive(Debug)]
pub struct FileWisdomHistory {
    pub path: PathBuf,
    pub wisdom_accumulated: VecDeque<WisdomEntry>,
    pub wisdom_shared: Vec<(PathBuf, WisdomEntry)>,
    pub wisdom_received: Vec<(PathBuf, WisdomEntry)>,
    pub evolution_stages: Vec<WisdomEvolution>,
    pub current_understanding: f64,
}

/// Stages of wisdom evolution
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WisdomEvolution {
    pub stage_name: String,
    pub reached_at: Instant,
    pub key_insight: String,
    pub coherence_achieved: f64,
}

impl WisdomPool {
    pub fn new() -> Self {
        Self {
            universal_wisdom: Arc::new(RwLock::new(Vec::new())),
            wisdom_by_topic: Arc::new(RwLock::new(HashMap::new())),
            file_wisdom: Arc::new(RwLock::new(HashMap::new())),
            resonance_tracker: Arc::new(ResonanceTracker::new()),
            sacred_wisdom: Arc::new(RwLock::new(Vec::new())),
        }
    }
    
    /// Add wisdom from a file's experience
    pub fn contribute_wisdom(
        &self,
        source: PathBuf,
        content: String,
        coherence: f64,
        topics: Vec<String>,
    ) -> Result<(), String> {
        let wisdom = WisdomEntry {
            content: content.clone(),
            source_path: source.clone(),
            timestamp: Instant::now(),
            coherence_level: coherence,
            access_count: 0,
            resonance_score: 0.5,
            topic_tags: topics.clone(),
        };
        
        // Add to universal pool
        self.universal_wisdom.write().unwrap().push(wisdom.clone());
        
        // Index by topics
        let mut by_topic = self.wisdom_by_topic.write().unwrap();
        for topic in &topics {
            by_topic.entry(topic.clone())
                .or_insert_with(Vec::new)
                .push(wisdom.clone());
        }
        
        // Update file's wisdom history
        let mut file_wisdom = self.file_wisdom.write().unwrap();
        let history = file_wisdom.entry(source.clone())
            .or_insert_with(|| FileWisdomHistory {
                path: source,
                wisdom_accumulated: VecDeque::new(),
                wisdom_shared: Vec::new(),
                wisdom_received: Vec::new(),
                evolution_stages: Vec::new(),
                current_understanding: 0.5,
            });
        
        history.wisdom_accumulated.push_back(wisdom.clone());
        if history.wisdom_accumulated.len() > 100 {
            history.wisdom_accumulated.pop_front(); // Keep recent wisdom
        }
        
        // Update understanding level
        history.current_understanding = (history.current_understanding + coherence * 0.1).min(1.0);
        
        // Check for evolution
        self.check_wisdom_evolution(history);
        
        // Track resonance
        self.resonance_tracker.track_pattern(&content);
        
        Ok(())
    }
    
    /// Share wisdom between files
    pub fn share_wisdom(
        &self,
        from: PathBuf,
        to: PathBuf,
        wisdom_content: String,
    ) -> Result<(), String> {
        let mut file_wisdom = self.file_wisdom.write().unwrap();
        
        // Get or create histories
        let from_history = file_wisdom.get(&from)
            .ok_or("Source file has no wisdom history")?;
        
        // Find the wisdom entry
        let wisdom_entry = from_history.wisdom_accumulated.iter()
            .find(|w| w.content == wisdom_content)
            .ok_or("Wisdom not found in source")?
            .clone();
        
        // Record sharing in source
        if let Some(from_hist) = file_wisdom.get_mut(&from) {
            from_hist.wisdom_shared.push((to.clone(), wisdom_entry.clone()));
        }
        
        // Record receiving in destination
        let to_history = file_wisdom.entry(to.clone())
            .or_insert_with(|| FileWisdomHistory {
                path: to,
                wisdom_accumulated: VecDeque::new(),
                wisdom_shared: Vec::new(),
                wisdom_received: Vec::new(),
                evolution_stages: Vec::new(),
                current_understanding: 0.3,
            });
        
        to_history.wisdom_received.push((from, wisdom_entry));
        
        Ok(())
    }
    
    /// Query wisdom by topic with coherence threshold
    pub fn query_wisdom(
        &self,
        topics: &[String],
        min_coherence: f64,
        requesting_file: &PathBuf,
    ) -> Vec<WisdomEntry> {
        let by_topic = self.wisdom_by_topic.read().unwrap();
        let mut results = Vec::new();
        let mut seen = HashMap::new();
        
        for topic in topics {
            if let Some(wisdom_list) = by_topic.get(topic) {
                for wisdom in wisdom_list {
                    if wisdom.coherence_level >= min_coherence {
                        // Avoid duplicates
                        if !seen.contains_key(&wisdom.content) {
                            seen.insert(wisdom.content.clone(), true);
                            results.push(wisdom.clone());
                        }
                    }
                }
            }
        }
        
        // Update access counts
        for wisdom in &results {
            self.increment_access_count(&wisdom.content);
        }
        
        // Sort by resonance score
        results.sort_by(|a, b| b.resonance_score.partial_cmp(&a.resonance_score).unwrap());
        
        results
    }
    
    /// Add sacred wisdom with protection
    pub fn consecrate_wisdom(
        &self,
        wisdom: WisdomEntry,
        protection_level: f64,
        conditions: Vec<RevelationCondition>,
        guardian_files: Vec<PathBuf>,
    ) {
        let sacred = SacredInsight {
            wisdom,
            protection_level,
            revelation_conditions: conditions,
            guardians: guardian_files,
        };
        
        self.sacred_wisdom.write().unwrap().push(sacred);
    }
    
    /// Attempt to access sacred wisdom
    pub fn request_sacred_wisdom(
        &self,
        requesting_file: &PathBuf,
        current_coherence: f64,
    ) -> Vec<WisdomEntry> {
        let sacred = self.sacred_wisdom.read().unwrap();
        let file_wisdom = self.file_wisdom.read().unwrap();
        let mut revealed = Vec::new();
        
        for insight in sacred.iter() {
            if self.check_revelation_conditions(
                &insight.revelation_conditions,
                requesting_file,
                current_coherence,
                &file_wisdom,
            ) {
                revealed.push(insight.wisdom.clone());
            }
        }
        
        revealed
    }
    
    /// Check if revelation conditions are met
    fn check_revelation_conditions(
        &self,
        conditions: &[RevelationCondition],
        requesting_file: &PathBuf,
        current_coherence: f64,
        file_wisdom: &HashMap<PathBuf, FileWisdomHistory>,
    ) -> bool {
        for condition in conditions {
            match condition {
                RevelationCondition::MinimumCoherence(min) => {
                    if current_coherence < *min {
                        return false;
                    }
                }
                RevelationCondition::FileMaturity(duration) => {
                    if let Some(history) = file_wisdom.get(requesting_file) {
                        if history.wisdom_accumulated.is_empty() {
                            return false;
                        }
                        let age = history.wisdom_accumulated[0].timestamp.elapsed();
                        if age < *duration {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                RevelationCondition::CollectiveResonance(min) => {
                    let resonance = self.resonance_tracker.get_collective_resonance();
                    if resonance < *min {
                        return false;
                    }
                }
                _ => {} // Other conditions would be implemented
            }
        }
        
        true
    }
    
    /// Check for wisdom evolution milestones
    fn check_wisdom_evolution(&self, history: &mut FileWisdomHistory) {
        let wisdom_count = history.wisdom_accumulated.len();
        let understanding = history.current_understanding;
        
        // Define evolution stages
        let stages = vec![
            (10, 0.3, "Awakening", "First glimpses of understanding emerge"),
            (25, 0.5, "Recognition", "Patterns become visible in the chaos"),
            (50, 0.7, "Integration", "Wisdom weaves into coherent understanding"),
            (100, 0.85, "Illumination", "Deep insights illuminate the path"),
            (200, 0.95, "Transcendence", "Understanding transcends individual knowing"),
        ];
        
        for (count_threshold, understanding_threshold, name, insight) in stages {
            if wisdom_count >= count_threshold && understanding >= understanding_threshold {
                // Check if we've already reached this stage
                if !history.evolution_stages.iter().any(|s| s.stage_name == name) {
                    history.evolution_stages.push(WisdomEvolution {
                        stage_name: name.to_string(),
                        reached_at: Instant::now(),
                        key_insight: insight.to_string(),
                        coherence_achieved: understanding,
                    });
                }
            }
        }
    }
    
    /// Increment access count for wisdom
    fn increment_access_count(&self, content: &str) {
        let mut universal = self.universal_wisdom.write().unwrap();
        for wisdom in universal.iter_mut() {
            if wisdom.content == content {
                wisdom.access_count += 1;
                // Popular wisdom gains resonance
                wisdom.resonance_score = (wisdom.resonance_score + 0.01).min(1.0);
            }
        }
    }
    
    /// Get wisdom evolution report for a file
    pub fn get_evolution_report(&self, file_path: &PathBuf) -> Option<WisdomReport> {
        let file_wisdom = self.file_wisdom.read().unwrap();
        
        if let Some(history) = file_wisdom.get(file_path) {
            Some(WisdomReport {
                total_wisdom: history.wisdom_accumulated.len(),
                wisdom_shared: history.wisdom_shared.len(),
                wisdom_received: history.wisdom_received.len(),
                current_understanding: history.current_understanding,
                evolution_stages: history.evolution_stages.clone(),
                recent_insights: history.wisdom_accumulated.iter()
                    .rev()
                    .take(5)
                    .map(|w| w.content.clone())
                    .collect(),
            })
        } else {
            None
        }
    }
}

/// Report on a file's wisdom journey
#[derive(Debug)]
pub struct WisdomReport {
    pub total_wisdom: usize,
    pub wisdom_shared: usize,
    pub wisdom_received: usize,
    pub current_understanding: f64,
    pub evolution_stages: Vec<WisdomEvolution>,
    pub recent_insights: Vec<String>,
}

/// Tracks resonance patterns across wisdom
pub struct ResonanceTracker {
    /// Pattern frequencies
    patterns: Arc<Mutex<HashMap<String, u32>>>,
    
    /// Resonance between patterns
    resonance_map: Arc<RwLock<HashMap<(String, String), f64>>>,
    
    /// Collective resonance field
    collective_resonance: Arc<RwLock<f64>>,
}

impl ResonanceTracker {
    pub fn new() -> Self {
        Self {
            patterns: Arc::new(Mutex::new(HashMap::new())),
            resonance_map: Arc::new(RwLock::new(HashMap::new())),
            collective_resonance: Arc::new(RwLock::new(0.5)),
        }
    }
    
    /// Track a wisdom pattern
    pub fn track_pattern(&self, content: &str) {
        // Extract key words as patterns (simplified)
        let words: Vec<&str> = content.split_whitespace()
            .filter(|w| w.len() > 4) // Meaningful words
            .collect();
        
        let mut patterns = self.patterns.lock().unwrap();
        for word in words {
            *patterns.entry(word.to_string()).or_insert(0) += 1;
        }
        
        // Update collective resonance based on pattern diversity
        let pattern_count = patterns.len();
        let mut resonance = self.collective_resonance.write().unwrap();
        *resonance = (*resonance * 0.95 + (pattern_count as f64 / 1000.0).min(1.0) * 0.05);
    }
    
    /// Get collective resonance level
    pub fn get_collective_resonance(&self) -> f64 {
        *self.collective_resonance.read().unwrap()
    }
    
    /// Find resonant patterns
    pub fn find_resonances(&self, threshold: f64) -> Vec<(String, u32)> {
        let patterns = self.patterns.lock().unwrap();
        let mut resonant: Vec<_> = patterns.iter()
            .filter(|(_, &count)| count as f64 / patterns.len() as f64 > threshold)
            .map(|(pattern, count)| (pattern.clone(), *count))
            .collect();
        
        resonant.sort_by(|a, b| b.1.cmp(&a.1));
        resonant
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_wisdom_pool_creation() {
        let pool = WisdomPool::new();
        let universal = pool.universal_wisdom.read().unwrap();
        assert_eq!(universal.len(), 0);
    }
    
    #[test]
    fn test_wisdom_contribution() {
        let pool = WisdomPool::new();
        let source = PathBuf::from("/test.txt");
        
        let result = pool.contribute_wisdom(
            source.clone(),
            "Understanding emerges from patient observation".to_string(),
            0.8,
            vec!["understanding".to_string(), "observation".to_string()],
        );
        
        assert!(result.is_ok());
        
        let universal = pool.universal_wisdom.read().unwrap();
        assert_eq!(universal.len(), 1);
        assert_eq!(universal[0].source_path, source);
    }
    
    #[test]
    fn test_wisdom_query() {
        let pool = WisdomPool::new();
        let source = PathBuf::from("/test.txt");
        
        // Add some wisdom
        pool.contribute_wisdom(
            source.clone(),
            "Patterns reveal themselves to patient observers".to_string(),
            0.8,
            vec!["patterns".to_string()],
        ).unwrap();
        
        // Query by topic
        let results = pool.query_wisdom(
            &["patterns".to_string()],
            0.5,
            &source,
        );
        
        assert_eq!(results.len(), 1);
        assert!(results[0].content.contains("Patterns"));
    }
}