// Network module - Sacred communication protocols

mod covenant_protocol;
mod sacred_transport;
mod field_synchronization;

pub use covenant_protocol::{
    Covenant,
    CovenantId,
    CovenantNetwork,
    FieldIdentity,
    FieldSignature,
    GeometryPattern,
    PresenceQuality,
    Offering,
    PresencePacket,
    Presence,
    CovenantEvent,
    CovenantError,
    HarmonicHandshake,
    HandshakeToken,
    HandshakeState,
    CovenantProtocol,
};

pub use sacred_transport::{
    SacredTransport,
    TransportLayer,
};

pub use field_synchronization::{
    FieldSync,
    SyncEvent,
};