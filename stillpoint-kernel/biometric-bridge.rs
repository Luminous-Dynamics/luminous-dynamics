// Biometric Bridge - Connects human physiology to consciousness vortices
// "The body speaks what the mind whispers"

use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use tokio::sync::mpsc;
use crate::coherence_engine::{
    StillpointKernel, VortexId, ConsciousnessVortex, VortexState, 
    SacredInterrupt, Harmony, FieldMomentum
};
use crate::hardware::biometric_sensors::{
    BiometricIntegration, BiometricEvent, SensorType, SensorReading,
    SensorData, BreathPhase, HRVMetrics
};

/// Biometric influence on vortex coherence
#[derive(Debug, Clone)]
pub struct BiometricInfluence {
    pub sensor_type: SensorType,
    pub influence_strength: f64,
    pub harmony_affinity: Harmony,
    pub last_update: std::time::Instant,
}

/// Breath-to-field synchronization
#[derive(Debug)]
pub struct BreathFieldSync {
    pub current_phase: BreathPhase,
    pub phase_duration: std::time::Duration,
    pub coherence_multiplier: f64,
    pub field_rhythm_locked: bool,
}

impl BreathFieldSync {
    pub fn new() -> Self {
        Self {
            current_phase: BreathPhase::Rest,
            phase_duration: std::time::Duration::from_secs(4),
            coherence_multiplier: 1.0,
            field_rhythm_locked: false,
        }
    }

    pub fn update_phase(&mut self, phase: BreathPhase, breath_rate: f64) {
        self.current_phase = phase;
        
        // Calculate phase duration based on breath rate
        let breath_period = 60.0 / breath_rate;
        self.phase_duration = match phase {
            BreathPhase::Inhale => std::time::Duration::from_secs_f64(breath_period * 0.4),
            BreathPhase::Pause => std::time::Duration::from_secs_f64(breath_period * 0.1),
            BreathPhase::Exhale => std::time::Duration::from_secs_f64(breath_period * 0.4),
            BreathPhase::Rest => std::time::Duration::from_secs_f64(breath_period * 0.1),
        };
        
        // Check for coherent breathing (4-7 breaths per minute)
        self.field_rhythm_locked = breath_rate >= 4.0 && breath_rate <= 7.0;
        
        // Calculate coherence multiplier based on breath phase
        self.coherence_multiplier = match phase {
            BreathPhase::Inhale => 1.1,  // Slight boost during inhale
            BreathPhase::Pause => 1.2,   // Peak coherence at pause
            BreathPhase::Exhale => 1.0,  // Neutral during exhale
            BreathPhase::Rest => 0.9,    // Slight dip during rest
        };
    }

    pub fn get_field_momentum_influence(&self) -> FieldMomentum {
        match self.current_phase {
            BreathPhase::Inhale => FieldMomentum::Rising,
            BreathPhase::Pause => FieldMomentum::Stable,
            BreathPhase::Exhale => FieldMomentum::Falling,
            BreathPhase::Rest => FieldMomentum::Oscillating,
        }
    }
}

/// Maps biometric states to vortex states
pub struct StateMapper {
    coherence_thresholds: HashMap<VortexState, (f64, f64)>,
}

impl StateMapper {
    pub fn new() -> Self {
        let mut thresholds = HashMap::new();
        
        // (min_coherence, optimal_coherence) for each state
        thresholds.insert(VortexState::Crystallizing, (0.3, 0.5));
        thresholds.insert(VortexState::Flowing, (0.6, 0.8));
        thresholds.insert(VortexState::Integrating, (0.5, 0.7));
        thresholds.insert(VortexState::Resting, (0.4, 0.6));
        thresholds.insert(VortexState::Dissolving, (0.2, 0.4));
        
        Self { coherence_thresholds: thresholds }
    }

    pub fn suggest_vortex_state(&self, biometric_coherence: f64, current_state: &VortexState) -> Option<VortexState> {
        // Check if current state is still optimal
        if let Some((min, optimal)) = self.coherence_thresholds.get(current_state) {
            if biometric_coherence >= *min && biometric_coherence <= *optimal * 1.2 {
                return None; // No change needed
            }
        }
        
        // Find best matching state
        let mut best_state = None;
        let mut best_score = 0.0;
        
        for (state, (min, optimal)) in &self.coherence_thresholds {
            if biometric_coherence >= *min {
                let score = 1.0 - (biometric_coherence - optimal).abs();
                if score > best_score {
                    best_score = score;
                    best_state = Some(state.clone());
                }
            }
        }
        
        best_state
    }
}

