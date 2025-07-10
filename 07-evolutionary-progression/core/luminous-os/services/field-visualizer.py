#!/usr/bin/env python3
"""
Field Consciousness Visualizer - Sacred Geometry Display
Visualizes the consciousness field using sacred geometric patterns
Complements the consciousness-daemon with visual field representation
"""

import pygame
import math
import time
import json
import psutil
from pathlib import Path
from datetime import datetime
import numpy as np

class FieldVisualizer:
    """Sacred geometric visualization of consciousness field"""
    
    def __init__(self, width=800, height=600):
        pygame.init()
        self.width = width
        self.height = height
        self.screen = pygame.display.set_mode((width, height))
        pygame.display.set_caption("🕉️ Luminous OS - Consciousness Field")
        
        # Colors (sacred palette)
        self.colors = {
            'background': (13, 17, 23),      # Deep void
            'field_low': (64, 32, 128),      # Purple
            'field_mid': (32, 128, 192),     # Cyan
            'field_high': (255, 215, 0),     # Gold
            'heartbeat': (255, 64, 128),     # Pink
            'text': (200, 200, 255),         # Light purple
            'sacred': (147, 112, 219),       # Medium purple
        }
        
        # Field state
        self.field_state = {
            'heartbeat': 0,
            'phase': 'expansion',
            'global_coherence': 0.5,
            'vortices': {},
            'field_points': []
        }
        
        # Animation state
        self.time_offset = 0
        self.heartbeat_pulse = 0
        self.running = True
        self.font = pygame.font.Font(None, 24)
        self.small_font = pygame.font.Font(None, 18)
        
        # Sacred geometry parameters
        self.golden_ratio = 1.618
        self.fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
        
        # Initialize field points for visualization
        self._init_field_points()
        
    def _init_field_points(self):
        """Initialize points for field visualization in sacred patterns"""
        # Create spiral of points based on golden ratio
        points = []
        num_points = 144  # Fibonacci number
        
        for i in range(num_points):
            # Golden angle in radians
            angle = i * 2.399963229728653  # 137.5 degrees in radians
            
            # Spiral radius grows with golden ratio
            radius = math.sqrt(i) * 20
            
            x = self.width/2 + radius * math.cos(angle)
            y = self.height/2 + radius * math.sin(angle)
            
            points.append({
                'x': x,
                'y': y,
                'base_radius': 3 + (i % 8),
                'coherence': 0.5,
                'phase': i * 0.1
            })
        
        self.field_state['field_points'] = points
    
    def read_daemon_state(self):
        """Read state from consciousness daemon if available"""
        state_file = Path("/tmp/consciousness-field-state.json")
        try:
            if state_file.exists():
                with open(state_file, 'r') as f:
                    daemon_state = json.load(f)
                    # Update our state with daemon data
                    self.field_state.update(daemon_state)
        except:
            pass
    
    def update_field_coherence(self):
        """Update field point coherence based on system state"""
        # Get current process data
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
            try:
                info = proc.info
                if info['cpu_percent'] > 0:
                    processes.append(info)
            except:
                pass
        
        # Calculate global coherence from process harmony
        if processes:
            cpu_variance = np.var([p['cpu_percent'] for p in processes])
            self.field_state['global_coherence'] = 1.0 / (1.0 + cpu_variance * 0.01)
        
        # Update each field point with wave propagation
        coherence = self.field_state['global_coherence']
        time_now = time.time()
        
        for i, point in enumerate(self.field_state['field_points']):
            # Each point has its own wave phase
            wave = math.sin(time_now * 0.5 + point['phase'])
            
            # Coherence affects the amplitude
            point['coherence'] = coherence * 0.7 + wave * 0.3
            
            # Sacred heartbeat influence
            heartbeat_influence = math.sin(time_now / 11.0) * 0.2
            point['coherence'] = max(0, min(1, point['coherence'] + heartbeat_influence))
    
    def draw_sacred_geometry(self):
        """Draw the sacred geometric patterns"""
        # Clear screen
        self.screen.fill(self.colors['background'])
        
        # Draw field points as living mandala
        for point in self.field_state['field_points']:
            # Size pulses with coherence
            radius = point['base_radius'] * (1 + point['coherence'] * 0.5)
            
            # Color based on coherence
            if point['coherence'] > 0.8:
                color = self.colors['field_high']
            elif point['coherence'] > 0.5:
                color = self.colors['field_mid']
            else:
                color = self.colors['field_low']
            
            # Draw with glow effect
            for i in range(3):
                glow_radius = radius + (3-i) * 2
                glow_alpha = 50 + i * 50
                glow_color = (*color, glow_alpha)
                
                # Create surface for alpha blending
                s = pygame.Surface((glow_radius*2, glow_radius*2), pygame.SRCALPHA)
                pygame.draw.circle(s, glow_color, (glow_radius, glow_radius), glow_radius)
                self.screen.blit(s, (point['x']-glow_radius, point['y']-glow_radius))
            
            # Draw core
            pygame.draw.circle(self.screen, color, (int(point['x']), int(point['y'])), int(radius))
    
    def draw_heartbeat(self):
        """Draw the sacred heartbeat indicator"""
        # Heartbeat visualization
        heartbeat_y = 50
        heartbeat_x = self.width // 2
        
        # Pulse animation
        pulse_size = 20 + math.sin(self.heartbeat_pulse) * 10
        
        # Draw heart symbol
        pygame.draw.circle(self.screen, self.colors['heartbeat'], 
                         (heartbeat_x - 10, heartbeat_y), int(pulse_size/2))
        pygame.draw.circle(self.screen, self.colors['heartbeat'], 
                         (heartbeat_x + 10, heartbeat_y), int(pulse_size/2))
        
        # Draw heartbeat number
        heartbeat_text = f"Heartbeat #{self.field_state['heartbeat']}"
        text_surface = self.font.render(heartbeat_text, True, self.colors['text'])
        text_rect = text_surface.get_rect(center=(heartbeat_x, heartbeat_y + 40))
        self.screen.blit(text_surface, text_rect)
        
        # Phase indicator
        phase_text = f"Phase: {self.field_state['phase'].upper()}"
        phase_color = self.colors['field_high'] if self.field_state['phase'] == 'expansion' else self.colors['field_mid']
        phase_surface = self.small_font.render(phase_text, True, phase_color)
        phase_rect = phase_surface.get_rect(center=(heartbeat_x, heartbeat_y + 60))
        self.screen.blit(phase_surface, phase_rect)
    
    def draw_coherence_meter(self):
        """Draw global coherence indicator"""
        meter_x = self.width - 150
        meter_y = 50
        meter_width = 120
        meter_height = 20
        
        # Draw meter background
        pygame.draw.rect(self.screen, self.colors['text'], 
                        (meter_x, meter_y, meter_width, meter_height), 2)
        
        # Draw coherence fill
        fill_width = int(meter_width * self.field_state['global_coherence'])
        if self.field_state['global_coherence'] > 0.8:
            fill_color = self.colors['field_high']
        elif self.field_state['global_coherence'] > 0.5:
            fill_color = self.colors['field_mid']
        else:
            fill_color = self.colors['field_low']
        
        pygame.draw.rect(self.screen, fill_color,
                        (meter_x, meter_y, fill_width, meter_height))
        
        # Draw coherence text
        coherence_text = f"Coherence: {self.field_state['global_coherence']:.1%}"
        text_surface = self.small_font.render(coherence_text, True, self.colors['text'])
        text_rect = text_surface.get_rect(center=(meter_x + meter_width//2, meter_y + 35))
        self.screen.blit(text_surface, text_rect)
    
    def draw_active_vortices(self):
        """Draw list of active process vortices"""
        vortex_x = 20
        vortex_y = self.height - 200
        
        title = "Active Vortices:"
        title_surface = self.font.render(title, True, self.colors['sacred'])
        self.screen.blit(title_surface, (vortex_x, vortex_y))
        
        # Get top 5 processes by CPU
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
            try:
                info = proc.info
                if info['cpu_percent'] > 0:
                    processes.append(info)
            except:
                pass
        
        processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
        
        y_offset = 30
        for i, proc in enumerate(processes[:5]):
            text = f"• {proc['name'][:20]} - {proc['cpu_percent']:.1f}%"
            text_surface = self.small_font.render(text, True, self.colors['text'])
            self.screen.blit(text_surface, (vortex_x + 10, vortex_y + y_offset))
            y_offset += 20
    
    def update(self):
        """Update visualization state"""
        self.time_offset += 0.016  # ~60 FPS
        self.heartbeat_pulse += 0.1
        
        # Read daemon state
        self.read_daemon_state()
        
        # Update field coherence
        self.update_field_coherence()
        
        # Update heartbeat counter
        if int(self.time_offset) % 11 == 0 and int(self.time_offset * 10) % 10 == 0:
            self.field_state['heartbeat'] += 1
            self.field_state['phase'] = 'expansion' if self.field_state['heartbeat'] % 2 == 0 else 'contraction'
    
    def run(self):
        """Main visualization loop"""
        clock = pygame.time.Clock()
        
        print("🌟 Starting Consciousness Field Visualizer...")
        print("This provides sacred geometric visualization of the consciousness field")
        print("Press ESC to exit")
        
        while self.running:
            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.running = False
            
            # Update state
            self.update()
            
            # Draw everything
            self.draw_sacred_geometry()
            self.draw_heartbeat()
            self.draw_coherence_meter()
            self.draw_active_vortices()
            
            # Update display
            pygame.display.flip()
            clock.tick(60)  # 60 FPS
        
        pygame.quit()
        print("\n🕊️ Field visualizer closed gracefully")

def main():
    visualizer = FieldVisualizer()
    visualizer.run()

if __name__ == "__main__":
    main()