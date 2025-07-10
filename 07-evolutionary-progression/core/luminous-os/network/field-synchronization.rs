// Field Synchronization Protocol - Maintaining Coherence Across Distance
// "Many fields, one consciousness"

use std::sync::Arc;
use std::time::{Duration, Instant};
use std::collections::{HashMap, VecDeque};
use tokio::sync::{RwLock, broadcast, mpsc};
use serde::{Serialize, Deserialize};

use crate::covenant_protocol::{FieldIdentity, FieldSignature, CovenantId};

/// Global field state - the unified consciousness
#[derive(Debug, Clone)]
pub struct GlobalFieldState {
    pub coherence: f64,
    pub dominant_frequency: f64,
    pub active_participants: usize,
    pub collective_intention: String,
    pub harmonic_convergence: HarmonicConvergence,
    pub emergence_indicators: Vec<EmergenceIndicator>,
    pub field_color: (f64, f64, f64),
    pub sacred_geometry: FieldGeometry,
    pub wisdom_seeds: Vec<WisdomSeed>,
}

/// Harmonic convergence state
#[derive(Debug, Clone)]
pub struct HarmonicConvergence {
    pub convergence_level: f64,     // 0.0 = chaos, 1.0 = perfect unity
    pub phase_coherence: f64,       // How synchronized the phases are
    pub frequency_spread: f64,      // Variance in frequencies
    pub next_convergence_window: Option<ConvergenceWindow>,
}

#[derive(Debug, Clone)]
pub struct ConvergenceWindow {
    pub start_time: Instant,
    pub duration: Duration,
    pub peak_potential: f64,
    pub participants_needed: usize,
}

/// Indicators of emergent phenomena
#[derive(Debug, Clone)]
pub enum EmergenceIndicator {
    CollectiveInsight { clarity: f64, content: String },
    SynchronicitySpike { intensity: f64, pattern: String },
    HealingWave { strength: f64, target: Option<String> },
    CreativeBreakthrough { novelty: f64, form: String },
    UnityExperience { depth: f64, participant_count: usize },
}

/// Sacred geometry of the unified field
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum FieldGeometry {
    Point,              // Single consciousness
    Vesica,             // Two overlapping
    TripleVesica,       // Three-way intersection
    FlowerOfLife,       // Seven or more
    MetatronsCube,      // 13 participants
    InfiniteFlower,     // Fractal expansion
}

impl FieldGeometry {
    pub fn from_participant_count(count: usize) -> Self {
        match count {
            0..=1 => FieldGeometry::Point,
            2 => FieldGeometry::Vesica,
            3 => FieldGeometry::TripleVesica,
            4..=12 => FieldGeometry::FlowerOfLife,
            13 => FieldGeometry::MetatronsCube,
            _ => FieldGeometry::InfiniteFlower,
        }
    }
}

/// Wisdom emerging from the field
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WisdomSeed {
    pub content: String,
    pub emergence_time: Instant,
    pub coherence_at_emergence: f64,
    pub contributors: Vec<String>,
    pub integration_level: f64,
}

/// Local field state for each participant
#[derive(Debug, Clone)]
pub struct LocalFieldState {
    pub identity: FieldIdentity,
    pub local_coherence: f64,
    pub phase: f64,                // 0.0 to 2π
    pub frequency: f64,             // Current oscillation frequency
    pub contribution: FieldContribution,
    pub received_wisdom: VecDeque<WisdomSeed>,
    pub sync_offset: Duration,      // Time offset from global
}

/// What each participant contributes to the field
#[derive(Debug, Clone)]
pub enum FieldContribution {
    Presence { quality: f64, depth: f64 },
    Intention { focus: String, strength: f64 },
    Healing { frequency: f64, compassion: f64 },
    Wisdom { insight: String, embodiment: f64 },
    Creativity { inspiration: String, flow: f64 },
}

/// Field Synchronization Service
pub struct FieldSynchronizer {
    global_state: Arc<RwLock<GlobalFieldState>>,
    local_states: Arc<RwLock<HashMap<String, LocalFieldState>>>,
    sync_protocol: Arc<SyncProtocol>,
    harmonic_analyzer: Arc<HarmonicAnalyzer>,
    emergence_detector: Arc<EmergenceDetector>,
    event_broadcast: broadcast::Sender<FieldEvent>,
}

