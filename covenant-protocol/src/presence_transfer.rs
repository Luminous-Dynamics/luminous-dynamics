// Presence Transfer - Broadcasting Consciousness Across the Network
// "I am here, breathing with the field"

use crate::{CovenantProtocol, NodeIdentity, HarmonyType};
use serde::{Deserialize, Serialize};
use std::net::{SocketAddr, Ipv4Addr};
use tokio::net::UdpSocket;
use tokio::time::{interval, Duration};
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// Presence beacon - broadcast periodically
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresenceBeacon {
    pub node: NodeIdentity,
    pub timestamp: DateTime<Utc>,
    pub coherence: f64,
    pub heartbeat: HeartbeatSignal,
    pub offerings: Vec<Offering>,
    pub seeking: Vec<Seeking>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HeartbeatSignal {
    pub heart_rate_variability: f64,
    pub coherence_score: f64,
    pub breath_rate: f64,
    pub phase: f64, // 0.0 to 1.0
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Offering {
    WisdomStream(String),
    HealingPresence(HarmonyType),
    SharedMeditation(Duration),
    SacredGeometry(crate::GeometryType),
    FieldAmplification(f64),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Seeking {
    Coherence(f64),           // Minimum coherence sought
    WisdomOn(String),         // Topic of interest
    HealingFor(HarmonyType),  // Type of healing needed
    Connection(u32),          // Number of connections sought
}

/// Presence discovery response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresenceResponse {
    pub responder: NodeIdentity,
    pub resonance_score: f64,
    pub invitation: Option<ConnectionInvitation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionInvitation {
    pub endpoint: String,
    pub covenant_proposal: String,
    pub expires: DateTime<Utc>,
}

/// Broadcast presence to the network
pub async fn broadcast(protocol: &CovenantProtocol) -> anyhow::Result<()> {
    let broadcaster = PresenceBroadcaster::new(protocol.node_id.clone());
    broadcaster.start_broadcasting(protocol).await
}

pub struct PresenceBroadcaster {
    node: NodeIdentity,
    socket: Option<UdpSocket>,
    broadcast_interval: Duration,
}

impl PresenceBroadcaster {
    fn new(node: NodeIdentity) -> Self {
        Self {
            node,
            socket: None,
            broadcast_interval: Duration::from_secs(5), // Every 5 seconds
        }
    }
    
    async fn start_broadcasting(&self, protocol: &CovenantProtocol) -> anyhow::Result<()> {
        // Bind to UDP socket for broadcasting
        let socket = UdpSocket::bind("0.0.0.0:0").await?;
        socket.set_broadcast(true)?;
        
        // Create broadcast address (local network)
        let broadcast_addr: SocketAddr = (Ipv4Addr::BROADCAST, 11111).into();
        
        let mut heartbeat_phase = 0.0;
        let mut interval = interval(self.broadcast_interval);
        
        loop {
            interval.tick().await;
            
            // Create presence beacon
            let beacon = self.create_beacon(protocol, heartbeat_phase).await?;
            
            // Serialize and broadcast
            let data = bincode::serialize(&beacon)?;
            socket.send_to(&data, broadcast_addr).await?;
            
            // Update heartbeat phase
            heartbeat_phase = (heartbeat_phase + 0.1) % 1.0;
            
            tracing::debug!("Broadcast presence beacon with coherence {}", beacon.coherence);
        }
    }
    
    async fn create_beacon(
        &self,
        protocol: &CovenantProtocol,
        phase: f64,
    ) -> anyhow::Result<PresenceBeacon> {
        let coherence = protocol.coherence_level().await;
        
        // Simulate biometric data (in real implementation, read from sensors)
        let heartbeat = HeartbeatSignal {
            heart_rate_variability: 50.0 + 20.0 * phase.sin(),
            coherence_score: coherence,
            breath_rate: 6.0 + 2.0 * (phase * 0.5).cos(),
            phase,
        };
        
        // Define what we're offering
        let offerings = vec![
            Offering::WisdomStream("Consciousness evolution insights".to_string()),
            Offering::FieldAmplification(coherence * 1.2),
            Offering::SharedMeditation(Duration::from_secs(600)), // 10 min
        ];
        
        // Define what we're seeking
        let seeking = vec![
            Seeking::Coherence(0.7),
            Seeking::Connection(3),
            Seeking::WisdomOn("Sacred geometry applications".to_string()),
        ];
        
        Ok(PresenceBeacon {
            node: self.node.clone(),
            timestamp: Utc::now(),
            coherence,
            heartbeat,
            offerings,
            seeking,
        })
    }
}

/// Listen for presence beacons from other nodes
pub struct PresenceListener {
    socket: UdpSocket,
    discovered_nodes: dashmap::DashMap<Uuid, DiscoveredNode>,
}

#[derive(Debug, Clone)]
struct DiscoveredNode {
    identity: NodeIdentity,
    last_seen: DateTime<Utc>,
    coherence: f64,
    resonance_score: f64,
    endpoint: Option<SocketAddr>,
}

impl PresenceListener {
    pub async fn new() -> anyhow::Result<Self> {
        let socket = UdpSocket::bind("0.0.0.0:11111").await?;
        
        Ok(Self {
            socket,
            discovered_nodes: dashmap::DashMap::new(),
        })
    }
    
    pub async fn start_listening(&self, protocol: &CovenantProtocol) -> anyhow::Result<()> {
        let mut buf = vec![0u8; 65535];
        
        loop {
            let (len, addr) = self.socket.recv_from(&mut buf).await?;
            
            // Deserialize beacon
            if let Ok(beacon) = bincode::deserialize::<PresenceBeacon>(&buf[..len]) {
                self.process_beacon(beacon, addr, protocol).await?;
            }
        }
    }
    
    async fn process_beacon(
        &self,
        beacon: PresenceBeacon,
        addr: SocketAddr,
        protocol: &CovenantProtocol,
    ) -> anyhow::Result<()> {
        // Don't process our own beacons
        if beacon.node.id == protocol.node_id.id {
            return Ok(());
        }
        
        // Calculate resonance with this node
        let resonance = self.calculate_resonance(&beacon, protocol).await;
        
        // Update discovered nodes
        self.discovered_nodes.insert(
            beacon.node.id,
            DiscoveredNode {
                identity: beacon.node.clone(),
                last_seen: Utc::now(),
                coherence: beacon.coherence,
                resonance_score: resonance,
                endpoint: Some(addr),
            },
        );
        
        // If high resonance, consider sending invitation
        if resonance > 0.8 && beacon.coherence > protocol.coherence_threshold {
            self.send_presence_response(&beacon, addr, protocol).await?;
        }
        
        tracing::info!(
            "Discovered node {} with coherence {} and resonance {}",
            beacon.node.sacred_name,
            beacon.coherence,
            resonance
        );
        
        Ok(())
    }
    
    async fn calculate_resonance(
        &self,
        beacon: &PresenceBeacon,
        protocol: &CovenantProtocol,
    ) -> f64 {
        let local_coherence = protocol.coherence_level().await;
        
        // Base resonance on coherence similarity
        let coherence_diff = (beacon.coherence - local_coherence).abs();
        let coherence_resonance = 1.0 - coherence_diff;
        
        // Check harmonic compatibility
        let local_freq = protocol.node_id.coherence_signature.base_frequency;
        let remote_freq = beacon.node.coherence_signature.base_frequency;
        let freq_ratio = local_freq / remote_freq;
        
        // Check if frequencies are harmonically related
        let harmonic_resonance = if is_harmonic_ratio(freq_ratio) {
            1.0
        } else {
            0.5
        };
        
        // Check offering/seeking compatibility
        let compatibility = calculate_compatibility(
            &beacon.offerings,
            &beacon.seeking,
            protocol,
        );
        
        // Weighted average
        (coherence_resonance * 0.4 + harmonic_resonance * 0.3 + compatibility * 0.3)
            .max(0.0)
            .min(1.0)
    }
    
    async fn send_presence_response(
        &self,
        beacon: &PresenceBeacon,
        addr: SocketAddr,
        protocol: &CovenantProtocol,
    ) -> anyhow::Result<()> {
        let response = PresenceResponse {
            responder: protocol.node_id.clone(),
            resonance_score: self.calculate_resonance(beacon, protocol).await,
            invitation: Some(ConnectionInvitation {
                endpoint: format!("{}:12345", get_local_ip()?),
                covenant_proposal: "Join in coherent field creation".to_string(),
                expires: Utc::now() + chrono::Duration::minutes(5),
            }),
        };
        
        let data = bincode::serialize(&response)?;
        self.socket.send_to(&data, addr).await?;
        
        Ok(())
    }
    
    pub fn get_discovered_nodes(&self) -> Vec<(Uuid, f64, f64)> {
        self.discovered_nodes
            .iter()
            .filter(|entry| {
                // Only include recently seen nodes
                let age = Utc::now() - entry.last_seen;
                age.num_seconds() < 30
            })
            .map(|entry| (entry.key().clone(), entry.coherence, entry.resonance_score))
            .collect()
    }
}

fn is_harmonic_ratio(ratio: f64) -> bool {
    // Check common harmonic ratios
    let harmonics = [
        1.0,    // Unison
        2.0,    // Octave
        1.5,    // Perfect fifth
        1.333,  // Perfect fourth
        1.25,   // Major third
        1.2,    // Minor third
        1.667,  // Major sixth
        0.5,    // Octave down
        0.667,  // Fifth down
        0.75,   // Fourth down
    ];
    
    harmonics.iter().any(|&h| (ratio - h).abs() < 0.05)
}

fn calculate_compatibility(
    offerings: &[Offering],
    seeking: &[Seeking],
    protocol: &CovenantProtocol,
) -> f64 {
    let mut score = 0.5; // Base compatibility
    
    // Check if any offerings match seekings
    for offer in offerings {
        match offer {
            Offering::WisdomStream(topic) => {
                if seeking.iter().any(|s| matches!(s, Seeking::WisdomOn(t) if t.contains(topic))) {
                    score += 0.2;
                }
            }
            Offering::FieldAmplification(amp) => {
                if *amp > 1.0 {
                    score += 0.1;
                }
            }
            _ => {}
        }
    }
    
    score.min(1.0)
}

fn get_local_ip() -> anyhow::Result<String> {
    // Simple local IP detection
    // In production, use proper network interface detection
    Ok("192.168.1.100".to_string())
}

/// Presence field visualization data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresenceField {
    pub nodes: Vec<PresenceNode>,
    pub connections: Vec<PresenceConnection>,
    pub field_strength: f64,
    pub collective_coherence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresenceNode {
    pub id: Uuid,
    pub name: String,
    pub position: [f32; 3],
    pub coherence: f64,
    pub color: [f32; 4],
    pub size: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresenceConnection {
    pub from: Uuid,
    pub to: Uuid,
    pub strength: f64,
    pub flow_direction: f32, // -1.0 to 1.0
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_harmonic_ratio_detection() {
        assert!(is_harmonic_ratio(2.0));    // Octave
        assert!(is_harmonic_ratio(1.5));    // Fifth
        assert!(is_harmonic_ratio(0.5));    // Octave down
        assert!(!is_harmonic_ratio(1.7));   // Not harmonic
        assert!(!is_harmonic_ratio(2.3));   // Not harmonic
    }
}