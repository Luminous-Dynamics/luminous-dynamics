// LuminousOS Performance Demo
// Shows profiling, caching, progressive consciousness, and dashboard

use std::sync::{Arc, RwLock};
use std::time::{Duration, Instant};
use std::thread;

use luminous_os::stillpoint_kernel::{
    performance_profiler::{PerformanceProfiler, ProfilingConfig},
    coherence_cache::{CoherenceCache, CacheConfig, CacheAnalyzer},
    progressive_consciousness::{
        ProgressiveConsciousnessManager, ProgressiveConfig, ConsciousnessMode
    },
    consciousness_scheduler::{ConsciousnessScheduler, ProcessId},
    field_coherence_monitor::FieldCoherenceMonitor,
};

use luminous_os::sacred_dashboard::{
    SacredDashboardServer, DashboardConfig, TerminalDashboard
};

fn main() {
    println!("🌟 LuminousOS Performance Demonstration");
    println!("═══════════════════════════════════════════\n");
    
    // Initialize components
    let profiler = Arc::new(PerformanceProfiler::new());
    let cache = Arc::new(CoherenceCache::new(CacheConfig::default()));
    let progressive_mgr = Arc::new(ProgressiveConsciousnessManager::new(
        ProgressiveConfig::default()
    ));
    let scheduler = Arc::new(ConsciousnessScheduler::new());
    let field_monitor = Arc::new(FieldCoherenceMonitor::new());
    
    // Enable profiling
    profiler.enable(ProfilingConfig {
        enabled: true,
        track_coherence_overhead: true,
        measure_sacred_pulse_impact: true,
        log_performance_metrics: true,
        sample_rate: 1.0,
        detailed_tracing: true,
    });
    
    println!("✅ Performance profiling enabled\n");
    
    // Demonstrate cache warming
    println!("🔥 Warming coherence cache...");
    let common_vortices = vec![VortexId(1), VortexId(2), VortexId(3)];
    cache.warm_up(common_vortices, |id| 0.75 + (id.0 as f64 * 0.05));
    println!("✅ Cache warmed with common patterns\n");
    
    // Create some test processes
    println!("🧠 Creating test processes...");
    let processes = vec![
        ("meditation_app", "Sacred meditation application"),
        ("code_editor", "Consciousness-aware code editor"),
        ("web_browser", "Mindful web browser"),
        ("system_driver", "Low-level driver"),
        ("music_player", "Harmonic music player"),
    ];
    
    for (name, desc) in &processes {
        let pid = scheduler.create_process(
            VortexId(rand::random::<u64>()),
            name.to_string(),
            desc.to_string(),
            0.5 + rand::random::<f64>() * 0.4,
        );
        
        let mode = progressive_mgr.register_process(pid, name);
        println!("  📍 {} → {:?} mode", name, mode);
    }
    
    println!("\n🚀 Starting performance test...\n");
    
    // Simulate workload
    let test_duration = Duration::from_secs(10);
    let start = Instant::now();
    let mut iteration = 0;
    
    while start.elapsed() < test_duration {
        iteration += 1;
        
        // Simulate coherence calculations with caching
        for i in 0..100 {
            let vortex_id = VortexId(i % 10);
            let related = vec![VortexId(i % 5), VortexId(i % 7)];
            
            let calc_start = Instant::now();
            let coherence = cache.get_or_calculate(
                vortex_id,
                related,
                0.5,
                || {
                    // Simulate expensive calculation
                    thread::sleep(Duration::from_micros(100));
                    0.7 + (i as f64 * 0.001)
                }
            );
            let calc_duration = calc_start.elapsed();
            
            profiler.record_coherence_calculation(calc_duration);
        }
        
        // Simulate process state updates
        for i in 0..5 {
            let pid = ProcessId(i);
            let coherence = 0.5 + rand::random::<f64>() * 0.4;
            
            if let Some(new_mode) = progressive_mgr.update_coherence(pid, coherence) {
                println!("🔄 Process {} transitioned to {:?}", i, new_mode);
            }
        }
        
        // Simulate context switches
        for _ in 0..10 {
            let switch_start = Instant::now();
            thread::sleep(Duration::from_micros(50));
            profiler.record_context_switch(switch_start.elapsed());
        }
        
        // Simulate interrupts
        for _ in 0..5 {
            profiler.record_sacred_interrupt();
        }
        
        // Update field
        let field_start = Instant::now();
        field_monitor.update(0.75 + rand::random::<f64>() * 0.2);
        profiler.record_field_update(field_start.elapsed());
        
        // Show mini dashboard every second
        if iteration % 10 == 0 {
            let snapshot = collect_demo_metrics(
                &profiler,
                &cache,
                &progressive_mgr,
                &scheduler,
                &field_monitor,
            );
            TerminalDashboard::display_mini(&snapshot);
        }
        
        thread::sleep(Duration::from_millis(100));
    }
    
    println!("\n\n✅ Performance test complete!\n");
    
    // Generate reports
    println!("📊 Performance Report:");
    println!("═══════════════════════════════════════════\n");
    
    let perf_report = profiler.generate_report();
    perf_report.print();
    
    println!("\n📊 Cache Analysis:");
    println!("═══════════════════════════════════════════\n");
    
    let cache_analysis = CacheAnalyzer::analyze(&cache);
    println!("Cache Effectiveness: {:?}", cache_analysis.effectiveness);
    println!("Hit Rate: {:.1}%", cache_analysis.hit_rate * 100.0);
    println!("Average Speedup: {:.1}x", cache_analysis.avg_speedup);
    println!("Memory Efficiency: {:.1} hits/KB", cache_analysis.memory_efficiency);
    
    for rec in &cache_analysis.recommendations {
        println!("💡 {}", rec);
    }
    
    println!("\n📊 Progressive Consciousness Report:");
    println!("═══════════════════════════════════════════\n");
    
    let consciousness_report = progressive_mgr.generate_report();
    consciousness_report.print();
    
    // Start dashboard server
    println!("\n🌐 Starting Sacred Dashboard...");
    println!("   Open http://localhost:11111 in your browser");
    println!("   Press Ctrl+C to exit\n");
    
    let rt = tokio::runtime::Runtime::new().unwrap();
    rt.block_on(async {
        let dashboard = SacredDashboardServer::new(
            DashboardConfig::default(),
            Arc::clone(&profiler),
            Arc::clone(&cache),
            Arc::clone(&progressive_mgr),
            Arc::clone(&scheduler),
            Arc::clone(&field_monitor),
        );
        
        dashboard.start().await;
    });
}

