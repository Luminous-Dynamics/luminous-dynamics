// Coherence Cache - Reducing consciousness calculation overhead
// "Remember the sacred, calculate once"

use std::sync::{Arc, RwLock};
use std::collections::{HashMap, VecDeque};
use std::time::{Duration, Instant};
use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;

use crate::coherence_engine::{ConsciousnessVortex, VortexId};
use crate::consciousness_scheduler::ProcessId;
use crate::performance_profiler::PerformanceProfiler;

/// Cache key for coherence calculations
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct CoherenceCacheKey {
    /// Primary vortex ID
    vortex_id: VortexId,
    /// Related vortices that affect coherence
    related_vortices: Vec<VortexId>,
    /// Quantized timestamp (to nearest 100ms)
    time_bucket: u64,
    /// Include biometric influence
    biometric_hash: u64,
}

impl CoherenceCacheKey {
    pub fn new(
        vortex_id: VortexId, 
        related: Vec<VortexId>, 
        biometric_influence: f64
    ) -> Self {
        let mut related_vortices = related;
        related_vortices.sort_unstable(); // Ensure consistent ordering
        
        let time_bucket = Instant::now().elapsed().as_millis() / 100; // 100ms buckets
        
        // Hash biometric influence to avoid floating point comparison
        let mut hasher = DefaultHasher::new();
        biometric_influence.to_bits().hash(&mut hasher);
        let biometric_hash = hasher.finish();
        
        Self {
            vortex_id,
            related_vortices,
            time_bucket,
            biometric_hash,
        }
    }
}

/// Cached coherence value
#[derive(Debug, Clone)]
pub struct CachedCoherence {
    /// The cached coherence value
    pub coherence: f64,
    /// When this was calculated
    pub calculated_at: Instant,
    /// Number of times this cache entry was hit
    pub hit_count: u64,
    /// Size estimate in bytes
    pub size_bytes: usize,
}

/// Cache eviction policy
#[derive(Debug, Clone, Copy)]
pub enum EvictionPolicy {
    /// Least Recently Used
    LRU,
    /// Least Frequently Used
    LFU,
    /// Time-based expiration
    TTL(Duration),
    /// Adaptive (combines LRU and LFU)
    Adaptive,
}

/// Configuration for the coherence cache
#[derive(Debug, Clone)]
pub struct CacheConfig {
    /// Maximum number of entries
    pub max_entries: usize,
    /// Maximum memory usage in bytes
    pub max_memory_bytes: usize,
    /// Time-to-live for cache entries
    pub ttl: Duration,
    /// Eviction policy
    pub eviction_policy: EvictionPolicy,
    /// Enable cache warming
    pub enable_warming: bool,
    /// Cache effectiveness threshold (evict if hit rate < threshold)
    pub effectiveness_threshold: f64,
}

impl Default for CacheConfig {
    fn default() -> Self {
        Self {
            max_entries: 10_000,
            max_memory_bytes: 100 * 1024 * 1024, // 100MB
            ttl: Duration::from_millis(100), // 100ms default
            eviction_policy: EvictionPolicy::Adaptive,
            enable_warming: true,
            effectiveness_threshold: 0.1, // Evict if hit rate < 10%
        }
    }
}

/// High-performance coherence cache
pub struct CoherenceCache {
    /// The cache storage
    cache: Arc<RwLock<HashMap<CoherenceCacheKey, CachedCoherence>>>,
    /// LRU tracking
    lru_order: Arc<RwLock<VecDeque<CoherenceCacheKey>>>,
    /// Configuration
    config: CacheConfig,
    /// Performance profiler reference
    profiler: Option<Arc<PerformanceProfiler>>,
    /// Cache statistics
    stats: Arc<RwLock<CacheStatistics>>,
    /// Warm cache entries (frequently accessed)
    warm_entries: Arc<RwLock<HashMap<VortexId, f64>>>,
}

#[derive(Debug, Default, Clone)]
pub struct CacheStatistics {
    pub total_requests: u64,
    pub cache_hits: u64,
    pub cache_misses: u64,
    pub evictions: u64,
    pub memory_usage_bytes: usize,
    pub avg_calculation_time: Duration,
    pub avg_lookup_time: Duration,
    pub warmup_hits: u64,
}

