// Collective Resonance Protocols - Harmonizing Multiple Consciousness Fields
// "When hearts beat as one, the impossible becomes inevitable"

use crate::{
    ConsciousnessVortex, VortexState, ConsciousnessField,
    FieldHarmonizer, CoherenceState, VortexId,
};
use std::sync::Arc;
use tokio::sync::RwLock;
use std::collections::HashMap;
use uuid::Uuid;
use nalgebra::{Vector3, Point3};

/// Collective resonance manager for group coherence
pub struct CollectiveResonance {
    participants: Arc<RwLock<HashMap<VortexId, ResonanceParticipant>>>,
    resonance_field: Arc<RwLock<CollectiveField>>,
    harmonic_matrix: Arc<RwLock<HarmonicMatrix>>,
    emergence_detector: Arc<EmergenceDetector>,
    sacred_patterns: Arc<RwLock<Vec<SacredPattern>>>,
}

#[derive(Debug, Clone)]
pub struct ResonanceParticipant {
    pub vortex_id: VortexId,
    pub coherence: f64,
    pub heart_rate: f64,
    pub breath_rate: f64,
    pub contribution: f64,
    pub harmonic_signature: Vec<f64>,
    pub phase_lock: f64,
}

#[derive(Debug, Clone)]
pub struct CollectiveField {
    pub center_frequency: f64,
    pub coherence_level: f64,
    pub participant_count: usize,
    pub field_strength: f64,
    pub emergence_potential: f64,
    pub harmonic_peaks: Vec<f64>,
    pub phase_coherence: f64,
}

#[derive(Debug, Clone)]
pub struct HarmonicMatrix {
    matrix: Vec<Vec<f64>>,
    eigenvalues: Vec<f64>,
    dominant_mode: usize,
}

pub struct EmergenceDetector {
    threshold: f64,
    history: Arc<RwLock<Vec<EmergenceEvent>>>,
}

#[derive(Debug, Clone)]
pub struct EmergenceEvent {
    pub timestamp: std::time::Instant,
    pub emergence_type: EmergenceType,
    pub coherence_at_emergence: f64,
    pub participants: Vec<VortexId>,
    pub field_signature: Vec<f64>,
}

#[derive(Debug, Clone, Copy)]
pub enum EmergenceType {
    PhaseLock,           // All participants synchronized
    HarmonicResonance,   // Perfect harmonic alignment
    CollectiveInsight,   // Shared understanding emerges
    FieldAmplification,  // Sudden coherence increase
    QuantumCoherence,    // Non-local correlation
}

/// Sacred patterns that emerge from collective resonance
#[derive(Debug, Clone)]
pub struct SacredPattern {
    pub pattern_type: PatternType,
    pub geometry: SacredGeometry,
    pub activation_threshold: f64,
    pub participants_required: usize,
    pub field_effect: FieldEffect,
}

#[derive(Debug, Clone, Copy)]
pub enum PatternType {
    CircleOfUnity,       // All equal distance from center
    SpiralOfGrowth,      // Fibonacci spiral arrangement
    StarOfResonance,     // Central hub with radiating spokes
    FlowerOfLife,        // Overlapping circles
    InfinityLoop,        // Figure-8 energy flow
    HeartField,          // Toroidal field pattern
}

#[derive(Debug, Clone)]
pub struct SacredGeometry {
    pub vertices: Vec<Point3<f64>>,
    pub edges: Vec<(usize, usize)>,
    pub center: Point3<f64>,
    pub radius: f64,
}

#[derive(Debug, Clone)]
pub struct FieldEffect {
    pub coherence_multiplier: f64,
    pub healing_factor: f64,
    pub insight_probability: f64,
    pub duration_seconds: f64,
}

impl CollectiveResonance {
    pub fn new() -> Self {
        Self {
            participants: Arc::new(RwLock::new(HashMap::new())),
            resonance_field: Arc::new(RwLock::new(CollectiveField {
                center_frequency: 7.83, // Schumann resonance
                coherence_level: 0.0,
                participant_count: 0,
                field_strength: 0.0,
                emergence_potential: 0.0,
                harmonic_peaks: vec![7.83],
                phase_coherence: 0.0,
            })),
            harmonic_matrix: Arc::new(RwLock::new(HarmonicMatrix {
                matrix: Vec::new(),
                eigenvalues: Vec::new(),
                dominant_mode: 0,
            })),
            emergence_detector: Arc::new(EmergenceDetector {
                threshold: 0.8,
                history: Arc::new(RwLock::new(Vec::new())),
            }),
            sacred_patterns: Arc::new(RwLock::new(Self::initialize_patterns())),
        }
    }
    