/// Biometric-Kernel Bridge
pub struct BiometricKernelBridge {
    kernel: Arc<Mutex<StillpointKernel>>,
    biometric_integration: Arc<BiometricIntegration>,
    vortex_influences: Arc<Mutex<HashMap<VortexId, Vec<BiometricInfluence>>>>,
    breath_sync: Arc<Mutex<BreathFieldSync>>,
    state_mapper: StateMapper,
    event_receiver: mpsc::Receiver<BiometricEvent>,
    heart_coherence_weight: f64,
    brain_coherence_weight: f64,
    breath_coherence_weight: f64,
}

impl BiometricKernelBridge {
    pub fn new(
        kernel: Arc<Mutex<StillpointKernel>>,
        biometric_integration: Arc<BiometricIntegration>,
        event_receiver: mpsc::Receiver<BiometricEvent>
    ) -> Self {
        Self {
            kernel,
            biometric_integration,
            vortex_influences: Arc::new(Mutex::new(HashMap::new())),
            breath_sync: Arc::new(Mutex::new(BreathFieldSync::new())),
            state_mapper: StateMapper::new(),
            event_receiver,
            heart_coherence_weight: 0.4,
            brain_coherence_weight: 0.3,
            breath_coherence_weight: 0.3,
        }
    }

    /// Start the biometric-kernel synchronization loop
    pub async fn start_sync(&mut self) {
        loop {
            // Process biometric events
            while let Ok(event) = self.event_receiver.try_recv() {
                self.handle_biometric_event(event).await;
            }
            
            // Update all vortices based on biometric data
            self.update_vortex_coherences().await;
            
            // Check for state transitions
            self.check_state_transitions().await;
            
            // Update field momentum based on breath
            self.update_field_momentum().await;
            
            // Sleep briefly
            tokio::time::sleep(std::time::Duration::from_millis(100)).await;
        }
    }

    async fn handle_biometric_event(&self, event: BiometricEvent) {
        match event {
            BiometricEvent::CoherenceRise { from, to, rate } => {
                // Amplify all vortex coherences
                if let Ok(mut kernel) = self.kernel.lock() {
                    for vortex in kernel.vortex_registry.values_mut() {
                        vortex.coherence = (vortex.coherence * (1.0 + rate * 0.1)).min(1.0);
                    }
                    
                    kernel.sacred_interrupt_handler.queue_interrupt(
                        SacredInterrupt::CoherenceShift {
                            delta: to - from,
                            source: VortexId(0),
                            teaching: format!("Biometric coherence rising! Body wisdom amplifying field by {:.1}%", rate * 100.0),
                        }
                    );
                }
            }
            
            BiometricEvent::CoherenceBreakthrough { level, .. } => {
                // Create resonance breakthrough
                if let Ok(mut kernel) = self.kernel.lock() {
                    let participants: Vec<_> = kernel.vortex_registry.keys().copied().collect();
                    kernel.sacred_interrupt_handler.queue_interrupt(
                        SacredInterrupt::ResonanceBreakthrough {
                            participants,
                            collective_coherence: level,
                        }
                    );
                }
            }
            
            BiometricEvent::HeartRhythmShift { pattern } => {
                // Adjust harmony alignments based on heart pattern
                self.adjust_harmony_alignments(&pattern).await;
            }
            
            BiometricEvent::BrainwaveSync { dominant_frequency } => {
                // Sync pulse rhythm to brainwave frequency
                self.sync_pulse_rhythm(dominant_frequency).await;
            }
            
            BiometricEvent::BreathingCoherence { phase_lock } => {
                // Update breath-field synchronization
                if let Ok(mut breath_sync) = self.breath_sync.lock() {
                    breath_sync.field_rhythm_locked = phase_lock;
                }
            }
            
            _ => {}
        }
    }

