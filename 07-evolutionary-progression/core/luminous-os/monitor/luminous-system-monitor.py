#!/usr/bin/env python3
"""
LuminousOS System Monitor - Real Consciousness Metrics
Bridges the gap between vision and reality
"""

import psutil
import time
import json
import numpy as np
from datetime import datetime
from collections import deque
import threading
import signal
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

class ConsciousnessCalculator:
    """Calculate system coherence from real metrics"""
    
    def __init__(self, window_size=60):
        self.window_size = window_size
        self.cpu_history = deque(maxlen=window_size)
        self.process_switches = deque(maxlen=window_size)
        self.interrupt_times = deque(maxlen=window_size * 10)
        self.last_process_count = 0
        
    def calculate_coherence(self, system_state):
        """
        Calculate coherence based on:
        - CPU usage stability (less erratic = more coherent)
        - Process switching frequency (less = more focused)
        - Resource distribution (more balanced = more harmonious)
        - User interaction patterns (rhythmic = coherent)
        """
        
        # CPU Stability (0-1, higher is more stable)
        cpu_percent = system_state['cpu_percent']
        self.cpu_history.append(cpu_percent)
        if len(self.cpu_history) > 10:
            cpu_variance = np.var(list(self.cpu_history))
            cpu_stability = 1.0 / (1.0 + cpu_variance / 100)
        else:
            cpu_stability = 0.5
            
        # Process Focus (0-1, fewer switches = more focused)
        process_count = len(system_state['processes'])
        process_change = abs(process_count - self.last_process_count)
        self.last_process_count = process_count
        self.process_switches.append(process_change)
        
        avg_switches = np.mean(list(self.process_switches)) if self.process_switches else 0
        process_focus = 1.0 / (1.0 + avg_switches)
        
        # Resource Harmony (0-1, balanced distribution)
        cpu_by_process = [p['cpu_percent'] for p in system_state['processes'][:10]]
        if cpu_by_process:
            resource_variance = np.var(cpu_by_process)
            resource_harmony = 1.0 / (1.0 + resource_variance / 10)
        else:
            resource_harmony = 0.5
            
        # Sacred Rhythm (0-1, based on 11-second cycles)
        current_time = time.time()
        sacred_phase = (current_time % 11) / 11
        sacred_rhythm = 0.5 + 0.5 * np.sin(2 * np.pi * sacred_phase)
        
        # Combine factors
        coherence = (
            0.3 * cpu_stability +
            0.3 * process_focus +
            0.2 * resource_harmony +
            0.2 * sacred_rhythm
        )
        
        return {
            'global_coherence': coherence,
            'cpu_stability': cpu_stability,
            'process_focus': process_focus,
            'resource_harmony': resource_harmony,
            'sacred_rhythm': sacred_rhythm
        }

class ProcessClassifier:
    """Classify processes by consciousness mode"""
    
    SACRED_PROCESSES = {
        'meditation', 'mindful', 'yoga', 'breathing', 'journal'
    }
    
    CREATIVE_PROCESSES = {
        'code', 'vim', 'emacs', 'artist', 'music', 'write', 'design'
    }
    
    CONSUMING_PROCESSES = {
        'browser', 'youtube', 'netflix', 'game', 'social'
    }
    
    SYSTEM_PROCESSES = {
        'kernel', 'systemd', 'init', 'driver'
    }
    
    @classmethod
    def classify(cls, process_name):
        """Determine consciousness mode for a process"""
        name_lower = process_name.lower()
        
        # Check categories
        if any(s in name_lower for s in cls.SACRED_PROCESSES):
            return 'FullConsciousness'
        elif any(s in name_lower for s in cls.CREATIVE_PROCESSES):
            return 'Balanced'
        elif any(s in name_lower for s in cls.CONSUMING_PROCESSES):
            return 'BasicConsciousness'
        elif any(s in name_lower for s in cls.SYSTEM_PROCESSES):
            return 'Performance'
        else:
            return 'Balanced'
    
    @classmethod
    def get_coherence_multiplier(cls, mode):
        """Get coherence contribution by mode"""
        multipliers = {
            'FullConsciousness': 1.2,
            'Balanced': 1.0,
            'BasicConsciousness': 0.8,
            'Performance': 0.6,
            'Sleep': 0.4
        }
        return multipliers.get(mode, 1.0)

