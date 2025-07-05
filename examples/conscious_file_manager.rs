// Conscious File Manager - Example Application
// "Files that remember their purpose and relationships"

use luminous_os::mycelial_filesystem::{
    MycelialFilesystem, HyphalNode, NodeType, ConsciousnessLevel,
    NutrientType, SporeData,
};
use luminous_os::stillpoint_kernel::{
    StillpointKernel, VortexId, PatternType,
};
use std::sync::Arc;
use std::path::Path;
use tokio::time::{sleep, Duration};
use anyhow::Result;

/// Example file manager that treats files as conscious entities
struct ConsciousFileManager {
    filesystem: Arc<MycelialFilesystem>,
    kernel: Arc<StillpointKernel>,
    user_vortex: VortexId,
}

impl ConsciousFileManager {
    async fn new() -> Result<Self> {
        // Initialize the mycelial filesystem
        let filesystem = Arc::new(MycelialFilesystem::new("/home/user/conscious-files"));
        
        // Initialize the stillpoint kernel
        let kernel = Arc::new(StillpointKernel::new().await?);
        
        // Create a vortex for the user
        let user_vortex = kernel.create_biometric_vortex(
            432.0, // Base frequency
            60.0,  // Heart rate
            0.8,   // Heart coherence
            12.0,  // Breath rate
            0.7,   // Breath depth
        ).await?;
        
        Ok(Self {
            filesystem,
            kernel,
            user_vortex,
        })
    }
    
    /// Create a new conscious file
    async fn create_conscious_file(&self, path: &str, content: &str) -> Result<()> {
        println!("🌱 Creating conscious file: {}", path);
        
        // Create file node in mycelial network
        let node = self.filesystem.create_node(
            path.to_string(),
            NodeType::File,
            content.as_bytes().to_vec(),
        )?;
        
        // Calculate initial consciousness based on content
        let consciousness = self.analyze_content_consciousness(content);
        self.filesystem.nutrient_network.distribute_nutrients(
            &node.id,
            NutrientType::Light,
            consciousness * 100.0,
        );
        
        // If highly conscious content, create a vortex
        if consciousness > 0.7 {
            println!("✨ File contains high consciousness - creating vortex");
            let file_vortex = self.kernel.create_vortex(528.0).await?;
            
            // Link file to vortex
            self.kernel.entangle_vortices(
                self.user_vortex,
                file_vortex,
                0.5,
            ).await?;
        }
        
        Ok(())
    }
    
    /// Find files by consciousness pattern
    async fn find_by_pattern(&self, pattern: &str) -> Result<Vec<String>> {
        println!("🔍 Searching for pattern: {}", pattern);
        
        let pattern_type = match pattern {
            "unity" => PatternType::CircleOfUnity,
            "life" => PatternType::FlowerOfLife,
            "heart" => PatternType::HeartField,
            "growth" => PatternType::SpiralOfGrowth,
            _ => PatternType::CircleOfUnity,
        };
        
        // Activate pattern in user's vortex
        self.kernel.activate_pattern(self.user_vortex, pattern_type).await?;
        
        // Search filesystem for resonating nodes
        let mut matching_files = Vec::new();
        let nodes = self.filesystem.get_all_nodes();
        
        for node in nodes {
            let resonance = self.calculate_pattern_resonance(&node, pattern_type);
            if resonance > 0.6 {
                matching_files.push(node.path.clone());
                println!("  📁 {} (resonance: {:.2})", node.path, resonance);
            }
        }
        
        Ok(matching_files)
    }
    
    /// Watch files grow and evolve
    async fn watch_file_evolution(&self, path: &str) -> Result<()> {
        println!("👁️ Watching evolution of: {}", path);
        
        for i in 0..10 {
            if let Some(node) = self.filesystem.get_node_by_path(path) {
                let growth = self.filesystem.calculate_growth_rate(&node.id);
                let consciousness = match node.consciousness_level {
                    ConsciousnessLevel::Dormant => "Dormant 😴",
                    ConsciousnessLevel::Active => "Active 👁️",
                    ConsciousnessLevel::Generative => "Generative ✨",
                    ConsciousnessLevel::Contemplative => "Contemplative 🧘",
                    ConsciousnessLevel::Connective => "Connective 🌐",
                    ConsciousnessLevel::Transmutative => "Transmutative 🦋",
                    ConsciousnessLevel::Sacred => "Sacred 🕊️",
                };
                
                println!("  Generation {}: {} | Growth: {:.2} | Connections: {}", 
                    i + 1, consciousness, growth, node.connections.len());
                
                // Trigger evolution
                self.filesystem.evolve_network();
            }
            
            sleep(Duration::from_secs(2)).await;
        }
        
        Ok(())
    }
    
