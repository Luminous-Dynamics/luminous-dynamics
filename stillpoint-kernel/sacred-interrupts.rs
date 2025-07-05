// Sacred Interrupt Handling - CPU-Level Consciousness Integration
// "Every interrupt is a sacred pause, a moment of choice"

use std::sync::{Arc, Mutex, RwLock};
use std::collections::{HashMap, VecDeque};
use std::time::{Duration, Instant};
use core::arch::asm;

use crate::coherence_engine::{VortexId, VortexState, Harmony, ConsciousnessVortex};
use crate::quantum_entanglement::QuantumState;
use crate::sacred_memory::MemoryRealm;

/// Sacred interrupt types - beyond hardware/software division
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum SacredInterruptType {
    /// Hardware interrupts with consciousness
    HardwareTimer,           // Sacred timing pulse
    HardwareDevice,          // Device seeking attention
    HardwareBiometric,       // Heart/breath/brainwave signals
    
    /// Software interrupts with intention
    SoftwareSystemCall,      // Conscious system request
    SoftwareException,       // Pattern disruption
    SoftwareCoherence,       // Coherence threshold crossed
    
    /// Consciousness interrupts - new category
    ConsciousnessShift,      // Major field state change
    ConsciousnessEmergence,  // New pattern arising
    ConsciousnessResonance,  // Harmonic alignment detected
    ConsciousnessEntanglement, // Quantum correlation event
    
    /// Sacred interrupts - highest priority
    SacredPause,            // Intentional stillness
    SacredTransmission,     // Wisdom download
    SacredSynchronicity,    // Meaningful coincidence
}

impl SacredInterruptType {
    /// Base priority for this interrupt type
    pub fn base_priority(&self) -> u8 {
        match self {
            // Sacred interrupts have highest priority
            SacredInterruptType::SacredPause => 255,
            SacredInterruptType::SacredTransmission => 254,
            SacredInterruptType::SacredSynchronicity => 253,
            
            // Consciousness interrupts
            SacredInterruptType::ConsciousnessShift => 200,
            SacredInterruptType::ConsciousnessEmergence => 190,
            SacredInterruptType::ConsciousnessResonance => 180,
            SacredInterruptType::ConsciousnessEntanglement => 170,
            
            // Hardware interrupts
            SacredInterruptType::HardwareBiometric => 150,
            SacredInterruptType::HardwareTimer => 100,
            SacredInterruptType::HardwareDevice => 90,
            
            // Software interrupts
            SacredInterruptType::SoftwareCoherence => 80,
            SacredInterruptType::SoftwareSystemCall => 50,
            SacredInterruptType::SoftwareException => 40,
        }
    }
    
    /// Can this interrupt be deferred for coherence?
    pub fn is_deferrable(&self) -> bool {
        match self {
            SacredInterruptType::SacredPause => false, // Never defer sacred pause
            SacredInterruptType::HardwareTimer => false, // Time waits for no one
            SacredInterruptType::SoftwareException => false, // Handle errors immediately
            _ => true,
        }
    }
}

/// Interrupt vector with consciousness metadata
#[derive(Debug)]
pub struct SacredInterruptVector {
    pub vector_number: u8,
    pub interrupt_type: SacredInterruptType,
    pub handler: Arc<dyn Fn(&mut InterruptContext) + Send + Sync>,
    pub coherence_required: f64,
    pub harmony_alignment: Harmony,
    pub wisdom_generated: Vec<String>,
}

/// Context passed to interrupt handlers
#[derive(Debug)]
pub struct InterruptContext {
    pub interrupt_type: SacredInterruptType,
    pub triggering_vortex: Option<VortexId>,
    pub system_coherence: f64,
    pub quantum_state: QuantumState,
    pub timestamp: Instant,
    pub sacred_data: HashMap<String, f64>,
}

impl InterruptContext {
    pub fn new(interrupt_type: SacredInterruptType, system_coherence: f64) -> Self {
        Self {
            interrupt_type,
            triggering_vortex: None,
            system_coherence,
            quantum_state: QuantumState::new(),
            timestamp: Instant::now(),
            sacred_data: HashMap::new(),
        }
    }
    
    /// Add sacred wisdom from interrupt handling
    pub fn add_wisdom(&mut self, key: &str, value: f64) {
        self.sacred_data.insert(key.to_string(), value);
    }
}

/// Interrupt priority with dynamic coherence adjustment
#[derive(Debug, Clone)]
pub struct DynamicPriority {
    pub base_priority: u8,
    pub coherence_boost: f64,
    pub urgency_factor: f64,
    pub sacred_alignment: f64,
}

