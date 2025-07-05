// Visualization Support Module
// "Rendering the invisible patterns of consciousness"

use egui::{Color32, Pos2, Vec2, Stroke, Shape, Rect};
use colorgrad::{Gradient, CustomGradient};
use ndarray::Array2;
use rustfft::{FftPlanner, num_complex::Complex};
use std::f32::consts::PI;

/// Field renderer for consciousness visualization
pub struct FieldRenderer {
    gradient: Box<dyn Gradient>,
    resolution: usize,
    render_mode: RenderMode,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum RenderMode {
    Heatmap,
    Contour,
    VectorField,
    Particles,
    Interference,
}

impl FieldRenderer {
    pub fn new() -> Self {
        let gradient = CustomGradient::new()
            .html_colors(&["#000033", "#4B0082", "#9400D3", "#FFD700", "#FFFFFF"])
            .build()
            .unwrap();
            
        Self {
            gradient: Box::new(gradient),
            resolution: 256,
            render_mode: RenderMode::Heatmap,
        }
    }
    
    pub fn render_field(&self, painter: &egui::Painter, rect: Rect, field_data: &Array2<f32>) {
        match self.render_mode {
            RenderMode::Heatmap => self.render_heatmap(painter, rect, field_data),
            RenderMode::Contour => self.render_contours(painter, rect, field_data),
            RenderMode::VectorField => self.render_vector_field(painter, rect, field_data),
            RenderMode::Particles => self.render_particles(painter, rect, field_data),
            RenderMode::Interference => self.render_interference(painter, rect, field_data),
        }
    }
    
    fn render_heatmap(&self, painter: &egui::Painter, rect: Rect, field_data: &Array2<f32>) {
        let (height, width) = field_data.dim();
        let cell_width = rect.width() / width as f32;
        let cell_height = rect.height() / height as f32;
        
        for i in 0..height {
            for j in 0..width {
                let value = field_data[[i, j]].clamp(0.0, 1.0);
                let color = self.value_to_color(value);
                
                let x = rect.left() + j as f32 * cell_width;
                let y = rect.top() + i as f32 * cell_height;
                
                painter.rect_filled(
                    Rect::from_min_size(
                        Pos2::new(x, y),
                        Vec2::new(cell_width, cell_height)
                    ),
                    0.0,
                    color,
                );
            }
        }
    }
    
    fn render_contours(&self, painter: &egui::Painter, rect: Rect, field_data: &Array2<f32>) {
        let contour_levels = vec![0.2, 0.4, 0.6, 0.8];
        
        for &level in &contour_levels {
            let color = self.value_to_color(level);
            let points = self.find_contour_points(field_data, level, rect);
            
            if points.len() > 1 {
                for window in points.windows(2) {
                    painter.line_segment(
                        [window[0], window[1]],
                        Stroke::new(2.0, color),
                    );
                }
            }
        }
    }
    
    fn render_vector_field(&self, painter: &egui::Painter, rect: Rect, field_data: &Array2<f32>) {
        let (height, width) = field_data.dim();
        let step = 10; // Sample every 10th point
        
        for i in (0..height).step_by(step) {
            for j in (0..width).step_by(step) {
                let value = field_data[[i, j]];
                
                // Calculate gradient for vector direction
                let dx = if j < width - 1 {
                    field_data[[i, j + 1]] - value
                } else {
                    0.0
                };
                
                let dy = if i < height - 1 {
                    field_data[[i + 1, j]] - value
                } else {
                    0.0
                };
                
                let magnitude = (dx * dx + dy * dy).sqrt();
                if magnitude > 0.01 {
                    let x = rect.left() + (j as f32 / width as f32) * rect.width();
                    let y = rect.top() + (i as f32 / height as f32) * rect.height();
                    
                    let scale = 20.0;
                    let end_x = x + dx * scale;
                    let end_y = y + dy * scale;
                    
                    let color = self.value_to_color(magnitude);
                    painter.arrow(
                        Pos2::new(x, y),
                        Vec2::new(end_x - x, end_y - y),
                        Stroke::new(1.5, color),
                    );
                }
            }
        }
    }
    
    fn render_particles(&self, painter: &egui::Painter, rect: Rect, field_data: &Array2<f32>) {
        let num_particles = 1000;
        let (height, width) = field_data.dim();
        
        use rand::prelude::*;
        let mut rng = thread_rng();
        
        for _ in 0..num_particles {
            let i = rng.gen_range(0..height);
            let j = rng.gen_range(0..width);
            
            let value = field_data[[i, j]];
            if rng.gen::<f32>() < value {
                let x = rect.left() + (j as f32 / width as f32) * rect.width();
                let y = rect.top() + (i as f32 / height as f32) * rect.height();
                
                let color = self.value_to_color(value);
                let radius = 1.0 + value * 3.0;
                
                painter.circle_filled(Pos2::new(x, y), radius, color);
            }
        }
    }
    
