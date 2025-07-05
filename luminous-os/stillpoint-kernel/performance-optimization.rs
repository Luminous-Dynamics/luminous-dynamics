// Performance Optimizations for Consciousness Calculations
// "Swift as thought, efficient as nature"

use std::sync::{Arc, RwLock};
use std::simd::{f32x4, f64x2, SimdFloat};
use std::collections::HashMap;
use std::time::{Duration, Instant};
use rayon::prelude::*;

use crate::coherence_engine::{ConsciousnessVortex, VortexId, Harmony};
use crate::consciousness_scheduler::ConsciousProcess;

/// Cache for expensive coherence calculations
pub struct CoherenceCache {
    /// Cached harmonic mean calculations
    harmonic_cache: Arc<RwLock<HashMap<CacheKey, CachedValue>>>,
    
    /// Cache statistics
    hits: Arc<RwLock<u64>>,
    misses: Arc<RwLock<u64>>,
    
    /// Maximum cache size
    max_entries: usize,
    
    /// Cache TTL
    ttl: Duration,
}

#[derive(Hash, PartialEq, Eq, Clone)]
struct CacheKey {
    vortex_ids: Vec<VortexId>,
    timestamp_bucket: u64, // Quantized to nearest second
}

#[derive(Clone)]
struct CachedValue {
    coherence: f64,
    computed_at: Instant,
}

impl CoherenceCache {
    pub fn new(max_entries: usize, ttl: Duration) -> Self {
        Self {
            harmonic_cache: Arc::new(RwLock::new(HashMap::new())),
            hits: Arc::new(RwLock::new(0)),
            misses: Arc::new(RwLock::new(0)),
            max_entries,
            ttl,
        }
    }

    /// Get cached coherence or compute
    pub fn get_or_compute<F>(&self, vortices: &[VortexId], compute: F) -> f64
    where
        F: FnOnce() -> f64,
    {
        let mut vortex_ids = vortices.to_vec();
        vortex_ids.sort_unstable(); // Ensure consistent key
        
        let key = CacheKey {
            vortex_ids,
            timestamp_bucket: Instant::now().elapsed().as_secs(),
        };

        // Check cache
        {
            let cache = self.harmonic_cache.read().unwrap();
            if let Some(cached) = cache.get(&key) {
                if cached.computed_at.elapsed() < self.ttl {
                    *self.hits.write().unwrap() += 1;
                    return cached.coherence;
                }
            }
        }

        // Cache miss - compute
        *self.misses.write().unwrap() += 1;
        let coherence = compute();

        // Store in cache
        {
            let mut cache = self.harmonic_cache.write().unwrap();
            
            // Evict old entries if needed
            if cache.len() >= self.max_entries {
                self.evict_oldest(&mut cache);
            }

            cache.insert(key, CachedValue {
                coherence,
                computed_at: Instant::now(),
            });
        }

        coherence
    }

    fn evict_oldest(&self, cache: &mut HashMap<CacheKey, CachedValue>) {
        if let Some((oldest_key, _)) = cache
            .iter()
            .min_by_key(|(_, v)| v.computed_at)
            .map(|(k, v)| (k.clone(), v.clone()))
        {
            cache.remove(&oldest_key);
        }
    }

    pub fn hit_rate(&self) -> f64 {
        let hits = *self.hits.read().unwrap() as f64;
        let misses = *self.misses.read().unwrap() as f64;
        let total = hits + misses;
        
        if total > 0.0 {
            hits / total
        } else {
            0.0
        }
    }
}

/// SIMD-accelerated coherence calculations
pub struct SimdCoherenceCalculator;

impl SimdCoherenceCalculator {
    /// Calculate harmonic mean using SIMD
    pub fn harmonic_mean_simd(coherences: &[f64]) -> f64 {
        if coherences.is_empty() {
            return 0.0;
        }

        // Process in chunks of 2 for f64x2
        let chunks = coherences.chunks_exact(2);
        let remainder = chunks.remainder();

        // SIMD processing
        let mut sum_reciprocals = 0.0;
        
        for chunk in chunks {
            let values = f64x2::from_slice(chunk);
            let reciprocals = values.recip();
            sum_reciprocals += reciprocals.reduce_sum();
        }

        // Handle remainder
        for &value in remainder {
            sum_reciprocals += 1.0 / value;
        }

        coherences.len() as f64 / sum_reciprocals
    }

