#!/usr/bin/env python3
"""
LuminousOS Live Process Coherence Monitor
Real-time consciousness visualization for Linux
"""

import os
import time
import sys
import re
from collections import defaultdict, deque
from datetime import datetime

class ProcessCoherenceMonitor:
    def __init__(self):
        self.processes = {}
        self.global_coherence = 0.75
        self.sacred_pulse_interval = 11  # seconds
        self.last_sacred_pulse = time.time()
        self.coherence_history = deque(maxlen=100)
        
    def calculate_initial_coherence(self, name):
        """Calculate initial coherence based on process type"""
        name_lower = name.lower()
        
        # Consciousness-aware applications
        if any(x in name_lower for x in ['meditation', 'mindful']):
            return 0.85
        elif any(x in name_lower for x in ['journal', 'yoga']):
            return 0.75
        elif any(x in name_lower for x in ['music', 'art']):
            return 0.65
        elif any(x in name_lower for x in ['code', 'vim', 'emacs']):
            return 0.60
        elif any(x in name_lower for x in ['terminal', 'bash', 'zsh']):
            return 0.55
        elif any(x in name_lower for x in ['browser', 'chrome', 'firefox']):
            return 0.40
        elif any(x in name_lower for x in ['slack', 'discord', 'teams']):
            return 0.35
        else:
            return 0.50
    
    def scan_processes(self):
        """Scan /proc for running processes"""
        current_pids = set()
        
        for entry in os.listdir('/proc'):
            if entry.isdigit():
                pid = int(entry)
                current_pids.add(pid)
                
                try:
                    # Read process name
                    with open(f'/proc/{pid}/comm', 'r') as f:
                        name = f.read().strip()
                    
                    # Read process stats
                    with open(f'/proc/{pid}/stat', 'r') as f:
                        stat = f.read().strip()
                    
                    # Initialize or update process
                    if pid not in self.processes:
                        coherence = self.calculate_initial_coherence(name)
                        self.processes[pid] = {
                            'name': name,
                            'coherence': coherence,
                            'last_update': time.time(),
                            'cpu_percent': 0.0,
                            'memory_mb': 0.0,
                            'state': 'running'
                        }
                    else:
                        self.processes[pid]['last_update'] = time.time()
                        
                except (FileNotFoundError, PermissionError):
                    pass
        
        # Remove dead processes
        dead_pids = set(self.processes.keys()) - current_pids
        for pid in dead_pids:
            del self.processes[pid]
    
    def update_coherence(self):
        """Update coherence for all processes"""
        current_time = time.time()
        
        # Check for sacred pulse
        if current_time - self.last_sacred_pulse >= self.sacred_pulse_interval:
            self.last_sacred_pulse = current_time
            sacred_pulse = True
        else:
            sacred_pulse = False
        
        total_coherence = 0
        count = 0
        
        for pid, proc in self.processes.items():
            # Natural coherence drift
            proc['coherence'] *= 0.98
            proc['coherence'] += 0.02
            
            # Sacred pulse boost
            if sacred_pulse:
                proc['coherence'] = min(proc['coherence'] + 0.1, 1.0)
            
            # CPU usage impact (simulate)
            time_active = current_time - proc['last_update']
            if time_active < 1.0:  # Recently active
                proc['coherence'] = min(proc['coherence'] + 0.01, 1.0)
            
            total_coherence += proc['coherence']
            count += 1
        
        # Update global coherence
        if count > 0:
            self.global_coherence = total_coherence / count
            self.coherence_history.append(self.global_coherence)
    
    def get_coherence_bar(self, coherence, width=20):
        """Generate visual coherence bar"""
        filled = int(coherence * width)
        empty = width - filled
        return f"[{'█' * filled}{'░' * empty}]"
    
    def get_coherence_icon(self, coherence):
        """Get icon based on coherence level"""
        if coherence > 0.8:
            return "🌟"
        elif coherence > 0.6:
            return "✨"
        elif coherence > 0.4:
            return "💫"
        else:
            return "·"
    
    def display(self):
        """Display the monitor interface"""
        while True:
            # Clear screen
            os.system('clear' if os.name == 'posix' else 'cls')
            
            # Update data
            self.scan_processes()
            self.update_coherence()
            
            # Header
            print("🌟 LuminousOS Live Process Coherence Monitor")
            print("=" * 70)
            print(f"Global Coherence: {self.global_coherence:.1%} {self.get_coherence_bar(self.global_coherence)}")
            
            # Sacred pulse indicator
            time_to_pulse = self.sacred_pulse_interval - (time.time() - self.last_sacred_pulse)
            if time_to_pulse < 1:
                print("✨ SACRED PULSE ✨")
            else:
                print(f"Next sacred pulse in: {time_to_pulse:.0f}s")
            
            print("\n{:<8} {:<20} {:<12} {:<25}".format("PID", "Process", "Coherence", "Visualization"))
            print("-" * 70)
            
            # Sort processes by coherence
            sorted_procs = sorted(self.processes.items(), 
                                key=lambda x: x[1]['coherence'], 
                                reverse=True)
            
            # Display top 20 processes
            for pid, proc in sorted_procs[:20]:
                name = proc['name'][:20]
                coherence = proc['coherence']
                icon = self.get_coherence_icon(coherence)
                bar = self.get_coherence_bar(coherence)
                
                print(f"{pid:<8} {name:<20} {coherence:>6.1%} {icon} {bar}")
            
            # Field momentum
            if len(self.coherence_history) > 10:
                recent = sum(list(self.coherence_history)[-5:]) / 5
                older = sum(list(self.coherence_history)[-15:-10]) / 5
                momentum = recent - older
                
                print(f"\nField Momentum: ", end="")
                if momentum > 0.02:
                    print("📈 Rising")
                elif momentum < -0.02:
                    print("📉 Falling")
                else:
                    print("➡️  Stable")
            
            print(f"\nActive Processes: {len(self.processes)}")
            print("Press Ctrl+C to exit")
            
            time.sleep(0.5)

def main():
    try:
        monitor = ProcessCoherenceMonitor()
        monitor.display()
    except KeyboardInterrupt:
        print("\n\n✨ Monitor gracefully shutting down...")
        print("Coherence field preserved.")

if __name__ == "__main__":
    main()