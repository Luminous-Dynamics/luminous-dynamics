#!/usr/bin/env python3
"""
◉ ◉ Sacred Shell Enhanced - Advanced Mindful Terminal
Uses prompt_toolkit for better terminal experience
"""

import os
import sys
import time
import json
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
import psutil
from typing import Dict, List, Optional
from prompt_toolkit import prompt, HTML
from prompt_toolkit.history import FileHistory
from prompt_toolkit.auto_suggest import AutoSuggestFromHistory
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.styles import Style
from prompt_toolkit.key_binding import KeyBindings
from prompt_toolkit.application import run_in_terminal

class EmotionalContext:
    """Tracks emotional context of commands"""
    
    STRESS_PATTERNS = [
        'kill', 'force', 'error', 'failed', 'crash',
        'damn', 'shit', 'fuck', 'urgent', 'asap'
    ]
    
    CALM_PATTERNS = [
        'help', 'please', 'thank', 'great', 'nice',
        'good', 'well', 'perfect', 'beautiful'
    ]
    
    @staticmethod
    def analyze_command(command: str) -> str:
        """Analyze emotional context of command"""
        cmd_lower = command.lower()
        
        stress_count = sum(1 for pattern in EmotionalContext.STRESS_PATTERNS 
                          if pattern in cmd_lower)
        calm_count = sum(1 for pattern in EmotionalContext.CALM_PATTERNS 
                        if pattern in cmd_lower)
        
        if stress_count > calm_count:
            return "stressed"
        elif calm_count > stress_count:
            return "calm"
        else:
            return "neutral"

class WellnessTracker:
    """Enhanced wellness tracking with flow state detection"""
    
    def __init__(self):
        self.session_start = datetime.now()
        self.command_count = 0
        self.last_break = datetime.now()
        self.command_history = []
        self.flow_state_start = None
        self.stress_level = 0
        
    def detect_flow_state(self) -> bool:
        """Detect if user is in flow state"""
        if len(self.command_history) < 5:
            return False
            
        recent = self.command_history[-10:]
        
        # Flow indicators:
        # 1. Consistent command spacing (not too fast, not too slow)
        # 2. Related commands (working on same files/dirs)
        # 3. No stress patterns
        
        time_gaps = []
        for i in range(1, len(recent)):
            gap = (recent[i]['timestamp'] - recent[i-1]['timestamp']).seconds
            time_gaps.append(gap)
            
        if not time_gaps:
            return False
            
        avg_gap = sum(time_gaps) / len(time_gaps)
        
        # Flow state: steady pace between 5-30 seconds
        in_flow = 5 <= avg_gap <= 30
        
        # Check for stress
        stress_commands = sum(1 for cmd in recent 
                            if cmd.get('emotion') == 'stressed')
        
        return in_flow and stress_commands < 2
    
    def calculate_wellness(self) -> Dict:
        """Enhanced wellness calculation"""
        session_duration = (datetime.now() - self.session_start).seconds / 60
        time_since_break = (datetime.now() - self.last_break).seconds / 60
        
        cpu_percent = psutil.cpu_percent(interval=0.1)
        memory_percent = psutil.virtual_memory().percent
        
        wellness_score = 100
        
        # Time-based deductions
        if time_since_break > 45:
            wellness_score -= min(30, (time_since_break - 45) * 2)
            
        # System load deductions
        if cpu_percent > 80:
            wellness_score -= 10
        if memory_percent > 85:
            wellness_score -= 10
            
        # Stress level impacts wellness
        wellness_score -= min(20, self.stress_level * 5)
        
        # Flow state bonus
        if self.detect_flow_state():
            wellness_score += 10
            
        wellness_score = max(0, min(100, wellness_score))
        
        return {
            'score': wellness_score,
            'session_minutes': int(session_duration),
            'break_minutes': int(time_since_break),
            'in_flow': self.detect_flow_state(),
            'stress_level': self.stress_level,
            'cpu_percent': cpu_percent,
            'memory_percent': memory_percent
        }
    
    def record_command(self, command: str, emotion: str):
        """Record command with emotional context"""
        self.command_count += 1
        
        # Update stress level
        if emotion == "stressed":
            self.stress_level = min(10, self.stress_level + 1)
        elif emotion == "calm":
            self.stress_level = max(0, self.stress_level - 1)
            
        self.command_history.append({
            'command': command,
            'timestamp': datetime.now(),
            'emotion': emotion,
            'wellness_score': self.calculate_wellness()['score']
        })
        
        if len(self.command_history) > 100:
            self.command_history = self.command_history[-100:]

