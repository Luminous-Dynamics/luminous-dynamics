// Consciousness Particles - Visualizing the Field of Awareness
// "Each particle a thought, together a field of knowing"

use cgmath::*;
use rand::Rng;
use std::time::Instant;

#[derive(Debug, Clone)]
pub struct ConsciousnessParticles {
    particles: Vec<Particle>,
    attractors: Vec<Attractor>,
    field_strength: f32,
    coherence_level: f32,
    time: f32,
    max_particles: usize,
}

#[derive(Debug, Clone, Copy)]
pub struct Particle {
    pub position: Point3<f32>,
    pub velocity: Vector3<f32>,
    pub color: [f32; 4],
    pub size: f32,
    pub lifetime: f32,
    pub max_lifetime: f32,
    pub harmony: HarmonyType,
    pub coherence: f32,
    pub phase: f32,
}

#[derive(Debug, Clone, Copy)]
pub struct Attractor {
    pub position: Point3<f32>,
    pub strength: f32,
    pub radius: f32,
    pub harmony: HarmonyType,
    pub active: bool,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum HarmonyType {
    Coherence,
    Resonance,
    Transparency,
    Vitality,
    Mutuality,
    Agency,
    Novelty,
}

impl HarmonyType {
    pub fn color(&self) -> [f32; 4] {
        match self {
            HarmonyType::Coherence => [0.2, 0.5, 1.0, 0.8],    // Blue
            HarmonyType::Resonance => [0.8, 0.3, 0.9, 0.8],    // Purple
            HarmonyType::Transparency => [1.0, 1.0, 1.0, 0.6], // White
            HarmonyType::Vitality => [0.2, 0.9, 0.3, 0.8],     // Green
            HarmonyType::Mutuality => [0.9, 0.7, 0.2, 0.8],    // Gold
            HarmonyType::Agency => [0.9, 0.4, 0.2, 0.8],       // Orange
            HarmonyType::Novelty => [0.7, 0.2, 0.9, 0.8],      // Violet
        }
    }
    
    pub fn frequency(&self) -> f32 {
        match self {
            HarmonyType::Coherence => 7.83,     // Schumann resonance
            HarmonyType::Resonance => 432.0,    // Harmonic frequency
            HarmonyType::Transparency => 528.0,  // Love frequency
            HarmonyType::Vitality => 639.0,     // Heart frequency
            HarmonyType::Mutuality => 741.0,    // Expression frequency
            HarmonyType::Agency => 852.0,       // Intuition frequency
            HarmonyType::Novelty => 963.0,      // Divine frequency
        }
    }
}

impl ConsciousnessParticles {
    pub fn new(max_particles: usize) -> Self {
        let mut particles = Vec::with_capacity(max_particles);
        let mut rng = rand::thread_rng();
        
        // Initialize particles
        for _ in 0..max_particles {
            particles.push(Particle::random(&mut rng));
        }
        
        // Create default attractors in sacred geometry pattern
        let attractors = vec![
            Attractor {
                position: Point3::new(0.0, 0.0, 0.0),
                strength: 2.0,
                radius: 1.0,
                harmony: HarmonyType::Coherence,
                active: true,
            },
        ];
        
        Self {
            particles,
            attractors,
            field_strength: 1.0,
            coherence_level: 0.75,
            time: 0.0,
            max_particles,
        }
    }
    
