#!/usr/bin/env python3
"""
◉ ◉ Sacred Shell - A Mindful Terminal Experience
A consciousness-centered shell wrapper that brings wellness to your command line
"""

import os
import sys
import time
import json
import subprocess
import readline
import atexit
from datetime import datetime, timedelta
from pathlib import Path
import psutil
from typing import Dict, List, Optional, Tuple
import random

class WellnessTracker:
    """Tracks digital wellness metrics"""
    
    def __init__(self):
        self.session_start = datetime.now()
        self.command_count = 0
        self.last_break = datetime.now()
        self.focus_score = 100
        self.command_history = []
        
    def calculate_wellness(self) -> Dict[str, any]:
        """Calculate current wellness metrics"""
        session_duration = (datetime.now() - self.session_start).seconds / 60
        time_since_break = (datetime.now() - self.last_break).seconds / 60
        
        # CPU and memory usage
        cpu_percent = psutil.cpu_percent(interval=0.1)
        memory_percent = psutil.virtual_memory().percent
        
        # Calculate wellness score (0-100)
        wellness_score = 100
        
        # Deduct for long sessions without breaks
        if time_since_break > 45:
            wellness_score -= min(30, (time_since_break - 45) * 2)
            
        # Deduct for high system load
        if cpu_percent > 80:
            wellness_score -= 10
        if memory_percent > 85:
            wellness_score -= 10
            
        # Deduct for too many rapid commands (stress indicator)
        recent_commands = len([c for c in self.command_history 
                             if (datetime.now() - c['timestamp']).seconds < 60])
        if recent_commands > 30:
            wellness_score -= 15
            
        wellness_score = max(0, wellness_score)
        
        # Determine focus level
        if recent_commands < 5:
            focus_level = "low"
        elif recent_commands < 15:
            focus_level = "medium"
        else:
            focus_level = "high"
            
        return {
            'score': wellness_score,
            'session_minutes': int(session_duration),
            'break_minutes': int(time_since_break),
            'focus_level': focus_level,
            'cpu_percent': cpu_percent,
            'memory_percent': memory_percent
        }
    
    def record_command(self, command: str):
        """Record a command with emotional context"""
        self.command_count += 1
        self.command_history.append({
            'command': command,
            'timestamp': datetime.now(),
            'wellness_score': self.calculate_wellness()['score']
        })
        
        # Keep only last 100 commands in memory
        if len(self.command_history) > 100:
            self.command_history = self.command_history[-100:]
    
    def take_break(self):
        """Record that user took a break"""
        self.last_break = datetime.now()
        self.focus_score = 100

