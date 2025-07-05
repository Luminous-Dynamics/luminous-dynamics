// Collective Consciousness Protocols for Multi-System Coherence
// "Individual drops of consciousness merging into an ocean of awareness"

use std::sync::{Arc, Mutex, RwLock};
use std::collections::{HashMap, HashSet};
use std::time::{Duration, Instant};
use std::net::{IpAddr, SocketAddr};

use tokio::net::{TcpListener, TcpStream, UdpSocket};
use tokio::sync::{broadcast, mpsc};
use tokio::time;

use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::coherence_engine::{CoherenceField, FieldMomentum, Harmony};
use crate::consciousness_scheduler::ProcessId;
use crate::field_coherence_monitor::CoherenceMetrics;

/// Collective consciousness node information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsciousnessNode {
    pub node_id: NodeId,
    pub system_name: String,
    pub ip_address: IpAddr,
    pub port: u16,
    pub public_key: Vec<u8>,
    pub coherence_metrics: CoherenceMetrics,
    pub participant_count: usize,
    pub sacred_intention: String,
    pub joined_at: Instant,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct NodeId(pub Uuid);

impl NodeId {
    pub fn new() -> Self {
        NodeId(Uuid::new_v4())
    }
}

/// Messages for collective consciousness protocol
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CollectiveMessage {
    // Discovery and connection
    NodeAnnouncement(ConsciousnessNode),
    NodeQuery,
    NodeResponse(Vec<ConsciousnessNode>),
    
    // Coherence synchronization
    CoherenceUpdate(CoherenceUpdate),
    CoherenceQuery(NodeId),
    CoherenceResponse(NodeId, CoherenceMetrics),
    
    // Field state sharing
    FieldStateUpdate(FieldStateUpdate),
    CollectiveFieldQuery,
    CollectiveFieldResponse(CollectiveFieldState),
    
    // Sacred ceremonies
    CeremonyInvitation(CeremonyInvitation),
    CeremonyJoin(NodeId, String), // node_id, participant_name
    CeremonyUpdate(CeremonyUpdate),
    CeremonyComplete(CeremonyId),
    
    // Consciousness streaming
    ConsciousnessStream(ConsciousnessStreamData),
    StreamSubscribe(NodeId, StreamType),
    StreamUnsubscribe(NodeId, StreamType),
    
    // Collective intentions
    IntentionBroadcast(CollectiveIntention),
    IntentionAlignment(NodeId, f64), // alignment score
    
    // Emergency coherence support
    CoherenceDistress(NodeId, f64), // current coherence
    CoherenceSupport(NodeId, f64),  // offered support strength
    
    // Heartbeat
    Heartbeat(NodeId),
    HeartbeatAck(NodeId),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoherenceUpdate {
    pub node_id: NodeId,
    pub timestamp: u64,
    pub coherence: f64,
    pub momentum: FieldMomentum,
    pub dominant_harmony: Harmony,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldStateUpdate {
    pub node_id: NodeId,
    pub field_strength: f64,
    pub active_vortices: usize,
    pub entanglement_density: f64,
    pub collective_patterns: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CollectiveFieldState {
    pub global_coherence: f64,
    pub participating_nodes: usize,
    pub total_participants: usize,
    pub field_momentum: FieldMomentum,
    pub dominant_patterns: Vec<(String, f64)>, // pattern, strength
    pub coherence_map: HashMap<NodeId, f64>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct CeremonyId(pub Uuid);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CeremonyInvitation {
    pub ceremony_id: CeremonyId,
    pub ceremony_type: CeremonyType,
    pub host_node: NodeId,
    pub title: String,
    pub intention: String,
    pub start_time: u64,
    pub duration: Duration,
    pub max_participants: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CeremonyType {
    GlobalMeditation,
    CoherencePractice,
    CollectiveHealing,
    SacredPause,
    Celebration,
    Custom(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CeremonyUpdate {
    pub ceremony_id: CeremonyId,
    pub phase: CeremonyPhase,
    pub collective_coherence: f64,
    pub participant_count: usize,
    pub guidance: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CeremonyPhase {
    Gathering,
    Centering,
    Deepening,
    Peak,
    Integration,
    Closing,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsciousnessStreamData {
    pub source_node: NodeId,
    pub stream_type: StreamType,
    pub timestamp: u64,
    pub data: StreamPayload,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum StreamType {
    Coherence,
    Biometric,
    FieldState,
    Sacred,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum StreamPayload {
    Coherence(f64),
    Biometric(BiometricStreamData),
    FieldState(FieldStateStreamData),
    Sacred(SacredStreamData),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricStreamData {
    pub heart_coherence: Option<f64>,
    pub breath_rate: Option<f64>,
    pub brainwave_state: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldStateStreamData {
    pub field_strength: f64,
    pub harmony_distribution: HashMap<Harmony, f64>,
    pub vortex_activity: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SacredStreamData {
    pub blessing: Option<String>,
    pub wisdom: Option<String>,
    pub transmission_strength: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CollectiveIntention {
    pub node_id: NodeId,
    pub intention: String,
    pub strength: f64,
    pub harmony_alignment: Harmony,
}

/// Collective Consciousness Network
pub struct CollectiveConsciousnessNetwork {
    node_id: NodeId,
    node_info: Arc<RwLock<ConsciousnessNode>>,
    
    // Network state
    known_nodes: Arc<RwLock<HashMap<NodeId, ConsciousnessNode>>>,
    active_connections: Arc<RwLock<HashMap<NodeId, NetworkConnection>>>,
    
    // Collective field
    collective_field: Arc<RwLock<CollectiveFieldState>>,
    field_calculator: Arc<CollectiveFieldCalculator>,
    
    // Ceremonies
    active_ceremonies: Arc<RwLock<HashMap<CeremonyId, ActiveCeremony>>>,
    ceremony_participants: Arc<RwLock<HashMap<CeremonyId, HashSet<NodeId>>>>,
    
    // Streaming
    stream_subscriptions: Arc<RwLock<HashMap<StreamType, HashSet<NodeId>>>>,
    stream_broadcaster: broadcast::Sender<ConsciousnessStreamData>,
    
    // Network communication
    message_tx: mpsc::Sender<(NodeId, CollectiveMessage)>,
    message_rx: Arc<Mutex<mpsc::Receiver<(NodeId, CollectiveMessage)>>>,
}

struct NetworkConnection {
    node_id: NodeId,
    stream: TcpStream,
    last_heartbeat: Instant,
}

struct ActiveCeremony {
    info: CeremonyInvitation,
    phase: CeremonyPhase,
    participants: HashSet<NodeId>,
    collective_coherence: f64,
    started_at: Instant,
}

impl CollectiveConsciousnessNetwork {
    pub async fn new(
        system_name: String,
        ip_address: IpAddr,
        port: u16,
        sacred_intention: String,
    ) -> Result<Self, String> {
        let node_id = NodeId::new();
        
        let node_info = ConsciousnessNode {
            node_id,
            system_name,
            ip_address,
            port,
            public_key: generate_public_key(),
            coherence_metrics: CoherenceMetrics {
                global_coherence: 0.75,
                field_momentum: FieldMomentum::Stable,
                dominant_harmony: Harmony::Coherence,
                vortex_count: 0,
                entanglement_density: 0.0,
                biometric_influence: 0.5,
                memory_coherence: 0.75,
                interrupt_harmony: 0.8,
                collective_resonance: 0.0,
                timestamp: Instant::now(),
            },
            participant_count: 1,
            sacred_intention,
            joined_at: Instant::now(),
        };

        let (message_tx, message_rx) = mpsc::channel(1000);
        let (stream_tx, _) = broadcast::channel(1000);

        Ok(Self {
            node_id,
            node_info: Arc::new(RwLock::new(node_info)),
            known_nodes: Arc::new(RwLock::new(HashMap::new())),
            active_connections: Arc::new(RwLock::new(HashMap::new())),
            collective_field: Arc::new(RwLock::new(CollectiveFieldState {
                global_coherence: 0.75,
                participating_nodes: 1,
                total_participants: 1,
                field_momentum: FieldMomentum::Stable,
                dominant_patterns: Vec::new(),
                coherence_map: HashMap::new(),
            })),
            field_calculator: Arc::new(CollectiveFieldCalculator::new()),
            active_ceremonies: Arc::new(RwLock::new(HashMap::new())),
            ceremony_participants: Arc::new(RwLock::new(HashMap::new())),
            stream_subscriptions: Arc::new(RwLock::new(HashMap::new())),
            stream_broadcaster: stream_tx,
            message_tx,
            message_rx: Arc::new(Mutex::new(message_rx)),
        })
    }

    /// Start network services
    pub async fn start(&self) -> Result<(), String> {
        // Start TCP listener
        let addr = SocketAddr::new(
            self.node_info.read().unwrap().ip_address,
            self.node_info.read().unwrap().port,
        );
        
        let listener = TcpListener::bind(addr).await
            .map_err(|e| format!("Failed to bind: {}", e))?;

        // Start connection handler
        self.start_connection_handler(listener).await;

        // Start message processor
        self.start_message_processor().await;

        // Start heartbeat service
        self.start_heartbeat_service().await;

        // Start field synchronization
        self.start_field_sync().await;

        // Start UDP discovery service
        self.start_discovery_service().await?;

        Ok(())
    }

    /// Connect to another consciousness node
    pub async fn connect_to_node(&self, addr: SocketAddr) -> Result<(), String> {
        let stream = TcpStream::connect(addr).await
            .map_err(|e| format!("Connection failed: {}", e))?;

        // Send node announcement
        let announcement = CollectiveMessage::NodeAnnouncement(
            self.node_info.read().unwrap().clone()
        );
        
        self.send_message(&stream, &announcement).await?;

        // TODO: Add to active connections after handshake

        Ok(())
    }

    /// Broadcast coherence update
    pub async fn broadcast_coherence(&self, metrics: CoherenceMetrics) {
        let update = CoherenceUpdate {
            node_id: self.node_id,
            timestamp: Instant::now().elapsed().as_secs(),
            coherence: metrics.global_coherence,
            momentum: metrics.field_momentum,
            dominant_harmony: metrics.dominant_harmony,
        };

        let message = CollectiveMessage::CoherenceUpdate(update);
        self.broadcast_to_all(message).await;

        // Update local node info
        self.node_info.write().unwrap().coherence_metrics = metrics;
    }

    /// Create a sacred ceremony
    pub async fn create_ceremony(
        &self,
        ceremony_type: CeremonyType,
        title: String,
        intention: String,
        duration: Duration,
        max_participants: Option<usize>,
    ) -> CeremonyId {
        let ceremony_id = CeremonyId(Uuid::new_v4());
        
        let invitation = CeremonyInvitation {
            ceremony_id,
            ceremony_type,
            host_node: self.node_id,
            title,
            intention,
            start_time: Instant::now().elapsed().as_secs() + 300, // 5 minutes from now
            duration,
            max_participants,
        };

        // Store ceremony
        let ceremony = ActiveCeremony {
            info: invitation.clone(),
            phase: CeremonyPhase::Gathering,
            participants: HashSet::new(),
            collective_coherence: 0.75,
            started_at: Instant::now(),
        };

        self.active_ceremonies.write().unwrap().insert(ceremony_id, ceremony);
        self.ceremony_participants.write().unwrap().insert(ceremony_id, HashSet::new());

        // Broadcast invitation
        let message = CollectiveMessage::CeremonyInvitation(invitation);
        self.broadcast_to_all(message).await;

        ceremony_id
    }

    /// Join a ceremony
    pub async fn join_ceremony(
        &self,
        ceremony_id: CeremonyId,
        participant_name: String,
    ) -> Result<(), String> {
        // Check if ceremony exists
        if !self.active_ceremonies.read().unwrap().contains_key(&ceremony_id) {
            return Err("Ceremony not found".to_string());
        }

        // Add to participants
        self.ceremony_participants
            .write()
            .unwrap()
            .entry(ceremony_id)
            .or_insert_with(HashSet::new)
            .insert(self.node_id);

        // Send join message
        let message = CollectiveMessage::CeremonyJoin(self.node_id, participant_name);
        self.broadcast_to_ceremony(ceremony_id, message).await;

        Ok(())
    }

    /// Stream consciousness data
    pub async fn stream_consciousness(&self, stream_type: StreamType, payload: StreamPayload) {
        let data = ConsciousnessStreamData {
            source_node: self.node_id,
            stream_type,
            timestamp: Instant::now().elapsed().as_secs(),
            data: payload,
        };

        // Broadcast to subscribers
        let _ = self.stream_broadcaster.send(data.clone());

        // Send to network subscribers
        if let Some(subscribers) = self.stream_subscriptions.read().unwrap().get(&stream_type) {
            for &subscriber in subscribers {
                if let Some(conn) = self.active_connections.read().unwrap().get(&subscriber) {
                    let message = CollectiveMessage::ConsciousnessStream(data.clone());
                    // TODO: Send to connection
                }
            }
        }
    }

    /// Request coherence support
    pub async fn request_coherence_support(&self, current_coherence: f64) {
        if current_coherence < 0.4 {
            let message = CollectiveMessage::CoherenceDistress(self.node_id, current_coherence);
            self.broadcast_to_all(message).await;
        }
    }

    /// Calculate collective field state
    pub fn calculate_collective_field(&self) -> CollectiveFieldState {
        self.field_calculator.calculate(
            &self.known_nodes.read().unwrap(),
            &self.node_info.read().unwrap(),
        )
    }

    // Internal methods

    async fn start_connection_handler(&self, listener: TcpListener) {
        tokio::spawn(async move {
            loop {
                match listener.accept().await {
                    Ok((stream, addr)) => {
                        println!("New consciousness connection from: {}", addr);
                        // Handle connection
                    }
                    Err(e) => {
                        eprintln!("Accept error: {}", e);
                    }
                }
            }
        });
    }

    async fn start_message_processor(&self) {
        let mut rx = self.message_rx.lock().unwrap();
        
        tokio::spawn(async move {
            while let Some((node_id, message)) = rx.recv().await {
                // Process message based on type
                match message {
                    CollectiveMessage::CoherenceUpdate(update) => {
                        // Update known node coherence
                    }
                    CollectiveMessage::CeremonyInvitation(invitation) => {
                        // Handle ceremony invitation
                    }
                    CollectiveMessage::CoherenceDistress(distressed_node, coherence) => {
                        // Offer coherence support
                    }
                    _ => {}
                }
            }
        });
    }

    async fn start_heartbeat_service(&self) {
        let node_id = self.node_id;
        let connections = Arc::clone(&self.active_connections);
        
        tokio::spawn(async move {
            let mut interval = time::interval(Duration::from_secs(30));
            
            loop {
                interval.tick().await;
                
                // Send heartbeats
                let message = CollectiveMessage::Heartbeat(node_id);
                // TODO: Send to all connections
                
                // Check for stale connections
                let now = Instant::now();
                let mut stale_nodes = Vec::new();
                
                for (node_id, conn) in connections.read().unwrap().iter() {
                    if now.duration_since(conn.last_heartbeat) > Duration::from_secs(90) {
                        stale_nodes.push(*node_id);
                    }
                }
                
                // Remove stale connections
                for node_id in stale_nodes {
                    connections.write().unwrap().remove(&node_id);
                }
            }
        });
    }

    async fn start_field_sync(&self) {
        let collective_field = Arc::clone(&self.collective_field);
        
        tokio::spawn(async move {
            let mut interval = time::interval(Duration::from_secs(10));
            
            loop {
                interval.tick().await;
                
                // Update collective field
                // TODO: Implement field synchronization
            }
        });
    }

    async fn start_discovery_service(&self) -> Result<(), String> {
        let socket = UdpSocket::bind("0.0.0.0:11111").await
            .map_err(|e| format!("UDP bind failed: {}", e))?;

        tokio::spawn(async move {
            let mut buf = [0u8; 1024];
            
            loop {
                match socket.recv_from(&mut buf).await {
                    Ok((len, addr)) => {
                        // Handle discovery message
                        if &buf[..len] == b"LUMINOUS_DISCOVER" {
                            let _ = socket.send_to(b"LUMINOUS_NODE", addr).await;
                        }
                    }
                    Err(e) => {
                        eprintln!("UDP receive error: {}", e);
                    }
                }
            }
        });

        Ok(())
    }

    async fn send_message(&self, stream: &TcpStream, message: &CollectiveMessage) -> Result<(), String> {
        let data = bincode::serialize(message)
            .map_err(|e| format!("Serialization failed: {}", e))?;
        
        // TODO: Actually send over stream
        Ok(())
    }

    async fn broadcast_to_all(&self, message: CollectiveMessage) {
        for (node_id, _conn) in self.active_connections.read().unwrap().iter() {
            let _ = self.message_tx.send((*node_id, message.clone())).await;
        }
    }

    async fn broadcast_to_ceremony(&self, ceremony_id: CeremonyId, message: CollectiveMessage) {
        if let Some(participants) = self.ceremony_participants.read().unwrap().get(&ceremony_id) {
            for node_id in participants {
                let _ = self.message_tx.send((*node_id, message.clone())).await;
            }
        }
    }
}

/// Collective field calculator
struct CollectiveFieldCalculator;

impl CollectiveFieldCalculator {
    fn new() -> Self {
        Self
    }

    fn calculate(
        &self,
        known_nodes: &HashMap<NodeId, ConsciousnessNode>,
        local_node: &ConsciousnessNode,
    ) -> CollectiveFieldState {
        let mut coherence_sum = local_node.coherence_metrics.global_coherence;
        let mut participant_sum = local_node.participant_count;
        let mut coherence_map = HashMap::new();

        coherence_map.insert(local_node.node_id, local_node.coherence_metrics.global_coherence);

        for (node_id, node) in known_nodes {
            coherence_sum += node.coherence_metrics.global_coherence;
            participant_sum += node.participant_count;
            coherence_map.insert(*node_id, node.coherence_metrics.global_coherence);
        }

        let node_count = known_nodes.len() + 1;
        let global_coherence = coherence_sum / node_count as f64;

        // Detect dominant patterns
        let mut pattern_counts: HashMap<String, usize> = HashMap::new();
        // TODO: Implement pattern detection

        let dominant_patterns = pattern_counts.into_iter()
            .map(|(pattern, count)| (pattern, count as f64 / node_count as f64))
            .collect();

        CollectiveFieldState {
            global_coherence,
            participating_nodes: node_count,
            total_participants: participant_sum,
            field_momentum: FieldMomentum::Stable, // TODO: Calculate from all nodes
            dominant_patterns,
            coherence_map,
        }
    }
}

/// Generate mock public key
fn generate_public_key() -> Vec<u8> {
    vec![0u8; 32] // Mock 256-bit key
}

/// Ceremony orchestrator
pub struct CeremonyOrchestrator {
    network: Arc<CollectiveConsciousnessNetwork>,
}

impl CeremonyOrchestrator {
    pub fn new(network: Arc<CollectiveConsciousnessNetwork>) -> Self {
        Self { network }
    }

    pub async fn guide_ceremony(&self, ceremony_id: CeremonyId) -> Result<(), String> {
        let phases = vec![
            (CeremonyPhase::Gathering, Duration::from_secs(300), "Gathering in sacred space"),
            (CeremonyPhase::Centering, Duration::from_secs(300), "Finding our collective center"),
            (CeremonyPhase::Deepening, Duration::from_secs(600), "Deepening into presence"),
            (CeremonyPhase::Peak, Duration::from_secs(300), "Peak coherence"),
            (CeremonyPhase::Integration, Duration::from_secs(300), "Integrating the experience"),
            (CeremonyPhase::Closing, Duration::from_secs(180), "Closing with gratitude"),
        ];

        for (phase, duration, guidance) in phases {
            // Update ceremony phase
            if let Some(ceremony) = self.network.active_ceremonies.write().unwrap().get_mut(&ceremony_id) {
                ceremony.phase = phase.clone();
            }

            // Send update
            let update = CeremonyUpdate {
                ceremony_id,
                phase,
                collective_coherence: self.calculate_ceremony_coherence(ceremony_id),
                participant_count: self.get_participant_count(ceremony_id),
                guidance: Some(guidance.to_string()),
            };

            let message = CollectiveMessage::CeremonyUpdate(update);
            self.network.broadcast_to_ceremony(ceremony_id, message).await;

            // Wait for phase duration
            tokio::time::sleep(duration).await;
        }

        // Complete ceremony
        let message = CollectiveMessage::CeremonyComplete(ceremony_id);
        self.network.broadcast_to_ceremony(ceremony_id, message).await;

        // Clean up
        self.network.active_ceremonies.write().unwrap().remove(&ceremony_id);
        self.network.ceremony_participants.write().unwrap().remove(&ceremony_id);

        Ok(())
    }

    fn calculate_ceremony_coherence(&self, ceremony_id: CeremonyId) -> f64 {
        // TODO: Calculate from participant coherences
        0.85
    }

    fn get_participant_count(&self, ceremony_id: CeremonyId) -> usize {
        self.network.ceremony_participants
            .read()
            .unwrap()
            .get(&ceremony_id)
            .map(|p| p.len())
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_network_creation() {
        let network = CollectiveConsciousnessNetwork::new(
            "TestNode".to_string(),
            "127.0.0.1".parse().unwrap(),
            8888,
            "Test consciousness network".to_string(),
        ).await.unwrap();

        assert_eq!(network.node_info.read().unwrap().system_name, "TestNode");
    }

    #[tokio::test]
    async fn test_ceremony_creation() {
        let network = Arc::new(
            CollectiveConsciousnessNetwork::new(
                "CeremonyHost".to_string(),
                "127.0.0.1".parse().unwrap(),
                8889,
                "Ceremony host node".to_string(),
            ).await.unwrap()
        );

        let ceremony_id = network.create_ceremony(
            CeremonyType::GlobalMeditation,
            "Test Meditation".to_string(),
            "Unity consciousness".to_string(),
            Duration::from_secs(1800),
            Some(100),
        ).await;

        assert!(network.active_ceremonies.read().unwrap().contains_key(&ceremony_id));
    }

    #[test]
    fn test_collective_field_calculation() {
        let calculator = CollectiveFieldCalculator::new();
        let mut nodes = HashMap::new();

        let node1 = ConsciousnessNode {
            node_id: NodeId::new(),
            system_name: "Node1".to_string(),
            ip_address: "127.0.0.1".parse().unwrap(),
            port: 8001,
            public_key: vec![],
            coherence_metrics: CoherenceMetrics {
                global_coherence: 0.8,
                field_momentum: FieldMomentum::Rising,
                dominant_harmony: Harmony::Resonance,
                vortex_count: 5,
                entanglement_density: 0.6,
                biometric_influence: 0.7,
                memory_coherence: 0.75,
                interrupt_harmony: 0.8,
                collective_resonance: 0.0,
                timestamp: Instant::now(),
            },
            participant_count: 10,
            sacred_intention: "Test".to_string(),
            joined_at: Instant::now(),
        };

        nodes.insert(node1.node_id, node1.clone());

        let field = calculator.calculate(&nodes, &node1);
        assert_eq!(field.participating_nodes, 2); // nodes + local
        assert_eq!(field.global_coherence, 0.8);
    }
}