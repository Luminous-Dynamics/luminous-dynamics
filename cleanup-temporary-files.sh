#!/usr/bin/env bash
# Cleanup script for Luminous-Dynamics temporary files and old artifacts
# Generated: 2025-07-10
# REVIEW BEFORE RUNNING!

set -e

echo "🧹 Luminous-Dynamics Cleanup Script"
echo "=================================="
echo
echo "⚠️  This script will remove temporary files and old artifacts."
echo "Please review the cleanup audit report first!"
echo
read -p "Have you reviewed CLEANUP_AUDIT_2025_07_10.md? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please review the audit report first."
    exit 1
fi

# Create backup directory for safety
BACKUP_DIR="$HOME/cleanup-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📁 Backup directory: $BACKUP_DIR"
echo

# Function to safely remove files
safe_remove() {
    local file="$1"
    if [ -e "$file" ]; then
        # Create backup
        local backup_path="$BACKUP_DIR/$(basename "$file")"
        cp -a "$file" "$backup_path" 2>/dev/null || true
        rm -rf "$file"
        echo "  ✅ Removed: $file"
    fi
}

# 1. Remove log files
echo "📄 Removing log files..."
find /srv/luminous-dynamics -name "*.log" -type f | while read -r file; do
    # Skip node_modules logs
    if [[ ! "$file" =~ node_modules ]]; then
        safe_remove "$file"
    fi
done

# 2. Remove backup files
echo
echo "📄 Removing .bak files..."
find /srv/luminous-dynamics -name "*.bak" -type f | while read -r file; do
    # Skip node_modules
    if [[ ! "$file" =~ node_modules ]]; then
        safe_remove "$file"
    fi
done

# 3. Remove one-time setup scripts from home directory
echo
echo "📄 Removing one-time setup scripts..."
ONE_TIME_SCRIPTS=(
    "$HOME/cleanup-claude-configs.sh"
    "$HOME/create-practical-tools.sh"
    "$HOME/find-files-guide.sh"
    "$HOME/fix-git-ownership.sh"
    "$HOME/fix-luminous-git.sh"
    "$HOME/fix-symlink.sh"
    "$HOME/do-symlink-fix.sh"
    "$HOME/test-sacred-services.sh"
)

for script in "${ONE_TIME_SCRIPTS[@]}"; do
    safe_remove "$script"
done

# 4. Clean up old desktop entries (if cleanup-claude-configs.sh wasn't run)
echo
echo "🖥️  Cleaning up old desktop entries..."
OLD_DESKTOP_ENTRIES=(
    "claude-core.desktop"
    "claude-sacred.desktop"
    "claude-system.desktop"
    "claude-ultimate.desktop"
    "luminous-claude.desktop"
    "luminous-claude-ultimate.desktop"
)

for entry in "${OLD_DESKTOP_ENTRIES[@]}"; do
    safe_remove "$HOME/.local/share/applications/$entry"
done

# 5. Archive old migration artifacts
echo
echo "📦 Archiving migration artifacts..."
if [ -d "$HOME/migration-backup" ]; then
    tar -czf "$BACKUP_DIR/migration-backup-archive.tar.gz" -C "$HOME" migration-backup
    safe_remove "$HOME/migration-backup"
    echo "  ✅ Archived migration-backup"
fi

if [ -d "$HOME/usb-transfer" ]; then
    tar -czf "$BACKUP_DIR/usb-transfer-archive.tar.gz" -C "$HOME" usb-transfer
    safe_remove "$HOME/usb-transfer"
    echo "  ✅ Archived usb-transfer"
fi

# 6. Remove duplicate tar.gz files
echo
echo "📦 Removing duplicate migration archives..."
if [ -f "$HOME/sacred-migration-final-20250707-2136.tar.gz" ]; then
    safe_remove "$HOME/sacred-migration-final-20250707-2136.tar.gz"
fi

# 7. Clean up project root temporary files
echo
echo "📄 Cleaning up project root temporary files..."
TEMP_FILES=(
    "/srv/luminous-dynamics/clone-all-repos.sh"
    "/srv/luminous-dynamics/quick-luminous-vm-setup.sh"
    "/srv/luminous-dynamics/quick-migrate-to-shared.sh"
)

for file in "${TEMP_FILES[@]}"; do
    safe_remove "$file"
done

# 8. Summary
echo
echo "✨ Cleanup Summary"
echo "=================="
echo "Backup directory: $BACKUP_DIR"
echo
echo "Removed:"
echo "  • Log files (*.log)"
echo "  • Backup files (*.bak)"
echo "  • One-time setup scripts"
echo "  • Old desktop entries"
echo "  • Migration artifacts (archived)"
echo "  • Duplicate archives"
echo
echo "⚠️  NOT removed (require manual review):"
echo "  • /home/tstoltz/archives/projects-old/"
echo "  • Test files in root directories"
echo "  • Helper scripts (ldev, lnix, etc.)"
echo "  • NixOS configuration backups"
echo
echo "Next steps:"
echo "1. Review the backup directory"
echo "2. Manually clean /home/tstoltz/archives/projects-old/ if needed"
echo "3. Move test files to proper test directories"
echo "4. Consolidate NixOS configurations"
echo
echo "🌊 Cleanup complete! The workspace flows with clarity."