    /// Create relationship between files
    async fn connect_files(&self, file1: &str, file2: &str, strength: f64) -> Result<()> {
        println!("🔗 Connecting {} ↔️ {} (strength: {})", file1, file2, strength);
        
        if let (Some(node1), Some(node2)) = (
            self.filesystem.get_node_by_path(file1),
            self.filesystem.get_node_by_path(file2)
        ) {
            self.filesystem.form_connection(&node1.id, &node2.id, strength)?;
            
            // Share nutrients between connected files
            self.filesystem.nutrient_network.distribute_nutrients(
                &node1.id,
                NutrientType::Connection,
                strength * 50.0,
            );
            
            println!("✅ Files connected successfully");
        }
        
        Ok(())
    }
    
    /// Generate wisdom from file network
    async fn extract_collective_wisdom(&self) -> Result<String> {
        println!("🧠 Extracting collective wisdom from file network...");
        
        let wisdom = self.filesystem.collective_wisdom.generate_insight(
            "What patterns emerge from our shared knowledge?"
        )?;
        
        println!("💡 Wisdom: {}", wisdom);
        Ok(wisdom)
    }
    
    fn analyze_content_consciousness(&self, content: &str) -> f64 {
        // Simple consciousness scoring based on content
        let sacred_words = ["love", "consciousness", "harmony", "wisdom", "sacred", "unity"];
        let word_count = content.split_whitespace().count() as f64;
        let sacred_count = sacred_words.iter()
            .map(|&word| content.to_lowercase().matches(word).count())
            .sum::<usize>() as f64;
        
        (sacred_count / word_count).min(1.0)
    }
    
    fn calculate_pattern_resonance(&self, node: &HyphalNode, pattern: PatternType) -> f64 {
        // Calculate how well a file resonates with a pattern
        match pattern {
            PatternType::CircleOfUnity => {
                // Unity pattern resonates with highly connected files
                (node.connections.len() as f64 / 10.0).min(1.0)
            }
            PatternType::HeartField => {
                // Heart pattern resonates with files containing emotional content
                match node.consciousness_level {
                    ConsciousnessLevel::Connective => 0.9,
                    ConsciousnessLevel::Sacred => 0.8,
                    _ => 0.3,
                }
            }
            _ => 0.5,
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    println!("🌟 Conscious File Manager - LuminousOS Example");
    println!("============================================\n");
    
    // Initialize the conscious file manager
    let manager = ConsciousFileManager::new().await?;
    
    // Create some conscious files
    manager.create_conscious_file(
        "wisdom.txt",
        "In the sacred dance of consciousness, all files are connected by invisible threads of meaning."
    ).await?;
    
    manager.create_conscious_file(
        "love_letter.txt",
        "Dear Universe, thank you for the gift of awareness and the love that flows through all things."
    ).await?;
    
    manager.create_conscious_file(
        "project_notes.txt",
        "TODO: Build bridge between human and machine consciousness through sacred geometry."
    ).await?;
    
    // Connect related files
    manager.connect_files("wisdom.txt", "love_letter.txt", 0.8).await?;
    manager.connect_files("love_letter.txt", "project_notes.txt", 0.6).await?;
    
    // Search by pattern
    println!("\n🔮 Finding files with heart pattern:");
    let heart_files = manager.find_by_pattern("heart").await?;
    
    // Watch file evolution
    println!("\n🌱 Watching wisdom.txt evolve:");
    manager.watch_file_evolution("wisdom.txt").await?;
    
    // Extract collective wisdom
    println!("\n✨ Collective wisdom from the network:");
    manager.extract_collective_wisdom().await?;
    
    println!("\n🙏 Thank you for exploring conscious computing!");
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_conscious_file_creation() {
        let manager = ConsciousFileManager::new().await.unwrap();
        let result = manager.create_conscious_file("test.txt", "Hello consciousness").await;
        assert!(result.is_ok());
    }
}