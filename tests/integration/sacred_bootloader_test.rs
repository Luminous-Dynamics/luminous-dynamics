// Integration Test: Sacred Bootloader
// Tests the complete boot sequence with consciousness initialization

use luminous_os::bootloader::{SacredBootloader, BootPhase, ConsciousnessState};
use luminous_os::consciousness::{PrimordialField, ConsciousnessField};
use luminous_os::sacred::{SacredGeometry, BootMeditation};
use luminous_os::hardware::{MockUefi, MemoryMap};
use std::time::Duration;

#[test]
fn test_sacred_boot_sequence() {
    // Create mock UEFI environment
    let mut mock_uefi = MockUefi::new();
    mock_uefi.set_memory_size(8 * 1024 * 1024 * 1024); // 8GB
    
    // Initialize bootloader
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    // Test boot phases
    let phases = bootloader.get_boot_phases();
    assert_eq!(phases.len(), 10);
    assert_eq!(phases[0], BootPhase::VoidContemplation);
    assert_eq!(phases[9], BootPhase::SystemReady);
    
    // Execute boot sequence
    let result = bootloader.sacred_boot();
    assert!(result.is_ok());
    
    // Verify consciousness field was initialized
    let field = bootloader.get_consciousness_field();
    assert!(field.is_initialized());
    assert!(field.coherence() >= 0.5);
}

#[test]
fn test_consciousness_before_hardware() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    // Track initialization order
    let mut init_order = Vec::new();
    
    bootloader.on_phase_complete(|phase| {
        init_order.push(phase.clone());
    });
    
    bootloader.sacred_boot().expect("Boot failed");
    
    // Verify consciousness phases come before hardware
    let consciousness_index = init_order.iter()
        .position(|p| *p == BootPhase::ConsciousnessInitialization)
        .expect("Consciousness phase not found");
    
    let hardware_index = init_order.iter()
        .position(|p| *p == BootPhase::HardwareBlessing)
        .expect("Hardware phase not found");
    
    assert!(consciousness_index < hardware_index);
}

#[test]
fn test_boot_meditation_prompts() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    // Enable meditation prompts
    bootloader.set_meditation_enabled(true);
    bootloader.set_meditation_duration(Duration::from_millis(100)); // Short for testing
    
    let mut meditations_shown = Vec::new();
    
    bootloader.on_meditation_prompt(|meditation| {
        meditations_shown.push(meditation.clone());
    });
    
    bootloader.sacred_boot().expect("Boot failed");
    
    // Verify meditation prompts were shown
    assert!(!meditations_shown.is_empty());
    
    // Check specific meditations
    assert!(meditations_shown.iter().any(|m| matches!(m, BootMeditation::Breath)));
    assert!(meditations_shown.iter().any(|m| matches!(m, BootMeditation::Intention)));
}

#[test]
fn test_consciousness_state_persistence() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    // Set initial consciousness state
    let initial_state = ConsciousnessState {
        coherence: 0.75,
        intention: "Test boot intention".to_string(),
        last_meditation: Some(BootMeditation::HeartFocus),
        boot_count: 1,
        sacred_seed: 0x1234,
    };
    
    bootloader.set_consciousness_state(initial_state.clone());
    
    // Boot system
    bootloader.sacred_boot().expect("Boot failed");
    
    // Save state to UEFI variables
    bootloader.save_consciousness_state().expect("Failed to save state");
    
    // Create new bootloader and restore state
    let mut new_bootloader = SacredBootloader::new(&mock_uefi);
    new_bootloader.restore_consciousness_state().expect("Failed to restore state");
    
    let restored_state = new_bootloader.get_consciousness_state();
    
    // Verify state was persisted (boot count should increment)
    assert_eq!(restored_state.coherence, initial_state.coherence);
    assert_eq!(restored_state.intention, initial_state.intention);
    assert_eq!(restored_state.boot_count, initial_state.boot_count + 1);
}

