#!/usr/bin/env python3
"""
Test script to verify all monitoring tools are working correctly
"""

import subprocess
import time
import sys
import importlib.util

def check_import(module_name, package_name=None):
    """Check if a module can be imported"""
    if package_name is None:
        package_name = module_name
    
    spec = importlib.util.find_spec(module_name)
    if spec is None:
        print(f"❌ {module_name} not found. Install with: pip install {package_name}")
        return False
    print(f"✅ {module_name} is available")
    return True

def test_monitor(script_name, duration=5):
    """Test a monitor script for a short duration"""
    print(f"\n🧪 Testing {script_name}...")
    
    try:
        # Start the monitor
        proc = subprocess.Popen(
            [sys.executable, script_name],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        
        # Let it run for a bit
        time.sleep(duration)
        
        # Terminate gracefully
        proc.terminate()
        stdout, stderr = proc.communicate(timeout=2)
        
        # Check for errors
        if "error" in stderr.lower() or "exception" in stderr.lower():
            print(f"❌ {script_name} had errors:")
            print(stderr[:200])  # First 200 chars of error
            return False
        
        print(f"✅ {script_name} ran successfully")
        if stdout:
            print(f"   Output preview: {stdout[:100]}...")
        return True
        
    except Exception as e:
        print(f"❌ {script_name} failed: {e}")
        return False

def main():
    print("🌟 Luminous OS Monitor Test Suite")
    print("=================================")
    
    # Check dependencies
    print("\n📦 Checking dependencies...")
    deps_ok = True
    
    deps_ok &= check_import("psutil")
    deps_ok &= check_import("curses")
    deps_ok &= check_import("pygame")
    deps_ok &= check_import("networkx")
    deps_ok &= check_import("matplotlib")
    deps_ok &= check_import("numpy")
    
    if not deps_ok:
        print("\n⚠️  Some dependencies are missing. Install with:")
        print("pip install psutil pygame networkx matplotlib numpy")
        return
    
    # Test each monitor
    print("\n🔧 Testing monitors...")
    
    monitors = [
        ("consciousness-monitor.py", 3),
        ("field-visualizer.py", 2),  # Quick test for GUI
        ("quantum-entanglement-monitor.py", 3),
    ]
    
    results = []
    for monitor, duration in monitors:
        result = test_monitor(monitor, duration)
        results.append((monitor, result))
    
    # Summary
    print("\n📊 Test Summary:")
    print("=" * 40)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for monitor, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{monitor:35} {status}")
    
    print(f"\nTotal: {passed}/{total} monitors working")
    
    if passed == total:
        print("\n🎉 All monitors are working correctly!")
        print("Run ./monitor-launcher.sh to start monitoring")
    else:
        print("\n⚠️  Some monitors need attention")
        print("Check error messages above for details")

if __name__ == "__main__":
    main()