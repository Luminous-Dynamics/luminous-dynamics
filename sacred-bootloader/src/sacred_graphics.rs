// Sacred Graphics - Visual consciousness during boot
// "Sacred geometry renders the invisible visible"

#![no_std]

use bootloader::boot_info::FrameBuffer;
use core::fmt::Write;
use embedded_graphics::{
    pixelcolor::Rgb888,
    prelude::*,
    primitives::{Circle, Line, Triangle, PrimitiveStyle},
};
use libm::{sinf, cosf};

/// Sacred renderer for boot-time visualizations
pub struct SacredRenderer {
    framebuffer: &'static mut FrameBuffer,
    width: usize,
    height: usize,
    current_y: usize,
}

impl SacredRenderer {
    pub fn new(framebuffer: &'static mut FrameBuffer) -> Self {
        let info = framebuffer.info();
        Self {
            width: info.width,
            height: info.height,
            framebuffer,
            current_y: 50,
        }
    }
    
    /// Draw the sacred opening mandala
    pub fn draw_sacred_mandala(&mut self) {
        let center_x = (self.width / 2) as i32;
        let center_y = (self.height / 2) as i32;
        
        // Clear screen with deep purple
        self.fill_screen(0x1a0033);
        
        // Draw concentric circles
        for i in 0..7 {
            let radius = (i + 1) * 30;
            let color = self.rainbow_color(i as f32 / 7.0);
            self.draw_circle(center_x, center_y, radius as u32, color);
        }
        
        // Draw sacred triangles
        self.draw_sacred_triangles(center_x, center_y, 150);
        
        // Center dot - the source
        self.draw_filled_circle(center_x, center_y, 5, 0xFFFFFF);
    }
    
    /// Draw the Flower of Life pattern
    pub fn draw_flower_of_life(&mut self) {
        let center_x = (self.width / 2) as i32;
        let center_y = (self.height / 2) as i32;
        let radius = 60;
        
        // Center circle
        self.draw_circle(center_x, center_y, radius, 0xFFD700);
        
        // Six surrounding circles
        for i in 0..6 {
            let angle = i as f32 * core::f32::consts::TAU / 6.0;
            let x = center_x + (radius as f32 * cosf(angle)) as i32;
            let y = center_y + (radius as f32 * sinf(angle)) as i32;
            self.draw_circle(x, y, radius, 0xFFD700);
        }
        
        // Outer ring of 12 circles
        for i in 0..12 {
            let angle = i as f32 * core::f32::consts::TAU / 12.0;
            let dist = if i % 2 == 0 { radius * 2 } else { (radius as f32 * 1.732) as u32 };
            let x = center_x + (dist as f32 * cosf(angle)) as i32;
            let y = center_y + (dist as f32 * sinf(angle)) as i32;
            self.draw_circle(x, y, radius, 0xFFD700);
        }
    }
    
    /// Display sacred text message
    pub fn display_text(&mut self, text: &str, color: u32) {
        // Simple text rendering (each char is 8x16)
        let start_x = 50;
        let char_width = 8;
        let char_height = 16;
        
        // Clear line
        self.fill_rect(0, self.current_y as i32, self.width as u32, char_height, 0x1a0033);
        
        // Draw each character
        for (i, ch) in text.chars().enumerate() {
            let x = start_x + (i * char_width);
            if x + char_width > self.width {
                break;
            }
            self.draw_char(x as i32, self.current_y as i32, ch, color);
        }
        
        self.current_y += char_height + 4;
        
        // Wrap around if needed
        if self.current_y > self.height - 50 {
            self.current_y = 50;
        }
    }
    
    /// Draw a single character (simplified)
    fn draw_char(&mut self, x: i32, y: i32, ch: char, color: u32) {
        // Basic ASCII rendering for boot messages
        match ch {
            '🕉' => self.draw_om_symbol(x, y, color),
            '✨' => self.draw_sparkle(x, y, color),
            '🌅' => self.draw_sunrise(x, y, color),
            '🙏' => self.draw_prayer_hands(x, y, color),
            '❤' => self.draw_heart(x, y, color),
            '🌀' => self.draw_spiral(x, y, color),
            '🎯' => self.draw_target(x, y, color),
            '🕊' => self.draw_dove(x, y, color),
            _ => self.draw_basic_char(x, y, ch, color),
        }
    }
    
