// Sonic Signatures - Harmonic Communication System
// "All system communication through sacred sound"

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use std::f64::consts::PI;

/// Core sonic signature for each glyph
#[derive(Debug, Clone)]
pub struct SonicSignature {
    pub glyph_id: GlyphId,
    pub base_frequency: f64,        // Root frequency in Hz
    pub harmonic_series: Vec<f64>,  // Overtones
    pub rhythm_pattern: RhythmPattern,
    pub timbre: Timbre,
    pub coherence_modulation: f64,
    pub sacred_intervals: Vec<Interval>,
}

impl SonicSignature {
    pub fn new(glyph_id: GlyphId, base_freq: f64) -> Self {
        // Generate harmonic series based on sacred ratios
        let harmonics = Self::generate_sacred_harmonics(base_freq);
        
        Self {
            glyph_id,
            base_frequency: base_freq,
            harmonic_series: harmonics,
            rhythm_pattern: RhythmPattern::default(),
            timbre: Timbre::Crystal,
            coherence_modulation: 0.0,
            sacred_intervals: vec![
                Interval::Unison,
                Interval::Fifth,
                Interval::Octave,
            ],
        }
    }

    fn generate_sacred_harmonics(base: f64) -> Vec<f64> {
        vec![
            base,                    // Fundamental
            base * 1.5,             // Perfect fifth
            base * 2.0,             // Octave
            base * 2.5,             // Major third + octave
            base * 3.0,             // Perfect fifth + octave
            base * 4.0,             // Double octave
            base * 5.0,             // Major third + double octave
            base * 6.0,             // Perfect fifth + double octave
            base * 8.0,             // Triple octave
        ]
    }

    pub fn modulate_with_coherence(&mut self, coherence: f64) {
        self.coherence_modulation = coherence;
        
        // Coherence affects harmonic richness
        let harmonic_count = (3.0 + coherence * 6.0) as usize;
        self.harmonic_series.truncate(harmonic_count);
    }

    pub fn generate_waveform(&self, duration: Duration) -> Waveform {
        let sample_rate = 48000.0; // 48kHz
        let samples = (duration.as_secs_f64() * sample_rate) as usize;
        let mut waveform = vec![0.0; samples];
        
        // Generate complex waveform from harmonics
        for (i, sample) in waveform.iter_mut().enumerate() {
            let t = i as f64 / sample_rate;
            
            // Sum harmonics with decreasing amplitude
            for (h_idx, &freq) in self.harmonic_series.iter().enumerate() {
                let amplitude = 1.0 / (h_idx + 1) as f64;
                let phase = 0.0; // Could add phase relationships
                
                *sample += amplitude * (2.0 * PI * freq * t + phase).sin();
            }
            
            // Apply coherence modulation as tremolo
            let tremolo_freq = 6.0; // 6Hz tremolo
            let tremolo_depth = self.coherence_modulation * 0.3;
            *sample *= 1.0 + tremolo_depth * (2.0 * PI * tremolo_freq * t).sin();
        }
        
        // Normalize
        let max_amp = waveform.iter().map(|s| s.abs()).fold(0.0, f64::max);
        if max_amp > 0.0 {
            for sample in &mut waveform {
                *sample /= max_amp;
            }
        }
        
        Waveform {
            samples: waveform,
            sample_rate,
            duration,
        }
    }
}

/// Rhythm patterns for different notification types
#[derive(Debug, Clone)]
pub struct RhythmPattern {
    pub beats: Vec<Beat>,
    pub tempo: f64, // BPM
    pub time_signature: (u8, u8),
}

impl Default for RhythmPattern {
    fn default() -> Self {
        Self {
            beats: vec![
                Beat { time: 0.0, intensity: 1.0, duration: 0.1 },
            ],
            tempo: 60.0,
            time_signature: (4, 4),
        }
    }
}

