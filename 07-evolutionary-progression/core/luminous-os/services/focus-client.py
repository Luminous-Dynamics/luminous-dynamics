#!/usr/bin/env python3
"""
LuminousOS Focus Client Library
Simple API for applications to support user focus and well-being
"""

import json
import socket
import logging
from datetime import datetime, timedelta

class FocusClient:
    def __init__(self, app_name="unknown"):
        self.app_name = app_name
        self.socket_path = '/tmp/luminous-focus.sock'
        self.logger = logging.getLogger(f'Focus.{app_name}')
    
    def _send_request(self, request):
        """Send request to focus daemon"""
        try:
            client_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            client_socket.settimeout(2.0)
            client_socket.connect(self.socket_path)
            
            client_socket.send(json.dumps(request).encode('utf-8'))
            
            data = client_socket.recv(4096)
            response = json.loads(data.decode('utf-8'))
            
            client_socket.close()
            return response
            
        except FileNotFoundError:
            return {'status': 'error', 'message': 'Focus daemon not running'}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_focus_state(self):
        """Get current focus and productivity state"""
        response = self._send_request({'command': 'get_state'})
        if response.get('status') == 'ok':
            return response.get('state', {})
        return None
    
    def report_break(self, duration_minutes=5):
        """Report that user took a break"""
        return self._send_request({
            'command': 'report_break',
            'duration': duration_minutes
        })
    
    def start_focus_session(self):
        """Start an explicit focus session"""
        return self._send_request({'command': 'start_focus_session'})
    
    def report_distraction(self):
        """Report that user got distracted"""
        return self._send_request({'command': 'report_distraction'})
    
    def should_take_break(self):
        """Check if user should take a break"""
        state = self.get_focus_state()
        if state:
            return len(state.get('recommendations', [])) > 0
        return False
    
    def get_break_recommendations(self):
        """Get specific break recommendations"""
        state = self.get_focus_state()
        if state:
            return state.get('recommendations', [])
        return []
    
    def with_focus_check(self, min_focus=70):
        """Decorator to check focus before allowing certain operations"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                state = self.get_focus_state()
                if state and state.get('focus_score', 0) >= min_focus:
                    return func(*args, **kwargs)
                else:
                    self.logger.warning(
                        f"Focus too low for {func.__name__} "
                        f"(requires {min_focus}%, current: {state.get('focus_score', 0)}%)"
                    )
                    return None
            return wrapper
        return decorator


# Practical helper functions

def remind_to_break(callback=None):
    """Simple break reminder that any app can use"""
    client = FocusClient("break-reminder")
    recommendations = client.get_break_recommendations()
    
    for rec in recommendations:
        if callback:
            callback(rec)
        else:
            print(f"\n🕐 {rec['message']}")
            if rec['duration'] > 0:
                print(f"   Recommended duration: {rec['duration']} minutes")

def focus_aware_save(save_function, min_focus=50):
    """Wrapper for save operations that checks focus state"""
    client = FocusClient("focus-save")
    state = client.get_focus_state()
    
    if state and state.get('focus_score', 0) < min_focus:
        # Low focus - remind to review before saving
        print("⚠️  Low focus detected. Please review your work before saving.")
        response = input("Continue with save? (y/n): ")
        if response.lower() != 'y':
            return False
    
    return save_function()


# Example usage
if __name__ == '__main__':
    client = FocusClient("test-app")
    
    # Get current state
    state = client.get_focus_state()
    if state:
        print(f"Focus Score: {state.get('focus_score', 0)}%")
        print(f"Productivity Score: {state.get('productivity_score', 0)}%")
        print(f"Time Since Break: {state.get('time_since_break', 0)} minutes")
        
        # Check for break recommendations
        if client.should_take_break():
            print("\n⚠️  Break recommended!")
            for rec in client.get_break_recommendations():
                print(f"  - {rec['message']}")
    
    # Example of focus-aware operation
    @client.with_focus_check(min_focus=80)
    def deep_work_operation():
        print("Performing deep work operation...")
        return True
    
    result = deep_work_operation()
    if result:
        print("Deep work completed!")
    else:
        print("Need better focus for deep work")