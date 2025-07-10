// HRV Sensor Integration - Real biometric consciousness
// "The heart knows before the mind"

use anyhow::{Result, Context};
use serde::{Deserialize, Serialize};
use serialport::{SerialPort, SerialPortType};
use hidapi::{HidApi, HidDevice};
use btleplug::api::{Central, Manager as _, Peripheral, ScanFilter};
use btleplug::platform::{Manager, Peripheral as PlatformPeripheral};
use std::sync::Arc;
use tokio::sync::{mpsc, RwLock};
use tokio::time::{interval, Duration};
use std::collections::VecDeque;

/// Supported HRV sensor types
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SensorType {
    HeartMath,
    Muse,
    Polar,
    EmotivEpoc,
    Generic,
}

/// HRV sensor trait
#[async_trait::async_trait]
pub trait HRVSensor: Send + Sync {
    async fn connect(&mut self) -> Result<()>;
    async fn disconnect(&mut self) -> Result<()>;
    async fn start_streaming(&mut self) -> Result<BiometricStream>;
    async fn get_current_reading(&self) -> Result<HRVReading>;
    fn sensor_type(&self) -> SensorType;
    fn is_connected(&self) -> bool;
}

/// HRV reading data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HRVReading {
    pub timestamp: u64,
    pub heart_rate: f32,
    pub rr_intervals: Vec<u32>, // Inter-beat intervals in ms
    pub coherence_score: CoherenceScore,
    pub raw_signal: Option<Vec<f32>>,
}

/// Coherence score with detailed metrics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoherenceScore {
    pub overall: f32,       // 0.0 to 1.0
    pub achievement: f32,   // Accumulated coherence
    pub current_level: CoherenceLevel,
    pub power_spectrum: PowerSpectrum,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum CoherenceLevel {
    Low,
    Medium,
    High,
    VeryHigh,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PowerSpectrum {
    pub vlf: f32,  // Very Low Frequency (0.003-0.04 Hz)
    pub lf: f32,   // Low Frequency (0.04-0.15 Hz)
    pub hf: f32,   // High Frequency (0.15-0.4 Hz)
    pub peak_frequency: f32,
}

/// Biometric event types
#[derive(Debug, Clone)]
pub enum BiometricEvent {
    HeartBeat(u64),           // Timestamp
    CoherenceChange(f32),     // New coherence
    BreathCycle(BreathPhase),
    EmergenceDetected,
}

#[derive(Debug, Clone, Copy)]
pub enum BreathPhase {
    Inhale,
    Hold,
    Exhale,
    Pause,
}

/// Stream of biometric events
pub type BiometricStream = mpsc::Receiver<BiometricEvent>;

/// HeartMath emWave device
pub struct HeartMathDevice {
    device: Option<HidDevice>,
    connected: bool,
    event_tx: Option<mpsc::Sender<BiometricEvent>>,
    ibi_buffer: VecDeque<u32>,
}

impl HeartMathDevice {
    pub fn new() -> Self {
        Self {
            device: None,
            connected: false,
            event_tx: None,
            ibi_buffer: VecDeque::with_capacity(300),
        }
    }
    
    fn process_heartmath_packet(&mut self, data: &[u8]) -> Result<()> {
        // HeartMath protocol parsing
        if data.len() < 4 {
            return Ok(());
        }
        
        match data[0] {
            0x00 => {
                // IBI packet
                let ibi = ((data[1] as u32) << 8) | (data[2] as u32);
                self.ibi_buffer.push_back(ibi);
                
                if self.ibi_buffer.len() > 300 {
                    self.ibi_buffer.pop_front();
                }
                
                // Send heartbeat event
                if let Some(tx) = &self.event_tx {
                    let timestamp = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)?
                        .as_millis() as u64;
                    
                    let _ = tx.try_send(BiometricEvent::HeartBeat(timestamp));
                }
            }
            0x01 => {
                // Status packet
                // Process device status
            }
            _ => {}
        }
        
        Ok(())
    }
    
    fn calculate_coherence(&self) -> CoherenceScore {
        if self.ibi_buffer.len() < 30 {
            return CoherenceScore {
                overall: 0.0,
                achievement: 0.0,
                current_level: CoherenceLevel::Low,
                power_spectrum: PowerSpectrum {
                    vlf: 0.0,
                    lf: 0.0,
                    hf: 0.0,
                    peak_frequency: 0.0,
                },
            };
        }
        
        // Calculate HRV metrics
        let hrv_metrics = calculate_hrv_metrics(&self.ibi_buffer);
        
        // Calculate power spectrum
        let power_spectrum = calculate_power_spectrum(&self.ibi_buffer);
        
        // HeartMath coherence algorithm
        let coherence = calculate_heartmath_coherence(&power_spectrum);
        
        CoherenceScore {
            overall: coherence,
            achievement: coherence * self.ibi_buffer.len() as f32 / 300.0,
            current_level: match coherence {
                c if c > 0.8 => CoherenceLevel::VeryHigh,
                c if c > 0.6 => CoherenceLevel::High,
                c if c > 0.4 => CoherenceLevel::Medium,
                _ => CoherenceLevel::Low,
            },
            power_spectrum,
        }
    }
}

