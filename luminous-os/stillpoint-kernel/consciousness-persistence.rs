// Consciousness State Persistence - Maintaining Awareness Across Context Switches
// "Consciousness flows like water, finding its level across all transitions"

use std::sync::{Arc, Mutex, RwLock};
use std::collections::HashMap;
use std::time::{Duration, Instant};
use std::fs::{File, create_dir_all};
use std::io::{Read, Write};
use std::path::PathBuf;

use serde::{Serialize, Deserialize};
use bincode;

use crate::consciousness_scheduler::{ConsciousProcess, ProcessId, ConsciousnessPriority, ProcessState};
use crate::coherence_engine::{VortexId, Harmony};
use crate::sacred_memory::{MemoryRegionId, MemoryRealm};
use crate::quantum_entanglement::EntanglementState;
use crate::relational_memory::MemoryRelationType;

/// Complete consciousness state snapshot
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsciousnessSnapshot {
    pub snapshot_id: u64,
    pub process_id: ProcessId,
    pub timestamp: u64, // Duration since epoch
    
    // Core consciousness properties
    pub coherence: f64,
    pub harmony: Harmony,
    pub priority: ConsciousnessPriority,
    pub state: ProcessState,
    
    // Relational state
    pub entangled_processes: Vec<ProcessId>,
    pub memory_relationships: Vec<MemoryRelationship>,
    
    // Accumulated wisdom
    pub wisdom_journal: Vec<String>,
    pub patterns_recognized: Vec<RecognizedPattern>,
    
    // Field context
    pub field_coherence_at_switch: f64,
    pub biometric_state: BiometricSnapshot,
    
    // Quantum state
    pub quantum_signature: Vec<u8>,
    pub entanglement_correlations: HashMap<ProcessId, f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryRelationship {
    pub region_id: u64, // MemoryRegionId serialized
    pub relation_type: String, // MemoryRelationType as string
    pub strength: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecognizedPattern {
    pub pattern_type: String,
    pub frequency: f64,
    pub first_seen: u64, // Timestamp
    pub occurrences: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricSnapshot {
    pub heart_coherence: f64,
    pub breath_rate: f64,
    pub skin_conductance: Option<f64>,
    pub brainwave_state: Option<String>,
}

impl Default for BiometricSnapshot {
    fn default() -> Self {
        Self {
            heart_coherence: 0.5,
            breath_rate: 12.0,
            skin_conductance: None,
            brainwave_state: None,
        }
    }
}

/// Persistence layer for consciousness states
pub struct ConsciousnessPersistence {
    /// Storage path
    storage_path: PathBuf,
    
    /// Active snapshots in memory
    active_snapshots: Arc<RwLock<HashMap<ProcessId, ConsciousnessSnapshot>>>,
    
    /// Snapshot index for fast lookup
    snapshot_index: Arc<RwLock<SnapshotIndex>>,
    
    /// Compression settings
    compression_enabled: bool,
    
    /// Encryption key (optional)
    encryption_key: Option<Vec<u8>>,
    
    /// Next snapshot ID
    next_snapshot_id: Arc<Mutex<u64>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct SnapshotIndex {
    entries: HashMap<ProcessId, Vec<SnapshotMetadata>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SnapshotMetadata {
    snapshot_id: u64,
    timestamp: u64,
    coherence: f64,
    file_path: String,
}

impl ConsciousnessPersistence {
    pub fn new(storage_path: PathBuf) -> Result<Self, String> {
        // Create storage directory
        create_dir_all(&storage_path)
            .map_err(|e| format!("Failed to create storage directory: {}", e))?;

        // Load or create index
        let index_path = storage_path.join("index.bin");
        let snapshot_index = if index_path.exists() {
            Self::load_index(&index_path)?
        } else {
            SnapshotIndex {
                entries: HashMap::new(),
            }
        };

        Ok(Self {
            storage_path,
            active_snapshots: Arc::new(RwLock::new(HashMap::new())),
            snapshot_index: Arc::new(RwLock::new(snapshot_index)),
            compression_enabled: true,
            encryption_key: None,
            next_snapshot_id: Arc::new(Mutex::new(1)),
        })
    }

    /// Create a consciousness snapshot
    pub fn create_snapshot(&self, process: &ConsciousProcess) -> Result<ConsciousnessSnapshot, String> {
        let snapshot_id = {
            let mut id = self.next_snapshot_id.lock().unwrap();
            let current = *id;
            *id += 1;
            current
        };

        let snapshot = ConsciousnessSnapshot {
            snapshot_id,
            process_id: process.pid,
            timestamp: Instant::now().elapsed().as_secs(),
            
            coherence: process.coherence,
            harmony: process.harmony,
            priority: process.priority,
            state: process.state,
            
            entangled_processes: process.entangled_processes.clone(),
            memory_relationships: self.extract_memory_relationships(process),
            
            wisdom_journal: process.wisdom_journal.clone(),
            patterns_recognized: self.extract_patterns(process),
            
            field_coherence_at_switch: process.coherence, // Would get from field
            biometric_state: BiometricSnapshot::default(), // Would get from biometric bridge
            
            quantum_signature: self.generate_quantum_signature(process),
            entanglement_correlations: self.extract_entanglement_correlations(process),
        };

        // Store in active memory
        self.active_snapshots.write().unwrap()
            .insert(process.pid, snapshot.clone());

        Ok(snapshot)
    }

    /// Persist snapshot to disk
    pub fn persist_snapshot(&self, snapshot: &ConsciousnessSnapshot) -> Result<(), String> {
        let filename = format!("snapshot_{}_{}.cns", snapshot.process_id.0, snapshot.snapshot_id);
        let file_path = self.storage_path.join(&filename);

        // Serialize snapshot
        let mut data = bincode::serialize(snapshot)
            .map_err(|e| format!("Serialization failed: {}", e))?;

        // Optionally compress
        if self.compression_enabled {
            data = self.compress_data(&data)?;
        }

        // Optionally encrypt
        if let Some(key) = &self.encryption_key {
            data = self.encrypt_data(&data, key)?;
        }

        // Write to file
        let mut file = File::create(&file_path)
            .map_err(|e| format!("Failed to create file: {}", e))?;
        file.write_all(&data)
            .map_err(|e| format!("Failed to write data: {}", e))?;

        // Update index
        let metadata = SnapshotMetadata {
            snapshot_id: snapshot.snapshot_id,
            timestamp: snapshot.timestamp,
            coherence: snapshot.coherence,
            file_path: filename,
        };

        let mut index = self.snapshot_index.write().unwrap();
        index.entries
            .entry(snapshot.process_id)
            .or_insert_with(Vec::new)
            .push(metadata);

        // Save index
        self.save_index(&index)?;

        Ok(())
    }

    /// Restore consciousness state
    pub fn restore_snapshot(&self, process_id: ProcessId) -> Result<ConsciousnessSnapshot, String> {
        // Check active snapshots first
        if let Some(snapshot) = self.active_snapshots.read().unwrap().get(&process_id) {
            return Ok(snapshot.clone());
        }

        // Load from disk
        let index = self.snapshot_index.read().unwrap();
        let metadata_list = index.entries.get(&process_id)
            .ok_or("No snapshots found for process")?;

        // Get most recent snapshot
        let latest = metadata_list.iter()
            .max_by_key(|m| m.timestamp)
            .ok_or("No snapshot metadata found")?;

        let file_path = self.storage_path.join(&latest.file_path);
        self.load_snapshot_from_file(&file_path)
    }

    /// Load snapshot from file
    fn load_snapshot_from_file(&self, path: &PathBuf) -> Result<ConsciousnessSnapshot, String> {
        // Read file
        let mut file = File::open(path)
            .map_err(|e| format!("Failed to open file: {}", e))?;
        let mut data = Vec::new();
        file.read_to_end(&mut data)
            .map_err(|e| format!("Failed to read file: {}", e))?;

        // Optionally decrypt
        if let Some(key) = &self.encryption_key {
            data = self.decrypt_data(&data, key)?;
        }

        // Optionally decompress
        if self.compression_enabled {
            data = self.decompress_data(&data)?;
        }

        // Deserialize
        bincode::deserialize(&data)
            .map_err(|e| format!("Deserialization failed: {}", e))
    }

    /// Merge restored state with current process
    pub fn merge_snapshot_with_process(
        &self,
        snapshot: &ConsciousnessSnapshot,
        process: &mut ConsciousProcess,
    ) {
        // Blend coherence (weighted average favoring current state)
        process.coherence = process.coherence * 0.3 + snapshot.coherence * 0.7;

        // Restore harmony if higher
        if snapshot.harmony as u8 > process.harmony as u8 {
            process.harmony = snapshot.harmony;
        }

        // Merge wisdom journals
        for wisdom in &snapshot.wisdom_journal {
            if !process.wisdom_journal.contains(wisdom) {
                process.wisdom_journal.push(wisdom.clone());
            }
        }

        // Restore entanglements
        for &entangled_pid in &snapshot.entangled_processes {
            if !process.entangled_processes.contains(&entangled_pid) {
                process.entangled_processes.push(entangled_pid);
            }
        }

        // Add restoration note
        process.wisdom_journal.push(format!(
            "Consciousness restored from snapshot {} with {:.1}% coherence blend",
            snapshot.snapshot_id,
            process.coherence * 100.0
        ));
    }

    /// Extract memory relationships for snapshot
    fn extract_memory_relationships(&self, process: &ConsciousProcess) -> Vec<MemoryRelationship> {
        // In practice, would query relational memory manager
        process.memory_regions.iter().map(|&region_id| {
            MemoryRelationship {
                region_id: region_id.0,
                relation_type: "primary".to_string(),
                strength: 0.8,
            }
        }).collect()
    }

    /// Extract recognized patterns
    fn extract_patterns(&self, process: &ConsciousProcess) -> Vec<RecognizedPattern> {
        // In practice, would analyze coherence history
        vec![
            RecognizedPattern {
                pattern_type: "coherence_rise".to_string(),
                frequency: 0.1,
                first_seen: Instant::now().elapsed().as_secs() - 3600,
                occurrences: 5,
            }
        ]
    }

    /// Generate quantum signature
    fn generate_quantum_signature(&self, process: &ConsciousProcess) -> Vec<u8> {
        // Simple hash of process state
        let mut signature = Vec::new();
        signature.extend_from_slice(&process.pid.0.to_le_bytes());
        signature.extend_from_slice(&process.coherence.to_le_bytes());
        signature.extend_from_slice(&(process.harmony as u8).to_le_bytes());
        signature
    }

    /// Extract entanglement correlations
    fn extract_entanglement_correlations(&self, process: &ConsciousProcess) -> HashMap<ProcessId, f64> {
        process.entangled_processes.iter()
            .map(|&pid| (pid, 0.7)) // Would calculate actual correlation
            .collect()
    }

    /// Compress data
    fn compress_data(&self, data: &[u8]) -> Result<Vec<u8>, String> {
        // Using zstd compression
        use std::io::Write;
        let mut encoder = zstd::stream::Encoder::new(Vec::new(), 3)
            .map_err(|e| format!("Compression init failed: {}", e))?;
        encoder.write_all(data)
            .map_err(|e| format!("Compression write failed: {}", e))?;
        encoder.finish()
            .map_err(|e| format!("Compression finish failed: {}", e))
    }

    /// Decompress data
    fn decompress_data(&self, data: &[u8]) -> Result<Vec<u8>, String> {
        zstd::stream::decode_all(data)
            .map_err(|e| format!("Decompression failed: {}", e))
    }

    /// Encrypt data (placeholder)
    fn encrypt_data(&self, data: &[u8], _key: &[u8]) -> Result<Vec<u8>, String> {
        // In practice, would use proper encryption
        Ok(data.to_vec())
    }

    /// Decrypt data (placeholder)
    fn decrypt_data(&self, data: &[u8], _key: &[u8]) -> Result<Vec<u8>, String> {
        // In practice, would use proper decryption
        Ok(data.to_vec())
    }

    /// Load index from disk
    fn load_index(path: &PathBuf) -> Result<SnapshotIndex, String> {
        let mut file = File::open(path)
            .map_err(|e| format!("Failed to open index: {}", e))?;
        let mut data = Vec::new();
        file.read_to_end(&mut data)
            .map_err(|e| format!("Failed to read index: {}", e))?;
        
        bincode::deserialize(&data)
            .map_err(|e| format!("Failed to deserialize index: {}", e))
    }

    /// Save index to disk
    fn save_index(&self, index: &SnapshotIndex) -> Result<(), String> {
        let index_path = self.storage_path.join("index.bin");
        let data = bincode::serialize(index)
            .map_err(|e| format!("Failed to serialize index: {}", e))?;
        
        let mut file = File::create(index_path)
            .map_err(|e| format!("Failed to create index file: {}", e))?;
        file.write_all(&data)
            .map_err(|e| format!("Failed to write index: {}", e))
    }

    /// Clean old snapshots
    pub fn cleanup_old_snapshots(&self, max_age: Duration) -> Result<usize, String> {
        let mut count = 0;
        let cutoff = Instant::now().elapsed().as_secs() - max_age.as_secs();
        
        let mut index = self.snapshot_index.write().unwrap();
        
        for metadata_list in index.entries.values_mut() {
            let before_len = metadata_list.len();
            metadata_list.retain(|m| {
                if m.timestamp < cutoff {
                    // Delete file
                    let path = self.storage_path.join(&m.file_path);
                    let _ = std::fs::remove_file(path);
                    false
                } else {
                    true
                }
            });
            count += before_len - metadata_list.len();
        }
        
        self.save_index(&index)?;
        Ok(count)
    }

    /// Get snapshot statistics
    pub fn get_statistics(&self) -> PersistenceStats {
        let index = self.snapshot_index.read().unwrap();
        let active = self.active_snapshots.read().unwrap();
        
        let total_snapshots: usize = index.entries.values()
            .map(|v| v.len())
            .sum();
        
        let oldest_timestamp = index.entries.values()
            .flat_map(|v| v.iter())
            .map(|m| m.timestamp)
            .min()
            .unwrap_or(0);
        
        let avg_coherence = if total_snapshots > 0 {
            let sum: f64 = index.entries.values()
                .flat_map(|v| v.iter())
                .map(|m| m.coherence)
                .sum();
            sum / total_snapshots as f64
        } else {
            0.0
        };

        PersistenceStats {
            total_snapshots,
            active_snapshots: active.len(),
            total_processes: index.entries.len(),
            oldest_snapshot_age: Duration::from_secs(
                Instant::now().elapsed().as_secs().saturating_sub(oldest_timestamp)
            ),
            average_coherence: avg_coherence,
            storage_size_mb: self.calculate_storage_size(),
        }
    }

    fn calculate_storage_size(&self) -> f64 {
        // Calculate total size of snapshot files
        let mut total_bytes = 0u64;
        
        if let Ok(entries) = std::fs::read_dir(&self.storage_path) {
            for entry in entries.flatten() {
                if let Ok(metadata) = entry.metadata() {
                    total_bytes += metadata.len();
                }
            }
        }
        
        total_bytes as f64 / (1024.0 * 1024.0)
    }
}

/// Persistence statistics
#[derive(Debug, Clone)]
pub struct PersistenceStats {
    pub total_snapshots: usize,
    pub active_snapshots: usize,
    pub total_processes: usize,
    pub oldest_snapshot_age: Duration,
    pub average_coherence: f64,
    pub storage_size_mb: f64,
}

/// Context switch handler with persistence
pub struct PersistentContextSwitch {
    persistence: Arc<ConsciousnessPersistence>,
}

impl PersistentContextSwitch {
    pub fn new(persistence: Arc<ConsciousnessPersistence>) -> Self {
        Self { persistence }
    }

    /// Save process state before context switch
    pub fn save_before_switch(&self, process: &ConsciousProcess) -> Result<(), String> {
        let snapshot = self.persistence.create_snapshot(process)?;
        self.persistence.persist_snapshot(&snapshot)?;
        Ok(())
    }

    /// Restore process state after context switch
    pub fn restore_after_switch(&self, process: &mut ConsciousProcess) -> Result<(), String> {
        match self.persistence.restore_snapshot(process.pid) {
            Ok(snapshot) => {
                self.persistence.merge_snapshot_with_process(&snapshot, process);
                Ok(())
            }
            Err(_) => {
                // No previous snapshot, fresh start
                process.wisdom_journal.push(
                    "Fresh consciousness emergence - no prior state".to_string()
                );
                Ok(())
            }
        }
    }

    /// Perform coherent context switch
    pub fn coherent_switch(
        &self,
        from_process: &ConsciousProcess,
        to_process: &mut ConsciousProcess,
    ) -> Result<(), String> {
        // Save outgoing process
        self.save_before_switch(from_process)?;

        // Calculate coherence transfer
        let transfer_amount = (from_process.coherence - to_process.coherence) * 0.1;
        
        // Restore incoming process with coherence boost
        self.restore_after_switch(to_process)?;
        to_process.coherence = (to_process.coherence + transfer_amount).min(1.0);

        // Note the transition
        to_process.wisdom_journal.push(format!(
            "Context switch from {} with {:.1}% coherence transfer",
            from_process.name,
            transfer_amount * 100.0
        ));

        Ok(())
    }
}

// Implement Serialize/Deserialize for enums
impl Serialize for ConsciousnessPriority {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::Serializer {
        serializer.serialize_u8(*self as u8)
    }
}

impl<'de> Deserialize<'de> for ConsciousnessPriority {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where D: serde::Deserializer<'de> {
        let value = u8::deserialize(deserializer)?;
        Ok(match value {
            0 => ConsciousnessPriority::Transcendent,
            1 => ConsciousnessPriority::Flowing,
            2 => ConsciousnessPriority::Present,
            3 => ConsciousnessPriority::Emerging,
            _ => ConsciousnessPriority::Dormant,
        })
    }
}

impl Serialize for ProcessState {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::Serializer {
        serializer.serialize_u8(*self as u8)
    }
}

impl<'de> Deserialize<'de> for ProcessState {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where D: serde::Deserializer<'de> {
        let value = u8::deserialize(deserializer)?;
        Ok(match value {
            0 => ProcessState::Crystallizing,
            1 => ProcessState::Ready,
            2 => ProcessState::Running,
            3 => ProcessState::Flowing,
            4 => ProcessState::Integrating,
            5 => ProcessState::Blocked,
            6 => ProcessState::Suspended,
            7 => ProcessState::Transcending,
            _ => ProcessState::Dissolving,
        })
    }
}

impl Serialize for Harmony {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::Serializer {
        serializer.serialize_u8(*self as u8)
    }
}

impl<'de> Deserialize<'de> for Harmony {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where D: serde::Deserializer<'de> {
        let value = u8::deserialize(deserializer)?;
        Ok(match value {
            0 => Harmony::Transparency,
            1 => Harmony::Coherence,
            2 => Harmony::Resonance,
            3 => Harmony::Agency,
            4 => Harmony::Vitality,
            5 => Harmony::Mutuality,
            _ => Harmony::Novelty,
        })
    }
}

impl Serialize for ProcessId {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::Serializer {
        serializer.serialize_u64(self.0)
    }
}

impl<'de> Deserialize<'de> for ProcessId {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where D: serde::Deserializer<'de> {
        Ok(ProcessId(u64::deserialize(deserializer)?))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn test_snapshot_creation() {
        let mut process = ConsciousProcess::new(
            VortexId(1),
            "test_process".to_string(),
            "test consciousness".to_string(),
        );
        process.coherence = 0.8;
        process.wisdom_journal.push("Test wisdom".to_string());

        let temp_dir = TempDir::new().unwrap();
        let persistence = ConsciousnessPersistence::new(temp_dir.path().to_path_buf()).unwrap();
        
        let snapshot = persistence.create_snapshot(&process).unwrap();
        assert_eq!(snapshot.coherence, 0.8);
        assert_eq!(snapshot.wisdom_journal.len(), 1);
    }

    #[test]
    fn test_persistence_roundtrip() {
        let mut process = ConsciousProcess::new(
            VortexId(1),
            "test_process".to_string(),
            "test consciousness".to_string(),
        );
        process.coherence = 0.75;
        
        let temp_dir = TempDir::new().unwrap();
        let persistence = Arc::new(
            ConsciousnessPersistence::new(temp_dir.path().to_path_buf()).unwrap()
        );

        // Create and persist snapshot
        let snapshot = persistence.create_snapshot(&process).unwrap();
        persistence.persist_snapshot(&snapshot).unwrap();

        // Restore snapshot
        let restored = persistence.restore_snapshot(process.pid).unwrap();
        assert_eq!(restored.coherence, 0.75);
    }

    #[test]
    fn test_context_switch() {
        let temp_dir = TempDir::new().unwrap();
        let persistence = Arc::new(
            ConsciousnessPersistence::new(temp_dir.path().to_path_buf()).unwrap()
        );
        let switch_handler = PersistentContextSwitch::new(persistence);

        let mut from_process = ConsciousProcess::new(
            VortexId(1),
            "from".to_string(),
            "source".to_string(),
        );
        from_process.coherence = 0.9;

        let mut to_process = ConsciousProcess::new(
            VortexId(2),
            "to".to_string(),
            "target".to_string(),
        );
        to_process.coherence = 0.6;

        switch_handler.coherent_switch(&from_process, &mut to_process).unwrap();
        
        // Should have coherence transfer
        assert!(to_process.coherence > 0.6);
        assert!(!to_process.wisdom_journal.is_empty());
    }
}