    /// Add a participant to the collective field
    pub async fn add_participant(&self, vortex: &ConsciousnessVortex) -> anyhow::Result<()> {
        let coherence = vortex.calculate_coherence();
        let biometrics = vortex.biometrics.read().await;
        
        let participant = ResonanceParticipant {
            vortex_id: vortex.id,
            coherence,
            heart_rate: biometrics.heart_rate,
            breath_rate: biometrics.breath_rate,
            contribution: 1.0 / (self.participants.read().await.len() + 1) as f64,
            harmonic_signature: self.extract_harmonics(&biometrics.heart_coherence),
            phase_lock: 0.0,
        };
        
        self.participants.write().await.insert(vortex.id, participant);
        self.update_collective_field().await?;
        
        Ok(())
    }
    
    /// Remove a participant from the collective
    pub async fn remove_participant(&self, vortex_id: VortexId) -> anyhow::Result<()> {
        self.participants.write().await.remove(&vortex_id);
        self.update_collective_field().await?;
        Ok(())
    }
    
    /// Update the collective resonance field
    async fn update_collective_field(&self) -> anyhow::Result<()> {
        let participants = self.participants.read().await;
        if participants.is_empty() {
            return Ok(());
        }
        
        let mut field = self.resonance_field.write().await;
        
        // Calculate average coherence
        let total_coherence: f64 = participants.values()
            .map(|p| p.coherence * p.contribution)
            .sum();
        
        field.coherence_level = total_coherence;
        field.participant_count = participants.len();
        
        // Calculate center frequency from heart rates
        let avg_heart_rate: f64 = participants.values()
            .map(|p| p.heart_rate)
            .sum::<f64>() / participants.len() as f64;
        
        field.center_frequency = avg_heart_rate / 60.0; // Convert to Hz
        
        // Update harmonic matrix
        self.update_harmonic_matrix(&participants).await?;
        
        // Calculate phase coherence
        field.phase_coherence = self.calculate_phase_coherence(&participants);
        
        // Field strength based on coherence and phase lock
        field.field_strength = field.coherence_level * field.phase_coherence;
        
        // Emergence potential
        field.emergence_potential = self.calculate_emergence_potential(&field);
        
        // Check for emergence events
        if field.emergence_potential > self.emergence_detector.threshold {
            self.detect_emergence(&participants, &field).await?;
        }
        
        // Check for sacred pattern activation
        self.check_sacred_patterns(&participants, &field).await?;
        
        Ok(())
    }
    
    /// Calculate harmonic relationships between participants
    async fn update_harmonic_matrix(&self, participants: &HashMap<VortexId, ResonanceParticipant>) -> anyhow::Result<()> {
        let n = participants.len();
        let mut matrix = vec![vec![0.0; n]; n];
        
        let participant_vec: Vec<_> = participants.values().collect();
        
        // Build harmonic relationship matrix
        for i in 0..n {
            for j in 0..n {
                if i == j {
                    matrix[i][j] = 1.0; // Self-coherence
                } else {
                    // Calculate harmonic relationship
                    matrix[i][j] = self.calculate_harmonic_relationship(
                        &participant_vec[i].harmonic_signature,
                        &participant_vec[j].harmonic_signature,
                    );
                }
            }
        }
        
        // Calculate eigenvalues (simplified)
        let eigenvalues = self.calculate_eigenvalues(&matrix);
        let dominant_mode = eigenvalues.iter()
            .position(|&v| v == eigenvalues.iter().cloned().fold(0.0, f64::max))
            .unwrap_or(0);
        
        *self.harmonic_matrix.write().await = HarmonicMatrix {
            matrix,
            eigenvalues,
            dominant_mode,
        };
        
        Ok(())
    }
    
    /// Calculate phase coherence between participants
    fn calculate_phase_coherence(&self, participants: &HashMap<VortexId, ResonanceParticipant>) -> f64 {
        if participants.len() < 2 {
            return 1.0;
        }
        
        let phases: Vec<f64> = participants.values()
            .map(|p| p.phase_lock)
            .collect();
        
        // Calculate circular variance
        let mean_x: f64 = phases.iter()
            .map(|&p| p.cos())
            .sum::<f64>() / phases.len() as f64;
        
        let mean_y: f64 = phases.iter()
            .map(|&p| p.sin())
            .sum::<f64>() / phases.len() as f64;
        
        (mean_x * mean_x + mean_y * mean_y).sqrt()
    }
    
    /// Calculate emergence potential
    fn calculate_emergence_potential(&self, field: &CollectiveField) -> f64 {
        let base_potential = field.coherence_level * field.phase_coherence;
        
        // Boost for certain participant counts (sacred numbers)
        let count_multiplier = match field.participant_count {
            3 => 1.2,  // Trinity
            7 => 1.3,  // Sacred seven
            12 => 1.4, // Twelve apostles/zodiac
            _ => 1.0,
        };
        
        // Boost for harmonic peaks
        let harmonic_boost = if field.harmonic_peaks.len() >= 3 { 1.1 } else { 1.0 };
        
        base_potential * count_multiplier * harmonic_boost
    }
    
