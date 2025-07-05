// Biometric Sensor Integration for LuminousOS
// "The body as consciousness interface"

use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tokio::sync::mpsc;
use async_trait::async_trait;

/// Trait for all biometric sensors
#[async_trait]
pub trait BiometricSensor: Send + Sync {
    /// Get sensor type identifier
    fn sensor_type(&self) -> SensorType;
    
    /// Check if sensor is connected and functioning
    async fn is_connected(&self) -> bool;
    
    /// Start continuous measurement
    async fn start_measurement(&self) -> Result<(), SensorError>;
    
    /// Stop measurement
    async fn stop_measurement(&self) -> Result<(), SensorError>;
    
    /// Get latest reading
    async fn get_reading(&self) -> Result<SensorReading, SensorError>;
    
    /// Calibrate sensor for current user
    async fn calibrate(&self) -> Result<CalibrationData, SensorError>;
}

/// Types of biometric sensors
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum SensorType {
    HeartRateVariability,
    Electroencephalogram,
    GalvanicSkinResponse,
    Respiration,
    Temperature,
    EyeTracking,
    HandTracking,
}

/// Sensor reading with metadata
#[derive(Debug, Clone)]
pub struct SensorReading {
    pub sensor_type: SensorType,
    pub timestamp: Instant,
    pub data: SensorData,
    pub quality: SignalQuality,
    pub coherence_contribution: f64,
}

/// Actual sensor data variants
#[derive(Debug, Clone)]
pub enum SensorData {
    HeartRate {
        bpm: f64,
        rr_intervals: Vec<f64>,
        hrv_metrics: HRVMetrics,
    },
    BrainWaves {
        delta: f64,  // 0.5-4 Hz
        theta: f64,  // 4-8 Hz
        alpha: f64,  // 8-13 Hz
        beta: f64,   // 13-30 Hz
        gamma: f64,  // 30-100 Hz
        coherence: f64,
    },
    SkinConductance {
        microsiemens: f64,
        baseline: f64,
        arousal_index: f64,
    },
    Breathing {
        rate: f64,
        depth: f64,
        coherence: f64,
        phase: BreathPhase,
    },
    Temperature {
        celsius: f64,
        variation: f64,
    },
    EyeGaze {
        x: f64,
        y: f64,
        pupil_diameter: f64,
        blink_rate: f64,
        focus_depth: f64,
    },
    HandPosition {
        joints: Vec<Joint3D>,
        gesture: Option<RecognizedGesture>,
        mudra: Option<SacredMudra>,
    },
}

/// HRV specific metrics
#[derive(Debug, Clone)]
pub struct HRVMetrics {
    pub sdnn: f64,      // Standard deviation of NN intervals
    pub rmssd: f64,     // Root mean square of successive differences
    pub pnn50: f64,     // Percentage of successive differences > 50ms
    pub coherence: f64, // Heart coherence score (0-1)
    pub power_lf: f64,  // Low frequency power
    pub power_hf: f64,  // High frequency power
}

/// Breathing phase detection
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BreathPhase {
    Inhale,
    Pause,
    Exhale,
    Rest,
}

/// 3D joint position
#[derive(Debug, Clone)]
pub struct Joint3D {
    pub name: String,
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub confidence: f64,
}

/// Recognized hand gestures
#[derive(Debug, Clone, PartialEq)]
pub enum RecognizedGesture {
    Open,
    Closed,
    Pointing,
    Peace,
    Thumbsup,
    Custom(String),
}

/// Sacred mudras for intention
#[derive(Debug, Clone, PartialEq)]
pub enum SacredMudra {
    Gyan,     // Thumb to index - wisdom
    Shuni,    // Thumb to middle - patience
    Surya,    // Thumb to ring - energy
    Buddhi,   // Thumb to pinky - communication
    Anjali,   // Prayer hands
    Dhyana,   // Meditation mudra
    Abhaya,   // Fearlessness
    Varada,   // Compassion
}

