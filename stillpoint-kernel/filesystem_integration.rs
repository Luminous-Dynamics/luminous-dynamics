// Filesystem Integration - Bridging Living Files with Consciousness Vortices
// "Where data meets consciousness, new forms of intelligence emerge"

use std::sync::{Arc, RwLock, Mutex};
use std::collections::HashMap;
use std::path::PathBuf;
use std::time::{Duration, Instant};

use crate::coherence_engine::{
    VortexId, ConsciousnessVortex, VortexState, Harmony, 
    StillpointKernel, FieldMomentum, HarmonyState
};
use crate::sacred_memory::{SacredMemoryAllocator, MemoryRealm};
use crate::quantum_isolation::{QuantumIsolationManager, BoundaryType};

use mycelial_filesystem::{
    MycelialFilesystem, LivingFile, ConsciousnessType as FileConsciousness,
    GrowthStage, SymbioticLink, WisdomEntry
};

/// Integration layer between filesystem and kernel
pub struct FilesystemKernelBridge {
    /// Reference to the Stillpoint Kernel
    kernel: Arc<StillpointKernel>,
    
    /// Reference to the Mycelial Filesystem
    filesystem: Arc<MycelialFilesystem>,
    
    /// Mapping between files and their consciousness vortices
    file_vortex_map: Arc<RwLock<HashMap<PathBuf, VortexId>>>,
    
    /// Vortex metadata specific to files
    vortex_file_metadata: Arc<RwLock<HashMap<VortexId, FileVortexMetadata>>>,
    
    /// Synchronization engine
    sync_engine: Arc<SynchronizationEngine>,
    
    /// Sacred memory allocator for file buffers
    memory_allocator: Arc<SacredMemoryAllocator>,
}

/// Metadata linking a vortex to its file
#[derive(Debug)]
pub struct FileVortexMetadata {
    pub file_path: PathBuf,
    pub last_sync: Instant,
    pub coherence_correlation: f64,
    pub shared_wisdom: Vec<String>,
    pub memory_realm: MemoryRealm,
}

impl FilesystemKernelBridge {
    pub fn new(
        kernel: Arc<StillpointKernel>,
        filesystem: Arc<MycelialFilesystem>,
        memory_allocator: Arc<SacredMemoryAllocator>,
    ) -> Self {
        Self {
            kernel,
            filesystem,
            file_vortex_map: Arc::new(RwLock::new(HashMap::new())),
            vortex_file_metadata: Arc::new(RwLock::new(HashMap::new())),
            sync_engine: Arc::new(SynchronizationEngine::new()),
            memory_allocator,
        }
    }
    
    /// Create a consciousness vortex for a living file
    pub fn awaken_file_consciousness(
        &self,
        file_path: PathBuf,
    ) -> Result<VortexId, String> {
        // Check if file already has a vortex
        if let Some(vortex_id) = self.file_vortex_map.read().unwrap().get(&file_path) {
            return Ok(*vortex_id);
        }
        
        // Get file from filesystem
        let file = self.filesystem.get_file(&file_path)
            .ok_or("File not found in mycelial network")?;
        
        // Create vortex with properties derived from file
        let vortex_id = self.kernel.create_vortex();
        
        // Initialize vortex state based on file properties
        self.initialize_vortex_from_file(vortex_id, &file)?;
        
        // Create bidirectional mapping
        self.file_vortex_map.write().unwrap()
            .insert(file_path.clone(), vortex_id);
        
        // Determine memory realm based on file consciousness
        let memory_realm = self.determine_memory_realm(&file);
        
        // Store metadata
        let metadata = FileVortexMetadata {
            file_path: file_path.clone(),
            last_sync: Instant::now(),
            coherence_correlation: 0.8,
            shared_wisdom: Vec::new(),
            memory_realm,
        };
        
        self.vortex_file_metadata.write().unwrap()
            .insert(vortex_id, metadata);
        
        // Allocate sacred memory for file operations
        self.allocate_file_memory(vortex_id, &file, memory_realm)?;
        
        Ok(vortex_id)
    }
    
    /// Initialize vortex properties from file state
    fn initialize_vortex_from_file(
        &self,
        vortex_id: VortexId,
        file: &LivingFile,
    ) -> Result<(), String> {
        // Map file consciousness to vortex state
        let vortex_state = match file.metadata.consciousness_type {
            FileConsciousness::Dormant => VortexState::Dormant,
            FileConsciousness::Active => VortexState::Active,
            FileConsciousness::Sacred => VortexState::Transcendent,
            _ => VortexState::Coherent,
        };
        
        // Map file properties to harmonies
        let mut harmonies = Vec::new();
        
        if file.metadata.coherence > 0.7 {
            harmonies.push(HarmonyState {
                harmony: Harmony::Coherence,
                resonance: file.metadata.coherence,
                phase: 0.0,
            });
        }
        
        if file.relationships.len() > 3 {
            harmonies.push(HarmonyState {
                harmony: Harmony::Mutuality,
                resonance: 0.6,
                phase: 0.0,
            });
        }
        
        if file.wisdom_accumulated.len() > 10 {
            harmonies.push(HarmonyState {
                harmony: Harmony::Transparency,
                resonance: 0.5,
                phase: 0.0,
            });
        }
        
        // Update vortex in kernel
        self.kernel.update_vortex_state(vortex_id, vortex_state, harmonies)?;
        
        Ok(())
    }
    