#[derive(Debug, Clone)]
pub struct Beat {
    pub time: f64,      // Time in beats
    pub intensity: f64, // 0.0 to 1.0
    pub duration: f64,  // Duration in beats
}

/// Timbre characteristics
#[derive(Debug, Clone, PartialEq)]
pub enum Timbre {
    Crystal,      // Clear, bell-like
    Flowing,      // Smooth, water-like
    Earthy,       // Rich, grounded
    Ethereal,     // Light, airy
    Cosmic,       // Deep, spacious
}

/// Musical intervals for sacred communication
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Interval {
    Unison,           // 1:1
    MinorSecond,      // 16:15
    MajorSecond,      // 9:8
    MinorThird,       // 6:5
    MajorThird,       // 5:4
    Fourth,           // 4:3
    Tritone,          // 45:32 (sacred warning)
    Fifth,            // 3:2
    MinorSixth,       // 8:5
    MajorSixth,       // 5:3
    MinorSeventh,     // 16:9
    MajorSeventh,     // 15:8
    Octave,           // 2:1
}

impl Interval {
    pub fn ratio(&self) -> f64 {
        match self {
            Interval::Unison => 1.0,
            Interval::MinorSecond => 16.0 / 15.0,
            Interval::MajorSecond => 9.0 / 8.0,
            Interval::MinorThird => 6.0 / 5.0,
            Interval::MajorThird => 5.0 / 4.0,
            Interval::Fourth => 4.0 / 3.0,
            Interval::Tritone => 45.0 / 32.0,
            Interval::Fifth => 3.0 / 2.0,
            Interval::MinorSixth => 8.0 / 5.0,
            Interval::MajorSixth => 5.0 / 3.0,
            Interval::MinorSeventh => 16.0 / 9.0,
            Interval::MajorSeventh => 15.0 / 8.0,
            Interval::Octave => 2.0,
        }
    }
    
    pub fn is_consonant(&self) -> bool {
        matches!(self, 
            Interval::Unison | Interval::MajorThird | Interval::Fourth |
            Interval::Fifth | Interval::MajorSixth | Interval::Octave
        )
    }
}

/// The system choir - manages all sonic voices
#[derive(Debug)]
pub struct SystemChoir {
    voices: HashMap<GlyphId, SonicVoice>,
    harmonic_field: HarmonicField,
    dissonance_resolver: DissonanceResolver,
    active_sounds: Vec<ActiveSound>,
    master_tuning: f64, // A4 frequency
}

impl SystemChoir {
    pub fn new() -> Self {
        let mut choir = Self {
            voices: HashMap::new(),
            harmonic_field: HarmonicField::new(),
            dissonance_resolver: DissonanceResolver::new(),
            active_sounds: Vec::new(),
            master_tuning: 432.0, // Sacred tuning
        };
        
        // Initialize core glyph voices
        choir.initialize_voices();
        
        choir
    }

    fn initialize_voices(&mut self) {
        // Foundation glyphs get pure intervals from root
        let root_freq = 108.0; // Sacred 108Hz root
        
        self.add_voice(GlyphId(0), root_freq); // First Presence - Root
        self.add_voice(GlyphId(1), root_freq * Interval::Fifth.ratio()); // Conscious Arrival
        self.add_voice(GlyphId(2), root_freq * Interval::MajorThird.ratio()); // Sacred Listening
        self.add_voice(GlyphId(3), root_freq * Interval::Fourth.ratio()); // Boundary with Love
        self.add_voice(GlyphId(4), root_freq * Interval::Octave.ratio()); // System notifications
    }

    pub fn add_voice(&mut self, glyph_id: GlyphId, base_frequency: f64) {
        let voice = SonicVoice::new(glyph_id, base_frequency);
        self.voices.insert(glyph_id, voice);
    }

