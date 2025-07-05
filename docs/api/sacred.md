# Sacred Patterns API Reference

The sacred module provides types and functions for working with sacred geometry, harmonic patterns, and consciousness-enhancing geometries.

## Core Types

### `SacredGeometry`

Base enum for all sacred geometric patterns.

```rust
pub enum SacredGeometry {
    FlowerOfLife { rings: u32, radius: f32 },
    SeedOfLife,
    TreeOfLife { sephiroth_active: Vec<Sephirah> },
    MetatronsCube { dimension: u32 },
    SriYantra { triangles: u32 },
    VesicaPiscis { overlap: f32 },
    GoldenSpiral { rotations: f32, growth_rate: f32 },
    PlatonicSolid(PlatonicType),
    MerkabaField { rotation_speed: f32 },
    Torus { major_radius: f32, minor_radius: f32 },
    FibonacciSpiral { elements: u32 },
    SacredLabyrinth { circuits: u32, style: LabyrinthStyle },
}
```

### `PlatonicType`

The five Platonic solids and their properties.

```rust
pub enum PlatonicType {
    Tetrahedron,    // Fire - 4 faces
    Cube,           // Earth - 6 faces  
    Octahedron,     // Air - 8 faces
    Dodecahedron,   // Universe - 12 faces
    Icosahedron,    // Water - 20 faces
}

impl PlatonicType {
    pub fn element(&self) -> Element;
    pub fn vertices(&self) -> u32;
    pub fn edges(&self) -> u32;
    pub fn faces(&self) -> u32;
    pub fn dual(&self) -> PlatonicType;
}
```

### `SacredPattern`

Trait for all sacred patterns.

```rust
pub trait SacredPattern: Send + Sync {
    fn generate(&self, center: Point3, scale: f32) -> PatternElements;
    fn coherence_field(&self) -> CoherenceField;
    fn harmonic_frequencies(&self) -> Vec<f32>;
    fn sacred_numbers(&self) -> Vec<f32>;
    fn animate(&self, time: f32) -> Transform;
}
```

### `PatternElements`

Collection of geometric elements forming a pattern.

```rust
pub struct PatternElements {
    pub points: Vec<Point3>,
    pub lines: Vec<Line>,
    pub circles: Vec<Circle>,
    pub polygons: Vec<Polygon>,
    pub curves: Vec<BezierCurve>,
    pub meshes: Vec<Mesh>,
}
```

## Pattern Generators

### `FlowerOfLifeGenerator`

Creates the Flower of Life pattern with customizable parameters.

```rust
pub struct FlowerOfLifeGenerator {
    rings: u32,
    petal_radius: f32,
    sacred_proportion: bool,
    animation_phase: f32,
}

impl FlowerOfLifeGenerator {
    pub fn new() -> Self;
    
    pub fn with_rings(mut self, rings: u32) -> Self;
    
    pub fn generate(&self) -> FlowerOfLife;
    
    pub fn generate_animated(&self, time: f32) -> AnimatedPattern;
    
    pub fn coherence_points(&self) -> Vec<Point3>;
}

// Usage
let flower = FlowerOfLifeGenerator::new()
    .with_rings(7)
    .sacred_proportion(true)
    .generate();
```

### `SriYantraGenerator`

Generates the Sri Yantra with precise sacred proportions.

```rust
pub struct SriYantraGenerator {
    triangles_up: u32,    // Shiva triangles (typically 4)
    triangles_down: u32,  // Shakti triangles (typically 5)
    bindu_size: f32,      // Central point size
    lotus_petals: u32,    // Outer lotus (8 or 16)
}

impl SriYantraGenerator {
    pub fn traditional() -> Self;
    
    pub fn generate(&self) -> SriYantra;
    
    pub fn intersection_points(&self) -> Vec<Point3>;
    
    pub fn with_mantra(&mut self, mantra: &str) -> &mut Self;
}
```

### `MetatronsCubeGenerator`

Creates Metatron's Cube with all 13 circles and connecting lines.

```rust
pub struct MetatronsCubeGenerator {
    show_all_lines: bool,
    highlight_platonic_solids: bool,
    dimension: Dimension,
}

pub enum Dimension {
    TwoD,
    ThreeD,
    FourD, // Hypercube projection
}

impl MetatronsCubeGenerator {
    pub fn generate(&self) -> MetatronsCube;
    
    pub fn extract_platonic_solid(&self, solid_type: PlatonicType) 
        -> PlatonicSolid;
    
    pub fn fruit_of_life(&self) -> FruitOfLife;
}
```

## Sacred Mathematics

### `GoldenRatio`

Constants and functions for φ (phi).

```rust
pub struct GoldenRatio;

impl GoldenRatio {
    pub const PHI: f32 = 1.618033988749895;
    pub const INVERSE_PHI: f32 = 0.618033988749895;
    
    pub fn fibonacci(n: u32) -> u64;
    
    pub fn golden_spiral(angle: f32) -> Point2;
    
    pub fn golden_rectangle(width: f32) -> Rectangle;
    
    pub fn is_golden_ratio(a: f32, b: f32, tolerance: f32) -> bool;
}
```