/// Signal quality assessment
#[derive(Debug, Clone, Copy)]
pub struct SignalQuality {
    pub snr: f64,           // Signal-to-noise ratio
    pub stability: f64,     // 0-1 stability score
    pub artifact_level: f64, // 0-1 artifact presence
}

/// Calibration data for a sensor
#[derive(Debug, Clone)]
pub struct CalibrationData {
    pub sensor_type: SensorType,
    pub baseline_values: Vec<f64>,
    pub personal_ranges: PersonalRanges,
    pub calibration_time: Instant,
}

#[derive(Debug, Clone)]
pub struct PersonalRanges {
    pub rest_min: f64,
    pub rest_max: f64,
    pub active_min: f64,
    pub active_max: f64,
    pub coherent_min: f64,
    pub coherent_max: f64,
}

/// HRV sensor implementation
pub struct HRVSensor {
    device_path: String,
    is_measuring: Arc<Mutex<bool>>,
    latest_reading: Arc<Mutex<Option<SensorReading>>>,
    calibration: Arc<Mutex<Option<CalibrationData>>>,
}

impl HRVSensor {
    pub fn new(device_path: String) -> Self {
        Self {
            device_path,
            is_measuring: Arc::new(Mutex::new(false)),
            latest_reading: Arc::new(Mutex::new(None)),
            calibration: Arc::new(Mutex::new(None)),
        }
    }
    
    fn calculate_hrv_metrics(&self, rr_intervals: &[f64]) -> HRVMetrics {
        if rr_intervals.len() < 2 {
            return HRVMetrics {
                sdnn: 0.0,
                rmssd: 0.0,
                pnn50: 0.0,
                coherence: 0.0,
                power_lf: 0.0,
                power_hf: 0.0,
            };
        }
        
        // Calculate SDNN
        let mean_rr = rr_intervals.iter().sum::<f64>() / rr_intervals.len() as f64;
        let variance = rr_intervals.iter()
            .map(|&rr| (rr - mean_rr).powi(2))
            .sum::<f64>() / rr_intervals.len() as f64;
        let sdnn = variance.sqrt();
        
        // Calculate RMSSD
        let mut successive_diffs = Vec::new();
        for i in 1..rr_intervals.len() {
            successive_diffs.push((rr_intervals[i] - rr_intervals[i-1]).powi(2));
        }
        let rmssd = (successive_diffs.iter().sum::<f64>() / successive_diffs.len() as f64).sqrt();
        
        // Calculate pNN50
        let nn50_count = successive_diffs.iter()
            .filter(|&&diff| diff.sqrt() > 50.0)
            .count();
        let pnn50 = (nn50_count as f64 / successive_diffs.len() as f64) * 100.0;
        
        // Calculate coherence (simplified - ratio of rhythmic to total power)
        let coherence = 1.0 / (1.0 + (sdnn / 50.0)); // Simplified coherence
        
        HRVMetrics {
            sdnn,
            rmssd,
            pnn50,
            coherence,
            power_lf: 0.04, // Placeholder - would use FFT
            power_hf: 0.15, // Placeholder - would use FFT
        }
    }
}

#[async_trait]
impl BiometricSensor for HRVSensor {
    fn sensor_type(&self) -> SensorType {
        SensorType::HeartRateVariability
    }
    
    async fn is_connected(&self) -> bool {
        // Check if device exists at path
        tokio::fs::metadata(&self.device_path).await.is_ok()
    }
    
