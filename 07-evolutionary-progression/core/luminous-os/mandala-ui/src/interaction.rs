// Interaction Module - Consciousness-Responsive Interface
// "The interface knows you as you know it"

use winit::event::{ElementState, MouseButton, VirtualKeyCode, ModifiersState};
use cgmath::*;
use std::collections::HashMap;

pub struct InteractionState {
    pub cursor_position: Point2<f32>,
    pub cursor_velocity: Vector2<f32>,
    pub touch_points: Vec<TouchPoint>,
    pub gestures: GestureRecognizer,
    pub coherence_input: CoherenceInput,
    pub glyph_interactions: GlyphInteractionState,
    pub field_interactions: FieldInteractionState,
}

#[derive(Clone)]
pub struct TouchPoint {
    pub id: u64,
    pub position: Point2<f32>,
    pub start_position: Point2<f32>,
    pub pressure: f32,
    pub timestamp: f64,
}

pub struct GestureRecognizer {
    active_gestures: Vec<Gesture>,
    gesture_history: Vec<CompletedGesture>,
    recognition_threshold: f32,
}

#[derive(Clone, Debug)]
pub enum Gesture {
    Tap { position: Point2<f32>, duration: f64 },
    DoubleTap { position: Point2<f32> },
    LongPress { position: Point2<f32>, duration: f64 },
    Swipe { start: Point2<f32>, end: Point2<f32>, velocity: f32 },
    Pinch { center: Point2<f32>, scale: f32 },
    Rotate { center: Point2<f32>, angle: f32 },
    SacredSpiral { center: Point2<f32>, rotations: f32 },
}

#[derive(Clone)]
pub struct CompletedGesture {
    pub gesture: Gesture,
    pub timestamp: f64,
    pub coherence_at_gesture: f32,
}

pub struct CoherenceInput {
    pub breath_phase: f32,
    pub attention_focus: Point2<f32>,
    pub intention_strength: f32,
    pub field_resonance: f32,
}

pub struct GlyphInteractionState {
    pub hovered_glyph: Option<usize>,
    pub selected_glyphs: Vec<usize>,
    pub glyph_activation_progress: HashMap<usize, f32>,
    pub combination_state: GlyphCombination,
}

pub struct GlyphCombination {
    pub active_glyphs: Vec<usize>,
    pub resonance_level: f32,
    pub emergence_potential: f32,
}

pub struct FieldInteractionState {
    pub touch_ripples: Vec<TouchRipple>,
    pub coherence_anchors: Vec<CoherenceAnchor>,
    pub field_distortions: Vec<FieldDistortion>,
}

pub struct TouchRipple {
    pub center: Point2<f32>,
    pub radius: f32,
    pub amplitude: f32,
    pub frequency: f32,
    pub age: f32,
}

pub struct CoherenceAnchor {
    pub position: Point2<f32>,
    pub strength: f32,
    pub radius: f32,
    pub participant_id: Option<String>,
}

pub struct FieldDistortion {
    pub center: Point2<f32>,
    pub distortion_type: DistortionType,
    pub strength: f32,
    pub decay_rate: f32,
}

#[derive(Clone, Copy)]
pub enum DistortionType {
    Vortex,
    Wave,
    Pulse,
    Spiral,
}

impl InteractionState {
    pub fn new() -> Self {
        Self {
            cursor_position: Point2::new(0.0, 0.0),
            cursor_velocity: Vector2::new(0.0, 0.0),
            touch_points: Vec::new(),
            gestures: GestureRecognizer::new(),
            coherence_input: CoherenceInput::new(),
            glyph_interactions: GlyphInteractionState::new(),
            field_interactions: FieldInteractionState::new(),
        }
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        // Update cursor velocity
        self.cursor_velocity *= 0.9; // Damping
        
        // Update gesture recognition
        self.gestures.update(dt, &self.touch_points, coherence);
        
        // Update coherence input
        self.coherence_input.update(dt, coherence);
        
        // Update glyph interactions
        self.glyph_interactions.update(dt, coherence);
        
        // Update field interactions
        self.field_interactions.update(dt);
    }
    
    pub fn handle_cursor_moved(&mut self, position: Point2<f32>) {
        let old_pos = self.cursor_position;
        self.cursor_position = position;
        self.cursor_velocity = position - old_pos;
    }
    