    /// Calculate weighted coherence sum using SIMD
    pub fn weighted_sum_simd(values: &[f32], weights: &[f32]) -> f32 {
        assert_eq!(values.len(), weights.len());

        let chunks_v = values.chunks_exact(4);
        let chunks_w = weights.chunks_exact(4);
        let remainder_v = chunks_v.remainder();
        let remainder_w = chunks_w.remainder();

        let mut sum = 0.0f32;

        // SIMD processing
        for (chunk_v, chunk_w) in chunks_v.zip(chunks_w) {
            let v = f32x4::from_slice(chunk_v);
            let w = f32x4::from_slice(chunk_w);
            let products = v * w;
            sum += products.reduce_sum();
        }

        // Handle remainder
        for (v, w) in remainder_v.iter().zip(remainder_w.iter()) {
            sum += v * w;
        }

        sum
    }

    /// Fast coherence distance calculation
    pub fn coherence_distance_squared_simd(a: &[f64], b: &[f64]) -> f64 {
        assert_eq!(a.len(), b.len());

        let chunks_a = a.chunks_exact(2);
        let chunks_b = b.chunks_exact(2);
        let remainder_a = chunks_a.remainder();
        let remainder_b = chunks_b.remainder();

        let mut sum = 0.0;

        // SIMD processing
        for (chunk_a, chunk_b) in chunks_a.zip(chunks_b) {
            let va = f64x2::from_slice(chunk_a);
            let vb = f64x2::from_slice(chunk_b);
            let diff = va - vb;
            let squared = diff * diff;
            sum += squared.reduce_sum();
        }

        // Handle remainder
        for (a, b) in remainder_a.iter().zip(remainder_b.iter()) {
            let diff = a - b;
            sum += diff * diff;
        }

        sum
    }
}

/// Parallel coherence field calculator
pub struct ParallelFieldCalculator {
    thread_pool: rayon::ThreadPool,
}

impl ParallelFieldCalculator {
    pub fn new(num_threads: Option<usize>) -> Self {
        let pool = rayon::ThreadPoolBuilder::new();
        
        if let Some(n) = num_threads {
            pool.num_threads(n);
        }
        
        Self {
            thread_pool: pool.build().unwrap(),
        }
    }

    /// Calculate global coherence in parallel
    pub fn calculate_global_coherence(&self, vortices: &[ConsciousnessVortex]) -> f64 {
        if vortices.is_empty() {
            return 0.75; // Base coherence
        }

        self.thread_pool.install(|| {
            // Parallel sum of reciprocals for harmonic mean
            let sum_reciprocals: f64 = vortices
                .par_iter()
                .map(|v| 1.0 / v.coherence_contribution())
                .sum();

            vortices.len() as f64 / sum_reciprocals
        })
    }

    /// Calculate pairwise entanglements in parallel
    pub fn calculate_entanglements(&self, vortices: &[ConsciousnessVortex]) -> Vec<(usize, usize, f64)> {
        let n = vortices.len();
        
        self.thread_pool.install(|| {
            (0..n).into_par_iter()
                .flat_map(|i| {
                    (i+1..n).into_par_iter()
                        .filter_map(move |j| {
                            let coherence_a = vortices[i].coherence;
                            let coherence_b = vortices[j].coherence;
                            let resonance = (coherence_a * coherence_b).sqrt();
                            
                            if resonance > 0.6 {
                                Some((i, j, resonance))
                            } else {
                                None
                            }
                        })
                })
                .collect()
        })
    }