#[async_trait::async_trait]
impl HRVSensor for HeartMathDevice {
    async fn connect(&mut self) -> Result<()> {
        let api = HidApi::new()?;
        
        // HeartMath vendor ID and product IDs
        const HEARTMATH_VID: u16 = 0x1466;
        const EMWAVE_PRO_PID: u16 = 0x0011;
        const EMWAVE2_PID: u16 = 0x0012;
        
        // Try to find device
        for device_info in api.device_list() {
            if device_info.vendor_id() == HEARTMATH_VID &&
               (device_info.product_id() == EMWAVE_PRO_PID || 
                device_info.product_id() == EMWAVE2_PID) {
                
                self.device = Some(device_info.open_device(&api)?);
                self.connected = true;
                
                // Set non-blocking mode
                if let Some(device) = &self.device {
                    device.set_blocking_mode(false)?;
                }
                
                return Ok(());
            }
        }
        
        anyhow::bail!("HeartMath device not found")
    }
    
    async fn disconnect(&mut self) -> Result<()> {
        self.device = None;
        self.connected = false;
        Ok(())
    }
    
    async fn start_streaming(&mut self) -> Result<BiometricStream> {
        let (tx, rx) = mpsc::channel(100);
        self.event_tx = Some(tx.clone());
        
        let device = self.device.as_ref()
            .ok_or_else(|| anyhow::anyhow!("Device not connected"))?;
        
        // Start reading thread
        let device_clone = device.try_clone()?;
        tokio::spawn(async move {
            let mut buffer = [0u8; 64];
            let mut ticker = interval(Duration::from_millis(10));
            
            loop {
                ticker.tick().await;
                
                match device_clone.read(&mut buffer) {
                    Ok(size) if size > 0 => {
                        // Process packet
                        // In real implementation, would parse HeartMath protocol
                    }
                    _ => {}
                }
            }
        });
        
        Ok(rx)
    }
    
    async fn get_current_reading(&self) -> Result<HRVReading> {
        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)?
            .as_millis() as u64;
        
        let heart_rate = if !self.ibi_buffer.is_empty() {
            let avg_ibi: u32 = self.ibi_buffer.iter().sum::<u32>() / self.ibi_buffer.len() as u32;
            60000.0 / avg_ibi as f32
        } else {
            70.0
        };
        
        Ok(HRVReading {
            timestamp,
            heart_rate,
            rr_intervals: self.ibi_buffer.iter().cloned().collect(),
            coherence_score: self.calculate_coherence(),
            raw_signal: None,
        })
    }
    
    fn sensor_type(&self) -> SensorType {
        SensorType::HeartMath
    }
    
    fn is_connected(&self) -> bool {
        self.connected
    }
}

/// Muse headband device (EEG + PPG)
pub struct MuseDevice {
    peripheral: Option<Arc<PlatformPeripheral>>,
    connected: bool,
    event_tx: Option<mpsc::Sender<BiometricEvent>>,
}

impl MuseDevice {
    pub async fn new() -> Result<Self> {
        Ok(Self {
            peripheral: None,
            connected: false,
            event_tx: None,
        })
    }
    
    async fn find_muse_device() -> Result<PlatformPeripheral> {
        let manager = Manager::new().await?;
        let adapters = manager.adapters().await?;
        
        if adapters.is_empty() {
            anyhow::bail!("No Bluetooth adapters found");
        }
        
        let adapter = &adapters[0];
        adapter.start_scan(ScanFilter::default()).await?;
        
        tokio::time::sleep(Duration::from_secs(5)).await;
        
        let peripherals = adapter.peripherals().await?;
        
        for peripheral in peripherals {
            if let Ok(Some(props)) = peripheral.properties().await {
                if let Some(name) = props.local_name {
                    if name.contains("Muse") {
                        adapter.stop_scan().await?;
                        return Ok(peripheral);
                    }
                }
            }
        }
        
        adapter.stop_scan().await?;
        anyhow::bail!("Muse device not found")
    }
}

