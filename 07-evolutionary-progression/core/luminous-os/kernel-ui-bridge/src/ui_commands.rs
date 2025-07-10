// UI Commands - Sacred Interaction Protocol
// "Every gesture shapes the field"

use crate::KernelCommand;
use stillpoint_kernel::PatternType;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Extended UI commands with sacred interaction support
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UICommand {
    // Basic kernel commands
    Kernel(KernelCommand),
    
    // Visualization control
    SetVisualizationMode(VisualizationMode),
    SetRenderQuality(RenderQuality),
    ToggleAudioFeedback(bool),
    SetColorScheme(ColorScheme),
    
    // Sacred gestures
    SacredGesture(GestureType),
    DrawPattern(PatternDrawing),
    VoiceCommand(VoiceIntent),
    
    // Field interaction
    TouchField(TouchPoint),
    DragField(DragGesture),
    PinchField(PinchGesture),
    
    // Meditation controls
    BeginBreathing(BreathingPattern),
    SetIntention(String),
    RingBell(BellType),
    
    // Group coordination
    InviteParticipant(String),
    ShareWisdom(String),
    SynchronizeWith(Uuid),
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum VisualizationMode {
    Particles,
    CoherenceField,
    NetworkGraph,
    SacredGeometry,
    Hybrid,
    Minimal,
    Immersive,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum RenderQuality {
    Low,
    Medium,
    High,
    Ultra,
    Adaptive,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum ColorScheme {
    Cosmic,      // Deep space blues and purples
    Earth,       // Natural greens and browns
    Fire,        // Warm reds and oranges
    Water,       // Cool blues and teals
    Spirit,      // Ethereal whites and violets
    Rainbow,     // Full spectrum
    Monochrome,  // Grayscale
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GestureType {
    // Hand gestures
    Mudra(MudraType),
    CircularMotion { radius: f32, clockwise: bool },
    InfinitySign,
    HeartShape,
    
    // Body movements
    Bow,
    HandsToHeart,
    ArmsOpen,
    
    // Sacred symbols
    DrawSymbol(String),
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum MudraType {
    Gyan,        // Wisdom
    Dhyana,      // Meditation
    Anjali,      // Prayer
    Lotus,       // Opening
    Shuni,       // Patience
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatternDrawing {
    pub points: Vec<[f32; 2]>,
    pub closed: bool,
    pub sacred_number: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoiceIntent {
    pub transcription: String,
    pub intent_type: IntentType,
    pub confidence: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum IntentType {
    SetCoherence,
    ActivatePattern,
    ShareWisdom,
    RequestHealing,
    ExpressGratitude,
    AskQuestion,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct TouchPoint {
    pub x: f32,
    pub y: f32,
    pub pressure: f32,
    pub timestamp: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DragGesture {
    pub start: TouchPoint,
    pub current: TouchPoint,
    pub velocity: [f32; 2],
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PinchGesture {
    pub center: [f32; 2],
    pub scale: f32,
    pub rotation: f32,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum BreathingPattern {
    Coherent,     // 5-5 breathing
    Box,          // 4-4-4-4
    FourSevenEight, // 4-7-8
    Circular,     // Continuous
    Natural,      // Follow your rhythm
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum BellType {
    Tibetan,
    Crystal,
    Temple,
    Gong,
    Chime,
}

/// Command processor for handling UI interactions
pub struct CommandProcessor {
    gesture_recognizer: GestureRecognizer,
    voice_processor: VoiceProcessor,
    sacred_validator: SacredValidator,
}

struct GestureRecognizer {
    gesture_threshold: f32,
    pattern_database: Vec<GesturePattern>,
}

struct VoiceProcessor {
    wake_words: Vec<String>,
    intent_patterns: Vec<IntentPattern>,
}

struct SacredValidator {
    sacred_numbers: Vec<u32>,
    golden_ratio: f32,
}

struct GesturePattern {
    name: String,
    points: Vec<[f32; 2]>,
    tolerance: f32,
}

struct IntentPattern {
    intent: IntentType,
    keywords: Vec<String>,
    patterns: Vec<String>,
}

impl CommandProcessor {
    pub fn new() -> Self {
        Self {
            gesture_recognizer: GestureRecognizer::new(),
            voice_processor: VoiceProcessor::new(),
            sacred_validator: SacredValidator::new(),
        }
    }
    
    /// Process UI command and convert to kernel command if needed
    pub fn process_command(&self, command: UICommand) -> Option<KernelCommand> {
        match command {
            UICommand::Kernel(cmd) => Some(cmd),
            
            UICommand::SacredGesture(gesture) => {
                self.process_gesture(gesture)
            }
            
            UICommand::VoiceCommand(intent) => {
                self.process_voice_command(intent)
            }
            
            UICommand::SetIntention(intention) => {
                // Convert intention to coherence target
                let coherence = self.intention_to_coherence(&intention);
                Some(KernelCommand::SetTargetCoherence(coherence))
            }
            
            UICommand::BeginBreathing(pattern) => {
                // Breathing affects field strength
                let strength = self.breathing_to_field_strength(pattern);
                Some(KernelCommand::AdjustFieldStrength(strength))
            }
            
            _ => None,
        }
    }
    
    fn process_gesture(&self, gesture: GestureType) -> Option<KernelCommand> {
        match gesture {
            GestureType::Mudra(MudraType::Anjali) => {
                Some(KernelCommand::ActivatePattern(PatternType::CircleOfUnity))
            }
            GestureType::HeartShape => {
                Some(KernelCommand::ActivatePattern(PatternType::HeartField))
            }
            GestureType::InfinitySign => {
                Some(KernelCommand::SetTargetCoherence(1.0))
            }
            _ => None,
        }
    }
    
    fn process_voice_command(&self, intent: VoiceIntent) -> Option<KernelCommand> {
        match intent.intent_type {
            IntentType::SetCoherence => {
                // Extract number from transcription
                if let Some(value) = self.extract_number(&intent.transcription) {
                    Some(KernelCommand::SetTargetCoherence(value))
                } else {
                    None
                }
            }
            IntentType::ActivatePattern => {
                // Match pattern name
                if intent.transcription.contains("flower") {
                    Some(KernelCommand::ActivatePattern(PatternType::FlowerOfLife))
                } else if intent.transcription.contains("heart") {
                    Some(KernelCommand::ActivatePattern(PatternType::HeartField))
                } else {
                    None
                }
            }
            _ => None,
        }
    }
    
    fn intention_to_coherence(&self, intention: &str) -> f64 {
        // Map intentions to coherence levels
        let keywords = intention.to_lowercase();
        
        if keywords.contains("peace") || keywords.contains("calm") {
            0.7
        } else if keywords.contains("love") || keywords.contains("heart") {
            0.85
        } else if keywords.contains("unity") || keywords.contains("oneness") {
            0.95
        } else if keywords.contains("healing") {
            0.8
        } else {
            0.75 // Default
        }
    }
    
    fn breathing_to_field_strength(&self, pattern: BreathingPattern) -> f64 {
        match pattern {
            BreathingPattern::Coherent => 1.2,
            BreathingPattern::Box => 1.1,
            BreathingPattern::FourSevenEight => 1.15,
            BreathingPattern::Circular => 1.3,
            BreathingPattern::Natural => 1.0,
        }
    }
    
    fn extract_number(&self, text: &str) -> Option<f64> {
        // Simple number extraction
        text.split_whitespace()
            .find_map(|word| word.parse::<f64>().ok())
            .map(|n| n.clamp(0.0, 1.0))
    }
}

impl GestureRecognizer {
    fn new() -> Self {
        Self {
            gesture_threshold: 0.8,
            pattern_database: Self::load_patterns(),
        }
    }
    
    fn load_patterns() -> Vec<GesturePattern> {
        vec![
            GesturePattern {
                name: "circle".to_string(),
                points: generate_circle_points(32),
                tolerance: 0.15,
            },
            GesturePattern {
                name: "infinity".to_string(),
                points: generate_infinity_points(64),
                tolerance: 0.2,
            },
        ]
    }
}

impl VoiceProcessor {
    fn new() -> Self {
        Self {
            wake_words: vec![
                "luminous".to_string(),
                "activate".to_string(),
                "sacred".to_string(),
            ],
            intent_patterns: Self::load_intent_patterns(),
        }
    }
    
    fn load_intent_patterns() -> Vec<IntentPattern> {
        vec![
            IntentPattern {
                intent: IntentType::SetCoherence,
                keywords: vec!["coherence".to_string(), "set".to_string(), "level".to_string()],
                patterns: vec!["set coherence to".to_string()],
            },
            IntentPattern {
                intent: IntentType::ActivatePattern,
                keywords: vec!["activate".to_string(), "pattern".to_string()],
                patterns: vec!["activate * pattern".to_string()],
            },
        ]
    }
}

impl SacredValidator {
    fn new() -> Self {
        Self {
            sacred_numbers: vec![3, 7, 12, 13, 22, 33, 40, 108, 144],
            golden_ratio: 1.618033988,
        }
    }
    
    pub fn is_sacred_number(&self, n: u32) -> bool {
        self.sacred_numbers.contains(&n)
    }
    
    pub fn is_golden_ratio(&self, ratio: f32) -> bool {
        (ratio - self.golden_ratio).abs() < 0.01
    }
}

fn generate_circle_points(count: usize) -> Vec<[f32; 2]> {
    (0..count).map(|i| {
        let angle = i as f32 * 2.0 * std::f32::consts::PI / count as f32;
        [angle.cos(), angle.sin()]
    }).collect()
}

fn generate_infinity_points(count: usize) -> Vec<[f32; 2]> {
    (0..count).map(|i| {
        let t = i as f32 * 2.0 * std::f32::consts::PI / count as f32;
        let scale = 2.0 / (3.0 - t.cos());
        [scale * t.cos(), scale * t.sin() * (t * 0.5).cos()]
    }).collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_command_processor_creation() {
        let processor = CommandProcessor::new();
        assert!(processor.sacred_validator.is_sacred_number(7));
    }
    
    #[test]
    fn test_intention_to_coherence() {
        let processor = CommandProcessor::new();
        assert_eq!(processor.intention_to_coherence("peace and calm"), 0.7);
        assert_eq!(processor.intention_to_coherence("infinite love"), 0.85);
    }
}