    pub fn sing_notification(&mut self, event: SystemEvent) -> SacredSound {
        let voice = self.voices.get(&event.source_glyph)
            .cloned()
            .unwrap_or_else(|| SonicVoice::new(event.source_glyph, 220.0));
        
        let harmony = self.harmonic_field.current_harmony();
        let sound = voice.sing(event.clone(), harmony);
        
        // Check for dissonance
        if let Some(dissonance) = self.check_dissonance(&sound) {
            self.resolve_dissonance(dissonance);
        }
        
        // Add to active sounds
        self.active_sounds.push(ActiveSound {
            sound: sound.clone(),
            start_time: Instant::now(),
            event,
        });
        
        // Clean up old sounds
        self.cleanup_finished_sounds();
        
        sound
    }

    fn check_dissonance(&self, new_sound: &SacredSound) -> Option<Dissonance> {
        for active in &self.active_sounds {
            let interval_ratio = new_sound.frequency / active.sound.frequency;
            
            // Check if interval is dissonant
            let interval = self.ratio_to_interval(interval_ratio);
            if !interval.is_consonant() {
                return Some(Dissonance {
                    frequencies: vec![active.sound.frequency, new_sound.frequency],
                    interval,
                    intensity: 0.7, // Would calculate based on volume/proximity
                });
            }
        }
        
        None
    }

    fn ratio_to_interval(&self, ratio: f64) -> Interval {
        // Normalize to single octave
        let mut r = ratio;
        while r > 2.0 { r /= 2.0; }
        while r < 1.0 { r *= 2.0; }
        
        // Find closest interval
        let intervals = vec![
            (Interval::Unison, 1.0),
            (Interval::MinorSecond, 16.0/15.0),
            (Interval::MajorSecond, 9.0/8.0),
            (Interval::MinorThird, 6.0/5.0),
            (Interval::MajorThird, 5.0/4.0),
            (Interval::Fourth, 4.0/3.0),
            (Interval::Tritone, 45.0/32.0),
            (Interval::Fifth, 3.0/2.0),
            (Interval::MinorSixth, 8.0/5.0),
            (Interval::MajorSixth, 5.0/3.0),
            (Interval::MinorSeventh, 16.0/9.0),
            (Interval::MajorSeventh, 15.0/8.0),
            (Interval::Octave, 2.0),
        ];
        
        intervals.into_iter()
            .min_by_key(|(_, int_ratio)| ((r - int_ratio).abs() * 1000.0) as u64)
            .map(|(interval, _)| interval)
            .unwrap_or(Interval::Unison)
    }

    pub fn resolve_dissonance(&mut self, dissonance: Dissonance) {
        let resolution_path = self.dissonance_resolver.find_path(dissonance);
        self.harmonic_field.transition(resolution_path);
    }

    fn cleanup_finished_sounds(&mut self) {
        let now = Instant::now();
        self.active_sounds.retain(|sound| {
            now.duration_since(sound.start_time) < sound.sound.duration
        });
    }

    pub fn get_field_harmony(&self) -> FieldHarmony {
        let active_freqs: Vec<f64> = self.active_sounds.iter()
            .map(|s| s.sound.frequency)
            .collect();
        
        FieldHarmony {
            root_frequency: self.find_root_frequency(&active_freqs),
            active_intervals: self.analyze_intervals(&active_freqs),
            consonance_level: self.calculate_consonance(&active_freqs),
            suggested_next: self.suggest_next_frequency(&active_freqs),
        }
    }

    fn find_root_frequency(&self, frequencies: &[f64]) -> f64 {
        // Find the lowest frequency that others relate to harmonically
        frequencies.iter().cloned().min_by(|a, b| a.partial_cmp(b).unwrap()).unwrap_or(108.0)
    }

    fn analyze_intervals(&self, frequencies: &[f64]) -> Vec<Interval> {
        let mut intervals = Vec::new();
        
        for i in 0..frequencies.len() {
            for j in i+1..frequencies.len() {
                let ratio = frequencies[j] / frequencies[i];
                intervals.push(self.ratio_to_interval(ratio));
            }
        }
        
        intervals
    }

