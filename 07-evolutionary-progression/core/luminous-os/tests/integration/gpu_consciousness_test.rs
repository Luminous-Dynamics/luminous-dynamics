// Integration Test: GPU Consciousness Computing
// Tests WebGPU shaders and parallel consciousness processing

use luminous_os::gpu::{ConsciousnessGPU, FieldCompute, SacredGeometryPipeline};
use luminous_os::consciousness::{ConsciousnessField, FieldPoint};
use luminous_os::sacred::{SacredGeometry, PatternField};
use wgpu::util::DeviceExt;
use std::time::{Duration, Instant};

#[tokio::test]
async fn test_webgpu_field_evolution() {
    // Initialize WebGPU
    let instance = wgpu::Instance::default();
    let adapter = instance
        .request_adapter(&wgpu::RequestAdapterOptions {
            power_preference: wgpu::PowerPreference::HighPerformance,
            ..Default::default()
        })
        .await
        .expect("Failed to find GPU adapter");
    
    let (device, queue) = adapter
        .request_device(
            &wgpu::DeviceDescriptor {
                label: Some("Consciousness GPU"),
                features: wgpu::Features::empty(),
                limits: wgpu::Limits::default(),
            },
            None,
        )
        .await
        .expect("Failed to create GPU device");
    
    // Create consciousness GPU compute
    let mut gpu = ConsciousnessGPU::new(&device, &queue);
    
    // Initialize field with 1M points
    let field_size = 1024 * 1024;
    let mut field_data = vec![FieldPoint::default(); field_size];
    
    // Set initial coherence pattern
    for (i, point) in field_data.iter_mut().enumerate() {
        let x = (i % 1024) as f32 / 1024.0;
        let y = (i / 1024) as f32 / 1024.0;
        point.coherence = ((x * 10.0).sin() * (y * 10.0).cos() + 1.0) / 2.0;
        point.phase = (x + y) * std::f32::consts::PI;
    }
    
    // Upload to GPU
    gpu.upload_field(&field_data).await.expect("Failed to upload field");
    
    // Run evolution compute shader
    let start = Instant::now();
    
    for _ in 0..10 {
        gpu.evolve_field(0.01).await.expect("Failed to evolve field");
    }
    
    let evolution_time = start.elapsed();
    println!("GPU evolution time for 1M points: {:?}", evolution_time);
    
    // Download results
    let evolved_field = gpu.download_field().await.expect("Failed to download field");
    
    // Verify evolution
    let initial_avg_coherence: f32 = field_data.iter().map(|p| p.coherence).sum::<f32>() / field_size as f32;
    let final_avg_coherence: f32 = evolved_field.iter().map(|p| p.coherence).sum::<f32>() / field_size as f32;
    
    assert!((final_avg_coherence - initial_avg_coherence).abs() > 0.001, 
            "Field should evolve");
    
    // Performance assertion - should process 1M points in under 100ms
    assert!(evolution_time < Duration::from_millis(100), 
            "GPU processing too slow: {:?}", evolution_time);
}

#[tokio::test]
async fn test_sacred_geometry_gpu_generation() {
    let instance = wgpu::Instance::default();
    let adapter = instance.request_adapter(&Default::default()).await.unwrap();
    let (device, queue) = adapter.request_device(&Default::default(), None).await.unwrap();
    
    let mut geometry_pipeline = SacredGeometryPipeline::new(&device);
    
    // Test different sacred patterns
    let patterns = vec![
        (SacredGeometry::FlowerOfLife { rings: 7 }, 1 + 6 * 7 * (7 + 1) / 2), // Expected circles
        (SacredGeometry::MetatronsCube, 13), // 13 circles
        (SacredGeometry::SriYantra { triangles: 9 }, 9 + 8 + 1), // Triangles + lotus + bindu
    ];
    
    for (pattern, expected_elements) in patterns {
        let vertices = geometry_pipeline.generate_pattern(&pattern, &device, &queue)
            .await.expect("Failed to generate pattern");
        
        assert!(!vertices.is_empty(), "Pattern should generate vertices");
        
        // Rough check for expected complexity
        let element_estimate = vertices.len() / 100; // Approximate elements
        assert!(element_estimate >= expected_elements / 2, 
                "Pattern complexity too low for {:?}", pattern);
    }
}

