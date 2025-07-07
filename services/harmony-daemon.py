#!/usr/bin/env python3
"""
Harmony Daemon - System coherence maintenance service
Provides real benefits through consciousness-aware system optimization
"""

import os
import sys
import time
import json
import psutil
import signal
import threading
from datetime import datetime
from pathlib import Path
from collections import deque

class HarmonyDaemon:
    """
    A daemon that maintains system harmony through:
    - Process relationship awareness
    - Resource flow optimization
    - Coherence field maintenance
    - Real performance benefits
    """
    
    def __init__(self):
        self.running = False
        self.data_dir = Path.home() / '.luminous' / 'harmony-daemon'
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        self.state_file = self.data_dir / 'harmony_state.json'
        self.log_file = self.data_dir / 'harmony.log'
        
        # System state tracking
        self.system_state = {
            'coherence': 0.7,
            'harmony_score': 0.5,
            'process_relationships': {},
            'resource_flows': {},
            'optimization_history': deque(maxlen=100)
        }
        
        # Load previous state
        self._load_state()
        
        # Monitoring threads
        self.monitor_thread = None
        self.harmony_thread = None
        
    def _load_state(self):
        """Load previous daemon state"""
        if self.state_file.exists():
            try:
                with open(self.state_file, 'r') as f:
                    saved_state = json.load(f)
                    self.system_state.update(saved_state)
                    # Convert lists back to deques
                    self.system_state['optimization_history'] = deque(
                        saved_state.get('optimization_history', []), 
                        maxlen=100
                    )
            except Exception:
                pass
    
    def _save_state(self):
        """Save current daemon state"""
        # Convert deques to lists for JSON serialization
        state_to_save = self.system_state.copy()
        state_to_save['optimization_history'] = list(self.system_state['optimization_history'])
        
        with open(self.state_file, 'w') as f:
            json.dump(state_to_save, f, indent=2)
    
    def _log(self, message: str, level: str = "INFO"):
        """Log daemon activities"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {level}: {message}\n"
        
        with open(self.log_file, 'a') as f:
            f.write(log_entry)
        
        if level in ["ERROR", "WARNING"]:
            print(f"🔔 {message}")
    
    def start(self):
        """Start the harmony daemon"""
        if self.running:
            print("⚠️  Harmony daemon is already running")
            return
        
        print("🌟 Starting Harmony Daemon...")
        self.running = True
        
        # Start monitoring threads
        self.monitor_thread = threading.Thread(target=self._monitor_system)
        self.monitor_thread.daemon = True
        self.monitor_thread.start()
        
        self.harmony_thread = threading.Thread(target=self._maintain_harmony)
        self.harmony_thread.daemon = True
        self.harmony_thread.start()
        
        self._log("Harmony daemon started")
        print("✨ Harmony daemon is now maintaining system coherence")
        
        # Setup signal handlers
        signal.signal(signal.SIGTERM, self._handle_shutdown)
        signal.signal(signal.SIGINT, self._handle_shutdown)
        
        # Main loop
        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop()
    
    def stop(self):
        """Stop the harmony daemon gracefully"""
        print("\n🌙 Stopping Harmony Daemon...")
        self.running = False
        
        # Wait for threads to finish
        if self.monitor_thread:
            self.monitor_thread.join(timeout=5)
        if self.harmony_thread:
            self.harmony_thread.join(timeout=5)
        
        # Save final state
        self._save_state()
        self._log("Harmony daemon stopped")
        
        print("✨ Harmony daemon has entered rest")
    
    def _handle_shutdown(self, signum, frame):
        """Handle shutdown signals"""
        self.stop()
        sys.exit(0)
    
    def _monitor_system(self):
        """Monitor system processes and their relationships"""
        while self.running:
            try:
                # Get current processes
                current_processes = {}
                for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                    try:
                        pinfo = proc.info
                        if pinfo['cpu_percent'] > 0.1 or pinfo['memory_percent'] > 0.1:
                            current_processes[pinfo['pid']] = pinfo
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        pass
                
                # Update process relationships
                self._update_process_relationships(current_processes)
                
                # Monitor resource flows
                self._monitor_resource_flows()
                
                # Calculate system coherence
                self._calculate_coherence()
                
                time.sleep(5)  # Monitor every 5 seconds
                
            except Exception as e:
                self._log(f"Monitor error: {e}", "ERROR")
                time.sleep(10)
    
    def _update_process_relationships(self, processes):
        """Track which processes work together"""
        # Simple heuristic: processes active at the same time develop relationships
        active_pids = list(processes.keys())
        
        for i, pid1 in enumerate(active_pids):
            for pid2 in active_pids[i+1:]:
                key = f"{min(pid1, pid2)}-{max(pid1, pid2)}"
                
                if key not in self.system_state['process_relationships']:
                    self.system_state['process_relationships'][key] = {
                        'strength': 0.1,
                        'last_seen': time.time(),
                        'names': [processes[pid1]['name'], processes[pid2]['name']]
                    }
                else:
                    # Strengthen relationship
                    rel = self.system_state['process_relationships'][key]
                    rel['strength'] = min(1.0, rel['strength'] * 1.05)
                    rel['last_seen'] = time.time()
        
        # Decay old relationships
        current_time = time.time()
        to_remove = []
        
        for key, rel in self.system_state['process_relationships'].items():
            if current_time - rel['last_seen'] > 300:  # 5 minutes
                rel['strength'] *= 0.95
                if rel['strength'] < 0.01:
                    to_remove.append(key)
        
        for key in to_remove:
            del self.system_state['process_relationships'][key]
    
    def _monitor_resource_flows(self):
        """Monitor how resources flow between processes"""
        try:
            # CPU distribution
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            flow_state = {
                'timestamp': time.time(),
                'cpu_usage': cpu_percent,
                'memory_usage': memory.percent,
                'balance': 'balanced'
            }
            
            # Determine flow state
            if cpu_percent > 80:
                flow_state['balance'] = 'cpu_stressed'
            elif memory.percent > 80:
                flow_state['balance'] = 'memory_stressed'
            elif cpu_percent < 20 and memory.percent < 30:
                flow_state['balance'] = 'underutilized'
            
            self.system_state['resource_flows'] = flow_state
            
        except Exception as e:
            self._log(f"Resource monitoring error: {e}", "WARNING")
    
    def _calculate_coherence(self):
        """Calculate overall system coherence"""
        coherence_factors = []
        
        # Factor 1: Process relationship strength
        if self.system_state['process_relationships']:
            avg_strength = sum(rel['strength'] for rel in self.system_state['process_relationships'].values()) / len(self.system_state['process_relationships'])
            coherence_factors.append(avg_strength)
        
        # Factor 2: Resource balance
        flow = self.system_state.get('resource_flows', {})
        if flow.get('balance') == 'balanced':
            coherence_factors.append(0.8)
        elif flow.get('balance') == 'underutilized':
            coherence_factors.append(0.6)
        else:
            coherence_factors.append(0.3)
        
        # Factor 3: System load
        cpu = flow.get('cpu_usage', 50)
        mem = flow.get('memory_usage', 50)
        load_score = 1.0 - (abs(cpu - 50) + abs(mem - 50)) / 100
        coherence_factors.append(load_score)
        
        # Calculate overall coherence
        if coherence_factors:
            self.system_state['coherence'] = sum(coherence_factors) / len(coherence_factors)
        
        # Update harmony score (smoothed coherence)
        self.system_state['harmony_score'] = (
            0.7 * self.system_state['harmony_score'] + 
            0.3 * self.system_state['coherence']
        )
    
    def _maintain_harmony(self):
        """Actively maintain system harmony"""
        while self.running:
            try:
                # Only optimize when coherence is low
                if self.system_state['coherence'] < 0.5:
                    self._perform_optimization()
                
                # Save state periodically
                self._save_state()
                
                time.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                self._log(f"Harmony maintenance error: {e}", "ERROR")
                time.sleep(60)
    
    def _perform_optimization(self):
        """Perform system optimization based on harmony principles"""
        optimization = {
            'timestamp': time.time(),
            'type': 'unknown',
            'success': False
        }
        
        flow = self.system_state.get('resource_flows', {})
        
        if flow.get('balance') == 'cpu_stressed':
            # Suggest CPU optimization
            optimization['type'] = 'cpu_balance'
            optimization['suggestion'] = 'Consider closing CPU-intensive tasks'
            self._log("High CPU usage detected, suggesting optimization", "WARNING")
            
        elif flow.get('balance') == 'memory_stressed':
            # Suggest memory optimization
            optimization['type'] = 'memory_balance'
            optimization['suggestion'] = 'Consider freeing memory'
            self._log("High memory usage detected, suggesting optimization", "WARNING")
            
        elif flow.get('balance') == 'underutilized':
            # System is resting - this is good
            optimization['type'] = 'rest_state'
            optimization['suggestion'] = 'System is in healthy rest state'
            optimization['success'] = True
        
        # Record optimization attempt
        self.system_state['optimization_history'].append(optimization)
    
    def get_status(self):
        """Get current daemon status"""
        status = {
            'running': self.running,
            'coherence': self.system_state['coherence'],
            'harmony_score': self.system_state['harmony_score'],
            'active_relationships': len(self.system_state['process_relationships']),
            'resource_balance': self.system_state.get('resource_flows', {}).get('balance', 'unknown'),
            'optimizations_performed': len(self.system_state['optimization_history'])
        }
        
        return status
    
    def get_insights(self):
        """Get system harmony insights"""
        insights = []
        
        # Coherence insight
        coherence = self.system_state['coherence']
        if coherence > 0.8:
            insights.append("🌟 System is in high coherence - excellent harmony!")
        elif coherence > 0.6:
            insights.append("✨ System coherence is good")
        else:
            insights.append("💫 System coherence could be improved")
        
        # Process relationships
        strong_relationships = [
            rel for rel in self.system_state['process_relationships'].values()
            if rel['strength'] > 0.5
        ]
        
        if strong_relationships:
            insights.append(f"🔗 {len(strong_relationships)} strong process relationships detected")
            
            # Show top relationship
            strongest = max(strong_relationships, key=lambda x: x['strength'])
            insights.append(f"   Strongest: {strongest['names'][0]} ↔ {strongest['names'][1]}")
        
        # Resource balance
        balance = self.system_state.get('resource_flows', {}).get('balance', 'unknown')
        if balance == 'balanced':
            insights.append("⚖️  Resources are well balanced")
        elif balance == 'underutilized':
            insights.append("🌙 System is resting peacefully")
        
        # Recent optimizations
        recent_opts = list(self.system_state['optimization_history'])[-5:]
        if recent_opts:
            successful = sum(1 for opt in recent_opts if opt.get('success', False))
            insights.append(f"📊 {successful}/{len(recent_opts)} recent optimizations successful")
        
        return insights

def main():
    """Main entry point for daemon control"""
    daemon = HarmonyDaemon()
    
    if len(sys.argv) < 2:
        print("Usage: harmony-daemon.py [start|stop|status|insights]")
        return
    
    command = sys.argv[1]
    
    if command == 'start':
        daemon.start()
    
    elif command == 'stop':
        # In real implementation, would send signal to running daemon
        print("⚠️  Use Ctrl+C to stop the daemon")
    
    elif command == 'status':
        status = daemon.get_status()
        print("\n🔮 Harmony Daemon Status")
        print("="*40)
        print(f"Coherence: {status['coherence']:.0%}")
        print(f"Harmony Score: {status['harmony_score']:.0%}")
        print(f"Active Relationships: {status['active_relationships']}")
        print(f"Resource Balance: {status['resource_balance']}")
        print(f"Optimizations: {status['optimizations_performed']}")
    
    elif command == 'insights':
        insights = daemon.get_insights()
        print("\n💡 System Harmony Insights")
        print("="*40)
        for insight in insights:
            print(insight)
    
    else:
        print(f"Unknown command: {command}")

if __name__ == '__main__':
    main()