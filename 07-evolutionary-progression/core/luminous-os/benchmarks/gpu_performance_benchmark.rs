use luminous_gpu::*;
use criterion::{black_box, criterion_group, criterion_main, Criterion, BenchmarkId};
use std::time::Duration;

async fn setup_gpu() -> OptimizedGPUCompute {
    OptimizedGPUCompute::new().await.expect("Failed to initialize GPU")
}

fn benchmark_field_sizes(c: &mut Criterion) {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    
    let mut group = c.benchmark_group("field_evolution");
    group.measurement_time(Duration::from_secs(10));
    group.sample_size(100);
    
    let sizes = vec![1_000, 10_000, 100_000, 500_000, 1_000_000];
    
    for size in sizes {
        group.bench_with_input(
            BenchmarkId::new("particles", size),
            &size,
            |b, &size| {
                b.iter(|| {
                    runtime.block_on(async {
                        let mut gpu = setup_gpu().await;
                        
                        // Create test field
                        let field_points: Vec<FieldPoint> = (0..size)
                            .map(|i| FieldPoint {
                                position: [
                                    (i as f32 * 0.1).sin(),
                                    (i as f32 * 0.1).cos(),
                                    (i as f32 * 0.05).sin(),
                                ],
                                coherence: 0.5 + (i as f32 * 0.001).sin() * 0.5,
                                charge: 1.0,
                                velocity: [0.0, 0.0, 0.0],
                            })
                            .collect();
                        
                        let params = EvolutionParams {
                            dt: 0.016,
                            coherence_decay: 0.01,
                            field_strength: 1.0,
                        };
                        
                        black_box(
                            gpu.run_optimized_field_evolution(&field_points, &params).await
                        )
                    })
                });
            },
        );
    }
    
    group.finish();
}

fn benchmark_sacred_geometry(c: &mut Criterion) {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    
    let mut group = c.benchmark_group("sacred_geometry");
    
    let resolutions = vec![64, 128, 256, 512, 1024];
    let geometries = vec![
        ("flower_of_life", SacredGeometry::FlowerOfLife),
        ("sri_yantra", SacredGeometry::SriYantra),
        ("metatrons_cube", SacredGeometry::MetatronsCube),
    ];
    
    for (name, geometry) in geometries {
        for resolution in &resolutions {
            group.bench_with_input(
                BenchmarkId::new(name, resolution),
                resolution,
                |b, &resolution| {
                    b.iter(|| {
                        runtime.block_on(async {
                            let mut gpu = setup_gpu().await;
                            black_box(
                                gpu.run_parallel_sacred_geometry(geometry.clone(), resolution)
                            )
                        })
                    });
                },
            );
        }
    }
    
    group.finish();
}

fn benchmark_optimization_strategies(c: &mut Criterion) {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    
    let mut group = c.benchmark_group("optimization_strategies");
    
    // Test different optimization strategies
    let test_size = 100_000;
    
    // Baseline - no optimizations
    group.bench_function("baseline", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let gpu = setup_gpu().await;
                run_baseline_computation(&gpu, test_size).await
            })
        });
    });
    
    // With buffer pooling
    group.bench_function("buffer_pooling", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let mut gpu = setup_gpu().await;
                run_with_buffer_pool(&mut gpu, test_size).await
            })
        });
    });
    
    // With pipeline caching
    group.bench_function("pipeline_caching", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let mut gpu = setup_gpu().await;
                run_with_pipeline_cache(&mut gpu, test_size).await
            })
        });
    });
    
    // With workgroup optimization
    group.bench_function("workgroup_optimized", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let mut gpu = setup_gpu().await;
                run_with_workgroup_optimization(&mut gpu, test_size).await
            })
        });
    });
    
    // All optimizations combined
    group.bench_function("all_optimizations", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let mut gpu = setup_gpu().await;
                run_fully_optimized(&mut gpu, test_size).await
            })
        });
    });
    
    group.finish();
}

fn benchmark_memory_patterns(c: &mut Criterion) {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    
    let mut group = c.benchmark_group("memory_patterns");
    
    // Test different memory access patterns
    let test_size = 100_000;
    
    // Sequential access
    group.bench_function("sequential", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let mut gpu = setup_gpu().await;
                run_sequential_access(&mut gpu, test_size).await
            })
        });
    });
    
    // Strided access
    group.bench_function("strided", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let mut gpu = setup_gpu().await;
                run_strided_access(&mut gpu, test_size, 16).await
            })
        });
    });
    
    // Random access
    group.bench_function("random", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let mut gpu = setup_gpu().await;
                run_random_access(&mut gpu, test_size).await
            })
        });
    });
    
    // Tiled access
    group.bench_function("tiled", |b| {
        b.iter(|| {
            runtime.block_on(async {
                let mut gpu = setup_gpu().await;
                run_tiled_access(&mut gpu, test_size, 256).await
            })
        });
    });
    
    group.finish();
}

// Helper functions for benchmarks

