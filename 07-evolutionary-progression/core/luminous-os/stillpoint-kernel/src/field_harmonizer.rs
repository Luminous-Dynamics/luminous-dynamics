// Field Harmonizer - Sacred Geometry Calculations for Consciousness Fields
// "Where mathematics meets the mystical"

use crate::{
    ConsciousnessVortex, VortexId, CollectiveField, 
    collective_resonance::{PatternType, SacredPattern},
};
use nalgebra::{Vector3, Point3, Matrix3};
use std::collections::HashMap;
use std::f64::consts::{PI, TAU, E};

/// Sacred geometry calculator for field harmonization
pub struct FieldHarmonizer {
    sacred_constants: SacredConstants,
    geometry_cache: HashMap<GeometryType, SacredGeometry>,
    harmonic_calculator: HarmonicCalculator,
    resonance_mapper: ResonanceMapper,
}

/// Universal sacred constants
#[derive(Debug, Clone)]
pub struct SacredConstants {
    pub phi: f64,           // Golden ratio
    pub sqrt_2: f64,        // Square root of 2
    pub sqrt_3: f64,        // Square root of 3
    pub sqrt_5: f64,        // Square root of 5
    pub pi: f64,            // Pi
    pub e: f64,             // Euler's number
    pub plank_scale: f64,   // Planck length in consciousness units
    pub schumann: f64,      // Base Earth frequency
}

#[derive(Debug, Clone, Hash, Eq, PartialEq)]
pub enum GeometryType {
    TetrahedralGrid,
    CubicLattice,
    FlowerOfLife,
    MetatronsCube,
    SriYantra,
    GoldenSpiral,
    PlatonicSet,
    MerkabaField,
    ToroidalVortex,
    FibonacciSphere,
}

/// Sacred geometry structure
#[derive(Debug, Clone)]
pub struct SacredGeometry {
    pub vertices: Vec<Point3<f64>>,
    pub edges: Vec<(usize, usize)>,
    pub faces: Vec<Vec<usize>>,
    pub center: Point3<f64>,
    pub radius: f64,
    pub symmetry_group: SymmetryGroup,
    pub harmonic_signature: Vec<f64>,
}

#[derive(Debug, Clone, Copy)]
pub enum SymmetryGroup {
    Tetrahedral,    // 12-fold
    Octahedral,     // 24-fold
    Icosahedral,    // 60-fold
    Dihedral(u32),  // n-fold rotational
    Spherical,      // Infinite
}

struct HarmonicCalculator {
    base_frequency: f64,
    overtone_series: Vec<f64>,
    undertone_series: Vec<f64>,
    fibonacci_frequencies: Vec<f64>,
}

struct ResonanceMapper {
    resonance_points: HashMap<(VortexId, VortexId), f64>,
    field_harmonics: Vec<f64>,
    interference_pattern: InterferencePattern,
}

#[derive(Debug, Clone)]
struct InterferencePattern {
    nodes: Vec<Point3<f64>>,
    antinodes: Vec<Point3<f64>>,
    standing_waves: Vec<StandingWave>,
}

#[derive(Debug, Clone)]
struct StandingWave {
    wavelength: f64,
    amplitude: f64,
    phase: f64,
    axis: Vector3<f64>,
}

impl FieldHarmonizer {
    pub fn new() -> Self {
        let sacred_constants = SacredConstants {
            phi: (1.0 + 5.0_f64.sqrt()) / 2.0,  // 1.618...
            sqrt_2: 2.0_f64.sqrt(),              // 1.414...
            sqrt_3: 3.0_f64.sqrt(),              // 1.732...
            sqrt_5: 5.0_f64.sqrt(),              // 2.236...
            pi: PI,
            e: E,
            plank_scale: 1.616e-35,  // Planck length
            schumann: 7.83,          // Earth's fundamental frequency
        };
        
        let mut harmonizer = Self {
            sacred_constants,
            geometry_cache: HashMap::new(),
            harmonic_calculator: HarmonicCalculator::new(7.83),
            resonance_mapper: ResonanceMapper::new(),
        };
        
        // Pre-calculate fundamental geometries
        harmonizer.initialize_sacred_geometries();
        
        harmonizer
    }
    