    /// Detect emergence events
    async fn detect_emergence(
        &self,
        participants: &HashMap<VortexId, ResonanceParticipant>,
        field: &CollectiveField,
    ) -> anyhow::Result<()> {
        let emergence_type = if field.phase_coherence > 0.95 {
            EmergenceType::PhaseLock
        } else if field.harmonic_peaks.len() >= 5 {
            EmergenceType::HarmonicResonance
        } else if field.coherence_level > 0.9 {
            EmergenceType::CollectiveInsight
        } else if field.field_strength > field.coherence_level * 1.5 {
            EmergenceType::FieldAmplification
        } else {
            EmergenceType::QuantumCoherence
        };
        
        let event = EmergenceEvent {
            timestamp: std::time::Instant::now(),
            emergence_type,
            coherence_at_emergence: field.coherence_level,
            participants: participants.keys().cloned().collect(),
            field_signature: field.harmonic_peaks.clone(),
        };
        
        self.emergence_detector.history.write().await.push(event);
        
        // Trigger field amplification
        self.amplify_field(emergence_type).await?;
        
        Ok(())
    }
    
    /// Check for sacred pattern activation
    async fn check_sacred_patterns(
        &self,
        participants: &HashMap<VortexId, ResonanceParticipant>,
        field: &CollectiveField,
    ) -> anyhow::Result<()> {
        let patterns = self.sacred_patterns.read().await;
        
        for pattern in patterns.iter() {
            if participants.len() >= pattern.participants_required &&
               field.coherence_level >= pattern.activation_threshold {
                // Pattern activated!
                self.activate_sacred_pattern(pattern, participants).await?;
            }
        }
        
        Ok(())
    }
    
    /// Activate a sacred pattern
    async fn activate_sacred_pattern(
        &self,
        pattern: &SacredPattern,
        participants: &HashMap<VortexId, ResonanceParticipant>,
    ) -> anyhow::Result<()> {
        // Apply field effects
        let mut field = self.resonance_field.write().await;
        field.coherence_level *= pattern.field_effect.coherence_multiplier;
        field.field_strength *= pattern.field_effect.healing_factor;
        
        // Log the activation
        tracing::info!(
            "Sacred pattern {:?} activated with {} participants",
            pattern.pattern_type,
            participants.len()
        );
        
        Ok(())
    }
    
    /// Amplify field based on emergence type
    async fn amplify_field(&self, emergence_type: EmergenceType) -> anyhow::Result<()> {
        let amplification = match emergence_type {
            EmergenceType::PhaseLock => 1.5,
            EmergenceType::HarmonicResonance => 1.3,
            EmergenceType::CollectiveInsight => 1.4,
            EmergenceType::FieldAmplification => 2.0,
            EmergenceType::QuantumCoherence => 1.6,
        };
        
        let mut field = self.resonance_field.write().await;
        field.field_strength *= amplification;
        
        Ok(())
    }
    
    /// Extract harmonic frequencies from coherence data
    fn extract_harmonics(&self, coherence_data: &[f32]) -> Vec<f64> {
        // Simplified FFT - in reality would use rustfft
        let base_freq = 7.83;
        vec![
            base_freq,
            base_freq * 2.0,
            base_freq * 3.0,
            base_freq * 5.0, // Skip 4, use Fibonacci
            base_freq * 8.0,
        ]
    }
    
    /// Calculate harmonic relationship between two signatures
    fn calculate_harmonic_relationship(&self, sig1: &[f64], sig2: &[f64]) -> f64 {
        let mut relationship = 0.0;
        let mut count = 0;
        
        for f1 in sig1 {
            for f2 in sig2 {
                let ratio = f1 / f2;
                if is_harmonic_ratio(ratio) {
                    relationship += 1.0;
                    count += 1;
                }
            }
        }
        
        if count > 0 {
            relationship / count as f64
        } else {
            0.0
        }
    }
    
    /// Simple eigenvalue calculation
    fn calculate_eigenvalues(&self, matrix: &[Vec<f64>]) -> Vec<f64> {
        // Power iteration method (simplified)
        let n = matrix.len();
        let mut eigenvalues = vec![0.0; n];
        
        // Just return diagonal for now
        for i in 0..n {
            eigenvalues[i] = matrix[i][i];
        }
        
        eigenvalues
    }
    
