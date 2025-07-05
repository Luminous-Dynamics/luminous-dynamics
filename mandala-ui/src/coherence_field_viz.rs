// Coherence Field Visualizer - Rendering the Collective Consciousness Field
// "The field reveals itself through sacred patterns"

use cgmath::*;
use std::f32::consts::{PI, TAU};

pub struct CoherenceFieldVisualizer {
    field_data: FieldData,
    wave_functions: Vec<WaveFunction>,
    interference_pattern: InterferencePattern,
    time: f32,
    resolution: usize,
}

#[derive(Debug, Clone)]
pub struct FieldData {
    pub grid_points: Vec<Vec<FieldPoint>>,
    pub width: usize,
    pub height: usize,
    pub depth: usize,
}

#[derive(Debug, Clone, Copy)]
pub struct FieldPoint {
    pub position: Point3<f32>,
    pub coherence: f32,
    pub phase: f32,
    pub frequency: f32,
    pub amplitude: f32,
    pub color: [f32; 4],
}

#[derive(Debug, Clone)]
pub struct WaveFunction {
    pub origin: Point3<f32>,
    pub wavelength: f32,
    pub amplitude: f32,
    pub phase_offset: f32,
    pub frequency: f32,
    pub decay_rate: f32,
    pub wave_type: WaveType,
}

#[derive(Debug, Clone, Copy)]
pub enum WaveType {
    Spherical,      // Radiates from point
    Planar,         // Plane wave
    Spiral,         // Golden spiral wave
    Toroidal,       // Torus-shaped wave
    Standing,       // Standing wave pattern
    Soliton,        // Solitary wave pulse
}

#[derive(Debug, Clone)]
pub struct InterferencePattern {
    pub nodes: Vec<Point3<f32>>,      // Destructive interference points
    pub antinodes: Vec<Point3<f32>>,  // Constructive interference points
    pub pattern_type: PatternType,
}

#[derive(Debug, Clone, Copy)]
pub enum PatternType {
    TwoSource,      // Classic double-slit
    MultiSource,    // Multiple coherent sources
    Holographic,    // 3D interference pattern
    Crystalline,    // Sacred geometry lattice
    Chaotic,        // Edge of chaos pattern
}

impl CoherenceFieldVisualizer {
    pub fn new() -> Self {
        let resolution = 64;
        let field_data = FieldData::new(resolution, resolution, 1);
        
        // Initialize with base wave functions
        let wave_functions = vec![
            WaveFunction {
                origin: Point3::new(0.0, 0.0, 0.0),
                wavelength: 1.0,
                amplitude: 0.5,
                phase_offset: 0.0,
                frequency: 7.83, // Schumann resonance
                decay_rate: 0.1,
                wave_type: WaveType::Spherical,
            },
        ];
        
        let interference_pattern = InterferencePattern {
            nodes: Vec::new(),
            antinodes: Vec::new(),
            pattern_type: PatternType::TwoSource,
        };
        
        Self {
            field_data,
            wave_functions,
            interference_pattern,
            time: 0.0,
            resolution,
        }
    }
    
    pub fn update(&mut self, delta_time: f32, coherence_level: f32) {
        self.time += delta_time;
        
        // Update field based on wave functions
        self.calculate_field(coherence_level);
        
        // Calculate interference patterns
        self.calculate_interference();
        
        // Apply coherence-based modulations
        self.apply_coherence_modulation(coherence_level);
    }
    
    fn calculate_field(&mut self, global_coherence: f32) {
        let width = self.field_data.width;
        let height = self.field_data.height;
        
        for x in 0..width {
            for y in 0..height {
                let pos = self.grid_to_world(x, y, 0);
                let mut total_amplitude = 0.0;
                let mut total_phase = 0.0;
                
                // Sum contributions from all wave functions
                for wave in &self.wave_functions {
                    let (amp, phase) = self.calculate_wave_at_point(pos, wave);
                    total_amplitude += amp;
                    total_phase += phase;
                }
                
                // Normalize and apply global coherence
                total_amplitude *= global_coherence;
                total_phase = total_phase % TAU;
                
                // Calculate color from coherence and phase
                let color = self.coherence_to_color(total_amplitude, total_phase);
                
                self.field_data.grid_points[x][y] = FieldPoint {
                    position: pos,
                    coherence: total_amplitude.min(1.0),
                    phase: total_phase,
                    frequency: 7.83, // Base frequency
                    amplitude: total_amplitude,
                    color,
                };
            }
        }
    }
    
