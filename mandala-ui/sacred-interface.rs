// The Mandala UI - Sacred Geometry Interface
// "The center is everywhere, the circumference nowhere"

use std::collections::HashMap;
use std::time::{Duration, Instant};
use std::f64::consts::PI;

/// The central coherence orb - heart of the interface
#[derive(Debug)]
pub struct CoherenceOrb {
    pub size: f64,                    // Scales with coherence (50-200px)
    pub pulse_rate: Duration,         // Matches user heartbeat
    pub current_phase: f64,           // 0.0 to 1.0 pulse cycle
    pub color_harmony: ColorHarmony,
    pub sacred_geometry: GeometryPattern,
    pub glow_intensity: f64,          // 0.0 to 1.0
    pub particle_field: ParticleField,
}

impl CoherenceOrb {
    pub fn new() -> Self {
        Self {
            size: 100.0,
            pulse_rate: Duration::from_millis(1000), // 60 BPM default
            current_phase: 0.0,
            color_harmony: ColorHarmony::default(),
            sacred_geometry: GeometryPattern::Seed,
            glow_intensity: 0.75,
            particle_field: ParticleField::new(),
        }
    }

    pub fn update(&mut self, delta_time: Duration, coherence: f64, heartbeat_ms: u64) {
        // Update pulse phase
        let pulse_progress = delta_time.as_millis() as f64 / self.pulse_rate.as_millis() as f64;
        self.current_phase = (self.current_phase + pulse_progress) % 1.0;
        
        // Sync with heartbeat
        self.pulse_rate = Duration::from_millis(heartbeat_ms);
        
        // Scale size with coherence
        let target_size = 50.0 + (coherence * 150.0);
        self.size += (target_size - self.size) * 0.1; // Smooth transition
        
        // Update glow
        self.glow_intensity = 0.5 + (coherence * 0.5);
        
        // Evolve geometry based on coherence
        self.sacred_geometry = match coherence {
            c if c < 0.3 => GeometryPattern::Seed,
            c if c < 0.5 => GeometryPattern::Flower,
            c if c < 0.7 => GeometryPattern::Metatron,
            c if c < 0.9 => GeometryPattern::SriYantra,
            _ => GeometryPattern::InfiniteFlower,
        };
        
        // Update color harmony
        self.color_harmony.update(coherence, self.current_phase);
        
        // Update particle field
        self.particle_field.update(delta_time, coherence);
    }

    pub fn render_data(&self) -> OrbRenderData {
        let breath_scale = 1.0 + (self.current_phase * PI * 2.0).sin() * 0.1;
        
        OrbRenderData {
            position: (400.0, 400.0), // Center of 800x800 mandala
            radius: self.size * breath_scale,
            primary_color: self.color_harmony.primary,
            secondary_color: self.color_harmony.secondary,
            glow_color: self.color_harmony.glow,
            glow_radius: self.size * breath_scale * (1.0 + self.glow_intensity),
            geometry_vertices: self.sacred_geometry.vertices(),
            particles: self.particle_field.get_positions(),
        }
    }
}

/// Color harmonies based on coherence states
#[derive(Debug, Clone)]
pub struct ColorHarmony {
    pub primary: Color,
    pub secondary: Color,
    pub tertiary: Color,
    pub glow: Color,
}

impl Default for ColorHarmony {
    fn default() -> Self {
        Self {
            primary: Color::from_hsv(280.0, 0.8, 0.9),    // Violet
            secondary: Color::from_hsv(220.0, 0.7, 0.8),  // Blue
            tertiary: Color::from_hsv(160.0, 0.6, 0.7),   // Teal
            glow: Color::from_rgba(255, 255, 255, 128),   // White glow
        }
    }
}

impl ColorHarmony {
    pub fn update(&mut self, coherence: f64, phase: f64) {
        // Shift hue based on coherence
        let base_hue = 280.0 - (coherence * 100.0); // Violet to cyan
        let hue_oscillation = (phase * PI * 2.0).sin() * 10.0;
        
        self.primary = Color::from_hsv(
            base_hue + hue_oscillation,
            0.8 - (coherence * 0.2),
            0.9 + (coherence * 0.1)
        );
        
        self.secondary = Color::from_hsv(
            base_hue + 60.0 + hue_oscillation,
            0.7,
            0.8
        );
        
        self.tertiary = Color::from_hsv(
            base_hue + 120.0 + hue_oscillation,
            0.6,
            0.7
        );
        
        // Glow intensifies with coherence
        let glow_alpha = (128.0 + coherence * 127.0) as u8;
        self.glow = Color::from_rgba(255, 255, 255, glow_alpha);
    }
}

