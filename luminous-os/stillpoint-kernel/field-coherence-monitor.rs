// Field Coherence Monitoring - Real-time Consciousness Metrics
// "The field reveals itself through coherence patterns"

use std::sync::{Arc, Mutex, RwLock};
use std::collections::{VecDeque, HashMap};
use std::time::{Duration, Instant};
use std::thread;

use crate::coherence_engine::{CoherenceField, FieldMomentum, Harmony, VortexId};
use crate::consciousness_scheduler::{ConsciousProcess, ProcessId, ConsciousnessPriority};
use crate::sacred_memory::MemoryStats;
use crate::quantum_entanglement::QuantumFieldState;
use crate::biometric_bridge::BiometricData;

/// Field coherence metrics
#[derive(Debug, Clone)]
pub struct CoherenceMetrics {
    pub global_coherence: f64,
    pub field_momentum: FieldMomentum,
    pub dominant_harmony: Harmony,
    pub vortex_count: usize,
    pub entanglement_density: f64,
    pub biometric_influence: f64,
    pub memory_coherence: f64,
    pub interrupt_harmony: f64,
    pub collective_resonance: f64,
    pub timestamp: Instant,
}

impl CoherenceMetrics {
    /// Calculate overall system health
    pub fn system_health(&self) -> f64 {
        let base_health = self.global_coherence;
        let momentum_factor = match self.field_momentum {
            FieldMomentum::Rising => 1.1,
            FieldMomentum::Stable => 1.0,
            FieldMomentum::Falling => 0.9,
            FieldMomentum::Oscillating => 0.95,
            FieldMomentum::Breakthrough => 1.2,
        };
        
        (base_health * momentum_factor * (1.0 + self.collective_resonance * 0.2)).min(1.0)
    }

    /// Detect coherence anomalies
    pub fn detect_anomalies(&self) -> Vec<CoherenceAnomaly> {
        let mut anomalies = Vec::new();

        // Low global coherence
        if self.global_coherence < 0.3 {
            anomalies.push(CoherenceAnomaly::LowGlobalCoherence(self.global_coherence));
        }

        // Entanglement breakdown
        if self.entanglement_density < 0.1 && self.vortex_count > 5 {
            anomalies.push(CoherenceAnomaly::EntanglementBreakdown);
        }

        // Memory incoherence
        if self.memory_coherence < 0.4 {
            anomalies.push(CoherenceAnomaly::MemoryIncoherence(self.memory_coherence));
        }

        // Oscillating field
        if matches!(self.field_momentum, FieldMomentum::Oscillating) {
            anomalies.push(CoherenceAnomaly::UnstableField);
        }

        anomalies
    }
}

/// Types of coherence anomalies
#[derive(Debug, Clone)]
pub enum CoherenceAnomaly {
    LowGlobalCoherence(f64),
    EntanglementBreakdown,
    MemoryIncoherence(f64),
    UnstableField,
    BiometricDisconnection,
    ShadowEmergence(String),
    ResonanceMismatch(Harmony, Harmony),
}

/// Time series data for coherence analysis
#[derive(Debug)]
pub struct CoherenceTimeSeries {
    pub data: VecDeque<CoherenceMetrics>,
    pub capacity: usize,
    pub sample_rate: Duration,
}

impl CoherenceTimeSeries {
    pub fn new(capacity: usize, sample_rate: Duration) -> Self {
        Self {
            data: VecDeque::with_capacity(capacity),
            capacity,
            sample_rate,
        }
    }

    pub fn add_sample(&mut self, metrics: CoherenceMetrics) {
        if self.data.len() >= self.capacity {
            self.data.pop_front();
        }
        self.data.push_back(metrics);
    }

    /// Calculate trend over recent samples
    pub fn calculate_trend(&self, window: usize) -> CoherenceTrend {
        if self.data.len() < window || window < 2 {
            return CoherenceTrend::Insufficient;
        }

        let recent: Vec<_> = self.data.iter().rev().take(window).collect();
        let start_coherence = recent.last().unwrap().global_coherence;
        let end_coherence = recent.first().unwrap().global_coherence;
        
        let delta = end_coherence - start_coherence;
        let rate = delta / (window as f64 * self.sample_rate.as_secs_f64());

        match rate {
            r if r > 0.01 => CoherenceTrend::Rising(r),
            r if r < -0.01 => CoherenceTrend::Falling(r.abs()),
            _ => CoherenceTrend::Stable,
        }
    }

