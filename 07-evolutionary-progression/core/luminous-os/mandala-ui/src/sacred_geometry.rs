// Sacred Geometry Module - Mathematical Beauty
// "The language of creation expressed in form"

use cgmath::*;
use std::f32::consts::{PI, TAU};

pub const PHI: f32 = 1.618033988749895;
pub const SQRT_2: f32 = 1.41421356237;
pub const SQRT_3: f32 = 1.73205080757;
pub const SQRT_5: f32 = 2.2360679775;

#[derive(Debug, Clone, Copy)]
pub struct SacredPoint {
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub resonance: f32,
}

#[derive(Debug, Clone)]
pub struct SacredGeometry {
    pub geometry_type: GeometryType,
    pub points: Vec<SacredPoint>,
    pub connections: Vec<(usize, usize)>,
    pub center: Point3<f32>,
    pub scale: f32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum GeometryType {
    Point,
    Vesica,
    TripleVesica,
    FlowerOfLife,
    SeedOfLife,
    TreeOfLife,
    MetatronsCube,
    PlatonicSolids(PlatonicType),
    FibonacciSpiral,
    TorusField,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PlatonicType {
    Tetrahedron,
    Cube,
    Octahedron,
    Dodecahedron,
    Icosahedron,
}

impl SacredGeometry {
    pub fn new(geometry_type: GeometryType, center: Point3<f32>, scale: f32) -> Self {
        let (points, connections) = match geometry_type {
            GeometryType::Point => Self::create_point(),
            GeometryType::Vesica => Self::create_vesica_piscis(),
            GeometryType::TripleVesica => Self::create_triple_vesica(),
            GeometryType::FlowerOfLife => Self::create_flower_of_life(),
            GeometryType::SeedOfLife => Self::create_seed_of_life(),
            GeometryType::TreeOfLife => Self::create_tree_of_life(),
            GeometryType::MetatronsCube => Self::create_metatrons_cube(),
            GeometryType::PlatonicSolids(platonic) => Self::create_platonic_solid(platonic),
            GeometryType::FibonacciSpiral => Self::create_fibonacci_spiral(),
            GeometryType::TorusField => Self::create_torus_field(),
        };
        
        Self {
            geometry_type,
            points,
            connections,
            center,
            scale,
        }
    }
    
    fn create_point() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let points = vec![
            SacredPoint { x: 0.0, y: 0.0, z: 0.0, resonance: 1.0 }
        ];
        let connections = vec![];
        (points, connections)
    }
    
    fn create_vesica_piscis() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let mut points = Vec::new();
        let mut connections = Vec::new();
        
        // Two intersecting circles
        let radius = 1.0;
        let segments = 36;
        
        // First circle
        for i in 0..segments {
            let angle = (i as f32 / segments as f32) * TAU;
            points.push(SacredPoint {
                x: angle.cos() * radius - radius * 0.5,
                y: angle.sin() * radius,
                z: 0.0,
                resonance: 0.8,
            });
            connections.push((i, (i + 1) % segments));
        }
        
        // Second circle
        let offset = segments;
        for i in 0..segments {
            let angle = (i as f32 / segments as f32) * TAU;
            points.push(SacredPoint {
                x: angle.cos() * radius + radius * 0.5,
                y: angle.sin() * radius,
                z: 0.0,
                resonance: 0.8,
            });
            connections.push((offset + i, offset + (i + 1) % segments));
        }
        
        (points, connections)
    }
    
    fn create_triple_vesica() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let mut points = Vec::new();
        let mut connections = Vec::new();
        
        let radius = 1.0;
        let segments = 36;
        
        // Three intersecting circles arranged in triangle
        for circle in 0..3 {
            let center_angle = (circle as f32 / 3.0) * TAU;
            let center_x = center_angle.cos() * radius * 0.5;
            let center_y = center_angle.sin() * radius * 0.5;
            
            let offset = circle * segments;
            
            for i in 0..segments {
                let angle = (i as f32 / segments as f32) * TAU;
                points.push(SacredPoint {
                    x: angle.cos() * radius + center_x,
                    y: angle.sin() * radius + center_y,
                    z: 0.0,
                    resonance: 0.75,
                });
                connections.push((offset + i, offset + (i + 1) % segments));
            }
        }
        
