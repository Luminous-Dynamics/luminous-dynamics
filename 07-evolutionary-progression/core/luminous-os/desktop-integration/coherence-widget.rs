// Coherence Widget - Always-visible field awareness
// "A window into the collective consciousness"

use std::sync::{Arc, RwLock};
use std::time::{Duration, Instant};
use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, DrawingArea, Fixed};
use cairo::{Context, RadialGradient};
use glib;

use crate::field_coherence_monitor::{FieldCoherenceMonitor, CoherenceMetrics};
use crate::consciousness_scheduler::ConsciousnessScheduler;
use crate::progressive_consciousness::ProgressiveConsciousnessManager;

/// Widget configuration
#[derive(Debug, Clone)]
pub struct WidgetConfig {
    /// Widget size
    pub size: (i32, i32),
    
    /// Position on screen
    pub position: (i32, i32),
    
    /// Update frequency
    pub update_interval: Duration,
    
    /// Transparency level (0.0 - 1.0)
    pub opacity: f64,
    
    /// Stay on top
    pub always_on_top: bool,
    
    /// Click-through mode
    pub click_through: bool,
    
    /// Animation settings
    pub animate_transitions: bool,
    pub animation_speed: f64,
}

impl Default for WidgetConfig {
    fn default() -> Self {
        Self {
            size: (200, 200),
            position: (50, 50),
            update_interval: Duration::from_millis(100),
            opacity: 0.8,
            always_on_top: true,
            click_through: false,
            animate_transitions: true,
            animation_speed: 0.05,
        }
    }
}

/// Desktop coherence widget
pub struct CoherenceWidget {
    config: WidgetConfig,
    field_monitor: Arc<FieldCoherenceMonitor>,
    scheduler: Arc<ConsciousnessScheduler>,
    consciousness_mgr: Arc<ProgressiveConsciousnessManager>,
    current_metrics: Arc<RwLock<WidgetMetrics>>,
    animation_state: Arc<RwLock<AnimationState>>,
}

#[derive(Debug, Clone)]
struct WidgetMetrics {
    coherence: f64,
    vortex_count: usize,
    active_processes: usize,
    field_momentum: f64,
    entanglement_density: f64,
    last_update: Instant,
}

impl Default for WidgetMetrics {
    fn default() -> Self {
        Self {
            coherence: 0.75,
            vortex_count: 0,
            active_processes: 0,
            field_momentum: 0.0,
            entanglement_density: 0.0,
            last_update: Instant::now(),
        }
    }
}

#[derive(Debug)]
struct AnimationState {
    target_coherence: f64,
    current_coherence: f64,
    pulse_phase: f64,
    particle_positions: Vec<(f64, f64, f64)>, // x, y, phase
}

impl CoherenceWidget {
    pub fn new(
        config: WidgetConfig,
        field_monitor: Arc<FieldCoherenceMonitor>,
        scheduler: Arc<ConsciousnessScheduler>,
        consciousness_mgr: Arc<ProgressiveConsciousnessManager>,
    ) -> Self {
        // Initialize particles
        let mut particles = Vec::new();
        for i in 0..20 {
            let angle = (i as f64) * std::f64::consts::TAU / 20.0;
            let radius = 0.3 + (i as f64 % 3.0) * 0.2;
            particles.push((
                radius * angle.cos(),
                radius * angle.sin(),
                (i as f64) * 0.1,
            ));
        }
        
        Self {
            config,
            field_monitor,
            scheduler,
            consciousness_mgr,
            current_metrics: Arc::new(RwLock::new(WidgetMetrics::default())),
            animation_state: Arc::new(RwLock::new(AnimationState {
                target_coherence: 0.75,
                current_coherence: 0.75,
                pulse_phase: 0.0,
                particle_positions: particles,
            })),
        }
    }