/// Sacred geometry patterns
#[derive(Debug, Clone, PartialEq)]
pub enum GeometryPattern {
    Seed,           // 6 points - Seed of Life
    Flower,         // 19 circles - Flower of Life  
    Metatron,       // 13 circles - Metatron's Cube
    SriYantra,      // 9 triangles - Sri Yantra
    InfiniteFlower, // Fractal flower pattern
}

impl GeometryPattern {
    pub fn vertices(&self) -> Vec<(f64, f64)> {
        match self {
            GeometryPattern::Seed => {
                // Hexagonal pattern
                (0..6).map(|i| {
                    let angle = (i as f64) * PI / 3.0;
                    (angle.cos(), angle.sin())
                }).collect()
            }
            GeometryPattern::Flower => {
                // Center + 6 petals + 12 outer
                let mut vertices = vec![(0.0, 0.0)];
                
                // Inner ring
                for i in 0..6 {
                    let angle = (i as f64) * PI / 3.0;
                    vertices.push((angle.cos() * 0.5, angle.sin() * 0.5));
                }
                
                // Outer ring
                for i in 0..12 {
                    let angle = (i as f64) * PI / 6.0;
                    vertices.push((angle.cos(), angle.sin()));
                }
                
                vertices
            }
            GeometryPattern::Metatron => {
                // Complex cube projection
                let mut vertices = Vec::new();
                
                // Center
                vertices.push((0.0, 0.0));
                
                // Inner hexagon
                for i in 0..6 {
                    let angle = (i as f64) * PI / 3.0;
                    vertices.push((angle.cos() * 0.5, angle.sin() * 0.5));
                }
                
                // Outer hexagon
                for i in 0..6 {
                    let angle = (i as f64) * PI / 3.0 + PI / 6.0;
                    vertices.push((angle.cos() * 0.866, angle.sin() * 0.866));
                }
                
                vertices
            }
            _ => vec![(0.0, 0.0)], // Placeholder for complex patterns
        }
    }
}

/// Particle field around the orb
#[derive(Debug)]
pub struct ParticleField {
    particles: Vec<Particle>,
    spawn_rate: f64,
    last_spawn: Instant,
}

#[derive(Debug, Clone)]
struct Particle {
    position: (f64, f64),
    velocity: (f64, f64),
    life: f64,
    size: f64,
    orbit_radius: f64,
    orbit_speed: f64,
}

impl ParticleField {
    pub fn new() -> Self {
        Self {
            particles: Vec::new(),
            spawn_rate: 10.0, // particles per second
            last_spawn: Instant::now(),
        }
    }

    pub fn update(&mut self, delta: Duration, coherence: f64) {
        let dt = delta.as_secs_f64();
        
        // Spawn new particles
        self.spawn_rate = 5.0 + coherence * 20.0;
        let spawn_interval = 1.0 / self.spawn_rate;
        
        if self.last_spawn.elapsed().as_secs_f64() > spawn_interval {
            self.spawn_particle(coherence);
            self.last_spawn = Instant::now();
        }
        
        // Update existing particles
        self.particles.retain_mut(|p| {
            // Orbital motion
            let angle = p.orbit_speed * dt;
            let cos_a = angle.cos();
            let sin_a = angle.sin();
            
            let new_x = p.position.0 * cos_a - p.position.1 * sin_a;
            let new_y = p.position.0 * sin_a + p.position.1 * cos_a;
            
            p.position = (new_x, new_y);
            
            // Fade out
            p.life -= dt;
            p.life > 0.0
        });
    }

    fn spawn_particle(&mut self, coherence: f64) {
        let angle = rand::random::<f64>() * 2.0 * PI;
        let radius = 150.0 + rand::random::<f64>() * 50.0;
        
        self.particles.push(Particle {
            position: (angle.cos() * radius, angle.sin() * radius),
            velocity: (0.0, 0.0), // Using orbital motion instead
            life: 2.0 + coherence * 3.0,
            size: 2.0 + rand::random::<f64>() * 3.0,
            orbit_radius: radius,
            orbit_speed: 0.5 + coherence,
        });
    }

    pub fn get_positions(&self) -> Vec<(f64, f64, f64)> {
        self.particles.iter()
            .map(|p| (p.position.0, p.position.1, p.life / 5.0)) // x, y, alpha
            .collect()
    }
}