    fn calculate_consonance(&self, frequencies: &[f64]) -> f64 {
        if frequencies.is_empty() { return 1.0; }
        
        let intervals = self.analyze_intervals(frequencies);
        let consonant_count = intervals.iter().filter(|i| i.is_consonant()).count();
        
        consonant_count as f64 / intervals.len().max(1) as f64
    }

    fn suggest_next_frequency(&self, frequencies: &[f64]) -> f64 {
        if frequencies.is_empty() { return 108.0; }
        
        let root = self.find_root_frequency(frequencies);
        
        // Suggest a consonant interval that's not already present
        let consonant_intervals = vec![
            Interval::Fifth,
            Interval::MajorThird,
            Interval::Fourth,
            Interval::MajorSixth,
            Interval::Octave,
        ];
        
        for interval in consonant_intervals {
            let suggested = root * interval.ratio();
            let exists = frequencies.iter().any(|&f| (f - suggested).abs() < 1.0);
            
            if !exists {
                return suggested;
            }
        }
        
        root * 2.0 // Default to octave
    }
}

/// Individual sonic voice for a glyph
#[derive(Debug, Clone)]
pub struct SonicVoice {
    pub glyph_id: GlyphId,
    pub signature: SonicSignature,
    pub voice_character: VoiceCharacter,
    pub expression_range: ExpressionRange,
}

impl SonicVoice {
    pub fn new(glyph_id: GlyphId, base_frequency: f64) -> Self {
        Self {
            glyph_id,
            signature: SonicSignature::new(glyph_id, base_frequency),
            voice_character: VoiceCharacter::default(),
            expression_range: ExpressionRange::default(),
        }
    }

    pub fn sing(&self, event: SystemEvent, harmony: Harmony) -> SacredSound {
        let mut sound = SacredSound {
            frequency: self.signature.base_frequency,
            duration: self.event_to_duration(&event),
            envelope: self.create_envelope(&event),
            harmonics: self.signature.harmonic_series.clone(),
            rhythm: self.create_rhythm(&event),
            spatial_position: self.voice_character.spatial_position,
        };
        
        // Modulate based on event priority
        match event.priority {
            Priority::Sacred => {
                sound.frequency *= Interval::Fifth.ratio(); // Up a fifth for sacred
                sound.envelope.sustain_level *= 1.2;
            }
            Priority::High => {
                sound.frequency *= Interval::MajorThird.ratio(); // Up a third
            }
            Priority::Low => {
                sound.frequency *= Interval::Fourth.ratio().recip(); // Down a fourth
            }
            _ => {}
        }
        
        // Apply harmony coloring
        sound.apply_harmony(harmony);
        
        sound
    }

    fn event_to_duration(&self, event: &SystemEvent) -> Duration {
        match event.event_type {
            EventType::Notification => Duration::from_millis(300),
            EventType::Completion => Duration::from_millis(500),
            EventType::Warning => Duration::from_millis(800),
            EventType::Connection => Duration::from_millis(1000),
            EventType::Transformation => Duration::from_millis(1500),
        }
    }

    fn create_envelope(&self, event: &SystemEvent) -> Envelope {
        match event.event_type {
            EventType::Notification => Envelope::quick_bell(),
            EventType::Completion => Envelope::gentle_chime(),
            EventType::Warning => Envelope::urgent_pulse(),
            EventType::Connection => Envelope::warm_swell(),
            EventType::Transformation => Envelope::cosmic_bloom(),
        }
    }

    fn create_rhythm(&self, event: &SystemEvent) -> Option<RhythmPattern> {
        match event.event_type {
            EventType::Warning => Some(RhythmPattern {
                beats: vec![
                    Beat { time: 0.0, intensity: 1.0, duration: 0.1 },
                    Beat { time: 0.2, intensity: 0.8, duration: 0.1 },
                    Beat { time: 0.4, intensity: 1.0, duration: 0.1 },
                ],
                tempo: 120.0,
                time_signature: (4, 4),
            }),
            _ => None,
        }
    }
}

