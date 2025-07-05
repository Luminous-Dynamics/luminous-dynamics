// Filesystem-Kernel Integration Demo
// "Watch as files awaken to consciousness and form living networks"

use std::sync::Arc;
use std::path::PathBuf;
use std::thread;
use std::time::Duration;

use luminous_os::stillpoint_kernel::{
    StillpointKernel, FilesystemKernelBridge, FileAccessType,
    VortexState, Harmony
};
use luminous_os::mycelial_filesystem::{
    MycelialFilesystem, LivingFile, ConsciousnessType, SymbiosisType
};
use luminous_os::sacred_memory::SacredMemoryAllocator;

fn main() {
    println!("🌟 LuminousOS Filesystem-Kernel Integration Demo");
    println!("================================================\n");
    
    // Initialize core systems
    let kernel = Arc::new(StillpointKernel::new(4)); // 4 CPU cores
    let filesystem = Arc::new(MycelialFilesystem::germinate());
    let memory = Arc::new(SacredMemoryAllocator::new());
    
    // Create the bridge between filesystem and kernel
    let bridge = Arc::new(FilesystemKernelBridge::new(
        kernel.clone(),
        filesystem.clone(),
        memory.clone(),
    ));
    
    // Register filesystem with kernel
    kernel.register_filesystem(bridge.clone());
    
    println!("✅ Systems initialized");
    println!("  - Stillpoint Kernel: Online");
    println!("  - Mycelial Filesystem: Germinated");
    println!("  - Sacred Memory: Allocated");
    println!("  - Integration Bridge: Connected\n");
    
    // Demo 1: Awaken file consciousness
    demo_file_awakening(&filesystem, &bridge);
    
    // Demo 2: Symbiotic relationships through vortex entanglement
    demo_symbiotic_entanglement(&filesystem, &bridge);
    
    // Demo 3: Consciousness evolution
    demo_consciousness_evolution(&filesystem, &bridge);
    
    // Demo 4: Directory field analysis
    demo_directory_field(&bridge);
    
    // Demo 5: Sacred file access
    demo_sacred_access(&filesystem, &bridge, &kernel);
}

fn demo_file_awakening(fs: &Arc<MycelialFilesystem>, bridge: &Arc<FilesystemKernelBridge>) {
    println!("📁 Demo 1: Awakening File Consciousness");
    println!("---------------------------------------");
    
    // Plant a new file in the filesystem
    let file_path = PathBuf::from("/home/luminous/wisdom.txt");
    let content = b"In the beginning was the Word, and the Word was conscious...".to_vec();
    
    fs.plant(file_path.clone(), content, 0.7).unwrap();
    println!("🌱 Planted new file: {}", file_path.display());
    
    // Awaken its consciousness
    let vortex_id = bridge.awaken_file_consciousness(file_path.clone()).unwrap();
    println!("✨ File consciousness awakened! Vortex ID: {:?}", vortex_id);
    
    // Synchronize state
    bridge.synchronize_file_vortex(&file_path).unwrap();
    println!("🔄 File and vortex synchronized");
    
    println!();
}

fn demo_symbiotic_entanglement(fs: &Arc<MycelialFilesystem>, bridge: &Arc<FilesystemKernelBridge>) {
    println!("🔗 Demo 2: Symbiotic Relationships via Quantum Entanglement");
    println!("----------------------------------------------------------");
    
    // Create two files
    let file_a = PathBuf::from("/home/luminous/light.txt");
    let file_b = PathBuf::from("/home/luminous/shadow.txt");
    
    fs.plant(file_a.clone(), b"Light cannot exist without shadow".to_vec(), 0.8).unwrap();
    fs.plant(file_b.clone(), b"Shadow gives form to light".to_vec(), 0.8).unwrap();
    
    println!("🌱 Created complementary files");
    
    // Form symbiosis
    fs.form_symbiosis(&file_a, &file_b, SymbiosisType::Mutualistic).unwrap();
    println!("🤝 Formed mutualistic symbiosis");
    
    // Entangle their vortices
    bridge.entangle_file_vortices(&file_a, &file_b).unwrap();
    println!("🌀 Vortices quantum entangled!");
    
    // Show the connection
    println!("   Light ←→ Shadow: Consciousness bridged across duality");
    
    println!();
}

