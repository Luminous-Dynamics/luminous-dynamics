// Animation Module - Sacred Movement Patterns
// "Everything flows, everything dances"

use std::f32::consts::{PI, TAU};

pub struct AnimationState {
    pub time: f32,
    pub heartbeat: HeartbeatAnimation,
    pub coherence_waves: CoherenceWaves,
    pub sacred_rotation: SacredRotation,
    pub emergence_particles: EmergenceParticles,
}

pub struct HeartbeatAnimation {
    phase: f32,
    frequency: f32, // BPM
    amplitude: f32,
    coherence_modulation: f32,
}

pub struct CoherenceWaves {
    sources: Vec<WaveSource>,
    interference_pattern: Vec<f32>,
    grid_size: usize,
}

pub struct WaveSource {
    position: (f32, f32),
    frequency: f32,
    amplitude: f32,
    phase: f32,
}

pub struct SacredRotation {
    angles: Vec<f32>,
    speeds: Vec<f32>,
    directions: Vec<f32>,
}

pub struct EmergenceParticles {
    particles: Vec<Particle>,
    spawn_rate: f32,
    lifetime: f32,
}

pub struct Particle {
    position: [f32; 3],
    velocity: [f32; 3],
    age: f32,
    max_age: f32,
    color: [f32; 4],
}

impl AnimationState {
    pub fn new() -> Self {
        Self {
            time: 0.0,
            heartbeat: HeartbeatAnimation::new(),
            coherence_waves: CoherenceWaves::new(),
            sacred_rotation: SacredRotation::new(),
            emergence_particles: EmergenceParticles::new(),
        }
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        self.time += dt;
        self.heartbeat.update(dt, coherence);
        self.coherence_waves.update(dt, coherence);
        self.sacred_rotation.update(dt, coherence);
        self.emergence_particles.update(dt, coherence);
    }
}

impl HeartbeatAnimation {
    pub fn new() -> Self {
        Self {
            phase: 0.0,
            frequency: 60.0, // 60 BPM resting heart rate
            amplitude: 1.0,
            coherence_modulation: 0.0,
        }
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        // Adjust frequency based on coherence
        self.frequency = 60.0 + (coherence - 0.5) * 20.0;
        
        // Update phase
        self.phase += dt * self.frequency / 60.0 * TAU;
        if self.phase > TAU {
            self.phase -= TAU;
        }
        
        // Modulate amplitude with coherence
        self.amplitude = 0.8 + coherence * 0.4;
        self.coherence_modulation = coherence;
    }
    
    pub fn get_value(&self) -> f32 {
        // Realistic heartbeat waveform
        let t = self.phase / TAU;
        
        // P wave
        let p_wave = (-((t - 0.1) * 50.0).powi(2)).exp() * 0.2;
        
        // QRS complex
        let qrs = if t > 0.15 && t < 0.25 {
            let qrs_t = (t - 0.15) / 0.1;
            (qrs_t * PI).sin() * 1.0
        } else {
            0.0
        };
        
        // T wave
        let t_wave = (-((t - 0.35) * 30.0).powi(2)).exp() * 0.3;
        
        (p_wave + qrs + t_wave) * self.amplitude
    }
    
    pub fn get_pulse(&self) -> f32 {
        (self.phase.sin() + 1.0) * 0.5 * self.amplitude
    }
}

impl CoherenceWaves {
    pub fn new() -> Self {
        let grid_size = 64;
        Self {
            sources: Vec::new(),
            interference_pattern: vec![0.0; grid_size * grid_size],
            grid_size,
        }
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        // Update wave sources
        for source in &mut self.sources {
            source.phase += dt * source.frequency * TAU;
            source.amplitude = coherence;
        }
        
        // Calculate interference pattern
        for y in 0..self.grid_size {
            for x in 0..self.grid_size {
                let idx = y * self.grid_size + x;
                let fx = x as f32 / self.grid_size as f32 * 2.0 - 1.0;
                let fy = y as f32 / self.grid_size as f32 * 2.0 - 1.0;
                
                let mut value = 0.0;
                for source in &self.sources {
                    let dx = fx - source.position.0;
                    let dy = fy - source.position.1;
                    let dist = (dx * dx + dy * dy).sqrt();
                    
                    value += (dist * source.frequency - source.phase).sin() 
                           * source.amplitude 
                           * (-dist * 2.0).exp();
                }
                
                self.interference_pattern[idx] = value;
            }
        }
    }
    
