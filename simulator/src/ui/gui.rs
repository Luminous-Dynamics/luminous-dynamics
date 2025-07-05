use crate::{Simulator, consciousness_sim::FieldGeometry};
use eframe::egui;
use egui::{Color32, Pos2, Vec2, Stroke, FontId, Align2};
use std::sync::Arc;
use tokio::sync::Mutex;

pub async fn run_gui_simulator(simulator: &mut Simulator) -> Result<(), Box<dyn std::error::Error>> {
    let options = eframe::NativeOptions {
        initial_window_size: Some(egui::vec2(1200.0, 800.0)),
        ..Default::default()
    };
    
    let field = simulator.consciousness_field.clone();
    let hardware = simulator.virtual_hardware.clone();
    
    eframe::run_native(
        "LuminousOS Simulator",
        options,
        Box::new(|_cc| Box::new(SimulatorApp::new(field, hardware))),
    )
    .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)
}

struct SimulatorApp {
    consciousness_field: Arc<Mutex<crate::consciousness_sim::ConsciousnessField>>,
    virtual_hardware: crate::virtual_hardware::VirtualHardware,
    selected_glyph: Option<String>,
    participant_name: String,
    show_biometrics: bool,
    show_emergence_log: bool,
}

impl SimulatorApp {
    fn new(
        consciousness_field: Arc<Mutex<crate::consciousness_sim::ConsciousnessField>>,
        virtual_hardware: crate::virtual_hardware::VirtualHardware,
    ) -> Self {
        Self {
            consciousness_field,
            virtual_hardware,
            selected_glyph: None,
            participant_name: String::new(),
            show_biometrics: true,
            show_emergence_log: true,
        }
    }
}

