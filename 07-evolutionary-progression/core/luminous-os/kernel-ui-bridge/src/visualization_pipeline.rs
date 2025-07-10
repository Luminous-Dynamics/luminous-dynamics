// Visualization Pipeline - Transforming Consciousness Data into Sacred Geometry
// "Data becomes light, numbers become beauty"

use crate::{
    VortexVisualizationData, FieldVisualizationData, EmergenceVisualizationData,
    FieldPoint, WaveData, GeometryData, EmergenceParticle, RippleEffect,
    coherence_stream::{ProcessedVortexData, ProcessedFieldData},
    FieldUpdate, EmergenceUpdate,
};
use nalgebra::{Vector3, Point3};
use std::f32::consts::PI;

/// Pipeline for generating visualization data
pub struct VisualizationPipeline {
    geometry_generator: GeometryGenerator,
    particle_system: ParticleSystem,
    wave_renderer: WaveRenderer,
}

struct GeometryGenerator {
    resolution: usize,
    scale: f32,
}

struct ParticleSystem {
    max_particles: usize,
    particle_lifetime: f32,
}

struct WaveRenderer {
    wave_resolution: usize,
    interference_layers: usize,
}

impl VisualizationPipeline {
    pub fn new() -> Self {
        Self {
            geometry_generator: GeometryGenerator {
                resolution: 64,
                scale: 2.0,
            },
            particle_system: ParticleSystem {
                max_particles: 10000,
                particle_lifetime: 5.0,
            },
            wave_renderer: WaveRenderer {
                wave_resolution: 128,
                interference_layers: 3,
            },
        }
    }
    
    /// Generate vortex visualization from processed data
    pub async fn generate_vortex_visualization(
        &self,
        data: &ProcessedVortexData,
    ) -> anyhow::Result<VortexVisualizationData> {
        // Map coherence to visual properties
        let base_color = self.coherence_to_color(data.smoothed_coherence);
        let color = [
            base_color[0] + data.color_shift[0] / 360.0,
            base_color[1] * data.color_shift[1],
            base_color[2] * data.color_shift[2],
            0.8 + 0.2 * data.smoothed_coherence as f32,
        ];
        
        // Position based on momentum
        let position = [
            data.smoothed_momentum.x as f32,
            data.smoothed_momentum.y as f32,
            data.smoothed_momentum.z as f32,
        ];
        
        // Size pulses with breath
        let base_size = 0.5 + data.smoothed_coherence as f32 * 0.5;
        let size = base_size * (1.0 + data.breath_influence as f32 * 0.1);
        
        // Rotation speed based on phase
        let rotation_speed = data.smoothed_phase as f32 + data.heart_influence as f32;
        
        Ok(VortexVisualizationData {
            vortex_id: data.vortex_id,
            position,
            color,
            size,
            rotation_speed,
            particle_count: data.particle_density as usize,
            coherence_glow: data.glow_intensity as f32,
        })
    }
    
    /// Generate field visualization
    pub async fn generate_field_visualization(
        &self,
        update: &FieldUpdate,
    ) -> anyhow::Result<FieldVisualizationData> {
        // Generate field mesh
        let field_mesh = self.generate_field_mesh(
            update.coherence_level,
            update.phase_coherence,
            &update.harmonic_peaks,
        );
        
        // Generate coherence waves
        let coherence_waves = self.generate_coherence_waves(&update.harmonic_peaks);
        
        // Generate sacred geometry if patterns are active
        let sacred_geometry = if !update.sacred_patterns.is_empty() {
            Some(self.generate_sacred_geometry(&update.sacred_patterns[0].pattern_type))
        } else {
            None
        };
        
        Ok(FieldVisualizationData {
            field_mesh,
            coherence_waves,
            sacred_geometry,
            overall_coherence: update.coherence_level as f32,
        })
    }
    