async fn run_baseline_computation(gpu: &OptimizedGPUCompute, size: usize) {
    // Simplified computation without optimizations
    let field_points = create_test_field(size);
    let params = EvolutionParams::default();
    
    // Direct GPU computation without pooling or caching
    let _ = gpu.run_simple_evolution(&field_points, &params).await;
}

async fn run_with_buffer_pool(gpu: &mut OptimizedGPUCompute, size: usize) {
    let field_points = create_test_field(size);
    let params = EvolutionParams::default();
    
    // Uses buffer pool for allocation
    let _ = gpu.run_optimized_field_evolution(&field_points, &params).await;
}

async fn run_with_pipeline_cache(gpu: &mut OptimizedGPUCompute, size: usize) {
    let field_points = create_test_field(size);
    let params = EvolutionParams::default();
    
    // Multiple runs to test cache effectiveness
    for _ in 0..5 {
        let _ = gpu.run_optimized_field_evolution(&field_points, &params).await;
    }
}

async fn run_with_workgroup_optimization(gpu: &mut OptimizedGPUCompute, size: usize) {
    let field_points = create_test_field(size);
    let params = EvolutionParams::default();
    
    // Uses optimized workgroup sizes
    gpu.set_workgroup_optimization(true);
    let _ = gpu.run_optimized_field_evolution(&field_points, &params).await;
}

async fn run_fully_optimized(gpu: &mut OptimizedGPUCompute, size: usize) {
    let field_points = create_test_field(size);
    let params = EvolutionParams::default();
    
    // All optimizations enabled
    gpu.enable_all_optimizations();
    let _ = gpu.run_optimized_field_evolution(&field_points, &params).await;
}

async fn run_sequential_access(gpu: &mut OptimizedGPUCompute, size: usize) {
    let field_points = create_sequential_field(size);
    let params = EvolutionParams::default();
    let _ = gpu.run_optimized_field_evolution(&field_points, &params).await;
}

async fn run_strided_access(gpu: &mut OptimizedGPUCompute, size: usize, stride: usize) {
    let field_points = create_strided_field(size, stride);
    let params = EvolutionParams::default();
    let _ = gpu.run_optimized_field_evolution(&field_points, &params).await;
}

async fn run_random_access(gpu: &mut OptimizedGPUCompute, size: usize) {
    let field_points = create_random_field(size);
    let params = EvolutionParams::default();
    let _ = gpu.run_optimized_field_evolution(&field_points, &params).await;
}

async fn run_tiled_access(gpu: &mut OptimizedGPUCompute, size: usize, tile_size: usize) {
    let field_points = create_tiled_field(size, tile_size);
    let params = EvolutionParams::default();
    let _ = gpu.run_optimized_field_evolution(&field_points, &params).await;
}

// Test data generators

fn create_test_field(size: usize) -> Vec<FieldPoint> {
    (0..size)
        .map(|i| FieldPoint {
            position: [
                (i as f32 * 0.1).sin(),
                (i as f32 * 0.1).cos(),
                (i as f32 * 0.05).sin(),
            ],
            coherence: 0.5,
            charge: 1.0,
            velocity: [0.0, 0.0, 0.0],
        })
        .collect()
}

fn create_sequential_field(size: usize) -> Vec<FieldPoint> {
    (0..size)
        .map(|i| FieldPoint {
            position: [i as f32 * 0.01, 0.0, 0.0],
            coherence: 0.5,
            charge: 1.0,
            velocity: [0.0, 0.0, 0.0],
        })
        .collect()
}

fn create_strided_field(size: usize, stride: usize) -> Vec<FieldPoint> {
    (0..size)
        .map(|i| {
            let strided_i = (i * stride) % size;
            FieldPoint {
                position: [strided_i as f32 * 0.01, 0.0, 0.0],
                coherence: 0.5,
                charge: 1.0,
                velocity: [0.0, 0.0, 0.0],
            }
        })
        .collect()
}

fn create_random_field(size: usize) -> Vec<FieldPoint> {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    
    (0..size)
        .map(|_| FieldPoint {
            position: [
                rng.gen_range(-10.0..10.0),
                rng.gen_range(-10.0..10.0),
                rng.gen_range(-5.0..5.0),
            ],
            coherence: rng.gen_range(0.0..1.0),
            charge: 1.0,
            velocity: [0.0, 0.0, 0.0],
        })
        .collect()
}

fn create_tiled_field(size: usize, tile_size: usize) -> Vec<FieldPoint> {
    (0..size)
        .map(|i| {
            let tile = i / tile_size;
            let offset = i % tile_size;
            FieldPoint {
                position: [
                    tile as f32 + offset as f32 * 0.001,
                    0.0,
                    0.0,
                ],
                coherence: 0.5,
                charge: 1.0,
                velocity: [0.0, 0.0, 0.0],
            }
        })
        .collect()
}

criterion_group!(
    benches,
    benchmark_field_sizes,
    benchmark_sacred_geometry,
    benchmark_optimization_strategies,
    benchmark_memory_patterns
);
criterion_main!(benches);