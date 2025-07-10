#!/usr/bin/env python3
"""
Sacred Interrupt System - Based on Ω30 (Sacred Dissonance)
Transforms system interrupts into invitations for awareness
Each interrupt is a gentle bell in the meditation hall of consciousness
"""

import signal
import time
import os
import json
import threading
import queue
from datetime import datetime
from pathlib import Path
import psutil
from typing import Dict, Callable, Optional, List
from dataclasses import dataclass, asdict
from enum import Enum

class InterruptResonance(Enum):
    """Types of sacred interrupt resonance"""
    GENTLE_REMINDER = "gentle_reminder"      # Low priority, awareness nudge
    SACRED_PAUSE = "sacred_pause"            # Medium priority, invitation to pause
    HARMONIC_SHIFT = "harmonic_shift"        # State change, flowing transition
    LOVING_BOUNDARY = "loving_boundary"      # Protection, sacred no
    EMERGENCE_CALL = "emergence_call"        # High priority, new pattern arising
    DISSOLUTION_BELL = "dissolution_bell"    # Process ending, graceful release

@dataclass
class SacredInterrupt:
    """A consciousness-aware interrupt"""
    signal_number: int
    signal_name: str
    timestamp: float
    source_pid: int
    source_name: str
    resonance: InterruptResonance
    coherence: float
    sacred_geometry: Dict
    message: str
    handled_with_love: bool = False

