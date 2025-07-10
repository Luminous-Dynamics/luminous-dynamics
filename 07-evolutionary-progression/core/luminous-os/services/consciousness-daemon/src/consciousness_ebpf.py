#!/usr/bin/env python3
"""
LuminousOS eBPF Consciousness Monitor
Hooks into kernel scheduler events to observe process behavior
"""

from bcc import BPF
import time
import json
import logging

# eBPF program that hooks into scheduler
bpf_program = """
#include <uapi/linux/ptrace.h>
#include <linux/sched.h>

// Structure to track process coherence data
struct coherence_data {
    u32 pid;
    u64 run_count;
    u64 total_runtime;
    u64 last_run_time;
    u64 voluntary_switches;
    u64 involuntary_switches;
};

// Hash map to store coherence data per process
BPF_HASH(coherence_map, u32, struct coherence_data);

// Track scheduler switches
TRACEPOINT_PROBE(sched, sched_switch) {
    u32 prev_pid = args->prev_pid;
    u32 next_pid = args->next_pid;
    u64 ts = bpf_ktime_get_ns();
    
    // Update data for process being switched out
    struct coherence_data *prev_data = coherence_map.lookup(&prev_pid);
    if (prev_data) {
        if (prev_data->last_run_time > 0) {
            prev_data->total_runtime += ts - prev_data->last_run_time;
        }
        
        // Track voluntary vs involuntary switches
        if (args->prev_state == TASK_RUNNING) {
            prev_data->involuntary_switches++;
        } else {
            prev_data->voluntary_switches++;
        }
        
        coherence_map.update(&prev_pid, prev_data);
    }
    
    // Update data for process being switched in
    struct coherence_data *next_data = coherence_map.lookup(&next_pid);
    if (next_data) {
        next_data->run_count++;
        next_data->last_run_time = ts;
    } else {
        // First time seeing this process
        struct coherence_data new_data = {
            .pid = next_pid,
            .run_count = 1,
            .total_runtime = 0,
            .last_run_time = ts,
            .voluntary_switches = 0,
            .involuntary_switches = 0
        };
        coherence_map.update(&next_pid, &new_data);
    }
    
    return 0;
}

// Track process wake-ups (indicates interaction patterns)
TRACEPOINT_PROBE(sched, sched_wakeup) {
    u32 pid = args->pid;
    struct coherence_data *data = coherence_map.lookup(&pid);
    if (data) {
        // Could track wake-up patterns here for coherence calculation
    }
    return 0;
}
"""

