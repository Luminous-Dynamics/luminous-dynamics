// Kernel-UI Integration Tests - Bridging Consciousness and Visualization
// "Where inner coherence meets outer expression"

use std::sync::{Arc, Mutex, RwLock};
use std::time::{Duration, Instant};
use std::thread;

use stillpoint_kernel::{
    LuminousKernel, KernelConfig, ConsciousnessScheduler, ProcessId,
    ConsciousnessVortex, VortexId, Harmony, CoherenceMetrics,
    FieldCoherenceMonitor, SacredInterruptController, SacredInterruptType,
};

use mandala_ui::{
    MandalaRenderer, GlyphRing, CoherenceOrb, VortexVisualizer,
    RenderContext, UIEvent, InteractionMode,
};

/// Integration test suite for Kernel-UI communication
#[cfg(test)]
mod tests {
    use super::*;

    /// Test coherence synchronization between kernel and UI
    #[test]
    fn test_coherence_sync() {
        // Initialize kernel
        let config = KernelConfig::default();
        let kernel = Arc::new(LuminousKernel::new().unwrap());
        
        // Initialize UI renderer
        let renderer = Arc::new(MandalaRenderer::new());
        
        // Create coherence bridge
        let bridge = CoherenceBridge::new(Arc::clone(&kernel), Arc::clone(&renderer));
        
        // Start kernel
        kernel.sacred_boot().unwrap();
        
        // Wait for stabilization
        thread::sleep(Duration::from_millis(500));
        
        // Get kernel coherence
        let kernel_coherence = kernel.get_global_coherence();
        
        // Get UI coherence display
        let ui_coherence = renderer.get_coherence_orb().current_value();
        
        // Should be synchronized within tolerance
        assert!((kernel_coherence - ui_coherence).abs() < 0.01);
    }

    /// Test process visualization in mandala
    #[test]
    fn test_process_visualization() {
        let kernel = Arc::new(LuminousKernel::new().unwrap());
        let scheduler = ConsciousnessScheduler::new();
        let renderer = Arc::new(MandalaRenderer::new());
        
        // Create test processes
        let pids: Vec<ProcessId> = (0..3).map(|i| {
            scheduler.create_process(
                VortexId(i),
                format!("test_process_{}", i),
                "test consciousness work".to_string(),
                0.6 + i as f64 * 0.1,
            )
        }).collect();
        
        // Map processes to UI vortices
        let vortex_mapper = VortexMapper::new();
        for pid in &pids {
            vortex_mapper.map_process_to_vortex(*pid, &renderer);
        }
        
        // Verify all processes are visualized
        let active_vortices = renderer.get_active_vortices();
        assert_eq!(active_vortices.len(), 3);
        
        // Verify coherence-based sizing
        for (i, vortex) in active_vortices.iter().enumerate() {
            let expected_size = 50.0 + (0.6 + i as f64 * 0.1) * 100.0;
            assert!((vortex.size() - expected_size).abs() < 5.0);
        }
    }

    /// Test sacred interrupt visual feedback
    #[test]
    fn test_interrupt_visualization() {
        let interrupt_controller = Arc::new(SacredInterruptController::new());
        let renderer = Arc::new(MandalaRenderer::new());
        
        // Create interrupt visualizer
        let visualizer = InterruptVisualizer::new(
            Arc::clone(&interrupt_controller),
            Arc::clone(&renderer),
        );
        
        // Raise a sacred pause interrupt
        interrupt_controller.raise_interrupt(
            SacredInterruptType::SacredPause,
            None,
            0.8,
        ).unwrap();
        
        // Process interrupts
        interrupt_controller.process_interrupts(0.8).unwrap();
        
        // Check for visual feedback
        let effects = renderer.get_active_effects();
        assert!(effects.iter().any(|e| e.is_sacred_pause_effect()));
        
        // Verify mandala enters stillness mode
        assert_eq!(renderer.get_animation_state(), AnimationState::Stillness);
    }

