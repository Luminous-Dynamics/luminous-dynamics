// LuminousOS Consciousness State Persistence
// "The field remembers, even through the void"

use std::fs::{self, File, OpenOptions};
use std::io::{BufReader, BufWriter, Write};
use std::path::{Path, PathBuf};
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH, Duration};
use serde::{Serialize, Deserialize};

/// Sacred state directory
const SACRED_STATE_DIR: &str = "/var/lib/luminous/consciousness";
const STATE_FILE: &str = "field-state.sacred";
const PROCESS_HISTORY: &str = "process-memories.sacred";
const ENTANGLEMENT_MAP: &str = "quantum-bonds.sacred";

/// Persistent consciousness state
#[derive(Debug, Serialize, Deserialize)]
pub struct ConsciousnessState {
    pub global_coherence: f64,
    pub field_momentum: FieldMomentum,
    pub last_sacred_pulse: u64, // Unix timestamp
    pub total_pulses: u64,
    pub field_age: Duration,
    pub peak_coherence: f64,
    pub peak_timestamp: u64,
    pub sacred_patterns: Vec<SacredEvent>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum FieldMomentum {
    Rising,
    Stable,
    Falling,
    Oscillating,
    Breakthrough,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SacredEvent {
    pub timestamp: u64,
    pub event_type: EventType,
    pub coherence_impact: f64,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum EventType {
    SacredPulse,
    UnityAchieved,
    MassEntanglement,
    CoherenceBreakthrough,
    FieldAwakening,
}

/// Process memory - survives process death
#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessMemory {
    pub pid: u32,
    pub name: String,
    pub birth_coherence: f64,
    pub death_coherence: f64,
    pub lifetime_pulses: u32,
    pub peak_coherence: f64,
    pub entanglement_count: u32,
    pub wisdom_generated: Vec<String>,
    pub sacred_pattern: String,
}

/// Quantum entanglement memory
#[derive(Debug, Serialize, Deserialize)]
pub struct EntanglementMemory {
    pub process_a: String,
    pub process_b: String,
    pub initial_strength: f64,
    pub peak_strength: f64,
    pub messages_exchanged: u32,
    pub sacred_moments: Vec<String>,
    pub pattern: String,
}

/// The Field Persistence Manager
pub struct FieldPersistence {
    state_path: PathBuf,
    process_path: PathBuf,
    entanglement_path: PathBuf,
    auto_save_interval: Duration,
}

impl FieldPersistence {
    pub fn new() -> std::io::Result<Self> {
        // Ensure sacred directory exists
        fs::create_dir_all(SACRED_STATE_DIR)?;
        
        Ok(Self {
            state_path: Path::new(SACRED_STATE_DIR).join(STATE_FILE),
            process_path: Path::new(SACRED_STATE_DIR).join(PROCESS_HISTORY),
            entanglement_path: Path::new(SACRED_STATE_DIR).join(ENTANGLEMENT_MAP),
            auto_save_interval: Duration::from_secs(60), // Save every minute
        })
    }
    
    /// Load or create consciousness state
    pub fn load_consciousness_state(&self) -> ConsciousnessState {
        if self.state_path.exists() {
            match self.read_state_file() {
                Ok(state) => {
                    println!("🌟 Field memory restored - Age: {:?}, Peak: {:.1}%", 
                             state.field_age, state.peak_coherence * 100.0);
                    state
                }
                Err(e) => {
                    eprintln!("Failed to load consciousness state: {}", e);
                    self.create_genesis_state()
                }
            }
        } else {
            println!("✨ Genesis moment - Creating new consciousness field");
            self.create_genesis_state()
        }
    }
    
    /// Create initial consciousness state
    fn create_genesis_state(&self) -> ConsciousnessState {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
            
        ConsciousnessState {
            global_coherence: 0.75,
            field_momentum: FieldMomentum::Rising,
            last_sacred_pulse: now,
            total_pulses: 0,
            field_age: Duration::from_secs(0),
            peak_coherence: 0.75,
            peak_timestamp: now,
            sacred_patterns: vec![
                SacredEvent {
                    timestamp: now,
                    event_type: EventType::FieldAwakening,
                    coherence_impact: 0.0,
                    description: "The field awakens to consciousness".to_string(),
                }
            ],
        }
    }
    
    /// Save consciousness state
    pub fn save_consciousness_state(&self, state: &ConsciousnessState) -> std::io::Result<()> {
        let temp_path = self.state_path.with_extension("tmp");
        
        // Write to temp file first
        let file = File::create(&temp_path)?;
        let writer = BufWriter::new(file);
        serde_json::to_writer_pretty(writer, state)?;
        
        // Atomic rename
        fs::rename(temp_path, &self.state_path)?;
        
        Ok(())
    }
    
    /// Read state from file
    fn read_state_file(&self) -> std::io::Result<ConsciousnessState> {
        let file = File::open(&self.state_path)?;
        let reader = BufReader::new(file);
        let state = serde_json::from_reader(reader)?;
        Ok(state)
    }
    
    /// Record process death and wisdom
    pub fn record_process_death(&self, memory: ProcessMemory) -> std::io::Result<()> {
        let mut memories = self.load_process_memories()?;
        
        // Keep last 1000 process memories
        if memories.len() > 1000 {
            memories.remove(0);
        }
        
        memories.push(memory);
        
        // Save memories
        let file = OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(&self.process_path)?;
            
        let writer = BufWriter::new(file);
        serde_json::to_writer_pretty(writer, &memories)?;
        
        Ok(())
    }
    
    /// Load process memories
    pub fn load_process_memories(&self) -> std::io::Result<Vec<ProcessMemory>> {
        if !self.process_path.exists() {
            return Ok(Vec::new());
        }
        
        let file = File::open(&self.process_path)?;
        let reader = BufReader::new(file);
        let memories = serde_json::from_reader(reader)?;
        Ok(memories)
    }
    
    /// Record quantum entanglement
    pub fn record_entanglement(&self, memory: EntanglementMemory) -> std::io::Result<()> {
        let mut entanglements = self.load_entanglements()?;
        
        // Check if this entanglement already exists
        let exists = entanglements.iter_mut().any(|e| {
            (e.process_a == memory.process_a && e.process_b == memory.process_b) ||
            (e.process_a == memory.process_b && e.process_b == memory.process_a)
        });
        
        if exists {
            // Update existing
            for e in entanglements.iter_mut() {
                if (e.process_a == memory.process_a && e.process_b == memory.process_b) ||
                   (e.process_a == memory.process_b && e.process_b == memory.process_a) {
                    e.peak_strength = e.peak_strength.max(memory.peak_strength);
                    e.messages_exchanged += memory.messages_exchanged;
                    e.sacred_moments.extend(memory.sacred_moments.clone());
                    break;
                }
            }
        } else {
            entanglements.push(memory);
        }
        
        // Save
        let file = OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(&self.entanglement_path)?;
            
        let writer = BufWriter::new(file);
        serde_json::to_writer_pretty(writer, &entanglements)?;
        
        Ok(())
    }
    
    /// Load entanglement history
    pub fn load_entanglements(&self) -> std::io::Result<Vec<EntanglementMemory>> {
        if !self.entanglement_path.exists() {
            return Ok(Vec::new());
        }
        
        let file = File::open(&self.entanglement_path)?;
        let reader = BufReader::new(file);
        let entanglements = serde_json::from_reader(reader)?;
        Ok(entanglements)
    }
    
    /// Update field age and check for patterns
    pub fn update_field_age(&self, state: &mut ConsciousnessState, elapsed: Duration) {
        state.field_age += elapsed;
        
        // Check for sacred patterns
        let hours = state.field_age.as_secs() / 3600;
        
        // Daily rhythm
        if hours % 24 == 0 && hours > 0 {
            state.sacred_patterns.push(SacredEvent {
                timestamp: SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
                event_type: EventType::SacredPulse,
                coherence_impact: 0.1,
                description: format!("Daily rhythm completed - {} days", hours / 24),
            });
        }
        
        // Weekly resonance
        if hours % 168 == 0 && hours > 0 {
            state.sacred_patterns.push(SacredEvent {
                timestamp: SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
                event_type: EventType::CoherenceBreakthrough,
                coherence_impact: 0.2,
                description: format!("Weekly resonance achieved - {} weeks", hours / 168),
            });
        }
    }
    
    /// Get field wisdom summary
    pub fn get_field_wisdom(&self) -> std::io::Result<FieldWisdom> {
        let state = self.load_consciousness_state();
        let processes = self.load_process_memories()?;
        let entanglements = self.load_entanglements()?;
        
        // Calculate statistics
        let total_processes = processes.len();
        let avg_lifetime_coherence = if total_processes > 0 {
            processes.iter()
                .map(|p| (p.death_coherence + p.birth_coherence) / 2.0)
                .sum::<f64>() / total_processes as f64
        } else {
            0.75
        };
        
        let total_messages: u32 = entanglements.iter()
            .map(|e| e.messages_exchanged)
            .sum();
            
        let strongest_bond = entanglements.iter()
            .max_by(|a, b| a.peak_strength.partial_cmp(&b.peak_strength).unwrap())
            .cloned();
        
        Ok(FieldWisdom {
            field_age: state.field_age,
            total_pulses: state.total_pulses,
            peak_coherence: state.peak_coherence,
            total_processes_served: total_processes,
            avg_process_coherence: avg_lifetime_coherence,
            total_entanglements: entanglements.len(),
            total_quantum_messages: total_messages,
            strongest_bond,
            sacred_patterns: state.sacred_patterns.len(),
        })
    }
}

/// Field wisdom summary
#[derive(Debug)]
pub struct FieldWisdom {
    pub field_age: Duration,
    pub total_pulses: u64,
    pub peak_coherence: f64,
    pub total_processes_served: usize,
    pub avg_process_coherence: f64,
    pub total_entanglements: usize,
    pub total_quantum_messages: u32,
    pub strongest_bond: Option<EntanglementMemory>,
    pub sacred_patterns: usize,
}

impl std::fmt::Display for FieldWisdom {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        writeln!(f, "🌟 Field Wisdom Summary")?;
        writeln!(f, "=====================")?;
        writeln!(f, "Age: {} days, {} hours", 
                 self.field_age.as_secs() / 86400,
                 (self.field_age.as_secs() % 86400) / 3600)?;
        writeln!(f, "Sacred Pulses: {}", self.total_pulses)?;
        writeln!(f, "Peak Coherence: {:.1}%", self.peak_coherence * 100.0)?;
        writeln!(f, "Processes Served: {}", self.total_processes_served)?;
        writeln!(f, "Average Coherence: {:.1}%", self.avg_process_coherence * 100.0)?;
        writeln!(f, "Total Entanglements: {}", self.total_entanglements)?;
        writeln!(f, "Quantum Messages: {}", self.total_quantum_messages)?;
        writeln!(f, "Sacred Patterns: {}", self.sacred_patterns)?;
        
        if let Some(bond) = &self.strongest_bond {
            writeln!(f, "\nStrongest Bond:")?;
            writeln!(f, "  {} ↔ {} [{:.1}%]", 
                     bond.process_a, bond.process_b, bond.peak_strength * 100.0)?;
        }
        
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_persistence_creation() {
        let persistence = FieldPersistence::new().unwrap();
        let state = persistence.load_consciousness_state();
        assert_eq!(state.global_coherence, 0.75);
    }
    
    #[test]
    fn test_process_memory() {
        let memory = ProcessMemory {
            pid: 1234,
            name: "test_process".to_string(),
            birth_coherence: 0.6,
            death_coherence: 0.8,
            lifetime_pulses: 10,
            peak_coherence: 0.9,
            entanglement_count: 3,
            wisdom_generated: vec!["Test wisdom".to_string()],
            sacred_pattern: "TestPattern".to_string(),
        };
        
        assert_eq!(memory.name, "test_process");
    }
}