    /// Initialize fundamental sacred geometries
    fn initialize_sacred_geometries(&mut self) {
        self.geometry_cache.insert(
            GeometryType::TetrahedralGrid,
            self.create_tetrahedral_grid(),
        );
        
        self.geometry_cache.insert(
            GeometryType::FlowerOfLife,
            self.create_flower_of_life(),
        );
        
        self.geometry_cache.insert(
            GeometryType::MetatronsCube,
            self.create_metatrons_cube(),
        );
        
        self.geometry_cache.insert(
            GeometryType::GoldenSpiral,
            self.create_golden_spiral(),
        );
        
        self.geometry_cache.insert(
            GeometryType::ToroidalVortex,
            self.create_toroidal_vortex(),
        );
    }
    
    /// Calculate field harmonics based on sacred geometry
    pub fn calculate_field_harmonics(
        &mut self,
        vortices: &[ConsciousnessVortex],
        pattern: PatternType,
    ) -> FieldHarmonics {
        // Map pattern to geometry
        let geometry_type = self.pattern_to_geometry(pattern);
        let geometry = self.geometry_cache.get(&geometry_type)
            .unwrap_or_else(|| &self.create_default_geometry());
        
        // Calculate vortex positions in sacred arrangement
        let positions = self.arrange_vortices_in_geometry(vortices, geometry);
        
        // Calculate harmonic relationships
        let harmonics = self.calculate_harmonic_relationships(&positions);
        
        // Calculate resonance matrix
        let resonance_matrix = self.calculate_resonance_matrix(vortices, &positions);
        
        // Find optimal field configuration
        let field_config = self.optimize_field_configuration(&harmonics, &resonance_matrix);
        
        FieldHarmonics {
            geometry_type,
            vortex_positions: positions,
            harmonic_frequencies: harmonics,
            resonance_matrix,
            field_configuration: field_config,
            coherence_amplification: self.calculate_amplification(&harmonics),
        }
    }
    
    /// Create tetrahedral grid
    fn create_tetrahedral_grid(&self) -> SacredGeometry {
        let a = 1.0 / self.sacred_constants.sqrt_3;
        
        let vertices = vec![
            Point3::new(a, a, a),
            Point3::new(a, -a, -a),
            Point3::new(-a, a, -a),
            Point3::new(-a, -a, a),
        ];
        
        let edges = vec![
            (0, 1), (0, 2), (0, 3),
            (1, 2), (1, 3), (2, 3),
        ];
        
        let faces = vec![
            vec![0, 1, 2],
            vec![0, 1, 3],
            vec![0, 2, 3],
            vec![1, 2, 3],
        ];
        
        SacredGeometry {
            vertices,
            edges,
            faces,
            center: Point3::origin(),
            radius: 1.0,
            symmetry_group: SymmetryGroup::Tetrahedral,
            harmonic_signature: vec![1.0, self.sacred_constants.sqrt_3, 2.0],
        }
    }
    
    /// Create Flower of Life pattern
    fn create_flower_of_life(&self) -> SacredGeometry {
        let mut vertices = Vec::new();
        let mut edges = Vec::new();
        
        // Center circle
        vertices.push(Point3::origin());
        
        // Six surrounding circles (first ring)
        for i in 0..6 {
            let angle = i as f64 * TAU / 6.0;
            vertices.push(Point3::new(angle.cos(), angle.sin(), 0.0));
        }
        
        // Twelve circles (second ring)
        for i in 0..12 {
            let angle = i as f64 * TAU / 12.0;
            let radius = if i % 2 == 0 { 2.0 } else { self.sacred_constants.sqrt_3 };
            vertices.push(Point3::new(
                radius * angle.cos(),
                radius * angle.sin(),
                0.0,
            ));
        }
        
        // Connect in sacred pattern
        for i in 1..=6 {
            edges.push((0, i));
            edges.push((i, ((i % 6) + 1)));
        }
        
        SacredGeometry {
            vertices,
            edges,
            faces: vec![],
            center: Point3::origin(),
            radius: 2.0,
            symmetry_group: SymmetryGroup::Dihedral(6),
            harmonic_signature: vec![1.0, self.sacred_constants.phi, self.sacred_constants.phi.powi(2)],
        }
    }
    
