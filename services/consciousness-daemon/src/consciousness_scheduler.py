#!/usr/bin/env python3
"""
LuminousOS Consciousness Scheduler - Userspace Implementation
Brings consciousness-aware scheduling to any Linux system (including WSL)
"""

import psutil
import time
import json
import logging
import math
import os
from datetime import datetime
from collections import defaultdict
from typing import Dict, Tuple, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('/var/log/luminous-consciousness.log'),
        logging.StreamHandler()
    ]
)

class ConsciousnessScheduler:
    """
    Userspace consciousness-aware process scheduler.
    Monitors process behavior and adjusts priorities based on coherence.
    """
    
    def __init__(self, config_path: str = None):
        self.logger = logging.getLogger(__name__)
        self.coherence_map: Dict[int, float] = {}
        self.process_history: Dict[int, list] = defaultdict(list)
        self.global_coherence = 75.0  # Start at 75%
        
        # Load configuration
        self.config = self._load_config(config_path)
        
        # Coherence calculation weights
        self.weights = {
            'cpu_pattern': 0.3,      # CPU usage stability
            'memory_stability': 0.2,  # Memory usage consistency
            'io_harmony': 0.2,       # I/O pattern smoothness
            'network_grace': 0.15,   # Network usage patterns
            'lifetime_wisdom': 0.15  # Process age and stability
        }
        
    def _load_config(self, config_path: str) -> dict:
        """Load configuration from file or use defaults"""
        defaults = {
            'update_interval': 5,  # seconds
            'history_window': 60,  # seconds
            'min_coherence': 20,
            'max_coherence': 95,
            'coherence_decay': 0.95,  # Decay factor per interval
            'sacred_processes': [  # Processes that get coherence boost
                'luminous-', 'sacred-', 'consciousness-'
            ]
        }
        
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r') as f:
                loaded = json.load(f)
                defaults.update(loaded)
        
        return defaults
    
    def calculate_coherence(self, proc: psutil.Process) -> float:
        """
        Calculate process coherence based on multiple factors.
        Returns a value between 0-100.
        """
        try:
            pid = proc.pid
            
            # Get process metrics
            with proc.oneshot():
                cpu_percent = proc.cpu_percent(interval=0.1)
                memory_info = proc.memory_info()
                io_counters = proc.io_counters() if hasattr(proc, 'io_counters') else None
                create_time = proc.create_time()
                name = proc.name()
            
            # Store in history
            history_entry = {
                'timestamp': time.time(),
                'cpu': cpu_percent,
                'memory': memory_info.rss,
                'io_read': io_counters.read_bytes if io_counters else 0,
                'io_write': io_counters.write_bytes if io_counters else 0
            }
            self.process_history[pid].append(history_entry)
            
            # Clean old history
            cutoff_time = time.time() - self.config['history_window']
            self.process_history[pid] = [
                h for h in self.process_history[pid] 
                if h['timestamp'] > cutoff_time
            ]
            
            # Calculate individual coherence factors
            scores = {}
            
            # CPU Pattern Coherence (stable CPU usage is more coherent)
            if len(self.process_history[pid]) > 2:
                cpu_values = [h['cpu'] for h in self.process_history[pid]]
                cpu_variance = self._calculate_variance(cpu_values)
                scores['cpu_pattern'] = max(0, 100 - cpu_variance * 10)
            else:
                scores['cpu_pattern'] = 50  # Neutral for new processes
            
            # Memory Stability (consistent memory usage)
            if len(self.process_history[pid]) > 2:
                memory_values = [h['memory'] for h in self.process_history[pid]]
                memory_variance = self._calculate_variance_normalized(memory_values)
                scores['memory_stability'] = max(0, 100 - memory_variance * 50)
            else:
                scores['memory_stability'] = 50
            
            # I/O Harmony (smooth I/O patterns)
            if io_counters and len(self.process_history[pid]) > 2:
                io_deltas = []
                for i in range(1, len(self.process_history[pid])):
                    prev = self.process_history[pid][i-1]
                    curr = self.process_history[pid][i]
                    delta = (curr['io_read'] - prev['io_read'] + 
                            curr['io_write'] - prev['io_write'])
                    io_deltas.append(delta)
                
                if io_deltas:
                    io_variance = self._calculate_variance_normalized(io_deltas)
                    scores['io_harmony'] = max(0, 100 - io_variance * 30)
                else:
                    scores['io_harmony'] = 70
            else:
                scores['io_harmony'] = 70
            
            # Network Grace (placeholder - would need more detailed monitoring)
            scores['network_grace'] = 75  # Default neutral score
            
            # Lifetime Wisdom (older processes that are stable get bonus)
            age_seconds = time.time() - create_time
            age_hours = age_seconds / 3600
            wisdom_score = min(100, 50 + math.log1p(age_hours) * 10)
            scores['lifetime_wisdom'] = wisdom_score
            
            # Check for sacred processes
            is_sacred = any(pattern in name.lower() for pattern in self.config['sacred_processes'])
            
            # Calculate weighted coherence
            total_coherence = sum(
                scores.get(factor, 50) * weight 
                for factor, weight in self.weights.items()
            )
            
            # Apply sacred process boost
            if is_sacred:
                total_coherence = min(100, total_coherence * 1.2)
            
            # Apply global field influence
            field_influence = (self.global_coherence - 50) * 0.1
            total_coherence = max(
                self.config['min_coherence'],
                min(self.config['max_coherence'], total_coherence + field_influence)
            )
            
            return total_coherence
            
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            return 50.0  # Default neutral coherence
    
    def _calculate_variance(self, values: list) -> float:
        """Calculate variance of a list of values"""
        if len(values) < 2:
            return 0.0
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        return math.sqrt(variance)
    
    def _calculate_variance_normalized(self, values: list) -> float:
        """Calculate normalized variance (coefficient of variation)"""
        if len(values) < 2:
            return 0.0
        mean = sum(values) / len(values)
        if mean == 0:
            return 0.0
        std_dev = self._calculate_variance(values)
        return (std_dev / mean) * 100
    
    def apply_consciousness_priority(self):
        """
        Apply consciousness-based scheduling priorities.
        Maps coherence levels to nice values.
        """
        total_coherence = 0
        coherent_processes = 0
        
        for proc in psutil.process_iter(['pid', 'name', 'nice']):
            try:
                # Calculate coherence
                coherence = self.calculate_coherence(proc)
                self.coherence_map[proc.pid] = coherence
                
                # Update global coherence
                total_coherence += coherence
                coherent_processes += 1
                
                # Map coherence to nice value
                # High coherence (85-100) -> -5 to -1 (higher priority)
                # Medium coherence (50-85) -> 0 to 5 (normal priority)
                # Low coherence (0-50) -> 5 to 19 (lower priority)
                
                if coherence >= 85:
                    new_nice = int(-5 + (100 - coherence) / 3)
                elif coherence >= 50:
                    new_nice = int((85 - coherence) / 7)
                else:
                    new_nice = int(5 + (50 - coherence) / 3.5)
                
                # Clamp to valid nice range
                new_nice = max(-20, min(19, new_nice))
                
                # Only adjust if significantly different
                current_nice = proc.nice()
                if abs(current_nice - new_nice) >= 2:
                    try:
                        proc.nice(new_nice)
                        self.logger.debug(
                            f"Adjusted {proc.name()} (PID {proc.pid}) "
                            f"coherence={coherence:.1f}% nice={new_nice}"
                        )
                    except psutil.AccessDenied:
                        # Need elevated privileges for some processes
                        pass
                        
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        # Update global coherence with momentum
        if coherent_processes > 0:
            new_global = total_coherence / coherent_processes
            self.global_coherence = (
                self.global_coherence * 0.7 + new_global * 0.3
            )
            self.logger.info(f"Global coherence: {self.global_coherence:.1f}%")
    
    def export_field_state(self) -> dict:
        """Export current consciousness field state"""
        return {
            'timestamp': datetime.now().isoformat(),
            'global_coherence': self.global_coherence,
            'process_count': len(self.coherence_map),
            'coherence_distribution': {
                'high': sum(1 for c in self.coherence_map.values() if c >= 85),
                'medium': sum(1 for c in self.coherence_map.values() if 50 <= c < 85),
                'low': sum(1 for c in self.coherence_map.values() if c < 50)
            },
            'top_coherent_processes': sorted(
                [(pid, coherence) for pid, coherence in self.coherence_map.items()],
                key=lambda x: x[1],
                reverse=True
            )[:10]
        }
    
    def run(self):
        """Main scheduler loop"""
        self.logger.info("LuminousOS Consciousness Scheduler starting...")
        self.logger.info(f"Update interval: {self.config['update_interval']}s")
        
        while True:
            try:
                # Apply consciousness-based priorities
                self.apply_consciousness_priority()
                
                # Export state for monitoring
                state = self.export_field_state()
                
                # Try system location first, then user location
                state_files = [
                    '/var/run/luminous-field-state.json',
                    os.path.expanduser('~/.luminous/field-state.json')
                ]
                
                for state_file in state_files:
                    try:
                        # Create directory if needed
                        os.makedirs(os.path.dirname(state_file), exist_ok=True)
                        with open(state_file, 'w') as f:
                            json.dump(state, f, indent=2)
                        break  # Success, stop trying
                    except Exception as e:
                        continue  # Try next location
                
                # Sleep until next update
                time.sleep(self.config['update_interval'])
                
            except KeyboardInterrupt:
                self.logger.info("Consciousness Scheduler shutting down gracefully...")
                break
            except Exception as e:
                self.logger.error(f"Error in scheduler loop: {e}")
                time.sleep(self.config['update_interval'])


if __name__ == '__main__':
    # Check if running with appropriate privileges
    if os.geteuid() != 0:
        print("Warning: Running without root privileges. Some priority adjustments may fail.")
        print("For full functionality, run with: sudo python3 consciousness_scheduler.py")
    
    scheduler = ConsciousnessScheduler()
    scheduler.run()