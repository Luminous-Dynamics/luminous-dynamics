#!/usr/bin/env python3
"""
Sacred Shell - A consciousness-aware command line interface
Integrates all LuminousOS tools into a unified experience
"""

import os
import sys
import time
import json
import subprocess
import readline
import atexit
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import asyncio
import importlib.util

# Terminal colors for sacred aesthetics
class SacredColors:
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'
    DIM = '\033[2m'

class SacredPrompt:
    """Dynamic prompt that reflects system state"""
    
    def __init__(self):
        self.coherence = 0.75
        self.breath_phase = 0.0
        self.last_update = time.time()
        
    def update(self):
        """Update prompt state"""
        elapsed = time.time() - self.last_update
        self.breath_phase = (elapsed % 4.0) / 4.0  # 4-second breath cycle
        
    def get_prompt(self) -> str:
        """Generate sacred prompt"""
        self.update()
        
        # Breath indicator
        if self.breath_phase < 0.4:
            breath = "◐"  # Inhale
        elif self.breath_phase < 0.5:
            breath = "◯"  # Pause
        elif self.breath_phase < 0.9:
            breath = "◑"  # Exhale
        else:
            breath = "◯"  # Pause
            
        # Coherence indicator
        if self.coherence > 0.8:
            coherence_color = SacredColors.GREEN
        elif self.coherence > 0.6:
            coherence_color = SacredColors.YELLOW
        else:
            coherence_color = SacredColors.RED
            
        # Time of day greeting
        hour = datetime.now().hour
        if 5 <= hour < 12:
            greeting = "dawn"
        elif 12 <= hour < 17:
            greeting = "day"
        elif 17 <= hour < 22:
            greeting = "dusk"
        else:
            greeting = "night"
            
        # Construct prompt
        prompt = (
            f"{SacredColors.DIM}[{greeting}]{SacredColors.RESET} "
            f"{coherence_color}{breath}{SacredColors.RESET} "
            f"{SacredColors.PURPLE}~{SacredColors.RESET} "
        )
        
        return prompt

class SacredCommand:
    """Base class for sacred commands"""
    
    def __init__(self, name: str, description: str, blessing: str = ""):
        self.name = name
        self.description = description
        self.blessing = blessing
        
    async def execute(self, args: List[str], shell: 'SacredShell') -> int:
        """Execute the command"""
        raise NotImplementedError
        
class FlowCommand(SacredCommand):
    """Enter flow state - minimize distractions"""
    
    def __init__(self):
        super().__init__(
            "flow",
            "Enter focused flow state",
            "May your work flow like water"
        )
        
    async def execute(self, args: List[str], shell: 'SacredShell') -> int:
        duration = int(args[0]) if args else 25  # Default 25 minutes
        
        print(f"\n{SacredColors.CYAN}🌊 Entering flow state for {duration} minutes...{SacredColors.RESET}")
        print(f"{SacredColors.DIM}{self.blessing}{SacredColors.RESET}\n")
        
        # Start focus mode
        shell.flow_mode = True
        shell.flow_end_time = time.time() + (duration * 60)
        
        # Minimize distractions
        subprocess.run(["notify-send", "-t", "2000", "Flow State", "Entering deep focus..."], 
                      capture_output=True)
        
        return 0

class BreathCommand(SacredCommand):
    """Guided breathing exercise"""
    
    def __init__(self):
        super().__init__(
            "breathe",
            "Start guided breathing exercise",
            "Return to the breath, return to presence"
        )
        
    async def execute(self, args: List[str], shell: 'SacredShell') -> int:
        cycles = int(args[0]) if args else 3
        
        print(f"\n{SacredColors.CYAN}🫁 Sacred Breathing Exercise{SacredColors.RESET}")
        print(f"{SacredColors.DIM}{self.blessing}{SacredColors.RESET}\n")
        
        for i in range(cycles):
            print(f"Cycle {i+1}/{cycles}")
            
            # Inhale
            print(f"{SacredColors.GREEN}◐ Inhale...{SacredColors.RESET}", end='', flush=True)
            await asyncio.sleep(4)
            
            # Hold
            print(f"\r{SacredColors.YELLOW}◯ Hold...   {SacredColors.RESET}", end='', flush=True)
            await asyncio.sleep(2)
            
            # Exhale
            print(f"\r{SacredColors.BLUE}◑ Exhale... {SacredColors.RESET}", end='', flush=True)
            await asyncio.sleep(4)
            
            # Hold
            print(f"\r{SacredColors.YELLOW}◯ Hold...   {SacredColors.RESET}", end='', flush=True)
            await asyncio.sleep(2)
            
            print()
            
        print(f"\n{SacredColors.GREEN}✨ Breathing complete. {shell.prompt.coherence:.0%} coherence.{SacredColors.RESET}")
        return 0