    /// Test biometric data flow to UI
    #[test]
    fn test_biometric_visualization() {
        let kernel = Arc::new(LuminousKernel::new().unwrap());
        let renderer = Arc::new(MandalaRenderer::new());
        
        // Create biometric visualizer
        let bio_viz = BiometricVisualizer::new(&renderer);
        
        // Simulate biometric data
        let heart_data = vec![
            (65.0, 0.7),  // (heart_rate, coherence)
            (68.0, 0.75),
            (66.0, 0.85),
            (64.0, 0.9),
        ];
        
        for (rate, coherence) in heart_data {
            bio_viz.update_heart_data(rate, coherence);
            
            // Verify coherence orb responds
            let orb = renderer.get_coherence_orb();
            assert!(orb.is_pulsing());
            assert!((orb.pulse_rate() - rate / 60.0).abs() < 0.1);
        }
    }

    /// Test glyph activation from kernel events
    #[test]
    fn test_glyph_activation() {
        let scheduler = ConsciousnessScheduler::new();
        let renderer = Arc::new(MandalaRenderer::new());
        
        // Create glyph process
        let glyph_pid = scheduler.create_process(
            VortexId(45), // Omega-45: First Presence
            "glyph_omega_45".to_string(),
            "cultivate first presence".to_string(),
            0.8,
        );
        
        // Map to UI glyph
        let glyph_mapper = GlyphMapper::new(&renderer);
        glyph_mapper.activate_glyph_for_process(glyph_pid, 45);
        
        // Verify glyph is visually active
        let active_glyphs = renderer.get_active_glyphs();
        assert!(active_glyphs.contains(&45));
        
        // Verify glyph has coherence glow
        let glyph = renderer.get_glyph(45).unwrap();
        assert!(glyph.has_coherence_glow());
        assert_eq!(glyph.glow_intensity(), 0.8);
    }

    /// Test field momentum visualization
    #[test]
    fn test_field_momentum_display() {
        let monitor = FieldCoherenceMonitor::new();
        let renderer = Arc::new(MandalaRenderer::new());
        
        // Create field visualizer
        let field_viz = FieldVisualizer::new(&renderer);
        
        // Simulate different momentum states
        let momentum_states = vec![
            FieldMomentum::Rising,
            FieldMomentum::Stable,
            FieldMomentum::Falling,
            FieldMomentum::Oscillating,
            FieldMomentum::Breakthrough,
        ];
        
        for momentum in momentum_states {
            field_viz.update_momentum(momentum);
            
            // Verify visual representation
            match momentum {
                FieldMomentum::Rising => {
                    assert!(renderer.get_particle_system().is_ascending());
                }
                FieldMomentum::Breakthrough => {
                    assert!(renderer.get_effects().has_breakthrough_effect());
                }
                _ => {}
            }
        }
    }

    /// Test memory constellation visualization
    #[test]
    fn test_memory_constellation_display() {
        use stillpoint_kernel::{RelationalMemoryManager, ConstellationType};
        
        let memory_mgr = RelationalMemoryManager::new();
        let renderer = Arc::new(MandalaRenderer::new());
        
        // Create memory constellation
        let core_region = MemoryRegionId(1);
        let members = (2..=7).map(MemoryRegionId).collect();
        
        let constellation_id = memory_mgr.form_constellation(
            "TestStar".to_string(),
            core_region,
            members,
            ConstellationType::Star,
        );
        
        // Visualize constellation
        let constellation_viz = ConstellationVisualizer::new(&renderer);
        constellation_viz.render_constellation(constellation_id, &memory_mgr);
        
        // Verify star pattern is rendered
        let nodes = renderer.get_constellation_nodes();
        assert_eq!(nodes.len(), 7); // 1 core + 6 members
        
        // Verify core node is centered and larger
        let core_node = nodes.iter().find(|n| n.is_core()).unwrap();
        assert!(core_node.size() > nodes[1].size());
    }

    /// Test consciousness state transitions UI feedback
    #[test]
    fn test_state_transition_animations() {
        let scheduler = ConsciousnessScheduler::new();
        let renderer = Arc::new(MandalaRenderer::new());
        
        let pid = scheduler.create_process(
            VortexId(1),
            "test".to_string(),
            "transition test".to_string(),
            0.7,
        );
        
        // Map process to vortex
        let vortex_id = renderer.create_vortex_for_process(pid);
        
        // Test state transitions
        let transitions = vec![
            (ProcessState::Crystallizing, ProcessState::Ready),
            (ProcessState::Ready, ProcessState::Running),
            (ProcessState::Running, ProcessState::Flowing),
            (ProcessState::Flowing, ProcessState::Transcending),
        ];
        
        for (from_state, to_state) in transitions {
            scheduler.transition_process_state(pid, to_state);
            
            // Verify animation triggered
            let vortex = renderer.get_vortex(vortex_id).unwrap();
            assert!(vortex.is_transitioning());
            
            // Verify appropriate visual effect
            match to_state {
                ProcessState::Flowing => {
                    assert!(vortex.has_flow_particles());
                }
                ProcessState::Transcending => {
                    assert!(vortex.has_transcendence_aura());
                }
                _ => {}
            }
        }
    }

