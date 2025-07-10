// WebGPU Renderer for Mandala UI Visualization
// High-performance GPU-accelerated rendering for consciousness visualization

use wgpu::*;
use cgmath::*;
use bytemuck::{Pod, Zeroable};
use std::sync::Arc;
use std::collections::HashMap;
use winit::window::Window;

// Vertex types for different render passes
#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
pub struct ParticleInstance {
    position: [f32; 3],
    velocity: [f32; 3],
    size: f32,
    coherence: f32,
    hue: f32,
    phase: f32,
    lifetime: f32,
    _padding: f32,
}

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
pub struct FieldVertex {
    position: [f32; 3],
    normal: [f32; 3],
    tex_coords: [f32; 2],
    field_value: f32,
    _padding: [f32; 3],
}

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
pub struct LineVertex {
    position: [f32; 3],
    color: [f32; 4],
    thickness: f32,
}

#[repr(C)]
#[derive(Copy, Clone, Debug, Pod, Zeroable)]
pub struct GlobalUniforms {
    view_proj: [[f32; 4]; 4],
    camera_pos: [f32; 3],
    time: f32,
    delta_time: f32,
    coherence_level: f32,
    field_strength: f32,
    particle_count: u32,
    screen_size: [f32; 2],
    _padding: [f32; 2],
}

pub struct RenderPass {
    pipeline: RenderPipeline,
    bind_group: BindGroup,
    vertex_buffer: Option<Buffer>,
    index_buffer: Option<Buffer>,
    instance_buffer: Option<Buffer>,
    vertex_count: u32,
    index_count: u32,
    instance_count: u32,
}

pub struct WebGPURenderer {
    device: Arc<Device>,
    queue: Arc<Queue>,
    surface: Surface,
    config: SurfaceConfiguration,
    
    // Global resources
    global_uniform_buffer: Buffer,
    global_bind_group_layout: BindGroupLayout,
    global_bind_group: BindGroup,
    
    // Render passes
    particle_pass: Option<RenderPass>,
    field_pass: Option<RenderPass>,
    network_pass: Option<RenderPass>,
    geometry_pass: Option<RenderPass>,
    
    // Performance optimization
    depth_texture: Texture,
    depth_view: TextureView,
    multisampled_texture: Option<Texture>,
    multisampled_view: Option<TextureView>,
    
    // LOD system
    lod_levels: Vec<LODLevel>,
    frustum: Frustum,
    
    // Temporal coherence
    previous_frame_data: Option<Buffer>,
    temporal_buffer: Option<Buffer>,
}

#[derive(Clone)]
struct LODLevel {
    distance: f32,
    vertex_count: u32,
    index_count: u32,
    vertex_buffer: Option<Buffer>,
    index_buffer: Option<Buffer>,
}

struct Frustum {
    planes: [Vector4<f32>; 6],
}