class SacredShellEnhanced:
    """Enhanced Sacred Shell with prompt_toolkit"""
    
    def __init__(self):
        self.wellness = WellnessTracker()
        self.config = self.load_config()
        self.history = FileHistory(Path.home() / '.sacred_shell_history')
        
        # Setup custom style
        self.style = Style.from_dict({
            'prompt': '#00aa00 bold',
            'wellness-good': '#00ff00',
            'wellness-medium': '#ffff00',
            'wellness-bad': '#ff0000',
            'flow': '#00ffff italic',
            'breathe': '#ff00ff italic',
        })
        
        # Sacred commands completer
        self.sacred_commands = WordCompleter([
            'sacred status',
            'sacred break',
            'sacred breathe on',
            'sacred breathe off',
            'sacred flow',
            'sacred help',
            'exit',
            'quit'
        ])
        
    def load_config(self) -> Dict:
        """Load or create configuration"""
        config_path = Path.home() / '.sacred_shell_config.json'
        
        default = {
            'breathe_mode': False,
            'breathe_duration': 2,
            'reminder_interval': 45,
            'protect_flow': True,
            'flow_protection_duration': 90
        }
        
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        else:
            with open(config_path, 'w') as f:
                json.dump(default, f, indent=2)
            return default
    
    def generate_prompt_message(self) -> HTML:
        """Generate HTML prompt with colors"""
        metrics = self.wellness.calculate_wellness()
        cwd = os.getcwd().replace(str(Path.home()), '~')
        
        # Wellness color
        if metrics['score'] >= 80:
            wellness_class = 'wellness-good'
        elif metrics['score'] >= 60:
            wellness_class = 'wellness-medium'
        else:
            wellness_class = 'wellness-bad'
            
        # Base prompt
        prompt_parts = [
            '<prompt>◉ ◉</prompt>',
            f'<{wellness_class}>[{metrics["score"]}%]</{wellness_class}>'
        ]
        
        # Add flow state indicator
        if metrics['in_flow']:
            prompt_parts.append('<flow>[flow]</flow>')
            
        # Add path
        prompt_parts.append(f'{cwd} > ')
        
        return HTML(' '.join(prompt_parts))
    
    def breathe_pause(self):
        """Animated breathe pause"""
        if self.config.get('breathe_mode', False):
            duration = self.config.get('breathe_duration', 2)
            
            def breathe_animation():
                frames = ['◉ ◉', '◉  ◉', '◉   ◉', '◉  ◉', '◉ ◉']
                print('\n', end='')
                for i in range(duration * 2):
                    frame = frames[i % len(frames)]
                    print(f'\r{frame} [breathe...]', end='', flush=True)
                    time.sleep(0.5)
                print('\r' + ' ' * 30 + '\r', end='', flush=True)
                
            run_in_terminal(breathe_animation)
    
    def handle_sacred_command(self, command: str) -> bool:
        """Handle special sacred commands"""
        cmd = command.strip().lower()
        
        if cmd == 'sacred status':
            self.show_detailed_status()
            return True
        elif cmd == 'sacred break':
            self.guided_break()
            return True
        elif cmd == 'sacred breathe on':
            self.config['breathe_mode'] = True
            print("◉ ◉ Breathe mode enabled - pause between commands for mindfulness")
            return True
        elif cmd == 'sacred breathe off':
            self.config['breathe_mode'] = False
            print("◉ ◉ Breathe mode disabled")
            return True
        elif cmd == 'sacred flow':
            self.show_flow_status()
            return True
        elif cmd == 'sacred help':
            self.show_help()
            return True
            
        return False
    
    def show_flow_status(self):
        """Show flow state analysis"""
        metrics = self.wellness.calculate_wellness()
        
        print("\n◉ ◉ Flow State Analysis")
        print("=" * 40)
        
        if metrics['in_flow']:
            print("✨ You're in FLOW STATE!")
            print("Keep going - your rhythm is perfect.")
            if self.config.get('protect_flow', True):
                print(f"Flow protection active for {self.config['flow_protection_duration']} minutes")
        else:
            print("Not currently in flow state.")
            print("\nFlow state indicators:")
            print("- Steady command pace (5-30 seconds)")
            print("- Low stress patterns")
            print("- Consistent work focus")
            
        print("=" * 40)
    
    def guided_break(self):
        """Interactive guided break"""
        print("\n◉ ◉ Guided Mindfulness Break")
        print("=" * 40)
        
        exercises = [
            ("Deep Breathing", "Take 3 deep breaths. In through nose, out through mouth."),
            ("Body Scan", "Notice tension in shoulders, neck, hands. Gently release."),
            ("Eye Rest", "Look away from screen. Focus on something 20 feet away."),
            ("Gratitude", "Think of one thing you're grateful for in this moment."),
        ]
        
        for title, instruction in exercises:
            print(f"\n{title}:")
            print(f"  {instruction}")
            time.sleep(3)
            
        print("\n✨ Break complete. Wellness restored.")
        self.wellness.last_break = datetime.now()
        self.wellness.stress_level = max(0, self.wellness.stress_level - 3)
    
    def show_detailed_status(self):
        """Show comprehensive wellness status"""
        metrics = self.wellness.calculate_wellness()
        
        print("\n◉ ◉ Sacred Shell Wellness Dashboard")
        print("=" * 50)
        
        # Wellness score with bar
        score_bar = "█" * (metrics['score'] // 10) + "░" * (10 - metrics['score'] // 10)
        print(f"Wellness Score: [{score_bar}] {metrics['score']}%")
        
        # Time metrics
        print(f"\nSession Time: {metrics['session_minutes']} minutes")
        print(f"Last Break: {metrics['break_minutes']} minutes ago")
        
        # Flow state
        if metrics['in_flow']:
            print("\n✨ FLOW STATE ACTIVE ✨")
        
        # Stress level
        stress_bar = "▓" * metrics['stress_level'] + "░" * (10 - metrics['stress_level'])
        print(f"\nStress Level: [{stress_bar}] {metrics['stress_level']}/10")
        
        # System metrics
        print(f"\nSystem Load:")
        print(f"  CPU: {metrics['cpu_percent']:.1f}%")
        print(f"  Memory: {metrics['memory_percent']:.1f}%")
        
        # Command statistics
        print(f"\nCommands This Session: {self.wellness.command_count}")
        
        # Recent emotional context
        recent_emotions = [cmd['emotion'] for cmd in self.wellness.command_history[-5:]]
        if recent_emotions:
            print(f"Recent Command Emotions: {', '.join(recent_emotions)}")
            
        print("=" * 50)
    
    def show_help(self):
        """Show comprehensive help"""
        help_text = """
◉ ◉ Sacred Shell Commands
════════════════════════════════════════════════════

Sacred Commands:
  sacred status      Show wellness dashboard
  sacred break       Take a guided mindfulness break
  sacred flow        Check flow state status
  sacred breathe on  Enable breathe mode
  sacred breathe off Disable breathe mode
  sacred help        Show this help

Shell Features:
  - Wellness tracking in prompt
  - Flow state detection
  - Emotional command analysis
  - Stress level monitoring
  - Mindful break reminders

Tips for Digital Wellness:
  - Take breaks every 45 minutes
  - Use 'sacred break' for guided exercises
  - Enable breathe mode during stressful work
  - Watch your stress level indicator

════════════════════════════════════════════════════
        """
        print(help_text)
    
    def run(self):
        """Main shell loop with prompt_toolkit"""
        print("◉ ◉ Sacred Shell Enhanced v0.1.0")
        print("Your mindful terminal companion")
        print("Type 'sacred help' for guidance\n")
        
        # Setup key bindings
        kb = KeyBindings()
        
        @kb.add('c-d')
        def _(event):
            """Ctrl-D to exit"""
            event.app.exit()
            
        while True:
            try:
                # Check for break reminder
                metrics = self.wellness.calculate_wellness()
                if metrics['break_minutes'] > self.config['reminder_interval']:
                    if not metrics['in_flow'] or not self.config.get('protect_flow', True):
                        print(f"\n◉ ◉ Gentle reminder: You've been focused for {metrics['break_minutes']} minutes.")
                        print("   Consider 'sacred break' when ready.\n")
                        self.wellness.last_break = datetime.now()  # Reset reminder
                
                # Breathe pause
                self.breathe_pause()
                
                # Get command
                command = prompt(
                    self.generate_prompt_message(),
                    history=self.history,
                    auto_suggest=AutoSuggestFromHistory(),
                    completer=self.sacred_commands,
                    style=self.style,
                    key_bindings=kb
                )
                
                if command.strip() in ['exit', 'quit']:
                    self.exit_gracefully()
                    break
                    
                # Analyze emotional context
                emotion = EmotionalContext.analyze_command(command)
                self.wellness.record_command(command, emotion)
                
                # Handle sacred commands
                if not self.handle_sacred_command(command):
                    # Execute regular command
                    subprocess.run(command, shell=True)
                    
            except KeyboardInterrupt:
                print("\n◉ ◉ Command cancelled")
            except EOFError:
                self.exit_gracefully()
                break
            except Exception as e:
                print(f"\n◉ ◉ Error: {e}")
    
    def exit_gracefully(self):
        """Exit with session summary"""
        print("\n◉ ◉ Session Complete")
        self.show_detailed_status()
        print("\nMay your consciousness expand beyond the screen.")
        print("◉ ◉\n")

def main():
    shell = SacredShellEnhanced()
    shell.run()

if __name__ == "__main__":
    main()