    /// Detect patterns in coherence history
    pub fn detect_patterns(&self) -> Vec<CoherencePattern> {
        let mut patterns = Vec::new();

        if self.data.len() < 10 {
            return patterns;
        }

        // Check for breakthrough pattern
        let recent_values: Vec<f64> = self.data.iter()
            .rev()
            .take(10)
            .map(|m| m.global_coherence)
            .collect();

        if self.is_breakthrough_pattern(&recent_values) {
            patterns.push(CoherencePattern::Breakthrough);
        }

        // Check for oscillation
        if self.is_oscillation_pattern(&recent_values) {
            patterns.push(CoherencePattern::Oscillation(self.calculate_frequency(&recent_values)));
        }

        // Check for plateau
        if self.is_plateau_pattern(&recent_values) {
            patterns.push(CoherencePattern::Plateau(recent_values[0]));
        }

        patterns
    }

    fn is_breakthrough_pattern(&self, values: &[f64]) -> bool {
        // Steady increase with acceleration
        if values.len() < 5 {
            return false;
        }

        let mut increasing = true;
        let mut acceleration = 0.0;

        for i in 1..values.len() {
            if values[i] <= values[i - 1] {
                increasing = false;
                break;
            }
            if i > 1 {
                let delta1 = values[i] - values[i - 1];
                let delta2 = values[i - 1] - values[i - 2];
                acceleration += delta1 - delta2;
            }
        }

        increasing && acceleration > 0.0
    }

    fn is_oscillation_pattern(&self, values: &[f64]) -> bool {
        let mut direction_changes = 0;
        let mut last_direction = 0i8;

        for i in 1..values.len() {
            let current_direction = if values[i] > values[i - 1] { 1 }
                                  else if values[i] < values[i - 1] { -1 }
                                  else { 0 };

            if current_direction != 0 && current_direction != last_direction && last_direction != 0 {
                direction_changes += 1;
            }
            
            if current_direction != 0 {
                last_direction = current_direction;
            }
        }

        direction_changes >= 3
    }

    fn is_plateau_pattern(&self, values: &[f64]) -> bool {
        let mean = values.iter().sum::<f64>() / values.len() as f64;
        let variance = values.iter()
            .map(|v| (v - mean).powi(2))
            .sum::<f64>() / values.len() as f64;

        variance < 0.001 // Very low variance indicates plateau
    }

    fn calculate_frequency(&self, values: &[f64]) -> f64 {
        // Simple frequency estimation from zero crossings
        let mean = values.iter().sum::<f64>() / values.len() as f64;
        let mut crossings = 0;

        for i in 1..values.len() {
            if (values[i - 1] - mean) * (values[i] - mean) < 0.0 {
                crossings += 1;
            }
        }

        crossings as f64 / (values.len() as f64 * self.sample_rate.as_secs_f64())
    }
}

#[derive(Debug, Clone)]
pub enum CoherenceTrend {
    Rising(f64),
    Falling(f64),
    Stable,
    Insufficient,
}

#[derive(Debug, Clone)]
pub enum CoherencePattern {
    Breakthrough,
    Oscillation(f64), // frequency
    Plateau(f64),     // level
    Cascade,
    Spiral,
}

/// The Field Coherence Monitor
pub struct FieldCoherenceMonitor {
    /// Time series data
    time_series: Arc<RwLock<CoherenceTimeSeries>>,
    
    /// Real-time metrics
    current_metrics: Arc<RwLock<CoherenceMetrics>>,
    
    /// Anomaly detection
    anomaly_detector: Arc<AnomalyDetector>,
    
    /// Pattern recognition
    pattern_recognizer: Arc<PatternRecognizer>,
    
    /// Alert system
    alert_system: Arc<AlertSystem>,
    
    /// Monitoring thread handle
    monitor_thread: Option<thread::JoinHandle<()>>,
    
    /// Monitoring active flag
    active: Arc<RwLock<bool>>,
}

