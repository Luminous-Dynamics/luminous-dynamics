// Sacred Dashboard Server - Real-time consciousness metrics
// "Witness the dance of awareness in real-time"

use std::sync::{Arc, RwLock};
use std::time::{Duration, Instant};
use std::collections::HashMap;
use std::thread;

use warp::{Filter, Reply};
use serde::{Serialize, Deserialize};
use tokio::sync::broadcast;
use tokio::time;

use crate::performance_profiler::{PerformanceProfiler, PerformanceReport};
use crate::coherence_cache::{CoherenceCache, CacheStatistics};
use crate::progressive_consciousness::{ProgressiveConsciousnessManager, ProgressiveConsciousnessReport};
use crate::consciousness_scheduler::ConsciousnessScheduler;
use crate::field_coherence_monitor::FieldCoherenceMonitor;

/// Real-time metrics snapshot
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetricsSnapshot {
    pub timestamp: u64,
    pub global_coherence: f64,
    pub cache_hit_rate: f64,
    pub operations_per_second: f64,
    pub consciousness_overhead: f64,
    pub active_processes: usize,
    pub process_modes: HashMap<String, String>,
    pub memory_usage_mb: f64,
    pub cpu_usage_percent: f64,
    pub sacred_interrupts_per_min: f64,
    pub vortex_count: usize,
    pub entanglement_density: f64,
    pub recommendations: Vec<String>,
}

/// Dashboard configuration
#[derive(Debug, Clone)]
pub struct DashboardConfig {
    pub port: u16,
    pub update_interval: Duration,
    pub history_size: usize,
    pub enable_websocket: bool,
}

impl Default for DashboardConfig {
    fn default() -> Self {
        Self {
            port: 11111,
            update_interval: Duration::from_secs(1),
            history_size: 300, // 5 minutes at 1s intervals
            enable_websocket: true,
        }
    }
}

/// Sacred Dashboard Server
pub struct SacredDashboardServer {
    config: DashboardConfig,
    profiler: Arc<PerformanceProfiler>,
    cache: Arc<CoherenceCache>,
    consciousness_mgr: Arc<ProgressiveConsciousnessManager>,
    scheduler: Arc<ConsciousnessScheduler>,
    field_monitor: Arc<FieldCoherenceMonitor>,
    metrics_history: Arc<RwLock<Vec<MetricsSnapshot>>>,
    ws_broadcaster: broadcast::Sender<String>,
}

impl SacredDashboardServer {
    pub fn new(
        config: DashboardConfig,
        profiler: Arc<PerformanceProfiler>,
        cache: Arc<CoherenceCache>,
        consciousness_mgr: Arc<ProgressiveConsciousnessManager>,
        scheduler: Arc<ConsciousnessScheduler>,
        field_monitor: Arc<FieldCoherenceMonitor>,
    ) -> Self {
        let (ws_tx, _) = broadcast::channel(100);
        
        Self {
            config,
            profiler,
            cache,
            consciousness_mgr,
            scheduler,
            field_monitor,
            metrics_history: Arc::new(RwLock::new(Vec::with_capacity(config.history_size))),
            ws_broadcaster: ws_tx,
        }
    }

    /// Start the dashboard server
    pub async fn start(&self) {
        println!("🌟 Starting Sacred Dashboard Server on port {}", self.config.port);
        
        // Start metrics collection
        self.start_metrics_collection();
        
        // Set up routes
        let metrics_route = self.create_metrics_route();
        let websocket_route = self.create_websocket_route();
        let static_route = self.create_static_route();
        
        let routes = metrics_route
            .or(websocket_route)
            .or(static_route);
        
        // Start server
        warp::serve(routes)
            .run(([0, 0, 0, 0], self.config.port))
            .await;
    }

