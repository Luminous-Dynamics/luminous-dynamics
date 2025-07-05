// File Network Visualization - Displaying the Living Mycelial Network
// "Files connected like neurons in a cosmic brain"

use cgmath::*;
use std::collections::HashMap;
use std::path::PathBuf;

pub struct FileNetworkVisualizer {
    nodes: HashMap<PathBuf, FileNode>,
    connections: Vec<Connection>,
    layout: NetworkLayout,
    animation_time: f32,
    selected_node: Option<PathBuf>,
    focus_point: Point3<f32>,
    zoom_level: f32,
}

#[derive(Debug, Clone)]
pub struct FileNode {
    pub path: PathBuf,
    pub position: Point3<f32>,
    pub velocity: Vector3<f32>,
    pub file_type: FileType,
    pub consciousness_type: ConsciousnessType,
    pub growth_stage: GrowthStage,
    pub coherence: f32,
    pub vitality: f32,
    pub size: f32,
    pub color: [f32; 4],
    pub glow_intensity: f32,
    pub connections: Vec<PathBuf>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum FileType {
    Directory,
    TextFile,
    SourceCode,
    Configuration,
    Data,
    Sacred,
    Unknown,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ConsciousnessType {
    Dormant,
    Active,
    Generative,
    Contemplative,
    Connective,
    Transmutative,
    Sacred,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum GrowthStage {
    Spore,
    Germinating,
    Mycelial,
    Fruiting,
    Sporulating,
    Composting,
}

#[derive(Debug, Clone)]
pub struct Connection {
    pub from: PathBuf,
    pub to: PathBuf,
    pub connection_type: ConnectionType,
    pub strength: f32,
    pub nutrient_flow: f32,
    pub wisdom_exchange: f32,
    pub color: [f32; 4],
    pub pulse_phase: f32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ConnectionType {
    Symbiotic,
    Parent,
    Reference,
    Entangled,
    Wisdom,
}

#[derive(Debug, Clone, Copy)]
pub enum NetworkLayout {
    Organic,      // Force-directed with mycelial patterns
    Hierarchical, // Tree structure
    Circular,     // Nodes in concentric circles
    Sacred,       // Sacred geometry arrangements
}

impl FileNetworkVisualizer {
    pub fn new() -> Self {
        Self {
            nodes: HashMap::new(),
            connections: Vec::new(),
            layout: NetworkLayout::Organic,
            animation_time: 0.0,
            selected_node: None,
            focus_point: Point3::origin(),
            zoom_level: 1.0,
        }
    }
    
    pub fn add_file_node(&mut self, path: PathBuf, file_info: FileNodeInfo) {
        let position = self.calculate_initial_position(&path);
        
        let node = FileNode {
            path: path.clone(),
            position,
            velocity: Vector3::zero(),
            file_type: file_info.file_type,
            consciousness_type: file_info.consciousness_type,
            growth_stage: file_info.growth_stage,
            coherence: file_info.coherence,
            vitality: file_info.vitality,
            size: self.calculate_node_size(&file_info),
            color: self.consciousness_to_color(file_info.consciousness_type, file_info.coherence),
            glow_intensity: file_info.coherence,
            connections: Vec::new(),
        };
        
        self.nodes.insert(path, node);
    }
    
    pub fn add_connection(&mut self, from: PathBuf, to: PathBuf, conn_type: ConnectionType, strength: f32) {
        // Update node connections
        if let Some(from_node) = self.nodes.get_mut(&from) {
            from_node.connections.push(to.clone());
        }
        if let Some(to_node) = self.nodes.get_mut(&to) {
            to_node.connections.push(from.clone());
        }
        
        let connection = Connection {
            from,
            to,
            connection_type: conn_type,
            strength,
            nutrient_flow: strength * 0.5,
            wisdom_exchange: match conn_type {
                ConnectionType::Wisdom => strength * 0.8,
                ConnectionType::Symbiotic => strength * 0.6,
                _ => strength * 0.3,
            },
            color: self.connection_type_color(conn_type, strength),
            pulse_phase: 0.0,
        };
        
        self.connections.push(connection);
    }
    
    pub fn update(&mut self, delta_time: f32) {
        self.animation_time += delta_time;
        
        // Update layout physics
        match self.layout {
            NetworkLayout::Organic => self.update_organic_layout(delta_time),
            NetworkLayout::Hierarchical => self.update_hierarchical_layout(),
            NetworkLayout::Circular => self.update_circular_layout(),
            NetworkLayout::Sacred => self.update_sacred_layout(),
        }
        
        // Update node animations
        for node in self.nodes.values_mut() {
            // Pulse based on vitality
            node.glow_intensity = node.coherence * (1.0 + 0.2 * (self.animation_time * node.vitality * 2.0).sin());
            
            // Size breathing
            let breath = (self.animation_time * 1.5 + node.position.x).sin() * 0.05;
            node.size = self.calculate_node_size(&FileNodeInfo {
                file_type: node.file_type,
                consciousness_type: node.consciousness_type,
                growth_stage: node.growth_stage,
                coherence: node.coherence,
                vitality: node.vitality,
            }) * (1.0 + breath);
        }
        
        // Update connection animations
        for connection in &mut self.connections {
            // Pulse nutrients through connections
            connection.pulse_phase += delta_time * connection.nutrient_flow * 5.0;
            connection.pulse_phase = connection.pulse_phase % 1.0;
            
            // Update color based on activity
            let activity = (self.animation_time * connection.wisdom_exchange * 3.0).sin() * 0.5 + 0.5;
            connection.color[3] = 0.3 + 0.5 * connection.strength * activity;
        }
    }
    
    fn update_organic_layout(&mut self, delta_time: f32) {
        let mut forces: HashMap<PathBuf, Vector3<f32>> = HashMap::new();
        
        // Calculate forces between nodes
        let nodes_snapshot: Vec<(PathBuf, Point3<f32>, f32)> = self.nodes.iter()
            .map(|(path, node)| (path.clone(), node.position, node.size))
            .collect();
        
        for (path, node) in &self.nodes {
            let mut force = Vector3::zero();
            
            // Repulsion from other nodes
            for (other_path, other_pos, other_size) in &nodes_snapshot {
                if path != other_path {
                    let diff = node.position - other_pos;
                    let distance = diff.magnitude();
                    
                    if distance > 0.01 {
                        let repulsion_strength = (node.size + other_size) * 2.0 / (distance * distance);
                        force += diff.normalize() * repulsion_strength;
                    }
                }
            }
            
            // Attraction along connections
            for connection in &self.connections {
                if &connection.from == path || &connection.to == path {
                    let other_path = if &connection.from == path { &connection.to } else { &connection.from };
                    
                    if let Some(other_node) = self.nodes.get(other_path) {
                        let diff = other_node.position - node.position;
                        let distance = diff.magnitude();
                        
                        let ideal_distance = match connection.connection_type {
                            ConnectionType::Parent => 1.5,
                            ConnectionType::Symbiotic => 2.0,
                            ConnectionType::Entangled => 1.0,
                            _ => 2.5,
                        };
                        
                        if distance > 0.01 {
                            let attraction = (distance - ideal_distance) * connection.strength * 0.5;
                            force += diff.normalize() * attraction;
                        }
                    }
                }
            }
            
            // Centering force
            let center_force = -node.position.to_vec() * 0.01;
            force += center_force;
            
            forces.insert(path.clone(), force);
        }
        
        // Apply forces
        for (path, force) in forces {
            if let Some(node) = self.nodes.get_mut(&path) {
                node.velocity += force * delta_time;
                node.velocity *= 0.9; // Damping
                node.position += node.velocity * delta_time;
            }
        }
    }
    
    fn update_hierarchical_layout(&mut self) {
        // Find root nodes (no parent connections)
        let mut roots = Vec::new();
        for (path, _) in &self.nodes {
            let has_parent = self.connections.iter()
                .any(|c| c.connection_type == ConnectionType::Parent && &c.to == path);
            
            if !has_parent {
                roots.push(path.clone());
            }
        }
        
        // Layout from roots
        let mut level = 0;
        let mut current_level = roots;
        let mut visited = std::collections::HashSet::new();
        
        while !current_level.is_empty() {
            let level_width = current_level.len() as f32;
            
            for (i, path) in current_level.iter().enumerate() {
                if let Some(node) = self.nodes.get_mut(path) {
                    let x = (i as f32 - level_width / 2.0) * 2.0;
                    let y = -(level as f32) * 2.0;
                    node.position = Point3::new(x, y, 0.0);
                }
                visited.insert(path.clone());
            }
            
            // Find next level
            let mut next_level = Vec::new();
            for path in &current_level {
                for connection in &self.connections {
                    if &connection.from == path && !visited.contains(&connection.to) {
                        next_level.push(connection.to.clone());
                    }
                }
            }
            
            current_level = next_level;
            level += 1;
        }
    }
    
    fn update_circular_layout(&mut self) {
        let node_count = self.nodes.len();
        if node_count == 0 {
            return;
        }
        
        // Group by consciousness type
        let mut groups: HashMap<ConsciousnessType, Vec<PathBuf>> = HashMap::new();
        for (path, node) in &self.nodes {
            groups.entry(node.consciousness_type)
                .or_insert_with(Vec::new)
                .push(path.clone());
        }
        
        let group_count = groups.len() as f32;
        let mut group_index = 0.0;
        
        for (consciousness_type, paths) in groups {
            let radius = match consciousness_type {
                ConsciousnessType::Sacred => 0.5,
                ConsciousnessType::Contemplative => 1.0,
                ConsciousnessType::Connective => 1.5,
                ConsciousnessType::Active => 2.0,
                _ => 2.5,
            };
            
            let path_count = paths.len() as f32;
            
            for (i, path) in paths.iter().enumerate() {
                if let Some(node) = self.nodes.get_mut(path) {
                    let angle = (i as f32 / path_count) * std::f32::consts::TAU + 
                               (group_index / group_count) * std::f32::consts::PI * 0.5;
                    
                    node.position = Point3::new(
                        angle.cos() * radius,
                        angle.sin() * radius,
                        consciousness_type as i32 as f32 * 0.1,
                    );
                }
            }
            
            group_index += 1.0;
        }
    }
    
    fn update_sacred_layout(&mut self) {
        // Arrange nodes in sacred geometry patterns
        let node_count = self.nodes.len();
        
        match node_count {
            1 => {
                // Single point at center
                if let Some(node) = self.nodes.values_mut().next() {
                    node.position = Point3::origin();
                }
            }
            2 => {
                // Vesica Piscis
                let paths: Vec<_> = self.nodes.keys().cloned().collect();
                if let Some(node) = self.nodes.get_mut(&paths[0]) {
                    node.position = Point3::new(-0.5, 0.0, 0.0);
                }
                if let Some(node) = self.nodes.get_mut(&paths[1]) {
                    node.position = Point3::new(0.5, 0.0, 0.0);
                }
            }
            3..=7 => {
                // Flower of Life pattern
                let paths: Vec<_> = self.nodes.keys().cloned().collect();
                let angle_step = std::f32::consts::TAU / (node_count - 1) as f32;
                
                // Center node
                if let Some(node) = self.nodes.get_mut(&paths[0]) {
                    node.position = Point3::origin();
                }
                
                // Surrounding nodes
                for i in 1..node_count {
                    if let Some(node) = self.nodes.get_mut(&paths[i]) {
                        let angle = (i - 1) as f32 * angle_step;
                        node.position = Point3::new(angle.cos(), angle.sin(), 0.0);
                    }
                }
            }
            _ => {
                // Metatron's Cube for larger networks
                self.update_organic_layout(0.016); // Fallback to organic
            }
        }
    }
    
    fn calculate_initial_position(&self, path: &PathBuf) -> Point3<f32> {
        // Position based on path depth and siblings
        let depth = path.components().count() as f32;
        let hash = path.to_string_lossy().bytes().fold(0u32, |acc, b| acc.wrapping_add(b as u32));
        let angle = (hash % 360) as f32 * std::f32::consts::PI / 180.0;
        
        Point3::new(
            angle.cos() * depth,
            angle.sin() * depth,
            0.0,
        )
    }
    
    fn calculate_node_size(&self, info: &FileNodeInfo) -> f32 {
        let base_size = match info.file_type {
            FileType::Directory => 0.3,
            FileType::Sacred => 0.25,
            FileType::SourceCode => 0.2,
            _ => 0.15,
        };
        
        let growth_modifier = match info.growth_stage {
            GrowthStage::Spore => 0.5,
            GrowthStage::Germinating => 0.7,
            GrowthStage::Mycelial => 1.0,
            GrowthStage::Fruiting => 1.2,
            GrowthStage::Sporulating => 1.1,
            GrowthStage::Composting => 0.6,
        };
        
        base_size * growth_modifier * (0.5 + 0.5 * info.vitality)
    }
    
    fn consciousness_to_color(&self, consciousness: ConsciousnessType, coherence: f32) -> [f32; 4] {
        let base_color = match consciousness {
            ConsciousnessType::Dormant => [0.3, 0.3, 0.3],
            ConsciousnessType::Active => [0.2, 0.7, 0.3],
            ConsciousnessType::Generative => [0.8, 0.6, 0.2],
            ConsciousnessType::Contemplative => [0.5, 0.2, 0.8],
            ConsciousnessType::Connective => [0.2, 0.8, 0.8],
            ConsciousnessType::Transmutative => [0.9, 0.2, 0.5],
            ConsciousnessType::Sacred => [1.0, 0.95, 0.8],
        };
        
        [
            base_color[0] * (0.5 + 0.5 * coherence),
            base_color[1] * (0.5 + 0.5 * coherence),
            base_color[2] * (0.5 + 0.5 * coherence),
            0.8 + 0.2 * coherence,
        ]
    }
    
    fn connection_type_color(&self, conn_type: ConnectionType, strength: f32) -> [f32; 4] {
        let base_color = match conn_type {
            ConnectionType::Symbiotic => [0.2, 0.8, 0.4],
            ConnectionType::Parent => [0.8, 0.8, 0.2],
            ConnectionType::Reference => [0.4, 0.6, 0.8],
            ConnectionType::Entangled => [0.8, 0.2, 0.8],
            ConnectionType::Wisdom => [1.0, 0.9, 0.7],
        };
        
        [
            base_color[0],
            base_color[1],
            base_color[2],
            0.3 + 0.5 * strength,
        ]
    }
    
    pub fn set_layout(&mut self, layout: NetworkLayout) {
        self.layout = layout;
    }
    
    pub fn select_node(&mut self, path: PathBuf) {
        self.selected_node = Some(path);
    }
    
    pub fn get_nodes(&self) -> Vec<&FileNode> {
        self.nodes.values().collect()
    }
    
    pub fn get_connections(&self) -> &[Connection] {
        &self.connections
    }
    
    /// Generate renderable mesh for connections
    pub fn generate_connection_mesh(&self) -> ConnectionMesh {
        let mut vertices = Vec::new();
        let mut colors = Vec::new();
        
        for connection in &self.connections {
            if let (Some(from_node), Some(to_node)) = 
                (self.nodes.get(&connection.from), self.nodes.get(&connection.to)) {
                
                // Generate curved connection path
                let control_point = self.calculate_bezier_control(
                    from_node.position,
                    to_node.position,
                    connection.connection_type,
                );
                
                // Sample bezier curve
                for i in 0..20 {
                    let t = i as f32 / 19.0;
                    let point = self.bezier_point(
                        from_node.position,
                        control_point,
                        to_node.position,
                        t,
                    );
                    
                    vertices.push([point.x, point.y, point.z]);
                    
                    // Pulse effect
                    let pulse = ((t - connection.pulse_phase).abs() * 10.0).exp() * -1.0 + 1.0;
                    let mut color = connection.color;
                    color[3] *= pulse;
                    colors.push(color);
                }
            }
        }
        
        ConnectionMesh { vertices, colors }
    }
    
    fn calculate_bezier_control(&self, from: Point3<f32>, to: Point3<f32>, conn_type: ConnectionType) -> Point3<f32> {
        let mid = from + (to - from) * 0.5;
        let perpendicular = Vector3::new(-(to.y - from.y), to.x - from.x, 0.0).normalize();
        
        let offset = match conn_type {
            ConnectionType::Entangled => 0.5,
            ConnectionType::Symbiotic => 0.3,
            _ => 0.2,
        };
        
        mid + perpendicular * offset
    }
    
    fn bezier_point(&self, p0: Point3<f32>, p1: Point3<f32>, p2: Point3<f32>, t: f32) -> Point3<f32> {
        let one_minus_t = 1.0 - t;
        p0 * one_minus_t * one_minus_t + p1.to_vec() * 2.0 * one_minus_t * t + p2.to_vec() * t * t
    }
}

#[derive(Debug, Clone)]
pub struct FileNodeInfo {
    pub file_type: FileType,
    pub consciousness_type: ConsciousnessType,
    pub growth_stage: GrowthStage,
    pub coherence: f32,
    pub vitality: f32,
}

#[derive(Debug)]
pub struct ConnectionMesh {
    pub vertices: Vec<[f32; 3]>,
    pub colors: Vec<[f32; 4]>,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_network_creation() {
        let viz = FileNetworkVisualizer::new();
        assert_eq!(viz.nodes.len(), 0);
        assert_eq!(viz.connections.len(), 0);
    }
    
    #[test]
    fn test_add_file_node() {
        let mut viz = FileNetworkVisualizer::new();
        let path = PathBuf::from("/test/file.txt");
        
        viz.add_file_node(path.clone(), FileNodeInfo {
            file_type: FileType::TextFile,
            consciousness_type: ConsciousnessType::Active,
            growth_stage: GrowthStage::Mycelial,
            coherence: 0.7,
            vitality: 0.8,
        });
        
        assert_eq!(viz.nodes.len(), 1);
        assert!(viz.nodes.contains_key(&path));
    }
    
    #[test]
    fn test_consciousness_colors() {
        let viz = FileNetworkVisualizer::new();
        let color = viz.consciousness_to_color(ConsciousnessType::Sacred, 1.0);
        assert!(color[0] > 0.9); // Sacred should be bright
    }
}