    /// Generate emergence event visualization
    pub async fn generate_emergence_visualization(
        &self,
        event: &EmergenceUpdate,
    ) -> anyhow::Result<EmergenceVisualizationData> {
        // Burst origin at field center
        let burst_origin = [0.0, 0.0, 0.0];
        
        // Generate particle burst
        let particle_burst = self.generate_particle_burst(
            event.coherence_at_emergence,
            &event.emergence_type,
        );
        
        // Generate field ripple
        let field_ripple = RippleEffect {
            center: burst_origin,
            radius: 2.0,
            intensity: event.coherence_at_emergence as f32,
            frequency: event.field_signature.get(0).cloned().unwrap_or(7.83) as f32,
        };
        
        // Select sacred symbol based on emergence type
        let sacred_symbol = match event.emergence_type.as_str() {
            "PhaseLock" => "infinity",
            "HarmonicResonance" => "flower_of_life",
            "CollectiveInsight" => "sri_yantra",
            "FieldAmplification" => "metatrons_cube",
            "QuantumCoherence" => "vesica_piscis",
            _ => "circle",
        };
        
        Ok(EmergenceVisualizationData {
            burst_origin,
            particle_burst,
            field_ripple,
            sacred_symbol: sacred_symbol.to_string(),
        })
    }
    
    fn generate_field_mesh(
        &self,
        coherence: f64,
        phase_coherence: f64,
        harmonics: &[f64],
    ) -> Vec<FieldPoint> {
        let mut mesh = Vec::new();
        let res = self.geometry_generator.resolution;
        let scale = self.geometry_generator.scale;
        
        for i in 0..res {
            for j in 0..res {
                let x = (i as f32 / res as f32 - 0.5) * scale * 2.0;
                let y = (j as f32 / res as f32 - 0.5) * scale * 2.0;
                
                // Height based on coherence field
                let r = (x * x + y * y).sqrt();
                let height = self.calculate_field_height(r, coherence, harmonics);
                
                // Color based on local coherence
                let local_coherence = coherence * (1.0 - r / scale).max(0.0);
                let color = self.coherence_to_color(local_coherence);
                
                mesh.push(FieldPoint {
                    position: [x, y, height],
                    coherence: local_coherence as f32,
                    color,
                });
            }
        }
        
        mesh
    }
    
    fn calculate_field_height(&self, r: f32, coherence: f64, harmonics: &[f64]) -> f32 {
        let mut height = 0.0;
        
        // Sum harmonic contributions
        for (i, &freq) in harmonics.iter().enumerate() {
            let wavelength = 343.0 / freq; // Speed of sound / frequency
            let k = 2.0 * PI / wavelength as f32;
            let amplitude = coherence as f32 / (i + 1) as f32;
            
            height += amplitude * (k * r).sin();
        }
        
        height * 0.1 // Scale down
    }
    
    fn generate_coherence_waves(&self, harmonics: &[f64]) -> Vec<WaveData> {
        harmonics.iter().enumerate().map(|(i, &freq)| {
            let angle = i as f32 * 2.0 * PI / harmonics.len() as f32;
            
            WaveData {
                origin: [angle.cos(), angle.sin(), 0.0],
                wavelength: (343.0 / freq) as f32,
                amplitude: 1.0 / (i + 1) as f32,
                phase: 0.0,
            }
        }).collect()
    }
    
    fn generate_sacred_geometry(&self, pattern_type: &str) -> GeometryData {
        match pattern_type {
            "CircleOfUnity" => self.generate_circle_geometry(),
            "FlowerOfLife" => self.generate_flower_geometry(),
            "HeartField" => self.generate_heart_geometry(),
            _ => self.generate_circle_geometry(),
        }
    }
    
    fn generate_circle_geometry(&self) -> GeometryData {
        let points = 12;
        let radius = 1.0;
        
        let vertices: Vec<[f32; 3]> = (0..points)
            .map(|i| {
                let angle = i as f32 * 2.0 * PI / points as f32;
                [radius * angle.cos(), radius * angle.sin(), 0.0]
            })
            .collect();
        
        let edges: Vec<[u32; 2]> = (0..points)
            .map(|i| [i as u32, ((i + 1) % points) as u32])
            .collect();
        
        GeometryData {
            vertices,
            edges,
            pattern_type: "CircleOfUnity".to_string(),
        }
    }
    