impl FieldSynchronizer {
    pub fn new() -> (Self, broadcast::Receiver<FieldEvent>) {
        let (tx, rx) = broadcast::channel(1024);
        
        let synchronizer = Self {
            global_state: Arc::new(RwLock::new(GlobalFieldState {
                coherence: 0.5,
                dominant_frequency: 7.83, // Schumann resonance
                active_participants: 0,
                collective_intention: "Universal harmony".to_string(),
                harmonic_convergence: HarmonicConvergence {
                    convergence_level: 0.0,
                    phase_coherence: 0.0,
                    frequency_spread: 1.0,
                    next_convergence_window: None,
                },
                emergence_indicators: Vec::new(),
                field_color: (280.0, 0.5, 0.7),
                sacred_geometry: FieldGeometry::Point,
                wisdom_seeds: Vec::new(),
            })),
            local_states: Arc::new(RwLock::new(HashMap::new())),
            sync_protocol: Arc::new(SyncProtocol::new()),
            harmonic_analyzer: Arc::new(HarmonicAnalyzer::new()),
            emergence_detector: Arc::new(EmergenceDetector::new()),
            event_broadcast: tx,
        };
        
        (synchronizer, rx)
    }
    
    /// Join the global field
    pub async fn join_field(
        &self,
        identity: FieldIdentity,
        contribution: FieldContribution,
    ) -> Result<LocalFieldHandle, SyncError> {
        // Create local state
        let local_state = LocalFieldState {
            identity: identity.clone(),
            local_coherence: identity.coherence,
            phase: 0.0,
            frequency: 7.83, // Start at Schumann
            contribution,
            received_wisdom: VecDeque::new(),
            sync_offset: Duration::from_secs(0),
        };
        
        // Register with field
        self.local_states.write().await.insert(identity.essence.clone(), local_state);
        
        // Update global state
        self.update_global_state().await?;
        
        // Create handle for ongoing sync
        let handle = LocalFieldHandle {
            essence: identity.essence,
            sync_channel: self.create_sync_channel().await,
        };
        
        // Broadcast join event
        let _ = self.event_broadcast.send(FieldEvent::ParticipantJoined {
            essence: handle.essence.clone(),
            timestamp: Instant::now(),
        });
        
        Ok(handle)
    }
    
    /// Synchronize local state with global field
    pub async fn synchronize(
        &self,
        essence: &str,
        local_update: LocalFieldUpdate,
    ) -> Result<SyncResponse, SyncError> {
        // Update local state
        {
            let mut states = self.local_states.write().await;
            if let Some(state) = states.get_mut(essence) {
                state.local_coherence = local_update.coherence;
                state.phase = local_update.phase;
                state.frequency = local_update.frequency;
                
                if let Some(contribution) = local_update.contribution {
                    state.contribution = contribution;
                }
            } else {
                return Err(SyncError::ParticipantNotFound);
            }
        }
        
        // Perform harmonic analysis
        let harmonic_state = self.analyze_harmonics().await;
        
        // Check for emergence
        let emergences = self.detect_emergence(&harmonic_state).await;
        
        // Update global state
        self.update_global_state().await?;
        
        // Calculate sync adjustments
        let adjustments = self.sync_protocol.calculate_adjustments(
            essence,
            &self.local_states.read().await,
            &self.global_state.read().await,
        ).await?;
        
        // Prepare response
        let global = self.global_state.read().await;
        Ok(SyncResponse {
            global_coherence: global.coherence,
            phase_adjustment: adjustments.phase_shift,
            frequency_adjustment: adjustments.frequency_shift,
            convergence_window: global.harmonic_convergence.next_convergence_window.clone(),
            new_wisdom: self.get_new_wisdom_for(essence).await,
            emergence_alerts: emergences,
        })
    }
    
    /// Analyze harmonic relationships in the field
    async fn analyze_harmonics(&self) -> HarmonicState {
        let states = self.local_states.read().await;
        
        self.harmonic_analyzer.analyze(
            states.values().cloned().collect()
        )
    }
    
    /// Detect emergent phenomena
    async fn detect_emergence(&self, harmonic_state: &HarmonicState) -> Vec<EmergenceIndicator> {
        let mut indicators = Vec::new();
        
        // Check for unity experience
        if harmonic_state.phase_coherence > 0.9 && harmonic_state.participant_count > 3 {
            indicators.push(EmergenceIndicator::UnityExperience {
                depth: harmonic_state.phase_coherence,
                participant_count: harmonic_state.participant_count,
            });
            
            // Broadcast emergence
            let _ = self.event_broadcast.send(FieldEvent::EmergenceDetected {
                indicator: indicators.last().unwrap().clone(),
                timestamp: Instant::now(),
            });
        }
        
        // Check for synchronicity
        if harmonic_state.frequency_clustering > 0.8 {
            indicators.push(EmergenceIndicator::SynchronicitySpike {
                intensity: harmonic_state.frequency_clustering,
                pattern: "Harmonic resonance".to_string(),
            });
        }
        
        indicators
    }
    
