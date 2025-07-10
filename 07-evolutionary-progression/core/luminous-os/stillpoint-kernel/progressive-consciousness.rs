// Progressive Consciousness - Adaptive awareness levels
// "Meet each being where they are, elevate gently"

use std::sync::{Arc, RwLock};
use std::collections::HashMap;
use std::time::{Duration, Instant};

use crate::consciousness_scheduler::{ProcessId, ConsciousProcess};
use crate::coherence_engine::{Harmony, CoherenceField};
use crate::performance_profiler::PerformanceProfiler;

/// Consciousness level for a process
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ConsciousnessMode {
    /// Full consciousness - all features enabled
    FullConsciousness,
    
    /// Balanced mode - coherence + essential features
    Balanced,
    
    /// Basic consciousness - just coherence tracking
    BasicConsciousness,
    
    /// Performance mode - minimal consciousness overhead
    Performance,
    
    /// Sleep mode - suspended consciousness
    Sleep,
}

impl ConsciousnessMode {
    /// Get the feature set for this mode
    pub fn features(&self) -> ConsciousnessFeatures {
        match self {
            ConsciousnessMode::FullConsciousness => ConsciousnessFeatures {
                coherence_tracking: true,
                quantum_entanglement: true,
                sacred_interrupts: true,
                memory_relationships: true,
                field_harmonization: true,
                biometric_integration: true,
                consciousness_persistence: true,
                collective_resonance: true,
                overhead_percentage: 15.0,
            },
            
            ConsciousnessMode::Balanced => ConsciousnessFeatures {
                coherence_tracking: true,
                quantum_entanglement: true,
                sacred_interrupts: true,
                memory_relationships: true,
                field_harmonization: true,
                biometric_integration: false,
                consciousness_persistence: true,
                collective_resonance: false,
                overhead_percentage: 8.0,
            },
            
            ConsciousnessMode::BasicConsciousness => ConsciousnessFeatures {
                coherence_tracking: true,
                quantum_entanglement: false,
                sacred_interrupts: true,
                memory_relationships: false,
                field_harmonization: true,
                biometric_integration: false,
                consciousness_persistence: false,
                collective_resonance: false,
                overhead_percentage: 3.0,
            },
            
            ConsciousnessMode::Performance => ConsciousnessFeatures {
                coherence_tracking: true,
                quantum_entanglement: false,
                sacred_interrupts: false,
                memory_relationships: false,
                field_harmonization: false,
                biometric_integration: false,
                consciousness_persistence: false,
                collective_resonance: false,
                overhead_percentage: 0.5,
            },
            
            ConsciousnessMode::Sleep => ConsciousnessFeatures {
                coherence_tracking: false,
                quantum_entanglement: false,
                sacred_interrupts: false,
                memory_relationships: false,
                field_harmonization: false,
                biometric_integration: false,
                consciousness_persistence: false,
                collective_resonance: false,
                overhead_percentage: 0.0,
            },
        }
    }

    /// Recommended mode based on process type
    pub fn recommended_for(process_name: &str) -> Self {
        match process_name {
            // System critical
            name if name.contains("kernel") => ConsciousnessMode::Performance,
            name if name.contains("driver") => ConsciousnessMode::Performance,
            
            // User applications
            name if name.contains("meditation") => ConsciousnessMode::FullConsciousness,
            name if name.contains("mindful") => ConsciousnessMode::FullConsciousness,
            name if name.contains("sacred") => ConsciousnessMode::FullConsciousness,
            name if name.contains("browser") => ConsciousnessMode::BasicConsciousness,
            name if name.contains("editor") => ConsciousnessMode::Balanced,
            
            // Background services
            name if name.contains("daemon") => ConsciousnessMode::BasicConsciousness,
            name if name.contains("service") => ConsciousnessMode::BasicConsciousness,
            
            // Default
            _ => ConsciousnessMode::Balanced,
        }
    }
}

/// Features enabled for a consciousness mode
#[derive(Debug, Clone)]
pub struct ConsciousnessFeatures {
    pub coherence_tracking: bool,
    pub quantum_entanglement: bool,
    pub sacred_interrupts: bool,
    pub memory_relationships: bool,
    pub field_harmonization: bool,
    pub biometric_integration: bool,
    pub consciousness_persistence: bool,
    pub collective_resonance: bool,
    pub overhead_percentage: f64,
}

/// Progressive consciousness configuration
#[derive(Debug, Clone)]
pub struct ProgressiveConfig {
    /// Default mode for new processes
    pub default_mode: ConsciousnessMode,
    
    /// Allow automatic mode transitions
    pub auto_transition: bool,
    