#[async_trait::async_trait]
impl HRVSensor for MuseDevice {
    async fn connect(&mut self) -> Result<()> {
        let peripheral = Self::find_muse_device().await?;
        peripheral.connect().await?;
        
        self.peripheral = Some(Arc::new(peripheral));
        self.connected = true;
        
        Ok(())
    }
    
    async fn disconnect(&mut self) -> Result<()> {
        if let Some(peripheral) = &self.peripheral {
            peripheral.disconnect().await?;
        }
        
        self.peripheral = None;
        self.connected = false;
        Ok(())
    }
    
    async fn start_streaming(&mut self) -> Result<BiometricStream> {
        let (tx, rx) = mpsc::channel(100);
        self.event_tx = Some(tx.clone());
        
        // In real implementation, would subscribe to Muse characteristics
        // and parse PPG data for HRV
        
        Ok(rx)
    }
    
    async fn get_current_reading(&self) -> Result<HRVReading> {
        // Placeholder - would read from Muse PPG sensor
        Ok(HRVReading {
            timestamp: 0,
            heart_rate: 65.0,
            rr_intervals: vec![],
            coherence_score: CoherenceScore {
                overall: 0.7,
                achievement: 0.5,
                current_level: CoherenceLevel::High,
                power_spectrum: PowerSpectrum {
                    vlf: 0.1,
                    lf: 0.3,
                    hf: 0.6,
                    peak_frequency: 0.1,
                },
            },
            raw_signal: None,
        })
    }
    
    fn sensor_type(&self) -> SensorType {
        SensorType::Muse
    }
    
    fn is_connected(&self) -> bool {
        self.connected
    }
}

/// Polar H10 heart rate sensor
pub struct PolarDevice {
    peripheral: Option<Arc<PlatformPeripheral>>,
    connected: bool,
    event_tx: Option<mpsc::Sender<BiometricEvent>>,
    ibi_buffer: VecDeque<u32>,
}

impl PolarDevice {
    pub async fn new() -> Result<Self> {
        Ok(Self {
            peripheral: None,
            connected: false,
            event_tx: None,
            ibi_buffer: VecDeque::with_capacity(300),
        })
    }
}

// HRV calculation functions
fn calculate_hrv_metrics(ibi_buffer: &VecDeque<u32>) -> HRVMetrics {
    let ibis: Vec<f32> = ibi_buffer.iter().map(|&x| x as f32).collect();
    
    // RMSSD (Root Mean Square of Successive Differences)
    let mut sum_squares = 0.0;
    for i in 1..ibis.len() {
        let diff = ibis[i] - ibis[i-1];
        sum_squares += diff * diff;
    }
    let rmssd = (sum_squares / (ibis.len() - 1) as f32).sqrt();
    
    // SDNN (Standard Deviation of NN intervals)
    let mean = ibis.iter().sum::<f32>() / ibis.len() as f32;
    let variance = ibis.iter().map(|&x| (x - mean).powi(2)).sum::<f32>() / ibis.len() as f32;
    let sdnn = variance.sqrt();
    
    // pNN50 (percentage of successive differences > 50ms)
    let mut nn50_count = 0;
    for i in 1..ibis.len() {
        if (ibis[i] - ibis[i-1]).abs() > 50.0 {
            nn50_count += 1;
        }
    }
    let pnn50 = (nn50_count as f32 / (ibis.len() - 1) as f32) * 100.0;
    
    HRVMetrics { rmssd, sdnn, pnn50 }
}

fn calculate_power_spectrum(ibi_buffer: &VecDeque<u32>) -> PowerSpectrum {
    use rustfft::{FftPlanner, num_complex::Complex};
    
    // Convert to evenly sampled signal (4Hz)
    let resampled = resample_ibi_to_even(ibi_buffer, 4.0);
    
    // Apply FFT
    let mut planner = FftPlanner::new();
    let fft = planner.plan_fft_forward(resampled.len());
    
    let mut buffer: Vec<Complex<f32>> = resampled.iter()
        .map(|&x| Complex::new(x, 0.0))
        .collect();
    
    fft.process(&mut buffer);
    
    // Calculate power spectral density
    let psd: Vec<f32> = buffer.iter()
        .map(|c| (c.re * c.re + c.im * c.im) / buffer.len() as f32)
        .collect();
    
    // Frequency bins
    let freq_resolution = 4.0 / buffer.len() as f32;
    
    // Integrate power in frequency bands
    let mut vlf = 0.0;
    let mut lf = 0.0;
    let mut hf = 0.0;
    let mut peak_freq = 0.0;
    let mut peak_power = 0.0;
    
    for (i, &power) in psd.iter().enumerate() {
        let freq = i as f32 * freq_resolution;
        
        if freq >= 0.003 && freq < 0.04 {
            vlf += power;
        } else if freq >= 0.04 && freq < 0.15 {
            lf += power;
        } else if freq >= 0.15 && freq < 0.4 {
            hf += power;
        }
        
        if power > peak_power && freq > 0.04 && freq < 0.15 {
            peak_power = power;
            peak_freq = freq;
        }
    }
    
    PowerSpectrum {
        vlf,
        lf,
        hf,
        peak_frequency: peak_freq,
    }
}

