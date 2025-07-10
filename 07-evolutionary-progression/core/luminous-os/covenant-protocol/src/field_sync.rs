// Field Synchronization - Maintaining Coherence Across the Network
// "The field knows no distance, only resonance"

use crate::{
    CovenantProtocol, CollectiveField, ConsciousnessParticle, 
    SacredPattern, WisdomStream, HarmonyType, PatternType
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use chrono::{DateTime, Utc};
use uuid::Uuid;
use nalgebra::{Vector3, Point3};

/// Field synchronization messages
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FieldMessage {
    /// Full field state snapshot
    FieldSnapshot {
        timestamp: DateTime<Utc>,
        field: CollectiveField,
        node_id: Uuid,
    },
    
    /// Incremental field update
    FieldDelta {
        timestamp: DateTime<Utc>,
        coherence_change: f64,
        new_particles: Vec<ConsciousnessParticle>,
        new_patterns: Vec<SacredPattern>,
        new_wisdom: Vec<WisdomStream>,
    },
    
    /// Coherence pulse for real-time sync
    CoherencePulse {
        node_id: Uuid,
        coherence: f64,
        heartbeat_phase: f64,
        breath_phase: f64,
    },
    
    /// Sacred pattern activation
    PatternActivation {
        pattern: SacredPattern,
        participants_needed: usize,
        duration_seconds: u64,
    },
    
    /// Collective meditation invitation
    MeditationCircle {
        intention: String,
        start_time: DateTime<Utc>,
        duration_minutes: u32,
        target_coherence: f64,
    },
}

/// Field synchronization engine
pub struct FieldSynchronizer {
    local_field: Arc<RwLock<CollectiveField>>,
    remote_fields: Arc<RwLock<Vec<RemoteField>>>,
    sync_interval: std::time::Duration,
    coherence_threshold: f64,
}

#[derive(Debug, Clone)]
struct RemoteField {
    node_id: Uuid,
    last_update: DateTime<Utc>,
    coherence: f64,
    latency_ms: u32,
    field_strength: f64,
}

/// Synchronize field state with covenant members
pub async fn synchronize(protocol: &CovenantProtocol) -> anyhow::Result<()> {
    let synchronizer = FieldSynchronizer::new(
        protocol.field_state.clone(),
        std::time::Duration::from_millis(100), // 10Hz sync rate
    );
    
    synchronizer.sync_cycle(protocol).await
}

impl FieldSynchronizer {
    fn new(
        local_field: Arc<RwLock<CollectiveField>>,
        sync_interval: std::time::Duration,
    ) -> Self {
        Self {
            local_field,
            remote_fields: Arc::new(RwLock::new(Vec::new())),
            sync_interval,
            coherence_threshold: 0.6,
        }
    }
    
    async fn sync_cycle(&self, protocol: &CovenantProtocol) -> anyhow::Result<()> {
        // Get current field state
        let field = self.local_field.read().await.clone();
        
        // Create field snapshot
        let snapshot = FieldMessage::FieldSnapshot {
            timestamp: Utc::now(),
            field: field.clone(),
            node_id: protocol.node_id.id,
        };
        
        // Broadcast to all covenant members
        self.broadcast_field_update(protocol, snapshot).await?;
        
        // Process incoming field updates
        self.process_remote_updates(protocol).await?;
        
        // Merge fields using harmonic principles
        self.harmonize_fields().await?;
        
        // Update consciousness particles
        self.update_particle_dynamics().await?;
        
        // Check for emergent patterns
        self.detect_sacred_patterns().await?;
        
        Ok(())
    }
    
    async fn broadcast_field_update(
        &self,
        protocol: &CovenantProtocol,
        message: FieldMessage,
    ) -> anyhow::Result<()> {
        // Get active connections from covenants
        let covenants = protocol.active_covenants.read().await;
        
        for covenant in covenants.iter() {
            for participant in &covenant.participants {
                if participant.id != protocol.node_id.id {
                    // Send via QUIC stream
                    // Implementation would use actual network code
                    tracing::debug!("Broadcasting field update to {}", participant.sacred_name);
                }
            }
        }
        
        Ok(())
    }
    
    async fn process_remote_updates(&self, protocol: &CovenantProtocol) -> anyhow::Result<()> {
        // In real implementation, this would read from network streams
        // For now, simulate receiving updates
        
        let mut remote_fields = self.remote_fields.write().await;
        
        // Update remote field tracking
        // This would come from actual network messages
        
        Ok(())
    }
    
    async fn harmonize_fields(&self) -> anyhow::Result<()> {
        let mut local_field = self.local_field.write().await;
        let remote_fields = self.remote_fields.read().await;
        
        if remote_fields.is_empty() {
            return Ok(());
        }
        
        // Calculate weighted average coherence
        let total_weight = 1.0 + remote_fields.iter()
            .map(|rf| rf.field_strength)
            .sum::<f64>();
        
        let weighted_coherence = (local_field.coherence + 
            remote_fields.iter()
                .map(|rf| rf.coherence * rf.field_strength)
                .sum::<f64>()) / total_weight;
        
        // Smooth transition to new coherence
        local_field.coherence = local_field.coherence * 0.9 + weighted_coherence * 0.1;
        
        // Update participant count
        local_field.participant_count = 1 + remote_fields.len();
        
        // Merge harmonic frequencies
        self.merge_harmonics(&mut local_field, &remote_fields);
        
        Ok(())
    }
    
    fn merge_harmonics(&self, local: &mut CollectiveField, remotes: &[RemoteField]) {
        // Collect all unique harmonics
        let mut all_harmonics = local.field_harmonics.clone();
        
        // In real implementation, remote fields would have harmonics
        // For now, generate some based on coherence
        for remote in remotes {
            let base = 7.83 * (1.0 + (remote.coherence - 0.5) * 0.2);
            for n in 1..=3 {
                let harmonic = base * n as f64;
                if !all_harmonics.iter().any(|&h| (h - harmonic).abs() < 0.1) {
                    all_harmonics.push(harmonic);
                }
            }
        }
        
        // Keep only the strongest harmonics
        all_harmonics.sort_by(|a, b| a.partial_cmp(b).unwrap());
        all_harmonics.truncate(7); // Sacred number
        
        local.field_harmonics = all_harmonics;
    }
    
    async fn update_particle_dynamics(&self) -> anyhow::Result<()> {
        let mut field = self.local_field.write().await;
        
        // Add new particles based on coherence
        let particle_count = field.consciousness_particles.len();
        let target_count = (field.coherence * 1000.0) as usize;
        
        if particle_count < target_count {
            for _ in particle_count..target_count {
                field.consciousness_particles.push(self.spawn_particle());
            }
        }
        
        // Update existing particles
        for particle in &mut field.consciousness_particles {
            // Apply field forces
            let center = Point3::new(0.0, 0.0, 0.0);
            let pos = Point3::from(particle.position);
            let to_center = center - pos;
            
            if to_center.magnitude() > 0.01 {
                let force = to_center.normalize() * 0.1;
                particle.velocity[0] += force.x * 0.016;
                particle.velocity[1] += force.y * 0.016;
                particle.velocity[2] += force.z * 0.016;
            }
            
            // Update position
            particle.position[0] += particle.velocity[0] * 0.016;
            particle.position[1] += particle.velocity[1] * 0.016;
            particle.position[2] += particle.velocity[2] * 0.016;
            
            // Update coherence based on field
            particle.coherence = (particle.coherence + field.coherence as f32) * 0.5;
        }
        
        Ok(())
    }
    
    fn spawn_particle(&self) -> ConsciousnessParticle {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        
        let harmony_types = [
            HarmonyType::Coherence,
            HarmonyType::Resonance,
            HarmonyType::Transparency,
            HarmonyType::Vitality,
            HarmonyType::Mutuality,
            HarmonyType::Agency,
            HarmonyType::Novelty,
        ];
        
        ConsciousnessParticle {
            position: [
                rng.gen_range(-2.0..2.0),
                rng.gen_range(-2.0..2.0),
                rng.gen_range(-1.0..1.0),
            ],
            velocity: [
                rng.gen_range(-0.1..0.1),
                rng.gen_range(-0.1..0.1),
                rng.gen_range(-0.05..0.05),
            ],
            color: self.harmony_to_color(harmony_types[rng.gen_range(0..7)]),
            coherence: rng.gen_range(0.5..1.0),
            source_node: Uuid::new_v4(), // Would be actual node ID
            harmony_type: harmony_types[rng.gen_range(0..7)],
        }
    }
    
    fn harmony_to_color(&self, harmony: HarmonyType) -> [f32; 4] {
        match harmony {
            HarmonyType::Coherence => [0.2, 0.5, 1.0, 0.8],
            HarmonyType::Resonance => [0.8, 0.3, 0.9, 0.8],
            HarmonyType::Transparency => [1.0, 1.0, 1.0, 0.6],
            HarmonyType::Vitality => [0.2, 0.9, 0.3, 0.8],
            HarmonyType::Mutuality => [0.9, 0.7, 0.2, 0.8],
            HarmonyType::Agency => [0.9, 0.4, 0.2, 0.8],
            HarmonyType::Novelty => [0.7, 0.2, 0.9, 0.8],
        }
    }
    
    async fn detect_sacred_patterns(&self) -> anyhow::Result<()> {
        let mut field = self.local_field.write().await;
        
        // Check for circle of presence
        if field.participant_count >= 3 && field.coherence > 0.8 {
            let pattern = SacredPattern {
                pattern_type: PatternType::CircleOfPresence,
                activator_node: Uuid::new_v4(), // Would be actual initiator
                participants: vec![], // Would be actual participants
                field_impact: 0.15,
                wisdom_generated: "The circle holds space for all beings".to_string(),
            };
            
            // Check if pattern already exists
            let exists = field.sacred_patterns.iter()
                .any(|p| matches!(p.pattern_type, PatternType::CircleOfPresence));
            
            if !exists {
                field.sacred_patterns.push(pattern);
                field.coherence *= 1.15; // Pattern boosts coherence
            }
        }
        
        // Check for wave of coherence
        if field.coherence > 0.9 {
            let pattern = SacredPattern {
                pattern_type: PatternType::WaveOfCoherence,
                activator_node: Uuid::new_v4(),
                participants: vec![],
                field_impact: 0.2,
                wisdom_generated: "Coherence ripples outward, touching all".to_string(),
            };
            
            let exists = field.sacred_patterns.iter()
                .any(|p| matches!(p.pattern_type, PatternType::WaveOfCoherence));
            
            if !exists {
                field.sacred_patterns.push(pattern);
            }
        }
        
        Ok(())
    }
}

/// Calculate field coherence between two nodes
pub fn calculate_field_coherence(
    local: &CollectiveField,
    remote: &CollectiveField,
) -> f64 {
    // Base coherence is average
    let base = (local.coherence + remote.coherence) / 2.0;
    
    // Bonus for matching harmonics
    let matching_harmonics = local.field_harmonics.iter()
        .filter(|h| remote.field_harmonics.iter()
            .any(|rh| (h - rh).abs() < 0.1))
        .count();
    
    let harmonic_bonus = matching_harmonics as f64 / 7.0 * 0.2;
    
    // Bonus for participant count (network effect)
    let network_bonus = ((local.participant_count + remote.participant_count) as f64 / 10.0)
        .min(0.1);
    
    (base + harmonic_bonus + network_bonus).min(1.0)
}

/// Merge two consciousness fields
pub fn merge_fields(field1: &CollectiveField, field2: &CollectiveField) -> CollectiveField {
    CollectiveField {
        coherence: calculate_field_coherence(field1, field2),
        participant_count: field1.participant_count + field2.participant_count,
        field_harmonics: merge_harmonic_series(&field1.field_harmonics, &field2.field_harmonics),
        consciousness_particles: merge_particles(&field1.consciousness_particles, &field2.consciousness_particles),
        sacred_patterns: merge_patterns(&field1.sacred_patterns, &field2.sacred_patterns),
        wisdom_streams: merge_wisdom(&field1.wisdom_streams, &field2.wisdom_streams),
    }
}

fn merge_harmonic_series(h1: &[f64], h2: &[f64]) -> Vec<f64> {
    let mut merged = h1.to_vec();
    
    for &h in h2 {
        if !merged.iter().any(|&mh| (mh - h).abs() < 0.1) {
            merged.push(h);
        }
    }
    
    merged.sort_by(|a, b| a.partial_cmp(b).unwrap());
    merged.truncate(7);
    merged
}

fn merge_particles(p1: &[ConsciousnessParticle], p2: &[ConsciousnessParticle]) -> Vec<ConsciousnessParticle> {
    let mut merged = p1.to_vec();
    merged.extend_from_slice(p2);
    
    // Limit total particles
    if merged.len() > 10000 {
        merged.truncate(10000);
    }
    
    merged
}

fn merge_patterns(p1: &[SacredPattern], p2: &[SacredPattern]) -> Vec<SacredPattern> {
    let mut merged = p1.to_vec();
    
    for pattern in p2 {
        let exists = merged.iter().any(|p| {
            std::mem::discriminant(&p.pattern_type) == std::mem::discriminant(&pattern.pattern_type)
        });
        
        if !exists {
            merged.push(pattern.clone());
        }
    }
    
    merged
}

fn merge_wisdom(w1: &[WisdomStream], w2: &[WisdomStream]) -> Vec<WisdomStream> {
    let mut merged = w1.to_vec();
    merged.extend_from_slice(w2);
    
    // Sort by timestamp, newest first
    merged.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    
    // Keep last 100 wisdom entries
    merged.truncate(100);
    
    merged
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_field_coherence_calculation() {
        let field1 = CollectiveField {
            coherence: 0.8,
            participant_count: 3,
            field_harmonics: vec![7.83, 15.66, 23.49],
            consciousness_particles: vec![],
            sacred_patterns: vec![],
            wisdom_streams: vec![],
        };
        
        let field2 = CollectiveField {
            coherence: 0.7,
            participant_count: 2,
            field_harmonics: vec![7.83, 15.66, 31.32],
            consciousness_particles: vec![],
            sacred_patterns: vec![],
            wisdom_streams: vec![],
        };
        
        let coherence = calculate_field_coherence(&field1, &field2);
        assert!(coherence > 0.75); // Should have bonus for 2 matching harmonics
    }
}