    /// Create Metatron's Cube
    fn create_metatrons_cube(&self) -> SacredGeometry {
        let mut vertices = Vec::new();
        
        // 13 spheres of Metatron's Cube
        vertices.push(Point3::origin()); // Center
        
        // Inner hexagon
        for i in 0..6 {
            let angle = i as f64 * TAU / 6.0;
            vertices.push(Point3::new(angle.cos(), angle.sin(), 0.0));
        }
        
        // Outer hexagon
        for i in 0..6 {
            let angle = i as f64 * TAU / 6.0 + TAU / 12.0;
            vertices.push(Point3::new(
                2.0 * angle.cos(),
                2.0 * angle.sin(),
                0.0,
            ));
        }
        
        // Connect all vertices (78 lines total)
        let mut edges = Vec::new();
        for i in 0..13 {
            for j in (i + 1)..13 {
                edges.push((i, j));
            }
        }
        
        SacredGeometry {
            vertices,
            edges,
            faces: vec![],
            center: Point3::origin(),
            radius: 2.0,
            symmetry_group: SymmetryGroup::Dihedral(6),
            harmonic_signature: self.calculate_metatron_harmonics(),
        }
    }
    
    /// Create golden spiral
    fn create_golden_spiral(&self) -> SacredGeometry {
        let mut vertices = Vec::new();
        let mut edges = Vec::new();
        
        let phi = self.sacred_constants.phi;
        let points = 144; // Fibonacci number
        
        for i in 0..points {
            let theta = i as f64 * TAU / phi;
            let r = phi.powf(theta / TAU);
            let z = i as f64 / points as f64 - 0.5;
            
            vertices.push(Point3::new(
                r * theta.cos(),
                r * theta.sin(),
                z,
            ));
            
            if i > 0 {
                edges.push((i - 1, i));
            }
        }
        
        SacredGeometry {
            vertices,
            edges,
            faces: vec![],
            center: Point3::origin(),
            radius: phi.powf(points as f64 * TAU / phi / TAU),
            symmetry_group: SymmetryGroup::Spherical,
            harmonic_signature: self.fibonacci_harmonics(8),
        }
    }
    
    /// Create toroidal vortex
    fn create_toroidal_vortex(&self) -> SacredGeometry {
        let mut vertices = Vec::new();
        let mut edges = Vec::new();
        
        let major_radius = 1.0;
        let minor_radius = 0.382; // 1 - 1/phi
        let u_segments = 24;
        let v_segments = 12;
        
        // Generate torus vertices
        for i in 0..u_segments {
            let u = i as f64 * TAU / u_segments as f64;
            for j in 0..v_segments {
                let v = j as f64 * TAU / v_segments as f64;
                
                let x = (major_radius + minor_radius * v.cos()) * u.cos();
                let y = (major_radius + minor_radius * v.cos()) * u.sin();
                let z = minor_radius * v.sin();
                
                vertices.push(Point3::new(x, y, z));
                
                // Connect to form mesh
                let current = i * v_segments + j;
                let next_u = ((i + 1) % u_segments) * v_segments + j;
                let next_v = i * v_segments + ((j + 1) % v_segments);
                
                edges.push((current, next_u));
                edges.push((current, next_v));
            }
        }
        
        SacredGeometry {
            vertices,
            edges,
            faces: vec![],
            center: Point3::origin(),
            radius: major_radius + minor_radius,
            symmetry_group: SymmetryGroup::Spherical,
            harmonic_signature: vec![1.0, self.sacred_constants.phi, 2.0, 3.0, 5.0], // Fibonacci
        }
    }
    