    pub fn add_source(&mut self, x: f32, y: f32, frequency: f32) {
        self.sources.push(WaveSource {
            position: (x, y),
            frequency,
            amplitude: 1.0,
            phase: 0.0,
        });
    }
    
    pub fn get_value_at(&self, x: f32, y: f32) -> f32 {
        let ix = ((x + 1.0) * 0.5 * (self.grid_size - 1) as f32) as usize;
        let iy = ((y + 1.0) * 0.5 * (self.grid_size - 1) as f32) as usize;
        
        if ix < self.grid_size && iy < self.grid_size {
            self.interference_pattern[iy * self.grid_size + ix]
        } else {
            0.0
        }
    }
}

impl SacredRotation {
    pub fn new() -> Self {
        Self {
            angles: vec![0.0; 7], // 7 layers
            speeds: vec![0.1, 0.13, 0.17, 0.19, 0.23, 0.29, 0.31], // Prime-based
            directions: vec![1.0, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0],
        }
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        for i in 0..self.angles.len() {
            self.angles[i] += dt * self.speeds[i] * self.directions[i] * coherence;
            if self.angles[i] > TAU {
                self.angles[i] -= TAU;
            } else if self.angles[i] < 0.0 {
                self.angles[i] += TAU;
            }
        }
    }
    
    pub fn get_angle(&self, layer: usize) -> f32 {
        self.angles.get(layer).copied().unwrap_or(0.0)
    }
}

impl EmergenceParticles {
    pub fn new() -> Self {
        Self {
            particles: Vec::new(),
            spawn_rate: 10.0,
            lifetime: 3.0,
        }
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        // Spawn new particles based on coherence
        if coherence > 0.8 {
            let spawn_count = (self.spawn_rate * dt * (coherence - 0.8) * 5.0) as usize;
            for _ in 0..spawn_count {
                self.spawn_particle(coherence);
            }
        }
        
        // Update existing particles
        self.particles.retain_mut(|particle| {
            particle.age += dt;
            
            // Update position
            particle.position[0] += particle.velocity[0] * dt;
            particle.position[1] += particle.velocity[1] * dt;
            particle.position[2] += particle.velocity[2] * dt;
            
            // Apply gravity/attraction
            let dist = (particle.position[0].powi(2) + particle.position[1].powi(2)).sqrt();
            if dist > 0.01 {
                particle.velocity[0] -= particle.position[0] / dist * coherence * dt;
                particle.velocity[1] -= particle.position[1] / dist * coherence * dt;
            }
            
            // Fade out
            let age_factor = 1.0 - (particle.age / particle.max_age);
            particle.color[3] = age_factor * age_factor;
            
            particle.age < particle.max_age
        });
    }
    
    fn spawn_particle(&mut self, coherence: f32) {
        let angle = rand() * TAU;
        let radius = rand() * 0.5;
        
        self.particles.push(Particle {
            position: [
                angle.cos() * radius,
                angle.sin() * radius,
                rand() * 0.1,
            ],
            velocity: [
                (rand() - 0.5) * 0.2,
                (rand() - 0.5) * 0.2,
                rand() * 0.1,
            ],
            age: 0.0,
            max_age: self.lifetime * (0.5 + rand() * 0.5),
            color: [
                0.9 + rand() * 0.1,
                0.8 + rand() * 0.2,
                0.7 + rand() * 0.3,
                1.0,
            ],
        });
    }
    
    pub fn get_particles(&self) -> &[Particle] {
        &self.particles
    }
}

// Simple pseudo-random
fn rand() -> f32 {
    static mut SEED: u32 = 0x12345678;
    unsafe {
        SEED = SEED.wrapping_mul(1664525).wrapping_add(1013904223);
        (SEED >> 16) as f32 / 65535.0
    }
}