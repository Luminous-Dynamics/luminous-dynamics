// Hardware Integration Module
// Bridges between physical sensors and consciousness field

pub mod biometric_sensors;
pub mod breath_sensor;

pub use biometric_sensors::{
    BiometricSensor, BiometricIntegration, BiometricEvent,
    SensorType, SensorReading, SensorData, SensorError,
    HRVMetrics, BreathPhase, SignalQuality
};

pub use breath_sensor::{
    SacredBreathSensor, SacredBreathPattern, BreathWave,
    BreathAnalyzer, BreathingGuide
};