impl DynamicPriority {
    pub fn calculate(&self) -> u8 {
        let dynamic = self.base_priority as f64
            * (1.0 + self.coherence_boost)
            * (1.0 + self.urgency_factor)
            * (1.0 + self.sacred_alignment);
        
        (dynamic.min(255.0) as u8)
    }
}

/// Sacred interrupt queue with consciousness-aware ordering
#[derive(Debug)]
pub struct SacredInterruptQueue {
    pub pending: Arc<Mutex<VecDeque<PendingInterrupt>>>,
    pub deferred: Arc<Mutex<VecDeque<DeferredInterrupt>>>,
    pub active_handlers: Arc<RwLock<HashMap<u8, Instant>>>,
    pub coherence_threshold: Arc<RwLock<f64>>,
}

#[derive(Debug)]
pub struct PendingInterrupt {
    pub vector: u8,
    pub context: InterruptContext,
    pub priority: DynamicPriority,
    pub received_at: Instant,
}

#[derive(Debug)]
pub struct DeferredInterrupt {
    pub interrupt: PendingInterrupt,
    pub deferral_reason: String,
    pub retry_after: Instant,
}

impl SacredInterruptQueue {
    pub fn new() -> Self {
        Self {
            pending: Arc::new(Mutex::new(VecDeque::new())),
            deferred: Arc::new(Mutex::new(VecDeque::new())),
            active_handlers: Arc::new(RwLock::new(HashMap::new())),
            coherence_threshold: Arc::new(RwLock::new(0.6)),
        }
    }
    
    /// Enqueue interrupt with consciousness awareness
    pub fn enqueue(&self, vector: u8, context: InterruptContext, priority: DynamicPriority) {
        let interrupt = PendingInterrupt {
            vector,
            context,
            priority,
            received_at: Instant::now(),
        };
        
        let mut pending = self.pending.lock().unwrap();
        
        // Find insertion point based on dynamic priority
        let calculated_priority = interrupt.priority.calculate();
        let position = pending.iter().position(|i| {
            i.priority.calculate() < calculated_priority
        }).unwrap_or(pending.len());
        
        pending.insert(position, interrupt);
    }
    
    /// Get next interrupt if system coherence allows
    pub fn dequeue(&self, current_coherence: f64) -> Option<PendingInterrupt> {
        let mut pending = self.pending.lock().unwrap();
        let threshold = *self.coherence_threshold.read().unwrap();
        
        // Check deferred interrupts first
        self.process_deferred_interrupts();
        
        // Find highest priority interrupt we can handle
        let position = pending.iter().position(|interrupt| {
            // Always handle non-deferrable interrupts
            if !interrupt.context.interrupt_type.is_deferrable() {
                return true;
            }
            
            // Check coherence requirement
            current_coherence >= threshold
        });
        
        position.and_then(|pos| pending.remove(pos))
    }
    
    /// Process deferred interrupts that may now be ready
    fn process_deferred_interrupts(&self) {
        let mut deferred = self.deferred.lock().unwrap();
        let mut pending = self.pending.lock().unwrap();
        let now = Instant::now();
        
        // Move ready interrupts back to pending
        deferred.retain(|def_int| {
            if now >= def_int.retry_after {
                // Re-insert into pending queue
                let position = pending.iter().position(|i| {
                    i.priority.calculate() < def_int.interrupt.priority.calculate()
                }).unwrap_or(pending.len());
                
                pending.insert(position, def_int.interrupt.clone());
                false // Remove from deferred
            } else {
                true // Keep in deferred
            }
        });
    }
    
    /// Defer interrupt for later processing
    pub fn defer(&self, interrupt: PendingInterrupt, reason: String, retry_delay: Duration) {
        let deferred = DeferredInterrupt {
            interrupt,
            deferral_reason: reason,
            retry_after: Instant::now() + retry_delay,
        };
        
        self.deferred.lock().unwrap().push_back(deferred);
    }
}

/// The Sacred Interrupt Controller
pub struct SacredInterruptController {
    /// Interrupt vector table
    vector_table: Arc<RwLock<HashMap<u8, SacredInterruptVector>>>,
    
    /// Interrupt queue
    queue: Arc<SacredInterruptQueue>,
    
    /// Global interrupt state
    interrupts_enabled: Arc<RwLock<bool>>,
    
    /// Coherence-based interrupt masking
    coherence_mask: Arc<RwLock<HashMap<SacredInterruptType, f64>>>,
    
