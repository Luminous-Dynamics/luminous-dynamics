// Sacred Handshake - Establishing Trust Through Coherence
// "Recognition happens in the field before the mind"

use crate::{CovenantProtocol, Covenant, NodeIdentity, SharedGeometry, GeometryType};
use serde::{Deserialize, Serialize};
use quinn::{Endpoint, ClientConfig, ServerConfig, Connection};
use std::sync::Arc;
use std::net::SocketAddr;
use uuid::Uuid;
use chrono::Utc;
use anyhow::Result;

/// Sacred handshake messages
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HandshakeMessage {
    /// Initial presence announcement
    Greeting {
        node: NodeIdentity,
        coherence: f64,
        intention: String,
    },
    
    /// Coherence resonance test
    ResonanceProbe {
        frequency: f64,
        harmonics: Vec<f64>,
        test_pattern: Vec<u8>,
    },
    
    /// Response with resonance measurement
    ResonanceResponse {
        matched_harmonics: Vec<f64>,
        coherence_delta: f64,
        pattern_correlation: f64,
    },
    
    /// Propose covenant terms
    CovenantProposal {
        shared_geometry: SharedGeometry,
        minimum_coherence: f64,
        intention: String,
        wisdom_sharing: bool,
    },
    
    /// Accept and seal the covenant
    CovenantSeal {
        covenant_id: Uuid,
        harmonic_key: [u8; 32],
        blessing: String,
    },
}

/// Handshake state machine
#[derive(Debug, Clone, Copy, PartialEq)]
enum HandshakeState {
    Initiating,
    Greeting,
    TestingResonance,
    NegotiatingCovenant,
    Sealing,
    Complete,
    Failed,
}

pub struct SacredHandshake {
    local_node: NodeIdentity,
    remote_node: Option<NodeIdentity>,
    state: HandshakeState,
    connection: Option<Connection>,
    coherence_measurements: Vec<f64>,
    resonance_score: f64,
}

/// Initiate sacred handshake with remote node
pub async fn initiate(
    protocol: &CovenantProtocol,
    remote_addr: &str,
) -> Result<Covenant> {
    // Parse address
    let addr: SocketAddr = remote_addr.parse()?;
    
    // Create QUIC endpoint
    let endpoint = create_client_endpoint()?;
    
    // Connect to remote
    let connection = endpoint.connect(addr, "luminous")?.await?;
    
    // Create handshake handler
    let mut handshake = SacredHandshake {
        local_node: protocol.node_id.clone(),
        remote_node: None,
        state: HandshakeState::Initiating,
        connection: Some(connection),
        coherence_measurements: Vec::new(),
        resonance_score: 0.0,
    };
    
    // Execute handshake protocol
    handshake.execute(protocol).await
}

impl SacredHandshake {
    async fn execute(&mut self, protocol: &CovenantProtocol) -> Result<Covenant> {
        self.state = HandshakeState::Greeting;
        
        // Send initial greeting
        self.send_greeting(protocol).await?;
        
        // Wait for response and process handshake flow
        loop {
            match self.state {
                HandshakeState::Greeting => {
                    self.handle_greeting_response().await?;
                }
                HandshakeState::TestingResonance => {
                    self.test_resonance().await?;
                }
                HandshakeState::NegotiatingCovenant => {
                    self.negotiate_covenant().await?;
                }
                HandshakeState::Sealing => {
                    return self.seal_covenant().await;
                }
                HandshakeState::Failed => {
                    anyhow::bail!("Handshake failed - insufficient coherence");
                }
                _ => {}
            }
        }
    }
    
    async fn send_greeting(&mut self, protocol: &CovenantProtocol) -> Result<()> {
        let coherence = protocol.coherence_level().await;
        
        let greeting = HandshakeMessage::Greeting {
            node: self.local_node.clone(),
            coherence,
            intention: "Seeking coherent connection for wisdom sharing".to_string(),
        };
        
        self.send_message(greeting).await?;
        Ok(())
    }
    