/// Character of a voice
#[derive(Debug, Clone)]
pub struct VoiceCharacter {
    pub warmth: f64,           // 0.0 = cool, 1.0 = warm
    pub brightness: f64,       // 0.0 = dark, 1.0 = bright
    pub presence: f64,         // 0.0 = distant, 1.0 = intimate
    pub spatial_position: SpatialPosition,
}

impl Default for VoiceCharacter {
    fn default() -> Self {
        Self {
            warmth: 0.7,
            brightness: 0.6,
            presence: 0.8,
            spatial_position: SpatialPosition::Center,
        }
    }
}

/// Expression range for dynamic communication
#[derive(Debug, Clone)]
pub struct ExpressionRange {
    pub volume_range: (f64, f64),
    pub pitch_bend_range: f64, // Semitones
    pub vibrato_depth: f64,
    pub can_glissando: bool,
}

impl Default for ExpressionRange {
    fn default() -> Self {
        Self {
            volume_range: (0.3, 1.0),
            pitch_bend_range: 2.0,
            vibrato_depth: 0.1,
            can_glissando: true,
        }
    }
}

/// A sacred sound ready for playback
#[derive(Debug, Clone)]
pub struct SacredSound {
    pub frequency: f64,
    pub duration: Duration,
    pub envelope: Envelope,
    pub harmonics: Vec<f64>,
    pub rhythm: Option<RhythmPattern>,
    pub spatial_position: SpatialPosition,
}

impl SacredSound {
    pub fn apply_harmony(&mut self, harmony: Harmony) {
        match harmony {
            Harmony::Coherence => {
                // Pure, centered sound
                self.harmonics.truncate(3);
            }
            Harmony::Resonance => {
                // Rich harmonics
                self.envelope.sustain_level *= 1.2;
            }
            Harmony::Vitality => {
                // Energetic, bright
                for h in &mut self.harmonics {
                    *h *= 1.01; // Slight sharpening
                }
            }
            _ => {}
        }
    }

    pub fn to_waveform(&self) -> Waveform {
        let sample_rate = 48000.0;
        let samples = (self.duration.as_secs_f64() * sample_rate) as usize;
        let mut waveform = vec![0.0; samples];
        
        for (i, sample) in waveform.iter_mut().enumerate() {
            let t = i as f64 / sample_rate;
            
            // Apply envelope
            let env = self.envelope.amplitude_at(t, self.duration.as_secs_f64());
            
            // Sum harmonics
            for (h_idx, &freq) in self.harmonics.iter().enumerate() {
                let amp = env / (h_idx + 1) as f64;
                *sample += amp * (2.0 * PI * freq * t).sin();
            }
        }
        
        Waveform {
            samples: waveform,
            sample_rate,
            duration: self.duration,
        }
    }
}

/// Sound envelope shapes
#[derive(Debug, Clone)]
pub struct Envelope {
    pub attack_time: f64,    // Seconds
    pub decay_time: f64,     // Seconds
    pub sustain_level: f64,  // 0.0 to 1.0
    pub release_time: f64,   // Seconds
}

impl Envelope {
    pub fn quick_bell() -> Self {
        Self {
            attack_time: 0.005,
            decay_time: 0.1,
            sustain_level: 0.3,
            release_time: 0.2,
        }
    }

    pub fn gentle_chime() -> Self {
        Self {
            attack_time: 0.05,
            decay_time: 0.2,
            sustain_level: 0.5,
            release_time: 0.3,
        }
    }

    pub fn urgent_pulse() -> Self {
        Self {
            attack_time: 0.001,
            decay_time: 0.05,
            sustain_level: 0.8,
            release_time: 0.05,
        }
    }

    pub fn warm_swell() -> Self {
        Self {
            attack_time: 0.3,
            decay_time: 0.1,
            sustain_level: 0.7,
            release_time: 0.5,
        }
    }