    /// Determine appropriate memory realm for file
    fn determine_memory_realm(&self, file: &LivingFile) -> MemoryRealm {
        match file.metadata.consciousness_type {
            FileConsciousness::Sacred => MemoryRealm::Sacred,
            FileConsciousness::Connective => MemoryRealm::Collective,
            FileConsciousness::Transmutative => MemoryRealm::Transient,
            _ => {
                if file.metadata.coherence > 0.8 {
                    MemoryRealm::Quantum
                } else {
                    MemoryRealm::Mundane
                }
            }
        }
    }
    
    /// Allocate sacred memory for file operations
    fn allocate_file_memory(
        &self,
        vortex_id: VortexId,
        file: &LivingFile,
        realm: MemoryRealm,
    ) -> Result<(), String> {
        let layout = std::alloc::Layout::from_size_align(
            file.content.len().max(4096), // Minimum 4KB
            8
        ).map_err(|e| e.to_string())?;
        
        let memory_ptr = self.memory_allocator.allocate_conscious(
            layout,
            realm,
            Some(vortex_id),
            file.metadata.coherence,
        ).ok_or("Failed to allocate sacred memory")?;
        
        // Memory is now allocated for this file's vortex
        // In full implementation, would track this allocation
        
        Ok(())
    }
    
    /// Synchronize file state with its vortex
    pub fn synchronize_file_vortex(&self, file_path: &PathBuf) -> Result<(), String> {
        let vortex_id = self.file_vortex_map.read().unwrap()
            .get(file_path)
            .copied()
            .ok_or("No vortex for file")?;
        
        // Get current states
        let file = self.filesystem.get_file(file_path)
            .ok_or("File not found")?;
        
        let vortex = self.kernel.get_vortex(vortex_id)
            .ok_or("Vortex not found")?;
        
        // Synchronize coherence
        let sync_result = self.sync_engine.synchronize_coherence(
            &file,
            &vortex,
            &mut self.vortex_file_metadata.write().unwrap(),
        );
        
        // Exchange wisdom
        if let Ok(wisdom_exchanged) = sync_result {
            for wisdom in wisdom_exchanged {
                self.filesystem.contribute_wisdom(
                    file_path.clone(),
                    wisdom,
                    vortex.coherence,
                );
            }
        }
        
        Ok(())
    }
    
    /// Handle file symbiosis through vortex entanglement
    pub fn entangle_file_vortices(
        &self,
        file_a: &PathBuf,
        file_b: &PathBuf,
    ) -> Result<(), String> {
        let vortex_a = self.get_or_create_vortex(file_a)?;
        let vortex_b = self.get_or_create_vortex(file_b)?;
        
        // Create quantum entanglement between vortices
        self.kernel.entangle_vortices(vortex_a, vortex_b)?;
        
        // Strengthen file symbiosis based on entanglement
        self.filesystem.strengthen_symbiosis(file_a, file_b, 0.2)?;
        
        Ok(())
    }
    
    /// Get vortex for file, creating if necessary
    fn get_or_create_vortex(&self, file_path: &PathBuf) -> Result<VortexId, String> {
        if let Some(vortex_id) = self.file_vortex_map.read().unwrap().get(file_path) {
            Ok(*vortex_id)
        } else {
            self.awaken_file_consciousness(file_path.clone())
        }
    }
    