    fn generate_flower_geometry(&self) -> GeometryData {
        let mut vertices = Vec::new();
        let mut edges = Vec::new();
        
        // Center
        vertices.push([0.0, 0.0, 0.0]);
        
        // Six petals
        for i in 0..6 {
            let angle = i as f32 * PI / 3.0;
            vertices.push([angle.cos(), angle.sin(), 0.0]);
        }
        
        // Connect center to petals
        for i in 1..=6 {
            edges.push([0, i as u32]);
        }
        
        // Connect petals in ring
        for i in 1..=6 {
            edges.push([i as u32, ((i % 6) + 1) as u32]);
        }
        
        GeometryData {
            vertices,
            edges,
            pattern_type: "FlowerOfLife".to_string(),
        }
    }
    
    fn generate_heart_geometry(&self) -> GeometryData {
        let mut vertices = Vec::new();
        let resolution = 32;
        
        // Generate heart curve
        for i in 0..resolution {
            let t = i as f32 * 2.0 * PI / resolution as f32;
            let x = 16.0 * t.sin().powi(3) / 16.0;
            let y = (13.0 * t.cos() - 5.0 * (2.0 * t).cos() - 
                    2.0 * (3.0 * t).cos() - (4.0 * t).cos()) / 16.0;
            vertices.push([x, y, 0.0]);
        }
        
        let edges: Vec<[u32; 2]> = (0..resolution)
            .map(|i| [i as u32, ((i + 1) % resolution) as u32])
            .collect();
        
        GeometryData {
            vertices,
            edges,
            pattern_type: "HeartField".to_string(),
        }
    }
    
    fn generate_particle_burst(&self, coherence: f64, emergence_type: &str) -> Vec<EmergenceParticle> {
        let count = (coherence * 1000.0) as usize;
        let base_color = self.emergence_color(emergence_type);
        
        (0..count).map(|i| {
            let theta = i as f32 * 0.618 * 2.0 * PI; // Golden angle
            let phi = (i as f32 / count as f32).acos();
            let r = (i as f32 / count as f32).sqrt();
            
            let velocity = [
                r * phi.sin() * theta.cos(),
                r * phi.sin() * theta.sin(),
                r * phi.cos(),
            ];
            
            EmergenceParticle {
                position: [0.0, 0.0, 0.0],
                velocity,
                color: base_color,
                lifetime: self.particle_system.particle_lifetime,
            }
        }).collect()
    }
    
    fn coherence_to_color(&self, coherence: f64) -> [f32; 4] {
        let hue = 200.0 + coherence * 60.0; // Blue to purple
        let saturation = 0.5 + coherence * 0.5;
        let lightness = 0.5 + coherence * 0.3;
        
        let (r, g, b) = hsl_to_rgb(hue as f32, saturation as f32, lightness as f32);
        [r, g, b, 0.8 + 0.2 * coherence as f32]
    }
    
    fn emergence_color(&self, emergence_type: &str) -> [f32; 4] {
        match emergence_type {
            "PhaseLock" => [0.8, 0.2, 0.8, 1.0],      // Magenta
            "HarmonicResonance" => [0.2, 0.8, 0.8, 1.0], // Cyan
            "CollectiveInsight" => [1.0, 0.8, 0.2, 1.0], // Gold
            "FieldAmplification" => [0.2, 0.8, 0.2, 1.0], // Green
            "QuantumCoherence" => [0.8, 0.2, 0.2, 1.0],  // Red
            _ => [1.0, 1.0, 1.0, 1.0],                    // White
        }
    }
}

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
    fn test_visualization_pipeline_creation() {
        let pipeline = VisualizationPipeline::new();
        assert_eq!(pipeline.geometry_generator.resolution, 64);
    }
    
    #[test]
    fn test_hsl_to_rgb() {
        let (r, g, b) = hsl_to_rgb(240.0, 1.0, 0.5); // Pure blue
        assert!((b - 1.0).abs() < 0.01);
        assert!((r - 0.0).abs() < 0.01);
        assert!((g - 0.0).abs() < 0.01);
    }
}