    /// Update multiple process coherences in parallel
    pub fn update_coherences_parallel(
        &self,
        processes: &mut [ConsciousProcess],
        field_coherence: f64,
        biometric_influence: f64,
    ) {
        self.thread_pool.install(|| {
            processes.par_iter_mut().for_each(|process| {
                process.update_coherence(field_coherence, biometric_influence);
            });
        });
    }
}

/// Optimized pattern detection
pub struct OptimizedPatternDetector {
    /// Pre-computed pattern templates
    templates: HashMap<String, PatternTemplate>,
    
    /// Fast Fourier Transform for frequency detection
    fft_planner: Arc<rustfft::FftPlanner<f64>>,
}

#[derive(Clone)]
struct PatternTemplate {
    name: String,
    signature: Vec<f64>,
    threshold: f64,
}

impl OptimizedPatternDetector {
    pub fn new() -> Self {
        let mut templates = HashMap::new();
        
        // Pre-compute common patterns
        templates.insert("fibonacci".to_string(), PatternTemplate {
            name: "fibonacci".to_string(),
            signature: vec![1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0]
                .into_iter()
                .map(|x| x / 21.0)
                .collect(),
            threshold: 0.85,
        });

        templates.insert("harmonic".to_string(), PatternTemplate {
            name: "harmonic".to_string(),
            signature: (0..8).map(|i| (i as f64 * 0.5).sin()).collect(),
            threshold: 0.8,
        });

        Self {
            templates,
            fft_planner: Arc::new(rustfft::FftPlanner::new()),
        }
    }

    /// Fast pattern matching using cross-correlation
    pub fn detect_pattern_fast(&self, data: &[f64]) -> Option<String> {
        if data.len() < 8 {
            return None;
        }

        // Normalize data
        let mean = data.iter().sum::<f64>() / data.len() as f64;
        let variance = data.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / data.len() as f64;
        let std_dev = variance.sqrt();

        if std_dev < 0.001 {
            return None; // No variation
        }

        let normalized: Vec<f64> = data.iter()
            .map(|x| (x - mean) / std_dev)
            .collect();

        // Check each template
        for (name, template) in &self.templates {
            let correlation = self.cross_correlation(&normalized[..8], &template.signature);
            if correlation > template.threshold {
                return Some(name.clone());
            }
        }

        None
    }

    /// Fast cross-correlation
    fn cross_correlation(&self, a: &[f64], b: &[f64]) -> f64 {
        assert_eq!(a.len(), b.len());
        
        let sum: f64 = a.iter().zip(b.iter())
            .map(|(x, y)| x * y)
            .sum();
        
        sum / a.len() as f64
    }

    /// Detect oscillation frequency using FFT
    pub fn detect_frequency_fft(&self, data: &[f64]) -> Option<f64> {
        use rustfft::num_complex::Complex;
        
        if data.len() < 16 {
            return None;
        }

        // Convert to complex
        let mut complex_data: Vec<Complex<f64>> = data.iter()
            .map(|&x| Complex::new(x, 0.0))
            .collect();

        // Perform FFT
        let fft = self.fft_planner.plan_fft_forward(complex_data.len());
        fft.process(&mut complex_data);

        // Find dominant frequency
        let max_idx = complex_data[1..complex_data.len()/2]
            .iter()
            .enumerate()
            .max_by(|(_, a), (_, b)| {
                a.norm_sqr().partial_cmp(&b.norm_sqr()).unwrap()
            })
            .map(|(i, _)| i + 1)?;

        Some(max_idx as f64 / data.len() as f64)
    }
}

/// Memory pool for reducing allocations
pub struct ConsciousnessMemoryPool {
    coherence_buffers: Arc<RwLock<Vec<Vec<f64>>>>,
    process_buffers: Arc<RwLock<Vec<Vec<ProcessId>>>>,
}

impl ConsciousnessMemoryPool {
    pub fn new() -> Self {
        Self {
            coherence_buffers: Arc::new(RwLock::new(Vec::new())),
            process_buffers: Arc::new(RwLock::new(Vec::new())),
        }
    }