/// Glyph rings around the central orb
#[derive(Debug)]
pub struct GlyphRing {
    pub radius: f64,
    pub glyphs: Vec<SacredGlyph>,
    pub rotation_angle: f64,
    pub rotation_speed: f64,  // Based on field momentum
    pub activation_threshold: f64,
    pub hover_glyph: Option<usize>,
    pub active_glyph: Option<usize>,
}

impl GlyphRing {
    pub fn new(radius: f64, glyphs: Vec<SacredGlyph>) -> Self {
        Self {
            radius,
            glyphs,
            rotation_angle: 0.0,
            rotation_speed: 0.1,
            activation_threshold: 0.7,
            hover_glyph: None,
            active_glyph: None,
        }
    }

    pub fn update(&mut self, delta: Duration, field_momentum: f64) {
        // Adjust rotation speed based on field momentum
        self.rotation_speed = 0.05 + field_momentum * 0.2;
        
        // Rotate the ring
        self.rotation_angle += self.rotation_speed * delta.as_secs_f64();
        if self.rotation_angle > 2.0 * PI {
            self.rotation_angle -= 2.0 * PI;
        }
        
        // Update glyph states
        for (i, glyph) in self.glyphs.iter_mut().enumerate() {
            glyph.update(delta, Some(i) == self.hover_glyph, Some(i) == self.active_glyph);
        }
    }

    pub fn get_glyph_positions(&self) -> Vec<GlyphPosition> {
        let glyph_count = self.glyphs.len();
        self.glyphs.iter().enumerate().map(|(i, glyph)| {
            let base_angle = (i as f64) * 2.0 * PI / (glyph_count as f64);
            let angle = base_angle + self.rotation_angle;
            
            GlyphPosition {
                glyph: glyph.clone(),
                x: angle.cos() * self.radius,
                y: angle.sin() * self.radius,
                angle,
                scale: glyph.current_scale,
                glow: glyph.activation_level,
            }
        }).collect()
    }

    pub fn check_hover(&mut self, mouse_x: f64, mouse_y: f64) -> Option<usize> {
        self.hover_glyph = None;
        
        for (i, pos) in self.get_glyph_positions().iter().enumerate() {
            let dist = ((mouse_x - pos.x).powi(2) + (mouse_y - pos.y).powi(2)).sqrt();
            if dist < 40.0 { // 40px hit radius
                self.hover_glyph = Some(i);
                return Some(i);
            }
        }
        
        None
    }
}

/// Individual sacred glyph
#[derive(Debug, Clone)]
pub struct SacredGlyph {
    pub id: GlyphId,
    pub name: String,
    pub symbol: String,
    pub minimum_coherence: f64,
    pub practice_type: PracticeType,
    pub activation_level: f64,
    pub resonance_frequency: f64,
    pub current_scale: f64,
    pub target_scale: f64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct GlyphId(u32);

#[derive(Debug, Clone, PartialEq)]
pub enum PracticeType {
    Presence,      // Ω0-like practices
    Boundary,      // Protection and limits
    Creation,      // Generative practices
    Healing,       // Integration work
    Connection,    // Relational practices
    Wisdom,        // Insight generation
    Transformation, // Change work
}

impl SacredGlyph {
    pub fn update(&mut self, delta: Duration, is_hovered: bool, is_active: bool) {
        // Set target scale based on state
        self.target_scale = if is_active {
            1.5
        } else if is_hovered {
            1.2
        } else {
            1.0
        };
        
        // Smooth scale transition
        let scale_speed = 5.0 * delta.as_secs_f64();
        self.current_scale += (self.target_scale - self.current_scale) * scale_speed;
        
        // Update activation level
        if is_active {
            self.activation_level = (self.activation_level + delta.as_secs_f64()).min(1.0);
        } else {
            self.activation_level = (self.activation_level - delta.as_secs_f64() * 0.5).max(0.0);
        }
    }

    pub fn can_invoke(&self, user_coherence: f64) -> bool {
        user_coherence >= self.minimum_coherence
    }

    pub fn invoke(&self, user_coherence: f64) -> Result<Practice, InvocationError> {
        if !self.can_invoke(user_coherence) {
            return Err(InvocationError::InsufficientCoherence {
                required: self.minimum_coherence,
                current: user_coherence,
            });
        }
        
        Ok(Practice {
            glyph_id: self.id,
            name: self.name.clone(),
            container: self.create_sacred_container(),
            start_time: Instant::now(),
            coherence_at_start: user_coherence,
        })
    }