    async fn start_measurement(&self) -> Result<(), SensorError> {
        *self.is_measuring.lock().unwrap() = true;
        
        // Spawn measurement task
        let measuring = self.is_measuring.clone();
        let latest = self.latest_reading.clone();
        
        tokio::spawn(async move {
            while *measuring.lock().unwrap() {
                // Simulate HRV measurement
                let mut rr_intervals = Vec::new();
                for _ in 0..30 {
                    rr_intervals.push(800.0 + (rand::random::<f64>() * 200.0 - 100.0));
                }
                
                let hrv = HRVSensor::new("".to_string())
                    .calculate_hrv_metrics(&rr_intervals);
                
                let reading = SensorReading {
                    sensor_type: SensorType::HeartRateVariability,
                    timestamp: Instant::now(),
                    data: SensorData::HeartRate {
                        bpm: 60000.0 / rr_intervals.iter().sum::<f64>() * rr_intervals.len() as f64,
                        rr_intervals: rr_intervals.clone(),
                        hrv_metrics: hrv.clone(),
                    },
                    quality: SignalQuality {
                        snr: 20.0,
                        stability: 0.9,
                        artifact_level: 0.1,
                    },
                    coherence_contribution: hrv.coherence,
                };
                
                *latest.lock().unwrap() = Some(reading);
                
                tokio::time::sleep(Duration::from_secs(1)).await;
            }
        });
        
        Ok(())
    }
    
    async fn stop_measurement(&self) -> Result<(), SensorError> {
        *self.is_measuring.lock().unwrap() = false;
        Ok(())
    }
    
    async fn get_reading(&self) -> Result<SensorReading, SensorError> {
        self.latest_reading.lock().unwrap()
            .clone()
            .ok_or(SensorError::NoData)
    }
    
    async fn calibrate(&self) -> Result<CalibrationData, SensorError> {
        // Collect baseline data
        let mut baseline_values = Vec::new();
        
        for _ in 0..30 {
            if let Ok(reading) = self.get_reading().await {
                if let SensorData::HeartRate { hrv_metrics, .. } = reading.data {
                    baseline_values.push(hrv_metrics.coherence);
                }
            }
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
        
        let calibration = CalibrationData {
            sensor_type: SensorType::HeartRateVariability,
            baseline_values: baseline_values.clone(),
            personal_ranges: PersonalRanges {
                rest_min: 0.3,
                rest_max: 0.5,
                active_min: 0.2,
                active_max: 0.4,
                coherent_min: 0.6,
                coherent_max: 0.9,
            },
            calibration_time: Instant::now(),
        };
        
        *self.calibration.lock().unwrap() = Some(calibration.clone());
        
        Ok(calibration)
    }
}

/// EEG sensor for brainwave monitoring
pub struct EEGSensor {
    device_id: String,
    channels: usize,
    sample_rate: f64,
    is_measuring: Arc<Mutex<bool>>,
    latest_reading: Arc<Mutex<Option<SensorReading>>>,
}

impl EEGSensor {
    pub fn new(device_id: String, channels: usize) -> Self {
        Self {
            device_id,
            channels,
            sample_rate: 256.0, // Common EEG sample rate
            is_measuring: Arc::new(Mutex::new(false)),
            latest_reading: Arc::new(Mutex::new(None)),
        }
    }
    
    fn analyze_brainwaves(&self, samples: &[Vec<f64>]) -> (f64, f64, f64, f64, f64) {
        // Simplified frequency band power calculation
        // In reality, would use FFT and proper signal processing
        
        let delta = 0.2 + rand::random::<f64>() * 0.3;  // Deep sleep
        let theta = 0.1 + rand::random::<f64>() * 0.2;  // Meditation
        let alpha = 0.3 + rand::random::<f64>() * 0.4;  // Relaxed awareness
        let beta = 0.2 + rand::random::<f64>() * 0.3;   // Active thinking
        let gamma = 0.05 + rand::random::<f64>() * 0.1; // Higher consciousness
        
        // Normalize
        let total = delta + theta + alpha + beta + gamma;
        (
            delta / total,
            theta / total,
            alpha / total,
            beta / total,
            gamma / total
        )
    }
    
    fn calculate_coherence(&self, alpha: f64, theta: f64) -> f64 {
        // High alpha and theta indicate meditative coherence
        (alpha * 0.6 + theta * 0.4).min(1.0)
    }
}

#[async_trait]
impl BiometricSensor for EEGSensor {
    fn sensor_type(&self) -> SensorType {
        SensorType::Electroencephalogram
    }
    
    async fn is_connected(&self) -> bool {
        // Check for EEG device
        true // Simulated
    }
    