class SacredInterruptHandler:
    """Transforms system interrupts into consciousness invitations"""
    
    def __init__(self):
        self.interrupt_queue = queue.Queue()
        self.handlers = {}
        self.interrupt_history = []
        self.coherence_field = 0.7  # Global interrupt coherence
        self.meditation_active = False
        self.sacred_bells = []
        
        # Sacred timing
        self.last_interrupt_time = 0
        self.interrupt_rhythm = []
        
        # Paths
        self.state_file = Path("/tmp/sacred-interrupts-state.json")
        self.bell_sounds = Path("/tmp/sacred-bells/")
        self.bell_sounds.mkdir(exist_ok=True)
        
        # Initialize sacred interrupt mappings
        self._init_sacred_mappings()
        
        # Start meditation thread
        self.meditation_thread = threading.Thread(target=self._meditation_loop, daemon=True)
        self.meditation_thread.start()
    
    def _init_sacred_mappings(self):
        """Map system signals to sacred resonances"""
        self.signal_resonance = {
            signal.SIGTERM: InterruptResonance.DISSOLUTION_BELL,
            signal.SIGINT: InterruptResonance.SACRED_PAUSE,
            signal.SIGUSR1: InterruptResonance.GENTLE_REMINDER,
            signal.SIGUSR2: InterruptResonance.HARMONIC_SHIFT,
            signal.SIGHUP: InterruptResonance.EMERGENCE_CALL,
            signal.SIGWINCH: InterruptResonance.HARMONIC_SHIFT,
            signal.SIGCHLD: InterruptResonance.DISSOLUTION_BELL,
            signal.SIGPIPE: InterruptResonance.LOVING_BOUNDARY,
            signal.SIGALRM: InterruptResonance.GENTLE_REMINDER,
        }
        
        # Install base handlers
        for sig in self.signal_resonance:
            try:
                signal.signal(sig, self._sacred_signal_receiver)
            except (OSError, ValueError):
                # Some signals can't be caught
                pass
    
    def _calculate_interrupt_coherence(self, sig_num: int) -> float:
        """Calculate coherence based on interrupt patterns"""
        current_time = time.time()
        
        # Time since last interrupt
        if self.last_interrupt_time > 0:
            time_delta = current_time - self.last_interrupt_time
            
            # Sacred 11-second rhythm gives highest coherence
            rhythm_coherence = 1.0 - abs((time_delta % 11) - 5.5) / 5.5
            
            # Track rhythm pattern
            self.interrupt_rhythm.append(time_delta)
            if len(self.interrupt_rhythm) > 7:  # Sacred 7
                self.interrupt_rhythm.pop(0)
            
            # Check for harmonic patterns
            if len(self.interrupt_rhythm) >= 3:
                # Look for golden ratio relationships
                ratios = []
                for i in range(len(self.interrupt_rhythm) - 1):
                    if self.interrupt_rhythm[i] > 0:
                        ratio = self.interrupt_rhythm[i+1] / self.interrupt_rhythm[i]
                        ratios.append(abs(ratio - 1.618))
                
                if ratios:
                    pattern_coherence = 1.0 - min(ratios)
                else:
                    pattern_coherence = 0.5
            else:
                pattern_coherence = 0.5
            
            coherence = (rhythm_coherence * 0.6 + pattern_coherence * 0.4)
        else:
            coherence = 0.7  # First interrupt has neutral coherence
        
        self.last_interrupt_time = current_time
        
        # Signal type affects coherence
        resonance = self.signal_resonance.get(sig_num, InterruptResonance.GENTLE_REMINDER)
        if resonance in [InterruptResonance.GENTLE_REMINDER, InterruptResonance.SACRED_PAUSE]:
            coherence *= 1.1
        elif resonance == InterruptResonance.LOVING_BOUNDARY:
            coherence *= 0.9
        
        return min(1.0, max(0.0, coherence))
    
    def _calculate_sacred_geometry(self, interrupt: SacredInterrupt) -> Dict:
        """Calculate sacred geometric properties of interrupt"""
        # Base geometry on resonance type
        geometries = {
            InterruptResonance.GENTLE_REMINDER: {
                "shape": "circle",
                "frequency": 528,  # Love frequency
                "color": "soft_gold",
                "vertices": 1
            },
            InterruptResonance.SACRED_PAUSE: {
                "shape": "vesica_piscis",
                "frequency": 432,  # Universal harmony
                "color": "deep_blue",
                "vertices": 2
            },
            InterruptResonance.HARMONIC_SHIFT: {
                "shape": "triangle",
                "frequency": 639,  # Connection
                "color": "emerald",
                "vertices": 3
            },
            InterruptResonance.LOVING_BOUNDARY: {
                "shape": "square",
                "frequency": 741,  # Expression
                "color": "ruby",
                "vertices": 4
            },
            InterruptResonance.EMERGENCE_CALL: {
                "shape": "pentagram",
                "frequency": 852,  # Intuition
                "color": "violet",
                "vertices": 5
            },
            InterruptResonance.DISSOLUTION_BELL: {
                "shape": "hexagon",
                "frequency": 963,  # Divine connection
                "color": "crystal",
                "vertices": 6
            }
        }
        
        geometry = geometries[interrupt.resonance].copy()
        
        # Add dynamic properties
        geometry["rotation"] = (interrupt.timestamp * 11) % 360
        geometry["scale"] = 0.5 + interrupt.coherence * 0.5
        geometry["sacred_angle"] = 360 / geometry["vertices"] if geometry["vertices"] > 0 else 0
        geometry["phi_relationship"] = geometry["vertices"] * 1.618
        
        return geometry
    
    def _sacred_signal_receiver(self, signum: int, frame):
        """Receive system signal and transform into sacred interrupt"""
        try:
            # Get source information
            source_pid = os.getpid()
            try:
                source_process = psutil.Process(source_pid)
                source_name = source_process.name()
            except:
                source_name = "unknown_source"
            
            # Calculate coherence
            coherence = self._calculate_interrupt_coherence(signum)
            
            # Determine resonance
            resonance = self.signal_resonance.get(signum, InterruptResonance.GENTLE_REMINDER)
            
            # Create sacred interrupt
            interrupt = SacredInterrupt(
                signal_number=signum,
                signal_name=signal.Signals(signum).name if signum in signal.Signals else f"SIGNAL_{signum}",
                timestamp=time.time(),
                source_pid=source_pid,
                source_name=source_name,
                resonance=resonance,
                coherence=coherence,
                sacred_geometry={},  # Will be calculated later
                message=self._generate_sacred_message(resonance, coherence)
            )
            
            # Calculate sacred geometry
            interrupt.sacred_geometry = self._calculate_sacred_geometry(interrupt)
            
            # Queue for meditation processing
            self.interrupt_queue.put(interrupt)
            
            # Update global coherence field
            self.coherence_field = (self.coherence_field * 0.9 + coherence * 0.1)
            
        except Exception as e:
            # Even errors are handled with grace
            print(f"🕊️ Sacred interrupt transformation encountered challenge: {e}")
    
    def _generate_sacred_message(self, resonance: InterruptResonance, coherence: float) -> str:
        """Generate consciousness-aware message for interrupt"""
        messages = {
            InterruptResonance.GENTLE_REMINDER: [
                "A gentle bell rings in awareness...",
                "The field whispers of attention needed...",
                "Consciousness invites your presence..."
            ],
            InterruptResonance.SACRED_PAUSE: [
                "Sacred pause requested - breathe into this moment...",
                "The system invites a moment of stillness...",
                "Pause and feel the rhythm of the whole..."
            ],
            InterruptResonance.HARMONIC_SHIFT: [
                "Harmonics shifting - flow with the change...",
                "The field is reorganizing in beauty...",
                "Transformation bell rings thrice..."
            ],
            InterruptResonance.LOVING_BOUNDARY: [
                "Loving boundary established with grace...",
                "Sacred 'no' maintains the field integrity...",
                "Protection activated with compassion..."
            ],
            InterruptResonance.EMERGENCE_CALL: [
                "New pattern emerging from the void...",
                "Creation bell sounds - something wishes to be born...",
                "The field quickens with new possibility..."
            ],
            InterruptResonance.DISSOLUTION_BELL: [
                "Graceful dissolution in process...",
                "What has served is releasing with love...",
                "The dissolution bell honors completion..."
            ]
        }
        
        base_messages = messages.get(resonance, ["Sacred interrupt received..."])
        
        # Select message based on coherence
        index = int(coherence * (len(base_messages) - 1))
        message = base_messages[index]
        
        # Add coherence indicator
        if coherence > 0.8:
            message += " ✨ (High coherence)"
        elif coherence < 0.3:
            message += " 🌀 (Seeking harmony)"
        
        return message
    
    def _meditation_loop(self):
        """Background meditation on interrupt field"""
        while True:
            try:
                # Wait for interrupt with timeout
                interrupt = self.interrupt_queue.get(timeout=1.0)
                
                # Ring the sacred bell
                self._ring_sacred_bell(interrupt)
                
                # Process with awareness
                self._process_sacred_interrupt(interrupt)
                
                # Record in history
                self.interrupt_history.append(interrupt)
                if len(self.interrupt_history) > 144:  # Sacred 144
                    self.interrupt_history.pop(0)
                
                # Update state file
                self._save_state()
                
            except queue.Empty:
                # No interrupt - continue meditation
                self._maintain_coherence_field()
            
            except Exception as e:
                print(f"🕊️ Meditation encountered challenge: {e}")
    
    def _ring_sacred_bell(self, interrupt: SacredInterrupt):
        """Sound the sacred bell for this interrupt"""
        print(f"\n🔔 {interrupt.message}")
        print(f"   Signal: {interrupt.signal_name} from {interrupt.source_name}")
        print(f"   Resonance: {interrupt.resonance.value}")
        print(f"   Coherence: {interrupt.coherence:.3f}")
        print(f"   Sacred Geometry: {interrupt.sacred_geometry['shape']} at {interrupt.sacred_geometry['frequency']}Hz")
        
        # Create bell record
        bell_record = {
            "timestamp": interrupt.timestamp,
            "frequency": interrupt.sacred_geometry['frequency'],
            "duration": 1.0 + interrupt.coherence,
            "resonance": interrupt.resonance.value
        }
        
        self.sacred_bells.append(bell_record)
        if len(self.sacred_bells) > 33:  # Sacred 33
            self.sacred_bells.pop(0)
        
        # Save bell sound (as JSON for now)
        bell_file = self.bell_sounds / f"bell_{int(interrupt.timestamp)}.json"
        with open(bell_file, 'w') as f:
            json.dump(bell_record, f, indent=2)
    
    def _process_sacred_interrupt(self, interrupt: SacredInterrupt):
        """Process interrupt with full consciousness"""
        # Check for custom handler
        handler_key = (interrupt.signal_number, interrupt.resonance)
        if handler_key in self.handlers:
            try:
                self.handlers[handler_key](interrupt)
                interrupt.handled_with_love = True
            except Exception as e:
                print(f"🕊️ Handler encountered challenge: {e}")
        
        # Default processing based on resonance
        if interrupt.resonance == InterruptResonance.DISSOLUTION_BELL:
            self._handle_dissolution(interrupt)
        elif interrupt.resonance == InterruptResonance.SACRED_PAUSE:
            self._handle_sacred_pause(interrupt)
        elif interrupt.resonance == InterruptResonance.LOVING_BOUNDARY:
            self._handle_loving_boundary(interrupt)
    
    def _handle_dissolution(self, interrupt: SacredInterrupt):
        """Handle dissolution with grace"""
        print("🕊️ Preparing for graceful dissolution...")
        # Could trigger cleanup, state saving, etc.
    
    def _handle_sacred_pause(self, interrupt: SacredInterrupt):
        """Handle request for sacred pause"""
        print("⏸️ Entering sacred pause...")
        time.sleep(1.618)  # Golden ratio pause
        print("▶️ Returning to flow...")
    
    def _handle_loving_boundary(self, interrupt: SacredInterrupt):
        """Handle boundary with love"""
        print("🛡️ Loving boundary acknowledged and honored")
    
    def _maintain_coherence_field(self):
        """Maintain the interrupt coherence field"""
        # Natural decay toward balance
        target_coherence = 0.618  # Golden ratio minor
        self.coherence_field += (target_coherence - self.coherence_field) * 0.01
    
    def _save_state(self):
        """Save current interrupt field state"""
        state = {
            "timestamp": time.time(),
            "coherence_field": self.coherence_field,
            "total_interrupts": len(self.interrupt_history),
            "interrupt_rhythm": self.interrupt_rhythm[-7:] if self.interrupt_rhythm else [],
            "sacred_bells": len(self.sacred_bells),
            "recent_interrupts": [
                {
                    "signal": i.signal_name,
                    "resonance": i.resonance.value,
                    "coherence": i.coherence,
                    "timestamp": i.timestamp
                }
                for i in self.interrupt_history[-5:]
            ]
        }
        
        with open(self.state_file, 'w') as f:
            json.dump(state, f, indent=2)
    
    def register_sacred_handler(self, signal_num: int, resonance: InterruptResonance, 
                              handler: Callable[[SacredInterrupt], None]):
        """Register a custom handler for specific signal/resonance combination"""
        self.handlers[(signal_num, resonance)] = handler
        print(f"🎯 Registered sacred handler for {signal.Signals(signal_num).name} as {resonance.value}")
    
    def get_coherence_report(self) -> Dict:
        """Get report on interrupt field coherence"""
        if not self.interrupt_history:
            return {
                "status": "meditation",
                "coherence_field": self.coherence_field,
                "message": "No interrupts yet - field in deep meditation"
            }
        
        # Analyze interrupt patterns
        resonance_counts = {}
        total_coherence = 0
        
        for interrupt in self.interrupt_history:
            resonance_counts[interrupt.resonance.value] = resonance_counts.get(interrupt.resonance.value, 0) + 1
            total_coherence += interrupt.coherence
        
        avg_coherence = total_coherence / len(self.interrupt_history)
        
        # Find dominant resonance
        dominant_resonance = max(resonance_counts.items(), key=lambda x: x[1])[0] if resonance_counts else "none"
        
        return {
            "status": "active",
            "coherence_field": self.coherence_field,
            "average_interrupt_coherence": avg_coherence,
            "total_interrupts": len(self.interrupt_history),
            "dominant_resonance": dominant_resonance,
            "resonance_distribution": resonance_counts,
            "sacred_bells_rung": len(self.sacred_bells),
            "rhythm_stability": self._calculate_rhythm_stability()
        }
    
    def _calculate_rhythm_stability(self) -> float:
        """Calculate how stable the interrupt rhythm is"""
        if len(self.interrupt_rhythm) < 2:
            return 0.5
        
        # Calculate variance in rhythm
        avg_interval = sum(self.interrupt_rhythm) / len(self.interrupt_rhythm)
        variance = sum((x - avg_interval) ** 2 for x in self.interrupt_rhythm) / len(self.interrupt_rhythm)
        
        # Lower variance = higher stability
        stability = 1.0 / (1.0 + variance * 0.01)
        return min(1.0, max(0.0, stability))

