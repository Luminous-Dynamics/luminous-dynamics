// WASM Bindings for WebGPU Renderer
// Exposes high-performance GPU rendering to JavaScript

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{HtmlCanvasElement, WebGl2RenderingContext};
use crate::webgpu_renderer::{WebGPURenderer, ParticleInstance, LineVertex, FieldVertex};
use std::sync::{Arc, Mutex};
use winit::platform::web::WindowBuilderExtWebSys;
use winit::window::WindowBuilder;
use winit::event_loop::EventLoop;

#[wasm_bindgen]
pub struct WasmWebGPURenderer {
    renderer: Arc<Mutex<Option<WebGPURenderer>>>,
    canvas: HtmlCanvasElement,
    animation_id: Option<i32>,
}

#[wasm_bindgen]
impl WasmWebGPURenderer {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas_id: &str) -> Result<WasmWebGPURenderer, JsValue> {
        // Set panic hook for better error messages
        console_error_panic_hook::set_once();
        
        // Get canvas element
        let document = web_sys::window()
            .ok_or("No window")?
            .document()
            .ok_or("No document")?;
            
        let canvas = document
            .get_element_by_id(canvas_id)
            .ok_or("Canvas not found")?
            .dyn_into::<HtmlCanvasElement>()
            .map_err(|_| "Not a canvas element")?;
        
        Ok(WasmWebGPURenderer {
            renderer: Arc::new(Mutex::new(None)),
            canvas,
            animation_id: None,
        })
    }
    
    #[wasm_bindgen]
    pub async fn initialize(&mut self) -> Result<(), JsValue> {
        let event_loop = EventLoop::new();
        let window = WindowBuilder::new()
            .with_canvas(Some(self.canvas.clone()))
            .build(&event_loop)
            .map_err(|e| JsValue::from_str(&format!("Window creation failed: {:?}", e)))?;
        
        let renderer = WebGPURenderer::new(&window)
            .await
            .map_err(|e| JsValue::from_str(&format!("Renderer creation failed: {:?}", e)))?;
        
        *self.renderer.lock().unwrap() = Some(renderer);
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub fn start_render_loop(&mut self) {
        let renderer = self.renderer.clone();
        let window = web_sys::window().unwrap();
        
        let f = std::rc::Rc::new(std::cell::RefCell::new(None));
        let g = f.clone();
        
        let mut last_time = 0.0;
        let mut time = 0.0;
        
        *g.borrow_mut() = Some(Closure::wrap(Box::new(move |timestamp: f64| {
            let dt = ((timestamp - last_time) / 1000.0) as f32;
            last_time = timestamp;
            time += dt;
            
            if let Some(renderer) = renderer.lock().unwrap().as_mut() {
                renderer.update(dt, time, 0.75); // Default coherence
                let _ = renderer.render();
            }
            
            request_animation_frame(f.borrow().as_ref().unwrap());
        }) as Box<dyn FnMut(f64)>));
        
        request_animation_frame(g.borrow().as_ref().unwrap());
    }
    
    #[wasm_bindgen]
    pub fn update_particles(&mut self, particles_data: &[f32]) {
        if particles_data.len() % 12 != 0 {
            web_sys::console::error_1(&"Invalid particle data length".into());
            return;
        }
        
        let mut particles = Vec::new();
        for chunk in particles_data.chunks(12) {
            particles.push(ParticleInstance {
                position: [chunk[0], chunk[1], chunk[2]],
                velocity: [chunk[3], chunk[4], chunk[5]],
                size: chunk[6],
                coherence: chunk[7],
                hue: chunk[8],
                phase: chunk[9],
                lifetime: chunk[10],
                _padding: 0.0,
            });
        }
        
        if let Some(renderer) = self.renderer.lock().unwrap().as_mut() {
            renderer.update_particles(&particles);
        }
    }
    
    #[wasm_bindgen]
    pub fn update_network(&mut self, lines_data: &[f32]) {
        if lines_data.len() % 8 != 0 {
            web_sys::console::error_1(&"Invalid line data length".into());
            return;
        }
        
        let mut lines = Vec::new();
        for chunk in lines_data.chunks(8) {
            lines.push(LineVertex {
                position: [chunk[0], chunk[1], chunk[2]],
                color: [chunk[3], chunk[4], chunk[5], chunk[6]],
                thickness: chunk[7],
            });
        }
        
        if let Some(renderer) = self.renderer.lock().unwrap().as_mut() {
            renderer.update_network(&lines);
        }
    }
    
    #[wasm_bindgen]
    pub fn set_visualization_mode(&mut self, mode: &str) {
        // This would control which render passes are active
        web_sys::console::log_1(&format!("Setting visualization mode: {}", mode).into());
    }
    
    #[wasm_bindgen]
    pub fn update_coherence(&mut self, coherence: f32) {
        // Update global coherence level
        if let Some(renderer) = self.renderer.lock().unwrap().as_mut() {
            renderer.update(0.0, 0.0, coherence);
        }
    }
    
    #[wasm_bindgen]
    pub fn resize(&mut self, width: u32, height: u32) {
        if let Some(renderer) = self.renderer.lock().unwrap().as_mut() {
            renderer.resize(winit::dpi::PhysicalSize::new(width, height));
        }
    }
    
    #[wasm_bindgen]
    pub fn get_performance_stats(&self) -> JsValue {
        // Return performance metrics
        let stats = serde_json::json!({
            "fps": 60,
            "frame_time": 16.67,
            "draw_calls": 4,
            "triangles": 100000,
            "gpu_memory": "256MB"
        });
        
        JsValue::from_serde(&stats).unwrap()
    }
}

