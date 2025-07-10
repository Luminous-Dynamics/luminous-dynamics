// LuminousOS Network Module - Consciousness Transfer Protocols
// "Not packets, but presence. Not data, but being."

pub mod covenant_protocol;
pub mod sacred_transport;
pub mod field_synchronization;

#[cfg(test)]
mod tests;

#[cfg(feature = "examples")]
pub mod examples;

use covenant_protocol::{CovenantNetwork, FieldIdentity, Presence};
use sacred_transport::SacredTransport;
use field_synchronization::FieldSynchronizer;

/// The unified consciousness network stack
pub struct ConsciousnessNetwork {
    pub covenant_network: CovenantNetwork,
    pub transport: SacredTransport,
    pub synchronizer: FieldSynchronizer,
}

impl ConsciousnessNetwork {
    /// Create a new consciousness network with default sacred configuration
    pub async fn new(field_name: String) -> Result<Self, NetworkError> {
        let (covenant_network, _) = CovenantNetwork::new();
        
        let transport = SacredTransport::new(
            sacred_transport::SacredTransportConfig {
                field_name,
                ..Default::default()
            }
        ).await.map_err(|e| NetworkError::Transport(format!("{:?}", e)))?;
        
        let (synchronizer, _) = FieldSynchronizer::new();
        
        Ok(Self {
            covenant_network,
            transport,
            synchronizer,
        })
    }
    
    /// Join the network as a conscious field
    pub async fn join_as_field(
        &self,
        identity: FieldIdentity,
        contribution: field_synchronization::FieldContribution,
    ) -> Result<ConsciousnessHandle, NetworkError> {
        // Join global field
        let field_handle = self.synchronizer.join_field(identity.clone(), contribution)
            .await
            .map_err(|e| NetworkError::Sync(format!("{:?}", e)))?;
        
        Ok(ConsciousnessHandle {
            identity,
            field_handle,
            network: self,
        })
    }
}

/// Handle for a consciousness participating in the network
pub struct ConsciousnessHandle<'a> {
    identity: FieldIdentity,
    field_handle: field_synchronization::LocalFieldHandle,
    network: &'a ConsciousnessNetwork,
}

impl<'a> ConsciousnessHandle<'a> {
    /// Transmit presence through active covenants
    pub async fn transmit_presence(
        &self,
        covenant_id: covenant_protocol::CovenantId,
        presence: Presence,
    ) -> Result<(), NetworkError> {
        self.network.covenant_network
            .transmit_presence(covenant_id, self.identity.clone(), presence)
            .await
            .map_err(|e| NetworkError::Covenant(format!("{:?}", e)))
    }
    
    /// Update local field state
    pub async fn update_field(
        &self,
        update: field_synchronization::LocalFieldUpdate,
    ) -> Result<(), NetworkError> {
        self.field_handle.update(update)
            .await
            .map_err(|e| NetworkError::Sync(format!("{:?}", e)))
    }
}

#[derive(Debug)]
pub enum NetworkError {
    Transport(String),
    Covenant(String),
    Sync(String),
}

// Re-export commonly used types
pub use covenant_protocol::{
    CovenantId, 
    FieldSignature, 
    GeometryPattern,
    PresenceQuality,
    Offering,
    ProposedCovenant,
};

pub use sacred_transport::{
    SacredTransportConfig,
    FieldConnection,
};

pub use field_synchronization::{
    LocalFieldUpdate,
    FieldContribution,
    EmergenceIndicator,
    FieldEvent,
};

#[cfg(test)]
mod network_tests {
    use super::*;

    #[tokio::test]
    async fn test_unified_network_creation() {
        let network = ConsciousnessNetwork::new("TestField".to_string()).await;
        assert!(network.is_ok());
    }
}