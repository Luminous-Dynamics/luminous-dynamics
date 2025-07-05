use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{Duration, interval};
use rand::{Rng, thread_rng};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone)]
pub struct BiometricData {
    pub timestamp: DateTime<Utc>,
    pub heart_rate: f32,
    pub hrv: f32,
    pub coherence: f32,
    pub breathing_rate: f32,
}

#[derive(Debug)]
pub struct VirtualHRVSensor {
    enabled: bool,
    baseline_hr: f32,
    baseline_coherence: f32,
    current_state: BiometricState,
}

#[derive(Debug, Clone)]
enum BiometricState {
    Calm,
    Active,
    Stressed,
    Coherent,
    Meditative,
}

pub struct VirtualHardware {
    hrv_sensor: Arc<Mutex<VirtualHRVSensor>>,
    gpu_simulator: VirtualGPU,
}

impl VirtualHardware {
    pub fn new(enable_hrv: bool, coherence_baseline: f32) -> Self {
        let hrv_sensor = Arc::new(Mutex::new(VirtualHRVSensor {
            enabled: enable_hrv,
            baseline_hr: 65.0,
            baseline_coherence: coherence_baseline,
            current_state: BiometricState::Calm,
        }));
        
        let gpu_simulator = VirtualGPU::new();
        
        // Start biometric generation if enabled
        if enable_hrv {
            let sensor_clone = hrv_sensor.clone();
            tokio::spawn(async move {
                Self::generate_biometric_data(sensor_clone).await;
            });
        }
        
        Self {
            hrv_sensor,
            gpu_simulator,
        }
    }
    
    async fn generate_biometric_data(sensor: Arc<Mutex<VirtualHRVSensor>>) {
        let mut interval = interval(Duration::from_millis(100));
        let mut rng = thread_rng();
        
        loop {
            interval.tick().await;
            
            let mut sensor = sensor.lock().await;
            if !sensor.enabled {
                continue;
            }
            
            // Simulate natural heart rate variability
            let noise = rng.gen_range(-2.0..2.0);
            let state_modifier = match sensor.current_state {
                BiometricState::Calm => 0.0,
                BiometricState::Active => 15.0,
                BiometricState::Stressed => 25.0,
                BiometricState::Coherent => -5.0,
                BiometricState::Meditative => -10.0,
            };
            
            sensor.baseline_hr = (sensor.baseline_hr + noise * 0.1 + state_modifier * 0.01)
                .clamp(50.0, 120.0);
            
            // Simulate coherence changes
            let coherence_target = match sensor.current_state {
                BiometricState::Coherent => 0.85,
                BiometricState::Meditative => 0.95,
                BiometricState::Calm => 0.6,
                BiometricState::Active => 0.4,
                BiometricState::Stressed => 0.2,
            };
            
            sensor.baseline_coherence = sensor.baseline_coherence * 0.95 
                + coherence_target * 0.05;
        }
    }
    
    pub async fn get_biometric_data(&self) -> Option<BiometricData> {
        let sensor = self.hrv_sensor.lock().await;
        if !sensor.enabled {
            return None;
        }
        
        let mut rng = thread_rng();
        
        Some(BiometricData {
            timestamp: Utc::now(),
            heart_rate: sensor.baseline_hr + rng.gen_range(-1.0..1.0),
            hrv: 50.0 + sensor.baseline_coherence * 30.0 + rng.gen_range(-5.0..5.0),
            coherence: sensor.baseline_coherence,
            breathing_rate: 12.0 + rng.gen_range(-2.0..2.0),
        })
    }
    
    pub async fn set_biometric_state(&self, state: String) {
        let mut sensor = self.hrv_sensor.lock().await;
        sensor.current_state = match state.as_str() {
            "calm" => BiometricState::Calm,
            "active" => BiometricState::Active,
            "stressed" => BiometricState::Stressed,
            "coherent" => BiometricState::Coherent,
            "meditative" => BiometricState::Meditative,
            _ => BiometricState::Calm,
        };
    }
}

pub struct VirtualGPU {
    compute_units: u32,
    memory_gb: u32,
    shader_cores: u32,
}

impl VirtualGPU {
    pub fn new() -> Self {
        Self {
            compute_units: 64,
            memory_gb: 8,
            shader_cores: 2048,
        }
    }
    
    pub fn simulate_consciousness_compute(&self, field_size: usize) -> Duration {
        // Simulate computation time based on field size
        let base_time_ms = (field_size as f64 / self.shader_cores as f64) * 10.0;
        Duration::from_millis(base_time_ms as u64)
    }
    
    pub fn get_specs(&self) -> String {
        format!(
            "Virtual GPU: {} compute units, {}GB memory, {} shader cores",
            self.compute_units, self.memory_gb, self.shader_cores
        )
    }
}