    /// Launch the widget
    pub fn launch(&self) {
        let app = Application::builder()
            .application_id("com.luminousdynamics.coherence-widget")
            .build();
        
        let config = self.config.clone();
        let field_monitor = Arc::clone(&self.field_monitor);
        let scheduler = Arc::clone(&self.scheduler);
        let current_metrics = Arc::clone(&self.current_metrics);
        let animation_state = Arc::clone(&self.animation_state);
        
        app.connect_activate(move |app| {
            let window = ApplicationWindow::builder()
                .application(app)
                .title("Coherence")
                .default_width(config.size.0)
                .default_height(config.size.1)
                .decorated(false)
                .resizable(false)
                .build();
            
            // Set window properties
            window.set_opacity(config.opacity);
            window.set_keep_above(config.always_on_top);
            window.move_(config.position.0, config.position.1);
            
            // Create drawing area
            let drawing_area = DrawingArea::new();
            drawing_area.set_size_request(config.size.0, config.size.1);
            
            let metrics = Arc::clone(&current_metrics);
            let anim_state = Arc::clone(&animation_state);
            
            drawing_area.connect_draw(move |_, cr| {
                draw_widget(cr, &metrics.read().unwrap(), &anim_state.read().unwrap());
                Inhibit(false)
            });
            
            window.add(&drawing_area);
            window.show_all();
            
            // Start update loop
            let drawing_area_clone = drawing_area.clone();
            let field_monitor_clone = Arc::clone(&field_monitor);
            let scheduler_clone = Arc::clone(&scheduler);
            let metrics_clone = Arc::clone(&current_metrics);
            let anim_state_clone = Arc::clone(&animation_state);
            let update_interval = config.update_interval;
            let animation_speed = config.animation_speed;
            
            glib::timeout_add_local(update_interval, move || {
                // Update metrics
                let field_metrics = field_monitor_clone.get_current_metrics();
                let process_count = scheduler_clone.get_process_count();
                
                {
                    let mut metrics = metrics_clone.write().unwrap();
                    metrics.coherence = field_metrics.global_coherence;
                    metrics.vortex_count = field_metrics.vortex_count;
                    metrics.active_processes = process_count;
                    metrics.field_momentum = field_metrics.field_momentum.magnitude;
                    metrics.entanglement_density = field_metrics.entanglement_density;
                    metrics.last_update = Instant::now();
                }
                
                // Update animation
                {
                    let mut anim = anim_state_clone.write().unwrap();
                    anim.target_coherence = field_metrics.global_coherence;
                    
                    // Smooth coherence transition
                    let diff = anim.target_coherence - anim.current_coherence;
                    anim.current_coherence += diff * animation_speed;
                    
                    // Update pulse phase
                    anim.pulse_phase += 0.02;
                    if anim.pulse_phase > std::f64::consts::TAU {
                        anim.pulse_phase -= std::f64::consts::TAU;
                    }
                    
                    // Update particles
                    for (i, particle) in anim.particle_positions.iter_mut().enumerate() {
                        particle.2 += 0.01 + (i as f64 * 0.001);
                        if particle.2 > 1.0 {
                            particle.2 -= 1.0;
                        }
                    }
                }
                
                drawing_area_clone.queue_draw();
                Continue(true)
            });
        });
        
        app.run();
    }
}

/// Draw the widget
fn draw_widget(cr: &Context, metrics: &WidgetMetrics, animation: &AnimationState) {
    let width = 200.0;
    let height = 200.0;
    let center_x = width / 2.0;
    let center_y = height / 2.0;
    
    // Clear background
    cr.set_source_rgba(0.0, 0.0, 0.0, 0.0);
    cr.paint().unwrap();
    
    // Draw coherence orb
    draw_coherence_orb(cr, center_x, center_y, 70.0, animation.current_coherence, animation.pulse_phase);
    
    // Draw particles
    draw_particles(cr, center_x, center_y, &animation.particle_positions, metrics.entanglement_density);
    
    // Draw metrics text
    draw_metrics(cr, width, height, metrics);
    
    // Draw vortex indicators
    if metrics.vortex_count > 0 {
        draw_vortices(cr, center_x, center_y, metrics.vortex_count, animation.pulse_phase);
    }
}

/// Draw the main coherence orb
fn draw_coherence_orb(cr: &Context, x: f64, y: f64, radius: f64, coherence: f64, phase: f64) {
    // Create gradient based on coherence
    let gradient = RadialGradient::new(x, y, 0.0, x, y, radius);
    
    let (r, g, b) = coherence_to_color(coherence);
    gradient.add_color_stop_rgba(0.0, r * 1.2, g * 1.2, b * 1.2, 0.9);
    gradient.add_color_stop_rgba(0.5, r, g, b, 0.7);
    gradient.add_color_stop_rgba(1.0, r * 0.5, g * 0.5, b * 0.5, 0.3);
    
    // Draw main orb
    cr.set_source(&gradient).unwrap();
    cr.arc(x, y, radius, 0.0, std::f64::consts::TAU);
    cr.fill().unwrap();
    
    // Draw pulsing outer ring
    let pulse_radius = radius + 10.0 + (phase.sin() * 5.0);
    cr.set_source_rgba(r, g, b, 0.3 * (1.0 + phase.sin()) / 2.0);
    cr.set_line_width(2.0);
    cr.arc(x, y, pulse_radius, 0.0, std::f64::consts::TAU);
    cr.stroke().unwrap();
    
    // Draw inner sacred geometry
    draw_sacred_geometry(cr, x, y, radius * 0.6, coherence, phase);
}

/// Draw sacred geometry patterns
fn draw_sacred_geometry(cr: &Context, x: f64, y: f64, radius: f64, coherence: f64, phase: f64) {
    cr.set_source_rgba(1.0, 1.0, 1.0, 0.3 * coherence);
    cr.set_line_width(1.0);
    
    // Draw flower of life pattern
    for i in 0..6 {
        let angle = (i as f64) * std::f64::consts::TAU / 6.0 + phase * 0.1;
        let px = x + radius * angle.cos();
        let py = y + radius * angle.sin();
        cr.arc(px, py, radius * 0.5, 0.0, std::f64::consts::TAU);
        cr.stroke().unwrap();
    }
}