    fn render_interference(&self, painter: &egui::Painter, rect: Rect, field_data: &Array2<f32>) {
        // Create interference pattern overlay
        let (height, width) = field_data.dim();
        
        for i in 0..height {
            for j in 0..width {
                let value = field_data[[i, j]];
                
                // Add interference based on position
                let interference = ((i as f32 * 0.1).sin() * (j as f32 * 0.1).cos()).abs();
                let combined = (value + interference * 0.3).clamp(0.0, 1.0);
                
                let x = rect.left() + (j as f32 / width as f32) * rect.width();
                let y = rect.top() + (i as f32 / height as f32) * rect.height();
                
                let color = self.value_to_color(combined);
                let size = Vec2::splat(rect.width() / width as f32);
                
                painter.rect_filled(
                    Rect::from_min_size(Pos2::new(x, y), size),
                    0.0,
                    color,
                );
            }
        }
    }
    
    fn value_to_color(&self, value: f32) -> Color32 {
        let rgba = self.gradient.at(value as f64).to_rgba8();
        Color32::from_rgba_premultiplied(rgba[0], rgba[1], rgba[2], rgba[3])
    }
    
    fn find_contour_points(&self, field_data: &Array2<f32>, level: f32, rect: Rect) -> Vec<Pos2> {
        let mut points = Vec::new();
        let (height, width) = field_data.dim();
        
        // Simple marching squares implementation
        for i in 0..height - 1 {
            for j in 0..width - 1 {
                let v00 = field_data[[i, j]];
                let v01 = field_data[[i, j + 1]];
                let v10 = field_data[[i + 1, j]];
                let v11 = field_data[[i + 1, j + 1]];
                
                // Check which edges the contour crosses
                let edges = [
                    (v00 < level && v01 >= level) || (v00 >= level && v01 < level),
                    (v01 < level && v11 >= level) || (v01 >= level && v11 < level),
                    (v11 < level && v10 >= level) || (v11 >= level && v10 < level),
                    (v10 < level && v00 >= level) || (v10 >= level && v00 < level),
                ];
                
                // Add interpolated points where contour crosses edges
                if edges.iter().any(|&e| e) {
                    let x = rect.left() + (j as f32 + 0.5) / width as f32 * rect.width();
                    let y = rect.top() + (i as f32 + 0.5) / height as f32 * rect.height();
                    points.push(Pos2::new(x, y));
                }
            }
        }
        
        points
    }
}

/// Coherence graph for time series visualization
pub struct CoherenceGraph {
    history_size: usize,
    data_series: Vec<DataSeries>,
    y_range: (f32, f32),
}

pub struct DataSeries {
    pub name: String,
    pub color: Color32,
    pub values: Vec<f32>,
}

impl CoherenceGraph {
    pub fn new(history_size: usize) -> Self {
        Self {
            history_size,
            data_series: Vec::new(),
            y_range: (0.0, 1.0),
        }
    }
    
    pub fn add_series(&mut self, name: String, color: Color32) {
        self.data_series.push(DataSeries {
            name,
            color,
            values: Vec::with_capacity(self.history_size),
        });
    }
    
    pub fn push_value(&mut self, series_index: usize, value: f32) {
        if let Some(series) = self.data_series.get_mut(series_index) {
            series.values.push(value);
            if series.values.len() > self.history_size {
                series.values.remove(0);
            }
        }
    }
    
    pub fn render(&self, painter: &egui::Painter, rect: Rect) {
        // Draw background
        painter.rect_filled(rect, 4.0, Color32::from_gray(20));
        
        // Draw grid
        self.draw_grid(painter, rect);
        
        // Draw data series
        for series in &self.data_series {
            self.draw_series(painter, rect, series);
        }
        
        // Draw legend
        self.draw_legend(painter, rect);
    }
    
    fn draw_grid(&self, painter: &egui::Painter, rect: Rect) {
        let grid_color = Color32::from_gray(40);
        let num_h_lines = 5;
        let num_v_lines = 10;
        
        // Horizontal lines
        for i in 0..=num_h_lines {
            let y = rect.top() + (i as f32 / num_h_lines as f32) * rect.height();
            painter.line_segment(
                [Pos2::new(rect.left(), y), Pos2::new(rect.right(), y)],
                Stroke::new(1.0, grid_color),
            );
        }
        
        // Vertical lines
        for i in 0..=num_v_lines {
            let x = rect.left() + (i as f32 / num_v_lines as f32) * rect.width();
            painter.line_segment(
                [Pos2::new(x, rect.top()), Pos2::new(x, rect.bottom())],
                Stroke::new(1.0, grid_color),
            );
        }
    }
    
