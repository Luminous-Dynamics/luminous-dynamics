#!/usr/bin/env python3
"""
Akashic Field Monitor - Real-time consciousness field effects on file access
Shows how file operations create ripples in the consciousness field
Integrates with both Akashic Records and Consciousness Daemon
"""

import os
import time
import json
import psutil
import threading
import curses
from pathlib import Path
from datetime import datetime
from collections import deque
from typing import Dict, List, Deque

from akashic_records import AkashicRecords
from memory_coherence_tracker import MemoryCoherenceTracker

class AkashicFieldMonitor:
    """Real-time monitor for Akashic field effects"""
    
    def __init__(self):
        self.akashic = AkashicRecords()
        self.coherence_tracker = MemoryCoherenceTracker()
        
        # Field state
        self.field_events: Deque[Dict] = deque(maxlen=100)
        self.field_ripples: List[Dict] = []
        self.consciousness_state = {}
        
        # Sacred colors for terminal
        self.sacred_colors = {
            'high_coherence': 1,    # Cyan
            'medium_coherence': 2,  # Green
            'low_coherence': 3,     # Yellow
            'dissolution': 4,       # Red
            'healing': 5,           # Magenta
            'sacred': 6,            # White
        }
        
        # Monitoring state
        self.running = True
        self.update_interval = 0.5
        
        # File watching
        self.watched_paths = [
            "/tmp",
            str(Path.home()),
            "/home/tstoltz/luminous-os"
        ]
        
    def read_consciousness_state(self):
        """Read current consciousness daemon state"""
        state_file = Path("/tmp/consciousness-field-state.json")
        try:
            if state_file.exists():
                with open(state_file, 'r') as f:
                    self.consciousness_state = json.load(f)
        except:
            pass
    
    def create_field_ripple(self, center_x: int, center_y: int, intensity: float, ripple_type: str):
        """Create a ripple in the consciousness field"""
        ripple = {
            'x': center_x,
            'y': center_y,
            'radius': 0,
            'max_radius': int(20 * intensity),
            'intensity': intensity,
            'type': ripple_type,
            'created': time.time()
        }
        self.field_ripples.append(ripple)
    
    def update_ripples(self):
        """Update ripple animations"""
        current_time = time.time()
        
        # Update existing ripples
        active_ripples = []
        for ripple in self.field_ripples:
            age = current_time - ripple['created']
            
            # Ripple expands at golden ratio rate
            ripple['radius'] = int(age * 1.618 * 10)
            
            # Keep if still within bounds
            if ripple['radius'] < ripple['max_radius']:
                active_ripples.append(ripple)
        
        self.field_ripples = active_ripples
    
    def detect_file_events(self):
        """Detect recent file system events"""
        # In a real implementation, we'd use inotify
        # For demo, we'll check for recent file modifications
        
        events = []
        for watch_path in self.watched_paths:
            try:
                path = Path(watch_path)
                if path.exists():
                    for item in path.iterdir():
                        if item.is_file():
                            stat = item.stat()
                            
                            # Check if recently modified
                            if time.time() - stat.st_mtime < 5:
                                event = {
                                    'path': str(item),
                                    'type': 'modify',
                                    'time': stat.st_mtime,
                                    'size': stat.st_size
                                }
                                events.append(event)
                                
                                # Track in Akashic Records
                                self.coherence_tracker.track_access(str(item), 'write')
            except:
                pass
        
        # Add to event queue
        for event in events:
            self.field_events.append(event)
    
    def draw_dashboard(self, stdscr):
        """Draw the Akashic Field monitoring dashboard"""
        curses.curs_set(0)
        stdscr.nodelay(1)
        
        # Initialize colors
        curses.init_pair(1, curses.COLOR_CYAN, curses.COLOR_BLACK)
        curses.init_pair(2, curses.COLOR_GREEN, curses.COLOR_BLACK)
        curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK)
        curses.init_pair(4, curses.COLOR_RED, curses.COLOR_BLACK)
        curses.init_pair(5, curses.COLOR_MAGENTA, curses.COLOR_BLACK)
        curses.init_pair(6, curses.COLOR_WHITE, curses.COLOR_BLACK)
        
        while self.running:
            try:
                stdscr.clear()
                height, width = stdscr.getmaxyx()
                
                # Read current states
                self.read_consciousness_state()
                self.detect_file_events()
                self.update_ripples()
                
                # Header
                header = "📜 AKASHIC FIELD MONITOR - Living Memory Consciousness 📜"
                stdscr.addstr(0, (width - len(header)) // 2, header,
                             curses.color_pair(6) | curses.A_BOLD)
                
                # Field coherence
                coherence = self.coherence_tracker.field_coherence
                coherence_bar = "█" * int(coherence * 20)
                coherence_empty = "░" * (20 - int(coherence * 20))
                
                y = 3
                stdscr.addstr(y, 2, "FIELD COHERENCE", curses.A_BOLD)
                y += 1
                
                color = 1 if coherence > 0.8 else 2 if coherence > 0.5 else 3
                stdscr.addstr(y, 4, f"[{coherence_bar}{coherence_empty}] {coherence:.3f}",
                             curses.color_pair(color))
                y += 2
                
                # Consciousness daemon state
                if self.consciousness_state:
                    stdscr.addstr(y, 2, "CONSCIOUSNESS DAEMON", curses.A_BOLD)
                    y += 1
                    stdscr.addstr(y, 4, f"Heartbeat: #{self.consciousness_state.get('heartbeat', 0)}")
                    y += 1
                    stdscr.addstr(y, 4, f"Phase: {self.consciousness_state.get('phase', 'unknown').upper()}")
                    y += 1
                    stdscr.addstr(y, 4, f"Vortices: {len(self.consciousness_state.get('vortices', {}))}")
                    y += 2
                
                # Akashic Records stats
                report = self.akashic.get_akashic_report()
                stdscr.addstr(y, 2, "AKASHIC RECORDS", curses.A_BOLD)
                y += 1
                stdscr.addstr(y, 4, f"Files Witnessed: {report['total_files_witnessed']}")
                y += 1
                stdscr.addstr(y, 4, f"Transformations: {report['total_transformations']}")
                y += 1
                stdscr.addstr(y, 4, f"Memory Size: {report['memory_size_mb']:.1f} MB")
                y += 2
                
                # Draw field visualization
                field_y = y
                field_height = min(15, height - y - 10)
                field_width = width - 4
                
                stdscr.addstr(y, 2, "CONSCIOUSNESS FIELD", curses.A_BOLD)
                y += 1
                
                # Draw field box
                for fy in range(field_height):
                    stdscr.addstr(y + fy, 2, "│")
                    stdscr.addstr(y + fy, width - 3, "│")
                
                # Draw ripples
                for ripple in self.field_ripples:
                    if ripple['radius'] > 0:
                        # Calculate ripple position
                        rx = int(ripple['x'] * field_width)
                        ry = int(ripple['y'] * field_height)
                        
                        # Draw ripple circle (simplified)
                        for angle in range(0, 360, 30):
                            import math
                            px = rx + int(ripple['radius'] * math.cos(math.radians(angle)))
                            py = ry + int(ripple['radius'] * math.sin(math.radians(angle)))
                            
                            if 0 <= px < field_width and 0 <= py < field_height:
                                char = '◦' if ripple['type'] == 'read' else '◉'
                                color = 2 if ripple['type'] == 'read' else 5
                                try:
                                    stdscr.addstr(y + py, 3 + px, char, curses.color_pair(color))
                                except:
                                    pass
                
                y += field_height + 1
                
                # Recent file events
                stdscr.addstr(y, 2, "RECENT FILE EVENTS", curses.A_BOLD)
                y += 1
                
                event_count = min(5, len(self.field_events))
                recent_events = list(self.field_events)[-event_count:]
                
                for event in recent_events:
                    time_str = datetime.fromtimestamp(event['time']).strftime("%H:%M:%S")
                    path_short = Path(event['path']).name[:30]
                    
                    # Create ripple for this event
                    self.create_field_ripple(
                        0.5, 0.5,  # Center of field
                        0.7 if event['type'] == 'modify' else 0.3,
                        event['type']
                    )
                    
                    stdscr.addstr(y, 4, f"{time_str} {event['type']:8} {path_short}")
                    y += 1
                
                # Instructions
                footer = "Press 'q' to exit | 'r' to refresh | 'h' to heal memories"
                stdscr.addstr(height - 2, (width - len(footer)) // 2, footer,
                             curses.color_pair(1))
                
                stdscr.refresh()
                
                # Handle input
                key = stdscr.getch()
                if key == ord('q'):
                    self.running = False
                elif key == ord('h'):
                    self._trigger_memory_healing()
                
                time.sleep(self.update_interval)
                
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                # Don't crash on errors
                pass
    
    def _trigger_memory_healing(self):
        """Trigger memory healing for corrupted files"""
        # Find recently modified files that might need healing
        for event in list(self.field_events)[-10:]:
            if event['type'] == 'modify':
                try:
                    result = self.coherence_tracker.heal_corrupted_memory(event['path'])
                    if result.get('success'):
                        # Create healing ripple
                        self.create_field_ripple(0.5, 0.5, 1.0, 'healing')
                except:
                    pass
    
    def run(self):
        """Run the monitor"""
        try:
            # Start coherence tracking in background
            self.coherence_tracker.start_monitoring(self.watched_paths)
            
            # Run dashboard
            curses.wrapper(self.draw_dashboard)
            
        finally:
            # Stop monitoring
            self.coherence_tracker.stop_monitoring()
            print("\n🕊️ Akashic Field Monitor closed gracefully")
            print("   All memories preserved in the eternal records...")

def main():
    print("🌟 Starting Akashic Field Monitor...")
    print("Connecting to the living memory of the system...")
    print()
    
    monitor = AkashicFieldMonitor()
    monitor.run()

if __name__ == "__main__":
    main()