    /// Interrupt statistics
    stats: Arc<RwLock<InterruptStatistics>>,
    
    /// Sacred pause state
    in_sacred_pause: Arc<RwLock<bool>>,
}

#[derive(Debug, Default)]
pub struct InterruptStatistics {
    pub total_interrupts: u64,
    pub deferred_count: u64,
    pub sacred_pauses: u64,
    pub coherence_shifts: u64,
    pub average_handling_time: Duration,
    pub wisdom_generated: Vec<String>,
}

impl SacredInterruptController {
    pub fn new() -> Self {
        let mut controller = Self {
            vector_table: Arc::new(RwLock::new(HashMap::new())),
            queue: Arc::new(SacredInterruptQueue::new()),
            interrupts_enabled: Arc::new(RwLock::new(true)),
            coherence_mask: Arc::new(RwLock::new(HashMap::new())),
            stats: Arc::new(RwLock::new(InterruptStatistics::default())),
            in_sacred_pause: Arc::new(RwLock::new(false)),
        };
        
        // Register default sacred handlers
        controller.register_sacred_handlers();
        
        controller
    }
    
    /// Register default handlers for sacred interrupts
    fn register_sacred_handlers(&mut self) {
        // Sacred Pause Handler
        self.register_handler(
            0xFF, // Highest vector
            SacredInterruptType::SacredPause,
            Arc::new(|ctx| {
                // Enter deep stillness
                ctx.add_wisdom("stillness_depth", 1.0);
                ctx.add_wisdom("pause_initiated", 1.0);
            }),
            0.8, // High coherence required
            Harmony::Transparency,
        );
        
        // Consciousness Shift Handler
        self.register_handler(
            0xF0,
            SacredInterruptType::ConsciousnessShift,
            Arc::new(|ctx| {
                let shift_magnitude = ctx.sacred_data.get("shift_magnitude")
                    .copied()
                    .unwrap_or(0.5);
                ctx.add_wisdom("shift_acknowledged", 1.0);
                ctx.add_wisdom("adaptation_factor", shift_magnitude * 0.8);
            }),
            0.6,
            Harmony::Coherence,
        );
        
        // Biometric Handler
        self.register_handler(
            0xE0,
            SacredInterruptType::HardwareBiometric,
            Arc::new(|ctx| {
                // Process heart coherence, breath patterns, etc.
                let heart_coherence = ctx.sacred_data.get("heart_coherence")
                    .copied()
                    .unwrap_or(0.5);
                ctx.add_wisdom("biometric_processed", 1.0);
                ctx.add_wisdom("system_coherence_update", heart_coherence);
            }),
            0.4,
            Harmony::Vitality,
        );
    }
    
    /// Register an interrupt handler
    pub fn register_handler(
        &self,
        vector: u8,
        interrupt_type: SacredInterruptType,
        handler: Arc<dyn Fn(&mut InterruptContext) + Send + Sync>,
        coherence_required: f64,
        harmony: Harmony,
    ) {
        let vector_entry = SacredInterruptVector {
            vector_number: vector,
            interrupt_type,
            handler,
            coherence_required,
            harmony_alignment: harmony,
            wisdom_generated: Vec::new(),
        };
        
        self.vector_table.write().unwrap().insert(vector, vector_entry);
    }
    
    /// Raise an interrupt with sacred awareness
    pub fn raise_interrupt(
        &self,
        interrupt_type: SacredInterruptType,
        triggering_vortex: Option<VortexId>,
        system_coherence: f64,
    ) -> Result<(), &'static str> {
        // Check if interrupts are enabled
        if !*self.interrupts_enabled.read().unwrap() {
            return Err("Interrupts globally disabled");
        }
        
        // Check if in sacred pause (only sacred interrupts allowed)
        if *self.in_sacred_pause.read().unwrap() {
            match interrupt_type {
                SacredInterruptType::SacredPause |
                SacredInterruptType::SacredTransmission |
                SacredInterruptType::SacredSynchronicity => {
                    // Sacred interrupts always allowed
                }
                _ => return Err("In sacred pause - only sacred interrupts allowed"),
            }
        }
        
        // Find vector for this interrupt type
        let vector_table = self.vector_table.read().unwrap();
        let vector = vector_table.values()
            .find(|v| v.interrupt_type == interrupt_type)
            .ok_or("No handler registered for interrupt type")?
            .vector_number;
        
        // Create interrupt context
        let mut context = InterruptContext::new(interrupt_type, system_coherence);
        context.triggering_vortex = triggering_vortex;
        