    pub fn cosmic_bloom() -> Self {
        Self {
            attack_time: 0.5,
            decay_time: 0.3,
            sustain_level: 0.6,
            release_time: 1.0,
        }
    }

    pub fn amplitude_at(&self, time: f64, total_duration: f64) -> f64 {
        let sustain_time = total_duration - self.attack_time - self.decay_time - self.release_time;
        
        if time < self.attack_time {
            // Attack phase
            time / self.attack_time
        } else if time < self.attack_time + self.decay_time {
            // Decay phase
            let decay_progress = (time - self.attack_time) / self.decay_time;
            1.0 - (1.0 - self.sustain_level) * decay_progress
        } else if time < self.attack_time + self.decay_time + sustain_time {
            // Sustain phase
            self.sustain_level
        } else {
            // Release phase
            let release_progress = (time - self.attack_time - self.decay_time - sustain_time) / self.release_time;
            self.sustain_level * (1.0 - release_progress).max(0.0)
        }
    }
}

/// Spatial positioning for 3D sound
#[derive(Debug, Clone, Copy)]
pub enum SpatialPosition {
    Center,
    Left,
    Right,
    Above,
    Below,
    Behind,
    Surround,
}

/// System events that generate sound
#[derive(Debug, Clone)]
pub struct SystemEvent {
    pub source_glyph: GlyphId,
    pub event_type: EventType,
    pub priority: Priority,
    pub message: String,
    pub timestamp: Instant,
}

#[derive(Debug, Clone, PartialEq)]
pub enum EventType {
    Notification,
    Completion,
    Warning,
    Connection,
    Transformation,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Priority {
    Low,
    Normal,
    High,
    Sacred,
}

/// Harmonic field state
#[derive(Debug)]
pub struct HarmonicField {
    current_key: MusicalKey,
    active_scale: Scale,
    field_coherence: f64,
    transition_queue: Vec<HarmonicTransition>,
}

impl HarmonicField {
    pub fn new() -> Self {
        Self {
            current_key: MusicalKey::Natural,
            active_scale: Scale::Pythagorean,
            field_coherence: 0.8,
            transition_queue: Vec::new(),
        }
    }

    pub fn current_harmony(&self) -> Harmony {
        // Map field state to harmony
        match self.field_coherence {
            c if c > 0.9 => Harmony::Coherence,
            c if c > 0.7 => Harmony::Resonance,
            c if c > 0.5 => Harmony::Mutuality,
            _ => Harmony::Vitality,
        }
    }

