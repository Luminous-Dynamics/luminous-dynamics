// Hardware Integration Library for LuminousOS
// "Where consciousness meets silicon"

pub mod hrv_sensors;
pub mod gpu_consciousness;
pub mod distributed_consciousness;
pub mod storage_drivers;

pub use hrv_sensors::{
    HRVSensor, HRVReading, CoherenceScore,
    HeartMathDevice, MuseDevice, PolarDevice,
    BiometricEvent, BiometricStream,
};

pub use gpu_consciousness::{
    ConsciousnessGPU, FieldCompute, SacredShader,
    QuantumField, GeometryPipeline, CoherenceKernel,
};

pub use distributed_consciousness::{
    ConsciousnessNetwork, FieldProtocol, 
    CollectiveResonance, NodeDiscovery,
};

pub use storage_drivers::{
    ConsciousStorage, FileAwareness,
    QuantumFileSystem, SacredCache,
};