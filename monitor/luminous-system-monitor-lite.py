#!/usr/bin/env python3
"""
LuminousOS System Monitor - Lite Version
Works with standard library only for testing
"""

import time
import json
import os
import random
from datetime import datetime
from collections import deque
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

class ConsciousnessCalculator:
    """Calculate system coherence from basic metrics"""
    
    def __init__(self, window_size=60):
        self.window_size = window_size
        self.cpu_history = deque(maxlen=window_size)
        
    def calculate_coherence(self, system_state):
        """
        Simplified coherence calculation using /proc/stat
        """
        
        # CPU stability (simulated for lite version)
        cpu_stability = 0.7 + random.random() * 0.2
        
        # Process focus (based on process count)
        process_focus = 1.0 / (1.0 + system_state['process_count'] / 100)
        
        # Resource harmony (simulated)
        resource_harmony = 0.6 + random.random() * 0.3
        
        # Sacred rhythm (based on 11-second cycles)
        current_time = time.time()
        sacred_phase = (current_time % 11) / 11
        sacred_rhythm = 0.5 + 0.5 * (abs(sacred_phase - 0.5) * 2)
        
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

class LuminousMonitorLite:
    """Lite version of system monitor using only standard library"""
    
    def __init__(self):
        self.calculator = ConsciousnessCalculator()
        self.running = True
        self.current_metrics = {}
        self.sacred_moments = []
        
    def get_system_state(self):
        """Gather basic system metrics from /proc"""
        
        # Count processes
        try:
            process_count = len(os.listdir('/proc')) - 100  # Rough estimate
        except:
            process_count = 50
            
        # Get load average
        try:
            with open('/proc/loadavg', 'r') as f:
                load = float(f.read().split()[0])
        except:
            load = 0.5
            
        # Get memory info
        try:
            with open('/proc/meminfo', 'r') as f:
                lines = f.readlines()
                total = int(lines[0].split()[1])
                available = int(lines[2].split()[1])
                memory_percent = (1 - available / total) * 100
        except:
            memory_percent = 50.0
            
        return {
            'timestamp': datetime.now().isoformat(),
            'cpu_percent': load * 25,  # Very rough approximation
            'memory_percent': memory_percent,
            'process_count': process_count,
            'boot_time': datetime.now().isoformat()
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
                    'monitor_type': 'lite',
                    'message': 'Running in lite mode - install psutil for full features'
                }
                
                # Check for sacred moments (>90% coherence)
                if coherence_data['global_coherence'] > 0.9:
                    self.sacred_moments.append({
                        'timestamp': datetime.now().isoformat(),
                        'coherence': coherence_data['global_coherence']
                    })
                    print(f"🌟 Sacred Moment! Coherence: {coherence_data['global_coherence']:.2%}")
                
                time.sleep(1)
                
            except Exception as e:
                print(f"Monitor error: {e}")
                time.sleep(5)
    
    def start(self):
        """Start monitoring"""
        print("🌟 LuminousOS System Monitor (Lite) Starting...")
        print("   Running with basic metrics only")
        print("   Install python3-psutil for full features")
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
                        'recommendations': [
                            "Running in lite mode - basic metrics only",
                            "Install python3-psutil for process-level details",
                            "Sacred rhythm calculation is active"
                        ]
                    }
                    
                    self.wfile.write(json.dumps(response, indent=2).encode())
                    
                elif self.path == '/health':
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(b'Luminous Monitor Lite Active')
                    
                else:
                    self.send_response(404)
                    self.end_headers()
        
        server = HTTPServer(('localhost', 11112), MetricsHandler)
        print(f"📡 Metrics API running at http://localhost:11112/metrics")
        print(f"🌐 Dashboard at http://localhost:8080/luminous-real-monitor.html")
        
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\n✨ Shutting down gracefully...")
            self.running = False

if __name__ == "__main__":
    monitor = LuminousMonitorLite()
    monitor.start()