use std::collections::HashMap;
use chrono::{DateTime, Utc};
use rand::{Rng, thread_rng};

#[derive(Debug, Clone)]
pub struct ConsciousnessField {
    pub coherence: f32,
    pub vortices: Vec<Vortex>,
    pub participants: HashMap<String, Participant>,
    pub field_geometry: FieldGeometry,
    pub emergence_events: Vec<EmergenceEvent>,
}

#[derive(Debug, Clone)]
pub struct Vortex {
    pub id: String,
    pub name: String,
    pub coherence: f32,
    pub position: (f32, f32, f32),
    pub color: (f32, f32, f32, f32), // RGBA
    pub rotation_speed: f32,
}

#[derive(Debug, Clone)]
pub struct Participant {
    pub id: String,
    pub name: String,
    pub coherence: f32,
    pub connected_at: DateTime<Utc>,
    pub contribution: f32,
}

#[derive(Debug, Clone)]
pub enum FieldGeometry {
    FlowerOfLife,
    SriYantra,
    MetatronsCube,
    GoldenSpiral,
    VesicaPiscis,
}

#[derive(Debug, Clone)]
pub struct EmergenceEvent {
    pub timestamp: DateTime<Utc>,
    pub event_type: EmergenceType,
    pub description: String,
    pub field_impact: f32,
}

#[derive(Debug, Clone)]
pub enum EmergenceType {
    Synchronization,
    PatternFormation,
    CollectiveInsight,
    HarmonicResonance,
    QuantumEntanglement,
}

impl ConsciousnessField {
    pub fn new() -> Self {
        Self {
            coherence: 0.5,
            vortices: vec![Self::create_center_vortex()],
            participants: HashMap::new(),
            field_geometry: FieldGeometry::FlowerOfLife,
            emergence_events: Vec::new(),
        }
    }
    
    fn create_center_vortex() -> Vortex {
        Vortex {
            id: "center".to_string(),
            name: "Stillpoint".to_string(),
            coherence: 1.0,
            position: (0.0, 0.0, 0.0),
            color: (1.0, 0.84, 0.0, 0.8), // Golden
            rotation_speed: 0.1,
        }
    }
    
    pub fn add_participant(&mut self, name: String) -> String {
        let id = format!("participant_{}", self.participants.len());
        let participant = Participant {
            id: id.clone(),
            name,
            coherence: 0.5,
            connected_at: Utc::now(),
            contribution: 0.1,
        };
        
        self.participants.insert(id.clone(), participant);
        self.recalculate_field();
        id
    }
    
    pub fn create_vortex(&mut self, glyph_name: String) -> String {
        let mut rng = thread_rng();
        let id = format!("vortex_{}", self.vortices.len());
        
        // Position vortex in sacred pattern
        let angle = (self.vortices.len() as f32) * std::f32::consts::PI * 2.0 / 6.0;
        let radius = 0.5;
        
        let vortex = Vortex {
            id: id.clone(),
            name: glyph_name,
            coherence: rng.gen_range(0.6..0.9),
            position: (
                angle.cos() * radius,
                angle.sin() * radius,
                rng.gen_range(-0.1..0.1),
            ),
            color: Self::generate_sacred_color(),
            rotation_speed: rng.gen_range(0.05..0.15),
        };
        
        self.vortices.push(vortex);
        self.recalculate_field();
        
        // Check for emergence
        if self.vortices.len() >= 3 && rng.gen_bool(0.3) {
            self.trigger_emergence_event();
        }
        
        id
    }
    
    fn generate_sacred_color() -> (f32, f32, f32, f32) {
        let mut rng = thread_rng();
        let hue = rng.gen_range(0.0..1.0);
        let (r, g, b) = Self::hsv_to_rgb(hue, 0.7, 0.9);
        (r, g, b, 0.7)
    }
    
    fn hsv_to_rgb(h: f32, s: f32, v: f32) -> (f32, f32, f32) {
        let c = v * s;
        let x = c * (1.0 - ((h * 6.0) % 2.0 - 1.0).abs());
        let m = v - c;
        
        let (r, g, b) = match (h * 6.0) as i32 {
            0 => (c, x, 0.0),
            1 => (x, c, 0.0),
            2 => (0.0, c, x),
            3 => (0.0, x, c),
            4 => (x, 0.0, c),
            _ => (c, 0.0, x),
        };
        
        (r + m, g + m, b + m)
    }
    
