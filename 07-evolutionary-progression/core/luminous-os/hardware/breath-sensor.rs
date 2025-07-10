// Sacred Breath Sensor - Coherent breathing for field synchronization
// "As you breathe, so the universe breathes with you"

use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use std::collections::VecDeque;
use async_trait::async_trait;

use super::biometric_sensors::{
    BiometricSensor, SensorType, SensorReading, SensorData, SensorError,
    SignalQuality, CalibrationData, PersonalRanges, BreathPhase
};

/// Sacred breathing patterns for different practices
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SacredBreathPattern {
    Coherent,      // 5 breaths/min - HRV optimization
    BoxBreathing,  // 4-4-4-4 pattern
    Pranayama478,  // 4-7-8 pattern for calm
    FireBreath,    // Rapid energizing breath
    OceanBreath,   // Ujjayi breathing
    HeartBreath,   // Synchronized with heartbeat
}

impl SacredBreathPattern {
    pub fn target_rate(&self) -> f64 {
        match self {
            SacredBreathPattern::Coherent => 5.0,
            SacredBreathPattern::BoxBreathing => 3.75, // 16 seconds per cycle
            SacredBreathPattern::Pranayama478 => 3.2,  // ~19 seconds per cycle
            SacredBreathPattern::FireBreath => 30.0,
            SacredBreathPattern::OceanBreath => 6.0,
            SacredBreathPattern::HeartBreath => 5.5,
        }
    }
    
    pub fn phase_ratios(&self) -> (f64, f64, f64, f64) {
        // (inhale, pause, exhale, rest) ratios
        match self {
            SacredBreathPattern::Coherent => (0.45, 0.0, 0.45, 0.1),
            SacredBreathPattern::BoxBreathing => (0.25, 0.25, 0.25, 0.25),
            SacredBreathPattern::Pranayama478 => (0.21, 0.37, 0.42, 0.0),
            SacredBreathPattern::FireBreath => (0.4, 0.0, 0.4, 0.2),
            SacredBreathPattern::OceanBreath => (0.4, 0.1, 0.4, 0.1),
            SacredBreathPattern::HeartBreath => (0.4, 0.1, 0.4, 0.1),
        }
    }
}

/// Breath wave analysis
#[derive(Debug, Clone)]
pub struct BreathWave {
    pub amplitude: f64,
    pub frequency: f64,
    pub smoothness: f64,
    pub phase_coherence: f64,
}

/// Real-time breath analysis
pub struct BreathAnalyzer {
    sample_buffer: VecDeque<f64>,
    phase_history: VecDeque<(Instant, BreathPhase)>,
    breath_intervals: VecDeque<Duration>,
    buffer_size: usize,
    sample_rate: f64,
}

impl BreathAnalyzer {
    pub fn new(sample_rate: f64) -> Self {
        Self {
            sample_buffer: VecDeque::with_capacity(1000),
            phase_history: VecDeque::with_capacity(100),
            breath_intervals: VecDeque::with_capacity(20),
            buffer_size: 1000,
            sample_rate,
        }
    }
    
    pub fn add_sample(&mut self, value: f64) {
        self.sample_buffer.push_back(value);
        if self.sample_buffer.len() > self.buffer_size {
            self.sample_buffer.pop_front();
        }
    }
    