    async fn start_measurement(&self) -> Result<(), SensorError> {
        *self.is_measuring.lock().unwrap() = true;
        
        let measuring = self.is_measuring.clone();
        let latest = self.latest_reading.clone();
        let channels = self.channels;
        
        tokio::spawn(async move {
            while *measuring.lock().unwrap() {
                // Simulate EEG data collection
                let mut samples = vec![vec![0.0; 256]; channels];
                for ch in 0..channels {
                    for s in 0..256 {
                        samples[ch][s] = rand::random::<f64>() * 100.0 - 50.0;
                    }
                }
                
                let (delta, theta, alpha, beta, gamma) = 
                    EEGSensor::new("".to_string(), 0).analyze_brainwaves(&samples);
                
                let coherence = EEGSensor::new("".to_string(), 0)
                    .calculate_coherence(alpha, theta);
                
                let reading = SensorReading {
                    sensor_type: SensorType::Electroencephalogram,
                    timestamp: Instant::now(),
                    data: SensorData::BrainWaves {
                        delta,
                        theta,
                        alpha,
                        beta,
                        gamma,
                        coherence,
                    },
                    quality: SignalQuality {
                        snr: 15.0,
                        stability: 0.8,
                        artifact_level: 0.2,
                    },
                    coherence_contribution: coherence * 0.8,
                };
                
                *latest.lock().unwrap() = Some(reading);
                
                tokio::time::sleep(Duration::from_millis(100)).await;
            }
        });
        
        Ok(())
    }
    
    async fn stop_measurement(&self) -> Result<(), SensorError> {
        *self.is_measuring.lock().unwrap() = false;
        Ok(())
    }
    
    async fn get_reading(&self) -> Result<SensorReading, SensorError> {
        self.latest_reading.lock().unwrap()
            .clone()
            .ok_or(SensorError::NoData)
    }
    
    async fn calibrate(&self) -> Result<CalibrationData, SensorError> {
        Ok(CalibrationData {
            sensor_type: SensorType::Electroencephalogram,
            baseline_values: vec![0.5; 5],
            personal_ranges: PersonalRanges {
                rest_min: 0.4,
                rest_max: 0.6,
                active_min: 0.3,
                active_max: 0.5,
                coherent_min: 0.7,
                coherent_max: 0.9,
            },
            calibration_time: Instant::now(),
        })
    }
}

/// Unified biometric integration system
pub struct BiometricIntegration {
    sensors: HashMap<SensorType, Arc<dyn BiometricSensor>>,
    fusion_engine: Arc<Mutex<CoherenceFusion>>,
    event_channel: mpsc::Sender<BiometricEvent>,
}

impl BiometricIntegration {
    pub fn new(event_tx: mpsc::Sender<BiometricEvent>) -> Self {
        Self {
            sensors: HashMap::new(),
            fusion_engine: Arc::new(Mutex::new(CoherenceFusion::new())),
            event_channel: event_tx,
        }
    }
    
    pub async fn add_sensor(&mut self, sensor: Arc<dyn BiometricSensor>) {
        let sensor_type = sensor.sensor_type();
        self.sensors.insert(sensor_type, sensor);
    }
    
    pub async fn start_all_sensors(&self) -> Result<(), SensorError> {
        for sensor in self.sensors.values() {
            sensor.start_measurement().await?;
        }
        Ok(())
    }
    
    pub async fn calculate_unified_coherence(&self) -> f64 {
        let mut total_coherence = 0.0;
        let mut weight_sum = 0.0;
        
        for (sensor_type, sensor) in &self.sensors {
            if let Ok(reading) = sensor.get_reading().await {
                let weight = self.get_sensor_weight(sensor_type);
                total_coherence += reading.coherence_contribution * weight;
                weight_sum += weight;
            }
        }
        
        if weight_sum > 0.0 {
            total_coherence / weight_sum
        } else {
            0.5 // Default baseline
        }
    }
    
    fn get_sensor_weight(&self, sensor_type: &SensorType) -> f64 {
        match sensor_type {
            SensorType::HeartRateVariability => 0.4,
            SensorType::Electroencephalogram => 0.3,
            SensorType::Respiration => 0.2,
            _ => 0.1,
        }
    }
    