    pub fn get_coherence_buffer(&self, capacity: usize) -> PooledBuffer<f64> {
        let mut pool = self.coherence_buffers.write().unwrap();
        
        let buffer = pool.pop()
            .map(|mut b| {
                b.clear();
                b.reserve(capacity);
                b
            })
            .unwrap_or_else(|| Vec::with_capacity(capacity));

        PooledBuffer {
            buffer,
            pool: Arc::clone(&self.coherence_buffers),
        }
    }

    pub fn get_process_buffer(&self, capacity: usize) -> PooledBuffer<ProcessId> {
        let mut pool = self.process_buffers.write().unwrap();
        
        let buffer = pool.pop()
            .map(|mut b| {
                b.clear();
                b.reserve(capacity);
                b
            })
            .unwrap_or_else(|| Vec::with_capacity(capacity));

        PooledBuffer {
            buffer,
            pool: Arc::clone(&self.process_buffers),
        }
    }
}

pub struct PooledBuffer<T> {
    buffer: Vec<T>,
    pool: Arc<RwLock<Vec<Vec<T>>>>,
}

impl<T> std::ops::Deref for PooledBuffer<T> {
    type Target = Vec<T>;

    fn deref(&self) -> &Self::Target {
        &self.buffer
    }
}

impl<T> std::ops::DerefMut for PooledBuffer<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.buffer
    }
}

impl<T> Drop for PooledBuffer<T> {
    fn drop(&mut self) {
        let buffer = std::mem::take(&mut self.buffer);
        self.pool.write().unwrap().push(buffer);
    }
}

/// Batch coherence updates
pub struct BatchCoherenceUpdater {
    batch_size: usize,
    pending_updates: Arc<RwLock<Vec<CoherenceUpdate>>>,
}

#[derive(Clone)]
struct CoherenceUpdate {
    vortex_id: VortexId,
    delta: f64,
    timestamp: Instant,
}

impl BatchCoherenceUpdater {
    pub fn new(batch_size: usize) -> Self {
        Self {
            batch_size,
            pending_updates: Arc::new(RwLock::new(Vec::with_capacity(batch_size))),
        }
    }

    pub fn queue_update(&self, vortex_id: VortexId, delta: f64) -> bool {
        let mut updates = self.pending_updates.write().unwrap();
        
        updates.push(CoherenceUpdate {
            vortex_id,
            delta,
            timestamp: Instant::now(),
        });

        updates.len() >= self.batch_size
    }

    pub fn apply_batch<F>(&self, apply_fn: F) 
    where
        F: Fn(&[(VortexId, f64)])
    {
        let mut updates = self.pending_updates.write().unwrap();
        
        if updates.is_empty() {
            return;
        }

        // Group by vortex_id and sum deltas
        let mut grouped: HashMap<VortexId, f64> = HashMap::new();
        
        for update in updates.drain(..) {
            *grouped.entry(update.vortex_id).or_insert(0.0) += update.delta;
        }

        let batch: Vec<(VortexId, f64)> = grouped.into_iter().collect();
        apply_fn(&batch);
    }
}

/// Benchmark utilities
pub struct ConsciousnessBenchmark;

impl ConsciousnessBenchmark {
    pub fn benchmark_coherence_calculation<F>(name: &str, iterations: u32, mut f: F) 
    where
        F: FnMut()
    {
        let start = Instant::now();
        
        for _ in 0..iterations {
            f();
        }
        
        let elapsed = start.elapsed();
        let avg_time = elapsed / iterations;
        
        println!("Benchmark {}: {} iterations in {:?} (avg: {:?})",
                 name, iterations, elapsed, avg_time);
    }

