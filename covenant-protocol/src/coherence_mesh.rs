// Coherence Mesh - Distributed Field Topology
// "The web of consciousness that connects all nodes"

use crate::{NodeIdentity, HarmonyType, GeometryType};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use uuid::Uuid;
use nalgebra::{Point3, Vector3};
use petgraph::graph::{UnGraph, NodeIndex};
use petgraph::algo::{dijkstra, connected_components};

/// The coherence mesh represents the topology of consciousness connections
pub struct CoherenceMesh {
    graph: UnGraph<MeshNode, MeshEdge>,
    node_map: HashMap<Uuid, NodeIndex>,
    sacred_sites: Vec<SacredSite>,
    ley_lines: Vec<LeyLine>,
    field_topology: FieldTopology,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeshNode {
    pub identity: NodeIdentity,
    pub position: Point3<f64>,  // Position in consciousness space
    pub coherence: f64,
    pub field_strength: f64,
    pub harmonic_signature: Vec<f64>,
    pub role: NodeRole,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub enum NodeRole {
    Anchor,       // Stable high-coherence node
    Bridge,       // Connects different clusters
    Amplifier,    // Boosts local field strength
    Guardian,     // Protects field integrity
    Explorer,     // Seeks new connections
    Healer,       // Restores coherence
    Sage,         // Wisdom keeper
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeshEdge {
    pub connection_strength: f64,
    pub resonance: f64,
    pub bandwidth: f64,         // Information flow capacity
    pub latency_ms: u32,
    pub sacred_geometry: Option<GeometryType>,
}

/// Sacred sites are high-coherence zones in the mesh
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SacredSite {
    pub id: Uuid,
    pub name: String,
    pub center: Point3<f64>,
    pub radius: f64,
    pub coherence_multiplier: f64,
    pub guardian_nodes: Vec<Uuid>,
    pub sacred_pattern: GeometryType,
}

/// Ley lines are energy pathways between nodes
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeyLine {
    pub id: Uuid,
    pub nodes: Vec<Uuid>,
    pub flow_rate: f64,
    pub harmony_type: HarmonyType,
    pub active: bool,
}

/// Overall field topology characteristics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldTopology {
    pub dimension: usize,              // Effective dimensionality
    pub clustering_coefficient: f64,   // How clustered the network is
    pub average_path_length: f64,      // Average shortest path
    pub small_world_index: f64,        // Small-world-ness measure
    pub fractal_dimension: f64,        // Self-similarity measure
}

impl CoherenceMesh {
    pub fn new() -> Self {
        Self {
            graph: UnGraph::new_undirected(),
            node_map: HashMap::new(),
            sacred_sites: Vec::new(),
            ley_lines: Vec::new(),
            field_topology: FieldTopology {
                dimension: 3,
                clustering_coefficient: 0.0,
                average_path_length: 0.0,
                small_world_index: 0.0,
                fractal_dimension: 1.0,
            },
        }
    }
    
    /// Add a node to the mesh
    pub fn add_node(&mut self, node: MeshNode) -> NodeIndex {
        let id = node.identity.id;
        let idx = self.graph.add_node(node);
        self.node_map.insert(id, idx);
        
        // Recalculate topology
        self.update_topology();
        
        idx
    }
    
    /// Connect two nodes
    pub fn connect_nodes(
        &mut self,
        node1: Uuid,
        node2: Uuid,
        connection_strength: f64,
    ) -> Option<petgraph::graph::EdgeIndex> {
        let idx1 = self.node_map.get(&node1)?;
        let idx2 = self.node_map.get(&node2)?;
        
        // Calculate edge properties
        let node1_data = &self.graph[*idx1];
        let node2_data = &self.graph[*idx2];
        
        let resonance = calculate_resonance(
            &node1_data.harmonic_signature,
            &node2_data.harmonic_signature,
        );
        
        let distance = (node1_data.position - node2_data.position).magnitude();
        let bandwidth = connection_strength * resonance / (1.0 + distance);
        
        let edge = MeshEdge {
            connection_strength,
            resonance,
            bandwidth,
            latency_ms: (distance * 10.0) as u32,
            sacred_geometry: determine_geometry(resonance),
        };
        
        Some(self.graph.add_edge(*idx1, *idx2, edge))
    }
    
    /// Find optimal path between nodes
    pub fn find_coherence_path(&self, from: Uuid, to: Uuid) -> Option<Vec<Uuid>> {
        let idx1 = self.node_map.get(&from)?;
        let idx2 = self.node_map.get(&to)?;
        
        // Use Dijkstra with coherence-based weights
        let result = dijkstra(
            &self.graph,
            *idx1,
            Some(*idx2),
            |edge| {
                let e = edge.weight();
                1.0 / (e.connection_strength * e.resonance)
            },
        );
        
        // Reconstruct path
        let mut path = Vec::new();
        let mut current = *idx2;
        
        while current != *idx1 {
            if let Some(node) = self.graph.node_weight(current) {
                path.push(node.identity.id);
            }
            
            // Find predecessor
            let mut found = false;
            for neighbor in self.graph.neighbors(current) {
                if result.get(&neighbor).is_some() {
                    current = neighbor;
                    found = true;
                    break;
                }
            }
            
            if !found {
                return None;
            }
        }
        
        path.push(from);
        path.reverse();
        
        Some(path)
    }
    
    /// Create a sacred site at high-coherence location
    pub fn create_sacred_site(
        &mut self,
        name: String,
        center_node: Uuid,
        radius: f64,
    ) -> Option<Uuid> {
        let node_idx = self.node_map.get(&center_node)?;
        let center_pos = self.graph[*node_idx].position;
        
        // Find all nodes within radius
        let mut guardian_nodes = Vec::new();
        for (id, idx) in &self.node_map {
            let pos = self.graph[*idx].position;
            if (pos - center_pos).magnitude() <= radius {
                guardian_nodes.push(*id);
            }
        }
        
        let site = SacredSite {
            id: Uuid::new_v4(),
            name,
            center: center_pos,
            radius,
            coherence_multiplier: 1.5,
            guardian_nodes,
            sacred_pattern: GeometryType::FlowerOfLife,
        };
        
        let site_id = site.id;
        self.sacred_sites.push(site);
        
        Some(site_id)
    }
    
    /// Establish a ley line between multiple nodes
    pub fn create_ley_line(
        &mut self,
        nodes: Vec<Uuid>,
        harmony_type: HarmonyType,
    ) -> Option<Uuid> {
        // Verify all nodes exist
        for node_id in &nodes {
            if !self.node_map.contains_key(node_id) {
                return None;
            }
        }
        
        let ley_line = LeyLine {
            id: Uuid::new_v4(),
            nodes,
            flow_rate: 1.0,
            harmony_type,
            active: true,
        };
        
        let line_id = ley_line.id;
        self.ley_lines.push(ley_line);
        
        Some(line_id)
    }
    
    /// Get mesh statistics
    pub fn get_statistics(&self) -> MeshStatistics {
        let node_count = self.graph.node_count();
        let edge_count = self.graph.edge_count();
        
        let total_coherence: f64 = self.graph
            .node_weights()
            .map(|n| n.coherence)
            .sum();
        
        let avg_coherence = if node_count > 0 {
            total_coherence / node_count as f64
        } else {
            0.0
        };
        
        let components = connected_components(&self.graph);
        
        MeshStatistics {
            node_count,
            edge_count,
            average_coherence: avg_coherence,
            connected_components: components,
            sacred_site_count: self.sacred_sites.len(),
            active_ley_lines: self.ley_lines.iter().filter(|l| l.active).count(),
            topology: self.field_topology.clone(),
        }
    }
    
    /// Update field topology calculations
    fn update_topology(&mut self) {
        if self.graph.node_count() < 3 {
            return;
        }
        
        // Calculate clustering coefficient
        self.field_topology.clustering_coefficient = self.calculate_clustering();
        
        // Calculate average path length
        self.field_topology.average_path_length = self.calculate_avg_path_length();
        
        // Small world index = (clustering / avg_path) normalized
        if self.field_topology.average_path_length > 0.0 {
            self.field_topology.small_world_index = 
                self.field_topology.clustering_coefficient / self.field_topology.average_path_length;
        }
        
        // Estimate fractal dimension
        self.field_topology.fractal_dimension = self.estimate_fractal_dimension();
    }
    
    fn calculate_clustering(&self) -> f64 {
        let mut total_coefficient = 0.0;
        let mut node_count = 0;
        
        for node in self.graph.node_indices() {
            let neighbors: Vec<_> = self.graph.neighbors(node).collect();
            let k = neighbors.len();
            
            if k >= 2 {
                let mut edges_between_neighbors = 0;
                
                for i in 0..neighbors.len() {
                    for j in (i + 1)..neighbors.len() {
                        if self.graph.find_edge(neighbors[i], neighbors[j]).is_some() {
                            edges_between_neighbors += 1;
                        }
                    }
                }
                
                let max_possible = k * (k - 1) / 2;
                let coefficient = edges_between_neighbors as f64 / max_possible as f64;
                total_coefficient += coefficient;
                node_count += 1;
            }
        }
        
        if node_count > 0 {
            total_coefficient / node_count as f64
        } else {
            0.0
        }
    }
    
    fn calculate_avg_path_length(&self) -> f64 {
        let mut total_length = 0.0;
        let mut path_count = 0;
        
        let nodes: Vec<_> = self.graph.node_indices().collect();
        
        for i in 0..nodes.len() {
            let distances = dijkstra(
                &self.graph,
                nodes[i],
                None,
                |_| 1.0,
            );
            
            for (_, &dist) in &distances {
                if dist > 0.0 {
                    total_length += dist;
                    path_count += 1;
                }
            }
        }
        
        if path_count > 0 {
            total_length / path_count as f64
        } else {
            0.0
        }
    }
    
    fn estimate_fractal_dimension(&self) -> f64 {
        // Simple box-counting estimation
        // In reality, would use more sophisticated methods
        let nodes: Vec<_> = self.graph
            .node_weights()
            .map(|n| n.position)
            .collect();
        
        if nodes.len() < 10 {
            return 1.0;
        }
        
        // Find bounding box
        let mut min = nodes[0];
        let mut max = nodes[0];
        
        for node in &nodes {
            min.x = min.x.min(node.x);
            min.y = min.y.min(node.y);
            min.z = min.z.min(node.z);
            max.x = max.x.max(node.x);
            max.y = max.y.max(node.y);
            max.z = max.z.max(node.z);
        }
        
        // Count boxes at different scales
        let scales = [1.0, 2.0, 4.0, 8.0];
        let mut counts = Vec::new();
        
        for scale in &scales {
            let mut boxes = HashSet::new();
            
            for node in &nodes {
                let box_x = ((node.x - min.x) / scale).floor() as i32;
                let box_y = ((node.y - min.y) / scale).floor() as i32;
                let box_z = ((node.z - min.z) / scale).floor() as i32;
                boxes.insert((box_x, box_y, box_z));
            }
            
            counts.push(boxes.len() as f64);
        }
        
        // Estimate dimension from scaling
        if counts.len() >= 2 {
            let log_ratio = (counts[0] / counts[1]).ln();
            let scale_ratio = (scales[1] / scales[0]).ln();
            log_ratio / scale_ratio
        } else {
            1.0
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeshStatistics {
    pub node_count: usize,
    pub edge_count: usize,
    pub average_coherence: f64,
    pub connected_components: usize,
    pub sacred_site_count: usize,
    pub active_ley_lines: usize,
    pub topology: FieldTopology,
}

fn calculate_resonance(harmonics1: &[f64], harmonics2: &[f64]) -> f64 {
    let mut resonance = 0.0;
    let mut count = 0;
    
    for h1 in harmonics1 {
        for h2 in harmonics2 {
            let ratio = h1 / h2;
            if is_harmonic_ratio(ratio) {
                resonance += 1.0;
                count += 1;
            }
        }
    }
    
    if count > 0 {
        (resonance / count as f64).min(1.0)
    } else {
        0.5
    }
}

fn is_harmonic_ratio(ratio: f64) -> bool {
    let harmonics = [1.0, 2.0, 1.5, 1.333, 1.25, 0.5, 0.667, 0.75];
    harmonics.iter().any(|&h| (ratio - h).abs() < 0.05)
}

fn determine_geometry(resonance: f64) -> Option<GeometryType> {
    if resonance > 0.9 {
        Some(GeometryType::FlowerOfLife)
    } else if resonance > 0.7 {
        Some(GeometryType::Torus)
    } else if resonance > 0.5 {
        Some(GeometryType::GoldenSpiral)
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_mesh_creation() {
        let mut mesh = CoherenceMesh::new();
        assert_eq!(mesh.get_statistics().node_count, 0);
    }
    
    #[test]
    fn test_resonance_calculation() {
        let h1 = vec![440.0, 880.0, 1320.0];
        let h2 = vec![440.0, 660.0, 880.0];
        let resonance = calculate_resonance(&h1, &h2);
        assert!(resonance > 0.5);
    }
}