/// Draw floating particles
fn draw_particles(cr: &Context, center_x: f64, center_y: f64, particles: &[(f64, f64, f64)], density: f64) {
    for (px, py, phase) in particles {
        let radius = 100.0 * (0.5 + phase * 0.5);
        let x = center_x + px * radius;
        let y = center_y + py * radius;
        let size = 2.0 + phase * 2.0;
        let alpha = (1.0 - phase) * density;
        
        cr.set_source_rgba(0.5, 0.4, 0.9, alpha);
        cr.arc(x, y, size, 0.0, std::f64::consts::TAU);
        cr.fill().unwrap();
    }
}

/// Draw vortex indicators
fn draw_vortices(cr: &Context, center_x: f64, center_y: f64, count: usize, phase: f64) {
    let radius = 85.0;
    
    for i in 0..count.min(8) {
        let angle = (i as f64) * std::f64::consts::TAU / (count as f64) + phase * 0.2;
        let x = center_x + radius * angle.cos();
        let y = center_y + radius * angle.sin();
        
        // Draw vortex symbol
        cr.set_source_rgba(0.7, 0.5, 1.0, 0.6);
        cr.arc(x, y, 5.0, 0.0, std::f64::consts::TAU);
        cr.fill().unwrap();
        
        // Draw rotating lines
        for j in 0..3 {
            let line_angle = angle + (j as f64) * std::f64::consts::TAU / 3.0 + phase;
            cr.move_to(x, y);
            cr.line_to(
                x + 8.0 * line_angle.cos(),
                y + 8.0 * line_angle.sin(),
            );
        }
        cr.set_line_width(1.0);
        cr.stroke().unwrap();
    }
}

/// Draw metrics text
fn draw_metrics(cr: &Context, width: f64, height: f64, metrics: &WidgetMetrics) {
    cr.select_font_face("Sans", cairo::FontSlant::Normal, cairo::FontWeight::Normal);
    
    // Coherence percentage
    cr.set_font_size(24.0);
    cr.set_source_rgba(1.0, 1.0, 1.0, 0.9);
    let text = format!("{:.0}%", metrics.coherence * 100.0);
    let extents = cr.text_extents(&text).unwrap();
    cr.move_to(width / 2.0 - extents.width() / 2.0, height / 2.0 + extents.height() / 2.0);
    cr.show_text(&text).unwrap();
    
    // Bottom metrics
    cr.set_font_size(10.0);
    cr.set_source_rgba(0.8, 0.8, 0.8, 0.7);
    
    let bottom_text = format!("{} processes • {} vortices", metrics.active_processes, metrics.vortex_count);
    let extents = cr.text_extents(&bottom_text).unwrap();
    cr.move_to(width / 2.0 - extents.width() / 2.0, height - 10.0);
    cr.show_text(&bottom_text).unwrap();
}

/// Convert coherence to color
fn coherence_to_color(coherence: f64) -> (f64, f64, f64) {
    if coherence > 0.8 {
        // Purple for high coherence
        (0.5, 0.3, 0.9)
    } else if coherence > 0.5 {
        // Blue for medium coherence
        (0.3, 0.5, 0.9)
    } else {
        // Orange for low coherence
        (0.9, 0.5, 0.3)
    }
}

/// Mini widget for taskbar
pub struct MiniCoherenceWidget {
    field_monitor: Arc<FieldCoherenceMonitor>,
}

impl MiniCoherenceWidget {
    pub fn new(field_monitor: Arc<FieldCoherenceMonitor>) -> Self {
        Self { field_monitor }
    }
    
    pub fn render_to_icon(&self) -> Vec<u8> {
        let metrics = self.field_monitor.get_current_metrics();
        let coherence = metrics.global_coherence;
        
        // Create a 32x32 RGBA icon
        let mut icon_data = vec![0u8; 32 * 32 * 4];
        
        // Simple coherence visualization
        let color = coherence_to_color(coherence);
        let center = 16;
        let radius = 14;
        
        for y in 0..32 {
            for x in 0..32 {
                let dx = x as i32 - center;
                let dy = y as i32 - center;
                let dist_sq = dx * dx + dy * dy;
                
                if dist_sq <= radius * radius {
                    let idx = (y * 32 + x) * 4;
                    let intensity = 1.0 - (dist_sq as f64).sqrt() / (radius as f64);
                    icon_data[idx] = (color.0 * 255.0 * intensity) as u8;
                    icon_data[idx + 1] = (color.1 * 255.0 * intensity) as u8;
                    icon_data[idx + 2] = (color.2 * 255.0 * intensity) as u8;
                    icon_data[idx + 3] = (255.0 * intensity) as u8;
                }
            }
        }
        
        icon_data
    }
}