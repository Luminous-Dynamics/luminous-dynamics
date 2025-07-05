// Mandala UI - Sacred Geometry Interface for LuminousOS
// "The interface breathes with your consciousness"

pub mod mandala_renderer;
pub mod sacred_geometry;
pub mod coherence_visualizer;
pub mod glyph_ring;
pub mod webgpu_renderer;
pub mod consciousness_particles;
pub mod file_network_viz;
pub mod coherence_field_viz;
pub mod sacred_geometry_viz;
pub mod shaders;
pub mod animation;
pub mod interaction;

use wgpu::*;
use winit::{
    event::*,
    event_loop::{ControlFlow, EventLoop},
    window::{Window, WindowBuilder},
};
use std::sync::Arc;
use tokio::sync::RwLock;

/// Core Mandala UI state
pub struct MandalaUI {
    surface: Surface,
    device: Device,
    queue: Queue,
    config: SurfaceConfiguration,
    size: winit::dpi::PhysicalSize<u32>,
    window: Window,
    
    // Renderers
    mandala_renderer: mandala_renderer::MandalaRenderer,
    coherence_viz: coherence_visualizer::CoherenceVisualizer,
    glyph_ring: glyph_ring::GlyphRing,
    
    // State
    coherence_level: f32,
    heartbeat_phase: f32,
    selected_glyph: Option<usize>,
    field_state: Arc<RwLock<FieldState>>,
}

#[derive(Debug, Clone)]
pub struct FieldState {
    pub coherence: f32,
    pub participants: Vec<ParticipantField>,
    pub collective_frequency: f32,
    pub emergence_level: f32,
    pub sacred_geometry: SacredGeometryType,
}

#[derive(Debug, Clone)]
pub struct ParticipantField {
    pub id: String,
    pub coherence: f32,
    pub frequency: f32,
    pub phase: f32,
    pub color: [f32; 3],
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SacredGeometryType {
    Point,
    Vesica,
    TripleVesica,
    FlowerOfLife,
    MetatronsCube,
    InfiniteFlower,
}

impl MandalaUI {
    pub async fn new(window: Window) -> Result<Self, Box<dyn std::error::Error>> {
        let size = window.inner_size();
        
        // Create WGPU instance
        let instance = Instance::new(InstanceDescriptor {
            backends: Backends::all(),
            dx12_shader_compiler: Default::default(),
        });
        
        let surface = unsafe { instance.create_surface(&window)? };
        
        // Adapter and device
        let adapter = instance
            .request_adapter(&RequestAdapterOptions {
                power_preference: PowerPreference::HighPerformance,
                compatible_surface: Some(&surface),
                force_fallback_adapter: false,
            })
            .await
            .ok_or("Failed to find adapter")?;
            
        let (device, queue) = adapter
            .request_device(
                &DeviceDescriptor {
                    features: Features::empty(),
                    limits: Limits::default(),
                    label: Some("Mandala Device"),
                },
                None,
            )
            .await?;
            
        // Surface configuration
        let surface_caps = surface.get_capabilities(&adapter);
        let surface_format = surface_caps
            .formats
            .iter()
            .copied()
            .find(|f| f.is_srgb())
            .unwrap_or(surface_caps.formats[0]);
            
        let config = SurfaceConfiguration {
            usage: TextureUsages::RENDER_ATTACHMENT,
            format: surface_format,
            width: size.width,
            height: size.height,
            present_mode: surface_caps.present_modes[0],
            alpha_mode: surface_caps.alpha_modes[0],
            view_formats: vec![],
        };
        
        surface.configure(&device, &config);
        
        // Initialize renderers
        let mandala_renderer = mandala_renderer::MandalaRenderer::new(&device, &config)?;
        let coherence_viz = coherence_visualizer::CoherenceVisualizer::new(&device, &config)?;
        let glyph_ring = glyph_ring::GlyphRing::new(&device, &config)?;
        
        // Initial field state
        let field_state = Arc::new(RwLock::new(FieldState {
            coherence: 0.75,
            participants: vec![],
            collective_frequency: 7.83, // Schumann resonance
            emergence_level: 0.0,
            sacred_geometry: SacredGeometryType::Point,
        }));
        
        Ok(Self {
            surface,
            device,
            queue,
            config,
            size,
            window,
            mandala_renderer,
            coherence_viz,
            glyph_ring,
            coherence_level: 0.75,
            heartbeat_phase: 0.0,
            selected_glyph: None,
            field_state,
        })
    }
    
    pub fn resize(&mut self, new_size: winit::dpi::PhysicalSize<u32>) {
        if new_size.width > 0 && new_size.height > 0 {
            self.size = new_size;
            self.config.width = new_size.width;
            self.config.height = new_size.height;
            self.surface.configure(&self.device, &self.config);
            
            // Update renderers
            self.mandala_renderer.resize(&self.device, &self.config);
            self.coherence_viz.resize(&self.device, &self.config);
            self.glyph_ring.resize(&self.device, &self.config);
        }
    }
    