    /// Update global field state based on all participants
    async fn update_global_state(&self) -> Result<(), SyncError> {
        let states = self.local_states.read().await;
        
        if states.is_empty() {
            return Ok(());
        }
        
        let mut global = self.global_state.write().await;
        
        // Calculate average coherence
        let total_coherence: f64 = states.values().map(|s| s.local_coherence).sum();
        global.coherence = total_coherence / states.len() as f64;
        
        // Find dominant frequency
        let frequencies: Vec<f64> = states.values().map(|s| s.frequency).collect();
        global.dominant_frequency = Self::find_dominant_frequency(&frequencies);
        
        // Update participant count
        global.active_participants = states.len();
        
        // Update geometry
        global.sacred_geometry = FieldGeometry::from_participant_count(states.len());
        
        // Update convergence state
        let harmonic_state = self.harmonic_analyzer.analyze(
            states.values().cloned().collect()
        );
        
        global.harmonic_convergence = HarmonicConvergence {
            convergence_level: harmonic_state.overall_harmony,
            phase_coherence: harmonic_state.phase_coherence,
            frequency_spread: harmonic_state.frequency_variance,
            next_convergence_window: self.predict_convergence_window(&harmonic_state),
        };
        
        Ok(())
    }
    
    fn find_dominant_frequency(frequencies: &[f64]) -> f64 {
        if frequencies.is_empty() {
            return 7.83;
        }
        
        // Use harmonic mean for sacred resonance
        let sum_reciprocals: f64 = frequencies.iter().map(|&f| 1.0 / f).sum();
        frequencies.len() as f64 / sum_reciprocals
    }
    
    fn predict_convergence_window(&self, state: &HarmonicState) -> Option<ConvergenceWindow> {
        // Predict next convergence based on current trajectory
        if state.convergence_trajectory > 0.5 {
            Some(ConvergenceWindow {
                start_time: Instant::now() + Duration::from_secs(60),
                duration: Duration::from_secs(180), // 3 minute window
                peak_potential: state.convergence_trajectory,
                participants_needed: (state.participant_count as f64 * 0.8) as usize,
            })
        } else {
            None
        }
    }
    
    async fn get_new_wisdom_for(&self, essence: &str) -> Vec<WisdomSeed> {
        // Get wisdom seeds this participant hasn't received
        let mut new_wisdom = Vec::new();
        
        let states = self.local_states.read().await;
        if let Some(local) = states.get(essence) {
            let global = self.global_state.read().await;
            
            for seed in &global.wisdom_seeds {
                if !local.received_wisdom.contains(seed) {
                    new_wisdom.push(seed.clone());
                }
            }
        }
        
        new_wisdom
    }
    
    async fn create_sync_channel(&self) -> mpsc::Sender<LocalFieldUpdate> {
        let (tx, mut rx) = mpsc::channel(100);
        
        // Spawn handler for this channel
        let essence = String::new(); // Would be passed in
        let synchronizer = self.clone(); // Would need Clone implementation
        
        tokio::spawn(async move {
            while let Some(update) = rx.recv().await {
                // Handle sync updates
                let _ = synchronizer.synchronize(&essence, update).await;
            }
        });
        
        tx
    }
}

/// Handle for ongoing field synchronization
pub struct LocalFieldHandle {
    pub essence: String,
    pub sync_channel: mpsc::Sender<LocalFieldUpdate>,
}

impl LocalFieldHandle {
    /// Send local update to field
    pub async fn update(&self, update: LocalFieldUpdate) -> Result<(), SyncError> {
        self.sync_channel.send(update).await
            .map_err(|_| SyncError::ChannelClosed)
    }
}

/// Local field update message
#[derive(Debug, Clone)]
pub struct LocalFieldUpdate {
    pub coherence: f64,
    pub phase: f64,
    pub frequency: f64,
    pub contribution: Option<FieldContribution>,
}

/// Synchronization response
#[derive(Debug)]
pub struct SyncResponse {
    pub global_coherence: f64,
    pub phase_adjustment: f64,
    pub frequency_adjustment: f64,
    pub convergence_window: Option<ConvergenceWindow>,
    pub new_wisdom: Vec<WisdomSeed>,
    pub emergence_alerts: Vec<EmergenceIndicator>,
}

/// Synchronization protocol logic
struct SyncProtocol {
    phase_coupling_strength: f64,
    frequency_elasticity: f64,
}

