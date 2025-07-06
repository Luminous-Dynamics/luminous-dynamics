/*
 * LuminousOS Kernel Module - /proc Interface
 * "Making consciousness visible to userspace"
 */

#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/uaccess.h>
#include "luminous_kernel.h"

static struct proc_dir_entry *luminous_dir;
static struct proc_dir_entry *coherence_file;
static struct proc_dir_entry *processes_file;
static struct proc_dir_entry *control_file;

/* Show global coherence field state */
static int coherence_show(struct seq_file *m, void *v)
{
    unsigned long flags;
    
    spin_lock_irqsave(&global_field.lock, flags);
    
    seq_printf(m, "🌟 LuminousOS Coherence Field Status\n");
    seq_printf(m, "=====================================\n");
    seq_printf(m, "Global Coherence: %d%%\n", global_field.global_coherence);
    seq_printf(m, "Field Momentum: ");
    
    switch (global_field.field_momentum) {
        case MOMENTUM_RISING:
            seq_printf(m, "📈 Rising\n");
            break;
        case MOMENTUM_STABLE:
            seq_printf(m, "➡️  Stable\n");
            break;
        case MOMENTUM_FALLING:
            seq_printf(m, "📉 Falling\n");
            break;
        case MOMENTUM_OSCILLATING:
            seq_printf(m, "〰️  Oscillating\n");
            break;
        case MOMENTUM_BREAKTHROUGH:
            seq_printf(m, "🌟 Breakthrough!\n");
            break;
    }
    
    seq_printf(m, "Active Participants: %d\n", global_field.participant_count);
    seq_printf(m, "\n");
    
    if (global_field.global_coherence > 90) {
        seq_printf(m, "✨ SACRED MOMENT - High collective coherence achieved!\n");
    } else if (global_field.global_coherence < 30) {
        seq_printf(m, "⚠️  Field requires attention - coherence is low\n");
    }
    
    spin_unlock_irqrestore(&global_field.lock, flags);
    
    return 0;
}

/* Show conscious processes */
static int processes_show(struct seq_file *m, void *v)
{
    struct conscious_process *proc;
    unsigned long flags;
    
    seq_printf(m, "📋 Conscious Process Registry\n");
    seq_printf(m, "=====================================\n");
    seq_printf(m, "%-10s %-20s %-12s %-10s\n", 
               "PID", "Name", "Coherence", "CPU Shares");
    seq_printf(m, "-------------------------------------\n");
    
    spin_lock_irqsave(&process_list_lock, flags);
    
    list_for_each_entry(proc, &conscious_processes, list) {
        seq_printf(m, "%-10d %-20s %3d%% %s    %-10u\n",
                   proc->pid, 
                   proc->name,
                   proc->coherence,
                   proc->coherence > 80 ? "🌟" : 
                   proc->coherence > 60 ? "✨" : 
                   proc->coherence > 40 ? "💫" : "  ",
                   proc->cpu_shares);
    }
    
    spin_unlock_irqrestore(&process_list_lock, flags);
    
    seq_printf(m, "\n");
    return 0;
}

/* Control interface for registering processes */
static ssize_t control_write(struct file *file, const char __user *buffer,
                            size_t count, loff_t *ppos)
{
    char cmd[256];
    char action[32];
    pid_t pid;
    int ret;
    
    if (count >= sizeof(cmd))
        return -EINVAL;
    
    if (copy_from_user(cmd, buffer, count))
        return -EFAULT;
    
    cmd[count] = '\0';
    
    /* Parse command: "register <pid>" or "unregister <pid>" */
    ret = sscanf(cmd, "%31s %d", action, &pid);
    if (ret != 2)
        return -EINVAL;
    
    if (strcmp(action, "register") == 0) {
        ret = register_conscious_process(pid);
        if (ret < 0)
            return ret;
    } else if (strcmp(action, "unregister") == 0) {
        unregister_conscious_process(pid);
    } else {
        return -EINVAL;
    }
    
    return count;
}

/* File operations */
static int coherence_open(struct inode *inode, struct file *file)
{
    return single_open(file, coherence_show, NULL);
}

static int processes_open(struct inode *inode, struct file *file)
{
    return single_open(file, processes_show, NULL);
}

static const struct proc_ops coherence_ops = {
    .proc_open = coherence_open,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release,
};

static const struct proc_ops processes_ops = {
    .proc_open = processes_open,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release,
};

static const struct proc_ops control_ops = {
    .proc_write = control_write,
    .proc_lseek = default_llseek,
};

/* Initialize /proc interface */
int init_proc_interface(void)
{
    /* Create /proc/luminous directory */
    luminous_dir = proc_mkdir("luminous", NULL);
    if (!luminous_dir) {
        printk(KERN_ERR "luminous: Failed to create /proc/luminous\n");
        return -ENOMEM;
    }
    
    /* Create /proc/luminous/coherence */
    coherence_file = proc_create("coherence", 0444, luminous_dir, &coherence_ops);
    if (!coherence_file) {
        printk(KERN_ERR "luminous: Failed to create coherence file\n");
        goto cleanup_dir;
    }
    
    /* Create /proc/luminous/processes */
    processes_file = proc_create("processes", 0444, luminous_dir, &processes_ops);
    if (!processes_file) {
        printk(KERN_ERR "luminous: Failed to create processes file\n");
        goto cleanup_coherence;
    }
    
    /* Create /proc/luminous/control */
    control_file = proc_create("control", 0200, luminous_dir, &control_ops);
    if (!control_file) {
        printk(KERN_ERR "luminous: Failed to create control file\n");
        goto cleanup_processes;
    }
    
    printk(KERN_INFO "luminous: /proc interface initialized\n");
    return 0;

cleanup_processes:
    proc_remove(processes_file);
cleanup_coherence:
    proc_remove(coherence_file);
cleanup_dir:
    proc_remove(luminous_dir);
    return -ENOMEM;
}

/* Clean up /proc interface */
void cleanup_proc_interface(void)
{
    proc_remove(control_file);
    proc_remove(processes_file);
    proc_remove(coherence_file);
    proc_remove(luminous_dir);
    
    printk(KERN_INFO "luminous: /proc interface cleaned up\n");
}