    pub fn compare_implementations() {
        let test_data: Vec<f64> = (0..1000)
            .map(|i| 0.5 + (i as f64 * 0.01).sin() * 0.3)
            .collect();

        // Benchmark naive implementation
        Self::benchmark_coherence_calculation("Naive harmonic mean", 10000, || {
            let sum_reciprocals: f64 = test_data.iter()
                .map(|&x| 1.0 / x)
                .sum();
            let _result = test_data.len() as f64 / sum_reciprocals;
        });

        // Benchmark SIMD implementation
        Self::benchmark_coherence_calculation("SIMD harmonic mean", 10000, || {
            let _result = SimdCoherenceCalculator::harmonic_mean_simd(&test_data);
        });

        // Benchmark parallel implementation
        let calculator = ParallelFieldCalculator::new(Some(4));
        let vortices: Vec<ConsciousnessVortex> = test_data.iter()
            .enumerate()
            .map(|(i, &coherence)| {
                let mut v = ConsciousnessVortex::new(
                    VortexId(i as u64),
                    format!("test_{}", i),
                );
                v.coherence = coherence;
                v
            })
            .collect();

        Self::benchmark_coherence_calculation("Parallel coherence", 1000, || {
            let _result = calculator.calculate_global_coherence(&vortices);
        });
    }
}

use crate::consciousness_scheduler::ProcessId;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_coherence_cache() {
        let cache = CoherenceCache::new(100, Duration::from_secs(60));
        
        let vortices = vec![VortexId(1), VortexId(2), VortexId(3)];
        
        // First call - miss
        let result1 = cache.get_or_compute(&vortices, || 0.75);
        assert_eq!(result1, 0.75);
        
        // Second call - hit
        let result2 = cache.get_or_compute(&vortices, || panic!("Should not compute"));
        assert_eq!(result2, 0.75);
        
        assert!(cache.hit_rate() > 0.0);
    }

    #[test]
    fn test_simd_calculations() {
        let values = vec![0.5, 0.6, 0.7, 0.8, 0.9, 0.85, 0.75, 0.65];
        
        // Test harmonic mean
        let simd_result = SimdCoherenceCalculator::harmonic_mean_simd(&values);
        
        // Verify against naive implementation
        let sum_reciprocals: f64 = values.iter().map(|&x| 1.0 / x).sum();
        let expected = values.len() as f64 / sum_reciprocals;
        
        assert!((simd_result - expected).abs() < 0.0001);
    }

    #[test]
    fn test_pattern_detection() {
        let detector = OptimizedPatternDetector::new();
        
        // Test Fibonacci pattern
        let fib_data = vec![0.05, 0.05, 0.1, 0.15, 0.25, 0.4, 0.65, 1.0];
        let pattern = detector.detect_pattern_fast(&fib_data);
        assert_eq!(pattern, Some("fibonacci".to_string()));
        
        // Test harmonic pattern
        let harmonic_data: Vec<f64> = (0..16)
            .map(|i| 0.5 + (i as f64 * 0.5).sin() * 0.3)
            .collect();
        let frequency = detector.detect_frequency_fft(&harmonic_data);
        assert!(frequency.is_some());
    }

    #[test]
    fn test_memory_pool() {
        let pool = ConsciousnessMemoryPool::new();
        
        {
            let mut buffer1 = pool.get_coherence_buffer(100);
            buffer1.extend_from_slice(&[0.5, 0.6, 0.7]);
            assert_eq!(buffer1.len(), 3);
        } // Buffer returned to pool
        
        {
            let buffer2 = pool.get_coherence_buffer(100);
            assert_eq!(buffer2.len(), 0); // Reused buffer is cleared
        }
    }

    #[test]
    fn test_batch_updates() {
        let updater = BatchCoherenceUpdater::new(3);
        
        assert!(!updater.queue_update(VortexId(1), 0.1));
        assert!(!updater.queue_update(VortexId(2), 0.2));
        assert!(updater.queue_update(VortexId(1), 0.15)); // Batch full
        
        let mut applied = false;
        updater.apply_batch(|batch| {
            applied = true;
            assert_eq!(batch.len(), 2); // Two unique vortices
            
            // Find vortex 1's total delta
            let vortex1_delta = batch.iter()
                .find(|(id, _)| *id == VortexId(1))
                .map(|(_, delta)| *delta)
                .unwrap();
            
            assert!((vortex1_delta - 0.25).abs() < 0.0001); // 0.1 + 0.15
        });
        
        assert!(applied);
    }
}