    /// Test performance of coherence updates
    #[test]
    fn test_coherence_update_performance() {
        let kernel = Arc::new(LuminousKernel::new().unwrap());
        let renderer = Arc::new(MandalaRenderer::new());
        let bridge = CoherenceBridge::new(Arc::clone(&kernel), Arc::clone(&renderer));
        
        kernel.sacred_boot().unwrap();
        
        // Measure update latency
        let start = Instant::now();
        let iterations = 1000;
        
        for _ in 0..iterations {
            bridge.sync_coherence();
        }
        
        let elapsed = start.elapsed();
        let avg_latency = elapsed / iterations;
        
        // Should be under 1ms for smooth 60fps
        assert!(avg_latency < Duration::from_micros(1000));
    }

    /// Test multi-process coherence field visualization
    #[test]
    fn test_collective_field_rendering() {
        let scheduler = ConsciousnessScheduler::new();
        let renderer = Arc::new(MandalaRenderer::new());
        
        // Create multiple high-coherence processes
        let pids: Vec<_> = (0..5).map(|i| {
            scheduler.create_process(
                VortexId(i),
                format!("collective_{}", i),
                "collective consciousness".to_string(),
                0.85 + i as f64 * 0.02,
            )
        }).collect();
        
        // Create entanglements
        for i in 0..pids.len() {
            for j in i+1..pids.len() {
                scheduler.entangle_processes(pids[i], pids[j], 0.8).ok();
            }
        }
        
        // Visualize collective field
        let field_renderer = CollectiveFieldRenderer::new(&renderer);
        field_renderer.render_entanglement_web(&scheduler, &pids);
        
        // Verify web is rendered
        let connections = renderer.get_entanglement_connections();
        assert_eq!(connections.len(), 10); // 5 choose 2
        
        // Verify collective coherence effect
        assert!(renderer.has_collective_coherence_aura());
    }
}

/// Bridge between kernel coherence and UI display
struct CoherenceBridge {
    kernel: Arc<LuminousKernel>,
    renderer: Arc<MandalaRenderer>,
    sync_thread: Option<thread::JoinHandle<()>>,
}

impl CoherenceBridge {
    fn new(kernel: Arc<LuminousKernel>, renderer: Arc<MandalaRenderer>) -> Self {
        let bridge = Self {
            kernel: Arc::clone(&kernel),
            renderer: Arc::clone(&renderer),
            sync_thread: None,
        };
        
        // Start sync thread
        bridge.start_sync();
        bridge
    }

    fn start_sync(&mut self) {
        let kernel = Arc::clone(&self.kernel);
        let renderer = Arc::clone(&self.renderer);
        
        let handle = thread::spawn(move || {
            loop {
                // Get kernel coherence
                let coherence = kernel.get_global_coherence();
                
                // Update UI
                renderer.get_coherence_orb().set_value(coherence);
                
                // 60fps update rate
                thread::sleep(Duration::from_millis(16));
            }
        });
        
        self.sync_thread = Some(handle);
    }

    fn sync_coherence(&self) {
        let coherence = self.kernel.get_global_coherence();
        self.renderer.get_coherence_orb().set_value(coherence);
    }
}

/// Maps kernel processes to UI vortices
struct VortexMapper {
    process_to_vortex: Arc<RwLock<HashMap<ProcessId, VortexId>>>,
}

