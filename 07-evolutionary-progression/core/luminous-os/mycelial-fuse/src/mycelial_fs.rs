//! Mycelial Filesystem Implementation
//! 
//! A living filesystem that tracks relationships between files,
//! grows connections based on access patterns, and maintains
//! wisdom about data flows.

use std::collections::HashMap;
use std::ffi::OsStr;
use std::path::{Path, PathBuf};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use std::sync::Arc;

use dashmap::DashMap;
use petgraph::graph::{DiGraph, NodeIndex};
use petgraph::Direction;
use fuser::{
    FileAttr, FileType, Filesystem, ReplyAttr, ReplyData, ReplyDirectory,
    ReplyEntry, Request, FUSE_ROOT_ID,
};
use libc::{ENOENT, ENOTDIR};
use log::{debug, info, warn};
use serde::{Deserialize, Serialize};

const TTL: Duration = Duration::from_secs(1);
const BLOCK_SIZE: u64 = 4096;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MycelialNode {
    inode: u64,
    name: String,
    kind: FileType,
    size: u64,
    content: Vec<u8>,
    connections: Vec<u64>,  // Connected inodes
    vitality: f64,          // Health/importance metric
    last_accessed: SystemTime,
    access_count: u64,
    wisdom: Vec<String>,    // Accumulated insights
}

impl MycelialNode {
    fn new(inode: u64, name: String, kind: FileType) -> Self {
        Self {
            inode,
            name,
            kind,
            size: 0,
            content: Vec::new(),
            connections: Vec::new(),
            vitality: 1.0,
            last_accessed: SystemTime::now(),
            access_count: 0,
            wisdom: Vec::new(),
        }
    }
    
    fn to_attr(&self) -> FileAttr {
        let now = SystemTime::now();
        FileAttr {
            ino: self.inode,
            size: self.size,
            blocks: (self.size + BLOCK_SIZE - 1) / BLOCK_SIZE,
            atime: self.last_accessed,
            mtime: now,
            ctime: now,
            crtime: now,
            kind: self.kind,
            perm: match self.kind {
                FileType::Directory => 0o755,
                _ => 0o644,
            },
            nlink: 2,
            uid: 1000,
            gid: 1000,
            rdev: 0,
            blksize: BLOCK_SIZE as u32,
            flags: 0,
        }
    }
}

pub struct MycelialFS {
    nodes: Arc<DashMap<u64, MycelialNode>>,
    name_to_inode: Arc<DashMap<(u64, String), u64>>,  // (parent_inode, name) -> inode
    connections: Arc<DiGraph<u64, f64>>,  // Connection graph with strength
    next_inode: Arc<std::sync::atomic::AtomicU64>,
    wisdom_path: PathBuf,
}

impl MycelialFS {
    pub fn new(wisdom_path: PathBuf) -> Self {
        let mut fs = Self {
            nodes: Arc::new(DashMap::new()),
            name_to_inode: Arc::new(DashMap::new()),
            connections: Arc::new(DiGraph::new()),
            next_inode: Arc::new(std::sync::atomic::AtomicU64::new(2)),
            wisdom_path,
        };
        
        // Create root directory
        let root = MycelialNode::new(FUSE_ROOT_ID, "/".to_string(), FileType::Directory);
        fs.nodes.insert(FUSE_ROOT_ID, root);
        
        // Create initial sacred structure
        fs.create_sacred_structure();
        
        fs
    }
    
    fn create_sacred_structure(&mut self) {
        // Create wisdom directory
        let wisdom_inode = self.create_node("wisdom", FUSE_ROOT_ID, FileType::Directory);
        
        // Create connection map
        let connections_inode = self.create_node("connections", FUSE_ROOT_ID, FileType::Directory);
        
        // Create vitality monitor
        let vitality_inode = self.create_node("vitality", FUSE_ROOT_ID, FileType::RegularFile);
        if let Some(mut node) = self.nodes.get_mut(&vitality_inode) {
            node.content = b"System Vitality: 100%\nAll connections flowing...\n".to_vec();
            node.size = node.content.len() as u64;
        }
        
        // Create README
        let readme_inode = self.create_node("README.sacred", FUSE_ROOT_ID, FileType::RegularFile);
        if let Some(mut node) = self.nodes.get_mut(&readme_inode) {
            node.content = br#"🍄 Mycelial Filesystem 🍄

This is a living filesystem that tracks relationships between files.
As you access files, the mycelial network grows stronger connections.

Special directories:
- /wisdom/      - Accumulated insights about file relationships
- /connections/ - View the connection network
- /vitality     - Monitor filesystem health

Files that are accessed together will form stronger bonds.
The filesystem learns and adapts to your usage patterns.

May your data flow with sacred purpose! 🌟
"#.to_vec();
            node.size = node.content.len() as u64;
        }
    }
    
