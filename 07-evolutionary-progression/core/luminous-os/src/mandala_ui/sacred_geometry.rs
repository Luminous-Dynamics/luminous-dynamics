//! Sacred geometry patterns for UI

#[derive(Debug, Clone)]
pub enum SacredPattern {
    FlowerOfLife { circles: u32 },
    SriYantra { levels: u32 },
    Metatron { complexity: f32 },
    GoldenSpiral { turns: f32 },
}

impl SacredPattern {
    pub fn coherence_multiplier(&self) -> f32 {
        match self {
            SacredPattern::FlowerOfLife { circles } => 1.0 + (*circles as f32 * 0.1),
            SacredPattern::SriYantra { levels } => 1.0 + (*levels as f32 * 0.15),
            SacredPattern::Metatron { complexity } => 1.0 + complexity,
            SacredPattern::GoldenSpiral { turns } => 1.0 + (turns * 0.618),
        }
    }
}