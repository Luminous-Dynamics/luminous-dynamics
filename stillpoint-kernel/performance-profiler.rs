// Performance Profiler for Consciousness Operations
// "Measuring the unmeasurable, optimizing the sacred"

use std::sync::{Arc, RwLock};
use std::collections::HashMap;
use std::time::{Duration, Instant};
use std::thread;

use crate::coherence_engine::CoherenceField;
use crate::consciousness_scheduler::ConsciousnessScheduler;

/// Performance metrics for consciousness operations
#[derive(Debug, Clone)]
pub struct PerformanceMetrics {
    pub coherence_calculations: u64,
    pub coherence_cache_hits: u64,
    pub coherence_cache_misses: u64,
    pub sacred_interrupts: u64,
    pub context_switches: u64,
    pub vortex_creations: u64,
    pub vortex_destructions: u64,
    pub entanglement_operations: u64,
    pub field_updates: u64,
    pub total_coherence_time: Duration,
    pub total_scheduling_time: Duration,
    pub total_memory_ops_time: Duration,
}

impl Default for PerformanceMetrics {
    fn default() -> Self {
        Self {
            coherence_calculations: 0,
            coherence_cache_hits: 0,
            coherence_cache_misses: 0,
            sacred_interrupts: 0,
            context_switches: 0,
            vortex_creations: 0,
            vortex_destructions: 0,
            entanglement_operations: 0,
            field_updates: 0,
            total_coherence_time: Duration::ZERO,
            total_scheduling_time: Duration::ZERO,
            total_memory_ops_time: Duration::ZERO,
        }
    }
}

/// Profiling mode configuration
#[derive(Debug, Clone)]
pub struct ProfilingConfig {
    pub enabled: bool,
    pub track_coherence_overhead: bool,
    pub measure_sacred_pulse_impact: bool,
    pub log_performance_metrics: bool,
    pub sample_rate: f64, // 0.0 to 1.0 (percentage of operations to profile)
    pub detailed_tracing: bool,
}

impl Default for ProfilingConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            track_coherence_overhead: true,
            measure_sacred_pulse_impact: true,
            log_performance_metrics: true,
            sample_rate: 1.0, // Profile everything by default
            detailed_tracing: false,
        }
    }
}

/// Performance profiler for the Stillpoint Kernel
pub struct PerformanceProfiler {
    config: Arc<RwLock<ProfilingConfig>>,
    metrics: Arc<RwLock<PerformanceMetrics>>,
    operation_timings: Arc<RwLock<HashMap<String, Vec<Duration>>>>,
    baseline_metrics: Option<PerformanceMetrics>,
    start_time: Instant,
}

impl PerformanceProfiler {
    pub fn new() -> Self {
        Self {
            config: Arc::new(RwLock::new(ProfilingConfig::default())),
            metrics: Arc::new(RwLock::new(PerformanceMetrics::default())),
            operation_timings: Arc::new(RwLock::new(HashMap::new())),
            baseline_metrics: None,
            start_time: Instant::now(),
        }
    }

    /// Enable profiling with specific configuration
    pub fn enable(&self, config: ProfilingConfig) {
        *self.config.write().unwrap() = config;
        if config.enabled {
            println!("🔍 Performance profiling enabled");
            println!("   Sample rate: {}%", config.sample_rate * 100.0);
            println!("   Detailed tracing: {}", config.detailed_tracing);
        }
    }

    /// Disable profiling
    pub fn disable(&self) {
        self.config.write().unwrap().enabled = false;
        println!("🔍 Performance profiling disabled");
    }

    /// Check if we should profile this operation (based on sample rate)
    fn should_profile(&self) -> bool {
        let config = self.config.read().unwrap();
        config.enabled && (rand::random::<f64>() < config.sample_rate)
    }

    /// Record a coherence calculation
    pub fn record_coherence_calculation(&self, duration: Duration) {
        if !self.should_profile() { return; }
        
        let mut metrics = self.metrics.write().unwrap();
        metrics.coherence_calculations += 1;
        metrics.total_coherence_time += duration;

        if self.config.read().unwrap().detailed_tracing {
            self.operation_timings.write().unwrap()
                .entry("coherence_calculation".to_string())
                .or_insert_with(Vec::new)
                .push(duration);
        }
    }

    /// Record cache hit/miss
    pub fn record_cache_access(&self, hit: bool) {
        if !self.should_profile() { return; }
        
        let mut metrics = self.metrics.write().unwrap();
        if hit {
            metrics.coherence_cache_hits += 1;
        } else {
            metrics.coherence_cache_misses += 1;
        }
    }

    /// Record sacred interrupt
    pub fn record_sacred_interrupt(&self) {
        if !self.should_profile() { return; }
        
        self.metrics.write().unwrap().sacred_interrupts += 1;
    }