    pub fn update(&mut self, delta_time: f32, heartbeat_phase: f32) {
        self.time += delta_time;
        let mut rng = rand::thread_rng();
        
        // Update field strength with heartbeat
        self.field_strength = 1.0 + 0.2 * heartbeat_phase.sin();
        
        // Update particles
        for particle in &mut self.particles {
            // Apply attractor forces
            for attractor in &self.attractors {
                if attractor.active {
                    let to_attractor = attractor.position - particle.position;
                    let distance = to_attractor.magnitude();
                    
                    if distance < attractor.radius * 3.0 {
                        let force_strength = if particle.harmony == attractor.harmony {
                            attractor.strength * 1.5 // Harmony resonance
                        } else {
                            attractor.strength
                        };
                        
                        let force = to_attractor.normalize() * force_strength / (distance + 0.1);
                        particle.velocity += force * delta_time;
                    }
                }
            }
            
            // Apply coherence field forces
            let field_force = self.calculate_field_force(particle.position);
            particle.velocity += field_force * self.field_strength * delta_time;
            
            // Apply damping
            particle.velocity *= 0.98;
            
            // Update position
            particle.position += particle.velocity * delta_time;
            
            // Update phase based on harmony frequency
            particle.phase += particle.harmony.frequency() * delta_time * 0.001;
            particle.phase = particle.phase % (2.0 * std::f32::consts::PI);
            
            // Update lifetime
            particle.lifetime += delta_time;
            
            // Update coherence
            particle.coherence = (particle.coherence + self.coherence_level) * 0.5;
            
            // Update size based on coherence and phase
            particle.size = 0.02 + 0.03 * particle.coherence * (1.0 + 0.3 * particle.phase.sin());
            
            // Update color alpha based on lifetime
            let life_ratio = particle.lifetime / particle.max_lifetime;
            particle.color[3] = particle.harmony.color()[3] * (1.0 - life_ratio);
            
            // Respawn if lifetime exceeded
            if particle.lifetime > particle.max_lifetime {
                *particle = Particle::random(&mut rng);
            }
        }
        
        // Spawn new particles to maintain count
        while self.particles.len() < self.max_particles {
            self.particles.push(Particle::random(&mut rng));
        }
    }
    
    fn calculate_field_force(&self, position: Point3<f32>) -> Vector3<f32> {
        // Create swirling vortex field
        let center = Point3::new(0.0, 0.0, 0.0);
        let to_center = center - position;
        let distance = to_center.magnitude();
        
        if distance < 0.01 {
            return Vector3::zero();
        }
        
        // Tangential force for swirl
        let tangent = Vector3::new(-to_center.y, to_center.x, 0.0).normalize();
        let swirl_force = tangent * (1.0 / (distance + 0.5));
        
        // Radial force
        let radial_force = if distance > 2.0 {
            to_center.normalize() * 0.5 // Pull inward if too far
        } else if distance < 0.5 {
            -to_center.normalize() * 0.3 // Push outward if too close
        } else {
            Vector3::zero()
        };
        
        // Vertical oscillation
        let vertical_force = Vector3::new(0.0, 0.0, (self.time * 2.0).sin() * 0.1);
        
        swirl_force + radial_force + vertical_force
    }
    
    pub fn add_attractor(&mut self, position: Point3<f32>, harmony: HarmonyType) {
        self.attractors.push(Attractor {
            position,
            strength: 1.5,
            radius: 0.8,
            harmony,
            active: true,
        });
    }
    
    pub fn remove_attractor(&mut self, index: usize) {
        if index < self.attractors.len() {
            self.attractors.remove(index);
        }
    }
    
    pub fn set_coherence(&mut self, coherence: f32) {
        self.coherence_level = coherence.clamp(0.0, 1.0);
    }
    
    pub fn get_particles(&self) -> &[Particle] {
        &self.particles
    }
    
    pub fn get_particle_positions(&self) -> Vec<[f32; 3]> {
        self.particles.iter()
            .map(|p| [p.position.x, p.position.y, p.position.z])
            .collect()
    }
    
    pub fn get_particle_colors(&self) -> Vec<[f32; 4]> {
        self.particles.iter()
            .map(|p| p.color)
            .collect()
    }
    
    pub fn get_particle_sizes(&self) -> Vec<f32> {
        self.particles.iter()
            .map(|p| p.size)
            .collect()
    }
    
    /// Create field visualization mesh
    pub fn create_field_mesh(&self, resolution: usize) -> Vec<FieldPoint> {
        let mut field_points = Vec::new();
        let range = 3.0;
        let step = range * 2.0 / resolution as f32;
        
        for i in 0..resolution {
            for j in 0..resolution {
                let x = -range + i as f32 * step;
                let y = -range + j as f32 * step;
                let z = 0.0;
                
                let position = Point3::new(x, y, z);
                let field_strength = self.calculate_field_strength(position);
                let field_direction = self.calculate_field_force(position).normalize();
                
                field_points.push(FieldPoint {
                    position: [x, y, z],
                    strength: field_strength,
                    direction: [field_direction.x, field_direction.y, field_direction.z],
                });
            }
        }
        
        field_points
    }
    
