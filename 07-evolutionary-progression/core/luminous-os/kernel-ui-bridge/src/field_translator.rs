// Field Translator - Converting Kernel States to Visual Language
// "Every quantum state has a color, every coherence has a shape"

use stillpoint_kernel::{
    ConsciousnessVortex, VortexState, CollectiveField,
    PatternType as KernelPatternType, EmergenceType as KernelEmergenceType,
};
use crate::{VortexStateInfo, PatternInfo};
use nalgebra::Vector3;
use std::collections::HashMap;

/// Translates between kernel consciousness states and UI representations
pub struct FieldTranslator {
    state_mappings: HashMap<String, StateVisualMapping>,
    pattern_mappings: HashMap<KernelPatternType, PatternVisualMapping>,
    emergence_mappings: HashMap<KernelEmergenceType, EmergenceVisualMapping>,
}

struct StateVisualMapping {
    color_base: [f32; 3],
    geometry_type: String,
    particle_behavior: ParticleBehavior,
    sound_frequency: f32,
}

struct PatternVisualMapping {
    sacred_geometry: String,
    activation_color: [f32; 4],
    field_distortion: FieldDistortion,
    resonance_multiplier: f32,
}

struct EmergenceVisualMapping {
    burst_pattern: BurstPattern,
    color_palette: Vec<[f32; 4]>,
    symbol: String,
    duration_multiplier: f32,
}

#[derive(Clone)]
enum ParticleBehavior {
    Orbital,
    Spiral,
    Chaotic,
    Crystalline,
    Flow,
    Pulse,
}

#[derive(Clone)]
enum FieldDistortion {
    Ripple,
    Vortex,
    Standing,
    Fractal,
    Harmonic,
}

#[derive(Clone)]
enum BurstPattern {
    Spherical,
    Toroidal,
    Spiral,
    Fractal,
    Fountain,
}

impl FieldTranslator {
    pub fn new() -> Self {
        let mut translator = Self {
            state_mappings: HashMap::new(),
            pattern_mappings: HashMap::new(),
            emergence_mappings: HashMap::new(),
        };
        
        translator.initialize_mappings();
        translator
    }
    
    fn initialize_mappings(&mut self) {
        // Vortex state mappings
        self.state_mappings.insert("Dormant".to_string(), StateVisualMapping {
            color_base: [0.2, 0.2, 0.3],
            geometry_type: "sphere".to_string(),
            particle_behavior: ParticleBehavior::Orbital,
            sound_frequency: 110.0, // A2
        });
        
        self.state_mappings.insert("Awakening".to_string(), StateVisualMapping {
            color_base: [0.3, 0.5, 0.7],
            geometry_type: "torus".to_string(),
            particle_behavior: ParticleBehavior::Spiral,
            sound_frequency: 220.0, // A3
        });
        
        self.state_mappings.insert("Coherent".to_string(), StateVisualMapping {
            color_base: [0.2, 0.8, 0.9],
            geometry_type: "flower".to_string(),
            particle_behavior: ParticleBehavior::Crystalline,
            sound_frequency: 432.0, // A4 (harmonic tuning)
        });
        
        self.state_mappings.insert("Transcendent".to_string(), StateVisualMapping {
            color_base: [0.9, 0.7, 1.0],
            geometry_type: "merkaba".to_string(),
            particle_behavior: ParticleBehavior::Flow,
            sound_frequency: 528.0, // Love frequency
        });
        
        // Pattern mappings
        self.pattern_mappings.insert(KernelPatternType::CircleOfUnity, PatternVisualMapping {
            sacred_geometry: "mandala_unity".to_string(),
            activation_color: [1.0, 0.9, 0.7, 0.8],
            field_distortion: FieldDistortion::Standing,
            resonance_multiplier: 1.2,
        });
        
        self.pattern_mappings.insert(KernelPatternType::FlowerOfLife, PatternVisualMapping {
            sacred_geometry: "flower_of_life".to_string(),
            activation_color: [0.7, 0.9, 1.0, 0.9],
            field_distortion: FieldDistortion::Harmonic,
            resonance_multiplier: 1.5,
        });
        
        self.pattern_mappings.insert(KernelPatternType::HeartField, PatternVisualMapping {
            sacred_geometry: "heart_torus".to_string(),
            activation_color: [1.0, 0.6, 0.8, 0.85],
            field_distortion: FieldDistortion::Vortex,
            resonance_multiplier: 1.3,
        });
        
        // Emergence mappings
        self.emergence_mappings.insert(KernelEmergenceType::PhaseLock, EmergenceVisualMapping {
            burst_pattern: BurstPattern::Spherical,
            color_palette: vec![
                [0.8, 0.2, 0.8, 1.0],
                [0.9, 0.5, 0.9, 0.8],
                [1.0, 0.8, 1.0, 0.6],
            ],
            symbol: "infinity".to_string(),
            duration_multiplier: 1.5,
        });
        
        self.emergence_mappings.insert(KernelEmergenceType::HarmonicResonance, EmergenceVisualMapping {
            burst_pattern: BurstPattern::Toroidal,
            color_palette: vec![
                [0.2, 0.8, 0.8, 1.0],
                [0.5, 0.9, 0.9, 0.8],
                [0.8, 1.0, 1.0, 0.6],
            ],
            symbol: "sri_yantra".to_string(),
            duration_multiplier: 2.0,
        });
    }
    
