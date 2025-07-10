//! Basic renderer for Mandala UI

use std::f32::consts::PI;

pub struct MandalaRenderer {
    width: u32,
    height: u32,
    coherence: f32,
}

impl MandalaRenderer {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            width,
            height,
            coherence: 0.5,
        }
    }

    pub fn set_coherence(&mut self, coherence: f32) {
        self.coherence = coherence.clamp(0.0, 1.0);
    }

    pub fn generate_mandala_points(&self, num_points: usize) -> Vec<(f32, f32)> {
        let center_x = self.width as f32 / 2.0;
        let center_y = self.height as f32 / 2.0;
        let radius = (self.width.min(self.height) as f32 / 2.0) * self.coherence;
        
        (0..num_points)
            .map(|i| {
                let angle = (i as f32 / num_points as f32) * 2.0 * PI;
                let x = center_x + radius * angle.cos();
                let y = center_y + radius * angle.sin();
                (x, y)
            })
            .collect()
    }
}