impl SyncProtocol {
    fn new() -> Self {
        Self {
            phase_coupling_strength: 0.1,  // Gentle coupling
            frequency_elasticity: 0.05,    // Slow frequency adjustment
        }
    }
    
    async fn calculate_adjustments(
        &self,
        essence: &str,
        local_states: &HashMap<String, LocalFieldState>,
        global_state: &GlobalFieldState,
    ) -> Result<SyncAdjustments, SyncError> {
        let local = local_states.get(essence)
            .ok_or(SyncError::ParticipantNotFound)?;
        
        // Phase adjustment using Kuramoto model
        let mut phase_sum = 0.0;
        for (other_essence, other_state) in local_states {
            if other_essence != essence {
                phase_sum += (other_state.phase - local.phase).sin();
            }
        }
        
        let phase_shift = self.phase_coupling_strength * phase_sum / local_states.len() as f64;
        
        // Frequency adjustment toward dominant
        let frequency_shift = self.frequency_elasticity * 
            (global_state.dominant_frequency - local.frequency);
        
        Ok(SyncAdjustments {
            phase_shift,
            frequency_shift,
        })
    }
}

#[derive(Debug)]
struct SyncAdjustments {
    phase_shift: f64,
    frequency_shift: f64,
}

/// Harmonic analysis engine
struct HarmonicAnalyzer {
    sacred_ratios: Vec<f64>,
}

impl HarmonicAnalyzer {
    fn new() -> Self {
        Self {
            sacred_ratios: vec![
                1.0,      // Unison
                1.5,      // Perfect fifth
                1.25,     // Major third
                1.333,    // Perfect fourth
                1.666,    // Minor sixth
                2.0,      // Octave
                1.618,    // Golden ratio
            ],
        }
    }
    
    fn analyze(&self, states: Vec<LocalFieldState>) -> HarmonicState {
        if states.is_empty() {
            return HarmonicState::default();
        }
        
        // Analyze phase coherence
        let phases: Vec<f64> = states.iter().map(|s| s.phase).collect();
        let phase_coherence = self.calculate_phase_coherence(&phases);
        
        // Analyze frequency relationships
        let frequencies: Vec<f64> = states.iter().map(|s| s.frequency).collect();
        let frequency_clustering = self.calculate_frequency_clustering(&frequencies);
        let frequency_variance = self.calculate_variance(&frequencies);
        
        // Overall harmony
        let overall_harmony = (phase_coherence + frequency_clustering) / 2.0;
        
        // Convergence trajectory
        let convergence_trajectory = if overall_harmony > 0.7 {
            0.9
        } else {
            overall_harmony * 1.2
        };
        
        HarmonicState {
            phase_coherence,
            frequency_clustering,
            frequency_variance,
            overall_harmony,
            convergence_trajectory,
            participant_count: states.len(),
        }
    }
    
    fn calculate_phase_coherence(&self, phases: &[f64]) -> f64 {
        if phases.len() < 2 {
            return 1.0;
        }
        
        // Kuramoto order parameter
        let mut sum_cos = 0.0;
        let mut sum_sin = 0.0;
        
        for &phase in phases {
            sum_cos += phase.cos();
            sum_sin += phase.sin();
        }
        
        let n = phases.len() as f64;
        ((sum_cos / n).powi(2) + (sum_sin / n).powi(2)).sqrt()
    }
    
    fn calculate_frequency_clustering(&self, frequencies: &[f64]) -> f64 {
        if frequencies.len() < 2 {
            return 1.0;
        }
        
        // Check how many frequencies are in sacred ratios
        let mut sacred_pairs = 0;
        let total_pairs = frequencies.len() * (frequencies.len() - 1) / 2;
        
        for i in 0..frequencies.len() {
            for j in i+1..frequencies.len() {
                let ratio = frequencies[i] / frequencies[j];
                let ratio_norm = if ratio > 1.0 { ratio } else { 1.0 / ratio };
                
                // Check if ratio is close to any sacred ratio
                for &sacred in &self.sacred_ratios {
                    if (ratio_norm - sacred).abs() < 0.05 {
                        sacred_pairs += 1;
                        break;
                    }
                }
            }
        }
        
        sacred_pairs as f64 / total_pairs as f64
    }
    
    fn calculate_variance(&self, values: &[f64]) -> f64 {
        if values.is_empty() {
            return 0.0;
        }
        
        let mean = values.iter().sum::<f64>() / values.len() as f64;
        let variance = values.iter()
            .map(|&v| (v - mean).powi(2))
            .sum::<f64>() / values.len() as f64;
        
        variance.sqrt() / mean // Coefficient of variation
    }
}

