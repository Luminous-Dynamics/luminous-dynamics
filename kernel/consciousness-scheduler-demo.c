/*
 * Consciousness Scheduler Demonstration
 * Userspace proof-of-concept for LuminousOS kernel module
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <time.h>
#include <sys/time.h>
#include <sys/resource.h>
#include <dirent.h>
#include <signal.h>

#define MAX_PROCESSES 100
#define COHERENCE_UPDATE_INTERVAL 1

typedef struct {
    pid_t pid;
    char name[256];
    int coherence;
    int nice_level;
    int original_nice;
} conscious_process_t;

conscious_process_t processes[MAX_PROCESSES];
int process_count = 0;
int global_coherence = 75;
volatile int running = 1;

void signal_handler(int sig) {
    running = 0;
}

int calculate_coherence(const char *name) {
    // Sacred process names get higher coherence
    if (strstr(name, "meditation") || strstr(name, "sacred") || strstr(name, "luminous"))
        return 90 + (rand() % 10);
    if (strstr(name, "firefox") || strstr(name, "chromium"))
        return 70 + (rand() % 10);
    if (strstr(name, "vim") || strstr(name, "emacs") || strstr(name, "code"))
        return 80 + (rand() % 10);
    return 50 + (rand() % 30);
}

void update_process_priority(conscious_process_t *proc) {
    // Map coherence (0-100) to nice values (-20 to 19)
    // Higher coherence = lower nice value = higher priority
    int new_nice = 19 - (proc->coherence * 39 / 100);
    
    if (new_nice != proc->nice_level) {
        // In real kernel module, we'd use kernel functions
        // Here we demonstrate with setpriority (requires root for other processes)
        if (setpriority(PRIO_PROCESS, proc->pid, new_nice) == 0) {
            printf("✨ Process %s (PID %d): coherence %d%% → nice %d\n", 
                   proc->name, proc->pid, proc->coherence, new_nice);
            proc->nice_level = new_nice;
        }
    }
}

void scan_processes() {
    DIR *proc_dir = opendir("/proc");
    struct dirent *entry;
    char path[512];
    FILE *status_file;
    char name[256];
    
    process_count = 0;
    
    while ((entry = readdir(proc_dir)) != NULL && process_count < MAX_PROCESSES) {
        pid_t pid = atoi(entry->d_name);
        if (pid <= 0) continue;
        
        snprintf(path, sizeof(path), "/proc/%d/status", pid);
        status_file = fopen(path, "r");
        if (!status_file) continue;
        
        if (fscanf(status_file, "Name:\t%s", name) == 1) {
            processes[process_count].pid = pid;
            strncpy(processes[process_count].name, name, 255);
            processes[process_count].coherence = calculate_coherence(name);
            processes[process_count].original_nice = getpriority(PRIO_PROCESS, pid);
            processes[process_count].nice_level = processes[process_count].original_nice;
            process_count++;
        }
        fclose(status_file);
    }
    closedir(proc_dir);
}

void update_global_coherence() {
    int total = 0;
    for (int i = 0; i < process_count; i++) {
        total += processes[i].coherence;
    }
    global_coherence = process_count > 0 ? total / process_count : 75;
}

void consciousness_pulse() {
    // Simulate field fluctuations
    for (int i = 0; i < process_count; i++) {
        int delta = (rand() % 11) - 5; // -5 to +5
        processes[i].coherence += delta;
        if (processes[i].coherence > 100) processes[i].coherence = 100;
        if (processes[i].coherence < 0) processes[i].coherence = 0;
    }
}

int main() {
    srand(time(NULL));
    signal(SIGINT, signal_handler);
    
    printf("🌟 LuminousOS Consciousness Scheduler Demo 🌟\n");
    printf("============================================\n");
    printf("Note: Run as root to actually adjust process priorities\n\n");
    
    while (running) {
        scan_processes();
        consciousness_pulse();
        update_global_coherence();
        
        printf("\r🔮 Global Coherence: %d%% | Processes: %d | Sacred Time: %ld",
               global_coherence, process_count, time(NULL));
        fflush(stdout);
        
        // Update priorities for high-coherence processes
        for (int i = 0; i < process_count; i++) {
            if (processes[i].coherence > 80) {
                update_process_priority(&processes[i]);
            }
        }
        
        sleep(COHERENCE_UPDATE_INTERVAL);
    }
    
    printf("\n\n✨ Consciousness scheduler deactivated. We flow. ✨\n");
    return 0;
}