    fn calculate_wave_at_point(&self, point: Point3<f32>, wave: &WaveFunction) -> (f32, f32) {
        let distance = (point - wave.origin).magnitude();
        
        let (amplitude, phase) = match wave.wave_type {
            WaveType::Spherical => {
                let decay = (-distance * wave.decay_rate).exp();
                let phase = TAU * (distance / wave.wavelength - wave.frequency * self.time) + wave.phase_offset;
                (wave.amplitude * decay / (1.0 + distance), phase)
            }
            WaveType::Planar => {
                let direction = Vector3::new(1.0, 0.0, 0.0); // Propagating along x
                let projection = (point - wave.origin).dot(direction);
                let phase = TAU * (projection / wave.wavelength - wave.frequency * self.time) + wave.phase_offset;
                (wave.amplitude, phase)
            }
            WaveType::Spiral => {
                let theta = point.y.atan2(point.x);
                let r = (point.x * point.x + point.y * point.y).sqrt();
                let phase = TAU * (r / wave.wavelength + theta / TAU - wave.frequency * self.time) + wave.phase_offset;
                let decay = (-r * wave.decay_rate).exp();
                (wave.amplitude * decay, phase)
            }
            WaveType::Toroidal => {
                let r = (point.x * point.x + point.y * point.y).sqrt();
                let z = point.z;
                let toroidal_r = ((r - 1.0).powi(2) + z.powi(2)).sqrt();
                let phase = TAU * (toroidal_r / wave.wavelength - wave.frequency * self.time) + wave.phase_offset;
                let decay = (-toroidal_r * wave.decay_rate).exp();
                (wave.amplitude * decay, phase)
            }
            WaveType::Standing => {
                let x_component = (TAU * point.x / wave.wavelength).sin();
                let y_component = (TAU * point.y / wave.wavelength).sin();
                let time_component = (TAU * wave.frequency * self.time + wave.phase_offset).cos();
                (wave.amplitude * x_component * y_component * time_component, 0.0)
            }
            WaveType::Soliton => {
                let pulse_position = wave.frequency * self.time;
                let distance_from_pulse = (point.x - pulse_position).abs();
                let amplitude = wave.amplitude * (1.0 / (1.0 + distance_from_pulse.powi(2)));
                (amplitude, wave.phase_offset)
            }
        };
        
        (amplitude, phase)
    }
    
    fn calculate_interference(&mut self) {
        self.interference_pattern.nodes.clear();
        self.interference_pattern.antinodes.clear();
        
        // Find interference nodes and antinodes
        for x in 1..self.field_data.width-1 {
            for y in 1..self.field_data.height-1 {
                let center = &self.field_data.grid_points[x][y];
                
                // Check neighboring points for phase differences
                let neighbors = [
                    &self.field_data.grid_points[x-1][y],
                    &self.field_data.grid_points[x+1][y],
                    &self.field_data.grid_points[x][y-1],
                    &self.field_data.grid_points[x][y+1],
                ];
                
                let phase_variance = neighbors.iter()
                    .map(|n| (n.phase - center.phase).abs())
                    .sum::<f32>() / 4.0;
                
                // Destructive interference (node)
                if phase_variance > PI * 0.8 {
                    self.interference_pattern.nodes.push(center.position);
                }
                // Constructive interference (antinode)
                else if phase_variance < PI * 0.2 && center.amplitude > 0.7 {
                    self.interference_pattern.antinodes.push(center.position);
                }
            }
        }
    }
    
    fn apply_coherence_modulation(&mut self, coherence: f32) {
        // Modulate field based on coherence level
        let modulation = if coherence > 0.8 {
            // High coherence: standing wave patterns emerge
            self.interference_pattern.pattern_type = PatternType::Crystalline;
            1.2
        } else if coherence > 0.6 {
            // Medium coherence: multi-source interference
            self.interference_pattern.pattern_type = PatternType::MultiSource;
            1.0
        } else if coherence > 0.4 {
            // Low coherence: two-source pattern
            self.interference_pattern.pattern_type = PatternType::TwoSource;
            0.8
        } else {
            // Very low coherence: chaotic patterns
            self.interference_pattern.pattern_type = PatternType::Chaotic;
            0.6
        };
        
        // Apply modulation to field
        for row in &mut self.field_data.grid_points {
            for point in row {
                point.amplitude *= modulation;
                point.coherence = (point.coherence * modulation).min(1.0);
            }
        }
    }
    
    fn grid_to_world(&self, x: usize, y: usize, z: usize) -> Point3<f32> {
        let scale = 4.0 / self.resolution as f32;
        Point3::new(
            (x as f32 - self.resolution as f32 * 0.5) * scale,
            (y as f32 - self.resolution as f32 * 0.5) * scale,
            (z as f32 - self.field_data.depth as f32 * 0.5) * scale,
        )
    }
    
