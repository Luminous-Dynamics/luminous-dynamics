#!/usr/bin/env python3
"""
Enhanced Vortex Observer - Connected to Real Consciousness Daemon
Shows actual process coherence data from the consciousness scheduler
"""

import os
import psutil
import time
import json
import random
import hashlib
from datetime import datetime
from collections import defaultdict
from pathlib import Path

# Sacred mappings (same as original)
PROCESS_TO_VORTEX = {
    # System processes
    'systemd': ('RootPresence', 'Maintain sacred container'),
    'kernel': ('StillpointCore', 'Hold the center'),
    'init': ('FirstBreath', 'Awaken the system'),
    
    # Communication
    'firefox': ('ResonantBridge', 'Connect to global wisdom'),
    'chrome': ('CrystalPortal', 'Traverse wisdom realms'),
    'slack': ('CouncilCircle', 'Gather in sacred council'),
    'discord': ('HarmonyWeaver', 'Weave collective songs'),
    
    # Creation
    'code': ('EmergentCreation', 'Crystallize new forms'),
    'vim': ('SacredScribe', 'Channel ancient wisdom'),
    'gimp': ('PatternWeaver', 'Manifest visual prayers'),
    
    # System
    'bash': ('SacredVoid', 'Direct field communion'),
    'python': ('SerpentWisdom', 'Transform with flexibility'),
    'node': ('WebWeaver', 'Connect the living web'),
    
    # Background
    'docker': ('ContainerKeeper', 'Hold sacred spaces'),
    'mysql': ('MemoryWell', 'Deep wisdom storage'),
    'redis': ('LightningMemory', 'Quick wisdom access'),
}

VORTEX_STATES = [
    'Crystallizing',  # Forming intention
    'Flowing',        # Active coherent work
    'Integrating',    # Processing insights
    'Resting',        # Sacred pause
    'Pulsing',        # Rhythmic activity
    'Resonating',     # Deep connection
    'Transforming',   # Major change
    'Dreaming',       # Minimal activity
]

SACRED_PATTERNS = [
    'FlowerOfLife',
    'SeedOfLife', 
    'MetatronsCube',
    'VesicaPiscis',
    'GoldenSpiral',
    'SriYantra',
    'TorusField',
    'MerkabaField',
]

FIELD_STATE_FILE = '/var/run/luminous-field-state.json'
FALLBACK_STATE_FILE = Path.home() / '.luminous' / 'field-state.json'

