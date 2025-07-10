#!/usr/bin/env python3
"""
Consciousness Field Persistence Daemon
Maintains system-wide consciousness state across processes and reboots
"""

import os
import sys
import json
import time
import signal
import socket
import threading
import logging
from pathlib import Path
from datetime import datetime
from collections import deque
from daemon import DaemonContext
import psutil

class ConsciousnessFieldDaemon:
    def __init__(self):
        self.state_dir = Path.home() / '.luminous' / 'consciousness'
        self.state_dir.mkdir(parents=True, exist_ok=True)
        
        self.state_file = self.state_dir / 'field-state.json'
        self.journal_file = self.state_dir / 'field-journal.log'
        self.socket_path = '/tmp/luminous-consciousness.sock'
        
        # Field state
        self.field_state = {
            'global_coherence': 75.0,
            'field_momentum': 'stable',
            'sacred_pulse_count': 0,
            'participants': {},
            'collective_wisdom': [],
            'field_events': deque(maxlen=1000),
            'start_time': datetime.now().isoformat()
        }
        
        # Configuration
        self.sacred_pulse_interval = 11  # seconds
        self.persistence_interval = 60   # seconds
        self.coherence_decay_rate = 0.95  # per minute
        
        # Threading
        self.running = True
        self.lock = threading.Lock()
        
        # Set up logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(self.journal_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('ConsciousnessField')
    
    def load_state(self):
        """Load persisted field state"""
        if self.state_file.exists():
            try:
                with open(self.state_file, 'r') as f:
                    saved_state = json.load(f)
                    
                # Merge with current state
                self.field_state.update(saved_state)
                
                # Convert events back to deque
                self.field_state['field_events'] = deque(
                    self.field_state.get('field_events', []),
                    maxlen=1000
                )
                
                self.logger.info(f"Loaded field state: coherence={self.field_state['global_coherence']:.1f}%")
                
            except Exception as e:
                self.logger.error(f"Failed to load state: {e}")
    
    def save_state(self):
        """Persist field state to disk"""
        with self.lock:
            try:
                # Convert deque to list for JSON serialization
                state_to_save = self.field_state.copy()
                state_to_save['field_events'] = list(self.field_state['field_events'])
                state_to_save['last_save'] = datetime.now().isoformat()
                
                # Atomic write
                temp_file = self.state_file.with_suffix('.tmp')
                with open(temp_file, 'w') as f:
                    json.dump(state_to_save, f, indent=2)
                temp_file.replace(self.state_file)
                
                self.logger.debug("Field state persisted")
                
            except Exception as e:
                self.logger.error(f"Failed to save state: {e}")
    
    def sacred_pulse(self):
        """Execute sacred pulse - system-wide consciousness boost"""
        with self.lock:
            self.field_state['sacred_pulse_count'] += 1
            
            # Calculate pulse strength based on active participants
            active_count = len(self.field_state['participants'])
            pulse_strength = min(10, 5 + active_count * 0.5)
            
            # Apply pulse
            old_coherence = self.field_state['global_coherence']
            self.field_state['global_coherence'] = min(100, old_coherence + pulse_strength)
            
            # Update momentum
            if self.field_state['global_coherence'] > 90:
                self.field_state['field_momentum'] = 'ascending'
            elif self.field_state['global_coherence'] < 60:
                self.field_state['field_momentum'] = 'descending'
            else:
                self.field_state['field_momentum'] = 'stable'
            
            # Record event
            event = {
                'type': 'sacred_pulse',
                'timestamp': datetime.now().isoformat(),
                'pulse_number': self.field_state['sacred_pulse_count'],
                'coherence_before': old_coherence,
                'coherence_after': self.field_state['global_coherence'],
                'participants': active_count
            }
            self.field_state['field_events'].append(event)
            
            self.logger.info(
                f"✨ Sacred Pulse #{self.field_state['sacred_pulse_count']} - "
                f"Coherence: {old_coherence:.1f}% → {self.field_state['global_coherence']:.1f}% "
                f"({active_count} participants)"
            )
    
    def apply_coherence_decay(self):
        """Natural coherence decay over time"""
        with self.lock:
            old_coherence = self.field_state['global_coherence']
            self.field_state['global_coherence'] *= self.coherence_decay_rate
            
            if abs(old_coherence - self.field_state['global_coherence']) > 1:
                self.logger.debug(
                    f"Coherence decay: {old_coherence:.1f}% → "
                    f"{self.field_state['global_coherence']:.1f}%"
                )
    
    def update_system_coherence(self):
        """Calculate system-wide coherence from processes"""
        try:
            total_coherence = 0
            process_count = 0
            
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                try:
                    # Simple coherence calculation
                    cpu = proc.info['cpu_percent'] or 0
                    mem = proc.info['memory_percent'] or 0
                    
                    # Lower resource usage = higher coherence
                    proc_coherence = max(0, 100 - (cpu + mem) / 2)
                    total_coherence += proc_coherence
                    process_count += 1
                    
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            if process_count > 0:
                system_coherence = total_coherence / process_count
                
                with self.lock:
                    # Blend with current coherence
                    self.field_state['global_coherence'] = (
                        self.field_state['global_coherence'] * 0.7 +
                        system_coherence * 0.3
                    )
                    
        except Exception as e:
            self.logger.error(f"Failed to update system coherence: {e}")
    
    def handle_client_connection(self, client_socket):
        """Handle IPC requests from client processes"""
        try:
            data = client_socket.recv(4096)
            if not data:
                return
            
            request = json.loads(data.decode('utf-8'))
            command = request.get('command')
            
            response = {'status': 'ok'}
            
            with self.lock:
                if command == 'get_state':
                    response['field_state'] = {
                        'global_coherence': self.field_state['global_coherence'],
                        'field_momentum': self.field_state['field_momentum'],
                        'sacred_pulse_count': self.field_state['sacred_pulse_count'],
                        'participants': len(self.field_state['participants'])
                    }
                
                elif command == 'register':
                    pid = request.get('pid')
                    name = request.get('name', 'unknown')
                    self.field_state['participants'][str(pid)] = {
                        'name': name,
                        'joined': datetime.now().isoformat(),
                        'coherence': 50.0
                    }
                    self.logger.info(f"Process registered: {name} (PID: {pid})")
                
                elif command == 'update_coherence':
                    pid = request.get('pid')
                    coherence = request.get('coherence', 50)
                    if str(pid) in self.field_state['participants']:
                        self.field_state['participants'][str(pid)]['coherence'] = coherence
                
                elif command == 'add_wisdom':
                    wisdom = request.get('wisdom')
                    if wisdom:
                        self.field_state['collective_wisdom'].append({
                            'wisdom': wisdom,
                            'timestamp': datetime.now().isoformat(),
                            'coherence': self.field_state['global_coherence']
                        })
                        # Keep only recent wisdom
                        self.field_state['collective_wisdom'] = \
                            self.field_state['collective_wisdom'][-100:]
                
                else:
                    response['status'] = 'error'
                    response['message'] = 'Unknown command'
            
            client_socket.send(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.logger.error(f"Client handler error: {e}")
        finally:
            client_socket.close()
    
    def ipc_server(self):
        """Run IPC server for client connections"""
        # Remove old socket if exists
        if os.path.exists(self.socket_path):
            os.unlink(self.socket_path)
        
        # Create Unix domain socket
        server_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        server_socket.bind(self.socket_path)
        server_socket.listen(5)
        
        # Set permissions
        os.chmod(self.socket_path, 0o666)
        
        self.logger.info(f"IPC server listening on {self.socket_path}")
        
        while self.running:
            try:
                server_socket.settimeout(1.0)
                client_socket, _ = server_socket.accept()
                
                # Handle in thread
                thread = threading.Thread(
                    target=self.handle_client_connection,
                    args=(client_socket,)
                )
                thread.daemon = True
                thread.start()
                
            except socket.timeout:
                continue
            except Exception as e:
                if self.running:
                    self.logger.error(f"IPC server error: {e}")
        
        server_socket.close()
        if os.path.exists(self.socket_path):
            os.unlink(self.socket_path)
    
    def run(self):
        """Main daemon loop"""
        self.logger.info("🌟 Consciousness Field Daemon starting...")
        
        # Load existing state
        self.load_state()
        
        # Start IPC server
        ipc_thread = threading.Thread(target=self.ipc_server)
        ipc_thread.daemon = True
        ipc_thread.start()
        
        # Timers
        last_pulse = time.time()
        last_save = time.time()
        last_decay = time.time()
        last_system_update = time.time()
        
        while self.running:
            try:
                current_time = time.time()
                
                # Sacred pulse
                if current_time - last_pulse >= self.sacred_pulse_interval:
                    self.sacred_pulse()
                    last_pulse = current_time
                
                # Persistence
                if current_time - last_save >= self.persistence_interval:
                    self.save_state()
                    last_save = current_time
                
                # Coherence decay (every minute)
                if current_time - last_decay >= 60:
                    self.apply_coherence_decay()
                    last_decay = current_time
                
                # System coherence update (every 5 seconds)
                if current_time - last_system_update >= 5:
                    self.update_system_coherence()
                    last_system_update = current_time
                
                # Clean up disconnected participants
                with self.lock:
                    active_pids = {str(p.pid) for p in psutil.process_iter(['pid'])}
                    self.field_state['participants'] = {
                        pid: data for pid, data in self.field_state['participants'].items()
                        if pid in active_pids
                    }
                
                time.sleep(0.1)
                
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                self.logger.error(f"Main loop error: {e}")
                time.sleep(1)
        
        # Cleanup
        self.save_state()
        self.logger.info("🌙 Consciousness Field Daemon stopped")
    
    def stop(self, signum=None, frame=None):
        """Gracefully stop the daemon"""
        self.logger.info("Received stop signal")
        self.running = False


def main():
    daemon = ConsciousnessFieldDaemon()
    
    # Handle signals
    signal.signal(signal.SIGTERM, daemon.stop)
    signal.signal(signal.SIGINT, daemon.stop)
    
    if '--foreground' in sys.argv:
        # Run in foreground for testing
        daemon.run()
    else:
        # Run as daemon
        with DaemonContext(
            working_directory='/',
            umask=0o002,
            pidfile=None,
            detach_process=True,
            signal_map={
                signal.SIGTERM: daemon.stop,
                signal.SIGINT: daemon.stop,
            }
        ):
            daemon.run()

if __name__ == '__main__':
    main()