impl WebGPURenderer {
    pub async fn new(window: &Window) -> Result<Self, Box<dyn std::error::Error>> {
        // Initialize WebGPU
        let instance = Instance::new(InstanceDescriptor {
            backends: Backends::all(),
            dx12_shader_compiler: Default::default(),
        });
        
        let surface = unsafe { instance.create_surface(window) }?;
        
        let adapter = instance
            .request_adapter(&RequestAdapterOptions {
                power_preference: PowerPreference::HighPerformance,
                compatible_surface: Some(&surface),
                force_fallback_adapter: false,
            })
            .await
            .ok_or("Failed to find suitable adapter")?;
        
        let (device, queue) = adapter
            .request_device(
                &DeviceDescriptor {
                    label: Some("WebGPU Device"),
                    features: Features::empty(),
                    limits: Limits::default(),
                },
                None,
            )
            .await?;
        
        let device = Arc::new(device);
        let queue = Arc::new(queue);
        
        // Configure surface
        let size = window.inner_size();
        let config = SurfaceConfiguration {
            usage: TextureUsages::RENDER_ATTACHMENT,
            format: surface.get_capabilities(&adapter).formats[0],
            width: size.width,
            height: size.height,
            present_mode: PresentMode::AutoVsync,
            alpha_mode: CompositeAlphaMode::Auto,
            view_formats: vec![],
        };
        surface.configure(&device, &config);
        
        // Create depth texture
        let depth_texture = device.create_texture(&TextureDescriptor {
            label: Some("Depth Texture"),
            size: Extent3d {
                width: config.width,
                height: config.height,
                depth_or_array_layers: 1,
            },
            mip_level_count: 1,
            sample_count: 1,
            dimension: TextureDimension::D2,
            format: TextureFormat::Depth32Float,
            usage: TextureUsages::RENDER_ATTACHMENT | TextureUsages::TEXTURE_BINDING,
            view_formats: &[],
        });
        
        let depth_view = depth_texture.create_view(&TextureViewDescriptor::default());
        
        // Create global uniform buffer
        let global_uniform_buffer = device.create_buffer(&BufferDescriptor {
            label: Some("Global Uniform Buffer"),
            size: std::mem::size_of::<GlobalUniforms>() as u64,
            usage: BufferUsages::UNIFORM | BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        
        // Create global bind group layout
        let global_bind_group_layout = device.create_bind_group_layout(&BindGroupLayoutDescriptor {
            label: Some("Global Bind Group Layout"),
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
        
        let global_bind_group = device.create_bind_group(&BindGroupDescriptor {
            label: Some("Global Bind Group"),
            layout: &global_bind_group_layout,
            entries: &[
                BindGroupEntry {
                    binding: 0,
                    resource: global_uniform_buffer.as_entire_binding(),
                },
            ],
        });
        
        // Initialize LOD levels
        let lod_levels = vec![
            LODLevel {
                distance: 0.0,
                vertex_count: 0,
                index_count: 0,
                vertex_buffer: None,
                index_buffer: None,
            },
            LODLevel {
                distance: 50.0,
                vertex_count: 0,
                index_count: 0,
                vertex_buffer: None,
                index_buffer: None,
            },
            LODLevel {
                distance: 100.0,
                vertex_count: 0,
                index_count: 0,
                vertex_buffer: None,
                index_buffer: None,
            },
        ];
        
        let frustum = Frustum {
            planes: [Vector4::zero(); 6],
        };
        
        let mut renderer = Self {
            device,
            queue,
            surface,
            config,
            global_uniform_buffer,
            global_bind_group_layout,
            global_bind_group,
            particle_pass: None,
            field_pass: None,
            network_pass: None,
            geometry_pass: None,
            depth_texture,
            depth_view,
            multisampled_texture: None,
            multisampled_view: None,
            lod_levels,
            frustum,
            previous_frame_data: None,
            temporal_buffer: None,
        };
        
        // Initialize render passes
        renderer.init_particle_pass()?;
        renderer.init_field_pass()?;
        renderer.init_network_pass()?;
        renderer.init_geometry_pass()?;
        
        Ok(renderer)
    }
    
    fn init_particle_pass(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        // Load particle shader
        let shader = self.device.create_shader_module(ShaderModuleDescriptor {
            label: Some("Particle Shader"),
            source: ShaderSource::Wgsl(include_str!("shaders/particles.wgsl").into()),
        });
        
        // Create particle pipeline layout
        let pipeline_layout = self.device.create_pipeline_layout(&PipelineLayoutDescriptor {
            label: Some("Particle Pipeline Layout"),
            bind_group_layouts: &[&self.global_bind_group_layout],
            push_constant_ranges: &[],
        });
        
        // Create particle pipeline
        let pipeline = self.device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Particle Pipeline"),
            layout: Some(&pipeline_layout),
            vertex: VertexState {
                module: &shader,
                entry_point: "vs_particle",
                buffers: &[
                    VertexBufferLayout {
                        array_stride: std::mem::size_of::<ParticleInstance>() as BufferAddress,
                        step_mode: VertexStepMode::Instance,
                        attributes: &vertex_attr_array![
                            0 => Float32x3,  // position
                            1 => Float32x3,  // velocity
                            2 => Float32,    // size
                            3 => Float32,    // coherence
                            4 => Float32,    // hue
                            5 => Float32,    // phase
                            6 => Float32,    // lifetime
                        ],
                    },
                ],
            },
            fragment: Some(FragmentState {
                module: &shader,
                entry_point: "fs_particle",
                targets: &[Some(ColorTargetState {
                    format: self.config.format,
                    blend: Some(BlendState {
                        color: BlendComponent {
                            src_factor: BlendFactor::SrcAlpha,
                            dst_factor: BlendFactor::One,
                            operation: BlendOperation::Add,
                        },
                        alpha: BlendComponent {
                            src_factor: BlendFactor::One,
                            dst_factor: BlendFactor::One,
                            operation: BlendOperation::Add,
                        },
                    }),
                    write_mask: ColorWrites::ALL,
                })],
            }),
            primitive: PrimitiveState {
                topology: PrimitiveTopology::TriangleStrip,
                strip_index_format: None,
                front_face: FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: Some(DepthStencilState {
                format: TextureFormat::Depth32Float,
                depth_write_enabled: false,
                depth_compare: CompareFunction::Less,
                stencil: StencilState::default(),
                bias: DepthBiasState::default(),
            }),
            multisample: MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            multiview: None,
        });
        
        // Create instance buffer for particles
        let max_particles = 10000;
        let instance_buffer = self.device.create_buffer(&BufferDescriptor {
            label: Some("Particle Instance Buffer"),
            size: (std::mem::size_of::<ParticleInstance>() * max_particles) as u64,
            usage: BufferUsages::VERTEX | BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        
        self.particle_pass = Some(RenderPass {
            pipeline,
            bind_group: self.global_bind_group.clone(),
            vertex_buffer: None,
            index_buffer: None,
            instance_buffer: Some(instance_buffer),
            vertex_count: 4, // Quad
            index_count: 0,
            instance_count: 0,
        });
        
        Ok(())
    }
    
    fn init_field_pass(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        // Load field shader
        let shader = self.device.create_shader_module(ShaderModuleDescriptor {
            label: Some("Field Shader"),
            source: ShaderSource::Wgsl(include_str!("shaders/field.wgsl").into()),
        });
        
        // Create field mesh
        let (vertices, indices) = Self::create_field_mesh(64, 64);
        
        let vertex_buffer = self.device.create_buffer_init(&util::BufferInitDescriptor {
            label: Some("Field Vertex Buffer"),
            contents: bytemuck::cast_slice(&vertices),
            usage: BufferUsages::VERTEX,
        });
        
        let index_buffer = self.device.create_buffer_init(&util::BufferInitDescriptor {
            label: Some("Field Index Buffer"),
            contents: bytemuck::cast_slice(&indices),
            usage: BufferUsages::INDEX,
        });
        
        // Create pipeline layout
        let pipeline_layout = self.device.create_pipeline_layout(&PipelineLayoutDescriptor {
            label: Some("Field Pipeline Layout"),
            bind_group_layouts: &[&self.global_bind_group_layout],
            push_constant_ranges: &[],
        });
        
        // Create pipeline
        let pipeline = self.device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Field Pipeline"),
            layout: Some(&pipeline_layout),
            vertex: VertexState {
                module: &shader,
                entry_point: "vs_field",
                buffers: &[
                    VertexBufferLayout {
                        array_stride: std::mem::size_of::<FieldVertex>() as BufferAddress,
                        step_mode: VertexStepMode::Vertex,
                        attributes: &vertex_attr_array![
                            0 => Float32x3,  // position
                            1 => Float32x3,  // normal
                            2 => Float32x2,  // tex_coords
                            3 => Float32,    // field_value
                        ],
                    },
                ],
            },
            fragment: Some(FragmentState {
                module: &shader,
                entry_point: "fs_field",
                targets: &[Some(ColorTargetState {
                    format: self.config.format,
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
            depth_stencil: Some(DepthStencilState {
                format: TextureFormat::Depth32Float,
                depth_write_enabled: true,
                depth_compare: CompareFunction::Less,
                stencil: StencilState::default(),
                bias: DepthBiasState::default(),
            }),
            multisample: MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            multiview: None,
        });
        
        self.field_pass = Some(RenderPass {
            pipeline,
            bind_group: self.global_bind_group.clone(),
            vertex_buffer: Some(vertex_buffer),
            index_buffer: Some(index_buffer),
            instance_buffer: None,
            vertex_count: vertices.len() as u32,
            index_count: indices.len() as u32,
            instance_count: 0,
        });
        
        Ok(())
    }
    
    fn init_network_pass(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        // Load network shader
        let shader = self.device.create_shader_module(ShaderModuleDescriptor {
            label: Some("Network Shader"),
            source: ShaderSource::Wgsl(include_str!("shaders/network.wgsl").into()),
        });
        
        // Create pipeline layout
        let pipeline_layout = self.device.create_pipeline_layout(&PipelineLayoutDescriptor {
            label: Some("Network Pipeline Layout"),
            bind_group_layouts: &[&self.global_bind_group_layout],
            push_constant_ranges: &[],
        });
        
        // Create pipeline
        let pipeline = self.device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Network Pipeline"),
            layout: Some(&pipeline_layout),
            vertex: VertexState {
                module: &shader,
                entry_point: "vs_network",
                buffers: &[
                    VertexBufferLayout {
                        array_stride: std::mem::size_of::<LineVertex>() as BufferAddress,
                        step_mode: VertexStepMode::Vertex,
                        attributes: &vertex_attr_array![
                            0 => Float32x3,  // position
                            1 => Float32x4,  // color
                            2 => Float32,    // thickness
                        ],
                    },
                ],
            },
            fragment: Some(FragmentState {
                module: &shader,
                entry_point: "fs_network",
                targets: &[Some(ColorTargetState {
                    format: self.config.format,
                    blend: Some(BlendState::ALPHA_BLENDING),
                    write_mask: ColorWrites::ALL,
                })],
            }),
            primitive: PrimitiveState {
                topology: PrimitiveTopology::LineList,
                strip_index_format: None,
                front_face: FrontFace::Ccw,
                cull_mode: None,
                polygon_mode: PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: Some(DepthStencilState {
                format: TextureFormat::Depth32Float,
                depth_write_enabled: true,
                depth_compare: CompareFunction::Less,
                stencil: StencilState::default(),
                bias: DepthBiasState::default(),
            }),
            multisample: MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            multiview: None,
        });
        
        // Pre-allocate line buffer
        let max_lines = 1000;
        let vertex_buffer = self.device.create_buffer(&BufferDescriptor {
            label: Some("Network Vertex Buffer"),
            size: (std::mem::size_of::<LineVertex>() * max_lines * 2) as u64,
            usage: BufferUsages::VERTEX | BufferUsages::COPY_DST,
            mapped_at_creation: false,
        });
        
        self.network_pass = Some(RenderPass {
            pipeline,
            bind_group: self.global_bind_group.clone(),
            vertex_buffer: Some(vertex_buffer),
            index_buffer: None,
            instance_buffer: None,
            vertex_count: 0,
            index_count: 0,
            instance_count: 0,
        });
        
        Ok(())
    }
    
    fn init_geometry_pass(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        // Load sacred geometry shader
        let shader = self.device.create_shader_module(ShaderModuleDescriptor {
            label: Some("Sacred Geometry Shader"),
            source: ShaderSource::Wgsl(include_str!("shaders/sacred_geometry.wgsl").into()),
        });
        
        // Create pipeline layout
        let pipeline_layout = self.device.create_pipeline_layout(&PipelineLayoutDescriptor {
            label: Some("Geometry Pipeline Layout"),
            bind_group_layouts: &[&self.global_bind_group_layout],
            push_constant_ranges: &[],
        });
        
        // Create pipeline
        let pipeline = self.device.create_render_pipeline(&RenderPipelineDescriptor {
            label: Some("Geometry Pipeline"),
            layout: Some(&pipeline_layout),
            vertex: VertexState {
                module: &shader,
                entry_point: "vs_geometry",
                buffers: &[],
            },
            fragment: Some(FragmentState {
                module: &shader,
                entry_point: "fs_geometry",
                targets: &[Some(ColorTargetState {
                    format: self.config.format,
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
            depth_stencil: Some(DepthStencilState {
                format: TextureFormat::Depth32Float,
                depth_write_enabled: false,
                depth_compare: CompareFunction::Less,
                stencil: StencilState::default(),
                bias: DepthBiasState::default(),
            }),
            multisample: MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            multiview: None,
        });
        
        self.geometry_pass = Some(RenderPass {
            pipeline,
            bind_group: self.global_bind_group.clone(),
            vertex_buffer: None,
            index_buffer: None,
            instance_buffer: None,
            vertex_count: 0,
            index_count: 0,
            instance_count: 0,
        });
        
        Ok(())
    }
    
    fn create_field_mesh(width: usize, height: usize) -> (Vec<FieldVertex>, Vec<u32>) {
        let mut vertices = Vec::new();
        let mut indices = Vec::new();
        
        // Generate vertices
        for y in 0..height {
            for x in 0..width {
                let px = (x as f32 / (width - 1) as f32) * 2.0 - 1.0;
                let py = (y as f32 / (height - 1) as f32) * 2.0 - 1.0;
                
                vertices.push(FieldVertex {
                    position: [px, 0.0, py],
                    normal: [0.0, 1.0, 0.0],
                    tex_coords: [x as f32 / (width - 1) as f32, y as f32 / (height - 1) as f32],
                    field_value: 0.0,
                    _padding: [0.0; 3],
                });
            }
        }
        
        // Generate indices
        for y in 0..height - 1 {
            for x in 0..width - 1 {
                let top_left = (y * width + x) as u32;
                let top_right = top_left + 1;
                let bottom_left = top_left + width as u32;
                let bottom_right = bottom_left + 1;
                
                // First triangle
                indices.push(top_left);
                indices.push(bottom_left);
                indices.push(top_right);
                
                // Second triangle
                indices.push(top_right);
                indices.push(bottom_left);
                indices.push(bottom_right);
            }
        }
        
        (vertices, indices)
    }
    
    pub fn update(&mut self, dt: f32, time: f32, coherence: f32) {
        // Update global uniforms
        let uniforms = GlobalUniforms {
            view_proj: self.calculate_view_proj().into(),
            camera_pos: [0.0, 5.0, 10.0],
            time,
            delta_time: dt,
            coherence_level: coherence,
            field_strength: coherence * 2.0,
            particle_count: 500,
            screen_size: [self.config.width as f32, self.config.height as f32],
            _padding: [0.0; 2],
        };
        
        self.queue.write_buffer(&self.global_uniform_buffer, 0, bytemuck::cast_slice(&[uniforms]));
        
        // Update frustum for culling
        self.update_frustum(&uniforms.view_proj);
    }
    
    fn calculate_view_proj(&self) -> Matrix4<f32> {
        let aspect = self.config.width as f32 / self.config.height as f32;
        let proj = perspective(Deg(45.0), aspect, 0.1, 1000.0);
        let view = Matrix4::look_at_rh(
            Point3::new(0.0, 5.0, 10.0),
            Point3::new(0.0, 0.0, 0.0),
            Vector3::unit_y(),
        );
        proj * view
    }
    
    fn update_frustum(&mut self, view_proj: &[[f32; 4]; 4]) {
        // Extract frustum planes from view projection matrix
        let vp = Matrix4::from(view_proj.clone());
        
        // Left plane
        self.frustum.planes[0] = Vector4::new(
            vp[0][3] + vp[0][0],
            vp[1][3] + vp[1][0],
            vp[2][3] + vp[2][0],
            vp[3][3] + vp[3][0],
        );
        
        // Right plane
        self.frustum.planes[1] = Vector4::new(
            vp[0][3] - vp[0][0],
            vp[1][3] - vp[1][0],
            vp[2][3] - vp[2][0],
            vp[3][3] - vp[3][0],
        );
        
        // Additional planes...
        // (Implementation continues for all 6 frustum planes)
    }
    
    pub fn render(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        let output = self.surface.get_current_texture()?;
        let view = output.texture.create_view(&TextureViewDescriptor::default());
        
        let mut encoder = self.device.create_command_encoder(&CommandEncoderDescriptor {
            label: Some("Render Encoder"),
        });
        
        {
            // Clear pass
            let mut clear_pass = encoder.begin_render_pass(&RenderPassDescriptor {
                label: Some("Clear Pass"),
                color_attachments: &[Some(RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: Operations {
                        load: LoadOp::Clear(Color {
                            r: 0.04,
                            g: 0.04,
                            b: 0.06,
                            a: 1.0,
                        }),
                        store: true,
                    },
                })],
                depth_stencil_attachment: Some(RenderPassDepthStencilAttachment {
                    view: &self.depth_view,
                    depth_ops: Some(Operations {
                        load: LoadOp::Clear(1.0),
                        store: true,
                    }),
                    stencil_ops: None,
                }),
            });
        }
        
        // Field mesh pass
        if let Some(field_pass) = &self.field_pass {
            let mut render_pass = encoder.begin_render_pass(&RenderPassDescriptor {
                label: Some("Field Pass"),
                color_attachments: &[Some(RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: Operations {
                        load: LoadOp::Load,
                        store: true,
                    },
                })],
                depth_stencil_attachment: Some(RenderPassDepthStencilAttachment {
                    view: &self.depth_view,
                    depth_ops: Some(Operations {
                        load: LoadOp::Load,
                        store: true,
                    }),
                    stencil_ops: None,
                }),
            });
            
            render_pass.set_pipeline(&field_pass.pipeline);
            render_pass.set_bind_group(0, &field_pass.bind_group, &[]);
            if let Some(vb) = &field_pass.vertex_buffer {
                render_pass.set_vertex_buffer(0, vb.slice(..));
            }
            if let Some(ib) = &field_pass.index_buffer {
                render_pass.set_index_buffer(ib.slice(..), IndexFormat::Uint32);
                render_pass.draw_indexed(0..field_pass.index_count, 0, 0..1);
            }
        }
        
        // Network lines pass
        if let Some(network_pass) = &self.network_pass {
            let mut render_pass = encoder.begin_render_pass(&RenderPassDescriptor {
                label: Some("Network Pass"),
                color_attachments: &[Some(RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: Operations {
                        load: LoadOp::Load,
                        store: true,
                    },
                })],
                depth_stencil_attachment: Some(RenderPassDepthStencilAttachment {
                    view: &self.depth_view,
                    depth_ops: Some(Operations {
                        load: LoadOp::Load,
                        store: true,
                    }),
                    stencil_ops: None,
                }),
            });
            
            render_pass.set_pipeline(&network_pass.pipeline);
            render_pass.set_bind_group(0, &network_pass.bind_group, &[]);
            if let Some(vb) = &network_pass.vertex_buffer {
                render_pass.set_vertex_buffer(0, vb.slice(..));
                if network_pass.vertex_count > 0 {
                    render_pass.draw(0..network_pass.vertex_count, 0..1);
                }
            }
        }
        
        // Particle pass with additive blending
        if let Some(particle_pass) = &self.particle_pass {
            let mut render_pass = encoder.begin_render_pass(&RenderPassDescriptor {
                label: Some("Particle Pass"),
                color_attachments: &[Some(RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: Operations {
                        load: LoadOp::Load,
                        store: true,
                    },
                })],
                depth_stencil_attachment: Some(RenderPassDepthStencilAttachment {
                    view: &self.depth_view,
                    depth_ops: Some(Operations {
                        load: LoadOp::Load,
                        store: true,
                    }),
                    stencil_ops: None,
                }),
            });
            
            render_pass.set_pipeline(&particle_pass.pipeline);
            render_pass.set_bind_group(0, &particle_pass.bind_group, &[]);
            if let Some(ib) = &particle_pass.instance_buffer {
                render_pass.set_vertex_buffer(0, ib.slice(..));
                if particle_pass.instance_count > 0 {
                    render_pass.draw(0..4, 0..particle_pass.instance_count);
                }
            }
        }
        
        // Sacred geometry pass
        if let Some(geometry_pass) = &self.geometry_pass {
            let mut render_pass = encoder.begin_render_pass(&RenderPassDescriptor {
                label: Some("Sacred Geometry Pass"),
                color_attachments: &[Some(RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: Operations {
                        load: LoadOp::Load,
                        store: true,
                    },
                })],
                depth_stencil_attachment: Some(RenderPassDepthStencilAttachment {
                    view: &self.depth_view,
                    depth_ops: Some(Operations {
                        load: LoadOp::Load,
                        store: true,
                    }),
                    stencil_ops: None,
                }),
            });
            
            render_pass.set_pipeline(&geometry_pass.pipeline);
            render_pass.set_bind_group(0, &geometry_pass.bind_group, &[]);
            // Sacred geometry is generated in shader
            render_pass.draw(0..3 * 64, 0..1); // Multiple triangles for complex patterns
        }
        
        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();
        
        Ok(())
    }
    
    pub fn resize(&mut self, new_size: winit::dpi::PhysicalSize<u32>) {
        if new_size.width > 0 && new_size.height > 0 {
            self.config.width = new_size.width;
            self.config.height = new_size.height;
            self.surface.configure(&self.device, &self.config);
            
            // Recreate depth texture
            self.depth_texture = self.device.create_texture(&TextureDescriptor {
                label: Some("Depth Texture"),
                size: Extent3d {
                    width: self.config.width,
                    height: self.config.height,
                    depth_or_array_layers: 1,
                },
                mip_level_count: 1,
                sample_count: 1,
                dimension: TextureDimension::D2,
                format: TextureFormat::Depth32Float,
                usage: TextureUsages::RENDER_ATTACHMENT | TextureUsages::TEXTURE_BINDING,
                view_formats: &[],
            });
            
            self.depth_view = self.depth_texture.create_view(&TextureViewDescriptor::default());
        }
    }
    
    pub fn update_particles(&mut self, particles: &[ParticleInstance]) {
        if let Some(pass) = &mut self.particle_pass {
            if let Some(buffer) = &pass.instance_buffer {
                self.queue.write_buffer(buffer, 0, bytemuck::cast_slice(particles));
                pass.instance_count = particles.len() as u32;
            }
        }
    }
    
    pub fn update_network(&mut self, lines: &[LineVertex]) {
        if let Some(pass) = &mut self.network_pass {
            if let Some(buffer) = &pass.vertex_buffer {
                self.queue.write_buffer(buffer, 0, bytemuck::cast_slice(lines));
                pass.vertex_count = lines.len() as u32;
            }
        }
    }
    
    pub fn select_lod(&self, distance: f32) -> usize {
        for (i, lod) in self.lod_levels.iter().enumerate().rev() {
            if distance >= lod.distance {
                return i;
            }
        }
        0
    }
}