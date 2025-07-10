//! Mycelial Filesystem - Living, relationship-aware filesystem
//! 
//! Tracks connections between files like mycelial networks in nature

pub mod mycelial_core;
pub mod nutrient_flow;

pub use mycelial_core::MycelialFilesystem;
pub use nutrient_flow::NutrientTracker;