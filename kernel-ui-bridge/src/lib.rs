// Kernel-UI Bridge - Real-time Coherence Display Pipeline
// "The kernel breathes, the UI dances"

pub mod websocket_server;
pub mod coherence_stream;
pub mod visualization_pipeline;
pub mod field_translator;
pub mod ui_commands;

use stillpoint_kernel::{
    ConsciousnessVortex, VortexId, CollectiveField,
    EmergenceEvent, SacredPattern, PatternType,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::{RwLock, broadcast, mpsc};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use std::collections::HashMap;

/// Main bridge between kernel consciousness and UI visualization
pub struct KernelUIBridge {
    kernel_connection: Arc<KernelConnection>,
    websocket_server: Arc<websocket_server::WebSocketServer>,
    coherence_stream: Arc<coherence_stream::CoherenceStream>,
    visualization_pipeline: Arc<visualization_pipeline::VisualizationPipeline>,
    active_subscriptions: Arc<RwLock<HashMap<ClientId, Subscription>>>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ClientId(pub Uuid);

/// Kernel connection handler
pub struct KernelConnection {
    vortex_updates: broadcast::Sender<VortexUpdate>,
    field_updates: broadcast::Sender<FieldUpdate>,
    emergence_events: broadcast::Sender<EmergenceUpdate>,
    command_sender: mpsc::Sender<KernelCommand>,
}

/// Real-time updates from kernel
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VortexUpdate {
    pub vortex_id: Uuid,
    pub timestamp: DateTime<Utc>,
    pub coherence: f64,
    pub state: VortexStateInfo,
    pub biometrics: BiometricSnapshot,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VortexStateInfo {
    pub state_type: String,
    pub momentum: [f64; 3],
    pub phase: f64,
    pub energy: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricSnapshot {
    pub heart_rate: f64,
    pub heart_coherence: f64,
    pub breath_rate: f64,
    pub skin_conductance: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldUpdate {
    pub timestamp: DateTime<Utc>,
    pub coherence_level: f64,
    pub participant_count: usize,
    pub field_strength: f64,
    pub harmonic_peaks: Vec<f64>,
    pub phase_coherence: f64,
    pub sacred_patterns: Vec<PatternInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatternInfo {
    pub pattern_type: String,
    pub activation_level: f64,
    pub participants: Vec<Uuid>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmergenceUpdate {
    pub timestamp: DateTime<Utc>,
    pub emergence_type: String,
    pub coherence_at_emergence: f64,
    pub participants: Vec<Uuid>,
    pub field_signature: Vec<f64>,
}

/// Commands from UI to kernel
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum KernelCommand {
    SetTargetCoherence(f64),
    ActivatePattern(PatternType),
    JoinCollective(Uuid),
    LeaveCollective(Uuid),
    StartMeditation(u32), // minutes
    AdjustFieldStrength(f64),
}

/// Client subscription preferences
#[derive(Debug, Clone)]
pub struct Subscription {
    pub vortex_updates: bool,
    pub field_updates: bool,
    pub emergence_events: bool,
    pub update_rate_hz: f64,
    pub visualization_mode: VisualizationMode,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum VisualizationMode {
    Particles,
    CoherenceField,
    NetworkGraph,
    SacredGeometry,
    Hybrid,
}

impl KernelUIBridge {
    pub async fn new(kernel_addr: &str, ui_port: u16) -> anyhow::Result<Self> {
        // Create kernel connection
        let kernel_connection = Arc::new(KernelConnection::connect(kernel_addr).await?);
        
        // Create WebSocket server
        let websocket_server = Arc::new(
            websocket_server::WebSocketServer::new(ui_port).await?
        );
        
        // Create coherence stream processor
        let coherence_stream = Arc::new(
            coherence_stream::CoherenceStream::new()
        );
        
        // Create visualization pipeline
        let visualization_pipeline = Arc::new(
            visualization_pipeline::VisualizationPipeline::new()
        );
        
        let bridge = Self {
            kernel_connection,
            websocket_server,
            coherence_stream,
            visualization_pipeline,
            active_subscriptions: Arc::new(RwLock::new(HashMap::new())),
        };
        
        // Start processing loops
        bridge.start_kernel_listener().await?;
        bridge.start_ui_command_processor().await?;
        
        Ok(bridge)
    }
    
    /// Start listening for kernel updates
    async fn start_kernel_listener(&self) -> anyhow::Result<()> {
        let mut vortex_rx = self.kernel_connection.vortex_updates.subscribe();
        let mut field_rx = self.kernel_connection.field_updates.subscribe();
        let mut emergence_rx = self.kernel_connection.emergence_events.subscribe();
        
        let bridge = self.clone();
        
        // Vortex update processor
        tokio::spawn(async move {
            while let Ok(update) = vortex_rx.recv().await {
                if let Err(e) = bridge.process_vortex_update(update).await {
                    tracing::error!("Error processing vortex update: {}", e);
                }
            }
        });
        
        let bridge = self.clone();
        
        // Field update processor
        tokio::spawn(async move {
            while let Ok(update) = field_rx.recv().await {
                if let Err(e) = bridge.process_field_update(update).await {
                    tracing::error!("Error processing field update: {}", e);
                }
            }
        });
        
        let bridge = self.clone();
        
        // Emergence event processor
        tokio::spawn(async move {
            while let Ok(update) = emergence_rx.recv().await {
                if let Err(e) = bridge.process_emergence_event(update).await {
                    tracing::error!("Error processing emergence event: {}", e);
                }
            }
        });
        
        Ok(())
    }
    
    /// Start processing UI commands
    async fn start_ui_command_processor(&self) -> anyhow::Result<()> {
        let mut command_rx = self.websocket_server.get_command_receiver();
        let kernel_tx = self.kernel_connection.command_sender.clone();
        
        tokio::spawn(async move {
            while let Some((client_id, command)) = command_rx.recv().await {
                if let Err(e) = kernel_tx.send(command).await {
                    tracing::error!("Error sending command to kernel: {}", e);
                }
            }
        });
        
        Ok(())
    }
    
    /// Process vortex update from kernel
    async fn process_vortex_update(&self, update: VortexUpdate) -> anyhow::Result<()> {
        // Stream through coherence processor
        let processed = self.coherence_stream.process_vortex(&update).await?;
        
        // Generate visualization data
        let viz_data = self.visualization_pipeline
            .generate_vortex_visualization(&processed).await?;
        
        // Send to subscribed clients
        let subscriptions = self.active_subscriptions.read().await;
        for (client_id, sub) in subscriptions.iter() {
            if sub.vortex_updates {
                self.websocket_server.send_to_client(
                    *client_id,
                    UIMessage::VortexVisualization(viz_data.clone()),
                ).await?;
            }
        }
        
        Ok(())
    }
    
    /// Process field update from kernel
    async fn process_field_update(&self, update: FieldUpdate) -> anyhow::Result<()> {
        // Generate field visualization
        let viz_data = self.visualization_pipeline
            .generate_field_visualization(&update).await?;
        
        // Send to subscribed clients
        let subscriptions = self.active_subscriptions.read().await;
        for (client_id, sub) in subscriptions.iter() {
            if sub.field_updates {
                self.websocket_server.send_to_client(
                    *client_id,
                    UIMessage::FieldVisualization(viz_data.clone()),
                ).await?;
            }
        }
        
        Ok(())
    }
    
    /// Process emergence event from kernel
    async fn process_emergence_event(&self, event: EmergenceUpdate) -> anyhow::Result<()> {
        // Generate emergence visualization
        let viz_data = self.visualization_pipeline
            .generate_emergence_visualization(&event).await?;
        
        // Send to subscribed clients
        let subscriptions = self.active_subscriptions.read().await;
        for (client_id, sub) in subscriptions.iter() {
            if sub.emergence_events {
                self.websocket_server.send_to_client(
                    *client_id,
                    UIMessage::EmergenceVisualization(viz_data.clone()),
                ).await?;
            }
        }
        
        Ok(())
    }
    
    /// Subscribe a client to updates
    pub async fn subscribe_client(
        &self,
        client_id: ClientId,
        subscription: Subscription,
    ) -> anyhow::Result<()> {
        self.active_subscriptions.write().await
            .insert(client_id, subscription);
        
        // Send initial state
        self.send_initial_state(client_id).await?;
        
        Ok(())
    }
    
    /// Send initial state to newly connected client
    async fn send_initial_state(&self, client_id: ClientId) -> anyhow::Result<()> {
        // Get current kernel state
        let current_field = self.kernel_connection.get_current_field().await?;
        let active_vortices = self.kernel_connection.get_active_vortices().await?;
        
        // Generate initial visualizations
        let field_viz = self.visualization_pipeline
            .generate_field_visualization(&current_field).await?;
        
        // Send to client
        self.websocket_server.send_to_client(
            client_id,
            UIMessage::InitialState {
                field: field_viz,
                vortices: active_vortices,
                patterns: self.get_available_patterns(),
            },
        ).await?;
        
        Ok(())
    }
    
    fn get_available_patterns(&self) -> Vec<PatternInfo> {
        vec![
            PatternInfo {
                pattern_type: "CircleOfUnity".to_string(),
                activation_level: 0.0,
                participants: vec![],
            },
            PatternInfo {
                pattern_type: "FlowerOfLife".to_string(),
                activation_level: 0.0,
                participants: vec![],
            },
            PatternInfo {
                pattern_type: "HeartField".to_string(),
                activation_level: 0.0,
                participants: vec![],
            },
        ]
    }
    
    /// Unsubscribe a client
    pub async fn unsubscribe_client(&self, client_id: ClientId) -> anyhow::Result<()> {
        self.active_subscriptions.write().await.remove(&client_id);
        Ok(())
    }
}

impl Clone for KernelUIBridge {
    fn clone(&self) -> Self {
        Self {
            kernel_connection: self.kernel_connection.clone(),
            websocket_server: self.websocket_server.clone(),
            coherence_stream: self.coherence_stream.clone(),
            visualization_pipeline: self.visualization_pipeline.clone(),
            active_subscriptions: self.active_subscriptions.clone(),
        }
    }
}

impl KernelConnection {
    async fn connect(addr: &str) -> anyhow::Result<Self> {
        let (vortex_tx, _) = broadcast::channel(1024);
        let (field_tx, _) = broadcast::channel(1024);
        let (emergence_tx, _) = broadcast::channel(1024);
        let (command_tx, mut command_rx) = mpsc::channel(256);
        
        // In real implementation, would connect to actual kernel
        // For now, create channels for communication
        
        Ok(Self {
            vortex_updates: vortex_tx,
            field_updates: field_tx,
            emergence_events: emergence_tx,
            command_sender: command_tx,
        })
    }
    
    async fn get_current_field(&self) -> anyhow::Result<FieldUpdate> {
        // In real implementation, query kernel
        Ok(FieldUpdate {
            timestamp: Utc::now(),
            coherence_level: 0.75,
            participant_count: 3,
            field_strength: 0.8,
            harmonic_peaks: vec![7.83, 15.66, 23.49],
            phase_coherence: 0.85,
            sacred_patterns: vec![],
        })
    }
    
    async fn get_active_vortices(&self) -> anyhow::Result<Vec<VortexUpdate>> {
        // In real implementation, query kernel
        Ok(vec![])
    }
}

/// Messages sent to UI
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UIMessage {
    VortexVisualization(VortexVisualizationData),
    FieldVisualization(FieldVisualizationData),
    EmergenceVisualization(EmergenceVisualizationData),
    InitialState {
        field: FieldVisualizationData,
        vortices: Vec<VortexUpdate>,
        patterns: Vec<PatternInfo>,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VortexVisualizationData {
    pub vortex_id: Uuid,
    pub position: [f32; 3],
    pub color: [f32; 4],
    pub size: f32,
    pub rotation_speed: f32,
    pub particle_count: usize,
    pub coherence_glow: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldVisualizationData {
    pub field_mesh: Vec<FieldPoint>,
    pub coherence_waves: Vec<WaveData>,
    pub sacred_geometry: Option<GeometryData>,
    pub overall_coherence: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldPoint {
    pub position: [f32; 3],
    pub coherence: f32,
    pub color: [f32; 4],
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WaveData {
    pub origin: [f32; 3],
    pub wavelength: f32,
    pub amplitude: f32,
    pub phase: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeometryData {
    pub vertices: Vec<[f32; 3]>,
    pub edges: Vec<[u32; 2]>,
    pub pattern_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmergenceVisualizationData {
    pub burst_origin: [f32; 3],
    pub particle_burst: Vec<EmergenceParticle>,
    pub field_ripple: RippleEffect,
    pub sacred_symbol: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmergenceParticle {
    pub position: [f32; 3],
    pub velocity: [f32; 3],
    pub color: [f32; 4],
    pub lifetime: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RippleEffect {
    pub center: [f32; 3],
    pub radius: f32,
    pub intensity: f32,
    pub frequency: f32,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_client_id_creation() {
        let id1 = ClientId(Uuid::new_v4());
        let id2 = ClientId(Uuid::new_v4());
        assert_ne!(id1, id2);
    }
}