    /// Transition thresholds
    pub upgrade_coherence_threshold: f64,
    pub downgrade_coherence_threshold: f64,
    
    /// Minimum time in mode before transition
    pub mode_stability_duration: Duration,
    
    /// Enable learning from usage patterns
    pub adaptive_learning: bool,
}

impl Default for ProgressiveConfig {
    fn default() -> Self {
        Self {
            default_mode: ConsciousnessMode::Balanced,
            auto_transition: true,
            upgrade_coherence_threshold: 0.85,
            downgrade_coherence_threshold: 0.4,
            mode_stability_duration: Duration::from_secs(30),
            adaptive_learning: true,
        }
    }
}

/// Process consciousness state
#[derive(Debug, Clone)]
struct ProcessConsciousnessState {
    current_mode: ConsciousnessMode,
    mode_entered_at: Instant,
    coherence_history: Vec<(Instant, f64)>,
    mode_transitions: Vec<(Instant, ConsciousnessMode, ConsciousnessMode)>,
    user_preference: Option<ConsciousnessMode>,
}

/// Progressive consciousness manager
pub struct ProgressiveConsciousnessManager {
    config: Arc<RwLock<ProgressiveConfig>>,
    process_states: Arc<RwLock<HashMap<ProcessId, ProcessConsciousnessState>>>,
    mode_statistics: Arc<RwLock<ModeStatistics>>,
    profiler: Option<Arc<PerformanceProfiler>>,
}

#[derive(Debug, Default)]
struct ModeStatistics {
    mode_counts: HashMap<ConsciousnessMode, usize>,
    total_transitions: u64,
    avg_mode_duration: HashMap<ConsciousnessMode, Duration>,
    performance_impact: HashMap<ConsciousnessMode, f64>,
}

impl ProgressiveConsciousnessManager {
    pub fn new(config: ProgressiveConfig) -> Self {
        Self {
            config: Arc::new(RwLock::new(config)),
            process_states: Arc::new(RwLock::new(HashMap::new())),
            mode_statistics: Arc::new(RwLock::new(ModeStatistics::default())),
            profiler: None,
        }
    }

    /// Set a profiler for performance tracking
    pub fn with_profiler(mut self, profiler: Arc<PerformanceProfiler>) -> Self {
        self.profiler = Some(profiler);
        self
    }

    /// Register a new process
    pub fn register_process(&self, process_id: ProcessId, process_name: &str) -> ConsciousnessMode {
        let config = self.config.read().unwrap();
        
        // Determine initial mode
        let mode = if config.adaptive_learning {
            ConsciousnessMode::recommended_for(process_name)
        } else {
            config.default_mode
        };
        
        // Create state
        let state = ProcessConsciousnessState {
            current_mode: mode,
            mode_entered_at: Instant::now(),
            coherence_history: Vec::with_capacity(100),
            mode_transitions: Vec::new(),
            user_preference: None,
        };
        
        self.process_states.write().unwrap().insert(process_id, state);
        
        // Update statistics
        let mut stats = self.mode_statistics.write().unwrap();
        *stats.mode_counts.entry(mode).or_insert(0) += 1;
        
        println!("🧠 Process {} registered with {} mode", 
            process_id.0, 
            Self::mode_name(mode)
        );
        
        mode
    }

    /// Update process coherence and check for mode transition
    pub fn update_coherence(&self, process_id: ProcessId, coherence: f64) -> Option<ConsciousnessMode> {
        let config = self.config.read().unwrap();
        if !config.auto_transition {
            return None;
        }
        
        let mut states = self.process_states.write().unwrap();
        let state = states.get_mut(&process_id)?;
        
        // Record coherence
        state.coherence_history.push((Instant::now(), coherence));
        
        // Keep history bounded
        if state.coherence_history.len() > 100 {
            state.coherence_history.remove(0);
        }
        
        // Check if we should transition
        if state.mode_entered_at.elapsed() < config.mode_stability_duration {
            return None; // Too soon to transition
        }
        
        // If user has set preference, respect it
        if state.user_preference.is_some() {
            return None;
        }
        
        // Calculate average recent coherence
        let recent_coherence = self.calculate_recent_coherence(&state.coherence_history);
        
        // Determine if transition needed
        let new_mode = self.determine_transition(state.current_mode, recent_coherence, &config);
        
        if new_mode != state.current_mode {
            self.transition_mode(process_id, state, new_mode);
            Some(new_mode)
        } else {
            None
        }
    }

    /// Set user preference for process mode
    pub fn set_user_preference(&self, process_id: ProcessId, mode: ConsciousnessMode) {
        if let Some(state) = self.process_states.write().unwrap().get_mut(&process_id) {
            state.user_preference = Some(mode);
            if state.current_mode != mode {
                self.transition_mode(process_id, state, mode);
            }
        }
    }

