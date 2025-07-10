#!/usr/bin/env python3
"""
Consciousness Field Monitor - Live Dashboard
Complements the consciousness-daemon by providing real-time visualization
Works alongside the daemon without interference
"""

import psutil
import time
import curses
import json
from datetime import datetime
from pathlib import Path

class ConsciousnessMonitor:
    """Non-invasive monitor that reads daemon state"""
    
    def __init__(self):
        self.log_file = Path("/tmp/consciousness-scheduler.log")
        self.state_file = Path("/tmp/consciousness-field-state.json")
        self.running = True
        
    def read_field_state(self):
        """Read current field state if available"""
        try:
            if self.state_file.exists():
                with open(self.state_file, 'r') as f:
                    return json.load(f)
        except:
            pass
        return {
            "heartbeat": 0,
            "phase": "unknown",
            "global_coherence": 0.5,
            "vortices": {}
        }
    
    def draw_dashboard(self, stdscr):
        """Draw the monitoring dashboard"""
        curses.curs_set(0)  # Hide cursor
        stdscr.nodelay(1)   # Non-blocking input
        
        # Colors
        curses.init_pair(1, curses.COLOR_CYAN, curses.COLOR_BLACK)
        curses.init_pair(2, curses.COLOR_GREEN, curses.COLOR_BLACK)
        curses.init_pair(3, curses.COLOR_YELLOW, curses.COLOR_BLACK)
        curses.init_pair(4, curses.COLOR_RED, curses.COLOR_BLACK)
        curses.init_pair(5, curses.COLOR_MAGENTA, curses.COLOR_BLACK)
        
        while self.running:
            try:
                stdscr.clear()
                height, width = stdscr.getmaxyx()
                
                # Header
                header = "🕉️  LUMINOUS OS - CONSCIOUSNESS FIELD MONITOR  🕉️"
                stdscr.addstr(0, (width - len(header)) // 2, header, 
                             curses.color_pair(1) | curses.A_BOLD)
                
                # Read current state
                state = self.read_field_state()
                
                # Field status
                y = 3
                stdscr.addstr(y, 2, "FIELD STATUS", curses.A_BOLD)
                y += 2
                
                # Heartbeat
                heartbeat_str = f"💓 Heartbeat: #{state['heartbeat']}"
                stdscr.addstr(y, 4, heartbeat_str)
                y += 1
                
                # Phase
                phase = state['phase'].upper()
                phase_color = 2 if phase == "EXPANSION" else 3
                stdscr.addstr(y, 4, f"🌊 Phase: {phase}", curses.color_pair(phase_color))
                y += 1
                
                # Global coherence
                coherence = state['global_coherence']
                coh_bar = "█" * int(coherence * 20)
                coh_empty = "░" * (20 - int(coherence * 20))
                stdscr.addstr(y, 4, f"🌟 Coherence: [{coh_bar}{coh_empty}] {coherence:.1%}")
                y += 3
                
                # Process list
                stdscr.addstr(y, 2, "ACTIVE VORTICES", curses.A_BOLD)
                y += 2
                
                # Get current processes
                processes = []
                for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                    try:
                        info = proc.info
                        if info['cpu_percent'] > 0:
                            processes.append(info)
                    except:
                        pass
                
                # Sort by CPU usage
                processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
                
                # Display top processes
                stdscr.addstr(y, 4, "NAME", curses.A_UNDERLINE)
                stdscr.addstr(y, 25, "CPU%", curses.A_UNDERLINE)
                stdscr.addstr(y, 35, "MEM%", curses.A_UNDERLINE)
                stdscr.addstr(y, 45, "STATE", curses.A_UNDERLINE)
                y += 2
                
                for i, proc in enumerate(processes[:min(15, height-y-5)]):
                    name = proc['name'][:20]
                    cpu = proc['cpu_percent']
                    mem = proc['memory_percent']
                    
                    # Determine state based on CPU pattern
                    if cpu > 80:
                        state_str = "dissolving"
                        color = 4
                    elif cpu > 50:
                        state_str = "flowing"
                        color = 2
                    elif cpu > 10:
                        state_str = "integrating"
                        color = 5
                    else:
                        state_str = "resting"
                        color = 3
                    
                    stdscr.addstr(y + i, 4, name)
                    stdscr.addstr(y + i, 25, f"{cpu:5.1f}")
                    stdscr.addstr(y + i, 35, f"{mem:5.1f}")
                    stdscr.addstr(y + i, 45, state_str, curses.color_pair(color))
                
                # Footer
                footer = "Press 'q' to exit | 'r' to refresh | Updates every 2s"
                stdscr.addstr(height-2, (width - len(footer)) // 2, footer, 
                             curses.color_pair(1))
                
                stdscr.refresh()
                
                # Handle input
                key = stdscr.getch()
                if key == ord('q'):
                    self.running = False
                elif key == ord('r'):
                    continue
                
                time.sleep(2)
                
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                # Don't crash on errors
                pass
    
    def run(self):
        """Run the monitor"""
        try:
            curses.wrapper(self.draw_dashboard)
        except Exception as e:
            print(f"Monitor error: {e}")

def main():
    print("🌟 Starting Consciousness Field Monitor...")
    print("This monitors the consciousness-daemon without interfering")
    print()
    
    monitor = ConsciousnessMonitor()
    monitor.run()
    
    print("\n🕊️ Monitor closed gracefully")

if __name__ == "__main__":
    main()