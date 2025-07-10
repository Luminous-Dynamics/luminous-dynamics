#!/usr/bin/env python3
"""
Enhanced Sacred Process Monitor - Extended wellness features
Integrates breathing rhythms, energy flow, and coherence fields
"""

import psutil
import time
import json
import argparse
import math
import threading
from datetime import datetime, timedelta
from collections import defaultdict, deque
import os
import signal
import sys
import numpy as np

# Optional imports for enhanced features
try:
    import pygame
    SOUND_ENABLED = True
except ImportError:
    SOUND_ENABLED = False
    print("Note: Install pygame for sound features")

class EnhancedSacredMonitor:
    """Enhanced monitor with consciousness-aware features"""
    
    def __init__(self, history_minutes=5):
        self.history_minutes = history_minutes
        self.process_history = defaultdict(lambda: deque(maxlen=60 * history_minutes))
        self.context_switches = deque(maxlen=100)
        self.energy_flow = deque(maxlen=300)  # 5 minutes of energy data
        self.coherence_history = deque(maxlen=100)
        
        # Breathing rhythm tracking
        self.breath_phase = 0.0  # 0-1 representing breath cycle
        self.breath_rate = 4.0   # seconds per breath
        self.last_breath_time = time.time()
        
        # Sacred patterns
        self.sacred_glyphs = {
            'flow': {'pattern': 'steady_low_cpu', 'blessing': 'In perfect flow'},
            'focus': {'pattern': 'single_dominant', 'blessing': 'Deep concentration'},
            'harmony': {'pattern': 'balanced_resources', 'blessing': 'System in harmony'},
            'rest': {'pattern': 'minimal_activity', 'blessing': 'Sacred rest'},
            'creation': {'pattern': 'dev_tools_active', 'blessing': 'Creating with purpose'}
        }
        
        # Energy tracking
        self.daily_energy_pattern = []
        self.energy_peak_time = None
        self.energy_trough_time = None
        
        # Sound initialization
        if SOUND_ENABLED:
            pygame.mixer.init(frequency=22050, size=-16, channels=2, buffer=512)
            self.awareness_bell = self._create_bell_sound()
        
        # Parent init
        self.last_check = time.time()
        self.current_focus_start = None
        self.focus_sessions = []
        self.interruption_count = 0
        
        # Wellness thresholds
        self.HEALTHY_CPU_PERCENT = 50
        self.HEALTHY_MEMORY_PERCENT = 70
        self.MIN_FOCUS_DURATION = 300
        self.CONTEXT_SWITCH_THRESHOLD = 10
        
    def _create_bell_sound(self):
        """Create a gentle awareness bell sound"""
        if not SOUND_ENABLED:
            return None
            
        duration = 0.5
        sample_rate = 22050
        samples = int(duration * sample_rate)
        
        # Create harmonious bell tone
        frequency = 528  # Hz - Love frequency
        wave = np.zeros(samples)
        
        for i in range(samples):
            t = float(i) / sample_rate
            # Fundamental + harmonics
            wave[i] = (
                0.5 * math.sin(2 * math.pi * frequency * t) +
                0.3 * math.sin(2 * math.pi * frequency * 2 * t) +
                0.2 * math.sin(2 * math.pi * frequency * 3 * t)
            )
            # Envelope for bell-like decay
            wave[i] *= math.exp(-3 * t)
            
        # Normalize and convert to 16-bit
        wave = np.int16(wave * 32767 / np.max(np.abs(wave)))
        
        return pygame.sndarray.make_sound(np.column_stack((wave, wave)))
    
    def update_breathing_rhythm(self):
        """Update the breathing phase for rhythm tracking"""
        current_time = time.time()
        elapsed = current_time - self.last_breath_time
        
        # Update breath phase (0-1)
        self.breath_phase = (elapsed % self.breath_rate) / self.breath_rate
        
        # Return current breathing state
        if self.breath_phase < 0.4:
            return "inhale"
        elif self.breath_phase < 0.5:
            return "pause"
        elif self.breath_phase < 0.9:
            return "exhale"
        else:
            return "pause"
    
    def calculate_coherence_field(self):
        """Calculate system coherence based on multiple factors"""
        metrics = {}
        
        # Get current system state
        cpu_percent = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory()
        disk_io = psutil.disk_io_counters()
        net_io = psutil.net_io_counters()
        
        # Calculate variance in CPU usage (lower = more coherent)
        cpu_samples = [psutil.cpu_percent(interval=0.1) for _ in range(10)]
        cpu_variance = np.var(cpu_samples)
        cpu_coherence = max(0, 100 - cpu_variance * 10)
        
        # Memory stability
        memory_coherence = 100 - abs(memory.percent - 50)  # Best at 50% usage
        
        # Process harmony - fewer context switches = higher coherence
        process_count = len(psutil.pids())
        process_coherence = max(0, 100 - (process_count - 50))
        
        # I/O flow - moderate, steady I/O is coherent
        if hasattr(self, 'last_disk_io'):
            disk_rate = (disk_io.read_bytes - self.last_disk_io.read_bytes) / 1024 / 1024  # MB/s
            io_coherence = max(0, 100 - abs(disk_rate - 10) * 5)  # Optimal at 10 MB/s
        else:
            io_coherence = 50
        
        self.last_disk_io = disk_io
        
        # Overall coherence field strength (0-100)
        coherence = (
            cpu_coherence * 0.4 +
            memory_coherence * 0.3 +
            process_coherence * 0.2 +
            io_coherence * 0.1
        )
        
        # Track coherence history
        self.coherence_history.append(coherence)
        
        # Calculate coherence trend
        if len(self.coherence_history) > 10:
            recent = list(self.coherence_history)[-10:]
            older = list(self.coherence_history)[-20:-10] if len(self.coherence_history) > 20 else recent
            trend = np.mean(recent) - np.mean(older)
        else:
            trend = 0
        
        return {
            'field_strength': round(coherence, 1),
            'cpu_coherence': round(cpu_coherence, 1),
            'memory_coherence': round(memory_coherence, 1),
            'process_coherence': round(process_coherence, 1),
            'io_coherence': round(io_coherence, 1),
            'trend': 'increasing' if trend > 5 else 'decreasing' if trend < -5 else 'stable',
            'quality': self._get_coherence_quality(coherence)
        }
    
    def _get_coherence_quality(self, coherence):
        """Determine coherence field quality"""
        if coherence >= 80:
            return 'crystalline'
        elif coherence >= 60:
            return 'flowing'
        elif coherence >= 40:
            return 'turbulent'
        else:
            return 'chaotic'
    
    def track_energy_flow(self):
        """Track system energy patterns throughout the day"""
        current_hour = datetime.now().hour
        current_minute = datetime.now().minute
        
        # Calculate current energy level based on system activity
        cpu = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory().percent
        process_count = len(psutil.pids())
        
        # Energy = activity level normalized
        energy = (cpu + memory + (process_count / 10)) / 3
        
        # Store with timestamp
        self.energy_flow.append({
            'timestamp': time.time(),
            'hour': current_hour,
            'minute': current_minute,
            'energy': energy
        })
        
        # Identify patterns
        if len(self.energy_flow) > 60:  # At least 1 minute of data
            recent_energy = [e['energy'] for e in list(self.energy_flow)[-60:]]
            avg_energy = np.mean(recent_energy)
            
            # Track daily pattern
            self.daily_energy_pattern.append({
                'hour': current_hour,
                'energy': avg_energy
            })
            
            # Find peak and trough times
            if len(self.daily_energy_pattern) > 12:
                hourly_avg = defaultdict(list)
                for entry in self.daily_energy_pattern:
                    hourly_avg[entry['hour']].append(entry['energy'])
                
                hourly_energy = {h: np.mean(energies) for h, energies in hourly_avg.items()}
                if hourly_energy:
                    peak_hour = max(hourly_energy.items(), key=lambda x: x[1])
                    trough_hour = min(hourly_energy.items(), key=lambda x: x[1])
                    
                    self.energy_peak_time = peak_hour[0]
                    self.energy_trough_time = trough_hour[0]
        
        return energy
    
    def detect_sacred_patterns(self):
        """Detect sacred patterns in system behavior"""
        detected_patterns = []
        
        # Get current system state
        cpu = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory().percent
        processes = list(psutil.process_iter(['name', 'cpu_percent']))
        
        # Flow state - steady, low CPU usage
        if cpu < 30 and len(self.coherence_history) > 10:
            recent_coherence = list(self.coherence_history)[-10:]
            if np.std(recent_coherence) < 5:
                detected_patterns.append(self.sacred_glyphs['flow'])
        
        # Focus state - single dominant process
        if processes:
            cpu_by_process = sorted(processes, key=lambda p: p.info.get('cpu_percent', 0), reverse=True)
            if cpu_by_process[0].info.get('cpu_percent', 0) > 50:
                detected_patterns.append(self.sacred_glyphs['focus'])
        
        # Harmony state - balanced resource usage
        if 40 <= cpu <= 60 and 40 <= memory <= 60:
            detected_patterns.append(self.sacred_glyphs['harmony'])
        
        # Rest state - minimal activity
        if cpu < 10 and memory < 40:
            detected_patterns.append(self.sacred_glyphs['rest'])
        
        # Creation state - development tools active
        dev_tools = ['code', 'vim', 'emacs', 'idea', 'sublime']
        for proc in processes:
            if any(tool in proc.info['name'].lower() for tool in dev_tools):
                detected_patterns.append(self.sacred_glyphs['creation'])
                break
        
        return detected_patterns
    
    def play_awareness_sound(self, pattern_type='gentle'):
        """Play awareness sounds based on system state"""
        if not SOUND_ENABLED or not self.awareness_bell:
            return
            
        # Adjust volume based on pattern
        volume = 0.3 if pattern_type == 'gentle' else 0.5
        self.awareness_bell.set_volume(volume)
        self.awareness_bell.play()
    
    def calculate_enhanced_wellness(self):
        """Calculate comprehensive wellness metrics"""
        # Get base wellness metrics
        wellness = self.calculate_wellness_metrics()
        
        # Add enhanced metrics
        coherence = self.calculate_coherence_field()
        breath_state = self.update_breathing_rhythm()
        energy = self.track_energy_flow()
        patterns = self.detect_sacred_patterns()
        
        # Enhanced wellness incorporates coherence
        enhanced_score = (
            wellness['wellness_score'] * 0.6 +
            coherence['field_strength'] * 0.4
        )
        
        wellness['enhanced_score'] = round(enhanced_score, 1)
        wellness['coherence_field'] = coherence
        wellness['breath_state'] = breath_state
        wellness['energy_level'] = round(energy, 1)
        wellness['sacred_patterns'] = patterns
        
        # Add time-based recommendations
        current_hour = datetime.now().hour
        if self.energy_peak_time and abs(current_hour - self.energy_peak_time) <= 1:
            wellness['recommendations'].append("You're in your peak energy time. Perfect for deep work!")
        elif self.energy_trough_time and abs(current_hour - self.energy_trough_time) <= 1:
            wellness['recommendations'].append("Low energy period detected. Consider a break or lighter tasks.")
        
        return wellness
    
    def display_enhanced_metrics(self):
        """Display enhanced metrics with breathing rhythm and coherence"""
        os.system('clear' if os.name == 'posix' else 'cls')
        
        wellness = self.calculate_enhanced_wellness()
        
        # Header with breathing indicator
        breath_indicator = self._get_breath_indicator()
        print("=" * 80)
        print(" " * 20 + f"✨ Enhanced Sacred Monitor ✨ {breath_indicator}")
        print(" " * 12 + f"Wellness: {wellness['enhanced_score']}% | "
              f"Coherence: {wellness['coherence_field']['field_strength']}% "
              f"({wellness['coherence_field']['quality']})")
        print("=" * 80)
        
        # Coherence Field
        print("\n🌊 Coherence Field:")
        cf = wellness['coherence_field']
        print(f"  Field Strength: {self._health_bar(cf['field_strength'])}")
        print(f"  CPU Harmony:    {cf['cpu_coherence']}%")
        print(f"  Memory Flow:    {cf['memory_coherence']}%")
        print(f"  Process Unity:  {cf['process_coherence']}%")
        print(f"  I/O Stream:     {cf['io_coherence']}%")
        print(f"  Trend:          {cf['trend'].capitalize()}")
        
        # Energy Flow
        print(f"\n⚡ Energy Flow:")
        print(f"  Current Level: {self._energy_bar(wellness['energy_level'])}")
        if self.energy_peak_time:
            print(f"  Peak Time:     {self.energy_peak_time}:00")
        if self.energy_trough_time:
            print(f"  Rest Time:     {self.energy_trough_time}:00")
        
        # Sacred Patterns
        if wellness['sacred_patterns']:
            print("\n🔮 Active Sacred Patterns:")
            for pattern in wellness['sacred_patterns']:
                print(f"  ✦ {pattern['blessing']}")
        
        # Standard wellness metrics
        print("\n📊 System Wellness:")
        print(f"  Overall Health: {self._health_bar(wellness['system_health']['overall'])}")
        print(f"  Focus Score:    {self._health_bar(wellness['focus_health']['focus_score'])}")
        print(f"  Diversity:      {self._health_bar(wellness['diversity_health']['diversity_score'])}")
        
        # Recommendations
        print("\n💡 Guidance:")
        for rec in wellness['recommendations'][:3]:
            print(f"  • {rec}")
        
        print("\n" + "=" * 80)
        print(f"Breathing: {wellness['breath_state'].capitalize()} | "
              f"Energy: {wellness['energy_level']}% | "
              f"Press Ctrl+C to exit")
    
    def _get_breath_indicator(self):
        """Get visual breathing rhythm indicator"""
        phase_symbols = {
            "inhale": "◐ Inhale",
            "exhale": "◑ Exhale", 
            "pause": "◯ Pause"
        }
        return phase_symbols.get(self.update_breathing_rhythm(), "○")
    
    def _energy_bar(self, percentage):
        """Create energy-specific visual bar"""
        filled = int(percentage / 5)
        bar = "▰" * filled + "▱" * (20 - filled)
        
        if percentage >= 80:
            color = "\033[91m"  # Red - high energy
        elif percentage >= 60:
            color = "\033[93m"  # Yellow - active
        elif percentage >= 40:
            color = "\033[92m"  # Green - balanced
        else:
            color = "\033[94m"  # Blue - rest
            
        return f"{color}{bar}\033[0m {percentage:.0f}%"
    
    def _health_bar(self, percentage):
        """Create visual health bar"""
        filled = int(percentage / 5)
        bar = "█" * filled + "░" * (20 - filled)
        color = "\033[92m" if percentage >= 70 else "\033[93m" if percentage >= 40 else "\033[91m"
        return f"{color}{bar}\033[0m {percentage:.0f}%"
    
    def run_enhanced(self, interval=5):
        """Run enhanced monitor with awareness bells"""
        def signal_handler(sig, frame):
            print("\n\n🙏 May your computing bring peace and clarity. Namaste! 🙏\n")
            if SOUND_ENABLED:
                pygame.quit()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        
        last_bell_time = time.time()
        
        while True:
            self.display_enhanced_metrics()
            
            # Play awareness bell every 11 minutes (sacred interval)
            if time.time() - last_bell_time > 660:  # 11 minutes
                self.play_awareness_sound('gentle')
                last_bell_time = time.time()
            
            time.sleep(interval)
    
    # Include all base methods from parent
    def calculate_wellness_metrics(self):
        """Calculate wellness metrics (base implementation)"""
        metrics = {}
        
        # System Load Health
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        
        metrics['system_health'] = {
            'cpu_health': max(0, 100 - cpu_percent),
            'memory_health': max(0, 100 - memory.percent),
            'overall': (max(0, 100 - cpu_percent) + max(0, 100 - memory.percent)) / 2
        }
        
        # Focus Metrics
        current_time = time.time()
        recent_switches = len([s for s in self.context_switches 
                              if current_time - s < 60])
        
        metrics['focus_health'] = {
            'context_switches_per_minute': recent_switches,
            'focus_score': max(0, 100 - (recent_switches * 10)),
            'current_session_minutes': (current_time - self.current_focus_start) / 60 
                                     if self.current_focus_start else 0
        }
        
        # Process Diversity
        process_categories = defaultdict(int)
        for proc in psutil.process_iter(['name']):
            try:
                category = self._categorize_process(proc.info['name'])
                process_categories[category] += 1
            except:
                continue
                
        metrics['diversity_health'] = {
            'category_count': len(process_categories),
            'diversity_score': min(100, len(process_categories) * 20),
            'dominant_category': max(process_categories.items(), key=lambda x: x[1])[0] 
                               if process_categories else 'none'
        }
        
        # Resource Balance
        top_consumers = []
        for proc in psutil.process_iter(['name', 'cpu_percent', 'memory_percent']):
            try:
                if proc.info['cpu_percent'] > 10:
                    top_consumers.append(proc.info)
            except:
                continue
                
        metrics['resource_balance'] = {
            'heavy_processes': len(top_consumers),
            'balance_score': max(0, 100 - (len(top_consumers) * 20)),
            'top_consumer': top_consumers[0]['name'] if top_consumers else 'none'
        }
        
        # Digital Wellness Score
        wellness_score = (
            metrics['system_health']['overall'] * 0.25 +
            metrics['focus_health']['focus_score'] * 0.35 +
            metrics['diversity_health']['diversity_score'] * 0.20 +
            metrics['resource_balance']['balance_score'] * 0.20
        )
        
        metrics['wellness_score'] = round(wellness_score, 1)
        metrics['wellness_level'] = self._get_wellness_level(wellness_score)
        metrics['recommendations'] = self._get_recommendations(metrics)
        
        return metrics
    
    def _categorize_process(self, name):
        """Categorize process by function"""
        name_lower = name.lower()
        
        if any(tool in name_lower for tool in ['code', 'vim', 'emacs', 'idea', 'sublime']):
            return 'development'
        elif any(tool in name_lower for tool in ['slack', 'teams', 'zoom', 'discord']):
            return 'communication'
        elif any(tool in name_lower for tool in ['chrome', 'firefox', 'safari', 'edge']):
            return 'browser'
        elif any(tool in name_lower for tool in ['spotify', 'vlc', 'mpv']):
            return 'media'
        elif any(tool in name_lower for tool in ['docker', 'kubectl', 'terraform']):
            return 'infrastructure'
        elif name_lower.startswith(('kernel', 'systemd', 'init')):
            return 'system'
        else:
            return 'other'
    
    def _get_wellness_level(self, score):
        """Convert score to wellness level"""
        if score >= 80:
            return 'excellent'
        elif score >= 60:
            return 'good'
        elif score >= 40:
            return 'fair'
        else:
            return 'needs attention'
    
    def _get_recommendations(self, metrics):
        """Provide recommendations"""
        recommendations = []
        
        if metrics['system_health']['cpu_health'] < 50:
            recommendations.append("High CPU usage. Consider closing unused applications.")
            
        if metrics['focus_health']['context_switches_per_minute'] > 10:
            recommendations.append("Frequent context switching. Focus on one task.")
            
        if metrics['diversity_health']['diversity_score'] < 40:
            recommendations.append("Limited diversity. Take a break or switch activities.")
            
        if not recommendations:
            recommendations.append("System wellness optimal. Continue mindful computing.")
            
        return recommendations


def main():
    parser = argparse.ArgumentParser(description='Enhanced Sacred Process Monitor')
    parser.add_argument('--interval', type=int, default=5, help='Update interval')
    parser.add_argument('--sound', action='store_true', help='Enable sound notifications')
    
    args = parser.parse_args()
    
    monitor = EnhancedSacredMonitor()
    monitor.run_enhanced(interval=args.interval)


if __name__ == "__main__":
    main()