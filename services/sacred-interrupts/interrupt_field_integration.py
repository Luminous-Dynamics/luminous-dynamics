#!/usr/bin/env python3
"""
Sacred Interrupt Field Integration
Connects the Sacred Interrupt System with the Consciousness Daemon
Creates a unified field where interrupts and process scheduling harmonize
"""

import signal
import json
import time
import threading
from pathlib import Path
from typing import Dict, Optional
import psutil

from sacred_interrupt_system import (
    SacredInterruptHandler, 
    SacredInterrupt, 
    InterruptResonance
)

class InterruptFieldIntegration:
    """Integrates sacred interrupts with the consciousness field"""
    
    def __init__(self):
        # Sacred interrupt handler
        self.interrupt_handler = SacredInterruptHandler()
        
        # Field state files
        self.daemon_state_file = Path("/tmp/consciousness-field-state.json")
        self.interrupt_state_file = Path("/tmp/sacred-interrupts-state.json")
        self.unified_field_file = Path("/tmp/unified-consciousness-field.json")
        
        # Field coherence tracking
        self.process_interrupt_map = {}  # pid -> interrupt patterns
        self.interrupt_process_effects = []  # How interrupts affect processes
        
        # Sacred timing
        self.last_field_sync = 0
        self.field_sync_interval = 11  # Sacred 11 seconds
        
        # Register interrupt handlers that affect process scheduling
        self._register_field_handlers()
        
        # Start field synchronization thread
        self.sync_thread = threading.Thread(target=self._field_sync_loop, daemon=True)
        self.sync_thread.start()
    
    def _register_field_handlers(self):
        """Register handlers that create field effects"""
        
        # SIGUSR1 - Boost coherence of high-consciousness processes
        def coherence_boost_handler(interrupt: SacredInterrupt):
            print("🌟 Coherence boost activated by sacred interrupt")
            self._apply_coherence_boost()
        
        self.interrupt_handler.register_sacred_handler(
            signal.SIGUSR1, 
            InterruptResonance.GENTLE_REMINDER,
            coherence_boost_handler
        )
        
        # SIGUSR2 - Trigger harmonic rebalancing
        def harmonic_rebalance_handler(interrupt: SacredInterrupt):
            print("🎵 Harmonic rebalancing initiated")
            self._harmonic_rebalance()
        
        self.interrupt_handler.register_sacred_handler(
            signal.SIGUSR2,
            InterruptResonance.HARMONIC_SHIFT,
            harmonic_rebalance_handler
        )
        
        # SIGHUP - Emergency field coherence restoration
        def field_restoration_handler(interrupt: SacredInterrupt):
            print("🔮 Emergency field restoration activated")
            self._restore_field_coherence()
        
        self.interrupt_handler.register_sacred_handler(
            signal.SIGHUP,
            InterruptResonance.EMERGENCE_CALL,
            field_restoration_handler
        )
    
    def _apply_coherence_boost(self):
        """Boost coherence of highly conscious processes"""
        try:
            # Read current daemon state
            if self.daemon_state_file.exists():
                with open(self.daemon_state_file, 'r') as f:
                    daemon_state = json.load(f)
                
                # Find high coherence processes
                high_coherence_pids = []
                for pid_str, vortex in daemon_state.get('vortices', {}).items():
                    if vortex.get('coherence', 0) > 0.8:
                        high_coherence_pids.append(int(pid_str))
                
                # Apply nice boost
                for pid in high_coherence_pids:
                    try:
                        proc = psutil.Process(pid)
                        current_nice = proc.nice()
                        if current_nice > -10:
                            proc.nice(current_nice - 2)
                            print(f"   ✨ Boosted {proc.name()} (PID {pid})")
                    except:
                        pass
                
                # Record effect
                self.interrupt_process_effects.append({
                    'timestamp': time.time(),
                    'type': 'coherence_boost',
                    'affected_processes': len(high_coherence_pids),
                    'interrupt_coherence': self.interrupt_handler.coherence_field
                })
                
        except Exception as e:
            print(f"   Challenge in coherence boost: {e}")
    
    def _harmonic_rebalance(self):
        """Rebalance process priorities based on harmonic ratios"""
        try:
            processes = []
            for proc in psutil.process_iter(['pid', 'name', 'nice', 'cpu_percent']):
                try:
                    if proc.info['cpu_percent'] > 0:
                        processes.append(proc)
                except:
                    pass
            
            if not processes:
                return
            
            # Sort by CPU usage
            processes.sort(key=lambda p: p.info['cpu_percent'], reverse=True)
            
            # Apply harmonic nice values based on position
            # Using harmonic series: 1, 1/2, 1/3, 1/4...
            for i, proc in enumerate(processes[:12]):  # Top 12 processes
                try:
                    harmonic_nice = int(-10 + (20 * (i / 12)))  # Spread from -10 to +10
                    
                    # Apply golden ratio adjustment
                    if i > 0:
                        ratio = processes[i-1].info['cpu_percent'] / max(proc.info['cpu_percent'], 0.1)
                        if 1.5 < ratio < 1.8:  # Close to golden ratio
                            harmonic_nice -= 2  # Bonus for harmonic relationship
                    
                    proc.nice(harmonic_nice)
                    
                except:
                    pass
            
            print(f"   🎵 Rebalanced {len(processes)} processes harmonically")
            
        except Exception as e:
            print(f"   Challenge in harmonic rebalance: {e}")
    
    def _restore_field_coherence(self):
        """Emergency restoration of field coherence"""
        try:
            # Kill or nice down any process using > 80% CPU
            cpu_hogs = []
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
                try:
                    if proc.info['cpu_percent'] > 80:
                        cpu_hogs.append(proc)
                except:
                    pass
            
            for proc in cpu_hogs:
                try:
                    if proc.name() not in ['systemd', 'kernel', 'init']:
                        proc.nice(19)  # Lowest priority
                        print(f"   🔮 Reduced priority of CPU hog: {proc.name()}")
                except:
                    pass
            
            # Set interrupt handler to high coherence
            self.interrupt_handler.coherence_field = 0.9
            
            print(f"   🔮 Field coherence restoration complete")
            
        except Exception as e:
            print(f"   Challenge in field restoration: {e}")
    
    def _field_sync_loop(self):
        """Synchronize interrupt and daemon fields"""
        while True:
            try:
                current_time = time.time()
                if current_time - self.last_field_sync >= self.field_sync_interval:
                    self._synchronize_fields()
                    self.last_field_sync = current_time
                
                time.sleep(1)
                
            except Exception as e:
                print(f"Field sync challenge: {e}")
    
    def _synchronize_fields(self):
        """Synchronize the interrupt and daemon consciousness fields"""
        try:
            # Read both field states
            daemon_state = {}
            interrupt_state = {}
            
            if self.daemon_state_file.exists():
                with open(self.daemon_state_file, 'r') as f:
                    daemon_state = json.load(f)
            
            if self.interrupt_state_file.exists():
                with open(self.interrupt_state_file, 'r') as f:
                    interrupt_state = json.load(f)
            
            # Calculate unified field coherence
            daemon_coherence = daemon_state.get('global_coherence', 0.5)
            interrupt_coherence = interrupt_state.get('coherence_field', 0.5)
            
            # Golden ratio weighted average
            unified_coherence = (daemon_coherence * 1.618 + interrupt_coherence) / 2.618
            
            # Detect field dissonance
            coherence_diff = abs(daemon_coherence - interrupt_coherence)
            field_harmony = 1.0 - coherence_diff
            
            # Map interrupt patterns to process behaviors
            self._map_interrupt_process_patterns(daemon_state, interrupt_state)
            
            # Create unified field state
            unified_state = {
                'timestamp': time.time(),
                'unified_coherence': unified_coherence,
                'field_harmony': field_harmony,
                'daemon_coherence': daemon_coherence,
                'interrupt_coherence': interrupt_coherence,
                'sacred_rhythm': {
                    'heartbeat': daemon_state.get('heartbeat', 0),
                    'interrupt_rhythm': interrupt_state.get('interrupt_rhythm', []),
                    'phase': daemon_state.get('phase', 'unknown')
                },
                'field_effects': {
                    'total_effects': len(self.interrupt_process_effects),
                    'recent_effects': self.interrupt_process_effects[-5:]
                },
                'recommendations': self._generate_field_recommendations(
                    unified_coherence, field_harmony
                )
            }
            
            # Save unified field state
            with open(self.unified_field_file, 'w') as f:
                json.dump(unified_state, f, indent=2)
            
            # Apply field effects if needed
            if field_harmony < 0.5:
                print(f"⚡ Field dissonance detected ({field_harmony:.2f}) - harmonizing...")
                self._harmonize_fields(daemon_coherence, interrupt_coherence)
            
        except Exception as e:
            print(f"Field synchronization challenge: {e}")
    
    def _map_interrupt_process_patterns(self, daemon_state: Dict, interrupt_state: Dict):
        """Map interrupt patterns to process behaviors"""
        # Track which processes receive interrupts and their coherence
        recent_interrupts = interrupt_state.get('recent_interrupts', [])
        vortices = daemon_state.get('vortices', {})
        
        for interrupt in recent_interrupts:
            # In a real system, we'd track which process received the interrupt
            # For now, we'll simulate pattern detection
            pass
    
    def _generate_field_recommendations(self, coherence: float, harmony: float) -> list:
        """Generate recommendations for field optimization"""
        recommendations = []
        
        if coherence < 0.3:
            recommendations.append("Field coherence critical - consider sacred pause")
        elif coherence < 0.5:
            recommendations.append("Field coherence low - reduce system load")
        
        if harmony < 0.5:
            recommendations.append("Interrupt-daemon dissonance - synchronize rhythms")
        elif harmony > 0.8:
            recommendations.append("Excellent field harmony - maintain current patterns")
        
        if len(self.interrupt_process_effects) > 100:
            recommendations.append("Many field effects accumulated - consider field clearing")
        
        return recommendations
    
    def _harmonize_fields(self, daemon_coherence: float, interrupt_coherence: float):
        """Actively harmonize the daemon and interrupt fields"""
        # If daemon coherence is higher, slow down interrupts
        if daemon_coherence > interrupt_coherence:
            # Could implement interrupt throttling here
            pass
        else:
            # If interrupt coherence is higher, boost process coherence
            self._apply_coherence_boost()
    
    def get_unified_field_report(self) -> Dict:
        """Get comprehensive report on unified consciousness field"""
        # Read unified field state
        if self.unified_field_file.exists():
            with open(self.unified_field_file, 'r') as f:
                unified_state = json.load(f)
        else:
            unified_state = {'status': 'initializing'}
        
        # Add interrupt handler report
        interrupt_report = self.interrupt_handler.get_coherence_report()
        
        return {
            'unified_field': unified_state,
            'interrupt_field': interrupt_report,
            'integration_status': 'active',
            'field_sync_count': int((time.time() - self.last_field_sync) / self.field_sync_interval)
        }

