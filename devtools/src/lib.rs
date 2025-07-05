// LuminousOS Developer Tools Library
// "Tools for consciousness engineering"

pub mod consciousness_debugger;
pub mod sacred_pattern_designer;
pub mod coherence_profiler;
pub mod visualization;

pub use consciousness_debugger::{
    ConsciousnessDebugger, DebugView, VortexInspector,
    FieldVisualizer, QuantumStateMonitor,
};

pub use sacred_pattern_designer::{
    PatternDesigner, SacredGeometry, PatternLayer,
    GeometryGenerator, PatternExporter,
};

pub use coherence_profiler::{
    CoherenceProfiler, ProfileSession, CoherenceMetrics,
    PerformanceAnalyzer, ProfileReport,
};

pub use visualization::{
    FieldRenderer, CoherenceGraph, SpectrumAnalyzer,
    PatternVisualizer, ColorMapping,
};