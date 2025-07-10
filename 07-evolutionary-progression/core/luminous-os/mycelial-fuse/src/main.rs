#!/usr/bin/env rust
//! Mycelial FUSE Filesystem - Living, relationship-aware filesystem
//! 
//! Usage: mycelial-mount <mountpoint> [options]

use std::path::PathBuf;
use std::env;
use fuser::MountOption;
use log::info;

mod mycelial_fs;
use mycelial_fs::MycelialFS;

fn main() {
    env_logger::init();
    
    let args: Vec<String> = env::args().collect();
    
    if args.len() < 2 {
        eprintln!("Usage: {} <mountpoint> [options]", args[0]);
        eprintln!("\nOptions:");
        eprintln!("  --wisdom-path <path>   Path to store wisdom database");
        eprintln!("  --debug                Enable debug logging");
        std::process::exit(1);
    }
    
    let mountpoint = PathBuf::from(&args[1]);
    let wisdom_path = args.iter()
        .position(|arg| arg == "--wisdom-path")
        .and_then(|i| args.get(i + 1))
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("/tmp/mycelial-wisdom"));
    
    // Create the filesystem
    let fs = MycelialFS::new(wisdom_path);
    
    info!("🍄 Mounting Mycelial Filesystem at {:?}", mountpoint);
    info!("   Living connections will grow...");
    
    // Mount options
    let options = vec![
        MountOption::RO,           // Read-only for now
        MountOption::FSName("mycelial".to_string()),
        MountOption::Subtype("mycelial-fuse".to_string()),
        MountOption::AllowOther,   // Allow other users
        MountOption::AutoUnmount,  // Cleanup on exit
    ];
    
    // Mount the filesystem
    match fuser::mount2(fs, &mountpoint, &options) {
        Ok(_) => info!("🌟 Mycelial network established"),
        Err(e) => {
            eprintln!("Failed to mount filesystem: {}", e);
            std::process::exit(1);
        }
    }
}