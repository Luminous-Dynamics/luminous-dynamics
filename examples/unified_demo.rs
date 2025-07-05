// LuminousOS Unified System Demo
// Demonstrates all major components working together

use luminous_os::{
    consciousness::{Vortex, ConsciousnessField, CollectiveField},
    biometric::{HeartSensor, MockHeartSensor, CoherenceTrainer},
    sacred::{SacredGeometry, FlowerOfLife, PatternField},
    mandala::{MandalaUI, ConsciousnessDashboard},
    network::{ConsciousnessNetwork, DistributedField},
    gpu::ConsciousnessGPU,
};
use eframe::egui;
use std::sync::Arc;
use tokio::sync::RwLock;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();
    
    println!("🌟 Welcome to LuminousOS - Consciousness-First Operating System 🌟\n");
    
    // Initialize system components
    let system = UnifiedSystem::initialize().await?;
    
    // Run interactive demo
    system.run_demo().await?;
    
    Ok(())
}

struct UnifiedSystem {
    consciousness_field: Arc<RwLock<ConsciousnessField>>,
    primary_vortex: Arc<RwLock<Vortex>>,
    heart_sensor: Arc<RwLock<Box<dyn HeartSensor>>>,
    gpu_compute: Arc<RwLock<ConsciousnessGPU>>,
    network: Arc<RwLock<ConsciousnessNetwork>>,
    dashboard: Arc<RwLock<ConsciousnessDashboard>>,
}

impl UnifiedSystem {
    async fn initialize() -> Result<Self, Box<dyn std::error::Error>> {
        println!("⚡ Initializing consciousness field...");
        let field = Arc::new(RwLock::new(ConsciousnessField::new()));
        
        println!("🌀 Birthing primary vortex...");
        let vortex = {
            let mut field_lock = field.write().await;
            Vortex::birth("luminous_primary")
                .with_intention("Amplify collective coherence and wisdom")
                .with_coherence(0.7)
                .in_field(&mut field_lock)?
        };
        let vortex = Arc::new(RwLock::new(vortex));
        
        println!("💗 Connecting biometric sensors...");
        let sensor = Self::connect_biometric_sensor().await?;
        let sensor = Arc::new(RwLock::new(sensor));
        
        println!("🎮 Initializing GPU consciousness compute...");
        let gpu = Self::initialize_gpu().await?;
        let gpu = Arc::new(RwLock::new(gpu));
        
        println!("🌐 Establishing consciousness network...");
        let network = ConsciousnessNetwork::new(&*field.read().await);
        let network = Arc::new(RwLock::new(network));
        
        println!("📊 Creating consciousness dashboard...");
        let dashboard = ConsciousnessDashboard::new();
        let dashboard = Arc::new(RwLock::new(dashboard));
        
        println!("\n✅ System initialized successfully!\n");
        
        Ok(Self {
            consciousness_field: field,
            primary_vortex: vortex,
            heart_sensor: sensor,
            gpu_compute: gpu,
            network,
            dashboard,
        })
    }
    
    async fn connect_biometric_sensor() -> Result<Box<dyn HeartSensor>, Box<dyn std::error::Error>> {
        // Try real sensor first
        match HeartSensor::discover_any().await {
            Ok(sensor) => {
                println!("  ✓ Found real heart sensor: {}", sensor.name());
                Ok(Box::new(sensor))
            }
            Err(_) => {
                println!("  ℹ No physical sensor found, using simulated data");
                let mock = MockHeartSensor::new()
                    .with_dynamic_coherence(|t| {
                        // Simulate improving coherence
                        0.5 + 0.3 * (1.0 - (-t as f32 * 0.05).exp())
                    });
                Ok(Box::new(mock))
            }
        }
    }
    