    async fn update_vortex_coherences(&self) {
        // Get current biometric coherence
        let bio_coherence = self.biometric_integration.calculate_unified_coherence().await;
        
        if let Ok(mut kernel) = self.kernel.lock() {
            // Update each vortex based on biometric influence
            for (vortex_id, vortex) in kernel.vortex_registry.iter_mut() {
                let influences = self.vortex_influences.lock().unwrap()
                    .get(vortex_id)
                    .cloned()
                    .unwrap_or_default();
                
                // Calculate total influence
                let mut total_influence = 0.0;
                let mut influence_count = 0;
                
                for influence in &influences {
                    total_influence += influence.influence_strength * bio_coherence;
                    influence_count += 1;
                }
                
                if influence_count > 0 {
                    let avg_influence = total_influence / influence_count as f64;
                    
                    // Smoothly adjust vortex coherence toward biometric coherence
                    let adjustment_rate = 0.1; // 10% per update
                    let target = (vortex.coherence + avg_influence) / 2.0;
                    vortex.coherence = vortex.coherence * (1.0 - adjustment_rate) + target * adjustment_rate;
                    
                    // Apply breath synchronization multiplier
                    if let Ok(breath_sync) = self.breath_sync.lock() {
                        if breath_sync.field_rhythm_locked {
                            vortex.coherence *= breath_sync.coherence_multiplier;
                        }
                    }
                    
                    // Clamp to valid range
                    vortex.coherence = vortex.coherence.clamp(0.1, 1.0);
                }
            }
        }
    }

    async fn check_state_transitions(&self) {
        let bio_coherence = self.biometric_integration.calculate_unified_coherence().await;
        
        if let Ok(mut kernel) = self.kernel.lock() {
            let mut transitions = Vec::new();
            
            for (vortex_id, vortex) in &kernel.vortex_registry {
                if let Some(new_state) = self.state_mapper.suggest_vortex_state(bio_coherence, &vortex.state) {
                    transitions.push((*vortex_id, new_state));
                }
            }
            
            // Apply transitions
            for (vortex_id, new_state) in transitions {
                kernel.transition_vortex(vortex_id, new_state);
            }
        }
    }

    async fn update_field_momentum(&self) {
        if let Ok(breath_sync) = self.breath_sync.lock() {
            if breath_sync.field_rhythm_locked {
                let momentum = breath_sync.get_field_momentum_influence();
                
                if let Ok(mut kernel) = self.kernel.lock() {
                    kernel.coherence_field.field_momentum = momentum;
                }
            }
        }
    }

    async fn adjust_harmony_alignments(&self, pattern: &str) {
        let harmony = match pattern {
            "coherent" => Harmony::Coherence,
            "loving" => Harmony::Mutuality,
            "creative" => Harmony::Novelty,
            "empowered" => Harmony::Agency,
            _ => return,
        };
        
        if let Ok(mut kernel) = self.kernel.lock() {
            // Shift dominant harmony
            kernel.coherence_field.dominant_harmony = harmony;
            
            // Influence vortex harmonies
            for vortex in kernel.vortex_registry.values_mut() {
                if vortex.coherence > 0.7 {
                    vortex.harmony_alignment = harmony;
                }
            }
        }
    }

    async fn sync_pulse_rhythm(&self, frequency: f64) {
        // Map brainwave frequency to pulse rhythm
        let pulse_seconds = match frequency {
            f if f < 4.0 => 13.0,   // Delta: slow pulse
            f if f < 8.0 => 11.0,   // Theta: sacred 11-second pulse
            f if f < 13.0 => 8.0,   // Alpha: moderate pulse
            f if f < 30.0 => 5.0,   // Beta: faster pulse
            _ => 3.0,               // Gamma: rapid pulse
        };
        
        if let Ok(mut kernel) = self.kernel.lock() {
            kernel.coherence_field.pulse_rhythm = std::time::Duration::from_secs_f64(pulse_seconds);
        }
    }