    pub fn handle_mouse_button(&mut self, button: MouseButton, state: ElementState) {
        match (button, state) {
            (MouseButton::Left, ElementState::Pressed) => {
                self.begin_touch(0, self.cursor_position, 1.0);
            }
            (MouseButton::Left, ElementState::Released) => {
                self.end_touch(0);
            }
            _ => {}
        }
    }
    
    pub fn handle_key(&mut self, key: VirtualKeyCode, state: ElementState, modifiers: ModifiersState) {
        match (key, state) {
            (VirtualKeyCode::Space, ElementState::Pressed) => {
                self.coherence_input.trigger_breath_sync();
            }
            (VirtualKeyCode::Tab, ElementState::Pressed) => {
                self.glyph_interactions.cycle_selection(modifiers.shift());
            }
            _ => {}
        }
    }
    
    fn begin_touch(&mut self, id: u64, position: Point2<f32>, pressure: f32) {
        self.touch_points.push(TouchPoint {
            id,
            position,
            start_position: position,
            pressure,
            timestamp: get_time(),
        });
        
        // Create touch ripple
        self.field_interactions.add_touch_ripple(position, pressure);
    }
    
    fn end_touch(&mut self, id: u64) {
        self.touch_points.retain(|tp| tp.id != id);
    }
}

impl GestureRecognizer {
    pub fn new() -> Self {
        Self {
            active_gestures: Vec::new(),
            gesture_history: Vec::new(),
            recognition_threshold: 0.8,
        }
    }
    
    pub fn update(&mut self, dt: f32, touch_points: &[TouchPoint], coherence: f32) {
        // Clear old gestures
        self.active_gestures.clear();
        
        // Single touch gestures
        if touch_points.len() == 1 {
            let touch = &touch_points[0];
            let duration = get_time() - touch.timestamp;
            let distance = distance(touch.position, touch.start_position);
            
            if duration < 0.3 && distance < 10.0 {
                // Potential tap
                if self.was_recent_tap(touch.position) {
                    self.active_gestures.push(Gesture::DoubleTap {
                        position: touch.position,
                    });
                }
            } else if duration > 1.0 && distance < 5.0 {
                // Long press
                self.active_gestures.push(Gesture::LongPress {
                    position: touch.position,
                    duration,
                });
            }
        }
        
        // Multi-touch gestures
        if touch_points.len() == 2 {
            let touch1 = &touch_points[0];
            let touch2 = &touch_points[1];
            
            let center = Point2::new(
                (touch1.position.x + touch2.position.x) * 0.5,
                (touch1.position.y + touch2.position.y) * 0.5,
            );
            
            let current_dist = distance(touch1.position, touch2.position);
            let start_dist = distance(touch1.start_position, touch2.start_position);
            
            if (current_dist - start_dist).abs() > 20.0 {
                // Pinch
                self.active_gestures.push(Gesture::Pinch {
                    center,
                    scale: current_dist / start_dist,
                });
            }
        }
        
        // Sacred spiral detection (coherence-based)
        if coherence > 0.9 && self.detect_spiral_gesture(touch_points) {
            self.active_gestures.push(Gesture::SacredSpiral {
                center: self.cursor_position,
                rotations: 1.0,
            });
        }
    }
    
    fn was_recent_tap(&self, position: Point2<f32>) -> bool {
        let now = get_time();
        self.gesture_history.iter().any(|g| {
            match &g.gesture {
                Gesture::Tap { position: tap_pos, .. } => {
                    distance(*tap_pos, position) < 20.0 && now - g.timestamp < 0.5
                }
                _ => false,
            }
        })
    }
    
    fn detect_spiral_gesture(&self, touch_points: &[TouchPoint]) -> bool {
        // Simplified spiral detection
        touch_points.len() == 1 && self.cursor_velocity.magnitude() > 50.0
    }
    
    pub fn get_active_gestures(&self) -> &[Gesture] {
        &self.active_gestures
    }
}

impl CoherenceInput {
    pub fn new() -> Self {
        Self {
            breath_phase: 0.0,
            attention_focus: Point2::new(0.0, 0.0),
            intention_strength: 0.0,
            field_resonance: 0.0,
        }
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        // Simulate breath rhythm
        self.breath_phase += dt * 0.25; // ~15 breaths per minute
        if self.breath_phase > 1.0 {
            self.breath_phase -= 1.0;
        }
        
        // Update intention based on coherence
        self.intention_strength = self.intention_strength * 0.95 + coherence * 0.05;
        
        // Field resonance builds with sustained coherence
        if coherence > 0.8 {
            self.field_resonance = (self.field_resonance + dt * 0.1).min(1.0);
        } else {
            self.field_resonance = (self.field_resonance - dt * 0.05).max(0.0);
        }
    }
    