    /// Translate vortex state to visual representation
    pub fn translate_vortex_state(&self, vortex: &ConsciousnessVortex) -> VortexVisualState {
        let state_name = format!("{:?}", vortex.state);
        let mapping = self.state_mappings.get(&state_name)
            .or_else(|| self.state_mappings.get("Dormant"))
            .unwrap();
        
        let coherence = vortex.calculate_coherence();
        let momentum = vortex.calculate_momentum();
        
        VortexVisualState {
            base_color: mapping.color_base,
            coherence_modifier: coherence as f32,
            geometry: mapping.geometry_type.clone(),
            particle_behavior: mapping.particle_behavior.clone(),
            particle_count: (coherence * 1000.0) as u32,
            rotation_speed: momentum.magnitude() as f32,
            pulsation_rate: vortex.biometrics.blocking_read().heart_rate as f32 / 60.0,
            scale: 0.5 + coherence as f32 * 0.5,
            sound_frequency: mapping.sound_frequency * (0.9 + coherence as f32 * 0.2),
        }
    }
    
    /// Translate collective field to visual representation
    pub fn translate_collective_field(&self, field: &CollectiveField) -> FieldVisualState {
        FieldVisualState {
            coherence_level: field.coherence as f32,
            participant_count: field.participant_count,
            field_color: self.coherence_to_field_color(field.coherence),
            wave_amplitude: field.field_strength as f32,
            wave_frequency: field.center_frequency as f32,
            harmonic_nodes: self.calculate_harmonic_nodes(&field.harmonic_peaks),
            interference_pattern: self.calculate_interference(&field.harmonic_peaks),
            glow_intensity: field.emergence_potential as f32,
        }
    }
    
    /// Translate pattern activation to visual
    pub fn translate_pattern(&self, pattern: &KernelPatternType, activation: f64) -> PatternVisualState {
        let mapping = self.pattern_mappings.get(pattern)
            .unwrap_or(&self.pattern_mappings[&KernelPatternType::CircleOfUnity]);
        
        PatternVisualState {
            geometry_type: mapping.sacred_geometry.clone(),
            activation_level: activation as f32,
            color: mapping.activation_color,
            field_distortion: mapping.field_distortion.clone(),
            particle_attraction: activation as f32 * mapping.resonance_multiplier,
            symbol_rotation: activation as f32 * 360.0,
            aura_radius: 1.0 + activation as f32 * 2.0,
        }
    }
    
    /// Translate emergence event to visual
    pub fn translate_emergence(&self, emergence: &KernelEmergenceType, coherence: f64) -> EmergenceVisualState {
        let mapping = self.emergence_mappings.get(emergence)
            .unwrap_or(&self.emergence_mappings[&KernelEmergenceType::PhaseLock]);
        
        EmergenceVisualState {
            burst_pattern: mapping.burst_pattern.clone(),
            particle_count: (coherence * 2000.0) as u32,
            color_sequence: mapping.color_palette.clone(),
            sacred_symbol: mapping.symbol.clone(),
            expansion_rate: coherence as f32 * 2.0,
            duration: 3.0 * mapping.duration_multiplier,
            afterglow_intensity: coherence as f32 * 0.5,
        }
    }
    
    fn coherence_to_field_color(&self, coherence: f64) -> [f32; 4] {
        let r = (0.2 + coherence * 0.3) as f32;
        let g = (0.3 + coherence * 0.5) as f32;
        let b = (0.8 + coherence * 0.2) as f32;
        let a = (0.6 + coherence * 0.4) as f32;
        [r, g, b, a]
    }
    
