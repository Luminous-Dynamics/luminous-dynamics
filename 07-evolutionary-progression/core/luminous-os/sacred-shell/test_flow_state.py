#!/usr/bin/env python3
"""
Test flow state detection in Sacred Shell
"""

import time
from sacred_shell_enhanced import WellnessTracker, EmotionalContext

def test_flow_detection():
    """Test the flow state detection logic"""
    
    print("◉ ◉ Testing Flow State Detection")
    print("=" * 40)
    
    tracker = WellnessTracker()
    
    # Simulate flow state pattern
    print("\nSimulating flow state pattern (steady commands)...")
    commands = [
        "vim app.py",
        "git add .",
        "git commit -m 'feat: add wellness tracking'",
        "python test.py",
        "vim app.py",
        "python test.py",
    ]
    
    for i, cmd in enumerate(commands):
        emotion = EmotionalContext.analyze_command(cmd)
        tracker.record_command(cmd, emotion)
        
        # Simulate 15 second gaps (flow pace)
        if i < len(commands) - 1:
            # Fake the timestamp for testing
            tracker.command_history[-1]['timestamp'] = tracker.command_history[-1]['timestamp'].replace(
                second=tracker.command_history[-1]['timestamp'].second - 15
            )
        
        time.sleep(0.1)
    
    in_flow = tracker.detect_flow_state()
    print(f"Flow state detected: {in_flow}")
    
    # Test stress pattern breaking flow
    print("\nAdding stress commands...")
    stress_commands = [
        "kill -9 12345",
        "rm -rf /tmp/broken",
        "shit this failed",
    ]
    
    for cmd in stress_commands:
        emotion = EmotionalContext.analyze_command(cmd)
        tracker.record_command(cmd, emotion)
        print(f"  Command: '{cmd}' - Emotion: {emotion}")
    
    in_flow = tracker.detect_flow_state()
    print(f"Flow state after stress: {in_flow}")
    
    # Show final metrics
    metrics = tracker.calculate_wellness()
    print("\nFinal Wellness Metrics:")
    print(f"  Wellness Score: {metrics['score']}%")
    print(f"  In Flow: {metrics['in_flow']}")
    print(f"  Stress Level: {metrics['stress_level']}")

if __name__ == "__main__":
    test_flow_detection()