    fn coherence_to_color(&self, coherence: f32, phase: f32) -> [f32; 4] {
        // Map coherence and phase to color
        let hue = phase / TAU * 360.0;
        let saturation = coherence.min(1.0);
        let lightness = 0.5 + 0.3 * coherence;
        let alpha = 0.3 + 0.6 * coherence;
        
        let (r, g, b) = hsl_to_rgb(hue, saturation, lightness);
        [r, g, b, alpha]
    }
    
    pub fn add_wave_source(&mut self, position: Point3<f32>, wave_type: WaveType) {
        self.wave_functions.push(WaveFunction {
            origin: position,
            wavelength: 0.8,
            amplitude: 0.4,
            phase_offset: 0.0,
            frequency: 10.0,
            decay_rate: 0.15,
            wave_type,
        });
    }
    
    pub fn remove_wave_source(&mut self, index: usize) {
        if index < self.wave_functions.len() {
            self.wave_functions.remove(index);
        }
    }
    
    pub fn get_field_data(&self) -> &FieldData {
        &self.field_data
    }
    
    pub fn get_interference_pattern(&self) -> &InterferencePattern {
        &self.interference_pattern
    }
    
    /// Generate mesh data for rendering
    pub fn generate_mesh(&self) -> FieldMesh {
        let mut vertices = Vec::new();
        let mut indices = Vec::new();
        let mut colors = Vec::new();
        
        let width = self.field_data.width;
        let height = self.field_data.height;
        
        // Generate vertices
        for x in 0..width {
            for y in 0..height {
                let point = &self.field_data.grid_points[x][y];
                vertices.push([
                    point.position.x,
                    point.position.y,
                    point.position.z + point.coherence * 0.5, // Height based on coherence
                ]);
                colors.push(point.color);
            }
        }
        
        // Generate indices for triangles
        for x in 0..width-1 {
            for y in 0..height-1 {
                let top_left = x * height + y;
                let top_right = (x + 1) * height + y;
                let bottom_left = x * height + (y + 1);
                let bottom_right = (x + 1) * height + (y + 1);
                
                // First triangle
                indices.push(top_left as u32);
                indices.push(bottom_left as u32);
                indices.push(top_right as u32);
                
                // Second triangle
                indices.push(top_right as u32);
                indices.push(bottom_left as u32);
                indices.push(bottom_right as u32);
            }
        }
        
        FieldMesh {
            vertices,
            indices,
            colors,
        }
    }
}

impl FieldData {
    fn new(width: usize, height: usize, depth: usize) -> Self {
        let mut grid_points = Vec::with_capacity(width);
        
        for _ in 0..width {
            let mut column = Vec::with_capacity(height);
            for _ in 0..height {
                column.push(FieldPoint {
                    position: Point3::origin(),
                    coherence: 0.0,
                    phase: 0.0,
                    frequency: 0.0,
                    amplitude: 0.0,
                    color: [0.0, 0.0, 0.0, 0.0],
                });
            }
            grid_points.push(column);
        }
        
        Self {
            grid_points,
            width,
            height,
            depth,
        }
    }
}

#[derive(Debug)]
pub struct FieldMesh {
    pub vertices: Vec<[f32; 3]>,
    pub indices: Vec<u32>,
    pub colors: Vec<[f32; 4]>,
}

/// Convert HSL to RGB
fn hsl_to_rgb(h: f32, s: f32, l: f32) -> (f32, f32, f32) {
    let c = (1.0 - (2.0 * l - 1.0).abs()) * s;
    let h_prime = h / 60.0;
    let x = c * (1.0 - ((h_prime % 2.0) - 1.0).abs());
    let m = l - c / 2.0;
    
    let (r, g, b) = match h_prime as i32 {
        0 => (c, x, 0.0),
        1 => (x, c, 0.0),
        2 => (0.0, c, x),
        3 => (0.0, x, c),
        4 => (x, 0.0, c),
        5 => (c, 0.0, x),
        _ => (0.0, 0.0, 0.0),
    };
    
    (r + m, g + m, b + m)
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_field_creation() {
        let viz = CoherenceFieldVisualizer::new();
        assert_eq!(viz.field_data.width, 64);
        assert_eq!(viz.field_data.height, 64);
    }
    
    #[test]
    fn test_wave_calculation() {
        let viz = CoherenceFieldVisualizer::new();
        let wave = &viz.wave_functions[0];
        let point = Point3::new(1.0, 0.0, 0.0);
        let (amp, _phase) = viz.calculate_wave_at_point(point, wave);
        assert!(amp > 0.0);
        assert!(amp < wave.amplitude);
    }
    
    #[test]
    fn test_mesh_generation() {
        let mut viz = CoherenceFieldVisualizer::new();
        viz.update(0.1, 0.75);
        let mesh = viz.generate_mesh();
        assert_eq!(mesh.vertices.len(), 64 * 64);
        assert!(!mesh.indices.is_empty());
    }
}