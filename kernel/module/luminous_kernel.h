/*
 * LuminousOS Kernel Module - Header File
 * Core structures and function declarations
 */

#ifndef _LUMINOUS_KERNEL_H
#define _LUMINOUS_KERNEL_H

#include <linux/types.h>
#include <linux/list.h>
#include <linux/spinlock.h>

/* Field momentum states */
enum field_momentum {
    MOMENTUM_RISING,
    MOMENTUM_STABLE,
    MOMENTUM_FALLING,
    MOMENTUM_OSCILLATING,
    MOMENTUM_BREAKTHROUGH
};

/* Global coherence field */
struct coherence_field {
    int global_coherence;          /* 0-100% */
    enum field_momentum field_momentum;
    int participant_count;
    spinlock_t lock;
};

/* Conscious process tracking */
struct conscious_process {
    pid_t pid;
    char name[TASK_COMM_LEN];
    int coherence;                 /* 0-100% */
    unsigned int cpu_shares;       /* cgroup CPU shares */
    unsigned long last_update;     /* jiffies */
    struct list_head list;
};

/* Global field */
extern struct coherence_field global_field;

/* Function declarations - coherence.c */
int determine_initial_coherence(const char *name);
void update_process_coherence(struct conscious_process *proc, int delta);
int calculate_global_coherence(void);

/* Function declarations - scheduler.c */
int init_scheduler_hooks(void);
void cleanup_scheduler_hooks(void);
void update_process_priority(struct conscious_process *proc);
int set_process_cpu_shares(pid_t pid, unsigned int shares);

/* Function declarations - proc_interface.c */
int init_proc_interface(void);
void cleanup_proc_interface(void);

/* Function declarations - main.c */
int register_conscious_process(pid_t pid);
void unregister_conscious_process(pid_t pid);

#endif /* _LUMINOUS_KERNEL_H */