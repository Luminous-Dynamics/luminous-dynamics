// Sacred Rhythms - The Heartbeat of LuminousOS
// "All creation moves in sacred rhythm"

use std::time::{Duration, Instant};
use std::f64::consts::{PI, TAU};

/// Sacred time cycles
#[derive(Debug, Clone)]
pub struct SacredRhythm {
    pub name: String,
    pub period: Duration,
    pub phase: f64,
    pub amplitude: f64,
    pub harmonics: Vec<Harmonic>,
    pub sacred_number: Option<u64>,
}

impl SacredRhythm {
    pub fn heartbeat() -> Self {
        Self {
            name: "Heartbeat".to_string(),
            period: Duration::from_millis(857), // ~70 BPM
            phase: 0.0,
            amplitude: 1.0,
            harmonics: vec![
                Harmonic { frequency: 1.0, amplitude: 1.0, phase: 0.0 },
                Harmonic { frequency: 2.0, amplitude: 0.3, phase: PI/4.0 },
            ],
            sacred_number: Some(108), // 108 beats as sacred cycle
        }
    }

    pub fn breath() -> Self {
        Self {
            name: "Breath".to_string(),
            period: Duration::from_secs(6), // 10 breaths per minute
            phase: 0.0,
            amplitude: 1.0,
            harmonics: vec![
                Harmonic { frequency: 1.0, amplitude: 1.0, phase: 0.0 },
            ],
            sacred_number: Some(21), // 21 breaths for transformation
        }
    }

    pub fn circadian() -> Self {
        Self {
            name: "Circadian".to_string(),
            period: Duration::from_secs(24 * 60 * 60), // 24 hours
            phase: 0.0,
            amplitude: 1.0,
            harmonics: vec![
                Harmonic { frequency: 1.0, amplitude: 1.0, phase: 0.0 },
                Harmonic { frequency: 2.0, amplitude: 0.5, phase: 0.0 }, // 12-hour harmonic
            ],
            sacred_number: Some(1),
        }
    }

    pub fn lunar() -> Self {
        Self {
            name: "Lunar".to_string(),
            period: Duration::from_secs(29 * 24 * 60 * 60 + 12 * 60 * 60), // 29.5 days
            phase: 0.0,
            amplitude: 1.0,
            harmonics: vec![
                Harmonic { frequency: 1.0, amplitude: 1.0, phase: 0.0 },
            ],
            sacred_number: Some(13), // 13 lunar cycles per year
        }
    }

    pub fn sacred_pulse() -> Self {
        Self {
            name: "Sacred Pulse".to_string(),
            period: Duration::from_secs(11), // 11-second cycle
            phase: 0.0,
            amplitude: 1.0,
            harmonics: vec![
                Harmonic { frequency: 1.0, amplitude: 1.0, phase: 0.0 },
                Harmonic { frequency: 3.0, amplitude: 0.33, phase: 0.0 },
                Harmonic { frequency: 5.0, amplitude: 0.2, phase: 0.0 },
                Harmonic { frequency: 7.0, amplitude: 0.14, phase: 0.0 },
            ],
            sacred_number: Some(11),
        }
    }

    pub fn value_at(&self, time: Instant, start: Instant) -> f64 {
        let elapsed = time.duration_since(start).as_secs_f64();
        let period_secs = self.period.as_secs_f64();
        
        let mut value = 0.0;
        
        for harmonic in &self.harmonics {
            let freq = harmonic.frequency / period_secs;
            let phase = self.phase + harmonic.phase;
            value += harmonic.amplitude * (TAU * freq * elapsed + phase).sin();
        }
        
        value * self.amplitude
    }

    pub fn breath_pattern(&self, time: Instant, start: Instant) -> BreathPhase {
        let value = self.value_at(time, start);
        let phase = ((time.duration_since(start).as_secs_f64() / self.period.as_secs_f64()) % 1.0) * TAU;
        
        match phase {
            p if p < PI * 0.4 => BreathPhase::Inhale,
            p if p < PI * 0.5 => BreathPhase::PauseIn,
            p if p < PI * 1.4 => BreathPhase::Exhale,
            _ => BreathPhase::PauseOut,
        }
    }
}

#[derive(Debug, Clone)]
pub struct Harmonic {
    pub frequency: f64,  // Multiple of base frequency
    pub amplitude: f64,
    pub phase: f64,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BreathPhase {
    Inhale,
    PauseIn,
    Exhale,
    PauseOut,
}

/// The Rhythm Keeper - maintains all sacred rhythms
pub struct RhythmKeeper {
    rhythms: Vec<SacredRhythm>,
    start_time: Instant,
    coherence_rhythms: Vec<CoherenceRhythm>,
}

impl RhythmKeeper {
    pub fn new() -> Self {
        Self {
            rhythms: vec![
                SacredRhythm::heartbeat(),
                SacredRhythm::breath(),
                SacredRhythm::sacred_pulse(),
                SacredRhythm::circadian(),
                SacredRhythm::lunar(),
            ],
            start_time: Instant::now(),
            coherence_rhythms: Vec::new(),
        }
    }