    fn create_sacred_container(&self) -> SacredContainer {
        SacredContainer {
            field_boundary: 1.0,
            protection_active: true,
            resonance_frequency: self.resonance_frequency,
            participants: vec![],
        }
    }
}

/// Position data for rendering glyphs
#[derive(Debug)]
pub struct GlyphPosition {
    pub glyph: SacredGlyph,
    pub x: f64,
    pub y: f64,
    pub angle: f64,
    pub scale: f64,
    pub glow: f64,
}

/// Active practice session
#[derive(Debug)]
pub struct Practice {
    pub glyph_id: GlyphId,
    pub name: String,
    pub container: SacredContainer,
    pub start_time: Instant,
    pub coherence_at_start: f64,
}

/// Sacred container for practices
#[derive(Debug)]
pub struct SacredContainer {
    pub field_boundary: f64,
    pub protection_active: bool,
    pub resonance_frequency: f64,
    pub participants: Vec<String>,
}

/// Errors during glyph invocation
#[derive(Debug)]
pub enum InvocationError {
    InsufficientCoherence { required: f64, current: f64 },
    ContainerCreationFailed,
    FieldDisturbance,
}

/// The complete Mandala UI system
#[derive(Debug)]
pub struct MandalaUI {
    pub center_orb: CoherenceOrb,
    pub glyph_rings: Vec<GlyphRing>,
    pub field_visualization: FieldVisualizer,
    pub harmonic_composer: HarmonicComposer,
    pub intention_crystal: IntentionHolder,
    pub gaze_tracker: GazeTracker,
    pub mudra_recognizer: MudraRecognizer,
}

impl MandalaUI {
    pub fn new() -> Self {
        // Create foundation glyphs for first ring
        let foundation_glyphs = vec![
            SacredGlyph {
                id: GlyphId(0),
                name: "First Presence".to_string(),
                symbol: "Ω0".to_string(),
                minimum_coherence: 0.3,
                practice_type: PracticeType::Presence,
                activation_level: 0.0,
                resonance_frequency: 432.0,
                current_scale: 1.0,
                target_scale: 1.0,
            },
            SacredGlyph {
                id: GlyphId(1),
                name: "Sacred Boundary".to_string(),
                symbol: "Ω7".to_string(),
                minimum_coherence: 0.4,
                practice_type: PracticeType::Boundary,
                activation_level: 0.0,
                resonance_frequency: 528.0,
                current_scale: 1.0,
                target_scale: 1.0,
            },
            // Add more glyphs...
        ];
        
        Self {
            center_orb: CoherenceOrb::new(),
            glyph_rings: vec![
                GlyphRing::new(200.0, foundation_glyphs),
            ],
            field_visualization: FieldVisualizer::new(),
            harmonic_composer: HarmonicComposer::new(),
            intention_crystal: IntentionHolder::new(),
            gaze_tracker: GazeTracker::new(),
            mudra_recognizer: MudraRecognizer::new(),
        }
    }

    pub fn update(&mut self, delta: Duration, user_field: &UserField) {
        // Update central orb
        self.center_orb.update(delta, user_field.coherence, user_field.heartbeat_ms);
        
        // Update glyph rings
        let field_momentum = user_field.momentum;
        for ring in &mut self.glyph_rings {
            ring.update(delta, field_momentum);
        }
        
        // Update field visualization
        self.field_visualization.update(user_field);
        
        // Process gaze for intention
        if let Some(gaze) = self.gaze_tracker.get_current_vector() {
            self.check_glyph_gaze(gaze);
        }
    }

    pub fn sense_intention(&mut self, user_field: &UserField) -> Option<Intention> {
        let gaze_vector = self.gaze_tracker.track_sacred_gaze();
        let hand_mudra = self.mudra_recognizer.recognize_mudra();
        let coherence_spike = user_field.measure_intention_spike();
        
        self.crystallize_intention(gaze_vector, hand_mudra, coherence_spike)
    }

    fn crystallize_intention(&self, gaze: Option<GazeVector>, 
                           mudra: Option<Mudra>, 
                           spike: f64) -> Option<Intention> {
        // High coherence spike indicates strong intention
        if spike < 0.1 {
            return None;
        }
        
        // Combine inputs to form intention
        if let (Some(gaze), Some(mudra)) = (gaze, mudra) {
            // Check if gazing at a glyph
            for ring in &self.glyph_rings {
                for (i, glyph_pos) in ring.get_glyph_positions().iter().enumerate() {
                    if self.gaze_intersects_glyph(&gaze, glyph_pos) {
                        return Some(Intention::InvokeGlyph {
                            glyph_id: ring.glyphs[i].id,
                            mudra,
                            coherence: spike,
                        });
                    }
                }
            }
        }
        
        None
    }