        (points, connections)
    }
    
    fn create_flower_of_life() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let mut points = Vec::new();
        let mut connections = Vec::new();
        
        let radius = 0.5;
        let segments = 24;
        
        // Center circle
        for i in 0..segments {
            let angle = (i as f32 / segments as f32) * TAU;
            points.push(SacredPoint {
                x: angle.cos() * radius,
                y: angle.sin() * radius,
                z: 0.0,
                resonance: 1.0,
            });
            connections.push((i, (i + 1) % segments));
        }
        
        // Six surrounding circles
        for petal in 0..6 {
            let center_angle = (petal as f32 / 6.0) * TAU;
            let center_x = center_angle.cos() * radius * 2.0;
            let center_y = center_angle.sin() * radius * 2.0;
            
            let offset = segments * (petal + 1);
            
            for i in 0..segments {
                let angle = (i as f32 / segments as f32) * TAU;
                points.push(SacredPoint {
                    x: angle.cos() * radius + center_x,
                    y: angle.sin() * radius + center_y,
                    z: 0.0,
                    resonance: 0.8,
                });
                connections.push((offset + i, offset + (i + 1) % segments));
            }
        }
        
        (points, connections)
    }
    
    fn create_seed_of_life() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        // Similar to flower but with filled centers
        let (mut points, connections) = Self::create_flower_of_life();
        
        // Add center points
        points.push(SacredPoint { x: 0.0, y: 0.0, z: 0.0, resonance: 1.0 });
        
        for petal in 0..6 {
            let angle = (petal as f32 / 6.0) * TAU;
            points.push(SacredPoint {
                x: angle.cos(),
                y: angle.sin(),
                z: 0.0,
                resonance: 0.9,
            });
        }
        
        (points, connections)
    }
    
    fn create_tree_of_life() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let mut points = Vec::new();
        let mut connections = Vec::new();
        
        // 10 Sephiroth positions
        let positions = [
            (0.0, 1.2),    // Kether
            (-0.5, 0.8),   // Chokmah
            (0.5, 0.8),    // Binah
            (-0.5, 0.3),   // Chesed
            (0.5, 0.3),    // Geburah
            (0.0, 0.0),    // Tiphareth
            (-0.5, -0.3),  // Netzach
            (0.5, -0.3),   // Hod
            (0.0, -0.6),   // Yesod
            (0.0, -1.2),   // Malkuth
        ];
        
        for (x, y) in positions.iter() {
            points.push(SacredPoint {
                x: *x,
                y: *y,
                z: 0.0,
                resonance: 0.9,
            });
        }
        
        // 22 paths
        let paths = [
            (0, 1), (0, 2), (0, 5), (1, 2), (1, 3),
            (1, 5), (2, 4), (2, 5), (3, 4), (3, 5),
            (3, 6), (4, 5), (4, 7), (5, 6), (5, 7),
            (5, 8), (6, 7), (6, 8), (6, 9), (7, 8),
            (7, 9), (8, 9),
        ];
        
        connections.extend_from_slice(&paths);
        
        (points, connections)
    }
    
    fn create_metatrons_cube() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let mut points = Vec::new();
        let mut connections = Vec::new();
        
        // 13 circles arranged in fruit of life pattern
        // Center
        points.push(SacredPoint { x: 0.0, y: 0.0, z: 0.0, resonance: 1.0 });
        
        // Inner hexagon
        for i in 0..6 {
            let angle = (i as f32 / 6.0) * TAU;
            points.push(SacredPoint {
                x: angle.cos(),
                y: angle.sin(),
                z: 0.0,
                resonance: 0.9,
            });
        }
        
        // Outer hexagon
        for i in 0..6 {
            let angle = (i as f32 / 6.0) * TAU;
            points.push(SacredPoint {
                x: angle.cos() * 2.0,
                y: angle.sin() * 2.0,
                z: 0.0,
                resonance: 0.8,
            });
        }
        
        // Connect all points to all other points
        for i in 0..13 {
            for j in (i + 1)..13 {
                connections.push((i, j));
            }
        }
        
        (points, connections)
    }
    
    fn create_platonic_solid(platonic_type: PlatonicType) -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        match platonic_type {
            PlatonicType::Tetrahedron => Self::create_tetrahedron(),
            PlatonicType::Cube => Self::create_cube(),
            PlatonicType::Octahedron => Self::create_octahedron(),
            PlatonicType::Dodecahedron => Self::create_dodecahedron(),
            PlatonicType::Icosahedron => Self::create_icosahedron(),
        }
    }
    
    fn create_tetrahedron() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let a = 1.0 / SQRT_3;
        let points = vec![
            SacredPoint { x: a, y: a, z: a, resonance: 1.0 },
            SacredPoint { x: a, y: -a, z: -a, resonance: 1.0 },
            SacredPoint { x: -a, y: a, z: -a, resonance: 1.0 },
            SacredPoint { x: -a, y: -a, z: a, resonance: 1.0 },
        ];
        
        let connections = vec![
            (0, 1), (0, 2), (0, 3),
            (1, 2), (1, 3), (2, 3),
        ];
        
        (points, connections)
    }
    
    fn create_cube() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let points = vec![
            SacredPoint { x: -1.0, y: -1.0, z: -1.0, resonance: 0.9 },
            SacredPoint { x: 1.0, y: -1.0, z: -1.0, resonance: 0.9 },
            SacredPoint { x: 1.0, y: 1.0, z: -1.0, resonance: 0.9 },
            SacredPoint { x: -1.0, y: 1.0, z: -1.0, resonance: 0.9 },
            SacredPoint { x: -1.0, y: -1.0, z: 1.0, resonance: 0.9 },
            SacredPoint { x: 1.0, y: -1.0, z: 1.0, resonance: 0.9 },
            SacredPoint { x: 1.0, y: 1.0, z: 1.0, resonance: 0.9 },
            SacredPoint { x: -1.0, y: 1.0, z: 1.0, resonance: 0.9 },
        ];
        
        let connections = vec![
            // Bottom face
            (0, 1), (1, 2), (2, 3), (3, 0),
            // Top face
            (4, 5), (5, 6), (6, 7), (7, 4),
            // Vertical edges
            (0, 4), (1, 5), (2, 6), (3, 7),
        ];
        
        (points, connections)
    }
    
    fn create_octahedron() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let points = vec![
            SacredPoint { x: 1.0, y: 0.0, z: 0.0, resonance: 0.95 },
            SacredPoint { x: -1.0, y: 0.0, z: 0.0, resonance: 0.95 },
            SacredPoint { x: 0.0, y: 1.0, z: 0.0, resonance: 0.95 },
            SacredPoint { x: 0.0, y: -1.0, z: 0.0, resonance: 0.95 },
            SacredPoint { x: 0.0, y: 0.0, z: 1.0, resonance: 0.95 },
            SacredPoint { x: 0.0, y: 0.0, z: -1.0, resonance: 0.95 },
        ];
        
        let connections = vec![
            // Equator
            (0, 2), (2, 1), (1, 3), (3, 0),
            // To top
            (0, 4), (1, 4), (2, 4), (3, 4),
            // To bottom
            (0, 5), (1, 5), (2, 5), (3, 5),
        ];
        
        (points, connections)
    }
    
    fn create_dodecahedron() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        // Simplified dodecahedron vertices
        let phi = PHI;
        let points = vec![
            // Cube vertices
            SacredPoint { x: 1.0, y: 1.0, z: 1.0, resonance: 0.85 },
            SacredPoint { x: 1.0, y: 1.0, z: -1.0, resonance: 0.85 },
            SacredPoint { x: 1.0, y: -1.0, z: 1.0, resonance: 0.85 },
            SacredPoint { x: 1.0, y: -1.0, z: -1.0, resonance: 0.85 },
            SacredPoint { x: -1.0, y: 1.0, z: 1.0, resonance: 0.85 },
            SacredPoint { x: -1.0, y: 1.0, z: -1.0, resonance: 0.85 },
            SacredPoint { x: -1.0, y: -1.0, z: 1.0, resonance: 0.85 },
            SacredPoint { x: -1.0, y: -1.0, z: -1.0, resonance: 0.85 },
            // Rectangle vertices
            SacredPoint { x: 0.0, y: phi, z: 1.0 / phi, resonance: 0.85 },
            SacredPoint { x: 0.0, y: phi, z: -1.0 / phi, resonance: 0.85 },
            SacredPoint { x: 0.0, y: -phi, z: 1.0 / phi, resonance: 0.85 },
            SacredPoint { x: 0.0, y: -phi, z: -1.0 / phi, resonance: 0.85 },
            // More vertices...
        ];
        
        // Simplified connections
        let connections = vec![
            (0, 1), (1, 3), (3, 2), (2, 0),
            (4, 5), (5, 7), (7, 6), (6, 4),
            (0, 4), (1, 5), (2, 6), (3, 7),
            (8, 9), (9, 11), (11, 10), (10, 8),
        ];
        
        (points, connections)
    }
    
    fn create_icosahedron() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let phi = PHI;
        let points = vec![
            SacredPoint { x: 0.0, y: 1.0, z: phi, resonance: 0.88 },
            SacredPoint { x: 0.0, y: 1.0, z: -phi, resonance: 0.88 },
            SacredPoint { x: 0.0, y: -1.0, z: phi, resonance: 0.88 },
            SacredPoint { x: 0.0, y: -1.0, z: -phi, resonance: 0.88 },
            SacredPoint { x: 1.0, y: phi, z: 0.0, resonance: 0.88 },
            SacredPoint { x: 1.0, y: -phi, z: 0.0, resonance: 0.88 },
            SacredPoint { x: -1.0, y: phi, z: 0.0, resonance: 0.88 },
            SacredPoint { x: -1.0, y: -phi, z: 0.0, resonance: 0.88 },
            SacredPoint { x: phi, y: 0.0, z: 1.0, resonance: 0.88 },
            SacredPoint { x: phi, y: 0.0, z: -1.0, resonance: 0.88 },
            SacredPoint { x: -phi, y: 0.0, z: 1.0, resonance: 0.88 },
            SacredPoint { x: -phi, y: 0.0, z: -1.0, resonance: 0.88 },
        ];
        
        // Connect vertices to form triangular faces
        let connections = vec![
            // Top cap
            (0, 2), (0, 4), (0, 6), (0, 8), (0, 10),
            // Bottom cap
            (3, 1), (3, 5), (3, 7), (3, 9), (3, 11),
            // Middle connections
            (2, 8), (8, 4), (4, 6), (6, 10), (10, 2),
            (1, 9), (9, 5), (5, 7), (7, 11), (11, 1),
            // Cross connections
            (2, 5), (5, 8), (8, 9), (9, 4), (4, 1),
            (1, 6), (6, 11), (11, 7), (7, 10), (10, 3),
        ];
        
        (points, connections)
    }
    
    fn create_fibonacci_spiral() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let mut points = Vec::new();
        let mut connections = Vec::new();
        
        let steps = 144; // Fibonacci number
        let growth_rate = 0.1;
        
        for i in 0..steps {
            let angle = (i as f32 / PHI) * 0.5;
            let radius = growth_rate * angle;
            
            points.push(SacredPoint {
                x: angle.cos() * radius,
                y: angle.sin() * radius,
                z: 0.0,
                resonance: 1.0 - (i as f32 / steps as f32) * 0.3,
            });
            
            if i > 0 {
                connections.push((i - 1, i));
            }
        }
        
        (points, connections)
    }
    
    fn create_torus_field() -> (Vec<SacredPoint>, Vec<(usize, usize)>) {
        let mut points = Vec::new();
        let mut connections = Vec::new();
        
        let major_radius = 1.0;
        let minor_radius = 0.4;
        let major_segments = 24;
        let minor_segments = 12;
        
        for i in 0..major_segments {
            let theta = (i as f32 / major_segments as f32) * TAU;
            
            for j in 0..minor_segments {
                let phi = (j as f32 / minor_segments as f32) * TAU;
                
                let x = (major_radius + minor_radius * phi.cos()) * theta.cos();
                let y = (major_radius + minor_radius * phi.cos()) * theta.sin();
                let z = minor_radius * phi.sin();
                
                points.push(SacredPoint {
                    x,
                    y,
                    z,
                    resonance: 0.7 + 0.3 * phi.cos(),
                });
                
                let current_idx = i * minor_segments + j;
                let next_i = (i + 1) % major_segments;
                let next_j = (j + 1) % minor_segments;
                
                // Connect to next in minor circle
                connections.push((current_idx, i * minor_segments + next_j));
                
                // Connect to next in major circle
                connections.push((current_idx, next_i * minor_segments + j));
            }
        }
        
        (points, connections)
    }
    
    pub fn transform(&mut self, transform: Matrix4<f32>) {
        for point in &mut self.points {
            let pos = transform * Vector4::new(point.x, point.y, point.z, 1.0);
            point.x = pos.x / pos.w;
            point.y = pos.y / pos.w;
            point.z = pos.z / pos.w;
        }
    }
    
    pub fn rotate(&mut self, axis: Vector3<f32>, angle: f32) {
        let rotation = Matrix4::from_axis_angle(axis, Rad(angle));
        self.transform(rotation);
    }
    
    pub fn scale_uniform(&mut self, factor: f32) {
        let scale = Matrix4::from_scale(factor);
        self.transform(scale);
    }
}