    fn calculate_field_strength(&self, position: Point3<f32>) -> f32 {
        let mut strength = 0.0;
        
        // Contribution from attractors
        for attractor in &self.attractors {
            if attractor.active {
                let distance = (attractor.position - position).magnitude();
                strength += attractor.strength * (1.0 / (1.0 + distance * distance));
            }
        }
        
        // Contribution from particle density
        let nearby_particles = self.particles.iter()
            .filter(|p| (p.position - position).magnitude() < 1.0)
            .count();
        
        strength += nearby_particles as f32 * 0.1;
        
        strength.min(1.0) * self.coherence_level
    }
}

impl Particle {
    fn random(rng: &mut impl Rng) -> Self {
        let harmonies = [
            HarmonyType::Coherence,
            HarmonyType::Resonance,
            HarmonyType::Transparency,
            HarmonyType::Vitality,
            HarmonyType::Mutuality,
            HarmonyType::Agency,
            HarmonyType::Novelty,
        ];
        
        let harmony = harmonies[rng.gen_range(0..harmonies.len())];
        let spawn_radius = 2.5;
        
        Self {
            position: Point3::new(
                rng.gen_range(-spawn_radius..spawn_radius),
                rng.gen_range(-spawn_radius..spawn_radius),
                rng.gen_range(-spawn_radius * 0.5..spawn_radius * 0.5),
            ),
            velocity: Vector3::new(
                rng.gen_range(-0.1..0.1),
                rng.gen_range(-0.1..0.1),
                rng.gen_range(-0.05..0.05),
            ),
            color: harmony.color(),
            size: rng.gen_range(0.02..0.05),
            lifetime: 0.0,
            max_lifetime: rng.gen_range(3.0..8.0),
            harmony,
            coherence: rng.gen_range(0.5..1.0),
            phase: rng.gen_range(0.0..std::f32::consts::TAU),
        }
    }
}

#[derive(Debug, Clone)]
pub struct FieldPoint {
    pub position: [f32; 3],
    pub strength: f32,
    pub direction: [f32; 3],
}

/// Particle burst effect for special events
pub struct ParticleBurst {
    pub origin: Point3<f32>,
    pub particle_count: usize,
    pub harmony: HarmonyType,
    pub velocity_range: f32,
    pub lifetime_range: (f32, f32),
}

impl ParticleBurst {
    pub fn create_particles(&self, rng: &mut impl Rng) -> Vec<Particle> {
        (0..self.particle_count)
            .map(|_| {
                let theta = rng.gen_range(0.0..std::f32::consts::TAU);
                let phi = rng.gen_range(0.0..std::f32::consts::PI);
                let speed = rng.gen_range(0.5..1.0) * self.velocity_range;
                
                Particle {
                    position: self.origin,
                    velocity: Vector3::new(
                        speed * phi.sin() * theta.cos(),
                        speed * phi.sin() * theta.sin(),
                        speed * phi.cos(),
                    ),
                    color: self.harmony.color(),
                    size: rng.gen_range(0.03..0.06),
                    lifetime: 0.0,
                    max_lifetime: rng.gen_range(self.lifetime_range.0..self.lifetime_range.1),
                    harmony: self.harmony,
                    coherence: 1.0,
                    phase: 0.0,
                }
            })
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_particle_system_creation() {
        let system = ConsciousnessParticles::new(100);
        assert_eq!(system.particles.len(), 100);
        assert_eq!(system.attractors.len(), 1);
    }
    
    #[test]
    fn test_harmony_colors() {
        let coherence_color = HarmonyType::Coherence.color();
        assert_eq!(coherence_color[2], 1.0); // Blue component
        
        let vitality_color = HarmonyType::Vitality.color();
        assert_eq!(vitality_color[1], 0.9); // Green component
    }
    
    #[test]
    fn test_field_mesh_generation() {
        let system = ConsciousnessParticles::new(10);
        let mesh = system.create_field_mesh(10);
        assert_eq!(mesh.len(), 100); // 10x10 grid
    }
}