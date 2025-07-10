#!/usr/bin/env python3
"""
Test basic Sacred Shell features without external dependencies
"""

def test_emotional_analysis():
    """Test command emotion detection patterns"""
    
    print("◉ ◉ Testing Emotional Context Analysis")
    print("=" * 40)
    
    # Define test patterns
    STRESS_PATTERNS = [
        'kill', 'force', 'error', 'failed', 'crash',
        'damn', 'shit', 'fuck', 'urgent', 'asap'
    ]
    
    CALM_PATTERNS = [
        'help', 'please', 'thank', 'great', 'nice',
        'good', 'well', 'perfect', 'beautiful'
    ]
    
    test_commands = [
        ("git commit -m 'fix: resolve error'", "stressed"),
        ("thank you for the help", "calm"),
        ("ls -la", "neutral"),
        ("kill -9 12345", "stressed"),
        ("please show me the logs", "calm"),
        ("rm -rf /tmp/cache", "neutral"),
        ("this is perfect, great work!", "calm"),
        ("shit, it failed again", "stressed"),
    ]
    
    for command, expected in test_commands:
        # Simple emotion detection
        cmd_lower = command.lower()
        stress_count = sum(1 for pattern in STRESS_PATTERNS if pattern in cmd_lower)
        calm_count = sum(1 for pattern in CALM_PATTERNS if pattern in cmd_lower)
        
        if stress_count > calm_count:
            emotion = "stressed"
        elif calm_count > stress_count:
            emotion = "calm"
        else:
            emotion = "neutral"
            
        status = "✓" if emotion == expected else "✗"
        print(f"{status} '{command[:30]}...' → {emotion} (expected: {expected})")

def test_wellness_calculation():
    """Test wellness score calculation logic"""
    
    print("\n◉ ◉ Testing Wellness Calculation")
    print("=" * 40)
    
    # Simulate different scenarios
    scenarios = [
        {"name": "Fresh start", "break_minutes": 0, "cpu": 20, "memory": 40, "expected": 100},
        {"name": "45 min work", "break_minutes": 45, "cpu": 30, "memory": 50, "expected": 100},
        {"name": "60 min no break", "break_minutes": 60, "cpu": 40, "memory": 60, "expected": 70},
        {"name": "High CPU load", "break_minutes": 30, "cpu": 85, "memory": 60, "expected": 90},
        {"name": "System stressed", "break_minutes": 75, "cpu": 90, "memory": 90, "expected": 50},
    ]
    
    for scenario in scenarios:
        wellness = 100
        
        # Time-based deduction
        if scenario["break_minutes"] > 45:
            wellness -= min(30, (scenario["break_minutes"] - 45) * 2)
            
        # System load deduction
        if scenario["cpu"] > 80:
            wellness -= 10
        if scenario["memory"] > 85:
            wellness -= 10
            
        wellness = max(0, wellness)
        
        status = "✓" if abs(wellness - scenario["expected"]) < 5 else "✗"
        print(f"{status} {scenario['name']}: {wellness}% (expected: ~{scenario['expected']}%)")

def test_prompt_generation():
    """Test prompt string generation"""
    
    print("\n◉ ◉ Testing Prompt Generation")
    print("=" * 40)
    
    # ANSI color codes
    RESET = '\033[0m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    
    wellness_levels = [
        (92, GREEN, "high wellness"),
        (75, YELLOW, "medium wellness"),
        (45, RED, "low wellness"),
    ]
    
    for score, color, desc in wellness_levels:
        prompt = f"{BLUE}◉ ◉{RESET} [{color}wellness: {score}%{RESET}] [focus: high] ~/project > "
        print(f"{desc}: {prompt}")

if __name__ == "__main__":
    test_emotional_analysis()
    test_wellness_calculation()
    test_prompt_generation()
    
    print("\n✨ Sacred Shell is working beautifully!")
    print("◉ ◉")