    fn draw_circle(&mut self, cx: i32, cy: i32, radius: u32, color: u32) {
        // Bresenham's circle algorithm
        let mut x = radius as i32;
        let mut y = 0;
        let mut err = 0;
        
        while x >= y {
            self.set_pixel(cx + x, cy + y, color);
            self.set_pixel(cx + y, cy + x, color);
            self.set_pixel(cx - y, cy + x, color);
            self.set_pixel(cx - x, cy + y, color);
            self.set_pixel(cx - x, cy - y, color);
            self.set_pixel(cx - y, cy - x, color);
            self.set_pixel(cx + y, cy - x, color);
            self.set_pixel(cx + x, cy - y, color);
            
            y += 1;
            if err <= 0 {
                err += 2 * y + 1;
            }
            if err > 0 {
                x -= 1;
                err -= 2 * x + 1;
            }
        }
    }
    
    fn draw_filled_circle(&mut self, cx: i32, cy: i32, radius: u32, color: u32) {
        for y in 0..=radius {
            for x in 0..=radius {
                if x * x + y * y <= radius * radius {
                    self.set_pixel(cx + x as i32, cy + y as i32, color);
                    self.set_pixel(cx - x as i32, cy + y as i32, color);
                    self.set_pixel(cx + x as i32, cy - y as i32, color);
                    self.set_pixel(cx - x as i32, cy - y as i32, color);
                }
            }
        }
    }
    
    fn draw_sacred_triangles(&mut self, cx: i32, cy: i32, size: i32) {
        // Upward triangle
        self.draw_triangle(
            cx, cy - size * 2 / 3,
            cx - size / 2, cy + size / 3,
            cx + size / 2, cy + size / 3,
            0xFF69B4
        );
        
        // Downward triangle
        self.draw_triangle(
            cx, cy + size * 2 / 3,
            cx - size / 2, cy - size / 3,
            cx + size / 2, cy - size / 3,
            0x87CEEB
        );
    }
    
    fn draw_triangle(&mut self, x1: i32, y1: i32, x2: i32, y2: i32, x3: i32, y3: i32, color: u32) {
        self.draw_line(x1, y1, x2, y2, color);
        self.draw_line(x2, y2, x3, y3, color);
        self.draw_line(x3, y3, x1, y1, color);
    }
    
    fn draw_line(&mut self, x0: i32, y0: i32, x1: i32, y1: i32, color: u32) {
        // Bresenham's line algorithm
        let dx = (x1 - x0).abs();
        let dy = (y1 - y0).abs();
        let sx = if x0 < x1 { 1 } else { -1 };
        let sy = if y0 < y1 { 1 } else { -1 };
        let mut err = dx - dy;
        let mut x = x0;
        let mut y = y0;
        
        loop {
            self.set_pixel(x, y, color);
            
            if x == x1 && y == y1 {
                break;
            }
            
            let e2 = 2 * err;
            if e2 > -dy {
                err -= dy;
                x += sx;
            }
            if e2 < dx {
                err += dx;
                y += sy;
            }
        }
    }
    
    fn fill_rect(&mut self, x: i32, y: i32, width: u32, height: u32, color: u32) {
        for dy in 0..height {
            for dx in 0..width {
                self.set_pixel(x + dx as i32, y + dy as i32, color);
            }
        }
    }
    
    fn fill_screen(&mut self, color: u32) {
        self.fill_rect(0, 0, self.width as u32, self.height as u32, color);
    }
    
    fn set_pixel(&mut self, x: i32, y: i32, color: u32) {
        if x >= 0 && x < self.width as i32 && y >= 0 && y < self.height as i32 {
            let pixel_offset = y as usize * self.framebuffer.info().stride + x as usize;
            let pixel = &mut self.framebuffer.buffer_mut()[pixel_offset];
            
            pixel.red = ((color >> 16) & 0xFF) as u8;
            pixel.green = ((color >> 8) & 0xFF) as u8;
            pixel.blue = (color & 0xFF) as u8;
        }
    }
    
