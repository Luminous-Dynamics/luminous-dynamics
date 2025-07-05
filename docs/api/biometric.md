# Biometric API Reference

The biometric module provides interfaces for integrating heart rate variability (HRV), EEG, and other biometric sensors to create embodied consciousness experiences.

## Core Types

### `HeartSensor`

Base trait for all heart rate monitoring devices.

```rust
pub trait HeartSensor: Send + Sync {
    async fn connect(&mut self) -> Result<()>;
    async fn disconnect(&mut self) -> Result<()>;
    async fn start_streaming(&mut self) -> Result<BiometricStream>;
    async fn get_current_reading(&self) -> Result<HeartReading>;
    fn name(&self) -> &str;
    fn sample_rate(&self) -> u32;
}
```

### `HeartReading`

Single heart measurement containing R-R interval and computed metrics.

```rust
pub struct HeartReading {
    pub timestamp: Instant,
    pub rr_interval: f32,        // milliseconds
    pub heart_rate: f32,         // bpm
    pub confidence: f32,         // 0.0 - 1.0
    pub raw_signal: Option<Vec<f32>>,
}
```

### `HRVMetrics`

Comprehensive HRV analysis results.

```rust
pub struct HRVMetrics {
    // Time domain
    pub rmssd: f32,              // Root mean square of successive differences
    pub sdnn: f32,               // Standard deviation of NN intervals
    pub pnn50: f32,              // Percentage of successive differences > 50ms
    
    // Frequency domain
    pub vlf_power: f32,          // Very low frequency (0.003-0.04 Hz)
    pub lf_power: f32,           // Low frequency (0.04-0.15 Hz)
    pub hf_power: f32,           // High frequency (0.15-0.4 Hz)
    pub lf_hf_ratio: f32,        // Autonomic balance indicator
    pub total_power: f32,        // Total spectral power
    
    // Coherence
    pub coherence_score: f32,    // 0.0 - 1.0
    pub coherence_ratio: f32,    // Peak power / total power
    pub peak_frequency: f32,     // Dominant frequency in Hz
}
```

### `CoherenceCalculator`

Implements various coherence algorithms.

```rust
pub struct CoherenceCalculator {
    algorithm: CoherenceAlgorithm,
    buffer_size: usize,
    rr_buffer: VecDeque<f32>,
    power_spectrum: PowerSpectrum,
}

pub enum CoherenceAlgorithm {
    HeartMath,           // Official HeartMath algorithm
    McCraty,            // McCraty's coherence ratio
    SacredGeometry,     // LuminousOS sacred pattern detection
    Hybrid,             // Combination of all methods
}
```

## Device Implementations

### HeartMath Devices

```rust
pub struct HeartMathSensor {
    device_type: HeartMathDevice,
    connection: BluetoothConnection,
}

pub enum HeartMathDevice {
    EmWavePro,
    InnerBalance,
    EmWave2,
}

// Usage
let sensor = HeartMathSensor::discover().await?;
sensor.connect().await?;
let stream = sensor.start_streaming().await?;
```

### Polar H10

```rust
pub struct PolarH10 {
    device_id: String,
    connection: BleConnection,
}

impl PolarH10 {
    pub async fn discover_devices() -> Result<Vec<PolarH10>>;
    pub async fn connect_by_id(device_id: &str) -> Result<Self>;
}
```

### Muse EEG

```rust
pub struct MuseDevice {
    model: MuseModel,
    connection: BleConnection,
}

pub enum MuseModel {
    Muse2,
    MuseS,
    Muse2016,
}

impl MuseDevice {
    pub async fn stream_eeg(&mut self) -> Result<EEGStream>;
    pub async fn get_meditation_score(&self) -> Result<f32>;
}
```

## Coherence Analysis

### `HRVAnalyzer`

Real-time HRV analysis engine.

```rust
pub struct HRVAnalyzer {
    window_size: Duration,
    overlap: f32,
    artifact_filter: ArtifactFilter,
    baseline: Option<PersonalBaseline>,
}

impl HRVAnalyzer {
    pub fn new() -> Self;
    
    pub fn add_beat(&mut self, rr_interval: f32) -> HRVMetrics;
    
    pub fn add_batch(&mut self, rr_intervals: &[f32]) -> HRVMetrics;
    
    pub fn reset(&mut self);
    
    pub fn set_baseline(&mut self, baseline: PersonalBaseline);
}
```

### `PowerSpectrum`

Frequency domain analysis for coherence detection.