### `SacredNumbers`

Important numbers in sacred geometry.

```rust
pub mod SacredNumbers {
    pub const PI: f64 = 3.141592653589793;
    pub const TAU: f64 = 6.283185307179586;
    pub const E: f64 = 2.718281828459045;
    pub const PHI: f64 = 1.618033988749895;
    pub const SQRT_2: f64 = 1.414213562373095;
    pub const SQRT_3: f64 = 1.732050807568877;
    pub const SQRT_5: f64 = 2.236067977499790;
    
    // Sacred frequencies (Hz)
    pub const UT: f32 = 396.0;  // Liberation from fear
    pub const RE: f32 = 417.0;  // Undoing situations
    pub const MI: f32 = 528.0;  // Love frequency
    pub const FA: f32 = 639.0;  // Connecting relationships
    pub const SOL: f32 = 741.0; // Awakening intuition
    pub const LA: f32 = 852.0;  // Returning to spiritual order
}
```

### `SacredProportion`

Analyze and create sacred proportions.

```rust
pub struct SacredProportion {
    ratio: f32,
    name: String,
    tolerance: f32,
}

impl SacredProportion {
    pub fn golden() -> Self;
    pub fn silver() -> Self;
    pub fn bronze() -> Self;
    
    pub fn check(&self, a: f32, b: f32) -> bool;
    
    pub fn find_in_pattern(pattern: &PatternElements) -> Vec<SacredProportion>;
}
```

## Pattern Animation

### `SacredAnimation`

Animate sacred patterns with consciousness-aware motion.

```rust
pub struct SacredAnimation {
    pattern: Box<dyn SacredPattern>,
    animation_type: AnimationType,
    coherence_modulation: bool,
}

pub enum AnimationType {
    Rotation { axis: Vec3, speed: f32 },
    Pulsation { frequency: f32, amplitude: f32 },
    Spiral { inward: bool, rate: f32 },
    Breathing { inhale_time: f32, exhale_time: f32 },
    Emergence { complexity_rate: f32 },
    Toroidal { flow_speed: f32 },
}

impl SacredAnimation {
    pub fn update(&mut self, dt: f32, coherence: f32);
    
    pub fn get_transform(&self) -> Transform;
    
    pub fn sync_with_heart(&mut self, heart_rate: f32);
}
```

## Field Effects

### `PatternField`

How sacred patterns affect the consciousness field.

```rust
pub struct PatternField {
    pattern: Box<dyn SacredPattern>,
    field_strength: f32,
    influence_radius: f32,
    harmonic_cascade: bool,
}

impl PatternField {
    pub fn influence_at(&self, point: Point3) -> FieldInfluence;
    
    pub fn coherence_boost(&self, distance: f32) -> f32;
    
    pub fn harmonic_nodes(&self) -> Vec<Point3>;
    
    pub fn interference_pattern(&self, other: &PatternField) 
        -> InterferencePattern;
}
```

### `HarmonicResonance`

Calculate harmonic relationships between patterns.

```rust
pub struct HarmonicResonance {
    base_frequency: f32,
    harmonics: Vec<f32>,
    phase_relationships: Vec<f32>,
}

impl HarmonicResonance {
    pub fn between_patterns(p1: &dyn SacredPattern, p2: &dyn SacredPattern) 
        -> Self;
    
    pub fn resonance_strength(&self) -> f32;
    
    pub fn optimal_phase_lock(&self) -> f32;
    
    pub fn create_harmony(&self) -> HarmonicField;
}
```

## Sacred Rendering

### `SacredRenderer`

WebGPU-based renderer for sacred patterns.

```rust
pub struct SacredRenderer {
    device: Device,
    queue: Queue,
    pipeline: RenderPipeline,
    coherence_buffer: Buffer,
}

impl SacredRenderer {
    pub fn new(device: &Device) -> Self;
    
    pub fn render_pattern(
        &mut self,
        pattern: &dyn SacredPattern,
        pass: &mut RenderPass,
        coherence: f32,
    );
    
    pub fn set_sacred_shader(&mut self, shader: SacredShader);
    
    pub fn enable_coherence_glow(&mut self, enabled: bool);
}
```

### `SacredShader`

Shader programs for sacred geometry.

```rust
pub enum SacredShader {
    GoldenGlow,
    CoherencePulse,
    CrystallineStructure,
    PlasmaField,
    QuantumInterference,
    AuricEmanation,
}

impl SacredShader {
    pub fn wgsl_source(&self) -> &'static str;
    
    pub fn uniform_bindings(&self) -> Vec<UniformBinding>;
}
```

## Pattern Recognition

### `SacredPatternDetector`

Detect sacred patterns in data or images.