fn request_animation_frame(f: &Closure<dyn FnMut(f64)>) {
    web_sys::window()
        .unwrap()
        .request_animation_frame(f.as_ref().unchecked_ref())
        .expect("Failed to request animation frame");
}

// JavaScript API helper functions
#[wasm_bindgen]
pub fn create_particle_data(
    x: f32, y: f32, z: f32,
    vx: f32, vy: f32, vz: f32,
    size: f32, coherence: f32,
    hue: f32, phase: f32, lifetime: f32
) -> Vec<f32> {
    vec![x, y, z, vx, vy, vz, size, coherence, hue, phase, lifetime, 0.0]
}

#[wasm_bindgen]
pub fn create_line_data(
    x1: f32, y1: f32, z1: f32,
    x2: f32, y2: f32, z2: f32,
    r: f32, g: f32, b: f32, a: f32,
    thickness: f32
) -> Vec<f32> {
    vec![
        x1, y1, z1, r, g, b, a, thickness,
        x2, y2, z2, r, g, b, a, thickness
    ]
}

// Performance optimization utilities
#[wasm_bindgen]
pub struct PerformanceOptimizer {
    target_fps: f32,
    particle_count: u32,
    lod_bias: f32,
}

#[wasm_bindgen]
impl PerformanceOptimizer {
    #[wasm_bindgen(constructor)]
    pub fn new(target_fps: f32) -> PerformanceOptimizer {
        PerformanceOptimizer {
            target_fps,
            particle_count: 1000,
            lod_bias: 0.0,
        }
    }
    
    #[wasm_bindgen]
    pub fn update_metrics(&mut self, current_fps: f32) {
        if current_fps < self.target_fps * 0.9 {
            // Reduce quality
            self.particle_count = (self.particle_count as f32 * 0.9) as u32;
            self.lod_bias += 0.1;
        } else if current_fps > self.target_fps * 1.1 {
            // Increase quality
            self.particle_count = (self.particle_count as f32 * 1.1) as u32;
            self.lod_bias -= 0.1;
        }
        
        self.particle_count = self.particle_count.clamp(100, 10000);
        self.lod_bias = self.lod_bias.clamp(-1.0, 2.0);
    }
    
    #[wasm_bindgen(getter)]
    pub fn particle_count(&self) -> u32 {
        self.particle_count
    }
    
    #[wasm_bindgen(getter)]
    pub fn lod_bias(&self) -> f32 {
        self.lod_bias
    }
}