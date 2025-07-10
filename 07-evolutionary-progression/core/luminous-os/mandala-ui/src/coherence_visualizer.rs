// Coherence Visualizer - Real-time Field Coherence Display
// "See the unified field breathing"

use wgpu::*;
use bytemuck::{Pod, Zeroable};
use cgmath::*;

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
struct CoherenceVertex {
    position: [f32; 2],
    field_strength: f32,
}

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
struct CoherenceUniforms {
    time: f32,
    coherence: f32,
    participants: u32,
    emergence: f32,
    wave_params: [f32; 4], // frequency, amplitude, speed, decay
}

pub struct CoherenceVisualizer {
    pipeline: RenderPipeline,
    vertex_buffer: Buffer,
    uniform_buffer: Buffer,
    bind_group: BindGroup,
    wave_field: WaveField,
    particle_system: ParticleSystem,
}

struct WaveField {
    resolution: u32,
    vertices: Vec<CoherenceVertex>,
    vertex_count: u32,
}

struct ParticleSystem {
    particles: Vec<Particle>,
    vertex_buffer: Option<Buffer>,
}

#[derive(Clone, Copy)]
struct Particle {
    position: [f32; 2],
    velocity: [f32; 2],
    life: f32,
    coherence_contribution: f32,
}

impl CoherenceVisualizer {
    pub fn new(device: &Device, config: &SurfaceConfiguration) -> Result<Self, Box<dyn std::error::Error>> {
        // Create wave field mesh
        let wave_field = WaveField::new(64); // 64x64 grid
        
        let vertex_buffer = device.create_buffer_init(&util::BufferInitDescriptor {
            label: Some("Coherence Vertex Buffer"),
            contents: bytemuck::cast_slice(&wave_field.vertices),
            usage: BufferUsages::VERTEX | BufferUsages::COPY_DST,
        });
        
        // Uniforms
        let uniform_buffer = device.create_buffer(&BufferDescriptor {
            label: Some("Coherence Uniform Buffer"),
            size: std::mem::size_of::<CoherenceUniforms>() as u64,
            usage: BufferUsages::UNIFORM | BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        
        // Shader
        let shader = device.create_shader_module(ShaderModuleDescriptor {
            label: Some("Coherence Shader"),
            source: ShaderSource::Wgsl(include_str!("shaders/coherence.wgsl").into()),
        });
        
        // Bind group
        let bind_group_layout = device.create_bind_group_layout(&BindGroupLayoutDescriptor {
            label: Some("Coherence Bind Group Layout"),
            entries: &[
                BindGroupLayoutEntry {
                    binding: 0,
                    visibility: ShaderStages::VERTEX | ShaderStages::FRAGMENT,
                    ty: BindingType::Buffer {
                        ty: BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                },
            ],
        });
        
        let bind_group = device.create_bind_group(&BindGroupDescriptor {
            label: Some("Coherence Bind Group"),
            layout: &bind_group_layout,
            entries: &[
                BindGroupEntry {
                    binding: 0,
                    resource: uniform_buffer.as_entire_binding(),
                },
            ],
        });
        
        // Pipeline
        let pipeline_layout = device.create_pipeline_layout(&PipelineLayoutDescriptor {
            label: Some("Coherence Pipeline Layout"),
            bind_group_layouts: &[&bind_group_layout],
            push_constant_ranges: &[],
        });
        
        let pipeline = device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Coherence Pipeline"),
            layout: Some(&pipeline_layout),
            vertex: VertexState {
                module: &shader,
                entry_point: "vs_main",
                buffers: &[VertexBufferLayout {
                    array_stride: std::mem::size_of::<CoherenceVertex>() as BufferAddress,
                    step_mode: VertexStepMode::Vertex,
                    attributes: &[
                        VertexAttribute {
                            offset: 0,
                            shader_location: 0,
                            format: VertexFormat::Float32x2,
                        },
                        VertexAttribute {
                            offset: std::mem::size_of::<[f32; 2]>() as BufferAddress,
                            shader_location: 1,
                            format: VertexFormat::Float32,
                        },
                    ],
                }],
            },
            fragment: Some(FragmentState {
                module: &shader,
                entry_point: "fs_main",
                targets: &[Some(ColorTargetState {
                    format: config.format,
                    blend: Some(BlendState::ALPHA_BLENDING),
                    write_mask: ColorWrites::ALL,
                })],
            }),
            primitive: PrimitiveState {
                topology: PrimitiveTopology::TriangleList,
                strip_index_format: None,
                front_face: FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            multiview: None,
        });
        
        Ok(Self {
            pipeline,
            vertex_buffer,
            uniform_buffer,
            bind_group,
            wave_field,
            particle_system: ParticleSystem::new(),
        })
    }
    
    pub fn update(&mut self, dt: f32, coherence: f32) {
        // Update wave field
        self.wave_field.update(dt, coherence);
        
        // Update particle system
        self.particle_system.update(dt, coherence);
    }
    
    pub fn render<'a>(&'a self, render_pass: &mut RenderPass<'a>) {
        render_pass.set_pipeline(&self.pipeline);
        render_pass.set_bind_group(0, &self.bind_group, &[]);
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.draw(0..self.wave_field.vertex_count, 0..1);
    }
    
    pub fn resize(&mut self, device: &Device, config: &SurfaceConfiguration) {
        // Update size-dependent resources
    }
    
    pub fn update_uniforms(&self, queue: &Queue, time: f32, coherence: f32, participants: u32, emergence: f32) {
        let uniforms = CoherenceUniforms {
            time,
            coherence,
            participants,
            emergence,
            wave_params: [
                7.83,  // Schumann resonance frequency
                0.2,   // amplitude
                1.0,   // speed
                0.95,  // decay
            ],
        };
        
        queue.write_buffer(&self.uniform_buffer, 0, bytemuck::cast_slice(&[uniforms]));
    }
}

impl WaveField {
    fn new(resolution: u32) -> Self {
        let mut vertices = Vec::new();
        
        // Create grid of vertices
        for y in 0..resolution {
            for x in 0..resolution {
                let px = (x as f32 / (resolution - 1) as f32) * 2.0 - 1.0;
                let py = (y as f32 / (resolution - 1) as f32) * 2.0 - 1.0;
                
                // Create two triangles for each quad
                let field_strength = 0.0; // Will be computed in shader
                
                // Triangle 1
                vertices.push(CoherenceVertex {
                    position: [px, py],
                    field_strength,
                });
                
                if x < resolution - 1 && y < resolution - 1 {
                    // Complete the quad with proper winding
                    vertices.push(CoherenceVertex {
                        position: [px + 2.0 / (resolution - 1) as f32, py],
                        field_strength,
                    });
                    vertices.push(CoherenceVertex {
                        position: [px, py + 2.0 / (resolution - 1) as f32],
                        field_strength,
                    });
                    
                    // Triangle 2
                    vertices.push(CoherenceVertex {
                        position: [px + 2.0 / (resolution - 1) as f32, py],
                        field_strength,
                    });
                    vertices.push(CoherenceVertex {
                        position: [px + 2.0 / (resolution - 1) as f32, py + 2.0 / (resolution - 1) as f32],
                        field_strength,
                    });
                    vertices.push(CoherenceVertex {
                        position: [px, py + 2.0 / (resolution - 1) as f32],
                        field_strength,
                    });
                }
            }
        }
        
        Self {
            resolution,
            vertex_count: vertices.len() as u32,
            vertices,
        }
    }
    
