//! Biometric Bridge - Connects biometric sensors to kernel coherence

use tokio::sync::mpsc;

#[derive(Debug, Clone)]
pub struct BiometricData {
    pub heart_coherence: f64,
    pub breath_rate: f64,
    pub focus_level: f64,
}

pub struct BiometricBridge {
    receiver: mpsc::Receiver<BiometricData>,
    current_data: BiometricData,
}

impl BiometricBridge {
    pub fn new(receiver: mpsc::Receiver<BiometricData>) -> Self {
        Self {
            receiver,
            current_data: BiometricData {
                heart_coherence: 0.5,
                breath_rate: 12.0,
                focus_level: 0.5,
            },
        }
    }

    pub async fn update(&mut self) -> bool {
        match self.receiver.try_recv() {
            Ok(data) => {
                self.current_data = data;
                true
            }
            Err(_) => false,
        }
    }

    pub fn get_system_coherence(&self) -> f64 {
        // Combine biometric factors into overall coherence
        let coherence = (
            self.current_data.heart_coherence * 0.4 +
            (1.0 / (1.0 + (self.current_data.breath_rate - 6.0).abs() * 0.1)) * 0.3 +
            self.current_data.focus_level * 0.3
        );
        
        coherence.clamp(0.0, 1.0)
    }
}