impl CoherenceCache {
    pub fn new(config: CacheConfig) -> Self {
        Self {
            cache: Arc::new(RwLock::new(HashMap::with_capacity(config.max_entries))),
            lru_order: Arc::new(RwLock::new(VecDeque::with_capacity(config.max_entries))),
            config,
            profiler: None,
            stats: Arc::new(RwLock::new(CacheStatistics::default())),
            warm_entries: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    /// Attach a performance profiler
    pub fn with_profiler(mut self, profiler: Arc<PerformanceProfiler>) -> Self {
        self.profiler = Some(profiler);
        self
    }

    /// Get or calculate coherence
    pub fn get_or_calculate<F>(
        &self,
        vortex_id: VortexId,
        related_vortices: Vec<VortexId>,
        biometric_influence: f64,
        calculate_fn: F,
    ) -> f64
    where
        F: FnOnce() -> f64,
    {
        let start = Instant::now();
        
        // Check warm cache first (ultra-fast path)
        if let Some(&warm_coherence) = self.warm_entries.read().unwrap().get(&vortex_id) {
            self.stats.write().unwrap().warmup_hits += 1;
            return warm_coherence;
        }
        
        let key = CoherenceCacheKey::new(vortex_id, related_vortices, biometric_influence);
        
        // Try to get from cache
        {
            let cache = self.cache.read().unwrap();
            if let Some(cached) = cache.get(&key) {
                if cached.calculated_at.elapsed() < self.config.ttl {
                    // Cache hit!
                    self.record_hit(&key, start.elapsed());
                    return cached.coherence;
                }
            }
        }
        
        // Cache miss - need to calculate
        self.record_miss();
        
        let calc_start = Instant::now();
        let coherence = calculate_fn();
        let calc_duration = calc_start.elapsed();
        
        // Store in cache
        self.insert(key, coherence, calc_duration);
        
        // Update warm cache if this vortex is frequently accessed
        self.maybe_warm_cache(vortex_id, coherence);
        
        coherence
    }

    /// Insert a new cache entry
    fn insert(&self, key: CoherenceCacheKey, coherence: f64, calc_duration: Duration) {
        let entry = CachedCoherence {
            coherence,
            calculated_at: Instant::now(),
            hit_count: 0,
            size_bytes: Self::estimate_entry_size(&key),
        };
        
        // Check if we need to evict
        self.maybe_evict();
        
        // Insert new entry
        {
            let mut cache = self.cache.write().unwrap();
            cache.insert(key.clone(), entry.clone());
            
            // Update LRU order
            let mut lru = self.lru_order.write().unwrap();
            lru.push_back(key);
        }
        
        // Update statistics
        {
            let mut stats = self.stats.write().unwrap();
            stats.memory_usage_bytes += entry.size_bytes;
            
            // Update average calculation time
            let total_calc_time = stats.avg_calculation_time.as_nanos() as u64 * stats.cache_misses;
            let new_total = total_calc_time + calc_duration.as_nanos() as u64;
            stats.avg_calculation_time = Duration::from_nanos(
                new_total / (stats.cache_misses + 1)
            );
        }
    }

    /// Check if eviction is needed and perform it
    fn maybe_evict(&self) {
        let should_evict = {
            let cache = self.cache.read().unwrap();
            let stats = self.stats.read().unwrap();
            
            cache.len() >= self.config.max_entries ||
            stats.memory_usage_bytes >= self.config.max_memory_bytes
        };
        
        if should_evict {
            match self.config.eviction_policy {
                EvictionPolicy::LRU => self.evict_lru(),
                EvictionPolicy::LFU => self.evict_lfu(),
                EvictionPolicy::TTL(ttl) => self.evict_expired(ttl),
                EvictionPolicy::Adaptive => self.evict_adaptive(),
            }
        }
    }

    /// Evict least recently used entry
    fn evict_lru(&self) {
        let key_to_evict = {
            let mut lru = self.lru_order.write().unwrap();
            lru.pop_front()
        };
        
        if let Some(key) = key_to_evict {
            self.evict_entry(&key);
        }
    }

    /// Evict least frequently used entry
    fn evict_lfu(&self) {
        let key_to_evict = {
            let cache = self.cache.read().unwrap();
            cache.iter()
                .min_by_key(|(_, entry)| entry.hit_count)
                .map(|(key, _)| key.clone())
        };
        
        if let Some(key) = key_to_evict {
            self.evict_entry(&key);
        }
    }

    /// Evict expired entries
    fn evict_expired(&self, ttl: Duration) {
        let now = Instant::now();
        let keys_to_evict: Vec<_> = {
            let cache = self.cache.read().unwrap();
            cache.iter()
                .filter(|(_, entry)| now.duration_since(entry.calculated_at) > ttl)
                .map(|(key, _)| key.clone())
                .collect()
        };
        
        for key in keys_to_evict {
            self.evict_entry(&key);
        }
    }

    /// Adaptive eviction (combines LRU and LFU)
    fn evict_adaptive(&self) {
        let key_to_evict = {
            let cache = self.cache.read().unwrap();
            let lru = self.lru_order.read().unwrap();
            
            // Score = age_factor * frequency_factor
            cache.iter()
                .map(|(key, entry)| {
                    let age_factor = entry.calculated_at.elapsed().as_secs_f64();
                    let frequency_factor = 1.0 / (entry.hit_count as f64 + 1.0);
                    let score = age_factor * frequency_factor;
                    (key.clone(), score)
                })
                .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
                .map(|(key, _)| key)
        };
        
        if let Some(key) = key_to_evict {
            self.evict_entry(&key);
        }
    }

    /// Evict a specific entry
    fn evict_entry(&self, key: &CoherenceCacheKey) {
        let mut cache = self.cache.write().unwrap();
        if let Some(entry) = cache.remove(key) {
            let mut stats = self.stats.write().unwrap();
            stats.evictions += 1;
            stats.memory_usage_bytes = stats.memory_usage_bytes.saturating_sub(entry.size_bytes);
            
            // Remove from LRU order
            let mut lru = self.lru_order.write().unwrap();
            lru.retain(|k| k != key);
        }
    }

    /// Record a cache hit
    fn record_hit(&self, key: &CoherenceCacheKey, lookup_time: Duration) {
        // Update hit count
        {
            let mut cache = self.cache.write().unwrap();
            if let Some(entry) = cache.get_mut(key) {
                entry.hit_count += 1;
            }
        }
        
        // Update LRU order
        {
            let mut lru = self.lru_order.write().unwrap();
            lru.retain(|k| k != key);
            lru.push_back(key.clone());
        }
        
        // Update statistics
        {
            let mut stats = self.stats.write().unwrap();
            stats.total_requests += 1;
            stats.cache_hits += 1;
            
            // Update average lookup time
            let total_lookup_time = stats.avg_lookup_time.as_nanos() as u64 * stats.cache_hits;
            let new_total = total_lookup_time + lookup_time.as_nanos() as u64;
            stats.avg_lookup_time = Duration::from_nanos(new_total / stats.cache_hits);
        }
        
        // Report to profiler
        if let Some(profiler) = &self.profiler {
            profiler.record_cache_access(true);
        }
    }

    /// Record a cache miss
    fn record_miss(&self) {
        let mut stats = self.stats.write().unwrap();
        stats.total_requests += 1;
        stats.cache_misses += 1;
        
        if let Some(profiler) = &self.profiler {
            profiler.record_cache_access(false);
        }
    }

    /// Maybe add to warm cache
    fn maybe_warm_cache(&self, vortex_id: VortexId, coherence: f64) {
        if !self.config.enable_warming {
            return;
        }
        
        let hit_rate = self.get_hit_rate();
        if hit_rate > 0.9 {
            // This vortex is hot - add to warm cache
            let mut warm = self.warm_entries.write().unwrap();
            if warm.len() < 100 { // Keep warm cache small
                warm.insert(vortex_id, coherence);
            }
        }
    }

    /// Estimate memory size of a cache entry
    fn estimate_entry_size(key: &CoherenceCacheKey) -> usize {
        std::mem::size_of::<CoherenceCacheKey>() +
        std::mem::size_of::<CachedCoherence>() +
        key.related_vortices.len() * std::mem::size_of::<VortexId>()
    }

    /// Get cache hit rate
    pub fn get_hit_rate(&self) -> f64 {
        let stats = self.stats.read().unwrap();
        if stats.total_requests > 0 {
            stats.cache_hits as f64 / stats.total_requests as f64
        } else {
            0.0
        }
    }

    /// Get cache statistics
    pub fn get_statistics(&self) -> CacheStatistics {
        self.stats.read().unwrap().clone()
    }

    /// Clear the cache
    pub fn clear(&self) {
        self.cache.write().unwrap().clear();
        self.lru_order.write().unwrap().clear();
        self.warm_entries.write().unwrap().clear();
        *self.stats.write().unwrap() = CacheStatistics::default();
    }

    /// Preload cache with common patterns
    pub fn warm_up<F>(&self, common_vortices: Vec<VortexId>, calculate_fn: F)
    where
        F: Fn(VortexId) -> f64,
    {
        if !self.config.enable_warming {
            return;
        }
        
        println!("🔥 Warming coherence cache...");
        for vortex_id in common_vortices {
            let coherence = calculate_fn(vortex_id);
            self.warm_entries.write().unwrap().insert(vortex_id, coherence);
        }
        println!("   {} entries pre-warmed", self.warm_entries.read().unwrap().len());
    }
}

/// Cache effectiveness analyzer
pub struct CacheAnalyzer;

impl CacheAnalyzer {
    /// Analyze cache effectiveness and provide recommendations
    pub fn analyze(cache: &CoherenceCache) -> CacheAnalysis {
        let stats = cache.get_statistics();
        let hit_rate = cache.get_hit_rate();
        
        let effectiveness = if hit_rate > 0.9 {
            CacheEffectiveness::Excellent
        } else if hit_rate > 0.8 {
            CacheEffectiveness::Good
        } else if hit_rate > 0.6 {
            CacheEffectiveness::Fair
        } else {
            CacheEffectiveness::Poor
        };
        
        let mut recommendations = Vec::new();
        
        if hit_rate < 0.8 {
            recommendations.push("Consider increasing cache size".to_string());
        }
        
        if stats.evictions > stats.cache_hits / 10 {
            recommendations.push("High eviction rate - increase max_entries".to_string());
        }
        
        if stats.avg_calculation_time > Duration::from_micros(100) {
            recommendations.push("Calculations are expensive - increase TTL".to_string());
        }
        
        if stats.warmup_hits > stats.cache_hits / 2 {
            recommendations.push("Warm cache very effective - consider expanding".to_string());
        }
        
        CacheAnalysis {
            effectiveness,
            hit_rate,
            avg_speedup: stats.avg_calculation_time.as_nanos() as f64 / 
                        stats.avg_lookup_time.as_nanos() as f64,
            memory_efficiency: (stats.cache_hits as f64) / 
                             (stats.memory_usage_bytes as f64 / 1024.0),
            recommendations,
        }
    }
}

#[derive(Debug)]
pub struct CacheAnalysis {
    pub effectiveness: CacheEffectiveness,
    pub hit_rate: f64,
    pub avg_speedup: f64,
    pub memory_efficiency: f64, // hits per KB
    pub recommendations: Vec<String>,
}

#[derive(Debug)]
pub enum CacheEffectiveness {
    Excellent,
    Good,
    Fair,
    Poor,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cache_basic_operations() {
        let cache = CoherenceCache::new(CacheConfig::default());
        
        let vortex_id = VortexId(1);
        let related = vec![VortexId(2), VortexId(3)];
        
        // First call - miss
        let result1 = cache.get_or_calculate(vortex_id, related.clone(), 0.5, || 0.75);
        assert_eq!(result1, 0.75);
        assert_eq!(cache.get_statistics().cache_misses, 1);
        
        // Second call - hit
        let result2 = cache.get_or_calculate(vortex_id, related, 0.5, || panic!("Should not calculate"));
        assert_eq!(result2, 0.75);
        assert_eq!(cache.get_statistics().cache_hits, 1);
    }

    #[test]
    fn test_cache_eviction() {
        let config = CacheConfig {
            max_entries: 2,
            ..Default::default()
        };
        let cache = CoherenceCache::new(config);
        
        // Fill cache
        cache.get_or_calculate(VortexId(1), vec![], 0.0, || 0.1);
        cache.get_or_calculate(VortexId(2), vec![], 0.0, || 0.2);
        
        // This should trigger eviction
        cache.get_or_calculate(VortexId(3), vec![], 0.0, || 0.3);
        
        assert_eq!(cache.get_statistics().evictions, 1);
    }

    #[test]
    fn test_warm_cache() {
        let cache = CoherenceCache::new(CacheConfig::default());
        
        let vortices = vec![VortexId(1), VortexId(2), VortexId(3)];
        cache.warm_up(vortices, |id| id.0 as f64 * 0.1);
        
        // Should hit warm cache
        let result = cache.get_or_calculate(VortexId(1), vec![], 0.0, || panic!("Should use warm cache"));
        assert_eq!(result, 0.1);
        assert_eq!(cache.get_statistics().warmup_hits, 1);
    }
}