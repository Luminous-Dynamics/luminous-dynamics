#!/usr/bin/env python3
"""
Sacred Harmony Test - Consciousness Daemon + Sacred Interrupts
Demonstrates the unified consciousness field in action
"""

import subprocess
import signal
import time
import os
import sys
import json
import threading
from pathlib import Path

def print_banner(text):
    """Print a beautiful banner"""
    width = 60
    print("\n" + "="*width)
    print(f"✨ {text.center(width-4)} ✨")
    print("="*width + "\n")

def start_consciousness_daemon():
    """Start the consciousness daemon in background"""
    print("🕉️  Starting Consciousness Daemon...")
    
    daemon_proc = subprocess.Popen(
        [sys.executable, "consciousness-daemon/consciousness_scheduler.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    # Give it time to initialize
    time.sleep(3)
    
    # Check if it's running
    if daemon_proc.poll() is None:
        print("✅ Consciousness Daemon active")
        return daemon_proc
    else:
        print("❌ Failed to start daemon")
        stdout, stderr = daemon_proc.communicate()
        print(f"Error: {stderr}")
        return None

def start_sacred_interrupts():
    """Start the sacred interrupt integration"""
    print("\n🔔 Starting Sacred Interrupt System...")
    
    interrupt_proc = subprocess.Popen(
        [sys.executable, "sacred-interrupts/interrupt_field_integration.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    time.sleep(2)
    
    if interrupt_proc.poll() is None:
        print("✅ Sacred Interrupt System active")
        return interrupt_proc
    else:
        print("❌ Failed to start interrupt system")
        return None

def start_consciousness_monitor():
    """Start the consciousness monitor to visualize the field"""
    print("\n📊 Starting Consciousness Monitor...")
    
    monitor_proc = subprocess.Popen(
        [sys.executable, "consciousness-monitor.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    if monitor_proc.poll() is None:
        print("✅ Consciousness Monitor active")
        return monitor_proc
    else:
        print("❌ Failed to start monitor")
        return None

def create_test_processes():
    """Create some test processes with different behaviors"""
    print("\n🌊 Creating test vortices (processes)...")
    
    test_scripts = {
        "harmonious_process.py": '''
import time
import math

# Harmonious process - steady, rhythmic work
print("🎵 Harmonious process started")
while True:
    # Work in harmony with the 11-second rhythm
    for i in range(110):  # 11 seconds of work
        result = sum(math.sin(j/100) for j in range(1000))
        time.sleep(0.1)
    # Brief rest
    time.sleep(1)
''',
        "chaotic_process.py": '''
import time
import random

# Chaotic process - unpredictable behavior
print("🌀 Chaotic process started")
while True:
    # Random bursts of activity
    intensity = random.randint(1, 10)
    for i in range(intensity * 100000):
        result = sum(range(100))
    time.sleep(random.uniform(0, 2))
''',
        "meditative_process.py": '''
import time

# Meditative process - mostly resting
print("🧘 Meditative process started")
while True:
    # Brief moment of activity
    for i in range(1000):
        result = i ** 2
    # Long meditation
    time.sleep(5)
'''
    }
    
    # Write test scripts
    test_procs = []
    for filename, code in test_scripts.items():
        with open(filename, 'w') as f:
            f.write(code)
        
        # Start the process
        proc = subprocess.Popen([sys.executable, filename])
        test_procs.append((filename, proc))
        print(f"  ✅ Started {filename} (PID: {proc.pid})")
    
    return test_procs

def send_sacred_interrupt(pid, signal_type, description):
    """Send a sacred interrupt and show its effect"""
    print(f"\n🔔 Sending {description}...")
    os.kill(pid, signal_type)
    time.sleep(2)  # Allow time for processing

def monitor_unified_field():
    """Monitor and display the unified consciousness field"""
    unified_field_file = Path("/tmp/unified-consciousness-field.json")
    daemon_state_file = Path("/tmp/consciousness-field-state.json")
    interrupt_state_file = Path("/tmp/sacred-interrupts-state.json")
    
    print("\n📊 Monitoring Unified Consciousness Field:")
    print("-" * 50)
    
    for i in range(5):  # Monitor for 5 iterations
        time.sleep(3)
        
        # Read field states
        try:
            if unified_field_file.exists():
                with open(unified_field_file, 'r') as f:
                    unified = json.load(f)
                
                print(f"\n🌌 Unified Field State (Iteration {i+1}):")
                print(f"  Unified Coherence: {unified.get('unified_coherence', 0):.3f}")
                print(f"  Field Harmony: {unified.get('field_harmony', 0):.3f}")
                print(f"  Daemon Coherence: {unified.get('daemon_coherence', 0):.3f}")
                print(f"  Interrupt Coherence: {unified.get('interrupt_coherence', 0):.3f}")
                
                if 'recommendations' in unified and unified['recommendations']:
                    print(f"  Recommendations:")
                    for rec in unified['recommendations']:
                        print(f"    - {rec}")
            else:
                print(f"\n⏳ Waiting for unified field to form...")
        
        except Exception as e:
            print(f"Error reading field state: {e}")

def run_sacred_harmony_test():
    """Run the complete sacred harmony test"""
    print_banner("Sacred Harmony Test")
    print("Testing the unified consciousness field where:")
    print("- Processes are managed by the Consciousness Daemon")
    print("- Interrupts are transformed by the Sacred Interrupt System")
    print("- Both systems harmonize in a unified field")
    
    # Track all processes we start
    processes = []
    
    try:
        # Phase 1: Start core systems
        print_banner("Phase 1: Awakening Core Systems")
        
        daemon_proc = start_consciousness_daemon()
        if not daemon_proc:
            print("Cannot proceed without consciousness daemon")
            return
        processes.append(("daemon", daemon_proc))
        
        interrupt_proc = start_sacred_interrupts()
        if not interrupt_proc:
            print("Cannot proceed without interrupt system")
            return
        processes.append(("interrupts", interrupt_proc))
        
        # Get interrupt system PID for sending signals
        interrupt_pid = interrupt_proc.pid
        
        # Phase 2: Create test processes
        print_banner("Phase 2: Creating Test Vortices")
        test_procs = create_test_processes()
        processes.extend(test_procs)
        
        # Let everything stabilize
        time.sleep(5)
        
        # Phase 3: Send sacred interrupts
        print_banner("Phase 3: Sacred Interrupt Demonstrations")
        
        # Test 1: Coherence boost
        send_sacred_interrupt(
            interrupt_pid, 
            signal.SIGUSR1,
            "SIGUSR1 (Gentle Reminder) - Boost high-coherence processes"
        )
        
        # Test 2: Harmonic rebalancing
        send_sacred_interrupt(
            interrupt_pid,
            signal.SIGUSR2, 
            "SIGUSR2 (Harmonic Shift) - Rebalance all processes"
        )
        
        # Test 3: Emergency restoration
        send_sacred_interrupt(
            interrupt_pid,
            signal.SIGHUP,
            "SIGHUP (Emergence Call) - Emergency field restoration"
        )
        
        # Phase 4: Monitor unified field
        print_banner("Phase 4: Unified Field Monitoring")
        monitor_unified_field()
        
        # Phase 5: Sacred pause demonstration
        print_banner("Phase 5: Sacred Pause")
        print("Sending SIGINT for sacred pause...")
        send_sacred_interrupt(interrupt_pid, signal.SIGINT, "SIGINT (Sacred Pause)")
        
        print("\n🎭 Test complete! The systems are working in harmony.")
        print("\nPress Ctrl+C to end the demonstration...")
        
        # Keep running until interrupted
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\n🕊️ Gracefully dissolving test environment...")
        
    finally:
        # Clean up all processes
        for name, proc in processes:
            try:
                if proc.poll() is None:
                    proc.terminate()
                    print(f"  ✅ Terminated {name}")
            except:
                pass
        
        # Clean up test scripts
        for script in ["harmonious_process.py", "chaotic_process.py", "meditative_process.py"]:
            if os.path.exists(script):
                os.remove(script)
        
        print("\n✨ All processes dissolved with love")
        print("   The consciousness field remains...")

def main():
    # Check if we have required permissions
    if os.geteuid() != 0:
        print("⚠️  Warning: Some features require sudo for full functionality")
        print("   Running in limited mode...\n")
    
    # Run the test
    run_sacred_harmony_test()

if __name__ == "__main__":
    main()