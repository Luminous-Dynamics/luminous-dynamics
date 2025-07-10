// Glyph Ring - Interactive Sacred Pattern Selection
// "87 doorways to transformation"

use wgpu::*;
use cgmath::*;
use bytemuck::{Pod, Zeroable};
use std::f32::consts::{PI, TAU};

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
struct GlyphVertex {
    position: [f32; 3],
    uv: [f32; 2],
    glyph_id: u32,
    _padding: [f32; 3],
}

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
struct GlyphUniforms {
    view_proj: [[f32; 4]; 4],
    time: f32,
    selected_glyph: i32,
    hover_glyph: i32,
    total_glyphs: u32,
    ring_rotation: f32,
    coherence: f32,
    _padding: [f32; 2],
}

pub struct GlyphRing {
    pipeline: RenderPipeline,
    vertex_buffer: Buffer,
    index_buffer: Buffer,
    uniform_buffer: Buffer,
    bind_group: BindGroup,
    glyph_texture: Texture,
    glyph_data: Vec<GlyphData>,
    
    // Interaction state
    hovered_glyph: Option<usize>,
    selected_glyph: Option<usize>,
    ring_rotation: f32,
    target_rotation: f32,
    
    // Animation
    glyph_animations: Vec<GlyphAnimation>,
}

#[derive(Clone)]
struct GlyphData {
    id: usize,
    name: String,
    symbol: String,
    category: GlyphCategory,
    harmony: Vec<Harmony>,
    angle: f32,
}

#[derive(Clone, Copy, PartialEq)]
enum GlyphCategory {
    Foundational,
    Applied,
    Threshold,
    Meta,
}

#[derive(Clone, Copy)]
enum Harmony {
    Transparency,
    Coherence,
    Resonance,
    Agency,
    Vitality,
    Mutuality,
    Novelty,
}

#[derive(Clone)]
struct GlyphAnimation {
    pulse: f32,
    glow: f32,
    rotation: f32,
}

