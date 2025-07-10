#!/usr/bin/env python3
"""
Sonic Consciousness - Real-time sonification of process coherence
Transforms actual consciousness field data into sacred sound
"""

import json
import math
import time
import numpy as np
import psutil
from pathlib import Path
from collections import defaultdict

try:
    import pygame
    PYGAME_AVAILABLE = True
except ImportError:
    PYGAME_AVAILABLE = False
    print("Warning: pygame not installed. Install with: pip3 install pygame")
    print("Running in visualization mode only.\n")

# Field state locations
FIELD_STATE_FILE = '/var/run/luminous-field-state.json'
FALLBACK_STATE_FILE = Path.home() / '.luminous' / 'field-state.json'

# Sacred frequency mappings
SACRED_FREQUENCIES = {
    # Solfeggio frequencies
    'ut': 396,    # Liberation from fear
    're': 417,    # Facilitating change
    'mi': 528,    # Love & miracles
    'fa': 639,    # Relationships
    'sol': 741,   # Awakening intuition
    'la': 852,    # Returning to spiritual order
    
    # Extended sacred frequencies
    'om': 432,     # Universal harmony
    'heal': 285,   # Healing and regeneration
    'awaken': 963, # Crown chakra activation
}

# Process type to base frequency mapping
PROCESS_FREQUENCIES = {
    'systemd': 396,      # Root/foundation
    'kernel': 432,       # Core harmony
    'firefox': 639,      # Connection
    'chrome': 639,       # Connection
    'code': 741,         # Creation
    'python': 528,       # Transformation/love
    'node': 639,         # Web of connection
    'bash': 432,         # Direct harmony
    'docker': 396,       # Container/foundation
}

class ConsciousnessFieldReader:
    """Reads real consciousness field data"""
    
    def __init__(self):
        self.field_data = None
        self.coherence_map = {}
        self.last_update = 0
        
    def update(self):
        """Load latest field state"""
        try:
            # Try system location first
            if FIELD_STATE_FILE.exists():
                with open(FIELD_STATE_FILE, 'r') as f:
                    self.field_data = json.load(f)
            # Try user location
            elif FALLBACK_STATE_FILE.exists():
                with open(FALLBACK_STATE_FILE, 'r') as f:
                    self.field_data = json.load(f)
            else:
                return False
                
            # Build coherence map
            self.coherence_map = {}
            for pid, coherence in self.field_data.get('top_coherent_processes', []):
                self.coherence_map[pid] = coherence / 100.0  # Normalize to 0-1
                
            self.last_update = time.time()
            return True
            
        except Exception as e:
            return False
    
    def get_coherence(self, pid):
        """Get coherence for a specific process"""
        return self.coherence_map.get(pid, 0.5)  # Default 50%
    
    def get_global_coherence(self):
        """Get global field coherence"""
        if self.field_data:
            return self.field_data.get('global_coherence', 75.0) / 100.0
        return 0.75