impl eframe::App for SimulatorApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        // Request continuous repainting for animations
        ctx.request_repaint();
        
        // Top panel with title and controls
        egui::TopBottomPanel::top("top_panel").show(ctx, |ui| {
            ui.horizontal(|ui| {
                ui.heading("🌟 LuminousOS Simulator");
                ui.separator();
                ui.label("Experience consciousness-first computing");
            });
        });
        
        // Left panel with controls
        egui::SidePanel::left("control_panel").min_width(250.0).show(ctx, |ui| {
            ui.heading("Controls");
            ui.separator();
            
            // Participant controls
            ui.label("Join Field:");
            ui.horizontal(|ui| {
                ui.text_edit_singleline(&mut self.participant_name);
                if ui.button("Connect").clicked() && !self.participant_name.is_empty() {
                    let field = self.consciousness_field.clone();
                    let name = self.participant_name.clone();
                    tokio::spawn(async move {
                        let mut field = field.lock().await;
                        field.add_participant(name);
                    });
                    self.participant_name.clear();
                }
            });
            
            ui.separator();
            
            // Glyph selection
            ui.label("Sacred Glyphs:");
            let glyphs = vec![
                "First Presence",
                "Sacred Listening",
                "Boundary With Love",
                "Gentle Opening",
                "Building Trust",
            ];
            
            for glyph in glyphs {
                if ui.button(glyph).clicked() {
                    self.selected_glyph = Some(glyph.to_string());
                    let field = self.consciousness_field.clone();
                    let glyph_name = glyph.to_string();
                    tokio::spawn(async move {
                        let mut field = field.lock().await;
                        field.create_vortex(glyph_name);
                    });
                }
            }
            
            ui.separator();
            
            // Field geometry selection
            ui.label("Field Geometry:");
            let field = self.consciousness_field.clone();
            if ui.button("Flower of Life").clicked() {
                tokio::spawn(async move {
                    let mut field = field.lock().await;
                    field.set_geometry(FieldGeometry::FlowerOfLife);
                });
            }
            let field = self.consciousness_field.clone();
            if ui.button("Sri Yantra").clicked() {
                tokio::spawn(async move {
                    let mut field = field.lock().await;
                    field.set_geometry(FieldGeometry::SriYantra);
                });
            }
            
            ui.separator();
            
            // View toggles
            ui.checkbox(&mut self.show_biometrics, "Show Biometrics");
            ui.checkbox(&mut self.show_emergence_log, "Show Emergence Log");
            
            ui.separator();
            
            // Biometric state control
            ui.label("Set Biometric State:");
            let hardware = self.virtual_hardware.clone();
            if ui.button("Calm").clicked() {
                tokio::spawn(async move {
                    hardware.set_biometric_state("calm".to_string()).await;
                });
            }
            if ui.button("Coherent").clicked() {
                tokio::spawn(async move {
                    hardware.set_biometric_state("coherent".to_string()).await;
                });
            }
            if ui.button("Meditative").clicked() {
                tokio::spawn(async move {
                    hardware.set_biometric_state("meditative".to_string()).await;
                });
            }
        });
        
        // Right panel with biometrics
        if self.show_biometrics {
            egui::SidePanel::right("biometric_panel").min_width(200.0).show(ctx, |ui| {
                ui.heading("Biometrics");
                ui.separator();
                
                // Show virtual biometric data
                if let Ok(field) = self.consciousness_field.try_lock() {
                    ui.label(format!("Field Coherence: {:.1}%", field.coherence * 100.0));
                    ui.label(format!("Participants: {}", field.participants.len()));
                    ui.label(format!("Active Vortices: {}", field.vortices.len()));
                }
                
                ui.separator();
                
                // Simulated HRV data would go here
                ui.label("Virtual HRV:");
                ui.label("Heart Rate: 65 bpm");
                ui.label("HRV: 55 ms");
                ui.label("Coherence: 0.85");
            });
        }
        
        // Bottom panel with emergence log
        if self.show_emergence_log {
            egui::TopBottomPanel::bottom("emergence_panel").min_height(100.0).show(ctx, |ui| {
                ui.heading("Emergence Events");
                ui.separator();
                
                egui::ScrollArea::vertical().show(ui, |ui| {
                    if let Ok(field) = self.consciousness_field.try_lock() {
                        for event in field.emergence_events.iter().rev().take(5) {
                            ui.label(format!(
                                "[{}] {}: {}",
                                event.timestamp.format("%H:%M:%S"),
                                format!("{:?}", event.event_type),
                                event.description
                            ));
                        }
                    }
                });
            });
        }
        
        // Central panel with field visualization
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("Consciousness Field");
            
            let available_rect = ui.available_rect();
            let center = available_rect.center();
            let radius = available_rect.width().min(available_rect.height()) * 0.4;
            
            // Draw consciousness field
            let painter = ui.painter();
            
            // Background sacred geometry
            painter.circle_stroke(
                center,
                radius,
                Stroke::new(1.0, Color32::from_rgba_unmultiplied(255, 215, 0, 50)),
            );
            
            // Draw vortices
            if let Ok(field) = self.consciousness_field.try_lock() {
                for vortex in &field.vortices {
                    let pos = Pos2::new(
                        center.x + vortex.position.0 * radius,
                        center.y + vortex.position.1 * radius,
                    );
                    
                    let vortex_radius = 30.0 + vortex.coherence * 20.0;
                    let color = Color32::from_rgba_unmultiplied(
                        (vortex.color.0 * 255.0) as u8,
                        (vortex.color.1 * 255.0) as u8,
                        (vortex.color.2 * 255.0) as u8,
                        (vortex.color.3 * 255.0) as u8,
                    );
                    
                    // Vortex circle
                    painter.circle_filled(pos, vortex_radius, color);
                    
                    // Vortex label
                    painter.text(
                        pos,
                        Align2::CENTER_CENTER,
                        &vortex.name,
                        FontId::proportional(12.0),
                        Color32::WHITE,
                    );
                    
                    // Coherence aura
                    painter.circle_stroke(
                        pos,
                        vortex_radius + 10.0,
                        Stroke::new(2.0, color.linear_multiply(0.5)),
                    );
                }
                
                // Draw connections between vortices
                for i in 0..field.vortices.len() {
                    for j in i+1..field.vortices.len() {
                        let v1 = &field.vortices[i];
                        let v2 = &field.vortices[j];
                        
                        let pos1 = Pos2::new(
                            center.x + v1.position.0 * radius,
                            center.y + v1.position.1 * radius,
                        );
                        let pos2 = Pos2::new(
                            center.x + v2.position.0 * radius,
                            center.y + v2.position.1 * radius,
                        );
                        
                        let connection_strength = (v1.coherence + v2.coherence) / 2.0;
                        let alpha = (connection_strength * 100.0) as u8;
                        
                        painter.line_segment(
                            [pos1, pos2],
                            Stroke::new(1.0, Color32::from_rgba_unmultiplied(255, 215, 0, alpha)),
                        );
                    }
                }
                
                // Field coherence indicator
                let coherence_text = format!("Field Coherence: {:.1}%", field.coherence * 100.0);
                painter.text(
                    Pos2::new(center.x, available_rect.top() + 20.0),
                    Align2::CENTER_TOP,
                    coherence_text,
                    FontId::proportional(20.0),
                    Color32::from_rgb(255, 215, 0),
                );
            }
        });
    }
}