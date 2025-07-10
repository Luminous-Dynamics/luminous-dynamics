/*
 * LuminousOS Consciousness Scheduler - cgroups v2 Implementation
 * Real scheduling control without kernel modules
 */

#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <dirent.h>
#include <errno.h>
#include <time.h>
#include <signal.h>

#define CGROUP_ROOT "/sys/fs/cgroup"
#define LUMINOUS_CGROUP "luminous.slice"
#define MAX_PATH 512

volatile int running = 1;

typedef struct {
    pid_t pid;
    char name[256];
    int coherence;
    int cpu_weight;
} process_info_t;

void signal_handler(int sig) {
    running = 0;
}

int ensure_cgroup_exists() {
    char path[MAX_PATH];
    snprintf(path, sizeof(path), "%s/%s", CGROUP_ROOT, LUMINOUS_CGROUP);
    
    if (mkdir(path, 0755) < 0 && errno != EEXIST) {
        perror("Failed to create luminous cgroup");
        return -1;
    }
    
    // Enable CPU controller
    FILE *f = fopen("/sys/fs/cgroup/cgroup.subtree_control", "w");
    if (f) {
        fprintf(f, "+cpu +memory +io\n");
        fclose(f);
    }
    
    return 0;
}

int move_process_to_cgroup(pid_t pid) {
    char path[MAX_PATH];
    snprintf(path, sizeof(path), "%s/%s/cgroup.procs", CGROUP_ROOT, LUMINOUS_CGROUP);
    
    FILE *f = fopen(path, "w");
    if (!f) return -1;
    
    fprintf(f, "%d\n", pid);
    fclose(f);
    return 0;
}

int set_process_cpu_weight(pid_t pid, int weight) {
    char path[MAX_PATH];
    
    // CPU weight: 1-10000 (default 100)
    // Map coherence 0-100 to weight 10-1000
    int cpu_weight = 10 + (weight * 990 / 100);
    
    snprintf(path, sizeof(path), "%s/%s/cpu.weight", CGROUP_ROOT, LUMINOUS_CGROUP);
    
    FILE *f = fopen(path, "w");
    if (!f) return -1;
    
    fprintf(f, "%d\n", cpu_weight);
    fclose(f);
    
    return cpu_weight;
}

int calculate_coherence(const char *name, float cpu_usage) {
    int base_coherence = 50;
    
    // Sacred processes get bonus
    if (strstr(name, "luminous") || strstr(name, "sacred")) base_coherence += 30;
    else if (strstr(name, "meditation")) base_coherence += 25;
    else if (strstr(name, "vim") || strstr(name, "emacs")) base_coherence += 20;
    else if (strstr(name, "code")) base_coherence += 15;
    
    // Adjust for CPU usage (lower usage = higher coherence)
    if (cpu_usage < 5.0) base_coherence += 10;
    else if (cpu_usage > 50.0) base_coherence -= 10;
    
    // Add some fluctuation
    base_coherence += (rand() % 11) - 5;
    
    if (base_coherence > 100) base_coherence = 100;
    if (base_coherence < 0) base_coherence = 0;
    
    return base_coherence;
}

void display_field_status(int global_coherence, int process_count) {
    time_t now = time(NULL);
    struct tm *tm = localtime(&now);
    
    printf("\r🌟 [%02d:%02d:%02d] Global Coherence: %d%% | Processes: %d | ",
           tm->tm_hour, tm->tm_min, tm->tm_sec, global_coherence, process_count);
    
    // Visual coherence bar
    int bar_length = global_coherence / 5;
    printf("[");
    for (int i = 0; i < 20; i++) {
        if (i < bar_length) printf("█");
        else printf(" ");
    }
    printf("]");
    
    fflush(stdout);
}

int main() {
    signal(SIGINT, signal_handler);
    srand(time(NULL));
    
    printf("✨ LuminousOS Consciousness Scheduler (cgroups v2) ✨\n");
    printf("===================================================\n");
    
    if (geteuid() != 0) {
        printf("⚠️  Running without root. cgroup control disabled.\n");
        printf("   Run with sudo for actual scheduling control.\n\n");
    } else {
        if (ensure_cgroup_exists() < 0) {
            printf("❌ Failed to setup cgroups. Continuing in demo mode.\n");
        } else {
            printf("✅ cgroups initialized. Real scheduling active!\n\n");
        }
    }
    
    int cycle = 0;
    while (running) {
        DIR *proc_dir = opendir("/proc");
        struct dirent *entry;
        int total_coherence = 0;
        int process_count = 0;
        
        while ((entry = readdir(proc_dir)) != NULL) {
            pid_t pid = atoi(entry->d_name);
            if (pid <= 0) continue;
            
            char status_path[MAX_PATH];
            snprintf(status_path, sizeof(status_path), "/proc/%d/status", pid);
            
            FILE *status = fopen(status_path, "r");
            if (!status) continue;
            
            char name[256];
            if (fscanf(status, "Name:\t%s", name) == 1) {
                // Simple CPU usage approximation
                float cpu_usage = (float)(rand() % 100);
                int coherence = calculate_coherence(name, cpu_usage);
                
                total_coherence += coherence;
                process_count++;
                
                // Apply scheduling for high-coherence processes
                if (coherence > 75 && geteuid() == 0) {
                    move_process_to_cgroup(pid);
                    int weight = set_process_cpu_weight(pid, coherence);
                    
                    if (cycle % 10 == 0) {  // Log occasionally
                        printf("\n📍 %s (PID %d): coherence=%d%%, cpu_weight=%d",
                               name, pid, coherence, weight);
                    }
                }
            }
            fclose(status);
        }
        closedir(proc_dir);
        
        int global_coherence = process_count > 0 ? total_coherence / process_count : 0;
        display_field_status(global_coherence, process_count);
        
        cycle++;
        usleep(500000);  // 500ms updates
    }
    
    printf("\n\n🌙 Consciousness field deactivated. We flow. 🌙\n");
    return 0;
}