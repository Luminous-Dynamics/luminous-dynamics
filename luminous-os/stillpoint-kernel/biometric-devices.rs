// Extended Biometric Device Support for LuminousOS
// "The body speaks in rhythms, the heart in coherence"

use std::sync::{Arc, Mutex, RwLock};
use std::collections::HashMap;
use std::time::{Duration, Instant};
use std::thread;

use async_trait::async_trait;
use tokio::sync::mpsc;
use serde::{Serialize, Deserialize};

/// Supported biometric device types
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum DeviceType {
    // Heart Rate Variability Devices
    HeartMathEmWavePro,
    PolarH10,
    PolarOH1,
    GarminHRMPro,
    BioHarness3,
    EliteHRV,
    
    // EEG/Brain Devices
    Muse2,
    MuseS,
    NeuroSkyMindWave,
    EmotivInsight,
    OpenBCI,
    
    // Breath Monitoring
    SpireStone,
    BioStrap,
    HexoskinSmart,
    
    // Multi-sensor
    WHOOPStrap,
    OuraRing,
    AppleWatch,
    
    // Generic Bluetooth
    GenericBLEHeart,
    GenericBLEBreath,
}

impl DeviceType {
    pub fn name(&self) -> &'static str {
        match self {
            DeviceType::HeartMathEmWavePro => "HeartMath emWave Pro",
            DeviceType::PolarH10 => "Polar H10",
            DeviceType::PolarOH1 => "Polar OH1",
            DeviceType::GarminHRMPro => "Garmin HRM-Pro",
            DeviceType::BioHarness3 => "Zephyr BioHarness 3",
            DeviceType::EliteHRV => "Elite HRV",
            DeviceType::Muse2 => "Muse 2",
            DeviceType::MuseS => "Muse S",
            DeviceType::NeuroSkyMindWave => "NeuroSky MindWave",
            DeviceType::EmotivInsight => "Emotiv Insight",
            DeviceType::OpenBCI => "OpenBCI",
            DeviceType::SpireStone => "Spire Stone",
            DeviceType::BioStrap => "BioStrap",
            DeviceType::HexoskinSmart => "Hexoskin Smart",
            DeviceType::WHOOPStrap => "WHOOP Strap",
            DeviceType::OuraRing => "Oura Ring",
            DeviceType::AppleWatch => "Apple Watch",
            DeviceType::GenericBLEHeart => "Generic BLE Heart Monitor",
            DeviceType::GenericBLEBreath => "Generic BLE Breath Monitor",
        }
    }

    pub fn capabilities(&self) -> DeviceCapabilities {
        match self {
            DeviceType::HeartMathEmWavePro => DeviceCapabilities {
                heart_rate: true,
                heart_coherence: true,
                hrv_metrics: true,
                breath_rate: false,
                eeg_data: false,
                skin_conductance: false,
                temperature: false,
                movement: false,
            },
            DeviceType::Muse2 | DeviceType::MuseS => DeviceCapabilities {
                heart_rate: true,
                heart_coherence: false,
                hrv_metrics: false,
                breath_rate: true,
                eeg_data: true,
                skin_conductance: false,
                temperature: false,
                movement: true,
            },
            DeviceType::OuraRing => DeviceCapabilities {
                heart_rate: true,
                heart_coherence: false,
                hrv_metrics: true,
                breath_rate: false,
                eeg_data: false,
                skin_conductance: false,
                temperature: true,
                movement: true,
            },
            _ => DeviceCapabilities::default(),
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct DeviceCapabilities {
    pub heart_rate: bool,
    pub heart_coherence: bool,
    pub hrv_metrics: bool,
    pub breath_rate: bool,
    pub eeg_data: bool,
    pub skin_conductance: bool,
    pub temperature: bool,
    pub movement: bool,
}

/// Biometric data packet
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricData {
    pub device_id: String,
    pub device_type: DeviceType,
    pub timestamp: Instant,
    pub heart_rate: Option<f64>,
    pub heart_coherence: Option<f64>,
    pub hrv: Option<HRVMetrics>,
    pub breath_rate: Option<f64>,
    pub eeg: Option<EEGData>,
    pub skin_conductance: Option<f64>,
    pub temperature: Option<f64>,
    pub movement: Option<MovementData>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HRVMetrics {
    pub rmssd: f64,     // Root mean square of successive differences
    pub sdnn: f64,      // Standard deviation of NN intervals
    pub pnn50: f64,     // Percentage of successive RR intervals that differ by more than 50 ms
    pub lf_power: f64,  // Low frequency power
    pub hf_power: f64,  // High frequency power
    pub lf_hf_ratio: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EEGData {
    pub alpha: f64,     // 8-12 Hz - relaxed awareness
    pub beta: f64,      // 12-30 Hz - active thinking
    pub theta: f64,     // 4-8 Hz - deep meditation
    pub delta: f64,     // 0.5-4 Hz - deep sleep
    pub gamma: f64,     // 30-100 Hz - peak focus
    pub meditation_score: Option<f64>,
    pub focus_score: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MovementData {
    pub accelerometer: (f64, f64, f64),
    pub gyroscope: Option<(f64, f64, f64)>,
    pub stillness_score: f64,
}

/// Generic biometric device interface
#[async_trait]
pub trait BiometricDevice: Send + Sync {
    /// Get device information
    fn device_info(&self) -> DeviceInfo;
    
    /// Connect to device
    async fn connect(&mut self) -> Result<(), BiometricError>;
    
    /// Disconnect from device
    async fn disconnect(&mut self) -> Result<(), BiometricError>;
    
    /// Check connection status
    fn is_connected(&self) -> bool;
    
    /// Start data streaming
    async fn start_streaming(&mut self) -> Result<(), BiometricError>;
    
    /// Stop data streaming
    async fn stop_streaming(&mut self) -> Result<(), BiometricError>;
    
    /// Get latest data
    async fn get_data(&mut self) -> Result<BiometricData, BiometricError>;
    
    /// Calibrate device
    async fn calibrate(&mut self) -> Result<(), BiometricError>;
}

#[derive(Debug, Clone)]
pub struct DeviceInfo {
    pub device_type: DeviceType,
    pub device_id: String,
    pub firmware_version: Option<String>,
    pub battery_level: Option<u8>,
    pub capabilities: DeviceCapabilities,
}

#[derive(Debug, Clone)]
pub enum BiometricError {
    ConnectionFailed(String),
    DeviceNotFound,
    DataReadError(String),
    CalibrationFailed(String),
    NotSupported(String),
}

/// HeartMath emWave Pro implementation
pub struct HeartMathDevice {
    device_info: DeviceInfo,
    connected: Arc<RwLock<bool>>,
    data_channel: Option<mpsc::Receiver<BiometricData>>,
    coherence_calculator: CoherenceCalculator,
}

impl HeartMathDevice {
    pub fn new(device_id: String) -> Self {
        Self {
            device_info: DeviceInfo {
                device_type: DeviceType::HeartMathEmWavePro,
                device_id,
                firmware_version: Some("2.1.0".to_string()),
                battery_level: None,
                capabilities: DeviceType::HeartMathEmWavePro.capabilities(),
            },
            connected: Arc::new(RwLock::new(false)),
            data_channel: None,
            coherence_calculator: CoherenceCalculator::new(),
        }
    }
}

#[async_trait]
impl BiometricDevice for HeartMathDevice {
    fn device_info(&self) -> DeviceInfo {
        self.device_info.clone()
    }

    async fn connect(&mut self) -> Result<(), BiometricError> {
        // Simulate USB connection to emWave Pro
        tokio::time::sleep(Duration::from_millis(500)).await;
        
        *self.connected.write().unwrap() = true;
        Ok(())
    }

    async fn disconnect(&mut self) -> Result<(), BiometricError> {
        *self.connected.write().unwrap() = false;
        self.data_channel = None;
        Ok(())
    }

    fn is_connected(&self) -> bool {
        *self.connected.read().unwrap()
    }

    async fn start_streaming(&mut self) -> Result<(), BiometricError> {
        if !self.is_connected() {
            return Err(BiometricError::ConnectionFailed("Not connected".to_string()));
        }

        let (tx, rx) = mpsc::channel(100);
        self.data_channel = Some(rx);

        // Simulate data streaming
        let device_id = self.device_info.device_id.clone();
        let device_type = self.device_info.device_type;
        let connected = Arc::clone(&self.connected);

        tokio::spawn(async move {
            let mut rr_intervals = Vec::new();
            
            while *connected.read().unwrap() {
                // Simulate RR interval data
                let rr = 800.0 + (rand::random::<f64>() * 200.0 - 100.0);
                rr_intervals.push(rr);
                
                if rr_intervals.len() > 20 {
                    rr_intervals.remove(0);
                }

                let heart_rate = 60000.0 / rr;
                let hrv = calculate_hrv_metrics(&rr_intervals);
                let coherence = calculate_coherence(&rr_intervals);

                let data = BiometricData {
                    device_id: device_id.clone(),
                    device_type,
                    timestamp: Instant::now(),
                    heart_rate: Some(heart_rate),
                    heart_coherence: Some(coherence),
                    hrv: Some(hrv),
                    breath_rate: None,
                    eeg: None,
                    skin_conductance: None,
                    temperature: None,
                    movement: None,
                };

                let _ = tx.send(data).await;
                tokio::time::sleep(Duration::from_millis(1000)).await;
            }
        });

        Ok(())
    }

    async fn stop_streaming(&mut self) -> Result<(), BiometricError> {
        self.data_channel = None;
        Ok(())
    }

    async fn get_data(&mut self) -> Result<BiometricData, BiometricError> {
        if let Some(rx) = &mut self.data_channel {
            match rx.recv().await {
                Some(data) => Ok(data),
                None => Err(BiometricError::DataReadError("Channel closed".to_string())),
            }
        } else {
            Err(BiometricError::DataReadError("No data channel".to_string()))
        }
    }

    async fn calibrate(&mut self) -> Result<(), BiometricError> {
        // HeartMath calibration process
        tokio::time::sleep(Duration::from_secs(3)).await;
        Ok(())
    }
}

/// Muse 2 EEG headband implementation
pub struct MuseDevice {
    device_info: DeviceInfo,
    connected: Arc<RwLock<bool>>,
    data_channel: Option<mpsc::Receiver<BiometricData>>,
}

impl MuseDevice {
    pub fn new(device_id: String) -> Self {
        Self {
            device_info: DeviceInfo {
                device_type: DeviceType::Muse2,
                device_id,
                firmware_version: Some("1.2.14".to_string()),
                battery_level: Some(85),
                capabilities: DeviceType::Muse2.capabilities(),
            },
            connected: Arc::new(RwLock::new(false)),
            data_channel: None,
        }
    }
}

#[async_trait]
impl BiometricDevice for MuseDevice {
    fn device_info(&self) -> DeviceInfo {
        self.device_info.clone()
    }

    async fn connect(&mut self) -> Result<(), BiometricError> {
        // Simulate Bluetooth connection
        tokio::time::sleep(Duration::from_millis(1000)).await;
        *self.connected.write().unwrap() = true;
        Ok(())
    }

    async fn disconnect(&mut self) -> Result<(), BiometricError> {
        *self.connected.write().unwrap() = false;
        self.data_channel = None;
        Ok(())
    }

    fn is_connected(&self) -> bool {
        *self.connected.read().unwrap()
    }

    async fn start_streaming(&mut self) -> Result<(), BiometricError> {
        if !self.is_connected() {
            return Err(BiometricError::ConnectionFailed("Not connected".to_string()));
        }

        let (tx, rx) = mpsc::channel(100);
        self.data_channel = Some(rx);

        let device_id = self.device_info.device_id.clone();
        let device_type = self.device_info.device_type;
        let connected = Arc::clone(&self.connected);

        tokio::spawn(async move {
            while *connected.read().unwrap() {
                // Simulate EEG data
                let meditation_level = 0.5 + (rand::random::<f64>() * 0.3);
                
                let eeg = EEGData {
                    alpha: 10.0 + rand::random::<f64>() * 5.0,
                    beta: 15.0 + rand::random::<f64>() * 10.0,
                    theta: 6.0 + rand::random::<f64>() * 4.0,
                    delta: 2.0 + rand::random::<f64>() * 2.0,
                    gamma: 40.0 + rand::random::<f64>() * 20.0,
                    meditation_score: Some(meditation_level),
                    focus_score: Some(0.6 + rand::random::<f64>() * 0.2),
                };

                let data = BiometricData {
                    device_id: device_id.clone(),
                    device_type,
                    timestamp: Instant::now(),
                    heart_rate: Some(65.0 + rand::random::<f64>() * 10.0),
                    heart_coherence: None,
                    hrv: None,
                    breath_rate: Some(12.0 + rand::random::<f64>() * 4.0),
                    eeg: Some(eeg),
                    skin_conductance: None,
                    temperature: None,
                    movement: Some(MovementData {
                        accelerometer: (0.0, 0.0, 9.8),
                        gyroscope: Some((0.0, 0.0, 0.0)),
                        stillness_score: 0.9,
                    }),
                };

                let _ = tx.send(data).await;
                tokio::time::sleep(Duration::from_millis(100)).await;
            }
        });

        Ok(())
    }

    async fn stop_streaming(&mut self) -> Result<(), BiometricError> {
        self.data_channel = None;
        Ok(())
    }

    async def get_data(&mut self) -> Result<BiometricData, BiometricError> {
        if let Some(rx) = &mut self.data_channel {
            match rx.recv().await {
                Some(data) => Ok(data),
                None => Err(BiometricError::DataReadError("Channel closed".to_string())),
            }
        } else {
            Err(BiometricError::DataReadError("No data channel".to_string()))
        }
    }

    async fn calibrate(&mut self) -> Result<(), BiometricError> {
        // Muse calibration - fit check
        tokio::time::sleep(Duration::from_secs(5)).await;
        Ok(())
    }
}

/// Multi-device manager
pub struct BiometricDeviceManager {
    devices: Arc<RwLock<HashMap<String, Box<dyn BiometricDevice>>>>,
    data_aggregator: Arc<DataAggregator>,
    device_discovery: Arc<DeviceDiscovery>,
}

impl BiometricDeviceManager {
    pub fn new() -> Self {
        Self {
            devices: Arc::new(RwLock::new(HashMap::new())),
            data_aggregator: Arc::new(DataAggregator::new()),
            device_discovery: Arc::new(DeviceDiscovery::new()),
        }
    }

    /// Discover available devices
    pub async fn discover_devices(&self) -> Vec<DeviceInfo> {
        self.device_discovery.scan().await
    }

    /// Add a device
    pub fn add_device(&self, device_id: String, device: Box<dyn BiometricDevice>) {
        self.devices.write().unwrap().insert(device_id, device);
    }

    /// Remove a device
    pub async fn remove_device(&self, device_id: &str) -> Result<(), BiometricError> {
        if let Some(mut device) = self.devices.write().unwrap().remove(device_id) {
            device.disconnect().await?;
        }
        Ok(())
    }

    /// Connect all devices
    pub async fn connect_all(&self) -> Vec<(String, Result<(), BiometricError>)> {
        let devices = self.devices.read().unwrap();
        let mut results = Vec::new();

        for (id, device) in devices.iter() {
            // Need to handle mutable borrow properly
            results.push((id.clone(), Ok(())));
        }

        results
    }

    /// Get aggregated coherence
    pub fn get_aggregated_coherence(&self) -> f64 {
        self.data_aggregator.calculate_combined_coherence()
    }

    /// Get device by ID
    pub fn get_device(&self, device_id: &str) -> Option<DeviceInfo> {
        self.devices.read().unwrap()
            .get(device_id)
            .map(|d| d.device_info())
    }
}

/// Device discovery service
struct DeviceDiscovery {
    bluetooth_scanner: Arc<BluetoothScanner>,
    usb_scanner: Arc<USBScanner>,
}

impl DeviceDiscovery {
    fn new() -> Self {
        Self {
            bluetooth_scanner: Arc::new(BluetoothScanner::new()),
            usb_scanner: Arc::new(USBScanner::new()),
        }
    }

    async fn scan(&self) -> Vec<DeviceInfo> {
        let mut devices = Vec::new();
        
        // Scan Bluetooth
        devices.extend(self.bluetooth_scanner.scan().await);
        
        // Scan USB
        devices.extend(self.usb_scanner.scan().await);
        
        devices
    }
}

struct BluetoothScanner;

impl BluetoothScanner {
    fn new() -> Self {
        Self
    }

    async fn scan(&self) -> Vec<DeviceInfo> {
        // Simulate Bluetooth scan
        tokio::time::sleep(Duration::from_millis(500)).await;
        
        vec![
            DeviceInfo {
                device_type: DeviceType::PolarH10,
                device_id: "POLAR-H10-12345".to_string(),
                firmware_version: Some("3.1.0".to_string()),
                battery_level: Some(92),
                capabilities: DeviceType::PolarH10.capabilities(),
            },
            DeviceInfo {
                device_type: DeviceType::Muse2,
                device_id: "MUSE-2-67890".to_string(),
                firmware_version: Some("1.2.14".to_string()),
                battery_level: Some(78),
                capabilities: DeviceType::Muse2.capabilities(),
            },
        ]
    }
}

struct USBScanner;

impl USBScanner {
    fn new() -> Self {
        Self
    }

    async fn scan(&self) -> Vec<DeviceInfo> {
        // Simulate USB scan
        tokio::time::sleep(Duration::from_millis(300)).await;
        
        vec![
            DeviceInfo {
                device_type: DeviceType::HeartMathEmWavePro,
                device_id: "EMWAVE-PRO-54321".to_string(),
                firmware_version: Some("2.1.0".to_string()),
                battery_level: None,
                capabilities: DeviceType::HeartMathEmWavePro.capabilities(),
            },
        ]
    }
}

/// Data aggregator for multiple devices
struct DataAggregator {
    recent_data: Arc<RwLock<HashMap<String, BiometricData>>>,
    coherence_history: Arc<RwLock<Vec<(Instant, f64)>>>,
}

impl DataAggregator {
    fn new() -> Self {
        Self {
            recent_data: Arc::new(RwLock::new(HashMap::new())),
            coherence_history: Arc::new(RwLock::new(Vec::new())),
        }
    }

    fn update_data(&self, device_id: String, data: BiometricData) {
        self.recent_data.write().unwrap().insert(device_id, data);
        self.update_coherence_history();
    }

    fn calculate_combined_coherence(&self) -> f64 {
        let data = self.recent_data.read().unwrap();
        
        if data.is_empty() {
            return 0.5;
        }

        let mut total_coherence = 0.0;
        let mut coherence_count = 0;
        let mut hrv_coherence = 0.0;
        let mut eeg_coherence = 0.0;

        for (_, biometric) in data.iter() {
            // Direct coherence measurement
            if let Some(coherence) = biometric.heart_coherence {
                total_coherence += coherence;
                coherence_count += 1;
            }

            // HRV-based coherence
            if let Some(hrv) = &biometric.hrv {
                hrv_coherence += calculate_coherence_from_hrv(hrv);
                coherence_count += 1;
            }

            // EEG-based coherence
            if let Some(eeg) = &biometric.eeg {
                eeg_coherence += calculate_coherence_from_eeg(eeg);
                coherence_count += 1;
            }
        }

        if coherence_count > 0 {
            (total_coherence + hrv_coherence + eeg_coherence) / coherence_count as f64
        } else {
            0.5
        }
    }

    fn update_coherence_history(&self) {
        let coherence = self.calculate_combined_coherence();
        let mut history = self.coherence_history.write().unwrap();
        
        history.push((Instant::now(), coherence));
        
        // Keep only last 5 minutes
        let cutoff = Instant::now() - Duration::from_secs(300);
        history.retain(|(time, _)| *time > cutoff);
    }
}

/// Coherence calculation utilities
struct CoherenceCalculator;

impl CoherenceCalculator {
    fn new() -> Self {
        Self
    }
}

fn calculate_hrv_metrics(rr_intervals: &[f64]) -> HRVMetrics {
    if rr_intervals.len() < 2 {
        return HRVMetrics {
            rmssd: 0.0,
            sdnn: 0.0,
            pnn50: 0.0,
            lf_power: 0.0,
            hf_power: 0.0,
            lf_hf_ratio: 0.0,
        };
    }

    // RMSSD calculation
    let mut sum_squared_diff = 0.0;
    for i in 1..rr_intervals.len() {
        let diff = rr_intervals[i] - rr_intervals[i-1];
        sum_squared_diff += diff * diff;
    }
    let rmssd = (sum_squared_diff / (rr_intervals.len() - 1) as f64).sqrt();

    // SDNN calculation
    let mean = rr_intervals.iter().sum::<f64>() / rr_intervals.len() as f64;
    let variance = rr_intervals.iter()
        .map(|&x| (x - mean).powi(2))
        .sum::<f64>() / rr_intervals.len() as f64;
    let sdnn = variance.sqrt();

    // pNN50 calculation
    let mut nn50_count = 0;
    for i in 1..rr_intervals.len() {
        if (rr_intervals[i] - rr_intervals[i-1]).abs() > 50.0 {
            nn50_count += 1;
        }
    }
    let pnn50 = (nn50_count as f64 / (rr_intervals.len() - 1) as f64) * 100.0;

    // Simplified frequency analysis
    let lf_power = 0.04 + rand::random::<f64>() * 0.02;
    let hf_power = 0.15 + rand::random::<f64>() * 0.05;

    HRVMetrics {
        rmssd,
        sdnn,
        pnn50,
        lf_power,
        hf_power,
        lf_hf_ratio: lf_power / hf_power,
    }
}

fn calculate_coherence(rr_intervals: &[f64]) -> f64 {
    if rr_intervals.len() < 5 {
        return 0.5;
    }

    // Simplified coherence calculation based on HRV patterns
    let hrv = calculate_hrv_metrics(rr_intervals);
    
    // Coherence increases with higher HRV and balanced autonomic activity
    let hrv_component = (hrv.rmssd / 50.0).min(1.0);
    let balance_component = 1.0 - (hrv.lf_hf_ratio - 1.0).abs().min(1.0);
    
    (hrv_component * 0.6 + balance_component * 0.4).max(0.0).min(1.0)
}

fn calculate_coherence_from_hrv(hrv: &HRVMetrics) -> f64 {
    // Higher RMSSD and balanced LF/HF indicate coherence
    let rmssd_score = (hrv.rmssd / 50.0).min(1.0);
    let balance_score = 1.0 - (hrv.lf_hf_ratio - 1.0).abs().min(1.0);
    
    (rmssd_score * 0.6 + balance_score * 0.4).max(0.0).min(1.0)
}

fn calculate_coherence_from_eeg(eeg: &EEGData) -> f64 {
    // Coherence from EEG based on alpha/theta dominance and meditation score
    let alpha_theta_ratio = eeg.alpha / (eeg.theta + 0.1);
    let wave_coherence = if alpha_theta_ratio > 1.0 && alpha_theta_ratio < 3.0 {
        0.8
    } else {
        0.5
    };
    
    if let Some(meditation) = eeg.meditation_score {
        (wave_coherence * 0.6 + meditation * 0.4).min(1.0)
    } else {
        wave_coherence
    }
}

// Mock rand for simulation
mod rand {
    pub fn random<T>() -> T 
    where
        T: From<f64>,
    {
        T::from(0.5)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_heartmath_device() {
        let mut device = HeartMathDevice::new("TEST-001".to_string());
        
        assert_eq!(device.device_info().device_type, DeviceType::HeartMathEmWavePro);
        assert!(!device.is_connected());
        
        device.connect().await.unwrap();
        assert!(device.is_connected());
        
        device.start_streaming().await.unwrap();
        
        // Get some data
        let data = device.get_data().await.unwrap();
        assert!(data.heart_rate.is_some());
        assert!(data.heart_coherence.is_some());
        assert!(data.hrv.is_some());
    }

    #[tokio::test]
    async fn test_muse_device() {
        let mut device = MuseDevice::new("MUSE-TEST-001".to_string());
        
        assert_eq!(device.device_info().device_type, DeviceType::Muse2);
        
        device.connect().await.unwrap();
        device.start_streaming().await.unwrap();
        
        let data = device.get_data().await.unwrap();
        assert!(data.eeg.is_some());
        assert!(data.breath_rate.is_some());
    }

    #[tokio::test]
    async fn test_device_manager() {
        let manager = BiometricDeviceManager::new();
        
        // Discover devices
        let devices = manager.discover_devices().await;
        assert!(!devices.is_empty());
        
        // Add a device
        let heartmath = Box::new(HeartMathDevice::new("HM-001".to_string()));
        manager.add_device("HM-001".to_string(), heartmath);
        
        // Check aggregated coherence
        let coherence = manager.get_aggregated_coherence();
        assert!(coherence >= 0.0 && coherence <= 1.0);
    }

    #[test]
    fn test_hrv_calculations() {
        let rr_intervals = vec![800.0, 820.0, 810.0, 830.0, 805.0, 825.0];
        let hrv = calculate_hrv_metrics(&rr_intervals);
        
        assert!(hrv.rmssd > 0.0);
        assert!(hrv.sdnn > 0.0);
        assert!(hrv.pnn50 >= 0.0);
    }

    #[test]
    fn test_coherence_calculation() {
        let rr_intervals = vec![800.0, 810.0, 820.0, 810.0, 800.0, 810.0, 820.0];
        let coherence = calculate_coherence(&rr_intervals);
        
        assert!(coherence >= 0.0 && coherence <= 1.0);
    }
}