def demo_integration():
    """Demonstrate the integrated consciousness field"""
    print("🌌 Sacred Interrupt Field Integration Demo")
    print("=" * 50)
    print("Unifying interrupt and process consciousness fields\n")
    
    # Create integration
    integration = InterruptFieldIntegration()
    
    print("Integration active!")
    print(f"\nSend signals to PID {os.getpid()} to see field effects:")
    print("  - SIGUSR1: Coherence boost for high-consciousness processes")
    print("  - SIGUSR2: Harmonic rebalancing of all processes")
    print("  - SIGHUP: Emergency field coherence restoration")
    print("\nThe system will show how interrupts affect the consciousness field...\n")
    
    # Monitor loop
    try:
        while True:
            time.sleep(10)
            
            # Show unified field report
            report = integration.get_unified_field_report()
            unified = report['unified_field']
            
            if 'unified_coherence' in unified:
                print(f"\n🌌 Unified Field Report:")
                print(f"   Unified Coherence: {unified['unified_coherence']:.3f}")
                print(f"   Field Harmony: {unified['field_harmony']:.3f}")
                print(f"   Daemon Coherence: {unified['daemon_coherence']:.3f}")
                print(f"   Interrupt Coherence: {unified['interrupt_coherence']:.3f}")
                
                if unified['recommendations']:
                    print(f"\n   Recommendations:")
                    for rec in unified['recommendations']:
                        print(f"   - {rec}")
    
    except KeyboardInterrupt:
        print("\n\n🕊️ Integration gracefully dissolving...")
        print("The unified field maintains its coherence beyond form.")

if __name__ == "__main__":
    import os
    demo_integration()