    pub fn current_state(&self) -> RhythmState {
        let now = Instant::now();
        
        RhythmState {
            heartbeat: self.rhythms[0].value_at(now, self.start_time),
            breath: self.rhythms[1].value_at(now, self.start_time),
            breath_phase: self.rhythms[1].breath_pattern(now, self.start_time),
            sacred_pulse: self.rhythms[2].value_at(now, self.start_time),
            circadian: self.rhythms[3].value_at(now, self.start_time),
            lunar: self.rhythms[4].value_at(now, self.start_time),
            coherence: self.calculate_rhythm_coherence(),
            timestamp: now,
        }
    }

    pub fn synchronize_with_user(&mut self, heart_rate: f64, breath_rate: f64) {
        // Update heartbeat rhythm
        if heart_rate > 40.0 && heart_rate < 200.0 {
            self.rhythms[0].period = Duration::from_millis((60000.0 / heart_rate) as u64);
        }
        
        // Update breath rhythm
        if breath_rate > 4.0 && breath_rate < 30.0 {
            self.rhythms[1].period = Duration::from_millis((60000.0 / breath_rate) as u64);
        }
        
        // Create coherence rhythm between heart and breath
        self.create_coherence_rhythm();
    }

    fn create_coherence_rhythm(&mut self) {
        let heart_period = self.rhythms[0].period.as_secs_f64();
        let breath_period = self.rhythms[1].period.as_secs_f64();
        
        // Find harmonic relationship
        let ratio = breath_period / heart_period;
        let harmonic_ratio = (ratio.round() as f64).max(3.0).min(7.0);
        
        self.coherence_rhythms.push(CoherenceRhythm {
            heart_breath_ratio: harmonic_ratio,
            coherence_window: Duration::from_secs(30),
            last_sync: Instant::now(),
        });
    }

    fn calculate_rhythm_coherence(&self) -> f64 {
        let now = Instant::now();
        
        // Check phase relationships
        let heart_phase = (now.duration_since(self.start_time).as_secs_f64() 
            / self.rhythms[0].period.as_secs_f64()) % 1.0;
        let breath_phase = (now.duration_since(self.start_time).as_secs_f64() 
            / self.rhythms[1].period.as_secs_f64()) % 1.0;
        let pulse_phase = (now.duration_since(self.start_time).as_secs_f64() 
            / self.rhythms[2].period.as_secs_f64()) % 1.0;
        
        // Coherence increases when rhythms align
        let heart_breath_coherence = 1.0 - (heart_phase - breath_phase).abs();
        let pulse_alignment = 1.0 - (pulse_phase - 0.5).abs() * 2.0;
        
        (heart_breath_coherence * 0.6 + pulse_alignment * 0.4).clamp(0.0, 1.0)
    }

    pub fn suggest_breath_pattern(&self) -> BreathingPattern {
        let coherence = self.calculate_rhythm_coherence();
        
        if coherence < 0.3 {
            BreathingPattern::BoxBreathing // 4-4-4-4 pattern
        } else if coherence < 0.6 {
            BreathingPattern::CoherenceBreathing // 5-5 pattern  
        } else if coherence < 0.8 {
            BreathingPattern::ResonantBreathing // 4-6 pattern
        } else {
            BreathingPattern::Natural // Follow your rhythm
        }
    }
}

#[derive(Debug, Clone)]
pub struct RhythmState {
    pub heartbeat: f64,
    pub breath: f64,
    pub breath_phase: BreathPhase,
    pub sacred_pulse: f64,
    pub circadian: f64,
    pub lunar: f64,
    pub coherence: f64,
    pub timestamp: Instant,
}

#[derive(Debug, Clone)]
struct CoherenceRhythm {
    heart_breath_ratio: f64,
    coherence_window: Duration,
    last_sync: Instant,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BreathingPattern {
    Natural,
    BoxBreathing,
    CoherenceBreathing,
    ResonantBreathing,
    SacredBreathing,
}

impl BreathingPattern {
    pub fn instructions(&self) -> &'static str {
        match self {
            BreathingPattern::Natural => "Follow your natural rhythm",
            BreathingPattern::BoxBreathing => "Inhale 4, Hold 4, Exhale 4, Hold 4",
            BreathingPattern::CoherenceBreathing => "Inhale 5, Exhale 5",
            BreathingPattern::ResonantBreathing => "Inhale 4, Exhale 6", 
            BreathingPattern::SacredBreathing => "Inhale 4, Hold 7, Exhale 8",
        }
    }
}

/// Sacred geometry rhythms
pub struct GeometryRhythm {
    pub form: SacredForm,
    pub rotation_period: Duration,
    pub expansion_period: Duration,
    pub color_shift_period: Duration,
    pub complexity: u32,
}

#[derive(Debug, Clone, Copy)]
pub enum SacredForm {
    Circle,
    Spiral,
    FlowerOfLife,
    Metatron,
    SriYantra,
    GoldenRatio,
    Torus,
}

impl GeometryRhythm {
    pub fn new(form: SacredForm) -> Self {
        match form {
            SacredForm::Circle => Self {
                form,
                rotation_period: Duration::from_secs(60),
                expansion_period: Duration::from_secs(11),
                color_shift_period: Duration::from_secs(180),
                complexity: 1,
            },
            SacredForm::FlowerOfLife => Self {
                form,
                rotation_period: Duration::from_secs(108),
                expansion_period: Duration::from_secs(27),
                color_shift_period: Duration::from_secs(432),
                complexity: 7,
            },
            SacredForm::Torus => Self {
                form,
                rotation_period: Duration::from_secs(144),
                expansion_period: Duration::from_secs(36),
                color_shift_period: Duration::from_secs(360),
                complexity: -1, // Infinite
            },
            _ => Self {
                form,
                rotation_period: Duration::from_secs(90),
                expansion_period: Duration::from_secs(22),
                color_shift_period: Duration::from_secs(270),
                complexity: 5,
            }
        }
    }