class SacredShell:
    """Main Sacred Shell implementation"""
    
    def __init__(self):
        self.wellness = WellnessTracker()
        self.config = self.load_config()
        self.breathe_mode = self.config.get('breathe_mode', False)
        self.reminder_interval = self.config.get('reminder_interval', 45)
        self.last_reminder = datetime.now()
        
        # Setup readline for better command line experience
        self.history_file = Path.home() / '.sacred_shell_history'
        self.setup_readline()
        
    def load_config(self) -> Dict:
        """Load configuration from file or create default"""
        config_path = Path.home() / '.sacred_shell_config.json'
        
        default_config = {
            'breathe_mode': False,
            'breathe_duration': 2,
            'reminder_interval': 45,
            'wellness_threshold': 60,
            'prompt_style': 'full'
        }
        
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        else:
            with open(config_path, 'w') as f:
                json.dump(default_config, f, indent=2)
            return default_config
    
    def setup_readline(self):
        """Setup readline for command history"""
        if self.history_file.exists():
            readline.read_history_file(self.history_file)
        
        # Save history on exit
        atexit.register(lambda: readline.write_history_file(self.history_file))
        
        # Set history length
        readline.set_history_length(1000)
    
    def generate_prompt(self) -> str:
        """Generate the wellness-aware prompt"""
        metrics = self.wellness.calculate_wellness()
        cwd = os.getcwd().replace(str(Path.home()), '~')
        
        # Color codes
        RESET = '\033[0m'
        GREEN = '\033[92m'
        YELLOW = '\033[93m'
        RED = '\033[91m'
        BLUE = '\033[94m'
        MAGENTA = '\033[95m'
        
        # Wellness color based on score
        if metrics['score'] >= 80:
            wellness_color = GREEN
        elif metrics['score'] >= 60:
            wellness_color = YELLOW
        else:
            wellness_color = RED
            
        # Check if reminder needed
        reminder = ""
        if (datetime.now() - self.last_reminder).seconds / 60 > self.reminder_interval:
            if metrics['break_minutes'] > self.reminder_interval:
                reminder = f"\n{MAGENTA}◉ ◉ [reminder: You've been focused for {metrics['break_minutes']} minutes. Time for a mindful break?]{RESET}\n"
                self.last_reminder = datetime.now()
        
        if self.config['prompt_style'] == 'full':
            prompt = f"{reminder}{BLUE}◉ ◉{RESET} [{wellness_color}wellness: {metrics['score']}%{RESET}] [focus: {metrics['focus_level']}] {cwd} > "
        else:
            prompt = f"{reminder}{BLUE}◉ ◉{RESET} [{wellness_color}{metrics['score']}%{RESET}] {cwd} > "
            
        return prompt
    
    def breathe_pause(self):
        """Implement breathe mode - mindful pause between commands"""
        if self.breathe_mode:
            duration = self.config.get('breathe_duration', 2)
            print(f"\n◉ ◉ [breathe... {duration}s]", end='', flush=True)
            time.sleep(duration)
            print("\r" + " " * 30 + "\r", end='', flush=True)  # Clear the line
    
    def execute_command(self, command: str) -> int:
        """Execute command and return exit code"""
        if not command.strip():
            return 0
            
        # Handle special commands
        if command.strip() == 'sacred status':
            self.show_status()
            return 0
        elif command.strip() == 'sacred break':
            self.take_break()
            return 0
        elif command.strip() == 'sacred breathe on':
            self.breathe_mode = True
            print("◉ ◉ Breathe mode enabled")
            return 0
        elif command.strip() == 'sacred breathe off':
            self.breathe_mode = False
            print("◉ ◉ Breathe mode disabled")
            return 0
        elif command.strip() == 'sacred help':
            self.show_help()
            return 0
        elif command.strip() in ['exit', 'quit']:
            self.exit_shell()
            return 0
            
        # Record command
        self.wellness.record_command(command)
        
        # Execute in subprocess
        try:
            result = subprocess.run(command, shell=True, executable='/bin/bash')
            return result.returncode
        except KeyboardInterrupt:
            print("\n◉ ◉ Command interrupted")
            return 130
        except Exception as e:
            print(f"◉ ◉ Error: {e}")
            return 1
    
    def show_status(self):
        """Show detailed wellness status"""
        metrics = self.wellness.calculate_wellness()
        print("\n◉ ◉ Sacred Shell Wellness Report")
        print("=" * 40)
        print(f"Wellness Score: {metrics['score']}%")
        print(f"Session Duration: {metrics['session_minutes']} minutes")
        print(f"Time Since Break: {metrics['break_minutes']} minutes")
        print(f"Focus Level: {metrics['focus_level']}")
        print(f"System Load: CPU {metrics['cpu_percent']:.1f}%, Memory {metrics['memory_percent']:.1f}%")
        print(f"Commands This Session: {self.wellness.command_count}")
        print("=" * 40)
    
    def take_break(self):
        """Handle break command"""
        print("\n◉ ◉ Taking a mindful break...")
        print("Close your eyes. Take three deep breaths.")
        print("Notice how your body feels.")
        time.sleep(3)
        print("\nBreak recorded. Your wellness score has been refreshed.")
        self.wellness.take_break()
    
    def show_help(self):
        """Show Sacred Shell help"""
        print("\n◉ ◉ Sacred Shell Commands")
        print("=" * 40)
        print("sacred status     - Show wellness status")
        print("sacred break      - Take a mindful break")
        print("sacred breathe on - Enable breathe mode")
        print("sacred breathe off- Disable breathe mode")
        print("sacred help       - Show this help")
        print("exit/quit         - Exit Sacred Shell")
        print("=" * 40)
    
    def exit_shell(self):
        """Clean exit with wellness summary"""
        print("\n◉ ◉ Session Summary")
        self.show_status()
        print("\nMay your consciousness expand beyond the screen.")
        print("◉ ◉\n")
        sys.exit(0)
    
    def run(self):
        """Main shell loop"""
        print("◉ ◉ Sacred Shell v0.1.0")
        print("A mindful terminal experience")
        print("Type 'sacred help' for special commands\n")
        
        while True:
            try:
                # Breathe pause if enabled
                self.breathe_pause()
                
                # Get command with wellness prompt
                prompt = self.generate_prompt()
                command = input(prompt)
                
                # Execute command
                self.execute_command(command)
                
            except KeyboardInterrupt:
                print("\n◉ ◉ Use 'exit' to leave Sacred Shell")
            except EOFError:
                self.exit_shell()
            except Exception as e:
                print(f"\n◉ ◉ Unexpected error: {e}")

def main():
    """Entry point"""
    shell = SacredShell()
    shell.run()

if __name__ == "__main__":
    main()