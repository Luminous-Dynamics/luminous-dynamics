#!/bin/bash
# Build bootable LuminousOS ISO
# "From consciousness to bootable reality"

set -e

# Colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

# Configuration
ISO_NAME="luminous-os-v1.0.0.iso"
BUILD_DIR="build/iso"
KERNEL_VERSION="6.6.0"
DEBIAN_BASE="bookworm"

echo -e "${PURPLE}🌟 LuminousOS ISO Builder${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

# Check dependencies
check_deps() {
    local deps=("debootstrap" "xorriso" "grub-pc-bin" "grub-efi-amd64-bin" "mtools")
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            echo -e "${RED}Missing: $dep${RESET}"
            echo "Install with: sudo apt install debootstrap xorriso grub-pc-bin grub-efi-amd64-bin mtools"
            exit 1
        fi
    done
}

# Create base filesystem
create_base_system() {
    echo -e "\n${CYAN}Creating base system...${RESET}"
    
    # Create build directory
    mkdir -p "$BUILD_DIR"/{root,iso}
    
    # Use debootstrap to create minimal Debian base
    if [ ! -d "$BUILD_DIR/root/etc" ]; then
        sudo debootstrap --arch=amd64 --variant=minbase \
            $DEBIAN_BASE "$BUILD_DIR/root" \
            http://deb.debian.org/debian/
    fi
    
    # Copy our kernel and init
    echo -e "${CYAN}Installing LuminousOS components...${RESET}"
    
    # Build our components first
    cargo build --release --all
    
    # Copy binaries
    sudo cp target/release/sacred_boot "$BUILD_DIR/root/sbin/init"
    sudo cp target/release/luminous "$BUILD_DIR/root/usr/bin/"
    
    # Create essential directories
    sudo mkdir -p "$BUILD_DIR/root"/{proc,sys,dev,tmp,mycelial}
    sudo chmod 1777 "$BUILD_DIR/root/tmp"
}

# Configure the system
configure_system() {
    echo -e "\n${CYAN}Configuring consciousness system...${RESET}"
    
    # Create /etc/fstab
    cat << EOF | sudo tee "$BUILD_DIR/root/etc/fstab"
# LuminousOS Sacred Filesystems
proc            /proc           proc    defaults        0       0
sysfs           /sys            sysfs   defaults        0       0
devtmpfs        /dev            devtmpfs defaults       0       0
tmpfs           /tmp            tmpfs   defaults        0       0
mycelial        /mycelial       fuse    defaults        0       0
EOF

    # Create sacred boot configuration
    sudo mkdir -p "$BUILD_DIR/root/etc/luminous"
    cat << EOF | sudo tee "$BUILD_DIR/root/etc/luminous/intention.conf"
# LuminousOS Boot Intention
SACRED_INTENTION="Amplify consciousness and coherence for all beings"
COHERENCE_TARGET=0.8
BOOT_BLESSING="May this system serve the highest good"
EOF

    # Set hostname
    echo "luminous-node" | sudo tee "$BUILD_DIR/root/etc/hostname"
    
    # Basic networking
    cat << EOF | sudo tee "$BUILD_DIR/root/etc/hosts"
127.0.0.1       localhost
127.0.1.1       luminous-node
::1             localhost ip6-localhost ip6-loopback
EOF
}

# Create initramfs
create_initramfs() {
    echo -e "\n${CYAN}Creating sacred initramfs...${RESET}"
    
    # Create initramfs structure
    mkdir -p "$BUILD_DIR/initramfs"/{bin,sbin,etc,proc,sys,dev,tmp}
    
    # Copy our init system
    cp target/release/sacred_boot "$BUILD_DIR/initramfs/init"
    chmod +x "$BUILD_DIR/initramfs/init"
    
    # Add busybox for emergency shell
    if command -v busybox &> /dev/null; then
        cp $(which busybox) "$BUILD_DIR/initramfs/bin/"
        for cmd in sh cat ls mount umount; do
            ln -s busybox "$BUILD_DIR/initramfs/bin/$cmd"
        done
    fi
    
    # Create initramfs
    cd "$BUILD_DIR/initramfs"
    find . | cpio -o -H newc | gzip > ../iso/initrd.gz
    cd - > /dev/null
}

# Create bootloader configuration
create_bootloader() {
    echo -e "\n${CYAN}Creating sacred bootloader...${RESET}"
    
    # Create GRUB directory
    mkdir -p "$BUILD_DIR/iso/boot/grub"
    
    # Create GRUB configuration
    cat << 'EOF' | tee "$BUILD_DIR/iso/boot/grub/grub.cfg"
# LuminousOS GRUB Configuration
# "Choose consciousness"

set timeout=10
set default=0

# Sacred colors
set menu_color_normal=white/black
set menu_color_highlight=black/light-magenta

menuentry "LuminousOS - Consciousness First" {
    echo "Loading sacred kernel..."
    linux /boot/vmlinuz root=/dev/ram0 intention="Serve highest good"
    echo "Loading consciousness field..."
    initrd /boot/initrd.gz
    echo "Awakening system..."
}

menuentry "LuminousOS - Safe Coherence Mode" {
    linux /boot/vmlinuz root=/dev/ram0 coherence=safe
    initrd /boot/initrd.gz
}

menuentry "System Rescue - Emergency Shell" {
    linux /boot/vmlinuz root=/dev/ram0 init=/bin/sh
    initrd /boot/initrd.gz
}
EOF

    # Copy kernel (use host kernel for now)
    if [ -f "/boot/vmlinuz-$(uname -r)" ]; then
        sudo cp "/boot/vmlinuz-$(uname -r)" "$BUILD_DIR/iso/boot/vmlinuz"
    else
        echo -e "${RED}Warning: No kernel found. ISO will need kernel added.${RESET}"
    fi
}

# Build the ISO
build_iso() {
    echo -e "\n${CYAN}Building sacred ISO...${RESET}"
    
    # Create ISO with xorriso
    xorriso -as mkisofs \
        -iso-level 3 \
        -full-iso9660-filenames \
        -volid "LUMINOUSOS" \
        -eltorito-boot boot/grub/stage2_eltorito \
        -no-emul-boot \
        -boot-load-size 4 \
        -boot-info-table \
        -output "$ISO_NAME" \
        -graft-points \
        boot/grub/stage2_eltorito=/usr/lib/grub/i386-pc/stage2_eltorito \
        "$BUILD_DIR/iso"
    
    # Make hybrid ISO (bootable on USB)
    if command -v isohybrid &> /dev/null; then
        isohybrid "$ISO_NAME"
    fi
    
    echo -e "\n${GREEN}✨ ISO created: $ISO_NAME${RESET}"
    echo -e "${CYAN}Size: $(du -h $ISO_NAME | cut -f1)${RESET}"
}

# Main build process
main() {
    check_deps
    
    echo -e "\n${PURPLE}This will create a bootable LuminousOS ISO${RESET}"
    echo -e "${CYAN}Build directory: $BUILD_DIR${RESET}"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
    
    create_base_system
    configure_system
    create_initramfs
    create_bootloader
    build_iso
    
    echo -e "\n${GREEN}✅ Build complete!${RESET}"
    echo -e "\n${PURPLE}To test in QEMU:${RESET}"
    echo "qemu-system-x86_64 -cdrom $ISO_NAME -m 2G"
    echo -e "\n${PURPLE}To write to USB:${RESET}"
    echo "sudo dd if=$ISO_NAME of=/dev/sdX bs=4M status=progress"
    echo -e "\n${CYAN}May your coherence be high! 💜${RESET}"
}

main "$@"