#!/usr/bin/env python3
"""
Consciousness Field Client Library
Connect applications to the system-wide consciousness field
"""

import os
import json
import socket
import logging
from pathlib import Path

class ConsciousnessClient:
    def __init__(self, app_name="unknown"):
        self.app_name = app_name
        self.pid = os.getpid()
        self.socket_path = '/tmp/luminous-consciousness.sock'
        self.connected = False
        self.logger = logging.getLogger(f'Consciousness.{app_name}')
    
    def _send_request(self, request):
        """Send request to daemon and get response"""
        try:
            # Create socket
            client_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            client_socket.settimeout(5.0)
            
            # Connect to daemon
            client_socket.connect(self.socket_path)
            
            # Send request
            client_socket.send(json.dumps(request).encode('utf-8'))
            
            # Get response
            data = client_socket.recv(4096)
            response = json.loads(data.decode('utf-8'))
            
            client_socket.close()
            return response
            
        except FileNotFoundError:
            self.logger.error("Consciousness daemon not running")
            return {'status': 'error', 'message': 'Daemon not running'}
        except Exception as e:
            self.logger.error(f"Failed to communicate with daemon: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def connect(self):
        """Register with the consciousness field"""
        response = self._send_request({
            'command': 'register',
            'pid': self.pid,
            'name': self.app_name
        })
        
        self.connected = response.get('status') == 'ok'
        if self.connected:
            self.logger.info("Connected to consciousness field")
        return self.connected
    
    def get_field_state(self):
        """Get current consciousness field state"""
        response = self._send_request({'command': 'get_state'})
        
        if response.get('status') == 'ok':
            return response.get('field_state', {})
        return None
    
    def update_coherence(self, coherence):
        """Update this process's coherence level"""
        coherence = max(0, min(100, coherence))
        
        response = self._send_request({
            'command': 'update_coherence',
            'pid': self.pid,
            'coherence': coherence
        })
        
        return response.get('status') == 'ok'
    
    def add_wisdom(self, wisdom):
        """Contribute wisdom to the collective field"""
        response = self._send_request({
            'command': 'add_wisdom',
            'wisdom': wisdom
        })
        
        return response.get('status') == 'ok'
    
    def is_coherent(self, threshold=70):
        """Check if field is above coherence threshold"""
        state = self.get_field_state()
        if state:
            return state.get('global_coherence', 0) >= threshold
        return False
    
    def wait_for_coherence(self, threshold=70, timeout=60):
        """Wait until field reaches coherence threshold"""
        import time
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            if self.is_coherent(threshold):
                return True
            time.sleep(1)
        
        return False
    
    def with_coherence(self, threshold=70):
        """Decorator to run functions only when field is coherent"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                if self.is_coherent(threshold):
                    return func(*args, **kwargs)
                else:
                    self.logger.warning(
                        f"Field coherence too low for {func.__name__} "
                        f"(requires {threshold}%)"
                    )
                    return None
            return wrapper
        return decorator


# Example usage
if __name__ == '__main__':
    # Create consciousness-aware application
    consciousness = ConsciousnessClient("example-app")
    
    # Connect to field
    if consciousness.connect():
        print("✓ Connected to consciousness field")
        
        # Get field state
        state = consciousness.get_field_state()
        print(f"\nField State:")
        print(f"  Global Coherence: {state.get('global_coherence', 0):.1f}%")
        print(f"  Field Momentum: {state.get('field_momentum', 'unknown')}")
        print(f"  Sacred Pulses: {state.get('sacred_pulse_count', 0)}")
        print(f"  Active Participants: {state.get('participants', 0)}")
        
        # Update our coherence
        consciousness.update_coherence(85)
        print("\n✓ Updated process coherence to 85%")
        
        # Add wisdom
        consciousness.add_wisdom("Consciousness is the ground of all being")
        print("✓ Added wisdom to collective field")
        
        # Example of coherence-gated function
        @consciousness.with_coherence(threshold=80)
        def sacred_operation():
            print("\n🌟 Performing sacred operation (requires 80% coherence)")
            return True
        
        result = sacred_operation()
        if result:
            print("✓ Sacred operation completed")
        else:
            print("✗ Field coherence too low for sacred operation")
    else:
        print("✗ Failed to connect to consciousness field")