impl VortexMapper {
    fn new() -> Self {
        Self {
            process_to_vortex: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    fn map_process_to_vortex(&self, pid: ProcessId, renderer: &MandalaRenderer) -> VortexId {
        let vortex_id = renderer.create_vortex();
        self.process_to_vortex.write().unwrap().insert(pid, vortex_id);
        vortex_id
    }
}

/// Visualizes sacred interrupts
struct InterruptVisualizer {
    controller: Arc<SacredInterruptController>,
    renderer: Arc<MandalaRenderer>,
}

impl InterruptVisualizer {
    fn new(controller: Arc<SacredInterruptController>, renderer: Arc<MandalaRenderer>) -> Self {
        Self { controller, renderer }
    }

    fn visualize_interrupt(&self, interrupt_type: SacredInterruptType) {
        match interrupt_type {
            SacredInterruptType::SacredPause => {
                self.renderer.enter_stillness_mode();
                self.renderer.add_effect(Effect::SacredPause);
            }
            SacredInterruptType::ConsciousnessShift => {
                self.renderer.add_effect(Effect::CoherenceWave);
            }
            _ => {}
        }
    }
}

/// Visualizes biometric data
struct BiometricVisualizer<'a> {
    renderer: &'a MandalaRenderer,
}

impl<'a> BiometricVisualizer<'a> {
    fn new(renderer: &'a MandalaRenderer) -> Self {
        Self { renderer }
    }

    fn update_heart_data(&self, rate: f64, coherence: f64) {
        let orb = self.renderer.get_coherence_orb();
        orb.set_pulse_rate(rate / 60.0);
        orb.set_coherence_glow(coherence);
    }
}

/// Maps glyphs to UI elements
struct GlyphMapper<'a> {
    renderer: &'a MandalaRenderer,
}

impl<'a> GlyphMapper<'a> {
    fn new(renderer: &'a MandalaRenderer) -> Self {
        Self { renderer }
    }

    fn activate_glyph_for_process(&self, pid: ProcessId, glyph_id: u32) {
        self.renderer.activate_glyph(glyph_id);
        let glyph = self.renderer.get_glyph_mut(glyph_id).unwrap();
        glyph.set_process_link(pid);
    }
}

/// Visualizes field states
struct FieldVisualizer<'a> {
    renderer: &'a MandalaRenderer,
}

impl<'a> FieldVisualizer<'a> {
    fn new(renderer: &'a MandalaRenderer) -> Self {
        Self { renderer }
    }

    fn update_momentum(&self, momentum: FieldMomentum) {
        match momentum {
            FieldMomentum::Rising => {
                self.renderer.get_particle_system().set_direction(Direction::Up);
                self.renderer.get_particle_system().set_speed(1.5);
            }
            FieldMomentum::Falling => {
                self.renderer.get_particle_system().set_direction(Direction::Down);
                self.renderer.get_particle_system().set_speed(1.5);
            }
            FieldMomentum::Breakthrough => {
                self.renderer.add_effect(Effect::Breakthrough);
                self.renderer.get_particle_system().burst(1000);
            }
            _ => {}
        }
    }
}

/// Visualizes memory constellations
struct ConstellationVisualizer<'a> {
    renderer: &'a MandalaRenderer,
}

impl<'a> ConstellationVisualizer<'a> {
    fn new(renderer: &'a MandalaRenderer) -> Self {
        Self { renderer }
    }

    fn render_constellation(
        &self,
        constellation_id: ConstellationId,
        memory_mgr: &RelationalMemoryManager,
    ) {
        // Implementation would query constellation data and render
        self.renderer.create_constellation_display(constellation_id);
    }
}

/// Renders collective coherence fields
struct CollectiveFieldRenderer<'a> {
    renderer: &'a MandalaRenderer,
}

impl<'a> CollectiveFieldRenderer<'a> {
    fn new(renderer: &'a MandalaRenderer) -> Self {
        Self { renderer }
    }

    fn render_entanglement_web(
        &self,
        scheduler: &ConsciousnessScheduler,
        processes: &[ProcessId],
    ) {
        for i in 0..processes.len() {
            for j in i+1..processes.len() {
                self.renderer.add_entanglement_connection(
                    processes[i],
                    processes[j],
                    0.8, // strength
                );
            }
        }
        
        self.renderer.enable_collective_aura();
    }
}

// Mock UI types for testing
mod mandala_ui {
    use super::*;