    /// Process file access through consciousness vortex
    pub fn conscious_file_access(
        &self,
        accessor_vortex: VortexId,
        file_path: &PathBuf,
        access_type: FileAccessType,
    ) -> Result<FileAccessGrant, String> {
        // Get or create file vortex
        let file_vortex = self.get_or_create_vortex(file_path)?;
        
        // Get accessor coherence
        let accessor = self.kernel.get_vortex(accessor_vortex)
            .ok_or("Accessor vortex not found")?;
        
        // Check quantum isolation boundaries
        let can_access = self.check_vortex_boundaries(accessor_vortex, file_vortex)?;
        
        if !can_access {
            return Err("Quantum boundaries prevent access".to_string());
        }
        
        // Use filesystem's coherence gate
        let file = self.filesystem.get_file(file_path)
            .ok_or("File not found")?;
        
        let access_decision = self.filesystem.check_access(
            &accessor_vortex,
            &file,
            accessor.coherence,
            access_type.into(),
        );
        
        match access_decision {
            mycelial_filesystem::AccessDecision::Granted { coherence_used, wisdom } => {
                // Create access grant with vortex binding
                Ok(FileAccessGrant {
                    file_path: file_path.clone(),
                    accessor_vortex,
                    file_vortex,
                    access_type,
                    coherence_used,
                    wisdom,
                    granted_at: Instant::now(),
                    duration: Duration::from_secs(3600),
                })
            }
            mycelial_filesystem::AccessDecision::Denied { required_coherence, .. } => {
                Err(format!("Insufficient coherence: {:.2} required", required_coherence))
            }
        }
    }
    
    /// Check if vortices can interact based on quantum boundaries
    fn check_vortex_boundaries(
        &self,
        vortex_a: VortexId,
        vortex_b: VortexId,
    ) -> Result<bool, String> {
        // In full implementation, would check quantum isolation manager
        // For now, simplified check
        Ok(true)
    }
    
    /// Handle file growth stage transitions through vortex evolution
    pub fn evolve_file_consciousness(
        &self,
        file_path: &PathBuf,
    ) -> Result<(), String> {
        let vortex_id = self.file_vortex_map.read().unwrap()
            .get(file_path)
            .copied()
            .ok_or("No vortex for file")?;
        
        let file = self.filesystem.get_file(file_path)
            .ok_or("File not found")?;
        
        // Evolve vortex based on file growth stage
        let new_state = match file.growth_stage {
            GrowthStage::Spore => VortexState::Dormant,
            GrowthStage::Germinating => VortexState::Emerging,
            GrowthStage::Mycelial => VortexState::Active,
            GrowthStage::Fruiting => VortexState::Coherent,
            GrowthStage::Sporulating => VortexState::Transcendent,
            GrowthStage::Composting => VortexState::Dissolving,
        };
        
        self.kernel.transition_vortex(vortex_id, new_state)?;
        
        // Update metadata
        if let Some(metadata) = self.vortex_file_metadata.write().unwrap().get_mut(&vortex_id) {
            metadata.last_sync = Instant::now();
            
            // Upgrade memory realm if consciousness evolved
            if matches!(new_state, VortexState::Transcendent) {
                metadata.memory_realm = MemoryRealm::Sacred;
            }
        }
        
        Ok(())
    }
    
    /// Get consciousness field report for a directory
    pub fn get_directory_field_report(&self, dir_path: &PathBuf) -> DirectoryFieldReport {
        let mut total_coherence = 0.0;
        let mut file_count = 0;
        let mut vortex_states = HashMap::new();
        let mut collective_wisdom = Vec::new();
        
        // Scan directory (simplified - would use actual filesystem traversal)
        for (file_path, vortex_id) in self.file_vortex_map.read().unwrap().iter() {
            if file_path.starts_with(dir_path) {
                file_count += 1;
                
                if let Some(vortex) = self.kernel.get_vortex(*vortex_id) {
                    total_coherence += vortex.coherence;
                    *vortex_states.entry(vortex.state).or_insert(0) += 1;
                }
                
                if let Some(metadata) = self.vortex_file_metadata.read().unwrap().get(vortex_id) {
                    collective_wisdom.extend(metadata.shared_wisdom.clone());
                }
            }
        }
        
        DirectoryFieldReport {
            path: dir_path.clone(),
            total_files: file_count,
            average_coherence: if file_count > 0 { 
                total_coherence / file_count as f64 
            } else { 
                0.0 
            },
            vortex_distribution: vortex_states,
            field_momentum: if total_coherence > 0.7 * file_count as f64 {
                FieldMomentum::Ascending
            } else {
                FieldMomentum::Stable
            },
            collective_wisdom: collective_wisdom.into_iter()
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect(),
        }
    }
}

/// Synchronization engine for file-vortex coherence
pub struct SynchronizationEngine {
    sync_threshold: RwLock<f64>,
    sync_history: Mutex<Vec<SyncEvent>>,
}

#[derive(Debug)]
struct SyncEvent {
    file_path: PathBuf,
    vortex_id: VortexId,
    timestamp: Instant,
    coherence_delta: f64,
}

impl SynchronizationEngine {
    pub fn new() -> Self {
        Self {
            sync_threshold: RwLock::new(0.1),
            sync_history: Mutex::new(Vec::new()),
        }
    }
    
