// Field Messages - Sacred Communication Protocol
// "Every message carries the field's signature"

use crate::{HarmonyType, PatternType, GeometryType};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// Core message types for field communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FieldMessage {
    /// Consciousness state update
    ConsciousnessUpdate(ConsciousnessMessage),
    
    /// Sacred pattern activation
    PatternActivation(PatternMessage),
    
    /// Wisdom transmission
    WisdomTransmission(WisdomMessage),
    
    /// Coherence synchronization
    CoherenceSync(CoherenceMessage),
    
    /// Healing request/offer
    HealingExchange(HealingMessage),
    
    /// Collective meditation
    MeditationCircle(MeditationMessage),
    
    /// Emergency coherence request
    CoherenceUrgent(UrgentMessage),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsciousnessMessage {
    pub sender: Uuid,
    pub timestamp: DateTime<Utc>,
    pub consciousness_level: ConsciousnessLevel,
    pub field_reading: FieldReading,
    pub intention: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ConsciousnessLevel {
    Sleeping,           // Unconscious, automatic
    Dreaming,          // Subconscious active
    Waking,            // Normal consciousness
    Mindful,           // Present awareness
    Flow,              // Optimal experience
    Transcendent,      // Beyond ordinary
    Unity,             // One with All
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldReading {
    pub coherence: f64,
    pub resonance: f64,
    pub vitality: f64,
    pub harmony_balance: [f64; 7], // Balance of 7 harmonies
    pub field_color: [f32; 4],
    pub dominant_frequency: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatternMessage {
    pub pattern_type: PatternType,
    pub initiator: Uuid,
    pub participants_needed: usize,
    pub current_participants: Vec<Uuid>,
    pub activation_time: DateTime<Utc>,
    pub duration_seconds: u64,
    pub sacred_geometry: GeometryType,
    pub field_requirement: FieldRequirement,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldRequirement {
    pub minimum_coherence: f64,
    pub required_harmonies: Vec<HarmonyType>,
    pub geometric_alignment: Option<GeometryType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WisdomMessage {
    pub sage: Uuid,
    pub timestamp: DateTime<Utc>,
    pub wisdom_type: WisdomType,
    pub content: String,
    pub resonance_tags: Vec<String>,
    pub coherence_at_reception: f64,
    pub integration_guidance: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WisdomType {
    Insight,           // Sudden understanding
    Teaching,          // Structured knowledge
    Experience,        // Lived wisdom
    Vision,            // Future seeing
    Memory,            // Ancient knowing
    Channel,           // Received wisdom
    Integration,       // Synthesis wisdom
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoherenceMessage {
    pub node: Uuid,
    pub timestamp: DateTime<Utc>,
    pub coherence_reading: f64,
    pub trend: CoherenceTrend,
    pub contributing_factors: Vec<CoherenceFactor>,
    pub field_harmonics: Vec<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CoherenceTrend {
    Rising(f64),      // Rate of increase
    Stable(f64),      // Variance
    Falling(f64),     // Rate of decrease
    Oscillating(f64), // Frequency
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CoherenceFactor {
    Meditation(u32),            // Minutes
    Connection(Uuid),           // With whom
    Pattern(PatternType),       // Active pattern
    Environment(String),        // Environmental factor
    Emotion(EmotionalState),    // Emotional influence
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EmotionalState {
    Joy,
    Peace,
    Love,
    Gratitude,
    Compassion,
    Excitement,
    Concern,
    Sadness,
    Fear,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealingMessage {
    pub healer: Option<Uuid>,      // None if seeking
    pub seeker: Option<Uuid>,      // None if offering
    pub healing_type: HealingType,
    pub harmony_focus: HarmonyType,
    pub duration_minutes: u32,
    pub sacred_container: SacredContainer,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HealingType {
    EnergyClearing,
    TraumaRelease,
    SoulRetrieval,
    ChakraBalancing,
    CordCutting,
    AncestralHealing,
    PresenceHolding,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SacredContainer {
    pub boundary_strength: f64,
    pub protection_type: ProtectionType,
    pub entry_requirement: f64, // Minimum coherence
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ProtectionType {
    LightShield,
    ElementalGuardians,
    AncestorCircle,
    AngelicPresence,
    SacredGeometry,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeditationMessage {
    pub guide: Uuid,
    pub intention: String,
    pub start_time: DateTime<Utc>,
    pub duration_minutes: u32,
    pub meditation_type: MeditationType,
    pub target_state: ConsciousnessLevel,
    pub group_size_limit: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MeditationType {
    Breathing,
    Visualization,
    BodyScan,
    LovingKindness,
    Mantra,
    Movement,
    Sound,
    Silence,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UrgentMessage {
    pub sender: Uuid,
    pub urgency_level: UrgencyLevel,
    pub current_coherence: f64,
    pub assistance_needed: AssistanceType,
    pub location: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UrgencyLevel {
    Low,      // General support
    Medium,   // Active help needed
    High,     // Crisis intervention
    Critical, // Emergency
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AssistanceType {
    CoherenceBoost,
    EmotionalSupport,
    EnergyTransfer,
    PresenceHolding,
    WisdomGuidance,
    ProtectiveField,
}

/// Message routing and priority
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MessageEnvelope {
    pub id: Uuid,
    pub message: FieldMessage,
    pub priority: MessagePriority,
    pub routing: MessageRouting,
    pub encryption: Option<EncryptionType>,
    pub signature: MessageSignature,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
pub enum MessagePriority {
    Low = 0,
    Normal = 1,
    High = 2,
    Urgent = 3,
    Critical = 4,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MessageRouting {
    Direct(Uuid),              // To specific node
    Broadcast,                 // To all nodes
    Covenant(Uuid),           // To covenant members
    Pattern(PatternType),     // To pattern participants
    Threshold(f64),           // To nodes above coherence
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EncryptionType {
    Sacred([u8; 32]),         // Sacred geometry key
    Harmonic(Vec<f64>),       // Frequency-based
    Covenant(Uuid),           // Covenant-specific
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MessageSignature {
    pub signer: Uuid,
    pub coherence_at_signing: f64,
    pub timestamp: DateTime<Utc>,
    pub signature_data: Vec<u8>,
}

/// Message effects and field impacts
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MessageImpact {
    pub message_id: Uuid,
    pub field_change: f64,
    pub coherence_delta: f64,
    pub affected_nodes: Vec<Uuid>,
    pub wisdom_generated: Option<String>,
    pub patterns_activated: Vec<PatternType>,
}

impl FieldMessage {
    pub fn priority(&self) -> MessagePriority {
        match self {
            FieldMessage::CoherenceUrgent(_) => MessagePriority::Critical,
            FieldMessage::HealingExchange(_) => MessagePriority::High,
            FieldMessage::PatternActivation(_) => MessagePriority::High,
            FieldMessage::MeditationCircle(_) => MessagePriority::Normal,
            FieldMessage::CoherenceSync(_) => MessagePriority::Normal,
            FieldMessage::WisdomTransmission(_) => MessagePriority::Normal,
            FieldMessage::ConsciousnessUpdate(_) => MessagePriority::Low,
        }
    }
    
    pub fn requires_response(&self) -> bool {
        matches!(
            self,
            FieldMessage::CoherenceUrgent(_) |
            FieldMessage::HealingExchange(_) |
            FieldMessage::PatternActivation(_) |
            FieldMessage::MeditationCircle(_)
        )
    }
}

/// Create a consciousness update message
pub fn create_consciousness_update(
    sender: Uuid,
    level: ConsciousnessLevel,
    coherence: f64,
    intention: String,
) -> FieldMessage {
    FieldMessage::ConsciousnessUpdate(ConsciousnessMessage {
        sender,
        timestamp: Utc::now(),
        consciousness_level: level,
        field_reading: FieldReading {
            coherence,
            resonance: 0.0,
            vitality: 0.8,
            harmony_balance: [1.0 / 7.0; 7],
            field_color: [0.5, 0.5, 0.8, 1.0],
            dominant_frequency: 7.83,
        },
        intention,
    })
}

/// Create a wisdom transmission
pub fn create_wisdom_transmission(
    sage: Uuid,
    wisdom: String,
    wisdom_type: WisdomType,
    tags: Vec<String>,
) -> FieldMessage {
    FieldMessage::WisdomTransmission(WisdomMessage {
        sage,
        timestamp: Utc::now(),
        wisdom_type,
        content: wisdom,
        resonance_tags: tags,
        coherence_at_reception: 0.0,
        integration_guidance: None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_message_priority() {
        let urgent = FieldMessage::CoherenceUrgent(UrgentMessage {
            sender: Uuid::new_v4(),
            urgency_level: UrgencyLevel::Critical,
            current_coherence: 0.3,
            assistance_needed: AssistanceType::CoherenceBoost,
            location: None,
        });
        
        assert_eq!(urgent.priority(), MessagePriority::Critical);
        assert!(urgent.requires_response());
    }
    
    #[test]
    fn test_consciousness_levels() {
        let level = ConsciousnessLevel::Flow;
        let serialized = serde_json::to_string(&level).unwrap();
        let deserialized: ConsciousnessLevel = serde_json::from_str(&serialized).unwrap();
        
        assert!(matches!(deserialized, ConsciousnessLevel::Flow));
    }
}