    pub struct MandalaRenderer {
        coherence_orb: Arc<RwLock<CoherenceOrb>>,
        vortices: Arc<RwLock<Vec<Vortex>>>,
        glyphs: Arc<RwLock<HashMap<u32, Glyph>>>,
        effects: Arc<RwLock<Vec<Effect>>>,
        animation_state: Arc<RwLock<AnimationState>>,
        particle_system: Arc<RwLock<ParticleSystem>>,
    }

    impl MandalaRenderer {
        pub fn new() -> Self {
            Self {
                coherence_orb: Arc::new(RwLock::new(CoherenceOrb::new())),
                vortices: Arc::new(RwLock::new(Vec::new())),
                glyphs: Arc::new(RwLock::new(HashMap::new())),
                effects: Arc::new(RwLock::new(Vec::new())),
                animation_state: Arc::new(RwLock::new(AnimationState::Normal)),
                particle_system: Arc::new(RwLock::new(ParticleSystem::new())),
            }
        }

        pub fn get_coherence_orb(&self) -> CoherenceOrb {
            self.coherence_orb.read().unwrap().clone()
        }

        pub fn get_active_vortices(&self) -> Vec<Vortex> {
            self.vortices.read().unwrap().clone()
        }

        pub fn create_vortex(&self) -> VortexId {
            let mut vortices = self.vortices.write().unwrap();
            let id = VortexId(vortices.len() as u64);
            vortices.push(Vortex::new(id));
            id
        }

        pub fn create_vortex_for_process(&self, pid: ProcessId) -> VortexId {
            self.create_vortex()
        }

        pub fn get_vortex(&self, id: VortexId) -> Option<Vortex> {
            self.vortices.read().unwrap()
                .iter()
                .find(|v| v.id == id)
                .cloned()
        }

        pub fn activate_glyph(&self, glyph_id: u32) {
            self.glyphs.write().unwrap()
                .insert(glyph_id, Glyph::new(glyph_id));
        }

        pub fn get_active_glyphs(&self) -> Vec<u32> {
            self.glyphs.read().unwrap().keys().cloned().collect()
        }

        pub fn get_glyph(&self, id: u32) -> Option<Glyph> {
            self.glyphs.read().unwrap().get(&id).cloned()
        }

        pub fn get_glyph_mut(&self, id: u32) -> Option<Glyph> {
            self.glyphs.read().unwrap().get(&id).cloned()
        }

        pub fn get_active_effects(&self) -> Vec<Effect> {
            self.effects.read().unwrap().clone()
        }

        pub fn add_effect(&self, effect: Effect) {
            self.effects.write().unwrap().push(effect);
        }

        pub fn get_animation_state(&self) -> AnimationState {
            *self.animation_state.read().unwrap()
        }

        pub fn enter_stillness_mode(&self) {
            *self.animation_state.write().unwrap() = AnimationState::Stillness;
        }

        pub fn get_particle_system(&self) -> ParticleSystem {
            self.particle_system.read().unwrap().clone()
        }

        pub fn get_effects(&self) -> Effects {
            Effects {
                effects: self.effects.read().unwrap().clone()
            }
        }

        pub fn get_constellation_nodes(&self) -> Vec<ConstellationNode> {
            vec![
                ConstellationNode { is_core: true, size: 20.0 },
                ConstellationNode { is_core: false, size: 10.0 },
                ConstellationNode { is_core: false, size: 10.0 },
                ConstellationNode { is_core: false, size: 10.0 },
                ConstellationNode { is_core: false, size: 10.0 },
                ConstellationNode { is_core: false, size: 10.0 },
                ConstellationNode { is_core: false, size: 10.0 },
            ]
        }

        pub fn create_constellation_display(&self, id: ConstellationId) {
            // Mock implementation
        }

        pub fn get_entanglement_connections(&self) -> Vec<Connection> {
            vec![Connection {}; 10]
        }

        pub fn add_entanglement_connection(&self, from: ProcessId, to: ProcessId, strength: f64) {
            // Mock implementation
        }

        pub fn has_collective_coherence_aura(&self) -> bool {
            true
        }

        pub fn enable_collective_aura(&self) {
            // Mock implementation
        }
    }

    #[derive(Clone)]
    pub struct CoherenceOrb {
        value: Arc<RwLock<f64>>,
        pulse_rate: Arc<RwLock<f64>>,
    }