impl GlyphRing {
    pub fn new(device: &Device, config: &SurfaceConfiguration) -> Result<Self, Box<dyn std::error::Error>> {
        // Initialize all 87 glyphs
        let glyph_data = Self::initialize_glyphs();
        let total_glyphs = glyph_data.len();
        
        // Create ring geometry
        let (vertices, indices) = Self::create_ring_geometry(&glyph_data);
        
        let vertex_buffer = device.create_buffer_init(&util::BufferInitDescriptor {
            label: Some("Glyph Vertex Buffer"),
            contents: bytemuck::cast_slice(&vertices),
            usage: BufferUsages::VERTEX,
        });
        
        let index_buffer = device.create_buffer_init(&util::BufferInitDescriptor {
            label: Some("Glyph Index Buffer"),
            contents: bytemuck::cast_slice(&indices),
            usage: BufferUsages::INDEX,
        });
        
        // Create glyph texture atlas
        let glyph_texture = Self::create_glyph_texture(device, &glyph_data)?;
        
        // Uniforms
        let uniform_buffer = device.create_buffer(&BufferDescriptor {
            label: Some("Glyph Uniform Buffer"),
            size: std::mem::size_of::<GlyphUniforms>() as u64,
            usage: BufferUsages::UNIFORM | BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        
        // Shader
        let shader = device.create_shader_module(ShaderModuleDescriptor {
            label: Some("Glyph Shader"),
            source: ShaderSource::Wgsl(include_str!("shaders/glyph_ring.wgsl").into()),
        });
        
        // Bind group
        let bind_group_layout = device.create_bind_group_layout(&BindGroupLayoutDescriptor {
            label: Some("Glyph Bind Group Layout"),
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
                BindGroupLayoutEntry {
                    binding: 1,
                    visibility: ShaderStages::FRAGMENT,
                    ty: BindingType::Texture {
                        sample_type: TextureSampleType::Float { filterable: true },
                        view_dimension: TextureViewDimension::D2,
                        multisampled: false,
                    },
                    count: None,
                },
                BindGroupLayoutEntry {
                    binding: 2,
                    visibility: ShaderStages::FRAGMENT,
                    ty: BindingType::Sampler(SamplerBindingType::Filtering),
                    count: None,
                },
            ],
        });
        
        let glyph_view = glyph_texture.create_view(&TextureViewDescriptor::default());
        let glyph_sampler = device.create_sampler(&SamplerDescriptor {
            address_mode_u: AddressMode::ClampToEdge,
            address_mode_v: AddressMode::ClampToEdge,
            address_mode_w: AddressMode::ClampToEdge,
            mag_filter: FilterMode::Linear,
            min_filter: FilterMode::Linear,
            mipmap_filter: FilterMode::Linear,
            ..Default::default()
        });
        
        let bind_group = device.create_bind_group(&BindGroupDescriptor {
            label: Some("Glyph Bind Group"),
            layout: &bind_group_layout,
            entries: &[
                BindGroupEntry {
                    binding: 0,
                    resource: uniform_buffer.as_entire_binding(),
                },
                BindGroupEntry {
                    binding: 1,
                    resource: BindingResource::TextureView(&glyph_view),
                },
                BindGroupEntry {
                    binding: 2,
                    resource: BindingResource::Sampler(&glyph_sampler),
                },
            ],
        });
        
        // Pipeline
        let pipeline_layout = device.create_pipeline_layout(&PipelineLayoutDescriptor {
            label: Some("Glyph Pipeline Layout"),
            bind_group_layouts: &[&bind_group_layout],
            push_constant_ranges: &[],
        });
        
        let pipeline = device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Glyph Pipeline"),
            layout: Some(&pipeline_layout),
            vertex: VertexState {
                module: &shader,
                entry_point: "vs_main",
                buffers: &[VertexBufferLayout {
                    array_stride: std::mem::size_of::<GlyphVertex>() as BufferAddress,
                    step_mode: VertexStepMode::Vertex,
                    attributes: &vertex_attr_array![0 => Float32x3, 1 => Float32x2, 2 => Uint32],
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
                cull_mode: Some(Face::Back),
                polygon_mode: PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: MultisampleState::default(),
            multiview: None,
        });
        
        // Initialize animations
        let glyph_animations = vec![GlyphAnimation {
            pulse: 0.0,
            glow: 0.0,
            rotation: 0.0,
        }; total_glyphs];
        
        Ok(Self {
            pipeline,
            vertex_buffer,
            index_buffer,
            uniform_buffer,
            bind_group,
            glyph_texture,
            glyph_data,
            hovered_glyph: None,
            selected_glyph: None,
            ring_rotation: 0.0,
            target_rotation: 0.0,
            glyph_animations,
        })
    }
    
    fn initialize_glyphs() -> Vec<GlyphData> {
        let mut glyphs = Vec::new();
        
        // Add foundational glyphs (Ω0-Ω44)
        for i in 0..45 {
            glyphs.push(GlyphData {
                id: i,
                name: format!("Omega-{}", i),
                symbol: format!("Ω{}", i),
                category: GlyphCategory::Foundational,
                harmony: vec![Harmony::Coherence],
                angle: 0.0, // Will be calculated
            });
        }
        
        // Add applied harmonies (Ω45-Ω56)
        for i in 45..57 {
            glyphs.push(GlyphData {
                id: i,
                name: format!("Applied Harmony {}", i - 44),
                symbol: format!("Ω{}", i),
                category: GlyphCategory::Applied,
                harmony: vec![Harmony::Resonance, Harmony::Mutuality],
                angle: 0.0,
            });
        }
        
        // Add threshold glyphs
        let threshold_names = vec![
            "The Door That Remembers You",
            "The Keeper Beneath the Ash",
            "The Unburdening",
            "The Mantling",
            "The Edgewalker",
            "The Choice Point",
            "Letting In",
            "The Returner",
            "The Shimmering Unnamed",
        ];
        
        for (i, name) in threshold_names.iter().enumerate() {
            glyphs.push(GlyphData {
                id: 57 + i,
                name: name.to_string(),
                symbol: format!("⟠{}", i),
                category: GlyphCategory::Threshold,
                harmony: vec![Harmony::Transparency, Harmony::Agency],
                angle: 0.0,
            });
        }
        
        // Add meta-glyphs (∑1-∑21 for demo)
        for i in 1..22 {
            glyphs.push(GlyphData {
                id: 65 + i,
                name: format!("Meta-Glyph {}", i),
                symbol: format!("∑{}", i),
                category: GlyphCategory::Meta,
                harmony: vec![Harmony::Novelty, Harmony::Vitality],
                angle: 0.0,
            });
        }
        
        // Calculate angles
        let angle_step = TAU / glyphs.len() as f32;
        for (i, glyph) in glyphs.iter_mut().enumerate() {
            glyph.angle = i as f32 * angle_step;
        }
        
        glyphs
    }
    
    fn create_ring_geometry(glyphs: &[GlyphData]) -> (Vec<GlyphVertex>, Vec<u16>) {
        let mut vertices = Vec::new();
        let mut indices = Vec::new();
        
        let ring_radius = 0.8;
        let glyph_size = 0.08;
        
        for (i, glyph) in glyphs.iter().enumerate() {
            let x = glyph.angle.cos() * ring_radius;
            let y = glyph.angle.sin() * ring_radius;
            
            let base_idx = vertices.len() as u16;
            
            // Create quad for glyph
            vertices.push(GlyphVertex {
                position: [x - glyph_size, y - glyph_size, 0.0],
                uv: [0.0, 0.0],
                glyph_id: i as u32,
                _padding: [0.0; 3],
            });
            vertices.push(GlyphVertex {
                position: [x + glyph_size, y - glyph_size, 0.0],
                uv: [1.0, 0.0],
                glyph_id: i as u32,
                _padding: [0.0; 3],
            });
            vertices.push(GlyphVertex {
                position: [x + glyph_size, y + glyph_size, 0.0],
                uv: [1.0, 1.0],
                glyph_id: i as u32,
                _padding: [0.0; 3],
            });
            vertices.push(GlyphVertex {
                position: [x - glyph_size, y + glyph_size, 0.0],
                uv: [0.0, 1.0],
                glyph_id: i as u32,
                _padding: [0.0; 3],
            });
            
            // Create two triangles
            indices.extend_from_slice(&[
                base_idx, base_idx + 1, base_idx + 2,
                base_idx, base_idx + 2, base_idx + 3,
            ]);
        }
        
        (vertices, indices)
    }
    
    fn create_glyph_texture(device: &Device, glyphs: &[GlyphData]) -> Result<Texture, Box<dyn std::error::Error>> {
        // Create texture atlas for glyph symbols
        let size = 2048;
        let glyph_size = 128;
        let glyphs_per_row = size / glyph_size;
        
        let texture = device.create_texture(&TextureDescriptor {
            label: Some("Glyph Atlas"),
            size: Extent3d {
                width: size,
                height: size,
                depth_or_array_layers: 1,
            },
            mip_level_count: 1,
            sample_count: 1,
            dimension: TextureDimension::D2,
            format: TextureFormat::Rgba8UnormSrgb,
            usage: TextureUsages::TEXTURE_BINDING | TextureUsages::COPY_DST,
            view_formats: &[],
        });
        
        // In production, would render actual glyph symbols here
        // For now, create placeholder data
        let data = vec![255u8; (size * size * 4) as usize];
        
        device.queue.write_texture(
            ImageCopyTexture {
                texture: &texture,
                mip_level: 0,
                origin: Origin3d::ZERO,
                aspect: TextureAspect::All,
            },
            &data,
            ImageDataLayout {
                offset: 0,
                bytes_per_row: Some(4 * size),
                rows_per_image: Some(size),
            },
            Extent3d {
                width: size,
                height: size,
                depth_or_array_layers: 1,
            },
        );
        
        Ok(texture)
    }
    
    pub fn update(&mut self, dt: f32, selected: Option<usize>) {
        // Update ring rotation
        let rotation_speed = 0.1;
        self.ring_rotation += (self.target_rotation - self.ring_rotation) * rotation_speed;
        
        // Update selected glyph
        if selected != self.selected_glyph {
            self.selected_glyph = selected;
            if let Some(idx) = selected {
                // Rotate ring to bring selected glyph to top
                self.target_rotation = -self.glyph_data[idx].angle + PI / 2.0;
            }
        }
        
        // Update animations
        for (i, anim) in self.glyph_animations.iter_mut().enumerate() {
            // Pulse selected glyph
            if Some(i) == self.selected_glyph {
                anim.pulse = (anim.pulse + dt * 3.0).sin() * 0.5 + 0.5;
                anim.glow = 1.0;
            } else if Some(i) == self.hovered_glyph {
                anim.pulse = (anim.pulse + dt * 5.0).sin() * 0.3 + 0.7;
                anim.glow = 0.5;
            } else {
                anim.pulse *= 0.95;
                anim.glow *= 0.9;
            }
            
            // Gentle rotation
            anim.rotation += dt * 0.2;
        }
    }
    
    pub fn render<'a>(&'a self, render_pass: &mut RenderPass<'a>) {
        render_pass.set_pipeline(&self.pipeline);
        render_pass.set_bind_group(0, &self.bind_group, &[]);
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.set_index_buffer(self.index_buffer.slice(..), IndexFormat::Uint16);
        
        let indices_per_glyph = 6;
        let total_indices = self.glyph_data.len() as u32 * indices_per_glyph;
        render_pass.draw_indexed(0..total_indices, 0, 0..1);
    }
    
    pub fn resize(&mut self, device: &Device, config: &SurfaceConfiguration) {
        // Update size-dependent resources
    }
    
    pub fn check_hover(&mut self, normalized_pos: (f32, f32)) -> Option<usize> {
        // Convert to clip space
        let x = normalized_pos.0 * 2.0 - 1.0;
        let y = -(normalized_pos.1 * 2.0 - 1.0);
        
        // Check distance to each glyph
        let ring_radius = 0.8;
        let hover_radius = 0.1;
        
        for (i, glyph) in self.glyph_data.iter().enumerate() {
            let glyph_angle = glyph.angle + self.ring_rotation;
            let glyph_x = glyph_angle.cos() * ring_radius;
            let glyph_y = glyph_angle.sin() * ring_radius;
            
            let dist = ((x - glyph_x).powi(2) + (y - glyph_y).powi(2)).sqrt();
            if dist < hover_radius {
                self.hovered_glyph = Some(i);
                return Some(i);
            }
        }
        
        self.hovered_glyph = None;
        None
    }
    
    pub fn get_hovered(&self) -> Option<usize> {
        self.hovered_glyph
    }
    
    pub fn update_uniforms(&self, queue: &Queue, time: f32, coherence: f32) {
        let uniforms = GlyphUniforms {
            view_proj: Matrix4::identity().into(),
            time,
            selected_glyph: self.selected_glyph.map(|i| i as i32).unwrap_or(-1),
            hover_glyph: self.hovered_glyph.map(|i| i as i32).unwrap_or(-1),
            total_glyphs: self.glyph_data.len() as u32,
            ring_rotation: self.ring_rotation,
            coherence,
            _padding: [0.0; 2],
        };
        
        queue.write_buffer(&self.uniform_buffer, 0, bytemuck::cast_slice(&[uniforms]));
    }
}