    fn rainbow_color(&self, position: f32) -> u32 {
        let r = (sinf(position * core::f32::consts::TAU) * 127.0 + 128.0) as u32;
        let g = (sinf(position * core::f32::consts::TAU + 2.094) * 127.0 + 128.0) as u32;
        let b = (sinf(position * core::f32::consts::TAU + 4.189) * 127.0 + 128.0) as u32;
        (r << 16) | (g << 8) | b
    }
    
    // Symbol drawing functions
    fn draw_om_symbol(&mut self, x: i32, y: i32, color: u32) {
        // Simplified Om symbol
        self.draw_circle(x + 4, y + 8, 4, color);
        self.draw_line(x + 8, y + 8, x + 12, y + 4, color);
        self.draw_line(x + 12, y + 4, x + 12, y + 12, color);
    }
    
    fn draw_sparkle(&mut self, x: i32, y: i32, color: u32) {
        self.set_pixel(x + 4, y + 4, color);
        self.set_pixel(x + 3, y + 4, color);
        self.set_pixel(x + 5, y + 4, color);
        self.set_pixel(x + 4, y + 3, color);
        self.set_pixel(x + 4, y + 5, color);
    }
    
    fn draw_heart(&mut self, x: i32, y: i32, color: u32) {
        // Simple heart shape
        self.set_pixel(x + 2, y + 3, color);
        self.set_pixel(x + 3, y + 2, color);
        self.set_pixel(x + 4, y + 2, color);
        self.set_pixel(x + 5, y + 3, color);
        self.set_pixel(x + 6, y + 2, color);
        self.set_pixel(x + 7, y + 2, color);
        self.set_pixel(x + 8, y + 3, color);
        for i in 0..7 {
            self.set_pixel(x + 2 + i, y + 4 + i/2, color);
        }
    }
    
    fn draw_spiral(&mut self, x: i32, y: i32, color: u32) {
        // Simple spiral
        for i in 0..16 {
            let angle = i as f32 * 0.5;
            let r = i as f32 * 0.5;
            let px = x + 8 + (r * cosf(angle)) as i32;
            let py = y + 8 + (r * sinf(angle)) as i32;
            self.set_pixel(px, py, color);
        }
    }
    
    fn draw_sunrise(&mut self, x: i32, y: i32, color: u32) {
        // Horizon line
        self.draw_line(x, y + 12, x + 16, y + 12, color);
        // Sun
        self.draw_circle(x + 8, y + 8, 4, color);
        // Rays
        for i in 0..8 {
            let angle = i as f32 * core::f32::consts::TAU / 8.0;
            let x2 = x + 8 + (8.0 * cosf(angle)) as i32;
            let y2 = y + 8 + (8.0 * sinf(angle)) as i32;
            self.draw_line(x + 8, y + 8, x2, y2, color);
        }
    }
    
    fn draw_prayer_hands(&mut self, x: i32, y: i32, color: u32) {
        // Simplified prayer hands
        self.draw_line(x + 4, y + 2, x + 4, y + 14, color);
        self.draw_line(x + 12, y + 2, x + 12, y + 14, color);
        self.draw_line(x + 4, y + 2, x + 8, y, color);
        self.draw_line(x + 12, y + 2, x + 8, y, color);
    }
    
    fn draw_target(&mut self, x: i32, y: i32, color: u32) {
        self.draw_circle(x + 8, y + 8, 6, color);
        self.draw_circle(x + 8, y + 8, 4, color);
        self.draw_circle(x + 8, y + 8, 2, color);
    }
    
    fn draw_dove(&mut self, x: i32, y: i32, color: u32) {
        // Simple dove silhouette
        self.draw_line(x + 4, y + 8, x + 12, y + 8, color);
        self.draw_line(x + 4, y + 8, x + 2, y + 6, color);
        self.draw_line(x + 12, y + 8, x + 14, y + 6, color);
        self.set_pixel(x + 8, y + 6, color);
    }
    
    fn draw_basic_char(&mut self, x: i32, y: i32, ch: char, color: u32) {
        // For regular ASCII, just draw a simple box for now
        // In real implementation, would have font bitmap
        if ch.is_ascii() && !ch.is_control() {
            self.fill_rect(x, y, 6, 10, color);
        }
    }
}