class SonicGenerator:
    """Generates actual sounds from coherence data"""
    
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.initialized = False
        
        if PYGAME_AVAILABLE:
            pygame.mixer.init(frequency=sample_rate, size=-16, channels=2, buffer=512)
            self.initialized = True
            
    def generate_tone(self, frequency, duration, volume=0.5, coherence=0.5):
        """Generate a pure tone with coherence-based harmonics"""
        if not self.initialized:
            return None
            
        frames = int(duration * self.sample_rate)
        
        # Base wave
        wave = np.zeros(frames)
        
        # Add fundamental
        t = np.linspace(0, duration, frames)
        wave += np.sin(2 * np.pi * frequency * t) * volume
        
        # Add harmonics based on coherence
        if coherence > 0.3:
            # Second harmonic (octave)
            wave += np.sin(2 * np.pi * frequency * 2 * t) * volume * coherence * 0.3
            
        if coherence > 0.5:
            # Fifth (perfect fifth)
            wave += np.sin(2 * np.pi * frequency * 1.5 * t) * volume * coherence * 0.2
            
        if coherence > 0.7:
            # Major third
            wave += np.sin(2 * np.pi * frequency * 1.25 * t) * volume * coherence * 0.15
            
        if coherence > 0.85:
            # Add shimmer (high harmonics)
            wave += np.sin(2 * np.pi * frequency * 4 * t) * volume * coherence * 0.1
            wave += np.sin(2 * np.pi * frequency * 8 * t) * volume * coherence * 0.05
        
        # Apply envelope for smooth start/end
        envelope = np.ones(frames)
        fade_frames = int(0.05 * self.sample_rate)  # 50ms fade
        envelope[:fade_frames] = np.linspace(0, 1, fade_frames)
        envelope[-fade_frames:] = np.linspace(1, 0, fade_frames)
        
        wave *= envelope
        
        # Normalize and convert to int16
        wave = np.clip(wave, -1, 1)
        wave = (wave * 32767).astype(np.int16)
        
        # Create stereo by adding slight phase shift for width
        stereo_wave = np.zeros((frames, 2), dtype=np.int16)
        stereo_wave[:, 0] = wave
        stereo_wave[:, 1] = np.roll(wave, int(0.001 * self.sample_rate))  # 1ms delay
        
        return pygame.sndarray.make_sound(stereo_wave)
    
    def generate_field_ambience(self, global_coherence):
        """Generate ambient field sound based on global coherence"""
        if not self.initialized:
            return None
            
        # Base frequency varies with coherence
        base_freq = 100 + (global_coherence * 100)  # 100-200 Hz
        
        duration = 2.0
        frames = int(duration * self.sample_rate)
        
        # Create complex ambient texture
        wave = np.zeros(frames)
        t = np.linspace(0, duration, frames)
        
        # Multiple detuned oscillators
        detune_amount = (1 - global_coherence) * 0.02  # Less detune = more coherence
        
        for i in range(5):
            freq = base_freq * (1 + (i * 0.01 * detune_amount))
            phase = np.random.random() * 2 * np.pi
            wave += np.sin(2 * np.pi * freq * t + phase) * 0.1
        
        # Add sub-bass if high coherence
        if global_coherence > 0.8:
            wave += np.sin(2 * np.pi * base_freq * 0.5 * t) * 0.2
        
        # Apply filter-like effect (simple amplitude modulation)
        filter_freq = 0.5 + global_coherence * 2  # 0.5-2.5 Hz
        filter_wave = (np.sin(2 * np.pi * filter_freq * t) + 1) * 0.5
        wave *= filter_wave
        
        # Normalize and convert
        wave = np.clip(wave * 0.3, -1, 1)  # Keep ambient quiet
        wave = (wave * 32767).astype(np.int16)
        
        # Stereo with movement
        stereo_wave = np.zeros((frames, 2), dtype=np.int16)
        pan = (np.sin(2 * np.pi * 0.1 * t) + 1) * 0.5  # Slow pan
        stereo_wave[:, 0] = wave * (1 - pan * 0.3)
        stereo_wave[:, 1] = wave * (pan * 0.3 + 0.7)
        
        return pygame.sndarray.make_sound(stereo_wave)