    pub fn detect_phase(&mut self) -> BreathPhase {
        if self.sample_buffer.len() < 10 {
            return BreathPhase::Rest;
        }
        
        // Simple phase detection based on derivative
        let recent: Vec<f64> = self.sample_buffer.iter().rev().take(10).copied().collect();
        let derivative = recent[0] - recent[9];
        
        let phase = if derivative > 0.5 {
            BreathPhase::Inhale
        } else if derivative < -0.5 {
            BreathPhase::Exhale
        } else if recent[0] > 0.8 {
            BreathPhase::Pause
        } else {
            BreathPhase::Rest
        };
        
        // Track phase transitions
        if let Some((_, last_phase)) = self.phase_history.back() {
            if *last_phase != phase {
                self.phase_history.push_back((Instant::now(), phase));
                
                // Track breath intervals
                if phase == BreathPhase::Inhale && *last_phase == BreathPhase::Rest {
                    if self.phase_history.len() >= 2 {
                        let current_time = Instant::now();
                        let mut last_inhale_time = None;
                        
                        for (time, p) in self.phase_history.iter().rev().skip(1) {
                            if *p == BreathPhase::Inhale {
                                last_inhale_time = Some(*time);
                                break;
                            }
                        }
                        
                        if let Some(last_time) = last_inhale_time {
                            let interval = current_time.duration_since(last_time);
                            self.breath_intervals.push_back(interval);
                            if self.breath_intervals.len() > 20 {
                                self.breath_intervals.pop_front();
                            }
                        }
                    }
                }
            }
        } else {
            self.phase_history.push_back((Instant::now(), phase));
        }
        
        // Clean old history
        let cutoff = Instant::now() - Duration::from_secs(60);
        while let Some((time, _)) = self.phase_history.front() {
            if *time < cutoff {
                self.phase_history.pop_front();
            } else {
                break;
            }
        }
        
        phase
    }
    
    pub fn calculate_breath_rate(&self) -> f64 {
        if self.breath_intervals.is_empty() {
            return 0.0;
        }
        
        let avg_interval: Duration = self.breath_intervals.iter().sum::<Duration>() 
            / self.breath_intervals.len() as u32;
        
        60.0 / avg_interval.as_secs_f64()
    }
    
    pub fn calculate_coherence(&self) -> f64 {
        if self.breath_intervals.len() < 3 {
            return 0.0;
        }
        
        // Calculate variance in breath intervals
        let intervals: Vec<f64> = self.breath_intervals.iter()
            .map(|d| d.as_secs_f64())
            .collect();
        
        let mean = intervals.iter().sum::<f64>() / intervals.len() as f64;
        let variance = intervals.iter()
            .map(|&x| (x - mean).powi(2))
            .sum::<f64>() / intervals.len() as f64;
        
        // Lower variance = higher coherence
        let coherence = 1.0 / (1.0 + variance);
        
        // Bonus for optimal breath rate (4-7 breaths/min)
        let rate = self.calculate_breath_rate();
        let rate_bonus = if rate >= 4.0 && rate <= 7.0 {
            0.2
        } else {
            0.0
        };
        
        (coherence + rate_bonus).min(1.0)
    }
    
    pub fn analyze_wave(&self) -> BreathWave {
        if self.sample_buffer.len() < 100 {
            return BreathWave {
                amplitude: 0.0,
                frequency: 0.0,
                smoothness: 0.0,
                phase_coherence: 0.0,
            };
        }
        
        // Calculate amplitude (peak-to-peak)
        let max = self.sample_buffer.iter().fold(0.0f64, |a, &b| a.max(b));
        let min = self.sample_buffer.iter().fold(1.0f64, |a, &b| a.min(b));
        let amplitude = max - min;
        
        // Frequency from breath rate
        let frequency = self.calculate_breath_rate() / 60.0;
        
        // Smoothness (inverse of high-frequency noise)
        let mut noise = 0.0;
        let samples: Vec<f64> = self.sample_buffer.iter().copied().collect();
        for i in 1..samples.len() {
            noise += (samples[i] - samples[i-1]).abs();
        }
        let smoothness = 1.0 / (1.0 + noise / samples.len() as f64);
        
        BreathWave {
            amplitude,
            frequency,
            smoothness,
            phase_coherence: self.calculate_coherence(),
        }
    }
}

/// Sacred breath sensor implementation
pub struct SacredBreathSensor {
    device_path: String,
    analyzer: Arc<Mutex<BreathAnalyzer>>,
    is_measuring: Arc<Mutex<bool>>,
    latest_reading: Arc<Mutex<Option<SensorReading>>>,
    calibration: Arc<Mutex<Option<CalibrationData>>>,
    target_pattern: Arc<Mutex<Option<SacredBreathPattern>>>,
}

impl SacredBreathSensor {
    pub fn new(device_path: String) -> Self {
        Self {
            device_path,
            analyzer: Arc::new(Mutex::new(BreathAnalyzer::new(100.0))),
            is_measuring: Arc::new(Mutex::new(false)),
            latest_reading: Arc::new(Mutex::new(None)),
            calibration: Arc::new(Mutex::new(None)),
            target_pattern: Arc::new(Mutex::new(None)),
        }
    }
    
