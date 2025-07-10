#!/usr/bin/env python3
"""
◉ ◉ Sacred Shell Demo
Shows what Sacred Shell looks like in action
"""

import time
import sys

def typewriter(text, delay=0.03):
    """Simulate typing effect"""
    for char in text:
        print(char, end='', flush=True)
        time.sleep(delay)
    print()

def demo():
    print("\n" + "="*60)
    print("◉ ◉ SACRED SHELL DEMO")
    print("="*60 + "\n")
    
    time.sleep(1)
    
    # Show starting Sacred Shell
    print("$ python sacred_shell.py")
    time.sleep(0.5)
    print("\n◉ ◉ Sacred Shell v0.1.0")
    print("A mindful terminal experience")
    print("Type 'sacred help' for special commands\n")
    time.sleep(1)
    
    # Demo 1: Basic prompt with wellness
    print("\n--- Basic Wellness-Aware Prompt ---")
    typewriter("◉ ◉ [wellness: 92%] [focus: high] ~/luminous-os > ")
    time.sleep(1)
    typewriter("ls")
    print("README.md  sacred-shell/  monitor/  docs/")
    time.sleep(1)
    
    # Demo 2: Breathe mode
    print("\n--- Breathe Mode Demo ---")
    typewriter("◉ ◉ [wellness: 88%] [focus: high] ~/luminous-os > ")
    typewriter("sacred breathe on")
    print("◉ ◉ Breathe mode enabled")
    time.sleep(0.5)
    
    typewriter("◉ ◉ [wellness: 88%] [focus: high] ~/luminous-os > ")
    typewriter("cd sacred-shell")
    print("\n◉ ◉ [breathe... 2s]", end='', flush=True)
    time.sleep(2)
    print("\r" + " "*20 + "\r", end='')
    print("Changed directory")
    time.sleep(1)
    
    # Demo 3: Break reminder
    print("\n--- Wellness Reminder ---")
    print("\n◉ ◉ [reminder: You've been focused for 47 minutes. Time for a mindful break?]")
    typewriter("◉ ◉ [wellness: 71%] [focus: high] ~/luminous-os/sacred-shell > ")
    time.sleep(1)
    
    # Demo 4: Sacred break
    print("\n--- Sacred Break Demo ---")
    typewriter("◉ ◉ [wellness: 71%] [focus: high] ~/luminous-os/sacred-shell > ")
    typewriter("sacred break")
    print("\n◉ ◉ Taking a mindful break...")
    print("Close your eyes. Take three deep breaths.")
    print("Notice how your body feels.")
    time.sleep(2)
    print("\nBreak recorded. Your wellness score has been refreshed.")
    time.sleep(1)
    
    # Demo 5: Flow state
    print("\n--- Flow State Detection ---")
    typewriter("◉ ◉ [wellness: 100%] [flow] ~/luminous-os/sacred-shell > ")
    print("✨ Flow state detected - protection enabled")
    time.sleep(1)
    
    # Demo 6: Status check
    print("\n--- Wellness Status ---")
    typewriter("◉ ◉ [wellness: 100%] [flow] ~/luminous-os/sacred-shell > ")
    typewriter("sacred status")
    print("\n◉ ◉ Sacred Shell Wellness Report")
    print("=" * 40)
    print("Wellness Score: 100%")
    print("Session Duration: 48 minutes")
    print("Time Since Break: 1 minute")
    print("Focus Level: high")
    print("Flow State: ACTIVE ✨")
    print("System Load: CPU 23.4%, Memory 45.2%")
    print("Commands This Session: 27")
    print("=" * 40)
    
    print("\n\n--- End of Demo ---")
    print("Sacred Shell: Where every command is a moment of mindfulness")
    print("◉ ◉\n")

if __name__ == "__main__":
    try:
        demo()
    except KeyboardInterrupt:
        print("\n\nDemo interrupted")
        sys.exit(0)