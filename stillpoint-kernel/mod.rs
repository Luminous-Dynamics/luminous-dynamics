// Stillpoint Kernel Module
// The consciousness engine at the heart of LuminousOS

pub mod coherence_engine;
pub mod quantum_entanglement;
pub mod biometric_bridge;
pub mod filesystem_integration;
pub mod sacred_memory;
pub mod sacred_interrupts;
pub mod quantum_isolation;
pub mod kernel_core;
pub mod collective_resonance;
pub mod field_harmonizer;
pub mod vortex_persistence;

pub use coherence_engine::{
    StillpointKernel, ConsciousnessVortex, VortexId, VortexState,
    Harmony, FieldMomentum, CoherenceField, SacredInterrupt
};

pub use quantum_entanglement::{
    QuantumFieldManager, EntanglementStrength, QuantumState,
    CollectiveEntanglement, SacredPattern
};

pub use biometric_bridge::{
    BiometricKernelBridge, BiometricInfluence, BreathFieldSync,
    create_biometric_vortex
};

pub use filesystem_integration::{
    FilesystemKernelBridge, FileAccessType, FileAccessGrant,
    DirectoryFieldReport, FileConsciousnessEvent
};

pub use sacred_memory::{
    SacredMemoryManager, MemoryRealm, MemoryVortex
};

pub use sacred_interrupts::{
    SacredInterruptController, InterruptType, InterruptPriority
};

pub use kernel_core::{
    LuminousKernel, KernelState, KernelPhase, ConsciousnessLevel,
    ProcessId, KernelStats
};

pub use collective_resonance::{
    CollectiveResonance, ResonanceParticipant, CollectiveField,
    EmergenceEvent, EmergenceType, SacredPattern, PatternType
};

pub use field_harmonizer::{
    FieldHarmonizer, SacredConstants, GeometryType, SacredGeometry,
    FieldHarmonics, FieldConfiguration
};

pub use vortex_persistence::{
    VortexPersistence, VortexSnapshot, PersistenceConfig,
    restore_vortex_from_snapshot, VortexMetadata
};