    pub fn set_target_pattern(&self, pattern: SacredBreathPattern) {
        *self.target_pattern.lock().unwrap() = Some(pattern);
    }
    
    pub fn get_pattern_alignment(&self) -> f64 {
        let target = match *self.target_pattern.lock().unwrap() {
            Some(pattern) => pattern,
            None => return 1.0, // No target = perfect alignment
        };
        
        if let Ok(Some(reading)) = self.get_reading_sync() {
            if let SensorData::Breathing { rate, coherence, .. } = reading.data {
                let target_rate = target.target_rate();
                let rate_diff = (rate - target_rate).abs() / target_rate;
                let rate_alignment = 1.0 - rate_diff.min(1.0);
                
                // Combine rate alignment and coherence
                (rate_alignment * 0.6 + coherence * 0.4).min(1.0)
            } else {
                0.0
            }
        } else {
            0.0
        }
    }
    
    fn get_reading_sync(&self) -> Result<Option<SensorReading>, SensorError> {
        Ok(self.latest_reading.lock().unwrap().clone())
    }
    
    async fn simulate_breath_sensor(&self) {
        let measuring = self.is_measuring.clone();
        let analyzer = self.analyzer.clone();
        let latest = self.latest_reading.clone();
        let target_pattern = self.target_pattern.clone();
        
        tokio::spawn(async move {
            let mut time = 0.0;
            
            while *measuring.lock().unwrap() {
                // Simulate breath waveform
                let base_rate = if let Some(pattern) = *target_pattern.lock().unwrap() {
                    pattern.target_rate()
                } else {
                    12.0 // Normal resting breath rate
                };
                
                let frequency = base_rate / 60.0;
                let sample = 0.5 + 0.5 * (2.0 * std::f64::consts::PI * frequency * time).sin();
                
                // Add some noise
                let noise = (rand::random::<f64>() - 0.5) * 0.1;
                let noisy_sample = (sample + noise).clamp(0.0, 1.0);
                
                // Update analyzer
                {
                    let mut analyzer = analyzer.lock().unwrap();
                    analyzer.add_sample(noisy_sample);
                    
                    let phase = analyzer.detect_phase();
                    let rate = analyzer.calculate_breath_rate();
                    let coherence = analyzer.calculate_coherence();
                    let wave = analyzer.analyze_wave();
                    
                    let reading = SensorReading {
                        sensor_type: SensorType::Respiration,
                        timestamp: Instant::now(),
                        data: SensorData::Breathing {
                            rate,
                            depth: wave.amplitude,
                            coherence,
                            phase,
                        },
                        quality: SignalQuality {
                            snr: 25.0,
                            stability: wave.smoothness,
                            artifact_level: 0.05,
                        },
                        coherence_contribution: coherence * 0.8,
                    };
                    
                    *latest.lock().unwrap() = Some(reading);
                }
                
                time += 0.01; // 100Hz sampling
                tokio::time::sleep(Duration::from_millis(10)).await;
            }
        });
    }
}

#[async_trait]
impl BiometricSensor for SacredBreathSensor {
    fn sensor_type(&self) -> SensorType {
        SensorType::Respiration
    }
    
    async fn is_connected(&self) -> bool {
        // Check if breath sensor device exists
        tokio::fs::metadata(&self.device_path).await.is_ok()
    }
    