    pub fn update(&mut self, dt: f32) {
        // Update heartbeat phase (60 BPM)
        self.heartbeat_phase += dt * std::f32::consts::TAU / 1.0;
        if self.heartbeat_phase > std::f32::consts::TAU {
            self.heartbeat_phase -= std::f32::consts::TAU;
        }
        
        // Update animations
        self.mandala_renderer.update(dt, self.heartbeat_phase, self.coherence_level);
        self.coherence_viz.update(dt, self.coherence_level);
        self.glyph_ring.update(dt, self.selected_glyph);
    }
    
    pub fn render(&mut self) -> Result<(), SurfaceError> {
        let output = self.surface.get_current_texture()?;
        let view = output
            .texture
            .create_view(&TextureViewDescriptor::default());
            
        let mut encoder = self
            .device
            .create_command_encoder(&CommandEncoderDescriptor {
                label: Some("Mandala Encoder"),
            });
            
        {
            let mut render_pass = encoder.begin_render_pass(&RenderPassDescriptor {
                label: Some("Mandala Pass"),
                color_attachments: &[Some(RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: Operations {
                        load: LoadOp::Clear(Color {
                            r: 0.01,
                            g: 0.02,
                            b: 0.03,
                            a: 1.0,
                        }),
                        store: true,
                    },
                })],
                depth_stencil_attachment: None,
            });
            
            // Render layers in order
            self.coherence_viz.render(&mut render_pass);
            self.mandala_renderer.render(&mut render_pass);
            self.glyph_ring.render(&mut render_pass);
        }
        
        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();
        
        Ok(())
    }
    
    pub fn handle_input(&mut self, event: &WindowEvent) -> bool {
        match event {
            WindowEvent::CursorMoved { position, .. } => {
                // Check glyph selection
                let normalized = (
                    position.x as f32 / self.size.width as f32,
                    position.y as f32 / self.size.height as f32,
                );
                self.glyph_ring.check_hover(normalized);
                true
            }
            WindowEvent::MouseInput { state, button, .. } => {
                if *state == ElementState::Pressed && *button == MouseButton::Left {
                    if let Some(glyph) = self.glyph_ring.get_hovered() {
                        self.selected_glyph = Some(glyph);
                        true
                    } else {
                        false
                    }
                } else {
                    false
                }
            }
            _ => false,
        }
    }
    
    pub async fn update_field_state(&self, coherence: f32, participants: Vec<ParticipantField>) {
        let mut state = self.field_state.write().await;
        state.coherence = coherence;
        state.participants = participants.clone();
        
        // Update sacred geometry based on participant count
        state.sacred_geometry = match participants.len() {
            0..=1 => SacredGeometryType::Point,
            2 => SacredGeometryType::Vesica,
            3 => SacredGeometryType::TripleVesica,
            4..=12 => SacredGeometryType::FlowerOfLife,
            13 => SacredGeometryType::MetatronsCube,
            _ => SacredGeometryType::InfiniteFlower,
        };
        
        // Update emergence level
        if state.coherence > 0.9 && participants.len() > 3 {
            state.emergence_level = (state.coherence - 0.9) * 10.0;
        } else {
            state.emergence_level *= 0.95; // Decay
        }
    }
}

pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();
    
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title("LuminousOS - Mandala Interface")
        .with_inner_size(winit::dpi::LogicalSize::new(1024, 1024))
        .build(&event_loop)?;
        
    let mut mandala_ui = MandalaUI::new(window).await?;
    let mut last_update = instant::Instant::now();
    
    event_loop.run(move |event, _, control_flow| {
        match event {
            Event::WindowEvent {
                ref event,
                window_id,
            } if window_id == mandala_ui.window.id() => {
                if !mandala_ui.handle_input(event) {
                    match event {
                        WindowEvent::CloseRequested => *control_flow = ControlFlow::Exit,
                        WindowEvent::Resized(physical_size) => {
                            mandala_ui.resize(*physical_size);
                        }
                        WindowEvent::ScaleFactorChanged { new_inner_size, .. } => {
                            mandala_ui.resize(**new_inner_size);
                        }
                        _ => {}
                    }
                }
            }
            Event::RedrawRequested(window_id) if window_id == mandala_ui.window.id() => {
                let now = instant::Instant::now();
                let dt = (now - last_update).as_secs_f32();
                last_update = now;
                
                mandala_ui.update(dt);
                
                match mandala_ui.render() {
                    Ok(_) => {}
                    Err(SurfaceError::Lost) => mandala_ui.resize(mandala_ui.size),
                    Err(SurfaceError::OutOfMemory) => *control_flow = ControlFlow::Exit,
                    Err(e) => eprintln!("{:?}", e),
                }
            }
            Event::MainEventsCleared => {
                mandala_ui.window.request_redraw();
            }
            _ => {}
        }
    });
}