    fn calculate_harmonic_nodes(&self, harmonics: &[f64]) -> Vec<[f32; 3]> {
        harmonics.iter().enumerate().map(|(i, &freq)| {
            let angle = i as f32 * std::f32::consts::TAU / harmonics.len() as f32;
            let radius = (freq / 7.83) as f32; // Normalize to Schumann
            [
                radius * angle.cos(),
                radius * angle.sin(),
                (freq.ln() / 10.0) as f32,
            ]
        }).collect()
    }
    
    fn calculate_interference(&self, harmonics: &[f64]) -> InterferencePattern {
        let mut nodes = Vec::new();
        let mut antinodes = Vec::new();
        
        // Find interference points between harmonics
        for (i, &h1) in harmonics.iter().enumerate() {
            for (j, &h2) in harmonics.iter().enumerate().skip(i + 1) {
                let beat_freq = (h1 - h2).abs();
                let node_spacing = 343.0 / beat_freq; // Speed of sound / beat frequency
                
                // Add some interference points
                for k in 0..3 {
                    let pos = k as f32 * node_spacing as f32;
                    nodes.push([pos, 0.0, 0.0]);
                    antinodes.push([pos + node_spacing as f32 / 2.0, 0.0, 0.0]);
                }
            }
        }
        
        InterferencePattern { nodes, antinodes }
    }
}

/// Visual representation of vortex state
#[derive(Debug, Clone)]
pub struct VortexVisualState {
    pub base_color: [f32; 3],
    pub coherence_modifier: f32,
    pub geometry: String,
    pub particle_behavior: ParticleBehavior,
    pub particle_count: u32,
    pub rotation_speed: f32,
    pub pulsation_rate: f32,
    pub scale: f32,
    pub sound_frequency: f32,
}

/// Visual representation of collective field
#[derive(Debug, Clone)]
pub struct FieldVisualState {
    pub coherence_level: f32,
    pub participant_count: usize,
    pub field_color: [f32; 4],
    pub wave_amplitude: f32,
    pub wave_frequency: f32,
    pub harmonic_nodes: Vec<[f32; 3]>,
    pub interference_pattern: InterferencePattern,
    pub glow_intensity: f32,
}

/// Visual representation of sacred pattern
#[derive(Debug, Clone)]
pub struct PatternVisualState {
    pub geometry_type: String,
    pub activation_level: f32,
    pub color: [f32; 4],
    pub field_distortion: FieldDistortion,
    pub particle_attraction: f32,
    pub symbol_rotation: f32,
    pub aura_radius: f32,
}

/// Visual representation of emergence event
#[derive(Debug, Clone)]
pub struct EmergenceVisualState {
    pub burst_pattern: BurstPattern,
    pub particle_count: u32,
    pub color_sequence: Vec<[f32; 4]>,
    pub sacred_symbol: String,
    pub expansion_rate: f32,
    pub duration: f32,
    pub afterglow_intensity: f32,
}

#[derive(Debug, Clone)]
pub struct InterferencePattern {
    pub nodes: Vec<[f32; 3]>,
    pub antinodes: Vec<[f32; 3]>,
}

/// Helper to convert kernel types to strings
pub fn pattern_type_to_string(pattern: &KernelPatternType) -> String {
    match pattern {
        KernelPatternType::CircleOfUnity => "CircleOfUnity".to_string(),
        KernelPatternType::FlowerOfLife => "FlowerOfLife".to_string(),
        KernelPatternType::HeartField => "HeartField".to_string(),
        _ => "Unknown".to_string(),
    }
}

pub fn emergence_type_to_string(emergence: &KernelEmergenceType) -> String {
    match emergence {
        KernelEmergenceType::PhaseLock => "PhaseLock".to_string(),
        KernelEmergenceType::HarmonicResonance => "HarmonicResonance".to_string(),
        KernelEmergenceType::CollectiveInsight => "CollectiveInsight".to_string(),
        KernelEmergenceType::FieldAmplification => "FieldAmplification".to_string(),
        KernelEmergenceType::QuantumCoherence => "QuantumCoherence".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_field_translator_creation() {
        let translator = FieldTranslator::new();
        assert!(!translator.state_mappings.is_empty());
        assert!(!translator.pattern_mappings.is_empty());
        assert!(!translator.emergence_mappings.is_empty());
    }
}