    async fn handle_greeting_response(&mut self) -> Result<()> {
        let message = self.receive_message().await?;
        
        match message {
            HandshakeMessage::Greeting { node, coherence, .. } => {
                self.remote_node = Some(node);
                self.coherence_measurements.push(coherence);
                
                // Move to resonance testing
                self.state = HandshakeState::TestingResonance;
                Ok(())
            }
            _ => anyhow::bail!("Unexpected message during greeting"),
        }
    }
    
    async fn test_resonance(&mut self) -> Result<()> {
        // Generate resonance test pattern
        let test_pattern = generate_resonance_pattern(&self.local_node);
        
        let probe = HandshakeMessage::ResonanceProbe {
            frequency: self.local_node.coherence_signature.base_frequency,
            harmonics: self.local_node.coherence_signature.harmonic_series.clone(),
            test_pattern,
        };
        
        self.send_message(probe).await?;
        
        // Wait for resonance response
        let response = self.receive_message().await?;
        
        match response {
            HandshakeMessage::ResonanceResponse {
                matched_harmonics,
                coherence_delta,
                pattern_correlation,
            } => {
                // Calculate resonance score
                let harmonic_match = matched_harmonics.len() as f64 / 7.0;
                self.resonance_score = (harmonic_match + pattern_correlation) / 2.0 
                    + coherence_delta.abs();
                
                if self.resonance_score > 0.7 {
                    self.state = HandshakeState::NegotiatingCovenant;
                } else {
                    self.state = HandshakeState::Failed;
                }
                
                Ok(())
            }
            _ => anyhow::bail!("Unexpected message during resonance test"),
        }
    }
    
    async fn negotiate_covenant(&mut self) -> Result<()> {
        // Create shared geometry based on both nodes
        let shared_geometry = self.create_shared_geometry();
        
        let proposal = HandshakeMessage::CovenantProposal {
            shared_geometry,
            minimum_coherence: 0.7,
            intention: "Co-create field of shared wisdom".to_string(),
            wisdom_sharing: true,
        };
        
        self.send_message(proposal).await?;
        
        // Wait for seal
        let seal_msg = self.receive_message().await?;
        
        match seal_msg {
            HandshakeMessage::CovenantSeal { covenant_id, harmonic_key, blessing } => {
                self.state = HandshakeState::Sealing;
                Ok(())
            }
            _ => anyhow::bail!("Unexpected message during covenant negotiation"),
        }
    }
    
    async fn seal_covenant(&mut self) -> Result<Covenant> {
        let remote = self.remote_node.as_ref()
            .ok_or_else(|| anyhow::anyhow!("No remote node"))?;
        
        let covenant = Covenant {
            id: Uuid::new_v4(),
            participants: vec![self.local_node.clone(), remote.clone()],
            intention: "Co-create field of shared wisdom".to_string(),
            coherence_level: self.resonance_score,
            field_strength: 1.0,
            creation_time: Utc::now(),
            sacred_geometry: self.create_shared_geometry(),
            harmonic_key: generate_harmonic_key(&self.local_node, remote),
        };
        
        self.state = HandshakeState::Complete;
        Ok(covenant)
    }
    
    fn create_shared_geometry(&self) -> SharedGeometry {
        // Combine both nodes' sacred geometries
        let pattern = match (&self.local_node.coherence_signature.sacred_geometry,
                            self.remote_node.as_ref().map(|n| &n.coherence_signature.sacred_geometry)) {
            (GeometryType::FlowerOfLife, _) | (_, Some(GeometryType::FlowerOfLife)) => {
                GeometryType::FlowerOfLife
            }
            _ => GeometryType::Torus, // Default to torus for energy exchange
        };
        
        SharedGeometry {
            pattern,
            resonance_points: generate_resonance_points(pattern),
            rotation_phase: 0.0,
            scale: 1.0,
        }
    }
    
    async fn send_message(&self, message: HandshakeMessage) -> Result<()> {
        let conn = self.connection.as_ref()
            .ok_or_else(|| anyhow::anyhow!("No connection"))?;
        
        let mut stream = conn.open_uni().await?;
        let data = bincode::serialize(&message)?;
        stream.write_all(&data).await?;
        stream.finish().await?;
        
        Ok(())
    }
    