```rust
pub struct SacredPatternDetector {
    sensitivity: f32,
    pattern_library: Vec<Box<dyn SacredPattern>>,
}

impl SacredPatternDetector {
    pub fn detect_in_image(&self, image: &Image) -> Vec<DetectedPattern>;
    
    pub fn detect_in_data(&self, data: &[f32]) -> Vec<DetectedPattern>;
    
    pub fn detect_in_field(&self, field: &ConsciousnessField) 
        -> Vec<DetectedPattern>;
}

pub struct DetectedPattern {
    pub pattern_type: String,
    pub confidence: f32,
    pub location: Point3,
    pub scale: f32,
    pub orientation: Quaternion,
}
```

## Examples

### Creating an Animated Flower of Life

```rust
use luminous_os::sacred::*;

fn create_animated_flower() -> Result<()> {
    let mut flower = FlowerOfLifeGenerator::new()
        .with_rings(7)
        .sacred_proportion(true)
        .generate();
    
    let mut animation = SacredAnimation::new(flower)
        .animation_type(AnimationType::Breathing {
            inhale_time: 4.0,
            exhale_time: 6.0,
        })
        .coherence_modulation(true);
    
    // In render loop
    loop {
        let coherence = get_current_coherence();
        animation.update(dt, coherence);
        
        let transform = animation.get_transform();
        render_pattern_with_transform(&flower, transform);
    }
}
```

### Sacred Pattern Field Effect

```rust
fn create_healing_field() -> Result<()> {
    // Create Sri Yantra at room center
    let sri_yantra = SriYantraGenerator::traditional()
        .with_mantra("Om Mani Padme Hum")
        .generate();
    
    // Create pattern field
    let field = PatternField::new(sri_yantra)
        .field_strength(0.8)
        .influence_radius(10.0) // meters
        .harmonic_cascade(true);
    
    // Check influence at a point
    let point = Point3::new(2.0, 0.0, 1.5);
    let influence = field.influence_at(point);
    
    println!("Coherence boost at point: {:.2}", influence.coherence_boost);
    println!("Harmonic frequencies: {:?}", influence.harmonics);
    
    Ok(())
}
```

### Platonic Solid Meditation

```rust
fn platonic_meditation_sequence() -> Result<()> {
    let solids = [
        PlatonicType::Tetrahedron,
        PlatonicType::Cube,
        PlatonicType::Octahedron,
        PlatonicType::Dodecahedron,
        PlatonicType::Icosahedron,
    ];
    
    for (i, solid_type) in solids.iter().enumerate() {
        let solid = PlatonicSolid::new(*solid_type)
            .scale(1.0 + i as f32 * 0.2)
            .rotation_speed(0.1);
        
        println!("Meditating on {} - Element: {:?}", 
                 solid.name(), solid.element());
        
        // Emanate solid's frequency
        let frequency = solid.harmonic_frequency();
        emit_frequency(frequency, Duration::from_secs(60));
        
        // Pause between solids
        sacred_pause(Duration::from_secs(30));
    }
    
    Ok(())
}
```

### Golden Spiral Heart Coherence

```rust
fn golden_spiral_breathing() -> Result<()> {
    let mut spiral = GoldenSpiral::new()
        .rotations(5.0)
        .growth_rate(GoldenRatio::PHI);
    
    let heart_monitor = HeartMonitor::connect().await?;
    
    loop {
        let heart_rate = heart_monitor.current_rate().await?;
        
        // Sync spiral to heart
        spiral.pulse_with_heart(heart_rate);
        
        // Calculate point on spiral based on breath phase
        let breath_phase = get_breath_phase(); // 0.0 to 1.0
        let point = spiral.point_at(breath_phase * TAU);
        
        // Guide breathing with spiral
        show_breathing_guide(point);
        
        // Check for golden ratio in heart rhythm
        if heart_monitor.has_golden_rhythm() {
            celebrate_coherence();
        }
    }
}
```

## Constants

```rust
pub mod constants {
    // Sacred angles (radians)
    pub const GOLDEN_ANGLE: f32 = 2.39996322972865;  // 137.5°
    pub const PENTAGON_ANGLE: f32 = 1.25663706144;   // 72°
    pub const HEXAGON_ANGLE: f32 = 1.0471975512;     // 60°
    
    // Sacred ratios
    pub const PHI: f32 = 1.618033988749895;
    pub const SILVER_RATIO: f32 = 2.414213562373095;
    pub const BRONZE_RATIO: f32 = 3.302775637731995;
    
    // Vesica Piscis
    pub const VESICA_RATIO: f32 = 1.732050807568877; // √3
    pub const VESICA_ANGLE: f32 = 1.0471975512;      // 60°
}
```

## See Also

- [Consciousness API](consciousness.md) - Field effects and coherence
- [Visualization API](visualization.md) - Rendering sacred patterns
- [Sacred Geometry Guide](../guides/sacred-geometry.md) - Deep dive into patterns
- [Pattern Library](../patterns/index.md) - Pre-built sacred patterns