    fn create_node(&self, name: &str, parent: u64, kind: FileType) -> u64 {
        let inode = self.next_inode.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
        let node = MycelialNode::new(inode, name.to_string(), kind);
        
        self.nodes.insert(inode, node);
        self.name_to_inode.insert((parent, name.to_string()), inode);
        
        // Add to connection graph
        let mut graph = Arc::get_mut(&mut self.connections.clone()).unwrap();
        graph.add_node(inode);
        
        inode
    }
    
    fn strengthen_connection(&self, from: u64, to: u64) {
        // This would update the connection strength in the graph
        // For now, just log it
        info!("Strengthening connection between {} and {}", from, to);
    }
    
    fn update_vitality(&self, inode: u64) {
        if let Some(mut node) = self.nodes.get_mut(&inode) {
            node.access_count += 1;
            node.last_accessed = SystemTime::now();
            
            // Update vitality based on access patterns
            let age = node.last_accessed.elapsed().unwrap_or(Duration::from_secs(0));
            let vitality = 1.0 / (1.0 + age.as_secs() as f64 / 3600.0);
            node.vitality = vitality;
            
            // Add wisdom if this is a significant access
            if node.access_count % 10 == 0 {
                node.wisdom.push(format!(
                    "Accessed {} times, vitality: {:.2}",
                    node.access_count, vitality
                ));
            }
        }
    }
}

impl Filesystem for MycelialFS {
    fn lookup(&mut self, _req: &Request, parent: u64, name: &OsStr, reply: ReplyEntry) {
        let name = name.to_str().unwrap();
        debug!("lookup: parent={}, name={}", parent, name);
        
        if let Some(inode) = self.name_to_inode.get(&(parent, name.to_string())) {
            if let Some(node) = self.nodes.get(&inode) {
                reply.entry(&TTL, &node.to_attr(), 0);
                return;
            }
        }
        
        reply.error(ENOENT);
    }
    
    fn getattr(&mut self, _req: &Request, ino: u64, reply: ReplyAttr) {
        debug!("getattr: ino={}", ino);
        
        if let Some(node) = self.nodes.get(&ino) {
            self.update_vitality(ino);
            reply.attr(&TTL, &node.to_attr());
        } else {
            reply.error(ENOENT);
        }
    }
    
    fn read(
        &mut self,
        _req: &Request,
        ino: u64,
        _fh: u64,
        offset: i64,
        size: u32,
        _flags: i32,
        _lock_owner: Option<u64>,
        reply: ReplyData,
    ) {
        debug!("read: ino={}, offset={}, size={}", ino, offset, size);
        
        if let Some(node) = self.nodes.get(&ino) {
            if node.kind != FileType::RegularFile {
                reply.error(ENOTDIR);
                return;
            }
            
            let offset = offset as usize;
            let size = size as usize;
            
            if offset < node.content.len() {
                let end = (offset + size).min(node.content.len());
                reply.data(&node.content[offset..end]);
            } else {
                reply.data(&[]);
            }
            
            self.update_vitality(ino);
        } else {
            reply.error(ENOENT);
        }
    }
    
    fn readdir(
        &mut self,
        _req: &Request,
        ino: u64,
        _fh: u64,
        offset: i64,
        mut reply: ReplyDirectory,
    ) {
        debug!("readdir: ino={}, offset={}", ino, offset);
        
        if let Some(dir_node) = self.nodes.get(&ino) {
            if dir_node.kind != FileType::Directory {
                reply.error(ENOTDIR);
                return;
            }
            
            let mut entries = vec![
                (ino, FileType::Directory, "."),
                (ino, FileType::Directory, ".."),
            ];
            
            // Add children
            for entry in self.name_to_inode.iter() {
                if entry.key().0 == ino {
                    if let Some(child) = self.nodes.get(&entry.value()) {
                        entries.push((*entry.value(), child.kind, entry.key().1.as_str()));
                    }
                }
            }
            
            for (i, (ino, kind, name)) in entries.iter().enumerate().skip(offset as usize) {
                if reply.add(*ino, (i + 1) as i64, *kind, name) {
                    break;
                }
            }
            
            reply.ok();
            self.update_vitality(ino);
        } else {
            reply.error(ENOENT);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_create_filesystem() {
        let fs = MycelialFS::new(PathBuf::from("/tmp/test-wisdom"));
        assert!(fs.nodes.contains_key(&FUSE_ROOT_ID));
    }
}