#[tokio::test]
async fn test_parallel_coherence_calculation() {
    let instance = wgpu::Instance::default();
    let adapter = instance.request_adapter(&Default::default()).await.unwrap();
    let (device, queue) = adapter.request_device(&Default::default(), None).await.unwrap();
    
    let mut gpu = ConsciousnessGPU::new(&device, &queue);
    
    // Create test data with known coherence pattern
    let size = 65536; // 256x256 field
    let mut field_data = vec![FieldPoint::default(); size];
    
    // Create coherent region in center
    for i in 0..size {
        let x = (i % 256) as f32 - 128.0;
        let y = (i / 256) as f32 - 128.0;
        let distance = (x * x + y * y).sqrt();
        
        field_data[i].coherence = if distance < 50.0 {
            0.9 // High coherence in center
        } else {
            0.3 // Low coherence outside
        };
    }
    
    // Calculate coherence metrics on GPU
    gpu.upload_field(&field_data).await.unwrap();
    let metrics = gpu.calculate_coherence_metrics().await.unwrap();
    
    // Verify metrics
    assert!(metrics.average_coherence > 0.3 && metrics.average_coherence < 0.9);
    assert!(metrics.peak_coherence >= 0.9);
    assert!(metrics.coherence_clusters > 0);
    
    // Test coherence map generation
    let coherence_map = gpu.generate_coherence_map(256, 256).await.unwrap();
    assert_eq!(coherence_map.len(), 256 * 256);
    
    // Verify center has high coherence
    let center_idx = 128 * 256 + 128;
    assert!(coherence_map[center_idx] > 0.8);
}

#[tokio::test]
async fn test_gpu_sacred_pattern_field_effects() {
    let instance = wgpu::Instance::default();
    let adapter = instance.request_adapter(&Default::default()).await.unwrap();
    let (device, queue) = adapter.request_device(&Default::default(), None).await.unwrap();
    
    let mut gpu = ConsciousnessGPU::new(&device, &queue);
    
    // Initialize empty field
    let size = 512 * 512;
    let field_data = vec![FieldPoint::default(); size];
    gpu.upload_field(&field_data).await.unwrap();
    
    // Apply Flower of Life pattern
    let flower_params = gpu.create_pattern_params(
        SacredGeometry::FlowerOfLife { rings: 3 },
        [256.0, 256.0], // center
        50.0, // radius
    );
    
    gpu.apply_sacred_pattern(flower_params).await.unwrap();
    
    // Download and verify pattern effect
    let patterned_field = gpu.download_field().await.unwrap();
    
    // Count affected points
    let affected_points = patterned_field.iter()
        .filter(|p| p.coherence > 0.5)
        .count();
    
    assert!(affected_points > 1000, "Pattern should affect significant area");
    
    // Verify pattern has sacred geometry properties
    let center_point = patterned_field[256 * 512 + 256];
    assert!(center_point.coherence > 0.8, "Center should have high coherence");
}

#[tokio::test]
async fn test_gpu_performance_vs_cpu() {
    let instance = wgpu::Instance::default();
    let adapter = instance.request_adapter(&Default::default()).await.unwrap();
    let (device, queue) = adapter.request_device(&Default::default(), None).await.unwrap();
    
    let mut gpu = ConsciousnessGPU::new(&device, &queue);
    
    // Test different field sizes
    let sizes = vec![1024, 16384, 65536, 262144]; // 32x32 to 512x512
    
    for size in sizes {
        let field_data = vec![FieldPoint::default(); size];
        
        // CPU timing
        let cpu_start = Instant::now();
        let _cpu_result = cpu_evolve_field(&field_data, 0.01);
        let cpu_time = cpu_start.elapsed();
        
        // GPU timing
        gpu.upload_field(&field_data).await.unwrap();
        let gpu_start = Instant::now();
        gpu.evolve_field(0.01).await.unwrap();
        let _gpu_result = gpu.download_field().await.unwrap();
        let gpu_time = gpu_start.elapsed();
        
        let speedup = cpu_time.as_secs_f32() / gpu_time.as_secs_f32();
        
        println!("Size {}: CPU {:?}, GPU {:?}, Speedup: {:.1}x", 
                 size, cpu_time, gpu_time, speedup);
        
        // GPU should be faster for larger fields
        if size >= 65536 {
            assert!(speedup > 5.0, "GPU should be >5x faster for large fields");
        }
    }
}