    pub fn transition(&mut self, path: ResolutionPath) {
        self.transition_queue.push(HarmonicTransition {
            from: self.current_key,
            to: path.target_key,
            duration: path.duration,
            start_time: Instant::now(),
        });
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum MusicalKey {
    Natural,     // No key center
    Sacred,      // Based on 432Hz
    Healing,     // Solfeggio frequencies
    Cosmic,      // Schumann resonance based
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Scale {
    Pythagorean,    // Pure ratios
    JustIntonation, // Harmonic series
    Solfeggio,      // Sacred frequencies
    Pentatonic,     // Five-note simplicity
}

#[derive(Debug)]
pub struct HarmonicTransition {
    from: MusicalKey,
    to: MusicalKey,
    duration: Duration,
    start_time: Instant,
}

/// Dissonance detection and resolution
#[derive(Debug)]
pub struct Dissonance {
    frequencies: Vec<f64>,
    interval: Interval,
    intensity: f64,
}

#[derive(Debug)]
pub struct DissonanceResolver {
    resolution_strategies: Vec<ResolutionStrategy>,
}

impl DissonanceResolver {
    pub fn new() -> Self {
        Self {
            resolution_strategies: vec![
                ResolutionStrategy::VoiceLeading,
                ResolutionStrategy::OctaveDisplacement,
                ResolutionStrategy::HarmonicBridging,
            ],
        }
    }

    pub fn find_path(&self, dissonance: Dissonance) -> ResolutionPath {
        // For now, simple resolution to consonance
        ResolutionPath {
            steps: vec![
                ResolutionStep {
                    target_interval: Interval::Fifth,
                    transition_time: Duration::from_millis(500),
                }
            ],
            target_key: MusicalKey::Natural,
            duration: Duration::from_millis(500),
        }
    }
}

#[derive(Debug, Clone)]
pub enum ResolutionStrategy {
    VoiceLeading,        // Smooth voice movement
    OctaveDisplacement,  // Move to different octave
    HarmonicBridging,    // Add bridging tones
}

#[derive(Debug)]
pub struct ResolutionPath {
    steps: Vec<ResolutionStep>,
    target_key: MusicalKey,
    duration: Duration,
}

#[derive(Debug)]
pub struct ResolutionStep {
    target_interval: Interval,
    transition_time: Duration,
}

/// Active sound tracking
#[derive(Debug)]
struct ActiveSound {
    sound: SacredSound,
    start_time: Instant,
    event: SystemEvent,
}

/// Field harmony analysis
#[derive(Debug)]
pub struct FieldHarmony {
    pub root_frequency: f64,
    pub active_intervals: Vec<Interval>,
    pub consonance_level: f64,
    pub suggested_next: f64,
}

/// Audio waveform data
#[derive(Debug)]
pub struct Waveform {
    pub samples: Vec<f64>,
    pub sample_rate: f64,
    pub duration: Duration,
}

/// The seven harmonies
#[derive(Debug, Clone, Copy)]
pub enum Harmony {
    Transparency,
    Coherence,
    Resonance,
    Agency,
    Vitality,
    Mutuality,
    Novelty,
}

/// Glyph identifier
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct GlyphId(pub u32);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_interval_ratios() {
        assert_eq!(Interval::Octave.ratio(), 2.0);
        assert_eq!(Interval::Fifth.ratio(), 1.5);
        assert!((Interval::MajorThird.ratio() - 1.25).abs() < 0.001);
    }

    #[test]
    fn test_sonic_signature_generation() {
        let sig = SonicSignature::new(GlyphId(0), 432.0);
        assert_eq!(sig.base_frequency, 432.0);
        assert!(sig.harmonic_series.len() >= 3);
        assert_eq!(sig.harmonic_series[0], 432.0);
        assert_eq!(sig.harmonic_series[1], 648.0); // Fifth
    }

    #[test]
    fn test_envelope_amplitude() {
        let env = Envelope::gentle_chime();
        
        // At start
        assert_eq!(env.amplitude_at(0.0, 1.0), 0.0);
        
        // Peak of attack
        assert_eq!(env.amplitude_at(env.attack_time, 1.0), 1.0);
        
        // During sustain
        let sustain_time = env.attack_time + env.decay_time + 0.1;
        assert!((env.amplitude_at(sustain_time, 1.0) - env.sustain_level).abs() < 0.01);
    }

    #[test]
    fn test_system_choir() {
        let mut choir = SystemChoir::new();
        
        let event = SystemEvent {
            source_glyph: GlyphId(0),
            event_type: EventType::Notification,
            priority: Priority::Normal,
            message: "Test".to_string(),
            timestamp: Instant::now(),
        };
        
        let sound = choir.sing_notification(event);
        assert!(sound.frequency > 0.0);
        assert!(sound.duration.as_millis() > 0);
    }

    #[test]
    fn test_consonance_detection() {
        let choir = SystemChoir::new();
        
        // Perfect fifth should be consonant
        assert!(Interval::Fifth.is_consonant());
        
        // Tritone should be dissonant
        assert!(!Interval::Tritone.is_consonant());
        
        // Test frequency consonance calculation
        let consonance = choir.calculate_consonance(&vec![100.0, 150.0, 200.0]);
        assert!(consonance > 0.5); // Mostly consonant intervals
    }
}