    /// Record context switch
    pub fn record_context_switch(&self, duration: Duration) {
        if !self.should_profile() { return; }
        
        let mut metrics = self.metrics.write().unwrap();
        metrics.context_switches += 1;
        metrics.total_scheduling_time += duration;
    }

    /// Record vortex creation/destruction
    pub fn record_vortex_lifecycle(&self, created: bool) {
        if !self.should_profile() { return; }
        
        let mut metrics = self.metrics.write().unwrap();
        if created {
            metrics.vortex_creations += 1;
        } else {
            metrics.vortex_destructions += 1;
        }
    }

    /// Record entanglement operation
    pub fn record_entanglement(&self) {
        if !self.should_profile() { return; }
        
        self.metrics.write().unwrap().entanglement_operations += 1;
    }

    /// Record field update
    pub fn record_field_update(&self, duration: Duration) {
        if !self.should_profile() { return; }
        
        let mut metrics = self.metrics.write().unwrap();
        metrics.field_updates += 1;
        metrics.total_coherence_time += duration;
    }

    /// Establish baseline metrics (no consciousness features)
    pub fn establish_baseline(&mut self) {
        println!("📊 Establishing performance baseline...");
        
        // Reset metrics
        *self.metrics.write().unwrap() = PerformanceMetrics::default();
        
        // Run baseline operations
        let start = Instant::now();
        for _ in 0..10000 {
            // Simulate basic operations without consciousness overhead
            thread::yield_now();
        }
        let baseline_duration = start.elapsed();
        
        println!("   Baseline established: {:?} for 10k operations", baseline_duration);
        self.baseline_metrics = Some(self.metrics.read().unwrap().clone());
    }

    /// Generate performance report
    pub fn generate_report(&self) -> PerformanceReport {
        let metrics = self.metrics.read().unwrap().clone();
        let elapsed = self.start_time.elapsed();
        
        let cache_hit_rate = if metrics.coherence_cache_hits + metrics.coherence_cache_misses > 0 {
            metrics.coherence_cache_hits as f64 / 
            (metrics.coherence_cache_hits + metrics.coherence_cache_misses) as f64
        } else {
            0.0
        };

        let avg_coherence_time = if metrics.coherence_calculations > 0 {
            metrics.total_coherence_time / metrics.coherence_calculations as u32
        } else {
            Duration::ZERO
        };

        let avg_scheduling_time = if metrics.context_switches > 0 {
            metrics.total_scheduling_time / metrics.context_switches as u32
        } else {
            Duration::ZERO
        };

        PerformanceReport {
            elapsed_time: elapsed,
            metrics: metrics.clone(),
            cache_hit_rate,
            avg_coherence_time,
            avg_scheduling_time,
            operations_per_second: self.calculate_ops_per_second(&metrics, elapsed),
            consciousness_overhead: self.calculate_overhead(&metrics),
            recommendations: self.generate_recommendations(&metrics, cache_hit_rate),
        }
    }

    /// Calculate operations per second
    fn calculate_ops_per_second(&self, metrics: &PerformanceMetrics, elapsed: Duration) -> f64 {
        let total_ops = metrics.coherence_calculations + 
                       metrics.context_switches + 
                       metrics.field_updates;
        
        if elapsed.as_secs() > 0 {
            total_ops as f64 / elapsed.as_secs_f64()
        } else {
            0.0
        }
    }

    /// Calculate consciousness overhead percentage
    fn calculate_overhead(&self, metrics: &PerformanceMetrics) -> f64 {
        if let Some(baseline) = &self.baseline_metrics {
            let consciousness_time = metrics.total_coherence_time + 
                                   metrics.total_scheduling_time;
            let baseline_time = baseline.total_coherence_time + 
                              baseline.total_scheduling_time;
            
            if baseline_time.as_nanos() > 0 {
                ((consciousness_time.as_nanos() - baseline_time.as_nanos()) as f64 / 
                 baseline_time.as_nanos() as f64) * 100.0
            } else {
                0.0
            }
        } else {
            0.0
        }
    }

    /// Generate performance recommendations
    fn generate_recommendations(&self, metrics: &PerformanceMetrics, cache_hit_rate: f64) -> Vec<String> {
        let mut recommendations = Vec::new();

        // Cache recommendations
        if cache_hit_rate < 0.8 {
            recommendations.push(format!(
                "Cache hit rate is {:.1}%. Consider increasing cache size or TTL",
                cache_hit_rate * 100.0
            ));
        }

        // Context switch recommendations
        if metrics.context_switches > 1000 {
            let avg_time = metrics.total_scheduling_time / metrics.context_switches as u32;
            if avg_time > Duration::from_micros(100) {
                recommendations.push(
                    "Context switches are taking >100μs. Consider batch switching".to_string()
                );
            }
        }

        // Vortex lifecycle recommendations
        let vortex_churn = metrics.vortex_destructions as f64 / 
                          metrics.vortex_creations.max(1) as f64;
        if vortex_churn > 0.9 {
            recommendations.push(
                "High vortex churn detected. Consider vortex pooling".to_string()
            );
        }

        // Coherence calculation recommendations
        if metrics.coherence_calculations > 10000 {
            let avg_time = metrics.total_coherence_time / metrics.coherence_calculations as u32;
            if avg_time > Duration::from_micros(50) {
                recommendations.push(
                    "Coherence calculations taking >50μs. Enable SIMD optimizations".to_string()
                );
            }
        }

        if recommendations.is_empty() {
            recommendations.push("Performance is optimal! 🌟".to_string());
        }

        recommendations
    }

