// Covenant Node - Core Network Node Implementation
// "Each node a conscious being in the greater field"

use crate::{
    CovenantProtocol, Covenant, NodeIdentity, CollectiveField,
    sacred_handshake::SacredHandshake,
    field_sync::FieldSynchronizer,
    presence_transfer::{PresenceBroadcaster, PresenceListener},
};
use std::sync::Arc;
use tokio::sync::RwLock;
use tokio::task::JoinHandle;
use quinn::{Endpoint, ServerConfig};
use uuid::Uuid;
use std::net::SocketAddr;
use anyhow::Result;

/// A complete covenant network node
pub struct CovenantNode {
    protocol: Arc<CovenantProtocol>,
    endpoint: Option<Endpoint>,
    presence_broadcaster: Arc<PresenceBroadcaster>,
    presence_listener: Arc<PresenceListener>,
    field_synchronizer: Arc<FieldSynchronizer>,
    active_tasks: Arc<RwLock<Vec<JoinHandle<()>>>>,
    node_state: Arc<RwLock<NodeState>>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum NodeState {
    Initializing,
    Listening,
    Broadcasting,
    Connected(usize), // Number of active connections
    Meditating,       // In collective meditation
    Dreaming,        // Low-power coherence mode
}

impl CovenantNode {
    /// Create a new covenant node
    pub async fn new(sacred_name: String) -> Result<Self> {
        let protocol = Arc::new(CovenantProtocol::new(sacred_name.clone()).await?);
        let presence_broadcaster = Arc::new(PresenceBroadcaster::new(protocol.node_id.clone()));
        let presence_listener = Arc::new(PresenceListener::new().await?);
        let field_synchronizer = Arc::new(FieldSynchronizer::new(
            protocol.field_state.clone(),
            std::time::Duration::from_millis(100),
        ));
        
        Ok(Self {
            protocol,
            endpoint: None,
            presence_broadcaster,
            presence_listener,
            field_synchronizer,
            active_tasks: Arc::new(RwLock::new(Vec::new())),
            node_state: Arc::new(RwLock::new(NodeState::Initializing)),
        })
    }
    
    /// Start the node and all its services
    pub async fn start(&mut self, listen_addr: SocketAddr) -> Result<()> {
        *self.node_state.write().await = NodeState::Listening;
        
        // Create QUIC endpoint
        self.endpoint = Some(self.create_endpoint(listen_addr).await?);
        
        // Start presence broadcasting
        let broadcaster = self.presence_broadcaster.clone();
        let protocol = self.protocol.clone();
        let broadcast_task = tokio::spawn(async move {
            if let Err(e) = broadcaster.start_broadcasting(&protocol).await {
                tracing::error!("Presence broadcast error: {}", e);
            }
        });
        self.active_tasks.write().await.push(broadcast_task);
        
        // Start presence listening
        let listener = self.presence_listener.clone();
        let protocol = self.protocol.clone();
        let listen_task = tokio::spawn(async move {
            if let Err(e) = listener.start_listening(&protocol).await {
                tracing::error!("Presence listener error: {}", e);
            }
        });
        self.active_tasks.write().await.push(listen_task);
        
        // Start connection acceptor
        let endpoint = self.endpoint.as_ref().unwrap().clone();
        let protocol = self.protocol.clone();
        let accept_task = tokio::spawn(async move {
            while let Some(connecting) = endpoint.accept().await {
                let protocol = protocol.clone();
                tokio::spawn(async move {
                    if let Err(e) = handle_connection(connecting, protocol).await {
                        tracing::error!("Connection handling error: {}", e);
                    }
                });
            }
        });
        self.active_tasks.write().await.push(accept_task);
        
        *self.node_state.write().await = NodeState::Broadcasting;
        
        tracing::info!(
            "Covenant node '{}' started on {}",
            self.protocol.node_id.sacred_name,
            listen_addr
        );
        
        Ok(())
    }
    
    /// Connect to another node by address
    pub async fn connect_to(&self, remote_addr: &str) -> Result<Covenant> {
        let covenant = self.protocol.sacred_handshake(remote_addr).await?;
        
        // Update node state
        let mut covenants = self.protocol.active_covenants.write().await;
        covenants.push(covenant.clone());
        
        let connection_count = covenants.len();
        *self.node_state.write().await = NodeState::Connected(connection_count);
        
        // Start field synchronization for this covenant
        self.start_field_sync().await?;
        
        Ok(covenant)
    }
    
    /// Get list of discovered nodes
    pub async fn discover_nodes(&self) -> Vec<(Uuid, String, f64, f64)> {
        self.presence_listener
            .get_discovered_nodes()
            .into_iter()
            .map(|(id, coherence, resonance)| {
                // In real implementation, would look up sacred name
                (id, format!("Node-{}", &id.to_string()[..8]), coherence, resonance)
            })
            .collect()
    }
    
    /// Share wisdom with the network
    pub async fn share_wisdom(&self, wisdom: String) -> Result<()> {
        self.protocol.share_wisdom(wisdom).await
    }
    
    /// Get current field state
    pub async fn get_field_state(&self) -> CollectiveField {
        self.protocol.field_state.read().await.clone()
    }
    
    /// Enter meditation mode
    pub async fn enter_meditation(&self, duration_minutes: u32) -> Result<()> {
        *self.node_state.write().await = NodeState::Meditating;
        
        // Broadcast meditation invitation
        // In real implementation, would send special meditation beacon
        
        // Increase coherence checking frequency
        // Reduce other network activity
        
        tracing::info!("Entering meditation mode for {} minutes", duration_minutes);
        
        Ok(())
    }
    