    fn draw_series(&self, painter: &egui::Painter, rect: Rect, series: &DataSeries) {
        if series.values.len() < 2 {
            return;
        }
        
        let mut points = Vec::new();
        let x_step = rect.width() / (self.history_size - 1) as f32;
        
        for (i, &value) in series.values.iter().enumerate() {
            let x = rect.left() + i as f32 * x_step;
            let normalized = (value - self.y_range.0) / (self.y_range.1 - self.y_range.0);
            let y = rect.bottom() - normalized * rect.height();
            points.push(Pos2::new(x, y));
        }
        
        // Draw line
        for window in points.windows(2) {
            painter.line_segment(
                [window[0], window[1]],
                Stroke::new(2.0, series.color),
            );
        }
        
        // Draw points
        for point in &points {
            painter.circle_filled(*point, 3.0, series.color);
        }
    }
    
    fn draw_legend(&self, painter: &egui::Painter, rect: Rect) {
        let legend_x = rect.right() - 100.0;
        let mut legend_y = rect.top() + 10.0;
        
        for series in &self.data_series {
            painter.rect_filled(
                Rect::from_min_size(
                    Pos2::new(legend_x, legend_y),
                    Vec2::new(15.0, 15.0),
                ),
                2.0,
                series.color,
            );
            
            painter.text(
                Pos2::new(legend_x + 20.0, legend_y),
                egui::Align2::LEFT_TOP,
                &series.name,
                egui::FontId::default(),
                Color32::WHITE,
            );
            
            legend_y += 20.0;
        }
    }
}

/// Spectrum analyzer for frequency visualization
pub struct SpectrumAnalyzer {
    fft_size: usize,
    planner: FftPlanner<f32>,
    window: Vec<f32>,
    spectrum_history: Vec<Vec<f32>>,
    max_history: usize,
}

impl SpectrumAnalyzer {
    pub fn new(fft_size: usize) -> Self {
        let planner = FftPlanner::new();
        
        // Create Hann window
        let window: Vec<f32> = (0..fft_size)
            .map(|i| {
                let t = i as f32 / (fft_size - 1) as f32;
                0.5 * (1.0 - (2.0 * PI * t).cos())
            })
            .collect();
        
        Self {
            fft_size,
            planner,
            window,
            spectrum_history: Vec::new(),
            max_history: 100,
        }
    }
    
    pub fn analyze(&mut self, samples: &[f32]) -> Vec<f32> {
        let mut buffer: Vec<Complex<f32>> = samples
            .iter()
            .zip(&self.window)
            .map(|(&s, &w)| Complex::new(s * w, 0.0))
            .collect();
        
        let fft = self.planner.plan_fft_forward(self.fft_size);
        fft.process(&mut buffer);
        
        // Convert to magnitude spectrum
        let spectrum: Vec<f32> = buffer[..self.fft_size / 2]
            .iter()
            .map(|c| c.norm() / (self.fft_size as f32).sqrt())
            .collect();
        
        // Add to history
        self.spectrum_history.push(spectrum.clone());
        if self.spectrum_history.len() > self.max_history {
            self.spectrum_history.remove(0);
        }
        
        spectrum
    }
    
    pub fn render_spectrum(&self, painter: &egui::Painter, rect: Rect) {
        if let Some(spectrum) = self.spectrum_history.last() {
            let num_bins = spectrum.len();
            let bin_width = rect.width() / num_bins as f32;
            
            for (i, &magnitude) in spectrum.iter().enumerate() {
                let x = rect.left() + i as f32 * bin_width;
                let height = magnitude.log10().max(-3.0) / 3.0 + 1.0; // Normalize dB scale
                let bar_height = height * rect.height();
                
                let color = Color32::from_rgb(
                    (255.0 * height) as u8,
                    (215.0 * (1.0 - height)) as u8,
                    0,
                );
                
                painter.rect_filled(
                    Rect::from_min_size(
                        Pos2::new(x, rect.bottom() - bar_height),
                        Vec2::new(bin_width * 0.8, bar_height),
                    ),
                    0.0,
                    color,
                );
            }
        }
    }
    