    /// Export detailed timings for analysis
    pub fn export_timings(&self) -> HashMap<String, Vec<Duration>> {
        self.operation_timings.read().unwrap().clone()
    }

    /// Reset all metrics
    pub fn reset(&self) {
        *self.metrics.write().unwrap() = PerformanceMetrics::default();
        self.operation_timings.write().unwrap().clear();
    }
}

/// Performance report
#[derive(Debug)]
pub struct PerformanceReport {
    pub elapsed_time: Duration,
    pub metrics: PerformanceMetrics,
    pub cache_hit_rate: f64,
    pub avg_coherence_time: Duration,
    pub avg_scheduling_time: Duration,
    pub operations_per_second: f64,
    pub consciousness_overhead: f64,
    pub recommendations: Vec<String>,
}

impl PerformanceReport {
    /// Print a beautiful performance report
    pub fn print(&self) {
        println!("\n╔══════════════════════════════════════════════════════╗");
        println!("║        🌟 PERFORMANCE PROFILING REPORT 🌟            ║");
        println!("╚══════════════════════════════════════════════════════╝");
        
        println!("\n📊 Overall Statistics");
        println!("├─ Elapsed Time: {:?}", self.elapsed_time);
        println!("├─ Operations/sec: {:.0}", self.operations_per_second);
        println!("└─ Consciousness Overhead: {:.1}%", self.consciousness_overhead);

        println!("\n🧮 Operation Counts");
        println!("├─ Coherence Calculations: {}", self.metrics.coherence_calculations);
        println!("├─ Context Switches: {}", self.metrics.context_switches);
        println!("├─ Sacred Interrupts: {}", self.metrics.sacred_interrupts);
        println!("├─ Field Updates: {}", self.metrics.field_updates);
        println!("└─ Entanglements: {}", self.metrics.entanglement_operations);

        println!("\n⚡ Performance Metrics");
        println!("├─ Cache Hit Rate: {:.1}%", self.cache_hit_rate * 100.0);
        println!("├─ Avg Coherence Time: {:?}", self.avg_coherence_time);
        println!("├─ Avg Scheduling Time: {:?}", self.avg_scheduling_time);
        println!("└─ Vortex Churn: {}/{}", 
            self.metrics.vortex_destructions, 
            self.metrics.vortex_creations
        );

        println!("\n💡 Recommendations");
        for (i, rec) in self.recommendations.iter().enumerate() {
            if i == self.recommendations.len() - 1 {
                println!("└─ {}", rec);
            } else {
                println!("├─ {}", rec);
            }
        }

        println!("\n═══════════════════════════════════════════════════════");
    }
}

// Mock rand for deterministic sampling
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
    fn test_profiler_creation() {
        let profiler = PerformanceProfiler::new();
        assert!(!profiler.config.read().unwrap().enabled);
    }

    #[test]
    fn test_profiling_enable_disable() {
        let profiler = PerformanceProfiler::new();
        
        let config = ProfilingConfig {
            enabled: true,
            sample_rate: 0.5,
            ..Default::default()
        };
        
        profiler.enable(config);
        assert!(profiler.config.read().unwrap().enabled);
        
        profiler.disable();
        assert!(!profiler.config.read().unwrap().enabled);
    }

    #[test]
    fn test_metrics_recording() {
        let profiler = PerformanceProfiler::new();
        profiler.enable(ProfilingConfig { enabled: true, ..Default::default() });
        
        profiler.record_coherence_calculation(Duration::from_micros(50));
        profiler.record_cache_access(true);
        profiler.record_cache_access(false);
        
        let metrics = profiler.metrics.read().unwrap();
        assert_eq!(metrics.coherence_calculations, 1);
        assert_eq!(metrics.coherence_cache_hits, 1);
        assert_eq!(metrics.coherence_cache_misses, 1);
    }

    #[test]
    fn test_report_generation() {
        let profiler = PerformanceProfiler::new();
        profiler.enable(ProfilingConfig { enabled: true, ..Default::default() });
        
        // Record some operations
        for _ in 0..100 {
            profiler.record_coherence_calculation(Duration::from_micros(30));
            profiler.record_cache_access(true);
        }
        
        for _ in 0..20 {
            profiler.record_cache_access(false);
        }
        
        let report = profiler.generate_report();
        assert!(report.cache_hit_rate > 0.8);
        assert_eq!(report.metrics.coherence_calculations, 100);
    }
}