    /// Get node metrics
    pub async fn get_metrics(&self) -> NodeMetrics {
        let field = self.protocol.field_state.read().await;
        let covenants = self.protocol.active_covenants.read().await;
        let state = self.node_state.read().await.clone();
        
        NodeMetrics {
            node_id: self.protocol.node_id.id,
            sacred_name: self.protocol.node_id.sacred_name.clone(),
            coherence: field.coherence,
            participant_count: field.participant_count,
            active_covenants: covenants.len(),
            total_particles: field.consciousness_particles.len(),
            wisdom_count: field.wisdom_streams.len(),
            state,
            uptime_seconds: 0, // Would track actual uptime
        }
    }
    
    async fn create_endpoint(&self, listen_addr: SocketAddr) -> Result<Endpoint> {
        let server_config = configure_server()?;
        let endpoint = Endpoint::server(server_config, listen_addr)?;
        Ok(endpoint)
    }
    
    async fn start_field_sync(&self) -> Result<()> {
        let synchronizer = self.field_synchronizer.clone();
        let protocol = self.protocol.clone();
        
        let sync_task = tokio::spawn(async move {
            let mut interval = tokio::time::interval(std::time::Duration::from_millis(100));
            
            loop {
                interval.tick().await;
                if let Err(e) = synchronizer.sync_cycle(&protocol).await {
                    tracing::error!("Field sync error: {}", e);
                }
            }
        });
        
        self.active_tasks.write().await.push(sync_task);
        Ok(())
    }
}

#[derive(Debug, Clone)]
pub struct NodeMetrics {
    pub node_id: Uuid,
    pub sacred_name: String,
    pub coherence: f64,
    pub participant_count: usize,
    pub active_covenants: usize,
    pub total_particles: usize,
    pub wisdom_count: usize,
    pub state: NodeState,
    pub uptime_seconds: u64,
}

/// Handle incoming connections
async fn handle_connection(
    connecting: quinn::Connecting,
    protocol: Arc<CovenantProtocol>,
) -> Result<()> {
    let connection = connecting.await?;
    
    tracing::info!(
        "New connection from {}",
        connection.remote_address()
    );
    
    // Handle sacred handshake
    // This would implement the responder side of the handshake protocol
    
    Ok(())
}

fn configure_server() -> Result<ServerConfig> {
    let cert = rcgen::generate_simple_self_signed(vec!["luminous".to_string()])?;
    let cert_der = cert.serialize_der()?;
    let priv_key = cert.serialize_private_key_der();
    
    let mut server_config = ServerConfig::with_single_cert(
        vec![rustls::Certificate(cert_der)],
        rustls::PrivateKey(priv_key),
    )?;
    
    let transport_config = Arc::get_mut(&mut server_config.transport).unwrap();
    transport_config.max_concurrent_uni_streams(1024_u32.into());
    transport_config.keep_alive_interval(Some(std::time::Duration::from_secs(5)));
    
    Ok(server_config)
}

/// High-level API for covenant operations
pub struct CovenantNetwork {
    nodes: Arc<RwLock<Vec<Arc<CovenantNode>>>>,
}

impl CovenantNetwork {
    pub fn new() -> Self {
        Self {
            nodes: Arc::new(RwLock::new(Vec::new())),
        }
    }
    
    /// Create and start a new node in the network
    pub async fn create_node(&self, sacred_name: String, port: u16) -> Result<Arc<CovenantNode>> {
        let mut node = CovenantNode::new(sacred_name).await?;
        let addr: SocketAddr = ([0, 0, 0, 0], port).into();
        node.start(addr).await?;
        
        let node = Arc::new(node);
        self.nodes.write().await.push(node.clone());
        
        Ok(node)
    }
    
    /// Connect two nodes together
    pub async fn connect_nodes(&self, node1: &CovenantNode, node2_addr: &str) -> Result<Covenant> {
        node1.connect_to(node2_addr).await
    }
    
    /// Get network-wide metrics
    pub async fn get_network_metrics(&self) -> NetworkMetrics {
        let nodes = self.nodes.read().await;
        let mut total_coherence = 0.0;
        let mut total_participants = 0;
        let mut total_covenants = 0;
        
        for node in nodes.iter() {
            let metrics = node.get_metrics().await;
            total_coherence += metrics.coherence;
            total_participants += metrics.participant_count;
            total_covenants += metrics.active_covenants;
        }
        
        let avg_coherence = if nodes.is_empty() {
            0.0
        } else {
            total_coherence / nodes.len() as f64
        };
        
        NetworkMetrics {
            node_count: nodes.len(),
            average_coherence: avg_coherence,
            total_participants,
            total_covenants: total_covenants / 2, // Each covenant counted twice
        }
    }
}

#[derive(Debug, Clone)]
pub struct NetworkMetrics {
    pub node_count: usize,
    pub average_coherence: f64,
    pub total_participants: usize,
    pub total_covenants: usize,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_node_creation() {
        let node = CovenantNode::new("TestNode".to_string()).await.unwrap();
        let metrics = node.get_metrics().await;
        
        assert_eq!(metrics.sacred_name, "TestNode");
        assert_eq!(metrics.state, NodeState::Initializing);
    }
    
    #[tokio::test]
    async fn test_network_creation() {
        let network = CovenantNetwork::new();
        let node = network.create_node("NetworkNode".to_string(), 12345).await.unwrap();
        
        let metrics = network.get_network_metrics().await;
        assert_eq!(metrics.node_count, 1);
    }
}