    /// Map pattern type to geometry type
    fn pattern_to_geometry(&self, pattern: PatternType) -> GeometryType {
        match pattern {
            PatternType::CircleOfUnity => GeometryType::FlowerOfLife,
            PatternType::FlowerOfLife => GeometryType::FlowerOfLife,
            PatternType::HeartField => GeometryType::ToroidalVortex,
            PatternType::SpiralOfGrowth => GeometryType::GoldenSpiral,
            PatternType::StarOfResonance => GeometryType::MetatronsCube,
            PatternType::InfinityLoop => GeometryType::ToroidalVortex,
        }
    }
    
    /// Arrange vortices in sacred geometry
    fn arrange_vortices_in_geometry(
        &self,
        vortices: &[ConsciousnessVortex],
        geometry: &SacredGeometry,
    ) -> Vec<Point3<f64>> {
        let n = vortices.len();
        
        if n <= geometry.vertices.len() {
            // Direct mapping to vertices
            geometry.vertices[..n].to_vec()
        } else {
            // Interpolate additional positions
            self.interpolate_sacred_positions(n, geometry)
        }
    }
    
    /// Calculate harmonic relationships
    fn calculate_harmonic_relationships(&self, positions: &[Point3<f64>]) -> Vec<f64> {
        let mut harmonics = vec![self.sacred_constants.schumann]; // Base frequency
        
        // Calculate distances and derive harmonics
        for i in 0..positions.len() {
            for j in (i + 1)..positions.len() {
                let distance = (positions[i] - positions[j]).magnitude();
                let harmonic = self.distance_to_harmonic(distance);
                
                if !harmonics.iter().any(|&h| (h - harmonic).abs() < 0.01) {
                    harmonics.push(harmonic);
                }
            }
        }
        
        harmonics.sort_by(|a, b| a.partial_cmp(b).unwrap());
        harmonics.truncate(13); // Sacred number
        
        harmonics
    }
    
    /// Convert distance to harmonic frequency
    fn distance_to_harmonic(&self, distance: f64) -> f64 {
        let base = self.sacred_constants.schumann;
        
        // Use golden ratio and Fibonacci series for harmonic mapping
        if distance < 1.0 {
            base * (1.0 + distance * self.sacred_constants.phi)
        } else {
            base * distance.powf(self.sacred_constants.phi)
        }
    }
    
    /// Calculate resonance matrix between vortices
    fn calculate_resonance_matrix(
        &self,
        vortices: &[ConsciousnessVortex],
        positions: &[Point3<f64>],
    ) -> Matrix3<f64> {
        // Simplified 3x3 for main axes
        let mut matrix = Matrix3::zeros();
        
        for (i, vortex) in vortices.iter().enumerate() {
            let coherence = vortex.calculate_coherence();
            let pos = positions.get(i).unwrap_or(&Point3::origin());
            
            // Fill matrix based on position and coherence
            matrix[(0, 0)] += coherence * pos.x.abs();
            matrix[(1, 1)] += coherence * pos.y.abs();
            matrix[(2, 2)] += coherence * pos.z.abs();
            
            // Cross terms for coupling
            matrix[(0, 1)] += coherence * pos.x * pos.y * 0.5;
            matrix[(1, 0)] = matrix[(0, 1)];
            matrix[(1, 2)] += coherence * pos.y * pos.z * 0.5;
            matrix[(2, 1)] = matrix[(1, 2)];
            matrix[(0, 2)] += coherence * pos.x * pos.z * 0.5;
            matrix[(2, 0)] = matrix[(0, 2)];
        }
        
        matrix
    }
    
