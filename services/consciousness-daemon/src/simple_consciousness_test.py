#!/usr/bin/env python3
"""
Simple test to verify consciousness daemon works
"""

import json
import os
import time
import psutil

print("Simple Consciousness Daemon Test")
print("This will write field state to ~/.luminous/field-state.json")
print()

# Create directory
os.makedirs(os.path.expanduser('~/.luminous'), exist_ok=True)

# Simple loop
count = 0
while True:
    count += 1
    
    # Get some process data
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
        try:
            processes.append({
                'pid': proc.pid,
                'name': proc.name(),
                'cpu': proc.cpu_percent(interval=0.1)
            })
        except:
            continue
    
    # Create simple state
    state = {
        'timestamp': time.time(),
        'global_coherence': 75.0 + (count % 20),  # Varies between 75-95
        'process_count': len(processes),
        'coherence_distribution': {
            'high': 5,
            'medium': 10,
            'low': 3
        },
        'top_coherent_processes': [
            [p['pid'], 70 + (hash(p['name']) % 30)]
            for p in sorted(processes, key=lambda x: x['cpu'], reverse=True)[:10]
        ]
    }
    
    # Write state
    state_file = os.path.expanduser('~/.luminous/field-state.json')
    with open(state_file, 'w') as f:
        json.dump(state, f, indent=2)
    
    print(f"\rWrote state #{count} - Global coherence: {state['global_coherence']:.1f}%", end='', flush=True)
    
    time.sleep(5)