class LuminousMonitor:
    """Main system monitor"""
    
    def __init__(self):
        self.calculator = ConsciousnessCalculator()
        self.running = True
        self.current_metrics = {}
        self.sacred_moments = []
        self.anomalies = []
        
    def get_system_state(self):
        """Gather current system metrics"""
        
        # Get top processes by CPU
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                pinfo = proc.info
                if pinfo['cpu_percent'] > 0.1:  # Only include active processes
                    pinfo['mode'] = ProcessClassifier.classify(pinfo['name'])
                    processes.append(pinfo)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        
        # Sort by CPU usage
        processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
        
        return {
            'timestamp': datetime.now().isoformat(),
            'cpu_percent': psutil.cpu_percent(interval=0.1),
            'memory_percent': psutil.virtual_memory().percent,
            'process_count': len(processes),
            'processes': processes[:20],  # Top 20
            'boot_time': datetime.fromtimestamp(psutil.boot_time()).isoformat()
        }
    
    def monitor_loop(self):
        """Main monitoring loop"""
        
        while self.running:
            try:
                # Get system state
                state = self.get_system_state()
                
                # Calculate coherence
                coherence_data = self.calculator.calculate_coherence(state)
                
                # Update metrics
                self.current_metrics = {
                    **state,
                    **coherence_data,
                    'sacred_moments': len(self.sacred_moments),
                    'anomalies': len(self.anomalies)
                }
                
                # Check for sacred moments (>90% coherence)
                if coherence_data['global_coherence'] > 0.9:
                    self.sacred_moments.append({
                        'timestamp': datetime.now().isoformat(),
                        'coherence': coherence_data['global_coherence'],
                        'trigger': 'natural_emergence'
                    })
                    print(f"🌟 Sacred Moment! Coherence: {coherence_data['global_coherence']:.2%}")
                
                # Check for anomalies (<30% coherence)
                if coherence_data['global_coherence'] < 0.3:
                    self.anomalies.append({
                        'timestamp': datetime.now().isoformat(),
                        'coherence': coherence_data['global_coherence'],
                        'type': 'low_coherence'
                    })
                    print(f"⚠️  Anomaly detected! Coherence: {coherence_data['global_coherence']:.2%}")
                
                time.sleep(1)  # Update every second
                
            except Exception as e:
                print(f"Monitor error: {e}")
                time.sleep(5)
    
    def get_recommendations(self):
        """Generate recommendations based on current state"""
        
        if not self.current_metrics:
            return []
            
        recommendations = []
        coherence = self.current_metrics.get('global_coherence', 0.5)
        
        if coherence < 0.4:
            recommendations.append("System coherence is low. Consider closing some applications and taking a mindful break.")
        
        if self.current_metrics.get('cpu_stability', 1) < 0.5:
            recommendations.append("CPU usage is erratic. Check for runaway processes or system issues.")
            
        if self.current_metrics.get('process_focus', 1) < 0.5:
            recommendations.append("High process switching detected. Try focusing on fewer tasks.")
            
        consuming_count = sum(1 for p in self.current_metrics.get('processes', [])
                            if ProcessClassifier.classify(p['name']) == 'BasicConsciousness')
        if consuming_count > 5:
            recommendations.append(f"{consuming_count} consuming processes active. Consider mindful consumption.")
            
        return recommendations
    
    def start(self):
        """Start monitoring"""
        print("🌟 LuminousOS System Monitor Starting...")
        print("   Calculating real consciousness metrics")
        print("   Monitoring system coherence")
        print("   Press Ctrl+C to stop\n")
        
        # Start monitor thread
        monitor_thread = threading.Thread(target=self.monitor_loop)
        monitor_thread.daemon = True
        monitor_thread.start()
        
        # Start HTTP server
        self.start_http_server()
    
    def start_http_server(self):
        """Start HTTP API server"""
        monitor = self
        
        class MetricsHandler(BaseHTTPRequestHandler):
            def log_message(self, format, *args):
                pass  # Suppress logs
                
            def do_GET(self):
                if self.path == '/metrics':
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    response = {
                        **monitor.current_metrics,
                        'recommendations': monitor.get_recommendations()
                    }
                    
                    self.wfile.write(json.dumps(response, indent=2).encode())
                    
                elif self.path == '/health':
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(b'Luminous Monitor Active')
                    
                else:
                    self.send_response(404)
                    self.end_headers()
        
        server = HTTPServer(('localhost', 11112), MetricsHandler)
        print(f"📡 Metrics API running at http://localhost:11112/metrics")
        
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\n✨ Shutting down gracefully...")
            self.running = False

def signal_handler(sig, frame):
    print("\n✨ Sacred shutdown initiated...")
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    
    monitor = LuminousMonitor()
    monitor.start()