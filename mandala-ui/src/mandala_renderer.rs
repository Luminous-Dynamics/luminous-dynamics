// Mandala Renderer - Central Sacred Geometry
// "The heart of the interface, pulsing with life"

use wgpu::*;
use cgmath::*;
use bytemuck::{Pod, Zeroable};
use std::sync::Arc;

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
struct MandalaVertex {
    position: [f32; 3],
    tex_coords: [f32; 2],
    sacred_index: f32,
}

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
struct MandalaUniforms {
    view_proj: [[f32; 4]; 4],
    time: f32,
    heartbeat_phase: f32,
    coherence: f32,
    emergence: f32,
    field_color: [f32; 4],
    participant_count: u32,
    _padding: [f32; 3],
}

pub struct MandalaRenderer {
    pipeline: RenderPipeline,
    vertex_buffer: Buffer,
    index_buffer: Buffer,
    uniform_buffer: Buffer,
    uniform_bind_group: BindGroup,
    vertex_count: u32,
    index_count: u32,
    
    // Animation state
    rotation: f32,
    pulse_scale: f32,
    fractal_depth: u32,
}

impl MandalaRenderer {
    pub fn new(device: &Device, config: &SurfaceConfiguration) -> Result<Self, Box<dyn std::error::Error>> {
        // Create mandala geometry
        let (vertices, indices) = Self::create_mandala_geometry();
        
        let vertex_buffer = device.create_buffer_init(&util::BufferInitDescriptor {
            label: Some("Mandala Vertex Buffer"),
            contents: bytemuck::cast_slice(&vertices),
            usage: BufferUsages::VERTEX,
        });
        
        let index_buffer = device.create_buffer_init(&util::BufferInitDescriptor {
            label: Some("Mandala Index Buffer"),
            contents: bytemuck::cast_slice(&indices),
            usage: BufferUsages::INDEX,
        });
        
        // Uniforms
        let uniform_buffer = device.create_buffer(&BufferDescriptor {
            label: Some("Mandala Uniform Buffer"),
            size: std::mem::size_of::<MandalaUniforms>() as u64,
            usage: BufferUsages::UNIFORM | BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        
        // Shader
        let shader = device.create_shader_module(ShaderModuleDescriptor {
            label: Some("Mandala Shader"),
            source: ShaderSource::Wgsl(include_str!("shaders/mandala.wgsl").into()),
        });
        
        // Bind group layout
        let bind_group_layout = device.create_bind_group_layout(&BindGroupLayoutDescriptor {
            label: Some("Mandala Bind Group Layout"),
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
        
        let uniform_bind_group = device.create_bind_group(&BindGroupDescriptor {
            label: Some("Mandala Bind Group"),
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
            label: Some("Mandala Pipeline Layout"),
            bind_group_layouts: &[&bind_group_layout],
            push_constant_ranges: &[],
        });
        
        let pipeline = device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Mandala Pipeline"),
            layout: Some(&pipeline_layout),
            vertex: VertexState {
                module: &shader,
                entry_point: "vs_main",
                buffers: &[VertexBufferLayout {
                    array_stride: std::mem::size_of::<MandalaVertex>() as BufferAddress,
                    step_mode: VertexStepMode::Vertex,
                    attributes: &[
                        VertexAttribute {
                            offset: 0,
                            shader_location: 0,
                            format: VertexFormat::Float32x3,
                        },
                        VertexAttribute {
                            offset: std::mem::size_of::<[f32; 3]>() as BufferAddress,
                            shader_location: 1,
                            format: VertexFormat::Float32x2,
                        },
                        VertexAttribute {
                            offset: std::mem::size_of::<[f32; 5]>() as BufferAddress,
                            shader_location: 2,
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
            index_buffer,
            uniform_buffer,
            uniform_bind_group,
            vertex_count: vertices.len() as u32,
            index_count: indices.len() as u32,
            rotation: 0.0,
            pulse_scale: 1.0,
            fractal_depth: 3,
        })
    }
    
    fn create_mandala_geometry() -> (Vec<MandalaVertex>, Vec<u16>) {
        let mut vertices = Vec::new();
        let mut indices = Vec::new();
        
        // Center point
        vertices.push(MandalaVertex {
            position: [0.0, 0.0, 0.0],
            tex_coords: [0.5, 0.5],
            sacred_index: 0.0,
        });
        
        // Create concentric rings with sacred geometry
        let rings = 7; // Sacred number
        let segments_per_ring = [6, 12, 18, 24, 36, 48, 60]; // Multiples of 6
        
        for ring in 0..rings {
            let radius = (ring + 1) as f32 * 0.1;
            let segments = segments_per_ring[ring];
            
            for i in 0..segments {
                let angle = (i as f32 / segments as f32) * std::f32::consts::TAU;
                let x = angle.cos() * radius;
                let y = angle.sin() * radius;
                
                vertices.push(MandalaVertex {
                    position: [x, y, 0.0],
                    tex_coords: [
                        (x + 1.0) * 0.5,
                        (y + 1.0) * 0.5,
                    ],
                    sacred_index: ring as f32,
                });
            }
        }
        
        // Create triangulation
        let mut vertex_offset = 1;
        for ring in 0..rings {
            let segments = segments_per_ring[ring];
            
            if ring == 0 {
                // Connect center to first ring
                for i in 0..segments {
                    indices.push(0);
                    indices.push((vertex_offset + i) as u16);
                    indices.push((vertex_offset + (i + 1) % segments) as u16);
                }
            } else {
                // Connect rings
                let prev_segments = segments_per_ring[ring - 1];
                let prev_offset = vertex_offset - prev_segments;
                
                // Create strip between rings
                for i in 0..segments {
                    let ratio = segments as f32 / prev_segments as f32;
                    let prev_i = ((i as f32 / ratio) as usize) % prev_segments;
                    let next_prev_i = ((((i + 1) as f32 / ratio) as usize) % prev_segments);
                    
                    // Triangle 1
                    indices.push((prev_offset + prev_i) as u16);
                    indices.push((vertex_offset + i) as u16);
                    indices.push((vertex_offset + (i + 1) % segments) as u16);
                    
                    // Triangle 2 (if needed)
                    if prev_i != next_prev_i {
                        indices.push((prev_offset + prev_i) as u16);
                        indices.push((vertex_offset + (i + 1) % segments) as u16);
                        indices.push((prev_offset + next_prev_i) as u16);
                    }
                }
            }
            
            vertex_offset += segments;
        }
        
        (vertices, indices)
    }
    
    pub fn update(&mut self, dt: f32, heartbeat_phase: f32, coherence: f32) {
        // Rotate based on coherence
        self.rotation += dt * coherence * 0.5;
        
        // Pulse with heartbeat
        self.pulse_scale = 1.0 + heartbeat_phase.sin() * 0.1 * coherence;
        
        // Adjust fractal depth based on coherence
        self.fractal_depth = (coherence * 7.0).round() as u32;
    }
    
    pub fn render<'a>(&'a self, render_pass: &mut RenderPass<'a>) {
        render_pass.set_pipeline(&self.pipeline);
        render_pass.set_bind_group(0, &self.uniform_bind_group, &[]);
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.set_index_buffer(self.index_buffer.slice(..), IndexFormat::Uint16);
        render_pass.draw_indexed(0..self.index_count, 0, 0..1);
    }
    
    pub fn resize(&mut self, device: &Device, config: &SurfaceConfiguration) {
        // Update any size-dependent resources
    }
    
    pub fn update_uniforms(&self, queue: &Queue, uniforms: MandalaUniforms) {
        queue.write_buffer(&self.uniform_buffer, 0, bytemuck::cast_slice(&[uniforms]));
    }
}