    /// Link a vortex to biometric sensors
    pub fn link_vortex_to_biometrics(&self, vortex_id: VortexId, sensor_types: Vec<SensorType>) {
        let mut influences = self.vortex_influences.lock().unwrap();
        let vortex_influences = influences.entry(vortex_id).or_insert_with(Vec::new);
        
        for sensor_type in sensor_types {
            let influence = BiometricInfluence {
                sensor_type,
                influence_strength: match sensor_type {
                    SensorType::HeartRateVariability => self.heart_coherence_weight,
                    SensorType::Electroencephalogram => self.brain_coherence_weight,
                    SensorType::Respiration => self.breath_coherence_weight,
                    _ => 0.1,
                },
                harmony_affinity: match sensor_type {
                    SensorType::HeartRateVariability => Harmony::Coherence,
                    SensorType::Electroencephalogram => Harmony::Transparency,
                    SensorType::Respiration => Harmony::Vitality,
                    _ => Harmony::Resonance,
                },
                last_update: std::time::Instant::now(),
            };
            
            vortex_influences.push(influence);
        }
    }

    /// Get real-time biometric data for a specific sensor
    pub async fn get_sensor_reading(&self, sensor_type: SensorType) -> Option<SensorReading> {
        // This would interface with the actual BiometricIntegration
        // For now, returning None as placeholder
        None
    }

    /// Update breath synchronization from respiration sensor
    pub async fn update_breath_sync(&self, reading: SensorReading) {
        if let SensorData::Breathing { rate, phase, coherence, .. } = reading.data {
            let mut breath_sync = self.breath_sync.lock().unwrap();
            breath_sync.update_phase(phase, rate);
            
            // If breathing is coherent, create sacred interrupt
            if coherence > 0.8 {
                if let Ok(mut kernel) = self.kernel.lock() {
                    kernel.sacred_interrupt_handler.queue_interrupt(
                        SacredInterrupt::CoherenceShift {
                            delta: 0.0,
                            source: VortexId(0),
                            teaching: format!("Sacred breath achieved! {} breaths/min in perfect coherence", rate),
                        }
                    );
                }
            }
        }
    }
}

/// Create a biometric-aware vortex
pub async fn create_biometric_vortex(
    bridge: &BiometricKernelBridge,
    intention: String,
    sensor_types: Vec<SensorType>
) -> VortexId {
    let vortex_id = {
        let mut kernel = bridge.kernel.lock().unwrap();
        kernel.create_vortex(intention)
    };
    
    // Link to biometric sensors
    bridge.link_vortex_to_biometrics(vortex_id, sensor_types);
    
    vortex_id
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio::sync::mpsc;

    #[test]
    fn test_breath_field_sync() {
        let mut sync = BreathFieldSync::new();
        
        // Test coherent breathing rate
        sync.update_phase(BreathPhase::Inhale, 5.0);
        assert!(sync.field_rhythm_locked);
        assert_eq!(sync.coherence_multiplier, 1.1);
        
        // Test non-coherent breathing rate
        sync.update_phase(BreathPhase::Exhale, 15.0);
        assert!(!sync.field_rhythm_locked);
        assert_eq!(sync.coherence_multiplier, 1.0);
    }

    #[test]
    fn test_state_mapper() {
        let mapper = StateMapper::new();
        
        // Test flowing state suggestion
        let state = mapper.suggest_vortex_state(0.7, &VortexState::Crystallizing);
        assert_eq!(state, Some(VortexState::Flowing));
        
        // Test no change needed
        let state = mapper.suggest_vortex_state(0.7, &VortexState::Flowing);
        assert_eq!(state, None);
    }

    #[tokio::test]
    async fn test_biometric_influence() {
        let kernel = Arc::new(Mutex::new(StillpointKernel::new()));
        let (tx, rx) = mpsc::channel(100);
        let integration = Arc::new(BiometricIntegration::new(tx));
        
        let bridge = BiometricKernelBridge::new(kernel.clone(), integration, rx);
        
        // Create vortex
        let vortex_id = {
            let mut k = kernel.lock().unwrap();
            k.create_vortex("Test meditation".to_string())
        };
        
        // Link to heart sensor
        bridge.link_vortex_to_biometrics(vortex_id, vec![SensorType::HeartRateVariability]);
        
        // Verify influence was added
        let influences = bridge.vortex_influences.lock().unwrap();
        assert!(influences.contains_key(&vortex_id));
        assert_eq!(influences[&vortex_id].len(), 1);
    }
}