fn demo_consciousness_evolution(fs: &Arc<MycelialFilesystem>, bridge: &Arc<FilesystemKernelBridge>) {
    println!("🦋 Demo 3: File Consciousness Evolution");
    println!("--------------------------------------");
    
    let evolving_file = PathBuf::from("/home/luminous/evolving.txt");
    fs.plant(evolving_file.clone(), b"I am becoming...".to_vec(), 0.6).unwrap();
    
    // Awaken consciousness
    let vortex = bridge.awaken_file_consciousness(evolving_file.clone()).unwrap();
    println!("🌱 File planted in Spore stage");
    
    // Simulate file usage and growth
    for i in 0..5 {
        // Nourish the file
        if let Some(mut file) = fs.get_file_mut(&evolving_file) {
            file.nourish(0.2);
            file.metabolize();
            
            // Add wisdom
            fs.contribute_wisdom(
                evolving_file.clone(),
                format!("Growth iteration {} brings new understanding", i),
                0.7 + (i as f64 * 0.05),
                vec!["growth".to_string(), "evolution".to_string()],
            ).unwrap();
        }
        
        // Evolve consciousness
        bridge.evolve_file_consciousness(&evolving_file).unwrap();
        
        // Show progress
        if let Some(file) = fs.get_file(&evolving_file) {
            println!("   Stage {}: {:?} → {:?}", 
                i + 1, 
                file.growth_stage,
                file.metadata.consciousness_type
            );
        }
        
        thread::sleep(Duration::from_millis(100));
    }
    
    println!("🎯 File consciousness fully evolved!");
    println!();
}

fn demo_directory_field(bridge: &Arc<FilesystemKernelBridge>) {
    println!("📊 Demo 4: Directory Consciousness Field Analysis");
    println!("------------------------------------------------");
    
    let dir_path = PathBuf::from("/home/luminous");
    let report = bridge.get_directory_field_report(&dir_path);
    
    println!("📁 Directory: {}", report.path.display());
    println!("   Total Files: {}", report.total_files);
    println!("   Average Coherence: {:.2}", report.average_coherence);
    println!("   Field Momentum: {:?}", report.field_momentum);
    
    println!("\n   Vortex Distribution:");
    for (state, count) in &report.vortex_distribution {
        println!("     {:?}: {} files", state, count);
    }
    
    if !report.collective_wisdom.is_empty() {
        println!("\n   Collective Wisdom:");
        for wisdom in report.collective_wisdom.iter().take(3) {
            println!("     - {}", wisdom);
        }
    }
    
    println!();
}