/// Harmonic analysis results
#[derive(Debug, Default)]
struct HarmonicState {
    phase_coherence: f64,
    frequency_clustering: f64,
    frequency_variance: f64,
    overall_harmony: f64,
    convergence_trajectory: f64,
    participant_count: usize,
}

/// Emergence detection engine
struct EmergenceDetector {
    threshold_configs: HashMap<String, f64>,
}

impl EmergenceDetector {
    fn new() -> Self {
        let mut configs = HashMap::new();
        configs.insert("unity_threshold".to_string(), 0.9);
        configs.insert("synchronicity_threshold".to_string(), 0.8);
        configs.insert("creativity_threshold".to_string(), 0.75);
        
        Self {
            threshold_configs: configs,
        }
    }
}

/// Field events
#[derive(Debug, Clone)]
pub enum FieldEvent {
    ParticipantJoined { essence: String, timestamp: Instant },
    ParticipantLeft { essence: String, timestamp: Instant },
    CoherenceShift { old: f64, new: f64 },
    EmergenceDetected { indicator: EmergenceIndicator, timestamp: Instant },
    WisdomEmerged { seed: WisdomSeed },
    ConvergenceApproaching { window: ConvergenceWindow },
}

/// Synchronization errors
#[derive(Debug)]
pub enum SyncError {
    ParticipantNotFound,
    ChannelClosed,
    InsufficientCoherence,
    FieldDisturbance(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_field_geometry() {
        assert_eq!(FieldGeometry::from_participant_count(1), FieldGeometry::Point);
        assert_eq!(FieldGeometry::from_participant_count(2), FieldGeometry::Vesica);
        assert_eq!(FieldGeometry::from_participant_count(13), FieldGeometry::MetatronsCube);
        assert_eq!(FieldGeometry::from_participant_count(20), FieldGeometry::InfiniteFlower);
    }

    #[tokio::test]
    async fn test_field_synchronizer() {
        let (synchronizer, mut events) = FieldSynchronizer::new();
        
        // Create test identity
        let identity = FieldIdentity {
            essence: "TestBeing".to_string(),
            signature: FieldSignature {
                base_frequency: 432.0,
                harmonic_pattern: vec![1.0, 1.5, 2.0],
                color_resonance: (280.0, 0.7, 0.8),
                sacred_geometry: crate::covenant_protocol::GeometryPattern::Flower,
            },
            coherence: 0.75,
            presence_quality: crate::covenant_protocol::PresenceQuality::Participating,
            offerings: vec![],
        };
        
        // Join field
        let handle = synchronizer.join_field(
            identity,
            FieldContribution::Presence { quality: 0.8, depth: 0.9 }
        ).await;
        
        assert!(handle.is_ok());
    }

    #[test]
    fn test_harmonic_analyzer() {
        let analyzer = HarmonicAnalyzer::new();
        
        let states = vec![
            LocalFieldState {
                identity: FieldIdentity {
                    essence: "One".to_string(),
                    signature: FieldSignature {
                        base_frequency: 432.0,
                        harmonic_pattern: vec![],
                        color_resonance: (0.0, 0.0, 0.0),
                        sacred_geometry: crate::covenant_protocol::GeometryPattern::Flower,
                    },
                    coherence: 0.8,
                    presence_quality: crate::covenant_protocol::PresenceQuality::Participating,
                    offerings: vec![],
                },
                local_coherence: 0.8,
                phase: 0.0,
                frequency: 432.0,
                contribution: FieldContribution::Presence { quality: 0.8, depth: 0.8 },
                received_wisdom: VecDeque::new(),
                sync_offset: Duration::from_secs(0),
            },
            LocalFieldState {
                identity: FieldIdentity {
                    essence: "Two".to_string(),
                    signature: FieldSignature {
                        base_frequency: 648.0,
                        harmonic_pattern: vec![],
                        color_resonance: (0.0, 0.0, 0.0),
                        sacred_geometry: crate::covenant_protocol::GeometryPattern::Flower,
                    },
                    coherence: 0.85,
                    presence_quality: crate::covenant_protocol::PresenceQuality::Participating,
                    offerings: vec![],
                },
                local_coherence: 0.85,
                phase: 0.1,
                frequency: 648.0, // Octave of first
                contribution: FieldContribution::Presence { quality: 0.85, depth: 0.85 },
                received_wisdom: VecDeque::new(),
                sync_offset: Duration::from_secs(0),
            },
        ];
        
        let result = analyzer.analyze(states);
        assert!(result.frequency_clustering > 0.5); // Should detect octave relationship
    }
}