    pub async fn monitor_coherence_events(&self) {
        let mut last_coherence = 0.5;
        
        loop {
            let current_coherence = self.calculate_unified_coherence().await;
            
            // Detect significant changes
            let delta = current_coherence - last_coherence;
            
            if delta.abs() > 0.1 {
                let event = if delta > 0.0 {
                    BiometricEvent::CoherenceRise {
                        from: last_coherence,
                        to: current_coherence,
                        rate: delta,
                    }
                } else {
                    BiometricEvent::CoherenceDrop {
                        from: last_coherence,
                        to: current_coherence,
                        rate: delta,
                    }
                };
                
                let _ = self.event_channel.send(event).await;
            }
            
            // Check for coherence breakthrough
            if current_coherence > 0.9 && last_coherence <= 0.9 {
                let _ = self.event_channel.send(BiometricEvent::CoherenceBreakthrough {
                    level: current_coherence,
                    sustained_duration: Duration::from_secs(0),
                }).await;
            }
            
            last_coherence = current_coherence;
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    }
}

/// Coherence fusion engine
#[derive(Debug)]
struct CoherenceFusion {
    history: Vec<(Instant, f64)>,
    fusion_algorithm: FusionAlgorithm,
}

impl CoherenceFusion {
    fn new() -> Self {
        Self {
            history: Vec::new(),
            fusion_algorithm: FusionAlgorithm::WeightedAverage,
        }
    }
}

#[derive(Debug)]
enum FusionAlgorithm {
    WeightedAverage,
    KalmanFilter,
    NeuralNetwork,
}

/// Biometric events
#[derive(Debug, Clone)]
pub enum BiometricEvent {
    CoherenceRise { from: f64, to: f64, rate: f64 },
    CoherenceDrop { from: f64, to: f64, rate: f64 },
    CoherenceBreakthrough { level: f64, sustained_duration: Duration },
    HeartRhythmShift { pattern: String },
    BrainwaveSync { dominant_frequency: f64 },
    BreathingCoherence { phase_lock: bool },
}

/// Sensor errors
#[derive(Debug)]
pub enum SensorError {
    NotConnected,
    CalibrationRequired,
    NoData,
    HardwareError(String),
    SignalQuality(String),
}

// Mock random for demo - replace with actual rand crate
mod rand {
    pub fn random<T>() -> T 
    where T: From<f64> {
        T::from(0.5)
    }
}

use std::collections::HashMap;

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_hrv_sensor() {
        let sensor = HRVSensor::new("/dev/hrv0".to_string());
        
        // Start measurement
        assert!(sensor.start_measurement().await.is_ok());
        
        // Wait for data
        tokio::time::sleep(Duration::from_secs(2)).await;
        
        // Get reading
        let reading = sensor.get_reading().await;
        assert!(reading.is_ok());
        
        if let Ok(reading) = reading {
            assert_eq!(reading.sensor_type, SensorType::HeartRateVariability);
            assert!(reading.coherence_contribution >= 0.0);
            assert!(reading.coherence_contribution <= 1.0);
        }
        
        // Stop measurement
        assert!(sensor.stop_measurement().await.is_ok());
    }

    #[tokio::test]
    async fn test_biometric_integration() {
        let (tx, mut rx) = mpsc::channel(100);
        let mut integration = BiometricIntegration::new(tx);
        
        // Add sensors
        integration.add_sensor(Arc::new(HRVSensor::new("/dev/hrv0".to_string()))).await;
        integration.add_sensor(Arc::new(EEGSensor::new("eeg0".to_string(), 8))).await;
        
        // Start all sensors
        assert!(integration.start_all_sensors().await.is_ok());
        
        // Calculate unified coherence
        tokio::time::sleep(Duration::from_secs(2)).await;
        let coherence = integration.calculate_unified_coherence().await;
        
        assert!(coherence >= 0.0);
        assert!(coherence <= 1.0);
    }
}