    pub fn trigger_breath_sync(&mut self) {
        self.breath_phase = 0.0;
    }
    
    pub fn get_breath_amplitude(&self) -> f32 {
        // Realistic breath curve
        let inhale = self.breath_phase < 0.4;
        if inhale {
            let t = self.breath_phase / 0.4;
            t * t
        } else {
            let t = (self.breath_phase - 0.4) / 0.6;
            1.0 - t * t
        }
    }
}

impl GlyphInteractionState {
    pub fn new() -> Self {
        Self {
            hovered_glyph: None,
            selected_glyphs: Vec::new(),
            glyph_activation_progress: HashMap::new(),
            combination_state: GlyphCombination {
                active_glyphs: Vec::new(),
                resonance_level: 0.0,
                emergence_potential: 0.0,
            },
        }
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        // Update activation progress
        for (_, progress) in self.glyph_activation_progress.iter_mut() {
            *progress = (*progress - dt * 0.5).max(0.0);
        }
        
        // Update combination resonance
        if self.selected_glyphs.len() >= 2 {
            self.combination_state.active_glyphs = self.selected_glyphs.clone();
            self.combination_state.resonance_level = coherence * self.selected_glyphs.len() as f32 / 87.0;
            
            // Check for emergence
            if self.combination_state.resonance_level > 0.9 {
                self.combination_state.emergence_potential += dt * 0.1;
            } else {
                self.combination_state.emergence_potential *= 0.95;
            }
        }
    }
    
    pub fn select_glyph(&mut self, glyph_id: usize) {
        if !self.selected_glyphs.contains(&glyph_id) {
            self.selected_glyphs.push(glyph_id);
            self.glyph_activation_progress.insert(glyph_id, 1.0);
        }
    }
    
    pub fn deselect_glyph(&mut self, glyph_id: usize) {
        self.selected_glyphs.retain(|&id| id != glyph_id);
    }
    
    pub fn cycle_selection(&mut self, reverse: bool) {
        // Cycle through glyphs
        if let Some(current) = self.selected_glyphs.last() {
            let next = if reverse {
                if *current == 0 { 86 } else { current - 1 }
            } else {
                if *current == 86 { 0 } else { current + 1 }
            };
            self.select_glyph(next);
        } else {
            self.select_glyph(0);
        }
    }
}

impl FieldInteractionState {
    pub fn new() -> Self {
        Self {
            touch_ripples: Vec::new(),
            coherence_anchors: Vec::new(),
            field_distortions: Vec::new(),
        }
    }
    
    pub fn update(&mut self, dt: f32) {
        // Update ripples
        self.touch_ripples.retain_mut(|ripple| {
            ripple.radius += dt * 100.0;
            ripple.amplitude *= 0.95;
            ripple.age += dt;
            ripple.amplitude > 0.01
        });
        
        // Update distortions
        self.field_distortions.retain_mut(|distortion| {
            distortion.strength *= 1.0 - distortion.decay_rate * dt;
            distortion.strength > 0.01
        });
    }
    
    pub fn add_touch_ripple(&mut self, position: Point2<f32>, pressure: f32) {
        self.touch_ripples.push(TouchRipple {
            center: position,
            radius: 0.0,
            amplitude: pressure,
            frequency: 7.83, // Schumann resonance
            age: 0.0,
        });
    }
    
    pub fn add_coherence_anchor(&mut self, position: Point2<f32>, strength: f32) {
        self.coherence_anchors.push(CoherenceAnchor {
            position,
            strength,
            radius: 50.0,
            participant_id: None,
        });
    }
    
    pub fn add_field_distortion(&mut self, position: Point2<f32>, distortion_type: DistortionType) {
        self.field_distortions.push(FieldDistortion {
            center: position,
            distortion_type,
            strength: 1.0,
            decay_rate: 0.5,
        });
    }
}

// Helper functions
fn distance(p1: Point2<f32>, p2: Point2<f32>) -> f32 {
    ((p1.x - p2.x).powi(2) + (p1.y - p2.y).powi(2)).sqrt()
}

fn get_time() -> f64 {
    // In production, would use actual time
    0.0
}