    fn update(&mut self, dt: f32, coherence: f32) {
        // Wave propagation simulation
        for vertex in &mut self.vertices {
            let dist = (vertex.position[0].powi(2) + vertex.position[1].powi(2)).sqrt();
            vertex.field_strength = (1.0 - dist) * coherence;
        }
    }
}

impl ParticleSystem {
    fn new() -> Self {
        Self {
            particles: Vec::new(),
            vertex_buffer: None,
        }
    }
    
    fn update(&mut self, dt: f32, coherence: f32) {
        // Spawn new particles based on coherence
        if coherence > 0.7 && self.particles.len() < 1000 {
            for _ in 0..(coherence * 10.0) as usize {
                let angle = rand::random::<f32>() * std::f32::consts::TAU;
                let radius = rand::random::<f32>() * 0.5;
                
                self.particles.push(Particle {
                    position: [angle.cos() * radius, angle.sin() * radius],
                    velocity: [
                        (rand::random::<f32>() - 0.5) * 0.1,
                        (rand::random::<f32>() - 0.5) * 0.1,
                    ],
                    life: 1.0,
                    coherence_contribution: coherence,
                });
            }
        }
        
        // Update particles
        self.particles.retain_mut(|particle| {
            particle.position[0] += particle.velocity[0] * dt;
            particle.position[1] += particle.velocity[1] * dt;
            particle.life -= dt * 0.5;
            
            // Attract to center based on coherence
            let dist = (particle.position[0].powi(2) + particle.position[1].powi(2)).sqrt();
            if dist > 0.01 {
                particle.velocity[0] -= particle.position[0] / dist * coherence * dt;
                particle.velocity[1] -= particle.position[1] / dist * coherence * dt;
            }
            
            particle.life > 0.0
        });
    }
}

// Mock random for particles
mod rand {
    pub fn random<T>() -> T 
    where T: Default {
        T::default()
    }
}