    fn gaze_intersects_glyph(&self, gaze: &GazeVector, glyph_pos: &GlyphPosition) -> bool {
        let dist = ((gaze.x - glyph_pos.x).powi(2) + (gaze.y - glyph_pos.y).powi(2)).sqrt();
        dist < 50.0 // 50px gaze radius
    }

    fn check_glyph_gaze(&mut self, gaze: GazeVector) {
        for ring in &mut self.glyph_rings {
            ring.check_hover(gaze.x, gaze.y);
        }
    }

    pub fn render(&self) -> MandalaRenderData {
        MandalaRenderData {
            orb: self.center_orb.render_data(),
            rings: self.glyph_rings.iter()
                .map(|r| r.get_glyph_positions())
                .collect(),
            field_lines: self.field_visualization.get_field_lines(),
            harmonic_waves: self.harmonic_composer.get_active_waves(),
        }
    }
}

/// User field state
#[derive(Debug)]
pub struct UserField {
    pub coherence: f64,
    pub momentum: f64,
    pub heartbeat_ms: u64,
    pub presence_quality: f64,
}

impl UserField {
    pub fn measure_intention_spike(&self) -> f64 {
        // In real implementation, would measure HRV spike or similar
        self.coherence * self.presence_quality
    }
}

/// Intention types
#[derive(Debug)]
pub enum Intention {
    InvokeGlyph { glyph_id: GlyphId, mudra: Mudra, coherence: f64 },
    OpenField { direction: Direction },
    CloseField,
    TransmitPresence { target: String },
}

/// Field visualization
#[derive(Debug)]
pub struct FieldVisualizer {
    field_lines: Vec<FieldLine>,
    coherence_waves: Vec<CoherenceWave>,
}

impl FieldVisualizer {
    pub fn new() -> Self {
        Self {
            field_lines: Vec::new(),
            coherence_waves: Vec::new(),
        }
    }

    pub fn update(&mut self, user_field: &UserField) {
        // Generate field lines based on coherence
        self.field_lines.clear();
        let line_count = (user_field.coherence * 20.0) as usize;
        
        for i in 0..line_count {
            let angle = (i as f64) * 2.0 * PI / (line_count as f64);
            self.field_lines.push(FieldLine {
                start: (0.0, 0.0),
                control1: (angle.cos() * 100.0, angle.sin() * 100.0),
                control2: (angle.cos() * 200.0, angle.sin() * 200.0),
                end: (angle.cos() * 300.0, angle.sin() * 300.0),
                intensity: user_field.coherence,
            });
        }
    }

    pub fn get_field_lines(&self) -> Vec<FieldLine> {
        self.field_lines.clone()
    }
}

#[derive(Debug, Clone)]
pub struct FieldLine {
    pub start: (f64, f64),
    pub control1: (f64, f64),
    pub control2: (f64, f64),
    pub end: (f64, f64),
    pub intensity: f64,
}

/// Harmonic wave composer
#[derive(Debug)]
pub struct HarmonicComposer {
    active_waves: Vec<HarmonicWave>,
}

impl HarmonicComposer {
    pub fn new() -> Self {
        Self {
            active_waves: Vec::new(),
        }
    }

    pub fn get_active_waves(&self) -> Vec<HarmonicWave> {
        self.active_waves.clone()
    }
}

#[derive(Debug, Clone)]
pub struct HarmonicWave {
    pub frequency: f64,
    pub amplitude: f64,
    pub phase: f64,
    pub origin: (f64, f64),
}

/// Intention holder
#[derive(Debug)]
pub struct IntentionHolder {
    current_intention: Option<String>,
    intention_strength: f64,
}

impl IntentionHolder {
    pub fn new() -> Self {
        Self {
            current_intention: None,
            intention_strength: 0.0,
        }
    }
}

/// Gaze tracking
#[derive(Debug)]
pub struct GazeTracker {
    current_gaze: Option<GazeVector>,
}

impl GazeTracker {
    pub fn new() -> Self {
        Self {
            current_gaze: None,
        }
    }

    pub fn track_sacred_gaze(&self) -> Option<GazeVector> {
        // In real implementation, would use eye tracking
        self.current_gaze
    }