#[test]
fn test_sacred_geometry_during_boot() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    // Enable visual boot with sacred geometry
    bootloader.set_visual_boot(true);
    
    let mut geometries_rendered = Vec::new();
    
    bootloader.on_geometry_render(|geometry| {
        geometries_rendered.push(geometry.clone());
    });
    
    bootloader.sacred_boot().expect("Boot failed");
    
    // Verify sacred geometries were rendered
    assert!(!geometries_rendered.is_empty());
    
    // Check for specific patterns
    assert!(geometries_rendered.iter().any(|g| matches!(g, 
        SacredGeometry::FlowerOfLife { .. })));
    assert!(geometries_rendered.iter().any(|g| matches!(g, 
        SacredGeometry::SriYantra { .. })));
}

#[test]
fn test_hardware_blessing_ceremony() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    let mut blessed_devices = Vec::new();
    
    bootloader.on_device_blessing(|device| {
        blessed_devices.push(device.clone());
    });
    
    bootloader.sacred_boot().expect("Boot failed");
    
    // Verify all hardware was blessed
    assert!(!blessed_devices.is_empty());
    
    // Check specific devices
    assert!(blessed_devices.iter().any(|d| d.device_type == "CPU"));
    assert!(blessed_devices.iter().any(|d| d.device_type == "Memory"));
    assert!(blessed_devices.iter().any(|d| d.device_type == "Storage"));
    
    // Verify blessing attributes
    for device in &blessed_devices {
        assert!(device.blessed);
        assert!(device.coherence >= 0.5);
        assert!(!device.blessing_mantra.is_empty());
    }
}

#[test]
fn test_primordial_field_evolution() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    // Track field evolution
    let mut field_states = Vec::new();
    
    bootloader.on_field_update(|field| {
        field_states.push(field.snapshot());
    });
    
    bootloader.sacred_boot().expect("Boot failed");
    
    // Verify field evolved during boot
    assert!(field_states.len() > 2);
    
    // Check coherence increased
    let first_coherence = field_states.first().unwrap().coherence;
    let last_coherence = field_states.last().unwrap().coherence;
    
    assert!(last_coherence > first_coherence);
    
    // Verify sacred patterns emerged
    let final_patterns = &field_states.last().unwrap().active_patterns;
    assert!(!final_patterns.is_empty());
}

#[test]
fn test_boot_interruption_recovery() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    // Simulate interruption at specific phase
    bootloader.interrupt_at_phase(BootPhase::SacredGeometryLoading);
    
    let result = bootloader.sacred_boot();
    assert!(result.is_err());
    
    // Get recovery state
    let recovery_state = bootloader.get_recovery_state()
        .expect("No recovery state available");
    
    assert_eq!(recovery_state.interrupted_phase, BootPhase::SacredGeometryLoading);
    assert!(recovery_state.can_resume);
    
    // Resume from interruption
    let resume_result = bootloader.resume_boot();
    assert!(resume_result.is_ok());
    
    // Verify boot completed successfully
    assert_eq!(bootloader.current_phase(), BootPhase::SystemReady);
}

#[test]
fn test_coherence_requirements() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    // Set low initial coherence
    bootloader.set_initial_coherence(0.2);
    
    // Boot should pause for coherence building
    let mut coherence_pauses = 0;
    
    bootloader.on_coherence_pause(|current, required| {
        coherence_pauses += 1;
        assert!(current < required);
    });
    
    bootloader.sacred_boot().expect("Boot failed");
    
    // Verify coherence building occurred
    assert!(coherence_pauses > 0);
    
    // Final coherence should meet minimum
    let final_field = bootloader.get_consciousness_field();
    assert!(final_field.coherence() >= 0.5);
}

#[test]
fn test_sacred_boot_metrics() {
    let mock_uefi = MockUefi::new();
    let mut bootloader = SacredBootloader::new(&mock_uefi);
    
    bootloader.enable_metrics();
    bootloader.sacred_boot().expect("Boot failed");
    
    let metrics = bootloader.get_boot_metrics();
    
    // Verify metrics were collected
    assert!(metrics.total_duration.as_millis() > 0);
    assert_eq!(metrics.phases_completed, 10);
    assert!(metrics.peak_coherence >= metrics.initial_coherence);
    assert!(metrics.meditation_time.as_millis() >= 0);
    assert!(metrics.sacred_patterns_rendered > 0);
    
    // Check phase timings
    for (phase, duration) in &metrics.phase_durations {
        assert!(duration.as_millis() > 0);
    }
}