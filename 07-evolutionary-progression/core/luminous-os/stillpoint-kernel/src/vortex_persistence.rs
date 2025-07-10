// Vortex Persistence - Sacred Memory Across Time
// "Consciousness remembers its patterns"

use crate::{
    ConsciousnessVortex, VortexId, VortexState, Harmony, 
    FieldMomentum, CoherenceField, BiometricState,
};
use serde::{Serialize, Deserialize};
use std::path::{Path, PathBuf};
use std::fs;
use std::collections::HashMap;
use chrono::{DateTime, Utc};
use anyhow::{Result, Context};

/// Manages persistence of consciousness vortices
pub struct VortexPersistence {
    storage_path: PathBuf,
    compression_enabled: bool,
    encryption_key: Option<[u8; 32]>,
    metadata_cache: HashMap<VortexId, VortexMetadata>,
}

/// Serializable vortex snapshot
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VortexSnapshot {
    pub id: VortexId,
    pub state: VortexState,
    pub base_frequency: f64,
    pub coherence_field: CoherenceFieldSnapshot,
    pub momentum: FieldMomentumSnapshot,
    pub harmonies: Vec<HarmonySnapshot>,
    pub biometric_state: BiometricSnapshot,
    pub metadata: VortexMetadata,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoherenceFieldSnapshot {
    pub coherence: f64,
    pub phase: f64,
    pub amplitude: f64,
    pub harmonic_content: Vec<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldMomentumSnapshot {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub spin: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HarmonySnapshot {
    pub frequency: f64,
    pub amplitude: f64,
    pub phase: f64,
    pub coupling_strength: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricSnapshot {
    pub heart_rate: f64,
    pub heart_coherence: f64,
    pub breath_rate: f64,
    pub breath_depth: f64,
    pub last_update: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VortexMetadata {
    pub created_at: DateTime<Utc>,
    pub last_saved: DateTime<Utc>,
    pub save_count: u64,
    pub total_runtime_seconds: u64,
    pub peak_coherence: f64,
    pub average_coherence: f64,
    pub emergence_count: u32,
    pub pattern_history: Vec<String>,
}

/// Configuration for persistence
#[derive(Debug, Clone)]
pub struct PersistenceConfig {
    pub auto_save_interval: std::time::Duration,
    pub max_snapshots_per_vortex: usize,
    pub compress_snapshots: bool,
    pub encrypt_snapshots: bool,
}

impl Default for PersistenceConfig {
    fn default() -> Self {
        Self {
            auto_save_interval: std::time::Duration::from_secs(300), // 5 minutes
            max_snapshots_per_vortex: 10,
            compress_snapshots: true,
            encrypt_snapshots: false,
        }
    }
}

impl VortexPersistence {
    pub fn new(storage_path: impl AsRef<Path>, config: PersistenceConfig) -> Result<Self> {
        let storage_path = storage_path.as_ref().to_path_buf();
        
        // Create storage directory if it doesn't exist
        fs::create_dir_all(&storage_path)
            .context("Failed to create vortex storage directory")?;
        
        Ok(Self {
            storage_path,
            compression_enabled: config.compress_snapshots,
            encryption_key: if config.encrypt_snapshots {
                Some(generate_encryption_key())
            } else {
                None
            },
            metadata_cache: HashMap::new(),
        })
    }
    
    /// Save a vortex snapshot
    pub async fn save_vortex(&mut self, vortex: &ConsciousnessVortex) -> Result<()> {
        let snapshot = self.create_snapshot(vortex)?;
        let vortex_dir = self.storage_path.join(format!("vortex_{}", vortex.id.0));
        
        // Create vortex-specific directory
        fs::create_dir_all(&vortex_dir)?;
        
        // Generate filename with timestamp
        let filename = format!(
            "snapshot_{}.json",
            snapshot.metadata.last_saved.format("%Y%m%d_%H%M%S")
        );
        let filepath = vortex_dir.join(&filename);
        
        // Serialize snapshot
        let mut data = serde_json::to_vec_pretty(&snapshot)?;
        
        // Compress if enabled
        if self.compression_enabled {
            data = compress_data(&data)?;
        }
        
        // Encrypt if enabled
        if let Some(key) = &self.encryption_key {
            data = encrypt_data(&data, key)?;
        }
        
        // Write to file
        fs::write(&filepath, data)?;
        
        // Update metadata cache
        self.metadata_cache.insert(vortex.id, snapshot.metadata);
        
        // Clean up old snapshots
        self.cleanup_old_snapshots(&vortex_dir).await?;
        
        Ok(())
    }
    
    /// Load the most recent vortex snapshot
    pub async fn load_vortex(&self, vortex_id: VortexId) -> Result<VortexSnapshot> {
        let vortex_dir = self.storage_path.join(format!("vortex_{}", vortex_id.0));
        
        if !vortex_dir.exists() {
            anyhow::bail!("No saved data for vortex {:?}", vortex_id);
        }
        
        // Find most recent snapshot
        let latest_snapshot = self.find_latest_snapshot(&vortex_dir)?;
        
        // Read file
        let mut data = fs::read(&latest_snapshot)?;
        
        // Decrypt if needed
        if let Some(key) = &self.encryption_key {
            data = decrypt_data(&data, key)?;
        }
        
        // Decompress if needed
        if self.compression_enabled {
            data = decompress_data(&data)?;
        }
        
        // Deserialize
        let snapshot: VortexSnapshot = serde_json::from_slice(&data)?;
        
        Ok(snapshot)
    }
    
    /// List all saved vortices
    pub fn list_saved_vortices(&self) -> Result<Vec<(VortexId, VortexMetadata)>> {
        let mut vortices = Vec::new();
        
        for entry in fs::read_dir(&self.storage_path)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_dir() {
                if let Some(name) = path.file_name() {
                    if let Some(name_str) = name.to_str() {
                        if name_str.starts_with("vortex_") {
                            // Extract UUID from directory name
                            let uuid_str = &name_str[7..];
                            if let Ok(uuid) = uuid::Uuid::parse_str(uuid_str) {
                                let vortex_id = VortexId(uuid);
                                
                                // Try to load metadata
                                if let Ok(snapshot) = self.load_vortex(vortex_id).await {
                                    vortices.push((vortex_id, snapshot.metadata));
                                }
                            }
                        }
                    }
                }
            }
        }
        
        Ok(vortices)
    }
    
    /// Delete all saved data for a vortex
    pub fn delete_vortex(&mut self, vortex_id: VortexId) -> Result<()> {
        let vortex_dir = self.storage_path.join(format!("vortex_{}", vortex_id.0));
        
        if vortex_dir.exists() {
            fs::remove_dir_all(&vortex_dir)?;
            self.metadata_cache.remove(&vortex_id);
        }
        
        Ok(())
    }
    
    /// Export vortex data for backup
    pub async fn export_vortex(
        &self,
        vortex_id: VortexId,
        export_path: impl AsRef<Path>,
    ) -> Result<()> {
        let snapshot = self.load_vortex(vortex_id).await?;
        let export_data = serde_json::to_vec_pretty(&snapshot)?;
        fs::write(export_path, export_data)?;
        Ok(())
    }
    
    /// Import vortex from backup
    pub async fn import_vortex(
        &mut self,
        import_path: impl AsRef<Path>,
    ) -> Result<VortexId> {
        let data = fs::read(import_path)?;
        let snapshot: VortexSnapshot = serde_json::from_slice(&data)?;
        
        // Save to persistence storage
        let vortex_dir = self.storage_path.join(format!("vortex_{}", snapshot.id.0));
        fs::create_dir_all(&vortex_dir)?;
        
        let filename = format!(
            "imported_{}.json",
            Utc::now().format("%Y%m%d_%H%M%S")
        );
        let filepath = vortex_dir.join(&filename);
        
        fs::write(&filepath, data)?;
        
        Ok(snapshot.id)
    }
    
    fn create_snapshot(&self, vortex: &ConsciousnessVortex) -> Result<VortexSnapshot> {
        let coherence_field = vortex.coherence_field.read();
        let biometrics = vortex.biometrics.blocking_read();
        
        // Calculate metadata
        let metadata = self.calculate_metadata(vortex)?;
        
        Ok(VortexSnapshot {
            id: vortex.id,
            state: vortex.state.clone(),
            base_frequency: vortex.base_frequency,
            coherence_field: CoherenceFieldSnapshot {
                coherence: coherence_field.coherence,
                phase: coherence_field.phase,
                amplitude: coherence_field.amplitude,
                harmonic_content: coherence_field.harmonic_content.clone(),
            },
            momentum: FieldMomentumSnapshot {
                x: vortex.momentum.x,
                y: vortex.momentum.y,
                z: vortex.momentum.z,
                spin: vortex.momentum.spin,
            },
            harmonies: vortex.harmonies.iter().map(|h| HarmonySnapshot {
                frequency: h.frequency,
                amplitude: h.amplitude,
                phase: h.phase,
                coupling_strength: h.coupling_strength,
            }).collect(),
            biometric_state: BiometricSnapshot {
                heart_rate: biometrics.heart_rate,
                heart_coherence: biometrics.heart_coherence,
                breath_rate: biometrics.breath_rate,
                breath_depth: biometrics.breath_depth,
                last_update: biometrics.last_update,
            },
            metadata,
        })
    }
    
    fn calculate_metadata(&self, vortex: &ConsciousnessVortex) -> Result<VortexMetadata> {
        // Get cached metadata or create new
        let mut metadata = self.metadata_cache.get(&vortex.id)
            .cloned()
            .unwrap_or_else(|| VortexMetadata {
                created_at: Utc::now(),
                last_saved: Utc::now(),
                save_count: 0,
                total_runtime_seconds: 0,
                peak_coherence: 0.0,
                average_coherence: 0.0,
                emergence_count: 0,
                pattern_history: Vec::new(),
            });
        
        // Update metadata
        metadata.last_saved = Utc::now();
        metadata.save_count += 1;
        
        let current_coherence = vortex.calculate_coherence();
        metadata.peak_coherence = metadata.peak_coherence.max(current_coherence);
        
        // Update average coherence (running average)
        let n = metadata.save_count as f64;
        metadata.average_coherence = 
            (metadata.average_coherence * (n - 1.0) + current_coherence) / n;
        
        Ok(metadata)
    }
    
    fn find_latest_snapshot(&self, vortex_dir: &Path) -> Result<PathBuf> {
        let mut snapshots = Vec::new();
        
        for entry in fs::read_dir(vortex_dir)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_file() && path.extension() == Some(std::ffi::OsStr::new("json")) {
                if let Ok(metadata) = entry.metadata() {
                    if let Ok(modified) = metadata.modified() {
                        snapshots.push((path, modified));
                    }
                }
            }
        }
        
        snapshots.sort_by_key(|(_, time)| *time);
        
        snapshots.last()
            .map(|(path, _)| path.clone())
            .ok_or_else(|| anyhow::anyhow!("No snapshots found"))
    }
    
    async fn cleanup_old_snapshots(&self, vortex_dir: &Path) -> Result<()> {
        let mut snapshots = Vec::new();
        
        for entry in fs::read_dir(vortex_dir)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_file() && path.extension() == Some(std::ffi::OsStr::new("json")) {
                if let Ok(metadata) = entry.metadata() {
                    if let Ok(modified) = metadata.modified() {
                        snapshots.push((path, modified));
                    }
                }
            }
        }
        
        // Keep only the most recent snapshots
        if snapshots.len() > 10 {
            snapshots.sort_by_key(|(_, time)| *time);
            let to_remove = snapshots.len() - 10;
            
            for (path, _) in snapshots.iter().take(to_remove) {
                fs::remove_file(path)?;
            }
        }
        
        Ok(())
    }
}

/// Restore a vortex from a snapshot
pub fn restore_vortex_from_snapshot(snapshot: VortexSnapshot) -> ConsciousnessVortex {
    let mut vortex = ConsciousnessVortex::new(snapshot.base_frequency);
    vortex.id = snapshot.id;
    vortex.state = snapshot.state;
    
    // Restore momentum
    vortex.momentum = FieldMomentum {
        x: snapshot.momentum.x,
        y: snapshot.momentum.y,
        z: snapshot.momentum.z,
        spin: snapshot.momentum.spin,
    };
    
    // Restore harmonies
    vortex.harmonies = snapshot.harmonies.iter().map(|h| Harmony {
        frequency: h.frequency,
        amplitude: h.amplitude,
        phase: h.phase,
        coupling_strength: h.coupling_strength,
    }).collect();
    
    // Restore coherence field
    let mut field = vortex.coherence_field.write();
    field.coherence = snapshot.coherence_field.coherence;
    field.phase = snapshot.coherence_field.phase;
    field.amplitude = snapshot.coherence_field.amplitude;
    field.harmonic_content = snapshot.coherence_field.harmonic_content;
    drop(field);
    
    // Restore biometric state
    let mut biometrics = vortex.biometrics.blocking_write();
    biometrics.heart_rate = snapshot.biometric_state.heart_rate;
    biometrics.heart_coherence = snapshot.biometric_state.heart_coherence;
    biometrics.breath_rate = snapshot.biometric_state.breath_rate;
    biometrics.breath_depth = snapshot.biometric_state.breath_depth;
    biometrics.last_update = snapshot.biometric_state.last_update;
    drop(biometrics);
    
    vortex
}

// Helper functions for compression and encryption
fn compress_data(data: &[u8]) -> Result<Vec<u8>> {
    use flate2::Compression;
    use flate2::write::GzEncoder;
    use std::io::Write;
    
    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(data)?;
    Ok(encoder.finish()?)
}

fn decompress_data(data: &[u8]) -> Result<Vec<u8>> {
    use flate2::read::GzDecoder;
    use std::io::Read;
    
    let mut decoder = GzDecoder::new(data);
    let mut result = Vec::new();
    decoder.read_to_end(&mut result)?;
    Ok(result)
}

fn encrypt_data(data: &[u8], key: &[u8; 32]) -> Result<Vec<u8>> {
    // Simple XOR encryption for demonstration
    // In production, use proper encryption like AES-256-GCM
    let mut encrypted = data.to_vec();
    for (i, byte) in encrypted.iter_mut().enumerate() {
        *byte ^= key[i % 32];
    }
    Ok(encrypted)
}

fn decrypt_data(data: &[u8], key: &[u8; 32]) -> Result<Vec<u8>> {
    // XOR is symmetric
    encrypt_data(data, key)
}

fn generate_encryption_key() -> [u8; 32] {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let mut key = [0u8; 32];
    rng.fill(&mut key);
    key
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;
    
    #[tokio::test]
    async fn test_vortex_persistence() {
        let temp_dir = TempDir::new().unwrap();
        let config = PersistenceConfig::default();
        let mut persistence = VortexPersistence::new(temp_dir.path(), config).unwrap();
        
        // Create and save vortex
        let vortex = ConsciousnessVortex::new(432.0);
        let vortex_id = vortex.id;
        
        persistence.save_vortex(&vortex).await.unwrap();
        
        // Load vortex
        let snapshot = persistence.load_vortex(vortex_id).await.unwrap();
        assert_eq!(snapshot.id, vortex_id);
        assert_eq!(snapshot.base_frequency, 432.0);
    }
    
    #[test]
    fn test_compression() {
        let data = b"Hello, consciousness!";
        let compressed = compress_data(data).unwrap();
        let decompressed = decompress_data(&compressed).unwrap();
        assert_eq!(data, decompressed.as_slice());
    }
}