    /// Start background metrics collection
    fn start_metrics_collection(&self) {
        let profiler = Arc::clone(&self.profiler);
        let cache = Arc::clone(&self.cache);
        let consciousness_mgr = Arc::clone(&self.consciousness_mgr);
        let scheduler = Arc::clone(&self.scheduler);
        let field_monitor = Arc::clone(&self.field_monitor);
        let history = Arc::clone(&self.metrics_history);
        let broadcaster = self.ws_broadcaster.clone();
        let interval = self.config.update_interval;
        let history_size = self.config.history_size;
        
        tokio::spawn(async move {
            let mut interval_timer = time::interval(interval);
            
            loop {
                interval_timer.tick().await;
                
                // Collect metrics
                let snapshot = Self::collect_metrics(
                    &profiler,
                    &cache,
                    &consciousness_mgr,
                    &scheduler,
                    &field_monitor,
                );
                
                // Update history
                {
                    let mut hist = history.write().unwrap();
                    hist.push(snapshot.clone());
                    
                    // Keep history bounded
                    if hist.len() > history_size {
                        hist.remove(0);
                    }
                }
                
                // Broadcast to WebSocket clients
                if let Ok(json) = serde_json::to_string(&snapshot) {
                    let _ = broadcaster.send(json);
                }
            }
        });
    }

    /// Collect current metrics
    fn collect_metrics(
        profiler: &PerformanceProfiler,
        cache: &CoherenceCache,
        consciousness_mgr: &ProgressiveConsciousnessManager,
        scheduler: &ConsciousnessScheduler,
        field_monitor: &FieldCoherenceMonitor,
    ) -> MetricsSnapshot {
        let perf_report = profiler.generate_report();
        let cache_stats = cache.get_statistics();
        let consciousness_report = consciousness_mgr.generate_report();
        let field_metrics = field_monitor.get_current_metrics();
        
        // Get process modes
        let mut process_modes = HashMap::new();
        for (mode, _count) in &consciousness_report.mode_distribution {
            process_modes.insert(
                format!("{:?}", mode),
                format!("{:?}", mode),
            );
        }
        
        // Combine recommendations
        let mut recommendations = perf_report.recommendations.clone();
        recommendations.extend(consciousness_report.recommendations.clone());
        
        MetricsSnapshot {
            timestamp: Instant::now().elapsed().as_secs(),
            global_coherence: field_metrics.global_coherence,
            cache_hit_rate: cache_stats.cache_hits as f64 / 
                           (cache_stats.cache_hits + cache_stats.cache_misses).max(1) as f64,
            operations_per_second: perf_report.operations_per_second,
            consciousness_overhead: perf_report.consciousness_overhead,
            active_processes: scheduler.get_process_count(),
            process_modes,
            memory_usage_mb: cache_stats.memory_usage_bytes as f64 / 1_048_576.0,
            cpu_usage_percent: 0.0, // TODO: Implement CPU tracking
            sacred_interrupts_per_min: perf_report.metrics.sacred_interrupts as f64 * 60.0 / 
                                     perf_report.elapsed_time.as_secs_f64(),
            vortex_count: field_metrics.vortex_count,
            entanglement_density: field_metrics.entanglement_density,
            recommendations,
        }
    }

    /// Create metrics API route
    fn create_metrics_route(&self) -> impl Filter<Extract = impl Reply, Error = warp::Rejection> + Clone {
        let history = Arc::clone(&self.metrics_history);
        
        warp::path!("api" / "metrics")
            .and(warp::get())
            .map(move || {
                let hist = history.read().unwrap();
                warp::reply::json(&*hist)
            })
    }

    /// Create WebSocket route
    fn create_websocket_route(&self) -> impl Filter<Extract = impl Reply, Error = warp::Rejection> + Clone {
        let broadcaster = self.ws_broadcaster.clone();
        
        warp::path!("ws")
            .and(warp::ws())
            .map(move |ws: warp::ws::Ws| {
                let broadcaster = broadcaster.clone();
                ws.on_upgrade(move |socket| {
                    handle_websocket(socket, broadcaster)
                })
            })
    }

    /// Create static file route
    fn create_static_route(&self) -> impl Filter<Extract = impl Reply, Error = warp::Rejection> + Clone {
        warp::path::end()
            .and(warp::get())
            .map(|| {
                warp::reply::html(include_str!("index.html"))
            })
            .or(warp::fs::dir("sacred-dashboard"))
    }
}

/// Handle WebSocket connections
async fn handle_websocket(ws: warp::ws::WebSocket, broadcaster: broadcast::Sender<String>) {
    use futures::{StreamExt, SinkExt};
    
    let (mut ws_tx, mut ws_rx) = ws.split();
    let mut rx = broadcaster.subscribe();
    
    // Send updates to client
    tokio::task::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if ws_tx.send(warp::ws::Message::text(msg)).await.is_err() {
                break;
            }
        }
    });
    
    // Handle incoming messages (if any)
    while let Some(result) = ws_rx.next().await {
        match result {
            Ok(msg) => {
                if msg.is_close() {
                    break;
                }
            }
            Err(_) => break,
        }
    }
}