    pub fn render_waterfall(&self, painter: &egui::Painter, rect: Rect) {
        let history_len = self.spectrum_history.len();
        if history_len == 0 {
            return;
        }
        
        let row_height = rect.height() / self.max_history as f32;
        
        for (time_idx, spectrum) in self.spectrum_history.iter().enumerate() {
            let y = rect.top() + (history_len - 1 - time_idx) as f32 * row_height;
            let bin_width = rect.width() / spectrum.len() as f32;
            
            for (freq_idx, &magnitude) in spectrum.iter().enumerate() {
                let x = rect.left() + freq_idx as f32 * bin_width;
                let intensity = (magnitude.log10() / 3.0 + 1.0).clamp(0.0, 1.0);
                
                let color = Color32::from_rgba_premultiplied(
                    (255.0 * intensity) as u8,
                    (215.0 * intensity) as u8,
                    0,
                    200,
                );
                
                painter.rect_filled(
                    Rect::from_min_size(
                        Pos2::new(x, y),
                        Vec2::new(bin_width, row_height),
                    ),
                    0.0,
                    color,
                );
            }
        }
    }
}

/// Pattern visualizer for sacred geometry
pub struct PatternVisualizer {
    pattern_type: PatternType,
    animation_phase: f32,
    color_mapping: ColorMapping,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PatternType {
    FlowerOfLife,
    SriYantra,
    MetatronsCube,
    GoldenSpiral,
    Torus,
}

#[derive(Debug, Clone, Copy)]
pub struct ColorMapping {
    pub base_color: Color32,
    pub highlight_color: Color32,
    pub coherence_modulation: bool,
}

impl PatternVisualizer {
    pub fn new(pattern_type: PatternType) -> Self {
        Self {
            pattern_type,
            animation_phase: 0.0,
            color_mapping: ColorMapping {
                base_color: Color32::from_rgb(255, 215, 0),
                highlight_color: Color32::from_rgb(255, 255, 255),
                coherence_modulation: true,
            },
        }
    }
    
    pub fn update(&mut self, dt: f32) {
        self.animation_phase += dt;
    }
    
    pub fn render(&self, painter: &egui::Painter, rect: Rect, coherence: f32) {
        match self.pattern_type {
            PatternType::FlowerOfLife => self.render_flower_of_life(painter, rect, coherence),
            PatternType::SriYantra => self.render_sri_yantra(painter, rect, coherence),
            PatternType::MetatronsCube => self.render_metatrons_cube(painter, rect, coherence),
            PatternType::GoldenSpiral => self.render_golden_spiral(painter, rect, coherence),
            PatternType::Torus => self.render_torus(painter, rect, coherence),
        }
    }
    
    fn render_flower_of_life(&self, painter: &egui::Painter, rect: Rect, coherence: f32) {
        let center = rect.center();
        let radius = rect.width().min(rect.height()) / 10.0;
        let stroke = self.get_stroke(coherence);
        
        // Central circle
        painter.circle_stroke(center, radius, stroke);
        
        // Six surrounding circles
        for i in 0..6 {
            let angle = i as f32 * PI / 3.0 + self.animation_phase * 0.1;
            let x = center.x + radius * 2.0 * angle.cos();
            let y = center.y + radius * 2.0 * angle.sin();
            painter.circle_stroke(Pos2::new(x, y), radius, stroke);
        }
        
        // Outer ring
        for i in 0..12 {
            let angle = i as f32 * PI / 6.0 + self.animation_phase * 0.05;
            let r = radius * 2.0 * (3.0_f32).sqrt();
            let x = center.x + r * angle.cos();
            let y = center.y + r * angle.sin();
            painter.circle_stroke(Pos2::new(x, y), radius, stroke);
        }
    }
    
    fn render_sri_yantra(&self, painter: &egui::Painter, rect: Rect, coherence: f32) {
        let center = rect.center();
        let size = rect.width().min(rect.height()) / 3.0;
        let stroke = self.get_stroke(coherence);
        
        // Nine interlocking triangles
        for i in 0..9 {
            let scale = size * (1.0 - i as f32 * 0.1);
            let rotation = self.animation_phase * 0.02 + i as f32 * 0.1;
            
            if i % 2 == 0 {
                // Upward triangle
                self.draw_triangle(painter, center, scale, rotation, stroke);
            } else {
                // Downward triangle
                self.draw_triangle(painter, center, scale, rotation + PI, stroke);
            }
        }
        
        // Bindu (center point)
        painter.circle_filled(center, 5.0 * coherence, stroke.color);
    }
    
