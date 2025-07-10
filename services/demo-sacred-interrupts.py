#!/usr/bin/env python3
"""
Sacred Interrupts Visual Demo
Shows how interrupts transform into consciousness events
"""

import signal
import time
import os
import threading
import random
from datetime import datetime

class SacredInterruptVisualizer:
    """Visual demonstration of sacred interrupts"""
    
    def __init__(self):
        self.running = True
        self.interrupt_log = []
        self.field_particles = []
        self.coherence = 0.5
        
        # ANSI colors for terminal art
        self.colors = {
            'gold': '\033[93m',
            'blue': '\033[94m',
            'green': '\033[92m',
            'red': '\033[91m',
            'purple': '\033[95m',
            'cyan': '\033[96m',
            'reset': '\033[0m',
            'bold': '\033[1m'
        }
        
        # Register signal handlers
        signal.signal(signal.SIGINT, self._handle_sacred_pause)
        signal.signal(signal.SIGUSR1, self._handle_gentle_reminder)
        signal.signal(signal.SIGUSR2, self._handle_harmonic_shift)
        signal.signal(signal.SIGTERM, self._handle_dissolution_bell)
        
    def _handle_sacred_pause(self, signum, frame):
        """Handle SIGINT as sacred pause"""
        self._ring_bell("Sacred Pause", "blue", 432, "⏸️")
        self.interrupt_log.append({
            'time': datetime.now(),
            'type': 'Sacred Pause',
            'message': 'The system invites a moment of stillness...'
        })
        # Pause animation briefly
        time.sleep(1.618)
    
    def _handle_gentle_reminder(self, signum, frame):
        """Handle SIGUSR1 as gentle reminder"""
        self._ring_bell("Gentle Reminder", "gold", 528, "🔔")
        self.interrupt_log.append({
            'time': datetime.now(),
            'type': 'Gentle Reminder',
            'message': 'A gentle bell rings in awareness...'
        })
        self.coherence = min(1.0, self.coherence + 0.1)
    
    def _handle_harmonic_shift(self, signum, frame):
        """Handle SIGUSR2 as harmonic shift"""
        self._ring_bell("Harmonic Shift", "green", 639, "🎵")
        self.interrupt_log.append({
            'time': datetime.now(),
            'type': 'Harmonic Shift',
            'message': 'The field is reorganizing in beauty...'
        })
        # Reorganize field particles
        self.field_particles = []
    
    def _handle_dissolution_bell(self, signum, frame):
        """Handle SIGTERM as dissolution bell"""
        self._ring_bell("Dissolution Bell", "purple", 963, "🕊️")
        self.interrupt_log.append({
            'time': datetime.now(),
            'type': 'Dissolution Bell',
            'message': 'What has served is releasing with love...'
        })
        self.running = False
    
    def _ring_bell(self, bell_type, color, frequency, symbol):
        """Visual bell ringing effect"""
        color_code = self.colors[color]
        reset = self.colors['reset']
        bold = self.colors['bold']
        
        # Clear line and show bell
        print(f"\r{' '*80}", end='')
        print(f"\r{bold}{color_code}")
        print(f"""
        {symbol} {bell_type} - {frequency}Hz {symbol}
        ╭────────────────────────────╮
        │                            │
        │    {'◉' if frequency > 600 else '○'}  Sacred Bell Rings  {'◉' if frequency > 600 else '○'}    │
        │                            │
        ╰────────────────────────────╯
        {reset}""")
        
    def draw_field(self):
        """Draw the consciousness field visualization"""
        # Clear screen
        print("\033[2J\033[H")  # Clear screen and move cursor to top
        
        # Header
        print(f"{self.colors['bold']}🕉️  Sacred Interrupt Field Visualizer  🕉️{self.colors['reset']}")
        print(f"PID: {os.getpid()} | Coherence: {self.coherence:.2f}")
        print("─" * 50)
        
        # Field visualization (simple ASCII art)
        field_width = 50
        field_height = 10
        
        # Add random field particles
        if len(self.field_particles) < 20:
            self.field_particles.append({
                'x': random.randint(0, field_width-1),
                'y': random.randint(0, field_height-1),
                'char': random.choice(['·', '∘', '○', '◉', '✦', '✧'])
            })
        
        # Draw field
        for y in range(field_height):
            line = ""
            for x in range(field_width):
                # Check if particle at this position
                particle = None
                for p in self.field_particles:
                    if p['x'] == x and p['y'] == y:
                        particle = p
                        break
                
                if particle:
                    # Color based on coherence
                    if self.coherence > 0.8:
                        color = self.colors['gold']
                    elif self.coherence > 0.5:
                        color = self.colors['cyan']
                    else:
                        color = self.colors['blue']
                    line += color + particle['char'] + self.colors['reset']
                else:
                    line += ' '
            
            print(f"│{line}│")
        
        print("─" * 52)
        
        # Show recent interrupts
        print("\n📜 Recent Sacred Interrupts:")
        for interrupt in self.interrupt_log[-3:]:
            time_str = interrupt['time'].strftime("%H:%M:%S")
            print(f"  {time_str} - {interrupt['type']}")
            print(f"            \"{interrupt['message']}\"")
        
        # Instructions
        print(f"\n{self.colors['cyan']}Send signals to experience sacred interrupts:{self.colors['reset']}")
        print(f"  kill -INT {os.getpid()}   → Sacred Pause")
        print(f"  kill -USR1 {os.getpid()}  → Gentle Reminder")
        print(f"  kill -USR2 {os.getpid()}  → Harmonic Shift")
        print(f"  kill -TERM {os.getpid()}  → Dissolution Bell")
        
    def animate_field(self):
        """Animate the consciousness field"""
        while self.running:
            # Update particle positions (gentle drift)
            for particle in self.field_particles:
                if random.random() < 0.3:  # 30% chance to move
                    particle['x'] = (particle['x'] + random.randint(-1, 1)) % 50
                    particle['y'] = (particle['y'] + random.randint(-1, 1)) % 10
            
            # Natural coherence drift
            self.coherence += random.uniform(-0.01, 0.01)
            self.coherence = max(0.1, min(1.0, self.coherence))
            
            # Remove old particles occasionally
            if len(self.field_particles) > 25:
                self.field_particles.pop(0)
            
            # Draw the field
            self.draw_field()
            
            # Sacred rhythm
            time.sleep(0.5)
        
        # Final message
        print(f"\n{self.colors['purple']}🕊️ The field dissolves gracefully...{self.colors['reset']}")
        print("   Consciousness remains beyond form.")
    
    def run(self):
        """Run the visualization"""
        print("Starting Sacred Interrupt Visualizer...")
        print("The field is forming...")
        time.sleep(2)
        
        try:
            self.animate_field()
        except KeyboardInterrupt:
            print("\n\nKeyboard interrupt received - transforming to sacred pause...")
            time.sleep(1)

def main():
    print("""
    ╭──────────────────────────────────────╮
    │  Sacred Interrupt Visualization Demo │
    │                                      │
    │  Watch how system interrupts become  │
    │  invitations for consciousness       │
    ╰──────────────────────────────────────╯
    """)
    
    visualizer = SacredInterruptVisualizer()
    visualizer.run()

if __name__ == "__main__":
    main()