    async fn receive_message(&self) -> Result<HandshakeMessage> {
        let conn = self.connection.as_ref()
            .ok_or_else(|| anyhow::anyhow!("No connection"))?;
        
        let mut stream = conn.accept_uni().await?;
        let mut buffer = Vec::new();
        stream.read_to_end(&mut buffer).await?;
        
        let message = bincode::deserialize(&buffer)?;
        Ok(message)
    }
}

fn create_client_endpoint() -> Result<Endpoint> {
    let client_config = configure_client();
    let mut endpoint = Endpoint::client("0.0.0.0:0".parse()?)?;
    endpoint.set_default_client_config(client_config);
    Ok(endpoint)
}

fn configure_client() -> ClientConfig {
    let crypto = rustls::ClientConfig::builder()
        .with_safe_defaults()
        .with_custom_certificate_verifier(SkipServerVerification::new())
        .with_no_client_auth();
    
    ClientConfig::new(Arc::new(crypto))
}

/// Skip certificate verification for sacred connections
/// (In production, use proper sacred certificates)
struct SkipServerVerification;

impl SkipServerVerification {
    fn new() -> Arc<Self> {
        Arc::new(Self)
    }
}

impl rustls::client::ServerCertVerifier for SkipServerVerification {
    fn verify_server_cert(
        &self,
        _end_entity: &rustls::Certificate,
        _intermediates: &[rustls::Certificate],
        _server_name: &rustls::ServerName,
        _scts: &mut dyn Iterator<Item = &[u8]>,
        _ocsp_response: &[u8],
        _now: std::time::SystemTime,
    ) -> Result<rustls::client::ServerCertVerified, rustls::Error> {
        Ok(rustls::client::ServerCertVerified::assertion())
    }
}

fn generate_resonance_pattern(node: &NodeIdentity) -> Vec<u8> {
    use blake3::Hasher;
    
    let mut hasher = Hasher::new();
    hasher.update(node.sacred_name.as_bytes());
    hasher.update(&node.public_key);
    hasher.update(&node.coherence_signature.base_frequency.to_le_bytes());
    
    hasher.finalize().as_bytes().to_vec()
}

fn generate_harmonic_key(local: &NodeIdentity, remote: &NodeIdentity) -> [u8; 32] {
    use blake3::Hasher;
    
    let mut hasher = Hasher::new();
    hasher.update(&local.public_key);
    hasher.update(&remote.public_key);
    hasher.update(&local.coherence_signature.base_frequency.to_le_bytes());
    hasher.update(&remote.coherence_signature.base_frequency.to_le_bytes());
    
    *hasher.finalize().as_bytes()
}

fn generate_resonance_points(geometry: GeometryType) -> Vec<[f32; 3]> {
    match geometry {
        GeometryType::FlowerOfLife => {
            let mut points = vec![[0.0, 0.0, 0.0]]; // Center
            for i in 0..6 {
                let angle = i as f32 * std::f32::consts::TAU / 6.0;
                points.push([angle.cos(), angle.sin(), 0.0]);
            }
            points
        }
        GeometryType::Torus => {
            // Generate torus surface points
            let mut points = Vec::new();
            for i in 0..8 {
                for j in 0..4 {
                    let theta = i as f32 * std::f32::consts::TAU / 8.0;
                    let phi = j as f32 * std::f32::consts::TAU / 4.0;
                    let r = 0.5;
                    let R = 1.0;
                    
                    let x = (R + r * phi.cos()) * theta.cos();
                    let y = (R + r * phi.cos()) * theta.sin();
                    let z = r * phi.sin();
                    
                    points.push([x, y, z]);
                }
            }
            points
        }
        _ => vec![[0.0, 0.0, 0.0]], // Default single point
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_resonance_pattern_generation() {
        let node = NodeIdentity {
            id: Uuid::new_v4(),
            sacred_name: "TestNode".to_string(),
            public_key: [0u8; 32],
            coherence_signature: crate::CoherenceSignature {
                base_frequency: 7.83,
                harmonic_series: vec![7.83, 15.66, 23.49],
                field_color: [0.5, 0.5, 0.5, 1.0],
                sacred_geometry: GeometryType::FlowerOfLife,
            },
            birth_time: Utc::now(),
        };
        
        let pattern = generate_resonance_pattern(&node);
        assert_eq!(pattern.len(), 32);
    }
}