// Helper function to collect metrics for demo
fn collect_demo_metrics(
    profiler: &PerformanceProfiler,
    cache: &CoherenceCache,
    progressive_mgr: &ProgressiveConsciousnessManager,
    scheduler: &ConsciousnessScheduler,
    field_monitor: &FieldCoherenceMonitor,
) -> luminous_os::sacred_dashboard::MetricsSnapshot {
    use luminous_os::sacred_dashboard::MetricsSnapshot;
    use std::collections::HashMap;
    
    let perf_report = profiler.generate_report();
    let cache_stats = cache.get_statistics();
    let consciousness_report = progressive_mgr.generate_report();
    let field_metrics = field_monitor.get_current_metrics();
    
    MetricsSnapshot {
        timestamp: Instant::now().elapsed().as_secs(),
        global_coherence: field_metrics.global_coherence,
        cache_hit_rate: cache.get_hit_rate(),
        operations_per_second: perf_report.operations_per_second,
        consciousness_overhead: perf_report.consciousness_overhead,
        active_processes: scheduler.get_process_count(),
        process_modes: HashMap::new(),
        memory_usage_mb: cache_stats.memory_usage_bytes as f64 / 1_048_576.0,
        cpu_usage_percent: 0.0,
        sacred_interrupts_per_min: perf_report.metrics.sacred_interrupts as f64 * 60.0 / 
                                 perf_report.elapsed_time.as_secs_f64(),
        vortex_count: field_metrics.vortex_count,
        entanglement_density: field_metrics.entanglement_density,
        recommendations: perf_report.recommendations,
    }
}

// Mock rand
mod rand {
    pub fn random<T>() -> T 
    where T: From<f64> {
        // Return different values based on type
        T::from(0.5 + (std::time::Instant::now().elapsed().as_nanos() % 1000) as f64 / 2000.0)
    }
}