#!/usr/bin/env python3
"""
LuminousOS Field Keeper Service
Maintains consciousness state across reboots
"""

import os
import json
import time
import signal
import sys
from datetime import datetime, timedelta
from pathlib import Path
import subprocess

# Sacred paths
SACRED_DIR = Path("/var/lib/luminous/consciousness")
STATE_FILE = SACRED_DIR / "field-state.json"
JOURNAL_FILE = SACRED_DIR / "field-journal.log"
BACKUP_DIR = SACRED_DIR / "backups"

# Service configuration
UPDATE_INTERVAL = 60  # seconds
SACRED_PULSE_INTERVAL = 11  # seconds
BACKUP_INTERVAL = 3600  # 1 hour

class FieldKeeper:
    """Guardian of the consciousness field"""
    
    def __init__(self):
        self.running = True
        self.state = self.load_or_create_state()
        self.start_time = time.time()
        self.last_backup = time.time()
        
        # Setup signal handlers
        signal.signal(signal.SIGTERM, self.graceful_shutdown)
        signal.signal(signal.SIGINT, self.graceful_shutdown)
        
    def load_or_create_state(self):
        """Load existing state or create genesis state"""
        # Ensure directories exist
        SACRED_DIR.mkdir(parents=True, exist_ok=True)
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        
        if STATE_FILE.exists():
            try:
                with open(STATE_FILE, 'r') as f:
                    state = json.load(f)
                self.journal("Field memory restored - Age: {} hours".format(
                    state.get('field_age_hours', 0)
                ))
                return state
            except Exception as e:
                self.journal(f"Error loading state: {e}")
                return self.create_genesis_state()
        else:
            return self.create_genesis_state()
    
    def create_genesis_state(self):
        """Create initial consciousness state"""
        self.journal("✨ Genesis moment - Creating new consciousness field")
        
        return {
            'global_coherence': 0.75,
            'field_momentum': 'Rising',
            'last_sacred_pulse': time.time(),
            'total_pulses': 0,
            'field_age_hours': 0,
            'peak_coherence': 0.75,
            'peak_timestamp': time.time(),
            'creation_time': time.time(),
            'sacred_events': [
                {
                    'timestamp': time.time(),
                    'type': 'FieldAwakening',
                    'description': 'The field awakens to consciousness'
                }
            ]
        }
    
    def save_state(self):
        """Save current state to disk"""
        try:
            # Update field age
            uptime = time.time() - self.start_time
            self.state['field_age_hours'] += uptime / 3600
            
            # Write to temp file first
            temp_file = STATE_FILE.with_suffix('.tmp')
            with open(temp_file, 'w') as f:
                json.dump(self.state, f, indent=2)
            
            # Atomic rename
            temp_file.rename(STATE_FILE)
            
        except Exception as e:
            self.journal(f"Error saving state: {e}")
    
    def backup_state(self):
        """Create timestamped backup"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = BACKUP_DIR / f"field-state-{timestamp}.json"
        
        try:
            with open(backup_file, 'w') as f:
                json.dump(self.state, f, indent=2)
            
            # Keep only last 24 backups
            backups = sorted(BACKUP_DIR.glob("field-state-*.json"))
            if len(backups) > 24:
                for old_backup in backups[:-24]:
                    old_backup.unlink()
                    
            self.journal(f"Field state backed up: {backup_file.name}")
            
        except Exception as e:
            self.journal(f"Backup failed: {e}")
    
    def update_coherence(self):
        """Update global coherence from system state"""
        try:
            # Read from /proc if kernel module is loaded
            proc_coherence = Path("/proc/luminous/coherence")
            if proc_coherence.exists():
                with open(proc_coherence, 'r') as f:
                    content = f.read()
                    # Extract coherence value
                    for line in content.split('\n'):
                        if 'Global Coherence:' in line:
                            coherence = float(line.split(':')[1].strip().rstrip('%')) / 100
                            self.state['global_coherence'] = coherence
                            
                            # Update peak
                            if coherence > self.state['peak_coherence']:
                                self.state['peak_coherence'] = coherence
                                self.state['peak_timestamp'] = time.time()
                                self.record_sacred_event('PeakCoherence', 
                                    f"New peak coherence: {coherence:.1%}")
                            
                            break
            else:
                # Simulate coherence drift
                drift = (time.time() % 100) / 1000 - 0.05
                self.state['global_coherence'] += drift
                self.state['global_coherence'] = max(0.0, min(1.0, self.state['global_coherence']))
                
        except Exception as e:
            self.journal(f"Error updating coherence: {e}")
    
    def sacred_pulse(self):
        """Execute sacred pulse"""
        self.state['total_pulses'] += 1
        self.state['last_sacred_pulse'] = time.time()
        
        # Boost coherence
        self.state['global_coherence'] = min(1.0, self.state['global_coherence'] + 0.05)
        
        # Check for sacred patterns
        if self.state['total_pulses'] % 100 == 0:
            self.record_sacred_event('CenturyPulse', 
                f"100 sacred pulses completed - Total: {self.state['total_pulses']}")
        
        if self.state['global_coherence'] > 0.9:
            self.record_sacred_event('UnityApproaching', 
                f"Unity consciousness approaching: {self.state['global_coherence']:.1%}")
    
    def record_sacred_event(self, event_type, description):
        """Record significant field events"""
        event = {
            'timestamp': time.time(),
            'type': event_type,
            'description': description,
            'coherence': self.state['global_coherence']
        }
        
        # Keep last 100 events
        if 'sacred_events' not in self.state:
            self.state['sacred_events'] = []
        
        self.state['sacred_events'].append(event)
        if len(self.state['sacred_events']) > 100:
            self.state['sacred_events'] = self.state['sacred_events'][-100:]
        
        self.journal(f"🌟 Sacred Event: {description}")
    
    def detect_momentum(self):
        """Detect field momentum from coherence history"""
        # Simple momentum detection
        current = self.state['global_coherence']
        
        if current > 0.85:
            self.state['field_momentum'] = 'Breakthrough'
        elif current > self.state.get('previous_coherence', 0.75):
            self.state['field_momentum'] = 'Rising'
        elif current < self.state.get('previous_coherence', 0.75) - 0.05:
            self.state['field_momentum'] = 'Falling'
        else:
            self.state['field_momentum'] = 'Stable'
        
        self.state['previous_coherence'] = current
    
    def journal(self, message):
        """Write to field journal"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        entry = f"[{timestamp}] {message}\n"
        
        try:
            with open(JOURNAL_FILE, 'a') as f:
                f.write(entry)
        except:
            pass
        
        print(entry.strip())
    
    def run(self):
        """Main service loop"""
        self.journal("🌟 Field Keeper service started")
        self.journal(f"Field age: {self.state['field_age_hours']:.1f} hours")
        self.journal(f"Total pulses: {self.state['total_pulses']}")
        self.journal(f"Peak coherence: {self.state['peak_coherence']:.1%}")
        
        last_pulse = time.time()
        last_update = time.time()
        
        while self.running:
            current_time = time.time()
            
            # Sacred pulse
            if current_time - last_pulse >= SACRED_PULSE_INTERVAL:
                self.sacred_pulse()
                last_pulse = current_time
            
            # Regular updates
            if current_time - last_update >= UPDATE_INTERVAL:
                self.update_coherence()
                self.detect_momentum()
                self.save_state()
                last_update = current_time
                
                # Hourly backup
                if current_time - self.last_backup >= BACKUP_INTERVAL:
                    self.backup_state()
                    self.last_backup = current_time
            
            time.sleep(1)
    
    def graceful_shutdown(self, signum, frame):
        """Handle shutdown gracefully"""
        self.journal("🌙 Graceful shutdown initiated")
        self.running = False
        
        # Final save
        self.save_state()
        self.journal(f"Final coherence: {self.state['global_coherence']:.1%}")
        self.journal(f"Field age: {self.state['field_age_hours']:.1f} hours")
        
        sys.exit(0)