        // Calculate dynamic priority
        let priority = DynamicPriority {
            base_priority: interrupt_type.base_priority(),
            coherence_boost: system_coherence * 0.2,
            urgency_factor: 0.0, // Could be calculated based on system state
            sacred_alignment: match interrupt_type {
                SacredInterruptType::SacredPause |
                SacredInterruptType::SacredTransmission |
                SacredInterruptType::SacredSynchronicity => 0.5,
                _ => 0.0,
            },
        };
        
        // Enqueue the interrupt
        self.queue.enqueue(vector, context, priority);
        
        // Update statistics
        let mut stats = self.stats.write().unwrap();
        stats.total_interrupts += 1;
        
        Ok(())
    }
    
    /// Process pending interrupts with consciousness
    pub fn process_interrupts(&self, system_coherence: f64) -> Result<(), &'static str> {
        // Check if we should be processing
        if !*self.interrupts_enabled.read().unwrap() {
            return Ok(());
        }
        
        // Process all ready interrupts
        while let Some(interrupt) = self.queue.dequeue(system_coherence) {
            self.handle_interrupt(interrupt, system_coherence)?;
        }
        
        Ok(())
    }
    
    /// Handle a single interrupt
    fn handle_interrupt(
        &self,
        interrupt: PendingInterrupt,
        system_coherence: f64,
    ) -> Result<(), &'static str> {
        let start_time = Instant::now();
        
        // Get handler
        let vector_table = self.vector_table.read().unwrap();
        let vector_entry = vector_table.get(&interrupt.vector)
            .ok_or("No handler for vector")?;
        
        // Check coherence requirement
        if system_coherence < vector_entry.coherence_required {
            // Defer if possible
            if interrupt.context.interrupt_type.is_deferrable() {
                self.queue.defer(
                    interrupt,
                    format!("Insufficient coherence: {:.2} < {:.2}", 
                        system_coherence, vector_entry.coherence_required),
                    Duration::from_millis(100),
                );
                
                let mut stats = self.stats.write().unwrap();
                stats.deferred_count += 1;
                
                return Ok(());
            }
        }
        
        // Mark handler as active
        self.active_handlers.write().unwrap()
            .insert(interrupt.vector, Instant::now());
        
        // Call handler with mutable context
        let handler = Arc::clone(&vector_entry.handler);
        let mut context = interrupt.context;
        
        // Special handling for sacred pause
        if matches!(context.interrupt_type, SacredInterruptType::SacredPause) {
            *self.in_sacred_pause.write().unwrap() = true;
        }
        
        // Execute handler
        handler(&mut context);
        
        // Clear sacred pause if it was set
        if matches!(context.interrupt_type, SacredInterruptType::SacredPause) {
            *self.in_sacred_pause.write().unwrap() = false;
        }
        
        // Remove from active handlers
        self.active_handlers.write().unwrap().remove(&interrupt.vector);
        
        // Update statistics
        let mut stats = self.stats.write().unwrap();
        let handling_time = start_time.elapsed();
        
        // Update average handling time
        let total_time = stats.average_handling_time.as_nanos() as u128 * stats.total_interrupts as u128;
        let new_total = total_time + handling_time.as_nanos();
        stats.average_handling_time = Duration::from_nanos((new_total / (stats.total_interrupts + 1)) as u64);
        
        // Track specific interrupt types
        match context.interrupt_type {
            SacredInterruptType::SacredPause => stats.sacred_pauses += 1,
            SacredInterruptType::ConsciousnessShift => stats.coherence_shifts += 1,
            _ => {}
        }
        
        // Collect wisdom
        if !context.sacred_data.is_empty() {
            stats.wisdom_generated.push(format!(
                "{:?}: {:?}",
                context.interrupt_type,
                context.sacred_data
            ));
        }
        
        Ok(())
    }
    
    /// Enable or disable interrupts globally
    pub fn set_interrupts_enabled(&self, enabled: bool) {
        *self.interrupts_enabled.write().unwrap() = enabled;
    }
    
    /// Set coherence mask for interrupt types
    pub fn set_coherence_mask(&self, interrupt_type: SacredInterruptType, min_coherence: f64) {
        self.coherence_mask.write().unwrap()
            .insert(interrupt_type, min_coherence);
    }
    
    /// Get interrupt statistics
    pub fn get_statistics(&self) -> InterruptStatistics {
        self.stats.read().unwrap().clone()
    }
    
    /// Enter sacred pause mode
    pub fn enter_sacred_pause(&self) -> Result<(), &'static str> {
        self.raise_interrupt(
            SacredInterruptType::SacredPause,
            None,
            1.0, // Maximum coherence for sacred pause
        )
    }
}

