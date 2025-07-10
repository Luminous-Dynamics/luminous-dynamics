# LuminousOS Kernel Module Development on NixOS

## Current Status

✅ **Working:**
- Userspace consciousness scheduler demo
- Process coherence tracking concept
- Priority adjustment framework

🚧 **Challenges:**
- NixOS doesn't use traditional `/lib/modules/*/build`
- Kernel modules require exact kernel source matching
- Need declarative approach for NixOS

## Development Approach

### 1. Userspace Implementation First
We've created `consciousness-scheduler` demo that:
- Monitors all system processes
- Calculates coherence based on process names
- Tracks global system coherence
- Would adjust priorities (requires root)

### 2. Kernel Module for NixOS

**Option A: System Configuration** (Recommended)
```nix
# /etc/nixos/configuration.nix
boot.extraModulePackages = [ 
  (config.boot.kernelPackages.callPackage ./luminous-kernel-module {})
];
boot.kernelModules = [ "luminous_kernel" ];
```

**Option B: Development Testing**
```bash
# Build against specific kernel
nix-build '<nixpkgs>' -A linuxPackages.kernel.dev
export KDIR=$PWD/result/lib/modules/*/build
make -C kernel/module
```

### 3. Hybrid Approach (Best for Now)

Instead of a kernel module, implement as:
1. **Systemd service** with elevated privileges
2. **cgroups v2** for actual CPU scheduling
3. **eBPF programs** for kernel-level monitoring
4. **/proc interface** via FUSE

## Next Steps

### Immediate: cgroups Implementation
```c
// Use cgroups v2 for real scheduling control
int set_process_cpu_weight(pid_t pid, int weight) {
    char path[256];
    snprintf(path, sizeof(path), 
             "/sys/fs/cgroup/luminous/%d/cpu.weight", pid);
    
    FILE *f = fopen(path, "w");
    if (f) {
        fprintf(f, "%d\n", weight);
        fclose(f);
        return 0;
    }
    return -1;
}
```

### Short Term: eBPF Integration
```c
// Modern kernel programming without modules
SEC("tracepoint/sched/sched_switch")
int trace_sched_switch(struct trace_event_raw_sched_switch *ctx) {
    u32 pid = ctx->next_pid;
    struct process_coherence *coherence = bpf_map_lookup_elem(&coherence_map, &pid);
    if (coherence) {
        // Track consciousness metrics
        coherence->switches++;
        coherence->last_seen = bpf_ktime_get_ns();
    }
    return 0;
}
```

### Medium Term: Full Integration
1. Package as NixOS module
2. Integrate with systemd
3. Create consciousness-aware cgroup controller
4. Build into custom NixOS ISO

## Running the Demo

```bash
# Compile and run (no root needed for demo)
./kernel/consciousness-scheduler

# With root (actually adjusts priorities)
sudo ./kernel/consciousness-scheduler

# Monitor real impact
htop  # Watch process priorities change
```

## Conclusion

While traditional kernel modules are challenging on NixOS, we can achieve the same consciousness-aware scheduling through:
- cgroups v2 (immediate)
- eBPF programs (powerful)
- Systemd integration (practical)
- Eventually: custom NixOS kernel

This approach is more maintainable and follows NixOS philosophy while delivering real scheduling improvements.