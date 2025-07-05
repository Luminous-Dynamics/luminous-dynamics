#!/bin/bash

# LuminousOS Biometric Device Test Runner
# Comprehensive testing suite for all supported biometric devices

echo "🌟 LUMINOUSOS BIOMETRIC DEVICE TEST SUITE"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running with proper permissions
if [[ $EUID -ne 0 ]] && [[ "$1" != "--no-sudo" ]]; then
   echo -e "${YELLOW}Warning: Some devices may require sudo for USB access${NC}"
   echo "Run with sudo or use --no-sudo flag to skip this check"
   echo ""
fi

# Function to check device prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    # Check for Bluetooth
    if command -v bluetoothctl &> /dev/null; then
        echo -e "  ✅ Bluetooth support detected"
        
        # Check if Bluetooth is enabled
        if bluetoothctl show | grep -q "Powered: yes"; then
            echo -e "  ✅ Bluetooth is enabled"
        else
            echo -e "  ${YELLOW}⚠️  Bluetooth is disabled - enable with: sudo bluetoothctl power on${NC}"
        fi
    else
        echo -e "  ${RED}❌ Bluetooth support not found${NC}"
    fi
    
    # Check for USB permissions
    if [ -r /dev/bus/usb ]; then
        echo -e "  ✅ USB access available"
    else
        echo -e "  ${YELLOW}⚠️  Limited USB access${NC}"
    fi
    
    # Check for required system libraries
    libs=("libudev" "libusb-1.0")
    for lib in "${libs[@]}"; do
        if ldconfig -p | grep -q "$lib"; then
            echo -e "  ✅ $lib found"
        else
            echo -e "  ${RED}❌ $lib missing - install with: sudo apt-get install ${lib}-dev${NC}"
        fi
    done
    
    echo ""
}

# Function to run a specific test
run_test() {
    local test_name=$1
    local test_file=$2
    
    echo -e "${GREEN}Running: $test_name${NC}"
    
    if cargo test --test "$test_file" --release -- --nocapture 2>&1 | tee "/tmp/${test_file}.log"; then
        echo -e "  ${GREEN}✅ $test_name passed${NC}"
        return 0
    else
        echo -e "  ${RED}❌ $test_name failed${NC}"
        return 1
    fi
}

# Main test execution
main() {
    check_prerequisites
    
    echo "🧪 Running biometric device tests..."
    echo ""
    
    # Track test results
    local passed=0
    local failed=0
    
    # Basic device integration tests
    echo "1️⃣ BASIC DEVICE TESTS"
    echo "─────────────────────"
    if run_test "HeartMath Connection Test" "biometric_device_tests::test_heartmath_device_connection"; then
        ((passed++))
    else
        ((failed++))
    fi
    
    if run_test "Polar H10 Integration Test" "biometric_device_tests::test_polar_h10_integration"; then
        ((passed++))
    else
        ((failed++))
    fi
    
    if run_test "Muse EEG Device Test" "biometric_device_tests::test_muse_eeg_device"; then
        ((passed++))
    else
        ((failed++))
    fi
    
    echo ""
    
    # Compatibility tests
    echo "2️⃣ COMPATIBILITY TESTS"
    echo "──────────────────────"
    if run_test "All Devices Compatibility" "device_compatibility_tests::test_all_supported_devices"; then
        ((passed++))
    else
        ((failed++))
    fi
    
    echo ""
    
    # Scenario tests
    echo "3️⃣ SCENARIO TESTS"
    echo "─────────────────"
    
    scenarios=("meditation_session" "stress_response" "group_coherence" "sleep_monitoring")
    for scenario in "${scenarios[@]}"; do
        if run_test "${scenario^} Scenario" "biometric_scenarios::test_${scenario}_scenario"; then
            ((passed++))
        else
            ((failed++))
        fi
    done
    
    echo ""
    
    # Advanced tests
    echo "4️⃣ ADVANCED TESTS"
    echo "─────────────────"
    if run_test "Multi-Device Synchronization" "biometric_device_tests::test_multi_device_synchronization"; then
        ((passed++))
    else
        ((failed++))
    fi
    
    if run_test "Consciousness Field Integration" "biometric_device_tests::test_consciousness_field_integration"; then
        ((passed++))
    else
        ((failed++))
    fi
    
    echo ""
    
    # Summary
    echo "📊 TEST SUMMARY"
    echo "═══════════════"
    echo -e "  Total tests: $((passed + failed))"
    echo -e "  ${GREEN}Passed: $passed${NC}"
    echo -e "  ${RED}Failed: $failed${NC}"
    
    if [ $failed -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    else
        echo -e "\n${YELLOW}⚠️  Some tests failed. Check logs in /tmp/ for details.${NC}"
    fi
    
    # Device-specific recommendations
    echo ""
    echo "💡 DEVICE SETUP TIPS"
    echo "═══════════════════"
    echo "• HeartMath: Ensure emWave Pro is connected via USB"
    echo "• Polar H10: Enable Bluetooth and ensure device is in pairing mode"
    echo "• Muse: Install Muse Direct and enable developer mode"
    echo "• Garmin: Update to latest firmware for HRV support"
    
    # Performance report
    if [ -f "/tmp/biometric_device_tests.log" ]; then
        echo ""
        echo "📈 PERFORMANCE METRICS"
        echo "═════════════════════"
        
        # Extract latency data
        avg_latency=$(grep -oP 'latency: \K\d+' /tmp/biometric_device_tests.log | awk '{sum+=$1; count++} END {if(count>0) print sum/count; else print "N/A"}')
        echo "  Average latency: ${avg_latency}ms"
        
        # Extract quality scores
        avg_quality=$(grep -oP 'quality: \K[\d.]+' /tmp/biometric_device_tests.log | awk '{sum+=$1; count++} END {if(count>0) print sum/count; else print "N/A"}')
        echo "  Average signal quality: ${avg_quality}"
    fi
}

# Run main function
main

# Exit with appropriate code
if [ $failed -eq 0 ]; then
    exit 0
else
    exit 1
fi