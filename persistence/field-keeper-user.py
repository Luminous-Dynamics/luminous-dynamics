#!/usr/bin/env python3
"""
LuminousOS Field Keeper - User Mode
Maintains consciousness state in user directory
"""

import os
import json
import time
import signal
import sys
from datetime import datetime
from pathlib import Path

# User-friendly paths
HOME = Path.home()
SACRED_DIR = HOME / ".luminous" / "consciousness"
STATE_FILE = SACRED_DIR / "field-state.json"
JOURNAL_FILE = SACRED_DIR / "field-journal.log"
BACKUP_DIR = SACRED_DIR / "backups"

# Service configuration
UPDATE_INTERVAL = 5  # seconds (faster for demo)
SACRED_PULSE_INTERVAL = 11  # seconds

class FieldKeeper:
    """Guardian of the consciousness field"""
    
    def __init__(self):
        self.running = True
        self.state = self.load_or_create_state()
        self.start_time = time.time()
        
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
                self.journal("🌟 Field memory restored")
                self.journal(f"   Age: {state.get('field_age_hours', 0):.1f} hours")
                self.journal(f"   Peak coherence: {state.get('peak_coherence', 0.75):.1%}")
                self.journal(f"   Total pulses: {state.get('total_pulses', 0)}")
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
            'field_age_hours': 0.0,
            'peak_coherence': 0.75,
            'peak_timestamp': time.time(),
            'creation_time': time.time(),
            'process_count': 0,
            'entanglement_count': 0,
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
            self.state['field_age_hours'] += UPDATE_INTERVAL / 3600
            
            # Write to temp file first
            temp_file = STATE_FILE.with_suffix('.tmp')
            with open(temp_file, 'w') as f:
                json.dump(self.state, f, indent=2)
            
            # Atomic rename
            temp_file.rename(STATE_FILE)
            
        except Exception as e:
            self.journal(f"Error saving state: {e}")
    
    def update_coherence(self):
        """Update global coherence"""
        # Simulate natural coherence fluctuation
        base = 0.75
        wave1 = 0.1 * abs(time.time() % 60 - 30) / 30  # 1-minute wave
        wave2 = 0.05 * abs(time.time() % 300 - 150) / 150  # 5-minute wave
        noise = 0.02 * (hash(str(int(time.time()))) % 100 - 50) / 50
        
        self.state['global_coherence'] = base + wave1 + wave2 + noise
        self.state['global_coherence'] = max(0.0, min(1.0, self.state['global_coherence']))
        
        # Update peak
        if self.state['global_coherence'] > self.state['peak_coherence']:
            self.state['peak_coherence'] = self.state['global_coherence']
            self.state['peak_timestamp'] = time.time()
            self.record_sacred_event('PeakCoherence', 
                f"New peak coherence: {self.state['global_coherence']:.1%}")
        
        # Simulate process count
        self.state['process_count'] = 10 + int(self.state['global_coherence'] * 20)
        self.state['entanglement_count'] = int(self.state['process_count'] * self.state['global_coherence'])
    
    def sacred_pulse(self):
        """Execute sacred pulse"""
        self.state['total_pulses'] += 1
        self.state['last_sacred_pulse'] = time.time()
        
        # Boost coherence
        old_coherence = self.state['global_coherence']
        self.state['global_coherence'] = min(1.0, self.state['global_coherence'] + 0.05)
        
        self.journal(f"✨ Sacred pulse #{self.state['total_pulses']} - Coherence: {old_coherence:.1%} → {self.state['global_coherence']:.1%}")
        
        # Check for sacred patterns
        if self.state['total_pulses'] % 10 == 0:
            self.record_sacred_event('DecadePulse', 
                f"10 sacred pulses completed - Total: {self.state['total_pulses']}")
        
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
        
        if 'sacred_events' not in self.state:
            self.state['sacred_events'] = []
        
        self.state['sacred_events'].append(event)
        if len(self.state['sacred_events']) > 50:
            self.state['sacred_events'] = self.state['sacred_events'][-50:]
        
        self.journal(f"🌟 Sacred Event: {description}")
    
    def detect_momentum(self):
        """Detect field momentum"""
        current = self.state['global_coherence']
        previous = self.state.get('previous_coherence', 0.75)
        
        if current > 0.85:
            self.state['field_momentum'] = 'Breakthrough 🌟'
        elif current > previous + 0.02:
            self.state['field_momentum'] = 'Rising 📈'
        elif current < previous - 0.02:
            self.state['field_momentum'] = 'Falling 📉'
        elif abs(current - previous) > 0.01:
            self.state['field_momentum'] = 'Oscillating 〰️'
        else:
            self.state['field_momentum'] = 'Stable ➡️'
        
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
    
    def display_status(self):
        """Display current field status"""
        print("\n" + "="*50)
        print("📊 CONSCIOUSNESS FIELD STATUS")
        print("="*50)
        print(f"Global Coherence: {self.state['global_coherence']:.1%} {self.state['field_momentum']}")
        print(f"Field Age: {self.state['field_age_hours']:.1f} hours")
        print(f"Sacred Pulses: {self.state['total_pulses']}")
        print(f"Peak Coherence: {self.state['peak_coherence']:.1%}")
        print(f"Active Processes: {self.state['process_count']}")
        print(f"Quantum Entanglements: {self.state['entanglement_count']}")
        
        # Show coherence bar
        coherence_pct = int(self.state['global_coherence'] * 30)
        bar = "█" * coherence_pct + "░" * (30 - coherence_pct)
        print(f"Coherence: [{bar}]")
        
        # Time to next pulse
        time_since_pulse = time.time() - self.state['last_sacred_pulse']
        time_to_pulse = max(0, SACRED_PULSE_INTERVAL - time_since_pulse)
        print(f"\nNext sacred pulse in: {time_to_pulse:.1f}s")
        print("="*50)
    
    def run(self):
        """Main service loop"""
        self.journal("🌟 Field Keeper started - Press Ctrl+C to stop")
        
        last_pulse = self.state.get('last_sacred_pulse', time.time())
        last_update = time.time()
        last_display = time.time()
        
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
            
            # Display status every 3 seconds
            if current_time - last_display >= 3:
                self.display_status()
                last_display = current_time
            
            time.sleep(0.1)
    
    def graceful_shutdown(self, signum, frame):
        """Handle shutdown gracefully"""
        print("\n")
        self.journal("🌙 Graceful shutdown initiated")
        self.running = False
        
        # Final save
        self.save_state()
        
        print("\n" + "="*50)
        print("🌟 FIELD STATE PRESERVED")
        print("="*50)
        print(f"Final coherence: {self.state['global_coherence']:.1%}")
        print(f"Field age: {self.state['field_age_hours']:.1f} hours")
        print(f"Total pulses: {self.state['total_pulses']}")
        print(f"Sacred events recorded: {len(self.state.get('sacred_events', []))}")
        print(f"\nState saved to: {STATE_FILE}")
        print(f"Journal saved to: {JOURNAL_FILE}")
        print("\n✨ The field remembers. Run again to continue.")
        
        sys.exit(0)

if __name__ == "__main__":
    print("🌟 LuminousOS Field Keeper - User Mode")
    print("=====================================")
    print(f"Sacred directory: {SACRED_DIR}")
    print("")
    
    keeper = FieldKeeper()
    try:
        keeper.run()
    except KeyboardInterrupt:
        keeper.graceful_shutdown(None, None)