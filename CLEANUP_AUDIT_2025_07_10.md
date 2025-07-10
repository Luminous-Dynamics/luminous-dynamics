# Luminous-Dynamics Cleanup Audit Report
*Generated: 2025-07-10*

## Summary
This audit identifies temporary files, duplicate configurations, old migration artifacts, and helper scripts to determine what can be safely cleaned up.

## 1. Temporary Files & Scripts

### In `/srv/luminous-dynamics/`:
- **clone-all-repos.sh** - One-time setup script, can be removed after repos are cloned
- **quick-luminous-vm-setup.sh** - Setup script, likely not needed anymore
- **quick-migrate-to-shared.sh** - Migration script, can be removed if migration is complete
- **test-*.js files** - Various test files in root directory that should be in test directories
- **firebase-debug.log** - Debug log that can be removed
- **yarn-error.log** - Error log that can be removed
- ****.bak files** - Backup files that can be removed after review

### In `/home/tstoltz/`:
- **cleanup-claude-configs.sh** - Can be removed after running once
- **create-practical-tools.sh** - Setup script, can be removed if tools are created
- **find-files-guide.sh** - Helper script, can be removed if no longer needed
- **fix-*.sh scripts** - Various fix scripts that can be removed after fixes are applied:
  - fix-git-ownership.sh
  - fix-luminous-git.sh
  - fix-symlink.sh
  - do-symlink-fix.sh
- **test-sacred-services.sh** - Test script that can be moved to a test directory

## 2. Duplicate or Obsolete Configurations

### Archives with Old Versions:
- `/home/tstoltz/archives/projects-old/` contains old copies of:
  - luminous-dynamics/ (with sacred-core, the-weave, etc.)
  - relational-harmonics/codex/ (old version of codex-of-relational-harmonics)
  - Multiple .bak files and old configurations

### Migration Artifacts:
- `/home/tstoltz/migration-backup/` - Old migration backup, can be archived or removed
- `/home/tstoltz/usb-transfer/` - USB transfer files from migration
- `sacred-migration-final-20250707-2136.tar.gz` in multiple locations

### Duplicate Configurations:
- Multiple NixOS configuration files in `/home/tstoltz/nixos-configs/`
- Many are backups or variations that can be consolidated

## 3. Helper Scripts Analysis

### Essential Helper Scripts (KEEP):
- **ldev** - Active development tool for managing Luminous projects
- **lnix** - NixOS helper script
- **lum** - Luminous shortcut
- **nav** - Navigation helper
- **sacred-nav** - Sacred navigation helper
- **sacred-context** - Context helper
- **sacred-palette** - Color/theme helper

### Potentially Obsolete:
- **git-all** - Could be replaced with `ldev git`
- **ports** - Check if actively used
- **deps** - Check if actively used
- **luminous-claude** - May be redundant with simplified claude setup
- **nixos-apply** - Check if still needed with current NixOS setup

## 4. Conflicting Setups

### Path Conflicts:
- Projects exist in multiple locations:
  - `/srv/luminous-dynamics/` (current)
  - `/home/tstoltz/archives/projects-old/` (old copies)
  - Symlinks pointing to various locations

### Configuration Conflicts:
- Multiple shell.nix files in different directories
- Different package.json files with potentially conflicting dependencies

## 5. Recommendations

### Immediate Cleanup (Safe to Remove):
1. All .bak files after review
2. Log files (*.log)
3. One-time setup/migration scripts that have been run
4. Old archives in `/home/tstoltz/archives/projects-old/`
5. Migration artifacts after confirming data is safe

### Consolidation Needed:
1. NixOS configurations - keep only the working ones
2. Helper scripts - consolidate functionality into fewer, well-documented scripts
3. Test files - move to proper test directories

### Keep for Maintenance:
1. Active helper scripts (ldev, lnix, nav, etc.)
2. Current project files in `/srv/luminous-dynamics/`
3. Working NixOS configurations
4. Documentation files

### Archive (Don't Delete Yet):
1. Migration backup directory - compress and store safely
2. Old project versions - in case reference is needed
3. Configuration backups - until system is stable

## Next Steps

1. **Run cleanup script** to remove identified temporary files
2. **Consolidate configurations** into a single source of truth
3. **Document remaining helper scripts** with their purposes
4. **Create archive directory** for items that should be kept but not in active use
5. **Update paths and symlinks** to point to correct locations

## Safety Notes
- Always backup before deleting
- Test system after each cleanup phase
- Keep migration artifacts until confident everything works
- Document what was removed and when