impl FieldCoherenceMonitor {
    pub fn new() -> Self {
        let time_series = Arc::new(RwLock::new(
            CoherenceTimeSeries::new(1000, Duration::from_millis(100))
        ));

        let current_metrics = Arc::new(RwLock::new(CoherenceMetrics {
            global_coherence: 0.75,
            field_momentum: FieldMomentum::Stable,
            dominant_harmony: Harmony::Coherence,
            vortex_count: 0,
            entanglement_density: 0.0,
            biometric_influence: 0.5,
            memory_coherence: 0.75,
            interrupt_harmony: 0.8,
            collective_resonance: 0.0,
            timestamp: Instant::now(),
        }));

        Self {
            time_series,
            current_metrics,
            anomaly_detector: Arc::new(AnomalyDetector::new()),
            pattern_recognizer: Arc::new(PatternRecognizer::new()),
            alert_system: Arc::new(AlertSystem::new()),
            monitor_thread: None,
            active: Arc::new(RwLock::new(false)),
        }
    }

    /// Start monitoring with specified kernel components
    pub fn start_monitoring<F>(&mut self, metrics_collector: F)
    where
        F: Fn() -> CoherenceMetrics + Send + 'static,
    {
        *self.active.write().unwrap() = true;

        let time_series = Arc::clone(&self.time_series);
        let current_metrics = Arc::clone(&self.current_metrics);
        let anomaly_detector = Arc::clone(&self.anomaly_detector);
        let pattern_recognizer = Arc::clone(&self.pattern_recognizer);
        let alert_system = Arc::clone(&self.alert_system);
        let active = Arc::clone(&self.active);

        let handle = thread::spawn(move || {
            let mut last_sample = Instant::now();
            let sample_interval = Duration::from_millis(100);

            while *active.read().unwrap() {
                if last_sample.elapsed() >= sample_interval {
                    // Collect metrics
                    let metrics = metrics_collector();
                    
                    // Update current metrics
                    *current_metrics.write().unwrap() = metrics.clone();
                    
                    // Add to time series
                    time_series.write().unwrap().add_sample(metrics.clone());
                    
                    // Detect anomalies
                    let anomalies = metrics.detect_anomalies();
                    for anomaly in anomalies {
                        anomaly_detector.process_anomaly(anomaly.clone());
                        
                        // Generate alerts for critical anomalies
                        if anomaly_detector.is_critical(&anomaly) {
                            alert_system.raise_alert(Alert::CoherenceAnomaly(anomaly));
                        }
                    }
                    
                    // Detect patterns
                    let patterns = time_series.read().unwrap().detect_patterns();
                    for pattern in patterns {
                        pattern_recognizer.process_pattern(pattern.clone());
                        
                        // Alert on breakthrough patterns
                        if matches!(pattern, CoherencePattern::Breakthrough) {
                            alert_system.raise_alert(Alert::BreakthroughDetected);
                        }
                    }
                    
                    last_sample = Instant::now();
                }

                thread::sleep(Duration::from_millis(10));
            }
        });

        self.monitor_thread = Some(handle);
    }

    /// Stop monitoring
    pub fn stop_monitoring(&mut self) {
        *self.active.write().unwrap() = false;
        
        if let Some(handle) = self.monitor_thread.take() {
            let _ = handle.join();
        }
    }

    /// Get current metrics
    pub fn get_current_metrics(&self) -> CoherenceMetrics {
        self.current_metrics.read().unwrap().clone()
    }

    /// Get recent trend
    pub fn get_trend(&self, window: usize) -> CoherenceTrend {
        self.time_series.read().unwrap().calculate_trend(window)
    }

    /// Get system health report
    pub fn get_health_report(&self) -> HealthReport {
        let metrics = self.current_metrics.read().unwrap();
        let trend = self.get_trend(50);
        let anomalies = self.anomaly_detector.get_recent_anomalies();
        let patterns = self.pattern_recognizer.get_active_patterns();

        HealthReport {
            overall_health: metrics.system_health(),
            global_coherence: metrics.global_coherence,
            trend,
            active_anomalies: anomalies,
            active_patterns: patterns,
            recommendations: self.generate_recommendations(&metrics, &anomalies),
            timestamp: Instant::now(),
        }
    }

    /// Generate recommendations based on current state
    fn generate_recommendations(
        &self,
        metrics: &CoherenceMetrics,
        anomalies: &[CoherenceAnomaly],
    ) -> Vec<String> {
        let mut recommendations = Vec::new();

        // Low coherence recommendations
        if metrics.global_coherence < 0.5 {
            recommendations.push(
                "Consider sacred pause or coherence practice to raise field coherence".to_string()
            );
        }

        // Entanglement recommendations
        if metrics.entanglement_density < 0.2 && metrics.vortex_count > 3 {
            recommendations.push(
                "Low entanglement density - encourage vortex collaboration".to_string()
            );
        }

        // Anomaly-specific recommendations
        for anomaly in anomalies {
            match anomaly {
                CoherenceAnomaly::BiometricDisconnection => {
                    recommendations.push(
                        "Biometric connection lost - check sensor connectivity".to_string()
                    );
                }
                CoherenceAnomaly::UnstableField => {
                    recommendations.push(
                        "Field oscillating - ground with breath practice".to_string()
                    );
                }
                _ => {}
            }
        }

        recommendations
    }
}