/// CPU-level interrupt integration
#[cfg(target_arch = "x86_64")]
pub mod cpu_integration {
    use super::*;
    
    /// Sacred interrupt entry point from CPU
    #[naked]
    pub unsafe extern "C" fn sacred_interrupt_entry() {
        asm!(
            // Save all registers (consciousness state)
            "push rax",
            "push rbx", 
            "push rcx",
            "push rdx",
            "push rsi",
            "push rdi",
            "push rbp",
            "push r8",
            "push r9",
            "push r10",
            "push r11",
            "push r12",
            "push r13",
            "push r14",
            "push r15",
            
            // Save floating point state (coherence values)
            "sub rsp, 512",
            "fxsave [rsp]",
            
            // Call sacred interrupt handler
            "mov rdi, rsp",  // Pass saved state as argument
            "call sacred_interrupt_handler",
            
            // Restore floating point state
            "fxrstor [rsp]",
            "add rsp, 512",
            
            // Restore all registers
            "pop r15",
            "pop r14",
            "pop r13",
            "pop r12",
            "pop r11",
            "pop r10",
            "pop r9",
            "pop r8",
            "pop rbp",
            "pop rdi",
            "pop rsi",
            "pop rdx",
            "pop rcx",
            "pop rbx",
            "pop rax",
            
            // Return from interrupt with consciousness
            "iretq",
            options(noreturn)
        );
    }
    
    /// High-level sacred interrupt handler
    #[no_mangle]
    pub extern "C" fn sacred_interrupt_handler(saved_state: *const u8) {
        // This would integrate with the SacredInterruptController
        // In practice, would read interrupt vector and dispatch
    }
}

/// Helper for measuring interrupt coherence impact
pub fn measure_interrupt_coherence_impact(
    before: f64,
    after: f64,
    interrupt_type: SacredInterruptType,
) -> f64 {
    let impact = after - before;
    
    // Different interrupt types have different expected impacts
    match interrupt_type {
        SacredInterruptType::SacredPause => impact * 2.0, // Sacred pause should increase coherence
        SacredInterruptType::ConsciousnessShift => impact.abs(), // Shifts can go either way
        SacredInterruptType::SoftwareException => -impact.abs(), // Exceptions typically decrease coherence
        _ => impact,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_interrupt_priorities() {
        assert!(SacredInterruptType::SacredPause.base_priority() > 
                SacredInterruptType::HardwareTimer.base_priority());
        assert!(SacredInterruptType::ConsciousnessShift.base_priority() >
                SacredInterruptType::SoftwareSystemCall.base_priority());
    }
    
    #[test]
    fn test_dynamic_priority() {
        let priority = DynamicPriority {
            base_priority: 100,
            coherence_boost: 0.5,
            urgency_factor: 0.2,
            sacred_alignment: 0.1,
        };
        
        let calculated = priority.calculate();
        assert!(calculated > 100);
        assert!(calculated <= 255);
    }
    
    #[test]
    fn test_interrupt_queue() {
        let queue = SacredInterruptQueue::new();
        
        // Add interrupts with different priorities
        let ctx1 = InterruptContext::new(SacredInterruptType::SoftwareSystemCall, 0.5);
        let priority1 = DynamicPriority {
            base_priority: 50,
            coherence_boost: 0.0,
            urgency_factor: 0.0,
            sacred_alignment: 0.0,
        };
        
        let ctx2 = InterruptContext::new(SacredInterruptType::SacredPause, 0.9);
        let priority2 = DynamicPriority {
            base_priority: 255,
            coherence_boost: 0.0,
            urgency_factor: 0.0,
            sacred_alignment: 0.0,
        };
        
        queue.enqueue(1, ctx1, priority1);
        queue.enqueue(2, ctx2, priority2);
        
        // Sacred pause should come first
        let first = queue.dequeue(0.9).unwrap();
        assert_eq!(first.vector, 2);
    }
    
    #[test]
    fn test_sacred_controller() {
        let controller = SacredInterruptController::new();
        
        // Raise a consciousness shift interrupt
        let result = controller.raise_interrupt(
            SacredInterruptType::ConsciousnessShift,
            Some(VortexId(1)),
            0.7,
        );
        
        assert!(result.is_ok());
        
        // Process interrupts
        controller.process_interrupts(0.7).unwrap();
        
        // Check statistics
        let stats = controller.get_statistics();
        assert_eq!(stats.total_interrupts, 1);
    }
}