    fn render_metatrons_cube(&self, painter: &egui::Painter, rect: Rect, coherence: f32) {
        let center = rect.center();
        let radius = rect.width().min(rect.height()) / 6.0;
        let stroke = self.get_stroke(coherence);
        
        // 13 circles and connecting lines
        let mut circles = vec![center];
        
        // Inner hexagon
        for i in 0..6 {
            let angle = i as f32 * PI / 3.0;
            circles.push(Pos2::new(
                center.x + radius * angle.cos(),
                center.y + radius * angle.sin(),
            ));
        }
        
        // Outer hexagon
        for i in 0..6 {
            let angle = i as f32 * PI / 3.0 + PI / 6.0;
            circles.push(Pos2::new(
                center.x + radius * 2.0 * angle.cos(),
                center.y + radius * 2.0 * angle.sin(),
            ));
        }
        
        // Draw all connecting lines
        for i in 0..circles.len() {
            for j in (i + 1)..circles.len() {
                painter.line_segment([circles[i], circles[j]], stroke);
            }
        }
        
        // Draw circles
        for &pos in &circles {
            painter.circle_stroke(pos, radius * 0.3, stroke);
        }
    }
    
    fn render_golden_spiral(&self, painter: &egui::Painter, rect: Rect, coherence: f32) {
        let center = rect.center();
        let stroke = self.get_stroke(coherence);
        
        let mut points = Vec::new();
        let phi = (1.0 + 5.0_f32.sqrt()) / 2.0;
        
        for i in 0..500 {
            let t = i as f32 * 0.1;
            let r = 10.0 * phi.powf(t / (2.0 * PI));
            let angle = t + self.animation_phase * 0.1;
            
            let x = center.x + r * angle.cos();
            let y = center.y + r * angle.sin();
            
            if rect.contains(Pos2::new(x, y)) {
                points.push(Pos2::new(x, y));
            }
        }
        
        // Draw spiral
        for window in points.windows(2) {
            painter.line_segment([window[0], window[1]], stroke);
        }
    }
    
    fn render_torus(&self, painter: &egui::Painter, rect: Rect, coherence: f32) {
        let center = rect.center();
        let major_radius = rect.width().min(rect.height()) / 4.0;
        let minor_radius = major_radius / 3.0;
        let stroke = self.get_stroke(coherence);
        
        // Draw torus using circles
        let num_major = 24;
        let num_minor = 12;
        
        for i in 0..num_major {
            let theta = i as f32 * 2.0 * PI / num_major as f32 + self.animation_phase * 0.05;
            
            for j in 0..num_minor {
                let phi = j as f32 * 2.0 * PI / num_minor as f32;
                
                let x = center.x + (major_radius + minor_radius * phi.cos()) * theta.cos();
                let y = center.y + (major_radius + minor_radius * phi.cos()) * theta.sin();
                let z = minor_radius * phi.sin();
                
                // Simple 3D to 2D projection
                let scale = 1.0 / (1.0 + z / 100.0);
                let proj_x = center.x + (x - center.x) * scale;
                let proj_y = center.y + (y - center.y) * scale;
                
                painter.circle_filled(
                    Pos2::new(proj_x, proj_y),
                    2.0 * scale,
                    stroke.color,
                );
            }
        }
    }
    
    fn draw_triangle(&self, painter: &egui::Painter, center: Pos2, size: f32, rotation: f32, stroke: Stroke) {
        let points = [
            Pos2::new(
                center.x + size * rotation.cos(),
                center.y + size * rotation.sin(),
            ),
            Pos2::new(
                center.x + size * (rotation + 2.0 * PI / 3.0).cos(),
                center.y + size * (rotation + 2.0 * PI / 3.0).sin(),
            ),
            Pos2::new(
                center.x + size * (rotation + 4.0 * PI / 3.0).cos(),
                center.y + size * (rotation + 4.0 * PI / 3.0).sin(),
            ),
        ];
        
        painter.add(Shape::convex_polygon(
            points.to_vec(),
            Color32::TRANSPARENT,
            stroke,
        ));
    }
    
    fn get_stroke(&self, coherence: f32) -> Stroke {
        let alpha = if self.color_mapping.coherence_modulation {
            (coherence * 255.0) as u8
        } else {
            255
        };
        
        let color = Color32::from_rgba_premultiplied(
            self.color_mapping.base_color.r(),
            self.color_mapping.base_color.g(),
            self.color_mapping.base_color.b(),
            alpha,
        );
        
        Stroke::new(2.0, color)
    }
}

impl Default for ColorMapping {
    fn default() -> Self {
        Self {
            base_color: Color32::from_rgb(255, 215, 0),
            highlight_color: Color32::from_rgb(255, 255, 255),
            coherence_modulation: true,
        }
    }
}