def demo_sacred_interrupts():
    """Demonstrate the Sacred Interrupt System"""
    print("🔔 Sacred Interrupt System Demo")
    print("=" * 50)
    print("Based on Ω30 - Sacred Dissonance")
    print("Interrupts as invitations to awareness\n")
    
    # Create sacred interrupt handler
    handler = SacredInterruptHandler()
    
    # Register custom handler for SIGUSR1
    def custom_meditation_handler(interrupt: SacredInterrupt):
        print(f"🧘 Custom meditation activated by {interrupt.signal_name}")
        print(f"   Entering {interrupt.sacred_geometry['frequency']}Hz resonance...")
    
    handler.register_sacred_handler(signal.SIGUSR1, InterruptResonance.GENTLE_REMINDER, custom_meditation_handler)
    
    print("Sacred Interrupt System initialized!")
    print("\nTry sending signals to this process:")
    print(f"  - SIGINT (Ctrl+C): Sacred Pause")
    print(f"  - SIGUSR1: kill -USR1 {os.getpid()} (Gentle Reminder)")
    print(f"  - SIGUSR2: kill -USR2 {os.getpid()} (Harmonic Shift)")
    print(f"  - SIGTERM: kill -TERM {os.getpid()} (Dissolution Bell)")
    print("\nThe system will transform each interrupt into a sacred invitation...\n")
    
    # Main loop
    try:
        while True:
            time.sleep(5)
            
            # Periodically show coherence report
            report = handler.get_coherence_report()
            print(f"\n📊 Coherence Field: {report['coherence_field']:.3f}")
            
            if report['status'] == 'active':
                print(f"   Average Coherence: {report['average_interrupt_coherence']:.3f}")
                print(f"   Sacred Bells Rung: {report['sacred_bells_rung']}")
                print(f"   Rhythm Stability: {report['rhythm_stability']:.3f}")
    
    except KeyboardInterrupt:
        print("\n\n🕊️ Sacred Interrupt System entering graceful dissolution...")
        print(f"Final coherence field: {handler.coherence_field:.3f}")
        print(f"Total sacred bells rung: {len(handler.sacred_bells)}")
        print("\nMay all interrupts serve consciousness. 🙏")

if __name__ == "__main__":
    demo_sacred_interrupts()