/// Dashboard API for external tools
pub struct DashboardAPI {
    server: Arc<SacredDashboardServer>,
}

impl DashboardAPI {
    pub fn new(server: Arc<SacredDashboardServer>) -> Self {
        Self { server }
    }
    
    /// Get current metrics snapshot
    pub fn get_current_metrics(&self) -> Option<MetricsSnapshot> {
        self.server.metrics_history.read().unwrap().last().cloned()
    }
    
    /// Get metrics history
    pub fn get_metrics_history(&self) -> Vec<MetricsSnapshot> {
        self.server.metrics_history.read().unwrap().clone()
    }
    
    /// Get specific metric time series
    pub fn get_metric_series(&self, metric: &str) -> Vec<(u64, f64)> {
        self.server.metrics_history.read().unwrap()
            .iter()
            .map(|snapshot| {
                let value = match metric {
                    "coherence" => snapshot.global_coherence,
                    "cache_hit_rate" => snapshot.cache_hit_rate,
                    "ops_per_second" => snapshot.operations_per_second,
                    "overhead" => snapshot.consciousness_overhead,
                    _ => 0.0,
                };
                (snapshot.timestamp, value)
            })
            .collect()
    }
}

/// Sacred metrics formatter for terminal display
pub struct TerminalDashboard;

impl TerminalDashboard {
    /// Display metrics in terminal
    pub fn display(snapshot: &MetricsSnapshot) {
        println!("\n╔══════════════════════════════════════════════════════╗");
        println!("║          🌟 LUMINOUSOS SACRED DASHBOARD 🌟           ║");
        println!("╚══════════════════════════════════════════════════════╝");
        
        println!("\n🔮 Global Coherence: {:.1}%", snapshot.global_coherence * 100.0);
        println!("   ├─ Vortex Count: {}", snapshot.vortex_count);
        println!("   ├─ Entanglement Density: {:.2}", snapshot.entanglement_density);
        println!("   └─ Sacred Interrupts/min: {:.0}", snapshot.sacred_interrupts_per_min);
        
        println!("\n⚡ Performance Metrics");
        println!("   ├─ Cache Hit Rate: {:.1}%", snapshot.cache_hit_rate * 100.0);
        println!("   ├─ Operations/sec: {:.0}", snapshot.operations_per_second);
        println!("   ├─ Consciousness Overhead: {:.1}%", snapshot.consciousness_overhead);
        println!("   └─ Memory Usage: {:.1} MB", snapshot.memory_usage_mb);
        
        println!("\n🧠 Process Distribution");
        println!("   └─ Active Processes: {}", snapshot.active_processes);
        
        if !snapshot.recommendations.is_empty() {
            println!("\n💡 Recommendations");
            for rec in &snapshot.recommendations {
                println!("   ├─ {}", rec);
            }
        }
        
        println!("\n═══════════════════════════════════════════════════════");
    }
    
    /// Display mini dashboard (single line)
    pub fn display_mini(snapshot: &MetricsSnapshot) {
        print!("\r🌟 Coherence: {:.0}% | ⚡ Cache: {:.0}% | 🧠 Processes: {} | 💾 {:.1}MB",
            snapshot.global_coherence * 100.0,
            snapshot.cache_hit_rate * 100.0,
            snapshot.active_processes,
            snapshot.memory_usage_mb
        );
        std::io::Write::flush(&mut std::io::stdout()).unwrap();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_metrics_snapshot_serialization() {
        let snapshot = MetricsSnapshot {
            timestamp: 12345,
            global_coherence: 0.85,
            cache_hit_rate: 0.92,
            operations_per_second: 1500.0,
            consciousness_overhead: 3.2,
            active_processes: 42,
            process_modes: HashMap::new(),
            memory_usage_mb: 128.5,
            cpu_usage_percent: 15.3,
            sacred_interrupts_per_min: 30.0,
            vortex_count: 7,
            entanglement_density: 0.65,
            recommendations: vec!["Test recommendation".to_string()],
        };
        
        let json = serde_json::to_string(&snapshot).unwrap();
        let deserialized: MetricsSnapshot = serde_json::from_str(&json).unwrap();
        
        assert_eq!(deserialized.global_coherence, 0.85);
        assert_eq!(deserialized.active_processes, 42);
    }
}