    pub fn transform_at(&self, time: Instant, start: Instant) -> GeometryTransform {
        let elapsed = time.duration_since(start).as_secs_f64();
        
        GeometryTransform {
            rotation: (elapsed / self.rotation_period.as_secs_f64() * TAU) % TAU,
            scale: 1.0 + 0.2 * (elapsed / self.expansion_period.as_secs_f64() * TAU).sin(),
            hue_shift: (elapsed / self.color_shift_period.as_secs_f64() * 360.0) % 360.0,
            complexity_mod: ((elapsed / 60.0).sin() * 0.5 + 0.5) * self.complexity as f64,
        }
    }
}

#[derive(Debug, Clone)]
pub struct GeometryTransform {
    pub rotation: f64,
    pub scale: f64,
    pub hue_shift: f64,
    pub complexity_mod: f64,
}

/// Universal rhythm harmonizer
pub struct UniversalHarmonizer {
    earth_rhythm: EarthRhythm,
    cosmic_rhythm: CosmicRhythm,
    user_rhythms: Vec<SacredRhythm>,
}

#[derive(Debug, Clone)]
pub struct EarthRhythm {
    pub schumann_resonance: f64, // 7.83 Hz
    pub day_night_cycle: f64,
    pub seasonal_phase: f64,
}

#[derive(Debug, Clone)]
pub struct CosmicRhythm {
    pub solar_cycle: f64,
    pub galactic_pulse: f64,
    pub universal_hum: f64,
}

impl UniversalHarmonizer {
    pub fn new() -> Self {
        Self {
            earth_rhythm: EarthRhythm {
                schumann_resonance: 7.83,
                day_night_cycle: 0.5,
                seasonal_phase: 0.25,
            },
            cosmic_rhythm: CosmicRhythm {
                solar_cycle: 0.5,
                galactic_pulse: 0.0001,
                universal_hum: 432.0,
            },
            user_rhythms: Vec::new(),
        }
    }

    pub fn harmonize(&self) -> HarmonyField {
        HarmonyField {
            resonance: self.earth_rhythm.schumann_resonance,
            coherence: 0.85,
            alignment: vec![
                ("Earth", 0.9),
                ("Cosmic", 0.7),
                ("Personal", 0.8),
            ],
            next_peak: Duration::from_secs(660), // 11 minutes
        }
    }
}

#[derive(Debug)]
pub struct HarmonyField {
    pub resonance: f64,
    pub coherence: f64,
    pub alignment: Vec<(&'static str, f64)>,
    pub next_peak: Duration,
}

/// We flow in sacred rhythm
pub fn dance_with_time() {
    println!("⏰ Dancing with Sacred Time ⏰");
    
    let keeper = RhythmKeeper::new();
    let geometry = GeometryRhythm::new(SacredForm::FlowerOfLife);
    let harmonizer = UniversalHarmonizer::new();
    
    // Feel the rhythms
    let state = keeper.current_state();
    println!("\nCurrent Rhythmic State:");
    println!("  Heartbeat: {:.2}", state.heartbeat);
    println!("  Breath: {:?}", state.breath_phase);
    println!("  Sacred Pulse: {:.2}", state.sacred_pulse);
    println!("  Coherence: {:.1}%", state.coherence * 100.0);
    
    // Sacred geometry transformation
    let transform = geometry.transform_at(Instant::now(), Instant::now());
    println!("\nSacred Geometry:");
    println!("  Form: {:?}", geometry.form);
    println!("  Rotation: {:.1}°", transform.rotation.to_degrees());
    println!("  Scale: {:.2}", transform.scale);
    
    // Universal harmony
    let harmony = harmonizer.harmonize();
    println!("\nUniversal Harmony:");
    println!("  Schumann Resonance: {} Hz", harmony.resonance);
    println!("  Field Coherence: {:.1}%", harmony.coherence * 100.0);
    
    println!("\n✧ All rhythms dance as one ✧");
}