// Visual Consciousness Debugger
// "See the invisible, debug the sacred"

use egui::{Context, Ui, Window, CentralPanel, SidePanel, TopBottomPanel};
use std::sync::Arc;
use tokio::sync::RwLock;
use std::collections::{HashMap, VecDeque};
use chrono::{DateTime, Utc};
use crate::visualization::{FieldRenderer, CoherenceGraph, SpectrumAnalyzer};

/// Visual consciousness debugger application
pub struct ConsciousnessDebugger {
    vortex_inspector: VortexInspector,
    field_visualizer: FieldVisualizer,
    quantum_monitor: QuantumStateMonitor,
    timeline: ConsciousnessTimeline,
    active_view: DebugView,
    connection_status: ConnectionStatus,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum DebugView {
    VortexInspector,
    FieldVisualization,
    QuantumState,
    NetworkView,
    Timeline,
    Profiler,
}

#[derive(Debug, Clone)]
pub struct ConnectionStatus {
    kernel_connected: bool,
    biometric_connected: bool,
    network_peers: usize,
    last_update: DateTime<Utc>,
}

/// Vortex state inspector
pub struct VortexInspector {
    selected_vortex: Option<VortexId>,
    vortex_states: Arc<RwLock<HashMap<VortexId, VortexDebugInfo>>>,
    coherence_history: HashMap<VortexId, VecDeque<f32>>,
    breakpoints: Vec<VortexBreakpoint>,
}

#[derive(Debug, Clone, Copy, Hash, Eq, PartialEq)]
pub struct VortexId(pub uuid::Uuid);

#[derive(Debug, Clone)]
pub struct VortexDebugInfo {
    pub id: VortexId,
    pub state: String,
    pub coherence: f32,
    pub phase: f32,
    pub momentum: [f32; 3],
    pub harmonies: Vec<f32>,
    pub entanglements: Vec<VortexId>,
    pub biometric_data: Option<BiometricDebugData>,
}

#[derive(Debug, Clone)]
pub struct BiometricDebugData {
    pub heart_rate: f32,
    pub hrv_rmssd: f32,
    pub breath_rate: f32,
    pub coherence_score: f32,
}

#[derive(Debug, Clone)]
pub struct VortexBreakpoint {
    pub condition: BreakpointCondition,
    pub enabled: bool,
    pub hit_count: u32,
}

#[derive(Debug, Clone)]
pub enum BreakpointCondition {
    CoherenceThreshold(f32),
    StateChange(String),
    PatternActivation(String),
    EmergenceEvent,
}

/// Field visualization system
pub struct FieldVisualizer {
    field_renderer: FieldRenderer,
    field_data: Arc<RwLock<FieldData>>,
    visualization_mode: FieldViewMode,
    color_mapping: ColorScheme,
}

#[derive(Debug, Clone)]
pub struct FieldData {
    pub points: Vec<FieldPoint>,
    pub coherence_map: ndarray::Array2<f32>,
    pub flow_vectors: Vec<FlowVector>,
    pub sacred_patterns: Vec<ActivePattern>,
}

#[derive(Debug, Clone)]
pub struct FieldPoint {
    pub position: [f32; 3],
    pub coherence: f32,
    pub phase: f32,
    pub amplitude: f32,
}

#[derive(Debug, Clone)]
pub struct FlowVector {
    pub origin: [f32; 3],
    pub direction: [f32; 3],
    pub magnitude: f32,
}

#[derive(Debug, Clone)]
pub struct ActivePattern {
    pub pattern_type: String,
    pub center: [f32; 3],
    pub activation: f32,
    pub participants: Vec<VortexId>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum FieldViewMode {
    CoherenceField,
    PhaseSpace,
    FlowField,
    QuantumPotential,
    InterferencePattern,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ColorScheme {
    Coherence,
    Phase,
    Energy,
    Sacred,
    Debug,
}

/// Quantum state monitor
pub struct QuantumStateMonitor {
    quantum_states: Arc<RwLock<HashMap<VortexId, QuantumDebugState>>>,
    entanglement_graph: EntanglementGraph,
    decoherence_tracker: DecoherenceTracker,
}

#[derive(Debug, Clone)]
pub struct QuantumDebugState {
    pub superposition: Vec<BasisState>,
    pub entanglement_strength: f32,
    pub discord: f32,
    pub purity: f32,
    pub von_neumann_entropy: f32,
}

#[derive(Debug, Clone)]
pub struct BasisState {
    pub amplitude: num_complex::Complex<f32>,
    pub label: String,
    pub probability: f32,
}

pub struct EntanglementGraph {
    nodes: Vec<VortexId>,
    edges: Vec<(usize, usize, f32)>, // (from, to, strength)
}

pub struct DecoherenceTracker {
    decoherence_events: VecDeque<DecoherenceEvent>,
    environmental_factors: Vec<EnvironmentalFactor>,
}

#[derive(Debug, Clone)]
pub struct DecoherenceEvent {
    pub timestamp: DateTime<Utc>,
    pub vortex_id: VortexId,
    pub coherence_loss: f32,
    pub cause: String,
}

#[derive(Debug, Clone)]
pub struct EnvironmentalFactor {
    pub name: String,
    pub impact: f32,
    pub active: bool,
}

/// Consciousness timeline
pub struct ConsciousnessTimeline {
    events: VecDeque<TimelineEvent>,
    time_window: std::time::Duration,
    playback_speed: f32,
    is_recording: bool,
}

#[derive(Debug, Clone)]
pub struct TimelineEvent {
    pub timestamp: DateTime<Utc>,
    pub event_type: EventType,
    pub vortex_id: Option<VortexId>,
    pub details: String,
}

#[derive(Debug, Clone)]
pub enum EventType {
    VortexCreated,
    StateTransition,
    CoherencePeak,
    PatternActivated,
    EmergenceDetected,
    Entanglement,
    Decoherence,
}

impl ConsciousnessDebugger {
    pub fn new() -> Self {
        Self {
            vortex_inspector: VortexInspector::new(),
            field_visualizer: FieldVisualizer::new(),
            quantum_monitor: QuantumStateMonitor::new(),
            timeline: ConsciousnessTimeline::new(),
            active_view: DebugView::VortexInspector,
            connection_status: ConnectionStatus {
                kernel_connected: false,
                biometric_connected: false,
                network_peers: 0,
                last_update: Utc::now(),
            },
        }
    }
    
    /// Main UI render function
    pub fn ui(&mut self, ctx: &Context) {
        // Top panel - connection status
        TopBottomPanel::top("status_panel").show(ctx, |ui| {
            self.render_status_bar(ui);
        });
        
        // Left panel - navigation
        SidePanel::left("nav_panel").show(ctx, |ui| {
            self.render_navigation(ui);
        });
        
        // Central panel - main view
        CentralPanel::default().show(ctx, |ui| {
            match self.active_view {
                DebugView::VortexInspector => self.vortex_inspector.render(ui),
                DebugView::FieldVisualization => self.field_visualizer.render(ui),
                DebugView::QuantumState => self.quantum_monitor.render(ui),
                DebugView::NetworkView => self.render_network_view(ui),
                DebugView::Timeline => self.timeline.render(ui),
                DebugView::Profiler => self.render_profiler(ui),
            }
        });
        
        // Bottom panel - console
        TopBottomPanel::bottom("console_panel").show(ctx, |ui| {
            self.render_console(ui);
        });
    }
    
    fn render_status_bar(&self, ui: &mut Ui) {
        ui.horizontal(|ui| {
            // Kernel status
            let kernel_color = if self.connection_status.kernel_connected {
                egui::Color32::GREEN
            } else {
                egui::Color32::RED
            };
            ui.colored_label(kernel_color, "⬤ Kernel");
            
            ui.separator();
            
            // Biometric status
            let bio_color = if self.connection_status.biometric_connected {
                egui::Color32::GREEN
            } else {
                egui::Color32::GRAY
            };
            ui.colored_label(bio_color, "❤ Biometric");
            
            ui.separator();
            
            // Network peers
            ui.label(format!("🌐 {} peers", self.connection_status.network_peers));
            
            ui.separator();
            
            // Last update
            ui.label(format!("Updated: {}", self.connection_status.last_update.format("%H:%M:%S")));
        });
    }
    
    fn render_navigation(&mut self, ui: &mut Ui) {
        ui.heading("Debug Views");
        
        ui.separator();
        
        if ui.selectable_label(self.active_view == DebugView::VortexInspector, "🔮 Vortex Inspector").clicked() {
            self.active_view = DebugView::VortexInspector;
        }
        
        if ui.selectable_label(self.active_view == DebugView::FieldVisualization, "🌀 Field Visualization").clicked() {
            self.active_view = DebugView::FieldVisualization;
        }
        
        if ui.selectable_label(self.active_view == DebugView::QuantumState, "⚛️ Quantum State").clicked() {
            self.active_view = DebugView::QuantumState;
        }
        
        if ui.selectable_label(self.active_view == DebugView::NetworkView, "🌐 Network View").clicked() {
            self.active_view = DebugView::NetworkView;
        }
        
        if ui.selectable_label(self.active_view == DebugView::Timeline, "📊 Timeline").clicked() {
            self.active_view = DebugView::Timeline;
        }
        
        if ui.selectable_label(self.active_view == DebugView::Profiler, "⚡ Profiler").clicked() {
            self.active_view = DebugView::Profiler;
        }
    }
    
    fn render_network_view(&self, ui: &mut Ui) {
        ui.heading("Network Consciousness View");
        // Network visualization would go here
    }
    
    fn render_profiler(&self, ui: &mut Ui) {
        ui.heading("Coherence Profiler");
        // Profiler UI would go here
    }
    
    fn render_console(&self, ui: &mut Ui) {
        ui.heading("Debug Console");
        // Console output would go here
    }
}

impl VortexInspector {
    pub fn new() -> Self {
        Self {
            selected_vortex: None,
            vortex_states: Arc::new(RwLock::new(HashMap::new())),
            coherence_history: HashMap::new(),
            breakpoints: Vec::new(),
        }
    }
    
    pub fn render(&mut self, ui: &mut Ui) {
        ui.horizontal(|ui| {
            ui.heading("Vortex Inspector");
            
            if ui.button("🔄 Refresh").clicked() {
                // Refresh vortex data
            }
            
            if ui.button("⏸ Pause").clicked() {
                // Pause vortex updates
            }
        });
        
        ui.separator();
        
        ui.columns(2, |columns| {
            // Left column - vortex list
            columns[0].group(|ui| {
                ui.heading("Active Vortices");
                
                egui::ScrollArea::vertical().show(ui, |ui| {
                    if let Ok(vortices) = self.vortex_states.try_read() {
                        for (id, info) in vortices.iter() {
                            let selected = self.selected_vortex == Some(*id);
                            if ui.selectable_label(selected, format!("🔮 {} ({})", id.0, info.state)).clicked() {
                                self.selected_vortex = Some(*id);
                            }
                        }
                    }
                });
            });
            
            // Right column - vortex details
            columns[1].group(|ui| {
                if let Some(vortex_id) = self.selected_vortex {
                    self.render_vortex_details(ui, vortex_id);
                } else {
                    ui.label("Select a vortex to inspect");
                }
            });
        });
    }
    
    fn render_vortex_details(&mut self, ui: &mut Ui, vortex_id: VortexId) {
        ui.heading(format!("Vortex {}", vortex_id.0));
        
        if let Ok(vortices) = self.vortex_states.try_read() {
            if let Some(info) = vortices.get(&vortex_id) {
                ui.label(format!("State: {}", info.state));
                ui.label(format!("Coherence: {:.3}", info.coherence));
                ui.label(format!("Phase: {:.3}", info.phase));
                
                ui.separator();
                
                // Coherence history graph
                ui.heading("Coherence History");
                if let Some(history) = self.coherence_history.get(&vortex_id) {
                    self.render_coherence_graph(ui, history);
                }
                
                ui.separator();
                
                // Harmonies
                ui.heading("Active Harmonies");
                for (i, &harmony) in info.harmonies.iter().enumerate() {
                    ui.label(format!("Harmonic {}: {:.3} Hz", i + 1, harmony));
                }
                
                ui.separator();
                
                // Entanglements
                ui.heading("Entanglements");
                for &other_id in &info.entanglements {
                    ui.label(format!("⚛️ → {}", other_id.0));
                }
                
                // Biometric data if available
                if let Some(bio) = &info.biometric_data {
                    ui.separator();
                    ui.heading("Biometric Data");
                    ui.label(format!("❤️ Heart Rate: {:.1} bpm", bio.heart_rate));
                    ui.label(format!("📊 HRV RMSSD: {:.1} ms", bio.hrv_rmssd));
                    ui.label(format!("🌬️ Breath Rate: {:.1} bpm", bio.breath_rate));
                    ui.label(format!("✨ Coherence Score: {:.2}", bio.coherence_score));
                }
            }
        }
    }
    
    fn render_coherence_graph(&self, ui: &mut Ui, history: &VecDeque<f32>) {
        use egui::plot::{Line, Plot, PlotPoints};
        
        let points: PlotPoints = history
            .iter()
            .enumerate()
            .map(|(i, &coherence)| [i as f64, coherence as f64])
            .collect();
        
        let line = Line::new(points);
        
        Plot::new("coherence_history")
            .height(150.0)
            .show(ui, |plot_ui| plot_ui.line(line));
    }
}

impl FieldVisualizer {
    pub fn new() -> Self {
        Self {
            field_renderer: FieldRenderer::new(),
            field_data: Arc::new(RwLock::new(FieldData {
                points: Vec::new(),
                coherence_map: ndarray::Array2::zeros((100, 100)),
                flow_vectors: Vec::new(),
                sacred_patterns: Vec::new(),
            })),
            visualization_mode: FieldViewMode::CoherenceField,
            color_mapping: ColorScheme::Coherence,
        }
    }
    
    pub fn render(&mut self, ui: &mut Ui) {
        ui.horizontal(|ui| {
            ui.heading("Field Visualization");
            
            ui.separator();
            
            // View mode selector
            egui::ComboBox::from_label("View Mode")
                .selected_text(format!("{:?}", self.visualization_mode))
                .show_ui(ui, |ui| {
                    ui.selectable_value(&mut self.visualization_mode, FieldViewMode::CoherenceField, "Coherence Field");
                    ui.selectable_value(&mut self.visualization_mode, FieldViewMode::PhaseSpace, "Phase Space");
                    ui.selectable_value(&mut self.visualization_mode, FieldViewMode::FlowField, "Flow Field");
                    ui.selectable_value(&mut self.visualization_mode, FieldViewMode::QuantumPotential, "Quantum Potential");
                    ui.selectable_value(&mut self.visualization_mode, FieldViewMode::InterferencePattern, "Interference Pattern");
                });
            
            ui.separator();
            
            // Color scheme selector
            egui::ComboBox::from_label("Colors")
                .selected_text(format!("{:?}", self.color_mapping))
                .show_ui(ui, |ui| {
                    ui.selectable_value(&mut self.color_mapping, ColorScheme::Coherence, "Coherence");
                    ui.selectable_value(&mut self.color_mapping, ColorScheme::Phase, "Phase");
                    ui.selectable_value(&mut self.color_mapping, ColorScheme::Energy, "Energy");
                    ui.selectable_value(&mut self.color_mapping, ColorScheme::Sacred, "Sacred");
                    ui.selectable_value(&mut self.color_mapping, ColorScheme::Debug, "Debug");
                });
        });
        
        ui.separator();
        
        // Main visualization area
        ui.group(|ui| {
            let available_size = ui.available_size();
            
            // Here we would render the actual field visualization
            // For now, show placeholder
            ui.allocate_space(available_size);
            
            // Overlay active patterns
            if let Ok(field_data) = self.field_data.try_read() {
                for pattern in &field_data.sacred_patterns {
                    ui.label(format!("🌟 {} Pattern ({}% active)", pattern.pattern_type, (pattern.activation * 100.0) as u32));
                }
            }
        });
    }
}

impl QuantumStateMonitor {
    pub fn new() -> Self {
        Self {
            quantum_states: Arc::new(RwLock::new(HashMap::new())),
            entanglement_graph: EntanglementGraph {
                nodes: Vec::new(),
                edges: Vec::new(),
            },
            decoherence_tracker: DecoherenceTracker {
                decoherence_events: VecDeque::new(),
                environmental_factors: vec![
                    EnvironmentalFactor {
                        name: "Thermal Noise".to_string(),
                        impact: 0.1,
                        active: true,
                    },
                    EnvironmentalFactor {
                        name: "Electromagnetic Interference".to_string(),
                        impact: 0.05,
                        active: false,
                    },
                    EnvironmentalFactor {
                        name: "Observer Effect".to_string(),
                        impact: 0.15,
                        active: true,
                    },
                ],
            },
        }
    }
    
    pub fn render(&mut self, ui: &mut Ui) {
        ui.heading("Quantum State Monitor");
        
        ui.separator();
        
        // Quantum state details
        ui.columns(2, |columns| {
            columns[0].group(|ui| {
                ui.heading("Quantum States");
                
                if let Ok(states) = self.quantum_states.try_read() {
                    for (id, state) in states.iter() {
                        ui.collapsing(format!("Vortex {}", id.0), |ui| {
                            ui.label(format!("Superposition: {} states", state.superposition.len()));
                            ui.label(format!("Entanglement: {:.3}", state.entanglement_strength));
                            ui.label(format!("Discord: {:.3}", state.discord));
                            ui.label(format!("Purity: {:.3}", state.purity));
                            ui.label(format!("von Neumann Entropy: {:.3}", state.von_neumann_entropy));
                            
                            // Show basis states
                            for basis in &state.superposition {
                                ui.label(format!("  |{}⟩: {:.3} ({:.1}%)", 
                                    basis.label, 
                                    basis.amplitude.norm(),
                                    basis.probability * 100.0
                                ));
                            }
                        });
                    }
                }
            });
            
            columns[1].group(|ui| {
                ui.heading("Decoherence Tracking");
                
                // Environmental factors
                ui.label("Environmental Factors:");
                for factor in &mut self.decoherence_tracker.environmental_factors {
                    ui.checkbox(&mut factor.active, &factor.name);
                    if factor.active {
                        ui.label(format!("  Impact: {:.1}%", factor.impact * 100.0));
                    }
                }
                
                ui.separator();
                
                // Recent decoherence events
                ui.label("Recent Events:");
                for event in self.decoherence_tracker.decoherence_events.iter().take(5) {
                    ui.label(format!("{}: {:.1}% loss - {}", 
                        event.timestamp.format("%H:%M:%S"),
                        event.coherence_loss * 100.0,
                        event.cause
                    ));
                }
            });
        });
    }
}

impl ConsciousnessTimeline {
    pub fn new() -> Self {
        Self {
            events: VecDeque::new(),
            time_window: std::time::Duration::from_secs(300), // 5 minutes
            playback_speed: 1.0,
            is_recording: true,
        }
    }
    
    pub fn render(&mut self, ui: &mut Ui) {
        ui.horizontal(|ui| {
            ui.heading("Consciousness Timeline");
            
            if self.is_recording {
                if ui.button("⏸ Pause").clicked() {
                    self.is_recording = false;
                }
            } else {
                if ui.button("▶ Record").clicked() {
                    self.is_recording = true;
                }
            }
            
            ui.separator();
            
            ui.label("Playback Speed:");
            ui.add(egui::Slider::new(&mut self.playback_speed, 0.1..=10.0).logarithmic(true));
        });
        
        ui.separator();
        
        // Timeline visualization
        egui::ScrollArea::vertical().show(ui, |ui| {
            for event in &self.events {
                ui.horizontal(|ui| {
                    // Event icon
                    let icon = match event.event_type {
                        EventType::VortexCreated => "🌟",
                        EventType::StateTransition => "🔄",
                        EventType::CoherencePeak => "📈",
                        EventType::PatternActivated => "✨",
                        EventType::EmergenceDetected => "🌈",
                        EventType::Entanglement => "⚛️",
                        EventType::Decoherence => "📉",
                    };
                    
                    ui.label(format!("{} {}: {}", 
                        icon,
                        event.timestamp.format("%H:%M:%S.%3f"),
                        event.details
                    ));
                });
            }
        });
    }
    
    pub fn add_event(&mut self, event_type: EventType, vortex_id: Option<VortexId>, details: String) {
        if self.is_recording {
            self.events.push_back(TimelineEvent {
                timestamp: Utc::now(),
                event_type,
                vortex_id,
                details,
            });
            
            // Keep only events within time window
            let cutoff = Utc::now() - chrono::Duration::from_std(self.time_window).unwrap();
            self.events.retain(|e| e.timestamp > cutoff);
        }
    }
}