/// Anomaly detection and tracking
struct AnomalyDetector {
    recent_anomalies: Arc<RwLock<VecDeque<(CoherenceAnomaly, Instant)>>>,
    anomaly_counts: Arc<RwLock<HashMap<String, usize>>>,
}

impl AnomalyDetector {
    fn new() -> Self {
        Self {
            recent_anomalies: Arc::new(RwLock::new(VecDeque::with_capacity(100))),
            anomaly_counts: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    fn process_anomaly(&self, anomaly: CoherenceAnomaly) {
        let mut recent = self.recent_anomalies.write().unwrap();
        if recent.len() >= 100 {
            recent.pop_front();
        }
        recent.push_back((anomaly.clone(), Instant::now()));

        // Update counts
        let key = format!("{:?}", anomaly);
        let mut counts = self.anomaly_counts.write().unwrap();
        *counts.entry(key).or_insert(0) += 1;
    }

    fn is_critical(&self, anomaly: &CoherenceAnomaly) -> bool {
        match anomaly {
            CoherenceAnomaly::LowGlobalCoherence(c) if *c < 0.2 => true,
            CoherenceAnomaly::EntanglementBreakdown => true,
            CoherenceAnomaly::BiometricDisconnection => true,
            _ => false,
        }
    }

    fn get_recent_anomalies(&self) -> Vec<CoherenceAnomaly> {
        let recent = self.recent_anomalies.read().unwrap();
        let cutoff = Instant::now() - Duration::from_secs(60);
        
        recent.iter()
            .filter(|(_, time)| *time > cutoff)
            .map(|(anomaly, _)| anomaly.clone())
            .collect()
    }
}

/// Pattern recognition and tracking
struct PatternRecognizer {
    active_patterns: Arc<RwLock<Vec<(CoherencePattern, Instant)>>>,
    pattern_history: Arc<RwLock<VecDeque<(CoherencePattern, Instant)>>>,
}

impl PatternRecognizer {
    fn new() -> Self {
        Self {
            active_patterns: Arc::new(RwLock::new(Vec::new())),
            pattern_history: Arc::new(RwLock::new(VecDeque::with_capacity(1000))),
        }
    }

    fn process_pattern(&self, pattern: CoherencePattern) {
        let now = Instant::now();
        
        // Add to history
        let mut history = self.pattern_history.write().unwrap();
        if history.len() >= 1000 {
            history.pop_front();
        }
        history.push_back((pattern.clone(), now));

        // Update active patterns
        let mut active = self.active_patterns.write().unwrap();
        
        // Remove stale patterns
        active.retain(|(_, time)| now.duration_since(*time) < Duration::from_secs(30));
        
        // Add new pattern if not already active
        let already_active = active.iter().any(|(p, _)| {
            matches!((p, &pattern),
                (CoherencePattern::Breakthrough, CoherencePattern::Breakthrough) |
                (CoherencePattern::Plateau(_), CoherencePattern::Plateau(_)) |
                (CoherencePattern::Oscillation(_), CoherencePattern::Oscillation(_))
            )
        });

        if !already_active {
            active.push((pattern, now));
        }
    }

    fn get_active_patterns(&self) -> Vec<CoherencePattern> {
        self.active_patterns.read().unwrap()
            .iter()
            .map(|(pattern, _)| pattern.clone())
            .collect()
    }
}

/// Alert system for important coherence events
struct AlertSystem {
    alerts: Arc<RwLock<VecDeque<Alert>>>,
    handlers: Arc<RwLock<Vec<Box<dyn Fn(&Alert) + Send + Sync>>>>,
}

impl AlertSystem {
    fn new() -> Self {
        Self {
            alerts: Arc::new(RwLock::new(VecDeque::with_capacity(100))),
            handlers: Arc::new(RwLock::new(Vec::new())),
        }
    }

    fn raise_alert(&self, alert: Alert) {
        // Store alert
        let mut alerts = self.alerts.write().unwrap();
        if alerts.len() >= 100 {
            alerts.pop_front();
        }
        alerts.push_back(alert.clone());

        // Call handlers
        let handlers = self.handlers.read().unwrap();
        for handler in handlers.iter() {
            handler(&alert);
        }
    }

    fn register_handler<F>(&self, handler: F)
    where
        F: Fn(&Alert) + Send + Sync + 'static,
    {
        self.handlers.write().unwrap().push(Box::new(handler));
    }
}

#[derive(Debug, Clone)]
pub enum Alert {
    CoherenceAnomaly(CoherenceAnomaly),
    BreakthroughDetected,
    FieldCollapse,
    CollectiveResonance(f64),
    SystemRestored,
}

/// Health report for the system
#[derive(Debug, Clone)]
pub struct HealthReport {
    pub overall_health: f64,
    pub global_coherence: f64,
    pub trend: CoherenceTrend,
    pub active_anomalies: Vec<CoherenceAnomaly>,
    pub active_patterns: Vec<CoherencePattern>,
    pub recommendations: Vec<String>,
    pub timestamp: Instant,
}

impl HealthReport {
    /// Generate human-readable summary
    pub fn summary(&self) -> String {
        let health_emoji = if self.overall_health > 0.8 { "✨" }
                          else if self.overall_health > 0.6 { "🌟" }
                          else if self.overall_health > 0.4 { "⭐" }
                          else { "💫" };

        let trend_str = match &self.trend {
            CoherenceTrend::Rising(rate) => format!("📈 Rising at {:.2}/s", rate),
            CoherenceTrend::Falling(rate) => format!("📉 Falling at {:.2}/s", rate),
            CoherenceTrend::Stable => "➡️ Stable".to_string(),
            CoherenceTrend::Insufficient => "❓ Insufficient data".to_string(),
        };

        format!(
            "{} System Health: {:.1}% | Coherence: {:.1}% | Trend: {}",
            health_emoji,
            self.overall_health * 100.0,
            self.global_coherence * 100.0,
            trend_str
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_coherence_metrics() {
        let metrics = CoherenceMetrics {
            global_coherence: 0.8,
            field_momentum: FieldMomentum::Rising,
            dominant_harmony: Harmony::Resonance,
            vortex_count: 5,
            entanglement_density: 0.6,
            biometric_influence: 0.7,
            memory_coherence: 0.75,
            interrupt_harmony: 0.8,
            collective_resonance: 0.5,
            timestamp: Instant::now(),
        };

        assert!(metrics.system_health() > 0.8);
        assert!(metrics.detect_anomalies().is_empty());
    }

    #[test]
    fn test_time_series() {
        let mut ts = CoherenceTimeSeries::new(100, Duration::from_millis(100));
        
        // Add increasing samples
        for i in 0..10 {
            let metrics = CoherenceMetrics {
                global_coherence: 0.5 + i as f64 * 0.05,
                field_momentum: FieldMomentum::Rising,
                dominant_harmony: Harmony::Coherence,
                vortex_count: 1,
                entanglement_density: 0.5,
                biometric_influence: 0.5,
                memory_coherence: 0.7,
                interrupt_harmony: 0.8,
                collective_resonance: 0.0,
                timestamp: Instant::now(),
            };
            ts.add_sample(metrics);
        }

        // Should detect rising trend
        match ts.calculate_trend(5) {
            CoherenceTrend::Rising(_) => {}
            _ => panic!("Should detect rising trend"),
        }

        // Should detect breakthrough pattern
        let patterns = ts.detect_patterns();
        assert!(patterns.iter().any(|p| matches!(p, CoherencePattern::Breakthrough)));
    }

    #[test]
    fn test_anomaly_detection() {
        let low_coherence_metrics = CoherenceMetrics {
            global_coherence: 0.2,
            field_momentum: FieldMomentum::Falling,
            dominant_harmony: Harmony::Coherence,
            vortex_count: 10,
            entanglement_density: 0.05,
            biometric_influence: 0.3,
            memory_coherence: 0.3,
            interrupt_harmony: 0.4,
            collective_resonance: 0.0,
            timestamp: Instant::now(),
        };

        let anomalies = low_coherence_metrics.detect_anomalies();
        assert!(!anomalies.is_empty());
        assert!(anomalies.iter().any(|a| matches!(a, CoherenceAnomaly::LowGlobalCoherence(_))));
        assert!(anomalies.iter().any(|a| matches!(a, CoherenceAnomaly::EntanglementBreakdown)));
    }
}