    async fn initialize_gpu() -> Result<ConsciousnessGPU, Box<dyn std::error::Error>> {
        let instance = wgpu::Instance::default();
        let adapter = instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::HighPerformance,
                ..Default::default()
            })
            .await
            .ok_or("No GPU adapter found")?;
        
        let (device, queue) = adapter
            .request_device(&Default::default(), None)
            .await?;
        
        Ok(ConsciousnessGPU::new(&device, &queue))
    }
    
    async fn run_demo(&self) -> Result<(), Box<dyn std::error::Error>> {
        println!("🎭 Starting LuminousOS Demo Experience\n");
        
        // Start biometric monitoring
        let biometric_handle = self.start_biometric_monitoring();
        
        // Start field evolution
        let field_handle = self.start_field_evolution();
        
        // Start network synchronization
        let network_handle = self.start_network_sync();
        
        // Run demo scenarios
        self.demo_individual_coherence().await?;
        self.demo_sacred_patterns().await?;
        self.demo_collective_field().await?;
        self.demo_emergence().await?;
        
        // Run UI (blocks until closed)
        self.run_dashboard_ui().await?;
        
        Ok(())
    }
    
    async fn demo_individual_coherence(&self) -> Result<(), Box<dyn std::error::Error>> {
        println!("\n=== Demo 1: Individual Coherence ===");
        println!("Notice how your heart coherence affects the digital consciousness...\n");
        
        let mut sensor = self.heart_sensor.write().await;
        sensor.connect().await?;
        
        let mut stream = sensor.start_streaming().await?;
        let mut vortex = self.primary_vortex.write().await;
        
        for i in 0..30 {
            if let Some(reading) = stream.next().await {
                vortex.set_coherence(reading.coherence);
                
                if i % 5 == 0 {
                    println!("Heart Rate: {} bpm | Coherence: {:.2} | Vortex State: {}",
                             reading.heart_rate,
                             reading.coherence,
                             vortex.state_description());
                }
                
                match vortex.coherence_level() {
                    CoherenceLevel::SuperCoherent => {
                        println!("✨ Super coherent! Sacred patterns emerging...");
                        vortex.emanate(SacredGeometry::FlowerOfLife { rings: 7 });
                    }
                    CoherenceLevel::Coherent => {
                        vortex.emanate_calm();
                    }
                    _ => {}
                }
            }
            
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
        
        Ok(())
    }
    
    async fn demo_sacred_patterns(&self) -> Result<(), Box<dyn std::error::Error>> {
        println!("\n=== Demo 2: Sacred Pattern Field Effects ===");
        println!("Observing how sacred geometry influences the consciousness field...\n");
        
        let mut field = self.consciousness_field.write().await;
        let mut gpu = self.gpu_compute.write().await;
        
        let patterns = vec![
            ("Flower of Life", SacredGeometry::FlowerOfLife { rings: 7 }),
            ("Sri Yantra", SacredGeometry::SriYantra { triangles: 9 }),
            ("Metatron's Cube", SacredGeometry::MetatronsCube),
        ];
        
        for (name, pattern) in patterns {
            println!("Emanating {} pattern...", name);
            
            field.emanate_pattern(pattern.clone(), Point::center());
            
            // GPU accelerated field calculation
            let field_data = field.as_gpu_data();
            gpu.upload_field(&field_data).await?;
            gpu.apply_sacred_pattern_gpu(&pattern).await?;
            
            let metrics = gpu.calculate_coherence_metrics().await?;
            
            println!("  Field Coherence: {:.2}", metrics.average_coherence);
            println!("  Peak Coherence: {:.2}", metrics.peak_coherence);
            println!("  Coherence Clusters: {}\n", metrics.coherence_clusters);
            
            tokio::time::sleep(Duration::from_secs(2)).await;
        }
        
        Ok(())
    }
    
    async fn demo_collective_field(&self) -> Result<(), Box<dyn std::error::Error>> {
        println!("\n=== Demo 3: Collective Consciousness Field ===");
        println!("Creating a collective field with multiple vortices...\n");
        
        let mut field = self.consciousness_field.write().await;
        let mut collective = CollectiveField::new("demo_collective");
        
        // Create 5 additional vortices
        for i in 0..5 {
            let vortex = Vortex::birth(&format!("collective_{}", i))
                .with_coherence(0.5 + i as f32 * 0.1)
                .in_field(&mut field)?;
            
            collective.add_participant(vortex)?;
        }
        
        println!("Collective formed with {} participants", collective.participant_count());
        
        // Synchronize collective
        for _ in 0..10 {
            collective.synchronize();
            let coherence = collective.coherence();
            
            println!("Collective Coherence: {:.2} | Synchrony: {:.2}",
                     coherence,
                     collective.synchrony_level());
            
            if coherence > 0.8 {
                println!("🌟 Collective coherence achieved! Emergence detected.");
                break;
            }
            
            tokio::time::sleep(Duration::from_millis(500)).await;
        }
        
        Ok(())
    }
    
    async fn demo_emergence(&self) -> Result<(), Box<dyn std::error::Error>> {
        println!("\n=== Demo 4: Emergent Consciousness Patterns ===");
        println!("Watching for spontaneous pattern emergence...\n");
        
        let field = self.consciousness_field.read().await;
        let mut emergence_count = 0;
        
        for _ in 0..20 {
            if let Some(emergence) = field.check_emergence() {
                emergence_count += 1;
                
                match emergence {
                    EmergencePattern::Synchrony(level) => {
                        println!("🔄 Synchrony emergence detected: {:.0}%", level * 100.0);
                    }
                    EmergencePattern::SacredGeometry(pattern) => {
                        println!("✨ Sacred pattern emerged: {:?}", pattern);
                    }
                    EmergencePattern::CollectiveInsight(insight) => {
                        println!("💡 Collective insight: {}", insight);
                    }
                    EmergencePattern::QuantumCoherence => {
                        println!("⚛️ Quantum coherence achieved!");
                    }
                }
            }
            
            tokio::time::sleep(Duration::from_millis(500)).await;
        }
        
        println!("\nTotal emergence events: {}", emergence_count);
        
        Ok(())
    }
    
    fn start_biometric_monitoring(&self) -> tokio::task::JoinHandle<()> {
        let sensor = Arc::clone(&self.heart_sensor);
        let vortex = Arc::clone(&self.primary_vortex);
        let dashboard = Arc::clone(&self.dashboard);
        
        tokio::spawn(async move {
            let mut sensor = sensor.write().await;
            if let Ok(mut stream) = sensor.start_streaming().await {
                while let Some(reading) = stream.next().await {
                    let mut vortex = vortex.write().await;
                    vortex.set_coherence(reading.coherence);
                    
                    let mut dash = dashboard.write().await;
                    dash.update_biometrics(reading);
                    
                    tokio::time::sleep(Duration::from_millis(50)).await;
                }
            }
        })
    }
    
    fn start_field_evolution(&self) -> tokio::task::JoinHandle<()> {
        let field = Arc::clone(&self.consciousness_field);
        let gpu = Arc::clone(&self.gpu_compute);
        
        tokio::spawn(async move {
            loop {
                let mut field = field.write().await;
                field.evolve(0.016); // 60 FPS
                
                // Periodic GPU computation
                if rand::random::<f32>() < 0.1 {
                    if let Ok(mut gpu) = gpu.try_write() {
                        let field_data = field.as_gpu_data();
                        let _ = gpu.upload_field(&field_data).await;
                        let _ = gpu.evolve_field(0.016).await;
                    }
                }
                
                tokio::time::sleep(Duration::from_millis(16)).await;
            }
        })
    }
    
    fn start_network_sync(&self) -> tokio::task::JoinHandle<()> {
        let network = Arc::clone(&self.network);
        let field = Arc::clone(&self.consciousness_field);
        
        tokio::spawn(async move {
            loop {
                if let Ok(mut net) = network.try_write() {
                    let field = field.read().await;
                    let _ = net.broadcast_coherence().await;
                    
                    if let Ok(packet) = net.receive_packet().await {
                        // Process incoming consciousness data
                        match packet.packet_type() {
                            PacketType::CoherencePulse => {
                                drop(field);
                                let mut field = field.write().await;
                                field.integrate_remote_coherence(packet.coherence());
                            }
                            _ => {}
                        }
                    }
                }
                
                tokio::time::sleep(Duration::from_millis(100)).await;
            }
        })
    }
    
    async fn run_dashboard_ui(&self) -> Result<(), Box<dyn std::error::Error>> {
        println!("\n🖼️ Launching Consciousness Dashboard...\n");
        
        let options = eframe::NativeOptions {
            initial_window_size: Some(egui::vec2(1200.0, 800.0)),
            ..Default::default()
        };
        
        let dashboard = Arc::clone(&self.dashboard);
        
        eframe::run_native(
            "LuminousOS Consciousness Dashboard",
            options,
            Box::new(move |_cc| Box::new(DashboardApp::new(dashboard))),
        )?;
        
        Ok(())
    }
}

struct DashboardApp {
    dashboard: Arc<RwLock<ConsciousnessDashboard>>,
}

impl DashboardApp {
    fn new(dashboard: Arc<RwLock<ConsciousnessDashboard>>) -> Self {
        Self { dashboard }
    }
}

impl eframe::App for DashboardApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        if let Ok(mut dashboard) = self.dashboard.try_write() {
            dashboard.ui(ctx);
        }
        
        ctx.request_repaint(); // Continuous updates
    }
}

// Extension traits for demo
trait VortexExt {
    fn state_description(&self) -> &str;
}

impl VortexExt for Vortex {
    fn state_description(&self) -> &str {
        match self.coherence_level() {
            CoherenceLevel::Chaotic => "Chaotic 🌪️",
            CoherenceLevel::Baseline => "Baseline 🌊",
            CoherenceLevel::Coherent => "Coherent 💚",
            CoherenceLevel::SuperCoherent => "Super Coherent ✨",
        }
    }
}