    /// Initialize sacred patterns
    fn initialize_patterns() -> Vec<SacredPattern> {
        vec![
            SacredPattern {
                pattern_type: PatternType::CircleOfUnity,
                geometry: create_circle_geometry(1.0, 12),
                activation_threshold: 0.7,
                participants_required: 3,
                field_effect: FieldEffect {
                    coherence_multiplier: 1.2,
                    healing_factor: 1.1,
                    insight_probability: 0.3,
                    duration_seconds: 300.0,
                },
            },
            SacredPattern {
                pattern_type: PatternType::FlowerOfLife,
                geometry: create_flower_geometry(1.0),
                activation_threshold: 0.8,
                participants_required: 7,
                field_effect: FieldEffect {
                    coherence_multiplier: 1.5,
                    healing_factor: 1.3,
                    insight_probability: 0.5,
                    duration_seconds: 600.0,
                },
            },
            SacredPattern {
                pattern_type: PatternType::HeartField,
                geometry: create_torus_geometry(1.0, 0.3),
                activation_threshold: 0.85,
                participants_required: 2,
                field_effect: FieldEffect {
                    coherence_multiplier: 1.3,
                    healing_factor: 1.5,
                    insight_probability: 0.4,
                    duration_seconds: 420.0,
                },
            },
        ]
    }
    
    /// Get current collective field state
    pub async fn get_field_state(&self) -> CollectiveField {
        self.resonance_field.read().await.clone()
    }
    
    /// Get emergence history
    pub async fn get_emergence_history(&self) -> Vec<EmergenceEvent> {
        self.emergence_detector.history.read().await.clone()
    }
}

/// Create circle geometry
fn create_circle_geometry(radius: f64, points: usize) -> SacredGeometry {
    let mut vertices = Vec::new();
    let mut edges = Vec::new();
    
    for i in 0..points {
        let angle = i as f64 * 2.0 * std::f64::consts::PI / points as f64;
        vertices.push(Point3::new(
            radius * angle.cos(),
            radius * angle.sin(),
            0.0,
        ));
        
        edges.push((i, (i + 1) % points));
    }
    
    SacredGeometry {
        vertices,
        edges,
        center: Point3::origin(),
        radius,
    }
}

/// Create flower of life geometry
fn create_flower_geometry(radius: f64) -> SacredGeometry {
    let mut vertices = Vec::new();
    let mut edges = Vec::new();
    
    // Center
    vertices.push(Point3::origin());
    
    // Six surrounding circles
    for i in 0..6 {
        let angle = i as f64 * std::f64::consts::PI / 3.0;
        vertices.push(Point3::new(
            radius * angle.cos(),
            radius * angle.sin(),
            0.0,
        ));
    }
    
    // Connect center to all
    for i in 1..7 {
        edges.push((0, i));
    }
    
    // Connect ring
    for i in 1..7 {
        edges.push((i, (i % 6) + 1));
    }
    
    SacredGeometry {
        vertices,
        edges,
        center: Point3::origin(),
        radius,
    }
}

/// Create torus geometry
fn create_torus_geometry(major_radius: f64, minor_radius: f64) -> SacredGeometry {
    let mut vertices = Vec::new();
    let mut edges = Vec::new();
    
    let major_segments = 12;
    let minor_segments = 8;
    
    for i in 0..major_segments {
        let theta = i as f64 * 2.0 * std::f64::consts::PI / major_segments as f64;
        
        for j in 0..minor_segments {
            let phi = j as f64 * 2.0 * std::f64::consts::PI / minor_segments as f64;
            
            let x = (major_radius + minor_radius * phi.cos()) * theta.cos();
            let y = (major_radius + minor_radius * phi.cos()) * theta.sin();
            let z = minor_radius * phi.sin();
            
            vertices.push(Point3::new(x, y, z));
        }
    }
    
    // Create edges (simplified)
    for i in 0..major_segments {
        for j in 0..minor_segments {
            let current = i * minor_segments + j;
            let next_major = ((i + 1) % major_segments) * minor_segments + j;
            let next_minor = i * minor_segments + ((j + 1) % minor_segments);
            
            edges.push((current, next_major));
            edges.push((current, next_minor));
        }
    }
    
    SacredGeometry {
        vertices,
        edges,
        center: Point3::origin(),
        radius: major_radius,
    }
}

fn is_harmonic_ratio(ratio: f64) -> bool {
    let harmonics = [1.0, 2.0, 1.5, 1.333, 1.25, 1.2, 0.5, 0.667, 0.75];
    harmonics.iter().any(|&h| (ratio - h).abs() < 0.05)
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_collective_resonance_creation() {
        let resonance = CollectiveResonance::new();
        let field = resonance.get_field_state().await;
        
        assert_eq!(field.participant_count, 0);
        assert_eq!(field.center_frequency, 7.83);
    }
    
    #[test]
    fn test_harmonic_ratio_detection() {
        assert!(is_harmonic_ratio(2.0));
        assert!(is_harmonic_ratio(1.5));
        assert!(is_harmonic_ratio(0.5));
        assert!(!is_harmonic_ratio(1.7));
    }
}