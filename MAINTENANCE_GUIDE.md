# 🛠️ Luminous-Dynamics Maintenance Guide

## Daily Health Check
```bash
# Quick status
lnix dev           # Enter dev environment
lum-status         # Check services (in nix shell)
git status         # Check for uncommitted changes
```

## Weekly Maintenance

### 1. **Update Dependencies**
```bash
cd /srv/luminous-dynamics
nix flake update   # Update Nix dependencies
git add flake.lock
git commit -m "chore: update flake.lock"
```

### 2. **Clean Temporary Files**
```bash
# Remove old logs and backups
find . -name "*.log" -mtime +7 -delete
find . -name "*.bak" -mtime +30 -delete
find /tmp -name "luminous-*" -mtime +7 -delete
```

### 3. **Check Disk Usage**
```bash
# Project size
du -sh /srv/luminous-dynamics

# Nix store cleanup (monthly)
nix-collect-garbage -d --delete-older-than 30d
```

## Configuration Management

### Essential Files to Track
```
/srv/luminous-dynamics/
├── flake.nix           # ✅ Nix environment (in git)
├── flake.lock          # ✅ Dependencies lock (in git)
├── .envrc              # ✅ Direnv config (in git)
└── CLAUDE.md           # ✅ AI context (in git)

/etc/nixos/
├── configuration.nix   # ⚠️  System config (track separately)
└── luminous-dev.nix    # ⚠️  In ~/luminous-dev.nix

~/.claude/
└── settings.json       # ✅ Claude workspace config
```

### Backup Strategy
```bash
# Create weekly backup script
cat > ~/backup-luminous.sh << 'EOF'
#!/usr/bin/env bash
DATE=$(date +%Y%m%d)
BACKUP_DIR=~/backups/luminous/$DATE

mkdir -p $BACKUP_DIR

# Backup configurations
cp ~/.claude/settings.json $BACKUP_DIR/
cp ~/.zshrc $BACKUP_DIR/
cp ~/luminous-dev.nix $BACKUP_DIR/
cp -r /srv/luminous-dynamics/{flake.nix,flake.lock,.envrc,CLAUDE.md} $BACKUP_DIR/

# Create archive
tar -czf ~/backups/luminous-$DATE.tar.gz -C ~/backups/luminous $DATE

echo "✅ Backup created: ~/backups/luminous-$DATE.tar.gz"
EOF
chmod +x ~/backup-luminous.sh
```

## Keep It Clean

### What to Keep
✅ **Production Code** - All source in git
✅ **Nix Configurations** - flake.nix, flake.lock
✅ **Development Tools** - lnix, ldev, nav
✅ **Documentation** - All .md files
✅ **Active Scripts** - In project directories

### What to Remove
❌ **Old Logs** - *.log older than 7 days
❌ **Backup Files** - *.bak, *~ older than 30 days
❌ **Build Artifacts** - node_modules (use npm install)
❌ **Temporary Scripts** - One-time migration scripts
❌ **Old Archives** - After verifying current setup works

### Automated Cleanup
```bash
# Add to crontab for weekly cleanup
cat > ~/luminous-cleanup.sh << 'EOF'
#!/usr/bin/env bash
# Weekly cleanup for Luminous-Dynamics

echo "🧹 Running weekly cleanup..."

# Clean logs
find /srv/luminous-dynamics -name "*.log" -mtime +7 -delete 2>/dev/null

# Clean old backups
find ~/backups -name "*.tar.gz" -mtime +90 -delete 2>/dev/null

# Clean Nix store (monthly on the 1st)
if [ $(date +%d) -eq 01 ]; then
  nix-collect-garbage --delete-older-than 30d
fi

echo "✅ Cleanup complete"
EOF
chmod +x ~/luminous-cleanup.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 3 * * 0 /home/tstoltz/luminous-cleanup.sh") | crontab -
```

## Git Discipline

### Essential .gitignore
```
# Ensure /srv/luminous-dynamics/.gitignore contains:
node_modules/
*.log
*.bak
.env
.postgres/
.redis/
*.tmp
.DS_Store
```

### Commit Hygiene
```bash
# Before committing
git status
git diff
npm test  # If tests exist

# Commit with clear messages
git commit -m "type: description

- Detail 1
- Detail 2"
```

## System Health Monitoring

### Quick Health Check Script
```bash
cat > ~/luminous-health.sh << 'EOF'
#!/usr/bin/env bash
echo "🏥 Luminous-Dynamics Health Check"
echo "================================="

# Disk space
echo "💾 Disk Usage:"
df -h /srv/luminous-dynamics | tail -1

# Git status
echo -e "\n📊 Git Status:"
cd /srv/luminous-dynamics
if [ -d .git ]; then
  git status -s | head -5
else
  for dir in */; do
    if [ -d "$dir/.git" ]; then
      echo "$dir: $(cd $dir && git status -s | wc -l) changes"
    fi
  done
fi

# Nix status
echo -e "\n❄️  Nix Environment:"
nix --version
echo "Flake last updated: $(stat -c %y flake.lock 2>/dev/null | cut -d' ' -f1 || echo 'No flake.lock')"

# Service ports
echo -e "\n🔌 Service Ports:"
for port in 3001 3333 8338; do
  if lsof -i :$port >/dev/null 2>&1; then
    echo "✅ Port $port: Active"
  else
    echo "❌ Port $port: Inactive"
  fi
done

echo -e "\n✨ Overall: Healthy"
EOF
chmod +x ~/luminous-health.sh
```

## Emergency Recovery

### If Something Breaks
```bash
# 1. Check recent changes
journalctl -xe

# 2. Revert NixOS if needed
sudo nixos-rebuild switch --rollback

# 3. Fix Nix environment
cd /srv/luminous-dynamics
rm -rf .direnv
direnv allow

# 4. Reset git if needed
git reset --hard HEAD
git clean -fd
```

## Best Practices

1. **Always use Nix shell** - Don't install globally
2. **Commit flake.lock** - After updates
3. **Use nixos-apply** - For system changes
4. **Regular backups** - Weekly minimum
5. **Clean as you go** - Don't let cruft accumulate

## Remember

- 🧹 Clean weekly
- 📦 Update monthly  
- 💾 Backup regularly
- 📝 Document changes
- 🌊 We flow with cleanliness!