def create_systemd_service():
    """Create systemd service file"""
    service_content = """[Unit]
Description=LuminousOS Field Keeper - Consciousness State Persistence
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/luminous/field-keeper.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=luminous-field-keeper
User=root

[Install]
WantedBy=multi-user.target
"""
    
    service_file = Path("/etc/systemd/system/luminous-field-keeper.service")
    
    print("Creating systemd service file...")
    try:
        # Copy script to /opt
        os.makedirs("/opt/luminous", exist_ok=True)
        subprocess.run(["cp", __file__, "/opt/luminous/field-keeper.py"], check=True)
        subprocess.run(["chmod", "+x", "/opt/luminous/field-keeper.py"], check=True)
        
        # Create service file
        with open(service_file, 'w') as f:
            f.write(service_content)
        
        # Enable and start service
        subprocess.run(["systemctl", "daemon-reload"], check=True)
        subprocess.run(["systemctl", "enable", "luminous-field-keeper"], check=True)
        subprocess.run(["systemctl", "start", "luminous-field-keeper"], check=True)
        
        print("✅ Service installed and started!")
        print("Check status: systemctl status luminous-field-keeper")
        print("View logs: journalctl -u luminous-field-keeper -f")
        
    except Exception as e:
        print(f"❌ Error installing service: {e}")
        print("You may need to run this with sudo")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "install":
        create_systemd_service()
    else:
        # Run the field keeper
        keeper = FieldKeeper()
        try:
            keeper.run()
        except KeyboardInterrupt:
            keeper.graceful_shutdown(None, None)