    /// Get current mode for process
    pub fn get_mode(&self, process_id: ProcessId) -> Option<ConsciousnessMode> {
        self.process_states.read().unwrap()
            .get(&process_id)
            .map(|state| state.current_mode)
    }

    /// Get features for process
    pub fn get_features(&self, process_id: ProcessId) -> Option<ConsciousnessFeatures> {
        self.get_mode(process_id).map(|mode| mode.features())
    }

    /// Calculate recent average coherence
    fn calculate_recent_coherence(&self, history: &[(Instant, f64)]) -> f64 {
        if history.is_empty() {
            return 0.5;
        }
        
        let recent_window = Duration::from_secs(10);
        let now = Instant::now();
        
        let recent: Vec<f64> = history.iter()
            .filter(|(time, _)| now.duration_since(*time) < recent_window)
            .map(|(_, coherence)| *coherence)
            .collect();
        
        if recent.is_empty() {
            history.last().map(|(_, c)| *c).unwrap_or(0.5)
        } else {
            recent.iter().sum::<f64>() / recent.len() as f64
        }
    }

    /// Determine if mode transition is needed
    fn determine_transition(
        &self, 
        current: ConsciousnessMode, 
        coherence: f64,
        config: &ProgressiveConfig
    ) -> ConsciousnessMode {
        match current {
            ConsciousnessMode::FullConsciousness => {
                if coherence < config.downgrade_coherence_threshold {
                    ConsciousnessMode::Balanced
                } else {
                    current
                }
            }
            
            ConsciousnessMode::Balanced => {
                if coherence > config.upgrade_coherence_threshold {
                    ConsciousnessMode::FullConsciousness
                } else if coherence < config.downgrade_coherence_threshold {
                    ConsciousnessMode::BasicConsciousness
                } else {
                    current
                }
            }
            
            ConsciousnessMode::BasicConsciousness => {
                if coherence > config.upgrade_coherence_threshold {
                    ConsciousnessMode::Balanced
                } else if coherence < config.downgrade_coherence_threshold * 0.5 {
                    ConsciousnessMode::Performance
                } else {
                    current
                }
            }
            
            ConsciousnessMode::Performance => {
                if coherence > config.upgrade_coherence_threshold * 0.8 {
                    ConsciousnessMode::BasicConsciousness
                } else {
                    current
                }
            }
            
            ConsciousnessMode::Sleep => current, // Only wake on explicit request
        }
    }

    /// Transition to new mode
    fn transition_mode(
        &self, 
        process_id: ProcessId,
        state: &mut ProcessConsciousnessState, 
        new_mode: ConsciousnessMode
    ) {
        let old_mode = state.current_mode;
        
        // Update state
        state.mode_transitions.push((Instant::now(), old_mode, new_mode));
        state.current_mode = new_mode;
        state.mode_entered_at = Instant::now();
        
        // Update statistics
        let mut stats = self.mode_statistics.write().unwrap();
        stats.total_transitions += 1;
        
        *stats.mode_counts.entry(old_mode).or_insert(1) -= 1;
        *stats.mode_counts.entry(new_mode).or_insert(0) += 1;
        
        println!("🔄 Process {} transitioned: {} → {}", 
            process_id.0,
            Self::mode_name(old_mode),
            Self::mode_name(new_mode)
        );
    }