```rust
pub struct PowerSpectrum {
    fft_size: usize,
    window_type: WindowType,
    frequencies: Vec<f32>,
    power: Vec<f32>,
}

impl PowerSpectrum {
    pub fn compute(&mut self, rr_intervals: &[f32]) -> Result<()>;
    
    pub fn coherence_peak(&self) -> Option<(f32, f32)>; // (frequency, power)
    
    pub fn band_power(&self, low_freq: f32, high_freq: f32) -> f32;
    
    pub fn visualize(&self) -> SpectrumVisualization;
}
```

## Biometric Streams

### `BiometricStream`

Async stream of biometric readings.

```rust
pub struct BiometricStream {
    receiver: Receiver<BiometricReading>,
    stream_type: BiometricType,
}

impl Stream for BiometricStream {
    type Item = BiometricReading;
    
    fn poll_next(self: Pin<&mut Self>, cx: &mut Context<'_>) 
        -> Poll<Option<Self::Item>>;
}

// Usage with async
while let Some(reading) = stream.next().await {
    match reading {
        BiometricReading::Heart(heart) => process_heart(heart),
        BiometricReading::EEG(eeg) => process_eeg(eeg),
        BiometricReading::Breath(breath) => process_breath(breath),
    }
}
```

## Multi-Modal Integration

### `BiometricFusion`

Combines multiple biometric sources.

```rust
pub struct BiometricFusion {
    sources: Vec<Box<dyn BiometricSource>>,
    fusion_algorithm: FusionAlgorithm,
    weights: HashMap<BiometricType, f32>,
}

impl BiometricFusion {
    pub async fn unified_coherence(&mut self) -> Result<UnifiedCoherence> {
        let readings = self.collect_all_readings().await?;
        self.fusion_algorithm.fuse(readings, &self.weights)
    }
}

pub struct UnifiedCoherence {
    pub overall: f32,
    pub heart: f32,
    pub brain: f32,
    pub breath: f32,
    pub nervous_system: NervousSystemState,
}
```

### `NervousSystemState`

```rust
pub enum NervousSystemState {
    Sympathetic { arousal: f32 },
    Parasympathetic { relaxation: f32 },
    Balanced { coherence: f32 },
    Transitioning { from: Box<NervousSystemState>, to: Box<NervousSystemState>, progress: f32 },
}
```

## Breathing Integration

### `BreathSensor`

```rust
pub trait BreathSensor {
    async fn measure_breath_rate(&self) -> Result<f32>;
    async fn measure_breath_coherence(&self) -> Result<f32>;
    async fn get_breath_pattern(&self) -> Result<BreathPattern>;
}

pub struct BreathPattern {
    pub inhale_duration: Duration,
    pub exhale_duration: Duration,
    pub pause_duration: Option<Duration>,
    pub coherence: f32,
}
```

## Coherence Training

### `CoherenceTrainer`

Interactive coherence training system.

```rust
pub struct CoherenceTrainer {
    target_coherence: f32,
    training_protocol: TrainingProtocol,
    feedback_engine: FeedbackEngine,
    progress_tracker: ProgressTracker,
}

pub enum TrainingProtocol {
    QuickCoherence,          // HeartMath Quick Coherence
    HeartFocusedBreathing,   // Basic HRV biofeedback
    ResonantBreathing,       // Finding personal resonant frequency
    SacredRhythm,           // LuminousOS sacred pattern training
}

impl CoherenceTrainer {
    pub async fn start_session(&mut self, duration: Duration) -> Result<()>;
    
    pub fn on_biometric_update(&mut self, reading: BiometricReading);
    
    pub fn get_feedback(&self) -> CoherenceFeedback;
    
    pub async fn end_session(&mut self) -> TrainingReport;
}
```

### `CoherenceFeedback`

Real-time feedback for coherence training.

```rust
pub struct CoherenceFeedback {
    pub current_coherence: f32,
    pub trend: CoherenceTrend,
    pub suggestion: String,
    pub visual_guide: VisualGuide,
    pub audio_cue: Option<AudioCue>,
}

pub enum CoherenceTrend {
    Increasing { rate: f32 },
    Stable,
    Decreasing { rate: f32 },
}

pub enum VisualGuide {
    ExpandingCircle { rate: f32, color: Color },
    BreathingBall { inhale_time: f32, exhale_time: f32 },
    HeartMandala { coherence_glow: f32 },
    SacredGeometry { pattern: SacredPattern, animation_speed: f32 },
}
```

## Personal Baselines

### `PersonalBaseline`

Individual coherence baseline for personalized feedback.

