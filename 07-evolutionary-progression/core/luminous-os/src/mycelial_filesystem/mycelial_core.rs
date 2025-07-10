//! Core mycelial filesystem implementation

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use petgraph::graph::{DiGraph, NodeIndex};

#[derive(Debug, Clone)]
pub struct FileNode {
    pub path: PathBuf,
    pub size: u64,
    pub connections: usize,
    pub vitality: f64,
}

pub struct MycelialFilesystem {
    graph: DiGraph<FileNode, f64>,
    path_to_node: HashMap<PathBuf, NodeIndex>,
}

impl MycelialFilesystem {
    pub fn new() -> Self {
        Self {
            graph: DiGraph::new(),
            path_to_node: HashMap::new(),
        }
    }

    pub fn add_file(&mut self, path: PathBuf, size: u64) -> NodeIndex {
        let node = FileNode {
            path: path.clone(),
            size,
            connections: 0,
            vitality: 1.0,
        };
        
        let idx = self.graph.add_node(node);
        self.path_to_node.insert(path, idx);
        idx
    }

    pub fn connect_files(&mut self, from: &Path, to: &Path, strength: f64) {
        if let (Some(&from_idx), Some(&to_idx)) = 
            (self.path_to_node.get(from), self.path_to_node.get(to)) {
            self.graph.add_edge(from_idx, to_idx, strength);
            
            // Update connection counts
            if let Some(from_node) = self.graph.node_weight_mut(from_idx) {
                from_node.connections += 1;
            }
            if let Some(to_node) = self.graph.node_weight_mut(to_idx) {
                to_node.connections += 1;
            }
        }
    }

    pub fn get_connected_files(&self, path: &Path) -> Vec<PathBuf> {
        if let Some(&idx) = self.path_to_node.get(path) {
            self.graph.neighbors(idx)
                .filter_map(|n| self.graph.node_weight(n))
                .map(|node| node.path.clone())
                .collect()
        } else {
            Vec::new()
        }
    }
}