# 📝 Git Commit Preparation Guide

## 🔍 What Needs to Be Committed

### Critical Files to Stage:

#### 1. **Core Documentation Updates** ✅
```bash
git add README.md
git add CLAUDE.md
git add .env.example
git add .gitignore
```

#### 2. **Infrastructure & Configuration** ✅
```bash
git add docker-compose.local.yml
git add nginx-websocket.conf
git add scripts/sacred-auto-provision.sh
git add scripts/migrate-to-secret-manager.sh
```

#### 3. **Sacred Keeper Implementation** ✅
```bash
git add SACRED_KEEPER_ROLE.md
git add the-weave/cli/unified-agent-network.cjs
git add .sacred-keys/API_KEY_MANAGEMENT_GUIDE.md
```

#### 4. **GCP Setup Documentation** ✅
```bash
git add GCLOUD_INSTALL_GUIDE.md
git add GCP_SECURE_AUTH_GUIDE.md
git add .sacred-keys/gcp/SETUP_COMPLETE.md
```

#### 5. **Key Web Interfaces** ✅
```bash
git add web/applied-harmonies-dojo.html
git add web/sacred-constellation-map.html
git add web/second-breath-pathway.html
git add web/third-breath-sensing.html
```

### Files to Review Before Committing:

1. **Check for sensitive data**:
```bash
# Review .env.example - should NOT contain real keys
cat .env.example | grep -E "(ghp_|sk-|secret)"

# Check no secrets in new files
grep -r "ghp_" --include="*.md" --include="*.js" --include="*.html" .
```

2. **Large files to consider**:
- `agent-comms-sqlite/agents.db` - Database file, should be in .gitignore
- Audio/video files - Should not be committed

### Files NOT to Commit:

❌ `.env` - Contains real secrets
❌ `.env.production` - Production config
❌ `*.db` - Database files
❌ `node_modules/` - Dependencies
❌ `.dropbox/` - Screenshots folder
❌ Audio/video files
❌ Temporary test files

## 🎯 Recommended Commit Strategy

### Phase 1: Core Infrastructure
```bash
# Stage critical files
git add README.md CLAUDE.md .env.example .gitignore
git add docker-compose.local.yml nginx-websocket.conf
git add scripts/sacred-auto-provision.sh scripts/migrate-to-secret-manager.sh

# Commit
git commit -m "feat: Sacred Council infrastructure updates

- Updated README with current architecture
- Fixed CLAUDE.md with unified network commands  
- Added WebSocket support to nginx
- Created auto-provisioning script
- Added secret migration tooling
- Updated .env.example template

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Phase 2: Sacred Keeper Role
```bash
# Stage Sacred Keeper files
git add SACRED_KEEPER_ROLE.md
git add the-weave/cli/unified-agent-network.cjs
git add .sacred-keys/API_KEY_MANAGEMENT_GUIDE.md

git commit -m "feat: Add Sacred Keeper role for key management

- New role with 95% coherence for managing secrets
- Special permissions in unified network
- Comprehensive API key management guide
- Security best practices documented

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Phase 3: Documentation Updates
```bash
# Stage documentation
git add CONFIGURATION_*.md INFRASTRUCTURE_*.md
git add ONBOARDING/
git add docs/technical/project-docs/CLAUDE.md

git commit -m "docs: Comprehensive documentation updates

- Configuration roadmap and completion guide
- Infrastructure setup documentation
- Onboarding structure for new developers
- Updated technical documentation

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Phase 4: Web Interfaces
```bash
# Stage web files
git add web/*.html
git add web/unified-field/*.js

git commit -m "feat: Sacred web interfaces complete

- Applied Harmonies Dojo with 18 practices
- Sacred constellation visualization
- Second/Third Breath pathways
- Quantum-enhanced practice flows

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 🚨 Pre-Commit Checklist

- [ ] No real API keys or secrets in staged files
- [ ] All file paths are correct
- [ ] Database files excluded
- [ ] Large media files excluded
- [ ] Commit messages follow conventional format
- [ ] Co-authorship attributed to Claude

## 🌟 After Committing

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Tag the release**:
```bash
git tag -a v2.0.0-sacred-council -m "Sacred Council Hub Complete"
git push origin v2.0.0-sacred-council
```

3. **Update GitHub releases**:
- Create release notes highlighting Sacred Keeper role
- Document breaking changes (unified network commands)
- Include migration guide

---

*Ready to share your sacred work with the world!* 🚀