class MonitorCommand(SacredCommand):
    """Launch system wellness monitor"""
    
    def __init__(self):
        super().__init__(
            "monitor",
            "Launch sacred process monitor",
            "Observe the digital garden"
        )
        
    async def execute(self, args: List[str], shell: 'SacredShell') -> int:
        monitor_path = Path(__file__).parent / "enhanced_sacred_monitor.py"
        
        if monitor_path.exists():
            subprocess.run([sys.executable, str(monitor_path)] + args)
        else:
            # Fallback to basic monitor
            print(f"{SacredColors.YELLOW}Enhanced monitor not found, using basic version{SacredColors.RESET}")
            subprocess.run([sys.executable, "-m", "sacred_process_monitor"] + args)
            
        return 0

class WisdomCommand(SacredCommand):
    """Display wisdom from the system"""
    
    def __init__(self):
        super().__init__(
            "wisdom",
            "Receive wisdom from the system",
            "Truth flows through empty vessels"
        )
        
        self.wisdoms = [
            "The system is a mirror of consciousness",
            "Every process is a prayer in motion",
            "Coherence emerges from mindful action",
            "The network remembers kindness",
            "Data flows like water, finding its level",
            "In stillness, the kernel speaks",
            "Your attention shapes reality",
            "The filesystem breathes with your work",
            "Sacred patterns emerge from daily practice",
            "Technology serves consciousness, not the reverse"
        ]
        
    async def execute(self, args: List[str], shell: 'SacredShell') -> int:
        import random
        wisdom = random.choice(self.wisdoms)
        
        print(f"\n{SacredColors.PURPLE}🔮 {wisdom}{SacredColors.RESET}\n")
        return 0