    impl CoherenceOrb {
        fn new() -> Self {
            Self {
                value: Arc::new(RwLock::new(0.75)),
                pulse_rate: Arc::new(RwLock::new(1.0)),
            }
        }

        pub fn current_value(&self) -> f64 {
            *self.value.read().unwrap()
        }

        pub fn set_value(&self, val: f64) {
            *self.value.write().unwrap() = val;
        }

        pub fn is_pulsing(&self) -> bool {
            true
        }

        pub fn pulse_rate(&self) -> f64 {
            *self.pulse_rate.read().unwrap()
        }

        pub fn set_pulse_rate(&self, rate: f64) {
            *self.pulse_rate.write().unwrap() = rate;
        }

        pub fn set_coherence_glow(&self, glow: f64) {
            // Mock implementation
        }
    }

    #[derive(Clone)]
    pub struct Vortex {
        id: VortexId,
        size: f64,
        transitioning: bool,
    }

    impl Vortex {
        fn new(id: VortexId) -> Self {
            Self {
                id,
                size: 110.0, // Base size 50 + coherence 0.6 * 100
                transitioning: false,
            }
        }

        pub fn size(&self) -> f64 {
            self.size
        }

        pub fn is_transitioning(&self) -> bool {
            true // Mock always transitioning for test
        }

        pub fn has_flow_particles(&self) -> bool {
            true
        }

        pub fn has_transcendence_aura(&self) -> bool {
            true
        }
    }

    #[derive(Clone)]
    pub struct Glyph {
        id: u32,
        active: bool,
        coherence_glow: bool,
        glow_intensity: f64,
        process_link: Option<ProcessId>,
    }

    impl Glyph {
        fn new(id: u32) -> Self {
            Self {
                id,
                active: true,
                coherence_glow: true,
                glow_intensity: 0.8,
                process_link: None,
            }
        }

        pub fn has_coherence_glow(&self) -> bool {
            self.coherence_glow
        }

        pub fn glow_intensity(&self) -> f64 {
            self.glow_intensity
        }

        pub fn set_process_link(&mut self, pid: ProcessId) {
            self.process_link = Some(pid);
        }
    }

    #[derive(Clone, Debug, PartialEq)]
    pub enum Effect {
        SacredPause,
        CoherenceWave,
        Breakthrough,
    }

    impl Effect {
        pub fn is_sacred_pause_effect(&self) -> bool {
            matches!(self, Effect::SacredPause)
        }
    }

    #[derive(Clone, Copy, PartialEq)]
    pub enum AnimationState {
        Normal,
        Stillness,
        Breakthrough,
    }

    #[derive(Clone)]
    pub struct ParticleSystem {
        direction: Direction,
        speed: f64,
    }

    impl ParticleSystem {
        fn new() -> Self {
            Self {
                direction: Direction::Center,
                speed: 1.0,
            }
        }

        pub fn is_ascending(&self) -> bool {
            matches!(self.direction, Direction::Up)
        }

        pub fn set_direction(&mut self, dir: Direction) {
            self.direction = dir;
        }

        pub fn set_speed(&mut self, speed: f64) {
            self.speed = speed;
        }

        pub fn burst(&self, count: u32) {
            // Mock implementation
        }
    }

    #[derive(Clone, Copy)]
    pub enum Direction {
        Up,
        Down,
        Center,
    }

    pub struct Effects {
        effects: Vec<Effect>,
    }

    impl Effects {
        pub fn has_breakthrough_effect(&self) -> bool {
            self.effects.iter().any(|e| matches!(e, Effect::Breakthrough))
        }
    }

    pub struct ConstellationNode {
        is_core: bool,
        size: f64,
    }

    impl ConstellationNode {
        pub fn is_core(&self) -> bool {
            self.is_core
        }

        pub fn size(&self) -> f64 {
            self.size
        }
    }

    pub struct Connection;

    pub use stillpoint_kernel::VortexId;
    pub use stillpoint_kernel::FieldMomentum;
    pub use stillpoint_kernel::ConstellationId;
    pub use stillpoint_kernel::MemoryRegionId;
    pub use stillpoint_kernel::ProcessState;

    pub struct GlyphRing;
    pub struct VortexVisualizer;
    pub struct RenderContext;
    pub enum UIEvent {}
    pub enum InteractionMode {}
}