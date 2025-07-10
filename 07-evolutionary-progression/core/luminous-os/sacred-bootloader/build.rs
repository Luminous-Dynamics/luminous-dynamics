// Build script for Sacred Bootloader
use std::path::Path;

fn main() {
    // Set up bootloader build
    let kernel_path = Path::new("../target/x86_64-sacred_boot/release/sacred-bootloader");
    
    // Configure bootloader
    let mut config = bootloader::Config::default();
    config.frame_buffer_logging = false; // We handle our own graphics
    
    // Build bootloader
    bootloader::build(kernel_path, &config).unwrap();
    
    // Link UEFI runtime
    println!("cargo:rustc-link-arg-bins=--script=uefi_link.x");
    
    // Set sacred build flags
    println!("cargo:rustc-env=SACRED_BUILD=1");
    println!("cargo:rustc-env=COHERENCE_TARGET=0.8");
}