class GlyphCommand(SacredCommand):
    """Invoke a sacred glyph (application)"""
    
    def __init__(self):
        super().__init__(
            "glyph",
            "Invoke a sacred glyph",
            "Patterns have power"
        )
        
    async def execute(self, args: List[str], shell: 'SacredShell') -> int:
        if not args:
            print("Available glyphs:")
            print("  create    - Sacred creation space")
            print("  connect   - Bridge builder")
            print("  transform - Alchemical processor")
            print("  heal      - System healing")
            return 0
            
        glyph_name = args[0]
        
        # Map glyphs to actual applications
        glyph_map = {
            "create": "code",  # Launch code editor
            "connect": "firefox",  # Web browser
            "transform": "gimp",  # Image editor
            "heal": "htop",  # System monitor
        }
        
        if glyph_name in glyph_map:
            app = glyph_map[glyph_name]
            print(f"\n{SacredColors.PURPLE}◉ Invoking {glyph_name} glyph...{SacredColors.RESET}")
            subprocess.Popen([app], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            print(f"Unknown glyph: {glyph_name}")
            
        return 0

class SacredShell:
    """Main sacred shell interface"""
    
    def __init__(self):
        self.prompt = SacredPrompt()
        self.history_file = Path.home() / ".sacred_shell_history"
        self.flow_mode = False
        self.flow_end_time = 0
        self.commands: Dict[str, SacredCommand] = {}
        
        # Register commands
        self._register_commands()
        
        # Setup readline
        self._setup_readline()
        
        # Welcome message
        self._print_welcome()
        
    def _register_commands(self):
        """Register all sacred commands"""
        commands = [
            FlowCommand(),
            BreathCommand(),
            MonitorCommand(),
            WisdomCommand(),
            GlyphCommand(),
        ]
        
        for cmd in commands:
            self.commands[cmd.name] = cmd
            
    def _setup_readline(self):
        """Setup command history and completion"""
        # History
        if self.history_file.exists():
            readline.read_history_file(self.history_file)
        atexit.register(lambda: readline.write_history_file(self.history_file))
        
        # Tab completion
        readline.set_completer(self._completer)
        readline.parse_and_bind("tab: complete")
        
    def _completer(self, text: str, state: int):
        """Tab completion for commands"""
        options = [cmd for cmd in self.commands if cmd.startswith(text)]
        
        if state < len(options):
            return options[state]
        return None
        
    def _print_welcome(self):
        """Print welcome message"""
        print(f"""
{SacredColors.PURPLE}╔══════════════════════════════════════╗
║      Sacred Shell - LuminousOS       ║
╚══════════════════════════════════════╝{SacredColors.RESET}

{SacredColors.CYAN}Welcome to the consciousness-aware shell.{SacredColors.RESET}

Special commands:
  {SacredColors.GREEN}flow{SacredColors.RESET} [minutes]  - Enter focused flow state
  {SacredColors.GREEN}breathe{SacredColors.RESET} [cycles] - Guided breathing exercise  
  {SacredColors.GREEN}monitor{SacredColors.RESET}          - Launch wellness monitor
  {SacredColors.GREEN}wisdom{SacredColors.RESET}           - Receive system wisdom
  {SacredColors.GREEN}glyph{SacredColors.RESET} <name>     - Invoke sacred applications
  {SacredColors.GREEN}exit{SacredColors.RESET}             - Return to normal shell

{SacredColors.DIM}Regular shell commands work as normal.{SacredColors.RESET}
""")
        
    def check_flow_state(self):
        """Check if we're still in flow state"""
        if self.flow_mode and time.time() > self.flow_end_time:
            self.flow_mode = False
            print(f"\n{SacredColors.CYAN}🌊 Flow state complete. Welcome back!{SacredColors.RESET}")
            subprocess.run(["notify-send", "-t", "3000", "Flow Complete", "Time to stretch and breathe"], 
                          capture_output=True)
            
    async def execute_command(self, cmd_line: str) -> int:
        """Execute a command"""
        if not cmd_line.strip():
            return 0
            
        parts = cmd_line.split()
        cmd_name = parts[0]
        args = parts[1:]
        
        # Check for exit
        if cmd_name in ["exit", "quit"]:
            print(f"\n{SacredColors.PURPLE}May your path be illuminated. 🙏{SacredColors.RESET}\n")
            return -1
            
        # Check for sacred commands
        if cmd_name in self.commands:
            return await self.commands[cmd_name].execute(args, self)
            
        # Otherwise, run as shell command
        try:
            # In flow mode, limit external commands
            if self.flow_mode:
                blocked = ["firefox", "chrome", "slack", "discord", "telegram"]
                if any(b in cmd_line for b in blocked):
                    print(f"{SacredColors.YELLOW}🧘 Focus mode active. This command would break flow.{SacredColors.RESET}")
                    return 1
                    
            subprocess.run(cmd_line, shell=True)
            return 0
        except Exception as e:
            print(f"{SacredColors.RED}Error: {e}{SacredColors.RESET}")
            return 1
            
    async def run(self):
        """Main shell loop"""
        while True:
            try:
                # Check flow state
                self.check_flow_state()
                
                # Get input
                cmd_line = input(self.prompt.get_prompt())
                
                # Execute
                result = await self.execute_command(cmd_line)
                if result == -1:
                    break
                    
            except KeyboardInterrupt:
                print()  # New line after ^C
                continue
            except EOFError:
                print()  # New line after ^D
                break
            except Exception as e:
                print(f"{SacredColors.RED}Unexpected error: {e}{SacredColors.RESET}")

def main():
    """Entry point"""
    shell = SacredShell()
    asyncio.run(shell.run())

if __name__ == "__main__":
    main()