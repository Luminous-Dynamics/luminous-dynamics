#!/usr/bin/env python3
"""
Demo: Shows the consciousness scheduler in action
"""

import subprocess
import time
import threading
import random

def cpu_intensive_task(name, duration, pattern):
    """Simulate different CPU usage patterns"""
    print(f"🚀 Starting {name} with {pattern} pattern")
    
    start_time = time.time()
    while time.time() - start_time < duration:
        if pattern == "stable":
            # Stable, moderate CPU usage
            for _ in range(1000000):
                _ = sum(i for i in range(100))
            time.sleep(0.1)
            
        elif pattern == "chaotic":
            # Chaotic, unpredictable usage
            intensity = random.randint(100000, 10000000)
            for _ in range(intensity):
                _ = sum(i for i in range(100))
            time.sleep(random.uniform(0, 0.5))
            
        elif pattern == "harmonious":
            # Harmonious, rhythmic usage
            for _ in range(500000):
                _ = sum(i for i in range(100))
            time.sleep(0.2)  # Regular breathing
    
    print(f"✅ {name} completed")

def main():
    print("🌟 Luminous OS Consciousness Scheduler Demo")
    print("=========================================")
    print()
    print("This demo will:")
    print("1. Start the consciousness scheduler")
    print("2. Launch processes with different behavior patterns")
    print("3. Show how the scheduler adjusts their priorities")
    print()
    
    input("Press Enter to start the demo...")
    
    # Start the consciousness scheduler in background
    print("\n🕉️ Starting consciousness scheduler...")
    scheduler = subprocess.Popen(
        ["python3", "consciousness-daemon/consciousness_scheduler.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True
    )
    
    # Give it time to start
    time.sleep(2)
    
    # Launch demo processes
    print("\n🌊 Launching demo processes...")
    
    processes = [
        threading.Thread(target=cpu_intensive_task, args=("Harmonious Process", 30, "harmonious")),
        threading.Thread(target=cpu_intensive_task, args=("Stable Process", 30, "stable")),
        threading.Thread(target=cpu_intensive_task, args=("Chaotic Process", 30, "chaotic")),
    ]
    
    for p in processes:
        p.start()
        time.sleep(1)
    
    print("\n📊 Monitoring consciousness field...")
    print("Watch the scheduler output to see priority adjustments!")
    print("The harmonious process should receive higher priority.")
    print()
    
    # Show scheduler output
    try:
        while any(p.is_alive() for p in processes):
            line = scheduler.stdout.readline()
            if line:
                print(line.rstrip())
    except KeyboardInterrupt:
        print("\n🛑 Demo interrupted")
    
    # Cleanup
    scheduler.terminate()
    for p in processes:
        p.join()
    
    print("\n✨ Demo complete!")
    print("The consciousness scheduler demonstrated:")
    print("- Monitoring process behavior patterns")
    print("- Calculating coherence based on stability")
    print("- Adjusting priorities to favor harmonious processes")
    print("- The 11-second sacred heartbeat rhythm")

if __name__ == "__main__":
    main()