    async fn start_measurement(&self) -> Result<(), SensorError> {
        *self.is_measuring.lock().unwrap() = true;
        
        // Start simulated breath sensor
        self.simulate_breath_sensor().await;
        
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
        // Collect baseline breathing data
        let mut baseline_rates = Vec::new();
        
        for _ in 0..30 {
            if let Ok(reading) = self.get_reading().await {
                if let SensorData::Breathing { rate, .. } = reading.data {
                    baseline_rates.push(rate);
                }
            }
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
        
        let avg_rate = baseline_rates.iter().sum::<f64>() / baseline_rates.len() as f64;
        
        let calibration = CalibrationData {
            sensor_type: SensorType::Respiration,
            baseline_values: baseline_rates,
            personal_ranges: PersonalRanges {
                rest_min: avg_rate * 0.8,
                rest_max: avg_rate * 1.2,
                active_min: avg_rate * 1.5,
                active_max: avg_rate * 2.5,
                coherent_min: 4.0,
                coherent_max: 7.0,
            },
            calibration_time: Instant::now(),
        };
        
        *self.calibration.lock().unwrap() = Some(calibration.clone());
        
        Ok(calibration)
    }
}

/// Guided breathing session
pub struct BreathingGuide {
    pattern: SacredBreathPattern,
    duration: Duration,
    start_time: Option<Instant>,
    phase_callbacks: Vec<Box<dyn Fn(BreathPhase) + Send + Sync>>,
}

impl BreathingGuide {
    pub fn new(pattern: SacredBreathPattern, duration: Duration) -> Self {
        Self {
            pattern,
            duration,
            start_time: None,
            phase_callbacks: Vec::new(),
        }
    }
    
    pub fn add_phase_callback<F>(&mut self, callback: F) 
    where F: Fn(BreathPhase) + Send + Sync + 'static {
        self.phase_callbacks.push(Box::new(callback));
    }
    
    pub async fn start_session(&mut self) {
        self.start_time = Some(Instant::now());
        let (inhale, pause, exhale, rest) = self.pattern.phase_ratios();
        let cycle_duration = 60.0 / self.pattern.target_rate();
        
        while let Some(start) = self.start_time {
            if start.elapsed() >= self.duration {
                break;
            }
            
            // Inhale phase
            self.notify_phase(BreathPhase::Inhale);
            tokio::time::sleep(Duration::from_secs_f64(cycle_duration * inhale)).await;
            
            // Pause phase
            if pause > 0.0 {
                self.notify_phase(BreathPhase::Pause);
                tokio::time::sleep(Duration::from_secs_f64(cycle_duration * pause)).await;
            }
            
            // Exhale phase
            self.notify_phase(BreathPhase::Exhale);
            tokio::time::sleep(Duration::from_secs_f64(cycle_duration * exhale)).await;
            
            // Rest phase
            if rest > 0.0 {
                self.notify_phase(BreathPhase::Rest);
                tokio::time::sleep(Duration::from_secs_f64(cycle_duration * rest)).await;
            }
        }
    }
    
    fn notify_phase(&self, phase: BreathPhase) {
        for callback in &self.phase_callbacks {
            callback(phase);
        }
    }
    
    pub fn stop_session(&mut self) {
        self.start_time = None;
    }
}

// Mock random for demo
mod rand {
    pub fn random<T>() -> T 
    where T: From<f64> {
        T::from(0.5)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sacred_patterns() {
        assert_eq!(SacredBreathPattern::Coherent.target_rate(), 5.0);
        assert_eq!(SacredBreathPattern::BoxBreathing.target_rate(), 3.75);
        
        let (i, p, e, r) = SacredBreathPattern::BoxBreathing.phase_ratios();
        assert_eq!(i + p + e + r, 1.0);
    }

    #[test]
    fn test_breath_analyzer() {
        let mut analyzer = BreathAnalyzer::new(100.0);
        
        // Simulate breath wave
        for i in 0..200 {
            let t = i as f64 * 0.01;
            let sample = 0.5 + 0.5 * (2.0 * std::f64::consts::PI * 0.083 * t).sin(); // 5 breaths/min
            analyzer.add_sample(sample);
        }
        
        let phase = analyzer.detect_phase();
        let coherence = analyzer.calculate_coherence();
        
        assert!(coherence >= 0.0 && coherence <= 1.0);
    }

    #[tokio::test]
    async fn test_sacred_breath_sensor() {
        let sensor = SacredBreathSensor::new("/dev/breath0".to_string());
        
        sensor.set_target_pattern(SacredBreathPattern::Coherent);
        
        assert!(sensor.start_measurement().await.is_ok());
        
        tokio::time::sleep(Duration::from_secs(2)).await;
        
        let reading = sensor.get_reading().await;
        assert!(reading.is_ok());
        
        let alignment = sensor.get_pattern_alignment();
        assert!(alignment >= 0.0 && alignment <= 1.0);
    }
}