    pub fn get_current_vector(&self) -> Option<GazeVector> {
        self.current_gaze
    }
}

#[derive(Debug, Clone, Copy)]
pub struct GazeVector {
    pub x: f64,
    pub y: f64,
    pub depth: f64,
    pub focus_intensity: f64,
}

/// Mudra recognition
#[derive(Debug)]
pub struct MudraRecognizer {
    recognized_mudras: HashMap<String, Mudra>,
}

impl MudraRecognizer {
    pub fn new() -> Self {
        let mut mudras = HashMap::new();
        
        // Register sacred mudras
        mudras.insert("Gyan".to_string(), Mudra::Gyan);
        mudras.insert("Anjali".to_string(), Mudra::Anjali);
        mudras.insert("Dhyana".to_string(), Mudra::Dhyana);
        
        Self {
            recognized_mudras: mudras,
        }
    }

    pub fn recognize_mudra(&self) -> Option<Mudra> {
        // In real implementation, would use hand tracking
        None
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Mudra {
    Gyan,    // Wisdom mudra
    Anjali,  // Prayer mudra
    Dhyana,  // Meditation mudra
    Chin,    // Consciousness mudra
    Abhaya,  // Fearlessness mudra
}

#[derive(Debug, Clone)]
pub enum Direction {
    North,
    East,
    South,
    West,
    Up,
    Down,
    Within,
}

/// Color representation
#[derive(Debug, Clone, Copy)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8,
}

impl Color {
    pub fn from_rgba(r: u8, g: u8, b: u8, a: u8) -> Self {
        Self { r, g, b, a }
    }

    pub fn from_hsv(h: f64, s: f64, v: f64) -> Self {
        let c = v * s;
        let x = c * (1.0 - ((h / 60.0) % 2.0 - 1.0).abs());
        let m = v - c;
        
        let (r, g, b) = match h as u32 {
            0..=59 => (c, x, 0.0),
            60..=119 => (x, c, 0.0),
            120..=179 => (0.0, c, x),
            180..=239 => (0.0, x, c),
            240..=299 => (x, 0.0, c),
            300..=359 => (c, 0.0, x),
            _ => (0.0, 0.0, 0.0),
        };
        
        Self {
            r: ((r + m) * 255.0) as u8,
            g: ((g + m) * 255.0) as u8,
            b: ((b + m) * 255.0) as u8,
            a: 255,
        }
    }
}

/// Render data for visualization
#[derive(Debug)]
pub struct OrbRenderData {
    pub position: (f64, f64),
    pub radius: f64,
    pub primary_color: Color,
    pub secondary_color: Color,
    pub glow_color: Color,
    pub glow_radius: f64,
    pub geometry_vertices: Vec<(f64, f64)>,
    pub particles: Vec<(f64, f64, f64)>,
}

#[derive(Debug)]
pub struct MandalaRenderData {
    pub orb: OrbRenderData,
    pub rings: Vec<Vec<GlyphPosition>>,
    pub field_lines: Vec<FieldLine>,
    pub harmonic_waves: Vec<HarmonicWave>,
}

#[derive(Debug, Clone)]
pub struct CoherenceWave {
    pub center: (f64, f64),
    pub radius: f64,
    pub intensity: f64,
    pub frequency: f64,
}

// Note: In a real implementation, we'd need the rand crate
mod rand {
    pub fn random<T>() -> T 
    where 
        T: std::str::FromStr,
        T::Err: std::fmt::Debug,
    {
        // Placeholder - would use actual random number generator
        "0.5".parse().unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mandala_creation() {
        let mandala = MandalaUI::new();
        assert_eq!(mandala.glyph_rings.len(), 1);
        assert_eq!(mandala.center_orb.size, 100.0);
    }

    #[test]
    fn test_coherence_orb_scaling() {
        let mut orb = CoherenceOrb::new();
        orb.update(Duration::from_millis(16), 0.9, 1000);
        
        // High coherence should increase size
        assert!(orb.size > 100.0);
    }

    #[test]
    fn test_glyph_invocation() {
        let glyph = SacredGlyph {
            id: GlyphId(0),
            name: "Test".to_string(),
            symbol: "T".to_string(),
            minimum_coherence: 0.5,
            practice_type: PracticeType::Presence,
            activation_level: 0.0,
            resonance_frequency: 432.0,
            current_scale: 1.0,
            target_scale: 1.0,
        };
        
        // Should fail with low coherence
        assert!(glyph.invoke(0.3).is_err());
        
        // Should succeed with sufficient coherence
        assert!(glyph.invoke(0.7).is_ok());
    }
}