#!/usr/bin/env python3
"""Test Sacred Shell features"""

import subprocess
import time

def test_sacred_shell():
    """Run a test session of Sacred Shell"""
    
    # Create test commands
    test_commands = [
        "pwd",
        "sacred status",
        "ls -la",
        "sacred breathe on",
        "echo 'Testing flow state'",
        "sacred flow",
        "sacred break",
        "sacred help",
    ]
    
    # Write commands to a file
    with open('test_commands.txt', 'w') as f:
        for cmd in test_commands:
            f.write(cmd + '\n')
    
    print("Running Sacred Shell with test commands...")
    print("=" * 50)
    
    # Run Sacred Shell with commands piped in
    with open('test_commands.txt', 'r') as f:
        result = subprocess.run(
            ['python3', 'sacred_shell.py'],
            stdin=f,
            capture_output=True,
            text=True
        )
    
    print(result.stdout)
    if result.stderr:
        print("Errors:", result.stderr)

if __name__ == "__main__":
    test_sacred_shell()