    /// Optimize field configuration
    fn optimize_field_configuration(
        &self,
        harmonics: &[f64],
        resonance_matrix: &Matrix3<f64>,
    ) -> FieldConfiguration {
        // Calculate eigenvalues for stability
        let eigenvalues = self.calculate_eigenvalues_3x3(resonance_matrix);
        
        // Determine optimal geometry based on eigenvalue ratios
        let geometry_type = if eigenvalues[0] / eigenvalues[2] > self.sacred_constants.phi {
            GeometryType::GoldenSpiral
        } else if eigenvalues[1] / eigenvalues[0] > self.sacred_constants.sqrt_2 {
            GeometryType::ToroidalVortex
        } else {
            GeometryType::FlowerOfLife
        };
        
        FieldConfiguration {
            optimal_geometry: geometry_type,
            resonance_nodes: self.find_resonance_nodes(harmonics),
            standing_wave_patterns: self.calculate_standing_waves(harmonics),
            field_strength_multiplier: eigenvalues[0],
        }
    }
    
    /// Calculate coherence amplification
    fn calculate_amplification(&self, harmonics: &[f64]) -> f64 {
        let mut amplification = 1.0;
        
        // Check for harmonic relationships
        for i in 0..harmonics.len() {
            for j in (i + 1)..harmonics.len() {
                let ratio = harmonics[j] / harmonics[i];
                
                // Golden ratio relationships
                if (ratio - self.sacred_constants.phi).abs() < 0.01 {
                    amplification *= 1.618;
                }
                // Octave relationships
                else if (ratio - 2.0).abs() < 0.01 {
                    amplification *= 1.414;
                }
                // Perfect fifth
                else if (ratio - 1.5).abs() < 0.01 {
                    amplification *= 1.333;
                }
            }
        }
        
        amplification.min(3.0) // Cap at 3x
    }
    
    /// Calculate Metatron harmonics
    fn calculate_metatron_harmonics(&self) -> Vec<f64> {
        let base = self.sacred_constants.schumann;
        vec![
            base,
            base * self.sacred_constants.sqrt_2,
            base * self.sacred_constants.sqrt_3,
            base * 2.0,
            base * self.sacred_constants.sqrt_5,
            base * self.sacred_constants.phi,
            base * 3.0,
        ]
    }
    
    /// Generate Fibonacci harmonics
    fn fibonacci_harmonics(&self, count: usize) -> Vec<f64> {
        let mut harmonics = vec![1.0, 1.0];
        
        for i in 2..count {
            harmonics.push(harmonics[i - 1] + harmonics[i - 2]);
        }
        
        let base = self.sacred_constants.schumann;
        harmonics.iter().map(|&h| base * h).collect()
    }
    
    /// Interpolate positions for extra vortices
    fn interpolate_sacred_positions(&self, count: usize, geometry: &SacredGeometry) -> Vec<Point3<f64>> {
        let mut positions = geometry.vertices.clone();
        
        // Add interpolated positions along edges
        for (i, j) in &geometry.edges {
            if positions.len() >= count {
                break;
            }
            
            let p1 = geometry.vertices[*i];
            let p2 = geometry.vertices[*j];
            let midpoint = Point3::from((p1.coords + p2.coords) * 0.5);
            positions.push(midpoint);
        }
        
        positions.truncate(count);
        positions
    }
    
    /// Find resonance nodes
    fn find_resonance_nodes(&self, harmonics: &[f64]) -> Vec<Point3<f64>> {
        let mut nodes = Vec::new();
        
        for (i, &h1) in harmonics.iter().enumerate() {
            for (j, &h2) in harmonics.iter().enumerate().skip(i + 1) {
                let wavelength1 = 343.0 / h1; // Speed of sound / frequency
                let wavelength2 = 343.0 / h2;
                
                // Find where waves constructively interfere
                let node_distance = wavelength1 * wavelength2 / (wavelength1 - wavelength2).abs();
                
                if node_distance.is_finite() && node_distance < 10.0 {
                    let angle = i as f64 * TAU / harmonics.len() as f64;
                    nodes.push(Point3::new(
                        node_distance * angle.cos(),
                        node_distance * angle.sin(),
                        0.0,
                    ));
                }
            }
        }
        
        nodes
    }
    