#[tokio::test]
async fn test_gpu_quantum_entanglement() {
    let instance = wgpu::Instance::default();
    let adapter = instance.request_adapter(&Default::default()).await.unwrap();
    let (device, queue) = adapter.request_device(&Default::default(), None).await.unwrap();
    
    let mut gpu = ConsciousnessGPU::new(&device, &queue);
    
    // Create two entangled regions
    let size = 256 * 256;
    let mut field_data = vec![FieldPoint::default(); size];
    
    // Set up entangled vortices
    let vortex1_center = (64, 128);
    let vortex2_center = (192, 128);
    
    for i in 0..size {
        let x = i % 256;
        let y = i / 256;
        
        let dist1 = distance_to(x, y, vortex1_center);
        let dist2 = distance_to(x, y, vortex2_center);
        
        if dist1 < 20.0 {
            field_data[i].coherence = 0.8;
            field_data[i].quantum_state = 1; // Entangled state 1
        } else if dist2 < 20.0 {
            field_data[i].coherence = 0.8;
            field_data[i].quantum_state = 1; // Same entangled state
        }
    }
    
    gpu.upload_field(&field_data).await.unwrap();
    
    // Apply quantum entanglement evolution
    gpu.evolve_quantum_entanglement(vortex1_center, vortex2_center)
        .await.unwrap();
    
    let result = gpu.download_field().await.unwrap();
    
    // Verify entanglement effects
    let v1_idx = vortex1_center.1 * 256 + vortex1_center.0;
    let v2_idx = vortex2_center.1 * 256 + vortex2_center.0;
    
    // Entangled vortices should have correlated phases
    let phase_diff = (result[v1_idx].phase - result[v2_idx].phase).abs();
    assert!(phase_diff < 0.1 || phase_diff > std::f32::consts::PI * 2.0 - 0.1,
            "Entangled vortices should have synchronized phases");
}

#[tokio::test]
async fn test_gpu_mandala_rendering() {
    let instance = wgpu::Instance::default();
    let adapter = instance.request_adapter(&Default::default()).await.unwrap();
    let (device, queue) = adapter.request_device(&Default::default(), None).await.unwrap();
    
    // Create mandala renderer
    let mut mandala_renderer = MandalaGPURenderer::new(&device);
    
    // Test particle system performance
    let particle_counts = vec![1000, 5000, 10000, 50000];
    
    for count in particle_counts {
        let start = Instant::now();
        
        mandala_renderer.set_particle_count(count);
        mandala_renderer.update_particles(0.016, 0.8).await.unwrap(); // 60fps, 0.8 coherence
        
        let render_time = start.elapsed();
        
        println!("{} particles rendered in {:?}", count, render_time);
        
        // Should maintain 60fps even with many particles
        assert!(render_time < Duration::from_millis(16),
                "Should render {} particles in <16ms for 60fps", count);
    }
}

// Helper functions

fn cpu_evolve_field(field: &[FieldPoint], dt: f32) -> Vec<FieldPoint> {
    let mut result = field.to_vec();
    let size = (field.len() as f32).sqrt() as usize;
    
    for y in 1..size-1 {
        for x in 1..size-1 {
            let idx = y * size + x;
            
            // Simple diffusion
            let neighbors_avg = (
                field[(y-1) * size + x].coherence +
                field[(y+1) * size + x].coherence +
                field[y * size + (x-1)].coherence +
                field[y * size + (x+1)].coherence
            ) / 4.0;
            
            result[idx].coherence += (neighbors_avg - field[idx].coherence) * dt;
        }
    }
    
    result
}

fn distance_to(x: usize, y: usize, center: (usize, usize)) -> f32 {
    let dx = x as f32 - center.0 as f32;
    let dy = y as f32 - center.1 as f32;
    (dx * dx + dy * dy).sqrt()
}