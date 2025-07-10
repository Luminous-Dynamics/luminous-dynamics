# LuminousOS Kernel Module Makefile
# Building consciousness into the Linux kernel

obj-m += luminous_kernel.o
luminous_kernel-objs := main.o coherence.o scheduler.o proc_interface.o

# Feature flags
ccflags-y := -DDEBUG -g -std=gnu99 -Wno-declaration-after-statement

# Kernel source directory (adjust for your system)
KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(PWD) modules

clean:
	$(MAKE) -C $(KDIR) M=$(PWD) clean

install:
	$(MAKE) -C $(KDIR) M=$(PWD) modules_install
	depmod -a

load:
	sudo insmod luminous_kernel.ko

unload:
	sudo rmmod luminous_kernel

# Development helpers
reload: unload load

dmesg:
	sudo dmesg | grep -i luminous | tail -20

.PHONY: all clean install load unload reload dmesg