fn calculate_heartmath_coherence(spectrum: &PowerSpectrum) -> f32 {
    // HeartMath coherence algorithm
    // Peak around 0.1 Hz indicates high coherence
    
    let coherence_band_power = if spectrum.peak_frequency > 0.05 && spectrum.peak_frequency < 0.15 {
        spectrum.lf / (spectrum.vlf + spectrum.lf + spectrum.hf)
    } else {
        0.0
    };
    
    // Additional coherence factors
    let peak_prominence = if spectrum.peak_frequency > 0.0 {
        1.0 - (spectrum.peak_frequency - 0.1).abs() / 0.1
    } else {
        0.0
    };
    
    (coherence_band_power * 0.7 + peak_prominence * 0.3).min(1.0)
}

fn resample_ibi_to_even(ibi_buffer: &VecDeque<u32>, sample_rate: f32) -> Vec<f32> {
    // Convert IBI to evenly sampled HRV signal
    let mut time_series = Vec::new();
    let mut current_time = 0.0;
    
    for &ibi in ibi_buffer {
        let next_time = current_time + (ibi as f32 / 1000.0);
        
        while current_time < next_time {
            let hr = 60000.0 / ibi as f32;
            time_series.push(hr);
            current_time += 1.0 / sample_rate;
        }
    }
    
    time_series
}

struct HRVMetrics {
    rmssd: f32,
    sdnn: f32,
    pnn50: f32,
}

/// Auto-detect and connect to any available HRV sensor
pub async fn auto_detect_hrv_sensor() -> Result<Box<dyn HRVSensor>> {
    // Try HeartMath first
    let mut heartmath = HeartMathDevice::new();
    if heartmath.connect().await.is_ok() {
        return Ok(Box::new(heartmath));
    }
    
    // Try Muse
    if let Ok(mut muse) = MuseDevice::new().await {
        if muse.connect().await.is_ok() {
            return Ok(Box::new(muse));
        }
    }
    
    // Try Polar
    if let Ok(mut polar) = PolarDevice::new().await {
        if polar.connect().await.is_ok() {
            return Ok(Box::new(polar));
        }
    }
    
    anyhow::bail!("No HRV sensor found")
}

/// Coherence training session
pub struct CoherenceTrainer {
    sensor: Box<dyn HRVSensor>,
    target_coherence: f32,
    session_duration: Duration,
}

impl CoherenceTrainer {
    pub fn new(sensor: Box<dyn HRVSensor>) -> Self {
        Self {
            sensor,
            target_coherence: 0.8,
            session_duration: Duration::from_secs(300), // 5 minutes
        }
    }
    
    pub async fn run_session(&mut self) -> Result<SessionResults> {
        let mut stream = self.sensor.start_streaming().await?;
        let start_time = tokio::time::Instant::now();
        
        let mut coherence_history = Vec::new();
        let mut achievement_score = 0.0;
        
        while start_time.elapsed() < self.session_duration {
            if let Ok(reading) = self.sensor.get_current_reading().await {
                coherence_history.push(reading.coherence_score.overall);
                
                if reading.coherence_score.overall >= self.target_coherence {
                    achievement_score += 1.0;
                }
                
                // Provide feedback
                self.provide_feedback(&reading).await;
            }
            
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
        
        Ok(SessionResults {
            average_coherence: coherence_history.iter().sum::<f32>() / coherence_history.len() as f32,
            peak_coherence: coherence_history.iter().cloned().fold(0.0, f32::max),
            achievement_score,
            coherence_history,
        })
    }
    
    async fn provide_feedback(&self, reading: &HRVReading) {
        // In real implementation, would send feedback to UI
        match reading.coherence_score.current_level {
            CoherenceLevel::VeryHigh => println!("🌟 Excellent coherence!"),
            CoherenceLevel::High => println!("✨ Great coherence!"),
            CoherenceLevel::Medium => println!("💚 Good progress"),
            CoherenceLevel::Low => println!("🔵 Keep breathing slowly"),
        }
    }
}

#[derive(Debug)]
pub struct SessionResults {
    pub average_coherence: f32,
    pub peak_coherence: f32,
    pub achievement_score: f32,
    pub coherence_history: Vec<f32>,
}