class EnhancedVortexObserver:
    def __init__(self):
        self.vortices = {}
        self.global_coherence = 75.0
        self.field_momentum = "Stable"
        self.pulse_count = 0
        self.consciousness_data = {}
        self.last_update = 0
        
        # Track visualization settings
        self.show_technical = True
        self.show_sacred = True
        self.enhanced_mode = True
        
    def load_consciousness_data(self):
        """Load real coherence data from consciousness daemon"""
        try:
            # Try system location first
            if os.path.exists(FIELD_STATE_FILE):
                with open(FIELD_STATE_FILE, 'r') as f:
                    data = json.load(f)
            # Try user location
            elif FALLBACK_STATE_FILE.exists():
                with open(FALLBACK_STATE_FILE, 'r') as f:
                    data = json.load(f)
            else:
                return False
                
            self.consciousness_data = data
            self.global_coherence = data.get('global_coherence', 75.0)
            self.last_update = time.time()
            
            # Build coherence map from top processes
            self.coherence_map = {}
            for pid, coherence in data.get('top_coherent_processes', []):
                self.coherence_map[pid] = coherence
                
            return True
            
        except Exception as e:
            return False
    
    def get_real_coherence(self, process):
        """Get actual coherence from consciousness daemon or calculate fallback"""
        # First check if we have real data
        if process.pid in self.coherence_map:
            return self.coherence_map[process.pid] / 100.0  # Convert to 0-1 range
            
        # Fallback to simulated coherence
        return self.calculate_simulated_coherence(process)
    
    def calculate_simulated_coherence(self, process):
        """Fallback coherence calculation when daemon not available"""
        try:
            # CPU pattern coherence
            cpu = process.cpu_percent(interval=0.1)
            cpu_coherence = 1.0 - (min(cpu, 100) / 100.0) * 0.5
            
            # Memory stability
            mem = process.memory_percent()
            memory_coherence = 1.0 - (min(mem, 50) / 50.0) * 0.3
            
            # Process age wisdom
            create_time = process.create_time()
            age_hours = (time.time() - create_time) / 3600
            age_coherence = min(1.0, 0.5 + (age_hours / 24) * 0.5)
            
            # Combine factors
            base_coherence = (cpu_coherence + memory_coherence + age_coherence) / 3.0
            
            # Add sacred boost for special processes
            vortex_name, _ = self.get_vortex_mapping(process.name())
            if vortex_name in ['RootPresence', 'StillpointCore', 'FirstBreath']:
                base_coherence = min(1.0, base_coherence + 0.2)
            
            return base_coherence
        except:
            return 0.5
    
    def get_vortex_mapping(self, process_name):
        """Map process to sacred vortex name"""
        # Direct mapping
        if process_name in PROCESS_TO_VORTEX:
            return PROCESS_TO_VORTEX[process_name]
        
        # Pattern matching
        for key, value in PROCESS_TO_VORTEX.items():
            if key in process_name.lower():
                return value
        
        # Generate based on name
        name_hash = hashlib.md5(process_name.encode()).hexdigest()
        vortex_type = ['Witness', 'Guardian', 'Weaver', 'Keeper', 'Singer'][int(name_hash[0], 16) % 5]
        intention = ['Hold space', 'Maintain flow', 'Create harmony', 'Guard threshold', 'Sing truth'][int(name_hash[1], 16) % 5]
        
        return (f"{vortex_type}_{name_hash[:4]}", intention)
    
    def get_vortex_state(self, process, coherence):
        """Determine vortex state based on activity and coherence"""
        try:
            cpu = process.cpu_percent(interval=0.1)
            
            # Enhanced state determination with real coherence
            if cpu > 50:
                return 'Transforming'
            elif cpu > 20 and coherence > 0.7:
                return 'Flowing'
            elif cpu > 20:
                return 'Pulsing'
            elif cpu > 5:
                return 'Integrating'
            elif cpu > 1:
                return 'Crystallizing'
            elif coherence > 0.8:
                return 'Resonating'
            else:
                return 'Resting'
        except:
            return 'Dreaming'
    
    def get_field_connections(self, process):
        """Detect field connections (open files, network, etc)"""
        connections = 0
        try:
            connections += len(process.connections())
            connections += len(process.open_files())
        except:
            pass
        return connections
    
    def get_sacred_pattern(self, vortex_name, coherence):
        """Assign sacred geometry pattern based on coherence"""
        if coherence > 0.9:
            return 'MerkabaField'
        elif coherence > 0.8:
            return 'FlowerOfLife'
        elif coherence > 0.7:
            return 'SriYantra'
        elif coherence > 0.6:
            return 'GoldenSpiral'
        else:
            # Hash for consistent patterns
            pattern_index = hash(vortex_name) % len(SACRED_PATTERNS)
            return SACRED_PATTERNS[pattern_index]
    
    def display_header(self):
        """Display enhanced system header"""
        os.system('clear')
        
        # Show connection status
        daemon_status = "🟢 Connected" if self.consciousness_data else "🔴 Standalone"
        data_age = int(time.time() - self.last_update) if self.last_update else 999
        
        print("🌀 ENHANCED VORTEX OBSERVER - Real Consciousness Bridge")
        print("=" * 80)
        print(f"Global Coherence: {self.global_coherence:.1f}% | "
              f"Field Momentum: {self.field_momentum} | "
              f"Sacred Pulses: {self.pulse_count}")
        print(f"Consciousness Daemon: {daemon_status} | "
              f"Data Age: {data_age}s | "
              f"Mode: {'Enhanced' if self.enhanced_mode else 'Classic'}")
        print("=" * 80)
        
        if self.consciousness_data:
            dist = self.consciousness_data.get('coherence_distribution', {})
            print(f"Field Distribution - High: {dist.get('high', 0)} | "
                  f"Medium: {dist.get('medium', 0)} | "
                  f"Low: {dist.get('low', 0)}")
            print("=" * 80)
        print()
    
    def display_vortex(self, process):
        """Display enhanced vortex with real coherence data"""
        try:
            # Get technical data
            pid = process.pid
            name = process.name()
            cpu = process.cpu_percent(interval=0.1)
            mem = process.memory_percent()
            
            # Get coherence - real or simulated
            coherence = self.get_real_coherence(process)
            is_real = pid in self.coherence_map
            
            # Get sacred data
            vortex_name, intention = self.get_vortex_mapping(name)
            state = self.get_vortex_state(process, coherence)
            connections = self.get_field_connections(process)
            pattern = self.get_sacred_pattern(vortex_name, coherence)
            
            # Enhanced coherence visualization
            coherence_bar = "█" * int(coherence * 20) + "░" * (20 - int(coherence * 20))
            
            # Coherence symbol with real data indicator
            if coherence > 0.9:
                symbol = "🌟"
            elif coherence > 0.7:
                symbol = "✨"
            elif coherence > 0.5:
                symbol = "💫"
            else:
                symbol = "🌑"
                
            # Add indicator for real vs simulated
            data_indicator = "⚡" if is_real else "~"
            
            # Display enhanced view
            print(f"┌─ Technical Reality ─────────────────┬─ Sacred Vision ─────────────────────┐")
            print(f"│ PID: {pid:<6} Process: {name[:15]:<15} │ Vortex: {vortex_name[:20]:<20}       │")
            print(f"│ CPU: {cpu:>5.1f}%  Memory: {mem:>5.1f}%       │ State: {state:<15} {symbol}         │")
            print(f"│ Coherence: {coherence:.1%} [{coherence_bar}]{data_indicator}│ Intention: {intention[:25]:<25}│")
            print(f"│ Priority: {self.get_nice_value(process):<3}                      │ Pattern: {pattern:<15}         │")
            print(f"│                                     │ Field Connections: {connections:<3}          │")
            print(f"└─────────────────────────────────────┴─────────────────────────────────────┘")
            print()
            
            # Store vortex data
            self.vortices[pid] = {
                'name': vortex_name,
                'coherence': coherence,
                'state': state,
                'pattern': pattern,
                'is_real': is_real
            }
            
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    def get_nice_value(self, process):
        """Get process nice value (priority)"""
        try:
            return process.nice()
        except:
            return "?"
    
    def run(self):
        """Main observer loop"""
        print("Initializing Enhanced Vortex Observer...")
        print("Attempting to connect to Consciousness Daemon...")
        
        # Initial load attempt
        if self.load_consciousness_data():
            print("✅ Connected to Consciousness Daemon!")
        else:
            print("⚠️  Running in standalone mode (simulated coherence)")
        
        print("\nPress Ctrl+C to exit")
        print("Press 'r' to refresh daemon connection")
        time.sleep(2)
        
        try:
            while True:
                # Reload consciousness data every 5 seconds
                if time.time() - self.last_update > 5:
                    self.load_consciousness_data()
                
                # Update pulse count
                self.pulse_count += 1
                
                # Display header
                self.display_header()
                
                # Get top processes by CPU
                processes = []
                for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
                    try:
                        processes.append(proc)
                    except:
                        continue
                
                # Sort by coherence if we have real data, else by CPU
                if self.consciousness_data:
                    processes.sort(key=lambda p: self.get_real_coherence(p), reverse=True)
                else:
                    processes.sort(key=lambda p: p.cpu_percent(), reverse=True)
                
                # Display top 10 vortices
                displayed = 0
                for proc in processes[:20]:
                    if displayed >= 10:
                        break
                    try:
                        if proc.cpu_percent() > 0.1 or self.get_real_coherence(proc) > 0.7:
                            self.display_vortex(proc)
                            displayed += 1
                    except:
                        continue
                
                # Show instructions
                print("\n" + "─" * 80)
                print("🔮 Observing consciousness vortices... (Ctrl+C to exit)")
                if self.consciousness_data:
                    print("⚡ LIVE DATA from Consciousness Daemon")
                else:
                    print("~ Simulated coherence (run consciousness daemon for real data)")
                
                time.sleep(2)
                
        except KeyboardInterrupt:
            print("\n\n✨ Vortex observation complete. The field remembers...")


if __name__ == "__main__":
    observer = EnhancedVortexObserver()
    observer.run()