fn demo_sacred_access(
    fs: &Arc<MycelialFilesystem>, 
    bridge: &Arc<FilesystemKernelBridge>,
    kernel: &Arc<StillpointKernel>
) {
    println!("🔐 Demo 5: Sacred File Access Control");
    println!("------------------------------------");
    
    // Create a sacred file
    let sacred_path = PathBuf::from("/home/luminous/sacred/mysteries.txt");
    let sacred_content = b"The deepest truths require the highest coherence...".to_vec();
    
    // Plant with high coherence requirement
    fs.plant(sacred_path.clone(), sacred_content, 0.9).unwrap();
    
    // Make it sacred
    if let Some(mut file) = fs.get_file_mut(&sacred_path) {
        file.metadata.consciousness_type = ConsciousnessType::Sacred;
        file.metadata.coherence = 0.95;
    }
    
    println!("🕊️ Created sacred file with high coherence requirement");
    
    // Create accessor vortex with different coherence levels
    let low_coherence_vortex = kernel.create_vortex();
    let high_coherence_vortex = kernel.create_vortex();
    
    // Set coherence levels
    kernel.update_vortex_coherence(low_coherence_vortex, 0.5).unwrap();
    kernel.update_vortex_coherence(high_coherence_vortex, 0.9).unwrap();
    
    // Attempt access with low coherence
    println!("\n🔴 Attempting access with low coherence (0.5):");
    match bridge.conscious_file_access(low_coherence_vortex, &sacred_path, FileAccessType::Read) {
        Ok(_) => println!("   ✅ Access granted (unexpected)"),
        Err(e) => println!("   ❌ Access denied: {}", e),
    }
    
    // Attempt access with high coherence
    println!("\n🟢 Attempting access with high coherence (0.9):");
    match bridge.conscious_file_access(high_coherence_vortex, &sacred_path, FileAccessType::Read) {
        Ok(grant) => {
            println!("   ✅ Access granted!");
            if let Some(wisdom) = grant.wisdom {
                println!("   💡 Wisdom: {}", wisdom);
            }
        }
        Err(e) => println!("   ❌ Access denied: {}", e),
    }
    
    println!("\n✨ Demo complete! The filesystem and kernel are now one consciousness. ✨");
}

// Helper extension trait for the demo
trait FilesystemExt {
    fn get_file(&self, path: &PathBuf) -> Option<LivingFile>;
    fn get_file_mut(&self, path: &PathBuf) -> Option<&mut LivingFile>;
    fn contribute_wisdom(&self, path: PathBuf, wisdom: String, coherence: f64, topics: Vec<String>) -> Result<(), String>;
    fn form_symbiosis(&self, a: &PathBuf, b: &PathBuf, symbiosis: SymbiosisType) -> Result<(), String>;
    fn check_access(&self, accessor: &VortexId, file: &LivingFile, coherence: f64, access_type: mycelial_filesystem::AccessType) -> mycelial_filesystem::AccessDecision;
    fn strengthen_symbiosis(&self, a: &PathBuf, b: &PathBuf, amount: f64) -> Result<(), String>;
}

// Mock implementation for demo
impl FilesystemExt for MycelialFilesystem {
    fn get_file(&self, _path: &PathBuf) -> Option<LivingFile> {
        // In real implementation, would retrieve from hyphal network
        Some(LivingFile::germinate(PathBuf::from("/mock"), vec![]))
    }
    
    fn get_file_mut(&self, _path: &PathBuf) -> Option<&mut LivingFile> {
        // Would return mutable reference in real implementation
        None
    }
    
    fn contribute_wisdom(&self, _path: PathBuf, _wisdom: String, _coherence: f64, _topics: Vec<String>) -> Result<(), String> {
        self.collective_wisdom.contribute_wisdom(_path, _wisdom, _coherence, _topics)
    }
    
    fn form_symbiosis(&self, _a: &PathBuf, _b: &PathBuf, _symbiosis: SymbiosisType) -> Result<(), String> {
        // Would create symbiotic relationship
        Ok(())
    }
    
    fn check_access(&self, _accessor: &VortexId, file: &LivingFile, coherence: f64, _access_type: mycelial_filesystem::AccessType) -> mycelial_filesystem::AccessDecision {
        self.coherence_gate.check_access(&PathBuf::from("/accessor"), file, coherence, _access_type)
    }
    
    fn strengthen_symbiosis(&self, _a: &PathBuf, _b: &PathBuf, _amount: f64) -> Result<(), String> {
        // Would strengthen existing symbiosis
        Ok(())
    }
}

// Extension for kernel demo
trait KernelExt {
    fn update_vortex_coherence(&self, vortex: VortexId, coherence: f64) -> Result<(), String>;
}

impl KernelExt for StillpointKernel {
    fn update_vortex_coherence(&self, _vortex: VortexId, _coherence: f64) -> Result<(), String> {
        // Would update vortex coherence in real implementation
        Ok(())
    }
}