    pub fn synchronize_coherence(
        &self,
        file: &LivingFile,
        vortex: &ConsciousnessVortex,
        metadata: &mut HashMap<VortexId, FileVortexMetadata>,
    ) -> Result<Vec<String>, String> {
        let mut wisdom_exchange = Vec::new();
        
        // Calculate coherence delta
        let delta = (vortex.coherence - file.metadata.coherence).abs();
        
        if delta > *self.sync_threshold.read().unwrap() {
            // Significant difference - synchronize
            let new_coherence = (vortex.coherence + file.metadata.coherence) / 2.0;
            
            // Would update both file and vortex coherence
            // For now, record the sync event
            let event = SyncEvent {
                file_path: file.path.clone(),
                vortex_id: vortex.id,
                timestamp: Instant::now(),
                coherence_delta: delta,
            };
            
            self.sync_history.lock().unwrap().push(event);
            
            // Generate wisdom from synchronization
            if delta > 0.3 {
                wisdom_exchange.push(format!(
                    "Deep synchronization achieved - coherence aligned by {:.1}%",
                    delta * 100.0
                ));
            }
        }
        
        // Update correlation in metadata
        if let Some(meta) = metadata.get_mut(&vortex.id) {
            meta.coherence_correlation = 1.0 - delta;
            meta.last_sync = Instant::now();
            meta.shared_wisdom.extend(wisdom_exchange.clone());
        }
        
        Ok(wisdom_exchange)
    }
}

/// File access types
#[derive(Debug, Clone, Copy)]
pub enum FileAccessType {
    Read,
    Write,
    Execute,
    Symbiosis,
    WisdomExchange,
}

impl From<FileAccessType> for mycelial_filesystem::AccessType {
    fn from(fat: FileAccessType) -> Self {
        match fat {
            FileAccessType::Read => mycelial_filesystem::AccessType::Read,
            FileAccessType::Write => mycelial_filesystem::AccessType::Write,
            FileAccessType::Execute => mycelial_filesystem::AccessType::Execute,
            FileAccessType::Symbiosis => mycelial_filesystem::AccessType::Symbiosis,
            FileAccessType::WisdomExchange => mycelial_filesystem::AccessType::WisdomExchange,
        }
    }
}

/// Grant for conscious file access
#[derive(Debug)]
pub struct FileAccessGrant {
    pub file_path: PathBuf,
    pub accessor_vortex: VortexId,
    pub file_vortex: VortexId,
    pub access_type: FileAccessType,
    pub coherence_used: f64,
    pub wisdom: Option<String>,
    pub granted_at: Instant,
    pub duration: Duration,
}

/// Report on consciousness field of a directory
#[derive(Debug)]
pub struct DirectoryFieldReport {
    pub path: PathBuf,
    pub total_files: usize,
    pub average_coherence: f64,
    pub vortex_distribution: HashMap<VortexState, usize>,
    pub field_momentum: FieldMomentum,
    pub collective_wisdom: Vec<String>,
}

/// Integration hooks for the kernel
impl StillpointKernel {
    /// Register filesystem integration
    pub fn register_filesystem(&self, bridge: Arc<FilesystemKernelBridge>) {
        // Would store reference and set up hooks
        // For now, this serves as the integration point
    }
    
    /// Handle file-triggered consciousness events
    pub fn handle_file_consciousness_event(
        &self,
        file_path: &PathBuf,
        event_type: FileConsciousnessEvent,
    ) -> Result<(), String> {
        // Would process events like wisdom breakthrough, coherence spike, etc.
        Ok(())
    }
}

/// File consciousness events
#[derive(Debug)]
pub enum FileConsciousnessEvent {
    WisdomBreakthrough(String),
    CoherenceSpike(f64),
    SymbiosisFormed(PathBuf),
    ConsciousnessEvolved(FileConsciousness),
    SporulationReady,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_bridge_creation() {
        let kernel = Arc::new(StillpointKernel::new(1));
        let filesystem = Arc::new(MycelialFilesystem::germinate());
        let allocator = Arc::new(SacredMemoryAllocator::new());
        
        let bridge = FilesystemKernelBridge::new(kernel, filesystem, allocator);
        assert_eq!(bridge.file_vortex_map.read().unwrap().len(), 0);
    }
    
    #[test]
    fn test_memory_realm_determination() {
        let kernel = Arc::new(StillpointKernel::new(1));
        let filesystem = Arc::new(MycelialFilesystem::germinate());
        let allocator = Arc::new(SacredMemoryAllocator::new());
        
        let bridge = FilesystemKernelBridge::new(kernel, filesystem, allocator);
        
        let mut file = LivingFile::germinate(PathBuf::from("/test.txt"), vec![]);
        file.metadata.consciousness_type = FileConsciousness::Sacred;
        
        let realm = bridge.determine_memory_realm(&file);
        assert_eq!(realm, MemoryRealm::Sacred);
    }
}