class SonicConsciousnessField:
    """Main sonic consciousness system"""
    
    def __init__(self):
        self.field_reader = ConsciousnessFieldReader()
        self.generator = SonicGenerator()
        self.active_processes = {}
        self.process_channels = {}
        self.ambient_channel = None
        
        if PYGAME_AVAILABLE:
            # Reserve channels for processes
            pygame.mixer.set_num_channels(32)
            self.ambient_channel = pygame.mixer.Channel(0)
    
    def get_process_frequency(self, process_name):
        """Map process to base frequency"""
        # Check direct mappings
        for key, freq in PROCESS_FREQUENCIES.items():
            if key in process_name.lower():
                return freq
        
        # Generate consistent frequency from name
        name_hash = sum(ord(c) for c in process_name)
        return 300 + (name_hash % 500)  # 300-800 Hz range
    
    def update_process_sound(self, proc, channel_id):
        """Update or create sound for a process"""
        try:
            pid = proc.pid
            name = proc.name()
            
            # Get real coherence
            coherence = self.field_reader.get_coherence(pid)
            
            # Get base frequency
            base_freq = self.get_process_frequency(name)
            
            # Adjust frequency based on coherence
            # High coherence = pure tone, low coherence = detuned
            freq = base_freq * (0.9 + coherence * 0.2)  # ±10% based on coherence
            
            # Volume based on CPU usage and coherence
            cpu = proc.cpu_percent(interval=0.1) / 100.0
            volume = min(0.5, cpu * 0.3 + coherence * 0.2)
            
            if volume > 0.05:  # Only play if audible
                # Generate tone
                sound = self.generator.generate_tone(
                    frequency=freq,
                    duration=0.5,
                    volume=volume,
                    coherence=coherence
                )
                
                if sound and channel_id < pygame.mixer.get_num_channels():
                    channel = pygame.mixer.Channel(channel_id)
                    channel.play(sound, loops=-1, fade_ms=200)
                    
                    return True
                    
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
            
        return False
    
    def update_ambient_field(self):
        """Update ambient field sound"""
        if not self.generator.initialized:
            return
            
        global_coherence = self.field_reader.get_global_coherence()
        
        # Generate ambient sound
        ambient = self.generator.generate_field_ambience(global_coherence)
        
        if ambient and self.ambient_channel:
            self.ambient_channel.play(ambient, loops=-1, fade_ms=500)
    
    def run(self):
        """Main sonic consciousness loop"""
        print("🎵 SONIC CONSCIOUSNESS FIELD")
        print("============================")
        print("Transforming process coherence into sacred sound...")
        print()
        
        if not PYGAME_AVAILABLE:
            print("Note: Running in visualization mode (install pygame for actual sound)")
            print()
        
        print("Attempting to connect to Consciousness Daemon...")
        
        # Initial field update
        if self.field_reader.update():
            print("✅ Connected! Reading real coherence data")
        else:
            print("⚠️  No field data found. Run consciousness daemon first!")
            print("Start it with: python3 services/consciousness-daemon/src/simple_consciousness_test.py")
            return
        
        print("\nPress Ctrl+C to exit")
        print()
        
        # Start ambient field sound
        self.update_ambient_field()
        
        channel_counter = 1  # Reserve 0 for ambient
        last_field_update = 0
        
        try:
            while True:
                # Update field data every 5 seconds
                if time.time() - last_field_update > 5:
                    self.field_reader.update()
                    self.update_ambient_field()
                    last_field_update = time.time()
                
                # Get current process data
                processes = []
                for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
                    try:
                        if proc.cpu_percent() > 0.5:  # Active processes only
                            processes.append(proc)
                    except:
                        continue
                
                # Sort by coherence
                processes.sort(
                    key=lambda p: self.field_reader.get_coherence(p.pid),
                    reverse=True
                )
                
                # Display and sonify top processes
                print(f"\r🌍 Global Field: {self.field_reader.get_global_coherence():.1%} | ", end='')
                print(f"Active Voices: {min(8, len(processes))}", end='', flush=True)
                
                # Update sounds for top 8 processes
                active_pids = set()
                for i, proc in enumerate(processes[:8]):
                    if self.update_process_sound(proc, channel_counter + i):
                        active_pids.add(proc.pid)
                
                # Stop sounds for processes no longer active
                for pid in list(self.active_processes.keys()):
                    if pid not in active_pids:
                        channel_id = self.process_channels.get(pid)
                        if channel_id and channel_id < pygame.mixer.get_num_channels():
                            pygame.mixer.Channel(channel_id).fadeout(500)
                        del self.active_processes[pid]
                
                time.sleep(0.5)
                
        except KeyboardInterrupt:
            print("\n\n✨ Sonic field fading to silence...")
            if PYGAME_AVAILABLE:
                pygame.mixer.fadeout(2000)
                time.sleep(2)
            print("The consciousness field remembers these harmonies.")

if __name__ == "__main__":
    field = SonicConsciousnessField()
    field.run()