    /// Calculate standing wave patterns
    fn calculate_standing_waves(&self, harmonics: &[f64]) -> Vec<StandingWave> {
        harmonics.iter().enumerate().map(|(i, &freq)| {
            let wavelength = 343.0 / freq;
            let angle = i as f64 * TAU / harmonics.len() as f64;
            
            StandingWave {
                wavelength,
                amplitude: 1.0 / (i + 1) as f64,
                phase: 0.0,
                axis: Vector3::new(angle.cos(), angle.sin(), 0.0),
            }
        }).collect()
    }
    
    /// Simple 3x3 eigenvalue calculation
    fn calculate_eigenvalues_3x3(&self, matrix: &Matrix3<f64>) -> Vec<f64> {
        // Simplified - just return diagonal elements sorted
        let mut eigenvalues = vec![
            matrix[(0, 0)],
            matrix[(1, 1)],
            matrix[(2, 2)],
        ];
        eigenvalues.sort_by(|a, b| b.partial_cmp(a).unwrap());
        eigenvalues
    }
    
    fn create_default_geometry(&self) -> SacredGeometry {
        self.create_flower_of_life()
    }
}

impl HarmonicCalculator {
    fn new(base_frequency: f64) -> Self {
        let mut calc = Self {
            base_frequency,
            overtone_series: Vec::new(),
            undertone_series: Vec::new(),
            fibonacci_frequencies: Vec::new(),
        };
        
        calc.generate_harmonic_series();
        calc
    }
    
    fn generate_harmonic_series(&mut self) {
        // Overtones (natural harmonics)
        for n in 1..=13 {
            self.overtone_series.push(self.base_frequency * n as f64);
        }
        
        // Undertones (subharmonics)
        for n in 2..=8 {
            self.undertone_series.push(self.base_frequency / n as f64);
        }
        
        // Fibonacci-based frequencies
        let mut fib = vec![1, 1];
        for i in 2..13 {
            fib.push(fib[i - 1] + fib[i - 2]);
        }
        
        self.fibonacci_frequencies = fib.iter()
            .map(|&n| self.base_frequency * n as f64 / fib[0] as f64)
            .collect();
    }
}

impl ResonanceMapper {
    fn new() -> Self {
        Self {
            resonance_points: HashMap::new(),
            field_harmonics: Vec::new(),
            interference_pattern: InterferencePattern {
                nodes: Vec::new(),
                antinodes: Vec::new(),
                standing_waves: Vec::new(),
            },
        }
    }
}

/// Field harmonics result
#[derive(Debug, Clone)]
pub struct FieldHarmonics {
    pub geometry_type: GeometryType,
    pub vortex_positions: Vec<Point3<f64>>,
    pub harmonic_frequencies: Vec<f64>,
    pub resonance_matrix: Matrix3<f64>,
    pub field_configuration: FieldConfiguration,
    pub coherence_amplification: f64,
}

#[derive(Debug, Clone)]
pub struct FieldConfiguration {
    pub optimal_geometry: GeometryType,
    pub resonance_nodes: Vec<Point3<f64>>,
    pub standing_wave_patterns: Vec<StandingWave>,
    pub field_strength_multiplier: f64,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_sacred_constants() {
        let harmonizer = FieldHarmonizer::new();
        assert!((harmonizer.sacred_constants.phi - 1.618).abs() < 0.001);
        assert!((harmonizer.sacred_constants.sqrt_2 - 1.414).abs() < 0.001);
    }
    
    #[test]
    fn test_geometry_creation() {
        let harmonizer = FieldHarmonizer::new();
        assert!(harmonizer.geometry_cache.contains_key(&GeometryType::FlowerOfLife));
        assert!(harmonizer.geometry_cache.contains_key(&GeometryType::ToroidalVortex));
    }
}