```rust
pub struct PersonalBaseline {
    pub user_id: UserId,
    pub resting_heart_rate: f32,
    pub average_hrv: HRVMetrics,
    pub coherence_distribution: Distribution,
    pub optimal_breathing_rate: f32,
    pub sacred_rhythm: Option<SacredRhythm>,
}

impl PersonalBaseline {
    pub async fn calibrate(sensor: &mut dyn HeartSensor, duration: Duration) 
        -> Result<Self>;
    
    pub fn normalize_coherence(&self, raw_coherence: f32) -> f32;
    
    pub fn is_coherent(&self, metrics: &HRVMetrics) -> bool;
}
```

## Error Handling

### `BiometricError`

```rust
pub enum BiometricError {
    DeviceNotFound { device_type: String },
    ConnectionLost { reason: String },
    ArtifactDetected { confidence: f32 },
    InsufficientData { required: usize, available: usize },
    CalibrationRequired,
}
```

## Constants

```rust
pub const COHERENT_BREATHING_RATE: f32 = 5.0;  // breaths per minute
pub const RESONANT_FREQUENCY: f32 = 0.1;       // Hz (6 breaths/min)
pub const MIN_RR_INTERVAL: f32 = 300.0;        // ms (200 bpm)
pub const MAX_RR_INTERVAL: f32 = 2000.0;       // ms (30 bpm)
pub const ARTIFACT_THRESHOLD: f32 = 0.20;      // 20% change threshold
```

## Examples

### Basic Heart Coherence Monitoring

```rust
use luminous_os::biometric::*;

async fn monitor_coherence() -> Result<()> {
    // Discover and connect to heart sensor
    let mut sensor = HeartSensor::discover_any().await?;
    sensor.connect().await?;
    
    // Create analyzer
    let mut analyzer = HRVAnalyzer::new()
        .window_size(Duration::from_secs(30))
        .artifact_filter(ArtifactFilter::Adaptive);
    
    // Start streaming
    let mut stream = sensor.start_streaming().await?;
    
    while let Some(reading) = stream.next().await {
        let metrics = analyzer.add_beat(reading.rr_interval);
        
        println!("Coherence: {:.2} | HRV: {:.1}ms", 
                 metrics.coherence_score, 
                 metrics.rmssd);
        
        // Update consciousness field
        Field::current().set_coherence(metrics.coherence_score);
    }
    
    Ok(())
}
```

### Multi-Modal Coherence

```rust
async fn unified_coherence_monitoring() -> Result<()> {
    let heart = HeartMathSensor::connect().await?;
    let eeg = MuseDevice::connect().await?;
    let breath = BreathSensor::connect().await?;
    
    let mut fusion = BiometricFusion::new()
        .add_source(heart)
        .add_source(eeg)
        .add_source(breath)
        .algorithm(FusionAlgorithm::WeightedHarmonic)
        .weight(BiometricType::Heart, 0.5)
        .weight(BiometricType::EEG, 0.3)
        .weight(BiometricType::Breath, 0.2);
    
    loop {
        let unified = fusion.unified_coherence().await?;
        
        println!("Unified Coherence: {:.2}", unified.overall);
        println!("  Heart: {:.2}", unified.heart);
        println!("  Brain: {:.2}", unified.brain);
        println!("  Breath: {:.2}", unified.breath);
        
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
}
```

### Coherence Training Session

```rust
async fn coherence_training() -> Result<()> {
    let sensor = HeartSensor::connect_any().await?;
    
    let mut trainer = CoherenceTrainer::new()
        .protocol(TrainingProtocol::HeartFocusedBreathing)
        .target_coherence(0.7)
        .with_visual_feedback()
        .with_audio_guidance();
    
    // Calibrate personal baseline
    println!("Calibrating baseline...");
    let baseline = PersonalBaseline::calibrate(&mut sensor, Duration::from_secs(60)).await?;
    trainer.set_baseline(baseline);
    
    // Start training session
    trainer.start_session(Duration::from_mins(10)).await?;
    
    let mut stream = sensor.start_streaming().await?;
    
    while let Some(reading) = stream.next().await {
        trainer.on_biometric_update(BiometricReading::Heart(reading));
        
        let feedback = trainer.get_feedback();
        render_feedback(feedback);
        
        if trainer.session_complete() {
            break;
        }
    }
    
    let report = trainer.end_session().await;
    println!("Session Report: {:?}", report);
    
    Ok(())
}
```

## See Also

- [Consciousness API](consciousness.md) - Core consciousness types
- [Hardware Integration](../hardware/sensors.md) - Low-level sensor details
- [Coherence Training Guide](../guides/coherence-training.md) - Training protocols
- [Biometric Privacy](../privacy/biometric-data.md) - Data handling guidelines