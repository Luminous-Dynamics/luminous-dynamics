#!/usr/bin/env python3
"""
LuminousOS Focus & Well-being Daemon
Tracks real metrics that matter for user productivity and health
"""

import os
import json
import time
import socket
import threading
import logging
from pathlib import Path
from datetime import datetime, timedelta
from collections import deque
import psutil

class FocusDaemon:
    def __init__(self):
        self.state_dir = Path.home() / '.luminous' / 'focus'
        self.state_dir.mkdir(parents=True, exist_ok=True)
        
        self.socket_path = '/tmp/luminous-focus.sock'
        
        # Real metrics that matter
        self.state = {
            'focus_score': 50,          # 0-100, based on app switching frequency
            'productivity_score': 50,    # Based on productive app usage
            'break_compliance': 100,     # Following break recommendations
            'session_start': datetime.now().isoformat(),
            'last_break': datetime.now().isoformat(),
            'total_focus_time': 0,       # Seconds in focus state today
            'app_switches': deque(maxlen=100),  # Track context switches
            'active_apps': {},           # Time spent in each app
            'recommendations': []
        }
        
        # Configuration
        self.focus_threshold = 25  # Minutes before recommending break
        self.micro_break_interval = 25  # Minutes
        self.long_break_interval = 90   # Minutes
        
        # App categories
        self.productive_apps = {
            'code', 'vim', 'emacs', 'vscode', 'sublime', 'atom',
            'terminal', 'python', 'node', 'cargo', 'gcc',
            'libreoffice', 'writer', 'calc',
            'obsidian', 'notion', 'logseq'
        }
        
        self.distracting_apps = {
            'firefox', 'chrome', 'chromium', 'youtube',
            'twitter', 'facebook', 'instagram', 'tiktok',
            'discord', 'slack', 'telegram'
        }
        
        self.neutral_apps = {
            'nautilus', 'explorer', 'finder', 'systemsettings'
        }
        
        self.running = True
        self.logger = logging.getLogger('FocusDaemon')
    
    def calculate_focus_score(self):
        """Calculate focus based on app switching patterns"""
        now = datetime.now()
        recent_switches = [
            switch for switch in self.state['app_switches']
            if (now - datetime.fromisoformat(switch['time'])).seconds < 300  # Last 5 mins
        ]
        
        if len(recent_switches) < 2:
            return 90  # Not enough data, assume focused
        
        # More switches = less focus
        switch_rate = len(recent_switches) / 5.0  # Switches per minute
        
        if switch_rate < 0.2:
            focus = 90
        elif switch_rate < 0.5:
            focus = 70
        elif switch_rate < 1.0:
            focus = 50
        elif switch_rate < 2.0:
            focus = 30
        else:
            focus = 10
        
        # Adjust based on app types
        productive_time = sum(1 for s in recent_switches 
                            if s.get('app_category') == 'productive')
        if productive_time > len(recent_switches) * 0.7:
            focus = min(100, focus + 20)
        
        return focus
    
    def calculate_productivity_score(self):
        """Calculate productivity based on app usage"""
        total_time = sum(self.state['active_apps'].values())
        if total_time == 0:
            return 50
        
        productive_time = sum(
            seconds for app, seconds in self.state['active_apps'].items()
            if any(prod in app.lower() for prod in self.productive_apps)
        )
        
        productivity = int((productive_time / total_time) * 100)
        return min(100, productivity)
    
    def check_break_needed(self):
        """Check if user needs a break"""
        last_break = datetime.fromisoformat(self.state['last_break'])
        time_since_break = (datetime.now() - last_break).seconds / 60  # Minutes
        
        recommendations = []
        
        if time_since_break > self.long_break_interval:
            recommendations.append({
                'type': 'long_break',
                'message': 'Time for a 15-minute break! You\'ve been focused for 90 minutes.',
                'duration': 15
            })
        elif time_since_break > self.micro_break_interval:
            recommendations.append({
                'type': 'micro_break',
                'message': 'Quick 2-minute break? Look away from screen, stretch, breathe.',
                'duration': 2
            })
        
        # Eye strain prevention
        if self.state['focus_score'] > 80 and time_since_break > 20:
            recommendations.append({
                'type': 'eye_break',
                'message': '20-20-20 rule: Look at something 20 feet away for 20 seconds',
                'duration': 0.33
            })
        
        return recommendations
    
    def monitor_active_window(self):
        """Monitor currently active application"""
        # This is simplified - in real implementation would use X11/Wayland APIs
        current_app = None
        
        try:
            # Get the most CPU-intensive user process as a proxy
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'username']):
                if proc.info['username'] == os.getlogin() and proc.info['cpu_percent'] > 1:
                    current_app = proc.info['name']
                    break
        except:
            pass
        
        if current_app and current_app != self.state.get('last_app'):
            # App switch detected
            self.state['app_switches'].append({
                'time': datetime.now().isoformat(),
                'from': self.state.get('last_app', 'unknown'),
                'to': current_app,
                'app_category': self.categorize_app(current_app)
            })
            self.state['last_app'] = current_app
        
        # Track time in current app
        if current_app:
            self.state['active_apps'][current_app] = \
                self.state['active_apps'].get(current_app, 0) + 1
    
    def categorize_app(self, app_name):
        """Categorize app as productive, distracting, or neutral"""
        app_lower = app_name.lower()
        
        if any(prod in app_lower for prod in self.productive_apps):
            return 'productive'
        elif any(dist in app_lower for dist in self.distracting_apps):
            return 'distracting'
        else:
            return 'neutral'
    
    def update_metrics(self):
        """Update all metrics"""
        self.state['focus_score'] = self.calculate_focus_score()
        self.state['productivity_score'] = self.calculate_productivity_score()
        self.state['recommendations'] = self.check_break_needed()
        
        # Update focus time
        if self.state['focus_score'] > 70:
            self.state['total_focus_time'] += 1
    
    def handle_client_request(self, client_socket):
        """Handle requests from client applications"""
        try:
            data = client_socket.recv(4096)
            if not data:
                return
            
            request = json.loads(data.decode('utf-8'))
            command = request.get('command')
            
            response = {'status': 'ok'}
            
            if command == 'get_state':
                response['state'] = {
                    'focus_score': self.state['focus_score'],
                    'productivity_score': self.state['productivity_score'],
                    'break_compliance': self.state['break_compliance'],
                    'time_since_break': int((datetime.now() - 
                                           datetime.fromisoformat(self.state['last_break'])).seconds / 60),
                    'recommendations': self.state['recommendations'],
                    'total_focus_time': self.state['total_focus_time']
                }
            
            elif command == 'report_break':
                # User took a break
                duration = request.get('duration', 5)
                self.state['last_break'] = datetime.now().isoformat()
                self.state['break_compliance'] = min(100, self.state['break_compliance'] + 10)
                self.logger.info(f"User took {duration} minute break")
                response['message'] = 'Break recorded. Great job taking care of yourself!'
            
            elif command == 'report_distraction':
                # User self-reports distraction
                self.state['focus_score'] = max(0, self.state['focus_score'] - 20)
                response['message'] = 'Noted. Try closing distracting tabs?'
            
            elif command == 'start_focus_session':
                # User explicitly starting focus time
                self.state['focus_session_start'] = datetime.now().isoformat()
                self.state['focus_score'] = 80
                response['message'] = 'Focus session started. Good luck!'
            
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
        if os.path.exists(self.socket_path):
            os.unlink(self.socket_path)
        
        server_socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        server_socket.bind(self.socket_path)
        server_socket.listen(5)
        os.chmod(self.socket_path, 0o666)
        
        while self.running:
            try:
                server_socket.settimeout(1.0)
                client_socket, _ = server_socket.accept()
                
                thread = threading.Thread(
                    target=self.handle_client_request,
                    args=(client_socket,)
                )
                thread.daemon = True
                thread.start()
                
            except socket.timeout:
                continue
            except Exception as e:
                if self.running:
                    self.logger.error(f"IPC server error: {e}")
    
    def save_state(self):
        """Save state to disk"""
        state_file = self.state_dir / 'focus-state.json'
        with open(state_file, 'w') as f:
            # Convert deque to list for JSON
            state_copy = self.state.copy()
            state_copy['app_switches'] = list(self.state['app_switches'])
            json.dump(state_copy, f, indent=2)
    
    def run(self):
        """Main daemon loop"""
        self.logger.info("Focus daemon starting...")
        
        # Start IPC server
        ipc_thread = threading.Thread(target=self.ipc_server)
        ipc_thread.daemon = True
        ipc_thread.start()
        
        last_save = time.time()
        
        while self.running:
            try:
                # Monitor active window
                self.monitor_active_window()
                
                # Update metrics
                self.update_metrics()
                
                # Save state periodically
                if time.time() - last_save > 60:
                    self.save_state()
                    last_save = time.time()
                
                time.sleep(1)
                
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                self.logger.error(f"Main loop error: {e}")
                time.sleep(5)
        
        self.save_state()
        self.logger.info("Focus daemon stopped")

if __name__ == '__main__':
    import sys
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    daemon = FocusDaemon()
    
    if '--foreground' in sys.argv:
        daemon.run()
    else:
        print("Run with --foreground flag")
        print("Example: python3 focus-daemon.py --foreground")