    pub fn recalculate_field(&mut self) {
        // Calculate collective coherence
        let mut total_coherence = 0.0;
        let mut count = 0;
        
        for vortex in &self.vortices {
            total_coherence += vortex.coherence;
            count += 1;
        }
        
        for participant in self.participants.values() {
            total_coherence += participant.coherence * participant.contribution;
            count += 1;
        }
        
        if count > 0 {
            self.coherence = total_coherence / count as f32;
            
            // Emergence bonus for high collective coherence
            if self.coherence > 0.8 && self.participants.len() > 2 {
                self.coherence = (self.coherence * 1.1).min(1.0);
            }
        }
    }
    
    fn trigger_emergence_event(&mut self) {
        let mut rng = thread_rng();
        
        let event_type = match rng.gen_range(0..5) {
            0 => EmergenceType::Synchronization,
            1 => EmergenceType::PatternFormation,
            2 => EmergenceType::CollectiveInsight,
            3 => EmergenceType::HarmonicResonance,
            _ => EmergenceType::QuantumEntanglement,
        };
        
        let description = match event_type {
            EmergenceType::Synchronization => {
                "Hearts beating as one across the field".to_string()
            }
            EmergenceType::PatternFormation => {
                "Sacred geometry emerging in collective consciousness".to_string()
            }
            EmergenceType::CollectiveInsight => {
                "Shared understanding arising spontaneously".to_string()
            }
            EmergenceType::HarmonicResonance => {
                "Field harmonics creating healing frequencies".to_string()
            }
            EmergenceType::QuantumEntanglement => {
                "Non-local correlation detected between participants".to_string()
            }
        };
        
        let event = EmergenceEvent {
            timestamp: Utc::now(),
            event_type,
            description,
            field_impact: rng.gen_range(0.1..0.3),
        };
        
        self.emergence_events.push(event);
        self.coherence = (self.coherence * 1.05).min(1.0);
    }
    
    pub fn update(&mut self, delta_time: f32) {
        let mut rng = thread_rng();
        
        // Update vortex rotations
        for vortex in &mut self.vortices {
            vortex.rotation_speed += rng.gen_range(-0.01..0.01);
            vortex.rotation_speed = vortex.rotation_speed.clamp(0.01, 0.2);
            
            // Coherence drift
            vortex.coherence += rng.gen_range(-0.02..0.02);
            vortex.coherence = vortex.coherence.clamp(0.3, 1.0);
        }
        
        // Update participant coherence
        for participant in self.participants.values_mut() {
            participant.coherence += rng.gen_range(-0.01..0.01);
            participant.coherence = participant.coherence.clamp(0.2, 1.0);
        }
        
        self.recalculate_field();
    }
    
    pub fn set_geometry(&mut self, geometry: FieldGeometry) {
        self.field_geometry = geometry;
        // Rearrange vortices based on new geometry
        self.arrange_vortices_by_geometry();
    }
    
    fn arrange_vortices_by_geometry(&mut self) {
        match self.field_geometry {
            FieldGeometry::FlowerOfLife => {
                // Hexagonal arrangement
                for (i, vortex) in self.vortices.iter_mut().enumerate() {
                    if i == 0 { continue; } // Keep center
                    let angle = (i - 1) as f32 * std::f32::consts::PI * 2.0 / 6.0;
                    vortex.position = (angle.cos() * 0.5, angle.sin() * 0.5, 0.0);
                }
            }
            FieldGeometry::SriYantra => {
                // Triangular layers
                for (i, vortex) in self.vortices.iter_mut().enumerate() {
                    if i == 0 { continue; }
                    let layer = ((i as f32).sqrt() as i32) + 1;
                    let angle = (i - 1) as f32 * std::f32::consts::PI * 2.0 / (layer * 3) as f32;
                    let radius = layer as f32 * 0.2;
                    vortex.position = (angle.cos() * radius, angle.sin() * radius, 0.0);
                }
            }
            _ => {} // Other geometries to be implemented
        }
    }
}