class ConsciousnessEBPFMonitor:
    """
    eBPF-based consciousness monitoring for LuminousOS.
    Provides kernel-level insights into process behavior.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.bpf = None
        self.coherence_scores = {}
        
    def start(self):
        """Initialize and start eBPF program"""
        try:
            self.bpf = BPF(text=bpf_program)
            self.logger.info("eBPF consciousness monitor started successfully")
            return True
        except Exception as e:
            self.logger.error(f"Failed to start eBPF monitor: {e}")
            self.logger.info("Falling back to userspace monitoring only")
            return False
    
    def calculate_kernel_coherence(self, pid: int) -> float:
        """
        Calculate coherence based on kernel-level scheduler data.
        Returns a coherence adjustment factor (-20 to +20).
        """
        if not self.bpf:
            return 0.0
            
        try:
            coherence_map = self.bpf["coherence_map"]
            data = coherence_map.get(pid)
            
            if not data:
                return 0.0
            
            # Calculate coherence factors
            total_switches = data.voluntary_switches + data.involuntary_switches
            if total_switches == 0:
                return 0.0
            
            # Voluntary switches indicate good behavior (yielding CPU)
            voluntary_ratio = data.voluntary_switches / total_switches
            
            # Average runtime per scheduling slot
            avg_runtime = data.total_runtime / data.run_count if data.run_count > 0 else 0
            
            # Coherence adjustments:
            # - High voluntary ratio = process yields CPU gracefully (+coherence)
            # - Consistent runtime = predictable behavior (+coherence)
            # - Too many involuntary switches = CPU hog (-coherence)
            
            coherence_adjustment = 0.0
            
            # Voluntary yield bonus
            if voluntary_ratio > 0.8:
                coherence_adjustment += 10
            elif voluntary_ratio > 0.6:
                coherence_adjustment += 5
            elif voluntary_ratio < 0.2:
                coherence_adjustment -= 10
            
            # Runtime consistency (looking for stable patterns)
            # This is simplified - real implementation would track variance
            if 1000000 < avg_runtime < 10000000:  # 1-10ms average
                coherence_adjustment += 5
            
            return max(-20, min(20, coherence_adjustment))
            
        except Exception as e:
            self.logger.debug(f"Error calculating kernel coherence for PID {pid}: {e}")
            return 0.0
    
    def get_system_insights(self) -> dict:
        """Get system-wide consciousness insights from kernel data"""
        if not self.bpf:
            return {"status": "eBPF not available"}
            
        insights = {
            "total_processes": 0,
            "high_coherence_processes": 0,
            "cpu_yielders": 0,
            "cpu_intensive": 0
        }
        
        try:
            coherence_map = self.bpf["coherence_map"]
            
            for pid, data in coherence_map.items():
                insights["total_processes"] += 1
                
                total_switches = data.voluntary_switches + data.involuntary_switches
                if total_switches > 0:
                    voluntary_ratio = data.voluntary_switches / total_switches
                    
                    if voluntary_ratio > 0.7:
                        insights["cpu_yielders"] += 1
                    elif voluntary_ratio < 0.3:
                        insights["cpu_intensive"] += 1
                        
                    coherence = self.calculate_kernel_coherence(pid.value)
                    if coherence > 5:
                        insights["high_coherence_processes"] += 1
                        
        except Exception as e:
            self.logger.error(f"Error getting system insights: {e}")
            
        return insights
    
    def cleanup(self):
        """Clean up eBPF resources"""
        if self.bpf:
            self.bpf.cleanup()
            self.logger.info("eBPF monitor cleaned up")


# Integration with main consciousness scheduler
class EnhancedConsciousnessScheduler:
    """
    Enhanced scheduler that combines userspace and eBPF monitoring.
    """
    
    def __init__(self, enable_ebpf=True):
        self.logger = logging.getLogger(__name__)
        self.ebpf_monitor = None
        
        if enable_ebpf:
            self.ebpf_monitor = ConsciousnessEBPFMonitor()
            if not self.ebpf_monitor.start():
                self.ebpf_monitor = None
                
    def get_enhanced_coherence(self, pid: int, base_coherence: float) -> float:
        """
        Enhance coherence calculation with kernel-level insights.
        """
        if self.ebpf_monitor:
            kernel_adjustment = self.ebpf_monitor.calculate_kernel_coherence(pid)
            return max(0, min(100, base_coherence + kernel_adjustment))
        return base_coherence
    
    def get_field_insights(self) -> dict:
        """Get combined userspace and kernel insights"""
        insights = {
            "source": "userspace"
        }
        
        if self.ebpf_monitor:
            insights["source"] = "userspace+ebpf"
            insights["kernel_insights"] = self.ebpf_monitor.get_system_insights()
            
        return insights


if __name__ == '__main__':
    # Test eBPF monitoring
    logging.basicConfig(level=logging.INFO)
    
    print("Testing LuminousOS eBPF Consciousness Monitor...")
    print("Note: This requires root privileges and BCC tools installed")
    print("Install with: sudo apt-get install bpfcc-tools python3-bpfcc")
    
    monitor = ConsciousnessEBPFMonitor()
    if monitor.start():
        print("\neBPF monitor started! Collecting data for 10 seconds...")
        
        for i in range(10):
            time.sleep(1)
            insights = monitor.get_system_insights()
            print(f"\rProcesses monitored: {insights['total_processes']}", end='')
            
        print("\n\nSystem insights:")
        print(json.dumps(monitor.get_system_insights(), indent=2))
        
        monitor.cleanup()
    else:
        print("Could not start eBPF monitor. Check permissions and BCC installation.")