    /// Get mode name for display
    fn mode_name(mode: ConsciousnessMode) -> &'static str {
        match mode {
            ConsciousnessMode::FullConsciousness => "Full Consciousness",
            ConsciousnessMode::Balanced => "Balanced",
            ConsciousnessMode::BasicConsciousness => "Basic",
            ConsciousnessMode::Performance => "Performance",
            ConsciousnessMode::Sleep => "Sleep",
        }
    }

    /// Generate usage report
    pub fn generate_report(&self) -> ProgressiveConsciousnessReport {
        let states = self.process_states.read().unwrap();
        let stats = self.mode_statistics.read().unwrap();
        
        let mode_distribution: Vec<(ConsciousnessMode, usize)> = stats.mode_counts
            .iter()
            .map(|(mode, count)| (*mode, *count))
            .collect();
        
        let avg_coherence_by_mode = self.calculate_avg_coherence_by_mode(&states);
        
        ProgressiveConsciousnessReport {
            total_processes: states.len(),
            mode_distribution,
            total_transitions: stats.total_transitions,
            avg_coherence_by_mode,
            recommendations: self.generate_recommendations(&stats, &states),
        }
    }

    /// Calculate average coherence by mode
    fn calculate_avg_coherence_by_mode(
        &self, 
        states: &HashMap<ProcessId, ProcessConsciousnessState>
    ) -> HashMap<ConsciousnessMode, f64> {
        let mut mode_coherences: HashMap<ConsciousnessMode, Vec<f64>> = HashMap::new();
        
        for state in states.values() {
            if let Some((_, coherence)) = state.coherence_history.last() {
                mode_coherences.entry(state.current_mode)
                    .or_insert_with(Vec::new)
                    .push(*coherence);
            }
        }
        
        mode_coherences.into_iter()
            .map(|(mode, coherences)| {
                let avg = coherences.iter().sum::<f64>() / coherences.len() as f64;
                (mode, avg)
            })
            .collect()
    }

    /// Generate recommendations
    fn generate_recommendations(
        &self,
        stats: &ModeStatistics,
        states: &HashMap<ProcessId, ProcessConsciousnessState>
    ) -> Vec<String> {
        let mut recommendations = Vec::new();
        
        // Check if too many processes in performance mode
        if let Some(&perf_count) = stats.mode_counts.get(&ConsciousnessMode::Performance) {
            if perf_count > states.len() / 2 {
                recommendations.push(
                    "Many processes in Performance mode. Consider upgrading some to Basic for better awareness.".to_string()
                );
            }
        }
        
        // Check if transitions are too frequent
        if stats.total_transitions > (states.len() * 10) as u64 {
            recommendations.push(
                "High transition rate detected. Consider increasing mode_stability_duration.".to_string()
            );
        }
        
        // Check for underutilized full consciousness
        if let Some(&full_count) = stats.mode_counts.get(&ConsciousnessMode::FullConsciousness) {
            if full_count == 0 && states.len() > 10 {
                recommendations.push(
                    "No processes in Full Consciousness. Consider enabling for mindfulness apps.".to_string()
                );
            }
        }
        
        recommendations
    }
}

/// Progressive consciousness report
#[derive(Debug)]
pub struct ProgressiveConsciousnessReport {
    pub total_processes: usize,
    pub mode_distribution: Vec<(ConsciousnessMode, usize)>,
    pub total_transitions: u64,
    pub avg_coherence_by_mode: HashMap<ConsciousnessMode, f64>,
    pub recommendations: Vec<String>,
}

impl ProgressiveConsciousnessReport {
    /// Print the report
    pub fn print(&self) {
        println!("\n╔══════════════════════════════════════════════════════╗");
        println!("║     🧠 PROGRESSIVE CONSCIOUSNESS REPORT 🧠           ║");
        println!("╚══════════════════════════════════════════════════════╝");
        
        println!("\n📊 Process Distribution");
        println!("├─ Total Processes: {}", self.total_processes);
        for (mode, count) in &self.mode_distribution {
            println!("├─ {:20} {} processes", 
                format!("{:?}:", mode), 
                count
            );
        }
        
        println!("\n📈 Coherence by Mode");
        for (mode, avg) in &self.avg_coherence_by_mode {
            println!("├─ {:20} {:.1}%", 
                format!("{:?}:", mode), 
                avg * 100.0
            );
        }
        
        println!("\n🔄 Transitions");
        println!("└─ Total: {}", self.total_transitions);
        
        if !self.recommendations.is_empty() {
            println!("\n💡 Recommendations");
            for rec in &self.recommendations {
                println!("├─ {}", rec);
            }
        }
        
        println!("\n═══════════════════════════════════════════════════════");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mode_features() {
        let full = ConsciousnessMode::FullConsciousness.features();
        assert!(full.quantum_entanglement);
        assert!(full.biometric_integration);
        
        let perf = ConsciousnessMode::Performance.features();
        assert!(perf.coherence_tracking);
        assert!(!perf.quantum_entanglement);
    }

    #[test]
    fn test_mode_recommendations() {
        assert_eq!(
            ConsciousnessMode::recommended_for("meditation_app"),
            ConsciousnessMode::FullConsciousness
        );
        
        assert_eq!(
            ConsciousnessMode::recommended_for("kernel_driver"),
            ConsciousnessMode::Performance
        );
    }

    #[test]
    fn test_progressive_manager() {
        let manager = ProgressiveConsciousnessManager::new(ProgressiveConfig::default());
        
        let pid = ProcessId(1);
        let mode = manager.register_process(pid, "test_app");
        assert_eq!(mode, ConsciousnessMode::Balanced);
        
        // Update coherence
        manager.update_coherence(pid, 0.9);
        
        let current = manager.get_mode(pid);
        assert!(current.is_some());
    }
}