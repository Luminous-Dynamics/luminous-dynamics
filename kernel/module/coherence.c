/*
 * LuminousOS Kernel Module - Coherence Calculations
 * "From chaos, order. From order, consciousness."
 */

#include <linux/kernel.h>
#include <linux/string.h>
#include <linux/slab.h>
#include "luminous_kernel.h"

/* Determine initial coherence based on process name */
int determine_initial_coherence(const char *name)
{
    /* Consciousness-aware applications get higher initial coherence */
    if (strstr(name, "meditation") || strstr(name, "mindful"))
        return 80;
    else if (strstr(name, "journal") || strstr(name, "yoga"))
        return 75;
    else if (strstr(name, "code") || strstr(name, "vim") || strstr(name, "emacs"))
        return 60;
    else if (strstr(name, "music") || strstr(name, "art"))
        return 55;
    else if (strstr(name, "browser") || strstr(name, "chrome") || strstr(name, "firefox"))
        return 40;
    else
        return 50;  /* Default neutral coherence */
}

/* Update process coherence based on behavior */
void update_process_coherence(struct conscious_process *proc, int delta)
{
    int old_coherence = proc->coherence;
    
    proc->coherence += delta;
    
    /* Clamp to valid range */
    if (proc->coherence < 0)
        proc->coherence = 0;
    else if (proc->coherence > 100)
        proc->coherence = 100;
    
    /* Log significant changes */
    if (abs(old_coherence - proc->coherence) > 10) {
        printk(KERN_INFO "luminous: %s coherence: %d%% → %d%%\n",
               proc->name, old_coherence, proc->coherence);
    }
    
    proc->last_update = jiffies;
}

/* Calculate system-wide coherence metrics */
int calculate_global_coherence(void)
{
    struct conscious_process *proc;
    unsigned long flags;
    int total_coherence = 0;
    int weighted_coherence = 0;
    int count = 0;
    
    spin_lock_irqsave(&process_list_lock, flags);
    
    list_for_each_entry(proc, &conscious_processes, list) {
        /* Weight by CPU usage/importance */
        int weight = proc->cpu_shares / 1024;  /* Normalize to 1x */
        if (weight < 1) weight = 1;
        
        weighted_coherence += proc->coherence * weight;
        total_coherence += proc->coherence;
        count++;
    }
    
    spin_unlock_irqrestore(&process_list_lock, flags);
    
    if (count == 0)
        return 75;  /* Default baseline */
    
    /* Use weighted average for more accurate field reading */
    return weighted_coherence / count;
}

/* Detect field momentum based on coherence history */
enum field_momentum detect_field_momentum(void)
{
    static int coherence_history[10] = {75, 75, 75, 75, 75, 75, 75, 75, 75, 75};
    static int history_index = 0;
    int current_coherence;
    int recent_avg = 0, older_avg = 0;
    int i;
    
    /* Get current coherence */
    current_coherence = global_field.global_coherence;
    
    /* Update history */
    coherence_history[history_index] = current_coherence;
    history_index = (history_index + 1) % 10;
    
    /* Calculate recent average (last 3 readings) */
    for (i = 0; i < 3; i++) {
        int idx = (history_index - 1 - i + 10) % 10;
        recent_avg += coherence_history[idx];
    }
    recent_avg /= 3;
    
    /* Calculate older average (6-9 readings ago) */
    for (i = 6; i < 9; i++) {
        int idx = (history_index - 1 - i + 10) % 10;
        older_avg += coherence_history[idx];
    }
    older_avg /= 3;
    
    /* Determine momentum */
    int delta = recent_avg - older_avg;
    
    if (delta > 5)
        return MOMENTUM_RISING;
    else if (delta < -5)
        return MOMENTUM_FALLING;
    else if (abs(delta) < 2)
        return MOMENTUM_STABLE;
    else
        return MOMENTUM_OSCILLATING;
}

/* Check for sacred patterns in the field */
bool detect_sacred_pattern(void)
{
    struct conscious_process *proc;
    unsigned long flags;
    int high_coherence_count = 0;
    int total_count = 0;
    
    spin_lock_irqsave(&process_list_lock, flags);
    
    list_for_each_entry(proc, &conscious_processes, list) {
        if (proc->coherence > 80)
            high_coherence_count++;
        total_count++;
    }
    
    spin_unlock_irqrestore(&process_list_lock, flags);
    
    /* Sacred pattern: majority in high coherence */
    return (total_count > 0 && high_coherence_count > total_count / 2);
}